<template>
    <div class="content">
        <el-form :inline="true">
            <el-form-item label="服务公司" size="small">
                <el-select v-model="serviceCompanyId" placeholder="请选择开票公司" @change="getCompanyInfo">
                    <el-option v-for="item in companyList" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <div v-if="companyInfo" style="display: inline-block;vertical-align: middle;">
                <span>
                    本月专票数：{{companyInfo.currentMonthCount}}张 ，
                    总金额：{{companyInfo.currentMonthAmount}}
                </span>
                <span>
                    剩余票数：<span class="red">{{companyInfo.leftCount}}</span>张
                    可开票金额：<span class="red">{{companyInfo.leftAmount}}</span>
                </span>
            </div>
        </el-form>

        <div class="title">申请开票列表</div>
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="客户名称" size="small">
                <el-input v-model="formSearch.customCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="申请编号" size="small">
                <el-input v-model="formSearch.orderNo"></el-input>
            </el-form-item>
            <el-form-item label="开票金额" size="small">
                <el-col :span="11">
                    <el-input v-model="formSearch.amountStart"></el-input>
                </el-col>
                <el-col class="line" :span="2">-</el-col>
                <el-col :span="11">
                    <el-input v-model="formSearch.amountEnd"></el-input>
                </el-col>
            </el-form-item>
            <br>
            <el-form-item label="申请状态" size="small">
                <el-select v-model="formSearch.status" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in InvoiceState" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发票类型" size="small">
                <el-select v-model="formSearch.invoiceType" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in InvoiceType" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请日期" size="small">
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item size="small">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>

        <div class="title">发票申请列表
            <el-button size="small" @click="dialogClientVisible = true;">申请开票</el-button>
        </div>

        <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;">
         	<el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <el-button @click="showDetail(scope.row.id)" type="text" size="medium" style="padding:0;">查看详情
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="申请编号" width="100"></el-table-column>
            <el-table-column prop="customCompanyName" label="客户名称" width="220"></el-table-column>
            <el-table-column prop="amount" label="申请金额" width="120"></el-table-column>
            <el-table-column prop="num" label="待审票数" width="120"></el-table-column>
            <el-table-column prop="realAmount" label="实开金额" width="120"></el-table-column>
            <el-table-column prop="realNum" label="实际开票" width="120"></el-table-column>
            <el-table-column prop="rejectAmount" label="拒开金额" width="120"></el-table-column>
            <el-table-column prop="rejectNum" label="拒开票数" width="120"></el-table-column>
            <el-table-column prop="invoiceTypeName" label="发票类型" width="120"></el-table-column>
            <el-table-column prop="serviceCompanyName" label="开票公司" width="220"></el-table-column>
            <el-table-column prop="subjectName" label="开票类目" width="120"></el-table-column>
            <el-table-column prop="purpose" label="发票用途（对内查看使用）" width="220"></el-table-column>
            <el-table-column prop="remark" label="申请备注（会打印在发票内）" width="220"></el-table-column>
            <el-table-column prop="createByName" label="申请人" width="120"></el-table-column>
            <el-table-column prop="createTime" label="申请时间" width="220">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="checkByName" label="审批人" width="120"></el-table-column>
            <el-table-column prop="checkTime" label="审批时间" width="220">
                <template slot-scope="scope">
                    <span>{{scope.row.checkTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="statusName" label="申请状态" width="120"></el-table-column>
        </el-table>
        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>

        <el-dialog title="选择发票类型和开票公司" :visible.sync="dialogClientVisible" width="35%">
            <el-form :rules="rulesClient" :model="formClient" ref="formClient">
                <div class="input-container">
                    <div class="label dialog-label">发票类型<span>*</span>
                    </div>
                    <div class="input">
                        <el-form-item prop="invoiceType">
                            <el-radio-group v-model="formClient.invoiceType">
                                <el-radio v-for="item in InvoiceType" :key="item.value" :label="item.value">
                                    {{item.text}}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label dialog-label">开票公司<span>*</span>
                    </div>
                    <div class="input">
                        <el-form-item prop="serviceCompanyId">
                            <el-select v-model="formClient.serviceCompanyId" placeholder="请选择开票公司">
                                <el-option v-for="item in companyList" :key="item.value" :label="item.text"
                                           :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogClientVisible=false;">取 消</el-button>
                <el-button type="primary" @click="showClientForm('formClient')">确 定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="发票申请单" :visible.sync="dialogDetailVisible" width="50%">
            <div class="detailContext">
                <span>申请编号:</span>
                <span>{{formDetail.orderNo}}</span>
            </div>
            <div class="detailContext">
                <span>申请时间:</span>
                <span>{{formDetail.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
            </div>
            <div class="detailContext">
                <span>开票名称:</span>
                <span>{{formDetail.customCompanyName}}</span>
            </div>
            <div class="detailContext">
                <span>纳税人识别号:</span>
                <span>{{formDetail.customTaxIdcd}}</span>
            </div>
            <div class="detailContext">
                <span>开户行:</span>
                <span>{{formDetail.customBankName}}</span>
            </div>
            <div class="detailContext">
                <span>银行账号:</span>
                <span>{{formDetail.customBankAccount}}</span>
            </div>
            <div class="detailContext">
                <span>地址:</span>
                <span>{{formDetail.customAddr}}</span>
            </div>
            <div class="detailContext">
                <span>电话:</span>
                <span>{{formDetail.customPhone}}</span>
            </div>
            <div class="detailContext">
                <span>开票类型:</span>
                <span>{{formDetail.invoiceTypeName}}</span>
            </div>
            <div class="detailContext">
                <span>备注:</span>
                <span>{{formDetail.remark}}</span>
            </div>
            <div class="detailContext">
                <span>申请发票数:</span>
                <span><span class="red">{{formDetail.applyInvoiceNum}}</span>张</span>
            </div>
            <div class="detailContext">
                <span>开票金额合计:</span>
                <span>{{formDetail.applyInvoiceAmount}}</span>
            </div>
            <div class="detailContext">
                <span>剩余票数:</span>
                <span><span class="red">{{formDetail.leftInvoiceNum}}</span>张</span>
            </div>
            <div class="detailContext">
                <span>可开票金额:</span>
                <span class="red">{{formDetail.leftInvoiceAmount}}</span>
            </div>

            <el-table :data="formDetail.items" style="width: 100%;margin-top: 20px;"
                      @selection-change="handleSelectionChange">
                <el-table-column type="selection" v-if="formDetail.status == '1'"></el-table-column>
                <el-table-column type="index" :index="indexMethod" width="70"></el-table-column>
                <!--<el-table-column prop="name" label="名字"></el-table-column>-->
                <el-table-column prop="subjectName" label="开票类目"></el-table-column>
                <el-table-column prop="amount" label="开票金额（含税）" width="150"></el-table-column>
                <el-table-column prop="serviceCompanyName" label="开票公司" width="220"></el-table-column>
                <el-table-column prop="statusName" label="状态"></el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer" v-if="formDetail.status == '1'">
            	<el-button @click="previewForm">生成预览</el-button>
                <el-button @click="dialogDetailVisible = false;dialogRejectVisible = true;">整单拒开</el-button>
                <el-button @click="showOpenDialog">提交开票</el-button>
            </div>
        </el-dialog>

        <el-dialog title="拒开确认" :visible.sync="dialogRejectVisible" width="35%" :before-close="handleCloseReject">
            <el-form>
                <div class="input-container">
                    <div class="label dialog-label">拒开原因</div>
                    <div class="input">
                        <el-form-item>
                            <el-input type="textarea" :rows="5" v-model="formInvoice.memo"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="formInvoice.allReject=true;dialogRejectVisible=false;submitInvoice()">确认拒开
                </el-button>
            </div>
        </el-dialog>

        <el-dialog title="开票确认" :visible.sync="dialogOpenVisible" width="35%" :before-close="handleCloseOpen">
            <p>申请发票数：<span class="red">{{formOpen.lengthAll}}</span>张，确认开票数 <span
                    class="red">{{formOpen.lengthChoose}}</span>张，</p>
            <p>欠票 <span class="red">{{formOpen.lengthAll - formOpen.lengthChoose}}</span>张，欠票总金额为 <span class="red">{{formOpen.amount}}</span>
            </p>
            <h3>提交开票后，未勾选的部分将做欠票处理</h3>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogOpenVisible=false;submitInvoice();">确认提交</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import _ from 'lodash';
    import {post, get} from '../../store/api';

    export default {
        name: "list",
        data() {
            return {
                serviceCompanyId: '',

                companyList: [],
                companyInfo: '',

                InvoiceState: [],
                InvoiceType: [],
                dateValue: '',
                formSearch: {
                    customCompanyName: '',
                    orderNo: '',
                    amountStart: '',
                    amountEnd: '',
                    status: '',
                    invoiceType: '',
                    startAt: '',
                    endAt: '',
                },

                pageSize: 10,
                currentPage: parseInt(this.$route.query.page) || 1,
                tableList: [],

                dialogDetailVisible: false,
                formDetail: {},

                dialogClientVisible: false,
                formClient: {
                    type: "",
                    serviceCompanyId: "",
                },
                rulesClient: {
                    invoiceType: [
                        {
                            required: true,
                            message: "请选择发票类型",
                            trigger: "change"
                        }
                    ],
                    serviceCompanyId: [
                        {
                            required: true,
                            message: "请选择开票公司",
                            trigger: "change"
                        }
                    ]
                },

                dialogRejectVisible: false,
                formInvoice: {
                    allReject: false,
                    approvedIds: [],
                    memo: '',
                    orderNo: '',
                },

                ChooseList: [],
                dialogOpenVisible: false,
                formOpen: {
                    lengthAll: 0,
                    lengthChoose: 0,
                    amount: 0,
                }
            }
        },
        methods: {
            indexMethod(index) {
                return '发票' + parseInt(index + 1);
            },
            getInvoiceType() {
                let url = '/api/invoice-web/commom/option';
                let param = {
                    enumType: 'InvoiceType'
                };
                get(url, param).then(res => {
                    this.InvoiceType = res;
                })
            },
            getInvoiceState() {
                let url = '/api/invoice-web/commom/option';
                let param = {
                    enumType: 'InvoiceState'
                };
                get(url, param).then(res => {
                    this.InvoiceState = res;
                })
            },
            getCompanyList() {
                let url = '/api/invoice-web/invoice/service-company-options';
                get(url).then(res => {
                    this.companyList = res;
                })
            },
            getCompanyInfo(id) {
                let url = '/api/invoice-web/invoice/service-company-zp-info';
                let param = {
                    serviceCompanyId: id
                };
                get(url, param).then(res => {
                    this.companyInfo = res;
                })
            },
            search() {
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.formSearch.customCompanyName = '';
                this.formSearch.orderNo = '';
                this.formSearch.amountStart = '';
                this.formSearch.amountEnd = '';
                this.formSearch.status = '';
                this.formSearch.invoiceType = '';
                this.dateValue = '';
            },
            requestAction(pageInfo) {
                let startAt = '';
                let endAt = '';
                if (this.dateValue) {
                    startAt = this.dateValue[0];
                    endAt = this.dateValue[1];
                }
                let param = {
                    customCompanyName: this.formSearch.customCompanyName,
                    orderNo: this.formSearch.orderNo,
                    amountStart: this.formSearch.amountStart,
                    amountEnd: this.formSearch.amountEnd,
                    status: this.formSearch.status,
                    invoiceType: this.formSearch.invoiceType,
                    startAt: startAt,
                    endAt: endAt,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                post('/api/invoice-web/invoice/invoice-approve-list', param).then(data => {
                    this.tableList = data
                })
            },
            handleSizeChange(value) {
                this.pageSize = value;
                this.currentPage = 1;
                this.requestAction({page: this.currentPage, pageSize: value,});
            },
            handleCurrentChange(value) {
                this.currentPage = value;
                if (this.currentChangeBySetting) {
                    this.currentChangeBySetting = false;
                    return;
                }
                this.requestAction({
                    page: value,
                    pageSize: this.pageSize,
                });
            },
            handleCloseReject() {
                this.dialogRejectVisible = false;
                this.dialogDetailVisible = true;
            },
            handleCloseOpen() {
                this.dialogOpenVisible = false;
                this.dialogDetailVisible = true;
            },
            handleSelectionChange(val) {
                this.ChooseList = val
            },
            showClientForm(formName) {
                let self = this;
                this.$refs[formName].validate(valid => {
                    if (valid) {
                        this.dialogClientVisible = false;
                        this.$router.push({
                            path: "/main/invoice/create",
                            query: {
                                serviceCompanyId: self.formClient.serviceCompanyId,
                                invoiceType: self.formClient.invoiceType
                            }
                        });
                    }
                })
            },
            showDetail(orderNo) {
                this.dialogDetailVisible = true;
                this.formInvoice.orderNo = orderNo;

                let url = '/api/invoice-web/invoice/get-invoice-approve-info';
                let param = {
                    orderNo: orderNo
                }
                let self = this;
                get(url, param).then(data => {
                    self.formDetail = data;
                })
            },
            showOpenDialog() {
                this.dialogDetailVisible = false;
                this.dialogOpenVisible = true;

                this.formOpen.lengthAll = this.formDetail.items.length;
                this.formOpen.lengthChoose = this.ChooseList.length;

                let allAmount = 0;
                _.foreach(this.formDetail.items, function (item) {
                    allAmount += item.amount;
                });

                let self = this;
                let allAmountMinus = 0;
                self.formInvoice.approvedIds = [];
                _.foreach(this.ChooseList, function (item) {
                    allAmountMinus += item.amount;
                    self.formInvoice.approvedIds.push(item.id);
                });
                this.formOpen.amount = parseFloat((allAmount - allAmountMinus).toPrecision(12));
            },
            previewForm() {
            	let url = '/api/invoice-web/invoice/approve-preview';
                let param = this.formInvoice;
             	post(url, param).then(data => {
                	let newWindow = window.open();
                    newWindow.location.href = data;
                });
            },
            submitInvoice() {
                let url = '/api/invoice-web/invoice/invoice-approve-submit';
                let param = this.formInvoice;
                let self = this;
                post(url, param).then(res => {
                    self.requestAction({
                        page: 1,
                        pageSize: self.pageSize,
                    });
                })
            },
        },
        created() {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.getInvoiceType();
            this.getInvoiceState();
            this.getCompanyList();
        }
    }
</script>

<style scoped>
    .content {
        background-color: #fff;
        padding: 15px;
    }

    .title {
        margin: 30px 0;
    }

    .line {
        text-align: center;
    }

    .detailContext {
        width: 45%;
        display: inline-block;
        margin-bottom: 10px;
    }

    .red {
        color: red;
    }

    .dialog-label {
        padding-right: 30px;
        text-align: right;
        width: 100px;
        vertical-align: top;
    }
</style>