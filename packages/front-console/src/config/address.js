
let baseUrl

switch(process.env.NODE_ENV) {
	case 'development':
		baseUrl = 'http://openadmintest94.aiyuangong.com'
		break
	default:
		baseUrl = ''
}

export {
	baseUrl
}















