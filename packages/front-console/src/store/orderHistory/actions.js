import {post, get} from "../api";
import * as types from "./types";
const actions = {
    getOrderList({commit}, param) {
        post('/pay-order-reject/query-list', param).then(data => {
            commit(types.SET_ORDER_LIST, data)
        });
    },
    getOrderMessage({commit}, param) {
        get('/pay-order-reject/request-body', param).then(data => {
            commit(types.SET_ORDER_MESSAGE, data);
        });
    }
};
export default actions