import App from '../App'

let login = r => require.ensure([], () => r(require('../pages/login.vue')), 'login');
let main = r => require.ensure([], () => r(require('../pages/main.vue')), 'main');
let account = r => require.ensure([], () => r(require('../pages/account/basic.vue')), 'account');
let payOrder = r => require.ensure([], () => r(require('../pages/accountManager/payOrder.vue')), 'payOrder');
const releaseRecord = r => require.ensure([], () => r(require('../pages/accountManager/releaseRecord.vue')), 'releaseRecord')
let accountIndex = r => require.ensure([], () => r(require('../pages/account/index.vue')), 'accountIndex');
let payOrderReject = r => require.ensure([], () => r(require('../pages/accountManager/payOrderReject.vue')), 'payOrderReject');
let fundDetail = r => require.ensure([], () => r(require('../pages/account/fundDetail.vue')), 'fundDetail');
let payManager = r => require.ensure([], () => r(require('../pages/account/payManager.vue')), 'payManager');
let regulation = r => require.ensure([], () => r(require('../pages/account/regulation.vue')), 'regulation');
let clientDetail = r => require.ensure([], () => r(require('../pages/account/clientDetail.vue')), 'clientDetail');
let serviceDetail = r => require.ensure([], () => r(require('../pages/account/serviceDetail.vue')), 'serviceDetail');
let assignDetail = r => require.ensure([], () => r(require('../pages/account/assignDetail.vue')), 'assignDetail');

let amountManager = r => require.ensure([], () => r(require('../pages/accountManager/amountManager.vue')), 'amountManager');
let companyCreditRecord = r => require.ensure([], () => r(require('../pages/accountManager/companyCreditRecord.vue')), 'companyCreditRecord');

let backlog = r => require.ensure([], () => r(require('../pages/backlog/list')), 'backlog');

let index = r => require.ensure([], () => r(require('../pages/public/index.vue')), 'index');
let creditBill = r => require.ensure([], () => r(require('../pages/accountManager/companyCredit.vue')), 'creditBill');

let orderManager = r => require.ensure([], () => r(require('../pages/orderManager/orderManager.vue')), 'orderManager');
let orderManagerShuntTool = r => require.ensure([], () => r(require('../pages/orderManager/shuntTool.vue')), 'orderManagerShuntTool');
let statistics = r => require.ensure([], () => r(require('../pages/orderManager/statistics.vue')), 'statistics');
let defrayment = r => require.ensure([], () => r(require('../pages/orderManager/defrayment.vue')), 'defrayment');
let submitOrder = r => require.ensure([], () => r(require('../pages/orderManager/submitOrder.vue')), 'submitOrder');
let postalService = r => require.ensure([], () => r(require('../pages/orderManager/postalService.vue')), 'postalService');
let orderComplete = r => require.ensure([], () => r(require('../pages/orderManager/orderComplete.vue')), 'orderComplete');
let cancleOrder = r => require.ensure([], () => r(require('../pages/orderManager/cancleOrder.vue')), 'cancleOrder');
let riskRule = r => require.ensure([], () => r(require('../pages/orderManager/riskRule.vue')), 'riskRule');
let addRiskRule = r => require.ensure([], () => r(require('../pages/orderManager/addRiskRule.vue')), 'addRiskRule');
let clientRiskRule = r => require.ensure([], () => r(require('../pages/orderManager/clientRiskRule.vue')), 'clientRiskRule');
let missionList = r => require.ensure([], () => r(require('../pages/orderManager/missionList.vue')), 'missionList');
let addMission = r => require.ensure([], () => r(require('../pages/orderManager/addMission.vue')), 'addMission');
let auditMission = r => require.ensure([], () => r(require('../pages/orderManager/auditMission.vue')), 'auditMission');
let checkMission = r => require.ensure([], () => r(require('../pages/orderManager/checkMission.vue')), 'checkMission');

