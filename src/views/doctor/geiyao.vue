<template>
  <div class="app-container">
    <el-row :gutter="1">
    <el-col :sm="6">
      <el-form ref="dataForm" label-position="right" label-width="80px;" style="width: 400px;">
        <el-form-item label="姓名">
          <el-input type="text" v-model="name"></el-input>
        </el-form-item>
        <el-form-item label="身份证">
          <el-input type="text" v-model="identity"></el-input>
        </el-form-item>
        <el-form-item label="病情描述">
          <el-input type="textarea" rows="10" cols="50" v-model="describe"></el-input>
        </el-form-item>
        用药
        <el-table :data="drugs">
          <el-table-column prop="id" label="药品id"></el-table-column>
          <el-table-column prop="drugName" label="药名"></el-table-column>
          <el-table-column prop="dose" label="剂量"></el-table-column>
          <el-table-column prop="times" label="次数"></el-table-column>
          <el-table-column>
            <template slot-scope="scope">
              <el-button type="text" @click="removeItem(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-button @click="save" type="primary">确认</el-button>
      </el-form>
    </el-col>
      <el-col :sm="18">
        <list :geiyao="true" @value="putDrugToArr"></list>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  import List from "@/views/drug/norole";
  import request from '@/utils/request'

  export default {
    name: "geiyao",
    components: {List},
    data() {
      return {
        name: '',
        identity: '',
        describe: '',
        drugs: []
      }
    },
    methods: {
      putDrugToArr: function (drug) {
        let dose
        let times
        this.$prompt('请输入剂量', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPattern: /\d+/,
          inputErrorMessage: '整数个单位?'
        }).then(({ value }) => {
          dose = value
          this.$prompt('请输入次数', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            inputPattern: /\d+/,
            inputErrorMessage: '整数次?'
          }).then(({ value }) => {
            times = value
            if (dose && times) {
              drug['dose'] = dose
              drug['times'] = times
              this.drugs.push(drug)
            }
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消输入'
            });
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消输入'
          });
        });
      },
      save: function () {
        if (!this.name || !this.identity || !this.describe) {
          this.$message.warning("没有输入病人信息");
        } else {
          let info = {
            name: this.name,
            identity: this.identity,
            describes: this.describe,
            drugs: this.drugs.map(ele => {return {id: ele.id, drugName: ele.drugName, dose: ele.dose, times: ele.times}})
          }

          this.$message.info(JSON.stringify(info))
          request({
            url: '/geiyao',
            method: 'post',
            data: info
          }).then(response => this.$message.info(response.data)).catch(error=>this.$message.error(error))
        }
      },
      removeItem: function (index) {
        this.drugs.splice(index, 1)
      }
    }
  }
</script>
