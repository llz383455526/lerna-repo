class Check {
    constructor() {
        this.rules = {
            'datas.agentCompanyBaseInfo.agentType': [
                { required: true, message: '请选择申请主体', trigger: 'change' }
            ],
            'datas.tplId': [
                { required: true, message: '请选择合同模板', trigger: 'change' }
            ],
            'datas.agentContract.probation': [
                { required: true, message: '请输入试合作期', trigger: 'blur' }
            ],
            'datas.agentContract.agentStart': [
                { required: true, message: '请选择代理期限', trigger: 'change' }
            ]
        }
    }
}

export default Check