/**
 * Created by bigben on 2017/12/12.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import account from './modules/account'

import amountManager from './modules/amountManager'
import creditBill from './modules/companyCredit'
import topUpRecord from './modules/companyCreditRecord'
import payOrder from './modules/payOrder'
import payOrderReject from './modules/payOrderReject'

Vue.use(Vuex);

let state = {
	userInformation: false,
    logoutRandomTime: 0,
    principalMenu: false,
	userTaskCount: 0,
};

export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    modules: {
        account,
        amountManager,
        creditBill,
        topUpRecord,
        payOrder,
        payOrderReject
    }
})








