const balance = {
    puzzlCustomerApply: '/api/balance-web/puzzle-customer/puzzlCustomerApply', // 客户退款申请创建
    puzzlServiceApply: '/api/balance-web/puzzle-service/puzzlServiceApply', //服务费回款申请
    puzzlServiceInfo: '/api/balance-web/puzzle-service/puzzlServiceInfo', // 服务费回款明细
    puzzlServiceApprove: '/api/balance-web/puzzle-service/puzzlServiceApprove', // 服务费回款审核
    puzzlCustomerInfo: '/api/balance-web/puzzle-customer/puzzlCustomerInfo', // 客户退款申请详情
	puzzlCustomerApprove: '/api/balance-web/puzzle-customer/puzzlCustomerApprove', // 客户退款申请审核
	puzzlCustomerPrepareDoc: '/api/balance-web/puzzle-customer/puzzlCustomerPrepareDoc', // 客户退款申请制单
    puzzlCustomerFinanceAudit: '/api/balance-web/puzzle-customer/puzzlCustomerFinanceAudit', // 客户退款申请财务审核
    puzzlChannelApply: '/api/balance-web/puzzle-channel/puzzlChannelApply', // 渠道调账疑难工单申请
    puzzlChannelInfo: '/api/balance-web/puzzle-channel/puzzlChannelInfo', // 渠道调账明细
    puzzlChannelApprove: '/api/balance-web/puzzle-channel/puzzlChannelApprove', // 渠道调账审核
    puzzlChannelPrepareDoc: '/api/balance-web/puzzle-channel/puzzlChannelPrepareDoc', // 渠道调账制单
    puzzlChannelFinanceAudit: '/api/balance-web/puzzle-channel/puzzlChannelFinanceAudit', // 渠道调账财务审核  
	puzzlMercahntApply: '/api/balance-web/puzzle-merchant/puzzlMercahntApply', // 商户间余额调账申请
	puzzlMerchantInfo: '/api/balance-web/puzzle-merchant/puzzlMerchantInfo', // 商户间余额调账详情
    puzzlMerchantBaseInfo: '/api/balance-web/puzzle-merchant/puzzlMerchantBaseInfo', // 商户间余额调账获取可切换渠道
    puzzlMerchantApprove: '/api/balance-web/puzzle-merchant/puzzlMerchantApprove', // 商户间余额调账审核
    puzzlOthersApply: '/api/balance-web/puzzle-others/puzzlOthersApply', // 其它工单申请
    puzzlOthersApprove: '/api/balance-web/puzzle-others/puzzlOthersApprove', // 其它工单审核
    puzzlOthersInfo: '/api/balance-web/puzzle-others/puzzlOthersInfo', // 其它工单明细
    puzzlOthersReview: '/api/balance-web/puzzle-others/puzzlOthersReview', // 其它工单复核,
    queryChannelPayUserBalance: '/api/balance-web/balance-account/query-channel-pay-user-balance' // 查询用户余额
}

export {balance}