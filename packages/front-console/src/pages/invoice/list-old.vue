<template>
    <div class="content">
        <el-form :inline="true">
            <el-form-item label="服务公司" size="small">
                <el-select v-model="serviceCompanyId" placeholder="查看落地公司剩余票量" @change="getCompanyInfo">
                    <el-option v-for="item in companyList" :key="item.value" :label="item.text":value="item.value"></el-option>
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
            <el-form-item label="商户名称" size="small" prop="customCompanyName">
                <el-input v-model="formSearch.customCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="申请编号" size="small" prop="orderNo">
                <el-input v-model="formSearch.orderNo"></el-input>
            </el-form-item>
            <el-form-item label="开票公司" size="small" prop="serviceCompanyName">
                <el-select v-model="formSearch.serviceCompanyName" placeholder="请选择开票公司">
                    <el-option v-for="item in companyList" :key="item.value" :label="item.text":value="item.text"></el-option>
                </el-select>
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
            <el-form-item label="申请类型" size="small" prop="applyType">
                <el-select v-model="formSearch.applyType" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in applyState" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请状态" size="small" prop="status">
                <el-select v-model="formSearch.status" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in InvoiceState" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发票类型" size="small" prop="invoiceType">
                <el-select v-model="formSearch.invoiceType" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in InvoiceType" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户开票类型" size="small" prop="customerInvoiceType">
                <el-select v-model="formSearch.customerInvoiceType" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in customerInvoiceTypes" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请日期" size="small">
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd"
                        @change="getRange">
                </el-date-picker>
            </el-form-item>
            <el-form-item size="small">
                <el-button type="primary" @click="requestAction" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>

        <div class="title">发票申请列表</div>
        <el-button type="primary" size="small" @click="danZhangShenQingClick">单张申请</el-button>
        <router-link to="batchApply">
            <!--<el-button type="primary" size="small" @click="dialogClientVisible = true;">批量申请</el-button>-->
        </router-link>
        <el-button size="small" style="margin-left: 240px" @click="isWait">待审批：{{wait}}</el-button>
        <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column label="操作" width="120">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.cancelFlag == 0 && scope.row.applyType != '客户申请'" @click="showDetail(scope.row.id, true)" type="text" size="medium" style="padding:0;">作废</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="申请编号" width="100">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="showDetail(scope.row.id)">{{scope.row.orderNo}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="createTime" label="申请时间" width="220">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="applyType" label="申请类型" width="120"></el-table-column>
            <el-table-column prop="statusName" label="申请状态" width="120"></el-table-column>
            <el-table-column prop="customCompanyName" label="商户名称" width="160"></el-table-column>
            <el-table-column prop="purpose" label="发票用途" width="160"></el-table-column>
            <el-table-column prop="amount" label="申请金额" width="120"></el-table-column>
            <el-table-column prop="num" label="申请票数" width="120"></el-table-column>
            <el-table-column prop="realAmount" label="实开金额" width="120"></el-table-column>
            <el-table-column prop="realNum" label="实开票数" width="120"></el-table-column>
            <el-table-column prop="rejectAmount" label="拒开金额" width="120"></el-table-column>
            <el-table-column prop="rejectNum" label="拒开票数" width="120"></el-table-column>
            <el-table-column prop="invoiceTypeName" label="发票类型" width="120">
                <template slot-scope="scope">
                    <div class="bill common" v-if="scope.row.invoiceTypeName.indexOf('普通') > -1">普票</div>
                    <div class="bill special" v-else>专票</div>
                </template>
            </el-table-column>
            <el-table-column prop="customerInvoiceType" label="客户开票类型"></el-table-column>
            <el-table-column prop="serviceCompanyName" label="开票公司" width="220"></el-table-column>
            <el-table-column prop="createByName" label="申请人" width="120"></el-table-column>
            <el-table-column prop="checkByName" label="审批人" width="120"></el-table-column>
            <el-table-column prop="checkTime" label="审批时间" width="220">
                <template slot-scope="scope">
                    <span>{{scope.row.checkTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
        </el-table>

        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="formSearch.page">
        </ayg-pagination>

        <el-dialog title="选择落地公司和客户公司" :visible.sync="danZhangKaiPiaoPopIsShow" width="500px" label-width="80px">
            <el-form :rules="danZhangKiPiaoFormRules" :model="danZhangKiPiaoForm" ref="danZhangKiPiaoForm">
                <el-form-item label="客户公司" prop="keHuId">
                    <el-select style="width: 370px" @change="keHuGongSiSrlChange" v-model="danZhangKiPiaoForm.keHuId" placeholder="请选择客户公司">
                        <el-option v-for="item in keHuDataArr" :key="item.value" :label="item.text"
                                   :value="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="落地公司" prop="luoDi">
                    <el-select style="width: 370px" v-model="danZhangKiPiaoForm.luoDi" placeholder="请选择落地公司">
                        <el-option v-for="item in luoDiDataArr" :key="item.companyId" :label="item.companyName"
                                   :value="item"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="danZhangKaiPiaoPopIsShow=false;">取 消</el-button>
                <el-button type="primary" @click="kaiPiaoPopOkClick">确 定</el-button>
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
                <span>申请类型:</span>
                <span>{{formDetail.applyType}}</span>
            </div>
            <div class="detailContext">
                <span>客户开票类型:</span>
                <span>{{formDetail.customerInvoiceType}}</span>
            </div>
            <div class="detailContext">
                <span>开票名称:</span>
                <span>{{formDetail.customCompanyName}}</span>
            </div>
            <div class="detailContext">
                <span>纳税人识别号:</span>
                <span>{{formDetail.customTaxIdcd}}</span>
            </div>
            <el-button size="small" type="text" @click="dshow = !dshow">{{dshow ? '收起' : '详情'}}</el-button>
            <template v-if="dshow">
                <div class="detailContext">
                    <span>公司地址:</span>
                    <span>{{formDetail.customAddr}}</span>
                </div>
                <div class="detailContext">
                    <span>公司电话:</span>
                    <span>{{formDetail.customPhone}}</span>
                </div>
                <div class="detailContext">
                    <span>开户行名称:</span>
                    <span>{{formDetail.customBankName}}</span>
                </div>
                <div class="detailContext">
                    <span>账号:</span>
                    <span>{{formDetail.customBankAccount}}</span>
                </div>
            </template>
            <div class="detailContext">
                <span>剩余票数:</span>
                <span><span class="red">{{formDetail.leftInvoiceNum}}</span>张</span>
            </div>
            <div class="detailContext">
                <span>可开票金额:</span>
                <span class="red">{{formDetail.leftInvoiceAmount}}</span>
            </div>
            <div class="detailContext">
                <span>申请发票数:</span>
                <span><span class="red">{{formDetail.applyInvoiceNum}}</span>张</span>
            </div>
            <div class="detailContext">
                <span>开票类型:</span>
                <span>{{formDetail.invoiceTypeName}}</span>
            </div>
            <div class="detailContext">
                <span>开票金额合计:</span>
                <span>{{formDetail.applyInvoiceAmount}}</span>
            </div>
            <div class="detailContext">
                <span>发票用途:</span>
                <span>{{formDetail.purpose}}</span>
            </div>

            <el-table :data="formDetail.items" style="width: 100%;margin-top: 20px;" @selection-change="handleSelectionChange">
                <el-table-column type="selection" v-if="formDetail.status == '1' && !isCancel && formDetail.applyType != '客户申请'"></el-table-column>
                <el-table-column type="index" :index="indexMethod" width="70"></el-table-column>
                <el-table-column prop="subjectName" label="开票类目"></el-table-column>
                <el-table-column prop="amount" label="开票金额（含税）" width="150"></el-table-column>
                <el-table-column prop="serviceCompanyName" label="开票公司" width="220"></el-table-column>
                <el-table-column prop="statusName" label="状态"></el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogDetailVisible = false">关闭</el-button>
                <template v-if="formDetail.status == '1' || isCancel">
                    <template v-if="!isCancel">
                        <el-button size="small" @click="dialogDetailVisible = false;dialogRejectVisible = true" v-if="isCan">整单拒开</el-button>
                        <el-button size="small" type="primary" @click="showOpenDialog" v-if="isCan">{{formDetail.applyType == '客户申请' ? '整单通过' : '审核通过'}}</el-button>
                    </template>
                    <template v-else>
                        <el-button size="small" type="primary" @click="cancel">申请作废</el-button>
                    </template>
                </template>
                <template v-if="formDetail.status != '1' && prevList.length">
                    <el-button size="small" type="primary" @click="preview">发票扫描件预览</el-button>
                </template>
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
                <el-button @click="dialogOpenVisible=false;formInvoice.allReject = false;submitInvoice();">确认提交</el-button>
            </div>
        </el-dialog>
        <div class="v-modal" v-show="showDown" @click.self="showDown = false" :style="{ backgroundImage: `url(/api/invoice-web/invoice/attachment/preview/${attachmentId})`}">
            <a class="abtn" :href="`/api/invoice-web/invoice/attachment/download/${attachmentId}`" target="_blank">下载发票</a>
            <div class="left" @click="go(-1)">&lt;</div>
            <div class="right" @click="go(1)">&gt;</div>
        </div>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {post, get} from '../../store/api';
    import {mapGetters} from 'vuex';
    export default {
        name: "list",
        data() {
            return {
                serviceCompanyId: '',
                companyList: [],
                companyInfo: '',
                applyState: [
                    {
                        text: '客户申请',
                        value: 20
                    },
                    {
                        text: '交付申请',
                        value: 10
                    }
                ],
                InvoiceState: [],
                InvoiceType: [],
                customerInvoiceTypes: [
                    {
                        text: '账单开票',
                        value: 10
                    },
                    {
                        text: '预开票',
                        value: 20
                    }
                ],
                dateValue: '',
                formSearch: {
                    customCompanyName: '',
                    serviceCompanyName: '',
                    orderNo: '',
                    company: '',
                    amountStart: '',
                    amountEnd: '',
                    status: '',
                    applyType: '',
                    invoiceType: '',
                    customerInvoiceType: '',
                    startAt: '',
                    endAt: '',
                    page: 1,
                    pageSize: 10
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
                },
                isCan: false,
                dshow: false,
                isCancel: false,
                wait: 0,
                showDown: false,
                attachmentId: 1,
                prevList: [],
                previewIndex: 0,
                // 单张开票弹窗
                danZhangKaiPiaoPopIsShow: false,
                // 单张开票弹窗数据
                danZhangKiPiaoForm: {
                    keHuId: null,
                    luoDi : null
                },
                // 客户公司数据数据
                keHuDataArr: [],
                // 落地公司数组数据
                luoDiDataArr: [],
                // 单张申请弹窗校验
                danZhangKiPiaoFormRules: {
                    keHuId: [
                        {
                            required: true,
                            message: "请选择客户公司",
                            trigger: "change"
                        }
                    ],
                    luoDi: [
                        {
                            required: true,
                            message: "请选择落地公司",
                            trigger: "change"
                        }
                    ]
                }
            }
        },
        computed: {
            ...mapGetters({
                permissions: 'permissions'
            })
        },
        mounted() {
            if(this.permissions) {
                this.isCan = this.checkRight(this.permissions, 'invoice-web:/invoice/invoice-approve-submit')
            }
            this.getWait()
        },
        watch: {
            permissions() {
                console.log('right')
                this.isCan = this.checkRight(this.permissions, 'invoice-web:/invoice/invoice-approve-submit')
                console.log(this.isCan)
            }
        },
        methods: {
            // 单张申请按钮点击
            danZhangShenQingClick() {
              this.danZhangKaiPiaoPopIsShow = true
                this.getKeHuDataArr()
            },
            // 开票确定按钮点击
            kaiPiaoPopOkClick() {
                this.$refs['danZhangKiPiaoForm'].validate((valid) => {
                    if (valid) {
                        console.log(this.danZhangKiPiaoForm)
                        const luoDi = this.danZhangKiPiaoForm.luoDi
                        const p = {
                            keHuId: this.danZhangKiPiaoForm.keHuId,
                            luoDiId: luoDi.companyId,
                            serviceIds: JSON.stringify(luoDi.serviceIds),
                            invoiceTypes: JSON.stringify(luoDi.invoiceTypes),
                            openInvoiceType: luoDi.openInvoiceType
                        }
                        this.$router.push({
                            path: '/main/invoice/invoice-step1',
                            query: p
                        })
                    } else {
                        return false;
                    }
                });
            },
            // 获取客户公司数据
            getKeHuDataArr() {
                get('/api/invoice-web/invoice/custom-company-options').then(data => {
                    this.keHuDataArr = data
                })
            },
            // 客户公司选择改变的时候调用
            keHuGongSiSrlChange(value) {
                this.luoDiDataArr = []
                this.danZhangKiPiaoForm.luoDi = null
                get(`/api/contract-web/contract/get-customer-invoice-info?customCompanyId=${value}`).then(data => {
                    this.luoDiDataArr = data
                })
            },
            // 弹窗数据校验
            getWait() {
                get('/api/invoice-web/invoice/applying-invoice-num').then(data => {
                    this.wait = data
                })
            },
            getRange() {
                if(this.dateValue && this.dateValue.length) {
                    this.formSearch.startAt = this.dateValue[0]
                    this.formSearch.endAt = this.dateValue[1]
                }
                else {
                    this.formSearch.startAt = ''
                    this.formSearch.endAt = ''
                }
            },
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
                let url = '/api/invoice-web/commom/service-company-options';
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
                // this.formSearch.customCompanyName = '';
                // this.formSearch.serviceCompanyName = ''
                // this.formSearch.orderNo = '';
                this.formSearch.amountStart = '';
                this.formSearch.amountEnd = '';
                // this.formSearch.status = '';
                // this.formSearch.invoiceType = '';
                // this.formSearch.applyType = ''
                this.dateValue = [];
                this.formSearch.startAt = ''
                this.formSearch.endAt = ''
            },
            requestAction(pageInfo) {
                // let startAt = '';
                // let endAt = '';
                // if (this.dateValue) {
                //     startAt = this.dateValue[0];
                //     endAt = this.dateValue[1];
                // }
                // let param = {
                //     customCompanyName: this.formSearch.customCompanyName,
                //     serviceCompanyName: this.formSearch.serviceCompanyName,
                //     orderNo: this.formSearch.orderNo,
                //     amountStart: this.formSearch.amountStart,
                //     amountEnd: this.formSearch.amountEnd,
                //     status: this.formSearch.status,
                //     invoiceType: this.formSearch.invoiceType,
                //     applyType: this.formSearch.applyType,
                //     startAt: startAt,
                //     endAt: endAt,
                //     page: pageInfo.page,
                //     pageSize: pageInfo.pageSize,
                // };
                post('/api/invoice-web/invoice/invoice-approve-list', this.formSearch).then(data => {
                    this.tableList = data
                })
            },
            handleSizeChange(value) {
                this.formSearch.pageSize = value;
                this.formSearch.page = 1;
                this.requestAction();
            },
            handleCurrentChange(value) {
                if(isNaN(value)) {
                    value = 1
                }
                this.formSearch.page = value;
                // if (this.currentChangeBySetting) {
                //     this.currentChangeBySetting = false;
                //     return;
                // }
                this.requestAction();
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
            showDetail(orderNo, isCancel) {
                this.dialogDetailVisible = true;
                this.formInvoice.orderNo = orderNo;
                this.isCancel = isCancel
                console.log(this.isCancel)

                let url = '/api/invoice-web/invoice/get-invoice-approve-info';
                let param = {
                    orderNo: orderNo
                }
                let self = this;
                get(url, param).then(data => {
                    self.formDetail = data;
                    if(self.formDetail.applyType == '客户申请') {
                        self.ChooseList = self.formDetail.items
                    }
                    console.log(self.formDetail.status)
                    if(self.formDetail.status != 1) {
                        self.prevList = self.formDetail.items.filter(e => {
                            console.log(e.attachmentId)
                            return e.attachmentId
                        })
                        console.log(self.prevList)
                    }
                })
            },
            reject() {
                this.dialogRejectVisible = true
                if(!this.ChooseList.length) {
                    return
                }
                this.$confirm('您确认要整单拒批吗？', '确认拒批', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.formInvoice.allReject = true;
                    this.submitInvoice()
                }).catch(() => {})
            },
            pass() {
                this.$confirm('您确认审核通过吗？', '确认通过', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.formInvoice.allReject = false;
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
                    this.submitInvoice()
                }).catch(() => {})
            },
            cancel() {
                this.$confirm('您确认要作废当前申请吗？', '申请作废', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/api/invoice-web/invoice/cancel-invoice-order', {
                        orderId: this.formInvoice.orderNo
                    }).then(() => {
                        // this.$message({
                        //     type: 'success',
                        //     message: '申请成功！'
                        // })
                        this.dialogDetailVisible = false
                        this.requestAction();
                        this.getWait()
                    })
                }).catch(() => {})
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
                let newWindow = window.open();
                let param = this.formInvoice;
                post(url, param).then(data => {
                    newWindow.location.href = data;
                });
            },
            submitInvoice() {
                this.dialogDetailVisible = false
                let url = '/api/invoice-web/invoice/invoice-approve-submit';
                let param = this.formInvoice;
                let self = this;
                post(url, param).then(res => {
                    self.requestAction();
                    this.getWait()
                })
            },
            isWait() {
                this.resetForm('formSearch')
                this.formSearch.status = '1'
                this.requestAction()
            },
            preview() {
                this.dialogDetailVisible = false
                this.showDown = true
                this.go(0)
            },
            go(a) {
                if(isNaN(a)) {
                    a = 1
                }
                if(this.prevList[this.previewIndex + a]) {
                    this.previewIndex += a
                }
                else {
                    if(a > 0) {
                        this.previewIndex = 0
                    }
                    else {
                        this.previewIndex = this.prevList.length - 1
                    }
                }
                this.attachmentId = this.prevList[this.previewIndex].attachmentId || 1
            }
        },
        created() {
            this.requestAction();
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
.bill {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 5px;
    color: #fff;
}
.common {
    background-color:  #6BDDA2;
}
.special {
    background-color: #63D1F2;
}
.v-modal {
    z-index: 2001;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 900px 600px;
    background-position: center center;
    transition: all 0.3s;
}
.abtn {
    position: absolute;
    top: calc(50% - 346px);
    left: calc(50% - 450px);
    display: inline-block;
    width: 80px;
    height: 22px;
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    background-image: url(../../image/download_logo.png);
    background-color: #fff;
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 7px center;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    text-indent: 22px;
    line-height: 20px;
}
.left {
    position: absolute;
    color: #fff;
    font-size: 40px;
    top: calc( 50% - 20px);
    left: calc(50% - 500px);
    cursor: pointer;
    user-select: none;
}
.right {
    position: absolute;
    color: #fff;
    font-size: 40px;
    top: calc( 50% - 20px);
    right: calc(50% - 500px);
    cursor: pointer;
    user-select: none;
}
</style>
