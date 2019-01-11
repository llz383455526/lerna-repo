import actionApi from '../api/actionApi'
import apiconfig from '../status/apiconfig'

const state = {
    auth: ''
}

const getters = {
    auth: state => state.auth
}

/**
 * returnPromise 返回一个Promise 针对二次接口调用场景
 * cacheGetString 缓存vuex里的字符数据 cache为true的时候默认先拿原始数据
 */
const actions = {
    getAuth({ commit }, param) {
        return actionApi.returnPromise((resolve) => {
            let action = {
                url: apiconfig.auth.principal,
                param: param,
                resPath: 'user'
            };
            actionApi.cacheGetString(state.auth, action).then((data) => {
                commit('setAuth', data);
                resolve(data);
            });
        });
    }
}

const mutations = {
    setAuth(state, payload) {
        state.auth = payload;
    }
}


export default {
    state,
    getters,
    actions,
    mutations
}







































