let formatTime = (time, format = 'yyyy-MM-dd hh:mm:ss') => {
	if(!time) return ''
	
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
}

/** 
 * param 将要转为URL参数字符串的对象 
 * key URL参数字符串的前缀 
 * encode true/false 是否进行URL编码,默认为true 
 *  
 * return URL参数字符串 
 */ 
let urlEncode = (param, key, encode) => {  
  if(param==null) return '';  
  var paramStr = '';  
  var t = typeof (param);  
  if (t == 'string' || t == 'number' || t == 'boolean') {  
    paramStr += '&' + key + '=' + ((encode==null||encode) ? encodeURIComponent(param) : param);  
  } else {  
    for (var i in param) {  
      var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);  
      paramStr += urlEncode(param[i], k, encode);  
    }  
  }  
  return paramStr;  
};  

// 获取浏览器信息
let getBrowserInfo = () => {
  const sys = {}
  const ua = navigator.userAgent.toLowerCase()
  const re = /(msie|firefox|chrome|opera|version|rv).*?([\d.]+)/
  const m = ua.match(re)
  sys.browser = m[1].replace(/version/, "'safari")
  // 兼容IE11
  sys.browser = m[1].replace(/rv/, "'msie")
  // eslint-disable-next-line prefer-destructuring
  sys.ver = m[2]
  return sys
}

export {
	formatTime,
	urlEncode,
	getBrowserInfo,
}
