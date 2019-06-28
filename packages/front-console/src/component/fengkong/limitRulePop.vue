<template>
    <div>
        <el-dialog
            :title="title"
            :visible.sync="isShow"
            width="1000px">
            <div class="pop-content cost-limit-add-rule-pop">
                <div class="section">
                    <p class="title">落地公司限额</p>
                    <br/>
                    <el-form :inline="true" class="demo-form-inline" size="mini">
                        <el-form-item :label="v.title" v-for="(v, k) in gongsiLimitArr" :key="k">
                            <el-input style="width: 120px;" v-model="v.refuseLimit" type="number"
                                      placeholder="发放限额"></el-input>
                        </el-form-item>
                    </el-form>
                </div>
                <br />
                <div class="section">
                    <p class="title">服务类型限额</p>
                    <br/>
                    <el-row :gutter="20">
                        <el-col :span="3">选择服务类型</el-col>
                        <el-col :span="21">
                            <el-checkbox-group v-model="currentSelServerType">
                                <el-checkbox
                                    style="padding-bottom: 10px;"
                                    v-for="item in optionalServiceType"
                                    :key="item.serviceId"
                                    :label="item.serviceId"
                                >
                                    {{item.serviceName}}
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-row>
                    <br/>
                    <el-form :inline="true" :model="serverTypeForm" class="demo-form-inline" size="mini">
                        <el-form-item label="单人笔(万)">
                            <el-input style="width: 120px;" v-model="serverTypeForm.unit_limit" type="number"
                                      placeholder="发放限额"></el-input>
                        </el-form-item>
                        <el-form-item label="单人日(万)">
                            <el-input style="width: 120px;" v-model="serverTypeForm.day_limit" type="number"
                                      placeholder="发放限额"></el-input>
                        </el-form-item>
                        <el-form-item label="单人月(万)">
                            <el-input style="width: 120px;" v-model="serverTypeForm.month_limit" type="number"
                                      placeholder="发放限额"></el-input>
                        </el-form-item>
                        <el-form-item label="单人年(万)">
                            <el-input style="width: 120px;" v-model="serverTypeForm.year_limit" type="number"
                                      placeholder="发放限额"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="addBtnClick">添加</el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <br/>
                <template v-if="allServiceTypeOptions.length > 0">
                    <div class="divider-box">
                        <span class="line"></span>
                        <span class="text">已添加规则</span>
                        <span class="line"></span>
                    </div>
                    <br/>
                    <div v-for="(item, index) in serverTypeRuleArr" :key="index" class="added-rule-box">
                        <ul class="server-type-list">
                            <li class="item" v-for="v in item.serviceTypeModels">
                                {{ v.serviceName }}
                            </li>
                        </ul>
                        <el-row :gutter="20">
                            <el-col :span="5">
                                <span class="title">单人笔(万)</span>
                                <span class="num">{{ searchItem(item, 'unit_limit') }}</span>
                            </el-col>
                            <el-col :span="5">
                                <span class="title">单人日(万)</span>
                                <span class="num">{{ searchItem(item, 'day_limit') }}</span>
                            </el-col>
                            <el-col :span="5">
                                <span class="title">单人月(万)</span>
                                <span class="num">{{ searchItem(item, 'month_limit') }}</span>
                            </el-col>
                            <el-col :span="5">
                                <span class="title">单人年(万)</span>
                                <span class="num">{{ searchItem(item, 'year_limit') }}</span>
                            </el-col>
                            <el-col :span="3">
                                <i class="el-icon-delete" style="color: #BBBBBB; cursor: pointer;"
                                   @click="removeTypeClick(index)"></i>
                            </el-col>
                        </el-row>
                        <br/>
                    </div>
                </template>
            </div>
            <span slot="footer" class="dialog-footer">
                <el-button @click="isShow = false" size="mini">取 消</el-button>
                <el-button type="primary" @click="okBtnClick" size="mini">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import {get, post} from "../../store/api";

    export default {
        name: "pop",
        props: {

            companyId: {
                type: String | Number,
                default: ''
            },
        },
        data() {
            return {
                isShow: false,
                title: null,
                // 落地公司限额
                gongsiLimitArr: [
                    {
                        title: '单人笔(万)',
                        refuseExpression: '>',
                        refuseLimit: '',
                        riskRuleType: 'unit_limit_max',
                        riskRuleId: ''
                    },
                    {
                        title: '单人日(万)',
                        refuseExpression: '>',
                        refuseLimit: '',
                        riskRuleType: 'day_limit_max',
                        riskRuleId: ''
                    },
                    {
                        title: '单人月(万)',
                        refuseExpression: '>',
                        refuseLimit: '',
                        riskRuleType: 'month_limit_max',
                        riskRuleId: ''
                    },
                    {
                        title: '单人年(万)',
                        refuseExpression: '>',
                        refuseLimit: '',
                        riskRuleType: 'year_limit_max',
                        riskRuleId: ''
                    }
                ],
                // 所有的服务类型
                allServiceTypeOptions: [],
                // 可选的服务类型
                optionalServiceType: [],
                // 当前选择的服务类型
                currentSelServerType: [],
                // 服务类型输入框
                serverTypeForm: {
                    unit_limit: '',
                    day_limit: '',
                    month_limit: '',
                    year_limit: '',
                },
                // 服务类型数组
                serverTypeRuleArr: [],
                // 落地公司ID
                serviceCompanyId: null,
                // 详情数据
                detailData: null,
            }
        },
        methods: {
            async show(model) {
                console.log(model)
                this.title = model.serviceCompanyName
                this.serviceCompanyId = model.serviceCompanyId
                await this.getServiceTypeOptions()
                this.getDetail()
                this.isShow = true
            },
            // 获取详情数据
            getDetail() {
                post('/api/console-dlv/risk-special/get-customer-service-risk-special-risk-pack-detail', {
                    "customerCompanyId": this.companyId,
                    "serviceCompanyId": this.serviceCompanyId
                }).then((data) => {
                    this.detailData = data
                    this.clearGongSiData()
                    this.serverTypeRuleArr = []
                    if (data) {
                        this.setGongSiData()
                        this.setServerTypeData()
                    }
                    this.countRemainingServerType()
                }).catch(() => {
                })
            },
            // 清除公司数字局
            clearGongSiData() {
                this.gongsiLimitArr.forEach((item) => {
                    item.refuseLimit = ''
                })
            },
            // 设置公司数据
            setGongSiData() {
                this.gongsiLimitArr.forEach((item) => {
                    item.riskRuleId = ''
                    item.refuseLimit = ''
                    this.detailData.riskMaxEditParamList.forEach((item1) => {
                        if (item1.riskRuleType === item.riskRuleType) {
                            item.refuseLimit = item1.refuseLimit
                            item.riskRuleId = item1.riskRuleId
                        }
                    })
                })
            },
            // 设置服务类型数据
            setServerTypeData() {
                this.detailData.serviceTypeRiskEditParamList.forEach((item) => {
                    const setServerTypes = new Set(item.serviceTypeIds)
                    const serviceTypeModels = this.allServiceTypeOptions.filter((item) => {
                        return setServerTypes.has(item.serviceId)
                    })
                    item.serviceTypeModels = serviceTypeModels
                })
                this.serverTypeRuleArr = this.detailData.serviceTypeRiskEditParamList
            },
            async getServiceTypeOptions() {
                const data  = await post('/api/console-dlv/risk-special/customer-service-type-list', {
                    "customerCompanyId": this.companyId,
                    "serviceCompanyId": this.serviceCompanyId
                })
                this.allServiceTypeOptions = data
            },
            addBtnClick() {
                if (this.currentSelServerType.length === 0) {
                    this.$message({
                        message: '请选择服务类型',
                        type: 'warning'
                    });
                    return
                }
                if (!(this.serverTypeForm.unit_limit || this.serverTypeForm.day_limit || this.serverTypeForm.month_limit || this.serverTypeForm.year_limit)) {
                    this.$message({
                        message: '至少填写一个服务类型限额',
                        type: 'warning'
                    });
                    return
                }
                const rules = []
                for (const key in this.serverTypeForm) {
                    const value = this.serverTypeForm[key]
                    if (value) {
                        rules.push({
                            refuseExpression: '>',
                            refuseLimit: parseFloat(value).toFixed(2),
                            riskRuleType: key,
                            serviceTypeIds: this.currentSelServerType
                        })
                    }
                }
                // 获取当前选择的服务类型模型
                const setServerTypes = new Set(this.currentSelServerType)
                const serviceTypeModels = this.optionalServiceType.filter((item) => {
                    return setServerTypes.has(item.serviceId)
                })
                const serverTypeModel = {
                    riskRuleEditParamList: rules,
                    serviceTypeIds: this.currentSelServerType,
                    serviceTypeModels: serviceTypeModels
                }
                // 清除数据
                this.serverTypeForm = {
                    unit_limit: '',
                    day_limit: '',
                    month_limit: '',
                    year_limit: '',
                }
                this.currentSelServerType = []
                this.serverTypeRuleArr.push(serverTypeModel)
                this.countRemainingServerType()
            },
            // 根据数组查询类型条目数据
            searchItem(data, key) {
                const riskRuleEditParamList = data.riskRuleEditParamList
                for (let i = 0; i < riskRuleEditParamList.length; i++) {
                    const item = riskRuleEditParamList[i]
                    if (item.riskRuleType === key) {
                        return item.refuseLimit
                    }
                }
                return '--'
            },
            // 计算剩余的服务类型
            countRemainingServerType() {
                const serverTypeSet = new Set()
                this.serverTypeRuleArr.forEach((item) => {
                    item.serviceTypeIds.forEach((item2) => {
                        serverTypeSet.add(item2)
                    })
                })
                this.optionalServiceType = this.allServiceTypeOptions.filter((item) => {
                    return !serverTypeSet.has(item.serviceId)
                })
            },
            removeTypeClick(index) {
                this.serverTypeRuleArr.splice(index, 1)
                this.countRemainingServerType()
            },
            okBtnClick() {
                let riskMaxParamList = this.gongsiLimitArr.filter((item) => {
                    return item.refuseLimit && item.refuseLimit > 0
                })
                if (riskMaxParamList.length === 0) {
                    this.$message({
                        message: '至少填写一个落地公司限额',
                        type: 'warning'
                    });
                    return
                }
                riskMaxParamList = riskMaxParamList.map((item) => {
                    return {
                        refuseExpression: item.refuseExpression,
                        refuseLimit: parseFloat(item.refuseLimit).toFixed(2),
                        riskRuleType: item.riskRuleType,
                        riskRuleId: item.riskRuleId ? item.riskRuleId : undefined
                    }
                })
                const serviceTypeRiskParamList = this.serverTypeRuleArr.map((item) => {
                    const p = {
                        serviceTypeIds: item.serviceTypeIds
                    }
                    p[this.detailData ? 'riskRuleEditParamList' : 'riskRuleAddParamList'] = item.riskRuleEditParamList
                    return p
                })
                const p = {
                    customerCompanyId: this.companyId,
                    serviceCompanyId: this.serviceCompanyId,
                    state: '10'
                }
                p[this.detailData ? 'riskMaxEditParamList' : 'riskMaxAddParamList'] = riskMaxParamList
                p[this.detailData ? 'serviceTypeRiskEditParamList' : 'serviceTypeRiskAddParamList'] = serviceTypeRiskParamList
                post(`/api/console-dlv/risk-special/risk-special-pack-${this.detailData ? 'edit' : 'add'}`, p).then((data) => {
                    this.isShow = false
                    this.$emit('reload')
                }).catch(() => {
                })
            }
        },
    }
</script>

<style scoped lang="scss">
    .pop-content {
        .section {
            .title {
                padding-left: 8px;
                border-left: 4px solid #1D7CEE;
                margin: 0;
            }
        }

        .divider-box {
            display: flex;
            justify-content: center;
            align-items: center;
            color: #ccc;

            .line {
                flex: 1 0 auto;
                height: 1px;
                background-color: #ccc;
            }

            .text {
                padding: 0 10px;
            }
        }

        .server-type-list {
            padding-left: 30px;
            margin: 0;
            list-style: none;
            display: flex;
            flex-wrap: wrap;

            .item {
                margin-right: 10px;
                margin-bottom: 8px;
            }
        }
    }
    .added-rule-box {
        .title {
            font-size: 12px;
            font-weight: 900;
        }
    }
</style>
<style lang="scss">
.cost-limit-add-rule-pop {
    .el-form-item__label {
        font-size: 12px;
        font-weight: 900;
    }
}
</style>