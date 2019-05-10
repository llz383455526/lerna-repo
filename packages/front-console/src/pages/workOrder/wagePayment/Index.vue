<template>
	<div>
		<div class="content">
            <div class="mtitle">选择发放渠道</div>
            <div class="mcontent">
                <el-form :model="applyForm" :inline="true" :rules="rules" ref="applyForm">
                    <el-form-item prop="appId">
                        <el-select size="small" class="form_input_short" v-model="applyForm.appId" placeholder="请选择商户" @change="getOption" :disabled="formInfo.taskId ? true : false">
                            <el-option v-for="e in apps" :value="e.value" :label="e.text" :key="e.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="serviceCompanyId">
                        <el-select size="small" class="form_input_short" v-model="applyForm.serviceCompanyId" placeholder="请选择服务商" @change="getServiceCompanyName" :disabled="formInfo.taskId ? true : false">
                            <el-option v-for="e in option.appInfoList" :value="e.serviceCompanyId" :label="e.serviceCompanyName" :key="e.serviceCompanyId"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item prop="channelType">
                        <el-select size="small" class="form_input_short" v-model="applyForm.channelType" placeholder="请选择渠道" @change="getBalance" :disabled="formInfo.taskId ? true : false">
                            <el-option v-for="e in channelTypes" :value="e.value" :label="e.text" :key="e.value"></el-option>
                        </el-select>
                    </el-form-item>
                </el-form>
                <div v-if="balance" class="balance">
                    渠道余额：<span>{{balance.availBalance | formatMoney}}</span>
                </div>
	  		</div>
			<div class="mtitle">上传薪酬明细表</div>
            <div class="mcontent">
				<a class="abtn" href="" download="发放明细导入模板.xlsx" target="_blank" @click.prevent="down">下载模板</a>
				<div>请按照模板填写人员薪酬数据</div>
	  		</div>
			<div class="mcontent">
				<el-upload
                  	class="form_input"
                  	:action="`/api/econtract/template/parsefile`"
                  	:auto-upload="false"
                  	:on-change="upload"
                  	:multiple="false"
                  	:show-file-list="false"
                  	accept=".xlsx, .xls">
                  	  <div class="up_icon">
                  	      <div>点击这里上传</div>
                  	      <div>请上传小于5M的xls或xlsx格式文件</div>
                  	  </div>
                </el-upload>
				<template v-if="pro">
                    <div class="pro_box">
                        <div :style="{ 'width': `${pro}%` }"></div>
                    </div>
                    <span>{{pro}}%</span>
                </template>
			</div>
            <div class="mtitle" v-if="template">收款方短信通知</div>
            <div class="mcontent" v-if="template">
                <el-checkbox @change="setOpenSms" class="mt15">
                    <span class="c6">免费开通短信通知服务</span>
                </el-checkbox>
                <span class="c108EE9" @click="show = true">短信示例</span>
            </div>
			<div class="footer">
				<el-button @click="cancel" size="small">取消</el-button>
				<el-button type="primary" @click="nextStep" size="small">下一步</el-button>
			</div>
			<div class="tip">
				<div>服务说明</div>
				<div>
					由于银行对对公转账的相关限制，薪酬发放时间只能在工作日周一 至 周五 09:30 ~ 15:00 之间进行，超过该时间则顺延至第二个工作日办理。如需按时发放请提前做好相关工作准备。
				</div>
				<div>
					如果您有任何疑问或紧急事项，请及时联系爱员工客服，联系电话：020-37127695。
				</div>
			</div>
		</div>
        <el-dialog title="收款方短信通知" :visible.sync="show" :width="width">
            <el-form :model="inform" :rules="inrules" label-width="85px" style="line-height: 35px" ref="inform">
                <el-form-item label="发放公司：" prop="companyName" class="mb8">
                    <el-input v-model="inform.companyName" size="small" class="form_300"></el-input>
                </el-form-item>
                <el-form-item label="短信通知：">
                    <span class="c6 f14">
                        {{template}}
                    </span>
                </el-form-item>
            </el-form>
            <span class="form_footer" slot="footer">
                <el-button @click="show = false" size="small">取消</el-button>
                <el-button @click="upDateTemplate" type="primary" size="small">确定</el-button>
            </span>
        </el-dialog>
	</div>
