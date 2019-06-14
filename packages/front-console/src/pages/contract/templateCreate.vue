<template>

    <div class="bg-white p15">
        <el-form :model="templateForm" :rules="rules" ref="templateForm" label-width="200px" class="demo-contractForm">
            <h4 class="ml50">基本信息</h4>
            <div v-if="editable">
                <el-form-item label="模版类型" prop="tplType" required>
                    <el-select v-model="templateForm.tplType" placeholder="请选择" style="width:100%;">
                        <el-option v-for="item in searchOptions.ContractTplType" :key="item.value" :label="item.text"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="行业类型" prop="industryTypes">
                    <el-checkbox-group v-model="templateForm.industryTypes">
                        <el-checkbox v-for="item in searchOptions.IndustryType" :key="item.value" :label="item.text"
                        ></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>

                <!-- <el-form-item label="合同类型" prop="tplType" required>
                    <el-select v-model="templateForm.tplType" placeholder="请选择" style="width:100%;">
                        <el-option v-for="item in searchOptions.ContractTplType" :key="item.value" :label="item.text"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item> -->

                <el-form-item label="合同备注" prop="remark">
                    <el-input type="textarea" v-model="templateForm.remark"></el-input>
                </el-form-item>

                <el-form-item label="适用情况" prop="usage">
                    <el-input type="textarea" v-model="templateForm.usage"></el-input>
                </el-form-item>

                <el-form-item label="是否有效" prop="status">
                    <el-radio-group v-model="templateForm.status">
                        <el-radio v-for="item in searchOptions.ValidationType" :key="item.value" :label="item.text"></el-radio>
                    </el-radio-group>
                </el-form-item>
            </div>
            <div v-else>
                <el-form-item label="模版类型">
                    <span>{{templateDetail.tplTypeName}}</span>
                </el-form-item>
                <el-form-item label="行业类型">
                    <span>{{templateDetail.industryTypeNames}}</span>
                </el-form-item>
                <el-form-item label="合同备注">
                    <div v-for="(item, key) in templateDetail.remark" :key="key">{{item}}</div>
                </el-form-item>
                <el-form-item label="适用情况">
                    <div v-for="(item, key) in templateDetail.usage" :key="key">{{item}}</div>
                </el-form-item>
                <el-form-item label="是否有效">
                    <span>{{templateForm.status}}</span>
                </el-form-item>
            </div>

            <h4 class="ml50 mt50">解决方案</h4>
            <el-button class="ml50" size="small" type="primary" @click="show = true">点击上传</el-button>

            <div class="pl50 mb50">
                <el-table :data="fileList">
                    <el-table-column prop="fileName" label="文件名称"></el-table-column>
                    <el-table-column prop="tplAttachTypeName" label="文件类型"></el-table-column>
                    <el-table-column prop="createTime" label="上传时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | formatTime}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createByName" label="操作人"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleDownload(scope.row.downloadCode)" type="text" size="medium"
                                       style="padding:0;">下载
                            </el-button>
                            <el-button  type="text" size="medium" v-if="editable"
                                        style="padding:0;" @click="openDeleteDialog(scope.row.downloadCode, scope.$index)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-form-item v-if="editable">
                <el-button type="primary" @click="submitForm('templateForm')">保存</el-button>
                <el-button @click="backToList">取消</el-button>
            </el-form-item>
            <el-form-item v-else>
                <el-button @click="backToListTwo">返回</el-button>
            </el-form-item>
            <el-dialog title="选择文件类型" :visible.sync="show" width="500px">
                <el-form-item label="文件类型" prop="tplAttachType" required label-width="120px">
                    <el-radio v-model="templateForm.tplAttachType" v-for="e in tplList" :label="e.value" :key="e.value">{{e.text}}</el-radio>
                </el-form-item>
                <span slot="footer">
                    <el-button size="small" @click="show = false">取消</el-button>
                    <el-upload
                            v-if="editable"
                            class="upload-demo ml20"
                            :action=uploadUrl
                            :on-error="handleError"
                            :before-upload="handleBeforeUpload"
                            :http-request="handleHttpRequest"
                            multiple
                            accept=".docx, .xlsx, .xls"
                            :show-file-list=false
                            :file-list="fileList">
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </span>
            </el-dialog>
        </el-form>

        <el-dialog :visible.sync="dialogVisible" width="30%">
            <span>确认删除该合同文件吗？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDelete">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import { post, get, formPost } from "../../store/api"

	import _ from 'lodash'

	import { baseUrl } from '../../config/address'

	import { showNotify } from '../../plugin/utils-notify'

	export default {
		created() {
			let editable = this.$route.query.editable
            if(editable === '0') {
				this.editable = false
            }
            this.getSearchOptions()

			this.uploadUrl = baseUrl + "/api/contract-web/file/upload"
            this.tplId = this.$route.query.tplId
            get('/api/sysmgr-web/commom/option?enumType=ContractTplAttachment').then(data => {
                this.tplList = data
                this.templateForm.tplAttachType = data[0].value
            })
        },
        data() {
			return {
				searchOptions: {},
                templateForm: {
	                contractType: '',
                    industryTypes: [],
                    tplType: '',
                    tplTypeName: '',
	                remark: '',
	                usage: '',
                    status: '有效',
                    attachments: [],
                    tplAttachType: ''
                },
				rules: {
					contractType: [
						{required: true, message: '请选择业务类型', trigger: 'change'}
					],
					industryTypes: [
						{ type: 'array', required: true, message: '请至少选择一种行业类型', trigger: 'change' }
                    ],
                    tplType: [
						{required: true, message: '请选择合同类型', trigger: 'change'}
					],
                    remark: [
	                    { required: true, message: '请输入模板备注', trigger: 'blur' },
	                    // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                    ],
					status: [
						{ required: true, message: '请选择有效状态', trigger: 'change' }
                    ]
                },
				uploadUrl: '',
				fileList: [],
				referArr: [],
				formData: {},
				dialogVisible: false,
				downloadCode: '',
                deleteKey: 0,
                tplId: '',
                editable: true,
                templateDetail: {},
                show: false,
                tplList: []
            }
        },
        methods: {
            tplTypeChange(ev) {
                const obj = this.searchOptions.ContractTplType.find((item) => {
                    return item.value = ev
                })
                this.templateForm.tplTypeName = obj.text
            },
	        getTemplateDetail(tplId) {
		        get('/api/contract-web/contract-tpl/contract-tpl-detail', {
			        id: tplId
		        }).then(result => {
		        	this.templateDetail = result
			        if(!this.editable) {
				        this.templateDetail.remark = result.remark.split('\n')
				        this.templateDetail.usage = result.usage.split('\n')
			        }
			        _.forEach(result.attachments, attachment => {
				        attachment.fileName = attachment.displayname
				        this.fileList.push(attachment)
                        // this.referArr.push(attachment.id)
                        typeof this.templateForm.attachments != 'object' && (this.templateForm.attachments = [])
                        this.templateForm.attachments.push({
                            referId: attachment.id,
                            tplAttachType: attachment.tplAttachType
                        })
                        console.log(this.templateForm.attachments)
			        })

                    this.templateForm = {
	                    contractType: result.contractType,
	                    industryTypes: result.industryTypeNames.split('/'),
                        tplType:result.tplType,
	                    remark: result.remark,
                        usage: result.usage,
                        status: _.find(this.searchOptions.ValidationType, item => item.value === result.status).text,
                        attachments: this.templateForm.attachments
                    }
		        })
	        },
	        getSearchOptions() {
		        post('/api/sysmgr-web/commom/options?enumTypes=BusinessType,IndustryType,ValidationType,ContractTplType,ContractTplType', {})
			        .then(result => {
				        this.searchOptions = result

				        if(this.tplId) {
					        this.getTemplateDetail(this.tplId)
				        }
			        })
	        },
	        handleError() {
		        showNotify('error', '上传失败!');
	        },
	        /*handleSuccess(file) {
		        this.fileList.push(file.data)
		        this.referArr.push(file.data.referId)
	        },*/
	        handleBeforeUpload(file) {
		        const AllImgExt = ".docx, .xlsx, .xls";
		        let extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
		        if (AllImgExt.indexOf(extName) < 0) {
			        showNotify('error', '文件类型错误')
			        return false
		        }

		        let formData = new FormData()
		        formData.append('fileName', file.name)
		        formData.append('file', file);
		        this.formData = formData
	        },
	        handleHttpRequest() {
		        formPost('/api/contract-web/file/upload', this.formData)
                    .then(result => {
                        this.show = false
                        this.tplList.forEach(e => {
                            if(e.value == this.templateForm.tplAttachType) {
                                result.tplAttachTypeName = e.text
                            }
                        })
                        this.fileList.push(result)
                        this.templateForm.attachments.push({
                            referId: result.referId,
                            tplAttachType: this.templateForm.tplAttachType
                        })
                        showNotify('success', '上传成功!')
                    })
            },
	        handleDownload(downloadCode) {
		        window.location.href = `${baseUrl}/api/contract-web/file/download?downloadCode=${downloadCode}`
	        },
            openDeleteDialog(downloadCode, key) {
	        	this.dialogVisible = true
                this.downloadCode = downloadCode
                this.deleteKey = key
            },
	        handleDelete() {
                post('/api/contract-web/file/delete', {
	                downloadCode: this.downloadCode
                }).then(result => {
	                showNotify('success', '删除成功')
                    this.fileList.splice(this.deleteKey, 1)
	                this.templateForm.attachments.splice(this.deleteKey, 1)
	                this.dialogVisible = false
                })
            },
            backToList() {
	        	this.$router.push('templateList')
            },
	        backToListTwo() {
		        this.$router.back()
            },
	        submitForm(formName) {
	        	if(!this.templateForm.attachments.length) {
			        showNotify('error', '解决方案不能为空！')
                    return false
                }
	        	let url = this.tplId ? '/api/contract-web/contract-tpl/update-contract-tpl' : '/api/contract-web/contract-tpl/add-contract-tpl'

		        this.$refs[formName].validate(valid => {
			        if (valid) {
			        	let templateForm = _.cloneDeep(this.templateForm)
                        let serviceTypeArr = []
                        let status
                        _.forEach(templateForm.industryTypes, value => {
                            if(value) {
                                let service = _.find(this.searchOptions.IndustryType, item => {
                                    return item.text === value
                                })
                                service && serviceTypeArr.push(service.value)
                            }
                        })
				        templateForm.industryTypes = serviceTypeArr
                        status = _.find(this.searchOptions.ValidationType, item => {
                            return item.text === templateForm.status
                        })
				        templateForm.status = status.value

			        	// templateForm.referIds = this.referArr
                        if(this.tplId) templateForm.id = this.tplId
				        post(url, templateForm).then(result => {
					        showNotify('success', this.tplId ? '编辑成功' : '新建成功')
					        this.backToList()
				        })
			        }else {
				        showNotify('error', '请检查输入项错误！')
			        }
		        })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .demo-contractForm {
        width: 800px;
    }
    .el-checkbox {
        margin-right: 15px;
    }
    .ml20 {
        margin-left: 20px;
    }
    .upload-demo {
        display: inline-block;
    }
</style>