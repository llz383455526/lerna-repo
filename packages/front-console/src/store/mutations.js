import * as types from './mutation-types'

function resetState(state, moduleState) {
	
	const mState = state[moduleState]
	
	if (mState && mState.initState && typeof mState.initState === 'function') {
		
		const initState = mState.initState()
		
		for (const key in initState) {
			
			mState[key] = initState[key]
		}
	}
	
}

const mutations = {
	
	[types.RESET_STATES](state, payload) {
		for (const moduleState in state) {
			resetState(state, moduleState)
		}
	}
	
}

export default mutations
