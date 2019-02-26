<template>
    <div>
        <el-row class="mb15" v-if="form.quoteRule != 'rakeback'">
            <el-table :data="form.quoteFeeContent.settleTypeList">
                <template v-if="form.quoteFeeContent.quoteFeeType == 'ratio'">
                    <el-table-column label="计算公式" width="400" key="0-1">
                        <template slot-scope="scope">
                            实发*（ 
                            <el-select class="input_100" v-model="scope.row.formula1" @change="checkTable">
                                <el-option v-for="e in settleList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                            </el-select>
                            &#x3000;——&#x3000;
                            <el-select class="input_100" v-model="scope.row.formula2" @change="checkTable">
                                <el-option v-for="e in settleList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                            </el-select> 
                            ）
                        </template>
                    </el-table-column>
                    <el-table-column label="结算周期" key="0-2">
                        <template slot-scope="scope">
                            <el-select class="input_100" v-model="scope.row.settlePeriod" @change="checkTable">
                                <el-option v-for="e in periodList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                </template>
                <template v-else>
                    <el-table-column label="月总额下限" width="240">
                        <template slot-scope="scope">
                            <template v-if="scope.row.ctype == 1">
                                <el-input v-model="scope.row.startAmount" class="input_100" @change="checkTable">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsStart">含 
                                    以上
                                </el-checkbox>
                            </template>
                            <template v-else>
                                <div class="center">无</div>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="月总额上限" width="240">
                        <template slot-scope="scope">
                            <template v-if="scope.row.ctype == 0">
                                <el-input v-model="scope.row.endAmount" class="input_100" @change="checkTable">
                                    <template slot="append">万</template>
                                </el-input>
                                <el-checkbox v-model="scope.row.equalsEnd">含 
                                    以下
                                </el-checkbox>
                            </template>
                            <template v-else>
                                <div class="center">无</div>
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="计算公式" width="400">
                        <template slot-scope="scope">
                            实发*（ 
                            <el-select class="input_100" v-model="scope.row.formula1" @change="checkTable">
                                <el-option v-for="e in settleList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                            </el-select>
                            &#x3000;——&#x3000;
                            <el-select class="input_100" v-model="scope.row.formula2" @change="checkTable">
                                <el-option v-for="e in settleList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                            </el-select> 
                            ）
                        </template>
                    </el-table-column>
                    <el-table-column label="结算周期">
                        <template slot-scope="scope">
                            <el-select class="input_100" v-model="scope.row.settlePeriod" @change="checkTable">
                                <el-option v-for="e in periodList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                            </el-select>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="form.quoteFeeContent.quoteFeeType != 'ratio'">
                        <template slot-scope="scope">
                            <el-button type="text" @click="addColumn(0)" v-if="scope.$index == 0">+结算周期</el-button>
                            <el-button type="text" @click="addColumn(1)" v-else-if="scope.$index == form.quoteFeeContent.settleTypeList.filter(e => e.ctype == 0).length">+结算周期</el-button>
                            <el-button type="text" @click="deleteColumn(scope.$index)" v-else>-删除周期</el-button>
                            <div class="center" v-else>-</div>
                        </template>
                    </el-table-column>
                </template>
            </el-table>
            <!-- <el-button class="top_24" v-if="form.quoteFeeContent.settleTypeList && form.quoteFeeContent.settleTypeList.length < 10 && form.quoteFeeContent.quoteFeeType != 'ratio'" @click="addColumn" size="small" type="primary">增加阶梯</el-button> -->
        </el-row>
        <el-row class="mb15" v-else>
            实发*返佣比例%
        </el-row>
    </div>
