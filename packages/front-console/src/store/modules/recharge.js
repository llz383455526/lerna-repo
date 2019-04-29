import {post, get} from '../api'

const store = {
    state: {
        rechargeApplyList: {},
        optionTypes: {},
        curServiceCompanies: [],
        rechargeConfirm: {},
        productName: [],
        serviceName: [],
        serviceInfo: {},
        customCompanies: [],
        channlName: [],
        channlList: []
    },
    getters: {
        rechargeApplyList: state => state.rechargeApplyList,
        optionTypes: state => state.optionTypes,
        curServiceCompanies: state => state.curServiceCompanies,
        rechargeConfirm: state => state.rechargeConfirm,
        productName: state => state.productName, // 商户名称
        serviceName: state => state.serviceName, // 获取服务公司
        serviceInfo: state => state.serviceInfo, // 服务商信息
        customCompanies: state => state.customCompanies, // 客户公司
        channlName: state => state.channlName, // 获取业务类型
        channlList: state => state.channlList // 获取业务渠道
        
    },
    mutations: {
        setRechargeApplyList (state, payload) {
            state.rechargeApplyList = payload
        },
        setOptionTypes (state, payload) {
            state.optionTypes = payload
        },
        setCurServiceCompanies (state, payload) {
            state.curServiceCompanies = payload
        },
        setRechargeConfirm (state, payload) {
            state.rechargeConfirm = payload
        },
        setProductName (state, payload) { // 商户名称
            state.productName = payload
        },
        setServiceName (state, payload) { // 获取服务公司
            state.serviceName = payload
        },
        setServiceInfo(state, payload) { // 获取服务商信息
            state.serviceInfo = payload
        },
        setCustomCompanies (state, payload) { // 客户公司
            state.customCompanies = payload
        },
        setChannlName (state, payload) { // 获取业务类型
            state.channlName = payload
        },
        setChannlList (state, payload) { // 获取业务渠道
            state.channlList = payload
        },
        initDifficultData(state) { // 重置相关联的数据，避免再次出现时已经有可选值
          state.productName = []
          state.serviceName = []
          state.channlName = []
          state.channlList = []
          state.serviceInfo = {}
        }
    },
    actions: {
        getRechargeApplyList({commit}, param) {
            post('/api/balance-web/recharge-order/query-list', param).then(data => {
                commit('setRechargeApplyList', data);
            })
        },
        getCurServiceCompanies({commit}) {
            get('/api/console-dlv/option/get-option-service-companies')
                .then(result => {
                    commit('setCurServiceCompanies', result);
                })
        },
        getByTypes({commit}, param) {
            let str = ''
            param.forEach((item, index)=>{
                str += '' + item + ','
            })
            if(str !=''){
            	str = 'enumTypes='+str.substring(0,str.length-1)
            }
            post('/api/sysmgr-web/commom/options?'+str)
                .then(result => {
                    commit('setOptionTypes', result);
                })
        },
        getRechargeConfirm({commit}, param ) {
            post('/api/console-dlv/recharge-order/comfirm',param)
                .then(result => {
                    commit('setRechargeConfirm', result);
                })
        },
        // 获取客户公司
        getCustomCompanies({commit}, param) {
            return new Promise((resolve, reject) => {
                get('/api/console-dlv/option/get-option-customer-companies', param).then(result => {
                    commit('setCustomCompanies', result)
                    resolve(result)
                })
            })
        },
        // 获取商户公司
        getAppList({commit}, param) {
            return new Promise((resolve, reject) => {
                get('/api/sysmgr-web/commom/app-list', param).then(result => {
                    commit('setProductName', result)
                    resolve(result)
                })
            })
        },
        // 获取服务公司
        getServiceList({commit}, param) {
            return new Promise((resolve, reject) => {
                get('/api/sysmgr-web/commom/app-service-company-list', param).then(result => {
                    result = result.filter(i => i!== null)
                    commit('setServiceName', result)
                    resolve(result)
                })
            })
        },
        /**
         * 获取服务商信息
         * @param {companyId, serviceCompanyId}
         */ 
        getServiceInfo({commit}, param) {
            return new Promise((resolve, reject) => {
                get('/api/balance-web/commom/serviceCompanyInfo', param).then(result => {
                    commit('setServiceInfo', result)
                    resolve(result)
                })
            })
        },
        // 获取业务类型
        getBusinessList({commit}, param) {
            // 这里在渠道业务上不能污染state，所有做一个hack
            const cb = param.cb
            delete param.cb
            return new Promise((resolve, reject) => {
                get('/api/balance-web/balance-account/query-bank-type', param).then(result => {
                    !cb && commit('setChannlName', result)
                    resolve(result)
                })
            })
        },
        // 获取渠道列表
        getChannlList({commit}, param) {
            const cb = param.cb
            delete param.cb
            return new Promise((resolve, reject) => {
                get('/api/balance-web/balance-account/query-balance-account-channel-list', param).then(result => {
                    console.log(cb)
                    !cb && commit('setChannlList', result)
                    resolve(result)
                })
            })
        },
    }
};

export default store