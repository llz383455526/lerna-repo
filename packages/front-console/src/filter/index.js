
import Vue from 'vue'
import _ from 'lodash'


Vue.filter('formatMoney', input => {
	if (input || input == '0') return `￥${(parseFloat(input).toFixed(2) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}`
	return '0'
});

Vue.filter('formatTimes', input => {
    if (input || input == '0') return `${(parseFloat(input).toFixed(3) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')}`
    return '0.000'
});

Vue.filter('formatTime', (time, format = 'yyyy-MM-dd hh:mm:ss') => {
	/*time = new Date(time * 1000)*/
	if(!time) return ''
	
	if(typeof time === 'string') time = time.replace(/\-/g, "/")
	time = new Date(time)
	
	let o = {
		'M+' : time.getMonth()+1,                 //月份
		'd+' : time.getDate(),                    //日
		'h+' : time.getHours(),                   //小时
		'm+' : time.getMinutes(),                 //分
		's+' : time.getSeconds(),                 //秒
		'q+' : Math.floor((time.getMonth()+3)/3), //季度
		'S'  : time.getMilliseconds()             //毫秒
	}
	if(/(y+)/.test(format)) {
		format = format.replace(RegExp.$1, (time.getFullYear() + '').substr(4 - RegExp.$1.length))
	}
	for(let k in o) {
		if(new RegExp(`(${k})`).test(format)){
			format = format.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : ((`00${o[k]}`).substr(('' + o[k]).length)))
		}
	}
	return format
	
})

Vue.filter('formatConcat', (obj, index = '') => {
	if(index && obj){
		//对象数组
		let tmp = [];
		_.forEach(obj,(value, key)=>{
			tmp.push(value[index])
		})
		return tmp.join()
	}else if (obj){
		//纯对象
		return _.values(obj).join()
	}
	return ''
})

















