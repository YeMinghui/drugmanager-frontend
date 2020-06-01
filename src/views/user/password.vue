<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="dataForm" label-position="right" label-width="80px"
             style="width: 400px; margin-left:50px;" :rules="dataFormRules">
      <el-form-item prop="oldpwd" label="原密码" required>
        <el-input type="password" v-model="dataForm.oldpwd"/>
      </el-form-item>
      <el-form-item prop="newpwd" label="新密码">
        <el-input type="password" v-model="dataForm.newpwd" auto-complete="off"/>
      </el-form-item>
      <el-form-item prop="renewpwd" label="再次确认">
        <el-input type="password" v-model="dataForm.renewpwd" auto-complete="off"/>
      </el-form-item>
      <span style="margin-left: 100px;">
        <el-button native-type="reset">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </span>
    </el-form>
  </div>
</template>

<script>
  import {changePwd} from "@/api/user";

  export default {
    name: "password",
    data() {
      var func1 = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请输入新密码'));
        } else if (value.toString().length < 6 || value.toString().length > 18) {
          callback(new Error('密码长度为6 - 18个字符'))
        } else {
          callback();
        }
      };
      var func2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次输入密码'));
        } else if (value !== this.dataForm.newpwd) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };
      return {
        dataForm: {
          oldpwd: '',
          newpwd: '',
          renewpwd: '',
        },
        dataFormRules: {
          newpwd: [{required: true, validator: func1, trigger: 'blur'}],
          renewpwd: [{required: true, validator: func2, trigger: 'blur'}],
        },
      }
    },
    methods: {
      handleSave: function () {
        if (this.oldpwd !== '' && this.newpwd !== '' && this.newpwd === this.renewpwd) {
          changePwd(JSON.stringify(this.dataForm))
        }else {
          this.$message.warning("数据输入有误")
        }
      }
    }
  }
</script>
