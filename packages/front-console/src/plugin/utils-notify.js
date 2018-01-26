

import Vue from 'vue'

function showNotify(type, msg, autoClose) {
	let title
	switch (type) {
		case 'success':
			title = '成功'
			break
		case 'warning':
			title = '警告'
			break
		case 'info':
			title = '消息'
			break
		case 'error':
			title = '错误'
			break
	}
	
	let options = {
		title: title,
		message: msg,
		type: type
	}
	if(!autoClose) options.duration = 3000
	
	Vue.prototype.$notify(options)
	
}

export {
	showNotify
}
















