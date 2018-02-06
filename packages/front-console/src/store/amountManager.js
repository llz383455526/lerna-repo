import {post, get} from './api'

const store = {
    state: {
        amountTable: ''
    },
    getters: {
        amountTable: state => state.amountTable
    },
    mutations: {
        setAmountTable (state, payload) {
            state.amountTable = payload
        }
    },
    actions: {
        getAmountTable({commit}, param) {
            post('/pay-order/query-item', param).then(data => {
                commit('setAmountTable', data);
            })
        }
    }
};

export default store

