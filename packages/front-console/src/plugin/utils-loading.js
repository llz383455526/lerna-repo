
import Vue from 'vue'

let loadingInstance

function showLoading(options) {
	loadingInstance = Vue.prototype.$loading(options)
}

function hideLoading() {
	if(loadingInstance) loadingInstance.close()
}

export {
	showLoading,
	hideLoading
}










