const invoiceApi = {
    getInvoiceTypeList: '/api/invoice-web/commom/option?enumType=InvoiceType', // 获取发票类型
    // getInvoiceCategory: '/api/invoice-web/custom-invoice-subject/qry',
    getInvoiceCategory: '/api/contract-web/commom/companyInvoiceOption', // 获取发票类目
    customerDetail: '/api/invoice-web/custom-company/detail/current', // 获取客户信息
    serviceDetail: '/api/invoice-web/service-company/detail', // 获取服务公司信息
    editCustomerInfo: '/api/invoice-web/custom-company/save-update', // 编辑客户公司信息
    addInvoice: '/api/invoice-web/workflow/invoice-add', // 创建发票
    getServiceCompany: '/api/invoice-web/commom/service-company-options', // 获取服务公司列表
    getCustomCompanyByServiceId: '/api/invoice-web/invoice/custom-company-by-serviceId',
    getCustomCompany: '/api/invoice-web/invoice/custom-company-options',
    getTicketSurplus: '/api/invoice-web/workflow/service-company-ticket-surplus',
    getApplyInfo: '/api/invoice-web/workflow/get-apply-info',
    approveSubmit: '/api/invoice-web/workflow/invoice-approve-submit',
    openPaperInvoice: '/api/invoice-web/workflow/open-paper-invoice',
    uploadExt: '/api/invoice-web/file/upload-ext',
    workflowExpress: '/api/invoice-web/workflow/express',
    invoiceCancel: '/api/invoice-web/workflow/invoice-cancel',
    invoiceHangup: '/api/invoice-web/workflow/invoice-hangup',
    invoiceException: '/api/invoice-web/workflow/invoice-exception',
    download: '/api/invoice-web/file/download',
    preview: '/api/invoice-web/file/preview',
    customCompanyOptions: '/api/invoice-web/invoice/custom-company-options',
    serviceCompanyOptions: '/api/invoice-web/invoice/service-company-options'
}

export {invoiceApi}