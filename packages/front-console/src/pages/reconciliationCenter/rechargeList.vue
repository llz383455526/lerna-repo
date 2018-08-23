<template>

    <div class="main-container">
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="客户公司:"   size="small" prop="companyId">
                <el-select filterable v-model="companyId" @change="getClient">
                    <el-option v-for="item in customCompanyList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接入应用" size="small" prop="appId">
                <el-select v-model="formSearch.appId" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in extrSystemOptions" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发起时间" size="small">
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
        <div class="table-container">
            <el-table :data="tableList.list">
                <el-table-column prop="contractStartDate" label="充值时间">
                    <template slot-scope="scope">{{scope.row.createAt | formatTime('yyyy-MM-dd')}}</template>
                </el-table-column>
                <el-table-column prop="companyName" label="客户公司"></el-table-column>
                <el-table-column prop="appName" label="接入应用"></el-table-column>
                <el-table-column prop="amount" label="充值金额（元）"></el-table-column>
                <el-table-column prop="stateName" label="处理状态"></el-table-column>
            </el-table>
        </div>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            :currentPage="pageIndex"
            v-on:handleSizeChange="handleSizeChange"
            v-on:handleCurrentChange="handleCurrentChange">
        </ayg-pagination>
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
            this.getList()
            this.getCompanyList()
        },
        data() {
			return {
				extrSystemOptions: [],
				formSearch: {
					appId: '',
                },
				companyId: '',
				tableList: {},
				pageSize: 10,
				pageIndex: 1,
				dateValue: '',
				customCompanyList: []
            }
        },
        // watch: {
	    //     companyId() {
        //         if(this.companyId) 
        //     }
        // },
        methods: {
	        getCompanyList() {
		        get('/api/sysmgr-web/commom/company', {
			        companyIdentity: 'custom'
		        }).then(result => {
			        this.customCompanyList = result
		        })
	        },
	        getClient() {
                this.formSearch.appId = ''
		        post('/api/balance-web/recharge-order/query-app', {
			        companyId: this.companyId
		        }).then(result => {
			        this.extrSystemOptions = result
		        })
	        },
	        resetForm(formName) {
		        this.$refs[formName].resetFields()
		        this.dateValue = ''
                this.companyId = ''
                this.extrSystemOptions = []
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
		        formSearch.createAtBegin = startAt
		        formSearch.createAtEnd = endAt
		        formSearch.companyId = this.companyId
		        let options = _.assign(formSearch, {
			        page: this.pageIndex,
			        pageSize: this.pageSize
		        })
		        post('/api/balance-web/recharge-order/statistics-list', options)
			        .then(result => {
				        this.tableList = result
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
		        formSearch.startTime = startAt
		        formSearch.endTime = endAt

		        window.location.href = `${baseUrl}/api/balance-web/recharge-order/export-statistics-list?${urlEncode(formSearch)}`
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
</style>

















