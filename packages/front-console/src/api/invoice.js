const invoiceApi = {
    getInvoiceTypeList: "/api/invoice-web/commom/option?enumType=InvoiceType", // 获取发票类型
    // getInvoiceCategory: '/api/invoice-web/custom-invoice-subject/qry',
    getInvoiceCategory: "/api/contract-web/commom/companyInvoiceOption", // 获取发票类目
    customerDetail: "/api/invoice-web/custom-company/detail/current", // 获取客户信息
    subcontractCustomerDetail:
        "/api/invoice-web/service-company/detail/current", // 转包时查询的客户信息
    serviceDetail: "/api/invoice-web/service-company/detail", // 获取服务公司信息
    editCustomerInfo: "/api/invoice-web/custom-company/save-update", // 编辑客户公司信息
    editSubcontractCustomerInfo:
        "/api/invoice-web/service-company/update-service-company-info", // 转包时编辑的客户信息
    addInvoice: "/api/invoice-web/workflow/invoice-add", // 创建发票
    getServiceCompany: "/api/invoice-web/commom/service-company-options", // 获取服务公司列表
    getCustomCompanyByServiceId:
        "/api/invoice-web/invoice/custom-company-by-serviceId",
    getCustomCompany: "/api/invoice-web/invoice/custom-company-options",
    getTicketSurplus:
        "/api/invoice-web/workflow/service-company-ticket-surplus",
    getApplyInfo: "/api/invoice-web/workflow/get-apply-info",
    approveSubmit: "/api/invoice-web/workflow/invoice-approve-submit",
    approveOutSubmit: "/api/invoice-web/workflow//invoice-approve-out-submit", // 非众包工作流审核通过
    openPaperInvoice: "/api/invoice-web/workflow/open-paper-invoice",
    uploadExt: "/api/invoice-web/file/upload-ext",
    workflowExpress: "/api/invoice-web/workflow/express",
    invoiceCancel: "/api/invoice-web/workflow/invoice-cancel",
    invoiceHangup: "/api/invoice-web/workflow/invoice-hangup",
    invoiceException: "/api/invoice-web/workflow/invoice-exception",
    download: "/api/invoice-web/file/download",
    preview: "/api/invoice-web/file/preview",
    customCompanyOptions: "/api/invoice-web/invoice/custom-company-options",
    serviceCompanyOptions: "/api/invoice-web/invoice/service-company-options",
    queryCompanyContract: "/api/contract-web/commom/check-contract", // APP查询公司合同信息
    canMakeInvoice: '/workflow/risk-info', // 查询是否符合风控规则
};

export { invoiceApi };
