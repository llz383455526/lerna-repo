<template>
    <div class="main-container">
        <div>售前风控报表  （针对企业客户的背景调查及合同草稿审核）</div>
        <el-form class="mt20" :model="form" :inline="true" size="small">
            <el-form-item label="服务商">
                <el-input v-model="form.serviceCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="月份">
                <el-date-picker
                    v-model="form.monthStart"
                    type="month"
                    value-format="yyyy-MM-dd"
                    placeholder="开始月">
                </el-date-picker>
                -
                <el-date-picker
                    v-model="form.monthEnd"
                    type="month"
                    value-format="yyyy-MM-dd"
                    placeholder="结束月">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="clear">清空</el-button>
            </el-form-item>
        </el-form>
        <el-table class="mt20" :data="tableList.list">
            <el-table-column label="月份">
                <template slot-scope="scope">
                    {{scope.row.generateMonth | formatTime('yyyy年MM月') }}
                </template>
            </el-table-column>
            <el-table-column label="服务公司" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="业务申请总量" prop="totalCount"></el-table-column>
            <el-table-column label="拒绝审批数据" prop="rejectCount"></el-table-column>
            <el-table-column label="A高风险行业用户" prop="rejectA" :render-header="renderHeader" width="170px"></el-table-column>
            <el-table-column label="B有违法违规记录的用户" prop="rejectB" :render-header="renderHeader" width="160px"></el-table-column>
            <el-table-column label="C经营范围与申请业务不一致" prop="rejectC" :render-header="renderHeader" width="180px"></el-table-column>
            <el-table-column label="D申请业务类型与发票类目不一致" prop="rejectD" :render-header="renderHeader" width="200px"></el-table-column>
            <el-table-column label="E申请业务超出落地公司经营范围或经营资质" prop="rejectE" :render-header="renderHeader" width="200px"></el-table-column>
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
import {get, post} from '../../store/api'
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
                serviceCompanyName: '',
                monthStart: '',
                monthEnd: '',
                page: 1,
                pageSize: 10
            },
            tableList: {}
        }
    },
    mounted() {
        this.query()
    },
    methods: {
        renderHeader(h, data) {
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
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post('/api/contract-web/risk-statistics/contract-approve-statistics', this.form).then(data => {
                this.tableList = data
            })
        },
        sizeChange(a) {
            this.form.pageSize = a
            this.query()
        },
        clear() {
            Object.assign(this.form, {
                serviceCompanyName: '',
                monthStart: '',
                monthEnd: ''
            })
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
