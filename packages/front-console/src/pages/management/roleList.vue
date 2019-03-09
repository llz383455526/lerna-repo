<template>

    <div class="main-container">
        <div style="margin-bottom:30px;">角色列表</div>

        <el-form :inline="true" :model="formSearch" ref="formSearch">
            <el-form-item label="归属系统" size="small" prop="sourceType">
                <el-select v-model="formSearch.sourceType" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in systemList" :label="item.text" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色名称" size="small" prop="roleName">
                <el-input v-model="formSearch.roleName"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>

        <el-button size="small" @click="$router.push('roleCreate')">添加角色</el-button>

        <div class="table-container">
            <el-table
                    :data="tableList.list">
                <el-table-column prop="name" label="角色"></el-table-column>
                <el-table-column prop="sourceTypeName" label="归属系统"></el-table-column>
                <el-table-column prop="memo" label="说明"></el-table-column>
                <el-table-column label="系统预设">
                    <template slot-scope="scope">
                        <span>{{scope.row.isSystem ? '是' : '否'}}</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button @click="toDetail(scope.row.id)" type="text" size="medium" style="padding:0;">查看</el-button>
                        <el-button v-if="!scope.row.isSystem" @click="roleDelete(scope.row)" type="text" size="medium" style="padding:0;">删除</el-button>
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
    import { post, get } from "../../store/api";
    import { showConfirm } from '../../plugin/utils-message'
    import { showNotify } from '../../plugin/utils-notify'
    import _ from 'lodash'

	export default {
		created() {
			this.querySysList()
            this.getList()
        },
        data() {
			return {
				tableList: [],
                pageIndex: 1,
                pageSize: 10,
				systemList: [],
				formSearch: {
					sourceType: '',
                    roleName: '',
                }
            }
        },
        methods: {
	        resetForm(formName) {
		        this.$refs[formName].resetFields()
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

                post('/api/sysmgr-web/role/list', options)
                    .then(result => {
                        this.tableList = result
                    })
            },
	        roleDelete(role) {
	        	showConfirm({
			        msg: '确定删除该角色？',
			        confirmCallback: () => {
                        post(`/api/sysmgr-web/role/delete/${role.id}`, {
                        	roleId: role.id,
	                        sourceType: role.sourceType
                        }).then(reuslt => {
                        	showNotify('success', '删除成功')
                            this.getList()
                        })
                    }
                })
            },
	        querySysList() {
		        get('/api/sysmgr-web/commom/option', {
			        enumType: 'PlatformType'
		        }).then(result => {
			        this.systemList = result
		        })
	        },
            toDetail(id) {
	        	this.$router.push({
                    path: 'roleCreate',
                    query: {
                    	id: id
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



















