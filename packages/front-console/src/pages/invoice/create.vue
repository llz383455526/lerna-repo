<template>
    <div class="content">
        <el-form :inline="true" :model="formData" :rules="rulesData" ref="formData">

            <div class="title">客户信息（买方）</div>

            <div>
                <div class="input-container">
                    <div class="label">客户名称<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="customCompanyId">
                            <el-select v-model="formData.customCompanyId" filterable placeholder="请选择" style="width: 250px;"
                                       @change="getCompaniesDetail">
                                <el-option
                                        v-for="item in customCompaniesList"
                                        :key="item.value"
                                        :label="item.text"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container" >
                    <div class="label">纳税识别号<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="taxIdcd">
                            <el-input v-model="formBuy.taxIdcd" style="width: 250px;" readonly></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">地址<span v-if="$route.query.invoiceType == 'ZP'">*</span></div>
                    <div class="input">
                        <el-form-item prop="addr">
                            <el-input v-model="formBuy.addr" style="width: 250px;" readonly></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">电话号码<span v-if="$route.query.invoiceType == 'ZP'">*</span></div>
                    <div class="input">
                        <el-form-item prop="phone">
                            <el-input v-model="formBuy.phone" style="width: 250px;" readonly></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">开户银行<span v-if="$route.query.invoiceType == 'ZP'">*</span></div>
                    <div class="input">
                        <el-form-item prop="bankName">
                            <el-input v-model="formBuy.bankName" style="width: 250px;" readonly></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">银行账号<span v-if="$route.query.invoiceType == 'ZP'">*</span></div>
                    <div class="input">
                        <el-form-item prop="bankAccount">
                            <el-input v-model="formBuy.bankAccount" style="width: 250px;" readonly></el-input>
                        </el-form-item>
                    </div>
                </div>
            </div>

            <div v-if="historyListLength">
                <div class="title red">历史欠票 <span>累计欠票金额合计：{{historyInfo.totalAmount}}元</span></div>
                <el-table :data="formHistory.list" style="width: 100%;margin-top: 20px;" @selection-change="handleSelectionChange">
                    <el-table-column type="selection"></el-table-column>
                    <el-table-column prop="subjectName" label="发票类目名"></el-table-column>
                    <el-table-column prop="num" label="数量"></el-table-column>
                    <el-table-column prop="amount" label="单价（含税）"></el-table-column>
                    <el-table-column prop="taxRate" label="税率"></el-table-column>
                    <el-table-column prop="remark" label="发票用途"></el-table-column>
                    <el-table-column prop="createTime" label="申请日期">
                        <template slot-scope="scope">
                            <span>{{scope.row.createTime | formatTime('yyyy-MM-dd')}}</span>
                        </template>
                    </el-table-column>
                </el-table>
                <ayg-pagination v-if="formHistory.total" :total="formHistory.total"
                                v-on:handleSizeChange="handleSizeChange"
                                v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
            </div>

            <div class="title">发票类目</div>

            <el-form :inline="true" :model="formCategory" :rules="rulesCategory" ref="formCategory" v-if="tableShow">
                <div class="input-container">
                    <div class="label">开票类目名
                        <!--<span>*</span>-->
                    </div>
                    <div class="input">
                        <el-form-item prop="subjectId">
                            <el-select v-model="formCategory.subjectId" filterable placeholder="请选择"
                                       style="width: 250px;"
                                       @change="getSubjectDetail">
                                <el-option
                                        v-for="item in customSubjectList"
                                        :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">数量(默认为1)
                        <!--<span>*</span>-->
                    </div>
                    <div class="input">
                        <el-form-item>
                            <el-input style="width: 250px;" readonly value="1"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">单价(含税)
                        <!--<span>*</span>-->
                    </div>
                    <div class="input">
                        <el-form-item prop="amount">
                            <el-input v-model="formCategory.amount" style="width: 250px;" :disable="true"
                                      value="" :maxlength="12"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">税率
                        <!--<span>*</span>-->
                    </div>
                    <div class="input">
                        <el-form-item prop="taxRate">
                            <el-input v-model="formCategory.taxRate" style="width: 250px;" readonly></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">发票用途（对内说明）
                        <!--<span>*</span>-->
                    </div>
                    <div class="input">
                        <el-form-item prop="purpose">
                            <el-input v-model="formCategory.purpose" style="width: 250px;" :disable="true"
                                      value="1"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <!--<el-form-item>-->
                    <!--<el-button @click="hideFormCategory">删除</el-button>-->
                <!--</el-form-item>-->
            </el-form>

            <div>
                <el-button v-if="buttonShow" @click="getCustomSubject">+添加发票类目</el-button>
                <span v-if="subjectShow" class="subjectShow">请先添加发票类目</span>
            </div>


            <div class="title">开票公司信息</div>

            <div>
                <div class="input-container" style="width: 45%;">
                    <div class="label">客户名称<span>*</span></div>
                    <div class="input">
                        {{formService.name}}
                    </div>
                </div>
                <div class="input-container" style="width: 45%;">
                    <div class="label">纳税识别号<span>*</span></div>
                    <div class="input">
                        {{formService.taxIdcd}}
                    </div>
                </div>
                <div class="input-container" style="width: 45%;">
                    <div class="label">地址<span>*</span></div>
                    <div class="input">
                        {{formService.addr}}
                    </div>
                </div>
                <div class="input-container" style="width: 45%;">
                    <div class="label">电话号码<span>*</span></div>
                    <div class="input">
                        {{formService.phone}}
                    </div>
                </div>
                <div class="input-container" style="width: 45%;">
                    <div class="label">开户银行<span>*</span></div>
                    <div class="input">
                        {{formService.bankName}}
                    </div>
                </div>
                <div class="input-container" style="width: 45%;">
                    <div class="label">银行账号<span>*</span></div>
                    <div class="input">
                        {{formService.bankAccount}}
                    </div>
                </div>
                <br>
                <div class="input-container">
                    <div class="label">备注（发票显示备注）
                        <!--<span>*</span>-->
                    </div>
                    <div class="input">
                        <el-form-item prop="remark">
                            <el-input type="textarea" :rows="5" v-model="formData.remark" style="width: 500px;"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </div>

            <div class="line"></div>

            <div>
                <div class="input-container">
                    <div class="label">收款人<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="payee">
                            <el-input v-model="formService.payee" style="width: 250px;" readonly></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">复核<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="checker">
                            <el-input v-model="formService.checker" style="width: 250px;" readonly></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">开票人<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="drawer">
                            <el-input v-model="formService.drawer" style="width: 250px;" readonly></el-input>
                        </el-form-item>
                    </div>
                </div>
            </div>

            <div style="padding: 50px;">
                <el-button type="primary" @click="previewForm('formData')">生成预览</el-button>
                <el-button type="primary" @click="submitForm('formData')">提交申请</el-button>
                <el-button @click="routerPush('/main/invoice/list');resetForm();">取消</el-button>
            </div>

        </el-form>
    </div>

