import * as types from './mutation-types'
import { post, get, formPost } from './api'
import { showNotify } from '../plugin/utils-notify'
import { showLoading } from '../plugin/utils-loading'

export default {

    login({commit}, param) {
        post('/auth/login', param).then((data) => {
            // console.log(data);
            commit(types.LOGIN_ACTION, data);
        });
    },

    logout({commit}) {
        post('/auth/logout').then((data) => {
            //console.log(data);
	        commit(types.RESET_STATES)
	        commit(types.SET_USER_TASK_LIST, null)
            commit(types.LOGOUT_ACTION, false);
        });
    },

    principal({commit}) {
        get('/auth/principal').then((data) => {
            // console.log(data);
            commit(types.LOGOUT_PRINCIPAL, data);
        });
    },
	getUploadPolicy({commit}, param) {
		showLoading()
    	/*let type = param.targetType*/
		get('/file/policy', param)
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
    	get('/common/dict/all')
		    .then(result => {
		        commit(types.SET_DICT_DATA, result)
		    })
	},
	getUserTask({commit}, param) {
    	post('/common/current-user-tasks', param)
		    .then(result => {
		        commit(types.SET_USER_TASK_LIST, result)
		    })
	},
    getFundCompanyList({commit}, param) {
        post('/assets-allocate/funds-companies', param).then(data => {
            commit(types.SET_FUND_COMPANY_LIST, data);
        })
    },
	getUserTaskCount({commit}, param) {
        get('/common/current-user-task-count')
	        .then(result => {
	        	commit(types.SET_USER_TASK_COUNT, result)
	        })
	},
	resetStates({commit}) {
    	commit(types.RESET_STATES)
	}

}














