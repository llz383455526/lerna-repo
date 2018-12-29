<template>
  <el-form :disabled="disabled" size="small" :inline="true" ref="sectionInputForm" :rules="rules" class="tax-discount-section-input" :model="form">
    <el-form-item class="one-input" prop="inputData0" :label="title">
      <el-input placeholder="请输入内容" type="number" v-model.number="form.inputData0">
        <template slot="append">%</template>
      </el-input>
    </el-form-item>
    <el-form-item prop="inputData1">
      <el-input type="number" placeholder="请输入内容" v-model.number="form.inputData1">
        <template slot="append">%</template>
        <template slot="prepend">折扣率</template>
      </el-input>
    </el-form-item>
    <el-form-item label="是否免征" v-if="isShowFree">
      <el-switch v-model="form.isFree"></el-switch>
    </el-form-item>
    <template v-if="form.isFree">
      <br>
      <el-form-item class="one-input" prop="inputData2" label=" ">
        <el-input type="number" placeholder="请输入内容" v-model.number="form.inputData2">
          <template slot="append">%</template>
          <template slot="prepend">奖励分成</template>
        </el-input>
      </el-form-item>
      <el-form-item prop="inputData3">
        <el-input type="number" placeholder="请输入内容" v-model.number="form.inputData3">
          <template slot="append">%</template>
          <template slot="prepend">奖励分成比例</template>
        </el-input>
      </el-form-item>
    </template>
  </el-form>
</template>

<script>
  export default {
    name: "sectionInput",
    props: {
      title: {
        type: String,
        default: ''
      },
      taxCategory: {
        type: String,
        default: ''
      },
      taxCollection: {
        type: String,
        default: ''
      },
      taxCode: {
        type: String,
        default: ''
      },
      // 是否免征
      isShowFree: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      },
      taxLandingId: {
        type: String | Number,
        default: ''
      }
    },
    data() {
      let checkInputValidator = (rule, value, callback) => {
        const str = this.checkInput(this.form.inputData0)
        callback(str ? new Error(str) : undefined)
      }
      return {
        form: {
          inputData0: 0,
          inputData1: 100,
          isFree: false
        },
        rules: {
          inputData0: [{ required: true, trigger: 'blur', validator:  checkInputValidator}],
          inputData1: [{ required: true, trigger: 'blur', validator: checkInputValidator }],
        },
      }
    },
    methods: {
      checkInput(num) {
        const type = typeof num
        if (type === 'number') {
          if (num >= 0 && num <= 100) {
            return ''
          }
          return '数值超出范围（0-100）'
        } else {
          return '请输入数据'
        }
      },
      check() {
        return new Promise((resolve, reject) => {
          this.$refs['sectionInputForm'].validate((valid) => {
            if (valid) {
              const taxRate = this.form.inputData0.toFixed(2)
              const discountRate = this.form.inputData1.toFixed(2)
              const data = {
                "discountRate": Number(discountRate),
                "taxCode": this.taxCode,
                "taxRate": Number(taxRate),
                "rewardRatio": this.form.inputData2,
                "rewardSharingRatio": this.form.inputData3
              }
              if (this.isShowFree) {
                data.isExemption = this.form.isFree ? 1 : 0
              }
              resolve(data)
            } else {
              reject()
            }
          })
        })
      },
      // 设置数据
      setData(item) {
        this.form.inputData0 = item.taxRate
        this.form.inputData1 = item.discountRate
        this.form.inputData2 = item.rewardRatio
        this.form.inputData3 = item.rewardSharingRatio
        this.form.isFree = item.isExemption === 1
      }
    }
  }
</script>

<style lang="scss">
.tax-discount-section-input {
  /*width: 500px;*/
  .one-input {
    .el-form-item__label {
      width: 200px;
    }
  }
  .top-intercal {
    margin-top: 10px;
  }
}
.w140 {
  width: 140px;
}
</style>
