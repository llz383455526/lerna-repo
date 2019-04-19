const invoiceApi = {
    getInvoiceTypeList: '/api/invoice-web/commom/option?enumType=InvoiceType',
    // getInvoiceCategory: '/api/invoice-web/custom-invoice-subject/qry',
    getInvoiceCategory: '/api/contract-web/commom/companyInvoiceOption',
    customerDetail: '/api/invoice-web/custom-company/detail/current',
    serviceDetail: '/api/invoice-web/service-company/detail',
    editCustomerInfo: '/api/invoice-web/custom-company/save-update',
    addInvoice: '/api/invoice-web/workflow/invoice-add',
    getServiceCompany: '/api/invoice-web/commom/service-company-options',
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