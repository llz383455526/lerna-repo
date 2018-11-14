<template>
  <div class="tax-discount-accessory-input">
    <el-form :disabled="disabled" size="small" ref="accessoryInputForm" :rules="rules" :model="form">
      <el-form-item prop="inputData">
        <el-input placeholder="请输入内容" type="number" v-model.number="form.inputData">
          <template slot="prepend">
            <slot/>
          </template>
          <template slot="append">
            <span>%</span>
          </template>
        </el-input>
      </el-form-item>
    </el-form>
    <span style="padding-left: 10px"><i v-if="remove" @click="removeClick" class="el-icon-delete" style="cursor: pointer"></i></span>
  </div>
</template>

<script>
  export default {
    name: "accessoryInput",
    data() {
      return {
        form: {
          inputData: 0
        },
        rules: {
          inputData: [{ required: true, trigger: 'blur', validator: (rule, value, callback) => {
              const str = this.checkInput(this.form.inputData)
              callback(str ? new Error(str) : undefined)
            } }]
        },
      }
    },
    props: {
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
      taxRate: {
        type: Number,
        default: 0
      },
      remove: {
        type: Boolean,
        default: false
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      'taxRate'() {
        this.form.inputData = this.taxRate
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
          this.$refs['accessoryInputForm'].validate((valid) => {
            if (valid) {
              const taxRate = this.form.inputData.toFixed(2)
              const data = {
                taxCategory: this.taxCategory,
                taxCollection: this.taxCollection,
                taxCode: this.taxCode,
                taxRate: parseInt(taxRate)
              }
              resolve(data)
            } else {
              reject()
              return false
            }
          })
        })
      },
      // 删除按钮点击
      removeClick() {
        this.$emit('remove')
      },
      setData(item) {
        this.form.inputData = item.taxRate
      }
    },
    mounted() {
      this.form.inputData = this.taxRate
    }
  }
</script>

<style lang="scss">
.tax-discount-accessory-input {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 380px;
  margin-right: 10px;
  .el-input-group__prepend {
    width: 200px;
  }
  .el-form-item {
    margin: 10px 0;
  }
  >.el-input {
    width: 350px;
    margin: 10px 10px 0 0;
  }
}
</style>
