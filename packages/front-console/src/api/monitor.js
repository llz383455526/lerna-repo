const monitor = {
    // 企业监控
    // getParentCategoryCount: '/getParentCategoryCountNum',
    // getConcernCompanyCount: '/getConcernCompanyCountNum',
    // getConcernCompanyList: '/findConcernCompanyChangePage',
    // getChangeNoticeList: '/findChangeNoticePage',
    // 批量导入监控公司
    monitorCompanyAddFromExl: '/api/airisk/monitor_company_add_from_exl',
    // 查询导入监控公司结果
    getMonitorCompanyInsert: '/api/airisk/load_insert_companies_batch',
    // 批量导入确定提交
    submitMonitorCompanyInsert: '/api/airisk/monitor_company_insert_batch',
    // 导入数据单条数据操作
    monitorCompanyInsertItemOperation: '/api/airisk/monitor_company_tmp_oper',
    // 关注企业列表操作
    monitorCompanyOperation: '/api/airisk/monitor_company_operation',
    // 监控维度获取
    getCompanyDimension: '/api/airisk/get_company_dimension',
    // 定时任务/维度设置
    jobTaskRuleOperation: '/api/airisk/job_task_rule_operation',
    // 一周事件统计
    resentEventCount: '/api/airisk/resent_event_count',
    // 事件统计列表
    EventCountByCriteria: '/api/airisk/event_count_by_criteria',
    // 事件详情列表
    EventDetailByCriteria: '/api/airisk/event_detail_by_criteria',
    // 事件已读状态修改
    EventStatusOperation: '/api/airisk/event_status_operation',






    // 企业黑名单
    // 单个添加黑名单
    addCompanyBlack: '/api/risk-mgt-service/company-black/add-company-black',
    getCompanyBlacklist: '/api/risk-mgt-service/company-black/company-black-list',
    exportCompanyBlacklist: '/api/risk-mgt-service/company-black/export-company-black-list',
    deleteCompanyBlack: '/api/risk-mgt-service/company-black/delete-company-black', // 删除企业黑名单
    deleteCompanyBlackImportItem: '/api/risk-mgt-service/company-black/delete-company-black-import-item',
    // 编辑企业黑名单导入条目
    updateCompanyBlackImportItem: '/api/risk-mgt-service/company-black/update-company-black-import-item',
    downloadCompanyBlackImportTemplate: '/api/risk-mgt-service/company-black/download-company-black-import-template',
    submitCompanyBlackImport: '/api/risk-mgt-service/company-black/submit-company-black-import',
    getCompanyBlackImportList: '/api/risk-mgt-service/company-black/get-company-black-import-list',

    // 个人风控
    // 获取个人黑名单列表
    getPersonBlackList: '/api/risk-mgt-service/person-risk/get-person-black-list',
    // 导出个人黑名单列表
    exportPersonBlackList: '/api/risk-mgt-service/person-risk/export-person-black-list',
    // 修改个人黑名单状态
    updatePersonBlackEnable: '/api/risk-mgt-service/person-risk/update-person-black-enable',
    // 删除个人黑名单
    deletePersonBlack: '/api/risk-mgt-service/person-risk/delete-person-black',
    // 下载个人黑名单导入模版
    downloadPersonBlackImportTemplate: '/api/risk-mgt-service/person-risk/download-person-black-import-template',
    // 查看个人黑名单导入列表
    getPersonBlackimportList: '/api/risk-mgt-service/person-risk/get-person-black-import-list',
    // 编辑
    updatePersonBlackImportItem: '/api/risk-mgt-service/person-risk/update-person-black-import-item',
    // 删除
    deletePersonBlackImportItem: '/api/risk-mgt-service/person-risk/delete-person-black-import-item',
    // 确认
    submitPersonBlackImport: '/api/risk-mgt-service/person-risk/submit-person-black-import',

    getPersonWhiteList: '/api/risk-mgt-service/person-risk/get-person-white-list',
    getPersonWhiteDetail: '/api/risk-mgt-service/person-risk/get-person-white-detail',
    exportPersonWhiteList: '/api/risk-mgt-service/person-risk/export-person-white-list',
    // 审核个人白名单
    approvePersonWhite: '/api/risk-mgt-service/person-risk/approve-person-white',
    deletePersonWhite: '/api/risk-mgt-service/person-risk/delete-person-white',
    downloadPersonWhiteImportTemplate: '/api/risk-mgt-service/person-risk/download-person-white-import-template',
    getPersonWhiteImportList: '/api/risk-mgt-service/person-risk/get-person-white-import-list',
    deletePersonWhiteImportItem: '/api/risk-mgt-service/person-risk/delete-person-white-import-item',
    submitPersonWhiteImport: '/api/risk-mgt-service/person-risk/submit-person-white-import',
    updatePersonWhiteImportItem: '/api/risk-mgt-service/person-risk/update-person-white-import-item',
    updatePersonWhiteImportIdcard: '/api/risk-mgt-service/person-risk/upload-person-white-import-idcard',
    // 删除个人白名单导入文件
    deletePersonWhiteFileImportItem: '/api/risk-mgt-service/person-risk/delete-person-white-file-import-item',

    // 个人风控导入提交
    submitPersonRiskImport: '/api/risk-mgt-service/person-risk/submit-person-risk-import',

    // 下拉框枚举值获取
    optionList: '/api/risk-mgt-service/option/get-by-type',

}

export {monitor}