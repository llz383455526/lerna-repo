<template>
    <!-- <el-form :model="settlementRateInfo || form" label-width="100px"> -->
        <!-- <el-form-item label="结算费率" > -->
        <div class="clearfix">
            <div class="pull-left m10">结算费率</div>
            <div class="pull-left">
                <div>
                    <el-form-item :prop="`${propName}.${propKey}.subType`" :rules="{ required: true, message: '请选择结算费率类型', trigger: 'change' }">
                        <el-radio-group v-model="serviceCompanyFeeContent.subType">
                            <el-radio label="ratio" :disabled="disabled">固定比例收费</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <template v-if="serviceCompanyFeeContent.subType === 'ratio'">
                        <div style="line-height: 40px; display: inline-block;">
                            <span style="color: #606266; ">实发金额 * </span>
                            <el-form-item 
                                :prop="`${propName}.${propKey}.feeContentMap.no.0.percent`" 
                                :rules="{ required: true, message: '请输入结算实发金额', trigger: 'blur' }">
                                <el-input v-model="serviceCompanyFeeContent.feeContentMap.no[0].percent" :disabled="disabled">
                                    <template slot="append">% 每笔</template>
                                </el-input>
                            </el-form-item>
                            <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                        </div>
                    </template>
                </div>
                <div class="mb25">
                    <el-form-item class="mb15"
                        :prop="`${propName}.${propKey}.subType`" 
                        :rules="{ required: true, message: '请选择结算费率类型', trigger: 'change' }">
                        <el-radio-group v-model="serviceCompanyFeeContent.subType">
                            <el-radio label="nonflow">分{{'2.8'}}万 - 无流水阶梯报价</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-table v-show="serviceCompanyFeeContent.subType === 'nonflow'"
                        :data="[serviceCompanyFeeContent.feeContentMap.down[0], serviceCompanyFeeContent.feeContentMap.up[0]]">
                        <el-table-column label="月总额下限" width="240">
                            <template slot-scope="scope">
                                <template v-if="scope.$index">
                                    <el-form-item 
                                        :prop="scope.$index ? `${propName}.${propKey}.feeContentMap.up.0.startAmount` : `${propName}.${propKey}.feeContentMap.down.0.startAmount`" 
                                        :rules="{ required: true, message: '请输入月总额下限', trigger: 'blur' }">
                                        <el-input v-model="scope.row.startAmount" style="width: 120px;">
                                            <template slot="append">万</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-checkbox v-model="scope.row.equalsStart" class="mt10">含
                                        <template v-if="scope.row.sequence === 1">
                                            以上
                                        </template>
                                    </el-checkbox>
                                </template>
                                <template v-else>
                                    <div class="center">无</div>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="月总额上限" width="240">
                            <template slot-scope="scope">
                                <template v-if="scope.row.sequence !== 1">
                                    <el-form-item 
                                        :prop="scope.$index ? `${propName}.${propKey}.feeContentMap.up.0.endAmount` : `${propName}.${propKey}.feeContentMap.down.0.endAmount`" 
                                        :rules="{ required: true, message: '请输入月总额上限', trigger: 'blur' }">
                                        <el-input v-model="scope.row.endAmount" style="width: 120px;">
                                            <template slot="append">万</template>
                                        </el-input>
                                    </el-form-item>
                                    <el-checkbox v-model="scope.row.equalsEnd" class="mt10">含
                                        <template v-if="!scope.row.sequence">
                                            以下
                                        </template>
                                    </el-checkbox>
                                </template>
                                <template v-else>
                                    <div class="center">无</div>
                                </template>
                            </template>
                        </el-table-column>
                        <el-table-column label="阶梯收费" width="350">
                            <template slot-scope="scope">
                                <el-form-item label="实发金额"
                                    :prop="scope.$index ? `${propName}.${propKey}.feeContentMap.up.0.percent` : `${propName}.${propKey}.feeContentMap.down.0.percent`" 
                                    :rules="{ required: true, message: '请输入阶梯收费', trigger: 'blur' }">
                                    <el-input v-model="scope.row.percent" style="width: 100px;"></el-input> % 每人 
                                </el-form-item>
                                <i class="el-icon-question mt10" title="按每人月收入分阶梯收费"></i>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作" width="100">
                            <template slot-scope="scope">
                                <el-button 
                                    type="text" 
                                    @click="deleteColumn(tableData, scope.$index)" 
                                    v-if="scope.$index > 1 && scope.$index === 1" 
                                    :disabled="disabled">{{scope.$length}}删除</el-button>
                                <div class="center" v-else>-</div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
                <div class="mb25">
                    <el-form-item
                        :prop="`${propName}.${propKey}.subType`" 
                        :rules="{ required: true, message: '请选择结算费率类型', trigger: 'change' }">
                        <el-radio label="flow" v-model="serviceCompanyFeeContent.subType">分{{'2.8'}}万 - 按流水分阶梯报价</el-radio>
                    </el-form-item>
                    <div :span="24" v-show="serviceCompanyFeeContent.subType === 'flow'">
                        <el-form-item label="月收入"
                            :prop="`${propName}.${propKey}.incomeAmount`" 
                            :rules="{ required: true, message: '请输入月收入', trigger: 'blur' }">
                            <el-input style="width: 120px;" v-model="serviceCompanyFeeContent.incomeAmount" :disabled="disabled">
                                <template slot="append">万</template>
                            </el-input>
                            <span class="ml10">以下</span>
                        </el-form-item>
                        <additionalProp :tableData="serviceCompanyFeeContent.feeContentMap.down" :propName="`${propName}.${propKey}.feeContentMap.down`"></additionalProp>
                        <el-form-item label="月收入" class="mt25">
                            <el-input style="width: 120px;" v-model="serviceCompanyFeeContent.incomeAmount" :disabled="disabled">
                                <template slot="append">万</template>
                            </el-input>
                            <span class="ml10">以上</span>
                        </el-form-item>
                        <additionalProp :tableData="serviceCompanyFeeContent.feeContentMap.up" :propName="`${propName}.${propKey}.feeContentMap.up`"></additionalProp>
                    </div>
                </div>
            </div>
        </div>
        <!-- </el-form-item> -->
    <!-- </el-form> -->
</template>


<script>
import radioFee from './ratioFee'
import Form from 'src/model/settlementRate'
import additionalProp from './additionalProp'

export default {
    components: { radioFee, additionalProp },
    props: {
        settlementRateInfo: {
            type: Object
        },
        serviceCompanyFeeContent: {
            type: Object
        },
        propName: {
            type: String
        },
        propKey: {
            type: Number
        }
    },
    computed: {
        form() {
            return
        }
    },
    data() {
        return {
           settlementRate : new Form()
        }
    },
    methods: {
        checkTable() {
            this.$emit('result')
        }
    },
    created() {
        console.log(this.serviceCompanyFeeContent)
    }
}
</script>

<style lang="scss" scoped>
.span {
    display: inline-block;
    padding-left: 10px;
    font-size: 14px;
}
</style>
