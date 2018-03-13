import {post, get} from '../api'

const store = {
    state: {
        rechargeApplyList: {},
        optionTypes: {},
        curServiceCompanies: [],
        rechargeConfirm: {},
    },
    getters: {
        rechargeApplyList: state => state.rechargeApplyList,
        optionTypes: state => state.optionTypes,
        curServiceCompanies: state => state.curServiceCompanies,
        rechargeConfirm: state => state.rechargeConfirm,
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
        
    },
    actions: {
        getRechargeApplyList({commit}, param) {
            post('/api/console-dlv/recharge-order/query-list', param).then(data => {
                commit('setRechargeApplyList', data);
            })
        },
        getCurServiceCompanies({commit}) {
            get('/api/console-dlv/option/get-option-cur-service-companies')
                .then(result => {
                    commit('setCurServiceCompanies', result);
                })
        },
        getByTypes({commit}, param) {
            let str = ''
            param.forEach((item, index)=>{
                str += 'type=' + item + '&'
            })
            get('/api/console-dlv/option/get-by-types?'+str)
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
    }
};

export default store

