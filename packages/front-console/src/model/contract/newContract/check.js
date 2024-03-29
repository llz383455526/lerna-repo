import BaseModel from '../../base/BaseModel';
import { get } from '../../../store/api'

// 是否为邮箱
var isEmail = (rule, value, callback) => {
    if (!/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value)) {
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

// var checkCustomerName = (rule, value, callback) => {
//     const url = '/api/opencrm/workflow/checkCustomerName';
//     const param = {
//         customerName: value
//     }
//     get(url, param).then((res) => {
//         if (res) {
//             callback()
//         } else {
//             callback(new Error(`该公司已被其他销售签署，不支持再次送审`))
//         }
//     }).catch((res) => {
//         callback(new Error(res.msg))
//     })
// } 

class Check extends BaseModel {
    constructor() {
        super();
        var validatePass = (rule, value, callback) => {
            if (!/^[0-9]+([.][0-9]+){0,1}$/.test(value)) {
                callback(new Error('请输入数字'));
            } else {
                callback();
            }
        };
        this.rules = {
            // 企业入驻申请变更
            customerId: [
                { required: true, message: '请选择已有客户信息', trigger: 'change' }
            ],
            flowMemo: [
                { required: true, message: '请输入变更版本说明', trigger: 'blur' }
            ],
            versionStartDate: [
                { required: true, message: '请选择版本生效时间', trigger: 'change' }
            ],
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
                { required: true, message: '请输入预计月流水', trigger: 'blur' },
                { validator: validatePass, trigger: 'blur' },
            ],
            expectedProportion: [
                { required: true, message: '请输入预计3万以上比例', trigger: 'blur' },
                { validator: validatePass, trigger: 'blur' },
            ],
            // 销售联系信息
            contractPerson: [
                { required: true, message: '请输入销售姓名', trigger: 'blur' }
            ],
            contractEmail: [
                { required: true, message: '请输入销售联系邮箱', trigger: 'blur' },
                { validator: isEmail, message: '邮箱格式不正确', trigger: 'blur' }
            ],
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
            // isFromOutApp: [
            //     { required: true, message: '请选择企业对接方式', trigger: 'change' }
            // ],
            // customerName: [
            //     { required: true, message: '请输入企业名称', trigger: 'blur' },
            //     { validator: checkCustomerName, trigger: 'blur' },
            // ],
            areaName: [
                { required: true, message: '请输入企业地址', trigger: 'blur' }
            ],
            customLegalPerson: [
                { required: true, message: '请输入法定代表人', trigger: 'blur' }
            ],
            customCollector: [
                { required: true, message: '请输入系统操作人', trigger: 'blur' }
            ],
            customCollectorPhone: [
                { required: true, message: '请输入操作人手机', trigger: 'blur' },
                { validator: isMobile, trigger: 'blur' }
            ],
            customMail1: [
                { required: true, message: '请输入操作人邮箱', trigger: 'blur' },
                { validator: isEmail, message: '邮箱格式不正确', trigger: 'blur' }
            ],
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
            ],
            // 电子签约
            signPayForm: [
                { required: true, message: "请选择是否先签后发", trigger: "change" }
            ],
						isFromOutApp: [
								{ required: true, message: "请选择签约介质", trigger: "change" }
						],
            signForm: [
                { required: true, message: "请选择签约介质", trigger: "change" }
            ],
            smsType: [
                { required: true, message: "请选择是否短信通知", trigger: "change" }
            ],
            passportType: [
                { required: true, message: "请选择是否上传身份证", trigger: "change" }
            ],
            signMode: [
                { required: true, message: "请选择签署方式", trigger: "change" }
            ]
        };
    }
}

export default Check;