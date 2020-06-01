<template>
  <div class="app-container">
    <el-row class="filter-container" :gutter="5">
      <el-col :sm="5">
        <el-input v-model="filter" placeholder="本页查找" @keyup.native="handleFilter" prefix-icon="el-icon-search"/>
      </el-col>
      <el-col :sm="5">
        <el-button @click="refresh" type="info">刷新</el-button>
        <el-button @click="showDialog({}, 'add')" type="primary">添加</el-button>
        <el-button @click="deleteSelect" type="danger">删除</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" border style="width: 100%;" @selection-change="handleSelectionChange"
              v-loading="table_loading">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="name" label="科室名">
      </el-table-column>
      <el-table-column prop="address" label="地址">
      </el-table-column>
      <el-table-column prop="phone" label="电话">
      </el-table-column>
      <el-table-column prop="drugs" label="用药范围">
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" style="min-width: 500px;">
      <el-form ref="dataForm" :model="temp" label-position="right" label-width="80px"
               style="width: 400px; margin-left:50px;" :rules="rules">
        <el-form-item prop="name" label="科室名">
          <el-input v-model="temp.name"/>
        </el-form-item>
        <el-form-item prop="address" label="地址">
          <el-input v-model="temp.address"/>
        </el-form-item>
        <el-form-item prop="phone" label="电话">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item prop="drugs" label="用药范围">
          <el-input v-model="temp.drugs"/>
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

  import {clearDeparts, loadDeparts} from "@/utils/cachedata";
  import {deleteDepart, deleteDeparts, putDepart, saveDepart} from "@/api/department";

  export default {
    name: 'list',
    data() {
      var rule_name = (rule, value, callback) => {

      }
      var rule_address = (rule, value, callback) => {

      }
      var rule_phone = (rule, value, callback) => {

      }
      var rule_drugs = (rule, value, callback) => {

      }
      return {
        temp: {},
        departments: [],
        textMap: {
          edit: '修改',
          delete: '删除',
          add: '添加'
        },
        dialogStatus: '',
        dialogFormVisible: false,
        multipleSelection: [],
        tableData: null,
        filter: '',
        table_loading: false,
        rules: {
          name: [{required: true, validator: rule_name, trigger: 'blur'}],
          address: [{required: true, validator: rule_address, trigger: 'blur'}],
          phone: [{required: true, validator: rule_phone, trigger: 'blur'}],
          drugs: [{required: true, validator: rule_drugs, trigger: 'blur'}],
        }
      }
    },
    created() {
      this.loadDepart()
    },
    methods: {
      refresh: function () {
        this.table_loading = true
        this.reloadDepart()
        // loading 效果
        setTimeout(() => this.table_loading = false, 300)
      },
      deleteSelect: function () {
        if (this.multipleSelection.length === 0) {
          this.$message.warning("没有选中要删除的数据。")
        } else {
          const ids = []
          const data = this.multipleSelection
          for (let i = 0; i < data.length; i++) {
            ids.push(data[i].id)
          }
          deleteDeparts(JSON.stringify(ids)).then(() => {
            this.multipleSelection = []
            this.$message.info("删除成功")
            this.reloadDepart()
          })
        }
      },
      loadDepart: function () {
        new Promise(resolve => {
          resolve(loadDeparts())
        }).then(data => {
          this.departments = data
          this.tableData = this.departments
        })
      },
      reloadDepart: function () {
        clearDeparts()
        this.loadDepart()
      },
      showDialog: function (row, opr) {
        this.temp = JSON.parse(JSON.stringify(row))
        this.dialogStatus = opr
        this.dialogFormVisible = true
      },
      hideDialog: function() {
        this.dialogFormVisible = false
      },
      handleAdd: function () {
        if (this.temp) {
          saveDepart(this.temp).then(response => {
            if (response.data) {
              this.$message.info("添加成功")
              this.reloadDepart()
            }
          }).catch(error => this.$message.error(error))
        } else {
          this.$message.error("没有数据可以保存")
        }
        this.hideDialog()
      },
      handleEdit: function () {
        if (this.temp) {
          delete this.temp.departmentName
          putDepart(this.temp).then(response => {
            if (response.data) {
              this.$message.info("修改成功")
              this.reloadDepart()
            }
          }).catch(error => this.$message.error(error))
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
            deleteDepart({id: this.temp.id}).then(response => {
              if (response.data) {
                this.$message.success("删除成功!");
                this.reloadDepart()
              } else {
                this.$message.error("删除失败")
              }
            }).catch(error => this.$message.error(error))
          }).catch(() => this.$message.info("已取消删除"))
        } else {
          this.$message.error("没有数据可以删除")
        }
        this.hideDialog()
      },
      handleSelectionChange: function (val) {
        this.multipleSelection = val
      },
      handleFilter: function () {
        const filter = this.filter
        if (filter) {
          this.tableData = this.departments.filter(function (dataNews) {
            return Object.keys(dataNews).some(function (key) {
              return String(dataNews[key]).toLowerCase().indexOf(filter) > -1
            })
          })
        } else {
          this.tableData = this.departments
        }
      },
    }
  }
</script>
