<template>
    <div>
        <div class="widget-box mb20">
            <div class="widget-header">
                <!-- 落地公司名称 -->
                <h4 class="widget-title mr25">{{ serviceFeeContent.taxLandingName }} / {{ serviceFeeContent.serviceCompanyName || '落地公司名称' }}</h4>
                <div class="widget-toolbar">
                    <el-button @click="$emit('formDel', key)" type="text" size="medium" v-if="!showDelBtn">删除</el-button>
                </div>
            </div>
            <div class="widget-main">
                <el-form-item label="代理期限" :prop="`${propName}agentStart`" :rules="{ required: true, message: '请选择代理期限', trigger: 'change' }" v-if="$route.query.operateEnum === '3'">
                    <el-date-picker type="daterange" v-model="dateValue" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="dateChange"></el-date-picker>
                </el-form-item><br>
                <el-form-item label="结算费率" :prop="`${propName}subType`" :rules="{ required: true, message: '请选择结算费率类型', trigger: 'change' }">
                    <el-radio-group v-model="serviceFeeContent.subType">
                        <el-radio label="ratio" :disabled="disabled">固定比例收费</el-radio>
                        <el-radio label="nonflow">分{{serviceFeeContent.incomeAmount}}万 - 无流水阶梯报价</el-radio>
                        <el-radio label="flow">分{{serviceFeeContent.incomeAmount}}万 - 按流水分阶梯报价</el-radio>
                    </el-radio-group>
                </el-form-item><br>
                <ratio v-if="serviceFeeContent.subType === 'ratio'" :propName="propName" :feeContentMap="serviceFeeContent.feeContentMap" :incomeAmount="serviceFeeContent.incomeAmount"></ratio>
                <nonflow v-if="serviceFeeContent.subType === 'nonflow'" :propName="propName" :feeContentMap="serviceFeeContent.feeContentMap" :incomeAmount="serviceFeeContent.incomeAmount"></nonflow>
                <flow v-if="serviceFeeContent.subType === 'flow'" :propName="propName" :feeContentMap="serviceFeeContent.feeContentMap" :incomeAmount="serviceFeeContent.incomeAmount"></flow>
            </div>
        </div>
    </div>
</template>

<script>
import settlementRate from 'src/pageComponent/settlementRate'
import agentDate from './agentDate'
import ratio from './ratio'
import nonflow from './nonflow'
import flow from './flow'

export default {
    components: { settlementRate, agentDate, ratio, nonflow, flow },
    props: {
        serviceFeeContent: {
            type: Object
        },
        propName: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            dateValue: ''
        }
    },
    methods: {
        formDel(index) {
            this.$emit('formDel', index)
        },
        dateChange(ev) {
            if(ev) {
                this.serviceFeeContent.agentStart = ev[0]
                this.serviceFeeContent.agentEnd = ev[1]
            } else {
                this.serviceFeeContent.agentStart = this.serviceFeeContent.agentEnd = ''
            }
        }
    },
    created() {
        if(this.serviceFeeContent.agentStart) {
            this.dateValue = [this.serviceFeeContent.agentStart, this.serviceFeeContent.agentEnd]
        }
    }
}
</script>

