<template>
    <div class="cost-limit-add-rule">
        <div>{{ $route.query.show ? '查看' : ($route.query.ruleid ? '修改' : '添加') }}规则</div>
        <br>
        <el-form :disabled="$route.query.show == 'true'" ref="form" :model="form" label-width="100px" size="mini">
            <el-form-item label="选择落地公司">
                <el-select
                    :disabled="$route.query.ruleid ? true : false"
                    v-model="serviceCompanyId"
                    filterable
                    placeholder="请选择"
                    @change="shuiYouDiChange">
                    <el-option
                        v-for="item in luoDiGongSiArr"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <w-server-rule @okBtnClick="okBtnClick" ref="WServerRule"></w-server-rule>
    </div>
</template>

<script>
    import {get, post} from "../../../store/api";
    import WServerRule from './serverRule'

    export default {
        name: "addRule",
        components: {
            WServerRule
        },
        data() {
            return {
                // 税优地列表
                luoDiGongSiArr: [],
                // 选择的税优地
                serviceCompanyId: null
            }
        },
        methods: {
            // 税优地改变的时候调用
            shuiYouDiChange(id) {
                get('/api/console-dlv/risk-special/get-risk-special-risk-pack-template', {
                    customerCompanyId: this.$route.query.id,
                    serviceCompanyId: id
                }).then((data) => {
                    this.$refs['WServerRule'].setTemplate(data)
                }).catch((e) => {
                    console.log('e = ', e)
                    this.$refs['WServerRule'].clear()
                })
            },
            // 获取税优地
            getAllLocation(current = []) {
                const promiseArr = [
                    // 获取所有落地公司
                    get('/api/sysmgr-web/commom/company?companyIdentity=service'),
                    // 获取已经选中的落地公司
                    get('/api/console-dlv/risk-special/risk-special-checked-service-company', {companyId: this.$route.query.id})
                ]
                if (this.$route.query.ruleid) {
                    promiseArr.push(get('/api/console-dlv/risk-special/get-risk-special-risk-pack-detail', {
                        riskPackId: this.$route.query.ruleid
                    }))
                }
                Promise.all(promiseArr).then((data) => {
                    const arrSet = new Set(data[1])
                    if (data.length === 3) {
                        this.$refs['WServerRule'].dataParsing(data[2])
                        this.serviceCompanyId = data[2].serviceCompanyIds[0]
                        this.luoDiGongSiArr = data[0]
                    } else {
                        this.luoDiGongSiArr = data[0].filter((item) => {
                            return !arrSet.has(item.id)
                        })
                    }
                }).catch(() => {
                })
            },
            /**
             * 确定按钮点击
             */
            okBtnClick() {
                if (!this.serviceCompanyId) {
                    this.$message({
                        showClose: true,
                        message: '请选择落地公司',
                        type: 'error'
                    });
                    return
                }

                this.$refs['WServerRule'].check().then((ruledata) => {
                    console.log(ruledata)

                    let p = {
                        state: '10',
                        serviceCompanyId: this.serviceCompanyId,
                    }
                    if (this.$route.query.ruleid) {
                        p.riskPackId = this.$route.query.ruleid
                        p.serviceTypeRiskEditParamList = ruledata.rule.map((item) => {
                            return {
                                serviceTypeIds: item.serviceTypeIds,
                                serviceTypeIds: item.serviceTypeIds,
                                riskRuleEditParamList: item.riskRuleEditParamList
                            }
                        })
                        p.riskMaxEditParamList = ruledata.limit
                    } else {
                        p.companyId = this.$route.query.id
                        p.serviceTypeRiskAddParamList = ruledata.rule.map((item) => {
                            return {
                                serviceTypeIds: item.serviceTypeIds,
                                riskRuleAddParamList: item.riskRuleEditParamList
                            }
                        })
                        p.riskMaxAddParamList = ruledata.limit.map((item) => {
                            return {
                                refuseExpression: item.refuseExpression,
                                refuseLimit: item.refuseLimit,
                                riskRuleType: item.riskRuleType,
                            }
                        })
                    }

                    const url = this.$route.query.ruleid ? '/api/console-dlv/risk-special/risk-special-pack-edit' : '/api/console-dlv/risk-special/risk-special-pack-add'
                    post(url, p).then(() => {
                        this.$message({
                            showClose: true,
                            message: this.$route.query.ruleid ? '修改成功' : '添加成功',
                            type: 'success'
                        });
                        this.$router.replace(`/main/orderManager/costLimitDetail?id=${this.$route.query.id}`)
                    }).catch(() => {
                    })
                }).catch((e) => {
                    console.log('e1 = ', e)
                })
            },
            // 获取详情数据
            getDetail() {
                if (this.$route.query.ruleid) {
                    get('/api/console-dlv/risk-special/get-risk-special-risk-pack-detail', {
                        riskPackId: this.$route.query.ruleid
                    }).then((data) => {
                        this.getAllLocation(data.taxLandingIds)
                        this.shuiYouDi = data.serviceCompanyIds[0]
                        this.$refs['WServerRule'].setDetailData(data)
                        this.shuiYouDiChange(this.shuiYouDi)
                    }).catch(() => {
                    })
                } else {
                    this.getAllLocation()
                }
            }
        },
        mounted() {
            this.getDetail()
        }
    }
</script>

<style lang="scss" scoped>
    .cost-limit-add-rule {
        background-color: #fff;
        margin: 20px 0;
        padding: 20px;
    }
</style>
