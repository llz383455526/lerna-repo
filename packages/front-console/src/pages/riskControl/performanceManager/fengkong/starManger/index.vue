<template>
    <div class="new-contract-star-manger" v-if="model">
        <div class="">
            {{ model.companyName }}
            <span style="font-size: 12px; color: #999">星级明细</span>
        </div>
        <div class="section c-count-rule" v-if="model.companyRiskRateDTO">
            <p class="title">
                C端绩效计算规则: &nbsp;
                <span style="color: #1AB394">{{ model.companyRiskRateDTO.cuserBalanceStandardStateName }}</span>
            </p>
            <br>
            <w-c-rule :model="model" @reload="getDetailData"/>
        </div>
        <div class="section">
            <p class="title" v-if="model.companyRiskRateDTO">
                <span>季度C端电子签约率：{{ model.companyRiskRateDTO.cuserQuarterSignRate ? model.companyRiskRateDTO.cuserQuarterSignRate : 0 }}%</span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                <span>历史C端电子签约率：{{ model.companyRiskRateDTO.cuserSignRate ? model.companyRiskRateDTO.cuserSignRate : 0 }}%</span>
            </p>
            <w-contract-rate-chart :model="model" />
        </div>
        <div class="section">
            <p class="title">
                C端绩效费计算明细: &nbsp;
                <span v-if="model.companyRiskRateDTO" style="color: #1AB394">{{ model.companyRiskRateDTO.cuserPerformanceStateName }}</span>
            </p>
            <br>
            <w-c-performance :model="model" @reload="getDetailData" />
        </div>
        <w-pop ref="WPop"/>
        <el-button size="small" @click="$router.go(-1)">返回</el-button>
    </div>
</template>

<script>
    import WContractRateChart from './contractRateChart'
    import WCPerformance from './cPerformance'
    import WPop from './pop'
    import {post, get} from "../../../../../store/api"
    import WCRule from './cRule'

    export default {
        name: "PerformanceManagerStarManger",
        components: {
            WContractRateChart,
            WCPerformance,
            WPop,
            WCRule
        },
        data() {
            return {
                starTableData: [
                    {
                        conditions: 'C端绩效计算规则',
                        five: '审核通过',
                        four: '通过',
                        three: '不通过'
                    },
                    {
                        conditions: 'C端电子签约率',
                        five: '大于50%',
                        four: '不限',
                        three: '低于50%'
                    },
                    {
                        conditions: 'C端绩效费计算明细',
                        five: '审核通过',
                        four: '不限',
                        three: '不通过'
                    },
                    {
                        conditions: '发放额度',
                        five: '高',
                        four: '中等',
                        three: '低'
                    },
                ],
                // 当前星级
                star: 'three-star',
                model: null
            }
        },
        methods: {
            popShowClick() {
                this.$refs.WPop.show()
            },
            getDetailData() {
                get('/api/console-dlv/risk_level_degrade/risk-level-degrade-detail', {
                    companyId: this.$route.query.id
                }).then((data) => {
                    this.model = data
                }).catch(() => {
                })
            }
        },
        mounted() {
            this.getDetailData()
        }
    }
</script>

<style scoped lang="scss">
    .new-contract-star-manger {
        background-color: #fff;
        padding: 20px;

        .section {
            background-color: rgba(249, 249, 249, 1);
            border: 1px solid rgba(255, 255, 255, 0);
            margin: 20px 0;
            padding: 15px;

            .title {
                color: rgba(58, 58, 58, 1);
                font-size: 18px;
                border-left: 4px solid rgb(29, 124, 238);
                padding-left: 15px;
                margin: 0;
            }
        }

        .c-count-rule {
            min-height: 200px;
            .title {
                display: flex;
            }

            .step-box {
                margin-left: 30px;
                width: 400px;
                padding: 0;
                background: rgba(0, 0, 0, 0);
            }

            .content-box {
                display: flex;

                .up-file-box {
                    width: 200px;
                    display: flex;
                    align-items: center;
                    flex-direction: column;

                    .icon {
                        width: 60px;
                        height: 60px;
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        border: 1px solid rgba(187, 187, 187, 1);
                        font-size: 24px;
                        color: rgba(187, 187, 187, 1);
                    }

                    .text {
                        color: rgba(187, 187, 187, 1);
                        font-size: 16px;
                    }
                }

                .gongsi-box {
                    .wait-gongsi {
                        display: flex;

                        .wait-title {
                            color: rgba(16, 16, 16, 1);
                            font-size: 16px;
                            padding-top: 5px;
                            width: 140px;
                            flex: 1 0 auto;
                        }

                        .gongsi-list {
                            list-style: none;
                            display: flex;
                            margin: 0;
                            padding: 0;
                            flex-wrap: wrap;

                            .cell {
                                line-height: 20px;
                                color: rgba(204, 204, 204, 1);
                                font-size: 14px;
                                border: 1px dashed rgba(204, 204, 204, 1);
                                padding: 5px 8px;
                                margin-left: 10px;
                                margin-bottom: 10px;
                            }
                        }
                    }
                }
            }

            .rule-list {
                list-style: none;
                margin: 0;
                padding: 0;

                .cell {
                    padding: 5px 0;

                    .gongsi {
                        color: rgba(0, 0, 0, 1);
                        font-size: 18px;
                    }

                    .yulan {
                        color: rgba(29, 124, 238, 1);
                        font-size: 18px;
                        cursor: pointer;
                    }

                    .audit-state {
                        color: rgba(26, 179, 148, 1);
                        font-size: 18px;
                    }

                    .time {
                        color: rgba(187, 187, 187, 1);
                        font-size: 18px;
                    }
                }
            }
        }
    }
</style>
<style lang="scss">
    .new-contract-star-manger {
        .star-box {
            .has-gutter {
                th {
                    background-color: rgba(249, 249, 249, 1) !important;
                }
            }

            .el-table__row:last-child {
                .cell {
                    color: rgba(29, 124, 238, 1);
                }
            }

            .action {
                .cell {
                    color: rgba(26, 179, 148, 1) !important;
                }
            }
        }

        .c-count-rule {
            .el-step__head {
                display: none;
            }
        }
    }
</style>
