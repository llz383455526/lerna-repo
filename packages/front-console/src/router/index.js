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
let invoiceList = r => require.ensure([], () => r(require('../pages/invoice/list.vue')), 'invoiceList');
let invoiceCreate = r => require.ensure([], () => r(require('../pages/invoice/create.vue')), 'invoiceCreate');
let ticketIssued = r => require.ensure([], () => r(require('../pages/invoice/ticketIssued.vue')), 'ticketIssued');
let oweTicketManager = r => require.ensure([], () => r(require('../pages/invoice/oweTicketManager.vue')), 'oweTicketManager');

let infoManager = r => require.ensure([], () => r(require('../pages/infoManager/infoManager.vue')), 'infoManager');
let addCustomer = r => require.ensure([], () => r(require('../pages/infoManager/addCustomer.vue')), 'addCustomer');
let whiteList = r => require.ensure([], () => r(require('../pages/infoManager/whiteList.vue')), 'whiteList');
let categoryManager = r => require.ensure([], () => r(require('../pages/categoryManager/categoryManager.vue')), 'categoryManager');
let addCategory = r => require.ensure([], () => r(require('../pages/categoryManager/addCategory.vue')), 'addCategory');


let reconTools = r => require.ensure([], () => r(require('../pages/reconTools/reconTools.vue')), 'reconTools');
let reconDetail = r => require.ensure([], () => r(require('../pages/reconTools/reconDetail.vue')), 'reconDetail');
let reconDetailError = r => require.ensure([], () => r(require('../pages/reconTools/reconDetailError.vue')), 'reconDetailError');

let templateList =  r => require.ensure([], () => r(require('../pages/contract/templateList')), 'templateList')
let templateCreate =  r => require.ensure([], () => r(require('../pages/contract/templateCreate')), 'templateCreate')
let contractList =  r => require.ensure([], () => r(require('../pages/contract/contractList')), 'contractList')
let contractCreate =  r => require.ensure([], () => r(require('../pages/contract/contractCreate')), 'contractCreate')
let contractPreview =  r => require.ensure([], () => r(require('../pages/contract/contractPreview')), 'contractPreview')


let clientManager =  r => require.ensure([], () => r(require('../pages/clientManager/clientManager')), 'clientManager')
let appManager =  r => require.ensure([], () => r(require('../pages/clientManager/appManager')), 'appManager')
let appDetail =  r => require.ensure([], () => r(require('../pages/clientManager/appDetail')), 'appDetail') 

let advertisingList =  r => require.ensure([], () => r(require('../pages/management/advertisingList')), 'advertisingList')
let advertisingCreate =  r => require.ensure([], () => r(require('../pages/management/advertisingCreate')), 'advertisingCreate')
let messageList =  r => require.ensure([], () => r(require('../pages/management/messageList')), 'messageList')
let messageCreate =  r => require.ensure([], () => r(require('../pages/management/messageCreate')), 'messageCreate')

let invoiceListNew = r => require.ensure([], () => r(require('../pages/reconciliationCenter/invoiceList')), 'invoiceList')
let invoiceDetail = r => require.ensure([], () => r(require('../pages/reconciliationCenter/invoiceDetail')), 'invoiceDetail')
let contractListNew = r => require.ensure([], () => r(require('../pages/reconciliationCenter/contractList')), 'contractList')
let contractDetail = r => require.ensure([], () => r(require('../pages/reconciliationCenter/contractDetail')), 'contractDetail')
let rechargeList = r => require.ensure([], () => r(require('../pages/reconciliationCenter/rechargeList')), 'rechargeList')
let billList = r => require.ensure([], () => r(require('../pages/reconciliationCenter/list-flow')), 'billList')
let payOrderNew = r => require.ensure([], () => r(require('../pages/reconciliationCenter/payOrder')), 'payOrderNew')
let rechargeIndexNew = r => require.ensure([], () => r(require('../pages/reconciliationCenter/rechargeDetail')), 'rechargeIndexNew')

