<template>

    <div class="main-container">
        <el-form :inline="true" :model="formSearch" ref="formSearch">
            <el-form-item label="ID" size="small" prop="documentId">
                <el-input v-model="formSearch.documentId"></el-input>
            </el-form-item>

            <el-form-item label="标题" size="small" prop="title">
                <el-input v-model="formSearch.title"></el-input>
            </el-form-item>

            <el-form-item label="是否显示" size="small" prop="display">
                <el-select v-model="formSearch.display" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option label="是" value="1"></el-option>
                    <el-option label="否" value="0"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>

        <el-button size="small" @click="$router.push('documentCreate')">新增</el-button>

        <div class="table-container">
            <el-table :data="tableList.list">
                <el-table-column prop="documentId" label="ID"></el-table-column>
                <el-table-column prop="title" label="标题"></el-table-column>
                <el-table-column prop="displayName" label="是否显示"></el-table-column>
                <el-table-column prop="orderSeq" label="优先级"></el-table-column>
                <el-table-column prop="updateTime" label="最近操作时间"></el-table-column>
                <el-table-column prop="updateByName" label="最近操作人"></el-table-column>

                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <a :href="scope.row.content" target="_blank"><el-button type="text" size="medium" style="padding:0;">预览</el-button></a>
                        <el-button @click="toPath('documentCreate', scope.row.documentId)" type="text" size="medium" style="padding:0;">编辑</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange" :currentSize="pageSize"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="pageIndex"></ayg-pagination>

    </div>

</template>

<script>
    import { post } from "../../store/api";

    import _ from 'lodash'

    export default {
		created() {
            this.getList()
        },
		data() {
			return {
				formSearch: {
                    title: '',
                    display: '',
					documentId: ''
                },
				tableList: [],
				pageSize: 10,
				pageIndex: 1,
			}
		},
        methods: {
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
	            let formSearch = _.cloneDeep(this.formSearch)
	            let options = _.assign(formSearch, {
		            page: this.pageIndex,
		            pageSize: this.pageSize
	            })

                post('/api/sysmgr-web/helpful-document/query-documents', options)
                    .then(result => {
                    	this.tableList = result
                    })
            },
	        toPath(path, id) {
	        	this.$router.push({
                    path: path,
                    query: {
                    	id: id
                    }
                })
            }
        }
    }
</script>

<style lang="scss">

    .main-container {
        background-color:#fff;
        padding:15px;
    }

</style>














