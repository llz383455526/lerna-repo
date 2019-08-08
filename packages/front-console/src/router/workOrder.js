const Index = () => import('../pages/public/index.vue')
const InvoiceSheetIndex = () => import( /* webpackChunkName: "workorder" */ '../pages/workOrder/invoiceSheet/Index.vue')
const WagePaymentCreat = () => import( /* webpackChunkName: "workorder" */ '../pages/workOrder/wagePayment/Index.vue')
const WagePaymentConfirm = () => import( /* webpackChunkName: "workorder" */ '../pages/workOrder/wagePayment/ConfirmOrder.vue')
const workOrderIndex = () => import( /* webpackChunkName: "workorder" */ '../pages/workOrder/workOrderIndex')
const DockingApi = () => import( /* webpackChunkName: "workorder" */ '../pages/workOrder/DockingApi')

const router = [{
    path: 'workOrder',
    component: Index,
    children: [
        {
            path: 'invoice_sheet/index',
            component: InvoiceSheetIndex,
            meta: {
                keepAlive: false
            }
        },
        {
            path: 'wage_payment/create',
            component: WagePaymentCreat,
            meta: {
                keepAlive: false
            }
        },
        {
            path: 'wage_payment/confirm',
            component: WagePaymentConfirm,
            meta: {
                keepAlive: false
            }
        },
        {
            path: 'workOrderIndex',
            component: workOrderIndex,
            meta: {
                keepAlive: false
            }
        },
        {
            path: 'DockingApi',
            component: DockingApi,
            meta: {
                keepAlive: false
            }
        }
    ]
}]

export default router