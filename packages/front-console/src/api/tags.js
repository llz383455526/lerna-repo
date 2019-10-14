const prefix = '/api/company-tag-web'
const tags = {
    tagCreate: `${prefix}/tag-lib/create`, // 创建标签或标签组
    tagUpdate: `${prefix}/tag-lib/update`, // 更新标签或标签组
    tagsTree: `${prefix}/tag-lib/tag-tree`, // 标签树形结构
    tagsQuery: `${prefix}/tag-lib/query-tags`, // 标签组分页查询
    tagsCustom: `${prefix}/company-tag/custom-tags`, // 客户公司标签分页查询
    tagsChannel: `${prefix}/company-tag/channel-tags`, // 渠道公司标签分页查询
    tagsServiceuery: `${prefix}/company-tag/service-tags`, // 服务商公司标签分页查询
}

export { tags }