<template>

    <div class="main-container">
        <el-form :model="roleForm" :rules="rules" ref="roleForm" label-width="200px" class="demo-contractForm">
            <el-form-item label="角色名称" prop="name">
                <el-input v-model="roleForm.name" :disabled="isSystem"></el-input>
            </el-form-item>

            <el-form-item label="对应系统" prop="sourceType">
                <el-select v-model="roleForm.sourceType" placeholder="请选择" style="width:100%;" @change="getRoleTree" :disabled="!!roleId">
                    <el-option v-for="item in systemList" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="备注" prop="memo">
                <el-input v-model="roleForm.memo" :maxlength="100" :disabled="isSystem"></el-input>
            </el-form-item>

            <el-form-item label="功能" prop="menuIds">
                <el-tree
                    :data="roleTree"
                    show-checkbox
                    node-key="id"
                    label="name"
                    :props="roleTreeProps"
                    @check-change="handleCheckChange"
                    ref="tree">
                </el-tree>
            </el-form-item>

            <el-form-item v-if="!isSystem">
                <el-button type="primary" @click="submitForm('roleForm')">保存</el-button>
                <el-button @click="backToList">取消</el-button>
            </el-form-item>
        </el-form>
    </div>

</template>

<script>
    import { post, get } from "../../store/api";

    import _ from 'lodash'

    import { showNotify } from '../../plugin/utils-notify'

    export default {
    	created() {
            this.querySysList()

            let roleId = this.$route.query.id
            if(roleId) this.getRoleDetail(roleId)
            else this.isSystem = false
        },
        data() {
    		return {
    			roleId: '',
    		    roleForm: {
                    name: '',
			        sourceType: '',
			        memo: '',
			        menuIds: []
                },
                rules: {

                },
			    systemList: [],
                roleTree: [],
                roleTreeProps: {
                    label: 'name'
                },
			    menuIds: [],
                defaultTree: [],
                isSystem: true
            }
        },
        methods: {
	        querySysList() {
		        get('/api/sysmgr-web/commom/option', {
			        enumType: 'PlatformType'
		        }).then(result => {
			        this.systemList = result
		        })
	        },
            getRoleTree() {
	        	get('/api/sysmgr-web/role/menu-tree', {
	        		roleId: this.roleId || 0,
			        sourceType: this.roleForm.sourceType
                }).then(result => {
                    this.roleTree = result

                    if(this.roleId) {
                        this.defaultTree = []
                        this.formatTree(result)
	                    this.$refs.tree.setCheckedKeys(this.defaultTree)

	                    this.menuIds = _.cloneDeep(this.defaultTree)
                    }
                })
            },
	        handleCheckChange(val) {
                let selectTree = this.$refs.tree.getCheckedNodes()

                this.menuIds = []
                _.forEach(selectTree, tree => {
	                if(!tree.children.length) this.menuIds.push(tree.id)
                })
            },
            formatTree(tree) {
	        	_.forEach(tree, item => {
                    if(item.checked) this.defaultTree.push(item.id)
                    if(item.children) this.formatTree(item.children)
                })
            },
	        backToList() {
		        this.$router.push('roleList')
	        },
	        submitForm(formName) {
	        	let formData = _.cloneDeep(this.roleForm)
                formData.menuIds = this.menuIds

                let url
                url = this.roleId ? '/api/sysmgr-web/role/update' : '/api/sysmgr-web/role/add'
                if(this.roleId) formData.roleId= this.roleId
                post(url, formData)
                    .then(result => {
	                    showNotify('success', this.roleId ? '编辑成功' : '添加成功')
                        this.backToList()
                    })
            },
            getRoleDetail(id) {
	        	this.roleId = id
                get('/api/sysmgr-web/role/detail', {
                	roleId: id
                }).then(result => {
                	this.isSystem = result.system
                    this.roleForm = {
	                    name: result.name,
	                    sourceType: result.sourceType,
	                    memo: result.memo,
	                    menuIds: []
                    }

                    this.getRoleTree()
                })
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

</style>















