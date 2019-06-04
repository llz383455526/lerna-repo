
// 这份数据里面有一些用不上，但是为了数据完整，可供参考
import { get, post } from '../../store/api'
class Form {
    constructor() {
        this.contract = {
            datas: {
                agentCompanyBaseInfo: {
                    "accountName": "", // 开户名称
                    "accountNo": "", // 银行账号
                    "taxIdcd": "", // 税号
                    "agency": "", // 代理机构
                    "agentType": "", // 申请主体： channel-渠道， agent-代理商
                    "contactAddr": "", // 代理商联系人地址
                    "contactName": "", // 代理商联系人
                    "contactPhone": "", // 代理商联系人电话
                    "depositBank": "", // 开户银行
                    "name": "", // 代理商名称
                    "probation": "", // 试合作期
                    "registerAddr": "", // 代理商单位地址
                    "telephone": "" // 代理商电话
                },
                agentContract: {
                    agentStart: '', // 代理合同结束期限
                    agentEnd: '', // 代理合同开始期限
                    serviceCompanyFeeContentList: [] // 落地公司
                },
                "salesInfo": {
                    "email": "", // 销售联系人邮箱
                    "mobilePhone": "", // 销售联系人电话
                    "salesAddress": "", // 销售联系人地址
                    "salesId": 0, // 销售联系人ID
                    "salesName": "" // 销售联系人
                },
                tplId: '' // 合同模版ID
            },
            instanceId: '', // 工作流实例ID
            /**
             * 代理商流程：
             *   create_agent_sale_contract    标准
             *   create_agent_ns_sale_contract   非标
             *   渠道：
             *   create_channel_sale_contract   标准
             *   create_channel_ns_sale_contract   非标
             */
            // workflowType:'', // 工作流实例类型
            standardEnum: '', // 标准类型：1标准，2非标
            operateEnum: '', // 操作类型：1创建，2补签，3更新
            subjectType: '', // 申请主体类型：customer，agent，channel，oem'

        }
        this.workflowType = {
            agent: ['create_agent_sale_contract', 'create_agent_ns_sale_contract'],
            channel: ['create_channel_sale_contract', 'create_channel_ns_sale_contract']
        }
    }
    saveChannelInfo() {
        return post('/api/opencrm/workflow/save_draft', this.contract).then(res => {
            // console.log('res',res)
            this.contract.instanceId = res.id
        })
    }
    getChannelDetail(id) {
        get(`/api/opencrm/workflow/details/${id}`).then(res => {
			this.contract = res
		})
    }
}

export default Form