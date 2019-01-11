/**
 * Created by bigben on 2017/12/12.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'

import account from './modules/account'
import contract from './modules/contract'

import amountManager from './modules/amountManager'
import creditBill from './modules/companyCredit'
import topUpRecord from './modules/companyCreditRecord'
import payOrder from './modules/payOrder'
import payOrderReject from './modules/payOrderReject'
import recharge from './modules/recharge'
import order from './modules/order'
import eContract from './modules/eContract'

import offlineSalaryUpload from './modules/offlineSalaryUpload'
import offlineSalaryImport from './modules/offlineSalaryImport'
import offlineSalaryManager from './modules/offlineSalaryManager'

import taxDiscount from './modules/taxDiscount'

import status from './modules/status/index'

Vue.use(Vuex);

let state = {
	userInformation: false,
    logoutRandomTime: 0,
    principalMenu: false,
	permissions: false,
    userTaskCount: 0,
    uploadFile:null,
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
        payOrderReject,
        contract,
        eContract,
        order,
        recharge,
		offlineSalaryUpload,
		offlineSalaryImport,
		offlineSalaryManager,
        taxDiscount,
        status
    }
})








