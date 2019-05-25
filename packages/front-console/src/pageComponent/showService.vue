<template>
  <div>
    <el-col :span="8" v-if="detail.serviceFeeContent && detail.serviceFeeContent.serviceFeeType">
        <template v-if="detail.serviceFeeContent.serviceFeeType == 'standard'">
            {{'标准报价: '+detail.serviceFeeContent.serviceFeeRate+'%'}}
        </template>
        <template v-if="detail.serviceFeeContent.serviceFeeType == 'dummy'">
            {{'无'}}
        </template>
        <template v-else-if="detail.serviceFeeContent.serviceFeeType == 'fixed'">
            {{'固定金额，每笔' + detail.serviceFeeContent.fixFee + '元'}}
        </template>
        <template v-else-if="detail.serviceFeeContent.serviceFeeType == 'ratio'">
            {{`${detail.serviceFeeContent.secondType == 'real' ? '实发金额' : '应发金额'} * ${detail.serviceFeeContent.serviceFeeRate}%`}}
        </template>
        <template v-else-if="detail.serviceFeeContent.serviceFeeType == 'step' && detail.serviceFeeContent.secondType == '0'">
            {{`分${detail.serviceFeeContent.monthIncomeAmount}万 - 无流水阶梯报价：`}}
            <div v-for="(e, i) in detail.serviceFeeContent.stepwiseList" :key="i">
                <div class="indent">
                    <span class="inline">
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
                    {{`实发金额*${e.percent}%`}}
                </div>
            </div>
        </template>
        <template v-else-if="detail.serviceFeeContent.serviceFeeType == 'step' && detail.serviceFeeContent.secondType == '1'">
            {{`不分2.8万 - 按流水总额阶梯报价：`}}
            <div v-for="(e, i) in detail.serviceFeeContent.stepwiseList" :key="i">
                <div class="indent">
                    <span class="inline">
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
                    {{`实发金额*${e.percent}%`}}
                </div>
            </div>
        </template>
        <template v-else-if="detail.serviceFeeContent.serviceFeeType == 'step' && detail.serviceFeeContent.secondType == '2'">
            {{`分${detail.serviceFeeContent.monthIncomeAmount}万 - 按流水分阶梯报价：`}}
            <div class="indent">
                {{`（1）月收入小于${detail.serviceFeeContent.monthIncomeAmount}万（含）：`}}
                <div v-for="(e, i) in detail.serviceFeeContent.stepwiseList" :key="i">
                    <div class="indent">
                        <span class="inline">
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
                        {{`实发金额*${e.percent}%`}}
                    </div>
                </div>
                {{`（2） 月收入大于${detail.serviceFeeContent2.monthIncomeAmount}万：`}}
                <div v-for="(e, i) in detail.serviceFeeContent2.stepwiseList" :key="i + 'v'">
                    <div class="indent">
                        <span class="inline">
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
                        {{`实发金额*${e.percent}%`}}
                    </div>
                </div>
            </div>
        </template>
        <template v-if="detail.serviceFeeContent.settledRate">
            {{ `结算费率：${detail.serviceFeeContent.settledRate}%` }}
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
.indent {
    text-indent: 10px
}
.inline {
    display: inline-block;
    width: 136px;
}
</style>
