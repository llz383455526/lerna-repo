<template>
    <div class="main">
        <div class="title">电子合同管理</div>
        <el-tabs v-model="tabName" @tab-click="query">
            <el-tab-pane label="合同模板" name="contract"></el-tab-pane>
            <el-tab-pane label="合同模板组" name="contractArr"></el-tab-pane>
        </el-tabs>
        <el-form :model="form" :inline="true" ref="query">
            <el-form-item label="商户名称：" prop="platformName" size="small">
                <el-input v-model="form.platformName" placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-form-item :label="tabName === 'contract' ? '合同模板ID' : '合同模板组ID'" :prop="tabName === 'contract' ? 'templateId' : 'templateGroupId'">
                <el-input v-model="form[`${tabName === 'contract' ? 'templateId' : 'templateGroupId'}`]"></el-input>
            </el-form-item>
            <el-form-item :label="tabName === 'contract' ? '合同模板名称' : '合同模板组名称'" prop="name">
                <el-input v-model="form.name" placeholder="请输入关键词" size="small"></el-input>
            </el-form-item>
            <el-form-item label="签约对象" prop="userName">
                <el-select
                    v-model="form.userName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getObject"
                    :loading="loading"
                    size="small">
                    <el-option
                        v-for="e in objects"
                        :key="e.userId"
                        :label="e.name"
                        :value="e.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="query">查询</el-button>
                <el-button type="text" size="small" @click="reset('query')">清空所有条件</el-button>
            </el-form-item>
        </el-form>
        <router-link :to="tabName === 'contract' ? 'addTemplate' : 'addTemplateGroup'" tag="span"><el-button type="primary" size="small">{{tabName === 'contract' ? '新增合同模板' : '新增合同模板组'}}</el-button></router-link>
        <el-table :data="list">
            <el-table-column :label="tabName == 'contract' ? '合同模板ID' : '合同模板组ID'" :prop="tabName === 'contract' ? 'templateId' : 'groupId'"></el-table-column>
            <el-table-column :label="tabName == 'contract' ? '合同模板名称' : '合同模板组名称'" :prop="tabName === 'contract' ? 'name' : 'groupName'"></el-table-column>
            <el-table-column label="商户名称" prop="platformName"></el-table-column>
            <el-table-column label="服务商名称">
                <template slot-scope="scope">
                    <div v-if="scope.row.templateId">
                        <div v-for="item in scope.row.partys" v-if="item.userDetailType == '2.1'">{{item.userName}}</div>
                    </div>
                    <div v-else>
                        <div v-for="item in scope.row.serviceCompanyNames">
                            {{item}}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="对接方式" prop="accessTypeDesc"></el-table-column>
            <el-table-column label="是否发短信" prop="smsTypeDesc"></el-table-column>
            <el-table-column label="短信引导内容" prop="signSmsTypeDesc"></el-table-column>
            <el-table-column label="返回链接" prop="linkTypeDesc"></el-table-column>
            <el-table-column label="备注" prop="memo"></el-table-column>
            <el-table-column label="合同原件">
                <template slot-scope="scope">
                    <div v-if="scope.row.templateId">
                        <a target="_bank" :href="`${baseUrl}/api/econtract/template/download?fileName=${scope.row.fname}&storeType=${scope.row.storeType}`">{{scope.row.fname}}</a>
                    </div>
                    <div v-else>
                        <div v-for="item in scope.row.templateFileNames">
                            <a target="_bank" :href="`${baseUrl}/api/econtract/template/download?fileName=${item}`">{{item}}</a>
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="状态" prop="enableDesc"></el-table-column>
            <el-table-column label="操作" width="160px">
                <template slot-scope="scope">
                    <el-button class="h_btn" type="text" size="small" @click="look(scope.row, 1)">查看</el-button>
                    <el-button class="h_btn" type="text" size="small" @click="look(scope.row)">修改</el-button>
                    <el-button class="h_btn" type="text" size="small" @click="copy(scope.row)" v-if="tabName == 'contract' && scope.row.partycount == '2'">复制</el-button>
                    <el-button class="h_btn" type="text" size="small" @click="changeGroupType(scope.row)">{{scope.row.enable === '1' ? '禁用' : '启用'}}</el-button>
                    <el-button class="h_btn" type="text" size="small" @click="deleteTemplate(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="total"
            :total="total"
            v-on:handleSizeChange="setSize"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.pageNo">
        </ayg-pagination>
        <el-dialog :title="`复制${copyContract.name}`" :visible.sync="show" :before-close="clearForm" width="600px">
            <el-form :model="copyForm" :rules="copyRules" label-width="120px" size="small" ref="copyForm">
                <el-form-item label="商户名称" prop="platform">
                    <el-select
                        class="w360"
                        v-model="copyForm.platform"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="remoteMethod"
                        :loading="loading"
                        size="small">
                        <el-option
                            v-for="e in platform"
                            :key="e.extrSystemId"
                            :label="e.extrSystemName"
                            :value="e.extrSystemId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务商名称" prop="serviceCompanyId">
                    <el-select
                        class="w360"
                        v-model="copyForm.serviceCompanyId"
                        filterable
                        remote
                        reserve-keyword
                        placeholder="请输入关键词"
                        :remote-method="getObject"
                        :loading="loading"
                        size="small">
                        <el-option
                            v-for="e in objects"
                            :key="e.userId"
                            :label="e.name"
                            :value="e.userId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="合同原件上传" prop="fname" >
                    <el-upload
                        class="form_input"
                        :drag="!fileList.length"
                        :action="`/api/econtract/template/parsefile`"
                        :auto-upload="false"
                        :on-change="upload"
                        :on-remove="remove"
                        :multiple="false"
                        accept=".pdf"
                        :file-list="fileList">
                        <template v-if="!fileList.length">
                            <i class="el-icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <div class="el-upload__tip" slot="tip">请上传pdf格式文件。</div>
                        </template>
                    </el-upload>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button size="small" @click="show = false">取消</el-button>
                <el-button size="small" type="primary" @click="save">保存</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { importPost, post, get } from "../../store/api"
