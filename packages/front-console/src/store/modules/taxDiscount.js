import * as types from '../mutation-types'
import {post, get} from '../api'

import _ from 'lodash'

let initState = {
	provinceList: {},
	taxStageList: [],
	taxStatusList: [],
	taxOptions: {}
}

let state = {
	...initState,
	initState() {
		return initState
	}
}

const getters = {
	provinceList: state => state.provinceList,
	taxStageList: state => {
		let taxStageList = {}
		
		_.forEach(state.taxStageList, item => {
			taxStageList[item.id] = item
		})
		
		return taxStageList
	},
	taxStatusList: state => {
		let taxStatusList = {}
		
		_.forEach(state.taxStatusList, item => {
			taxStatusList[item.id] = item
		})
		
		return taxStatusList
	},
	taxOptions: state => state.taxOptions
}

const actions = {
	getProvince({commit}, param = {}) {
		get('/api/common/region/provinces_with_city', param)
			.then(result => {
				let provinceList = {}
				_.forEach(result, item => {
					provinceList[item.id] = item
				})
				
				commit(types.SET_PROVINCE_LIST, provinceList)
			})
	},
	getTaxStageList({commit}, param = {}) {
		get('/api/salemgt/config/stages', param)
			.then(result => {
				commit(types.SET_TAX_STAGE_LIST, result)
			})
	},
	getTaxStatusList({commit}, param = {}) {
		get('/api/salemgt/config/status', param)
			.then(result => {
				commit(types.SET_TAX_STATUS_LIST, result)
			})
	},
	getTaxOptions({commit}, param = {}) {
		get('/api/salemgt/config/options', param)
			.then(result => {
				commit(types.SET_TAX_OPTIONS, result)
			})
	}
}

const mutations = {
	[types.SET_PROVINCE_LIST](state, payload) {
		state.provinceList = payload
	},
	[types.SET_TAX_STAGE_LIST](state, payload) {
		state.taxStageList = payload
	},
	[types.SET_TAX_STATUS_LIST](state, payload) {
		state.taxStatusList = payload
	},
	[types.SET_TAX_OPTIONS](state, payload) {
		state.taxOptions = payload
	},
}

export default {
	state,
	getters,
	actions,
	mutations
}












