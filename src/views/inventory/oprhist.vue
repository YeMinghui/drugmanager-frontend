<template>
  <div class="app-container">
    <el-row class="filter-container" :gutter="5">
      <el-col :sm="5">
        <el-input v-model="filter" placeholder="本页查找" @keyup.native="handleFilter" prefix-icon="el-icon-search"/>
      </el-col>
      <el-col :sm="10">
        <el-input placeholder="系统中搜索" v-model="serverSearch" class="input-with-select"
                  @keyup.native="serverSearchHold=false">
          <el-select v-model="serverSearchType" slot="prepend" placeholder="请选择" style="width: 100px;"
                     @change="serverSearch=''">
            <el-option v-for="sst in serverSearchTypes" :key="sst.name" :label="sst.name"
                       :value="sst.value"></el-option>
          </el-select>
          <el-button slot="append" icon="el-icon-search" @click="doServerSearch"></el-button>
        </el-input>
      </el-col>
      <el-col :sm="5">
        <el-button @click="refresh" type="info">刷新</el-button>
      </el-col>
    </el-row>

    <el-table :data="tableData" border style="width: 100%;" @selection-change="handleSelectionChange"
              v-loading="table_loading">
      <el-table-column prop="inventoryId" label="药品库存id" sortable>
      </el-table-column>
      <el-table-column prop="drugName" label="药品名称" sortable>
      </el-table-column>
      <el-table-column prop="genericId" label="通用药品编码" sortable>
      </el-table-column>
      <el-table-column label="操作员id" prop="operatorId" sortable>
      </el-table-column>
      <el-table-column label="操作时间" prop="operateTime" sortable :formatter="date_format">
      </el-table-column>
      <el-table-column prop="operateMethod" label="操作方式" sortable>
      </el-table-column>
      <el-table-column prop="operateDetailId" label="操作明细id" sortable>
      </el-table-column>
      <el-table-column prop="amountDelta" label="存量变动值" sortable>
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
  </div>
</template>

<script>

  import {listInventoryByIds, listInventoryHist, search, searchHist} from "@/api/inventory";
  import {listDrugsByIds} from "@/api/drug";

  export default {
    name: 'oprhist',
    data() {
      return {
        temp: {},
        hists: [],
        textMap: {
          edit: '修正信息',
          delete: '出库',
          add: '入库'
        },
        currentPage: 1,
        pageSize: 10,
        total: 0,
        pages: 0,
        pageSizes: [10, 20, 40, 80],
        multipleSelection: [],
        tableData: null,
        filter: null,
        serverSearch: '',
        serverSearchType: "drugName",
        serverSearchTypes: [
          {name: "药品名称", value: "drugName"},
          {name: "药品通用编码", value: "genericId"},
          {name: "操作员id", value: "opId"}
        ],
        // don't commit more than one time, when content not change.
        serverSearchHold: false,
        table_loading: false,
      }
    },
    created() {
      this.loadInventoryHist()
    },
    methods: {
      refresh: function () {
        this.table_loading = true
        this.loadInventoryHist()
        // loading 效果
        setTimeout(() => this.table_loading = false, 300)
      },
      loadInventoryHist: function () {
        listInventoryHist({page: this.currentPage, limit: this.pageSize}).then(response => {
          const {page, pages, data, pageSize, total} = response.data
          this.hists = data
          this.currentPage = page
          this.pageSize = pageSize
          this.total = total
          this.pages = pages

          this.hookDrugName(this.hists)
        })
      },
      hookDrugName: function (hists) {
        let ids = []
        for (let i = 0; i < hists.length; i++) {
          ids.push(hists[i].inventoryId)
        }
        ids = [...new Set(ids)]
        new Promise(resolve => {
          listInventoryByIds(JSON.stringify(ids)).then(response => {
            let inventories = response.data
            let ids = []
            for (let i = 0; i < inventories.length; i++) {
              ids.push(inventories[i].drugId)
            }
            ids = [...new Set(ids)]
            listDrugsByIds(JSON.stringify(ids)).then(response => {
              let drugs = response.data
              for (let i = 0; i < drugs.length; i++) {
                for (let j = 0; j < inventories.length; j++) {
                  if (inventories[j].drugId === drugs[i].id) {
                    inventories[j]['drugName'] = drugs[i].drugName
                    inventories[j]['genericId'] = drugs[i].genericId
                  }
                }
              }

              for (let i = 0; i < inventories.length; i++) {
                for (let j = 0; j < hists.length; j++) {
                  if (inventories[i].id === hists[j].inventoryId) {
                    hists[j]['drugName'] = inventories[i].drugName
                    hists[j]['genericId'] = inventories[i].genericId
                  }
                }
              }
              this.hists = hists
              this.tableData = hists
            }).catch(error => {
              this.$message.error(error)
            })
          })
        })
      },
      handleSizeChange: function (size) {
        // 后面没有数据不加载，否则后页数据往当前页
        const ptr = this.currentPage * this.pageSize
        if (this.total - ptr > 0) {
          this.pageSize = size
          this.currentPage = Math.floor(ptr / size) + (ptr % size === 0 ? 0 : 1)
          this.loadInventoryHist()
        }
      },
      handleCurrentChange: function (page) {
        this.currentPage = page
        this.loadInventoryHist()
      },
      handleSelectionChange: function (val) {
        this.multipleSelection = val
      },
      handleFilter: function () {
        const filter = this.filter
        if (filter) {
          this.tableData = this.hists.filter(function (dataNews) {
            return Object.keys(dataNews).some(function (key) {
              return String(dataNews[key]).toLowerCase().indexOf(filter) > -1
            })
          })
        } else {
          this.tableData = this.hists
        }
      },
      doServerSearch: function () {
        if (this.serverSearchType) {
          const type = this.serverSearchType
          const value = this.serverSearch
          if (!this.serverSearchHold) {
            this.serverSearchHold = true
            searchHist({type: type, value: value}).then(response => {
              this.hookDrugName(response.data)
            }).catch(error => this.$message.error(error));
          }
        }
      },
      date_format(row, column) {

        let date = row[column.property];
        if (date == undefined) {
          return '';
        }
        const dateMat_tmp = new Date(date);
        //js中GMT时间初始化的Date多了8小时，要减掉，按毫秒数来减
        // const dateMat = new Date(dateMat_tmp.valueOf() - 8 * 3600 * 1000);
        const dateMat = new Date(dateMat_tmp.valueOf());
        const year = dateMat.getFullYear();
        const month = dateMat.getMonth() + 1;
        const day = dateMat.getDate();
        const hh = dateMat.getHours();
        const mm = dateMat.getMinutes();
        const ss = dateMat.getSeconds();
        const timeFormat = year + "-" + (month < 10 ? '0' + month : month) + "-" + (day < 10 ? '0' + day : day) + " " + (hh < 10 ? '0' + hh : hh) + ":" + (mm < 10 ? '0' + mm : mm) + ":" + (ss < 10 ? '0' + ss : ss);
        return timeFormat;

      },
    }
  }
</script>
