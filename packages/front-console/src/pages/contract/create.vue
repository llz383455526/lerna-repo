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
                <el-autocomplete
                        class="inline-input"
                        v-model="contractForm.customerName"
                        :fetch-suggestions="querySearch1"
                        placeholder="请输入内容"
                        style="width:100%;">
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="服务商名称" prop="serviceCompanyId" placeholder="请输入内容">
                <el-autocomplete
                        class="inline-input"
                        v-model="contractForm.serviceCompanyName"
                        :fetch-suggestions="querySearch2"
                        placeholder="请输入内容"
                        style="width:100%;"
                        @blur="calcuCompanyId"
                        @select="handleSelect">
                </el-autocomplete>
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
                    <el-option label="日结" value="day"></el-option>
                    <el-option label="周结" value="week"></el-option>
                    <el-option label="月结" value="month"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算日期" v-if="weekVisible" required prop="settleExp">
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
                        <el-radio-group v-model="radio">
                            <el-radio label="固定日"></el-radio>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="settleExpDay" placeholder="请选择" style="width: 100%;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="4">
                        <el-radio-group v-model="radio">
                            <el-radio label="范围日"></el-radio>
                        </el-radio-group>
                    </el-col>
                    <el-col :span="8">
                        <el-select v-model="settleExpStart" placeholder="请选择" style="width: 100%;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                        </el-select>
                    </el-col>
                    <el-col class="line" :span="2">-</el-col>
                    <el-col :span="8">
                        <el-select v-model="settleExpEnd" placeholder="请选择" style="width: 100%;">
                            <el-option v-for="item in options" :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
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
                        <el-radio label="ratio" v-model="contractForm.serviceFeeType" @change="calcuServiceFee">固定比例收费</el-radio>
                    </el-col>
                    <el-col :span="12">
                        <el-input placeholder="请输入内容" v-model="inputRatio" @blur="calcuServiceFee" :disabled="showInputRatio">
                            <template slot="append">% 每笔</template>
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <i class="el-icon-question" title="表示按照固定比例来收取服务费。
计算公式：应发金额 * 收费比例 = 服务费"></i>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-radio label="fixed" v-model="contractForm.serviceFeeType" @change="calcuServiceFee">固定金额收费</el-radio>
                    </el-col>
                    <el-col :span="12">
                        <el-input placeholder="请输入内容" v-model="inputFixed" @blur="calcuServiceFee" :disabled="showInputFixed">
                            <template slot="append">元 每笔</template>
                        </el-input>
                    </el-col>
                    <el-col :span="1" style="text-align: right;">
                        <i class="el-icon-question" title="表示按照固定金额来收取服务费。
计算公式：固定收费金额 = 服务费"></i>
                    </el-col>
                </el-row>
            </el-form-item>
            <el-form-item label="合同起止时间" prop="startDate">
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @change="handleChange">
                </el-date-picker>
            </el-form-item>
            <h4 class="ml50 mt50">发票信息</h4>
            <el-form-item label="公司名称" prop="invoiceCompanyName" required>
                <el-input v-model="contractForm.invoiceCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="纳税人识别号" prop="invoiceTin" required>
                <el-input v-model="contractForm.invoiceTin"></el-input>
            </el-form-item>
            <el-form-item label="地址" prop="invoiceAddress" required>
                <el-input v-model="contractForm.invoiceAddress"></el-input>
            </el-form-item>
            <el-form-item label="电话" prop="invoicePhone" required>
                <el-input v-model="contractForm.invoicePhone"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="invoiceBank" required>
                <el-input v-model="contractForm.invoiceBank"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="invoiceAccount" required>
                <el-input v-model="contractForm.invoiceAccount"></el-input>
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
                            <el-button @click="handleDownload(scope.row.downloadCode)" type="text" size="medium" style="padding:0;">下载</el-button>
                            <el-button @click="handleDelete(scope.row.downloadCode)" type="text" size="medium" style="padding:0;">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-form-item>
                <el-button type="primary" @click="submitForm('contractForm')">保存</el-button>
                <el-button @click="routerPush('/main/contract/list')">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<style lang="scss" scoped>
    .demo-contractForm {
        width: 800px;
    }

    .line {
        text-align: center;
    }
</style>

