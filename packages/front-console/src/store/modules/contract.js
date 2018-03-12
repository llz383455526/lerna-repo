let store = {
    state: {
        contractForm: {
            type: 'customer',
            serviceFeeType: 'ratio',
            serviceFee: '',
            settleExp: ''
        }
    },
    getters: {
        contractForm: state => state.contractForm
    },
    mutations: {
        settleExp(state, payload) {
            state.contractForm.settleExp = payload
        },
        setServiceFee(state, payload) {
            state.contractForm.serviceFee = payload
        }
    },
    actions: {
        setSettleExp({commit}, param) {
            commit('settleExp', param);
        },
        setServiceFee({commit}, param) {
            commit('setServiceFee', param);
        }
    }
};

export default store