<template>
    <div class="main-container">
        <el-form :model="form" :inline="true" size="small">
            <el-form-item label="处理状态">
                <el-select v-model="form.state">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="e in approvalList" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="form.state = ''">清除</el-button>
            </el-form-item>
        </el-form>
        <el-table class="mt20" :data="tableList.list">
            <el-table-column label="月份">
                <template slot-scope="scope">
                    {{scope.row.year}}年{{scope.row.month}}月
                </template>
            </el-table-column>
            <el-table-column label="身份证" prop="idCard"></el-table-column>
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="发放金额" prop="salaryAmount"></el-table-column>
            <el-table-column label="客户公司" prop="customCompanyName"></el-table-column>
            <el-table-column label="落地公司" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="税优地" prop="taxLandingName"></el-table-column>
            <el-table-column label="风控规则" prop="riskRuleStr"></el-table-column>
            <el-table-column label="处理状态" prop="stateName"></el-table-column>
            <el-table-column label="操作"></el-table-column>
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
            form: {
                state: '',
                page: 1,
                pageSize: 10
            },
            tableList: {},
            approvalList: []
        }
    },
    mounted() {
        get('/api/console-dlv/option/get-by-types?type=RiskApprovalState').then(data => {
            this.approvalList = data.RiskApprovalState
        })
        this.query()
    },
    methods: {
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post('/api/console-dlv/risk-approval/list', this.form).then(data => {
                this.tableList = data
            })
        },
        sizeChange(a) {
            this.form.pageSize = a
            this.query()
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