</template>
<script>
	import {mapGetters} from 'vuex'
    import _ from 'lodash'
    import {formatTime, urlEncode} from '../../../plugin/utils-functions'
	import {checkMoney} from '../../../plugin/utils-element-validator'
	import {showNotify} from '../../../plugin/utils-notify'
    import { get, post, importPost } from "../../../store/api";
    import { setTimeout, clearInterval } from 'timers';
    import {showTopErrorToast} from '../../../plugin/utils-toast'
	export default {
		data(){
            return {
            	formInfo:{
                    // channelType: '',
	                // serviceCompanyId: '',
                    taskId: '',
                    openSms: false
            	},
            	giveOutFile:null,
            	importOptions: {
	                targetType: 'salary_order'
	            },
	            errFlag:true,
	            errMsg:'',
				isUp: false,
				pro: 0,
				frame: null,
				date: 0,
				referId: '',
                isEnd: true,
                orderMsg: {},
                show: false,
                width: '0',
                inform: {
                    companyName: '',
                    // fund: '',
                    // remark: '',
                    importTaskId: ''
                },
                inrules: {
                    companyName: [
                        {
                            required: true,
                            message: '请填写发放名称',
                            trigger: 'blur'
                        }
                    ],
                    fund: [
                        {
                            required: true,
                            message: '请填写项款名称',
                            trigger: 'blur'
                        }
                    ]
                },
                template: '',
                option: {},
                applyForm: {
                    appId: '',
                    serviceCompanyId: '',
                    channelType: ''
                },
                channelTypes: [],
                rules: {
                    appId: [
                        {
                            required: true,
                            message: '请选择商户',
                            trigger: 'blur'
                        }
                    ],
                    serviceCompanyId: [
                        {
                            required: true,
                            message: '请选择服务商',
                            trigger: 'blur'
                        }
                    ],
                    channelType: [
                        {
                            required: true,
                            message: '请选择渠道',
                            trigger: 'blur'
                        }
                    ]
                },
                balance: '',
                apps: []
            }
        },
        created(){
            // var msg = JSON.parse(localStorage.getItem('userContext')), appId = this.getAppId()
            // if(data.subjectId) {
            //         this.applyForm.appId = msg.subjectId
            //         this.getOption()
            //     }
            get('/api/sysmgr-web/commom/app-list', {
                // companyId: this.getCompanyId(),
                isSalaryPay: 1,
                isEnable: 1
            }).then(data => {
                this.apps = data
                // this.apps.forEach(e => {
                //     if(e.value == appId) {
                //         this.applyForm.appId = e.value
                //         this.getOption()
                //     }
                // })
            })
            // this.width = (558 / window.innerWidth) * 100 + '%'
            // window.onresize = () => {
            //     this.width = (558 / window.innerWidth) * 100 + '%'
            // }
        },
        computed: {
            ...mapGetters({
	            uploadFile: 'uploadFile'
            })
        },
        watch: {
	        uploadFile() {
		        this.giveOutFile = this.uploadFile
		        if(this.giveOutFile.state === 30){
		        	this.errFlag = false;
		        	this.formInfo.taskId = this.giveOutFile.taskId;
					this.isUp = true
		        }else{
		        	this.errFlag = true;
		        	this.errMsg = this.giveOutFile.desc;
		        }
            }
        },
		methods: {
            getOption() {
                this.applyForm.serviceCompanyId = ''
                this.applyForm.channelType = ''
                this.balance = ''
                get('/api/console-dlv/company/salary-online-order/query-app-info', {
                    appId: this.applyForm.appId
                }).then(data =>{
                    this.option = data
                    if(this.option.appInfoList.length == 1) {
                        this.applyForm.serviceCompanyId = this.option.appInfoList[0].serviceCompanyId
                        this.channelTypes = this.option.appInfoList[0].channelTypes
                        if(this.option.appInfoList[0].channelTypes.length == 1) {
                            this.applyForm.channelType = this.option.appInfoList[0].channelTypes[0].value
                            this.getBalance()
                        }
                    }
                })
            },
            getServiceCompanyName() {
                this.applyForm.channelType = ''
                this.balance = ''
                this.option.appInfoList.forEach(e => {
                    if(e.serviceCompanyId == this.applyForm.serviceCompanyId) {
                        this.applyForm.serviceCompanyName = e.serviceCompanyName
                        this.channelTypes = e.channelTypes
                    }
                })
            },
            getBalance() {
                get('/api/console-dlv/company/salary-online-order/query-app-balance-info', {
                    appId: this.applyForm.appId,
                    serviceCompanyId: this.applyForm.serviceCompanyId,
                    channelType: this.applyForm.channelType
                }).then(data => {
                    this.balance = data
                })
            },
            down() {
                this.$refs.applyForm.validateField('appId', err => {
                    if(!err) {
                         window.open(`/api/console-dlv/company/salary-online-order/download-salary-order-item-template?appId=${this.applyForm.appId}&channelType=${this.applyForm.channelType}`)
                    }
                })
            },
			upload(a) {
        console.log(this.applyForm)
        sessionStorage.setItem('orderMsg', JSON.stringify(this.applyForm))
        this.$refs['applyForm'].validate(valid => {
            if(valid) {
                var formData = new FormData()
              formData.append('targetType', 'salary_order')
              formData.append('fileName', a.name)
                formData.append('file', a.raw)
                formData.append('targetExt', JSON.stringify(this.applyForm))
              importPost('/api/sysmgr-web/file/upload-ext', formData).then(data => {
                this.referId = data.referId
                this.progress()
              })
            }
        })
			},
			progress() {
				this.frame = requestAnimationFrame(this.progress)
				if(this.isEnd && (!this.date || this.date < new Date().getTime() - 1000)) {
					this.isEnd = false
					post('/api/sysmgr-web/file/progress', {
						id: this.referId
					}, true).then(data => {
						this.isEnd = true
						this.date = new Date().getTime()
						this.pro = data.progress
						if (this.pro == 100) {
							if(data.state == 30) {
								this.errFlag = false;
		        		this.formInfo.taskId = data.taskId;
								this.isUp = true
								this.$message({
                  type: 'success',
                  message: '上传成功！'
                })
                this.getTemplate()
              }
              if(data.state == 20 || data.state == 40) {
                this.errFlag = true;
                this.errMsg = data.state == 20 ? '内部错误' : (data.desc || '导入失败');
                this.$message.error(this.errMsg)
                this.pro = 0
              }
              cancelAnimationFrame(this.frame)
						}
					})
				}
			},
		 	nextStep() {
                if (this.formInfo.appId == '') {
                    showTopErrorToast('请选择发放委托方');
                    return;
                }
                if (this.formInfo.taskId == '') {
                    showTopErrorToast('上传薪酬明细表');
                    return;
                }
                if(this.errFlag){
		 			showTopErrorToast(this.errMsg);
		 			return;
                }
                // Object.assign(this.formInfo, {
                //     companyName: this.inform.companyName
                // })
                post('/api/console-dlv/company/salary-online-order/bind-app-info',this.formInfo)
                .then(result => {
                    this.$router.push(`confirm?taskId=${this.formInfo.taskId}&channelType=${this.applyForm.channelType}`);
                })
            },
            cancel(){
            	this.formInfo.appId == '';
				this.formInfo.taskId == '';
				this.$router.back()
            },
            setOpenSms(a) {
                this.formInfo.openSms = a
            },
            getTemplate() {
                post('/api/console-dlv/company/salary-online-order/getPayeeSmsTemplate', {
                    channelTypeName: this.orderMsg.channelName,
                    importTaskId: this.formInfo.taskId
                }).then(data => {
                    this.inform = {
                        companyName: data.companyName,
                        // fund: data.fund,
                        // remark: data.remark,
                        importTaskId: this.formInfo.taskId
                    }
                    this.template = data.smsContent
                })
            },
            upDateTemplate() {
                this.$refs['inform'].validate(valid => {
                    if(valid) {
                        post('/api/console-dlv/company/salary-online-order/updatePayeeSmsTemplate', this.inform).then(data => {
                            this.$message({
                                type: 'success',
                                message: '修改成功'
                            })
                            this.show = false
                            this.getTemplate()
                            // this.template = data.smsContent
                            // this.getTemplate()
                        })
                    }
                })
            }
		}
	}
