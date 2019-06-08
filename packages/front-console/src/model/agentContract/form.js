
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
                    "telephone": "", // 代理商电话
                    "id": "" // 已有代理商
                },
                agentContract: {
                    agentStart: '', // 代理合同结束期限
                    agentEnd: '', // 代理合同开始期限
                    versionStartDate: '', // 版本生效时间
                    "serviceCompanyFeeContentList": []
                },
                "contractAttachments": [ // 生成代理商合同的附件
                    // {
                    //     "attachments": [ // 代理商合同的附件
                    //         {
                    //             "createByName": "", // 操作人
                    //             "createTime": "2019-05-30T09:23:26.247Z", // 操作时间
                    //             "displayname": "", // 显示名称
                    //             "downloadCode": "", // 下载码
                    //             "refId": "", // 附件ID
                    //             "targetId": 0, // 附件类型ID
                    //             "targetType": "", // 附件类型
                    //             "targetTypeName": "" // 附件类型名称
                    //         }
                    //     ],
                    //     "serviceCompanyId": 0, // 服务商ID
                    //     "serviceCompanyName": "", // 服务商名称
                    //     "taxLandingId": 0, // 服务商的税优地ID
                    //     "taxLandingName": "" // 服务商的税优地名称
                    // }
                ],
                flowMemo: '', // 变更版本说明
                "salesInfo": {
                    "email": "", // 销售联系人邮箱
                    "mobilePhone": "", // 销售联系人电话
                    "salesAddress": "", // 销售联系人地址
                    "salesId": 0, // 销售联系人ID
                    "salesName": "" // 销售联系人
                },
                tplId: '', // 合同模版ID
                tplName: '' // 合同模版名称
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
            workflowType:'', // 工作流实例类型
            actions: [], // 好像是审核的权限
            // workflowType:'', // 工作流实例类型
            standardEnum: '1', // 标准类型：1标准，2非标
            operateEnum: '', // 操作类型：1创建，2补签，3更新
            subjectType: '', // 申请主体类型：customer，agent，channel，oem'
        }
        this.workflowType = {
            agent: ['create_agent_sale_contract', 'create_agent_ns_sale_contract'],
            channel: ['create_channel_sale_contract', 'create_channel_ns_sale_contract']
        }
        // 申请主体
        this.agentTypes = [
            {
                value: 'channel,agent',
                label: '全部'
            },
            {
                value: 'channel',
                label: '渠道'
            },
            {
                value: 'agent',
                label: '代理商'
            }
        ]
        // 申请类型
        this.operateEnum = [
            {
                value: '',
                label: '全部'
            },
            {
                value: '1',
                label: '新增'
            },
            {
                value: '2',
                label: '补签'
            },
            {
                value: '3',
                label: '变更'
            }
        ]
        // 合同类型
        this.standardEnum = [
            {
                value: '',
                label: '全部'
            },
            {
                value: '1',
                label: '标准合同'
            },
            {
                value: '2',
                label: '非标合同'
            }
        ]
    }
    saveDraft() {
        return post('/api/opencrm/workflow/save_draft', this.contract).then(res => {
            // this.contract.instanceId = res.instanceId
        })
    }
    getDetail(id) {
        return get(`/api/opencrm/workflow/details/${id}`).then(res => {
			this.contract = res
		})
    }
    deleteContract(id) {
        return post('/api/opencrm/workflow/delete', {id: id})
    }
    submit() {
        return post('/api/contract-web/agent-residence-flow/agent-residence-submit', this.contract)
    }
    submitForm () {
        return post('/api/opencrm/workflow/save_submit', this.contract)
    }
}

export default Form