import {post, get} from '../api'
import * as types from "../mutation-types";

const store = {
    state: {
        flowTableList: [],
        customNameList: [],
        moneyFlow: {
            amount: 0,
            doingAmount: 0,
            doneAmount: 0
        }
    },
    getters: {
        flowTableList: state => state.flowTableList,
        customNameList: state => state.customNameList,
        moneyFlow: state => state.moneyFlow
    },
    mutations: {
        setFlowTableList(state, payload) {
            state.flowTableList = payload
        },
        setCustomNameList(state, payload) {
            state.customNameList = payload
        },
        setMoneyFlow(state, payload) {
            state.moneyFlow = payload
        }
    },
    actions: {
        getFlowTableList({commit}, param) {
            post('/api/console-dlv/pay-order/query-item', param).then(data => {
                commit('setMoneyFlow', {
                    amount: data.amount,
                    doingAmount: data.doingAmount,
                    doneAmount: data.doneAmount
                });
                commit('setFlowTableList', data.pageInfo);
            });
        },
        getCustomNameList({commit}) {
            get('/api/console-dlv/option/get-all-app').then(data => {
                commit('setCustomNameList', data);
            });
        }
    }
};

export default store

