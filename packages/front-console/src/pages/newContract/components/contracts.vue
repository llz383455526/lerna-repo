<template>
    <div>
        <h3 class="green">请添加落地公司
            <el-button 
                size="small" 
                type="primary" 
                @click="dialogVisible = true;info.serviceCompanyId = ''" 
                v-if="!showAddBtn"
                style="margin-left: 20px;">添加</el-button>
        </h3>
        <div class="widget-box" v-for="(formItem,index) in ruleForm.contracts" :key="index" style="margin-bottom: 20px;">
            <div class="widget-header">
                <h4 class="widget-title" style="margin-right: 25px;">{{formItem.taxLandingName}} / {{ formItem.serviceCompanyName || '落地公司名称' }}</h4>
                <div class="widget-title">
                    <el-checkbox v-model="formItem.showServiceCompanyInfo" label="1">合同中显示服务商收款账户信息</el-checkbox>
                </div>
                <div class="widget-toolbar">
                    <el-button @click="deleteForm(index)" type="text" size="medium" v-if="!showDelBtn">删除</el-button>
                </div>
            </div>
            <div class="widget-main">
                <!-- <el-form-item label="业务方案" :prop="'contracts.'+index+'.goodsId'" :rules="{required: true, message: '请选择业务方案', trigger: 'change'}">
                    <el-select v-model="formItem.goodsId" placeholder="请选择" style="width:400px;">
                        <el-option v-for="(item, key) in (formItem.goodsList.length ? formItem.goodsList : goodsList)" :key="key" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item> -->
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
                </el-form-item>
                <el-form-item style="display: flex; padding-left: 100px;" :prop="'contracts.'+index+'.serviceTypeList'" label="服务类型" :rules="{required: true, message: '请选择服务类型', trigger: 'blur'}">
                    <el-checkbox-group @change="serverTypeChangeChange" v-model="formItem.serviceTypeList">
                        <el-checkbox v-for="v in formItem.optionServiceTypeList" :label="v" :key="v.serviceId">
                            {{ v.serviceName }}
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <br>
                <template v-if="ruleForm.originalType == 20">
                    <el-form-item label="渠道经理" required>
                        <el-input v-model="chargeByName" disabled style="width:400px;"></el-input>
                    </el-form-item><br>
                    <el-form-item label="报价规则" :rules="{required: true, message: '请选择报价规则', trigger: 'blur'}">
                        <el-radio v-for="e in ruleList" :key="e.value" v-model="formItem.quoteRule" :label="e.value" :disabled="true">{{e.text}}</el-radio>
                        <i class="el-icon-question ml10" title="结算规则：按高于结算费率的部分结算   返佣规则：按返佣费率直接返佣"></i>
                    </el-form-item><br>
                    <el-form-item label="结算费率" :prop="'contracts.'+index+'.checkC'" :rules="{required: true, message: '请正确填写服务商报价', trigger: 'blur'}">
                        <contract-close-item :arrIndex="index" :initCheck="true" @result="resultClose" :form="formItem" :disable="true"></contract-close-item>
                    </el-form-item>
                </template>
            </div>
        </div>

        <el-dialog title="添加公司信息" :visible.sync="dialogVisible" width="700px">
            <el-form :inline="true" :model="appForm" label-width="150px" ref="appForm">
                <el-form-item label="服务商名称">
                    <el-select v-model="info.serviceCompanyId" filterable placeholder="请选择" @change="setServiceCompany" style="width: 450px;">
                        <el-option v-for="(item,key) in customerServiceCompanyList" :key="key" :label="item.name" :value="item.companyId"></el-option>
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
import { get, post } from '../../../store/api'
import contractCreateItem from '../../../pageComponent/contractCreateItem'
import contractCloseItem from '../../../pageComponent/contractCloseItem'
import upload from './upload'
import { mapGetters } from 'vuex'
export default {
    name: "companyInfo",
    props: ['ruleForm', 'editType', 'serviceFeeList', 'showAddBtn', 'showDelBtn', 'goodsList'],
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
            allServiceTypeList: 'serviceTypeList',
            customerServiceCompanyList: 'customerServiceCompanyList'
        }),
        agentCompanyList() {
            let agentCompanyList = []
            this.quoteFeeContent.serviceCompanyRateList.forEach(e => {
                agentCompanyList.push({
                    name: e.serviceCompanyName,
                    companyId: e.serviceCompanyId
                })
            })
            return agentCompanyList
        },
        filterList() {
            let list = this.agentCompanyList.length ? this.agentCompanyList : this.serviceCompaniesList
            // 过滤，已经有的落地公司不再显示
            return list.filter(e => {
                return !this.ruleForm.contracts.filter(ev => ev.serviceCompanyId == e.companyId).length
            })
        }
    },
    watch: {
        agentList() { // 获取代理商列表并找到当前代理商
            this.agentList.forEach(e => {
                if(e.companyId == this.ruleForm.agentCompanyId) {
                    this.chargeByName = e.chargeByName
                    Object.assign(this.quoteFeeContent, e.quoteFeeContent)
                    // this.quoteFeeContent = e.quoteFeeContent
                    this.quoteRule = e.quoteRule
                }
            })
        },
        ruleForm() {
            this.initData()
        },
        serviceCompaniesList() {
            this.initData()
        }
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
                telephone: '',
                taxLandingId: ''
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
                serviceCompanyRateList: [],
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
            // 服务类型集合
            serverTypeMap: new Map(),
        }
    },
    methods: {
        initData() {
            this.ruleForm.contracts.forEach((item) => {
                // 设置落地公司ID
                this.serviceCompaniesList.some((item1) => {
                    if (item1.companyId === item.serviceCompanyId) {
                        item.taxLandingId = item1.taxLandingId
                        item.taxLandingName = item1.taxLandingName
                        return true
                    }
                })
            })
            this.updateServiceTypeList()
            this.upDataServerType()
        },
        // 根据ID获取服务类型
        getServerTypeWithId(id) {
            let itemx = null
            this.allServiceTypeList.some((item) => {
                if (id === item.serviceId) {
                    itemx = item
                }
            })
            return itemx
        },
        // 更新每个落地公司选择的服务类型
        updateServiceTypeList() {
            this.ruleForm.contracts.forEach((item) => {
                item.serviceTypeList = item.serviceTypeList.map((item) => {
                    return this.getServerTypeWithId(item.serviceId)
                })
            })
        },
        // 更新当前显示的服务类型
        upDataServerType() {
            this.serverTypeMap = new Map()
            this.ruleForm.contracts.forEach((item) => {
                let set = null
                // 设置已经选择的服务类型集合
                if (this.serverTypeMap.has(item.taxLandingId)) {
                    set = this.serverTypeMap.get(item.taxLandingId)
                } else {
                    set = new Set()
                    this.serverTypeMap.set(item.taxLandingId, set)
                }
                // 添加已经选中的
                item.serviceTypeList.forEach((item2) => {
                    if (item2.serviceId) {
                        set.add(item2.serviceId)
                    }
                })
            })
            this.ruleForm.contracts.forEach((item) => {
                let set = this.serverTypeMap.get(item.taxLandingId)
                // 已经选中的数据
                const selArr = Array.from(set)
                // 获取当前选中的数组集合
                const serviceTypeListSet = new Set(item.serviceTypeList.map((item) => {
                    return item.serviceId
                }))
                // 排除掉当前选中的数组
                const otherSelArr = selArr.filter((item1) => {
                    return !serviceTypeListSet.has(item1)
                })
                // 获取其他已经选中数据的集合
                const otherSelSet = new Set(otherSelArr)
                // 排除掉已经选中的
                let arr = this.allServiceTypeList.filter((item1) => {
                    return !otherSelSet.has(item1.serviceId)
                })
                item.optionServiceTypeList = arr
            })
            this.$forceUpdate()
        },
        /**
         * 服务类型改变的时候调用
         */
        serverTypeChangeChange(arr) {
            if (arr.length > 5) {
                arr.pop()
                this.$message({
                    message: '最多选择5条服务类型',
                    type: 'warning'
                });
            }
            this.upDataServerType()
        },
        formAdd(ev) {
            const customCompanyId = this.ruleForm.customerId
            const serviceCompanyId = this.info.serviceCompanyId
            const param = { customCompanyId, serviceCompanyId }
            post('/api/contract-web/commom/custom-form-contract', param).then((res) => {
                this.ruleForm.contracts.push(res)
                this.ruleForm.serviceCompanyList.push({
                    serviceCompanyName: this.info.serviceCompanyName,
                    serviceCompanyId: this.info.serviceCompanyId
                });
                this.dialogVisible = false
                this.updateServiceTypeList()
                this.upDataServerType()
            })
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
            this.ruleForm.serviceCompanyList && this.ruleForm.serviceCompanyList.splice(i, 1);
            this.ruleForm.contracts.splice(i, 1);
            this.serviceFeeList && this.serviceFeeList.splice(i, 1);
            this.upDataServerType()
        },
        setServiceCompany(serviceCompanyId) {
            const serviceCompany = this.customerServiceCompanyList.find((o) => {
                return o.companyId === serviceCompanyId
            });
            this.info.serviceCompanyName = serviceCompany.name;
            this.info.corporateName = serviceCompany.corporateName;
            this.info.address = serviceCompany.address;
            this.info.telephone = serviceCompany.telephone;
            this.info.taxLandingId = serviceCompany.taxLandingId
            this.info.taxLandingName = serviceCompany.taxLandingName
            get('/api/salemgt/common/service-company/goods', {
                serviceCompanyId
            }).then(result => {
                this.info.goodsList = result || []
            })
        }
    },
    async mounted() {
        await this.$store.dispatch('getServiceTypeList')
        this.$store.dispatch('getAgentList')
        this.$store.dispatch('getServiceCompaniesList', this.ruleForm.agentCompanyId)
        this.$store.dispatch('getSettleTypeList')
        this.$store.dispatch('getCustomerServiceCompanyList', this.ruleForm.customerId)

        this.ruleForm.contracts.forEach(item => {
            item.showServiceCompanyInfo = item.showServiceCompanyInfo === '1' ? true : false;
            let serviceCompanyRateList = item.quoteFeeContent.serviceCompanyRateList
            if(serviceCompanyRateList && serviceCompanyRateList.length) {
                item.quoteFeeContent.serviceCompanyRateList = serviceCompanyRateList.filter(e => e.serviceCompanyId == item.serviceCompanyId)
            }
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
