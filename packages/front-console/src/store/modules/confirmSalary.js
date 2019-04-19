import {post, get} from '../api'

const store = {
    state: {
        passList: {},
        unPassList: {},
        importSalaryOrderFee:'',
    },
    getters: {
        passList: state => state.passList,
        unPassList: state => state.unPassList,
        importSalaryOrderFee: state => state.importSalaryOrderFee,
    },
    mutations: {
        setPassList (state, payload) {
            state.passList = payload
        },
        setUnPassList (state, payload) {
            state.unPassList = payload
        },
        setImportSalaryOrderFee (state, payload) {
            state.importSalaryOrderFee = payload
        },
    },
    actions: {
        getPassList({commit}, param) {
            post('/api/console-dlv/company/salary-online-order/query-import-order-item', param).then(data => {
                commit('setPassList', data);
            })
        },
        getUnPassList({commit}, param) {
            post('/api/console-dlv/company/salary-online-order/query-import-order-item', param).then(data => {
                commit('setUnPassList', data);
            })
        },
        getImportSalaryOrderFee({commit}, param) {
            get('/api/console-dlv/company/salary-online-order/import-salary-order-fee-info', param)
                .then(result => {
                    commit('setImportSalaryOrderFee', result)
                })
        },
    }
};

export default store

