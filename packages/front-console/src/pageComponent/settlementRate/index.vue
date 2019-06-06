<template>
    <el-row>
        <el-col :span="2" style="text-align: right; padding-right: 30px;"><label class="label">结算费率</label></el-col>
        <el-col :span="22">
            <el-form :model="serviceCompanyFeeContent" ref="ruleForm" :inline="true">
                <el-form-item prop="subType" :rules="{ required: true, message: '请选择结算费率类型', trigger: 'change' }">
                    <el-radio-group v-model="serviceCompanyFeeContent.subType">
                        <el-radio label="ratio" :disabled="disabled">固定比例收费</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="serviceCompanyFeeContent.subType === 'ratio'" :prop="`feeContentMap.no.0.percent`" :rules="{ required: true, message: '请输入结算实发金额', trigger: 'blur' }">
                    <span style="color: #606266; ">实发金额 * </span>
                    <el-input v-model="serviceCompanyFeeContent.feeContentMap.no[0].percent" :disabled="disabled" style="width: 150px;">
                        <template slot="append">% 每笔</template>
                    </el-input>
                    <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                </el-form-item>
                <div class="mb25">
                    <el-form-item class="mb15" prop="subType" :rules="{ required: true, message: '请选择结算费率类型', trigger: 'change' }">
                        <el-radio-group v-model="serviceCompanyFeeContent.subType">
                            <el-radio label="nonflow">分{{serviceCompanyFeeContent.incomeAmount}}万 - 无流水阶梯报价</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div v-if="serviceCompanyFeeContent.subType === 'nonflow'">
                        <!-- <div v-for="item in ['whatever']" :key="item">
                            <el-form-item label="月收入" prop="incomeAmount" :rules="{ required: true, message: '请输入月收入', trigger: 'blur' }">
                                <el-input style="width: 120px;" v-model="serviceCompanyFeeContent.incomeAmount">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox>含以下</el-checkbox>
                            </el-form-item>
                            <nonflow ref="feeContentMap" :ruleForm="{ 
                                incomeAmount: serviceCompanyFeeContent.incomeAmount,
                                list: [ serviceCompanyFeeContent.feeContentMap.down[0], serviceCompanyFeeContent.feeContentMap.up[0] ] 
                            }"></nonflow>
                        </div> -->
                        <nonflow :serviceCompanyFeeContent="serviceCompanyFeeContent"></nonflow>
                    </div>
                </div>
                <div class="mb25">
                    <el-form-item prop="subType" :rules="{ required: true, message: '请选择结算费率类型', trigger: 'change' }">
                        <el-radio-group v-model="serviceCompanyFeeContent.subType">
                            <el-radio label="flow">分{{serviceCompanyFeeContent.incomeAmount}}万 - 按流水分阶梯报价</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <div :span="24" v-if="serviceCompanyFeeContent.subType === 'flow'">
                        <div v-for="item in ['down', 'up']" :key="item" class="mb25">
                            <el-form-item label="月收入" :prop="`incomeAmount`" :rules="{ required: true, message: '请输入月收入', trigger: 'blur' }">
                                <el-input style="width: 120px;" v-model="serviceCompanyFeeContent.incomeAmount" :disabled="disabled">
                                    <template slot="append">万</template>
                                </el-input>
                                <span class="ml10">以下</span>
                            </el-form-item>
                            <feeContentMap ref="feeContentMap" :ruleForm="{ list: serviceCompanyFeeContent.feeContentMap[item] }"></feeContentMap>
                        </div>
                    </div>
                </div>
            </el-form>
        </el-col>
    </el-row>
</template>


<script>
import radioFee from './ratioFee'
import nonflow from './nonflow'
import feeContentMap from './feeContentMap'

export default {
    components: { radioFee, nonflow, feeContentMap },
    props: {
        serviceCompanyFeeContent: {
            type: Object
        }
    },
    methods: {
        validate(callback) {
            if (typeof callback !== 'function') {
                console.log('settlementRate no callback')
                return
            }
            let result = [] // 储存遍历每个验证结果
            let check = false // 最后输出
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    result.push(true)
                } else {
                    result.push(false)
                }
            })
            this.$refs['feeContentMap'] && this.$refs['feeContentMap'].forEach(item => {
                item.validate((valid) => {
                    if (valid) {
                        result.push(true)
                    } else {
                        result.push(false)
                    }
                })
            })
            check = result.indexOf(false) > -1 ? false : true
            callback(check)
        },
    },
    created() {
        // console.log(this.serviceCompanyFeeContent)
    }
}
</script>

<style lang="scss" scoped>
.label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
}
.span {
    display: inline-block;
    padding-left: 10px;
    font-size: 14px;
}
.el-form-item .el-form-item {
    margin-bottom: 22px;
}
</style>
