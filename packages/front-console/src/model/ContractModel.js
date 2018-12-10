import BaseModel from './base/BaseModel'
import { get } from '../store/api'
import _ from 'lodash'
/**
 * 合同表单 model
 */
class ContractModel extends BaseModel {
    constructor () {
        super();
        this.contractId = '';
        this.rules = {
            // 合同选项
            contractType: [
                { required: true, message: '请选择合同类型', trigger: 'change' }
            ],
            customIndustry: [
                { required: true, message: '请输入客户从事行业', trigger: 'blur' }
            ],
            serviceType: [
                { type: 'array', required: true, message: '请选择服务类型', trigger: 'change' },
                { type: 'array', max: 5, message: '最多只能选5个', trigger: 'change' }
            ],
            contractStartDate: [
                { required: true, message: '请选择合同期限', trigger: 'blur' }
            ],
            // 客户企业评估
            expectedMonthlyFlow: [
                { required: true, message: '请输入预计月流水', trigger: 'blur' }
            ],
            expectedProportion: [
                { required: true, message: '请输入预计3万以上比例', trigger: 'blur' }
            ],
            // 销售联系信息
            contractPerson: [
                { required: true, message: '请输入销售姓名', trigger: 'blur' }
            ],
            contractEmail: [
                { required: true, message: '请输入销售联系邮箱', trigger: 'blur' }
            ],
            contractTel: [
                { required: true, message: '请输入销售联系电话', trigger: 'blur' }
            ],
            contractAddr: [
                { required: true, message: '请输入合同联系人地址', trigger: 'blur' }
            ],
            // 企业基本信息
            customNature: [
                {required: true, message: '请选择客户性质', trigger: 'change'}
            ],
            customerName: [
                {required: true, message: '请输入企业名称', trigger: 'blur'}
            ],
            areaName: [
                {required: true, message: '请输入企业地址', trigger: 'blur'}
            ],
            customLegalPerson: [
                {required: true, message: '请输入法定代表人', trigger: 'blur'}
            ],
            customCollector: [
                {required: true, message: '请输入企业负责人', trigger: 'blur'}
            ],
            customCollectorPhone: [
                {required: true, message: '请输入负责人手机', trigger: 'blur'}
            ],
            customMail1: [
                {required: true, message: '请输入负责人邮箱1', trigger: 'blur'}
            ],
            customCollectorAddr: [
                {required: true, message: '请输入负责人地址', trigger: 'blur'}
            ],
            // 企业开票信息
            invoiceCompanyName: [
                {required: true, message: '请输入企业名称', trigger: 'blur'}
            ],
            customTaxIdcd: [
                {required: true, message: '请输入纳税人识别号', trigger: 'blur'}
            ],
            customPhone: [
                {required: true, message: '请输入企业电话', trigger: 'blur'}
            ],
            customBankName: [
                {required: true, message: '请输入开户银行', trigger: 'blur'}
            ],
            customBankAccount: [
                {required: true, message: '请输入银行账号', trigger: 'blur'}
            ],
            invoiceType: [
                {required: true, message: '请选择发票类型', trigger: 'change'}
            ]
        };
        this.contractForm = {
            // 合同选项
            contractTplId: '',
            contractType: '',
            customIndustry: '',
            serviceType: [],
            contractStartDate: '',
            contractEndDate: '',
            // 客户企业评估
            expectedMonthlyFlow: '',
            expectedProportion: '',
            // 销售联系信息
            contractPerson: '',
            contractEmail: '',
            contractTel: '',
            contractAddr: '',
            // 企业基本信息
            customNature: '',
            customerName: '',
            areaName: '',
            customLegalPerson: '',
            customCollector: '',
            customCollectorPhone: '',
            customMail1: '',
            customMail2: '',
            customCollectorAddr: '',
            // 相关商户信息
            companyApps: [],
            // 企业开票信息
            invoiceCompanyName: '',
            customTaxIdcd: '',
            customPhone: '',
            customBankName: '',
            customBankAccount: '',
            invoiceType: '',
            // 落地公司信息
            serviceCompanyList: [],
            contracts: [],
            // 合同附加条款
            vciBuyType: '',
            vciPlanName: '',
            vciPayType: '',
            vciSettleExp: '',
            // vciServiceName: '',
            payAndInvoiceSame: '',
            customCompanyUnderType: '',
            customUnderAttachList: [],
            showSubjectInfo: '',
            referIds: [],
            referNames: []
        };
        this.contractTplList = [];
        this.businessTypeList = [];
        this.serviceTypeList = []; // 已选择的服务类型
        this.serviceTypes = []; // 全部服务类型列表
        this.serviceCompaniesList = [];
        this.invoiceTypeList = []; // 发票类型
        this.settleTypeList = []; // 结算方式
        this.customNatureList = []; // 客户性质
        this.contractDate = ''; // 合同周期
        this.workflowType = ''; // 合同类型
        this.VciPayTypeList = ''; // 付款方式
        this.getAllOptions();
        this.actions = '';
        this.processLogs = [];
        this.serviceFeeList = [];
        this.editType = ''; // 表单类型
        this.files = []; // 上传甲方下属公司清单
    }
    getAllOptions () {
        this.getContractTpl();
        this.getBusinessType();
        this.getServiceTypes();
        this.getOptionServiceCompanies();
        this.getInvoiceType();
        this.getSettleType();
        this.getCustomNatureList();
        this.getVciPayTypeList();
    }
    // 获取合同模板列表
    getContractTpl () {
        get('/api/contract-web/contract-tpl/tpl-options').then(result => {
            this.contractTplList = result
        })
    }
    // 获取合同类型列表
    getBusinessType () {
        get('/api/sysmgr-web/commom/option', {
            enumType: 'IndustryType'
        }).then(result => {
            this.businessTypeList = result
        })
    }
    // 获取服务类型列表 (转化为类型列表数组)
    getServiceTypes () {
        get('/api/contract-web/service-mgr/get-service-type-options').then(result => {
            this.serviceTypes = result;
        })
    }
    // 获取服务商名称列表
    getOptionServiceCompanies () {
        get('/api/console-dlv/option/get-option-service-companies').then(result => {
            this.serviceCompaniesList = result
        })
    }
    // 获取发票类型
    getInvoiceType () {
        get('/api/contract-web/commom/option', {enumType: 'InvoiceType'}).then(result => {
            this.invoiceTypeList = result;
        })
    }
    // 获取结算方式列表
    getSettleType () {
        get('/api/contract-web/commom/option', {enumType: 'SettleType'}).then(result => {
            this.settleTypeList = result;
        })
    }
    // 获取客户性质列表
    getCustomNatureList () {
        get('/api/sysmgr-web/commom/option?enumType=CustomNature').then(data =>{
            this.customNatureList = data;
        })
    }
    // 获取付款方式
    getVciPayTypeList () {
        get('/api/sysmgr-web/commom/option?enumType=VciPayType').then(data =>{
            this.VciPayTypeList = data;
            this.contractForm.vciPayType = this.contractForm.vciPayType || data[0].value
        })
    }
    // 获取已选择服务类型数组
    getServiceTypeList () {
        let serviceType = this.contractForm.serviceType;
        if(serviceType.length) {
            _.forEach(serviceType, item => {
                this.serviceTypeList.push(item.serviceId)
            })
        }
    }
    // 获取合同周期
    getContractDate () {
        let contractStartDate = this.contractForm.contractStartDate;
        let contractEndDate = this.contractForm.contractEndDate;
        this.contractDate = [contractStartDate, contractEndDate];
    }
    // 获取 上传甲方下属公司清单
    getFiles() {
        let customUnderAttachList = this.contractForm.customUnderAttachList;
        if (!customUnderAttachList.length) {
            return;
        }
        this.files = [{
            name: customUnderAttachList[0].displayname,
            url: customUnderAttachList[0].downloadCode
        }];
    }
    // 获取合同id
    getContractId () {
        get('/api/opencrm/workflow/generate_instance_id').then(result => {
            this.contractId = result
        })
    }
    // 获取合同详细信息
    getContractDetail (id) {
        get(`/api/opencrm/workflow/details/${id}`).then(result => {
            this.contractForm = result.datas;
            this.actions = result.actions;
            this.processLogs = result.processLogs;
            this.workflowType = result.workflowType;
            this.contractForm.contracts.forEach(e => {
                if(!e.agentFeeContent) {
                    e.agentFeeContent = {
                        discountRate: '',
                        fixFee: '',
                        secondType: 'real',
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio'
                    }
                }
            })
            this.getServiceTypeList();
            this.getContractDate();
            this.getFiles();
            this.changeCheckbox();
        })
    }
    // 获取详细信息之后转换checkbox
    changeCheckbox () {
        this.contractForm.showSubjectInfo = this.contractForm.showSubjectInfo === '1' ? true : false;
        this.contractForm.contracts.forEach(item => {
            item.showServiceCompanyInfo = item.showServiceCompanyInfo === '1' ? true : false;
        })
    }
    // 上传之前处理服务商报价数据
    changeServiceFeeList () {
        let serviceFeeList = this.serviceFeeList;
        if (serviceFeeList) {
            _.forEach(serviceFeeList, (item,key) => {
                let contracts = this.contractForm.contracts[key];
                contracts.serviceFeeContent = item.serviceFeeContent;
                contracts.serviceFeeContent2 = item.serviceFeeContent2;
            })
        }
    }
}

export default ContractModel;