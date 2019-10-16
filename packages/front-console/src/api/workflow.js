const workflow = {
    getWorkflowTypeList: '/api/taxplan-workflow/flowable/define/typeList',
    getRuntimeTaskTypeList: '/api/taxplan-workflow/runtimeTask/typeList',
    getRuntimeTaskPageList: '/api/taxplan-workflow/runtimeTask/pageList',
    getTaskCountNum: '/api/taxplan-workflow/taskCommon/taskCountNum',
    getBizProcessPageList: '/api/taxplan-workflow/bizProcess/pageList',
    getBizProcessTypeList: '/api/taxplan-workflow/bizProcess/typeList',
    getProcessAllProgress: '/api/taxplan-workflow/bizProcess/processAllProgress',
    getProcessCurrentProgress: '/api/taxplan-workflow/bizProcess/processCurrentProgress',
    getProcessAllProgressByTypeKey: '/api/taxplan-workflow/bizProcess/processAllProgressByTypeKey',
    getCreateInvoiceProcess: '/api/taxplan-workflow/bizProcess/processAllProgressByTypeKey',
    getAboutMePageList: '/api/taxplan-workflow/bizProcess/aboutMePageList',
    getAboutMeTypeList: '/api/taxplan-workflow/bizProcess/aboutMeTypeList',
    getCreateByMePageList: '/api/taxplan-workflow/bizProcess/createByMePageList',
    getCreateByMeTaskTypeList: '/api/taxplan-workflow/bizProcess/createByMeTaskTypeList',
    taskEndFlag: '/api/taxplan-workflow/historyTask/taskEndFlag',
    runtimeTaskExportList: '/api/taxplan-workflow/runtimeTask/exportList',
	bizProcessExportList: '/api/taxplan-workflow/bizProcess/exportList',
	bizProcessExportListByAboutMe: '/api/taxplan-workflow/bizProcess/exportListByAboutMe',
    bizProcessExportListByCreateMe: '/api/taxplan-workflow/bizProcess/exportListByCreateMe',
    getReadTaskPageList: '/api/taxplan-workflow/bizNoticeInfo/readTaskPageList',
    batchUpdateReadStatus: '/api/taxplan-workflow/bizNoticeInfo/batchUpdateReadStatus',
    mappingList: '/api/taxplan-workflow/bizStatusMapping/mappingList',
    queryInstanceId: '/api/taxplan-workflow/flowable/operate/query-instance-id',
    getBizExtendData: '/api/taxplan-workflow/bizProcess/get-biz-extend-data',
    getTaskId: '/api/taxplan-workflow/bizProcess/instanceDetail', // 获取工单的taskId
    addRiskWorkflow: '/api/risk-mgt-service/compliance-risk/add-compliance-risk-report', // 添加合规通工单
    getRiskWorkflow: '/api/risk-mgt-service/compliance-risk/get-compliance-risk-report-by-id', // 获取工单详情
    delRiskReport: '/api/risk-mgt-service/compliance-risk/delete-compliance-risk-report-attachment', // 删除报告
    delRiskPluginReport: '/api/risk-mgt-service/compliance-risk/delete-compliance-risk-report-ext-file', // 删除合规通附件
    getCustomerList: '/api/sysmgr-web/commom/company?companyIdentity=custom', // 模糊匹配客户名称
    getContractList: '/api/opencrm/common/custom-company-instance-list', // 查找客户合同编号
    editRiskWorkflow: '/api/risk-mgt-service/compliance-risk/update-compliance-risk-report', // 重新编辑合规通报告
    getUploadNo: '/api/risk-mgt-service/compliance-risk/get-compliance-risk-report-no', // 获取预设的上传编号
    approveRiskWorkflow: '/api/risk-mgt-service/compliance-risk/consent-approval', // 审核通过
    rejectRiskWorkflow: '/api/risk-mgt-service/compliance-risk/reject-approval', // 驳回
}

export { workflow }