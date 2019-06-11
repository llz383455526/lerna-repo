
import { get, post } from '../../store/api'
class Form {
    constructor() {
        this.serviceCompanyFeeContent =  {
            'agentStart': '', // 代理合同结束期限
            'agentEnd': '', // 代理合同开始期限
            "containIncomeAmount": false, // 是否包含分XX万收费金额
            "incomeAmount": 2.8, // 分XXX万收费金额
            // "prepayRate": 0, // 渠道预收比例
            // "quoteFeeRate": 0, // 固定结算费率
            "quoteFeeType": "", // 结算费率报价类型(ratio-固定,step-分xxx)
            // "quoteRule": "", // 报价规则
            "serviceCompanyId": 0, // 服务商ID
            "serviceCompanyName": "", // 服务商名称
            "subType": "flow", // 费率子类型(ratio - 固定，nonflow-无流水，flow-按流水)
            "feeContentMap":  {
                // 固定费率
                // "no": [
                //     {
                //         "endAmount": null, // 结束金额，null表示无穷大
                //         "equalsEnd": false, // 是否包含上限金额
                //         "equalsStart": false, // 是否包含下限金额
                //         "percent": '', // 收费比例
                //         "sequence": 0, // 序号
                //         "startAmount": 0 // 开始金额
                //     }
                // ],
                // 分xxx的下限
                "down": [
                    {
                        "endAmount": null, // 结束金额
                        "equalsEnd": true, // 是否包含上限金额
                        "equalsStart": false, // 是否包含下限金额
                        "percent": null, // 收费比例
                        "sequence": 0, // 序号
                        "startAmount": null // 开始金额
                    },
                    {
                        "endAmount": null, // 结束金额
                        "equalsEnd": true, // 是否包含上限金额
                        "equalsStart": false, // 是否包含下限金额
                        "percent": 0, // 收费比例
                        "sequence": 1, // 序号
                        "startAmount": 0 // 开始金额
                    },
                    {
                        "endAmount": null, // 结束金额
                        "equalsEnd": true, // 是否包含上限金额
                        "equalsStart": false, // 是否包含下限金额
                        "percent": 0, // 收费比例
                        "sequence": 2, // 序号
                        "startAmount": 0 // 开始金额
                    }
                ],
                // 分xxx的上限
                "up": [
                    {
                        "endAmount": null, // 结束金额
                        "equalsEnd": false, // 是否包含上限金额
                        "equalsStart": false, // 是否包含下限金额
                        "percent": null, // 收费比例
                        "sequence": 0, // 序号
                        "startAmount": null // 开始金额
                    },
                ]
            }
        }
    }
}

export default Form