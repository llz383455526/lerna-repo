export const risk = {
  invoiceRiskAdd: '/api/risk-mgt-service/invoice-risk-info/add-switch', // 发票开关添加
  getInvoiceRiskDetail: '/api/risk-mgt-service/invoice-risk-info/get-invoice-risk-switch-detail', // 获取发票开关详情说明
  getServiceCompany: '/api/risk-mgt-service/invoice-risk-info/query-service-company-by-customer-company-id', // 根据客户公司ID获取服务公司
  invoiceRiskList: '/api/risk-mgt-service/invoice-risk-info/switch-list', // 发票开关列表获取
  invoiceRiskSwitch: '/api/risk-mgt-service/invoice-risk-info/update-switch', // 发票开关更新操作
  getCustomerBusinessRisk: '/api/risk-mgt-service/company-business-risk/get-customer-business-risk', // 获取客户公司业务风控配置
  addCustomerBusinessConfig: '/api/risk-mgt-service/company-business-risk/add-customer-business-config', // 添加客户公司业务风控配置
}