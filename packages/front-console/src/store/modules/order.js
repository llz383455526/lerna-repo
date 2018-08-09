import {post, get} from '../api'
import * as types from "../mutation-types";

const store = {
    state: {
        payOrderState: [],
        clientList: []
    },
    getters: {
        payOrderState: state => state.payOrderState,
        clientList: state => state.clientList
    },
    mutations: {
        setPayOrderState(state, payload) {
            state.payOrderState = payload
        },
        setClientList(state, payload) {
            state.clientList = payload
        }
    },
    actions: {
        getPayOrderState({commit}) {
            get('/api/console-dlv/option/get-by-type', {
                type: 'SalaryOrderItemState'
            }).then(data => {
                commit('setPayOrderState', data)
            })
        },
        getClientList({commit}, param) {
            get('/api/console-dlv/company/salary-online-order/query-app-info', param).then(data => {
                commit('setClientList', data)
            })
        }
    }
};

export default store