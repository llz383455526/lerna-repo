<template>

    <div class="main-container">
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="客户公司:"   size="small" prop="companyId">
                <el-select filterable v-model="formSearch.companyId">
                    <el-option v-for="item in customCompanyList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="商户名称"   size="small" prop="extrSystemIds">
                <el-select multiple v-model="formSearch.extrSystemIds">
                    <el-option v-for="item in extrSystemOptions" :label="item.extrSystemName" :value="item.extrSystemId" :key="item.extrSystemId"></el-option>
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

            <el-form-item label="合同模板" size="small" prop="templateId">
                <el-select v-model="formSearch.templateId" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in templateData" :key="item.templateId" :label="item.name"
                               :value="item.templateId"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
                <el-button size="small" @click="exportFile">导出</el-button>
            </el-form-item>
        </el-form>

        <div class="table-container">
            <el-table :data="tableList.data">
                <el-table-column prop="contractStartDate" label="发起时间">
                    <template slot-scope="scope">{{scope.row.createTime | formatTime('yyyy-MM-dd')}}</template>
                </el-table-column>
                <el-table-column prop="extrSystemName" label="客户公司"></el-table-column>
                <el-table-column prop="templateName" label="合同模板"></el-table-column>
                <el-table-column prop="signCounts" label="签约完成人数"></el-table-column>
                <el-table-column prop="orderStateDesc" label="订单状态"></el-table-column>
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
			this.getClient()
            this.getTemplate()
            this.getList()

            this.getCompanyList()
        },
        data() {
			return {
				formSearch: {
					extrSystemIds: [],
                    templateId: '',
					companyId: ''
                },
				dateValue: '',
				tableList: [],
				pageSize: 10,
				pageIndex: 1,
				extrSystemOptions: [],
                templateData: [],
                customCompanyList: []
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
	        getClient() {
		        get('/api/econtract/inner/clientqry', {})
			        .then(result => {
				        this.extrSystemOptions = result
			        })
	        },
            getTemplate() {
	            get('/api/econtract/inner/qry/gettemplates', {})
		            .then(result => {
			            this.templateData = result
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
		        formSearch.startTime = startAt
		        formSearch.endTime = endAt
		        let options = _.assign(formSearch, {
			        pageNo: this.pageIndex,
			        pageSize: this.pageSize
		        })

                post('/api/econtract/inner/qry/signrecords', options)
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

		        formSearch.extrSystemIds = formSearch.extrSystemIds.join(',')
		        window.location.href = `${baseUrl}/api/econtract/inner/export/signrecords?${urlEncode(formSearch)}`
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















