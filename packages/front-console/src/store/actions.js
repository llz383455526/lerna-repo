import * as types from './mutation-types'
import { post, get, formPost } from './api'
import { showNotify } from '../plugin/utils-notify'
import { showLoading } from '../plugin/utils-loading'

export default {

    login({commit}, param) {
        post('/api/console-dlv/auth/login', param).then((data) => {
            commit(types.LOGIN_ACTION, data);
        });
    },

    logout({commit}) {
        post('/api/console-dlv/auth/logout').then((data) => {
            //console.log(data);
	        commit(types.RESET_STATES)
	        commit(types.SET_USER_TASK_LIST, null)
            commit(types.LOGOUT_ACTION, false);
        });
    },

    principal({commit}) {
        get('/api/console-dlv/auth/principal').then((data) => {
            // console.log(data);
            commit(types.LOGOUT_PRINCIPAL, data);
        });
    },
	getUploadPolicy({commit}, param) {
		showLoading()
    	/*let type = param.targetType*/
		get('/api/console-dlv/file/policy', param)
			.then(result => {
				commit(types.SET_UPLOAD_POLICY, {
					type: result.dir,
					data: result
				})
			})
	},
	uploadFile({commit}, param) {
		formPost('', param.formData)
			.then(result => {
				commit(types.SET_UPLOAD_FILE, result)
				showNotify('success', '上传成功')
			})
	},
	setUploadFile({commit}, param) {
		commit(types.SET_UPLOAD_FILE, param)
	},
	clearUploadFile({commit}) {
		commit(types.SET_UPLOAD_FILE, false)
	},
	getDictData({commit}) {
    	get('/api/console-dlv/common/dict/all')
		    .then(result => {
		        commit(types.SET_DICT_DATA, result)
		    })
	},
	getUserTask({commit}, param) {
    	post('/api/console-dlv/common/current-user-tasks', param)
		    .then(result => {
		        commit(types.SET_USER_TASK_LIST, result)
		    })
	},
    getFundCompanyList({commit}, param) {
        post('/api/console-dlv/assets-allocate/funds-companies', param).then(data => {
            commit(types.SET_FUND_COMPANY_LIST, data);
        })
    },
	getUserTaskCount({commit}, param) {
        get('/api/console-dlv/common/current-user-task-count')
	        .then(result => {
	        	commit(types.SET_USER_TASK_COUNT, result)
	        })
	},
	resetStates({commit}) {
    	commit(types.RESET_STATES)
	}

}














