<template>
  <div class="app-container">
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
        <el-form-item prop="specifications" label="规格" width="150">
          <el-input type="text" style="width: 500px;" v-model="drug.specifications"/>
        </el-form-item>
        <el-form-item prop="packages" label="包装" width="150">
          <el-input type="text" style="width: 500px;" v-model="drug.packages"/>
        </el-form-item>

        <el-form-item v-if="opr !== 'info'">
          <el-button native-type="reset" v-if="opr">清除</el-button>
          <el-button @click="putDrug" type="primary" v-if="opr==='edit'">保存</el-button>
          <el-button @click="saveDrug" type="primary" v-if="opr==='add'">保存</el-button>
          <el-button @click="deleteDrug" type="danger" v-if="opr==='delete'">保存</el-button>
        </el-form-item>

      </el-col>
      <el-col :sm="10">
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
          <el-input type="textarea" style="width: 500px;" v-model="drug.directions"/>
        </el-form-item>
      </el-col>
    </el-form>
  </div>
</template>

<script>

  import DrugHelper from "@/components/DrugHelper";
  import {validationYPID} from "@/utils/drug";
  import {deleteDrugs, putDrug, saveDrug} from "@/api/drug";

  export default {
    name: "info",
    components: {DrugHelper},

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
        drug: {},
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
        opr: 'info'
      }
    },
    methods: {
      getHelper: function (data) {
        this.drug.genericId = data
        this.helper = false
      },
      putDrug: function() {
        if (this.drug) {
          putDrug(this.drug).then(response=>{
            if (response.data) {
              this.$message.info("修改成功")
            }
          }).catch(error=>this.$message.error(error))
        } else {
          this.$message.error("没有数据可以保存")
        }
      },
      saveDrug: function () {
        if (this.drug) {
          saveDrug(this.drug).then(response=>{
            if (response.data) {
              this.$message.info("添加成功")
            }
          }).catch(error=>this.$message.error(error))
        } else {
          this.$message.error("没有数据可以保存")
        }
      },

      deleteDrug: function () {
        if (this.temp) {
          this.$confirm('此操作将永久删除, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            deleteDrugs({id: this.temp.id}).then(response=>{
              if (response.data) {
                this.$message.success("删除成功!");
              } else {
                this.$message.error("删除失败")
              }
            }).catch(error=>this.$message.error(error))
          }).catch(() => this.$message.info("已取消删除"))
        } else {
          this.$message.error("没有数据可以删除")
        }
      },
    },
    activated() {
      this.opr = this.$route.params.opr;
      if (this.opr === 'info' || this.opr === 'edit' || this.opr === 'delete') {
        let drug = this.$route.params.drug;
        if (!drug) {
          this.$message.info("没有选择要查看的药品")
          this.$router.push('/drug/list')
        } else {
          this.drug = drug
        }
      }
    },
  }
</script>
