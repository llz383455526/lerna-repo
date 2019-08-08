const Index = () => import('../pages/public/index.vue')
const newContractCreate = () => import('../pages/newContract/create') // 销售合同创建
const newContractCreateAdd = () => import('../pages/newContract/create_add')  // 销售合同补签
const newContractCreateUpdate = () => import('../pages/newContract/create_update')  // 销售合同修改
const newContractCreateChange = () => import('../pages/newContract/create_change')  // 销售合同变更
const newContractList = () => import('../pages/newContract/list')
const newContractDetail = () => import('../pages/newContract/detail')
const newContractPreview = () => import('../pages/newContract/preview')
const newContractListComplated = () => import('../pages/newContract/list_complated')
const newContractRisk = () => import('../pages/newContract/risk')

const router = {
    path: 'newContract',
    component: Index,
    children: [
        {
            path: 'create',
            component: newContractCreate,
            meta: {
                keepAlive: false
            }
        },
        {
            path: 'create_add',
            component: newContractCreateAdd,
            meta: {
                keepAlive: false,
            },
        },
        {
            path: 'create_update',
            component: newContractCreateUpdate,
            meta: {
                keepAlive: false,
            },
        },
        {
            path: 'create_change',
            component: newContractCreateChange,
            meta: {
                keepAlive: false,
            },
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
        },
        {
            path: 'risk',
            component: newContractRisk,
            meta: {
                keepAlive: false
            }
        }
    ]
}

export default router