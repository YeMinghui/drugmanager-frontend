<template>
  <div class="app-container">
    <el-form ref="dataForm" :model="user" label-position="right" label-width="80px"
             style="width: 400px; margin-left:50px;">
      <el-form-item prop="name" label="姓名">
        <el-input v-model="user.name" disabled/>
      </el-form-item>
      <el-form-item prop="identity" label="身份证号">
        <el-input v-model="user.identity" disabled/>
      </el-form-item>
      <el-form-item prop="workId" label="工号">
        <el-input v-model="user.workId" disabled/>
      </el-form-item>
      <el-form-item label="科室">
        <el-select v-model="user.departmentId" placeholder="请选择" filterable remote disabled>
          <el-option v-for="(item, index) in departments" :key="index" :label="item.name" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="title" label="职称">
        <el-input v-model="user.title" disabled/>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="user.email"/>
      </el-form-item>
      <el-form-item prop="phone" label="电话">
        <el-input v-model="user.phone"/>
      </el-form-item>
      <el-form-item label="角色">
        <el-select v-model="user.roleId" placeholder="请选择" remote disabled>
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
  import {putUser} from "@/api/user";

  export default {
    name: "info",
    data() {
      return {
        user: this.$store.getters.user,
        roles: loadRoles(),
        departments: loadDeparts()
      }
    },
    methods: {
      handleSave: function () {
        putUser(this.user).then(response=>{
          if (response.data) {
            this.$message.info("修改成功")
          }
        }).catch(error=>this.$message.error(error))
      }
    }
  }
</script>

<style scoped>

</style>
