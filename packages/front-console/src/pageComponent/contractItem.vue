<template>
    <div>
        <el-row class="mb15">
            <el-col :span="6">
                <el-radio label="standard" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(0)">标准报价
                </el-radio>
            </el-col>
            <template v-if="showInputRatio == 0">
                <el-col :span="15">
                    <el-input placeholder="请输入内容" v-model="inputStandard" @blur="calcuServiceFee(0)" :disabled="!(showInputRatio == 0)">
                        <template slot="append">%</template>
                    </el-input>
                </el-col>
            </template>
        </el-row>
        <el-row class="mb15">
            <el-col :span="6">
                <el-radio label="step" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(3)">分2.8万 - 无流水阶梯报价</el-radio>
            </el-col><br>
            <el-col :span="24" v-show="showInputRatio == 3">
                <el-table :data="contractForm.serviceFeeContent.stepwiseList">
                    <el-table-column label="月收入下限" width="240">
                        <template slot-scope="scope">
                            <template v-if="scope.row.sequence">
                                <el-input v-model="scope.row.startAmount" disabled class="input_100" @change="checkTable(true)">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsStart" @change="equals(scope.$index, 0)">含 
                                    <template v-if="scope.row.sequence == columnIndex - 1">
                                        以上
                                    </template>
                                </el-checkbox>
                            </template>
                            <template v-else>
                                <div class="center">无</div>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="月收入上限" width="240">
                        <template slot-scope="scope">
                            <template v-if="scope.row.sequence != columnIndex - 1">
                                <el-input v-model="scope.row.endAmount" disabled class="input_100" @change="checkTable">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsEnd" @change="equals(scope.$index, 1)">含 
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
                    <el-table-column label="阶梯收费" width="270px">
                        <template slot-scope="scope">
                            实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 3)" v-model="scope.row.percent" style="width: 100px;"></el-input> %  
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="top_24">
                    甲乙双方同意在结 算当日暂按
                    <el-input class="input_200" v-model="inputRate" @blur="checkTable">
                        <template slot="append">%</template>
                    </el-input>
                    的标准计算管理费，并在此基础上计算服务费总额。
                </div>
            </el-col>
        </el-row>
        <el-row class="mb15">
            <el-col :span="6">
                <el-radio label="step_0" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(4)">不分2.8万 - 按流水总额阶梯报价</el-radio>
            </el-col><br>
            <el-col :span="24" v-show="showInputRatio == 4">
                <el-table :data="contractForm.serviceFeeContent.stepwiseList">
                    <el-table-column label="月总额下限" width="240">
                        <template slot-scope="scope">
                            <template v-if="scope.row.sequence">
                                <el-input v-model="scope.row.startAmount" :disabled="!(showInputRatio == 4)" class="input_100" @change="checkTable(true)">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsStart" :disabled="!(showInputRatio == 4)" @change="equals(scope.$index, 0)">含 
                                    <template v-if="scope.row.sequence == columnIndex - 1">
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
                            <template v-if="scope.row.sequence != columnIndex - 1">
                                <el-input v-model="scope.row.endAmount" :disabled="!(showInputRatio == 4)" class="input_100" @change="checkTable">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsEnd" :disabled="!(showInputRatio == 4)" @change="equals(scope.$index, 1)">含 
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
                    <el-table-column label="阶梯收费" width="270px">
                        <template slot-scope="scope">
                            实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 4)" v-model="scope.row.percent" style="width: 100px;"></el-input> %  
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="top_24" v-if="contractForm.serviceFeeContent.stepwiseList.length < 10" @click="addColumn" size="small" type="primary">增加阶梯</el-button>
                <div class="top_24">
                    甲乙双方同意在结 算当日暂按
                    <el-input class="input_200" v-model="inputRate" @blur="checkTable">
                        <template slot="append">%</template>
                    </el-input>
                    的标准计算管理费，并在此基础上计算服务费总额。
                </div>
            </el-col>
        </el-row>
        <el-row class="mb15">
            <el-col :span="6">
                <el-radio label="step_1" v-model="contractForm.serviceFeeContent.serviceFeeType" @change="calcuServiceFee(5)">分2.8万 - 按流水分阶梯报价</el-radio>
            </el-col><br>
            <el-col :span="24" v-show="showInputRatio == 5">
                <div>
                    月收入
                    <el-input class="input_100" v-model="contractForm.serviceFeeContent.monthIncomeAmount" disabled>
                        <template slot="append">万</template>
                    </el-input>
                    <el-checkbox v-model="contractForm.serviceFeeContent.containMonthAmount" :disabled="!(showInputRatio == 5)" @change="equalsIncomeAmount(0)">含</el-checkbox>
                    以下
                </div>
                <el-table :data="contractForm.serviceFeeContent.stepwiseList">
                    <el-table-column label="月总额下限" width="240">
                        <template slot-scope="scope">
                            <template v-if="scope.row.sequence">
                                <el-input v-model="scope.row.startAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="checkTable(true)">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsStart" :disabled="!(showInputRatio == 5)" @change="equals(scope.$index, 0)">含 
                                    <template v-if="scope.row.sequence == columnIndex - 1">
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
                            <template v-if="scope.row.sequence != columnIndex - 1">
                                <el-input v-model="scope.row.endAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="checkTable">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsEnd" :disabled="!(showInputRatio == 5)" @change="equals(scope.$index, 1)">含 
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
                    <el-table-column label="阶梯收费" width="270px">
                        <template slot-scope="scope">
                            实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 5)" v-model="scope.row.percent" style="width: 100px;"></el-input> %  
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="top_24" v-if="contractForm.serviceFeeContent.stepwiseList.length < 10" @click="addColumn" size="small" type="primary">增加阶梯</el-button>
                <div class="top_24">
                    月收入
                    <el-input class="input_100" v-model="contractForm.serviceFeeContent.monthIncomeAmount" disabled>
                        <template slot="append">万</template>
                    </el-input>
                    <el-checkbox v-model="contractForm.serviceFeeContent2.containMonthAmount" :disabled="!(showInputRatio == 5)" @change="equalsIncomeAmount(1)">含</el-checkbox>
                    以上
                </div>
                <el-table :data="contractForm.serviceFeeContent2.stepwiseList">
                    <el-table-column label="月总额下限" width="240">
                        <template slot-scope="scope">
                            <template v-if="scope.row.sequence">
                                <el-input v-model="scope.row.startAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="checkTable(true)">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsStart" :disabled="!(showInputRatio == 5)" @change="equals(scope.$index, 0, 2)">含 
                                    <template v-if="scope.row.sequence == columnIndex - 1">
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
                            <template v-if="scope.row.sequence != columnIndex2 - 1">
                                <el-input v-model="scope.row.endAmount" :disabled="!(showInputRatio == 5)" class="input_100" @change="checkTable">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsEnd" :disabled="!(showInputRatio == 5)" @change="equals(scope.$index, 1, 2)">含 
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
                    <el-table-column label="阶梯收费" width="270px">
                        <template slot-scope="scope">
                            实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 5)" v-model="scope.row.percent" style="width: 100px;"></el-input> %  
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteColumn(scope.$index, 1)" v-if="scope.$index > 1 && scope.$index == columnIndex2 - 1">删除</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="top_24" v-if="contractForm.serviceFeeContent2.stepwiseList.length < 10" @click="addColumn(1)" size="small" type="primary">增加阶梯</el-button>
                <div class="top_24">
                    甲乙双方同意在结 算当日暂按
                    <el-input class="input_200" v-model="inputRate" @blur="checkTable">
                        <template slot="append">%</template>
                    </el-input>
                    的标准计算管理费，并在此基础上计算服务费总额。
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { setTimeout } from 'timers';
export default {
    props: {
        contractForm: {
            type: Object,
            default(){
              return {
                serviceFeeContent: {
                    discountRate: '',
                    secondType: '',
                    fixFee: 0,
                    monthIncomeAmount: '',
                    serviceFeeRate: '',
                    serviceFeeType: 'standard',
                    containMonthAmount: true,
                    stepwiseList: []
                },
                serviceFeeContent2: {
                    containMonthAmount: false,
                    monthIncomeAmount: '',
                    stepwiseList: []
                }
              }
            }
        },
        labelWidth: {
            type: String,
            default: '110px'
        },
        // formName: {
        //     type: String,
        //     required: true
        // },
        arrIndex: {
            type: Number
        },
        // checkAttr: {
        //     type: String,
        //     required: true
        // },
        initCheck: false
    },
    data() {
        return {
            inputStandard: '',
            showInputRatio: 0,
            inputRate: '',
            columnIndex: 0,
            columnIndex2: 0,
            float2: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            check: ''
        }
    },
    mounted() {
        if(!this.contractForm.serviceFeeContent.stepwiseList || !this.contractForm.serviceFeeContent.stepwiseList.length) {
            this.initColumn()
        }
        this.init(this.contractForm)
    },
    methods: {
        init(a) {
            console.log('init')
            this.contractForm = a
            this.inputRate = this.contractForm.serviceFeeContent.settledRate
            this.columnIndex = this.contractForm.serviceFeeContent.stepwiseList.length
            this.contractForm.serviceFeeContent.serviceFeeType = this.contractForm.serviceFeeContent.serviceFeeType || 'standard'
            if(this.contractForm.serviceFeeContent2) {
                this.columnIndex2 = this.contractForm.serviceFeeContent2.stepwiseList.length
            }
            if(this.contractForm.serviceFeeContent.serviceFeeType == 'standard') {
                this.inputStandard = this.contractForm.serviceFeeContent.serviceFeeRate
            }
            if(this.contractForm.serviceFeeContent.serviceFeeType == 'step') {
                if(this.contractForm.serviceFeeContent.secondType == 1) {
                    this.contractForm.serviceFeeContent.serviceFeeType = 'step_0'
                    this.showInputRatio = 4
                }
                else if(this.contractForm.serviceFeeContent.secondType == 2){
                    this.contractForm.serviceFeeContent.serviceFeeType = 'step_1'
                    this.showInputRatio = 5
                }
                else {
                    this.showInputRatio = 3
                }
            }
            !this.contractForm.serviceFeeContent.monthIncomeAmount && (this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8)
            if(this.contractForm.serviceFeeContent.serviceFeeType != 'standard') {
                this.checkTable()
            }
            else {
                if(this.inputStandard) {
                    this.check = 0
                }
            }

            if (this.initCheck) {
                // 初始化的时候触发事件 不然原始有值的时候验证无法通过
                this.transferObj()
            }
            
            setTimeout(() => {
                this.$parent.clearValidate()
            }, 100)
        },
        transferObj() {
            if(this.contractForm.serviceFeeContent.serviceFeeType != 'standard' && this.inputRate === '') {
                this.check = ''
            }
            var contractForm = JSON.parse(JSON.stringify(this.contractForm))
            contractForm.serviceFeeContent.settledRate = this.inputRate
            if(contractForm.serviceFeeContent.serviceFeeType == 'standard') {
                contractForm.serviceFeeContent.serviceFeeRate = this.inputStandard
            }
            if(contractForm.serviceFeeContent.serviceFeeType == 'step'){
                contractForm.serviceFeeContent.secondType = 0
            }
            if(contractForm.serviceFeeContent.serviceFeeType == 'step_0'){
                contractForm.serviceFeeContent.serviceFeeType = 'step'
                contractForm.serviceFeeContent.secondType = 1
            }
            if(contractForm.serviceFeeContent.serviceFeeType == 'step_1'){
                contractForm.serviceFeeContent.serviceFeeType = 'step'
                contractForm.serviceFeeContent.secondType = 2
                contractForm.serviceFeeContent.monthIncomeAmount = contractForm.serviceFeeContent.monthIncomeAmount
                contractForm.serviceFeeContent2.monthIncomeAmount = contractForm.serviceFeeContent.monthIncomeAmount
            }
            this.$emit('result', {
                serviceFeeContent: contractForm.serviceFeeContent,
                serviceFeeContent2: contractForm.serviceFeeContent2,
                arrIndex: this.arrIndex,
                check: this.check
            })
        },
        calcuServiceFee(a) {
            this.inputRate = ''
            this.contractForm.serviceFeeContent.monthIncomeAmount = 1
            if(this.contractForm.serviceFeeContent.serviceFeeType == 'standard') {
                this.check = (this.float2.test(this.inputStandard) && this.inputStandard <= 100) ? 0 : '';
                this.showInputRatio = a;
                this.transferObj()
            }
            if (this.contractForm.serviceFeeContent.serviceFeeType == 'step') {
                this.check = 0;
                this.showInputRatio = a;
                this.initColumn(2)
                this.contractForm.serviceFeeContent.stepwiseList[0].endAmount = 2.8
                this.contractForm.serviceFeeContent.stepwiseList[1].startAmount = 2.8
                this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8
            }
            if (this.contractForm.serviceFeeContent.serviceFeeType == 'step_0') {
                this.check = 0;
                this.showInputRatio = a;
                this.initColumn()
                this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8
            }
            if (this.contractForm.serviceFeeContent.serviceFeeType == 'step_1') {
                this.check = 0;
                this.showInputRatio = a;
                this.initColumn()
                this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8
            }
            if(this.contractForm.serviceFeeContent.serviceFeeType != 'standard') {
                this.checkTable()
            }
            // this.$parent.validateField(this.checkAttr)
        },
        addColumn(a) {
            if(isNaN(a)) {
                a = 0
            }
            var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList
            if(a) {
                stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
            }
            stepwiseList.push({
                startAmount: stepwiseList[this.columnIndex - 1] ? stepwiseList[this.columnIndex - 1].endAmount : '',
                equalsStart: stepwiseList[this.columnIndex - 1] ? !stepwiseList[this.columnIndex - 1].equalsEnd : false,
                endAmount: '',
                equalsEnd: true,
                sequence: a ? this.columnIndex2 : this.columnIndex,
                percent: ''
            })
            if(a) {
                this.columnIndex2++
            }
            else {
                this.columnIndex++
            }
        },
        deleteColumn(a, b) {
            var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList
            if(b) {
                stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
            }
            stepwiseList.splice(a, 1)
            if(b) {
                this.columnIndex2--
                stepwiseList[this.columnIndex2- 1].endAmount = ''
            }
            else {
                this.columnIndex--
                stepwiseList[this.columnIndex- 1].endAmount = ''
            }
            this.checkTable()
        },
        initColumn(a) {
            if(isNaN(a)) {
                a = 3
            }
            this.contractForm.serviceFeeContent.stepwiseList = []
            if(!this.contractForm.serviceFeeContent2) {
                this.contractForm.serviceFeeContent2 = {}
            }
            this.contractForm.serviceFeeContent2.stepwiseList = []
            this.columnIndex = 0
            this.columnIndex2 = 0
            for(var i = 0; i < a; i++) {
                this.addColumn()
            }
            if(this.showInputRatio == 5) {
                for(var i = 0; i < a; i++) {
                    this.addColumn(1)
                }
            }
        },
        amount(a, b, c, type) {
            console.log(true)
            var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList, amount = '', result = ''
            if(c) {
                stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
            }
            if(b) {
                stepwiseList[a + 1] && (type === true ? stepwiseList[a].endAmount = stepwiseList[a + 1].startAmount : stepwiseList[a + 1].startAmount = stepwiseList[a].endAmount)
                amount = stepwiseList[a].endAmount
            }
            else {
                stepwiseList[a - 1] && (type === true ? stepwiseList[a].startAmount = stepwiseList[a - 1].endAmount : stepwiseList[a - 1].endAmount = stepwiseList[a].startAmount)
                amount = stepwiseList[a].startAmount
            }
            if(this.float2.test(amount) && stepwiseList[a].startAmount - 0 < stepwiseList[a].endAmount) {
                result = 0
            }
            return result
        },
        checkTable(type) {
            var results = []
            for(var i =0; i < this.contractForm.serviceFeeContent.stepwiseList.length; i++) {
                for(var j = 0; j < 2; j++) {
                    (j || i) && (i + 1 < this.contractForm.serviceFeeContent.stepwiseList.length) && results.push(this.amount(i, j, 0, type))
                }
                var a = this.contractForm.serviceFeeContent.stepwiseList[i].percent
                results.push((this.float2.test(a) && a <= 100) ? 0 : '')
            }
            var m = this.contractForm.serviceFeeContent.monthIncomeAmount
            results.push((this.float2.test(m) && m <= 100) ? 0 : '')
            results.push((this.float2.test(this.inputRate) && this.inputRate <= 100) ? 0 : '')
            if(this.contractForm.serviceFeeContent2.stepwiseList.length) {
                for(var i = 0; i < this.contractForm.serviceFeeContent2.stepwiseList.length; i++) {
                    for(var j = 0; j < 2; j++) {
                       (j || i) && (i + 1 < this.contractForm.serviceFeeContent2.stepwiseList.length) && results.push(this.amount(i, j, 2, type))
                    }
                    var a = this.contractForm.serviceFeeContent2.stepwiseList[i].percent
                    results.push((this.float2.test(a) && a <= 100) ? 0 : '')
                }
            }
            this.check = results.indexOf('') > -1 ? '' : 0
            this.transferObj()
        },
        equals(a, b, c) {
            var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList
            if(c) {
                stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
            }
            if(b) {
                stepwiseList[a + 1] && (stepwiseList[a + 1].equalsStart = !stepwiseList[a].equalsEnd)
            }
            else {
                stepwiseList[a - 1] && (stepwiseList[a - 1].equalsEnd = !stepwiseList[a].equalsStart)
            }
        },
        equalsIncomeAmount(a) {
            if(!a) {
                this.contractForm.serviceFeeContent2.containMonthAmount = !this.contractForm.serviceFeeContent.containMonthAmount
            }
            else {
                this.contractForm.serviceFeeContent.containMonthAmount = !this.contractForm.serviceFeeContent2.containMonthAmount
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.demo-contractForm {
        width: 1000px;
    }
    .item_div {
        margin-bottom: 20px;
    }
    .input_300 {
        width: 300px;
    }
    .input_200 {
        width: 200px;
    }
    .input_100 {
        width: 100px;
    }
    .mr8 {
        margin-right: 8px;
    }
    .ml86 {
        margin-left: 86px;
    }
    .el-icon-question {
        margin-right: 5px;
        color: #f56c6c;
        cursor: pointer;
    }
    .top_24 {
        margin-top: 24px;
    }
    .mb15 {
        margin-bottom: 15px;
    }
    .fr {
        float: right;
    }
    .w1050 {
        width: 1050px;
    }
    .mb24 {
        margin-bottom: 24px;
    }
    .w550 {
        width: 550px;
    }
    .w800 {
        width: 800px;
    }
    .mr20 {
        margin-right: 20px;
    }
    .form_input {
        width: 400px;
        margin-bottom: -8px;
    }
    .pro_box {
    	position: relative;
    	display: inline-block;
    	width: 193px;
    	height: 10px;
    	border: 1px solid #E9E9E9;
    	border-radius: 5px;
    	margin-top: 6px;
    }
    .pro_box > div {
    	position: absolute;
    	top: 1px;
    	left: 0;
    	height: 8px;
    	border-radius: 4px;
    	background-color: #108EE9;
    }
    .pro_box + span {
    	margin-top: 6px;
    	font-size: 12px;
    	color: #999999;
    }
</style>
