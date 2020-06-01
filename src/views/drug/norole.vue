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
      </el-col>
    </el-row>

    <el-table :data="tableData" border style="width: 100%;" @selection-change="handleSelectionChange" v-loading="table_loading" >
      <el-table-column type="selection" width="55">
      </el-table-column>
      <el-table-column prop="id" label="药品id" width="200" sortable show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="drugName" label="药品名称" width="200" sortable show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="genericId" label="药品通用编码" width="200"  sortable show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="ingredients" label="成分" width="200" show-tooltip-when-overflow >
      </el-table-column>
      <el-table-column label="性状" prop="description" width="200"  show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="indications" label="适应症" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="dosageAndAdministration" label="用法用量" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="contraindications" label="禁忌" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="precautions" label="注意事项" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="adverseReactions" label="不良反应" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="specifications" label="规格" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="packages" label="包装" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="storage" label="贮藏" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="directions" label="说明书" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="manufacturerId" label="生产企业id" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="approvalNumber" label="批准文号" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="medicareClassify" label="医保类别" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column prop="otcClassify" label="OTC类别" width="200" show-tooltip-when-overflow>
      </el-table-column>
      <el-table-column label="操作" align="center" class-name="small-padding fixed-width" fixed="right" width="200" >
        <template slot-scope="{row,$index}">
          <el-button type="text" size="mini" @click="showDialog({opr: 'info', drug: row})">
            详情
          </el-button>
          <el-button type="text" size="mini" @click="passDrugToFather(row)" v-if="geiyao">
            添加
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible" fullscreen center close-on-press-escape>
      <el-form label-position="right" ref="dataForm" :model="drug" label-width="120px" :rules="rules">
        <el-col :sm="10">
          <el-form-item prop="drugName" label="药品名称" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.drugName"/>
          </el-form-item>
          <el-form-item prop="genericId" label="药品通用编码" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.genericId">
              <i
                class="el-icon-question el-input__icon"
                slot="suffix"
                @click="helper = true">
              </i>
            </el-input>
            <drug-helper :open="helper" @value="getHelper"/>
          </el-form-item>
          <el-form-item prop="ingredients" label="成分" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.ingredients"/>
          </el-form-item>
          <el-form-item label="性状" prop="description" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.description"/>
          </el-form-item>
          <el-form-item prop="indications" label="适应症" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.indications"/>
          </el-form-item>
          <el-form-item prop="dosageAndAdministration" label="用法用量" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.dosageAndAdministration"/>
          </el-form-item>
          <el-form-item prop="contraindications" label="禁忌" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.contraindications"/>
          </el-form-item>
          <el-form-item prop="precautions" label="注意事项" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.precautions"/>
          </el-form-item>
          <el-form-item prop="adverseReactions" label="不良反应" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.adverseReactions"/>
          </el-form-item>

        </el-col>
        <el-col :sm="10">
          <el-form-item prop="specifications" label="规格" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.specifications"/>
          </el-form-item>
          <el-form-item prop="packages" label="包装" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.packages"/>
          </el-form-item>
          <el-form-item prop="storage" label="贮藏" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.storage"/>
          </el-form-item>
          <el-form-item prop="manufacturerId" label="生产企业id" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.manufacturerId"/>
          </el-form-item>
          <el-form-item prop="approvalNumber" label="批准文号" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.approvalNumber"/>
          </el-form-item>
          <el-form-item prop="medicareClassify" label="医保类别" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.medicareClassify"/>
          </el-form-item>
          <el-form-item prop="otcClassify" label="OTC类别" width="150">
            <el-input type="text" style="width: 500px;" v-model="drug.otcClassify"/>
          </el-form-item>
          <el-form-item prop="directions" label="说明书" width="150">
            <el-input type="textarea" style="width: 500px;" v-model="drug.directions" :rows="5"/>
          </el-form-item>
        </el-col>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>

  import {listDrugs, search} from "@/api/drug";
  import DrugHelper from "@/components/DrugHelper";
  import {validationYPID} from "@/utils/drug";

  export default {
    name: 'list',
    components: {DrugHelper},
    props: ['geiyao'],
    data() {
      var rule_drugName = (rule, value, callback) => {

      }
      var rule_genericId = (rule, value, callback) => {
        if (!validationYPID(value)) {
          callback(new Error('药品代码非法'))
        }
      }
      var rule_ingredients = (rule, value, callback) => {

      }
      var rule_description = (rule, value, callback) => {

      }
      var rule_indications = (rule, value, callback) => {

      }
      var rule_dosageAndAdministration = (rule, value, callback) => {

      }
      var rule_contraindications = (rule, value, callback) => {

      }
      var rule_precautions = (rule, value, callback) => {

      }
      var rule_adverseReactions = (rule, value, callback) => {

      }
      var rule_specifications = (rule, value, callback) => {

      }
      var rule_packages = (rule, value, callback) => {

      }
      var rule_storage = (rule, value, callback) => {

      }
      var rule_manufacturerId = (rule, value, callback) => {

      }
      var rule_approvalNumber = (rule, value, callback) => {

      }
      var rule_medicareClassify = (rule, value, callback) => {

      }
      var rule_otcClassify = (rule, value, callback) => {

      }
      var rule_directions = (rule, value, callback) => {

      }
      return {
        drugs: [],
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
          {name:"药名",value:"name"},
          {name:"药品通用编码",value:"genericId"},
          {name:"成分",value:"ingredients"},
          {name:"适应症",value:"indications"},
          {name:"批准文号",value:"approvalNumber"},
          {name:"医保类别",value:"medicareClassify"}
        ],
        // don't commit more than one time, when content not change.
        serverSearchHold: false,
        table_loading: false,
        textMap: {
          info: '药品详细',
          edit: '修改药品',
          delete: '删除药品',
          add: '添加药品'
        },
        rules: {
          drugName: [{required: true, validator: rule_drugName, trigger: 'blur'}],
          genericId: [{required: true, validator: rule_genericId, trigger: 'blur'}],
          ingredients: [{required: true, validator: rule_ingredients, trigger: 'blur'}],
          description: [{required: true, validator: rule_description, trigger: 'blur'}],
          indications: [{required: true, validator: rule_indications, trigger: 'blur'}],
          dosageAndAdministration: [{required: true, validator: rule_dosageAndAdministration, trigger: 'blur'}],
          contraindications: [{required: true, validator: rule_contraindications, trigger: 'blur'}],
          precautions: [{required: true, validator: rule_precautions, trigger: 'blur'}],
          adverseReactions: [{required: true, validator: rule_adverseReactions, trigger: 'blur'}],
          specifications: [{required: true, validator: rule_specifications, trigger: 'blur'}],
          packages: [{required: true, validator: rule_packages, trigger: 'blur'}],
          storage: [{required: true, validator: rule_storage, trigger: 'blur'}],
          manufacturerId: [{required: true, validator: rule_manufacturerId, trigger: 'blur'}],
          approvalNumber: [{required: true, validator: rule_approvalNumber, trigger: 'blur'}],
          medicareClassify: [{required: true, validator: rule_medicareClassify, trigger: 'blur'}],
          otcClassify: [{required: true, validator: rule_otcClassify, trigger: 'blur'}],
          directions: [{required: true, validator: rule_directions, trigger: 'blur'}],
        },
        helper: false,
        drug: {},
        opr: '',
        dialogStatus: '',
        dialogFormVisible: false,
      }
    },
    created() {
      this.loadDrug()
    },
    methods: {
      hideDialog: function() {
        this.dialogFormVisible = false
      },
      showDialog: function (data) {
        let opr = data.opr
        if (opr === 'info' && data.drug === {}) {
          this.$message.error("没有可以查看的数据")
        } else {
          this.drug = JSON.parse(JSON.stringify(data.drug))
          this.opr = opr
          this.dialogStatus = opr
          this.dialogFormVisible = true
        }
      },
      refresh: function() {
        this.table_loading = true
        this.loadDrug()
        // loading 效果
        setTimeout(()=>this.table_loading = false, 300)
      },

      loadDrug: function() {
        listDrugs({page: this.currentPage, limit: this.pageSize}).then(response => {
          const {page, pages, data, pageSize, total} = response.data
          this.drugs = data
          this.currentPage = page
          this.pageSize = pageSize
          this.total = total
          this.pages = pages
          this.tableData = this.drugs
        })
      },
      handleSizeChange: function (size) {
        // 后面没有数据不加载，否则后页数据往当前页
        const ptr = this.currentPage*this.pageSize
        if (this.total - ptr > 0) {
          this.pageSize = size
          this.currentPage = Math.floor(ptr/size) + (ptr%size===0?0:1)
          this.loadDrug()
        }
      },
      handleCurrentChange: function (page) {
        this.currentPage = page
        this.loadDrug()
      },
      handleSelectionChange: function (val) {
        this.multipleSelection = val
      },
      handleFilter: function () {
        const filter = this.filter
        if (filter) {
          this.tableData = this.drugs.filter(function (dataNews) {
            return Object.keys(dataNews).some(function (key) {
              return String(dataNews[key]).toLowerCase().indexOf(filter) > -1
            })
          })
        } else {
          this.tableData = this.drugs
        }
      },
      doServerSearch: function () {
        if (this.serverSearchType){
          const type = this.serverSearchType
          const value = this.serverSearch
          if (!this.serverSearchHold) {
            this.serverSearchHold = true
            search({type: type, value: value}).then(response=>{
              const drugs = response.data
              this.drugs = drugs
              this.tableData = drugs
            }).catch(error=>this.$message.error(error));
          }
        }
      },

      passDrugToFather: function(row) {
        this.$emit('value', row)
      },


      // dialog
      getHelper: function (data) {
        this.drug.genericId = data
        this.helper = false
      },
    },
  }
</script>
