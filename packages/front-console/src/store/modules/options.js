import {post, get} from '../api'

const url = {
    customerCompaniesList: '/api/console-dlv/option/get-option-customer-companies',
    companyIdentityListForAdd: '/api/sysmgr-web/commom/company?companyIdentity=custom',
    companyIdentityListForUpdate: '/api/contract-web/contract/custom-company-options',
    customerServiceCompanyList: '/api/contract-web/contract/custom-service-company-options?customCompanyId=',
    contractTplList: '/api/contract-web/contract-tpl/tpl-options',
    industryTypeList: '/api/sysmgr-web/commom/option?enumType=IndustryType',
    serviceTypeList: '/api/contract-web/service-mgr/get-service-type-options',
    originalTypeList: '/api/sysmgr-web/commom/option?enumType=OriginalType',
    originalsList: '/api/sysmgr-web/commom/option?enumType=CustomOriginal',
    invoiceTypeList: '/api/contract-web/commom/option?enumType=InvoiceType',
    vciPayTypeList: '/api/sysmgr-web/commom/option?enumType=VciPayType',
    serviceCompaniesList: '/api/salemgt/common/service-company/list?businessed=true',
    settleTypeList: '/api/contract-web/commom/option?enumType=SettleType',
    agentList: '/api/contract-web/agent-contract/agent-company-option?sign=true',
    serverConfigList: '/api/sysmgr-web/commom/service-config',
    invitationStateList: '/api/contract-web/commom/option?enumType=InvitationState',
    serviceTypeOptions: '/api/contract-web/commom/service-type-options',
    contractGenInvoiceType: '/api/contract-web/commom/option?enumType=ContractGenInvoiceType',
}

