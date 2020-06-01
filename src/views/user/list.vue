<template>
  <div class="app-container">
    <el-row class="filter-container" :gutter="5">
      <el-col :sm="5">
        <el-input v-model="filter" placeholder="本页查找" @keyup.native="handleFilter" prefix-icon="el-icon-search"/>
      </el-col>
      <el-col :sm="10">
        <el-input placeholder="系统中搜索" v-model="serverSearch" class="input-with-select" @keyup.native="serverSearchHold=false">
          <el-select v-model="serverSearchType" slot="prepend" placeholder="请选择" style="width: 100px;" @change="serverSearch=''">
            <el-option v-for="sst in serverSearchTypes" :key="sst.name" :label="sst.name" :value="sst.value"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="doServerSearch"></el-button>
        </el-input>
      </el-col>
      <el-col :sm="5">
        <el-button @click="refresh" type="info">刷新</el-button>
        <el-button @click="$router.push('/user/add')" type="primary">添加</el-button>
        <el-button @click="deleteSelect" type="danger">删除</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" border style="width: 100%;" @selection-change="handleSelectionChange" v-loading="table_loading">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="workId" label="工号" sortable>
      </el-table-column>
      <el-table-column prop="name" label="姓名">
      </el-table-column>
      <el-table-column prop="identity" label="身份证号" sortable>
      </el-table-column>
      <el-table-column label="科室" prop="departmentName" sortable>
      </el-table-column>
      <el-table-column prop="title" label="职称">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="phone" label="电话">
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="showDialog(row, 'edit')">
            修改
          </el-button>
          <el-button size="mini" type="danger" @click="showDialog(row, 'delete')">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="currentPage"
      :page-sizes="pageSizes"
      :page-size="pageSize"
      :page-count="pages"
      :hide-on-single-page="true"
      layout="sizes, prev, pager, next"
      :total="total"
    >
    </el-pagination>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="min-width: 500px;">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="80px" style="width: 400px; margin-left:50px;">
        <el-form-item prop="name" label="姓名" required>
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item prop="identity" label="身份证号" required>
          <el-input v-model="temp.identity"/>
        </el-form-item>
        <el-form-item prop="workId" label="工号" required>
          <el-input v-model="temp.workId"/>
        </el-form-item>
        <el-form-item label="科室" required>
          <el-select v-model="temp.departmentId" placeholder="请选择" filterable remote>
            <el-option v-for="(item, index) in departments" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="title" label="职称">
          <el-input v-model="temp.title"/>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="temp.email"/>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="角色" required>
          <el-select v-model="temp.roleId" placeholder="请选择" remote>
            <el-option v-for="(item, index) in roles" :key="index" :label="item.localeName" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="temp.status" placeholder="请选择" remote>
            <el-option v-for="(item, index) in status" :key="index" :label="item.name" :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleEdit" v-if="'edit'===dialogStatus">保 存</el-button>
        <el-button type="danger" @click="handleDelete" v-if="'delete'===dialogStatus">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import {deleteUser, deleteUsers, listUsers, putUser, search} from "@/api/user";
  import {loadDeparts, loadRoles} from "@/utils/cachedata";

  export default {
    name: 'list',
    data() {
      return {
        users: [],
        temp: {},
        departments: [],
        roles: [],
        status: [
          {id: 1, name: '启用'},
          {id: 2, name: '锁定'},
          {id: 4, name: '禁用'}
        ],
        textMap: {
          edit: '修改',
          delete: '删除'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pages: 0,
        pageSizes: [10, 20, 40, 80],
        multipleSelection: [],
        tableData: null,
        filter: null,
        serverSearch: '',
        serverSearchType: "name",
        serverSearchTypes: [
          {name:"姓名",value:"name"},
          {name:"工号",value:"workId"},
          {name:"电话",value:"phone"},
          {name:"身份证",value:"identity"},
          {name:"科室",value:"department"},
          {name:"职称",value:"title"}
        ],
        // don't commit more than one time, when content not change.
        serverSearchHold: false,
        table_loading: false
      }
    },
    created() {
      this.loadRoles()
      this.loadDepart()
      this.loadUser()
    },
    methods: {
      refresh: function() {
        this.table_loading = true
        this.loadRoles()
        this.loadDepart()
        this.loadUser()
        // loading 效果
        setTimeout(()=>this.table_loading = false, 300)
      },
      deleteSelect: function() {
        if (this.multipleSelection.length === 0) {
          this.$message.warning("没有选中要删除的数据。")
        }else {
          const ids = []
          const data = this.multipleSelection
          for (let i = 0; i < data.length; i++) {
            ids.push(data[i].id)
          }
          deleteUsers(JSON.stringify(ids)).then(()=>{
            this.multipleSelection=[]
            this.$message.info("删除成功")
            this.loadUser()
          })
        }
      },
      hookDepartmentName: function (users) {
        // add departname to table data.
        for (let i = 0; i < users.length; i++) {
          let user = users[i]
          user['departmentName'] = this.depart(user.departmentId)
        }
      },
      loadUser: function() {
        listUsers({page: this.currentPage, limit: this.pageSize}).then(response => {
          const {page, pages, data, pageSize, total} = response.data
          this.users = data
          this.currentPage = page
          this.pageSize = pageSize
          this.total = total
          this.pages = pages
          this.hookDepartmentName(this.users)
          this.tableData = this.users
        })
      },
      loadDepart: function() {
        this.departments = loadDeparts()
      },
      loadRoles: function() {
        this.roles = loadRoles()
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
          delete this.temp.departmentName
          putUser(this.temp).then(response=>{
            if (response.data) {
              this.$message.info("修改成功")
              this.loadUser()
            }
          }).catch(error=>this.$message.error(error))
        } else {
          this.$message.error("没有数据可以保存")
        }
        this.hideDialog()
      },
      handleDelete: function () {
        if (this.temp) {
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteUser({id: this.temp.id}).then(response=>{
              if (response.data) {
                this.$message.success("删除成功!");
                this.loadUser();
              } else {
                this.$message.error("删除失败")
              }
            }).catch(error=>this.$message.error(error))
          }).catch(() => this.$message.info("已取消删除"))
        } else {
          this.$message.error("没有数据可以删除")
        }
        this.hideDialog()
      },
      depart: function (departId) {
        if (this.departments) {
          let departs = this.departments
          for (let i = 0; i < departs.length; i++) {
            if (departs[i].id === departId) {
              return departs[i].name
            }
          }
          // new depart added
          sessionStorage.removeItem('departs')
          return '未知科室，请刷新'
        }
      },
      handleSizeChange: function (size) {
        // 后面没有数据不加载，否则后页数据往当前页
        const ptr = this.currentPage*this.pageSize
        if (this.total - ptr > 0) {
          this.pageSize = size
          this.currentPage = Math.floor(ptr/size) + (ptr%size===0?0:1)
          this.loadUser()
        }
      },
      handleCurrentChange: function (page) {
        this.currentPage = page
        this.loadUser()
      },
      handleSelectionChange: function (val) {
        this.multipleSelection = val
      },
      handleFilter: function () {
        const filter = this.filter
        if (filter) {
          this.tableData = this.users.filter(function (dataNews) {
            return Object.keys(dataNews).some(function (key) {
              return String(dataNews[key]).toLowerCase().indexOf(filter) > -1
            })
          })
        } else {
          this.tableData = this.users
        }
      },
      doServerSearch: function () {
        if (this.serverSearchType){
          const type = this.serverSearchType
          const value = this.serverSearch
          if (!this.serverSearchHold) {
            this.serverSearchHold = true
            search({type: type, value: value}).then(response=>{
              const users = response.data
              this.hookDepartmentName(users)
              this.users = users
              this.tableData = users
            }).catch(error=>this.$message.error(error));
          }
        }
      }
    }
  }
</script>
