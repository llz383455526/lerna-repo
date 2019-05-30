class Check {
    constructor() {
        this.rules = {
            datas: {
                agentCompanyBaseInfo: {
                    agentType: [{ required: true, message: '请选择申请主体', trigger: 'change' }],
                    probation: [{ required: true, message: '请输入试合作期', trigger: 'blur' }],
                    name: [{ required: true, message: '请填写代理商名称', trigger: 'blur' }]
                },
                agentContract: {
                    agentStart: [{ required: true, message: '请选择代理期限', trigger: 'change' }]
                },
                tplId: [
                    { required: true, message: '请选择合同模板', trigger: 'change' }
                ],
            }
        }
    }
}

export default Check