</script>
<style>
.content {
	margin-top: 14px;
	background-color: #fff;
	padding: 48px 33px;
}
.mcontent {
	margin: 34px 0px 56px 150px;
}
.abtn {
    display: inline-block;
    width: 80px;
    height: 22px;
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    background-image: url(../../../image/download.png);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 7px center;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    text-indent: 22px;
    line-height: 20px;
}
.abtn + div {
	display: inline-block;
    font-size: 14px;
    color: #999;
    margin-left: 15px;
}
.form_input {
    width: 400px;
}
.up_icon {
    width: 300px;
    height: 163px;
    background-image: url(../../../image/upload.png);
    background-size: 52.8px 43.3px;
    background-position: center 30px;
    background-repeat: no-repeat;
    padding-top: 90px;
	border: 1px solid #D9D9D9;
}
.up_icon > div:nth-child(1) {
    text-align: center;
    font-size: 16px;
    color: #666666;
}
.up_icon > div:nth-child(2) {
    font-size: 13px;
    color: #999;
    margin-top: 11px;
}
.pro_box {
	position: relative;
	display: inline-block;
	width: 263px;
	height: 10px;
	border: 1px solid #E9E9E9;
	border-radius: 5px;
	margin-top: 6px;
}
.pro_box > div {
	position: absolute;
	top: 1px;
	left: 0;
	height: 8px;
	border-radius: 4px;
	background-color: #108EE9;
}
.pro_box + span {
	margin-top: 6px;
	font-size: 12px;
	color: #999999;
}
.footer {
	text-align: center;
	margin-top: 30px;
}
.tip {
	margin: 65px 34px 0px;
	font-size: 14px;
	color: #8E8E8E;
	letter-spacing: 0.6px;
	text-align: left;
	line-height: 37px;
	border-top: 1px solid #EBEBEB;
	padding: 12px 30px 0px;
}
.tip > div:nth-child(1) {
	font-size: 16px;
}
.c6 {
    color: #666;
    font-size: 16px;
}
.c15 {
    color: #151515;
}
.c108EE9 {
    color: #108EE9;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 10px;
}
.mt15 {
    margin-top: 15px;
}
.f14 {
    font-size: 14px;
}
.form_300 {
    width: 300px;
}
.mb8 {
    margin-bottom: 8px;
}
.balance {
    color: #333;
    font-size: 14px;
}
.balance > span {
    color: red;
}
</style>