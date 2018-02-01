import mutations from './mutations';
import actions from './actions';
import getters from "./getters";

let state = {
    orderList: '',
    orderMessage: ''
};

export default {
    state,
    mutations,
    actions,
    getters,
}