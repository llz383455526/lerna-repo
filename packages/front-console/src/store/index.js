/**
 * Created by bigben on 2017/12/12.
 */

import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations'
import actions from './actions'
import getters from './getters'


Vue.use(Vuex)

let state = {
	userInformation: null
}

export default new Vuex.Store({
    state,
    actions,
    mutations,
    getters,
    modules: {
	   
    }
})








