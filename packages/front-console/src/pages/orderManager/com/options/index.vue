<template>
  <el-form :model="optionFrom" :rules="rules" ref="ruleForm" label-width="120px" class="demo-ruleForm">
    <el-form-item :label="title" prop="selArr">
      <span style="color: #999">全选：</span><el-switch v-model="optionFrom.allSel" @change="allSelChange"></el-switch>
      <el-checkbox-group v-model="optionFrom.selArr">
        <el-checkbox v-for="(v, k) in optionArr" :label="v">{{v[name]}}</el-checkbox>
      </el-checkbox-group>
    </el-form-item>
  </el-form>
</template>

<script>
  import {get, post} from "../../../../store/api";
  export default {
    name: "options",
    props: {
      url: {
        type: String,
        default: ''
      },
      idName: {
        type: String,
        default: ''
      },
      name: {
        type: String,
        default: ''
      },
      title: {
        type: String,
        default: ''
      },
      inputArr: {
        type: Array,
        default() {
          return []
        }
      }
    },
    data() {
      return {
        optionArr: [],
        optionFrom: {
          selArr: [],
          allSel: false
        },
        rules: {
          selArr: [
            { required: true, message: '请选择', trigger: 'blur' },
          ]
        },
        /**
         * 获取的默认选中的数据
         */
        defaultSelArr: []
      }
    },
    watch: {
      'inputArr'() {
        this.optionArr = this.inputArr
        this.setDefauleData()
      }
    },
    methods: {
      getOptionArr() {
        if (this.url) {
          get(this.url).then(dataArr => {
            this.optionArr = dataArr
            this.setDefauleData()
          }).catch(() => {})
        } else {
          this.optionArr = this.inputArr
          this.setDefauleData()
        }
      },
      allSelChange(data) {
        if (data) {
          this.optionFrom.selArr = this.optionArr
        } else {
          this.optionFrom.selArr = []
        }
      },
      check() {
        return new Promise((resolve, reject) => {
          this.$refs['ruleForm'].validate((valid) => {
            if (valid) {
              resolve(this.optionFrom.selArr)
            } else {
              this.$message({
                showClose: true,
                message: `请选择${this.title}`,
                type: 'error'
              });
              reject()
              return false;
            }
          })
        })
      },
      /**
       * 设置默认数据
       */
      setDefauleData() {
        if (this.defaultSelArr.length && this.optionArr.length) {
          const map = new Set(this.defaultSelArr)
          this.optionFrom.selArr = this.optionArr.filter((item) => {
            return map.has(item[this.idName])
          })
        }
      },
      /**
       * 设置选中的数据
       */
      setSelData(arr) {
        this.defaultSelArr = arr
        this.setDefauleData()
      },
      /**
       * 清除选中的数据
       */
      clear() {
        this.optionFrom.selArr = []
      }
    },
    mounted() {
      this.getOptionArr()
    }
  }
</script>

<style scoped>

</style>
