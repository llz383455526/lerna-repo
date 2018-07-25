<template>

    <div class="main-container">
        <el-form :model="accountForm" :rules="rules" ref="accountForm" label-width="200px" class="demo-contractForm">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="accountForm.name"></el-input>
            </el-form-item>

            <el-form-item label="手机号码" prop="mobile">
                <el-input v-model="accountForm.mobile"></el-input>
            </el-form-item>

            <el-form-item label="邮箱地址" prop="email">
                <el-input v-model="accountForm.email"></el-input>
            </el-form-item>

            <el-form-item label="权限配置">
                <el-tabs v-model="activeName" @tab-click="">
                    <el-tab-pane label="请先配置角色" name="first">
                        <el-select v-model="systemType" placeholder="请选择" style="width:100%;" @change="handleSystemType">
                            <el-option v-for="item in systemList" :key="item.value" :label="item.text"
                                       :value="item.value"></el-option>
                            <!--<el-option label="openAdmin"
                                       value="console-admin"></el-option>-->
                        </el-select>

                        <el-checkbox-group v-model="roleIds" @change="handleRoleChange">
                            <el-checkbox v-for="item in activeRoleList" :key="item.roleId" :label="item.roleName"
                            ></el-checkbox>
                        </el-checkbox-group>
                    </el-tab-pane>

                    <el-tab-pane label="配置商户" name="second" v-if="systemType">
                        <el-button @click="openDialog('新增商户', 'app')">新增</el-button>
                        <el-checkbox v-model="isAppAll" style="margin-left: 15px;">全部</el-checkbox>

                        <div class="table-container" v-if="!isAppAll">
                            <el-table
                                    :data="selectedAppList">
                                <el-table-column prop="appName" label="商户名称"></el-table-column>
                                <el-table-column prop="companyName" label="企业名称"></el-table-column>
                                <el-table-column prop="serviceCompanyName" label="服务商名称"></el-table-column>

                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button @click="deleteSelection('app', scope.$index)" type="text" size="medium" style="padding:0;">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>

                    <el-tab-pane label="配置服务商" name="third" v-if="systemType === 'console-admin'">
                        <el-button @click="openDialog('新增服务商', 'service')">新增</el-button>
                        <el-checkbox v-model="isProviderAll" style="margin-left: 15px;">全部</el-checkbox>

                        <div class="table-container" v-if="!isProviderAll">
                            <el-table
                                    :data="selectedServiceList">
                                <el-table-column prop="fullName" label="名称"></el-table-column>

                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button @click="deleteSelection('service', scope.$index)" type="text" size="medium" style="padding:0;">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-tab-pane>
                </el-tabs>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('accountForm')">保存</el-button>
                <el-button @click="backToList">取消</el-button>
            </el-form-item>
        </el-form>


        <el-dialog :title="dialogTitle" :visible.sync="dialogVisible">
            <el-form :inline="true" :model="formApp" ref="formApp" v-if="dialogType === 'app'" @submit.native.prevent>
                <el-form-item label="商户名称" size="small" prop="appName">
                    <el-input v-model="formApp.appName"></el-input>
                </el-form-item>

                <!--<el-form-item label="客户公司名称" size="small" prop="serviceCompanyName">
                    <el-input v-model="formApp.companyName"></el-input>
                </el-form-item>

                <el-form-item label="服务商名称" size="small" prop="serviceCompanyName">
                    <el-input v-model="formApp.serviceCompanyName"></el-input>
                </el-form-item>-->

                <el-form-item style="margin-top: -4px">
                    <el-button type="primary" @click="search" size="small">查询</el-button>
                    <el-button size="small" @click="resetForm('formApp')">清除</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="formService" ref="formService" v-else-if="dialogType === 'service'" @submit.native.prevent>
                <el-form-item label="名称" size="small" prop="fullName">
                    <el-input v-model="formService.fullName"></el-input>
                </el-form-item>

                <el-form-item style="margin-top: -4px">
                    <el-button type="primary" @click="search" size="small">查询</el-button>
                    <el-button size="small" @click="resetForm('formService')">清除</el-button>
                </el-form-item>
            </el-form>

            <div class="table-container">
                <el-table
                        v-if="dialogType === 'app'"
                        ref="multipleTable"
                        :data="tableList.list"
                        height="250"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>

                    <el-table-column prop="appName" label="商户名称"></el-table-column>
                    <!--<el-table-column prop="companyName" label="企业名称"></el-table-column>
                    <el-table-column prop="serviceCompanyName" label="服务商名称"></el-table-column>-->
                </el-table>
                <el-table
                        v-else-if="dialogType === 'service'"
                        ref="multipleTable"
                        :data="tableList.list"
                        height="250"
                        @selection-change="handleSelectionChange">
                    <el-table-column
                            type="selection"
                            width="55">
                    </el-table-column>

                    <el-table-column prop="fullName" label="名称"></el-table-column>
                </el-table>
            </div>
            <ayg-pagination v-if="tableList.total" :total="tableList.total"
                            v-on:handleSizeChange="handleSizeChange" :currentSize="pageSize"
                            v-on:handleCurrentChange="handleCurrentChange" :currentPage="pageIndex"></ayg-pagination>

            <div slot="footer" class="dialog-footer" style="margin-top: -30px;">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <!--<el-button type="primary" @click="">选择全部结果</el-button>-->
                <el-button type="primary" @click="confirmSelection">选择勾选项</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import { post, get } from "../../store/api";

    import _ from 'lodash'

    import { showNotify } from '../../plugin/utils-notify'

    export default {
		created() {
            this.querySysList()
        },
        data() {
			return {
				accountId: '',
                accountForm: {
                    name: '',
                    mobile: '',
                    email: '',
                    roleIds: [],
	                platformType: ''
                },
                rules: {

                },
				activeName: 'first',
				systemList: [],
                systemType: '',
                roleList: {},
                roleIds: [],
				activeRoleList: [],
                pageIndex: 1,
                pageSize: 10,
                tableList: [],
				dialogVisible: false,
                dialogTitle: '',
                dialogType: '',
                formApp: {
	                appName: '',
	                companyName: '',
	                isEnable: true,
	                serviceCompanyName: ''
                },
                formService: {
	                fullName: ''
                },
				multipleSelection: [],
                selectedAppList: [],
				selectedServiceList: [],
                isAppAll: false,
                isProviderAll: false
            }
        },
        computed: {
            
        },
        methods: {
			querySysList() {
				get('/api/sysmgr-web/commom/option', {
					enumType: 'PlatformType'
                }).then(result => {
                	this.systemList = result
                })
            },
            queryRoleList(systemType) {
            	if(!this.roleList[systemType]) {
                    get('/api/sysmgr-web/user/role-list', {
	                    sourceType: systemType
                    }).then(result => {
	                    this.roleList[systemType] = result
                        this.activeRoleList = result
                    })
                }else this.activeRoleList = this.roleList[systemType]
            },
            handleSystemType(val) {
	            this.selectedAppList = []
	            this.selectedServiceList = []
            	this.queryRoleList(val)
            },
            handleRoleChange(val) {
            	let roleIds = []
            	_.forEach(val, name => {
                    let item = _.find(this.activeRoleList, function (item) {
                        return name === item.roleName
                    })
		            roleIds.push(item.roleId)
                })

                this.accountForm.roleIds = roleIds
            },
	        backToList() {
		        this.$router.push('accountList')
	        },
	        submitForm(formName) {
                let formData = _.cloneDeep(this.accountForm)
                let userContextList = []

                if(this.isAppAll) {
	                userContextList.push({
		                isAllSubject: true,
		                subjectType: 'app'
                    })
                }else {
	                _.forEach(this.selectedAppList, item => {
		                userContextList.push({
			                subjectId: item.appId,
			                subjectName: item.appName,
			                subjectType: 'app'
		                })
	                })
                }

                if(this.isProviderAll) {
	                userContextList.push({
		                isAllSubject: true,
		                subjectType: 'provider'
	                })
                }else {
	                _.forEach(this.selectedServiceList, item => {
		                userContextList.push({
			                subjectId: item.id,
			                subjectName: item.fullName,
			                subjectType: 'provider'
		                })
	                })
                }

		        formData.userContextList = userContextList
                formData.platformType = this.systemType

		        // console.log(formData)

                post('/api/sysmgr-web/user/create', formData)
                    .then(result => {
                    	showNotify('success', '创建成功')
	                    this.backToList()
                    })
            },
            openDialog(title, type) {
            	this.dialogTitle = title
                this.dialogType = type
                this.pageIndex = 1
                this.pageSize = 10
                this.tableList = []
                this.multipleSelection = []
            	this.dialogVisible = true

                this.getList()
            },
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
            	let isApp = this.dialogType === 'app'

	            let formSearch = _.cloneDeep(isApp ? this.formApp : this.formService)
	            let options = _.assign(formSearch, {
		            page: this.pageIndex,
		            pageSize: this.pageSize
	            })

	            let url
	            if(isApp) {
		            url = '/api/sysmgr-web/company-app/query-app'
	            }else {
		            url = '/api/sysmgr-web/company/query-company'
		            options.companyType = 'provider'
	            }

                post(url, options)
                    .then(result => {
                    	this.tableList = result
                    })

            },
	        handleSelectionChange(val) {
                this.multipleSelection = val
            },
	        confirmSelection() {
		        let isApp = this.dialogType === 'app'

                let selectedList = _.cloneDeep(isApp ? this.selectedAppList : this.selectedServiceList)
                _.forEach(this.multipleSelection, item => {
                    if(!_.find(selectedList, function (o) {return o.id === item.id})) {
	                    selectedList.push(item)
                    }
                })

                if(isApp) this.selectedAppList = selectedList
                else this.selectedServiceList = selectedList

                this.dialogVisible = false
            },
            deleteSelection(type, index) {
                switch (type) {
                    case 'app':
                    	this.selectedAppList.splice(index, 1)
                    	break
	                case 'service':
		                this.selectedServiceList.splice(index, 1)
		                break
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

    .main-container {
        background-color:#fff;
        padding:15px;
        margin-bottom: 30px;
    }

    .demo-contractForm {
        width: 800px;
    }

    .table-container {
        width: 100%;
    }

</style>















