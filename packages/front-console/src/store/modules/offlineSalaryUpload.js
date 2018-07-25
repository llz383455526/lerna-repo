import {post, get} from '../api'

const store = {
    state: {
        typeList: {},
    },
    getters: {
        typeList: state => state.typeList,
    },
    mutations: {
        setTypeList (state, payload) {
            state.typeList = payload
        },
    },
    actions: {
        getTypeList({commit}, param) {
			get('/api/console-dlv/option/get-by-type', {
				type: 'OfflineImportTemplate'
			}).then(data => {
                commit('setTypeList', data);
            })
        },
    }
};

export default store

