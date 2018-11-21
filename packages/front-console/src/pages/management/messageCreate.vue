<template>

    <div class="bg-white p15">
        <el-form :model="messageForm" :rules="rules" ref="messageForm" label-width="200px" class="demo-contractForm">
            <el-form-item label="消息标题" prop="title">
                <el-input v-model="messageForm.title"></el-input>
            </el-form-item>

            <el-form-item label="展示平台" prop="appLocation" >
                <el-select v-model="messageForm.appLocation" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in searchOptions.AdAppLocationType" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="展示位置" prop="appPageLocation" >
                <el-select v-model="messageForm.appPageLocation" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in AdAppPageLocationTypeOptions" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="消息内容" prop="content">
                <el-input type="textarea" v-model="messageForm.content"></el-input>
            </el-form-item>

            <el-form-item label="显示时间范围:" prop="dateValue" size="small" >
                <el-date-picker
                        v-model="messageForm.dateValue"
                        type="datetimerange"
                        :unlink-panels="true"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd hh:mm:dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="是否显示" prop="display">
                <el-radio-group v-model="messageForm.display">
                    <el-radio v-for="item in searchOptions.DisplayType" :key="item" :label="item.text"></el-radio>
                </el-radio-group>
            </el-form-item>

            <el-form-item>
                <el-button type="primary" @click="submitForm('messageForm')">保存</el-button>
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
			this.messageId = this.$route.query.id

			this.getSearchOptions()
        },
        data() {
			return {
				searchOptions: {},
                messageId: '',
                messageForm: {
	                title: '',
	                appLocation: '',
	                appPageLocation: '',
	                content: '',
	                display: '',
	                dateValue: ''
                },
				rules: {
					title: [
						{ required: true, message: '请填写消息标题', trigger: 'blur' }
					],
					appLocation: [
						{required: true, message: '请选择展示平台', trigger: 'change'}
					],
					appPageLocation: [
						{required: true, message: '请选择广告位置', trigger: 'change'}
					],
					content: [
						{ required: true, message: '请填写消息内容', trigger: 'blur' }
					],
					dateValue: [
						{ required: true, message: '请选择显示时间', trigger: 'blur' }
					],
					display: [
						{ required: true, message: '请选择显示状态', trigger: 'change' }
					]
				},
            }
        },
		computed: {
			AdAppPageLocationTypeOptions() {
				let arr = []
				_.forEach(this.searchOptions.AdAppPageLocationType, item => {
					if(item.flag === this.messageForm.appLocation) arr.push(item)
				})

				return arr
			}
		},
        methods: {
	        getDetail() {
                get('/api/sysmgr-web/notice/detail', {
	                id: this.messageId
                }).then(result => {
	                this.messageForm = {
		                title: result.title,
		                appLocation: result.appLocation,
		                appPageLocation: result.appPageLocation,
		                content: result.content,
		                display: _.find(this.searchOptions.DisplayType, item => item.value === result.display).text,
		                dateValue: [result.startTime, result.endTime]
	                }
                })
            },
	        getSearchOptions() {
		        post('/api/sysmgr-web/commom/options?enumTypes=AdAppLocationType,AdAppPageLocationType,DisplayType', {})
			        .then(result => {
				        this.searchOptions = result

				        if(this.messageId) this.getDetail()
			        })
	        },
	        backToList() {
		        this.$router.back()
	        },
	        backToListNew() {
		        this.$router.push('messageList')
	        },
	        submitForm(formName) {
		        let url = this.messageId ? '/api/sysmgr-web/notice/update' : '/api/sysmgr-web/notice/create'

		        this.$refs[formName].validate(valid => {
			        if (valid) {
				        let messageForm = _.cloneDeep(this.messageForm)

				        let display = _.find(this.searchOptions.DisplayType, item => item.text === messageForm.display)
				        messageForm.display = display.value

				        let startAt = messageForm.dateValue[0]
				        let endAt = messageForm.dateValue[1]
				        messageForm.startTime = startAt
				        messageForm.endTime = endAt
				        delete messageForm.dateValue

				        if(this.messageId) messageForm.id = this.messageId

				        post(url, messageForm)
					        .then(result => {
						        showNotify('success', this.messageId ? '编辑成功' : '新建成功')
						        this.backToListNew()
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
</style>

<style lang="scss">
    .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
        margin-left: 0;
    }
</style>












