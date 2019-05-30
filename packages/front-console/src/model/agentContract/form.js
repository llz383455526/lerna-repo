
import { get, post } from '../../store/api'
class Form {
    constructor() {
        this.contract = {
            datas: {
                agentCompanyBaseInfo: {
                    "accountName": "string", // 开户名称
                    "accountNo": "string", // 银行账号
                    "address": "string", // 代理商单位地址
                    "agency": "string", // 代理机构
                    "agentType": "string", // 申请主体： channel-渠道， agent-代理商
                    "contactAddr": "string", // 代理商联系人地址
                    "contactName": "string", // 代理商联系人
                    "contactPhone": "string", // 代理商联系人电话
                    "depositBank": "string", // 开户银行
                    "name": "string", // 代理商名称
                    "probation": "string", // 试合作期
                    "registerAddr": "string", // 代理商单位地址
                    "telephone": "string" // 代理商电话
                },
                agentContract: {
                    agentStart: '', // 代理合同结束期限
                    agentEnd: '', // 代理合同开始期限
                    "serviceCompanyFeeContentList": [ // 服务商报价表
                        {
                        "containIncomeAmount": false, // 是否包含分XX万收费金额
                        "incomeAmount": 0, // 分XXX万收费金额
                        "prepayRate": 0, // 渠道预收比例
                        "quoteFeeRate": 0, // 固定结算费率
                        "quoteFeeType": "string", // 结算费率报价类型
                        "quoteRule": "string", // 报价规则
                        "serviceCompanyId": 0, // 服务商ID
                        "serviceCompanyName": "string", // 服务商名称
                        "stepwiseList": [ // 阶梯收费
                            {
                            "endAmount": 0, // 结束金额
                            "equalsEnd": false, // 是否包含上限金额
                            "equalsStart": false, // 是否包含下限金额
                            "percent": 0, // 收费比例
                            "sequence": 0, // 序号
                            "startAmount": 0 // 开始金额
                            }
                        ]
                        }
                    ]
                },
                "contractAttachments": [ // 生成代理商合同的附件
                    {
                        "attachments": [ // 代理商合同的附件
                            {
                                "createByName": "string", // 操作人
                                "createTime": "2019-05-30T09:23:26.247Z", // 操作时间
                                "displayname": "string", // 显示名称
                                "downloadCode": "string", // 下载码
                                "refId": "string", // 附件ID
                                "targetId": 0, // 附件类型ID
                                "targetType": "string", // 附件类型
                                "targetTypeName": "string" // 附件类型名称
                            }
                        ],
                        "serviceCompanyId": 0, // 服务商ID
                        "serviceCompanyName": "string", // 服务商名称
                        "taxLandingId": 0, // 服务商的税优地ID
                        "taxLandingName": "string" // 服务商的税优地名称
                    }
                ],
                "salesInfo": {
                    "email": "string", // 销售联系人邮箱
                    "mobilePhone": "string", // 销售联系人电话
                    "salesAddress": "string", // 销售联系人地址
                    "salesId": 0, // 销售联系人ID
                    "salesName": "string" // 销售联系人
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
            workflowType:'' // 工作流实例类型
        }
    }
    saveChannelInfo() {
        post('/api/opencrm/workflow/save_draft', data).then(res => {

        })
    }
    getChannelDetail(id) {
        get(`/api/opencrm/workflow/details/${id}`).then(res => {
			this.datas = res
		})
    }
}

export default Form