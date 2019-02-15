<template>
    <div class="main-container">
        <div>售前风控报表  （针对企业客户的背景调查及合同草稿审核）</div>
        <el-table class="mt20" :data="[]">
            <el-table-column label="月份"></el-table-column>
            <el-table-column label="服务公司"></el-table-column>
            <el-table-column label="业务申请总量"></el-table-column>
            <el-table-column label="拒绝审批数据"></el-table-column>
            <el-table-column label="A高风险行业用户" :render-header="renderHeader" width="170px"></el-table-column>
            <el-table-column label="B有违法违规记录的用户" :render-header="renderHeader" width="160px"></el-table-column>
            <el-table-column label="C经营范围与申请业务不一致" :render-header="renderHeader" width="180px"></el-table-column>
            <el-table-column label="D申请业务类型与发票类目不一致" :render-header="renderHeader" width="200px"></el-table-column>
            <el-table-column label="E申请业务超出落地公司经营范围或经营资质" :render-header="renderHeader" width="200px"></el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            v-on:handleSizeChange="sizeChange"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            title: {
                4: '高风险行业客户：例如P2P、小微贷、银行催收账款等存在重大合规风险行业的客户',
                5: '有违法违规记录的客户:例如曾被保监会等监管机构处罚的客户',
                6: '经营范围与申请业务不一致：例如经营范围为物流运输，但申请业务为音视频直播等业务严重不符的客户',
                7: '申请业务类型与发票类目不一致：例如申请业务为咨询服务，但实质是提供市场推广业务的客户',
                8: '申请业务超出落地公司经营范围或经营资质：例如申请业务为物流运输，但由于落地公司并无道路运输经营许可证，不能承接该业务'
            },
            form: {
                page: 1,
                pageSize: 10
            },
            tableList: {
                total: 1
            }
        }
    },
    methods: {
        renderHeader(h, data) {
            console.log(data)
            return h("div", [
                h("span", [data.column.label]),
                h("i", {
                        attrs: {
                            'class': 'el-icon-question',
                            'title': this.title[data.$index]
                        }
                    }
                )
            ])
        },
        query() {

        },
        sizeChange() {

        }
    }
}
</script>
<style scoped>
.main-container {
    background-color: #fff;
    padding: 15px;
}
.mt20 {
    margin-top: 20px;
}
</style>
