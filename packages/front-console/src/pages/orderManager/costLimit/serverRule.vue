<template>
    <div>
        <div style="padding: 20px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
            请针对落地公司配置最高限额
        </div>
        <el-table
            :data="maxLimits"
            border
            style="width: 100%">
            <el-table-column
                prop="title">
                <template slot-scope="scope">
                    <span>{{ scope.row.text }}(万元)</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="title"
                label="拒绝发放限制">
                <template slot-scope="scope">
                    <el-input
                        type="number"
                        style="width: 150px"
                        :disabled="$route.query.show == 'true'"
                        size="mini"
                        v-model.number="scope.row.num"
                        placeholder="请输入内容"></el-input>
                    <el-switch
                        :disabled="!scope.row.max || $route.query.show == 'true'"
                        v-model="scope.row.contains"></el-switch>
                    <span>包含该值</span>
                </template>
            </el-table-column>
            <el-table-column
                label="最大值">
                <template slot-scope="scope">
                    <span>
                        {{scope.row.max}}（{{scope.row.tempContains ? '包含' : '不包含'}}）
                    </span>
                </template>
            </el-table-column>
        </el-table>
        <template v-if="this.tempData && this.tempData.serviceTypeRiskEditParamList.length > 0">
            <div style="padding: 20px 0">
                服务类型规则
            </div>
            <template>
                <el-table
                    v-if="byTypes.length"
                    :data="tableData"
                    border
                    style="width: 100%">
                    <el-table-column
                        label="服务类型">
                        <template slot-scope="scope">
                            <div v-for="(v, k) in scope.row.types">{{ v.serviceName }}</div>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-for="(v, k) in byTypes"
                        :key="k"
                        :prop="v.value"
                        :label="v.text">
                        <template slot-scope="scope">
                            <template v-if="v.value === item.riskRuleType" v-for="(item, key) in scope.row.riskRuleEditParamList">
                                <div v-if="item.warnLimit">{{ item.warnExpression }}{{ item.warnLimit }}万元(预警)</div>
                                <div v-if="item.refuseLimit">{{ item.refuseExpression }}{{ item.refuseLimit }}万元(拒绝)</div>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column
                        v-if="!$route.query.show"
                        label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="editBtnClick(scope)">编辑</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="bottom-show">
                    <p>说明：</p>
                    <p>1、拒绝发放：超过限额，拒绝发放</p>
                    <p>2、预警提示：超过限额，预警提示，可发放</p>
                    <p>3、非必填，不填则不限制</p>
                    <p>4、拒绝发放数值：单笔必须小于等于单日金额，单日必须小于等于单月金额，单月必须小于等于全年金额</p>
                </div>
            </template>
            <w-pop @addOk="addOk" ref="WPop" :by-types="byTypes"></w-pop>
        </template>
        <br>
        <el-row>
            <el-button size="mini" @click="cancelBtnClik">取消</el-button>
            <el-button size="mini" type="primary" @click="okBtnClick" v-if="!$route.query.show">确定</el-button>
        </el-row>
    </div>
</template>