let eContractIndex = r => require.ensure([], () => r(require('../pages/eContract/index.vue')), 'eContractIndex');
let contractManager = r => require.ensure([], () => r(require('../pages/eContract/contractManager.vue')), 'contractManager');
let addTemplate = r => require.ensure([], () => r(require('../pages/eContract/addTemplate.vue')), 'addTemplate');
let addTemplateGroup = r => require.ensure([], () => r(require('../pages/eContract/addTemplateGroup.vue')), 'addTemplateGroup');
let objectManager = r => require.ensure([], () => r(require('../pages/eContract/objectManager.vue')), 'objectManager');
let addObject = r => require.ensure([], () => r(require('../pages/eContract/addObject.vue')), 'addObject');
let signManager = r => require.ensure([], () => r(require('../pages/eContract/signManager.vue')), 'signManager');
let uploadObject = r => require.ensure([], () => r(require('../pages/eContract/uploadObject.vue')), 'uploadObject');
let checkObject = r => require.ensure([], () => r(require('../pages/eContract/checkObject.vue')), 'checkObject');
let signSuccess = r => require.ensure([], () => r(require('../pages/eContract/signSuccess.vue')), 'signSuccess');
let batchRecord = r => require.ensure([], () => r(require('../pages/eContract/batchRecord.vue')), 'batchRecord');
let offlineManager = r => require.ensure([], () => r(require('../pages/eContract/offlineManager.vue')), 'offlineManager');
let userManager = r => require.ensure([], () => r(require('../pages/eContract/userManager.vue')), 'userManager');
let consumerManager = r => require.ensure([], () => r(require('../pages/eContract/consumerManager.vue')), 'consumerManager');
let addConsumer = r => require.ensure([], () => r(require('../pages/eContract/addConsumer.vue')), 'addConsumer');

let rechargeIndex = r => require.ensure([], () => r(require('../pages/recharge/index.vue')), 'rechargeIndex');
let balanceAdjust = r => require.ensure([], () => r(require('../pages/recharge/balanceAdjust/list.vue')), 'balanceAdjust');
let clearing = r => require.ensure([], () => r(require('../pages/recharge/clearing/list.vue')), 'clearing');
let invoiceList = r => require.ensure([], () => r(require('../pages/invoice/list.vue')), 'invoiceList');
let invoiceStep1 = r => require.ensure([], () => r(require('../pages/invoice/invoice/step1.vue')), 'invoiceStep1');
let invoiceStep2 = r => require.ensure([], () => r(require('../pages/invoice/invoice/step2.vue')), 'invoiceStep2');

let invoiceCreate = r => require.ensure([], () => r(require('../pages/invoice/create.vue')), 'invoiceCreate');
let ticketIssued = r => require.ensure([], () => r(require('../pages/invoice/ticketIssued.vue')), 'ticketIssued');
let oweTicketManager = r => require.ensure([], () => r(require('../pages/invoice/oweTicketManager.vue')), 'oweTicketManager');
let batchApply = r => require.ensure([], () => r(require('../pages/invoice/batchApply.vue')), 'batchApply');

let infoManager = r => require.ensure([], () => r(require('../pages/infoManager/infoManager.vue')), 'infoManager');
let addCustomer = r => require.ensure([], () => r(require('../pages/infoManager/addCustomer.vue')), 'addCustomer');
let whiteList = r => require.ensure([], () => r(require('../pages/infoManager/whiteList.vue')), 'whiteList');
let categoryManager = r => require.ensure([], () => r(require('../pages/categoryManager/categoryManager.vue')), 'categoryManager');
let addCategory = r => require.ensure([], () => r(require('../pages/categoryManager/addCategory.vue')), 'addCategory');

let reconTools = r => require.ensure([], () => r(require('../pages/reconTools/reconTools.vue')), 'reconTools');
let reconDetail = r => require.ensure([], () => r(require('../pages/reconTools/reconDetail.vue')), 'reconDetail');
let reconDetailError = r => require.ensure([], () => r(require('../pages/reconTools/reconDetailError.vue')), 'reconDetailError');

