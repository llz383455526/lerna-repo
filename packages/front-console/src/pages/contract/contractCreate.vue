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
            <el-form-item label="客户从事" prop="customIndustry">
                <el-input v-model="contractForm.customIndustry" placeholder="客户是做什么的，客户企业主要从事的业务"></el-input>
            </el-form-item>
            <el-form-item label="客户性质" prop="customNature" >
                <el-radio v-model="contractForm.customNature" v-for="item in customNatureList" :key="item.value" :label="item.value">{{item.text}}</el-radio>
                <i class="el-icon-question ml10" title="非直接用工企业：人力资源公司、服务外包公司、城市合伙人公司、第三方平台等"></i>
            </el-form-item>
            <el-form-item label="行业类型" prop="industryType" >
                <el-select v-model="contractForm.industryType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in invoiceTypeList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务类型" prop="serviceTypeList" >
                <template slot="label">
                    <i class="el-icon-question" title="请参考《服务内容确认书》"></i>服务类型
                </template>
                <el-checkbox-group v-model="contractForm.serviceTypeList" @change="seviceTypeChange">
                    <el-checkbox v-for="item in serviceTypes" :key="item.serviceId" :label="item.serviceId">{{item.serviceName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="服务内容：">
                <div v-html="serviceContent"></div>
			</el-form-item>
            <el-form-item label="发票类目：">
                <el-button size="mini" class="mr8" v-for="item in invoiceOptions" :key="item.value">{{item.text}}</el-button>
            </el-form-item>
            <template v-if="hasInsurance()">
                <el-form-item label="商业保险" prop="vciBuyType">
                    <el-radio v-model="contractForm.vciBuyType" v-for="e in vciBuyTypeList" :key="e.value" :label="e.value">{{e.text}}</el-radio>
                </el-form-item>
                <el-form-item label="保险计划名称" prop="vciPlanName">
                    <el-input v-model="contractForm.vciPlanName" placeholder="请输入保险计划名称">
                        <template slot="append">
                            保险
                        </template>
                    </el-input>
                </el-form-item>
            </template>
            <el-form-item label="付款方式" prop="vciPayType">
                <el-select v-model="contractForm.vciPayType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in VciPayTypeList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="" prop="vciSettleExp" v-if="contractForm.vciPayType == 30">
                <el-input v-model="contractForm.vciSettleExp" placeholder="请输入整数">
                    <template slot="prepend">
                        甲乙双方确认以每月
                    </template>
                    <template slot="append">
                        日为结算日期
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="服务商名称" prop="serviceCompanyId">
                <template v-if="!contractId">
                    <div :class="`w1050 ${i + 1 == contractForm.serviceCompanyList.length ? '' : 'mb24'}`" v-for="(e, i) in contractForm.serviceCompanyList" :key="i">
                        <!-- @change="serviceBank" -->
                        <el-select class="w550 mr20" v-model="contractForm.serviceCompanyList[i].serviceCompanyId" placeholder="请选择" @change="checkServiceCompanyList(i)">
                            <el-option v-for="item in filterServiceList(i)" :key="item.companyId" :label="item.name" :value="item.companyId"></el-option>
                        </el-select>
                        <el-checkbox v-model="contractForm.serviceCompanyList[i].showServiceCompanyInfo">合同中显示服务商收款帐户信息</el-checkbox>
                        <el-button v-if="i != 0" type="text" @click="deleteServiceCompany">删除</el-button>
                    </div>
                    <el-button type="text" @click="addServiceCompany">添加</el-button>
                </template>
                <template v-else>
                    <div class="w1050">
                        <el-select class="w550 mr20" v-model="contractForm.serviceCompanyId" placeholder="请选择">
                            <el-option v-for="item in serviceList" :key="item.companyId" :label="item.name" :value="item.companyId"></el-option>
                        </el-select>
                        <el-checkbox v-model="contractForm.showServiceCompanyInfo">合同中显示服务商收款帐户信息</el-checkbox>
                    </div>
                </template>
            </el-form-item>
            <!-- <el-form-item label="法定代表人" required>
                <el-input v-model="serviceCompany.corporateName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item  label="公司电话" >
                <el-input v-model="serviceCompany.telephone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" required>
                <el-input v-model="serviceCompany.address" :disabled="true"></el-input>
                <el-button @click="show" type="text">{{showDesc}}</el-button>
            </el-form-item> -->
            <!-- <div v-if="isShow">
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
            </div> -->
            <el-form-item label="合同期限:" prop="contractStartDate" size="small" >
                <el-date-picker
                    @change="autoFill()"
                    v-model="contractForm.contractStartDate"
                    type="date"
                    placeholder="开始日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
                -
                <el-date-picker
                    @change="autoFill(1)"
                    v-model="contractForm.contractEndDate"
                    type="date"
                    placeholder="结束日期"
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <h4 class="ml50 mt50">合同报价</h4>
            <el-form-item label-width="110px" prop="offer">
                <contract-item :contractForm="contractForm" :checkAttr="`offer`" v-on:result="receive" ref="contractItem"></contract-item>
            </el-form-item>
            <h4 class="ml50 mt50">客户发放方式</h4>
            <el-form-item label="薪酬发放渠道" prop="channelTypeList">
                <el-checkbox-group v-model="contractForm.channelTypeList">
                    <el-checkbox label="A">银行</el-checkbox>
                    <el-checkbox label="B">支付宝</el-checkbox>
                    <el-checkbox label="C">微信</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <h4 class="ml50 mt50">销售联系信息</h4>
            <el-form-item label="销售姓名" prop="contractPerson" >
                <el-input v-model="contractForm.contractPerson"></el-input>
            </el-form-item>
            <el-form-item label="销售联系邮箱" prop="contractEmail" >
                <el-input v-model="contractForm.contractEmail"></el-input>
            </el-form-item>
            <el-form-item label="销售联系电话" prop="contractTel" >
                <el-input v-model="contractForm.contractTel"></el-input>
            </el-form-item>
            <el-form-item label="合同联系人地址" prop="contractAddr" >
                <el-input v-model="contractForm.contractAddr"></el-input>
            </el-form-item>
            <h4 class="ml50 mt50">客户联系信息</h4>
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
                <el-input v-model="contractForm.customCollectorPhone"></el-input>
            </el-form-item>
            <el-form-item label="客户联系地址" prop="customCollectorAddr" >
                <el-input v-model="contractForm.customCollectorAddr"></el-input>
            </el-form-item>
            <el-form-item label="客户联系邮箱" prop="customMail1">
                <el-input v-model="contractForm.customMail1"></el-input>
            </el-form-item>

            <h4 class="ml50 mt50">客户（公司）开票信息</h4>
            <el-form-item label="发票类型" prop="invoiceType" >
                <div class="w1050">
                    <el-select class="w800 mr20" v-model="contractForm.invoiceType" placeholder="请选择">
                        <el-option v-for="item in searchOptions.ContractGenInvoiceType" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
                    <el-checkbox v-model="contractForm.showSubjectInfo">合同中显示发票类型</el-checkbox>
                </div>
            </el-form-item>
            <el-form-item label="公司名称" prop="invoiceCompanyName">
                <el-input v-model="contractForm.invoiceCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="customTaxIdcd" >
                <el-input v-model="contractForm.customTaxIdcd"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="customAddr" >
                <el-input v-model="contractForm.customAddr"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="customPhone" >
                <el-input v-model="contractForm.customPhone"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="customBankName" >
                <el-input v-model="contractForm.customBankName"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="customBankAccount">
                <el-input v-model="contractForm.customBankAccount"></el-input>
            </el-form-item>
            <el-form-item label="付款方和收票方是否一致" prop="payAndInvoiceSame">
                <el-radio v-model="contractForm.payAndInvoiceSame" v-for="e in payAndInvoiceSameList" :key="e.value" :label="e.value">{{e.text}}</el-radio>
            </el-form-item>
            <el-form-item v-show="contractForm.payAndInvoiceSame != 1" label="甲方下属公司类型" prop="customCompanyUnderType">
                <el-radio v-model="contractForm.customCompanyUnderType" v-for="e in customCompanyUnderTypeList" :key="e.value" :label="e.value">{{e.text}}</el-radio>
            </el-form-item>
            <el-form-item v-show="contractForm.payAndInvoiceSame != 1" label="上传甲方下属公司清单" prop="customUnderAttachList">
                <a class="abtn" href="/assets/甲方公司下属公司名单.xlsx" download="甲方公司下属公司名单.xlsx" target="_blank">下载模板</a> <div>请先下载《甲方下属公司清单》模板</div>
                <el-upload
        	      class="form_input"
        	      :action="`/api/econtract/template/parsefile`"
        	      :auto-upload="false"
        	      :on-change="upload"
        	      :on-remove="remove"
        	      :multiple="false"
                  :file-list="files"
        	      accept=".xlsx, .xls">
        	        <div class="up_icon" v-show="!files.length">
        	            <div>点击这里上传</div>
        	            <div>请上传小于5M的xls或xlsx格式文件</div>
        	        </div>
        	    </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('contractForm')">保存</el-button>
                <el-button @click="backToList">取消</el-button>
            </el-form-item>
        </el-form>

    </div>

</template>

<script>
	import { importPost, post, get } from "../../store/api"
	import _ from 'lodash'
	import { showNotify } from '../../plugin/utils-notify'
    import { checkBankNo, checkPhone, checkMoney } from '../../plugin/utils-element-validator'
    import contractItem from '../../pageComponent/contractItem'
	export default {
        components: {
            contractItem
        },
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
            // this.initColumn();
            get('/api/sysmgr-web/commom/option?enumType=IndustryType').then(data => {
                this.invoiceTypeList = data
            })
            get('/api/sysmgr-web/commom/option?enumType=VciPayType').then(data =>{
                this.VciPayTypeList = data
                this.contractForm.vciPayType = this.contractForm.vciPayType || data[0].value
            })
            !this.contractId && this.contractForm.serviceCompanyList.push({
                serviceCompanyId: '',
                serviceCompanyName: '',
                showServiceCompanyInfo: ''
            }),
            get('/api/sysmgr-web/commom/option?enumType=CustomNature').then(data =>{
                this.customNatureList = data
                this.contractForm.customNature = this.contractForm.customNature || data[0].value
            })
        },
        data() {
            var checkMonth = (rule, value, cb) => {
                if(!/^\d+$/.test(value)) {
                    cb(new Error('请输入整数'))
                    return
                }
                console.log(value)
                if(value > 31 || value < 1) {
                    cb(new Error('数值必须在1-31之间'))
                    return
                }
                cb()
            }
			return {
                isShow:false,
                showDesc:'展开',
                templateDetail: {},
                inputStandard: '',
                inputRate: '',
                showInputRatio: 0,
                inputRatio: '',
                inputRatio_1: '',
                contractForm: {
                    customIndustry: '',
                    serviceTypeList: [],
                    industryType: '',
                    offer: '1',
	                invoiceType: '',
	                invoiceTypeName: '',
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
	                invoiceCompanyName: '',
	                customTaxIdcd: '',
	                customAddr: '',
	                customPhone: '',
	                customBankName: '',
	                customBankAccount: '',
                    serviceAccountName:'',
                    serviceAccountNo:'',
                    serviceDepositBank:'',
                    contractPerson:'',
                    contractEmail:'',
                    contractAddr:'',
                    aygLegalPerson:'',
                    aygContactPhone:'',
                    aygAddress:'',
                    contractStartDate: '',
                    contractEndDate: '',
                    contractTel: '',
                    channelTypeList: [],
                    serviceFeeContent: {
                        discountRate: '',
                        secondType: '',
                        fixFee: 0,
                        monthIncomeAmount: '',
                        serviceFeeRate: '',
                        serviceFeeType: 'standard',
                        containMonthAmount: true,
                        stepwiseList: []
                    },
                    serviceFeeContent2: {
                        containMonthAmount: false,
                        monthIncomeAmount: '',
                        stepwiseList: []
                    },
                    vciBuyType: '',
                    vciPlanName: '',
                    vciPayType: '',
                    vciSettleExp: '',
                    serviceCompanyList: [],
                    showSubjectInfo: '',
                    payAndInvoiceSame: '1',
                    customCompanyUnderType: '',
                    showServiceCompanyInfo: '',
                    customUnderAttachList: [],
                    customNature: ''
                },
				rules: {
                    customIndustry: [
                        {required: true, message: '请填写客户从事', trigger: 'blur'}
                    ],
                    offer: [
                        {required: true, message: '请选择并正确填写报价（大于零且最多两位小数）', trigger: 'blur'}
                    ],
                    customNature: [
                        {required: true, message: '请选择客户性质', trigger: 'change'}
                    ],
					invoiceType: [
						{required: true, message: '请选择发票类型', trigger: 'change'}
                    ],
					// serviceCompanyId: [
					// 	{required: true, message: '请选择服务商', trigger: 'change'}
                    // ],
                    industryType: [
                        {required: true, message: '请选择行业类型', trigger: 'change'}
                    ],
					contractStartDate: [
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
						{ required: true, message: '银行账号至少为5位数字', trigger: 'blur', validator: checkBankNo  }
                    ],
                    customMail1: [
                        { required: true, message: '请填写邮箱地址', trigger: 'blur'}
                    ],
                    serviceTypeList: [
						{required: true, message: '请选择服务类型', trigger: 'change'}
                    ],
                    contractPerson: [
						{required: true, message: '销售姓名', trigger: 'blur'}
					],
                    contractEmail: [
						{required: true, message: '销售联系人邮箱', trigger: 'blur'}
                    ],
                    contractTel: [
                        {required: true, message: '销售联系人电话', trigger: 'blur', validator: checkPhone}
                    ],
                    contractAddr: [
						{required: true, message: '销售联系人地址', trigger: 'blur'}
                    ],
                    channelTypeList: [
                        {required: true, message: '至少选择一项', trigger: 'blur'}
                    ],
                    vciBuyType: [
                        {required: true, message: '至少选择商业保险类型', trigger: 'blur'}
                    ],
                    vciPlanName: [
                        {required: true, message: '请填写保险计划名称', trigger: 'blur'}
                    ],
                    vciPayType: [
                        {required: true, message: '请选择付款方式', trigger: 'blur'}
                    ],
                    vciSettleExp: [
                        {required: true, trigger: 'blur', validator: checkMonth}
                    ],
                    payAndInvoiceSame: [
                        {required: true, message: '请选择', trigger: 'blur'}
                    ],
                    // customCompanyUnderType: [
                    //     {required: true, message: '请选择甲方下属公司类型', trigger: 'blur'}
                    // ],
                    // customUnderAttachList: [
                    //     {required: true, message: '请上传甲方下属公司清单', trigger: 'blur'}
                    // ]
                },
                customList: [],
                serviceList: [],
				searchOptions: {},
                invoiceOptions: {},
                serviceTypes: [],
				dateValue: '',
                contractId: '',
                fileList: [],
                proType: '0',
                table_0: [
                    {
                        rate: 'lv1Step1Rate'
                    },
                    {
                        rate: 'lv1Step2Rate'
                    },
                    {
                        rate: 'lv1Step3Rate'
                    }
                ],
                table_1: [
                    {
                        rate: 'lv2Step1Rate'
                    },
                    {
                        rate: 'lv2Step2Rate'
                    },
                    {
                        rate: 'lv2Step3Rate'
                    }
                ],
                channelTypes: [],
                columnIndex: 0,
                columnIndex2: 0,
                invoiceTypeList: [],
                float2: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                vciBuyTypeList: [
                    {
                        text: '由客户自行购买',
                        value: '10'
                    },
                    {
                        text: '我方购买保险的情况，无论保费是否我方承担均适用',
                        value: '20'
                    }
                ],
                VciPayTypeList: [],
                payAndInvoiceSameList: [
                    {
                        text: '是',
                        value: '1'
                    },
                    {
                        text: '否',
                        value: '0'
                    }
                ],
                customCompanyUnderTypeList: [
                    {
                        text: '甲方分公司',
                        value: 'branch'
                    },
                    {
                        text: '甲方子公司',
                        value: 'sub'
                    }
                ],
                pro: 0,
                frame: '',
                isEnd: true,
                date: 0,
                files: [],
                customNatureList: [],
                resultData: {}
            }
        },
        computed: {
            serviceCompany() {
                var company = this.serviceList.filter(e => e.companyId == this.contractForm.serviceCompanyId)
                return company[0] || {}
            },
            serviceContent() {
                var str = '', contents = []
                this.contractForm.serviceTypeList.forEach(e => {
                    var content = _.find(this.serviceTypes, serviceType => serviceType.serviceId === e)
                    if(content) {
                        contents.push(content)
                    }
                })
                for(var i =  0; i < contents.length; i++) {
                    for(var j = i; j < contents.length; j++) {
                        if(contents[i].seqNo > contents[j].seqNo) {
                            var a = contents[i]
                            contents[i] = contents[j]
                            contents[j] = a
                        }
                    }
                    str += `${str ? '<br>' : ''}${contents[i].seqNo}、${contents[i].serviceContent}`
                }
                return str
            }
        },
        watch: {
            'contractForm.payAndInvoiceSame'(val) {
                if(val != '1') {
                    this.rules.customCompanyUnderType = [
                        {required: true, message: '请选择甲方下属公司类型', trigger: 'blur'}
                    ]
                    this.rules.customUnderAttachList = [
                        {required: true, message: '请上传甲方下属公司清单', trigger: 'blur'}
                    ]
                }
                else {
                    delete this.rules.customCompanyUnderType
                    delete this.rules.customUnderAttachList
                }
            }
        },
        methods: {
            setOffer(a) {
                if(this.contractForm[a] && !isNaN(this.contractForm[a]) && this.contractForm[a] > 0 && this.contractForm[a] < 100) {
                    var str = this.contractForm[a].toString().split('.')[1]
                    if(str && str.length > 2) {
                        this.contractForm.offer = ''
                    }
                    else {
                        this.contractForm.offer = '1'
                    }
                }
                else {
                    this.contractForm.offer = ''
                }
                if(this.contractForm.laddersRate) {
                    this.checkAll(true)
                }
            },
            autoFill(a) {
                if(!a) {
                    var time = new Date(new Date(this.contractForm.contractStartDate).getTime() - 24 * 60 * 60 * 1000)
                    this.contractForm.contractEndDate = `${time.getFullYear() + 1}-${(time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : `0${time.getMonth() + 1}`}-${time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`}`
                }
                else {
                    var time = new Date(new Date(this.contractForm.contractEndDate).getTime() + 24 * 60 * 60 * 1000)
                    this.contractForm.contractStartDate = `${time.getFullYear() - 1}-${(time.getMonth() + 1) > 9 ? (time.getMonth() + 1) : `0${time.getMonth() + 1}`}-${time.getDate() > 9 ? time.getDate() : `0${time.getDate()}`}`
                }
            },
            checkTable(a, index, b) {
                if(b && !this.contractForm[a]) {
                    return
                }
                if(this.contractForm[a] && !isNaN(this.contractForm[a]) && this.contractForm[a] > 0) {
                    var str = this.contractForm[a].toString().split('.')[1]
                    if(str && str.length > 2) {
                        this.contractForm.offer = ''
                    }
                    else {
                        this.contractForm.offer = '1'
                    }
                }
                else {
                    this.contractForm.offer = ''
                }
                var relevance = ''
                switch (a) {
                    case 'lv1Step1Amount':
                        relevance = 'lv1Step2Amount1'
                        this.compare_0(a, 'lv1Step2Amount2', index)
                        break;
                    case 'lv1Step2Amount1':
                        relevance = 'lv1Step1Amount'
                        this.compare_0(a, 'lv1Step2Amount2', index)
                        break;
                    case 'lv1Step2Amount2':
                        relevance = 'lv1Step3Amount'
                        this.compare_1(a, 'lv1Step2Amount1', index)
                        break;
                    case 'lv1Step3Amount':
                        relevance = 'lv1Step2Amount2'
                        this.compare_1(a, 'lv1Step2Amount1', index)
                        break;
                    case 'lv2Step1Amount':
                        relevance = 'lv2Step2Amount1'
                        this.compare_0(a, 'lv2Step2Amount2', index)
                        break;
                    case 'lv2Step2Amount1':
                        relevance = 'lv2Step1Amount'
                        this.compare_0(a, 'lv2Step2Amount2', index)
                        break;
                    case 'lv2Step2Amount2':
                        relevance = 'lv2Step3Amount'
                        this.compare_1(a, 'lv2Step2Amount1', index)
                        break;
                    case 'lv2Step3Amount':
                        relevance = 'lv2Step2Amount2'
                        this.compare_1(a, 'lv2Step2Amount1', index)
                        break;
                    default:
                        break;
                }
                this.contractForm[relevance] = this.contractForm[a]
            },
            compare_0(a, b, index) {
                this.contractForm[b] && ((this.contractForm[b] - this.contractForm[a]) < 0) && (this.contractForm.offer = '')
            },
            compare_1(a, b, index) {
                this.contractForm[b] && ((this.contractForm[b] - this.contractForm[a]) > 0) && (this.contractForm.offer = '')
            },
            checkRate(a, index, b) {
                if(b && !this.contractForm[a]) {
                    return
                }
                if(this.contractForm[a] && !isNaN(this.contractForm[a]) && this.contractForm[a] > 0 && this.contractForm[a] < 100) {
                    var str = this.contractForm[a].toString().split('.')[1]
                    if(str && str.length > 2) {
                        this.contractForm.offer = ''
                    }
                    else {
                        this.contractForm.offer = '1'
                    }
                }
                else {
                    this.contractForm.offer = ''
                }
            },
            checkAll(b) {
                var amount = [
                    ['lv1Step1Amount', 'lv1Step2Amount1', 'lv1Step2Amount2', 'lv1Step3Amount'],
                    ['lv2Step1Amount', 'lv2Step2Amount1', 'lv2Step2Amount2', 'lv2Step3Amount']
                ], rate = [
                    ['lv1Step1Rate', 'lv1Step2Rate', 'lv1Step3Rate'],
                    ['lv2Step1Rate', 'lv2Step2Rate', 'lv2Step3Rate']
                ]
                amount.forEach((e, i) => {
                    e.forEach(ev => {
                        this.checkTable(ev, i, b)
                    })
                })
                rate.forEach((e, i) => {
                    e.forEach(ev => {
                        this.checkRate(ev, i, b)
                    })
                })
            },
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
                    this.serviceList.forEach(e => {
                        if(e.companyId == this.contractForm.serviceCompanyId) {
                            this.contractForm.serviceDepositBank = e.bankBranchName
                            this.contractForm.serviceAccountNo = e.bankAccount
                            this.contractForm.serviceAccountName = e.bankAccountName
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
                get('/api/salemgt/common/service-company/list').then(data => {
                    this.serviceList = data
                })
            },
	        getSearchOptions() {
		        post('/api/sysmgr-web/commom/options?enumTypes=ContractGenInvoiceType,ContractGenSettleType', {})
			        .then(result => {
				        this.searchOptions = result
			        })
            },
            getInvoiceOptions() {
                if(this.contractForm.serviceTypeList.length) {
                    post('/api/contract-web/service-mgr/get-service-subject-options', {
	                	serviceIds: this.contractForm.serviceTypeList,
                    }).then(result => {
                        this.invoiceOptions = result;
		            })
                }
                else {
                    this.invoiceOptions = []
                }
            },
            getServiceTypesOptions() {
	            get('/api/contract-web/service-mgr/get-service-type-options', {}).then(result => {
                    this.serviceTypes = result
                })
            },
            seviceTypeChange(){
                if(this.contractForm.serviceTypeList.length > 5) {
                    this.contractForm.serviceTypeList.pop()
                    this.$message({
                        type: 'warning',
                        message: '最多只能选5个'
                    })
                }
                this.getInvoiceOptions();
            },
            setContractFormData(options, key, idKey, nKey, value) {
                let obj = _.find(options, item => item[idKey] === value)
            	this.contractForm[`${key}Name`] = obj[nKey]
            },
	        backToList() {
            	this.$router.back()
            },
            // -------------------------------------
            // calcuServiceFee(a) {
            //     this.inputRate = ''
            //     this.contractForm.serviceFeeContent.monthIncomeAmount = 1
            //     if(this.contractForm.serviceFeeContent.serviceFeeType == 'standard') {
            //         this.contractForm.offer = (this.float2.test(this.inputStandard) && this.inputStandard <= 100) ? 0 : '';
            //         // (this.inputStandard && (this.inputStandard - 0 > 0 && this.inputStandard <= 100)) ? 0 : '';
            //         this.showInputRatio = a;
            //     }
            //     if (this.contractForm.serviceFeeContent.serviceFeeType == 'step') {
            //         this.contractForm.offer = 0;
            //         this.showInputRatio = a;
            //         this.initColumn(2)
            //         this.contractForm.serviceFeeContent.stepwiseList[0].endAmount = 2.8
            //         this.contractForm.serviceFeeContent.stepwiseList[1].startAmount = 2.8
            //     }
            //     if (this.contractForm.serviceFeeContent.serviceFeeType == 'step_0') {
            //         this.contractForm.offer = 0;
            //         this.showInputRatio = a;
            //         this.initColumn()
            //     }
            //     if (this.contractForm.serviceFeeContent.serviceFeeType == 'step_1') {
            //         this.contractForm.offer = 0;
            //         this.showInputRatio = a;
            //         this.initColumn()
            //         this.contractForm.serviceFeeContent.monthIncomeAmount = 2.8
            //     }
            //     this.$refs['contractForm'].validateField('offer')
            // },
            // addColumn(a) {
            //     if(isNaN(a)) {
            //         a = 0
            //     }
            //     var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList
            //     if(a) {
            //         stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
            //     }
            //     stepwiseList.push({
            //         startAmount: stepwiseList[this.columnIndex - 1] ? stepwiseList[this.columnIndex - 1].endAmount : '',
            //         equalsStart: stepwiseList[this.columnIndex - 1] ? !stepwiseList[this.columnIndex - 1].equalsEnd : false,
            //         endAmount: '',
            //         equalsEnd: true,
            //         sequence: a ? this.columnIndex2 : this.columnIndex,
            //         percent: ''
            //     })
            //     if(a) {
            //         this.columnIndex2++
            //     }
            //     else {
            //         this.columnIndex++
            //     }
            // },
            // deleteColumn(a, b) {
            //     var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList
            //     if(b) {
            //         stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
            //     }
            //     stepwiseList.splice(a, 1)
            //     if(b) {
            //         this.columnIndex2--
            //         stepwiseList[this.columnIndex2- 1].endAmount = ''
            //     }
            //     else {
            //         this.columnIndex--
            //         stepwiseList[this.columnIndex- 1].endAmount = ''
            //     }
            // },
            // initColumn(a) {
            //     if(isNaN(a)) {
            //         a = 3
            //     }
            //     this.contractForm.serviceFeeContent.stepwiseList = []
            //     if(!this.contractForm.serviceFeeContent2) {
            //         this.contractForm.serviceFeeContent2 = {}
            //     }
            //     this.contractForm.serviceFeeContent2.stepwiseList = []
            //     this.columnIndex = 0
            //     this.columnIndex2 = 0
            //     for(var i = 0; i < a; i++) {
            //         this.addColumn()
            //     }
            //     if(this.showInputRatio == 5) {
            //         for(var i = 0; i < a; i++) {
            //             this.addColumn(1)
            //         }
            //     }
            // },
            // amount(a, b, c) {
            //     var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList, amount = '', result = ''
            //     if(c) {
            //         stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
            //     }
            //     if(b) {
            //         stepwiseList[a + 1] && (stepwiseList[a + 1].startAmount = stepwiseList[a].endAmount)
            //         amount = stepwiseList[a].endAmount
            //     }
            //     else {
            //         stepwiseList[a - 1] && (stepwiseList[a - 1].endAmount = stepwiseList[a].startAmount)
            //         amount = stepwiseList[a].startAmount
            //     }
            //     if(this.float2.test(amount) && stepwiseList[a].startAmount - 0 < stepwiseList[a].endAmount) {
            //         result = 0
            //     }
            //     return result
            // },
            // checkTable() {
            //     var results = []
            //     for(var i =0; i < this.contractForm.serviceFeeContent.stepwiseList.length; i++) {
            //         for(var j = 0; j < 2; j++) {
            //             (j || i) && (i + 1 < this.contractForm.serviceFeeContent.stepwiseList.length) && results.push(this.amount(i, j))
            //         }
            //         var a = this.contractForm.serviceFeeContent.stepwiseList[i].percent
            //         results.push((this.float2.test(a) && a <= 100) ? 0 : '')
            //     }
            //     var m = this.contractForm.serviceFeeContent.monthIncomeAmount
            //     results.push((this.float2.test(m) && m <= 100) ? 0 : '')
            //     results.push((this.float2.test(this.inputRate) && this.inputRate <= 100) ? 0 : '')
            //     if(this.contractForm.serviceFeeContent2.stepwiseList.length) {
            //         for(var i = 0; i < this.contractForm.serviceFeeContent2.stepwiseList.length; i++) {
            //             for(var j = 0; j < 2; j++) {
            //                (j || i) && (i + 1 < this.contractForm.serviceFeeContent2.stepwiseList.length) && results.push(this.amount(i, j, 2))
            //             }
            //             var a = this.contractForm.serviceFeeContent2.stepwiseList[i].percent
            //             results.push((this.float2.test(a) && a <= 100) ? 0 : '')
            //         }
            //     }
            //     this.contractForm.offer = results.indexOf('') > -1 ? '' : 0
            // },
            // equals(a, b, c) {
            //     var stepwiseList = this.contractForm.serviceFeeContent.stepwiseList
            //     if(c) {
            //         stepwiseList = this.contractForm.serviceFeeContent2.stepwiseList
            //     }
            //     if(b) {
            //         stepwiseList[a + 1] && (stepwiseList[a + 1].equalsStart = !stepwiseList[a].equalsEnd)
            //     }
            //     else {
            //         stepwiseList[a - 1] && (stepwiseList[a - 1].equalsEnd = !stepwiseList[a].equalsStart)
            //     }
            // },
            // equalsIncomeAmount(a) {
            //     if(!a) {
            //         this.contractForm.serviceFeeContent2.containMonthAmount = !this.contractForm.serviceFeeContent.containMonthAmount
            //     }
            //     else {
            //         this.contractForm.serviceFeeContent.containMonthAmount = !this.contractForm.serviceFeeContent2.containMonthAmount
            //     }
            // },
            // checkInputRate() {
            //     this.contractForm.offer = (this.float2.test(this.inputRate) && this.inputRate <= 100) ? 0 : ''
            // },
            // -------------------------------------
	        submitForm(formName) {
                let url = this.contractId ? '/api/contract-web/contract-generate/update-contract-generate' : '/api/contract-web/contract-generate/create-contract-generate'
                this.$refs['contractItem'].transferObj()
		        this.$refs[formName].validate(valid => {
			        if (valid) {
				        this.setContractFormData(this.searchOptions.ContractGenInvoiceType, 'invoiceType', 'value', 'text', this.contractForm.invoiceType)
				        this.contractForm.serviceCompanyId && this.setContractFormData(this.serviceList, 'serviceCompany', 'companyId', 'name', this.contractForm.serviceCompanyId)
                        // --------------------------------------------
                        var contractForm = JSON.parse(JSON.stringify(this.contractForm))
                        Object.assign(contractForm, this.resultData)
                        contractForm.tplId = this.templateDetail.id
                        delete contractForm.offer
				        contractForm = _.assign(contractForm, {
					        serviceLegalPerson: this.serviceCompany.corporateName,
					        serviceRegisterAddr: this.serviceCompany.address,
                            servicePhone: this.serviceCompany.telephone
                        })
                        if(contractForm.serviceTypeList) {
                            var serviceTypeList = []
                            contractForm.serviceTypeList.forEach(e => {
                                this.serviceTypes.forEach(ev => {
                                    if(e == ev.serviceId) {
                                        serviceTypeList.push({
                                            serviceId: ev.serviceId,
                                            serviceName: ev.serviceName
                                        })
                                    }
                                })
                            })
                            contractForm.serviceTypeList = serviceTypeList
                        }
                        if(this.contractId) contractForm.id = this.contractId
                        if(contractForm.serviceCompanyList.length) {
                            var serviceCompanyList = []
                            contractForm.serviceCompanyList.forEach(e => {
                                e.showServiceCompanyInfo = e.showServiceCompanyInfo ? '1' : ''
                                this.serviceList.forEach(ev => {
                                    if(e.serviceCompanyId == ev.companyId) {
                                        e.serviceCompanyName = ev.name
                                        e.serviceLegalPerson = ev.corporateName
                                        e.serviceRegisterAddr = ev.address
                                        e.servicePhone = ev.telephone
                                    }
                                })
                            })
                        }
                        else {
                            contractForm.showServiceCompanyInfo = contractForm.showServiceCompanyInfo ? '1' : ''
                            console.log(contractForm.showServiceCompanyInfo)
                        }
                        contractForm.showSubjectInfo = contractForm.showSubjectInfo ? '1' : ''
                        console.log(contractForm)
                        post(url, contractForm)
                            .then(result => {
	                            showNotify('success', this.contractId ? '编辑成功' : '新建成功')
	                            // this.backToList()
                                this.$router.push('contractList')
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
                    for(var k in this.contractForm) {
                        if(result[k]) {
                            this.contractForm[k] = result[k]
                        }
                    }
                    console.log(this.contractForm.showServiceCompanyInfo)
                    this.contractForm.showServiceCompanyInfo = this.contractForm.showServiceCompanyInfo == '1'
                    this.contractForm.showSubjectInfo = this.contractForm.showSubjectInfo == '1'
                    if(this.contractForm.customUnderAttachList) {
                        this.contractForm.customUnderAttachList.forEach(e => {
                            this.files.push({
                                name: e.displayname,
                                url: e.downloadCode
                            })
                        })
                    }
                    if(this.contractForm.serviceTypeList) {
                        var serviceTypeList = []
                        this.contractForm.serviceTypeList.forEach(e => {
                            serviceTypeList.push(e.serviceId)
                        })
                        this.contractForm.serviceTypeList = serviceTypeList
                    }
                    this.getInvoiceOptions();
                    this.$refs['contractItem'].init(this.contractForm)
                    // if(this.contractForm.channelType) {
                    //     this.channelTypes = this.contractForm.channelType.split(',')
                    // }
                })
            },
	        // handleDownload(downloadCode) {
            // 	window.location.href = `/api/contract-web/contract-generate/download-single-attachment?downloadCode=${downloadCode}&id=${this.contractId}&type=docx`
            // },
            show(){
                this.isShow = !this.isShow;
                if(this.isShow){
                    this.showDesc = '收起';
                }else{
                     this.showDesc = '展开';
                }
            },
            // Fixed(a) {
            //     if(a === '' || isNaN(a)) {
            //         return ''
            //     }
            //     else {
            //         var value = (a - 0).toFixed(2)
            //         return value * 100 <= a * 100 ? value : (value - 0.01).toFixed(2)
            //     }
            // },
            // setPass(a) {
            //     this.contractForm.offer = (this.float2.test(a) && a <= 100) ? 0 : ''
            // },
            hasInsurance() {
                var isHas = false
                this.serviceTypes.forEach(e => {
                    this.contractForm.serviceTypeList.forEach(ev =>{
                        if(e.serviceId == ev && e.vciStatus == 1) {
                            isHas = true
                        }
                    })
                })
                return isHas
            },
            filterServiceList(a) {
                return this.serviceList.filter(e => {
                    return !this.contractForm.serviceCompanyList.filter((el, i) => {
                        return i < a && e.companyId == el.serviceCompanyId
                    }).length
                }) || []
            },
            checkServiceCompanyList(a) {
                this.contractForm.serviceCompanyList.forEach((e, i) => {
                    if(i > a && e.serviceCompanyId == this.contractForm.serviceCompanyList[a].serviceCompanyId) {
                        e.serviceCompanyId = ''
                    }
                })
            },
            addServiceCompany(a) {
                this.contractForm.serviceCompanyList.push({
                    serviceCompanyId: '',
                    serviceCompanyName: '',
                    showServiceCompanyInfo: ''
                })
            },
            deleteServiceCompany(a) {
                this.contractForm.serviceCompanyList.splice(a, 1)
            },
            upload(a) {
                var formData = new FormData()
                formData.append('targetType', 'vci_attach')
                formData.append('fileName', a.name)
                formData.append('file', a.raw)
                importPost('/api/contract-web/file/upload', formData, true).then(data => {
                    this.contractForm.customUnderAttachList.push({
                        refId: data.referId,
                        downloadCode: data.downloadCode,
                        displayname: data.fileName
                    })
                    this.files.push({
                        name: data.fileName,
                        url: data.downloadCode
                    })
                    this.$message({
                        type: 'success',
                        message: '上传成功！'
                    })
                })
            },
            remove(a) {
                this.files.pop()
                this.contractForm.customUnderAttachList.pop()
            },
            receive(a) {
                console.log(a)
                this.resultData = a
                this.contractForm.offer = a.check
                delete this.resultData.check
                delete this.resultData.arrIndex
                this.$refs.contractForm.validateField('offer')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .demo-contractForm {
        width: 1000px;
    }
    .item_div {
        margin-bottom: 20px;
    }
    .input_300 {
        width: 300px;
    }
    .input_200 {
        width: 200px;
    }
    .input_100 {
        width: 100px;
    }
    .mr8 {
        margin-right: 8px;
    }
    .ml86 {
        margin-left: 86px;
    }
    .ml10 {
        margin-left: 10px;
    }
    .el-icon-question {
        margin-right: 5px;
        color: #f56c6c;
        cursor: pointer;
    }
    .top_24 {
        margin-top: 24px;
    }
    .mb15 {
        margin-bottom: 15px;
    }
    .fr {
        float: right;
    }
    .w1050 {
        width: 1050px;
    }
    .mb24 {
        margin-bottom: 24px;
    }
    .w550 {
        width: 550px;
    }
    .w800 {
        width: 800px;
    }
    .mr20 {
        margin-right: 20px;
    }
    .abtn {
        display: inline-block;
        width: 80px;
        height: 22px;
        font-size: 12px;
        color: #666666;
        text-decoration: none;
        background-image: url(../../image/download.png);
        background-size: 10px 10px;
        background-repeat: no-repeat;
        background-position: 7px center;
        border: 1px solid #D9D9D9;
        border-radius: 4px;
        text-indent: 22px;
        line-height: 20px;
    }
    .abtn + div {
        display: inline;
        font-size: 12px;
        color: #999;
    }
    .form_input {
        width: 400px;
        margin-bottom: -8px;
    }
    .up_icon {
        width: 228px;
        height: 124px;
        background-image: url(../../image/upload.png);
        background-size: 41px 33px;
        background-position: center 20px;
        background-repeat: no-repeat;
        padding-top: 70px;
        border: 1px solid #D9D9D9;
        line-height: 16px;
    }
    .up_icon > div:nth-child(1) {
        text-align: center;
        font-size: 12px;
        color: #666666;
    }
    .up_icon > div:nth-child(2) {
        font-size: 12px;
        color: #999;
        margin-top: 5px;
    }
    .pro_box {
    	position: relative;
    	display: inline-block;
    	width: 193px;
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
</style>