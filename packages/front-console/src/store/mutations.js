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

    [types.LOGIN_ACTION](state, payload) {
        state.userInformation = payload;
    },
    [types.LOGOUT_ACTION](state, payload) {
        state.userInformation = payload;
        state.logoutRandomTime = new Date().valueOf();
    },
    [types.LOGOUT_PRINCIPAL](state, payload) {
        state.userInformation = payload.user;
        state.permissions = payload.permissions;
        // console.log(payload.menus);
        const menus = [
			{
				action: "/account/basic",
				title: "账户管理",
                menuId: 1,
                orderSeq: 1,
                children: [
					{
						action: "/main/account/index",
                        title: "账户管理",
                        menuId: 100,
                        orderSeq: 1
					},{
                        action: "/main/account/list",
                        title: "发放流水记录",
                        menuId: 102,
                        orderSeq: 2
                    }
				]
			}
		];
        // state.principalMenu = payload.menus;
        state.principalMenu = menus;
    },
	[types.SET_UPLOAD_POLICY](state, payload) {
		state.uploadPolicy = payload.data
    	//state.uploadPolicy[payload.type] = payload.data
		state.policyTypeRandom = parseInt(Math.random() * 10000)
	},
	[types.SET_UPLOAD_FILE](state, payload) {
    	state.uploadFile = payload
	},
	[types.SET_DICT_DATA](state, payload) {
    	state.dictData = payload
	},
	[types.SET_USER_TASK_LIST](state, payload) {
    	state.userTaskList = payload
	},
	[types.SET_FUND_COMPANY_LIST](state, payload) {
    	state.fundCompanyList = payload
   	},
	[types.SET_USER_TASK_COUNT](state, payload) {
    	state.userTaskCount = payload
	},
	[types.RESET_STATES](state, payload) {
		for (const moduleState in state) {
			resetState(state, moduleState)
		}
	}
	
}

export default mutations