let templateList = r => require.ensure([], () => r(require('../pages/contract/templateList')), 'templateList')
let templateCreate = r => require.ensure([], () => r(require('../pages/contract/templateCreate')), 'templateCreate')
let contractList = r => require.ensure([], () => r(require('../pages/contract/contractList')), 'contractList')
let contractCreate = r => require.ensure([], () => r(require('../pages/contract/contractCreate')), 'contractCreate')
let contractPreview = r => require.ensure([], () => r(require('../pages/contract/contractPreview')), 'contractPreview')
let serviceInvoiceManager = r => require.ensure([], () => r(require('../pages/contract/serviceInvoiceManager')), 'serviceInvoiceManager')
let agentContractList = r => require.ensure([], () => r(require('../pages/contract/agentContractList')), 'agentContractList')
let agentContractCreate = r => require.ensure([], () => r(require('../pages/contract/agentContractCreate')), 'agentContractCreate')
let agentShareList = r => require.ensure([], () => r(require('../pages/contract/agentShareList')), 'agentShareList')


let clientManager = r => require.ensure([], () => r(require('../pages/clientManager/clientManager')), 'clientManager')
let appManager = r => require.ensure([], () => r(require('../pages/clientManager/appManager')), 'appManager')
let appExamine = r => require.ensure([], () => r(require('../pages/clientManager/appExamine')), 'appExamine')
let appDetail = r => require.ensure([], () => r(require('../pages/clientManager/appDetail')), 'appDetail')
let addClient = r => require.ensure([], () => r(require('../pages/clientManager/addClient')), 'addClient')
let addApp = r => require.ensure([], () => r(require('../pages/clientManager/addApp')), 'addApp')
let serverManager = r => require.ensure([], () => r(require('../pages/clientManager/serverManager')), 'serverManager')
let addServer = r => require.ensure([], () => r(require('../pages/clientManager/addServer')), 'addServer')
let serverDetail = r => require.ensure([], () => r(require('../pages/clientManager/serverDetail')), 'serverDetail')
let report = r => require.ensure([], () => r(require('../pages/clientManager/report')), 'report')
let scheme = r => require.ensure([], () => r(require('../pages/clientManager/scheme')), 'scheme')
let agentManager = r => require.ensure([], () => r(require('../pages/clientManager/agentManager')), 'agentManager')
let addAgent = r => require.ensure([], () => r(require('../pages/clientManager/addAgent')), 'addAgent')
let agentDetail = r => require.ensure([], () => r(require('../pages/clientManager/agentDetail')), 'agentDetail')
let sectionAndStaff = r => require.ensure([], () => r(require('../pages/clientManager/sectionAndStaff')), 'sectionAndStaff')
let agentCompactList = r => require.ensure([], () => r(require('../pages/clientManager/agentCompactList')), 'agentCompactList')
let agentCompactCreate = r => require.ensure([], () => r(require('../pages/clientManager/agentCompactCreate')), 'agentCompactCreate')
let agentCompactLook = r => require.ensure([], () => r(require('../pages/clientManager/agentCompactLook')), 'agentCompactLook')

let advertisingList = r => require.ensure([], () => r(require('../pages/management/advertisingList')), 'advertisingList')
let advertisingCreate = r => require.ensure([], () => r(require('../pages/management/advertisingCreate')), 'advertisingCreate')
let messageList = r => require.ensure([], () => r(require('../pages/management/messageList')), 'messageList')
let messageCreate = r => require.ensure([], () => r(require('../pages/management/messageCreate')), 'messageCreate')

