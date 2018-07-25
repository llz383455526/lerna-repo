<template>

    <div class="main-container">

        <div style="margin: 0 0 20px; line-height: 22px" class="table-container">
            <span>{{title}}</span>
            <a href="javascript:void(0)" @click="toSetting" style="float: right" v-if="projectId">负责人设置</a>
        </div>

        <el-tabs v-model="activeName" @tab-click="">
            <el-tab-pane label="开发动态" name="first">
                <div style="margin-bottom: 30px;" v-if="step || errorStep">
                    <div class="sub-title">开发动态</div>

                    <el-steps :active="activeStep" finish-status="success" :process-status="!errorStep ? 'finish' : 'error'" align-center>
                        <el-step v-for="item in stepsList" :title="item.name"></el-step>
                    </el-steps>
                </div>

                <div v-if="projectDetail.status >= 1" class="information-container">
                    <div class="sub-title" style="margin-bottom: 10px;">税优地资源引荐信息</div>

                    <el-form :model="formData" ref="formData" :inline="true">
                        <div class="form-item" v-for="(formGroup, index1) in stepOneFormData">
                            <el-form-item :label="item.elementLabel" v-for="(item, index2) in formGroup" :prop="item.property">
                                <span>{{projectDetail[item.property]}}</span>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>

                <div v-if="projectDetail.status >= 2" class="information-container">
                    <div class="sub-title" style="margin-bottom: 10px;">资源地判断人意见（请具体说明）</div>

                    <div style="font-size: 14px;">{{projectDetail.auditMemo}}</div>
                </div>

                <div v-if="projectDetail.status >= 3 && activeStep > 1" class="information-container">
                    <div class="sub-title" style="margin-bottom: 10px;">税优地政策登记</div>

                    <el-form :model="formData" ref="formData" :inline="true">
                        <div class="form-item" v-for="(formGroup, index1) in stepThreeFormData">
                            <el-form-item :label="item.elementLabel" v-for="(item, index2) in formGroup">
                                <span v-if="item.propertyOrigin">{{projectDetail[item.propertyOrigin][item.property]}}</span>
                                <span v-else-if="item.elementType === 'date'">{{projectDetail[item.property] | formatTime('yyyy-MM-dd')}}</span>
                                <span v-else>{{projectDetail[item.property]}}</span>
                            </el-form-item>
                        </div>
                    </el-form>
                </div>

                <div v-if="projectDetail.status >= 4 && activeStep > 2" class="information-container">
                    <div class="sub-title" style="margin-bottom: 10px;">来访结果记录</div>

                    <div style="font-size: 14px;">{{projectDetail.visitMemo}}</div>
                </div>

                <div v-if="projectDetail.status >= 5" class="information-container">
                    <div class="sub-title" style="margin-bottom: 10px;">签约结果</div>

                    <div style="font-size: 14px;">{{projectDetail.statusName}}</div>
                </div>

                <div v-if="step && submitAuthorise">
                    <div class="sub-title" style="margin-bottom: 10px;">{{stepTitle}}</div>
                    <!--{{formData}}-->

                    <div style="margin: 10px 0;" v-if="step !== 'One'">
                        <el-button size="small" @click="dialogVisible = true; remark = ''; remarkId=''">添加备注</el-button>
                    </div>

                    <el-form :model="formData" ref="formData" :rules="rules" :inline="true">
                        <div class="form-item" v-for="(formGroup, index1) in formList">
                            <el-form-item :label="item.elementLabel"
                                          :prop="item.ruleProperty || item.property"
                                          :key="item.property"
                                          v-for="(item, index2) in formGroup"
                                          :class="{'no-margin': item.elementType === 'textarea' && !item.elementLabel}">
                                <div v-if="item.elementType === 'text'" class="normal-item" :class="{'short-item': item.shortText, 'auto-item': item.autoText}">
                                    <el-input
                                            v-model="formList[index1][index2].value"
                                            :placeholder="item.elementPlaceholder">
                                        <template v-if="item.subLabel" slot="prepend">{{item.subLabel}}</template>
                                    </el-input>
                                </div>

                                <div v-else-if="item.elementType === 'radio'">
                                    <el-radio v-for="option in item.elementOptions" v-model="formList[index1][index2].value" :label="option" :key="option">{{option}}</el-radio>
                                </div>

                                <div v-else-if="item.elementType === 'location'" class="place-container">
                                    <area-select
                                            :data="pcaa"
                                            :level="2"
                                            type="code"
                                            v-model="formList[index1][index2].value">
                                    </area-select>
                                </div>

                                <div v-else-if="item.elementType === 'textarea'" class="textarea-container">
                                    <el-input
                                            :rows="4"
                                            type="textarea"
                                            v-model="formList[index1][index2].value"
                                            :placeholder="item.elementPlaceholder">
                                    </el-input>
                                </div>

                                <div v-else-if="item.elementType === 'checkbox'">
                                    <el-checkbox-group v-model="formList[index1][index2].value">
                                        <el-checkbox v-for="option in item.elementOptions" :label="option" :key="option"></el-checkbox>
                                    </el-checkbox-group>
                                </div>

                                <div v-else-if="item.elementType === 'select'" class="normal-item">
                                    <el-select v-model="formList[index1][index2].value" placeholder="请选择" style="width:100%;">
                                        <el-option v-for="item in item.elementOptions" :key="item.id" :label="item.name"
                                                   :value="item.id"></el-option>
                                    </el-select>
                                </div>

                                <div v-else-if="item.elementType === 'date'" class="normal-item">
                                    <el-date-picker
                                            v-model="formList[index1][index2].value"
                                            type="date"
                                            value-format="yyyy-MM-dd"
                                            placeholder="选择日期">
                                    </el-date-picker>
                                </div>

                                <div v-else-if="item.elementType === 'upload'">
                                    <el-upload
                                            class="upload-demo ml50"
                                            :action=uploadUrl
                                            :on-error="handleError"
                                            :before-upload="handleBeforeUpload"
                                            :http-request="handleHttpRequest"
                                            :limit="1"
                                            :file-list="formList[index1][index2].value">
                                        <el-button size="small" type="primary">点击上传</el-button>
                                    </el-upload>

                                </div>

                            </el-form-item>
                        </div>

                        <el-form-item>
                            <el-button type="primary" @click="projectPause('pause')" v-if="projectDetail.actions.pause">暂停</el-button>
                            <el-button type="primary" @click="projectPause('save')" v-if="projectDetail.actions['save_policy']">保存</el-button>
                            <el-button type="primary" @click="submit" v-if="submitAuthorise">{{btnText}}</el-button>
                            <el-button @click="reject" v-if="projectDetail.actions.audit">审核不通过</el-button>
                            <el-button @click="reject" v-if="projectDetail.actions.negotiation">访谈不通过</el-button>
                            <el-button @click="reject" v-if="projectDetail.actions.visit">来访不通过</el-button>
                            <!--<el-button @click="backToList">取消</el-button>-->
                        </el-form-item>
                    </el-form>
                </div>
            </el-tab-pane>
            <el-tab-pane label="最新动态" name="second" v-if="step !== 'One'">
                <div class="table-container">
                    <el-table
                            :data="remarkList.data">
                        <el-table-column prop="processedAt" label="时间"></el-table-column>
                        <el-table-column prop="stageName" label="阶段"></el-table-column>
                        <el-table-column prop="statusName" label="完成情况"></el-table-column>
                        <el-table-column prop="memo" label="备注"></el-table-column>
                        <el-table-column prop="processedByname" label="备注人"></el-table-column>

                        <el-table-column label="操作" width="120" fixed="right">
                            <template slot-scope="scope">
                                <el-button @click="editRemark(scope.row)" type="text" size="medium" style="padding:0;">编辑</el-button>
                                <el-button @click="deleteRemark(scope.row.id)" type="text" size="medium" style="padding:0;">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

                <ayg-pagination v-if="remarkList.total" :total="remarkList.total"
                                v-on:handleSizeChange="handleSizeChange" :currentSize="pageSize"
                                v-on:handleCurrentChange="handleCurrentChange" :currentPage="pageIndex"></ayg-pagination>
            </el-tab-pane>
        </el-tabs>

        <el-dialog title="添加备注" :visible.sync="dialogVisible">
            <div class="dialog-content">
                <el-input
                    :rows="4"
                    type="textarea"
                    v-model="remark">
                </el-input>
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addRemark">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import { post, get, formPost } from '../../store/api'

    import _ from 'lodash'

    import { pcaa } from 'area-data'

    import { showNotify } from '../../plugin/utils-notify'

    import { stepFiveFormData, stepFourFormData, stepThreeFormData, stepTwoFormData, stepOneFormData } from './formData'

    import { baseUrl } from '../../config/address'

    import { showConfirm } from '../../plugin/utils-message'

	export default {
		created() {
		    this.projectId = this.$route.query.id

			this.getDetail()

            this.getRemarkList()

			this.uploadUrl = `${baseUrl}/api/salemgt/upload_contract`

        },
        data() {
        	return {
        		title: '税优地资源引荐信息申请',
                projectId: '',
                step: '',
                stepTitle: '税优地资源引荐信息',
                submitAuthorise: false,
                stepsList: [{
        			name: '资源推荐'
                },{
	                name: '开发审核'
                },{
	                name: '谈判'
                },{
	                name: '来访'
                },{
	                name: '签约'
                }],
                activeStep: 0,
                formList: {},
		        pcaa: pcaa,
                btnText: '',
                projectDetail: {actions: {}},
                editOptions: {},
                editUsers: [],
                stepOneFormData: stepOneFormData,
		        stepTwoFormData: stepTwoFormData,
		        stepThreeFormData: stepThreeFormData,
		        stepFourFormData: stepFourFormData,
		        stepFiveFormData: stepFiveFormData,
		        fileData: {},
		        uploadUrl: '',
		        dialogVisible: false,
                remark: false,
                remarkList: [],
                pageIndex: 1,
                pageSize: 10,
		        remarkId: '',
		        activeName: 'first',
                errorStep: false,
            }
        },
		computed: {
			formData() {
				let formData = {}
				let formList = _.cloneDeep(this.formList)
                // let formList = this.formList

				_.forEach(formList, formGroup => {
					_.forEach(formGroup, (item, key) => {
						let val = item.value
						if(val && typeof val === 'object' && item.type !== 'arr') val = val.toString()
						// formData[item.property] = val
                        if(item.elementLabel) {

                            if(item.elementType === 'radio' && val === _.last(item.elementOptions)) {
                                val = formGroup[key+1].value
                            }
                            if(item.elementType === 'location') {
                                [formData.provinceId, formData.cityId, formData.regionId] = val.split(',')
                                return
                            }

                            if(item.elementType === 'checkbox') {
                            	let last = _.last(item.elementOptions)
	                            let elseVal = formGroup[key+1].value
	                            if(elseVal && val.length) val = _.replace(val.join(','), last, elseVal).split(',')
                            }

                            if(item.propertyOrigin) {
                            	if(formData[item.propertyOrigin]) formData[item.propertyOrigin][item.property] = val
                                else {
                            		formData[item.propertyOrigin] = {}
		                            formData[item.propertyOrigin][item.property] = val
	                            }
                            }else {
                            	formData[item.property] = val
                            }
                        }else if(item.add) {
	                        formData[formGroup[0].property] += `|${item.value}`
                        }else if(item.elementType === 'textarea' || item.validValue) {
	                        formData[item.property] = val

                            /*if(item.type === 'upload' && !item.multiple) {
	                            formData[item.property] = _.last(val)
                            }*/
                        }
					})
				})

				return formData
			},
            /*rules() {
				let rules = {}

				if(this.step) {
					let formList = _.cloneDeep(this[`step${this.step}FormData`])

					_.forEach(formList, formGroup => {
						_.forEach(formGroup, (item, key) => {
                            if(item.elementLabel && item.elementRequired) {
	                            let rule = {
		                            required: true
	                            }

	                            switch (item.elementType) {
		                            case 'checkbox':
                                    case 'location':
		                            case 'select':
		                            case 'radio':
			                            rule.message = `请选择${item.elementLabel.substr(0, item.elementLabel.length - 1)}`
			                            rule.trigger = 'change'
                                        break
		                            default:
			                            rule.message = `请填写${item.elementLabel.substr(0, item.elementLabel.length - 1)}`
			                            rule.trigger = 'blur'
	                            }

	                            if(item.type === 'arr') rule.type = 'array'

	                            if(item.elementType === 'location') rules[item.ruleProperty] = rule
	                            else rules[item.property] = rule
                            }
						})
					})
                }

                // console.log(rules)
				return rules
            }*/
		},
        methods: {
			getOptions() {
			    return get('/api/salemgt/config/options', {})
            },
            getUsers() {
	            return get('/api/salemgt/config/users', {})
            },
            stepThree() {
				Promise.all([this.getOptions(), this.getUsers()])
                    .then(result => {
                    	[this.editOptions, this.editUsers] = result

                        let formList = _.cloneDeep(this[`step${this.step}FormData`])
                        this.formList = this.formatFormList(formList)
                    })
            },
            formatFormList(formList) {
	            _.forEach(formList, formGroup => {
		            _.forEach(formGroup, (item, key) => {

			            if((item.elementType === 'checkbox' || item.elementType === 'radio') && !item.elementOptions) {
			            	let options = this.editOptions[item.optionKey]
                            options.push('其它')
				            item.elementOptions = options
			            }else if(item.elementType === 'select' && item.type === 'users') {
				            item.elementOptions = this.editUsers
                        }

			            if(item.elementLabel) {
				            let val = item.propertyOrigin ? this.projectDetail[item.propertyOrigin][item.property] : this.projectDetail[item.property]
				            switch (item.elementType) {
					            case 'location':
						            val = this.projectDetail.landProvinceId ?
                                        [this.projectDetail.landProvinceId.toString(), this.projectDetail.landCityId.toString(), this.projectDetail.landRegionId.toString()] : []
						            break
					            case 'checkbox':
					            	if(val.length) {
							            val = val.split(',')
							            let last = _.last(item.elementOptions)

							            _.forEach(val, (v, index) => {
								            if(item.elementOptions.indexOf(v) === -1) {
									            formGroup[key+1].value = v
									            val[index] = last
								            }
							            })

							            item.value = val
                                    }
						            break
					            case 'radio':
						            if(val && item.elementOptions.indexOf(val) === -1) {
							            formGroup[key+1].value = val
							            val = _.last(item.elementOptions)
						            }
						            break
					            default:

				            }

				            if(val && item.elementType !== 'checkbox') item.value = val
			            }
		            })
	            })

                return formList
            },
            reject() {
                this.submit(false)
            },
            submit(type) {
            	let url = '/api/salemgt'
                let formData

                switch (this.step) {
                    case 'One':
                    	url += '/taxlanding/apply'
                    	break
                    case 'Two':
	                    url += '/taxlanding/audit'
	                    break
                    case 'Three':
                    	url += '/taxlanding/change_negotiate_state'
	                    formData = {
		                    landPolicyInfo: _.cloneDeep(this.formData)
	                    }
                    	break
	                case 'Four':
		                url += '/taxlanding/change_visit_state'
		                break
	                case 'Five':
		                url += '/taxlanding/change_sign_state'
		                formData = {}
                        let signType =  this.formData.signType
                        if(signType) formData.pass = signType === '确认签约'
		                break
                }
	            if(!formData) formData = _.cloneDeep(this.formData)

                let stepStr = 'TwoThreeFour'
                if(stepStr.indexOf(this.step) !== -1) {
	                formData.pass = true
                }

	            if(!type) formData.pass = false

                if(this.projectId) formData.id = this.projectId

                // console.log(formData)

	            if(!(_.has(formData, 'pass') && !formData.pass)) {
		            this.$refs['formData'].validate(valid => {
			            if (valid) {
                            this.submitForm(url, formData)
			            }else {
				            showNotify('error', '请检查输入项错误！')
			            }
		            })
	            }else {
		            this.submitForm(url, formData)
                }


            },
            submitForm(url, formData) {
	            post(url, formData)
		            .then(result => {
			            this.showNotify()
		            })
            },
	        projectPause(type) {
				let url
		        let formData = _.cloneDeep(this.formData)
		        formData.id = this.projectId

                switch (type) {
                    case 'pause':
                    	url = '/api/salemgt/taxlanding/pause'
                        break
                    case 'save':
                    	url = '/api/salemgt/taxlanding/save_policy'
                        break
                }

                post(url, formData).then(result => {
                    this.showNotify()
                })
            },
            showNotify() {
	            showNotify('success', '操作成功')
	            this.$router.push('list')
            },
            getDetail() {
	            if(!this.projectId) {
		            this.step = 'One'
		            // this.step = 'Three'
		            // this.stepThree()
		            this.btnText = '提交审核'
                    this.submitAuthorise = true

		            this.formList = _.cloneDeep(this[`step${this.step}FormData`])
		            // this.formList = _.cloneDeep(this.stepThreeFormData)
	            }else {
		            get(`/api/salemgt/taxlanding/${this.projectId}`, {})
			            .then(result => {
			            	let projectDetail = result
                            let actions = {}

                            _.forEach(projectDetail.actions, item => {
                            	actions[item] = true
                            })
				            projectDetail.actions = actions
                            let retainRatio = projectDetail.retainRatio.split('|')
                            projectDetail.retainRatio = `营改增项目增值税${retainRatio[0] || 0}% 企业所得税${retainRatio[1] || 0}% 个人所得税企业所得税${retainRatio[2] || 0}%`

                            projectDetail.landBizTypes = projectDetail.landBizTypes ? projectDetail.landBizTypes.join(',') : []
				            projectDetail.landIndustrys = projectDetail.landIndustrys ? projectDetail.landIndustrys.join(',') : []

				            this.projectDetail = projectDetail
                            // console.log(projectDetail)

                            let step = {
			            		1: 'Two',
                                2: 'Three',
                                3: 'Four',
                                4: 'Five'
                            }

                            let errorStep = {
			            		10: 1,
                                11: 2,
                                12: 3,
                                13: 4
                            }

                            this.step = step[projectDetail.status]
                            let status = projectDetail.status
                            if(status <= 5) {
	                            this.activeStep = status
                            }else {
	                            this.activeStep = errorStep[status]
                                this.errorStep = true
                            }

                            if(this.step) {
	                            switch (this.step) {
		                            case 'Two':
			                            this.submitAuthorise = projectDetail.actions.audit
			                            this.stepTitle = ' 资源地判断人意见（请具体说明）'
			                            this.btnText = '审核通过'
			                            this.title = '税优地资源审核'
			                            // this.formList = _.cloneDeep(this[`step${this.step}FormData`])
			                            break
		                            case 'Three':
			                            this.stepThree()
			                            this.submitAuthorise = projectDetail.actions.negotiation
			                            this.stepTitle = ' 税优地政策登记'
			                            this.btnText = '提交访谈'
			                            this.title = '税优地资源审核'
			                            break
		                            case 'Four':
			                            this.submitAuthorise = projectDetail.actions.visit
			                            this.stepTitle = ' 来访结果记录'
			                            this.btnText = '来访通过'
			                            this.title = '税优地资源审核'

                                        let formList = _.cloneDeep(this[`step${this.step}FormData`])
			                            _.forEach(formList, formGroup => {
				                            _.forEach(formGroup, (item, key) => {
                                                if(item.property === 'memo') item.value = projectDetail.visitMemo
				                            })
			                            })
			                            this.formList = formList

			                            break
		                            case 'Five':
			                            this.submitAuthorise = projectDetail.actions.sign
			                            this.stepTitle = ' 签约结果'
			                            this.btnText = '确认'
			                            this.title = '税优地资源审核'
			                            break
	                            }

	                            if(_.isEmpty(this.formList)) this.formList = _.cloneDeep(this[`step${this.step}FormData`])
                            }

			            })
	            }
            },
	        handleError() {
		        showNotify('error', '上传失败!');
	        },
	        handleBeforeUpload(file) {
		        /*const AllImgExt = ".docx";
		        let extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
		        if (AllImgExt !== extName) {
			        showNotify('error', '文件类型错误')
			        return false
		        }*/

		        let fileData = new FormData()
		        fileData.append('fileName', file.name)
		        fileData.append('file', file)
		        fileData.append('id', this.projectId)
		        this.fileData = fileData
	        },
	        handleHttpRequest() {
		        formPost('/api/salemgt/upload_contract', this.fileData)
			        .then(result => {
				        showNotify('success', '上传成功!')
			        })
	        },
	        toSetting() {
				this.$router.push({
                    path: 'setting',
                    query: {
                    	id: this.projectId,
                        status: this.projectDetail.status
                    }
                })
            },
            addRemark() {
				let url = this.remarkId ? '/taxlanding/update_remarks' : '/taxlanding/add_remarks'
				let param = {
					// id: this.projectId,
					content: this.remark
				}

				param.id = this.remarkId ? this.remarkId : this.projectId

                post(`/api/salemgt${url}`, param)
                    .then(result => {
                        showNotify('success', this.remarkId ? '修改备注成功' : '添加备注成功')
                        this.getRemarkList()
                        this.dialogVisible = false
                    })
            },
            editRemark(remark) {
				this.remark = remark.memo
                this.remarkId = remark.id
                this.dialogVisible = true
            },
            deleteRemark(id) {
	            showConfirm({
                    msg: '确认删除此条状态？',
		            confirmCallback: () => {
                        post('/api/salemgt/taxlanding/delete_remarks', {
                        	id: id
                        }).then(result => {
	                        showNotify('success', '删除成功')
	                        this.getRemarkList()
                        })
		            }
                })
            },
	        handleSizeChange(value) {
		        this.pageSize = value
		        this.pageIndex = 1
		        this.getRemarkList()
	        },
	        handleCurrentChange(value) {
		        this.pageIndex = value
		        this.getRemarkList()
	        },
            getRemarkList() {
                post('/api/salemgt/taxlanding/process/list', {
                	infoId: this.projectId,
	                pageNo: this.pageIndex,
                    pageSize: this.pageSize
                }).then(result => {
                	this.remarkList = result
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

    .main-container {
        margin-top: 15px;
        background-color: #fff;
        padding: 15px;
        margin-bottom: 50px;
    }

    .edit-disabled .el-form-item {
        margin-bottom: 0;
    }

    .no-margin {
        margin-top: 0;
    }

    .up-margin {
        margin-bottom: -10px;
    }

    .normal-item {
        width: 300px;
    }

    .short-item {
        width: 220px;
    }

    .auto-item {
        width: auto;
    }

    .textarea-container {
        width: 1070px;
    }

    .information-container {
        margin-bottom: 20px;

        .el-form-item {
            margin-bottom: 0;
        }
    }

    .dialog-content {
        width: 100%;
    }

</style>




















