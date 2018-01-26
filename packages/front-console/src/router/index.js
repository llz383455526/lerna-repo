
import App from '../App'

let login = r => require.ensure([], () => r(require('../pages/login')), 'login')
let main = r => require.ensure([], () => r(require('../pages/main')), 'main')


export default [{
	path: '/',
	component: App,
	redirect: '/main',
	children: [{
		path: '/main',
		component: main,
		//redirect: '',
		children: [
		
		]
	}, {
		path: 'login',
		component: login
	}]
}]