let invoiceListNew = r => require.ensure([], () => r(require('../pages/reconciliationCenter/invoiceList')), 'invoiceList')
let invoiceDetail = r => require.ensure([], () => r(require('../pages/reconciliationCenter/invoiceDetail')), 'invoiceDetail')
let contractListNew = r => require.ensure([], () => r(require('../pages/reconciliationCenter/contractList')), 'contractList')
let contractDetail = r => require.ensure([], () => r(require('../pages/reconciliationCenter/contractDetail')), 'contractDetail')
let rechargeList = r => require.ensure([], () => r(require('../pages/reconciliationCenter/rechargeList')), 'rechargeList')
let billList = r => require.ensure([], () => r(require('../pages/reconciliationCenter/list-flow')), 'billList')
let payOrderNew = r => require.ensure([], () => r(require('../pages/reconciliationCenter/payOrder')), 'payOrderNew')
let rechargeIndexNew = r => require.ensure([], () => r(require('../pages/reconciliationCenter/rechargeDetail')), 'rechargeIndexNew')


let offlineSalaryUpload = r => require.ensure([], () => r(require('../pages/accountManager/offlineSalaryUpload')), 'offlineSalaryUpload')
let offlineSalaryImport = r => require.ensure([], () => r(require('../pages/accountManager/offlineSalaryImport')), 'offlineSalaryImport')
let offlineSalaryManager = r => require.ensure([], () => r(require('../pages/accountManager/offlineSalaryManager')), 'offlineSalaryManager')


let individualIndex = r => require.ensure([], () => r(require('../pages/individual/individualIndex')), 'individualIndex')

let taxDiscountHome = r => require.ensure([], () => r(require('../pages/taxDiscount/home')), 'taxDiscountHome')
let taxDiscountList = r => require.ensure([], () => r(require('../pages/taxDiscount/list')), 'taxDiscountList')
let taxDiscountDetail = r => require.ensure([], () => r(require('../pages/taxDiscount/detail')), 'taxDiscountDetail')
const taxDiscountAdd = r => require.ensure([], () => r(require('../pages/taxDiscount/add')), 'taxDiscountAdd')
const taxDiscountStep1 = r => require.ensure([], () => r(require('../pages/taxDiscount/step/1')), 'taxDiscountStep1')
const taxDiscountStep2 = r => require.ensure([], () => r(require('../pages/taxDiscount/step/2')), 'taxDiscountStep2')
const taxDiscountStep3 = r => require.ensure([], () => r(require('../pages/taxDiscount/step/3')), 'taxDiscountStep3')
const taxDiscountStep4 = r => require.ensure([], () => r(require('../pages/taxDiscount/step/4')), 'taxDiscountStep4')
const taxDiscountStep5 = r => require.ensure([], () => r(require('../pages/taxDiscount/step/5')), 'taxDiscountStep5')
let taxDiscountSetting = r => require.ensure([], () => r(require('../pages/taxDiscount/userSetting')), 'taxDiscountSetting')
let attachmentList = r => require.ensure([], () => r(require('../pages/taxDiscount/attachmentList')), 'attachmentList')
let preSalesControl = r => require.ensure([], () => r(require('../pages/taxDiscount/preSalesControl')), 'preSalesControl')
let afterSalesControl = r => require.ensure([], () => r(require('../pages/taxDiscount/afterSalesControl')), 'afterSalesControl')
let controlApproveDetail = r => require.ensure([], () => r(require('../pages/taxDiscount/controlApproveDetail')), 'controlApproveDetail')

let landingCompanyList = r => require.ensure([], () => r(require('../pages/landingCompany/list')), 'landingCompanyList')
let landingCompanyCreate = r => require.ensure([], () => r(require('../pages/landingCompany/create')), 'landingCompanyCreate')
let companyAudit = r => require.ensure([], () => r(require('../pages/landingCompany/companyAudit')), 'companyAudit')
let addCompany = r => require.ensure([], () => r(require('../pages/landingCompany/addCompany')), 'addCompany')
let previewCompany = r => require.ensure([], () => r(require('../pages/landingCompany/previewCompany')), 'previewCompany')