export default [
    {
        path: '/',
        component: App,
        redirect: '/main',
        children: [
            {
                path: '/main',
                component: main,
                // redirect: '/main/backlog',
                // redirect: '/main/infoManager/infoManager',
                children: [
                    {
                        path: 'accountManager',
                        component: account,
                        children: [{
                            path: 'payOrder',
                            component: payOrder
                        }, {
                            path: 'index',
                            component: accountIndex
                        }, {
                            path: 'payOrderReject',
                            component: payOrderReject
                        }, {
                            path: 'amountManager',
                            component: amountManager
                        }, {
                            path: 'companyCreditRecord',
                            component: companyCreditRecord
                        }, {
                            path: 'creditBill',
                            component: creditBill
                        }]
                    }, {
                        path: 'amountManager',
                        component: index,
                        children: [{
                            path: 'index',
                            component: amountManager
                        }]
                    }, {
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
                                component: r => require.ensure([], () => r(require('../pages/contract/create.vue')), 'create'),
	                            meta: {
		                            keepAlive: false
	                            }
                            },
                            {
                                path: 'preview',
                                component: r => require.ensure([], () => r(require('../pages/contract/preview.vue')), 'preview'),
	                            meta: {
		                            keepAlive: false
	                            }
                            },
	                        {
	                        	path: 'templateList',
		                        component: templateList,
		                        meta: {
			                        keepAlive: false
		                        }
	                        },
	                        {
	                        	path: 'templateCreate',
		                        component: templateCreate,
		                        meta: {
			                        keepAlive: false
		                        }
	                        }, {
                        	    path: 'contractList',
		                        component: contractList,
		                        meta: {
			                        keepAlive: false
		                        }
	                        }, {
                        	    path: 'contractCreate',
		                        component: contractCreate,
		                        meta: {
			                        keepAlive: false
		                        }
	                        }, {
                        	    path: 'contractPreview',
		                        component: contractPreview,
		                        meta: {
			                        keepAlive: false
		                        }
	                        }
                        ]
                    },{
		                path: 'management',
		                component: index,
		                children: [{
			                path: 'advertisingList',
			                component: advertisingList,
			                meta: {
				                keepAlive: false
			                }
		                },{
			                path: 'advertisingCreate',
			                component: advertisingCreate,
			                meta: {
				                keepAlive: false
			                }
		                },{
			                path: 'messageList',
			                component: messageList,
			                meta: {
				                keepAlive: false
			                }
		                },{
			                path: 'messageCreate',
			                component: messageCreate,
			                meta: {
				                keepAlive: false
			                }
		                }]
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
                        path: 'settled',
                        component: index,
                        children: [
                            {
                                path: 'list-flow',
                                component: r => require.ensure([], () => r(require('../pages/settled/list-flow.vue')), 'list-flow')
                            },
                            {
                                path: 'list-service',
                                component: r => require.ensure([], () => r(require('../pages/settled/list-service.vue')), 'list-service')
                            },
                            {
                                path: 'list-abnormity',
                                component: r => require.ensure([], () => r(require('../pages/settled/list-abnormity.vue')), 'list-abnormity')
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
                    },
                    {
                        path: 'infoManager',
                        component: index,
                        children: [
                            {
                                path: 'infoManager',
                                component: infoManager
                            },
                            {
                                path: 'addCustomer',
                                component: addCustomer
                            },
                            {
                                path: 'whiteList',
                                component: whiteList
                            },
                            {
                                path: 'categoryManager',
                                component: categoryManager
                            },
                            {
                                path: 'addCategory',
                                component: addCategory
                            }
                        ]
                    },
                    {
                        path: 'billingManager',
                        component: index,
                        children: [
                            {
                                path: 'list',
                                component: r => require.ensure([], () => r(require('../pages/billingManager/list.vue')), 'list')
                            },
                            {
                                path: 'create',
                                component: r => require.ensure([], () => r(require('../pages/billingManager/create.vue')), 'create')
                            }
                        ]
                    },
                    {
                        path: 'invoice',
                        component: index,
                        children: [
                            {
                                path: 'list',
                                component: invoiceList,
                                meta: {
                                    keepAlive: false, //此组件不需要被缓存
                                }
                            },
                            {
                                path: 'create',
                                component: invoiceCreate,
                                meta: {
                                    keepAlive: false, //此组件不需要被缓存
                                }
                            },
                            {
                                path: 'ticketIssued',
                                component: ticketIssued
                            },
                            {
                                path: 'oweTicketManager',
                                component: oweTicketManager
                            }
                        ]
                    },
                    {
                        path: 'reconTools',
                        component: index,
                        children: [
                            {path: 'list', component: reconTools},
                            {path: 'reconDetail', component: reconDetail, meta: {
                                    keepAlive: false, //此组件不需要被缓存
                                }
                            },
                            {path: 'reconDetailError', component: reconDetailError, meta: {
                                    keepAlive: false, //此组件不需要被缓存
                                }
                            },
                        ]
                    },
                    {
                        path: 'clientManager',
                        component: index,
                        children: [
                            {
                                path: 'clientManager',
                                component: clientManager
                            },
                            {
                                path: 'appManager',
                                component: appManager
                            },
                            {
                                path: 'appDetail',
                                component: appDetail
                            }
                        ]
                    },
	                {
		                path: 'reconciliationCenter',
		                component: index,
		                children: [{
			                path: 'invoiceList',
			                component: invoiceListNew
		                },{
			                path: 'invoiceDetail',
			                component: invoiceDetail
		                },{
			                path: 'contractList',
			                component: contractListNew
		                },{
			                path: 'contractDetail',
			                component: contractDetail
		                },{
			                path: 'rechargeList',
			                component: rechargeList
		                },{
			                path: 'rechargeDetail',
			                component: rechargeIndexNew
		                },{
			                path: 'payOrder',
			                component: payOrderNew
		                },{
			                path: 'billList',
			                component: billList
		                }]
	                },
                ],
            },
            {
                path: '/login',
                component: login
            }
        ]
    }
]












