import App from '../App'

let login = r => require.ensure([], () => r(require('../pages/login.vue')), 'login')
let main = r => require.ensure([], () => r(require('../pages/main.vue')), 'main')
let account = r => require.ensure([], () => r(require('../pages/account/basic.vue')), 'account')
let accountList = r => require.ensure([], () => r(require('../pages/account/list.vue')), 'accountList')
let accountIndex = r => require.ensure([], () => r(require('../pages/account/index.vue')), 'accountIndex')

let backlog = r => require.ensure([], () => r(require('../pages/backlog/list')), 'backlog')

export default [{
    path: '/',
    component: App,
    redirect: '/main/backlog',
    children: [{
        path: '/main',
        component: main,
        // redirect: '/main/backlog',
        redirect: '/main/account/list',
        children: [
            {
                path: 'account',
                component: account,
                children: [{
                    path: 'list',
                    component: accountList
                },{
                    path: 'index',
                    component: accountIndex
                }]
            }
        ]
    }, {
        path: '/login',
        component: login
    }]
}]












