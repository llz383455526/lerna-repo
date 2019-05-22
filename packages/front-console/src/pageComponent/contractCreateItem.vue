<template>
    <div>
        <!-- <el-row class="mb15" v-show="contractForm.settleType != 'each'">
            <el-col :span="6">
                <el-radio :label="-1" v-model="showInputRatio" @change="ratioChange">无</el-radio>
            </el-col>
        </el-row> -->
        <!-- <el-row class="mb15 w650" v-show="contractForm.settleType != 'each'">
            <el-col :span="6">
                <el-radio :label="0" v-model="showInputRatio" @change="ratioChange">固定金额收费</el-radio>
            </el-col>
            <template v-if="showInputRatio == 0">
                <el-col :span="15">
                    <el-input placeholder="请输入内容" v-model="contractForm.serviceFeeContent.fixFee" @blur="checkTable" :disabled="!(showInputRatio == 0)">
                        <template slot="append">元 每笔</template>
                    </el-input>
                </el-col>
                <el-col :span="1" style="text-align: right;">
                    <i class="el-icon-question" title="表示按照固定金额来收取服务费。计算公式：固定收费金额 = 服务费"></i>
                </el-col>
            </template>
        </el-row> -->
        <el-row class="mb15 w650">
            <el-col :span="6">
                <el-radio :label="1" v-model="showInputRatio" @change="ratioChange">固定比例收费<br>（实发金额）</el-radio>
            </el-col>
            <template v-if="showInputRatio == 1">
                <el-col :span="15">
                    <div style="float: left; width: 70px; color: #606266;">实发金额 * </div>
                    <el-input v-model="inputRatio" @blur="checkTable" :disabled="!(showInputRatio == 1)" style="width: calc(100% - 70px);">
                        <template slot="append">% 每笔</template>
                    </el-input>
                </el-col>
                <el-col :span="1" style="text-align: right;">
                    <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                </el-col>
            </template>
        </el-row> 
        <!-- <el-row class="w650">
            <el-col :span="6">
                <el-radio :label="2" v-model="showInputRatio" @change="ratioChange">固定比例收费<br>（应发金额）</el-radio>
            </el-col>
            <template v-if="showInputRatio == 2">
                <el-col :span="17">
                    <div style="display: inline-block; width: 110px; color: #606266;">实发金额 / ( 1 -  </div>
                    <el-input v-model="inputRatio_1" @blur="checkTable" :disabled="!(showInputRatio == 2)" style="width: 135px;">
                        <template slot="append">%</template>
                    </el-input>
                    <div style="display: inline-block; width: 20px; color: #606266;">) * </div>
                    <el-input v-model="inputRatio_1" @blur="checkTable" :disabled="!(showInputRatio == 2)" style="width: 160px;">
                        <template slot="append">% 每笔</template>
                    </el-input>
                </el-col>
                <el-col :span="1" style="text-align: right;">
                    <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                </el-col>
            </template>
        </el-row> -->
        <el-row class="mb15">
            <el-col :span="6">
                <el-radio :label="3" v-model="showInputRatio" @change="ratioChange">分{{showInputRatio == 3 ? contractForm.serviceFeeContent.stepwiseList[0] && contractForm.serviceFeeContent.stepwiseList[0].endAmount : '2.8'}}万 - 无流水阶梯报价</el-radio>
            </el-col><br>
            <el-col :span="24" v-show="showInputRatio == 3">
                <el-table :data="contractForm.serviceFeeContent.stepwiseList">
                    <el-table-column label="月收入下限" width="240">
                        <template slot-scope="scope">
                            <template v-if="scope.row.sequence">
                                <el-input v-model="scope.row.startAmount" class="input_100" @change="checkTable(true)">
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
                                <el-input v-model="scope.row.endAmount" class="input_100" @change="checkTable">
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
                            实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 3)" v-model="scope.row.percent" style="width: 100px;"></el-input> % 每人 <i class="el-icon-question" title="按每人月收入分阶梯收费"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <el-button class="top_24" @click="addColumn" size="small" type="primary">增加阶梯</el-button> -->
                <div class="top_24" v-if="showSettledRate">
                    甲乙双方同意在结 算当日暂按
                    <el-input class="input_200" v-model="contractForm.serviceFeeContent.settledRate" @blur="checkTable">
                        <template slot="append">%</template>
                    </el-input>
                    的标准计算管理费，并在此基础上计算服务费总额。
                </div>
            </el-col>
        </el-row>
        <el-row class="mb15">
            <el-col :span="6">
                <el-radio :label="4" v-model="showInputRatio" @change="ratioChange">不分2.8万 - 按流水总额阶梯报价</el-radio>
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
                            实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 4)" v-model="scope.row.percent" style="width: 100px;"></el-input> % 每人 <i class="el-icon-question" title="按每人月收入分阶梯收费"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="top_24" v-if="contractForm.serviceFeeContent.stepwiseList.length < 10" @click="addColumn" size="small" type="primary">增加阶梯</el-button>
                <div class="top_24" v-if="showSettledRate">
                    甲乙双方同意在结 算当日暂按
                    <el-input class="input_200" v-model="contractForm.serviceFeeContent.settledRate" @blur="checkTable">
                        <template slot="append">%</template>
                    </el-input>
                    的标准计算管理费，并在此基础上计算服务费总额。
                </div>
            </el-col>
        </el-row>
        <el-row class="mb15">
            <el-col :span="6">
                <el-radio :label="5" v-model="showInputRatio" @change="ratioChange">分{{showInputRatio == 5 ? contractForm.serviceFeeContent.monthIncomeAmount : '2.8'}}万 - 按流水分阶梯报价</el-radio>
            </el-col><br>
            <el-col :span="24" v-show="showInputRatio == 5">
                <div>
                    月收入
                    <el-input class="input_100" v-model="contractForm.serviceFeeContent.monthIncomeAmount" @blur="checkTable">
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
                            实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 5)" v-model="scope.row.percent" style="width: 100px;"></el-input> % 每人 <i class="el-icon-question" title="按每人月收入分阶梯收费"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="top_24" v-if="contractForm.serviceFeeContent.stepwiseList.length < 10" @click="addColumn" size="small" type="primary">增加阶梯</el-button>
                <div class="top_24">
                    月收入
                    <el-input class="input_100" v-model="contractForm.serviceFeeContent.monthIncomeAmount" @blur="checkTable">
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
                            实发金额 * <el-input @blur="checkTable" :disabled="!(showInputRatio == 5)" v-model="scope.row.percent" style="width: 100px;"></el-input> % 每人 <i class="el-icon-question" title="按每人月收入分阶梯收费"></i>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteColumn(scope.$index, 1)" v-if="scope.$index > 1 && scope.$index == columnIndex2 - 1">删除</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="top_24" v-if="contractForm.serviceFeeContent2.stepwiseList.length < 10" @click="addColumn(1)" size="small" type="primary">增加阶梯</el-button>
                <div class="top_24" v-if="showSettledRate">
                    甲乙双方同意在结 算当日暂按
                    <el-input class="input_200" v-model="contractForm.serviceFeeContent.settledRate" @blur="checkTable">
                        <template slot="append">%</template>
                    </el-input>
                    的标准计算管理费，并在此基础上计算服务费总额。
                </div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
