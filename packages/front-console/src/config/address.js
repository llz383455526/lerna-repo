
let baseUrl

switch(process.env.NODE_ENV) {
	case 'development':
		baseUrl = 'http://consoletest94.aiyuangong.com'
		break
	default:
		baseUrl = '/api/console-dlv'
}

export {
	baseUrl
}















