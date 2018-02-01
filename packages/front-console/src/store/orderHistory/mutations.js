import * as types from "./types";
const mutations = {
    [types.SET_ORDER_LIST] (state, data) {
        state.orderList = data;
    },
    [types.SET_ORDER_MESSAGE] (state, data) {
        state.orderMessage = data;
    }
};
export default mutations;