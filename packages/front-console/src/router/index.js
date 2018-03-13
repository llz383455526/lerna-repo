import App from '../App'

let login = r => require.ensure([], () => r(require('../pages/login.vue')), 'login');
let main = r => require.ensure([], () => r(require('../pages/main.vue')), 'main');
let account = r => require.ensure([], () => r(require('../pages/account/basic.vue')), 'account');
let payOrder = r => require.ensure([], () => r(require('../pages/accountManager/payOrder.vue')), 'payOrder');
let accountIndex = r => require.ensure([], () => r(require('../pages/account/index.vue')), 'accountIndex');
let payOrderReject = r => require.ensure([], () => r(require('../pages/accountManager/payOrderReject.vue')), 'payOrderReject');

let amountManager = r => require.ensure([], () => r(require('../pages/accountManager/amountManager.vue')), 'amountManager');
let companyCreditRecord = r => require.ensure([], () => r(require('../pages/accountManager/companyCreditRecord.vue')), 'companyCreditRecord');

let backlog = r => require.ensure([], () => r(require('../pages/backlog/list')), 'backlog');

let index = r => require.ensure([], () => r(require('../pages/public/index.vue')), 'index');
let creditBill = r => require.ensure([], () => r(require('../pages/accountManager/companyCredit.vue')), 'creditBill');


let statistics = r => require.ensure([], () => r(require('../pages/orderManager/statistics.vue')), 'statistics');
let eContractIndex = r => require.ensure([], () => r(require('../pages/eContract/index.vue')), 'eContractIndex');
let rechargeIndex = r => require.ensure([], () => r(require('../pages/recharge/index.vue')), 'rechargeIndex');


export default [{
    path: '/',
    component: App,
    redirect: '/main/accountManager/payOrder',
    children: [{
        path: '/main',
        component: main,
        // redirect: '/main/backlog',
        redirect: '/main/accountManager/payOrder',
        children: [
            {
                path: 'accountManager',
                component: account,
                children: [{
                    path: 'payOrder',
                    component: payOrder
                },{
                    path: 'index',
                    component: accountIndex
                },{
                    path: 'payOrderReject',
                    component: payOrderReject
                },{
                    path: 'amountManager',
                    component: amountManager
                }, {
                    path: 'companyCreditRecord',
                    component: companyCreditRecord
                },{
                    path: 'creditBill',
                    component: creditBill
                }]
            },{
                path: 'amountManager',
                component: index,
                children: [{
                    path: 'index',
                    component: amountManager
                }]
            },{
                path: 'paymentIssue',
                component: index,
                children: []
            }, {
                path: 'orderManager',
                component: index,
                children: [{
                    path: 'statistics',
                    component: statistics
                }]
            }, {
                path: 'contract',
                component: index,
                children: [
                    {
                        path: 'list',
                        component: r => require.ensure([], () => r(require('../pages/contract/list.vue')), 'list')
                    },
                    {
                        path: 'create',
                        component: r => require.ensure([], () => r(require('../pages/contract/create.vue')), 'create')
                    },
                    {
                        path: 'preview',
                        component: r => require.ensure([], () => r(require('../pages/contract/preview.vue')), 'preview')
                    }
                ]
            }, {
                path: 'bigAmount',
                component: index,
                children: [
                    {
                        path: 'list',
                        component: r => require.ensure([], () => r(require('../pages/bigAmount/list.vue')), 'list')
                    }
                ]
            }, {
                path: 'eContract',
                component: index,
                children: [{
                    path: 'index',
                    component: eContractIndex
                }]
            }, {
                path: 'recharge',
                component: index,
                children: [{
                    path: 'applyList',
                    component: rechargeIndex
                }]
            }
        ]
    }, {
        path: '/login',
        component: login
    }]
}]












