<template>
    <div>
        <el-row class="mb15">
            <el-col :span="6">
                <el-radio label="ratio" :disabled="disable" v-model="form.quoteFeeContent.quoteFeeType" @change="calcuServiceFee(0)">固定费率{{(form.quoteRule == '' || form.quoteRule == 'settle') ? '结算' : '返佣'}}</el-radio>
            </el-col>
            <template v-if="showInputRatio == 0">
                <div class="fl">实发金额 * </div>
                <el-col :span="10">
                    <el-input placeholder="请输入内容" v-model="inputStandard" @blur="calcuServiceFee(0)" :disabled="disable || !(showInputRatio == 0)">
                        <template slot="append">%</template>
                    </el-input>
                </el-col>
            </template>
        </el-row>
        <el-row class="mb15">
            <el-col :span="6">
                <el-radio label="nonflow" :disabled="disable" v-model="form.quoteFeeContent.quoteFeeType" @change="calcuServiceFee(3)">分{{ ladder_amount || 2.8}}万 - 无流水阶梯{{(form.quoteRule == '' || form.quoteRule == 'settle') ? '结算' : '返佣'}}</el-radio>
            </el-col><br>
            <el-col :span="24" v-show="showInputRatio == 3">
                <el-table :data="form.quoteFeeContent.stepwiseList">
                    <el-table-column label="月收入下限" width="240">
                        <template slot-scope="scope">
                            <template v-if="scope.row.sequence">
                                <el-input :disabled="disable" v-model="scope.row.startAmount" class="input_100" @change="checkTable(true)">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox :disabled="disable" v-model="scope.row.equalsStart" @change="equals(scope.$index, 0)">含 
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
                                <el-input :disabled="disable" v-model="scope.row.endAmount" class="input_100" @change="checkTable">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox :disabled="disable" v-model="scope.row.equalsEnd" @change="equals(scope.$index, 1)">含 
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
                            实发金额 * <el-input @blur="checkTable" :disabled="disable || !(showInputRatio == 3)" v-model="scope.row.percent" style="width: 100px;"></el-input> %  
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" :disabled="disable" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <el-row class="mb15">
            <el-col :span="6">
                <el-radio label="flow" :disabled="disable" v-model="form.quoteFeeContent.quoteFeeType" @change="calcuServiceFee(5)">分{{showInputRatio == 5 ? form.quoteFeeContent.incomeAmount : 2.8}}万 - 按流水分阶梯{{(form.quoteRule == '' || form.quoteRule == 'settle') ? '结算' : '返佣'}}</el-radio>
            </el-col><br>
            <el-col :span="24" v-show="showInputRatio == 5">
                <div>
                    月收入
                    <el-input class="input_100" :disabled="disable" v-model="form.quoteFeeContent.incomeAmount">
                        <template slot="append">万</template>
                    </el-input>
                    （含）以下
                </div>
                <el-table :data="form.quoteFeeContent.stepwiseList">
                    <el-table-column label="月总额下限" width="240">
                        <template slot-scope="scope">
                            <template v-if="scope.row.sequence">
                                <el-input v-model="scope.row.startAmount" :disabled="disable || !(showInputRatio == 5)" class="input_100" @change="checkTable(true)">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsStart" :disabled="disable || !(showInputRatio == 5)" @change="equals(scope.$index, 0)">含 
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
                                <el-input v-model="scope.row.endAmount" :disabled="disable || !(showInputRatio == 5)" class="input_100" @change="checkTable">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsEnd" :disabled="disable || !(showInputRatio == 5)" @change="equals(scope.$index, 1)">含 
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
                            实发金额 * <el-input @blur="checkTable" :disabled="disable || !(showInputRatio == 5)" v-model="scope.row.percent" style="width: 100px;"></el-input> %  
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" :disabled="disable" @click="deleteColumn(scope.$index)" v-if="scope.$index > 1 && scope.$index == columnIndex - 1">删除</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </el-table>
                <el-button class="top_24" :disabled="disable" v-if="form.quoteFeeContent.stepwiseList && form.quoteFeeContent.stepwiseList.length < 10" @click="addColumn" size="small" type="primary">增加阶梯</el-button>
                <div class="top_24">
                    月收入
                    <el-input class="input_100" :disabled="disable" v-model="form.quoteFeeContent.incomeAmount">
                        <template slot="append">万</template>
                    </el-input>
                    以上
                </div>
                <el-table class="table" :data="form.quoteFeeContent.serviceCompanyRateList">
                  <el-table-column label="落地公司" prop="serviceCompanyName"></el-table-column>
                  <el-table-column label="结算费率">
                    <template slot-scope="scope">
                      <el-input v-if="scope.row.serviceCompanyId" :disabled="disable" v-model="form.quoteFeeContent.serviceCompanyRateList[scope.$index].feeRateContent.quoteFeeRate" @blur="checkTable">
                        <template slot="append">%</template>
                      </el-input>
                    </template>
                  </el-table-column>
                </el-table>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import { setTimeout } from 'timers';
