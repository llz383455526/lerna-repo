<template>
    <div class="main-container">
        <el-form :model="form" :inline="true" size="small" ref="form">
            <el-form-item label="时间" prop="taxLandingId">
                <el-date-picker
                    v-model="form.time"
                    type="month"
                    placeholder="选择月">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="税优地名称" prop="taxLandingId">
                <el-select v-model="form.taxLandingId" filterable>
                    <el-option v-for="e in landingList" :key="e.id" :label="e.taxLandingName" :value="e.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="落地公司名称" prop="serviceCompanyId">
                <el-select v-model="form.serviceCompanyId" filterable>
                    <el-option v-for="e in companyList" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户名称" prop="customerCompanyId">
                <el-select v-model="form.customerCompanyId" filterable>
                    <el-option v-for="e in customList" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="$refs.form.resetFields()">清除</el-button>
                <!-- <el-button>导出</el-button> -->
            </el-form-item>
        </el-form>
        <el-table :data="listData.list">
            <el-table-column label="税优地名称" prop="taxLandingName"></el-table-column>
            <el-table-column label="落地公司名称" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="客户名称" prop="customerCompanyName"></el-table-column>
            <el-table-column label="期初待开金额">
                <template slot-scope="scope">
                    {{scope.row.periodInitialIssueAmount | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="到款金额">
                <template slot-scope="scope">
                    {{scope.row.payAmount | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="已开金额">
                <template slot-scope="scope">
                    {{scope.row.issuedAmount | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="待开金额">
                <template slot-scope="scope">
                    {{scope.row.issueAmount | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="期末待开金额">
                <template slot-scope="scope">
                    {{scope.row.periodfinalIssueAmount | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="已开票数">
                <template slot-scope="scope">
                    <div>普票：{{scope.row.alreadyPpNum}}</div>
                    <div>专票：{{scope.row.alreadyZpNum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="上个月开票总数" width="120px">
                <template slot-scope="scope">
                    <div>普票：{{scope.row.lastAlreadyPpNum}}</div>
                    <div>专票：{{scope.row.lastAlreadyZpNum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="预计待开票数">
                <template slot-scope="scope">
                    <div>普票：{{scope.row.forecastPpNum}}</div>
                    <div>专票：{{scope.row.forecastZpNum}}</div>
                </template>
            </el-table-column>
            <el-table-column label="销售预计开票总数" width="140px">
                <template slot-scope="scope">
                    <div>普票：{{scope.row.salesForecastPpNum}}</div>
                    <div>专票：{{scope.row.salesForecastZpNum}}</div>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="listData.total"
            :total="listData.total"
            v-on:handleSizeChange="sizeChange"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
        <el-button class="fr" type="primary" size="small" @click="$router.back()">返回</el-button>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
export default {
    data() {
        return {
            form: {
                page: 1,
                pageSize: 10,
                time: '',
                taxLandingId: '',
                serviceCompanyId: '',
                customerCompanyId: ''
            },
            landingList: [],
            companyList: [],
            customList: [],
            listData: {},
        }
    },
    mounted() {
        this.form.time = new Date().getTime()
        get('/api/console-dlv/tax-landing/all-tax-landing').then(data => {
            this.landingList = data
        })
        get('/api/invoice-web/service-company/service-company-options').then(data => {
            this.companyList = data
        })
        get('/api/invoice-web/invoice/custom-company-options').then(data =>{
            this.customList = data
        })
        Object.assign(this.form, this.$route.query)
        this.query()
    },
    methods: {
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post('/api/invoice-web/invoice-monitor/customer-list', this.form).then(data => {
                this.listData = data
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
    overflow: hidden;
}
.fr {
    float: right;
}
</style>
