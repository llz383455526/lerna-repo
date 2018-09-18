<template>
	<div style="margin-top: 15px;background-color: #fff; padding: 15px;">
		<div style="margin: 0 0 20px;">上传文件</div>
			<el-form :model="formInfo" :rules="rules" ref="formInfo" style="width: 800px;" label-width="100px" label-position="left" size="small">
			<el-form-item label="发放方式：">批量导入
			</el-form-item>
			<el-form-item label="客户公司:" prop="customerCompanyId">
                <el-select filterable v-model="formInfo.customerCompanyId" placeholder="请选择" @change="getAppList">
                    <el-option v-for="(item, index) in customCompanyList" :label="item.name" :value="item.id" :key="index" ></el-option>
                </el-select>
            </el-form-item>
			<el-form-item label="商户名称:" prop="appId">
                <el-select filterable v-model="formInfo.appId" placeholder="请选择" @change="getAppId">
                    <el-option v-for="(item, index) in customNameList" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
			<el-form-item label="发放渠道：" prop="type">
				<el-select placeholder="请选择" v-model="formInfo.type" v-on:change="setImportOptions">
					<el-option v-for="(item, index) in typeList" :label="item.text" :value="item.value" :key="index">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item label="上传文件：">
				<div class="input-container">
					<div class="input">
						<div :class="{'upload-finish' : formInfo.taskId, 'upload-logo' : true }" style="position: relative;">
							<ayg-file-uploader v-if="importOptions.targetType && formInfo.customerCompanyId && formInfo.appId" url="/api/sysmgr-web/file/upload-ext" :options="importOptions" :needProgress="true" progressUrl="/api/sysmgr-web/file/progress"></ayg-file-uploader>
						</div>
						<div v-if="formInfo.taskId && giveOutFile && giveOutFile.state === 30">
								<div class="upload-file">
									<div class="file-logo"></div>
									<span>{{giveOutFile.fileName}}</span>
								</div>
						</div>
					</div>
					<div style="margin-top: -20px; font-size: 12px; color: #999999;">
					请上传小于5M的xls或xlsx格式文件。
					</div>
				</div>
			</el-form-item>
			<el-form-item label="备注：" prop="memo">
				<el-input type="textarea" :rows="4" placeholder="请输入内容" v-model="formInfo.memo">
				</el-input>
			</el-form-item>
		</el-form>
		<div style="padding: 15px;">
	    <el-button type="primary" @click="nextStep" size="small">下一步</el-button>
		<el-button @click="close" size="small">关闭</el-button>
		</div>
	</div>
</template>
<script>
	import {mapGetters} from 'vuex'
  	import _ from 'lodash'
  	import {formatTime, urlEncode} from '../../plugin/utils-functions'
	import {checkMoney} from '../../plugin/utils-element-validator'
	import {showNotify} from '../../plugin/utils-notify'
  	import {baseUrl} from '../../config/address'
  	import {post,get} from '../../store/api'
  	import { setTimeout, clearInterval } from 'timers';
  	import aygFileUploader from '../../component/aygFileUploader'
	import {showTopErrorToast} from '../../plugin/utils-toast'
	export default {
		data(){
			return {
        		formInfo:{
					type: '',
					taskId: '',
					memo:'',
					successCount: '',
					failCount:'',
					appId: '',
					customerCompanyId: ''
				},
				rules: {
					type: [
						{
                        	required: true,
                        	message: "请选择类型",
                        	trigger: "blur"
                    	}
					],
					appId: [
						{
							required: true,
							message: "请选择商户",
							trigger: "blur"
						}
					],
					customerCompanyId: [
						{
							required: true,
							message: "请选择公司",
							trigger: "blur"
						}
					]
				},
				giveOutFile:null,
				importOptions: {
					targetType: '',
					targetExt: {
						customerCompanyId: '',
						appId: ''
					}
				},
				errFlag:true,
				errMsg:'',
				isUp: false,
				customNameList: []
      		}
    	},
		components: {
				aygFileUploader
		},
		created(){
			this.$store.dispatch('getTypeList');
			// this.$store.dispatch('getCustomNameList');
			this.$store.dispatch('getCustomCompanyList');
			
		},
		computed: {
				...mapGetters({
					uploadFile: 'uploadFile',
					typeList: 'typeList',
					// customNameList: 'customNameList',
					customCompanyList: 'customCompanyList'
				})
		},
		watch: {
			uploadFile() {
				this.giveOutFile = this.uploadFile
				if(this.giveOutFile.state === 30){
					this.errFlag = false;
					this.formInfo.taskId = this.giveOutFile.taskId;
					this.formInfo.successCount = this.giveOutFile.successCount;
					this.formInfo.failCount = this.giveOutFile.failCount;
					this.isUp = true
				}else{
					this.errFlag = true;
					this.errMsg = this.giveOutFile.desc;
				}
			}
		},
		methods: {
			setImportOptions(val){
				this.formInfo.taskId = ''
				this.importOptions.targetType = 'pay_order_import_' +val
			},
			getAppList() {
				get('/api/sysmgr-web/commom/app-list', {
					companyId: this.formInfo.customerCompanyId
				}).then(data => {
					this.formInfo.appId = ''
					this.importOptions.targetExt.appId = ''
					this.formInfo.taskId = ''
					this.customNameList = data
				})
				this.importOptions.targetExt.customerCompanyId = this.formInfo.customerCompanyId
			},
			getAppId() {
				this.formInfo.taskId = ''
				this.importOptions.targetExt.appId = this.formInfo.appId
				console.log(this.importOptions)
			},
		 	nextStep() {
				// if (this.formInfo.type == '') {
				// 		showTopErrorToast('请选择类型');
				// 		return;
				// }
				if (this.formInfo.taskId == '') {
						showTopErrorToast('请上传数据');
						return;
				}
				this.$refs.formInfo.validate(valid => {
					if(valid) {
						if(this.errFlag){
							showTopErrorToast(this.errMsg);
		 					return;
		 				}
      					sessionStorage.setItem('offlineSalaryUploadInfo', JSON.stringify(this.formInfo))
						this.$router.push('offlineSalaryImport');
					}
				})
			},
			close(){
				this.formInfo.type == ''
				this.formInfo.taskId == ''
				this.formInfo.memo == ''
				this.$router.push('offlineSalaryManager');
			}
		}
	}
</script>
<style>

</style>
    
