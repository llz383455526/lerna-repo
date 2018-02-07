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

		// 菜单：1、账户管理：account manager 2、流水记录：flow record 3、下单记录：order history
		// 新增：4、额度管理：amount manager 5、充值记录：recharge record 5、信用账单：credit bill
        // const menus = [
		// 	{
		// 		action: null,
		// 		title: "账户管理",
         //        menuId: 1,
         //        orderSeq: 1,
         //        children: [
		// 			{
		// 				action: "/main/accountManager/index",
         //                title: "账户信息",
         //                menuId: 102,
         //                orderSeq: 1
		// 			},{
         //                action: "/main/accountManager/payOrder",
         //                title: "发放流水",
         //                menuId: 103,
         //                orderSeq: 2
         //            },{
         //                action: "/main/accountManager/payOrderReject",
         //                title: "拒绝下单流水",
         //                menuId: 104,
         //                orderSeq: 3
         //            },{
         //                action: "/main/accountManager/amountManager",
         //                title: "额度管理",
         //                menuId: 105,
         //                orderSeq: 4
         //            },
         //            {
         //                action: "/main/accountManager/companyCreditRecord",
         //                title: "充值记录",
         //                menuId: 106,
         //                orderSeq: 5
         //            },
         //            {
         //                action: "/main/accountManager/creditBill",
         //                title: "信用账单",
         //                menuId: 108,
         //                orderSeq: 6
         //            }
		// 		]
		// 	}
        // ];
        // state.principalMenu = menus;
        state.principalMenu = payload.menus;
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
