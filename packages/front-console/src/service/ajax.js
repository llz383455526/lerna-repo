/**
 * Created by bigben on 2017/4/18.
 */

export default (type = 'GET', url, param = {}, callback, async=true) => {
	type = type.toUpperCase();
	
	let requestObj;
	if (window.XMLHttpRequest) {
		requestObj = new XMLHttpRequest();
	} else {
		requestObj = new ActiveXObject;
	}

	//console.log('requestObj', requestObj);
	let userProfiles = window.localStorage.getItem('userProfiles')
	if(userProfiles === 'undefined') userProfiles= false
	
	if(type === 'GET') {
		let dataStr = '' //数据拼接字符串
		let link = '?'	//处理如果url本身带?的情况
		if(url.indexOf('?') > -1){
			link = '&'
		}
		Object.keys(param).forEach(key => {
			var value = param[key]
			if(typeof param[key] == 'object') {
				value = JSON.stringify(param[key])
			}
			dataStr += key + '=' + value + '&'
		})
		dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
		if(dataStr) url += `${link}${dataStr}&t=${parseInt(Math.random() * 100000)}`
		else url += `${link}t=${parseInt(Math.random() * 100000)}`
		
		requestObj.open(type, url, async)
		requestObj.timeout = 30000
		requestObj.setRequestHeader('If-Modified-Since', '0')
		requestObj.setRequestHeader('Content-type', 'application/x-www-form-urlencoded')
		if(userProfiles) requestObj.setRequestHeader('x-sec-profile', userProfiles)
        //console.log('getttttttttttttttt', requestObj);
		requestObj.send()
	}else if (type === 'POST') {
		requestObj.open(type, url, async);
		requestObj.timeout = 30000
		requestObj.setRequestHeader("Content-type", "application/json");
		if(userProfiles) requestObj.setRequestHeader('x-sec-profile', userProfiles)
		requestObj.send(JSON.stringify(param));
        //console.log('postoooooooooooooo', requestObj);
	}else if (type === 'FORM') {
		//let url = 'https://sunnyhao.oss-cn-shenzhen.aliyuncs.com'
		requestObj.open('post', url, async);
		requestObj.send(param);
	}else if (type === 'IMPORT') {
		requestObj.open('post', url, async);
		requestObj.send(param);
	}else {
		callback({error: 'error type'});
	}
	
	requestObj.onreadystatechange = () => {
		if (requestObj.readyState === 4) {
			/*if(requestObj.responseURL !== url){
				window.location.href = requestObj.responseURL
				reject(false)
			}*/
			//console.log(requestObj)
			
			if (requestObj.status === 200) {
				let obj = requestObj.response || requestObj.responseText
				if(type === 'FORM' && !obj) {
					//let url = param.get('key').split('/')
					obj = {
						code: 200,
						data: {
							/*displayName: param.get('name'),
							name: url[1],
							catalogue: url[0]*/
						}
					}
				}
				
				if (obj && typeof obj !== 'object') {
					try {
                        obj = JSON.parse(obj);
					} catch (error) {
						console.log(error);
					}
				}
				callback(obj);
			}else {
				callback(requestObj)
			}
		}
	}
	
	
}












