import BaseModel from '../../base/BaseModel'
import { get } from '../../../store/api'
import _ from 'lodash'
import { resolve } from 'path';
/**
 * 合同表单 model
 */
class ContractModel extends BaseModel {
    constructor() {
        super();
        this.contractId = '';
        this.contractForm = {
            // 企业入驻申请变更
            customerId: '',
            flowMemo: '',
            versionStartDate: '',
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
            agentClient: '', // 是否代理商客户
            agentCompanyId: '', // 代理商名称
            // 企业基本信息
            customNature: '',
            serviceCodes: [],
            isFromOutApp: '0',
            customerName: '',
            areaName: '',
            customLegalPerson: '',
            customCollector: '',
            customCollectorPhone: '',
            customMail1: '',
            companyChargeName: '',
            companyChargePhone: '',
            companyChargeMail: '',
            customMail2: '',
            customCollectorAddr: '',
            // 相关商户信息
            companyApps: [
                // {
                //     companyId: '{{companyId}}',
                //     appId: 'app{{companyId}}',
                //     appName: '',
                //     chargeByName: '',
                //     chargeByPhone: '',
                //     chargeByMail: '',
                //     isFromOutApp: '{{isFromOutApp}}'
                // }
            ],
            // 企业开票信息
            invoiceCompanyName: '',
            customTaxIdcd: '',
            invoiceAddress: '',
            customPhone: '',
            customBankName: '',
            customBankAccount: '',
            invoiceType: '',
            // 落地公司信息
            serviceCompanyList: [],
            contracts: [],
            openInvoiceType: '账单开票',
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
            referNames: [],
            // 流程状态
            status: '',
            // 送审的三个字段
            approveType: '',
            // originalType: '',
            // originalTypeName: '',
            // original: '',
            receiver: '',
            receivePhone: '',
            receiveAddrList: [],
            receiveAddr: '',
            receiveMemo: '',
            receiveAttachments: [],
        };
        this.serviceTypeList = []; // 已选择的服务类型
        this.serviceCompaniesList = [];
        this.invoiceTypeList = []; // 发票类型
        this.settleTypeList = []; // 结算方式
        this.customNatureList = []; // 客户性质
        this.contractDate = ''; // 合同周期
        this.workflowType = ''; // 合同类型
        this.VciPayTypeList = ''; // 付款方式
        this.payMode = {
            'A': { label: '银行', value: 'A' },
            'B': { label: '支付宝', value: 'B' },
            'C': { label: '微信', value: 'C' }
        }; // 发放方式
        this.getAllOptions();
        this.actions = '';
        this.processLogs = [];
        this.serviceFeeList = [];
        this.editType = ''; // 表单类型
        this.files = []; // 上传甲方下属公司清单
        this.customCompanyUnderTypeList = [
            { text: '甲方分公司', value: 'branch' },
            { text: '甲方子公司', value: 'sub' }
        ]; // 甲方下属公司类型
        this.chargeByName = ''; // 渠道经理名称
        this.agentList = []; // 代理商列表
    }
    getAllOptions() {
        this.getOptionServiceCompanies();
        this.getInvoiceType();
        this.getSettleType();
        this.getCustomNatureList();
        this.getVciPayTypeList();
        this.getAgentList();
    }
    // 获取服务商名称列表
    getOptionServiceCompanies() {
        get('/api/salemgt/common/service-company/list?businessed=true').then(result => {
            this.serviceCompaniesList = result
        })
    }
    // 获取发票类型
    getInvoiceType() {
        get('/api/contract-web/commom/option', { enumType: 'InvoiceType' }).then(result => {
            this.invoiceTypeList = result;
        })
    }
    // 获取结算方式列表
    getSettleType() {
        get('/api/contract-web/commom/option', { enumType: 'SettleType' }).then(result => {
            this.settleTypeList = result;
        })
    }
    // 获取客户性质列表
    getCustomNatureList() {
        get('/api/sysmgr-web/commom/option?enumType=CustomNature').then(data => {
            this.customNatureList = data;
        })
    }
    // 获取付款方式
    getVciPayTypeList() {
        get('/api/sysmgr-web/commom/option?enumType=VciPayType').then(data => {
            this.VciPayTypeList = data;
            this.contractForm.vciPayType = this.contractForm.vciPayType || data[0].value
        })
    }
    // 获取代理商列表
    getAgentList() {
        return new Promise((res, rej) => {
            get('/api/contract-web/agent-contract/agent-company-option?sign=true').then(data => {
                this.agentList = data
                res()
            })
        })
    }
    // 获取合同周期
    getContractDate() {
        let contractStartDate = this.contractForm.contractStartDate;
        let contractEndDate = this.contractForm.contractEndDate;
        this.contractDate = [contractStartDate, contractEndDate];
    }
    // 获取 上传甲方下属公司清单
    getFiles() {
        let customUnderAttachList = this.contractForm.customUnderAttachList;
        if (!customUnderAttachList || !customUnderAttachList.length) {
            return;
        }
        this.files = [{
            name: customUnderAttachList[0].displayname,
            url: customUnderAttachList[0].downloadCode
        }];
    }
    // 获取合同id
    getContractId() {
        get('/api/opencrm/workflow/generate_instance_id').then(result => {
            this.contractId = result
        })
    }
    // 获取渠道经理
    getChargeByName(companyId) {
        companyId = companyId || this.contractForm.agentCompanyId
        if (!companyId || !this.agentList.length) return;
        let obj = this.agentList.find(element => {
            return element.companyId === companyId;
        });
        this.chargeByName = obj.chargeByName;
    }
    // 获取合同详细信息
    getContractDetail(id, callback, type) {
        return new Promise((resolve, reject) => {
            get(`/api/opencrm/workflow/details/${id}`).then(result => {
                result.datas.contracts.forEach((e) => {
                    if (!e.serviceTypeList) {
                        e.serviceTypeList = []
                    }
                })
                this.contractForm = _.assign({}, result.datas);
                this.actions = result.actions;
                this.processLogs = result.processLogs;
                this.workflowType = result.workflowType;
                this.status = result.status;
                this.contractForm.contracts.forEach(e => {
                    if (!e.agentFeeContent) {
                        e.agentFeeContent = {
                            discountRate: '',
                            fixFee: '',
                            secondType: 'real',
                            serviceFeeRate: '',
                            serviceFeeType: 'ratio'
                        }
                    }
                    if (!e.serviceTypeList) {
                        e.serviceTypeList = []
                    }
                })
                this.getContractDate();
                this.getFiles();
                if (type !== 'create') {
                    this.getArea()
                }
                // 获取渠道经理
                if (this.contractForm.agentCompanyId) {
                    this.getChargeByName(this.contractForm.agentCompanyId)
                }
                // this.changeCheckbox();
                if (typeof callback === 'function') callback();
                // 合同期限时间处理
                this.contractForm.dataValue = [this.contractForm.contractStartDate, this.contractForm.contractEndDate]
                resolve()
            })
        })

    }
    // 获取详细信息之后转换checkbox
    changeCheckbox() {
        this.contractForm.showSubjectInfo = this.contractForm.showSubjectInfo === '1' ? true : false;
        this.contractForm.contracts.forEach(item => {
            item.showServiceCompanyInfo = item.showServiceCompanyInfo === '1' ? true : false;
        })
    }
    // 上传之前处理服务商报价数据
    changeServiceFeeList() {
        let serviceFeeList = this.serviceFeeList;
        if (serviceFeeList) {
            _.forEach(serviceFeeList, (item, key) => {
                if (!item) return;
                let contracts = this.contractForm.contracts[key];
                contracts.serviceFeeContent = item.serviceFeeContent;
                contracts.serviceFeeContent2 = item.serviceFeeContent2;
            })
        }
    }
    // 判断是否有商业保险
    hasInsurance() {
        var isHas = false;
        this.serviceTypes.forEach(e => {
            this.serviceTypeList.forEach(ev => {
                if (e.serviceId == ev && e.vciStatus == 1) {
                    isHas = true
                }
            })
        });
        return isHas;
    }
    // 直塞用户数据
    setAuth(auth) {
        this.contractForm.contractPerson = auth.name;
        this.contractForm.contractTel = auth.mobilephone;
        this.contractForm.contractEmail = auth.email;
        this.contractForm.contractAddr = '广州市天河区建中路59号柏朗奴商务大厦9楼';
    }
    // 处理省市区
    getArea() {
        if (!this.contractForm.receiveAddrList || this.contractForm.receiveAddrList.length !== 3) {
            return
        }
        let areaArr = []
        this.contractForm.receiveAddrList.forEach(element => {
            let keyArr = Object.keys(element)
            let val = element[keyArr[0]]
            areaArr.push(val)
        });
        this.contractForm.receiveAddrList = areaArr
    }
}

export default ContractModel;
