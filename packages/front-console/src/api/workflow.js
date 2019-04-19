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
    taskEndFlag: '/api/taxplan-workflow/historyTask/taskEndFlag'
}

export {workflow}