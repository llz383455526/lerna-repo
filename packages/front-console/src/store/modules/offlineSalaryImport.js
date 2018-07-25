import {post, get} from '../api'

const store = {
    state: {
		offlineSalaryImportPage: {},
    },
    getters: {
		offlineSalaryImportPage: state => state.offlineSalaryImportPage,
    },
    mutations: {
        setOfflineSalaryImportPage (state, payload) {
            state.offlineSalaryImportPage = payload
        },
    },
    actions: {
        getOfflineSalaryImportPage({commit}, param) {
            post('/api/console-dlv/pay-order-offline/import/list', param).then(data => {
                commit('setOfflineSalaryImportPage', data);
            })
        },
    }
};

export default store

