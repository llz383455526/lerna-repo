import BaseModel from '../../base/BaseModel';

// 是否为邮箱
var isEmail = (rule, value, callback) => {
    if (!/(^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$)/.test(value)) {
        callback(new Error('请输入正确的邮箱地址'));
    } else {
        callback()
    }
}

// 是否为手机号码
var isMobile = (rule, value, callback) => {
    if (!/^1\d{10}$/.test(value)) {
        callback(new Error('请输入正确的手机号码'));
    } else {
        callback()
    }
}

class Check extends BaseModel {
    constructor() {
        super();
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
            // contractEmail: [
            //     { required: true, message: '请输入销售联系邮箱', trigger: 'blur' }
            // ],
            contractTel: [
                { required: true, message: '请输入销售联系电话', trigger: 'blur' }
            ],
            contractAddr: [
                { required: true, message: '请输入合同联系人地址', trigger: 'blur' }
            ],
            agentClient: [
                { required: true, message: '请选择', trigger: 'blur' }
            ],
            agentCompanyId: [
                { required: true, message: '请选择代理商', trigger: 'blur' }
            ],
            // 企业基本信息
            customNature: [
                { required: true, message: '请选择客户性质', trigger: 'change' }
            ],
            customerName: [
                { required: true, message: '请输入企业名称', trigger: 'blur' }
            ],
            areaName: [
                { required: true, message: '请输入企业地址', trigger: 'blur' }
            ],
            customLegalPerson: [
                { required: true, message: '请输入法定代表人', trigger: 'blur' }
            ],
            customCollector: [
                { required: true, message: '请输入企业负责人', trigger: 'blur' }
            ],
            customCollectorPhone: [
                { required: true, message: '请输入负责人手机', trigger: 'blur' },
                { validator: isMobile, trigger: 'blur' }
            ],
            // customMail1: [
            //     { required: true, message: '请输入负责人邮箱', trigger: 'blur' },
            //     { validator: isEmail, trigger: 'blur' }
            // ],
            customCollectorAddr: [
                { required: true, message: '请输入负责人地址', trigger: 'blur' }
            ],
            // 企业开票信息
            invoiceCompanyName: [
                { required: true, message: '请输入开票企业名称', trigger: 'blur' }
            ],
            customTaxIdcd: [
                { required: true, message: '请输入纳税人识别号', trigger: 'blur' }
            ],
            invoiceAddress: [
                { required: true, message: '请输入开票企业地址', trigger: 'blur' }
            ],
            customPhone: [
                { required: true, message: '请输入企业电话', trigger: 'blur' }
            ],
            customBankName: [
                { required: true, message: '请输入开户银行', trigger: 'blur' }
            ],
            customBankAccount: [
                { required: true, message: '请输入银行账号', trigger: 'blur' }
            ],
            invoiceType: [
                { required: true, message: '请选择发票类型', trigger: 'change' }
            ],
            // --------------------------------------------------------------- 2.5.3
            original: [
              { required: true, message: "请选择客户归属", trigger: "change" }
            ],
            originalType: [
              { required: true, message: "请选择客户类型", trigger: "change" }
            ]
        };
    }
}

export default Check;