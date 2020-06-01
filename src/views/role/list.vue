<template>
  <div class="app-container">
    <el-row class="filter-container" :gutter="5">
      <el-col :sm="5">
        <el-input v-model="filter" placeholder="本页查找" @keyup.native="handleFilter" prefix-icon="el-icon-search"/>
      </el-col>
    </el-row>

    <el-table :data="tableData" border style="width: 100%;" v-loading="table_loading">
      <el-table-column prop="id" label="ID" sortable>
      </el-table-column>
      <el-table-column prop="name" label="角色名" sortable>
      </el-table-column>
      <el-table-column prop="localeName" label="中文名" sortable>
      </el-table-column>
      <el-table-column label="权限" prop="perms" sortable>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="warning" size="mini" @click="showDialog(row, 'edit')">
            修改
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="min-width: 500px;">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="80px"
               style="width: 400px; margin-left:50px;">
        <el-form-item prop="name" label="角色名" required>
          <el-input v-model="temp.name" disabled/>
        </el-form-item>
        <el-form-item prop="localeName" label="中文名" required>
          <el-input v-model="temp.localeName"/>
        </el-form-item>
        <el-form-item prop="perms" label="权限" required>
          <el-input v-model="temp.perms"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="warning" @click="handleEdit" v-if="'edit'===dialogStatus">保 存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {clearRoles, loadRoles} from "@/utils/cachedata";
  import {putRole} from "@/api/user";

  export default {
    name: "list",
    created() {
      this.loadRole()
    },
    data() {
      return {
        tableData: null,
        table_loading: false,
        temp: {},
        roles: [],
        textMap: {
          edit: '修改',
          delete: '删除'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        filter: null,
      }
    },
    methods: {
      reloadRoles: function() {
        clearRoles()
        this.loadRole()
      },
      loadRole: function () {
        new Promise(resolve => {
          resolve(loadRoles())
        }).then(data=>{
          this.roles = data
          this.tableData = this.roles
        })
      },
      handleSizeChange: function (size) {
        // 后面没有数据不加载，否则后页数据往当前页
        const ptr = this.currentPage * this.pageSize
        if (this.total - ptr > 0) {
          this.pageSize = size
          this.currentPage = Math.floor(ptr / size) + (ptr % size === 0 ? 0 : 1)
          this.loadRole()
        }
      },
      handleCurrentChange: function (page) {
        this.currentPage = page
        this.loadRole()
      },
      hideDialog: function() {
        this.dialogFormVisible = false
      },
      showDialog: function (row, opr) {
        // 复制user, 深拷贝
        this.temp = JSON.parse(JSON.stringify(row))
        this.dialogStatus = opr
        this.dialogFormVisible = true
      },
      handleEdit: function () {
        if (this.temp) {
          putRole(this.temp).then(response => {
            if (response.data) {
              this.$message.info("修改成功")
              this.reloadRoles()
            }
          }).catch(error => this.$message.error(error))
        } else {
          this.$message.error("没有数据可以保存")
        }
        this.hideDialog()
      },
      handleFilter: function () {
        const filter = this.filter
        if (filter) {
          this.tableData = this.roles.filter(function (dataNews) {
            return Object.keys(dataNews).some(function (key) {
              return String(dataNews[key]).toLowerCase().indexOf(filter) > -1
            })
          })
        } else {
          this.tableData = this.roles
        }
      },
    }
  }
</script>
