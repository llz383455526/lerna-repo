import {post, get} from '../api'

const store = {
    state: {
        rechargeApplyList: {},
        optionTypes: {},
        curServiceCompanies: [],
        rechargeConfirm: {},
        productName: [],
        customCompanies: []
    },
    getters: {
        rechargeApplyList: state => state.rechargeApplyList,
        optionTypes: state => state.optionTypes,
        curServiceCompanies: state => state.curServiceCompanies,
        rechargeConfirm: state => state.rechargeConfirm,
        productName: state => state.productName,
        serviceName: state => state.serviceName,
        customCompanies: state => state.customCompanies
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
        setProductName (state, payload) {
            state.productName = payload
        },
        setServiceName (state, payload) {
            state.serviceName = payload
        },
        setCustomCompanies (state, payload) {
            state.customCompanies = payload
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
        getProductName({commit}, param) {
            get('/api/sysmgr-web/commom/app-list', param)
                .then(result => {
                    commit('setProductName', result)
                })
        },
        getServiceName({commit}, param) {
            get('/api/sysmgr-web/commom/app-service-company-list', param)
                .then(result => {
                    commit('setServiceName', result)
                })
        },
        getCustomCompanies({commit}, param) {
            get('/api/console-dlv/option/get-option-customer-companies', param)
                .then(result => {
                    commit('setCustomCompanies', result)
                })
        }
    }
};

export default store