import { baseUrl } from '../../config/address'
import { formatTime } from '../../plugin/utils-functions'
export default {
    data() {
        return {
            form: {
                platformName: '',
                name: '',
                userName: '',
                pageNo: 1,
                pageSize: 10
            },
            list: [],
            total: 0,
            platform: [],
            names: [],
            objects: [],
            baseUrl: baseUrl,
            partys: ['甲方', '乙方', '丙方'],
            tabName: 'contract',
            activeData: '',
            copyForm: {
                companyId: '',
                fname: '',
                name: '',
                platform: '',
                serviceCompanyId: '',
                templateCopyId: '',
                templateId: '',
                height: '',
                width: '',
                pageSize: ''
            },
            copyContract: '',
            show: false,
            fileList: [],
            extrSystemOptions: [],
            serviceOption: [],
            copyRules: {
                platform: [
                    {required: true, message: '请选择商户名称', trigger: blur}
                ],
                serviceCompanyId: [
                    {required: true, message: '请选择服务商名称', trigger: blur}
                ],
                fname: [
                    {required: true, message: '请上传文件', trigger: blur}
                ]
            }
        }
    },
    activated() {
        this.activeData && (this.form = JSON.parse(this.activeData))
        this.query(sessionStorage.getItem('resetPage') ? 1 : this.form.pageNo)
        sessionStorage.removeItem('resetPage')
    },
    mounted() {
        get('/api/econtract/inner/clientqry', {}).then(result => {
	        this.extrSystemOptions = result
        })
        get('/api/sysmgr-web/commom/company', {
            companyIdentity: 'service'
        }).then(data => {
            this.serviceOption = data
        })
    },
    methods: {
        remoteMethod(a) {
            if(a !== '') {
                get('/api/econtract/user/clientqry', {
                    extrSystemName: a,
                    pageNo: 1,
                    pageSize: 10
                }).then(data => {
                    console.log(data)
                    this.platform = data
                })
            }
        },
        getName(a) {
            if(a !== '') {
                post('/api/econtract/template/qrylist', {
                    name: a,
                    pageNo: 1,
                    pageSize: 10
                }).then(data => {
                    console.log(data)
                    this.names = data.data
                })
            }
        },
        getObject(a) {
            if(a !== '') {
                post('/api/econtract/user/company/qrylist', {
                    name: a,
                    pageNo: 1,
                    pageSize: 10
                }).then(data => {
                    console.log(data)
                    this.objects = data.data
                })
            }
        },
        query(a){
            if(isNaN(a)){
                a = 1
            }
            this.form.pageNo = a
            let url = this.tabName === 'contract' ? '/api/econtract/template/qrylist' : '/api/econtract/template-group/list'
            this.activeData = JSON.stringify(this.form)
            post(url, this.form).then(data => {
                this.list = data.data
                this.total = data.total
            })
        },
        reset(name) {
            this.$refs[name].resetFields();
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        look(a, e) {
        	if(a.templateId) {
		        sessionStorage.setItem('msg', JSON.stringify(a))
		        var link = 'addTemplate'
		        if(e) {
			        link += '?type=1'
		        }
		        this.$router.push(link)
            }else {
        		this.$router.push({
                    path: 'addTemplateGroup',
                    query: {
                    	type: e,
                        id: a.groupId
                    }
                })
            }

        },
        deleteTemplate(a) {
            this.$confirm('确定删除该模板吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
            	let url
                let param
                url = this.tabName === 'contract' ? '/api/econtract/template/delete' : '/api/econtract/template-group/enable'
                param = this.tabName === 'contract' ? {templateId: a.templateId} : {templateGroupId: a.groupId, enable: '2'}
                post(url, param).then(data => {
                    console.log(data)
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    })
                    this.query()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '删除已取消！'
                })
            })
        },
        changeGroupType(group) {
	        let url
	        let param
	        url = this.tabName === 'contract' ? '/api/econtract/template/enable' : '/api/econtract/template-group/enable'
	        param = this.tabName === 'contract' ? {templateId: group.templateId, enable: group.enable === '1' ? '0' : '1'} : {templateGroupId: group.groupId, enable: group.enable === '1' ? '0' : '1'}
        	post(url, param).then(result => {
		        this.$message({
			        type: 'success',
			        message: '修改成功！'
		        })
		        this.query()
            })
        },
        copy(a) {
            this.copyContract = a
            this.show = true
            get('/api/econtract/template/getnextid').then(data => {
                this.copyForm.templateId = data
            })
        },
        upload(a) {
            this.fileList.shift()
            var formData = new FormData()
            formData.append('templateId', this.copyForm.templateId)
            formData.append('fileName', a.name)
            formData.append('file', a.raw)
            importPost('/api/econtract/template/parsefile', formData).then(data => {
                this.copyForm.height = data.height
                this.copyForm.width = data.width
                this.copyForm.pageSize = data.pageSize
                
                var formData = new FormData()
                formData.append('templateId', this.copyForm.templateId)
                formData.append('fileName', a.name)
                formData.append('file', a.raw)
                formData.append('personalPartyNum', this.copyContract.partys[1].signNo)
                formData.append('companyPartyNum', 1)
                formData.append('partyCount', this.copyContract.partycount)
                importPost('/api/econtract/template/uploadfile', formData).then(data => {
                    this.fileList.push({
                        name: a.name,
                        url: a.templateId
                    })
                    this.copyForm.fname = data.fname
                })
            })
        },
        clearForm(next) {
            this.copyForm = {
                companyId: '',
                fname: '',
                name: '',
                platform: '',
                serviceCompanyId: '',
                templateCopyId: '',
                templateId: ''
            }
            this.$refs['copyForm'].clearValidate()
            console.log(this.copyForm)
            this.fileList.pop()
            if(next && typeof next == 'function') {
                next()
            }
        },
        remove() {
            this.fileList.pop()
        },
        save() {
            this.$refs['copyForm'].validate(v => {
                if(v) {
                    this.copyForm.templateCopyId = this.copyContract.templateId
                    this.copyForm.name = ''
                    this.platform.forEach(e => {
                        if(this.copyForm.platform == e.extrSystemId) {
                            console.log(e.extrSystemName)
                            this.copyForm.companyId = e.extrSystemGroup
                            this.copyForm.name += `${e.extrSystemName}-`
                        }
                    })
                    this.objects.forEach(e => {
                        if(this.copyForm.serviceCompanyId == e.userId) {
                            this.copyForm.name += `${e.abbrName || e.name}-`
                        }
                    })
                    this.copyForm.name += formatTime(new Date().getTime(), 'yyyyMMdd')
                    console.log(this.copyForm)
                    post('/api/econtract/template/copy', this.copyForm).then(data => {
                        this.clearForm()
                        this.show = false
                        this.query()
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
.main {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
}
.title {
    margin-bottom: 20px;
}
.w360 {
    width: 360px;
}
.h_btn {
    margin: 0 10px 0 0;
}
</style>
