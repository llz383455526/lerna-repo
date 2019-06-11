class Check {
    constructor() {
        this.rules = {
            datas: {
                agentCompanyBaseInfo: {
                    agentType: [this.ruleObj('请选择申请主体', 'change')],
                    probation: [this.ruleObj('请输入试合作期')],
                    name: [this.ruleObj('请填写渠道名称')],
                    taxIdcd: [this.ruleObj('请填写税号')],
                    registerAddr: [this.ruleObj('请填写渠道单位地址')],
                    telephone: [this.ruleObj('请填写渠道电话'), { pattern: /^1\d{10}$/, message: '请正确填写渠道电话', trigger: 'blur' }],
                    registerAddr: [this.ruleObj('请填写渠道单位地址')],
                    accountName: [this.ruleObj('请填写开户名称')],
                    depositBank: [this.ruleObj('请填写开户银行')],
                    accountNo: [this.ruleObj('请填写银行账号')],
                    contactName: [this.ruleObj('请填写渠道联系人')],
                    contactPhone: [this.ruleObj('请填写渠道联系人电话'), { pattern: /^1\d{10}$/, message: '请正确填写渠道联系人电话', trigger: 'blur' }],
                    contactAddr: [this.ruleObj('请填写渠道联系人地址')],
                    id: [this.ruleObj('请选择已有渠道', 'change')],
                },
                agentContract: {
                    agentStart: [this.ruleObj('请选择代理期限', 'change')],
                    versionStartDate: [this.ruleObj('请选择申请生效时间', 'change')],
                },
                salesInfo: {
                    salesName: [this.ruleObj('请填写销售名称')],
                    mobilePhone: [this.ruleObj('请填写销售联系电话')],
                    salesAddress: [this.ruleObj('请填写销售地址')]
                },
                flowMemo: [this.ruleObj('请输入变更版本说明'), 'blur'],
                tplId: [this.ruleObj('请选择合同模板', 'change')],
            }
        }
    }
    ruleObj(msg, method = 'blur') {
        return { required: true, message: msg, trigger: method }
    }
}

export default Check