
let baseUrl

switch(process.env.NODE_ENV) {
	case 'development':
		baseUrl = 'http://fttest94.aiyuangong.com/factor-server'
		break
	default:
		baseUrl = '/factor-server'
}

export {
	baseUrl
}















