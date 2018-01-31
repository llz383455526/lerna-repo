
let baseUrl

switch(process.env.NODE_ENV) {
	case 'development':
		baseUrl = 'http://consoletest94.aiyuangong.com/api/console-deliver'
		break
	default:
		baseUrl = '/factor-server'
}

export {
	baseUrl
}















