import {post, get} from '../api'

const store = {
    state: {
        companyCreditList: [],
        moneyCompanyCredit: {
            amount: 0,
            availAmount: 0,
            sumCZAmount: 0,
            sumDFAmount: 0,
            sumHKAmount: 0,
            usedAmount: 0
        },
        companyCreditStates: [],
        companyCreditRemarks: []
    },
    getters: {
        companyCreditList: state => state.companyCreditList,
        moneyCompanyCredit: state => state.moneyCompanyCredit,
        companyCreditStates: state => state.companyCreditStates,
        companyCreditRemarks: state => state.companyCreditRemarks
    },
    mutations: {
        setCompanyCreditList (state, payload) {
            state.companyCreditList = payload
        },
        setMoneyCompanyCredit (state, payload) {
            state.moneyCompanyCredit = payload
        },
        setCompanyCreditStates (state, payload) {
            state.companyCreditStates = payload
        },
        setCompanyCreditRemarks (state, payload) {
            state.companyCreditRemarks = payload
        }
    },
    actions: {
        getCompanyCreditList({commit}, param) {
            post('/api/console-dlv/company-credit-record/query-list', param).then(data => {
                commit('setMoneyCompanyCredit', {
                    amount: data.amount,
                    availAmount: data.availAmount,
                    sumCZAmount: data.sumCZAmount,
                    sumDFAmount: data.sumDFAmount,
                    sumHKAmount: data.sumHKAmount ? data.sumHKAmount : 0,
                    usedAmount: data.usedAmount
                });
                commit('setCompanyCreditList', data.pageInfo);
            })
        },
        getCompanyCreditStates({commit}) {
            get('/api/console-dlv/company-credit-record/all-states').then(data => {
                commit('setCompanyCreditStates', data);
            })
        },
        getCompanyCreditRemarks({commit}) {
            get('/api/console-dlv/company-credit-record/all-pay-remarks').then(data => {
                commit('setCompanyCreditRemarks', data);
            })
        }
    }
};

export default store

