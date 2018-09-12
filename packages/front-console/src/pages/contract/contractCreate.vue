<template>

    <div class="bg-white p15">
        <el-form :model="contractForm" :rules="rules" ref="contractForm" label-width="200px" class="demo-contractForm">
            <h4 class="ml50">合同模板</h4>
            <el-form-item label="业务类型">
                <span>{{templateDetail.contractTypeName}}</span>
            </el-form-item>
            <el-form-item label="行业类型">
                <span>{{templateDetail.industryTypeNames}}</span>
            </el-form-item>
            <el-form-item label="备注">
                <span>{{templateDetail.remark}}</span>
            </el-form-item>

            <h4 class="ml50 mt50">合同内容</h4>
            <el-form-item label="服务类型" prop="serviceId" >
                <el-select v-model="contractForm.serviceId" @change="seviceTypeChange" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in serviceTypes" :key="item.serviceId" :label="item.serviceName"
                               :value="item.serviceId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务内容：">
				{{serviceContent}}
			</el-form-item>

            <el-form-item label="服务商名称" prop="serviceCompanyId" >
                <el-select v-model="contractForm.serviceCompanyId" placeholder="请选择" style="width:100%;"
                @change="serviceBank">
                    <el-option v-for="item in serviceList" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="法定代表人" required>
                <el-input v-model="serviceCompany.legalPerson" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item  label="公司电话" >
                <el-input v-model="serviceCompany.phone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" required>
                <el-input v-model="serviceCompany.registerAddr" :disabled="true"></el-input>
                <el-button @click="show" type="text">{{showDesc}}</el-button>
            </el-form-item>
            <div v-if="isShow">
                 <el-form-item label="服务商开户银行" >
                    {{contractForm.serviceDepositBank}}
                </el-form-item>
                <el-form-item label="服务商账户名称" >
                    {{contractForm.serviceAccountName}}
                </el-form-item>
                <el-form-item label="服务商银行账号" >
                    {{contractForm.serviceAccountNo}}
                </el-form-item>

                <h4 class="ml50 mt50">客户（甲方）法定代表人</h4>
                <el-form-item label="合摩法定代表人" >
                    {{contractForm.aygLegalPerson}}
                </el-form-item>
                <el-form-item  label="合摩电话" >
                    {{contractForm.aygContactPhone}}
                </el-form-item>
                <el-form-item label="合摩地址" >
                    {{contractForm.aygAddress}}
                </el-form-item>
            </div>
           
                    
            <el-form-item label="合同期限:" prop="dateValue" size="small" >
                <el-date-picker
                        v-model="contractForm.dateValue"
                        type="daterange"
                        :unlink-panels="true"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="结算周期" prop="settleType" >
                <el-select v-model="contractForm.settleType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in searchOptions.ContractGenSettleType" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <h4 class="ml50 mt50">合同联系人信息</h4>
            <el-form-item label="合同联系人" prop="contractPerson" >
                <el-input v-model="contractForm.contractPerson"></el-input>
            </el-form-item>
            <el-form-item label="合同联系人邮箱" prop="contractEmail" >
                <el-input v-model="contractForm.contractEmail"></el-input>
            </el-form-item>
            <el-form-item label="合同联系人地址" prop="contractAddr" >
                <el-input v-model="contractForm.contractAddr"></el-input>
            </el-form-item>

            <h4 class="ml50 mt50">客户联系信息</h4>
            <!--<el-form-item label="商户名称（公司）" prop="customCompanyId" required>
                <el-select v-model="contractForm.customCompanyId" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in customList" :key="item.id" :label="item.name"
                               :value="item.id"></el-option>
                </el-select>
            </el-form-item>-->
            <el-form-item label="商户名称（公司）" prop="customCompanyName" >
                <el-input v-model="contractForm.customCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="法定代表人" prop="customLegalPerson" >
                <el-input v-model="contractForm.customLegalPerson"></el-input>
            </el-form-item>
            <el-form-item label="客户联系人姓名" prop="customCollector" >
                <el-input v-model="contractForm.customCollector"></el-input>
            </el-form-item>
            <el-form-item label="客户联系电话" prop="customCollectorPhone" >
                <el-input v-model="contractForm.customCollectorPhone" :maxlength="12"></el-input>
            </el-form-item>
            <el-form-item label="客户联系地址" prop="customCollectorAddr" >
                <el-input v-model="contractForm.customCollectorAddr"></el-input>
            </el-form-item>
            <el-form-item label="客户联系邮箱1" prop="customMail1">
                <el-input v-model="contractForm.customMail1"></el-input>
            </el-form-item>
            <el-form-item label="客户联系邮箱2" prop="customMail2">
                <el-input v-model="contractForm.customMail2"></el-input>
            </el-form-item>

            <h4 class="ml50 mt50">客户（公司）开票信息</h4>
            <el-form-item label="发票类型" prop="invoiceType" >
                <el-select v-model="contractForm.invoiceType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in searchOptions.ContractGenInvoiceType" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发票类目" prop="invoiceSubjectId" >
                <el-select v-model="contractForm.invoiceSubjectId" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in invoiceOptions" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="公司名称" prop="invoiceCompanyName" >
                <el-input v-model="contractForm.invoiceCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="customTaxIdcd" >
                <el-input v-model="contractForm.customTaxIdcd"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="customAddr" >
                <el-input v-model="contractForm.customAddr"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="customPhone" >
                <el-input v-model="contractForm.customPhone" :maxlength="12"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="customBankName" >
                <el-input v-model="contractForm.customBankName"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="customBankAccount">
                <el-input v-model="contractForm.customBankAccount"></el-input>
            </el-form-item>

            <div v-if="this.contractId">
                <h4 class="ml50 mt50">合同文件</h4>
                <div class="pl50 mb50">
                    <el-table :data="fileList">
                        <el-table-column prop="displayname" label="文件名称"></el-table-column>
                        <el-table-column prop="createByName" label="操作人"></el-table-column>
                        <el-table-column prop="createTime" label="上传时间">
                            <template slot-scope="scope">
                                <span>{{scope.row.createTime | formatTime}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="handleDownload(scope.row.downloadCode)" type="text" size="medium"
                                           style="padding:0;">下载
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>

            <el-form-item>
                <el-button type="primary" @click="submitForm('contractForm')">保存</el-button>
                <el-button @click="backToList">取消</el-button>
            </el-form-item>
        </el-form>

    </div>

</template>

<script>
	import { post, get } from "../../store/api"

	import _ from 'lodash'

	import { showNotify } from '../../plugin/utils-notify'

    import { checkBankNo, checkPhone } from '../../plugin/utils-element-validator'

	export default {
		created() {
            this.getCompanyList()
            this.getSearchOptions()
            this.getServiceTypesOptions();
			this.contractId = this.$route.query.contractId
            if(this.contractId) {
				this.getContractDetail(this.contractId)
            }else {
	            let tplId = this.$route.query.tplId
	            this.getTemplateDetail(tplId)
            }
            this.aCompany();
        },
        data() {
			return {
                isShow:false,
                showDesc:'展开',
                templateDetail: {},
                contractForm: {
	                invoiceType: '',
	                invoiceTypeName: '',
	                invoiceSubjectId: '',
	                invoiceSubjectName: '',
	                serviceCompanyId: '',
	                serviceCompanyName: '',
	                contractStartDate: '',
	                contractEndDate: '',
	                customCompanyId: 0,
	                customCompanyName: '',
	                customLegalPerson: '',
	                customCollector: '',
	                customCollectorPhone: '',
	                customCollectorAddr: '',
	                customMail1: '',
	                customMail2: '',
	                invoiceCompanyName: '',
	                customTaxIdcd: '',
	                customAddr: '',
	                customPhone: '',
	                customBankName: '',
	                customBankAccount: '',
                    dateValue: '',
                    serviceId:'',
                    settleType:'',
                    serviceAccountName:'',
                    serviceAccountNo:'',
                    serviceDepositBank:'',
                    contractPerson:'',
                    contractEmail:'',
                    contractAddr:'',
                    aygLegalPerson:'',
                    aygContactPhone:'',
                    aygAddress:'',
                },
				rules: {
					invoiceType: [
						{required: true, message: '请选择发票类型', trigger: 'change'}
                    ],
					invoiceSubjectId: [
						{required: true, message: '请选择发票类目', trigger: 'change'}
                    ],
					serviceCompanyId: [
						{required: true, message: '请选择服务商', trigger: 'change'}
					],
					dateValue: [
						{ required: true, message: '请选择合同期限', trigger: 'blur' }
                    ],
					customCompanyName: [
						{required: true, message: '请填写客户公司名称', trigger: 'blur'}
					],
					customLegalPerson: [
						{required: true, message: '请填写客户公司法定代表人', trigger: 'blur'}
                    ],
					customCollector: [
						{ required: true, message: '请填写客户联系人姓名', trigger: 'blur' }
					],
					customCollectorPhone: [
						{ required: true, message: '请填写正确的电话号码', trigger: 'blur', validator: checkPhone }
					],
					customCollectorAddr: [
						{ required: true, message: '请填写客户联系地址', trigger: 'blur' }
					],
					invoiceCompanyName: [
						{ required: true, message: '请填写公司名称', trigger: 'blur' }
					],
					customTaxIdcd: [
						{ required: true, message: '请填写纳税人识别号', trigger: 'blur' }
					],
					customAddr: [
						{ required: true, message: '请填写地址', trigger: 'blur' }
					],
					customPhone: [
						{ required: true, message: '请填写正确的电话号码', trigger: 'blur', validator: checkPhone }
					],
					customBankName: [
						{ required: true, message: '请填写开户银行', trigger: 'blur'}
					],
					customBankAccount: [
						{ required: true, message: '银行账号为5至20位的数字', trigger: 'blur', validator: checkBankNo  }
                    ],
                    serviceId: [
						{required: true, message: '请选择服务类型', trigger: 'change'}
                    ],
                    settleType: [
						{required: true, message: '请选择结算周期', trigger: 'change'}
					],
                    contractPerson: [
						{required: true, message: '合同联系人', trigger: 'blur'}
					],
                    contractEmail: [
						{required: true, message: '合同联系人邮箱', trigger: 'blur'}
					],
                    contractAddr: [
						{required: true, message: '合同联系人地址', trigger: 'blur'}
					],
                },
                customList: [],
                serviceList: [],
				searchOptions: {},
                invoiceOptions: {},
                serviceTypes:{},
				dateValue: '',
                contractId: '',
				fileList: [],
            }
        },
        computed: {
	        /*customLegalPerson() {
                let company = _.find(this.customList, custom => custom.id === this.contractForm.customCompanyId)
                return company ? company.legalPerson : ''
            },*/
            serviceCompany() {
	            let company = _.find(this.serviceList, custom => custom.id === this.contractForm.serviceCompanyId)
                return company || {}
            },
            serviceContent() {
                let content = _.find(this.serviceTypes, serviceType => serviceType.serviceId === this.contractForm.serviceId)
                if(content){
                    return content.serviceContent
                }else{
                    return ''
                }
            }
        },
        methods: {
            aCompany(){
                get('/api/sysmgr-web/commom/company-infos', {
                        companyId: 1
                    }).then(result => {
                            if(result){
                                this.contractForm.aygLegalPerson = result.baseInfo.legalPerson 
                                this.contractForm.aygContactPhone = result.baseInfo.contactPhone1
                                this.contractForm.aygAddress = result.baseInfo.contactAddr1
                            }
                            
                    })
            },
            serviceBank(){
                if(this.contractForm.serviceCompanyId){
                    get('/api/sysmgr-web/commom/company-bank-info', {
                        companyId: this.contractForm.serviceCompanyId
                    }).then(result => {
                            if(result){
                                this.contractForm.serviceDepositBank = result[0].depositBank
                                this.contractForm.serviceAccountNo = result[0].bankAccount
                                this.contractForm.serviceAccountName = result[0].bankAccountName
                            }else{
                                this.contractForm.serviceDepositBank = ''
                                this.contractForm.serviceAccountNo = ''
                                this.contractForm.serviceAccountName = ''
                            }
                            
                    })
                }
            },
            getTemplateDetail(tplId) {
                get('/api/contract-web/contract-tpl/contract-tpl-detail', {
	                id: tplId
                }).then(result => {
	                this.templateDetail = result
                    this.fileList = result.attachments
                })
            },
            getCompanyList() {
            	get('/api/sysmgr-web/commom/company-detail', {
		            companyIdentity: 'service'
                }).then(result => {
		            this.serviceList= result
                        /*let _list = result
                        _.forEach(_list, item => {
	                        if(item.service) {
                        		this.serviceList.push(item)
                            }else if(item.custom) {
                        		this.customList.push(item)
                            }
                        })*/
                    })
            },
	        getSearchOptions() {
		        post('/api/sysmgr-web/commom/options?enumTypes=ContractGenInvoiceType,ContractGenSettleType', {})
			        .then(result => {
				        this.searchOptions = result
			        })
            },
            getInvoiceOptions(serviceId,invoiceSubjectId) {
	            get('/api/contract-web/service-mgr/get-service-subject-options', {
	            	serviceId: serviceId,
                }).then(result => {
                    this.invoiceOptions = result;
                    this.contractForm.invoiceSubjectId = invoiceSubjectId;
		        })
            },
            getServiceTypesOptions() {
	            get('/api/contract-web/service-mgr/get-service-type-options', {}).then(result => {
                    this.serviceTypes = result
                })
            },
             seviceTypeChange(serviceId){
                this.getInvoiceOptions(serviceId, '');
            },
            setContractFormData(options, key, idKey, nKey, value) {
            	let obj = _.find(options, item => item[idKey] === value)
            	this.contractForm[`${key}Name`] = obj[nKey]
            },
	        backToList() {
            	this.$router.push('contractList')
            },
	        submitForm(formName) {
		        let url = this.contractId ? '/api/contract-web/contract-generate/update-contract-generate' : '/api/contract-web/contract-generate/create-contract-generate'

		        this.$refs[formName].validate(valid => {
			        if (valid) {
				        this.setContractFormData(this.searchOptions.ContractGenInvoiceType, 'invoiceType', 'value', 'text', this.contractForm.invoiceType)
				        this.setContractFormData(this.invoiceOptions, 'invoiceSubject', 'value', 'text', this.contractForm.invoiceSubjectId)
				        this.setContractFormData(this.serviceList, 'serviceCompany', 'id', 'name', this.contractForm.serviceCompanyId)
				        // this.setContractFormData(this.customList, 'customCompany', 'id', 'name', this.contractForm.customCompanyId)

				        let contractForm = _.cloneDeep(this.contractForm)
				        contractForm.tplId = this.templateDetail.id

				        contractForm = _.assign(contractForm, {
					        serviceLegalPerson: this.serviceCompany.legalPerson,
					        serviceRegisterAddr: this.serviceCompany.registerAddr,
                            servicePhone: this.serviceCompany.phone
                        })

				        let startAt = contractForm.dateValue[0]
				        let endAt = contractForm.dateValue[1]
				        contractForm.contractStartDate = startAt
				        contractForm.contractEndDate = endAt
                        delete contractForm.dateValue

                        if(this.contractId) contractForm.id = this.contractId
                        post(url, contractForm)
                            .then(result => {
	                            showNotify('success', this.contractId ? '编辑成功' : '新建成功')
	                            this.backToList()
                            })
			        }else {
			        	showNotify('error', '请检查输入项错误！')
                    }
		        })
            },
            getContractDetail(id) {
                get('/api/contract-web/contract-generate/contract-generate-detail', {
                	id: id
                }).then(result => {
                    this.tplId = result.tplId
                    this.getTemplateDetail(this.tplId);
                    this.getInvoiceOptions(result.serviceId,""+result.invoiceSubjectId);
                    this.contractForm = {
	                    invoiceType: result.invoiceType,
	                    invoiceTypeName: result.invoiceTypeName,
	                    serviceCompanyId: result.serviceCompanyId,
	                    serviceCompanyName: result.serviceCompanyName,
	                    contractStartDate: result.contractStartDate,
	                    contractEndDate: result.contractEndDate,
	                    customCompanyId: result.customCompanyId,
	                    customCompanyName: result.customCompanyName,
	                    customLegalPerson: result.customLegalPerson,
	                    customCollector: result.customCollector,
	                    customCollectorPhone: result.customCollectorPhone,
	                    customCollectorAddr: result.customCollectorAddr,
	                    customMail1: result.customMail1,
	                    customMail2: result.customMail2,
	                    invoiceCompanyName: result.invoiceCompanyName,
	                    customTaxIdcd: result.customTaxIdcd,
	                    customAddr: result.customAddr,
	                    customPhone: result.customPhone,
	                    customBankName: result.customBankName,
	                    customBankAccount: result.customBankAccount,
                        dateValue: [result.contractStartDate, result.contractEndDate],
                        serviceId: result.serviceId,
                        settleType:result.settleType,
                        serviceAccountName:result.serviceAccountName,
                        serviceAccountNo:result.serviceAccountNo,
                        serviceDepositBank:result.serviceDepositBank,
                        contractPerson:result.contractPerson,
                        contractEmail:result.contractEmail,
                        contractAddr:result.contractAddr,
                        aygLegalPerson:result.aygLegalPerson,
                        aygContactPhone:result.aygContactPhone,
                        aygAddress:result.aygAddress,
                        
                    }
                })
            },
	        handleDownload(downloadCode) {
            	window.location.href = `/api/contract-web/contract-generate/download-single-attachment?downloadCode=${downloadCode}&id=${this.contractId}&type=docx`
            },
            show(){
                this.isShow = !this.isShow;
                if(this.isShow){
                    this.showDesc = '收起';
                }else{
                     this.showDesc = '展开';
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .demo-contractForm {
        width: 800px;
    }
</style>


















