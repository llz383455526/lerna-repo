<template>
    <el-row>
        <el-col :span="2" style="text-align: right; padding-right: 30px;"><label class="label">结算费率</label></el-col>
        <el-col :span="22">
            <el-form :model="serviceCompanyFeeContent" ref="ruleForm" :inline="true">
                <el-form-item prop="subType" :rules="{ required: true, message: '请选择结算费率类型', trigger: 'change' }">
                    <el-radio-group v-model="serviceCompanyFeeContent.subType">
                        <el-radio label="ratio" :disabled="disabled">固定比例收费</el-radio>
                        <el-radio label="nonflow">分{{serviceCompanyFeeContent.incomeAmount}}万 - 无流水阶梯报价</el-radio>
                        <el-radio label="flow">分{{serviceCompanyFeeContent.incomeAmount}}万 - 按流水分阶梯报价</el-radio>
                    </el-radio-group>
                </el-form-item><br>
                <ratio v-if="serviceCompanyFeeContent.subType === 'ratio'" :serviceCompanyFeeContent="serviceCompanyFeeContent"></ratio>
                <nonflow v-if="serviceCompanyFeeContent.subType === 'nonflow'" :serviceCompanyFeeContent="serviceCompanyFeeContent"></nonflow>
                <div :span="24" v-if="serviceCompanyFeeContent.subType === 'flow'">
                    <!-- <div v-for="item in ['down', 'up']" :key="item" class="mb25"> -->
                        <el-form-item label="月收入" prop="incomeAmount" :rules="{ required: true, message: '请输入月收入', trigger: 'blur' }">
                            <el-input style="width: 120px;" v-model="serviceCompanyFeeContent.incomeAmount" :disabled="disabled">
                                <template slot="append">万</template>
                            </el-input>
                            <span class="ml10">(含)以下</span>
                        </el-form-item>
                        <feeContentMap ref="feeContentMap" :ruleForm="{ list: serviceCompanyFeeContent.feeContentMap.down }"></feeContentMap>
                        <el-form-item label="月收入" prop="incomeAmount" :rules="{ required: true, message: '请输入月收入', trigger: 'blur' }">
                            <el-input style="width: 120px;" v-model="serviceCompanyFeeContent.incomeAmount" :disabled="disabled">
                                <template slot="append">万</template>
                            </el-input>
                            <span class="ml10">以上</span>
                        </el-form-item>
                        <el-form-item label="实发金额" prop="feeContentMap.up.0.percent" :rules="{ required: true, message: '请输入实发金额', trigger: 'blur' }">
                            <el-input v-model="serviceCompanyFeeContent.feeContentMap['up'][0].percent" style="width: 150px;">
                                <template slot="append">%</template>
                            </el-input>
                        </el-form-item>
                    <!-- </div> -->
                </div>
            </el-form>
        </el-col>
    </el-row>
</template>


<script>
import radioFee from './ratioFee'
import ratio from './ratio'
import nonflow from './nonflow'
import feeContentMap from './feeContentMap'

export default {
    components: { radioFee, ratio, nonflow, feeContentMap },
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
            // this.$refs['feeContentMap'] && this.$refs['feeContentMap'].forEach(item => {
            //     item.validate((valid) => {
            //         if (valid) {
            //             result.push(true)
            //         } else {
            //             result.push(false)
            //         }
            //     })
            // })
            this.$refs['feeContentMap'] && this.$refs['feeContentMap'].validate((valid) => {
                if (valid) {
                    result.push(true)
                } else {
                    result.push(false)
                }
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
