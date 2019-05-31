<template>
  <el-form
    :model="settlementRateInfo || form"
    label-width="100px"
  >
    <el-form-item
      label="结算费率"
    >
      <el-radio-group v-model="a">
        <el-radio
          label="ratio"
        >
          固定费率结算
        </el-radio>
        <el-radio
          label="step1"
        >
          {{ `分${settlementRateInfo.incomeAmount}万 - 无流水阶梯结算` }}
        </el-radio>
        <el-radio
          label="step2"
        >
          {{ `分${settlementRateInfo.incomeAmount}万 - 按流水分阶梯结算` }}
        </el-radio>
      </el-radio-group>
      <!-- 固定费率 -->
      <radio-fee v-if="a" />
      <!--  -->
    </el-form-item>
  </el-form>
</template>


<script>
import radioFee from './ratioFee'
import Form from 'src/model/settlementRate'

export default {
    components: {radioFee},
    props: {
       settlementRateInfo: {
           type: Object
       } 
    },
    computed: {
        form() {
            return 
        }
    },
    data() {
        return {
           settlementRate : new Form()
        }
    },
    created() {
        console.log(this.settlementRateInfo)
    }
}
</script>

<style lang="scss" scoped>

</style>
