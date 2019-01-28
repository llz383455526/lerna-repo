import BaseModel from '../base/BaseModel'

class withdrawForm extends BaseModel {
    constructor () {
        super();
        this.paymentThirdType = 'pingan'; // 支付渠道
        this.serviceCompanyId = ''; // 服务商ID
        this.serviceCompanyName	= ''; // 服务商名称
        this.tradeAmount = ''; // 调账金额
        this.remarks = ''; // 调账备注
        this.toAccountName = ''; // 转入账户名称
        this.toAccountNo = ''; // 转入账户
        this.toDepositBank = ''; // 转入账户支行名称

    }
}

export default withdrawForm;