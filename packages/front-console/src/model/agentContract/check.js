class Check {
    constructor() {
        this.rules = {
            datas: {
                agentCompanyBaseInfo: {
                    agentType: [this.ruleObj('请选择申请主体', 'change')],
                    probation: [this.ruleObj('请输入试合作期')],
                    name: [this.ruleObj('请填写代理商名称')],
                    taxIdcd: [this.ruleObj('请填写税号')],
                    registerAddr: [this.ruleObj('请填写代理商单位地址')],
                    telephone: [this.ruleObj('请填写代理商电话')],
                    registerAddr: [this.ruleObj('请填写代理商单位地址')],
                    accountName: [this.ruleObj('请填写开户名称')],
                    depositBank: [this.ruleObj('请填写开户银行')],
                    accountNo: [this.ruleObj('请填写银行账号')],
                    contactName: [this.ruleObj('请填写代理商联系人')],
                    contactPhone: [this.ruleObj('请填写代理商联系人电话')],
                    contactAddr: [this.ruleObj('请填写代理商联系人地址')],
                    id: [this.ruleObj('请选择已有代理商', 'change')],
                },
                agentContract: {
                    agentStart: [this.ruleObj('请选择代理期限', 'change')]
                },
                salesInfo: {
                    salesName: [this.ruleObj('请填写销售名称')],
                    mobilePhone: [this.ruleObj('请填写销售联系电话')],
                    salesAddress: [this.ruleObj('请填写销售地址')]
                },
                // tplId: [this.ruleObj('请选择合同模板', 'change')],
            }
        }
    }
    ruleObj(msg, method = 'blur') {
        return { required: true, message: msg, trigger: method }
    }
}

export default Check