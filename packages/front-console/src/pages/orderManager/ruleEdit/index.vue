<template>
    <div class="rule-edit">
        <div>{{ this.$route.query.id ? '修改规则' : '添加规则' }}</div>
        <w-options
            ref="WOption"
            id-name="id"
            title="落地公司"
            :input-arr="shuiYouDiArr"
            name="name"></w-options>
        <w-server-rule :show-rule="$route.query.star === 'three-star'" @okBtnClick="okBtnClick" ref="WServerRule"/>
    </div>
</template>

<script>
    import {get, post} from "../../../store/api";
    import WOptions from '../com/options/index'
    import WServerRule from '../com/serverRule'

    export default {
        name: "ruleEdit",
        components: {
            WOptions,
            WServerRule
        },
        data() {
            return {

                /**
                 * 详情数据
                 */
                detailData: null,

                /**
                 * 税优地数组
                 */
                shuiYouDiArr: []
            }
        },
        methods: {
            getEnabledState() {
                get('/api/console-dlv/option/get-by-types?type=RiskRulePackState').then(() => {
                }).catch(() => {
                })
            },
            /**
             * 数据校验
             */
            check() {
                return new Promise((resolve, reject) => {
                    this.$refs['WOption'].check().then((types) => {
                        this.$refs['WServerRule'].check().then((ruledata) => {
                            const serviceCompanyIds = types.map((item) => {
                                return item.id
                            })
                            resolve({
                                serviceCompanyIds,
                                serviceTypeRiskAddParamList: ruledata.rule,
                                riskMaxAddParamList: ruledata.limit
                            })
                        }).catch(() => {
                        })
                    }).catch(() => {
                        reject()
                    })
                })
            },
            /**
             * 确定按钮点击
             */
            okBtnClick() {
                this.check().then((ruledata) => {
                    let p = {}
                    if (this.$route.query.id) {
                        p.riskRulePackId = this.$route.query.id
                        p.taxLandingIds = ruledata.taxLandingIds
                        p.serviceTypeRiskEditParamList = ruledata.serviceTypeRiskAddParamList.map((item) => {
                            return {
                                serviceTypeIds: item.serviceTypeIds,
                                riskRuleEditParamList: item.riskRuleAddParamList
                            }
                        })
                        p.level = this.$route.query.star
                        p.riskMaxEditParamList = ruledata.riskMaxAddParamList
                        p.serviceCompanyIds = ruledata.serviceCompanyIds
                    } else {
                        p = {
                            level: this.$route.query.star,
                            state: '10',
                            ...ruledata
                        }
                    }
                    const url = this.$route.query.id ? '/api/console-dlv/risk-level/edit-risk-rule-pack' : '/api/console-dlv/risk-level/add-risk-rule-pack'
                    post(url, p).then(() => {
                        this.$message({
                            showClose: true,
                            message: this.$route.query.id ? '修改成功' : '添加成功',
                            type: 'success'
                        });
                        this.$router.go(-1)
                    }).catch(() => {
                    })
                }).catch(() => {
                })
            },
            // 获取详情
            getDetail() {
                const promiseArr = [
                    // 获取所有落地公司
                    get('/api/sysmgr-web/commom/company?companyIdentity=service'),
                    // 获取已经选中的落地公司
                    get('/api/console-dlv/risk-level/risk-level-checked-service-company', {level: this.$route.query.star})
                ]
                if (this.$route.query.id) {
                    promiseArr.push(get('/api/console-dlv/risk-level/risk-rule-pack-detail', {
                        riskRulePackId: this.$route.query.id
                    }))
                }
                Promise.all(promiseArr).then((data) => {
                    const arrSet = new Set(data[1])
                    if (data.length === 3) {
                        data[2].serviceCompanyIds.forEach((item) => {
                            if (arrSet.has(item)) {
                                arrSet.delete(item)
                            }
                        })
                        this.detailData = data[2]
                        this.$refs['WOption'].setSelData(data[2].serviceCompanyIds)
                        this.$refs['WServerRule'].dataParsing(data[2])
                    }
                    this.shuiYouDiArr = data[0].filter((item) => {
                        return !arrSet.has(item.id)
                    })
                }).catch(() => {
                })
            },

        },
        mounted() {
            this.getDetail()
            // this.getEnabledState()
        }
    }
</script>

<style lang="scss" scoped>
    .rule-edit {
        margin: 20px 0;
        padding: 20px;
        background-color: #fff;

        .bottom-show {
            p {
                margin: 0;
                color: #999;
                padding: 5px 0;
            }
        }
    }
</style>
