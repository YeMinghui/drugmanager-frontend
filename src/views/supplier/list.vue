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
        <el-button @click="showDialog({}, 'add')" type="primary">添加</el-button>
        <el-button @click="deleteSelect" type="danger">删除</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" border style="width: 100%;" @selection-change="handleSelectionChange" v-loading="table_loading">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="ID"></el-table-column>
      <el-table-column prop="name" label="名称">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column prop="phone" label="联系电话">
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
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="80px" style="width: 400px; margin-left:50px;" :rules="rules">
        <el-form-item prop="name" label="名称">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input v-model="temp.address"/>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="temp.phone"/>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible=false">取 消</el-button>
        <el-button type="primary" @click="handleAdd" v-if="'add'===dialogStatus">保 存</el-button>
        <el-button type="primary" @click="handleEdit" v-if="'edit'===dialogStatus">保 存</el-button>
        <el-button type="danger" @click="handleDelete" v-if="'delete'===dialogStatus">删 除</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

  import {
    deleteSupplier,
    deleteSuppliers,
    listSuppliers,
    putSupplier,
    saveSupplier,
    search
  } from "@/api/supplier";

  export default {
    name: 'list',
    data() {
      var rule_name = (rule, value, callback) => {
      }
      var rule_address = (rule, value, callback) => {
      }
      var rule_phone = (rule, value, callback) => {
      }
      return {
        temp: {},
        Suppliers: [],
        textMap: {
          edit: '修改',
          delete: '删除',
          add: '添加'
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
          {name:"名称",value:"name"},
          {name:"电话",value:"phone"},
          {name:"地址",value:"address"},
        ],
        // don't commit more than one time, when content not change.
        serverSearchHold: false,
        table_loading: false,
        rules: {
          name: [{required: true, validator: rule_name, trigger: 'blur'}],
          address: [{required: true, validator: rule_address, trigger: 'blur'}],
          phone: [{required: true, validator: rule_phone, trigger: 'blur'}],
        }
      }
    },
    created() {
      this.loadSupplier()
    },
    methods: {
      refresh: function() {
        this.table_loading = true
        this.loadSupplier()
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
          deleteSuppliers(JSON.stringify(ids)).then(()=>{
            this.multipleSelection=[]
            this.$message.info("删除成功")
            this.loadSupplier()
          })
        }
      },
      loadSupplier: function() {
        listSuppliers({page: this.currentPage, limit: this.pageSize}).then(response => {
          const {page, pages, data, pageSize, total} = response.data
          this.Suppliers = data
          this.currentPage = page
          this.pageSize = pageSize
          this.total = total
          this.pages = pages
          this.tableData = this.Suppliers
        })
      },
      hideDialog: function() {
        this.dialogFormVisible = false
      },
      showDialog: function (row, opr) {
        // 复制Supplier, 深拷贝
        this.temp = JSON.parse(JSON.stringify(row))
        this.dialogStatus = opr
        this.dialogFormVisible = true
      },
      handleAdd: function () {
        if (this.temp) {
          saveSupplier(this.temp).then(response => {
            if (response.data) {
              this.$message.info("添加成功")
              this.loadSupplier()
            }
          }).catch(error => this.$message.error(error))
        } else {
          this.$message.error("没有数据可以保存")
        }
        this.hideDialog()
      },
      handleEdit: function () {
        if (this.temp) {
          putSupplier(this.temp).then(response=>{
            if (response.data) {
              this.$message.info("修改成功")
              this.loadSupplier()
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
            deleteSupplier({id: this.temp.id}).then(response=>{
              if (response.data) {
                this.$message.success("删除成功!");
                this.loadSupplier();
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
      handleSizeChange: function (size) {
        // 后面没有数据不加载，否则后页数据往当前页
        const ptr = this.currentPage*this.pageSize
        if (this.total - ptr > 0) {
          this.pageSize = size
          this.currentPage = Math.floor(ptr/size) + (ptr%size===0?0:1)
          this.loadSupplier()
        }
      },
      handleCurrentChange: function (page) {
        this.currentPage = page
        this.loadSupplier()
      },
      handleSelectionChange: function (val) {
        this.multipleSelection = val
      },
      handleFilter: function () {
        const filter = this.filter
        if (filter) {
          this.tableData = this.Suppliers.filter(function (dataNews) {
            return Object.keys(dataNews).some(function (key) {
              return String(dataNews[key]).toLowerCase().indexOf(filter) > -1
            })
          })
        } else {
          this.tableData = this.Suppliers
        }
      },
      doServerSearch: function () {
        if (this.serverSearchType){
          const type = this.serverSearchType
          const value = this.serverSearch
          if (!this.serverSearchHold) {
            this.serverSearchHold = true
            search({type: type, value: value}).then(response=>{
              const Suppliers = response.data
              this.Suppliers = Suppliers
              this.tableData = Suppliers
            }).catch(error=>this.$message.error(error));
          }
        }
      }
    }
  }
</script>
