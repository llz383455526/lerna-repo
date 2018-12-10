import BaseModel from '../base/BaseModel'

class createForm extends BaseModel {
    constructor () {
        super();
        this.appId = ''; // 商户ID
        this.appName = ''; // 商户名称
        this.companyId = ''; // 客户公司ID
        this.companyName = ''; // 客户公司名称
        this.mainAccountName = ''; // 主账户名称
        this.mainAccountNo = ''; // 主账户标识
        this.paymentThirdType = 'pingan'; // 支付渠道
        this.serviceCompanyId = ''; // 服务商ID
        this.serviceCompanyName	= ''; // 服务商名称
        this.fromPaymentUserId = ''; // 转出支付用户账户ID
        this.fromPaymentUserName = ''; // 转出支付用户账户名称
        this.fromPaymentUserNo = ''; // 转出支付用户账户标识
        this.toPaymentUserId = ''; // 转入支付用户账户ID
        this.toPaymentUserName = ''; // 转入支付用户账户名称
        this.toPaymentUserNo = ''; // 转入支付用户账户标识
        this.tradeAmount = ''; // 调账金额
        this.remarks = ''; // 调账备注
    }
}

export default createForm;