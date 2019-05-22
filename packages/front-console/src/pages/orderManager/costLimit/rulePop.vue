<template>
    <div>
        <el-dialog
            class="rule-edit-pop"
            title="修改对应服务类型规则"
            :visible.sync="dialogVisible"
            :closed="closed"
            width="800px">
            <p v-if="popData">
                服务类型：
                <span v-for="(v, k) in serviceTypeOptions" :key="k">{{v.serviceName}}{{ k < serviceTypeOptions.length - 1 ? '、' : '' }}</span>
            </p>
            <div class="show-text" style="border-top: 1px solid #eee;border-bottom: 1px solid #eee;">
                <p class="text">请输入发放限额</p>
                <p class="text">请输入数字，支持小数点后2位</p>
            </div>
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                <el-table-column
                    width="160px"
                    prop="title">
                    <template slot-scope="scope">
                        <span>{{ scope.row.name }}(万元)</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="预警提示设置">
                    <template slot-scope="scope">
                        <el-input
                            :class="{'input-check': !scope.row.text_1_check}"
                            :disabled="!scope.row.text_1_max"
                            type="number"
                            style="width: 150px"
                            size="mini"
                            v-model.number="scope.row.text_1"
                            placeholder="请输入内容"></el-input>
                        <el-switch :disabled="!scope.row.text_1_max" v-model="scope.row.text_1_enable"></el-switch>
                        <span>包含该值</span>
                        <div v-if="scope.row.text_1_max">
                            最大值{{scope.row.text_1_max}}
                            （{{ scope.row.text_1_temp_content ? '包含' : '不包含' }}）
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="title"
                    label="拒绝发放限制">
                    <template slot-scope="scope">
                        <el-input
                            :class="{'input-check': !scope.row.text_1_check}"
                            :disabled="!scope.row.text_2_max"
                            type="number"
                            style="width: 150px"
                            size="mini"
                            v-model.number="scope.row.text_2"
                            placeholder="请输入内容"></el-input>
                        <el-switch :disabled="!scope.row.text_2_max" v-model="scope.row.text_2_enable"></el-switch>
                        <span>包含该值</span>
                        <div v-if="scope.row.text_2_max">
                            最大值{{ scope.row.text_2_max }}
                            （{{ scope.row.text_2_temp_content ? '包含' : '不包含' }}）
                        </div>
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
    export default {
        name: "pop",
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
                popData: {},
                tableData: [],
                /**
                 * 服务类型数组
                 */
                serviceTypeOptions: [],
                // 谁有地ID列表
                serviceTypeIds: [],
                types: []
            }
        },
        methods: {
            // 根据类型获取名称
            getTypeName(key) {
                for (let i = 0; i < this.byTypes.length; i++) {
                    if (key === this.byTypes[i].value) {
                        return this.byTypes[i].text
                    }
                }
            },
            show(data) {
                this.serviceTypeOptions= data.types
                this.dialogVisible = true
                this.types = data.types
                this.tableData = data.riskRuleEditParamList.map((item) => {
                    console.log(JSON.stringify(item))
                    const itemData = {
                        name: this.getTypeName(item.riskRuleType),
                        key: item.riskRuleType,
                        text_1_enable: item.warnExpression === '>=',
                        text_1: item.warnLimit,
                        text_1_temp_content: item.warnLimitMaxContent,
                        text_1_max: item.warnLimitMax,
                        text_2_enable: item.refuseExpression === '>=',
                        text_2: item.refuseLimit,
                        text_2_max: item.refuseLimitMax,
                        text_2_temp_content: item.refuseLimitContent,
                        riskRuleId: item.riskRuleId
                    }
                    return itemData
                })
                this.popData = data
                this.serviceTypeIds = data.serviceTypeIds
            },
            okBtnClick() {
                this.checkInput().then((rules) => {
                    const arr = rules.map((item) => {
                        return {
                            serviceTypeIds: this.serviceTypeIds,
                            warnExpression: item.text_1_enable ? '>=' : '>',
                            warnLimit: item.text_1,
                            refuseExpression: item.text_2_enable ? '>=' : '>',
                            refuseLimit: item.text_2,
                            riskRuleType: item.key,
                            warnLimitMax: item.text_1_max,
                            refuseLimitMax: item.text_2_max,
                            riskRuleId: item.riskRuleId
                        }
                    })
                    this.dialogVisible = false
                    this.$emit('addOk', arr)
                }).catch(() => {})
            },

            checkInput() {
                return new Promise((resolve, reject) => {
                    const result = this.tableData.some((item) => {
                        if (item.text_1_max && !item.text_1) {
                            this.$message({
                                message: `请输入${item.name} - 预警提示设置`,
                                type: 'error'
                            });
                            return true
                        }
                        if (item.text_2_max && !item.text_2) {
                            this.$message({
                                message: `请输入${item.name} - 拒绝发放限制`,
                                type: 'error'
                            });
                            return true
                        }
                        if (item.text_1 > item.text_1_max || (item.text_1 === item.text_1_max && item.text_1_enable && !item.text_1_temp_content)) {
                            this.$message({
                                message: `${item.name} - 预警提示设置, 不能超过最大值`,
                                type: 'error'
                            });
                            return true
                        }
                        if (item.text_2 > item.text_2_max || (item.text_2 === item.text_2_max && item.text_2_enable && !item.text_2_temp_content)) {
                            this.$message({
                                message: `${item.name} - 拒绝发放限制, 不能超过最大值`,
                                type: 'error'
                            });
                            return true
                        }
                    })
                    if(result) {
                        reject()
                    } else {
                        resolve(this.tableData)
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
            margin: 0 20px!important;
            padding: 0!important;
        }
    }
</style>
