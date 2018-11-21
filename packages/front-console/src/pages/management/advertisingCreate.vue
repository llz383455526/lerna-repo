<template>
    <div class="bg-white p15">
        <el-form :model="advertisingForm" :rules="rules" ref="advertisingForm" label-width="200px" class="demo-contractForm">
            <el-form-item label="广告标题" prop="title">
                <el-input v-model="advertisingForm.title"></el-input>
            </el-form-item>

            <el-form-item label="展示平台" prop="appLocation" >
                <el-select v-model="advertisingForm.appLocation" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in searchOptions.AdAppLocationType" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="广告位置" prop="appPageLocation" >
                <el-select v-model="advertisingForm.appPageLocation" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in AdAppPageLocationTypeOptions" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="广告内容" prop="content">
                <el-input type="textarea" v-model="advertisingForm.content"></el-input>
            </el-form-item>

            <el-form-item label="广告链接" prop="linkUrl">
                <el-input v-model="advertisingForm.linkUrl"></el-input>
            </el-form-item>

            <el-form-item label="广告图片">
                <div style="display: flex">
                    <img v-if="imgUrl" :src="imgUrlNew" alt="" style="width: 40px; height: 40px; margin-right: 10px;">
                    <el-upload
                            class="upload-demo"
                            :action=uploadUrl
                            :on-error="handleError"
                            :before-upload="handleBeforeUpload"
                            :http-request="handleHttpRequest"
                            accept="image/*"
                            :show-file-list=false>
                        <el-button size="small" type="primary">点击上传</el-button>
                    </el-upload>
                </div>
            </el-form-item>

            <el-form-item label="显示时间范围:" prop="dateValue" size="small" >
                <el-date-picker
                        v-model="advertisingForm.dateValue"
                        type="datetimerange"
                        :unlink-panels="true"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd hh:mm:dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="是否显示" prop="display">
                <el-radio-group v-model="advertisingForm.display">
                    <el-radio v-for="item in searchOptions.DisplayType" :key="item" :label="item.text"></el-radio>
                </el-radio-group>
            </el-form-item>
            
            <el-form-item label="排序" prop="orderSeq">
                <el-input v-model="advertisingForm.orderSeq"></el-input>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('advertisingForm')">保存</el-button>
                <el-button @click="backToList">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	import { post, get, formPost } from "../../store/api"

	import _ from 'lodash'

	import { showNotify } from '../../plugin/utils-notify'

	import { baseUrl } from '../../config/address'

	export default {
		created() {
			this.advertisingId = this.$route.query.id

			this.getSearchOptions()

			this.uploadUrl = baseUrl + "/api/sysmgr-web/file/upload"
        },
        data() {
			return {
				searchOptions: {},
				advertisingForm: {
					title: '',
					appLocation: '',
					appPageLocation: '',
					content: '',
					display: '',
					orderSeq:'',
					dateValue: '',
					linkUrl: ''
                },
				rules: {
					title: [
						{ required: true, message: '请填写广告标题', trigger: 'blur' }
                    ],
					appLocation: [
						{required: true, message: '请选择展示平台', trigger: 'change'}
					],
					appPageLocation: [
						{required: true, message: '请选择广告位置', trigger: 'change'}
					],
					content: [
						{ required: true, message: '请填写广告内容', trigger: 'blur' }
					],
					dateValue: [
						{ required: true, message: '请选择显示时间', trigger: 'blur' }
					],
					display: [
						{ required: true, message: '请选择显示状态', trigger: 'change' }
					],
					orderSeq: [
						{ required: true, message: '请填写排序', trigger: 'blur' }
					],
					linkUrl: [
						{ required: true, message: '请填写广告链接', trigger: 'blur' }
                    ]
                },
				imgUrl: '',
				uploadUrl: '',
				formData: {},
                advertisingId: '',
				advertisingDetail: {},
				imgUrlNew: ''
            }
        },
		computed: {
			AdAppPageLocationTypeOptions() {
				let arr = []
				_.forEach(this.searchOptions.AdAppPageLocationType, item => {
					if(item.flag === this.advertisingForm.appLocation) arr.push(item)
				})

				return arr
			}
		},
        methods: {
			getDetail() {
                get('/api/sysmgr-web/ad/detail', {
                	id: this.advertisingId
                }).then(result => {
	                this.advertisingForm = {
		                title: result.title,
		                appLocation: result.appLocation,
		                appPageLocation: result.appPageLocation,
		                content: result.content,
		                display: _.find(this.searchOptions.DisplayType, item => item.value === result.display).text,
		                dateValue: [result.startTime, result.endTime],
		                orderSeq: result.orderSeq,
		                linkUrl: result.linkUrl
                    }

                    this.imgUrl = result.imgUrl
                    this.imgUrlNew = `${baseUrl}/api/sysmgr-web/file/img-scan?downloadCode=${result.imgDownloadCode}`
                })
            },
	        getSearchOptions() {
		        post('/api/sysmgr-web/commom/options?enumTypes=AdAppLocationType,AdAppPageLocationType,DisplayType', {})
			        .then(result => {
				        this.searchOptions = result

                        if(this.advertisingId) this.getDetail()
			        })
	        },
	        backToList() {
		        this.$router.back()
	        },
	        backToListNew() {
		        this.$router.push('advertisingList')
            },
	        submitForm(formName) {
		        let url = this.advertisingId ? '/api/sysmgr-web/ad/update' : '/api/sysmgr-web/ad/create'

		        this.$refs[formName].validate(valid => {
			        if (valid) {
				        let advertisingForm = _.cloneDeep(this.advertisingForm)

				        advertisingForm.imgUrl = this.imgUrl

                        let display = _.find(this.searchOptions.DisplayType, item => item.text === advertisingForm.display)
				        advertisingForm.display = display.value

				        let startAt = advertisingForm.dateValue[0]
				        let endAt = advertisingForm.dateValue[1]
				        advertisingForm.startTime = startAt
				        advertisingForm.endTime = endAt
				        delete advertisingForm.dateValue

                        if(this.advertisingId) advertisingForm.id = this.advertisingId

                        post(url, advertisingForm)
                            .then(result => {
	                            showNotify('success', this.contractId ? '编辑成功' : '新建成功')
	                            this.backToListNew()
                            })

			        }else {
				        showNotify('error', '请检查输入项错误！')
			        }
		        })
	        },
	        handleError() {
		        showNotify('error', '上传失败!');
	        },
	        handleBeforeUpload(file) {
		        let formData = new FormData()
		        formData.append('fileName', file.name)
		        formData.append('file', file)
                formData.append('targetType', 'ad_img')
		        this.formData = formData
	        },
	        handleHttpRequest() {
		        formPost('/api/sysmgr-web/file/upload', this.formData)
			        .then(result => {
			        	this.imgUrl = result.referId
				        this.imgUrlNew = `${baseUrl}/api/sysmgr-web/file/img-scan?downloadCode=${result.downloadCode}`
				        showNotify('success', '上传成功!')
			        })
	        },
        }
    }
</script>

<style lang="scss" scoped>
    .demo-contractForm {
        width: 800px;
    }
</style>

<style lang="scss">
    .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
        margin-left: 0;
    }
</style>















