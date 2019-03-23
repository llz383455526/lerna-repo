const store = {
    state: {
        saleContract: {
            agentList: [],
            serviceFeeList: [],
            contractForm: {
                id: '', // 客户信息id
                name: '', // 客户信息name
                contractTplId: '', // 合同模板
                contractType: '', // 客户类型
                contractStartDate: '', // 合同期限 开始日期
                contractEndDate: '', // 合同期限 结束日期
                serviceType: [], // 服务类型
                originalType: '', // 客户类型
                invoiceType: '', // 发票类型
                original: '', // 客户归属
                vciPayType: '', // 付款方式
                serviceCompanyList: [],
                contracts: [],
            },
            serviceTypeList: [], // 服务类型后端返回的数据
            contractDate: '', // 合同周期
        },
        saleContractRules: {
            id: [
                { required: true, message: '请选择客户企业信息', trigger: 'change' }
            ],
            contractTplId: [
                { required: true, message: '请选择合同模板', trigger: 'change' }
            ],
            contractType: [
                { required: true, message: '请选择客户行业类型', trigger: 'change' }
            ],
            contractStartDate: [
                { required: true, message: '请选择合同期限', trigger: 'blur' }
            ],
            customIndustry: [
                { required: true, message: '请输入客户从事行业', trigger: 'blur' }
            ],
            serviceType: [
                { type: 'array', required: true, message: '请选择服务类型', trigger: 'change' },
                { type: 'array', max: 5, message: '最多只能选5个', trigger: 'change' }
            ],
            originalType: [
                { required: true, message: "请选择客户类型", trigger: "change" }
            ],
            original: [
                { required: true, message: "请选择客户归属", trigger: "change" }
            ],
            invoiceType: [
                { required: true, message: '请选择发票类型', trigger: 'change' }
            ],
            vciPayType: [
                { required: true, message: '请选择付款方式', trigger: 'change' }
            ]
        },
    },
    getters: {
        saleContract: state => state.saleContract,
        saleContractRules: state => state.saleContractRules,
    },
    mutations: {},
    actions: {},
}

export default store