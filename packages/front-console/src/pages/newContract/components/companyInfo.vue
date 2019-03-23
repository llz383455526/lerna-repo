<template>
    <div>
        <h3 class="green">请添加落地公司
            <el-button size="small" type="primary" @click="dialogVisible = true" v-if="!showAddBtn"
                style="margin-left: 20px;">添加</el-button>
        </h3>
        <div class="widget-box" v-for="(formItem,index) in ruleForm.contracts" :key="index" style="margin-bottom: 20px;">
            <div class="widget-header">
                <h4 class="widget-title" style="margin-right: 25px;">{{ formItem.serviceCompanyName || '落地公司名称' }}</h4>
                <div class="widget-title">
                    <el-checkbox v-model="formItem.showServiceCompanyInfo" label="1">合同中显示服务商收款账户信息</el-checkbox>
                </div>
                <div class="widget-toolbar">
                    <el-button @click="deleteForm(index)" type="text" size="medium" v-if="!showDelBtn">删除</el-button>
                </div>
            </div>
            <div class="widget-main">
                <el-form-item label="业务方案" :prop="'contracts.'+index+'.goodsId'" :rules="{required: true, message: '请选择业务方案', trigger: 'change'}">
                    <el-select v-model="formItem.goodsId" placeholder="请选择" style="width:400px;">
                        <el-option v-for="(item, key) in (formItem.goodsList.length ? formItem.goodsList : goodsList)" :key="key" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="结算方式" :prop="'contracts.'+index+'.settleType'" :rules="{required: true, message: '请选择结算方式', trigger: 'change'}">
                    <el-select v-model="formItem.settleType" placeholder="请选择" style="width:400px;">
                        <el-option v-for="(item,key) in settleTypeList" :key="key" :label="item.text"
                            :value="item.value"></el-option>
                    </el-select>
                    <el-tooltip placement="left">
                        <div slot="content">日结：适用于管理费和绩效费同步结算，即客户一起打款管理费和对C端发放款<br />月结：适用于管理费和绩效费不能同步结清，包括阶梯费率情况、充值提现情况等所有发放款和管理费不能同步结清的，均为月结</div>
                        <i class="el-icon-question ml10"></i>
                    </el-tooltip>
                </el-form-item>
                <el-form-item label="发放方式" :prop="'contracts.'+index+'.channelTypeList'" :rules="{required: true, message: '请选择服务类型', trigger: 'change'}">
                    <el-checkbox-group v-model="formItem.channelTypeList" style="width:800px;">
                        <el-checkbox v-for="(item, key) in payModeList" :key="key" :label="item.value">{{item.label}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="服务商报价" :prop="`contracts[${index}].serviceFeeContent.fixFee`" :rules="{required: true, message: '请正确填写服务商报价', trigger: 'blur'}">
                    <contract-create-item :arrIndex="index" @result="result" :showSettledRate="true" :contractForm="formItem"></contract-create-item>
                    <!-- <contractItem label-width="0" :arrIndex="index" @result="result" :initCheck="true" :contractForm="{serviceFeeContent:formItem.serviceFeeContent,serviceFeeContent2:formItem.serviceFeeContent2}"></contractItem> -->
                </el-form-item><br>
                <template v-if="ruleForm.originalType == 20">
                    <el-form-item label="渠道经理" required>
                        <el-input v-model="chargeByName" disabled style="width:400px;"></el-input>
                    </el-form-item><br>
                    <el-form-item label="报价规则">
                        <el-radio v-for="e in ruleList" :key="e.value" v-model="formItem.quoteRule" :label="e.value" :rules="{required: true, message: '请选择报价规则', trigger: 'blur'}">{{e.text}}</el-radio>
                        <i class="el-icon-question ml10" title="结算规则：按高于结算费率的部分结算   返佣规则：按返佣费率直接返佣"></i>
                    </el-form-item><br>
                    <el-form-item label="结算费率" :prop="'contracts.'+index+'.checkC'" :rules="{required: true, message: '请正确填写服务商报价', trigger: 'blur'}">
                        <contract-close-item :arrIndex="index" :initCheck="true" @result="resultClose" :form="formItem"></contract-close-item>
                    </el-form-item>
                </template>
            </div>
        </div>

        <el-dialog title="添加公司信息" :visible.sync="dialogVisible" width="700px">
            <el-form :inline="true" :model="appForm" label-width="150px" ref="appForm">
                <el-form-item label="服务商名称">
                    <el-select v-model="info.serviceCompanyId" filterable placeholder="请选择" @change="setServiceCompany" style="width: 450px;">
                        <el-option v-for="(item,key) in serviceCompaniesList" :key="key" :label="item.name" :value="item.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 150px;">
                    <el-button type="primary" @click="formAdd">保存</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'
import { get } from '../../../store/api'
import contractCreateItem from '../../../pageComponent/contractCreateItem'
import contractCloseItem from '../../../pageComponent/contractCloseItem'
import upload from './upload'
import { mapGetters } from 'vuex'
export default {
    name: "companyInfo",
    props: ['ruleForm', 'editType', 'chargeByName', 'serviceFeeList', 'showAddBtn', 'showDelBtn', 'goodsList'],
    components: {
        contractCreateItem,
        contractCloseItem,
        upload
    },
    computed: {
        ...mapGetters({
            agentList: 'agentList',
            serviceCompaniesList: 'serviceCompaniesList',
            settleTypeList: 'settleTypeList',
            payModeList: 'payModeList',
        }),
    },
    data () {
        return {
            dialogVisible: false,
            info: {
                serviceCompanyName: '',
                serviceCompanyId: '',
                goodsList: [],
                corporateName: '',
                address: '',
                telephone: ''
            },
            customerInvoiceTypes: {
                '10': {
                    text: '账单开票',
                    value: 10
                },
                '20': {
                    text: '预开票',
                    value: 20
                }
            },
            chargeByNames: [],
            f2: (rule, value, cb) => {
                if (!/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
                    return cb('请输入正确的服务费收费（大于或等于零且最多两位小数）')
                }
            },
            ruleList: [
                {
                    text: "结算规则",
                    value: "settle"
                },
                {
                    text: "返佣规则",
                    value: "rakeback"
                }
            ],
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
                          quoteFeeType: ''
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
        }
    },
    methods: {
        formAdd() {
            let info = _.cloneDeep(this.info);
            let quoteFeeContent = _.cloneDeep(this.quoteFeeContent);
            console.log(quoteFeeContent)
            quoteFeeContent.serviceCompanyRateList[0].serviceCompanyId = info.serviceCompanyId
            quoteFeeContent.serviceCompanyRateList[0].serviceCompanyName = info.serviceCompanyName
            this.ruleForm.serviceCompanyList.push({
                serviceCompanyName: info.serviceCompanyName,
                serviceCompanyId: info.serviceCompanyId
            });
            this.ruleForm.contracts.push({
                serviceCompanyName: info.serviceCompanyName,
                serviceLegalPerson: info.corporateName,
                serviceRegisterAddr: info.address,
                servicePhone: info.telephone,
                showServiceCompanyInfo: true,
                serviceCompanyId: info.serviceCompanyId,
                goodsId: '',
                goodsList: info.goodsList,
                channelTypeList: [],
                // openInvoiceType: '',
                settleType: '',
                prePayType: '1',
                prePayContent: {
                    secondType: 'should',
                    serviceFeeRate: '',
                    serviceFeeType: ''
                },
                serviceFeeContent: {
                    discountRate: '',
                    secondType: 'real',
                    fixFee: 0,
                    monthIncomeAmount: '',
                    serviceFeeRate: '',
                    serviceFeeType: 'ratio',
                    containMonthAmount: true,
                    stepwiseList: []
                },
                serviceFeeContent2: {
                    containMonthAmount: false,
                    monthIncomeAmount: '',
                    stepwiseList: []
                },
                referIds: [],
                referNames: [],
                check: '',
                agentCompanyName: '',
                agentFeeContent: {
                    discountRate: '',
                    fixFee: '',
                    secondType: 'real',
                    serviceFeeRate: '',
                    serviceFeeType: 'ratio'
                },
                quoteRule: this.quoteRule,
                quoteFeeContent: quoteFeeContent
            });
            this.dialogVisible = false;
        },
        result({
            serviceFeeContent,
            serviceFeeContent2,
            arrIndex,
            check
        }) {
            this.ruleForm.contracts[arrIndex].check = check;
            this.ruleForm.contracts[arrIndex].serviceFeeContent = serviceFeeContent
            this.ruleForm.contracts[arrIndex].serviceFeeContent2 = serviceFeeContent2
            // this.serviceFeeList[arrIndex] = {
            //     serviceFeeContent: serviceFeeContent,
            //     serviceFeeContent2: serviceFeeContent2
            // };
        },
        resultClose({quoteFeeContent, arrIndex, check}) {
            this.ruleForm.contracts[arrIndex].checkC = check;
            this.ruleForm.contracts[arrIndex].quoteFeeContent = quoteFeeContent
	    },
        handleSuccess(fileList, referArr, arrIndex) {
            let contract = this.ruleForm.contracts[arrIndex];
            contract.referNames = fileList;
            contract.referIds = referArr;
        },
        deleteForm(i) {
            this.ruleForm.serviceCompanyList.splice(i, 1);
            this.ruleForm.contracts.splice(i, 1);
            this.serviceFeeList.splice(i, 1);
        },
        setServiceCompany(o, serviceCompanyId) {
            let serviceCompany = _.find(this.serviceCompaniesList, o => {
                return o.companyId === this.info.serviceCompanyId
            });
            this.info.serviceCompanyName = serviceCompany.name;
            this.info.corporateName = serviceCompany.corporateName;
            this.info.address = serviceCompany.address;
            this.info.telephone = serviceCompany.telephone;
            get('/api/salemgt/common/service-company/goods', {
                serviceCompanyId: serviceCompanyId || serviceCompany.companyId
            }).then(result => {
                this.info.goodsList = result || []
            })
        }
    },
    mounted() {
        this.$store.dispatch('getAgentList')
        this.$store.dispatch('getServiceCompaniesList')
        this.$store.dispatch('getSettleTypeList')
        this.agentList.forEach(e => {
            if(e.companyId == this.ruleForm.agentCompanyId) {
                this.quoteFeeContent = e.quoteFeeContent
                this.quoteRule = e.quoteRule
            }
        })
        this.quoteFeeContent = this.quoteFeeContent || {
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
                        quoteFeeType: ''
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
        }
        // let isChange = sessionStorage.getItem('companyChange')
        // sessionStorage.removeItem('companyChange')
        this.ruleForm.contracts.forEach(item => {
            item.showServiceCompanyInfo = item.showServiceCompanyInfo === '1' ? true : false;
            // if(!item.quoteFeeContent || isChange) {
            // item.quoteFeeContent = this.quoteFeeContent
            // item.quoteRule = this.quoteRule
            // }
        })
    }
}
</script>

<style scoped>
.form-list {
    border: 1px solid #999999;
    /* padding: 32px 100px 20px 0; */
    /* margin: 0 0 22px 100px; */
    position: relative;
    /* width: 1200px; */
}

/* .btn-del {
    padding: 0;
    position: absolute;
    top: 20px;
    right: 20px;
} */

.btn-add {
    font-weight: normal;
    color: red;
    margin-left: 30px;
}
.el-icon-question {
    margin-right: 5px;
    color: #f56c6c;
    cursor: pointer;
}
.el-icon-question {
	margin-right: 5px;
	color: #f56c6c;
	cursor: pointer;
}
</style>
