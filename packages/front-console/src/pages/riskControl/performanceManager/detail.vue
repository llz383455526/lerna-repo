<template>
    <div class="risk-control-performance-manager-detail" v-if="model">
        <p class="name">
            {{ model.companyName }}
            <span style="font-size: 12px; color: #ccc">风控明细</span>
        </p>
        <div class="section">
            <p class="title">概览</p>
            <div class="section-content">
                <el-row :gutter="20">
                    <el-col :span="6">
                        风控等级
                        <w-star style="display: inline" :count="this.model.riskLevel"></w-star>
                    </el-col>
                    <el-col :span="6">
                        限额状态
                        <span style="color: #1D7CEE;" v-if="model.riskSpecialState === '10'">有效</span>
                        <span style="color: #EC6D72;" v-else>无效</span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <div class="section">
            <p class="title">风险评级细项</p>
            <template v-if="model.companyRiskRateDTO">
                <p class="cell-title">
                    <span class="text">C端绩效计算规则</span>&nbsp;&nbsp;
                    <span style="color: rgb(26, 179, 148); cursor: pointer;" @click="cRuleStateClick">
                        {{ model.companyRiskRateDTO.cuserBalanceStandardStateName }}
                        <i class="el-icon-edit"></i>
                    </span>
                </p>
                <w-c-rule :model="model" @reload="getDetailData"/>
            </template>
            <p class="cell-title">
                <span class="text">C端绩效计算明细</span>&nbsp;&nbsp;
                <span v-if="model.companyRiskRateDTO" style="color: rgb(26, 179, 148);cursor: pointer;" @click="cDetailStateClick">
                    {{ model.companyRiskRateDTO.cuserPerformanceStateName }}
                    <i class="el-icon-edit"></i></span>
            </p>
            <w-c-detail :model="model" @reload="getDetailData"/>
            <br />
            <p class="cell-title">
                <span class="text">C端用户签约率</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <template v-if="model.companyRiskRateDTO">
                    <span>近三月C端电子签约率：{{ model.companyRiskRateDTO.cuserQuarterSignRate ? model.companyRiskRateDTO.cuserQuarterSignRate : 0  }}%</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    <span>历史C端电子签约率：{{ model.companyRiskRateDTO.cuserSignRate ? model.companyRiskRateDTO.cuserSignRate : 0 }}%</span>
                </template>
            </p>
            <w-rate-chart :model="model"/>
        </div>
        <div class="section">
            <p class="title">发放限额规则</p>
            <div class="section-content">
                <w-limit-rule ref="WLimitRule" :company-id="$route.query.id"/>
            </div>
        </div>
        <w-audit-pop ref="WAuditPop" @reload="getDetailData"></w-audit-pop>
        <div>
            <el-button size="small" @click="$router.go(-1)">返回</el-button>
            <el-button size="small" type="primary" @click="executedImmediatelyClick">立即执行</el-button>
        </div>
    </div>
</template>

<script>
    import WLimitRule from '../../../component/fengkong/limitRule'
    import WRateChart from './com/rateChart'
    import WCRule from './com/cRule'
    import WCDetail from './com/cDetail'
    import {get, post} from "../../../store/api";
    import WStar from '../../../component/star'
    import WAuditPop from './com/auditPop'
    export default {
        name: "detail",
        components: {
            WLimitRule,
            WRateChart,
            WCRule,
            WCDetail,
            WStar,
            WAuditPop
        },
        data() {
            return {
                model: null
            }
        },
        methods: {
            getDetailData() {
                get('/api/console-dlv/risk_level_degrade/risk-level-degrade-detail', {
                    companyId: this.$route.query.id
                }).then((data) => {
                    this.model = data
                }).catch(() => {})
            },
            // C端绩效规则点击
            cRuleStateClick() {
                this.$refs.WAuditPop.show({
                    url: '/risk-level-approve/cuser-balance-standard-approve',
                    stateKey: 'cuserBalanceStandardState',
                    id: this.model.companyRiskRateDTO.id,
                    stateArr: ['success', 'fail']
                })
            },
            cDetailStateClick() {
                this.$refs.WAuditPop.show({
                    url: '/risk-level-approve/cuser-performance-approve',
                    stateKey: 'cuserPerformanceState',
                    id: this.model.companyRiskRateDTO.id,
                    stateArr: ['success', 'fail']
                })
            },
            executedImmediatelyClick() {
                this.$confirm('企业星级限额会立即更新生效，是否立即执行?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消'
                }).then(() => {
                    get('/api/console-dlv/risk_level_degrade/refresh-company-risk-level', {
                        companyId: this.$route.query.id
                    }).then(() => {
                        this.$message({
                            message: '执行成功',
                            type: 'success'
                        });
                        this.getDetailData()
                        this.$refs.WLimitRule.getListData()
                    }).catch(() => {})
                }).catch(() => {});
            }
        },
        mounted() {
            this.getDetailData()
        }
    }
</script>

<style scoped lang="scss">
    .risk-control-performance-manager-detail {
        padding: 1px 15px 15px 15px;
        background-color: #fff;
        >.name {
            color: rgba(16, 16, 16, 1);
            font-size: 22px;
        }
        .section {
            padding-bottom: 20px;
            .title {
                color: rgba(16, 16, 16, 1);
                font-size: 18px;
                border-left: 4px solid rgb(29, 124, 238);
                padding-left: 10px;
                margin-left: 0;
            }
            .section-content {
                padding-left: 14px;
            }
            .cell-title {
                margin: 0;
                color: rgba(16, 16, 16, 1);
                font-size: 16px;
                .text {
                    padding: 4px;
                    background-color: rgba(249, 249, 249, 1);
                }
            }
        }
    }
</style> 8