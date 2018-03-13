import {post, get} from '../api'

const store = {
    state: {
        companyCreditRecordList: []
    },
    getters: {
        companyCreditRecordList: state => state.companyCreditRecordList
    },
    mutations: {
        setCompanyCreditRecordList (state, payload) {
            state.companyCreditRecordList = payload
        }
    },
    actions: {
        getCompanyCreditRecord({commit}, param) {
            post('/api/console-dlv/company-credit-record/query-all-list', param).then(data => {
                commit('setCompanyCreditRecordList', data);
            })
        }
    }
};

export default store

