<template>
  <div v-if="show" style="margin-top: 10px;">
    <el-row>
      <el-col :sm="10">
        药品类别: {{leibie || '请选择'}}
      </el-col>
      <el-col :sm="10">
        <el-cascader :options="fenlei" :props="{children: 'sub', label: 'name'}" @change="chooseFenlei"></el-cascader>
      </el-col>
    </el-row>

    <el-row>
      <el-col :sm="10">
        品种编码(001-ZZZ):
      </el-col>
      <el-col :sm="10">
        <el-input type="text" v-model="pingzhong" @blur="check_pingzhong"/>
      </el-col>
    </el-row>

    <el-row>
      <el-col :sm="10">
        品规编码(01-ZZ):
      </el-col>
      <el-col :sm="10">
        <el-input type="text" v-model="pinggui" @blur="check_pinggui"/>
      </el-col>
    </el-row>

    <el-row>
      <el-col :sm="10">
        厂家&包装(01-ZZ):
      </el-col>
      <el-col :sm="10">
        <el-input type="text" v-model="changjia" @blur="check_changjia"/>
      </el-col>
    </el-row>

    <el-button type="primary" @click="mergeVal">确认</el-button>

  </div>
</template>

<script>
  import {getFenlei, validationYPID} from "@/utils/drug";

  export default {
    name: "drug-helper",
    data() {
      return {
        fenlei: getFenlei(),
        leibie: '',
        pingzhong: '',
        pinggui: '',
        changjia: '',
      }
    },
    props: ['open'],
    computed: {
      show() {
        return this.open
      }
    },
    methods: {
      chooseFenlei: function (data) {
        let result = ""
        for (let i = 0; i < data.length; i++) {
          result += data[i]
        }
        this.leibie = result
      },
      mergeVal: function () {
        let value = this.leibie.toUpperCase() + this.pingzhong.toUpperCase() + this.pinggui.toUpperCase() + this.changjia.toUpperCase()
        if (validationYPID(value)) {
          this.$emit('value', value);
        } else {
          this.$message.error("药品ID非法")
        }
      },
      check_pingzhong: function () {
        let s = this.pingzhong.toUpperCase();
        if (!s.match(/[0-9A-Z]{3}/)) {
          this.$message.error('品种编码在(001-ZZZ)之间')
        }
      },
      check_pinggui: function () {
        let s = this.pinggui.toUpperCase();
        if (!s.match(/[0-9A-Z]{2}/)) {
          this.$message.error('品规编码在(01-ZZ)之间')
        }
      },
      check_changjia: function () {
        let s = this.changjia.toUpperCase();
        if (!s.match(/[0-9A-Z]{2}/)) {
          this.$message.error('厂家包装编码在(01-ZZ)之间')
        }
      },
    },
  }
</script>
