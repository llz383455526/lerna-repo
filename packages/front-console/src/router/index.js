import App from '../App'

let login = r => require.ensure([], () => r(require('../pages/login.vue')), 'login');
let main = r => require.ensure([], () => r(require('../pages/main.vue')), 'main');
let account = r => require.ensure([], () => r(require('../pages/account/basic.vue')), 'account');
let accountList = r => require.ensure([], () => r(require('../pages/account/list.vue')), 'accountList');
let accountIndex = r => require.ensure([], () => r(require('../pages/account/index.vue')), 'accountIndex');
let accountPreview = r => require.ensure([], () => r(require('../pages/account/preview.vue')), 'accountPreview');

let amountManagerBasic = r => require.ensure([], () => r(require('../pages/amountManager/basic.vue')), 'amountManagerBasic');
let amountManager = r => require.ensure([], () => r(require('../pages/amountManager/index.vue')), 'amountManager');
let rechargeRecord = r => require.ensure([], () => r(require('../pages/rechargeRecord/index.vue')), 'rechargeRecord');

let backlog = r => require.ensure([], () => r(require('../pages/backlog/list')), 'backlog');

let creditBillIndex = r => require.ensure([], () => r(require('../pages/paymentIssue/index.vue')), 'creditBillIndex');
let creditBill = r => r => require.ensure([], () => r(require('../pages/paymentIssue/creditBill.vue')), 'creditBill');


export default [{
    path: '/',
    component: App,
    redirect: '/main/account/list',
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
                },{
                    path: 'preview',
                    component: accountPreview
                },{
                    path: 'amountManager',
                    component: amountManager
                },{
                    path: 'rechargeRecord',
                    component: rechargeRecord
                }]
            },{
                path: 'amountManager',
                component: amountManagerBasic,
                children: [{
                    path: 'index',
                    component: amountManager
                }]
            },{
                path: 'paymentIssue',
                component: creditBillIndex,
                children: [{
                    path: 'creditBill',
                    component: creditBill
                }]
            }
        ]
    }, {
        path: '/login',
        component: login
    }]
}]












