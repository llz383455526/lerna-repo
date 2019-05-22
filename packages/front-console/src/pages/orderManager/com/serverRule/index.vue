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
                    <el-switch v-model="scope.row.enable"></el-switch>
                    <span>{{ scope.row.text }}(万元)</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="title"
                label="拒绝发放限制">
                <template slot-scope="scope">
                    <el-input
                        :disabled="!scope.row.enable"
                        type="number"
                        style="width: 150px"
                        size="mini"
                        v-model.number="scope.row.num"
                        placeholder="请输入内容"></el-input>
                    <el-switch
                        :disabled="!scope.row.enable"
                        v-model="scope.row.contains"></el-switch>
                    <span>包含该值</span>
                </template>
            </el-table-column>
        </el-table>
        <template v-if="showRule">
            <div style="padding: 20px 0; border-top: 1px solid #eee; border-bottom: 1px solid #eee;">
                请针对服务类型配置对应规则
            </div>
            <div style="padding: 20px 0" v-if="!$route.query.show">
                <el-button type="primary" size="mini" @click="addBtnClick">设置服务类型规则</el-button>
            </div>
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
                        <template v-if="v.value === item.riskRuleType"
                                  v-for="(item, key) in scope.row.riskRuleAddParamList">
                            <div>{{ item.warnExpression }}{{ item.warnLimit }}万元(预警)</div>
                            <div>{{ item.refuseExpression }}{{ item.refuseLimit }}万元(拒绝)</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column
                    v-if="!$route.query.show"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="editBtnClick(scope)">编辑</el-button>
                        <el-button type="text" size="small" @click="removeBtnClick(scope)">删除</el-button>
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
        <br>
        <el-row>
            <el-button size="mini" @click="cancelBtnClik">取消</el-button>
            <el-button size="mini" type="primary" @click="okBtnClick" v-if="!$route.query.show">确定</el-button>
        </el-row>
    </div>
</template>

<script>
    import WPop from './pop'
    import {get, post} from "../../../../store/api";

    export default {
        name: "index",
        components: {
            WPop
        },
        props: {
            showRule: {
                type: Boolean,
                default: true
            }
        },
        data() {
            return {
                /**
                 * 数组里面的类型列表
                 */
                byTypes: [],
                maxLimits: [
                    {
                        "value": "unit_limit_max",
                        "text": "单笔收入限额封顶",
                        enable: false,
                        contains: false,
                        num: '',
                        id: ''
                    },
                    {
                        "value": "day_limit_max",
                        "text": "单人日收入限额封顶",
                        enable: false,
                        contains: false,
                        num: '',
                        id: ''
                    },
                    {
                        "value": "month_limit_max",
                        "text": "单人月收入限额封顶",
                        enable: false,
                        contains: false,
                        num: '',
                        id: ''
                    },
                    {
                        "value": "year_limit_max",
                        "text": "单人年收入限额封顶",
                        enable: false,
                        contains: false,
                        num: '',
                        id: ''
                    },
                ],
                /**
                 * 弹窗索引用来判断是添加还是编辑
                 */
                popIndex: -1,
                /**
                 * 服务类型数组
                 */
                serviceTypeOptions: [],
                remainingServiceTypeOptions: [],
                /**
                 * 详情数据
                 */
                detailData: {},
                /**
                 * 规则列表
                 */
                tableData: [],
            }
        },
        methods: {
            getByTypes() {
                // get('/api/console-dlv/option/get-by-types?type=RiskRuleType').then(data => {
                //   this.byTypes = data.RiskRuleType
                // })
                this.byTypes = [
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
                ]
            },
            addBtnClick() {
                this.popIndex = -1
                this.countRemainingServiceTypeOptions()
                this.$refs['WPop'].show(null, this.remainingServiceTypeOptions)
            },
            /**
             * 添加确定
             */
            addOk(data) {
                if (this.popIndex < 0) {
                    this.tableData.push(data)
                } else {
                    this.tableData.splice(this.popIndex, 1, data)
                }
            },
            /**
             * 编辑按钮
             */
            editBtnClick(scope) {
                this.popIndex = scope.$index
                this.countRemainingServiceTypeOptions(scope.$index)
                this.$refs['WPop'].show(scope.row, this.remainingServiceTypeOptions)
            },
            /**
             * 删除按钮点击
             */
            removeBtnClick(scope) {
                this.tableData.splice(scope.$index, 1)
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
            // 数据解析
            dataParsing(detailData) {
                if (detailData) {
                    this.detailData = detailData
                    detailData.riskMaxEditParamList.forEach((item1) => {
                        this.maxLimits.some((item2) => {
                            if (item1.riskRuleType === item2.value) {
                                item2.enable = true
                                item2.contains = item1.refuseExpression === '>='
                                item2.num = parseFloat(item1.refuseLimit)
                                item2.id = item1.riskRuleId
                                return true
                            }
                        })
                    })
                }
                if (this.serviceTypeOptions.length && this.detailData) {
                    this.detailData.serviceTypeRiskEditParamList.forEach((item) => {
                        item.types = item.serviceTypeIds.map((id) => {
                            for (let i = 0; i < this.serviceTypeOptions.length; i++) {
                                if (this.serviceTypeOptions[i].serviceId === id) {
                                    return this.serviceTypeOptions[i]
                                }
                            }
                            return {}
                        })
                        item.riskRuleAddParamList = item.riskRuleEditParamList
                    })
                    this.tableData = this.detailData.serviceTypeRiskEditParamList
                }
            },
            /**
             * 计算剩余的服务类型
             */
            countRemainingServiceTypeOptions(index = -1) {
                // 获取所有的服务类型
                let serverTypeIds = []
                this.tableData.forEach((item, key) => {
                    if (key !== index) {
                        serverTypeIds = serverTypeIds.concat(item.serviceTypeIds)
                    }
                })
                const setArr = new Set(serverTypeIds)
                // 过滤服务类型
                this.remainingServiceTypeOptions = this.serviceTypeOptions.filter((item) => {
                    return !setArr.has(item.serviceId)
                })
            },
            getServiceTypeOptions() {
                get('/api/contract-web/service-mgr/get-service-type-options').then((data) => {
                    this.serviceTypeOptions = data
                    this.dataParsing()
                }).catch(() => {
                })
            },
            check() {
                let limitarr = this.maxLimits.filter((item) => {
                    return item.enable && item.num
                })
                limitarr = limitarr.map((item) => {
                    return {
                        "refuseExpression": item.contains ? '>=' : '>',
                        "refuseLimit": item.num,
                        "riskRuleType": item.value,
                        'riskRuleId': item.id
                    }
                })
                return new Promise((resolve, reject) => {
                    if (limitarr.length) {
                        resolve({
                            rule: this.tableData,
                            limit: limitarr
                        })
                    } else {
                        this.$message({
                            message: '至少配置一项最高限额',
                            type: 'error'
                        });
                    }
                })
            }
        },
        mounted() {
            this.getByTypes()
            this.getServiceTypeOptions()
        },
    }
</script>

<style scoped>

</style>
