<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="user" label-position="right" label-width="80px"
             style="width: 400px; margin-left:50px;">
      <el-form-item prop="name" label="姓名" required>
        <el-input v-model="user.name"/>
      </el-form-item>
      <el-form-item prop="identity" label="身份证号" required>
        <el-input v-model="user.identity"/>
      </el-form-item>
      <el-form-item prop="workId" label="工号" required>
        <el-input v-model="user.workId"/>
      </el-form-item>
      <el-form-item label="科室" required>
        <el-select v-model="user.departmentId" placeholder="请选择" filterable remote>
          <el-option v-for="(item, index) in departments" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="title" label="职称">
        <el-input v-model="user.title"/>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="user.email"/>
      </el-form-item>
      <el-form-item prop="phone" label="电话">
        <el-input v-model="user.phone"/>
      </el-form-item>
      <el-form-item label="角色" required>
        <el-select v-model="user.roleId" placeholder="请选择" remote>
          <el-option v-for="(item, index) in roles" :key="index" :label="item.localeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>

      <span style="margin-left: 100px;">
        <el-button native-type="reset">取 消</el-button>
        <el-button type="primary" @click="handleSave">保 存</el-button>
      </span>
    </el-form>
  </div>
</template>

<script>
  import {loadDeparts, loadRoles} from "@/utils/cachedata";
  import {addUser} from "@/api/user";

  export default {
    name: "add",
    data() {
      return {
        user: {
          name: '',
          identity: '',
          workId: '',
          departmentId: '',
          title: '',
          email: '',
          phone: '',
          roleId: '',
        },
        roles: loadRoles(),
        departments: loadDeparts()
      }
    },
    methods: {
      handleSave: function () {
        addUser(this.user).then(response=>{
          this.$message.info("添加成功")
          this.user = {}
          this.$router.push("/user/list")
        }).catch(error=>{
          this.$message.error("添加失败")
        })
      }
    }
  }
</script>