</template>

<script>
    import _ from 'lodash';
    import {post, get} from '../../store/api';
    import {showNotify} from '../../plugin/utils-notify';

    export default {
        name: "create",
        data() {
            var validateAmount = (rule, value, callback) => {
                // if (value === '') {
                //     callback(new Error('请输入单价（含税）'));
                // } else
                if ((value != '') && (!/^[0-9]+([.][0-9]+){0,1}$/.test(value))) {
                    callback(new Error('单价必须为数字值'));
                } else {
                    callback();
                }
            }
            return {
                tableShow: true,
                buttonShow: false,
                subjectShow: false,
                formData: {
                    serviceCompanyId: '',
                    customCompanyId: '',
                    items: [
                        {
                            amount: '',
                            invoiceType: '',
                            purpose: '',
                            subjectId: '',
                        }
                    ],
                    // payee: '',
                    // checker: '',
                    // drawer: '',
                },
                formBuy: {
                    taxIdcd: '',
                    addr: '',
                    phone: '',
                    bankName: '',
                    bankAccount: '',
                },
                formCategory: {
                    taxRate: '',
                    amount: '',
                    invoiceType: '',
                    purpose: '',
                    subjectId: ''
                },
                formService: {
                    name: '',
                    taxIdcd: '',
                    addr: '',
                    phone: '',
                    bankName: '',
                    bankAccount: ''
                },
                formHistory: '',
                historyInfo: '',
                historyIds: [],
                historyListLength: 0,
                currentPage: 1,
                pageSize: 10,
                rulesData: {
                    customCompanyId: [
                        {
                            required: true,
                            message: "请选择客户名称",
                            trigger: "blur"
                        }
                    ],
                    taxIdcd: [
                        {
                            required: true,
                            message: "请输入纳税识别号",
                            trigger: "blur"
                        }
                    ]
                    // remark: [
                    //     {
                    //         required: true,
                    //         message: "请输入开票公司发票备注",
                    //         trigger: "blur"
                    //     }
                    // ],
                    // payee: [
                    //     {
                    //         required: true,
                    //         message: "请输入收款人",
                    //         trigger: "blur"
                    //     }
                    // ],
                    // checker: [
                    //     {
                    //         required: true,
                    //         message: "请输入复核人",
                    //         trigger: "blur"
                    //     }
                    // ],
                    // drawer: [
                    //     {
                    //         required: true,
                    //         message: "请输入开票人",
                    //         trigger: "blur"
                    //     }
                    // ],
                },
                rulesCategory: {
                    subjectId: [
                        {
                            required: true,
                            message: "请选择开票类目名",
                            trigger: "change"
                        }
                    ],
                    taxRate: [
                        {
                            required: true,
                            message: "请输入税率",
                            trigger: "blur"
                        }
                    ],
                    amount: [
                        {
                            required: true,
                            // message: "请输入单价（含税）",
                            validator: validateAmount
                        },
                        // {
                        //     type: 'number',
                        //     message: "单价必须为数字值",
                        // }
                    ],
                    purpose: [
                        {
                            required: true,
                            message: "请输入发票用途",
                            trigger: "blur"
                        }
                    ],
                },
                customCompaniesList: [],
                customSubjectList: [],
            }
        },
        methods: {
            routerPush(val) {
                this.$router.push({
                    path: val,
                    query: {
                        page: this.$route.query.page
                    }
                });
            },
            getCustomCompanies() {
                let url = '/api/invoice-web/invoice/custom-company-options';
                let self = this;
                get(url).then(data => {
                    self.customCompaniesList = data;
                })
            },
            getCustomSubject() {
                // this.tableShow = true;
                // this.buttonShow = false;
                //
                // this.formCategory.subjectId = '';
                // this.formCategory.amount = '';
                // this.formCategory.taxRate = '';
                // this.formCategory.purpose = '';

                let url = '/api/invoice-web/custom-invoice-subject/qry';
                let param = {
                    name: '',
                    orderBy: '',
                    page: 0,
                    pageSize: 0
                };
                let self = this;
                post(url, param).then(res => {
                    self.customSubjectList = res.list;
                })
            },
            getCompaniesDetail(val) {
                let url = '/api/invoice-web/custom-company/detail';
                let param = {
                    id: val
                };
                let self = this;
                let pageInfo = {
                    page: 1,
                    pageSize: 10
                };
                get(url, param).then(res => {
                    self.formBuy = res;
                    console.log(self.formBuy)
                    self.getHistoryDebt(val, pageInfo);
                    self.getHistoryInfo(val);
                })
            },
            getHistoryDebt (customCompanyId, pageInfo) {
                let url = '/api/invoice-web/invoice/history-debt-invoice-items';
                let param = {
                    customCompanyId: customCompanyId,
                    serviceCompanyId: this.formData.serviceCompanyId,
                    invoiceType: this.$route.query.invoiceType,
                    statusList: ['0'],
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                let self = this;
                post(url, param).then(res => {
                    self.formHistory = res;
                    self.historyListLength = res.list.length;
                })
            },
            getHistoryInfo (customCompanyId) {
                let url = '/api/invoice-web/invoice/history-debt-invoice-info';
                let param = {
                    customCompanyId: customCompanyId,
                    serviceCompanyId: this.formData.serviceCompanyId,
                    status: 0
                };
                let self = this;
                post(url, param).then(res => {
                    self.historyInfo = res;
                })
            },
            getSubjectDetail(val) {
                let self = this;
                _.forEach(self.customSubjectList, function (item) {
                    if (item.id === val) {
                        self.formCategory.taxRate = item.taxRate;
                        self.$refs['formCategory'].validateField('taxRate');
                    }
                });
            },
            getServiceDetail(id) {
                let url = '/api/invoice-web/service-company/detail';
                let param = {
                    id: id
                };
                let self = this;
                get(url, param).then(res => {
                    self.formService = res;
                })
            },
            submitForm() {
                let validData = false;
                let validCategory = false;
                let url = '/api/invoice-web/invoice/invoice-add';
                let param = this.formData;
                param.items[0].amount = this.formCategory.amount;
                param.items[0].invoiceType = this.$route.query.invoiceType;
                param.items[0].purpose = this.formCategory.purpose;
                param.items[0].subjectId = this.formCategory.subjectId;

                param.historyIds = this.historyIds;
                Object.assign(this.formData, this.formBuy)
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        validData = true;
                    }
                });
                delete this.formData.taxIdcd
                delete this.formData.addr
                delete this.formData.phone
                delete this.formData.bankName
                delete this.formData.bankAccount
                // if (this.tableShow) {
                //     this.subjectShow = false;
                //     this.$refs['formCategory'].validate((valid) => {
                //         if (valid) {
                //             validCategory = true;
                //         }
                //     });
                // } else {
                //     this.subjectShow = true;
                // }

                // if (validData && validCategory) {
                if (validData) {
                    post(url, param).then(data => {
                        showNotify('success', data);
                        this.$router.push({path: '/main/invoice/list'});
                    });
                }
            },
            previewForm() {
                let validData = false;
                let validCategory = false;
                let url = '/api/invoice-web/invoice/create-preview';
                let param = this.formData;
                param.items[0].amount = this.formCategory.amount;
                param.items[0].invoiceType = this.$route.query.invoiceType;
                param.items[0].purpose = this.formCategory.purpose;
                param.items[0].subjectId = this.formCategory.subjectId;

                param.historyIds = this.historyIds;
                Object.assign(this.formData, this.formBuy)
                this.$refs['formData'].validate((valid) => {
                    if (valid) {
                        validData = true;
                    }
                });
                delete this.formData.taxIdcd
                delete this.formData.addr
                delete this.formData.phone
                delete this.formData.bankName
                delete this.formData.bankAccount
                // if (this.tableShow) {
                //     this.subjectShow = false;
                //     this.$refs['formCategory'].validate((valid) => {
                //         if (valid) {
                //             validCategory = true;
                //         }
                //     });
                // } else {
                //     this.subjectShow = true;
                // }

                // if (validData && validCategory) {
                if (validData) {
                    post(url, param).then(data => {
                		window.open(data);
                    });
                }
            },
            resetForm() {
                this.$refs['formData'].resetFields();

                this.formBuy.taxIdcd = '';
                this.formBuy.addr = '';
                this.formBuy.phone = '';
                this.formBuy.bankName = '';
                this.formBuy.bankAccount = '';

                this.hideFormCategory();
            },
            hideFormCategory() {
                this.tableShow = false;
                this.buttonShow = true;
            },
            handleSelectionChange (val) {
                let self = this;
                self.historyIds = [];
                _.forEach(val, function (item) {
                    self.historyIds.push(item.id);
                });
            },
            handleSizeChange(value) {
                this.pageSize = value;
                if (this.currentPage == 1) {
                    this.getHistoryDebt(this.formData.customCompanyId, {
                        page: 1,
                        pageSize: value,
                    });
                } else {
                    this.currentPage = 1;
                }
            },
            handleCurrentChange(value) {
                this.currentPage = value;
                if (this.currentChangeBySetting) {
                    this.currentChangeBySetting = false;
                    return;
                }
                this.getHistoryDebt(this.formData.customCompanyId, {
                    page: value,
                    pageSize: this.pageSize,
                });
            },
        },
        created() {
            this.getCustomCompanies();
            this.formData.serviceCompanyId = this.$route.query.serviceCompanyId;
            if(this.$route.query.invoiceType == 'ZP') {
                Object.assign(this.rulesData, {
                    addr: [
                        {
                            required: true,
                            message: "请输入地址",
                            trigger: "blur"
                        }
                    ],
                    phone: [
                        {
                            required: true,
                            message: "请输入电话号码",
                            trigger: "blur"
                        }
                    ],
                    bankName: [
                        {
                            required: true,
                            message: "请输入开户行名称",
                            trigger: "blur"
                        }
                    ],
                    bankAccount: [
                        {
                            required: true,
                            message: "请输入银行账号",
                            trigger: "blur"
                        }
                    ]
                })
            }
            this.getServiceDetail(this.formData.serviceCompanyId);

            // 获取发票类目下拉列表
            this.getCustomSubject();
        }
    }
</script>

<style scoped>
    .content {
        background-color: #fff;
        padding: 20px 55px;
    }
    .title {
        margin-top: 30px;
        margin-bottom: 30px;
    }
    .input-container, .label, .input {
        display: inline-block;
        margin-right: 20px;
        width: auto;
    }
    .line {
        margin: 50px 0;
        background-color: #6e6e6e;
        height: 1px;
    }
    .subjectShow {
        color: red;
    }
</style>