<template>
    <el-form :model="ruleForm" ref="ruleForm">
        <el-table :data="ruleForm.list">
            <el-table-column label="月总额下限" width="240">
                <template slot-scope="scope">
                    <template v-if="scope.$index">
                        <el-form-item 
                            :prop="`list.${scope.$index}.startAmount`"
                            :rules="[{ required: true, message: '请输入月总额下限', trigger: 'blur' }, { validator: validateStartAmount, trigger: 'blur' }]">
                            <el-input v-model="scope.row.startAmount" style="width: 120px;" @blur="fillPrev(scope.$index)">
                                <template slot="append">万</template>
                            </el-input>
                            <el-checkbox v-model="scope.row.equalsStart">含
                                <template v-if="scope.row.sequence === ruleForm.list.length - 1">以上</template>
                            </el-checkbox>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <div class="center">无</div>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="月总额上限" width="240">
                <template slot-scope="scope">
                    <template v-if="scope.$index !== ruleForm.list.length - 1">
                        <el-form-item 
                            :prop="`list.${scope.$index}.endAmount`"
                            :rules="[{ required: true, message: '请输入月总额上限', trigger: 'blur' }, { validator: validateEndAmount, trigger: 'blur' }]">
                            <el-input v-model.number="scope.row.endAmount" style="width: 120px;" @blur="fillNext(scope.$index)">
                                <template slot="append">万</template>
                            </el-input>
                            <el-checkbox v-model="scope.row.equalsEnd">含
                                <template v-if="!scope.row.sequence">以下</template>
                            </el-checkbox>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <div class="center">无</div>
                    </template>
                </template>
            </el-table-column>
            <el-table-column label="阶梯收费" width="350">
                <template slot-scope="scope">
                    <el-form-item label="实发金额"
                        :prop="`list.${scope.$index}.percent`"
                        :rules="{ required: true, message: '请输入阶梯收费', trigger: 'blur' }">
                        <el-input v-model="scope.row.percent" style="width: 150px;">
                            <template slot="append">% 每人</template>
                        </el-input>
                        <i class="el-icon-question mt10" title="按每人月收入分阶梯收费"></i>
                    </el-form-item>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button 
                        type="text" 
                        @click="deleteColumn(scope.$index)" 
                        v-if="scope.$index > 1 && scope.$index === ruleForm.list.length - 1" 
                        :disabled="disabled">{{scope.$length}}删除</el-button>
                    <div class="center" v-else>-</div>
                </template>
            </el-table-column>
        </el-table>
        <el-button class="mt25 mb25" v-if="ruleForm.list.length < 10 && ruleForm.list.length > 2" @click="addColumn" size="small" type="primary" :disabled="disabled">增加阶梯</el-button>
    </el-form>
</template>

<script>
export default {
    props: {
        ruleForm: {
            type: Object
        }
    },
    methods: {
        deleteColumn(index) {
            this.ruleForm.list.splice(index, 1)
        },
        addColumn() {
            this.ruleForm.list.push({
                "endAmount": null, // 结束金额
                "equalsEnd": false, // 是否包含上限金额
                "equalsStart": false, // 是否包含下限金额
                "percent": '', // 收费比例
                "sequence": this.ruleForm.list.length, // 序号
                "startAmount": '' // 开始金额
            })
        },
        fillPrev(index) {
            if (this.ruleForm.list[index - 1]) {
                this.ruleForm.list[index - 1].endAmount = this.ruleForm.list[index].startAmount
            }
        },
        validateStartAmount(rule, value, callback) {
            const index = rule.field.substr(-13, 1)
            const nextValue = this.ruleForm.list[index].endAmount
            if (nextValue === null) {
                callback()
            } else if (value >= nextValue) {
                callback('月总额下限不得大于或等于上限')
            } else {
                callback()
            }
        },
        fillNext(index) {
            if (this.ruleForm.list[index + 1]) {
                this.ruleForm.list[index + 1].startAmount = this.ruleForm.list[index].endAmount
            }
        },
        validateEndAmount(rule, value, callback) {
            const index = rule.field.substr(-11, 1)
            const prevValue = this.ruleForm.list[index].startAmount
            if (index === '0') {
                callback()
            } else if (value <= prevValue) {
                callback('月总额上限不得小于或等于下限')
            } else {
                callback()
            }
        },
        validate(callback) {
            if (typeof callback !== 'function') {
                console.log('feeContentMap no callback')
                return
            }
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    callback(true);
                } else {
                    callback(false);
                }
            })
        }
    },
    created() {
        // console.log(this.ruleForm)
    }
}
</script>

<style lang="scss" scoped>
.center {
    text-align: center;
}
</style>