export default {
    props: {
        contractForm: {
            type: Object,
            default() {
                return {
                    customerName: '',
                    customerId: '',
                    type: 'customer',
                    openInvoiceType: '',
                    branchs: [],
                    serviceTypeList: [],
                    serviceCompanyIds: [null],
                    prePayType: '',
                    prePayContent: {
                        discountRate: '',
                        fixFee: '',
                        secondType: 'real',
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio'
                    },
                    serviceFeeContent: {
                        discountRate: '',
                        secondType: 'real',
                        fixFee: 0,
                        monthIncomeAmount: 1,
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio',
                        containMonthAmount: true,
                        stepwiseList: [],
                        settledRate: ''
                    },
                    serviceFeeContent2: {
                        containMonthAmount: false,
                        monthIncomeAmount: '',
                        stepwiseList: []
                    },
                    // serviceFee: '',
                    settleExp: '1',
                    // serviceFeeRate: '',
                    // shouldAmountRate: ''
                    tplAttachType: '',
                    // -----------------------
                    agentClient: '',
                    agentCompanyId: '',
                    agentCompanyName: '',
                    agentFeeContent: {
                        discountRate: '',
                        fixFee: '',
                        secondType: 'real',
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio'
                    },
                    quoteRule: '',
                    quoteFeeContent: {
                      containIncomeAmount: '',
                      incomeAmount: '',
                      quoteFeeRate: '',
                      quoteFeeType: '',
                      serviceCompanyRateList: [
                        {
                          feeRateContent: {
                            containIncomeAmount: '',
                            incomeAmount: '',
                            quoteFeeRate: '',
                            quoteFeeType: '',
                            // stepwiseList: [  //目前用不到
                            //   {
                            //     endAmount: '',
                            //     equalsEnd: '',
                            //     equalsStart: '',
                            //     percent: '',
                            //     sequence: '',
                            //     startAmount: ''
                            //   }
                            // ]
                          },
                          serviceCompanyId: '',
                          serviceCompanyName: ''
                        }
                      ],
                      stepwiseList: [
                        {
                          endAmount: '',
                          equalsEnd: '',
                          equalsStart: '',
                          percent: '',
                          sequence: '',
                          startAmount: ''
                        }
                      ]
                    },
                    original: '',
                    originalType: '',
                    originalTypeName: ''
                }
            }
        },
        arrIndex: {
            type: Number
        },
        serviceTypes: {
            type: Array,
            default() {
                return []
            }
        },
        showSettledRate: {
            type: Boolean,
            default: false
        }
    },
    data() {
        return {
            float2: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            showInputRatio: 0,
            columnIndex: 0,
            columnIndex2: 0
        }
    },
    mounted() {
        this.init(this.contractForm)
    },
    methods: {
        init(a) {
            a && Object.assign(this.contractForm, a)
            this.columnIndex = this.contractForm.serviceFeeContent.stepwiseList.length
            if(this.contractForm.serviceFeeContent2) {
                this.columnIndex2 = this.contractForm.serviceFeeContent2.stepwiseList.length
            }
            if (this.contractForm.serviceFeeContent.serviceFeeType == 'dummy') {
                this.showInputRatio = -1
            }
            if (this.contractForm.serviceFeeContent.serviceFeeType == 'fixed') {
                this.showInputRatio = 0;
            }
            if (this.contractForm.serviceFeeContent.serviceFeeType == 'ratio') {
                if(this.contractForm.serviceFeeContent.secondType == 'real'){
                    this.inputRatio = this.contractForm.serviceFeeContent.serviceFeeRate;
                    this.showInputRatio = 1;
                }
                if(this.contractForm.serviceFeeContent.secondType == 'should') {
                    this.inputRatio_1 = this.contractForm.serviceFeeContent.serviceFeeRate;
                    this.showInputRatio = 2;
                }
            }
            if(this.contractForm.serviceFeeContent.serviceFeeType == 'step') {
                if(this.contractForm.serviceFeeContent.secondType == '0') {
                    this.showInputRatio = 3;
                }
                if(this.contractForm.serviceFeeContent.secondType == '1') {
                    this.showInputRatio = 4;
                }
                if(this.contractForm.serviceFeeContent.secondType == '2') {
                    this.showInputRatio = 5;
                }
            }
            this.transferObj()
        },
        ratioChange() {
            if(this.showInputRatio == 3) {
                this.initColumn(2)
                this.contractForm.serviceFeeContent.stepwiseList[0].endAmount = 2.8
                this.contractForm.serviceFeeContent.stepwiseList[1].startAmount = 2.8
                this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8
            }
            if(this.showInputRatio > 3) {
                this.initColumn()
                this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8
            }
            this.checkTable()
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
            this.contractForm.serviceFeeContent.settledRate = ''
        },
        amount(a, b, c, type) {
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
            // 出现过 stepwiseList[0].startAmount 字段丢失导致前端验证无法通过，暂时给一个默认值（可能原因：序列化时值为undefined的键会被丢弃）
            if(this.float2.test(amount) && (stepwiseList[a].startAmount || 0) - 0 < stepwiseList[a].endAmount) {
                result = 0
            }
            // this.contractForm.serviceFeeContent.fixFee = result
            return result
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
        },
        checkTable(type) {
            var results = []
            if(this.showInputRatio == 1) {
                results.push((this.float2.test(this.inputRatio) && this.inputRatio <= 100) ? 0 : '')
            }
            if(this.showInputRatio == 2) {
                results.push((this.float2.test(this.inputRatio_1) && this.inputRatio_1 <= 100) ? 0 : '')
            }
            if(this.showInputRatio >= 3) {
                for(var i =0; i < this.contractForm.serviceFeeContent.stepwiseList.length; i++) {
                    for(var j = 0; j < 2; j++) {
                        (j || i) && (i + 1 < this.contractForm.serviceFeeContent.stepwiseList.length) && results.push(this.amount(i, j, 0, type))
                    }
                    var a = this.contractForm.serviceFeeContent.stepwiseList[i].percent
                    results.push((this.float2.test(a) && a <= 100) ? 0 : '')
                }
                var s = this.contractForm.serviceFeeContent.settledRate
                this.showSettledRate && results.push((this.float2.test(s) && s <= 100) ? 0 : '')
            }
            if(this.showInputRatio == 5) {
                var m = this.contractForm.serviceFeeContent.monthIncomeAmount
                results.push((this.float2.test(m) && m <= 100) ? 0 : '')
            }
            if(this.contractForm.serviceFeeContent2.stepwiseList.length) {
                for(var i = 0; i < this.contractForm.serviceFeeContent2.stepwiseList.length; i++) {
                    for(var j = 0; j < 2; j++) {
                        (j || i) && (i + 1 < this.contractForm.serviceFeeContent2.stepwiseList.length) && results.push(this.amount(i, j, 2, type))
                    }
                    var a = this.contractForm.serviceFeeContent2.stepwiseList[i].percent
                    results.push((this.float2.test(a) && a <= 100) ? 0 : '')
                }
            }
            if(this.showInputRatio != 0) {
                this.contractForm.serviceFeeContent.fixFee = results.indexOf('') > -1 ? '' : 0
            }
            this.transferObj()
        },
        transferObj() {
            var contractForm = JSON.parse(JSON.stringify(this.contractForm))
            if (this.showInputRatio == -1) {
                contractForm.serviceFeeContent.serviceFeeType = 'dummy'
            }
            if (this.showInputRatio == 0) {
                contractForm.serviceFeeContent.serviceFeeType = 'fixed'
            }
            if (this.showInputRatio == 1) {
                contractForm.serviceFeeContent.serviceFeeType = 'ratio'
                contractForm.serviceFeeContent.secondType = 'real'
                contractForm.serviceFeeContent.serviceFeeRate = this.inputRatio
            }
            if (this.showInputRatio == 2) {
                contractForm.serviceFeeContent.serviceFeeType = 'ratio'
                contractForm.serviceFeeContent.secondType = 'should'
                contractForm.serviceFeeContent.discountRate = this.inputRatio_1
                contractForm.serviceFeeContent.serviceFeeRate = this.inputRatio_1
            }
            if (this.showInputRatio == 3) {
                contractForm.serviceFeeContent.serviceFeeType = 'step'
                contractForm.serviceFeeContent.secondType = '0'
                contractForm.serviceFeeContent.monthIncomeAmount = contractForm.serviceFeeContent.stepwiseList[0].endAmount
            }
            if (this.showInputRatio == 4) {
                contractForm.serviceFeeContent.serviceFeeType = 'step'
                contractForm.serviceFeeContent.secondType = '1'
            }
            if (this.showInputRatio == 5) {
                contractForm.serviceFeeContent.serviceFeeType = 'step'
                contractForm.serviceFeeContent.secondType = '2'
                contractForm.serviceFeeContent2.monthIncomeAmount = contractForm.serviceFeeContent.monthIncomeAmount
            }
            this.$emit('result', {
                serviceFeeContent: contractForm.serviceFeeContent,
                serviceFeeContent2: contractForm.serviceFeeContent2,
                arrIndex: this.arrIndex,
                check: contractForm.serviceFeeContent.fixFee
            })
        }
    }
}
</script>
<style scoped>
.el-icon-question {
    margin-left: 5px;
    color: #f56c6c;
    cursor: pointer;
}
.input_100 {
    width: 120px;
}
.input_200 {
    width: 200px;
}
.center {
    text-align: center;
}
.w650 {
    width: 650px;
}
</style>
