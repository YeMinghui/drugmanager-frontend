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
        <el-button @click="showDialog({}, 'add')" type="primary">入库</el-button>
        <el-button @click="deleteSelect" type="danger">清空库存</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" border style="width: 100%;" @selection-change="handleSelectionChange" v-loading="table_loading">
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="drugId" label="药品id"  sortable>
      </el-table-column>
      <el-table-column label="药品名称" prop="drugName" sortable>
      </el-table-column>
      <el-table-column label="药品通用编码" prop="genericId" sortable>
      </el-table-column>
      <el-table-column prop="serialNumber" label="产品批号" sortable>
      </el-table-column>
      <el-table-column prop="productionDate" label="生产日期" sortable>
      </el-table-column>
      <el-table-column prop="expDate" label="有效期至" sortable>
      </el-table-column>
      <el-table-column prop="price" label="药品单价" sortable>
      </el-table-column>
      <el-table-column prop="amount" label="存量" sortable>
      </el-table-column>

      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="200px;">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="showDialog(row, 'edit')">
            修正信息
          </el-button>
          <el-button size="mini" type="danger" @click="showDialog(row, 'delete')">
            清空库存
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
        <el-form-item prop="drugId" label="药品id" required>
          <el-input v-model="temp.drugId"/>
        </el-form-item>
        <el-form-item prop="serialNumber" label="产品批号" required>
          <el-input v-model="temp.serialNumber"/>
        </el-form-item>
        <el-form-item prop="productionDate" label="生产日期" required>
          <el-date-picker type="date" v-model="temp.productionDate" placeholder="选择日期" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item prop="expDate" label="有效期至" required>
          <el-date-picker type="date" v-model="temp.expDate" placeholder="选择日期" value-format="yyyy-MM-dd"/>
        </el-form-item>
        <el-form-item prop="price" label="药品单价" required>
          <el-input v-model="temp.price"/>
        </el-form-item>
        <el-form-item prop="amount" label="存量" required>
          <el-input v-model="temp.amount"/>
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
    deleteInventory,
    deleteInventories,
    listInventories,
    putInventory,
    saveInventory,
    search
  } from "@/api/inventory";
  import {listDrugs, listDrugsByIds} from "@/api/drug";

  export default {
    name: 'list',
    data() {
      return {
        temp: {},
        Inventories: [],
        textMap: {
          edit: '修正信息',
          delete: '清空库存',
          add: '入库'
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
        serverSearchType: "drugId",
        serverSearchTypes: [
          {name:"药品id",value:"drugId"},
          {name:"药品名称",value:"drugName"},
          {name:"药品通用编码",value:"genericId"},
        ],
        // don't commit more than one time, when content not change.
        serverSearchHold: false,
        table_loading: false,
      }
    },
    created() {
      this.loadInventory()
    },
    methods: {
      refresh: function() {
        this.table_loading = true
        this.loadInventory()
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
          deleteInventories(JSON.stringify(ids)).then(()=>{
            this.multipleSelection=[]
            this.$message.info("删除成功")
            this.loadInventory()
          })
        }
      },
      loadInventory: function() {
        listInventories({page: this.currentPage, limit: this.pageSize}).then(response => {
          const {page, pages, data, pageSize, total} = response.data
          this.Inventories = data
          this.currentPage = page
          this.pageSize = pageSize
          this.total = total
          this.pages = pages

          this.hookDrugName(this.Inventories)
        })
      },
      hookDrugName: function(inventories) {
        let ids = []
        for (let i = 0; i < inventories.length; i++) {
          ids.push(inventories[i].drugId)
        }
        ids = [...new Set(ids)]
        new Promise(resolve => {
          listDrugsByIds(JSON.stringify(ids)).then(response=>{
            let drugs = response.data
            for (let i = 0; i < drugs.length; i++) {
              for (let j = 0; j < inventories.length; j++) {
                if (inventories[j].drugId === drugs[i].id) {
                  inventories[j]['drugName'] = drugs[i].drugName
                  inventories[j]['genericId'] = drugs[i].genericId
                }
              }
            }
            this.Inventories = inventories
            this.tableData = inventories
          }).catch(error=>{this.$message.error(error)})
        })
      },
      hideDialog: function() {
        this.dialogFormVisible = false
      },
      showDialog: function (row, opr) {
        // 复制Inventory, 深拷贝
        this.temp = JSON.parse(JSON.stringify(row))
        this.dialogStatus = opr
        this.dialogFormVisible = true
      },
      handleAdd: function () {
        if (this.temp) {
          saveInventory(this.temp).then(response => {
            if (response.data) {
              this.$message.info("添加成功")
              this.loadInventory()
            }
          }).catch(error => this.$message.error(error))
        } else {
          this.$message.error("没有数据可以保存")
        }
        this.hideDialog()
      },
      handleEdit: function () {
        if (this.temp) {
          delete this.temp.drugName
          delete this.temp.genericId
          putInventory(this.temp).then(response=>{
            if (response.data) {
              this.$message.info("修改成功")
              this.loadInventory()
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
            deleteInventory({id: this.temp.id}).then(response=>{
              if (response.data) {
                this.$message.success("删除成功!");
                this.loadInventory();
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
          this.loadInventory()
        }
      },
      handleCurrentChange: function (page) {
        this.currentPage = page
        this.loadInventory()
      },
      handleSelectionChange: function (val) {
        this.multipleSelection = val
      },
      handleFilter: function () {
        const filter = this.filter
        if (filter) {
          this.tableData = this.Inventories.filter(function (dataNews) {
            return Object.keys(dataNews).some(function (key) {
              return String(dataNews[key]).toLowerCase().indexOf(filter) > -1
            })
          })
        } else {
          this.tableData = this.Inventories
        }
      },
      doServerSearch: function () {
        if (this.serverSearchType){
          const type = this.serverSearchType
          const value = this.serverSearch
          if (!this.serverSearchHold) {
            this.serverSearchHold = true
            search({type: type, value: value}).then(response=>{
              this.hookDrugName(response.data)
            }).catch(error=>this.$message.error(error));
          }
        }
      }
    }
  }
</script>