const store = {
    state: {
        customerCompaniesList: [], // 客户
        companyIdentityList: [], // 已有客户
        customerServiceCompanyList: [], // 客户公司对应的服务商列表
        contractTplList: [], // 合同模板
        industryTypeList: [], // 客户行业类型
        serviceTypeList: [], // 服务类型
        originalTypeList: [], // 客户类型
        originalsList: [], // 客户归属
        invoiceTypeList: [], // 发票类型
        vciPayTypeList: [], //  付款方式
        serviceCompaniesList: [], // 服务商名称
        payModeList: {
            'A': { label: '银行', value: 'A' },
            'B': { label: '支付宝', value: 'B' },
            'C': { label: '微信', value: 'C' }
        }, // 发放方式
        settleTypeList: [], // 结算方式
        agentList: [], // 代理商列表
        serverConfigList: [], // 服务类型
        invitationStateList: [], // 邀请状态
        serviceTypeOptions: [], // 服务类型
        contractGenInvoiceType: [], // 发票类型
    },
    getters: {
        customerCompaniesList: state => state.customerCompaniesList,
        companyIdentityList: state => state.companyIdentityList,
        customerServiceCompanyList: state => state.customerServiceCompanyList,
        contractTplList: state => state.contractTplList,
        industryTypeList: state => state.industryTypeList,
        serviceTypeList: state => state.serviceTypeList,
        originalTypeList: state => state.originalTypeList,
        originalsList: state => state.originalsList,
        invoiceTypeList: state => state.invoiceTypeList,
        vciPayTypeList: state => state.vciPayTypeList,
        serviceCompaniesList: state => state.serviceCompaniesList,
        payModeList: state => state.payModeList,
        settleTypeList: state => state.settleTypeList,
        agentList: state => state.agentList,
        serverConfigList: state => state.serverConfigList,
        invitationStateList: state => state.invitationStateList,
        serviceTypeOptions: state => state.serviceTypeOptions,
        contractGenInvoiceType: state => state.contractGenInvoiceType,
    },
    mutations: {
        setCustomerCompaniesList(state, payload) {
            state.customerCompaniesList = payload
        },
        setCompanyIndentityList(state, payload) {
            state.companyIdentityList = payload
        },
        setCustomerServiceCompanyList(state, payload) {
            state.customerServiceCompanyList = payload
        },
        setContractTplList(state, payload) {
            state.contractTplList = payload
        },
        setIndustryTypeList(state, payload) {
            state.industryTypeList = payload
        },
        setServiceTypeList(state, payload) {
            state.serviceTypeList = payload
        },
        setOriginalTypeList(state, payload) {
            state.originalTypeList = payload
        },
        setOriginalsList(state, payload) {
            state.originalsList = payload
        },
        setInvoiceTypeList(state, payload) {
            state.invoiceTypeList = payload
        },
        setVciPayTypeList(state, payload) {
            state.vciPayTypeList = payload
        },
        setServiceCompaniesList(state, payload) {
            state.serviceCompaniesList = payload
        },
        setSettleTypeList(state, payload) {
            state.settleTypeList = payload
        },
        setAgentList(state, payload) {
            state.agentList = payload
        },
        setServerConfigList(state, payload) {
            state.serverConfigList = payload
        },
        setInvitationStateList(state, payload) {
            state.invitationStateList = payload
        },
        setServiceTypeOptions(state, payload) {
            state.serviceTypeOptions = payload
        },
        setContractGenInvoiceType(state, payload) {
            state.contractGenInvoiceType = payload
        },
    },
    actions: {
        getCustomerCompaniesList({commit} ) {
            get(url.customerCompaniesList).then(res => {
                commit('setCustomerCompaniesList',res)
            })
        },
        getCompanyIdentityListForAdd({commit}) {
            get(url.companyIdentityListForAdd).then(res => {
                commit('setCompanyIndentityList', res)
            })
        },
        getCompanyIdentityListForUpdate({commit}) {
            get(url.companyIdentityListForUpdate).then(res => {
                commit('setCompanyIndentityList', res)
            })
        },
        getCustomerServiceCompanyList({commit}, param) {
            get(url.customerServiceCompanyList+param).then(res => {
                commit('setCustomerServiceCompanyList', res)
            })
        },
        getContractTplList({commit}) {
            get(url.contractTplList).then(res => {
                commit('setContractTplList', res)
            })
        },
        getIndustryTypeList({commit}) {
            get(url.industryTypeList).then(res => {
                commit('setIndustryTypeList', res)
            })
        },
        async getServiceTypeList({commit}) {
            const data = await get(url.serviceTypeList)
            commit('setServiceTypeList', data)
        },
        getOriginalTypeList({commit}) {
            get(url.originalTypeList).then(res => {
                commit('setOriginalTypeList', res)
            })
        },
        getOriginalsList({commit}) {
            get(url.originalsList).then(res => {
                commit('setOriginalsList', res)
            })
        },
        getInvoiceTypeList({commit}) {
            get(url.invoiceTypeList).then(res => {
                commit('setInvoiceTypeList', res)
            })
        },
        getVciPayTypeList({commit}) {
            get(url.vciPayTypeList).then(res => {
                commit('setVciPayTypeList', res)
            })
        },
        getServiceCompaniesList({commit}, agentCompanyId) {
            const param = agentCompanyId == null ? {} : {
                agentCompanyId
            };
            get(url.serviceCompaniesList, param).then(res => {
                commit('setServiceCompaniesList', res)
            })
        },
        getSettleTypeList({commit}) {
            get(url.settleTypeList).then(res => {
                commit('setSettleTypeList', res)
            })
        },
        getAgentList({commit}) {
            get(url.agentList).then(res => {
                commit('setAgentList', res)
            })
        },
        getServerConfigList({commit}) {
            get(url.serverConfigList).then(res => {
                commit('setServerConfigList', res)
            })
        },
        getInvitationStateList({commit}) {
            get(url.invitationStateList).then(res => {
                commit('setInvitationStateList', res)
            })
        },
        getServiceTypeOptions({commit}) {
            get(url.serviceTypeOptions).then(res => {
                commit('setServiceTypeOptions', res)
            })
        },
        getContractGenInvoiceType({commit}) {
            get(url.contractGenInvoiceType).then(res => {
                commit('setContractGenInvoiceType', res)
            })
        },
    },
}

export default store
