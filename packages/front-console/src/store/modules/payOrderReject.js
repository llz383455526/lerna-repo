import {post, get} from '../api'
import * as types from "../mutation-types";

const store = {
    state: {
        payOrderRejectList: [],
        payOrderRejectBody: ''
    },
    getters: {
        payOrderRejectList: state => state.payOrderRejectList,
        payOrderRejectBody: state => state.payOrderRejectBody
    },
    mutations: {
        setPayOrderRejectList (state, payload) {
            state.payOrderRejectList = payload;
        },
        setPayOrderRejectBody (state, payload) {
            state.payOrderRejectBody = payload;
        }
    },
    actions: {
        getPayOrderRejectList({commit}, param) {
            post('/pay-order-reject/query-list', param).then(data => {
                commit('setPayOrderRejectList', data);
            });
        },
        getPayOrderRejectBody({commit}, param) {
            get('/pay-order-reject/request-body', param).then(data => {
                commit('setPayOrderRejectBody', data);
            });
        }
    }
};

export default store

