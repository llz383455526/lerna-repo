const prefix = '/api/company-tag-web'
const tags = {
    tagCreate: `${prefix}/tag-lib/create`, // 创建标签或标签组
    tagUpdate: `${prefix}/tag-lib/update`, // 更新标签或标签组
    tagDetail: `${prefix}/tag-lib/detail`, // 标签详情
    tagsTree: `${prefix}/tag-lib/tag-tree`, // 标签树形结构
    tagsQuery: `${prefix}/tag-lib/query-tags`, // 标签组分页查询
    tagsDisplay: `${prefix}/tag-lib/setting-display-list`, // 隐藏或显示标签
    tagsLibOptions: `${prefix}/tag-lib/tag-lib-options`, // 标签下拉列表
    tagsCustom: `${prefix}/company-tag/custom-tags`, // 客户公司标签分页查询
    tagsChannel: `${prefix}/company-tag/channel-tags`, // 渠道公司标签分页查询
    tagsServiceuery: `${prefix}/company-tag/service-tags`, // 服务商公司标签分页查询
    tagsCompanyBind: `${prefix}/company-tag/company-bind-tags`, // 企业绑定标签
    tagsCompanyRemove: `${prefix}/company-tag/company-remove-tags`, // 企业解绑标签
    tagsCompanyUpdate: `${prefix}/company-tag/company-update-tags`, // 企业更新标签
}

export { tags }