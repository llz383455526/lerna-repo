import {post, get} from '../api'

const store = {
    state: {
        customCompanyList: {},
		serviceCompanyList: {},
		paymentThirdTypeList: {},
		stateList: {},
		offlineSalaryPage: {},
    },
    getters: {
        customCompanyList: state => state.customCompanyList,
		serviceCompanyList: state => state.serviceCompanyList,
		paymentThirdTypeList: state => state.paymentThirdTypeList,
		stateList: state => state.stateList,
		offlineSalaryPage: state => state.offlineSalaryPage,
    },
    mutations: {
        setCustomCompanyList (state, payload) {
            state.customCompanyList = payload
        },
		setServiceCompanyList (state, payload) {
			state.serviceCompanyList = payload
		},
		setPaymentThirdTypeList (state, payload) {
			state.paymentThirdTypeList = payload
		},
		setStateList (state, payload) {
			state.stateList = payload
		},
		setOfflineSalaryPage (state, payload) {
			state.offlineSalaryPage = payload
		},
    },
    actions: {
        getCustomCompanyList({commit}, param) {
			get('/api/sysmgr-web/commom/company', {
			        companyIdentity: 'custom'
		        }).then(data => {
                commit('setCustomCompanyList', data);
            })
        },
		getServiceCompanyList({commit}, param) {
			get('/api/sysmgr-web/commom/company', {
					companyIdentity: 'service'
				}).then(data => {
				commit('setServiceCompanyList', data);
			})
		},
		getPaymentThirdTypeList({commit}, param) {
			get('/api/console-dlv/option/get-by-type', {
				type: 'OfflineImportTemplate'
			}).then(data => {
				commit('setPaymentThirdTypeList', data);
			})
		},
		getStateList({commit}, param) {
			get('/api/console-dlv/option/get-by-type', {
				type: 'PayOrderOfflineState'
			}).then(data => {
				commit('setStateList', data);
			})
		},
		getOfflineSalaryPage({commit}, param) {
			post('/api/console-dlv/pay-order-offline/query-orders', param).then(data => {
				commit('setOfflineSalaryPage', data);
			})
		},
    }
};

export default store

