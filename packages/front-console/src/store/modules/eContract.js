import {post, get} from '../api'

const store = {
    state: {
        eContractList: {},
        extrSystemOptions: [],
        signStateOptions: [],
        orderStateOptions: [],
    },
    getters: {
        eContractList: state => state.eContractList,
        extrSystemOptions: state => state.extrSystemOptions,
        signStateOptions: state => state.signStateOptions,
        orderStateOptions: state => state.orderStateOptions,
    },
    mutations: {
        setEContractList (state, payload) {
            state.eContractList = payload
        },
        setExtrSystemOptions (state, payload) {
            state.extrSystemOptions = payload
        },
        setSignStateOptions (state, payload) {
            state.signStateOptions = payload
        },
        setOrderStateOptions (state, payload) {
            state.orderStateOptions = payload
        },
    },
    actions: {
        getEContractList({commit}, param) {
            post('/api/econtract/inner/qry', param).then(data => {
                commit('setEContractList', data);
            })
        },
        getExtrSystemOptions({commit}, param) {
            get('/api/econtract/inner/clientqry', param).then(data => {
                commit('setExtrSystemOptions', data);
            })
        },
        getSignStateOptions({commit}, param) {
            get('/api/econtract/inner/nonsafety/signstatelist', param).then(data => {
                commit('setSignStateOptions', data);
            })
        },
        getOrderStateOptions({commit}, param) {
            get('/api/econtract/inner/nonsafety/orderstatelist', param).then(data => {
                commit('setOrderStateOptions', data);
            })
        },
    }
};

export default store

