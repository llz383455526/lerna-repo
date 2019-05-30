class Check {
    constructor() {
        this.rules = {
            'agentCompanyBaseInfo.agentType': [
                { required: true, message: '请选择申请主体', trigger: 'change' }
            ],
            tplId: [
                { required: true, message: '请选择合同模板', trigger: 'change' }
            ],
            'agentContract.probation': [
                { required: true, message: '请输入试合作期', trigger: 'blur' }
            ],
            'agentContract.agentStart': [
                { required: true, message: '请选择代理期限', trigger: 'change' }
            ]
        }
    }
}

export default Check