

import Vue from 'vue'
import _ from 'lodash'

function showConfirm(options) {
	let config = {
		title:'提示',
		msg:'',
		confirmButtonText:'确定',
		cancelButtonText:'取消',
		showCancelButton:true,
		confirmCallback:"",
		cancelCallback: ''
	};
	config = _.assign(config,options);
	Vue.prototype.$confirm(config.msg,config.title,{
      	showCancelButton: config.showCancelButton,
		confirmButtonText: config.confirmButtonText,
		cancelButtonText: config.cancelButtonText,
	}).then(() => {
		if(config.confirmCallback){
			config.confirmCallback()
		}
    }).catch(() => {
    	if(config.cancelCallback) {
    		config.cancelCallback()
	    }
    });
	
}

function showAlert(options) {
	let config = {
		title:'提示',
		msg:'',
		confirmButtonText:'确定',
		confirmCallback:"",
		param:''
	};
	config = _.assign(config,options);
    
    Vue.prototype.$alert(config.msg, config.title, {
          confirmButtonText: '确定',
          callback: action => {
            if(config.confirmCallback){
				config.confirmCallback(config.param)
			}
          }
        });
	
}

export {
	showConfirm,
	showAlert
}
