<script>
    import _ from 'lodash';
    import {mapGetters} from 'vuex';
    import {get, post, formPost} from "../../store/api";
    import {baseUrl} from '../../config/address';
    import {showNotify} from '../../plugin/utils-notify';
    import fileUploader from '../../component/fileUploader'

    export default {
        components: {
            fileUploader
        },
        data() {
            var validatorSettleExp = (rule, value, callback) => {
              if (this.contractForm.settleType == 'month') {
                  if(this.radio == '固定日') {
                      if(this.settleExpDay) {
                          this.contractForm.settleExp = this.settleExpDay;
                          callback();
                      } else {
                          callback(new Error('请选择结算日期'));
                      }
                  }
                  if(this.radio == '范围日') {
                      if (!this.settleExpStart || !this.settleExpEnd) {
                          callback(new Error('请选择结算日期'));
                      } else if (parseInt(this.settleExpStart.replace('每月','').replace('日',''))
                          > parseInt(this.settleExpEnd.replace('每月','').replace('日',''))) {
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
                        {required: true, message: '请输入客户名称', trigger: 'change'}
                    ],
                    serviceCompanyId: [
                        {required: true, message: '请输入服务商名称', trigger: 'blur'}
                    ],
                    cotractType: [
                        {required: true, message: '请选择合同类型', trigger: 'change'}
                    ],
                    settleType: [
                        {required: true, message: '请选择结算方式', trigger: 'change'}
                    ],
                    settleExp: [
                        {validator: validatorSettleExp, trigger: 'change'}
                    ],
                    invoiceType: [
                        {required: true, message: '请选择发票类型', trigger: 'change'}
                    ],
                    serviceFee: [
                        {required: true, message: '请输入服务费收费', trigger: 'blur'}
                    ],
                    startDate: [
                        {required: true, message: '请选择合同起止时间', trigger: 'blur'}
                    ],
                    endDate: [
                        {required: true, message: '请选择合同起止时间', trigger: 'blur'}
                    ],
                    invoiceCompanyName: [
                        {required: true, message: '请输入公司名称', trigger: 'blur'}
                    ],
                    invoiceTin: [
                        {required: true, message: '请输入纳税人识别号', trigger: 'blur'}
                    ],
                    invoiceAddress: [
                        {required: true, message: '请输入地址', trigger: 'blur'}
                    ],
                    invoicePhone: [
                        {required: true, message: '请输入电话', trigger: 'blur'}
                    ],
                    invoiceBank: [
                        {required: true, message: '请输入开户银行', trigger: 'blur'}
                    ],
                    invoiceAccount: [
                        {required: true, message: '请输入银行账号', trigger: 'blur'}
                    ]
                },
                weekVisible: false,
                monthVisible: false,
                showInputRatio: false,
                showInputFixed: false,
                formData: '',
                dateValue: '',
                uploadUrl: '',
                settleExpDay: '',
                settleExpStart: '',
                settleExpEnd: '',
                inputRatio: '',
                inputFixed: '',
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
                    serviceFeeType: 'ratio',
                    serviceFee: '',
                    settleExp: ''
                }
            }
        },
        methods: {
            routerPush(val) {
                this.$router.push({path: val});
            },
            submitForm(formName) {
                let url;
                if (this.$route.query.contractId) {
                    url = '/api/console-dlv/contract/update-contract'
                } else {
                    url = '/api/console-dlv/contract/add-contract';
                }
                let self = this;
                _.foreach(this.customerCompaniesList, function (value) {
                    if (value['companyName'] == self.contractForm.customerName) {
                        self.contractForm.customerId = value['companyId'];
                        return false;
                    } else {
                        self.contractForm.customerId = '';
                    }
                });
                this.contractForm.referIds = this.referArr;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        post(url, this.contractForm).then(data => {
                            showNotify('success', data);
                            this.$router.push({path: '/main/contract/list'});
                        });
                    }
                });
            },
            showType(val) {
                if (val == 'day') {
                    this.contractForm.settleExp = '每天';
                    this.weekVisible = false;
                    this.monthVisible = false;
                }
                if (val == 'week') {
                    this.contractForm.settleExp = '';
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
                        this.settleExpDay = this.contractForm.settleExp.split(',')[0];
                    }
                    this.weekVisible = false;
                    this.monthVisible = true;
                }
            },
            calcuServiceFee() {
                if (this.contractForm.serviceFeeType == 'ratio') {
                    this.contractForm.serviceFee = this.inputRatio;
                    this.showInputFixed = true;
                    this.showInputRatio = false;
                }
                if (this.contractForm.serviceFeeType == 'fixed') {
                    this.contractForm.serviceFee = this.inputFixed;
                    this.showInputFixed = false;
                    this.showInputRatio = true;
                }
                this.$refs['contractForm'].validateField('serviceFee')
            },
            calcuServiceFeeReverse() {
                if (this.contractForm.serviceFeeType == 'ratio') {
                    this.inputRatio = this.contractForm.serviceFee;
                    this.showInputFixed = true;
                }
                if (this.contractForm.serviceFeeType == 'fixed') {
                    this.inputFixed = this.contractForm.serviceFee;
                    this.showInputRatio = true;
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
            getOptionCustomerCompanies() {
                let url = '/api/console-dlv/option/get-option-customer-companies';
                let self = this;
                get(url).then(data => {
                    self.customerCompaniesList = data;
                    _.foreach(data, function(value) {
                        self.restaurants1.push({
                            "value": value['companyName']
                        });
                    });
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
                window.location.href = baseUrl + '/api/console-dlv/file/download'
                    + '?downloadCode=' + downloadCode;
            },
            handleDelete(downloadCode) {
                post('/api/console-dlv/file/delete', {downloadCode: downloadCode}).then(data => {
                    showNotify('success', data);
                    this.queryAttachments(this.$route.query.contractId);
                });
            },
            handleBeforeUpload(file) {
                let formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('file', file);
                this.formData = formData;
            },
            hanldleHttpRequest() {
                let url = '/api/console-dlv/file/upload';
                formPost(url, this.formData).then(data => {
                    this.fileList.push(data);
                    this.referArr.push(data.referId);
                    showNotify('success', '上传成功!');
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
                let url = '/api/console-dlv/contract/contract-detail';
                get(url, {contractId: id}).then(data => {
                    this.contractForm = data;
                    this.calcuServiceFeeReverse();
                    this.handdleChangeReverse();
                    this.showType(this.contractForm.settleType);
                })
            },
            queryAttachments(id) {
                let url = '/api/console-dlv/contract/contract-attachments';
                get(url, {contractId: id}).then(data => {
                    this.fileList = data;
                });
            }
        },
        created() {
            this.uploadUrl = baseUrl+"/api/console-dlv/file/upload";
            this.getOptionCustomerCompanies();
            this.getOptionServiceCompanies();
            if (this.$route.query.contractId) {
                this.queryDetail(this.$route.query.contractId);
                this.queryAttachments(this.$route.query.contractId);
            }
        }
    }
</script>

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
        border-color: #e4e7ed!important;
    }
</style>