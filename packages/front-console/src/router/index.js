
import App from '../App'

let login = r => require.ensure([], () => r(require('../pages/login')), 'login')
let main = r => require.ensure([], () => r(require('../pages/main')), 'main')

let backlog = r => require.ensure([], () => r(require('../pages/backlog/list')), 'backlog')

export default [{
	path: '/',
	component: App,
	redirect: '/main/backlog',
	children: [{
		path: '/main',
		component: main,
		redirect: '/main/backlog',
		children: [
			{
				path: 'backlog',
				component: backlog
			}, {
                path: '*',
				redirect: '/main/backlog',
                //redirect: '/main/companymanagement/'
            }
		]
	}, {
		path: '/login',
		component: login
	}]
}]












