<template>

    <div class="main-container">
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="业务类型" size="small" prop="contractType">
                <el-select v-model="formSearch.contractType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in searchOptions.BusinessType" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="行业类型" size="small" prop="industryType">
                <el-select v-model="formSearch.industryType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in searchOptions.IndustryType" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否有效" size="small" prop="status">
                <el-select v-model="formSearch.status" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in searchOptions.ValidationType" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同类型"  size="small" prop="tplType">
                <el-select v-model="formSearch.tplType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in searchOptions.ContractTplType" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>
        <el-button size="small" v-if="checkRight(permissions, 'contract-web:/contract-tpl/add-contract-tpl')" @click="$router.push('templateCreate')">新增</el-button>
        <div class="table-container">
            <el-table :data="tableList.list" @selection-change="handleSelectionChange">
                <el-table-column prop="tplNo" label="合同模板编号"></el-table-column>
                <el-table-column prop="tplTypeName" label="业务类型"></el-table-column>
                <el-table-column prop="industryTypeNames" label="行业类型"></el-table-column>
                <el-table-column prop="remark" label="合同备注"></el-table-column>
                <el-table-column prop="usage" label="适用情况"></el-table-column>
                <!-- <el-table-column prop="tplTypeName" label="合同类型"></el-table-column> -->
                <el-table-column prop="status" label="是否有效">
                    <template slot-scope="scope">{{scope.row.status === '1' ? '有效' : '无效'}}</template>
                </el-table-column>
                <el-table-column prop="updateByName" label="操作人"></el-table-column>
                <el-table-column prop="updateAt" label="更新时间">
                    <template slot-scope="scope">{{scope.row.updateAt | formatTime}}</template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <template v-if="checkRight(permissions, 'contract-web:/contract-tpl/update-contract-tpl')">
                            <el-button @click="toPath(scope.row.id, '0')" type="text" size="medium" style="padding:0;">查看</el-button>
                            <el-button @click="toPath(scope.row.id, '1')" type="text" size="medium" style="padding:0;">编辑</el-button>
                        </template>
                        <el-button v-if="scope.row.statusName === '有效' && scope.row.contractType !== 'CHANNEL'" @click="createContract(scope.row.id)" type="text" size="medium" style="padding:0;">生成合同</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            v-on:handleSizeChange="handleSizeChange"
            :currentSize="pageSize"
            v-on:handleCurrentChange="handleCurrentChange"
            :currentPage="pageIndex">
        </ayg-pagination>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex';
    import { post, get } from "../../store/api"
    import _ from 'lodash'
    export default {
		created() {
			let param = this.$route.query
            if(!_.isEmpty(param)) {
	            this.pageIndex = parseInt(param.page)
                this.pageSize = parseInt(param.pageSize)
	            this.formSearch = JSON.parse(param.param)
            }

            this.getSearchOptions()

            this.getList()
        },
        data() {
			return {
				formSearch: {
					contractType: '',
					industryType: '',
                    status: '1',
                    tplType:'',
                },
                tableList: [],
				pageSize: 10,
                pageIndex: 1,
                searchOptions: {}
            }
        },
        computed: {
            ...mapGetters({
                permissions: 'permissions'
            })
        },
        methods: {
	        resetForm(formName) {
		        this.$refs[formName].resetFields()
                this.status = '1'
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
	        	let formSearch = _.cloneDeep(this.formSearch)
                let options = _.assign(formSearch, {
                	page: this.pageIndex,
                    pageSize: this.pageSize
                })

                post('/api/contract-web/contract-tpl/query-tpls', options)
                    .then(result => {
	                    this.tableList = result

                        this.$router.replace({
                            path: 'templateList',
                            query: {
	                            page: this.pageIndex,
	                            pageSize: this.pageSize,
                                param: JSON.stringify(this.formSearch)
                            }
                        })
                    })
	        },
            getSearchOptions() {
                post('/api/sysmgr-web/commom/options?enumTypes=BusinessType,IndustryType,ValidationType,ContractTplType', {})
                    .then(result => {
                    	this.searchOptions = result
                    })
            },
            toPath(id, type) {
                this.$router.push({
                    path: 'templateCreate',
                    query: {
                    	tplId: id,
	                    editable: type
                    }
                })
            },
	        handleSelectionChange(value) {
	        	//console.log(value)
            },
            createContract(tplId) {
                this.$router.push({
                    path: 'contractCreate',
                    query: {
	                    tplId: tplId
                    }
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