</template>
<script>
import { setTimeout } from 'timers';
import { get, post, postWithErrorCallback, formPost } from "../store/api";
export default {
    props: {
        form: {
            type: Object,
            default(){
              return {
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
        initCheck: false
    },
    data() {
        return {
            inputStandard: '',
            showInputRatio: 0,
            float2: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
            check: '',
            settleList: [],
            periodList: [],
            sum: ''
        }
    },
    watch: {
        'form.quoteFeeContent.quoteFeeType'(v) {
            this.initColumn()
        },
        'form.quoteRule'(v) {
            if(v == 'rakeback') {
                this.check = 0
                this.sum = ''
                this.transferObj()
            }
            else if(v == 'settle') {
                this.initColumn()
            }
        }
    },
    mounted() {
        if(!this.form.quoteFeeContent.settleTypeList || !this.form.quoteFeeContent.settleTypeList.length) {
            this.initColumn()
        }
        this.init(this.form)
        get('/api/contract-web/commom/option?enumType=AgentSettleRateType').then(data => {
            this.settleList = data
        })
        get('/api/contract-web/commom/option?enumType=SettlePeriod').then(data => {
            this.periodList = data
        })
    },
    methods: {
        init(a) {
            if(this.form.quoteRule == 'rakeback') {
                this.check = 0
            }
            this.sum = this.form.quoteFeeContent.settleTypeList[0].endAmount
            this.checkTable()
        },
        transferObj() {
            var form = JSON.parse(JSON.stringify(this.form))
            if(form.quoteFeeContent.quoteFeeType == 'ratio') {
                form.quoteFeeContent.quoteFeeRate = this.inputStandard
            }
            this.$emit('result', {
                quoteFeeContent: form.quoteFeeContent,
                check: this.check
            })
        },
        addColumn(a) {
            let settleTypeList = this.form.quoteFeeContent.settleTypeList,
                item = {
                    startAmount: a == 1 ? this.sum : '',
                    equalsStart: a == 1 ? true : '',
                    endAmount: a == 0 ? this.sum : '',
                    equalsEnd: a == 0 ? true : '',
                    sequence: '',
                    formula1: '',
                    formula2: '',
                    settlePeriod: '',
                    ctype: a
                }
            if(a == 0) {
                let index = settleTypeList.filter(e => e.ctype == 0).length
                settleTypeList.splice(index, 0, item)
            }
            else {
                settleTypeList.push(item)
            }
            this.serializeSequence()
        },
        deleteColumn(a) {
            var settleTypeList = this.form.quoteFeeContent.settleTypeList
            settleTypeList.splice(a, 1)
            this.serializeSequence()
            this.checkTable()
        },
        initColumn(a) {
            if((this.form.quoteFeeContent.quoteFeeType == 'ratio' && this.form.quoteFeeContent.settleTypeList.length == 1) || (this.form.quoteFeeContent.quoteFeeType != 'ratio' && this.form.quoteFeeContent.settleTypeList.length >= 2)) {
                return
            }
            this.form.quoteFeeContent.settleTypeList = []
            if(this.form.quoteRule == 'rakeback') {
                return
            }
            a = this.form.quoteFeeContent.quoteFeeType == 'ratio' ? 1 : 2
            for(var i = 0; i < a; i++) {
                this.addColumn(i)
            }
            this.$forceUpdate()
        },
        amount(a, b) {
            var settleTypeList = this.form.quoteFeeContent.settleTypeList, result = ''
            settleTypeList.forEach(e => {
                e.ctype == 0 ? e.endAmount = this.sum : e.startAmount = this.sum
            })
            if(this.float2.test(this.sum)) {
                result = 0
            }
            return result
        },
        serializeSequence() {
            this.form.quoteFeeContent.settleTypeList.forEach((e, i) => {
                e.sequence = i
            })
        },
        checkTable(a) {
            if(!isNaN(a)) {
                this.sum = a
            }
            var results = [], keyList = ['formula1', 'formula2', 'settlePeriod']
            for(var i =0; i < this.form.quoteFeeContent.settleTypeList.length; i++) {
                for(var j = 0; j < 2; j++) {
                    (j || i) && (i + 1 < this.form.quoteFeeContent.settleTypeList.length) && results.push(this.amount(i, j))
                }
                keyList.forEach(e => {
                    results.push(this.form.quoteFeeContent.settleTypeList[i][e])
                })
            }
            this.check = results.indexOf('') > -1 ? '' : 0
            this.transferObj()
            this.$forceUpdate()
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
