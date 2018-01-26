import * as types from './mutation-types'
import { post, get, formPost } from './api'
import { showNotify } from '../plugin/utils-notify'
import { showLoading } from '../plugin/utils-loading'

export default {
	
	resetStates({commit}) {
    	commit(types.RESET_STATES)
	}

}














