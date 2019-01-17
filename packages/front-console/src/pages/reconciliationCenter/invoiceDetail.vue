<template>

    <div class="main-container" v-loading="isReady">
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="客户公司:"   size="small" prop="customCompanyId">
                <el-select filterable v-model="formSearch.customCompanyId">
                    <el-option v-for="item in customCompanyList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发票类目" size="small" prop="subjectId">
                <el-select v-model="formSearch.subjectId" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in invoiceOptions" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="发票类型" size="small" prop="invoiceType">
                <el-select v-model="formSearch.invoiceType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in searchOptions.InvoiceType" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="销方税号" size="small" prop="serviceComanyTaxIdcd">
                <el-input v-model="formSearch.serviceComanyTaxIdcd"></el-input>
            </el-form-item>

            <el-form-item label="开票时间" size="small">
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        :unlink-panels="true"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
                <el-button size="small" @click="exportFile">导出</el-button>
            </el-form-item>
        </el-form>

        <div class="t_head">已开发票共计：{{companyData.count}}张，金额共计 {{companyData.amount | formatMoney}}元，税额共计 {{companyData.taxRateAmount | formatMoney}}元，价税合计 {{companyData.taxRateTotalAmount | formatMoney}}元</div>

        <div class="table-container">
            <el-table :data="tableList.list">
                <el-table-column prop="contractStartDate" label="开票时间">
                    <template slot-scope="scope">{{scope.row.invoiceDate | formatTime('yyyy-MM-dd')}}</template>
                </el-table-column>
                <el-table-column prop="customCompanyName" label="客户公司"></el-table-column>
                <el-table-column prop="subjectName" label="发票类目"></el-table-column>
                <el-table-column prop="invoiceTypeName" label="发票类型"></el-table-column>
                <el-table-column prop="invoiceCode" label="发票代码"></el-table-column>
                <el-table-column prop="invoiceNo" label="发票号码"></el-table-column>
                <el-table-column prop="serviceCompanyName" label="销方名称"></el-table-column>
                <el-table-column prop="serviceTaxIdcd" label="销方税号"></el-table-column>
                <el-table-column prop="amount" label="金额（元）">
                    <template slot-scope="scope">{{scope.row.amount - scope.row.taxAmount | formatMoney}}</template>
                </el-table-column>
                <el-table-column prop="totalTaxAmount" label="税额（元）">
                    <template slot-scope="scope">{{scope.row.taxAmount | formatMoney}}</template>
                </el-table-column>
				<el-table-column prop="totalTaxAmount" label="价税合计（元）">
                    <template slot-scope="scope">{{scope.row.amount | formatMoney}}</template>
                </el-table-column>
            </el-table>
        </div>

        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange" :currentSize="pageSize"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="pageIndex"></ayg-pagination>

    </div>

</template>

<script>
	import { post, get } from "../../store/api"

	import _ from 'lodash'

	import { showNotify } from '../../plugin/utils-notify'

	import { baseUrl } from '../../config/address'

	import { urlEncode } from '../../plugin/utils-functions'

	export default {
		created() {
			this.getSearchOptions()
			this.getInvoiceOptions()

			this.getList()
			this.getCompanyData()

            this.getCompanyList()
		},
		data() {
			return {
				searchOptions: {},
				formSearch: {
					subjectId: '',
					invoiceType: '',
					serviceComanyTaxIdcd: '',
					customCompanyId: ''
				},
				dateValue: '',
				tableList: [],
				pageSize: 10,
				pageIndex: 1,
				invoiceOptions: {},
				companyData: {},
                customCompanyList: [],
                isReady: true
			}
		},
		methods: {
			getCompanyList() {
				get('/api/sysmgr-web/commom/company', {
					companyIdentity: 'custom'
				}).then(result => {
					this.customCompanyList = result
				})
			},
			getSearchOptions() {
				post('/api/sysmgr-web/commom/options?enumTypes=InvoiceType', {})
					.then(result => {
						this.searchOptions = result
					})
			},
			getInvoiceOptions() {
				post('/api/invoice-web/custom-invoice-subject/qry', {
					name: '',
					pageSize: 0,
					page: 0
				}).then(result => {
					this.invoiceOptions = result.list
				})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields()
				this.dateValue = ''
			},
			search() {
				this.pageIndex = 1
				this.getList()
			},
			handleSizeChange(value) {
				this.pageSize = value
				this.pageIndex = 1
				this.getList()
			},
			handleCurrentChange(value) {
				this.pageIndex = value
				this.getList()
			},
			getList() {
				let startAt = ''
				let endAt = ''
				if (this.dateValue) {
					startAt = this.dateValue[0]
					endAt = this.dateValue[1]
				}

				let formSearch = _.cloneDeep(this.formSearch)
				formSearch.startAt = startAt
				formSearch.endAt = endAt
				let options = _.assign(formSearch, {
					page: this.pageIndex,
					pageSize: this.pageSize
				})

				post('/api/invoice-web/invoice/custom-company-invoice-list', options)
					.then(result => {
                        this.tableList = result
                        this.isReady = false
					})
			},
			exportFile() {
				let startAt = ''
				let endAt = ''
				if (this.dateValue) {
					startAt = this.dateValue[0]
					endAt = this.dateValue[1]
				}

				let formSearch = _.cloneDeep(this.formSearch)
				formSearch.startAt = startAt
				formSearch.endAt = endAt

				window.location.href = `${baseUrl}/api/invoice-web/invoice/export-custom-invoice-details?${urlEncode(formSearch)}`
			},
			getCompanyData() {
				post('/api/invoice-web/invoice/sum-paper-invoice-list', {

				}).then(result => {
					this.companyData = result
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
    .main-container {
        background-color:#fff;
        padding:15px;
    }

    .table-container {
        width: 100%;
        margin-top: 20px;
    }

    .t_head{
        margin: 30px 0;
        font-size: 20px;
        color: #666;
    }
</style>
















