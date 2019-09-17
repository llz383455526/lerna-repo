<template lang="html">
<div class="">
  <el-row class="mb15">
    <el-col :span="24">
      <el-radio label="3" v-model="serviceFeeInterval.secondType" @change="secondTypeChange">分2.8万-9.3万 - 无流水阶梯报价</el-radio>
    </el-col>
    <el-col :span="24" v-show="serviceFeeInterval.secondType === '3'">
      <intervalSetting ref="intervalSetting" :serviceFeeInterval="contractForm.serviceFeeInterval"></intervalSetting>
    </el-col>
  </el-row>
  <el-row class="mb15">
    <el-col :span="24">
      <el-radio label="4" v-model="serviceFeeInterval.secondType" @change="secondTypeChange">分2.8万-9.3万 - 按流水分阶梯报价</el-radio>
    </el-col>
    <el-col :span="24" v-show="serviceFeeInterval.secondType === '4'">
      <gradientSetting ref="gradientSetting"
                       :serviceFeeInterval="serviceFeeInterval"></gradientSetting>
    </el-col>
  </el-row>
</div>
</template>

<script>
import intervalSetting from '../intervalSetting'
import gradientSetting from '../gradientSetting'
import _ from 'lodash'

export default {
	components: {
		intervalSetting,
    gradientSetting,
	},
  props: {
    contractForm: {
      type: Object,
    },
  },
  computed: {
    serviceFeeInterval: {
      get() {
        return this.contractForm.serviceFeeInterval
      },
      set(val) {
        // console.log(val)
      }
    },
  },
  methods: {
    secondTypeChange(e) {
      this.serviceFeeInterval.settledRate = ''
      this.$emit('secondTypeChange', e)
    },
    validate(cb) {
      if (this.serviceFeeInterval.secondType == '3') {
        if (this.$refs['intervalSetting']) {
          this.$refs['intervalSetting'].validate((valid) => {
            this.serviceFeeInterval.settledRate = valid.settledRate
            this.serviceFeeInterval.serviceFeeContent = valid.serviceFeeContent
            cb(valid ? {
              serviceFeeInterval: this.serviceFeeInterval,
            } : false)
          })
        }
      } else if (this.serviceFeeInterval.secondType == '4') {
        if (this.$refs['gradientSetting']) {
          this.$refs['gradientSetting'].validate((valid) => {
            const serviceFeeInterval = _.assign({serviceFeeType: 'step'}, this.serviceFeeInterval, valid)
            cb(valid ? {
              serviceFeeInterval,
            } : false)
          })
        }
      } else {
        cb(false)
      }
    }
  },
  mounted() {
    if (this.contractForm.serviceFeeInterval) {
      this.serviceFeeInterval = this.contractForm.serviceFeeInterval
      if (this.serviceFeeInterval.secondType == '3') {
        this.$refs['intervalSetting'].initData(this.contractForm)
      }
    }
  },
}
</script>

<style lang="css" scoped>
</style>