export default {
    props: {
        form: {
            type: Object,
            default(){
              return {
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
                  stepwiseList: [],
                  settleTypeList: []
                }
              }
            }
        },
        labelWidth: {
            type: String,
            default: '110px'
        },
        arrIndex: {
            type: Number
        },
        initCheck: false,
        disable: false
    },
    data() {
        return {
            inputStandard: '',
            showInputRatio: 0,
            columnIndex: 0,
            columnIndex2: 0,
            float2: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            check: '',
            ladder_amount: ''
        }
    },
    mounted() {
        console.log(this.form)
        if(!this.form.quoteFeeContent.stepwiseList || !this.form.quoteFeeContent.stepwiseList.length) {
            this.initColumn()
        }
        this.init(this.form)
    },
    methods: {
        init(a) {
            this.form = a
            this.columnIndex = this.form.quoteFeeContent.stepwiseList.length
            this.form.quoteFeeContent.quoteFeeType = this.form.quoteFeeContent.quoteFeeType || 'ratio'
            if(this.form.quoteFeeContent.quoteFeeType == 'ratio') {
                this.inputStandard = this.form.quoteFeeContent.quoteFeeRate
            }
            if(this.form.quoteFeeContent.quoteFeeType == 'nonflow') {
                this.showInputRatio = 3
            }
            if(this.form.quoteFeeContent.quoteFeeType == 'flow') {
                this.showInputRatio = 5
            }
            !this.form.quoteFeeContent.incomeAmount && (this.form.quoteFeeContent.incomeAmount = 2.8)
            if(this.form.quoteFeeContent.quoteFeeType != 'ratio') {
                this.checkTable()
            }
            else {
                if(this.inputStandard) {
                    this.check = 0
                }
            }
            if (this.initCheck) {
                // 初始化的时候触发事件 不然原始有值的时候验证无法通过
                var form = JSON.parse(JSON.stringify(this.form))
                this.$emit('result', {
                    quoteFeeContent: form.quoteFeeContent,
                    arrIndex: this.arrIndex,
                    check: this.check
                });
            }
            setTimeout(() => {
                this.$parent.clearValidate()
            }, 100)
        },
        transferObj() {
            var form = JSON.parse(JSON.stringify(this.form))
            if(form.quoteFeeContent.quoteFeeType == 'ratio') {
                form.quoteFeeContent.quoteFeeRate = this.inputStandard
            }
            this.$emit('result', {
                quoteFeeContent: form.quoteFeeContent,
                arrIndex: this.arrIndex,
                check: this.check
            })
        },
        calcuServiceFee(a) {
            this.form.quoteFeeContent.incomeAmount = 1
            this.ladder_amount = ''
            if(this.form.quoteFeeContent.quoteFeeType == 'ratio') {
                this.check = (this.float2.test(this.inputStandard) && this.inputStandard <= 100) ? 0 : '';
                this.showInputRatio = a;
                this.transferObj()
            }
            if (this.form.quoteFeeContent.quoteFeeType == 'nonflow') {
                this.check = 0;
                this.showInputRatio = a;
                this.initColumn(2)
                this.form.quoteFeeContent.stepwiseList[0].endAmount = 2.8
                this.form.quoteFeeContent.stepwiseList[1].startAmount = 2.8
                this.form.quoteFeeContent.incomeAmount = 2.8
            }
            if (this.form.quoteFeeContent.quoteFeeType == 'flow') {
                this.check = 0;
                this.showInputRatio = a;
                this.initColumn()
                this.form.quoteFeeContent.incomeAmount = 2.8
            }
            if(this.form.quoteFeeContent.quoteFeeType != 'ratio') {
                this.checkTable()
            }
        },
        addColumn(a) {
            if(isNaN(a)) {
                a = 0
            }
            var stepwiseList = this.form.quoteFeeContent.stepwiseList
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
            var stepwiseList = this.form.quoteFeeContent.stepwiseList
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
            this.form.quoteFeeContent.stepwiseList = []
            this.columnIndex = 0
            this.columnIndex2 = 0
            for(var i = 0; i < a; i++) {
                this.addColumn()
            }
        },
        amount(a, b, type) {
            var stepwiseList = this.form.quoteFeeContent.stepwiseList, amount = '', result = ''
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
            for(var i =0; i < this.form.quoteFeeContent.stepwiseList.length; i++) {
                for(var j = 0; j < 2; j++) {
                    (j || i) && (i + 1 < this.form.quoteFeeContent.stepwiseList.length) && results.push(this.amount(i, j, type))
                }
                var a = this.form.quoteFeeContent.stepwiseList[i].percent
                results.push((this.float2.test(a) && a <= 100) ? 0 : '')
            }
            var m = this.form.quoteFeeContent.incomeAmount
            results.push((this.float2.test(m) && m <= 100) ? 0 : '')
            this.form.quoteFeeContent.quoteFeeType == 'flow' && this.form.quoteFeeContent.serviceCompanyRateLis && this.form.quoteFeeContent.serviceCompanyRateList.forEach(e => {
              results.push((this.float2.test(e.feeRateContent.quoteFeeRate) && e.feeRateContent.quoteFeeRate <= 100) ? 0 : '')
            })
            this.check = results.indexOf('') > -1 ? '' : 0
            this.transferObj()
            this.$forceUpdate()
            if(this.showInputRatio == 3) {
                this.ladder_amount = this.form.quoteFeeContent.stepwiseList[0].endAmount
            }
            else {
                this.ladder_amount = ''
            }
        },
        equals(a, b) {
            var stepwiseList = this.form.quoteFeeContent.stepwiseList
            if(b) {
                stepwiseList[a + 1] && (stepwiseList[a + 1].equalsStart = !stepwiseList[a].equalsEnd)
            }
            else {
                stepwiseList[a - 1] && (stepwiseList[a - 1].equalsEnd = !stepwiseList[a].equalsStart)
            }
        },
        equalsIncomeAmount(a) {
            if(!a) {
                this.form.serviceFeeContent2.containIncomeAmount = !this.form.quoteFeeContent.containIncomeAmount
            }
            else {
                this.form.quoteFeeContent.containIncomeAmount = !this.form.serviceFeeContent2.containIncomeAmount
            }
        }
    }
}
</script>
<style lang="scss" scoped>
.demo-form {
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
.fl {
  float: left;
  margin-right: 5px;
}
.table {
  width: 500px;
}
</style>