const documentList = () => import('../pages/management/documentList')
const documentDetail = () => import('../pages/management/documentDetail')
const documentCreate = () => import('../pages/management/documentCreate')

const roleList = () => import('../pages/management/roleList')
const roleCreate = () => import('../pages/management/roleCreate')
const accountList = () => import('../pages/management/accountList')
const accountCreate = () => import('../pages/management/accountCreate')
const accountDetail = () => import('../pages/management/accountDetail')

const flowSigning = () => import('../pages/eContract/flowSigning') //签约流程

const newContractCreate = () => import('../pages/newContract/create')
const newContractList = () => import('../pages/newContract/list')
const newContractDetail = () => import('../pages/newContract/detail')
const newContractPreview = () => import('../pages/newContract/preview')
const newContractListComplated = () => import('../pages/newContract/list_complated')


export default [{
  path: '/',
  component: App,
  redirect: '/main',
  children: [{
      path: '/main',
      component: main,
      children: [{
          path: 'accountManager',
          component: index,
          children: [{
              path: 'payOrder',
              component: payOrder,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'releaseRecord',
              component: releaseRecord,
              meta: {
                keepAlive: false,
              },
              name: '发放记录'
            },
            {
              path: 'offlineSalaryUpload',
              component: offlineSalaryUpload,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'offlineSalaryImport',
              component: offlineSalaryImport,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'offlineSalaryManager',
              component: offlineSalaryManager,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'index',
              component: accountIndex,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'payOrderReject',
              component: payOrderReject,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'amountManager',
              component: amountManager,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'companyCreditRecord',
              component: companyCreditRecord,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'creditBill',
              component: creditBill,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'fundDetail',
              component: fundDetail,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'payManager',
              component: payManager,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'regulation',
              component: regulation,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'clientDetail',
              component: clientDetail,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'serviceDetail',
              component: serviceDetail,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'assignDetail',
              component: assignDetail,
              meta: {
                keepAlive: false
              }
            }
          ]
        }, {
          path: 'amountManager',
          component: index,
          children: [{
            path: 'index',
            component: amountManager
          }]
        },
        {
          path: 'paymentIssue',
          component: index,
          children: []
        },
        {
          path: 'orderManager',
          component: index,
          children: [{
              path: 'orderManager',
              component: orderManager,
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'shuntTool',
              component: orderManagerShuntTool,
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'statistics',
              component: statistics
            },
            {
              path: 'defrayment',
              component: defrayment,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'submitOrder',
              component: submitOrder,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'postalService',
              component: postalService,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'orderComplete',
              component: orderComplete,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'cancleOrder',
              component: cancleOrder,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'riskRule',
              component: riskRule,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'addRiskRule',
              component: addRiskRule,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'clientRiskRule',
              component: clientRiskRule,
              meta: {
                keepAlive: false
              }
            },
            {
                path: 'missionList',
                component: missionList,
                meta: {
                    keepAlive: false
                }
            },
            {
                path: 'addMission',
                component: addMission,
                meta: {
                    keepAlive: false
                }
            },
            {
                path: 'auditMission',
                component: auditMission,
                meta: {
                    keepAlive: false
                }
            },
            {
                path: 'checkMission',
                component: checkMission,
                meta: {
                    keepAlive: false
                }
            }
          ]
        },
        {
          path: 'performance',
          component: index,
          children: [
            {
              path: 'enterprise',
              component: r => require.ensure([], () => r(require('../pages/performance/enterprise/index.vue')), 'enterprise')
            },
            {
              path: 'personal',
              component: r => require.ensure([], () => r(require('../pages/performance/personal/index.vue')), 'enterprise')
            }
          ]
        },
        {
          path: 'contract',
          component: index,
          children: [{
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
            },
            {
              path: 'contractList',
              component: contractList,
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'contractCreate',
              component: contractCreate,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'contractPreview',
              component: contractPreview,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'serviceInvoiceManager',
              component: serviceInvoiceManager,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'agentContractList',
              component: agentContractList,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'agentContractCreate',
              component: agentContractCreate,
              meta: {
                keepAlive: false
              }
            },
            {
                path: 'agentShareList',
                component: agentShareList,
                meta: {
                    keepAlive: false
                }
            }
          ]
        }, {
          path: 'newContract',
          component: index,
          children: [{
              path: 'create',
              component: newContractCreate,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'list',
              component: newContractList,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'detail',
              component: newContractDetail,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'preview',
              component: newContractPreview,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'list_complated',
              component: newContractListComplated,
              meta: {
                keepAlive: false
              }
            }
          ]
        },
        {
          path: 'management',
          component: index,
          children: [{
              path: 'advertisingList',
              component: advertisingList,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'advertisingCreate',
              component: advertisingCreate,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'messageList',
              component: messageList,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'messageCreate',
              component: messageCreate,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'documentList',
              component: documentList,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'documentDetail',
              component: documentDetail,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'documentCreate',
              component: documentCreate,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'roleList',
              component: roleList,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'roleCreate',
              component: roleCreate,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'accountList',
              component: accountList,
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'accountCreate',
              component: accountCreate,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'accountDetail',
              component: accountDetail,
              meta: {
                keepAlive: false
              }
            }
          ]
        },
        {
          path: 'bigAmount',
          component: index,
          children: [{
            path: 'list',
            component: r => require.ensure([], () => r(require('../pages/bigAmount/list.vue')), 'list')
          }]
        },
        {
          path: 'settled',
          component: index,
          children: [{
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
        },
        {
          path: 'eContract',
          component: index,
          children: [{
              path: 'index',
              component: eContractIndex,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'contractManager',
              component: contractManager,
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'addTemplate',
              component: addTemplate,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'addTemplateGroup',
              component: addTemplateGroup,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'objectManager',
              component: objectManager,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'addObject',
              component: addObject,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'signManager',
              component: signManager,
              meta: {
                keepAlive: true
              }
            },
            {
              path: 'uploadObject',
              component: uploadObject,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'checkObject',
              component: checkObject,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'signSuccess',
              component: signSuccess,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'batchRecord',
              component: batchRecord,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'offlineManager',
              component: offlineManager,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'userManager',
              component: userManager,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'start/:id',
              component: flowSigning,
              hidden: true,
              name: 'flowSigning',
              meta: {
                title: '签约流程',
                keepAlive: false
              }
            },
            {
                path: 'consumerManager',
                component: consumerManager,
                meta: {
                  keepAlive: false
                }
            },
            {
                path: 'addConsumer',
                component: addConsumer,
                meta: {
                  keepAlive: false
                }
            }
          ]
        },
        {
          path: 'recharge',
          component: index,
          children: [{
              path: 'applyList',
              component: rechargeIndex,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'balanceAdjust',
              component: balanceAdjust,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'clearing',
              component: clearing,
              meta: {
                keepAlive: false
              }
            }
          ]
        },
        {
          path: 'infoManager',
          component: index,
          children: [{
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
          children: [{
              path: 'list',
              component: r => require.ensure([], () => r(require('../pages/billingManager/list.vue')), 'list')
            },
            {
              path: 'create',
              component: r => require.ensure([], () => r(require('../pages/billingManager/create.vue')), 'create'),
              meta: {
                keepAlive: false, //此组件不需要被缓存
              }
            },
            {
                path: 'monitoring',
                component: r => require.ensure([], () => r(require('../pages/billingManager/monitoring.vue')), 'monitoring')
              }
          ]
        },
        {
          path: 'invoice',
          component: index,
          children: [{
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
            },
            {
              path: 'batchApply',
              component: batchApply,
              meta: {
                keepAlive: false, //此组件不需要被缓存
              }
            }
          ]
        },
        {
          path: 'reconTools',
          component: index,
          children: [{
              path: 'list',
              component: reconTools
            },
            {
              path: 'reconDetail',
              component: reconDetail,
              meta: {
                keepAlive: false, //此组件不需要被缓存
              }
            },
            {
              path: 'reconDetailError',
              component: reconDetailError,
              meta: {
                keepAlive: false, //此组件不需要被缓存
              }
            },
          ]
        },
        {
          path: 'clientManager',
          component: index,
          children: [{
              path: 'clientManager',
              component: clientManager
            },
            {
              path: 'appManager',
              component: appManager
            },
            {
              path: 'appExamine',
              component: appExamine
            },
            {
              path: 'appDetail',
              component: appDetail,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'addClient',
              component: addClient,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'addApp',
              component: addApp,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'serverManager',
              component: serverManager
            },
            {
              path: 'addServer',
              component: addServer,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'serverDetail',
              component: serverDetail,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'report',
              component: report,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'scheme',
              component: scheme,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'agentManager',
              component: agentManager,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'addAgent',
              component: addAgent,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'agentDetail',
              component: agentDetail,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'sectionAndStaff',
              component: sectionAndStaff,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'agentCompactList',
              component: agentCompactList,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'agentCompactCreate',
              component: agentCompactCreate,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'agentCompactLook',
              component: agentCompactLook,
              meta: {
                keepAlive: false
              }
            }
          ]
        },
        {
          path: 'reconciliationCenter',
          component: index,
          children: [{
              path: 'invoiceList',
              component: invoiceListNew
            },
            {
              path: 'invoiceDetail',
              component: invoiceDetail
            },
            {
              path: 'contractList',
              component: contractListNew
            },
            {
              path: 'contractDetail',
              component: contractDetail
            },
            {
              path: 'rechargeList',
              component: rechargeList
            },
            {
              path: 'rechargeDetail',
              component: rechargeIndexNew
            },
            {
              path: 'payOrder',
              component: payOrderNew
            },
            {
              path: 'billList',
              component: billList
            }
          ]
        },
        {
          path: 'individual',
          component: index,
          children: [{
            path: 'individualIndex',
            component: individualIndex,
            meta: {
              keepAlive: false
            }
          }]
        },
        {
          path: 'taxDiscount',
          component: index,
          children: [{
              path: 'home',
              component: taxDiscountHome,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'list',
              component: taxDiscountList,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'detail',
              component: taxDiscountDetail,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'setting',
              component: taxDiscountSetting,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'add',
              component: taxDiscountAdd,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'step1',
              component: taxDiscountStep1,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'step2',
              component: taxDiscountStep2,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'step3',
              component: taxDiscountStep3,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'step4',
              component: taxDiscountStep4,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'step5',
              component: taxDiscountStep5,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'setting',
              component: taxDiscountSetting,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'attachmentList',
              component: attachmentList,
              meta: {
                keepAlive: false
              }
            },
            {
                path: 'preSalesControl',
                component: preSalesControl,
                meta: {
                    keepAlive: false
                }
            },
            {
                path: 'afterSalesControl',
                component: afterSalesControl,
                meta: {
                    keepAlive: false
                }
            },
            {
                path: 'controlApproveDetail',
                component: controlApproveDetail,
                meta: {
                    keepAlive: false
                }
            }
          ]
        },
        {
          path: 'landingCompany',
          component: index,
          children: [{
              path: 'list',
              component: landingCompanyList,
              meta: {
                keepAlive: false
              }
            },
            {
              path: 'create',
              component: landingCompanyCreate,
              meta: {
                keepAlive: false
              }
            },
            {
                path: 'companyAudit',
                component: companyAudit,
                meta: {
                    keepAlive: false
                }
            },
            {
                path: 'addCompany',
                component: addCompany,
                meta: {
                    keepAlive: false
                }
            },
            {
                path: 'previewCompany',
                component: previewCompany,
                meta: {
                    keepAlive: false
                }
            }
          ]
        }
      ],
    },
    {
      path: '/login',
      component: login
    }
  ]
}]
