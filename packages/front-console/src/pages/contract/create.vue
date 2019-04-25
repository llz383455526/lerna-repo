<template>
    <div class="bg-white p15">
        <el-form :model="contractForm" :rules="rules" ref="contractForm" label-width="200px" class="demo-contractForm">
            <h4 class="ml50">基本信息</h4>
            <span class="tip" v-if="!$route.query.contractId">*客户名称和服务商名称录入后不支持修改</span>
            <el-form-item label="合同种类" prop="type" class="hide">
                <el-input v-model="contractForm.type"></el-input>
            </el-form-item>
            <el-form-item label="文件ID" class="hide">
                <input v-model="contractForm.referIds">
            </el-form-item>
            <el-form-item label="企业名称" prop="customerId" placeholder="请输入内容">
                <el-select v-model="contractForm.customerId" filterable placeholder="请选择" style="width:100%;" :disabled="$route.query.contractId ? true : false" @change="getConfig">
                    <el-option v-for="item in customerCompaniesList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务商名称" prop="serviceCompanyIds" placeholder="请输入内容">
                <div :class="{top_24 : i != 0}" v-for="(e, i) in contractForm.serviceCompanyIds" :key="i">
                    <el-select v-model="contractForm.serviceCompanyIds[i]" filterable placeholder="请选择" style="width:100%;" @change="checkList(i)" :disabled="$route.query.contractId ? true : false">
                        <el-option v-for="item in filterList(i)" :key="item.companyId" :label="item.name" :value="item.companyId"></el-option>
                    </el-select>
                    <!-- <div class="item_right" v-if="!$route.query.contractId">
                        <el-button type="text" @click="addServiceCompany">添加</el-button>
                        <el-button type="text" @click="deleteServiceCompany(i)" v-if="i != 0">删除</el-button>
                    </div> -->
                </div>
            </el-form-item>
            <el-form-item label="行业类型" prop="cotractType" required>
                <el-select v-model="contractForm.cotractType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in invoiceTypeList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务类型" prop="serviceTypeList" >
                <el-checkbox-group v-model="contractForm.serviceTypeList">
                    <el-checkbox v-for="item in serviceTypes" :key="item.serviceId" :label="item.serviceId">{{item.serviceName}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="结算方式" prop="settleType" required>
                <el-select v-model="contractForm.settleType" placeholder="请选择" style="width:100%;"> <!-- @change="showType" -->
                    <el-option v-for="item in options_0" :key="item.value" :label="item.text" :value="item.value"></el-option>
                    </el-select>
            </el-form-item>
            <el-form-item label="服务费是否预收" prop="prePayType" required>
                <el-select v-model="contractForm.prePayType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in presell" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预收服务费" prop="prePayContent.fixFee" v-if="contractForm.prePayType == 1">
                <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="ratio" v-model="contractForm.prePayContent.serviceFeeType" @change="prveFee(1)">实发金额</el-radio>
                    </el-col>
                    <el-col :span="15">
                        <div style="float: left; width: 70px; color: #606266;">实发金额 * </div>
                        <el-input v-model="prevRatio" @blur="prveFee(1)"
                                  :disabled="!(showPrev === 1)" style="width: calc(100% - 70px);">
                            <template slot="append">% 每笔</template>
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-radio label="ratio_1" v-model="contractForm.prePayContent.serviceFeeType" @change="prveFee(2)">应发金额</el-radio>
                    </el-col>
                    <el-col :span="15">
                        <div style="display: inline-block; width: 110px; color: #606266;">实发金额 / ( 1 -  </div>
                        <el-input v-model="prevRatio_1" @blur="prveFee(2)"
                                  :disabled="!(showPrev === 2)" style="width: 135px;">
                            <template slot="append">%</template>
                        </el-input>
                        <div style="display: inline-block; width: 20px; color: #606266;">) * </div>
                        <el-input v-model="prevRatio_1" @blur="prveFee(2)"
                                  :disabled="!(showPrev === 2)" style="width: 160px;">
                            <template slot="append">% 每笔</template>
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="发票类型" prop="invoiceType" required>
                <el-select v-model="contractForm.invoiceType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="e in invoiceType_0" :label="e.text" :value="e.value" :key="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="开票类型" prop="openInvoiceType">
                <el-radio v-model="contractForm.openInvoiceType" v-for="item in invoiceType" :key="item.value" :label="item.value">{{item.text}}</el-radio>
            </el-form-item>
            <el-form-item label="服务费收费比例" prop="serviceFeeContent.fixFee">
                <contract-create-item @result="createResult" :contractForm="contractForm" ref="contractCreateItem"></contract-create-item>
                <!--  -->
            </el-form-item>
            <el-form-item label="合同起止时间" prop="startDate">
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        :unlink-panels="true"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @change="handleChange">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="客户类型" prop="originalType">
                <el-radio v-for="e in originalTypeList" v-model="contractForm.originalType" :key="e.value" :label="e.value" @change="getOriginalTypeName" disabled>{{e.text}}</el-radio>
            </el-form-item>
            <template v-if="contractForm.originalType == 20">
                <el-form-item label="代理商名称" prop="agentCompanyId"> <!-- .filter(e => e.status == '10') -->
                    <el-select v-model="contractForm.agentCompanyId" style="width:100%;" @change="companyChange(true)" disabled filterable>
                        <el-option v-for="e in agentList" :key="e.companyId" :label="e.companyName" :value="e.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <!-- <el-form-item label="代理商分润比例" prop="agentFeeContent.serviceFeeRate">
                    <div style="float: left; width: 70px; color: #606266;">实发金额 * </div>
                    <el-input v-model="contractForm.agentFeeContent.serviceFeeRate" :disabled="agentDisable" style="width: calc(100% - 70px);">
                        <template slot="append">% 每笔</template>
                    </el-input>
                </el-form-item> -->
                <el-form-item label="渠道经理" required>
                    <el-input v-model="chargeByName" disabled></el-input>
                </el-form-item>
                <el-form-item label="报价规则" prop="quoteRule">
                  <el-radio v-for="e in ruleList" :key="e.value" v-model="contractForm.quoteRule" :label="e.value">{{e.text}}</el-radio>
                  <i class="el-icon-question ml10" title="结算规则：按高于结算费率的部分结算   返佣规则：按返佣费率直接返佣"></i>
                </el-form-item>
                <el-form-item label="代理推广费率" prop="check">
                  <contract-close-item @result="result" :form="contractForm" :initCheck="true" ref="contract"></contract-close-item>
                </el-form-item>
            </template>
            <el-form-item label="客户归属" prop="original">
              <el-radio v-for="e in originals" v-model="contractForm.original" :key="e.value" :label="e.value" disabled>{{e.text}}</el-radio>
            </el-form-item>
            <h4 class="ml50 mt50">合同文件</h4>
            <el-upload
                class="upload-demo ml50"
                :action="uploadUrl"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="handleBeforeUpload"
                :http-request="hanldleHttpRequest"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.png,.gif"
                :show-file-list="false"
                :file-list="fileList">
                <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
            <div class="pl50 mb50">
                <el-table :data="fileList">
                    <el-table-column prop="fileName" label="文件名称"></el-table-column>
                    <el-table-column prop="createTime" label="上传时间">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="createByName" label="操作人"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button @click="handleDownload(scope.row.downloadCode)" type="text" size="medium"
                                       style="padding:0;">下载
                            </el-button>
                            <el-button  type="text" size="medium"
                                       style="padding:0;" @click="dialogVisible = true, downloadCode = scope.row.downloadCode, deleteKey = scope.$index">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </el-form>
        <h4 class="ml50 mt50">关联企业</h4>
        <div class="left_50">
            <el-form size="small" :inline="true">
                <el-form-item label="企业关键词">
                    <el-input v-model="form.fullName"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="query">查询</el-button>
                    <el-button size="small" @click="form.fullName = ''">清空</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="company.list" >
                <el-table-column label="企业名称" prop="fullName" width="300"></el-table-column>
                <el-table-column label="操作" width="300">
                    <template slot-scope="scope">
                        <el-button :class="{gray: ishave(scope.row)}" type="text" @click="relevance(scope.row)">关联</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="top_24" v-show="company.total / form.pageSize > 1">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="form.pageSize"
                    :total="company.total"
                    @current-change="query"
                    :currentPage="form.page">
                </el-pagination>
            </div>
        </div>
        <h4 class="ml50 mt50" v-if="contractForm.branchs.length">关联企业名称</h4>
        <div class="flex">
            <div v-for="(e, i) in contractForm.branchs" :key="e.branchId">
                {{e.branchName}}
                <span @click="remove(e, i)"></span>
            </div>
        </div>
        <div class="footer top_24">
            <el-button type="primary" @click="submitForm('contractForm')">保存</el-button>
            <el-button @click="routerPush('/main/contract/list')">取消</el-button>
        </div>
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
    import _ from 'lodash';
    import {mapGetters} from 'vuex';
    import {get, post, formPost} from "../../store/api";
    import {baseUrl} from '../../config/address';
    import {showNotify} from '../../plugin/utils-notify';
    import fileUploader from '../../component/fileUploader'
    import { checkPhone } from '../../plugin/utils-element-validator'
    import contractCloseItem from '../../pageComponent/contractCloseItem'
    import contractCreateItem from '../../pageComponent/contractCreateItem'
    export default {
        components: {
            fileUploader,
            contractCloseItem,
            contractCreateItem
        },
        data() {
            var validatorSettleExp = (rule, value, callback) => {
                if (this.contractForm.settleType == 'week') {
                    if (this.contractForm.settleExp == '') {
                        callback(new Error('请选择结算日期'));
                    } else {
                        callback();
                    }
                }
                if (this.contractForm.settleType == 'month') {
                    if (this.radio == '固定日') {
                        if (this.settleExpDay) {
                            this.contractForm.settleExp = this.settleExpDay;
                            callback();
                        } else {
                            callback(new Error('请选择结算日期'));
                        }
                    }
                    if (this.radio == '范围日') {
                        if (!this.settleExpStart || !this.settleExpEnd) {
                            callback(new Error('请选择结算日期'));
                        } else if (parseInt(this.settleExpStart.replace('每月', '').replace('日', ''))
                            > parseInt(this.settleExpEnd.replace('每月', '').replace('日', ''))) {
                            callback(new Error('开始时间大于结束时间'));
                        } else if (this.settleExpStart && this.settleExpEnd) {
                            this.contractForm.settleExp = this.settleExpStart + ',' + this.settleExpEnd;
                            callback();
                        }
                    }
                }
            };
            var f2 = (rule, value, cb) => {
                if(!this.float2.test(value)) {
                    return cb('请输入正确的服务费收费（大于零且最多两位小数）')
                }
                return cb()
            }
            let f2_0 = (rule, value, cb) => {
                if(!this.float2_0.test(value)) {
                    return cb('请输入正确的服务费收费（大于零且最多两位小数）')
                }
                return cb()
            }
            return {
                rules: {
                    customerId: [
                        {required: true, message: '请输入企业名称', trigger: 'blur'}
                    ],
                    serviceCompanyName: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    serviceCompanyIds: [
                        {required: true, message: '请输入服务商名称', trigger: 'blur'}
                    ],
                    serviceCompanyId: [
                        {required: true, message: '请输入服务商名称', trigger: 'blur'}
                    ],
                    cotractType: [
                        {required: true, message: '请选择合同类型', trigger: 'blur'}
                    ],
                    serviceTypeList: [
                        {required: true, message: '请选择服务类型', trigger: 'blur'}
                    ],
                    settleType: [
                        {required: true, message: '请选择结算方式', trigger: 'blur'}
                    ],
                    settleExp: [
                        {validator: validatorSettleExp, trigger: 'blur'}
                    ],
                    invoiceType: [
                        {required: true, message: '请选择发票类型', trigger: 'blur'}
                    ],
                    'serviceFeeContent.fixFee': [
                        {required: true, message: '请输入正确的服务费收费（大于零且最多两位小数）', trigger: 'blur'}
                    ],
                    startDate: [
                        {required: true, message: '请选择合同起止时间', trigger: 'blur'}
                    ],
                    endDate: [
                        {required: true, message: '请选择合同起止时间', trigger: 'blur'}
                    ],
                    'prePayContent.fixFee': [
                        {type: 'number', required: true, message: '请输入正确的服务费收费（大于零且最多两位小数）', trigger: 'blur'}
                    ],
                    openInvoiceType: [
                        {required: true, message: '请输入开票类型', trigger: 'blur'}
                    ],
                    // agentClient: [
                    //     {required: true, message: '请选择', trigger: 'blur'}
                    // ],
                    originalType: [
                      {required: true, message: '请选择客户类型', trigger: 'blur'}
                    ],
                    agentCompanyId: [
                        {required: true, message: '请选择代理商', trigger: 'blur'}
                    ],
                    'agentFeeContent.serviceFeeRate': [
                        {required: true, message: '请输入正确的服务费收费（大于或等于零且最多两位小数）', trigger: 'blur'},
                        {validator: f2_0, trigger: 'blur'}
                    ],
                    quoteRule: [
                      { required: true, message: "请选择报价规则", trigger: "blur" }
                    ],
                    original: [
                      {required: true, message: '请选择客户归属', trigger: 'blur'}
                    ],
                    check: [
                      { required: true, message: "请输入正确的结算费率（大于零且最多两位小数）", trigger: "blur" }
                    ]
                },
                // weekVisible: false,
                // monthVisible: false,
                showInputRatio: -1,
                showInputFixed: false,
                showSelectExpDay: false,
                showSelectExpStart: true,
                dialogVisible: false,
                downloadCode: '',
                formData: '',
                dateValue: '',
                uploadUrl: '',
                settleExpDay: '',
                settleExpStart: '',
                settleExpEnd: '',
                inputFixed: '',
                inputRatio: '',
                inputRatio_1: '',
                radio: '固定日',
                customerCompaniesList: [],
                serviceCompaniesList: [],
                tableData: [],
                restaurants1: [],
                restaurants2: [],
                fileList: [],
                referArr: [],
                options: [
                    {value: '每月1日', label: '每月1日'},
                    {value: '每月2日', label: '每月2日'},
                    {value: '每月3日', label: '每月3日'},
                    {value: '每月4日', label: '每月4日'},
                    {value: '每月5日', label: '每月5日'},
                    {value: '每月6日', label: '每月6日'},
                    {value: '每月7日', label: '每月7日'},
                    {value: '每月8日', label: '每月8日'},
                    {value: '每月9日', label: '每月9日'},
                    {value: '每月10日', label: '每月10日'},
                    {value: '每月11日', label: '每月11日'},
                    {value: '每月12日', label: '每月12日'},
                    {value: '每月13日', label: '每月13日'},
                    {value: '每月14日', label: '每月14日'},
                    {value: '每月15日', label: '每月15日'},
                    {value: '每月16日', label: '每月16日'},
                    {value: '每月17日', label: '每月17日'},
                    {value: '每月18日', label: '每月18日'},
                    {value: '每月19日', label: '每月19日'},
                    {value: '每月20日', label: '每月20日'},
                    {value: '每月21日', label: '每月21日'},
                    {value: '每月22日', label: '每月22日'},
                    {value: '每月23日', label: '每月23日'},
                    {value: '每月24日', label: '每月24日'},
                    {value: '每月25日', label: '每月25日'},
                    {value: '每月26日', label: '每月26日'},
                    {value: '每月27日', label: '每月27日'},
                    {value: '每月28日', label: '每月28日'},
                    {value: '每月29日', label: '每月29日'},
                    {value: '每月30日', label: '每月30日'},
                    {value: '每月31日', label: '每月31日'}
                ],
                contractForm: {
                    customerName: '',
                    customerId: '',
                    type: 'customer',
                    openInvoiceType: '',
                    branchs: [],
                    serviceTypeList: [],
                    serviceCompanyIds: [null],
                    prePayType: '',
                    prePayContent: {
                        discountRate: '',
                        fixFee: '',
                        secondType: 'real',
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio'
                    },
                    serviceFeeContent: {
                        discountRate: '',
                        secondType: 'real',
                        fixFee: 0,
                        monthIncomeAmount: 1,
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio',
                        containMonthAmount: true,
                        stepwiseList: []
                    },
                    serviceFeeContent2: {
                        containMonthAmount: false,
                        monthIncomeAmount: '',
                        stepwiseList: []
                    },
                    // serviceFee: '',
                    settleExp: '1',
                    // serviceFeeRate: '',
                    // shouldAmountRate: ''
                    tplAttachType: '',
                    // -----------------------
                    agentClient: '',
                    agentCompanyId: '',
                    agentCompanyName: '',
                    agentFeeContent: {
                        discountRate: '',
                        fixFee: '',
                        secondType: 'real',
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio'
                    },
                    quoteRule: '',
                    quoteFeeContent: {
                      containIncomeAmount: '',
                      incomeAmount: '',
                      quoteFeeRate: '',
                      quoteFeeType: '',
                      serviceCompanyRateList: [
                        {
                          feeRateContent: {
                            containIncomeAmount: '',
                            incomeAmount: '',
                            quoteFeeRate: '',
                            quoteFeeType: '',
                            // stepwiseList: [  //目前用不到
                            //   {
                            //     endAmount: '',
                            //     equalsEnd: '',
                            //     equalsStart: '',
                            //     percent: '',
                            //     sequence: '',
                            //     startAmount: ''
                            //   }
                            // ]
                          },
                          serviceCompanyId: '',
                          serviceCompanyName: ''
                        }
                      ],
                      stepwiseList: [
                        {
                          endAmount: '',
                          equalsEnd: '',
                          equalsStart: '',
                          percent: '',
                          sequence: '',
                          startAmount: ''
                        }
                      ]
                    },
                    original: '',
                    originalType: '',
                    originalTypeName: ''
                },
                showPrev: 1,
                prevFixed: '',
                prevRatio: '',
                prevRatio_1: '',
                deleteKey: '',
                invoiceType: [],
                invoiceType_0: [],
                options_0: [],
                presell: [
                    {
                        text: '是',
                        value: '1'
                    },
                    {
                        text: '否',
                        value: '0'
                    }
                ],
                form: {
                    fullName: '',
                    page: 1,
                    pageSize: 10
                },
                company: {},
                serviceTypes: [],
                invoiceTypeList: [],
                float2: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                float2_0: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                agentList: [],
                chargeByName: '',
                agentDisable: false,
                originals: [],
                ruleList: [
                  {
                    text: '结算规则',
                    value: 'settle'
                  },
                  {
                    text: '返佣规则',
                    value: 'rakeback'
                  }
                ],
                originalTypeList: []
            }
        },
        // watch: {
        //   ['contractForm.agentClient'](e) {
        //     if(!e) {
        //       this.contractForm.agentCompanyId = ''
        //       this.contractForm.agentCompanyName = ''
        //       this.contractForm.agentFeeContent.serviceFeeRate = ''
        //       this.chargeByName = ''
        //     }
        //   }
        // },
        created() {
            this.uploadUrl = baseUrl + "/api/console-dlv/file/upload";
            this.getOptionServiceCompanies();
            this.getType()
            if (this.$route.query.contractId) {
                this.queryDetail(this.$route.query.contractId);
                this.queryAttachments(this.$route.query.contractId);
            }
            else {
                this.getOptionCustomerCompanies();
            }
            get('/api/contract-web/commom/option', {enumType: 'SettleType'}).then(data => {
                this.options_0 = data
            })
            get('/api/contract-web/commom/option?enumType=InvoiceType').then(data => {
                this.invoiceType_0 = data
            })
	          get('/api/contract-web/service-mgr/get-service-type-options', {}).then(result => {
                this.serviceTypes = result
            })
            get('/api/sysmgr-web/commom/option?enumType=IndustryType').then(data => {
                this.invoiceTypeList = data
            })
            get('/api/contract-web/agent-contract/agent-company-option').then(data => {
                this.agentList = data
                this.contractForm.agentCompanyId && this.companyChange(false)
            })
            get('/api/sysmgr-web/commom/option?enumType=CustomOriginal').then(data => {
              this.originals = data
            })
            get('/api/sysmgr-web/commom/option?enumType=OriginalType').then(data => {
                this.originalTypeList = data
            })
        },
        methods: {
            getConfig(ev) {
                this.customerCompaniesList.forEach(e => {
                    if(e.id == this.contractForm.customerId) {
                        console.log(e)
                        this.contractForm.original = e.original
                        this.contractForm.originalType = e.originalType
                        this.contractForm.agentCompanyId = e.agentCompanyId
                        // 这里有毒 我给代码加点毒 ... 
                        // 这个有毒的代码不懂可联系我 扣扣 308561157
                        this.$route.query.contractId ? '' : this.contractForm.serviceCompanyIds = [null]
                        this.getOptionServiceCompanies(this.contractForm.agentCompanyId)
                    }
                })
            },
            getOriginalTypeName() {
              this.originalTypeList.forEach(e => {
                if(this.contractForm.originalType == e.value) {
                  this.contractForm.originalTypeName = e.text
                }
              })
            },
            addServiceCompany() {
                this.contractForm.serviceCompanyIds.push(null)
            },
            deleteServiceCompany(a) {
                if(!isNaN(a)) {
                    this.contractForm.serviceCompanyIds.splice(a, 1)
                }
            },
            filterList(a) {
                if(isNaN(a)) {
                    a = 0
                }
                return this.serviceCompaniesList.filter(e => {
                    var index = this.contractForm.serviceCompanyIds.indexOf(e.companyId)
                    return index < 0 || index > a - 1
                })
            },
            checkList(a) {
                if(isNaN(a)) {
                    a = 0
                }
                var curr = this.contractForm.serviceCompanyIds[a], time = 0
                this.contractForm.serviceCompanyIds.forEach((e, i) => {
                    if(e == curr) {
                        time++
                        if(time > 1) {
                            this.contractForm.serviceCompanyIds[i] = null
                        }
                    }
                })
            },
            getType() {
                get('/api/sysmgr-web/commom/option?enumType=OpenInvoiceType').then(data => {
                    this.invoiceType = data
                    this.contractForm.openInvoiceType = this.invoiceType[0].value
                })
            },
            routerPush(val) {
                this.$router.push({
                    path: val,
                    query: {
                        page: this.$route.query.page
                    }
                });
            },
            result(a) {
              this.contractForm.check = a.check
              this.contractForm.quoteFeeContent = a.quoteFeeContent
            },
            submitForm(formName) {
                let url;
                if (this.$route.query.contractId) {
                    url = '/api/contract-web/contract/update-contract'
                } else {
                    url = '/api/contract-web/contract/add-contract';
                }
                let self = this;
                _.foreach(this.customerCompaniesList, function (value) {
                    if (value['companyId'] == self.contractForm.customerId) {
                        self.contractForm.customerName = value['companyName'];
                        return false;
                    } else {
                        self.contractForm.customerName = '';
                    }
                });
                this.calcuCompanyId()
                this.contractForm.referIds = this.referArr;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        var contractForm = JSON.parse(JSON.stringify(this.contractForm))
                        if(contractForm.prePayContent.serviceFeeType == 'ratio_1') {
                            contractForm.prePayContent.serviceFeeType = 'ratio'
                        }
                        if(contractForm.serviceTypeList) {
                            var serviceTypeList = []
                            contractForm.serviceTypeList.forEach(e => {
                                this.serviceTypes.forEach(ev => {
                                    if(e == ev.serviceId) {
                                        serviceTypeList.push(ev)
                                    }
                                })
                            })
                            contractForm.serviceTypeList = serviceTypeList
                        }
                        delete contractForm.prePayContent.stepwiseList //临时 需要删除
                        post(url, contractForm).then(data => {
                            showNotify('success', data);
                            this.$router.push({path: '/main/contract/list'});
                            // this.invoiceUpdate(data)
                        });
                    }else {
                        showNotify('error', '请检查输入项错误！')
                    }
                });
            },
            updateAttachment(contractId, referId) {
                let url = '/api/contract-web/contract/update-contract-attachment';
                post(url, {
                    contractId: contractId,
                    referId: referId
                }).then(data => {
                    showNotify('success', '绑定客户合同成功');
                })
            },
            showSelectExpSelect() {
                if (this.radio == '范围日') {
                    this.showSelectExpStart = false;
                    this.showSelectExpDay = true;
                } else {
                    this.showSelectExpStart = true;
                    this.showSelectExpDay = false;
                }
            },
            createResult(a) {
                this.contractForm.serviceFeeContent = a.serviceFeeContent
                this.contractForm.serviceFeeContent2 = a.serviceFeeContent2
            },
            prveFee(a) {
                if (this.contractForm.prePayContent.serviceFeeType == 'ratio') {
                    this.contractForm.prePayContent.secondType = 'real'
                    this.contractForm.prePayContent.serviceFeeRate = this.Fixed(this.prevRatio);
                    this.contractForm.prePayContent.fixFee = (this.float2.test(this.prevRatio) && this.prevRatio <= 100) ? 0 : ''
                    this.showPrev = a;
                }
                if (this.contractForm.prePayContent.serviceFeeType == 'ratio_1') {
                    this.contractForm.prePayContent.secondType = 'should'
                    this.contractForm.prePayContent.discountRate = this.Fixed(this.prevRatio_1);
                    this.contractForm.prePayContent.serviceFeeRate = this.Fixed(this.prevRatio_1);
                    this.contractForm.prePayContent.fixFee = (this.float2.test(this.prevRatio_1) && this.prevRatio_1 <= 100) ? 0 : ''
                    this.showPrev = a;
                }
                this.$refs['contractForm'].validateField('prePayContent.fixFee')
            },
            calcuServiceFeeReverse() {
                if(this.contractForm.prePayContent.secondType == 'real') {
                    this.prevRatio = this.contractForm.prePayContent.serviceFeeRate
                }
                if(this.contractForm.prePayContent.secondType == 'should') {
                    this.prevRatio_1 = this.contractForm.prePayContent.serviceFeeRate
                    this.contractForm.prePayContent.serviceFeeType = 'ratio_1'
                    this.showPrev = 2
                }
            },
            calcuCompanyId() {
                let self = this;
                _.foreach(this.serviceCompaniesList, function (value) {
                    if (value['companyName'] == self.contractForm.serviceCompanyName) {
                        self.contractForm.serviceCompanyId = value['companyId'];
                        return false;
                    } else {
                        self.contractForm.serviceCompanyId = '';
                    }
                })
            },
            calcuPhone() {
                if (!isNaN(this.contractForm.invoicePhone)) {
                    this.contractForm.invoicePhone = parseInt(this.contractForm.invoicePhone)
                }
            },
            getOptionCustomerCompanies() {
                let url = '/api/sysmgr-web/commom/company?companyIdentity=custom';
                let self = this;
                get(url).then(data => {
                    self.customerCompaniesList = data;
                    _.foreach(data, function (value) {
                        self.restaurants1.push({
                            "value": value['companyName']
                        });
                    });
                    this.getConfig()
                })
            },
            getOptionServiceCompanies(agentCompanyId = '') {
                let url = '/api/salemgt/common/service-company/list?businessed=true';
                let param = {
                    agentCompanyId
                };
                let self = this;
                get(url, param).then(data => {
                    self.serviceCompaniesList = data
                    _.foreach(data, function (value, key) {
                        self.restaurants2[key] = {
                            "value": value['companyName']
                        }
                    })
                })
            },
            querySearch1(queryString, cb) {
                var restaurants = this.restaurants1;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            querySearch2(queryString, cb) {
                var restaurants = this.restaurants2;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            handleSelect() {
                this.calcuCompanyId();
                this.$refs['contractForm'].validateField('serviceCompanyId')
            },
            handleSuccess(file) {
                this.fileList.push(file.data);
                this.referArr.push(file.data.referId);
            },
            handleError() {
                showNotify('error', '上传失败!');
            },
            handleDownload(downloadCode) {
                window.location.href = baseUrl + '/api/contract-web/file/download'
                    + '?downloadCode=' + downloadCode;
            },
            handleDelete() {
                if (this.downloadCode) {
                    post('/api/contract-web/file/delete', {downloadCode: this.downloadCode}).then(data => {
                        // showNotify('success', data);
                        //this.queryAttachments(this.$route.query.contractId);
                        showNotify('success', '删除成功')
                        this.fileList.splice(this.deleteKey, 1)
                        this.referArr.splice(this.deleteKey, 1)
                        this.dialogVisible = false;
                    });
                }
            },
            handleBeforeUpload(file) {
                var AllImgExt = ".doc|.docx|.pdf|.jpg|.png|.gif";
                var extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
                if (AllImgExt.indexOf(extName) == -1) {
                    showNotify('error', '文件类型错误');
                    return false;
                }
                let formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('file', file);
                this.formData = formData;
            },
            hanldleHttpRequest() {
                let url = '/api/contract-web/file/upload';
                formPost(url, this.formData).then(data => {
                    this.fileList.push(data);
                    this.referArr.push(data.referId);
                    showNotify('success', '上传成功!');
                    if (this.$route.query.contractId) {
                        this.updateAttachment(this.$route.query.contractId, data.referId);
                    }
                });
            },
            handleChange() {
                if (this.dateValue) {
                    this.contractForm.startDate = this.dateValue[0];
                    this.contractForm.endDate = this.dateValue[1];
                } else {
                    this.contractForm.startDate = '';
                    this.contractForm.endDate = '';
                    this.$refs['contractForm'].validateField('startDate')
                }
            },
            handdleChangeReverse() {
                this.dateValue = [this.contractForm.startDate, this.contractForm.endDate];
            },
            queryDetail(id) {
                let url = '/api/contract-web/contract/contract-detail';
                get(url, {contractId: id}).then(data => {
                    this.contractForm = data;
                    delete this.contractForm.invoiceCompanyName
                    delete this.contractForm.invoiceTin
                    delete this.contractForm.invoiceAddress
                    delete this.contractForm.invoicePhone
                    delete this.contractForm.invoiceBank
                    delete this.contractForm.invoiceAccount
                    if(!this.contractForm.prePayContent) {
                        this.contractForm.prePayContent = {
                            discountRate: '',
                            fixFee: '',
                            secondType: 'real',
                            serviceFeeRate: '',
                            serviceFeeType: 'ratio'
                        }
                    }
                    if(!this.contractForm.serviceTypeList) {
                        this.contractForm.serviceTypeList = []
                    }
                    else {
                        var serviceTypeList = []
                        this.contractForm.serviceTypeList.forEach(e => {
                            serviceTypeList.push(e.serviceId)
                        })
                        this.contractForm.serviceTypeList = serviceTypeList
                    }
                    this.contractForm.prePayContent.fixFee = this.contractForm.prePayContent.fixFee || 0
                    this.contractForm.serviceFeeContent.fixFee = this.contractForm.serviceFeeContent.fixFee || 0
                    this.contractForm.serviceFeeContent.monthIncomeAmount = this.contractForm.serviceFeeContent.monthIncomeAmount || '2.8'
                    if(this.contractForm.serviceFeeContent2 && !this.contractForm.serviceFeeContent2.containMonthAmount && !this.contractForm.serviceFeeContent.containMonthAmount) {
                        this.contractForm.serviceFeeContent.containMonthAmount = true
                    }
                    if(!this.contractForm.agentFeeContent) {
                        this.contractForm.agentFeeContent = {
                            discountRate: '',
                            fixFee: '',
                            secondType: 'real',
                            serviceFeeRate: '',
                            serviceFeeType: 'ratio'
                        }
                    }
                    // 根据服务公司id过滤
                    let serviceCompanyRateList = this.contractForm.quoteFeeContent.serviceCompanyRateList, serviceCompanyIds = this.contractForm.serviceCompanyIds
                    if(serviceCompanyRateList && serviceCompanyRateList.length) {
                        this.contractForm.quoteFeeContent.serviceCompanyRateList = serviceCompanyRateList.filter(e => {
                            return serviceCompanyIds.filter(ev => ev == e.serviceCompanyId).length
                        })
                    }
                    this.getOptionCustomerCompanies()
                    this.calcuServiceFeeReverse();
                    this.handdleChangeReverse();
                    // this.showType(this.contractForm.settleType);
                    this.$refs.contractCreateItem.init(this.contractForm)
                    this.$forceUpdate()
                    this.agentList && this.companyChange(false)
                    this.getConfig()
                })
            },
            queryAttachments(id) {
                let url = '/api/contract-web/contract/contract-attachments';
                get(url, {contractId: id}).then(data => {
                    this.fileList = data;
                });
            },
            query(a) {
                if(isNaN(a)) {
                    a = 1
                }
                this.form.page = a
                post('/api/sysmgr-web/company/query-customer-company', this.form).then(data => {
                    this.company = data
                })
            },
            relevance(a) {
                !this.ishave(a) && this.contractForm.branchs.push({
                    branchId: a.id,
                    branchName: a.fullName
                })
            },
            remove(a, b) {
                // if(!a.recordId) {
                this.contractForm.branchs.splice(b, 1)
                // }
                // else {
                //     post('/api/contract-web/contract/delete-branch', {
                //         recordId: a.recordId
                //     }).then(data => {
                //         this.contractForm.branchs.splice(b, 1)
                //     })
                // }
            },
            ishave(a) {
                var arr = this.contractForm.branchs.filter(e => {
                    return a.id == e.branchId
                })

                return arr.length
            },
            Fixed(a) {
                if(a === '' || isNaN(a)) {
                    return ''
                }
                else {
                    var value = (a - 0).toFixed(2)
                    return value * 100 <= a * 100 ? value : (value - 0.01).toFixed(2)
                }
            },
            setPass(a) {
                this.contractForm.serviceFeeContent.fixFee = (this.float2.test(a) && a <= 100) ? 0 : ''
            },
            companyChange(isSel) {
                this.agentList.forEach(e => {
                    if(e.companyId == this.contractForm.agentCompanyId) {
                        if(!e.status) {
                          this.agentDisable = true
                        }
                        this.chargeByName = e.chargeByName
                        this.contractForm.agentCompanyName = e.companyName
                        if(isSel) {
                            this.contractForm.quoteRule = e.quoteRule
                            this.contractForm.quoteFeeContent = e.quoteFeeContent
                            this.$refs.contract.init(this.contractForm)
                        }
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .demo-contractForm {
        width: 1200px;
    }

    .line {
        text-align: center;
    }
    .tip {
        color: #999;
        font-size: 14px;
        margin-left: 200px;
        padding-bottom: 10px;
        display: block;
    }
</style>

<style scoped>
    .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
        margin-left: 0;
    }

    .el-icon-question {
        margin-left: 5px;
        color: #f56c6c;
        cursor: pointer;
    }

    .is-disabled input {
        border-color: #e4e7ed !important;
    }

    .top_24 {
        position: relative;
        margin-top: 24px;
    }

    .item_right {
        position: absolute;
        top: 0px;
        right: -120px;
        width: 100px;
    }

    .input_100 {
        width: 120px;
    }

    .center {
        text-align: center;
    }

    .footer {
        text-indent: 400px;
    }

    .left_50 {
        padding-left: 50px;
    }

    .flex {
        display: flex;
        margin-top: 24px;
        margin-left: 50px;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .flex > div {
        font-size: 14px;
        border-radius: 2px;
        background-color: #f4f4f5;
        padding: 5px 5px;
        margin-bottom: 10px;
        margin-right: 10px;
    }
    .flex span {
        float: right;
        display: inline-block;
        width: 30px;
        height: 100%;
        cursor: pointer;
        background-image: url(../../image/close.png);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center center;
    }
    .gray {
        filter: grayscale(1);
        cursor: not-allowed;
    }
    .el-radio__label {
        text-align: center;
        display: inline-block;
    }
    .upload-demo {
        display: inline-block;
    }
    .ml20 {
        margin-left: 20px;
    }
    .el-icon-question {
        margin-right: 5px;
        color: #f56c6c;
        cursor: pointer;
    }
</style>
