<template>

    <div class="main-container">
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="客户名称（公司）" size="small" prop="customCompanyName">
                <el-input v-model="formSearch.customCompanyName"></el-input>
            </el-form-item>

            <el-form-item label="服务商名称" size="small" prop="serviceCompanyName">
                <el-input v-model="formSearch.serviceCompanyName"></el-input>
            </el-form-item>

            <!--<el-form-item label="合同状态" size="small" prop="status">
                <el-select v-model="formSearch.status" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in searchOptions.ArchiveType" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>-->

            <el-form-item label="合同起止时间" size="small">
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
            </el-form-item>
        </el-form>

        <div class="table-container">
            <el-table :data="tableList.list">
                <el-table-column prop="contractNo" label="合同编号"></el-table-column>
                <el-table-column prop="customCompanyName" label="客户名称"></el-table-column>
                <el-table-column prop="serviceCompanyName" label="服务商名称"></el-table-column>
                <el-table-column prop="contractTypeName" label="业务类型"></el-table-column>
                <el-table-column prop="contractStartDate" label="合同开始时间">
                    <template slot-scope="scope">{{scope.row.contractStartDate | formatTime('yyyy-MM-dd')}}</template>
                </el-table-column>
                <el-table-column prop="contractEndDate" label="合同结束时间">
                    <template slot-scope="scope">{{scope.row.contractEndDate | formatTime('yyyy-MM-dd')}}</template>
                </el-table-column>
                <el-table-column prop="updateByName" label="操作人"></el-table-column>
                <el-table-column prop="updateAt" label="更新时间">
                    <template slot-scope="scope">{{scope.row.updateAt | formatTime}}</template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="toPath('contractCreate', scope.row.id)" type="text" size="medium" style="padding:0;">编辑</el-button>
                        <el-button @click="toPath('contractPreview', scope.row.id)" type="text" size="medium" style="padding:0;">预览</el-button>
                        <el-button @click="downloadContract(scope.row.id)" type="text" size="medium" style="padding:0;margin-left: 0;">下载</el-button>
                        <el-button @click="selectedId = scope.row.id; dialogVisible = true" type="text" size="medium" style="padding:0;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange" :currentSize="pageSize"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="pageIndex"></ayg-pagination>

        <el-dialog :visible.sync="dialogVisible" width="30%">
            <span>确认删除该合同文件吗？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteContract">确 定</el-button>
            </div>
        </el-dialog>

    </div>

</template>

<script>
	import { post, get } from "../../store/api"

	import _ from 'lodash'

	import { showNotify } from '../../plugin/utils-notify'

	export default {
        created() {
            // this.getArchiveType()
	        let param = this.$route.query
	        if(!_.isEmpty(param)) {
		        this.pageIndex = parseInt(param.page)
		        this.pageSize = parseInt(param.pageSize)
		        this.formSearch = JSON.parse(param.param)
                this.dateValue = this.formSearch.startAt ? [this.formSearch.startAt, this.formSearch.endAt] : ''
	        }

            this.getList()
        },
        data() {
        	return {
		        searchOptions: {},
		        formSearch: {
			        customCompanyName: '',
			        serviceCompanyName: '',
			        startAt: '',
			        endAt: '',
			        //status: ''
                },
		        dateValue: '',
		        tableList: [],
		        pageSize: 10,
		        pageIndex: 1,
		        dialogVisible: false,
                selectedId: ''
            }
        },
        methods: {
	        getArchiveType() {
	        	post('/api/sysmgr-web/commom/options?enumTypes=ArchiveType', {})
                    .then(result => {
	                    this.searchOptions = result
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
		        this.formSearch.startAt = startAt
		        this.formSearch.endAt = endAt

		        let formSearch = _.cloneDeep(this.formSearch)
		        let options = _.assign(formSearch, {
			        page: this.pageIndex,
			        pageSize: this.pageSize
		        })

                post('/api/contract-web/contract-generate/query-contract-list', options)
                    .then(result => {
	                    this.tableList = result

	                    this.$router.replace({
		                    path: 'contractList',
		                    query: {
			                    page: this.pageIndex,
			                    pageSize: this.pageSize,
			                    param: JSON.stringify(this.formSearch)
		                    }
	                    })
                    })
            },
            downloadContract(id) {
	        	window.location.href = `/api/contract-web/contract-generate/download-contract-attachments?id=${id}`
            },
            toPath(path, id) {
                this.$router.push({
                    path: path,
                    query: {
                    	contractId: id
                    }
                })
            },
            deleteContract() {
                post('/api/contract-web/contract-generate/delete-contract', {
                	id: this.selectedId
                }).then(result => {
                	this.dialogVisible = false
	                showNotify('success', '删除成功')
                    this.getList()
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
</style>





