<script>
    import WPop from './rulePop'
    import {get, post} from "../../../store/api";
    export default {
        name: "index",
        components: {
            WPop
        },
        data() {
            return {
                /**
                 * 数组里面的类型列表
                 */
                byTypes: [
                    {
                        "value": "unit_limit",
                        "text": "单笔收入限额"
                    },
                    {
                        "value": "day_limit",
                        "text": "单人日收入限额"
                    },
                    {
                        "value": "month_limit",
                        "text": "单人月收入限额"
                    },
                    {
                        "value": "year_limit",
                        "text": "单人年收入限额"
                    },
                ],
                maxLimitsTemp: [
                    {
                        "value": "unit_limit_max",
                        "text": "单笔收入限额封顶",
                        contains: false,
                        tempContains: false,
                        num: '',
                        id: '',
                        max: 0
                    },
                    {
                        "value": "day_limit_max",
                        "text": "单人日收入限额封顶",
                        contains: false,
                        tempContains: false,
                        num: '',
                        id: '',
                        max: 0
                    },
                    {
                        "value": "month_limit_max",
                        "text": "单人月收入限额封顶",
                        contains: false,
                        tempContains: false,
                        num: '',
                        id: '',
                        max: 0
                    },
                    {
                        "value": "year_limit_max",
                        "text": "单人年收入限额封顶",
                        contains: false,
                        tempContains: false,
                        num: '',
                        id: '',
                        max: 0
                    },
                ],
                maxLimits: [],
                /**
                 * 弹窗索引用来判断是添加还是编辑
                 */
                popIndex: 0,
                /**
                 * 服务类型数组
                 */
                serviceTypeOptions: null,
                /**
                 * 详情数据
                 */
                detailData: null,
                /**
                 * 规则列表
                 */
                tableData: [],
                // 模板数据
                tempData: null,
                init: false
            }
        },
        methods: {
            // 清除模板数据
            clear() {
                this.maxLimits = []
                this.tableData = []
            },
            // 设置模板数据
            setTemplate(data) {
                this.tempData = data
                this.dataParsing()
            },
            /**
             * 添加确定
             */
            addOk(data) {
                this.tableData[this.popIndex].riskRuleEditParamList = data
            },
            /**
             * 编辑按钮
             */
            editBtnClick(scope) {
                this.popIndex = scope.$index
                this.$refs['WPop'].show(scope.row)
            },
            /**
             * 取消按钮点击
             */
            cancelBtnClik() {
                this.$router.go(-1)
            },
            /**
             * 确定按钮点击
             */
            okBtnClick() {
                this.$emit('okBtnClick')
            },
            // 设置详情数据
            setDetailData(data) {
                this.detailData = data
            },
            // 设置最高限额
            setLimitData() {
                this.maxLimits.forEach((item) => {
                    this.detailData.riskMaxEditParamList.forEach((item1) => {
                        if (item.value === item1.riskRuleType) {
                            item.num = parseFloat(item1.refuseLimit)
                            item.contains = item1.refuseExpression === '>='
                            item.riskRuleId = item1.riskRuleId
                        }
                    })
                })
            },
            // 设置服务类型规则
            setRuleData() {
                this.tableData.forEach((item) => {
                    const ids1 = JSON.stringify(item.serviceTypeIds)
                    this.detailData.serviceTypeRiskEditParamList.forEach((item1) => {
                        const ids2 = JSON.stringify(item1.serviceTypeIds)
                        if (ids1 === ids2) {
                            item.riskRuleEditParamList.forEach((item2) => {
                                item1.riskRuleEditParamList.forEach((item3) => {
                                    if (item2.riskRuleType === item3.riskRuleType) {
                                        item2.refuseLimit = item3.refuseLimit ? parseFloat(item3.refuseLimit) : null
                                        item2.warnLimit = item3.warnLimit ? parseFloat(item3.warnLimit) : null
                                        item2.refuseLimitContent = item2.refuseExpression === '>='
                                        item2.warnLimitMaxContent = item2.warnExpression === '>='
                                        item2.riskRuleId = item3.riskRuleId
                                        item2.refuseExpression = item3.refuseExpression
                                        item2.warnExpression = item3.warnExpression
                                    }
                                })
                            })
                        }
                    })
                })
            },
            // 数据解析
            dataParsing() {
                if (this.tempData && this.serviceTypeOptions) {
                    if (this.init) { return }
                    this.init = true
                    this.maxLimits = []
                    this.tempData.riskMaxEditParamList.forEach((item1) => {
                        this.maxLimitsTemp.some((item2) => {
                            if (item1.riskRuleType === item2.value) {
                                const data = {...item2}
                                data.max = parseFloat(item1.refuseLimit)
                                data.tempContains = item1.refuseExpression === '>='
                                this.maxLimits.push(data)
                                return false
                            }
                        })
                    })
                    this.tempData.serviceTypeRiskEditParamList.forEach((item) => {
                        item.types = item.serviceTypeIds.map((id) => {
                            for(let i = 0; i < this.serviceTypeOptions.length; i++) {
                                if (this.serviceTypeOptions[i].serviceId === id) {
                                    return this.serviceTypeOptions[i]
                                }
                            }
                            return {}
                        })
                    })
                    this.tempData.serviceTypeRiskEditParamList.forEach((item) => {
                        item.riskRuleEditParamList.forEach((item1) => {
                            item1.refuseLimitMax = item1.refuseLimit ? parseFloat(item1.refuseLimit) : null
                            item1.refuseLimitContent = item1.warnExpression === '>='
                            item1.warnLimitMax = item1.warnLimit ? parseFloat(item1.warnLimit) : null
                            item1.warnLimitMaxContent = item1.refuseExpression === '>='
                            item1.warnLimit = null
                            item1.refuseLimit = null
                            item1.riskRuleId = undefined
                        })
                    })
                    this.tableData = this.tempData.serviceTypeRiskEditParamList
                    if(this.detailData) {
                        this.setLimitData()
                        this.setRuleData()
                    }
                }
            },
            getServiceTypeOptions() {
                get('/api/contract-web/service-mgr/get-service-type-options').then((data) => {
                    this.serviceTypeOptions = data
                    this.dataParsing()
                }).catch(() => {})
            },
            check() {
                // 校验限额
                const checkLimit = this.maxLimits.some((item) => {
                    if (!item.num) {
                        this.$message({
                            message: `请输入{${item.text}}`,
                            type: 'error'
                        });
                        return true
                    }
                    if (item.num > item.max || (item.num === item.max && item.contains && !item.tempContains)) {
                        this.$message({
                            message: `{${item.text}}不能超过最大值`,
                            type: 'error'
                        });
                        return  true
                    }
                })
                if (checkLimit) {
                    return Promise.reject()
                }
                const limitarr = this.maxLimits.map((item) => {
                    const data = {
                        "refuseExpression": item.contains ? '>=' : '>',
                        "refuseLimit": item.num,
                        "riskRuleType": item.value,
                        "riskRuleId": item.riskRuleId
                    }
                    if (item.id) {
                        data.riskRuleId = item.id
                    }
                    return data
                })
                return new Promise((resolve, reject) => {
                    resolve({
                        rule: this.tableData,
                        limit: limitarr
                    })
                })
            }
        },
        mounted() {
            this.getServiceTypeOptions()
        },
    }
</script>

<style scoped>

</style>
