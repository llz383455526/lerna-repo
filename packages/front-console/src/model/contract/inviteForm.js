import BaseModel from '../base/BaseModel'

class inviteModel extends BaseModel {
    constructor() {
        super();
        this.data = {
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
            companyApps: [{
                // companyId: '{{companyId}}',
                // appId: 'app{{companyId}}',
                appName: '',
                chargeByName: '',
                chargeByPhone: '',
                chargeByMail: '',
                // isFromOutApp: '{{isFromOutApp}}'
            }],
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
        }
    }

}

export default inviteModel