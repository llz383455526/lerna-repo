<template>
    <div class="bg-white p15">
        <el-form :model="contractForm" :rules="rules" ref="contractForm" label-width="200px" class="demo-contractForm">
            <h4 class="ml50">基本信息</h4>
            <el-form-item label="合同种类" prop="type" class="hide">
                <el-input v-model="contractForm.type"></el-input>
            </el-form-item>
            <el-form-item label="文件ID" class="hide">
                <input v-model="contractForm.referIds">
            </el-form-item>
            <el-form-item label="客户名称" prop="customerName" placeholder="请输入内容">
                <el-select v-model="contractForm.customerName" filterable placeholder="请选择" @change="getInvoice" style="width:100%;">
                    <el-option v-for="item in customerCompaniesList" :key="item.companyId" :label="item.companyName"
                               :value="item.companyName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务商名称" prop="serviceCompanyName" placeholder="请输入内容">
                <el-select v-model="contractForm.serviceCompanyName" filterable placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in serviceCompaniesList" :key="item.companyId" :label="item.companyName"
                               :value="item.companyName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同类型" prop="cotractType" required>
                <el-select v-model="contractForm.cotractType" placeholder="请选择" style="width:100%;">
                    <el-option label="直播" value="ZhiBo"></el-option>
                    <el-option label="保险" value="BaoXian"></el-option>
                    <el-option label="市场推广" value="sctg"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算方式" prop="settleType" required>
                <el-select v-model="contractForm.settleType" placeholder="请选择" @change="showType" style="width:100%;">
                	<el-option label="实时" value="each"></el-option>
                    <el-option label="日结" value="day"></el-option>
                    <el-option label="周结" value="week"></el-option>
                    <el-option label="月结" value="month"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算日期" v-if="weekVisible" prop="settleExp">
                <el-select v-model="contractForm.settleExp" placeholder="请选择" style="width:100%;">
                    <el-option label="每周一" value="每周一"></el-option>
                    <el-option label="每周二" value="每周二"></el-option>
                    <el-option label="每周三" value="每周三"></el-option>
                    <el-option label="每周四" value="每周四"></el-option>
                    <el-option label="每周五" value="每周五"></el-option>
                    <el-option label="每周六" value="每周六"></el-option>
                    <el-option label="每周日" value="每周日"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算日期" v-if="monthVisible" prop="settleExp">
                <el-row class="mb15">
                    <el-col :span="4">
                        <el-radio-group v-model="radio" @change="showSelectExpSelect">
                            <el-radio label="固定日"></el-radio>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="settleExpDay" placeholder="请选择" style="width: 100%;" :disabled="showSelectExpDay">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">
                        <el-radio-group v-model="radio" @change="showSelectExpSelect">
                            <el-radio label="范围日"></el-radio>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="settleExpStart" placeholder="请选择" style="width: 100%;" :disabled="showSelectExpStart">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="8">
                        <el-select v-model="settleExpEnd" placeholder="请选择" style="width: 100%;" :disabled="showSelectExpStart">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="发票类型" prop="invoiceType" required>
                <el-select v-model="contractForm.invoiceType" placeholder="请选择" style="width:100%;">
                    <el-option label="增值税普通发票" value="zzspt"></el-option>
                    <el-option label="增值税专用发票" value="zzszy"></el-option>
                    <el-option label="其他普通发票" value="qtpt"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务费收费比例" prop="serviceFee">
                <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="fixed" v-model="contractForm.serviceFeeType" @change="calcuServiceFee(0)">固定金额收费
                        </el-radio>
                    </el-col>
                    <el-col :span="15">
                        <el-input placeholder="请输入内容" v-model="inputFixed" @blur="calcuServiceFee(0)"
                                  :disabled="!(showInputRatio === 0)">
                            <template slot="append">元 每笔</template>
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <i class="el-icon-question" title="表示按照固定金额来收取服务费。计算公式：固定收费金额 = 服务费"></i>
                    </el-col>
                </el-row>
                <el-row class="mb15">
                    <el-col :span="6">
                        <el-radio label="ratio" v-model="contractForm.serviceFeeType" @change="calcuServiceFee(1)">固定比例收费
                        </el-radio>
                    </el-col>
                    <el-col :span="15">
                        <div style="float: left; width: 70px; color: #606266;">实发金额 * </div>
                        <el-input v-model="inputRatio" @blur="calcuServiceFee(1)"
                                  :disabled="!(showInputRatio === 1)" style="width: calc(100% - 70px);">
                            <template slot="append">% 每笔</template>
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-radio label="ratio_1" v-model="contractForm.serviceFeeType" @change="calcuServiceFee(2)">固定比例收费
                        </el-radio>
                    </el-col>
                    <el-col :span="15">
                        <div style="display: inline-block; width: 110px; color: #606266;">实发金额 / ( 1 -  </div>
                        <el-input v-model="inputRatio_1" @blur="calcuServiceFee(2)"
                                  :disabled="!(showInputRatio === 2)" style="width: 135px;">
                            <template slot="append">%</template>
                        </el-input>
                        <div style="display: inline-block; width: 20px; color: #606266;">) * </div>
                        <el-input v-model="inputRatio_2" @blur="calcuServiceFee(2)"
                                  :disabled="!(showInputRatio === 2)" style="width: 160px;">
                            <template slot="append">% 每笔</template>
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
                    </el-col>
                </el-row>
                <el-row class="mb15" v-show="contractForm.settleType == 'month'">
                    <el-col :span="6">
                        <el-radio label="step" v-model="contractForm.serviceFeeType" @change="calcuServiceFee(3)">每月阶梯收费</el-radio>
                    </el-col>
                    <el-col :span="18">
                        <el-table :data="step">
                            <el-table-column label="月收入区间" prop="name" width="200"></el-table-column>
                            <el-table-column label="阶梯收费" width="270px">
                                <template slot-scope="scope" v-if="contractForm.stepwiseList">
                                    实发金额 * <el-input type="number" step="0.01" max="99" min="1" :disabled="!(showInputRatio === 3)" v-model="contractForm.stepwiseList[scope.row.index].percent" style="width: 100px;"></el-input> % 每人 <i class="el-icon-question" title="按每人月收入分阶梯收费"></i>
                                </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
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
        </el-form>
        <el-form :model="invoiceForm" :rules="irule" label-width="200px" class="demo-contractForm" ref="invoice">
            <h4 class="ml50 mt50">发票信息</h4>
            <el-form-item label="开票类型" prop="openInvoiceType">
                <el-select v-model="invoiceForm.openInvoiceType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in invoiceType" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
                <!-- <el-input v-model="invoiceForm.openInvoiceType"></el-input> -->
            </el-form-item>
            <el-form-item label="公司名称" prop="name">
                <el-input v-model="invoiceForm.name"></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="taxIdcd">
                <el-input v-model="invoiceForm.taxIdcd"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="addr">
                <el-input v-model="invoiceForm.addr"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="phone">
                <el-input v-model="invoiceForm.phone"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="bankName">
                <el-input v-model="invoiceForm.bankName"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="bankAccount">
                <el-input v-model="invoiceForm.bankAccount"></el-input>
            </el-form-item>
            <h4 class="ml50 mt50">合同文件</h4>
            <el-upload
                    class="upload-demo ml50"
                    :action=uploadUrl
                    :on-success="handleSuccess"
                    :on-error="handleError"
                    :before-upload="handleBeforeUpload"
                    :http-request="hanldleHttpRequest"
                    multiple
                    accept=".pdf,.doc,.docx"
                    :show-file-list=false
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
                            <!--@click="handleDelete(scope.row.downloadCode)"-->
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-form-item>
                <el-button type="primary" @click="submitForm('contractForm')">保存</el-button>
                <el-button @click="routerPush('/main/contract/list')">取消</el-button>
            </el-form-item>
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
    import _ from 'lodash';
    import {mapGetters} from 'vuex';
    import {get, post, formPost} from "../../store/api";
    import {baseUrl} from '../../config/address';
    import {showNotify} from '../../plugin/utils-notify';
    import fileUploader from '../../component/fileUploader'

    import { checkPhone } from '../../plugin/utils-element-validator'

    export default {
        components: {
            fileUploader
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
            return {
                rules: {
                    customerName: [
                        {required: true, message: '请输入客户名称', trigger: 'blur'}
                    ],
                    serviceCompanyName: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    serviceCompanyId: [
                        {required: true, message: '请输入服务商名称', trigger: 'blur'}
                    ],
                    cotractType: [
                        {required: true, message: '请选择合同类型', trigger: 'blur'}
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
                    serviceFee: [
                        {type: 'number', required: true, message: '请输入正确的服务费收费', trigger: 'blur'}
                    ],
                    startDate: [
                        {required: true, message: '请选择合同起止时间', trigger: 'blur'}
                    ],
                    endDate: [
                        {required: true, message: '请选择合同起止时间', trigger: 'blur'}
                    ]
                },
                weekVisible: false,
                monthVisible: false,
                showInputRatio: 0,
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
                inputRatio_2: '',
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
                    type: 'customer',
                    serviceFeeType: 'fixed',
                    serviceFee: '',
                    settleExp: '',
                    serviceFeeRate: '',
                    shouldAmountRate: '',
                    stepwiseList: [
                        {
                            startAmount: 0,
                            endAmount: 28000,
                            sequence: 0,
                            percent: ''

                        },
                        {
                            startAmount: 28000,
                            endAmount: 999999999,
                            sequence: 1,
                            percent: ''

                        }
                    ]
                },
                invoiceForm: {
                    id: '',
                    openInvoiceType: '',
                    name: '',
                    taxIdcd: '',
                    addr: '',
                    phone: '',
                    bankName: '',
                    bankAccount: ''
                },
                irule: {
                    openInvoiceType: [
                        {required: true, message: '请输入开票类型', trigger: 'blur'}
                    ],
                    name: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    taxIdcd: [
                        {required: true, message: '请输入纳税人识别号', trigger: 'blur'}
                    ],
                    // addr: [
                    //     {required: true, message: '请输入地址', trigger: 'blur'}
                    // ],
                    phone: [
                        // { required: true, message: '请输入正确的电话', trigger: 'blur'},
                        { pattern: /^[\d-\(\)]+$/, message: '请输入正确的电话', trigger: 'blur'}
                    ],
                    // bankName: [
                    //     {required: true, message: '请输入开户银行', trigger: 'blur'}
                    // ],
                    // bankAccount: [
                    //     {required: true, message: '请输入银行账号', trigger: 'blur'}
                    // ]
                },
                deleteKey: '',
                step: [
                    {
                        name: '2.8万以下（包含2.8万）',
                        index: 0
                    },
                    {
                        name: '2.8万以上',
                        index: 1
                    }
                ],
                invoiceType: []
            }
        },
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
        },
        methods: {
            getInvoice() {
                var id = ''
                this.customerCompaniesList.forEach(e => {
                    if(e.companyName == this.contractForm.customerName) {
                        id = e.companyId
                    }
                })
                get('/api/invoice-web/custom-company/detail', {
                    id: id
                }).then(data => {
                    if(data) {
                        // this.invoiceForm = data
                        for (var k in this.invoiceForm) {
                            if(data[k]) {
                                this.invoiceForm[k] = data[k]
                            }
                        }
                    }
                    else {
                        for (var k in this.invoiceForm) {
                            this.invoiceForm[k] = ''
                        }
                        this.invoiceForm.id = id
                    }
                    this.$refs['invoice'].clearValidate()
                })
            },
            getType() {
                get('/api/sysmgr-web/commom/option?enumType=OpenInvoiceType').then(data => {
                    this.invoiceType = data
                })
            },
            invoiceUpdate(data) {
                post('/api/invoice-web/custom-company/save-update', this.invoiceForm).then(e => {
                    showNotify('success', data);
                    this.$router.push({path: '/main/contract/list'});
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
            submitForm(formName) {
                let url;
                if (this.$route.query.contractId) {
                    url = '/api/contract-web/contract/update-contract'
                } else {
                    url = '/api/contract-web/contract/add-contract';
                }
                let self = this;
                console.log('this:')
                console.log(self.contractForm.customerName)
                _.foreach(this.customerCompaniesList, function (value) {
                    console.log('arr:')
                    console.log(value['companyName'])
                    if (value['companyName'] == self.contractForm.customerName) {
                        self.contractForm.customerId = value['companyId'];
                        return false;
                    } else {
                        self.contractForm.customerId = '';
                    }
                });
                this.calcuCompanyId()
                this.contractForm.referIds = this.referArr;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.$refs['invoice'].validate((v) => {
                            if(v) {
                                var err = false
                                if(this.contractForm.serviceFeeType == 'ratio'){
                                    this.contractForm.serviceFee = 0
                                    this.contractForm.serviceFeeRate = this.inputRatio
                                    this.contractForm.shouldAmountRate = ''
                                }
                                if(this.contractForm.serviceFeeType == 'ratio_1'){
                                    this.contractForm.serviceFeeType = 'ratio'
                                    this.contractForm.serviceFee = 0
                                    this.contractForm.shouldAmountRate = this.inputRatio_1
                                    this.contractForm.serviceFeeRate = this.inputRatio_2
                                }
                                if(this.contractForm.serviceFeeType == 'step'){
                                    this.contractForm.stepwiseList.forEach(e => {
                                        if(e.percent < 1 || e.percent > 99) {
                                            err = true
                                        }
                                    })
                                }
                                if(err) {
                                    showNotify('error', '收费比例在0%到100%之间！')
                                    return
                                }
                                post(url, this.contractForm).then(data => {
                                    this.invoiceUpdate(data)
                                });
                            }
                            else {
                                showNotify('error', '请检查输入项错误！')
                            }
                        })
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
            showType(val) {
                if (val == 'day' || val == 'each') {
                    this.contractForm.settleExp = '每天';
                    this.weekVisible = false;
                    this.monthVisible = false;
                }
                if (val == 'week') {
                    if (!this.contractForm.settleExp || this.contractForm.settleExp.split(',')[1] != undefined) {
                        this.contractForm.settleExp = '';
                    }
                    this.weekVisible = true;
                    this.monthVisible = false;
                }
                if (val == 'month') {
                    if (this.contractForm.settleExp.split(',')[1] != undefined) {
                        this.radio = '范围日';
                        this.settleExpStart = this.contractForm.settleExp.split(',')[0];
                        this.settleExpEnd = this.contractForm.settleExp.split(',')[1];
                    } else {
                        this.radio = '固定日';
                        if (this.contractForm.settleExp.split('周').length == 2) {
                            this.settleExpDay = '';
                        } else {
                            this.settleExpDay = this.contractForm.settleExp.split(',')[0];
                        }
                    }
                    this.weekVisible = false;
                    this.monthVisible = true;
                }
                else if(this.contractForm.serviceFeeType == 'step') {
                    this.contractForm.serviceFeeType = ''
                    this.contractForm.serviceFee = ''
                }
            },
            calcuServiceFee(a) {
                if (this.contractForm.serviceFeeType == 'fixed') {
                    this.contractForm.serviceFee = parseInt(this.inputFixed);
                    // this.showInputFixed = false;
                    this.showInputRatio = a;
                }
                if (this.contractForm.serviceFeeType == 'ratio') {
                    this.contractForm.serviceFee = parseInt(this.inputRatio);
                    // this.showInputFixed = true;
                    this.showInputRatio = a;
                }
                if (this.contractForm.serviceFeeType == 'ratio_1') {
                    this.contractForm.serviceFee = parseInt(this.inputRatio_1);
                    // this.showInputFixed = true;
                    this.showInputRatio = a;
                }
                if (this.contractForm.serviceFeeType == 'step') {
                    this.contractForm.serviceFee = 0;
                    // this.showInputFixed = true;
                    this.showInputRatio = a;
                }
                this.$refs['contractForm'].validateField('serviceFee')
            },
            calcuServiceFeeReverse() {
                if (this.contractForm.serviceFeeType == 'fixed') {
                    this.inputFixed = this.contractForm.serviceFee;
                    this.showInputRatio = 0;
                }
                if (this.contractForm.serviceFeeType == 'ratio') {
                    if(this.contractForm.shouldAmountRate) {
                        this.contractForm.serviceFeeType = 'ratio_1'
                        this.inputRatio_1 = this.contractForm.shouldAmountRate;
                        this.inputRatio_2 = this.contractForm.serviceFeeRate;
                        this.showInputRatio = 2;
                    }
                    else{
                        this.inputRatio = this.contractForm.serviceFeeRate;
                        this.showInputRatio = 1;
                    }
                }
                if(this.contractForm.serviceFeeType == 'step') {
                    this.showInputRatio = 3;
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
                let url = '/api/console-dlv/option/get-option-customer-companies';
                let self = this;
                get(url).then(data => {
                    self.customerCompaniesList = data;
                    _.foreach(data, function (value) {
                        self.restaurants1.push({
                            "value": value['companyName']
                        });
                    });
                    this.getInvoice()
                })
            },
            getOptionServiceCompanies() {
                let url = '/api/console-dlv/option/get-option-service-companies';
                let self = this;
                get(url).then(data => {
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
                var AllImgExt = ".doc|.docx|.pdf";
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
                    this.getOptionCustomerCompanies()
                    if(!this.contractForm.stepwiseList) {
                        this.contractForm.stepwiseList = [
                        {
                            startAmount: 0,
                            endAmount: 30000,
                            sequence: 0,
                            percent: ''

                        },
                        {
                            startAmount: 30000,
                            endAmount: 999999999,
                            sequence: 1,
                            percent: ''

                        }
                    ]
                    }
                    this.calcuServiceFeeReverse();
                    this.handdleChangeReverse();
                    this.showType(this.contractForm.settleType);
                })
            },
            queryAttachments(id) {
                let url = '/api/contract-web/contract/contract-attachments';
                get(url, {contractId: id}).then(data => {
                    this.fileList = data;
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    .demo-contractForm {
        width: 900px;
    }

    .line {
        text-align: center;
    }
</style>

<style>
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
</style>