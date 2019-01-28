<template>
  <div>
    <el-col :span="16" v-if="detail.quoteFeeContent && detail.quoteFeeContent.quoteFeeType">
        <template v-if="detail.quoteFeeContent.quoteFeeType == 'ratio'">
            {{`固定费率${(detail.quoteRule == '' || detail.quoteRule == 'settle') ? '结算' : '返佣'}: ${detail.quoteFeeContent.quoteFeeRate}%`}}
        </template>
        <template v-else-if="detail.quoteFeeContent.quoteFeeType == 'nonflow'">
            {{`${detail.quoteFeeContent.stepwiseList[0].endAmount}万 - 无流水阶梯${(detail.quoteRule == '' || detail.quoteRule == 'settle') ? '结算' : '返佣'}：`}}
            <div v-for="(e, i) in detail.quoteFeeContent.stepwiseList" :key="i">
                <div class="pl10">
                    <span >
                        <template v-if="!e.startAmount && !i">
                            {{`${e.endAmount}万（含）以下，实发金额*${e.percent}%`}}
                        </template>
                        <template v-else-if="!e.endAmount">
                            {{`${e.startAmount}万以上，实发金额*${e.percent}%`}}
                        </template>
                    </span>
                </div>
            </div>
        </template>
        <template v-else-if="detail.quoteFeeContent.quoteFeeType == 'flow'">
            {{`分${detail.quoteFeeContent.incomeAmount}万 - 按流水分阶梯${(detail.quoteRule == '' || detail.quoteRule == 'settle') ? '结算' : '返佣'}：`}}
            <div class="pl10">
                {{`（1）${detail.quoteFeeContent.incomeAmount}万（含）以下：`}}
                <div v-for="(e, i) in detail.quoteFeeContent.stepwiseList" :key="i">
                    <div class="pl10">
                        <span >
                            <template v-if="!e.startAmount && !i">
                                {{`小于${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}
                            </template>
                            <template v-else-if="e.startAmount && e.endAmount">
                                {{`${e.startAmount}万${e.equalsStart ? '（含）' : ''}~${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}
                            </template>
                            <template v-else-if="!e.endAmount">
                                {{`大于${e.startAmount}万${e.equalsStart ? '（含）' : ''}`}}
                            </template>
                        </span>
                        {{`，实发金额*${e.percent}%`}}
                    </div>
                </div>
                {{`（2）${detail.quoteFeeContent.incomeAmount}万以上：`}}
                <div class="pl10" v-for="(e, i) in detail.quoteFeeContent.serviceCompanyRateList" >
                  {{e.serviceCompanyName}}，实发金额*{{e.feeRateContent.quoteFeeRate}}
                </div>
            </div>
        </template>
    </el-col>
  </div>
</template>
<script>
export default {
  props: {
    detail: {
      type: Object,
      default: {}
    }
  }
}
</script>
<style scoped>
.pl10 {
    padding-left: 10px
}
.inline {
    display: inline-block;
    width: 136px;
}
</style>
