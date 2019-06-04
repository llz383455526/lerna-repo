
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
                    "serviceCompanyFeeContentList": [ // 服务商报价表
                        {
                        "containIncomeAmount": false, // 是否包含分XX万收费金额
                        "incomeAmount": 0, // 分XXX万收费金额
                        // "prepayRate": 0, // 渠道预收比例
                        // "quoteFeeRate": 0, // 固定结算费率
                        "quoteFeeType": "", // 结算费率报价类型(ratio-固定,step-分xxx)
                        // "quoteRule": "", // 报价规则
                        "serviceCompanyId": 0, // 服务商ID
                        "serviceCompanyName": "", // 服务商名称
                        "subType": "", // 费率子类型(ratio - 固定，nonflow-无流水，flow-按流水)
                        "feeContentMap":  {
                            // 固定费率
                            "no": [
                                {
                                    "endAmount": null, // 结束金额，null表示无穷大
                                    "equalsEnd": false, // 是否包含上限金额
                                    "equalsStart": false, // 是否包含下限金额
                                    "percent": 0, // 收费比例
                                    "sequence": 0, // 序号
                                    "startAmount": 0 // 开始金额
                                }
                            ],
                            // 分xxx的下限
                            "down": [
                                {
                                    "endAmount": null, // 结束金额
                                    "equalsEnd": false, // 是否包含上限金额
                                    "equalsStart": false, // 是否包含下限金额
                                    "percent": 0, // 收费比例
                                    "sequence": 0, // 序号
                                    "startAmount": 0 // 开始金额
                                }
                            ],
                            // 分xxx的上限
                            "up": [
                                {
                                    "endAmount": null, // 结束金额
                                    "equalsEnd": false, // 是否包含上限金额
                                    "equalsStart": false, // 是否包含下限金额
                                    "percent": 0, // 收费比例
                                    "sequence": 0, // 序号
                                    "startAmount": 0 // 开始金额
                                }
                            ]
                        }
                        }
                    ]
                },
                "contractAttachments": [ // 生成代理商合同的附件
                    {
                        "attachments": [ // 代理商合同的附件
                            {
                                "createByName": "", // 操作人
                                "createTime": "2019-05-30T09:23:26.247Z", // 操作时间
                                "displayname": "", // 显示名称
                                "downloadCode": "", // 下载码
                                "refId": "", // 附件ID
                                "targetId": 0, // 附件类型ID
                                "targetType": "", // 附件类型
                                "targetTypeName": "" // 附件类型名称
                            }
                        ],
                        "serviceCompanyId": 0, // 服务商ID
                        "serviceCompanyName": "", // 服务商名称
                        "taxLandingId": 0, // 服务商的税优地ID
                        "taxLandingName": "" // 服务商的税优地名称
                    }
                ],
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
            workflowType:'' // 工作流实例类型
        }
        this.workflowType = {
            agent: ['create_agent_sale_contract', 'create_agent_ns_sale_contract'],
            channel: ['create_channel_sale_contract', 'create_channel_ns_sale_contract']
        }
    }
    saveChannelInfo() {
        post('/api/opencrm/workflow/save_draft', this.contract).then(res => {
            
        })
    }
    getChannelDetail(id) {
        get(`/api/opencrm/workflow/details/${id}`).then(res => {
			this.contract = res
		})
    }
}

export default Form