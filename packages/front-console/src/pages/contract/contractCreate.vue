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
                <el-select v-model="contractForm.serviceCompanyId" placeholder="请选择" style="width:100%;" @change="serviceBank">
                    <el-option v-for="item in serviceList" :key="item.companyId" :label="item.name" :value="item.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="法定代表人" required>
                <el-input v-model="serviceCompany.corporateName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item  label="公司电话" >
                <el-input v-model="serviceCompany.telephone" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="公司地址" required>
                <el-input v-model="serviceCompany.address" :disabled="true"></el-input>
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
                <div class="item_div">
                    <el-radio @change="resetTable(1)" v-model="proType" label="0">标准报价：</el-radio>
                    <el-input @change="setOffer('standardRate')" class="input_300" v-model="contractForm.standardRate" placeholder="请输入数值" :disabled="proType != '0'">
                         <template slot="append">%</template>
                    </el-input>
                </div>
                <div class="item_div">
                    <el-radio @change="resetTable(0)" v-model="proType" label="1">阶梯报价：</el-radio>
                    <el-input @change="setOffer('laddersRate')" class="input_300" v-model="contractForm.laddersRate" placeholder="请输入数值" :disabled="proType != '1'">
                         <template slot="append">%</template>
                    </el-input>
                </div>
            </el-form-item>
            <el-form-item prop="table_0">
                <div class="table_head">月收入  2.8万  元（含）以下</div>
                <el-table :data="table_0">
                    <el-table-column label="月总额下限" prop="range">
                        <template slot-scope="scope">
                            <template v-if="scope.$index === 0">
                                <el-input class="input_200" :disabled="proType != '1'" placeholder="请输入数值" @change="checkTable('lv1Step1Amount', 0)" v-model="contractForm.lv1Step1Amount"></el-input> 万以下
                            </template>
                            <template v-if="scope.$index === 1">
                                <el-input class="input_100" :disabled="proType != '1'" placeholder="请输入数值" @change="checkTable('lv1Step2Amount1', 0)" v-model="contractForm.lv1Step2Amount1"></el-input>
                                -
                                <el-input class="input_100" :disabled="proType != '1'" placeholder="请输入数值" @change="checkTable('lv1Step2Amount2', 0)" v-model="contractForm.lv1Step2Amount2"></el-input> 万
                            </template>
                            <template v-if="scope.$index === 2">
                                <el-input class="input_200" :disabled="proType != '1'" placeholder="请输入数值" @change="checkTable('lv1Step3Amount', 0)" v-model="contractForm.lv1Step3Amount"></el-input> 万以上
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="管理费率" prop="rate">
                        <template slot-scope="scope">
                            <el-input class="input_200" :disabled="proType != '1'" placeholder="请输入数值" @change="checkRate(scope.row.rate, 0)" v-model="contractForm[scope.row.rate]">
                                <template slot="append">%</template>
                            </el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item prop="table_1">
                <div class="table_head">月收入  2.8万  元（含）以上</div>
                <el-table :data="table_1">
                    <el-table-column label="月总额下限" prop="range">
                        <template slot-scope="scope">
                            <template v-if="scope.$index === 0">
                                <el-input class="input_200" :disabled="proType != '1'" placeholder="请输入数值" @change="checkTable('lv2Step1Amount', 1)" v-model="contractForm.lv2Step1Amount"></el-input> 万以下
                            </template>
                            <template v-if="scope.$index === 1">
                                <el-input class="input_100" :disabled="proType != '1'" placeholder="请输入数值" @change="checkTable('lv2Step2Amount1', 1)" v-model="contractForm.lv2Step2Amount1"></el-input>
                                -
                                <el-input class="input_100" :disabled="proType != '1'" placeholder="请输入数值" @change="checkTable('lv2Step2Amount2', 1)" v-model="contractForm.lv2Step2Amount2"></el-input> 万
                            </template>
                            <template v-if="scope.$index === 2">
                                <el-input class="input_200" :disabled="proType != '1'" placeholder="请输入数值" @change="checkTable('lv2Step3Amount', 1)" v-model="contractForm.lv2Step3Amount"></el-input> 万以上
                            </template>
                        </template>
                    </el-table-column>
                    <el-table-column label="管理费率" prop="rate">
                        <template slot-scope="scope">
                            <el-input class="input_200" :disabled="proType != '1'" placeholder="请输入数值" @change="checkRate(scope.row.rate, 1)" v-model="contractForm[scope.row.rate]">
                                <template slot="append">%</template>
                            </el-input>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <h4 class="ml50 mt50">客户发放方式</h4>
            <el-form-item label="薪酬发放渠道" prop="channelType">
                <el-checkbox-group v-model="channelTypes" @change="setChannelType">
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
                <el-input v-model="contractForm.customPhone"></el-input>
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
                    offer: '1',
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
	                invoiceCompanyName: '',
	                customTaxIdcd: '',
	                customAddr: '',
	                customPhone: '',
	                customBankName: '',
	                customBankAccount: '',
                    serviceId:'',
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
                    standardRate: '',
                    laddersRate: '',
                    lv1Step1Amount: '',
                    lv1Step1Rate: '',
                    lv1Step2Amount1: '',
                    lv1Step2Amount2: '',
                    lv1Step2Rate: '',
                    lv1Step3Amount: '',
                    lv1Step3Rate: '',
                    table_0: '',
                    lv2Step1Amount: '',
                    lv2Step1Rate: '',
                    lv2Step2Amount1: '',
                    lv2Step2Amount2: '',
                    lv2Step2Rate: '',
                    lv2Step3Amount: '',
                    lv2Step3Rate: '',
                    table_1: '',
                    channelType: ''
                },
				rules: {
                    offer: [
                        {required: true, message: '请选择并填写报价', trigger: 'blur'}
                    ],
					invoiceType: [
						{required: true, message: '请选择发票类型', trigger: 'change'}
                    ],
					invoiceSubjectId: [
						{required: true, message: '请选择发票类目', trigger: 'change'}
                    ],
					serviceCompanyId: [
						{required: true, message: '请选择服务商', trigger: 'change'}
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
						{ required: true, message: '银行账号为5至20位的数字', trigger: 'blur', validator: checkBankNo  }
                    ],
                    customMail1: [
                        { required: true, message: '请填写邮箱地址', trigger: 'blur'}
                    ],
                    serviceId: [
						{required: true, message: '请选择服务类型', trigger: 'change'}
                    ],
                    contractPerson: [
						{required: true, message: '销售姓名', trigger: 'blur'}
					],
                    contractEmail: [
						{required: true, message: '销售联系人邮箱', trigger: 'blur'}
                    ],
                    contractTel: [
                        {required: true, message: '销售联系人电话', trigger: 'blur'}
                    ],
                    contractAddr: [
						{required: true, message: '销售联系人地址', trigger: 'blur'}
                    ],
                    table_0: [
                        {required: true, message: '输入有误', trigger: 'blur'}
                    ],
                    table_1: [
                        {required: true, message: '输入有误', trigger: 'blur'}
                    ],
                    channelType: [
                        {required: true, message: '至少选择一项', trigger: 'blur'}
                    ]
                },
                customList: [],
                serviceList: [],
				searchOptions: {},
                invoiceOptions: {},
                serviceTypes:{},
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
                channelTypes: []
            }
        },
        computed: {
            serviceCompany() {
                var company = this.serviceList.filter(e => e.companyId == this.contractForm.serviceCompanyId)
                return company[0] || {}
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
            resetTable(a) {
                if(a) {
                    this.contractForm.laddersRate = ''
                }
                else {
                    this.contractForm.standardRate = ''
                }
                this.$refs['contractForm'].clearValidate('offer', 'table_0', 'table_1')
            },
            setOffer(a) {
                if(this.contractForm[a] && !isNaN(this.contractForm[a]) && this.contractForm[a] > 0 && this.contractForm[a] < 100) {
                    this.contractForm.offer = '1'
                }
                else {
                    this.contractForm.offer = ''
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
            checkTable(a, index) {
                if(this.contractForm[a] && !isNaN(this.contractForm[a])) {
                    this.contractForm[`table_${index}`] = '1'
                }
                else {
                    this.contractForm[`table_${index}`] = ''
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
                this.contractForm[b] && ((this.contractForm[b] - this.contractForm[a]) < 0) && (this.contractForm[`table_${index}`] = '')
            },
            compare_1(a, b, index) {
                this.contractForm[b] && ((this.contractForm[b] - this.contractForm[a]) > 0) && (this.contractForm[`table_${index}`] = '')
            },
            checkRate(a, index) {
                if(this.contractForm[a] && !isNaN(this.contractForm[a]) && this.contractForm[a] > 0 && this.contractForm[a] < 100) {
                    this.contractForm[`table_${index}`] = '1'
                }
                else {
                    this.contractForm[`table_${index}`] = ''
                }
            },
            checkAll() {
                var amount = [
                    ['lv1Step1Amount', 'lv1Step2Amount1', 'lv1Step2Amount2', 'lv1Step3Amount'],
                    ['lv2Step1Amount', 'lv2Step2Amount1', 'lv2Step2Amount2', 'lv2Step3Amount']
                ], rate = [
                    ['lv1Step1Rate', 'lv1Step2Rate', 'lv1Step3Rate'],
                    ['lv2Step1Rate', 'lv2Step2Rate', 'lv2Step3Rate']
                ]
                amount.forEach((e, i) => {
                    e.forEach(ev => {
                        this.checkTable(ev, i)
                    })
                })
                rate.forEach((e, i) => {
                    e.forEach(ev => {
                        this.checkRate(ev, i)
                    })
                })
            },
            setChannelType() {
                if(!this.channelTypes.length) {
                    this.contractForm.channelType = ''
                }
                else {
                    var str = ''
                    for (var i = 0; i < this.channelTypes.length; i++) {
                        if(str) {
                            str += `,${this.channelTypes[i]}`
                        }
                        else {
                            str += `${this.channelTypes[i]}`
                        }
                    }
                    this.contractForm.channelType = str
                }
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
                if(this.contractForm.laddersRate) {
                    this.checkAll()
                }
                else {
                    this.contractForm.table_0 = '1',
                    this.contractForm.table_1 = '1'
                }
		        this.$refs[formName].validate(valid => {
			        if (valid) {
				        this.setContractFormData(this.searchOptions.ContractGenInvoiceType, 'invoiceType', 'value', 'text', this.contractForm.invoiceType)
				        this.setContractFormData(this.invoiceOptions, 'invoiceSubject', 'value', 'text', this.contractForm.invoiceSubjectId)
				        this.setContractFormData(this.serviceList, 'serviceCompany', 'companyId', 'name', this.contractForm.serviceCompanyId)

				        let contractForm = _.cloneDeep(this.contractForm)
                        contractForm.tplId = this.templateDetail.id
                        delete contractForm.offer
                        delete contractForm.table_0
                        delete contractForm.table_1
                        if(!contractForm.laddersRate) {
                            contractForm.lv1Step1Amount = ''
                            contractForm.lv1Step1Rate = ''
                            contractForm.lv1Step2Amount1 = ''
                            contractForm.lv1Step2Amount2 = ''
                            contractForm.lv1Step2Rate = ''
                            contractForm.lv1Step3Amount = ''
                            contractForm.lv1Step3Rate = ''
                            contractForm.lv2Step1Amount = ''
                            contractForm.lv2Step1Rate = ''
                            contractForm.lv2Step2Amount1 = ''
                            contractForm.lv2Step2Amount2 = ''
                            contractForm.lv2Step2Rate = ''
                            contractForm.lv2Step3Amount = ''
                            contractForm.lv2Step3Rate = ''
                        }

				        contractForm = _.assign(contractForm, {
					        serviceLegalPerson: this.serviceCompany.corporateName,
					        serviceRegisterAddr: this.serviceCompany.address,
                            servicePhone: this.serviceCompany.telephone
                        })

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
                    for(var k in this.contractForm) {
                        if(result[k]) {
                            this.contractForm[k] = result[k]
                        }
                    }
                    if(this.contractForm.laddersRate) {
                        this.proType = '1'
                    }
                    if(this.contractForm.channelType) {
                        this.channelTypes = this.contractForm.channelType.split(',')
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
</style>


















