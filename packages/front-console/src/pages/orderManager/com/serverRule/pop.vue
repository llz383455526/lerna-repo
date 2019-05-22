<template>
    <div>
        <el-dialog
            class="rule-edit-pop"
            :title="`${this.popData ? '修改' : '添加'}对应服务类型规则`"
            :visible.sync="dialogVisible"
            :closed="closed"
            width="600">
            <w-options
                ref="WOption"
                idName="serviceId"
                title="选择服务类型"
                :input-arr="serviceTypeOptions"
                name="serviceName"></w-options>
            <div class="show-text" style="border-top: 1px solid #eee;border-bottom: 1px solid #eee;">
                <p class="text">请输入发放限额</p>
                <p class="text">请输入数字，支持小数点后2位</p>
            </div>
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    prop="title">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.enable"></el-switch>
                        <span>{{ scope.row.title }}(万元)</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="预警提示设置">
                    <template slot-scope="scope">
                        <el-input
                            :class="{'input-check': !scope.row.text_1_check}"
                            :disabled="!scope.row.enable"
                            type="number"
                            style="width: 150px"
                            size="mini"
                            v-model.number="scope.row.text_1"
                            placeholder="请输入内容"></el-input>
                        <el-switch
                            :disabled="!scope.row.enable"
                            v-model="scope.row.text_1_enable"></el-switch>
                        <span>包含该值</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="拒绝发放限制">
                    <template slot-scope="scope">
                        <el-input
                            :class="{'input-check': !scope.row.text_1_check}"
                            :disabled="!scope.row.enable"
                            type="number"
                            style="width: 150px"
                            size="mini"
                            v-model.number="scope.row.text_2"
                            placeholder="请输入内容"></el-input>
                        <el-switch
                            :disabled="!scope.row.enable"
                            v-model="scope.row.text_2_enable"></el-switch>
                        <span>包含该值</span>
                    </template>
                </el-table-column>
            </el-table>
            <div class="show-text">
                <p>说明：</p>
                <p>1、拒绝发放：超过限额，拒绝发放</p>
                <p>2、预警提示：超过限额，预警提示，可发放</p>
                <p>3、非必填，不填则不限制</p>
                <p>4、拒绝发放数值：单笔必须小于等于单日金额，单日必须小于等于单月金额，单月必须小于等于全年金额</p>
            </div>
            <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false" size="mini">取 消</el-button>
      <el-button type="primary" @click="okBtnClick" size="mini">确 定</el-button>
    </span>
        </el-dialog>
    </div>
</template>

<script>
    import WOptions from '../options/index'

    export default {
        name: "pop",
        components: {
            WOptions
        },
        props: {
            byTypes: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                dialogVisible: false,
                popData: null,
                tableData: [],
                /**
                 * 服务类型数组
                 */
                serviceTypeOptions: [],
            }
        },
        methods: {
            show(data, optios) {
                this.serviceTypeOptions = optios

                console.log('data = ', data)

                this.dialogVisible = true
                this.tableData = this.byTypes.map((item) => {
                    const itemData = {
                        title: item.text,
                        enable: false,
                        text_1_enable: false,
                        text_1: null,
                        text_1_check: true,
                        text_2_enable: false,
                        text_2: null,
                        text_2_check: true,
                        value: item.value
                    }

                    if (data) {
                        data.riskRuleAddParamList.forEach((item1) => {
                            if (item1.riskRuleType === item.value) {
                                itemData.enable = true
                                itemData.text_1_enable = item1.warnExpression === '>='
                                itemData.text_1 = item1.warnLimit
                                itemData.text_2_enable = item1.refuseExpression === '>='
                                itemData.text_2 = item1.refuseLimit
                                itemData.riskRuleId = item1.riskRuleId
                            }
                        })
                    }

                    return itemData
                })
                this.$nextTick(() => {
                    if (data) {
                        this.$refs['WOption'].setSelData(data.serviceTypeIds)
                    }
                })
                this.popData = data
            },
            okBtnClick() {
                this.check().then((data) => {
                    this.dialogVisible = false
                    this.$emit('addOk', data)
                }).catch(() => {
                })
            },
            check() {
                return new Promise((resolve, reject) => {
                    this.$refs['WOption'].check().then((types) => {
                        const serviceTypeIds = types.map((item) => {
                            return item.serviceId
                        })
                        this.checkInput().then((rules) => {
                            const arr = rules.map((item) => {
                                return {
                                    serviceTypeIds: serviceTypeIds,
                                    warnExpression: item.text_1_enable ? '>=' : '>',
                                    warnLimit: item.text_1,
                                    refuseExpression: item.text_2_enable ? '>=' : '>',
                                    refuseLimit: item.text_2,
                                    riskRuleType: item.value,
                                    riskRuleId: item.riskRuleId
                                }
                            })
                            this.$refs['WOption'].clear()
                            resolve({
                                serviceTypeIds: serviceTypeIds,
                                riskRuleAddParamList: arr,
                                types
                            })
                        }).catch(() => {
                            reject()
                        })
                    }).catch(() => {
                        reject()
                    })
                })
            },
            checkInput() {
                return new Promise((resolve, reject) => {
                    const selArr = this.tableData.filter((item) => {
                        return item.enable
                    })
                    if (selArr.length) {
                        for (let i = 0; i < selArr.length; i++) {
                            const item = selArr[i]
                            if (!item.text_1 && !item.text_2) {
                                this.$message({
                                    showClose: true,
                                    message: item.title + '至少填写一条',
                                    type: 'error'
                                });
                                reject()
                                return
                            }
                            resolve(selArr)
                        }
                    } else {
                        this.$message({
                            showClose: true,
                            message: '至少选择一组发放限额数据',
                            type: 'error'
                        });
                        reject()
                    }
                })
            },
        },
        mounted() {
        }
    }
</script>

<style lang="scss" scoped>
    .show-text {
        padding: 10px 0;

        p {
            margin: 0;
            padding: 5px 0;
        }

        .input-check {
            border: 1px solid #f00;
        }
    }
</style>
<style lang="scss">
    .rule-edit-pop {
        .el-dialog__body {
            margin: 0 20px !important;
            padding: 0 !important;
        }
    }
</style>
