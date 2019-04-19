<template>
    <div class="billing-manager-monitoring">
        <p>落地公司票量预测与监控</p>
        <el-form :model="form" :inline="true" size="small" class="demo-form-inline" ref="form">
            <el-form-item label="时间" prop="time">
                <el-date-picker
                    v-model="form.time"
                    type="month"
                    placeholder="选择月">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="税优地名称" prop="taxlandingId">
                <el-select v-model="form.taxlandingId" filterable>
                    <el-option v-for="e in landingList" :key="e.id" :label="e.taxLandingName" :value="e.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="落地公司" prop="serviceCompanyId">
                <el-select v-model="form.serviceCompanyId" filterable>
                    <el-option v-for="e in companyList" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchBtnClick(true)">查询</el-button>
                <el-button @click="$refs.form.resetFields()">清空</el-button>
            </el-form-item>
        </el-form>
        <div>
            <!-- <el-button type="success" @click="upFilBtnClick">录入销售预测票量</el-button> -->
            <!-- <el-button type="info" @click="daoChuClick">导出</el-button> -->
        </div>
        <br>
        <el-table :data="tableData.list" border style="width: 100%">
            <el-table-column prop="taxLandingName" align="center" header-align="center" label="税优地名称"></el-table-column>
            <el-table-column prop="serviceCompanyName" align="center" header-align="center" label="落地公司名称"></el-table-column>
            <el-table-column prop="periodInitialIssueAmount" align="center" header-align="center" label="期初待开金额">
                <template slot-scope="scope">
                    {{scope.row.periodInitialIssueAmount | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column prop="payAmount" align="center" header-align="center" label="到款金额">
                <template slot-scope="scope">
                    {{scope.row.payAmount | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column prop="issuedAmount" align="center" header-align="center" label="已开金额">
                <template slot-scope="scope">
                    {{scope.row.issuedAmount | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column prop="issueAmount" align="center" header-align="center" label="待开金额">
                <template slot-scope="scope">
                    {{scope.row.issueAmount | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column prop="periodfinalIssueAmount" align="center" header-align="center" label="期末待开金额">
                <template slot-scope="scope">
                    {{scope.row.periodfinalIssueAmount | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column prop="name" align="center" header-align="center" label="期初剩余票量">
                <div class="table-cell-item" slot-scope="scope">
                    <span>专票：{{ scope.row.periodInitialZpNum }}</span>
                    <span>普票：{{ scope.row.periodInitialPpNum }}</span>
                </div>
            </el-table-column>
            <el-table-column prop="address" align="center" header-align="center" label="销售预计开票总数">
                <div class="table-cell-item" slot-scope="scope">
                    <span>专票：{{ scope.row.salesForecastZpNum }}</span>
                    <span>普票：{{ scope.row.salesForecastPpNum }}</span>
                </div>
            </el-table-column>
            <el-table-column prop="address" align="center" header-align="center" label="预计待开票数">
                <div class="table-cell-item" slot-scope="scope">
                    <span>专票：{{ scope.row.waitZpNum }}</span>
                    <span>普票：{{ scope.row.waitPpNum }}</span>
                </div>
            </el-table-column>
            <el-table-column prop="address" align="center" header-align="center" label="已开票数">
                <div class="table-cell-item" slot-scope="scope">
                    <span>专票：{{ scope.row.alreadyZpNum }}</span>
                    <span>普票：{{ scope.row.alreadyPpNum }}</span>
                </div>
            </el-table-column>
            <el-table-column prop="address" align="center" header-align="center" label="剩余票数">
                <div class="table-cell-item" slot-scope="scope">
                    <span>专票：{{ scope.row.surplusZpNum }}</span>
                    <span>普票：{{ scope.row.surplusPpNum }}</span>
                </div>
            </el-table-column>
            <el-table-column prop="address" align="center" header-align="center" label="预计待领票数">
                <div class="table-cell-item" slot-scope="scope">
                    <span>专票：{{ scope.row.forecastWaitZpNum <= 0 ? '--' :  scope.row.forecastWaitZpNum}}</span>
                    <span>普票：{{ scope.row.forecastWaitPpNum <= 0 ? '--' : scope.row.forecastWaitPpNum}}</span>
                </div>
            </el-table-column>
            <el-table-column prop="address" align="center" header-align="center" label="操作" width="160px">
                <div class="table-cell-item option" slot-scope="scope">
                    <router-link :to="`clientInvoiceDetail?serviceCompanyId=${scope.row.serviceCompanyId}&time=${form.time - 0}`" tag="span">查看客户开票明细</router-link>
                    <span @click="addPiaoClick(scope.row)">添加票量</span>
                    <span @click="lingQuJiLuBtnClick(scope.row)">领取记录</span>
                </div>
            </el-table-column>
        </el-table>
        <div class="clearfix" style="padding-top: 10px">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="form.page"
                :page-sizes="[10, 20]"
                :page-size="form.pageSize"
                style="float: right"
                layout="total, sizes, prev, pager, next, jumper"
                :total="tableData.total">
            </el-pagination>
        </div>
        <p style="color: #aaa">注：销售预计开票总数为预测业务流水的最少开票数，且不包含服务费开票数。</p>
        <el-dialog title="本地上传" :visible.sync="upFilePopIsShow" width="800px">
            <p>
                请按照模板填写销售预测数据 <el-button size="mini" @click="upFileDownMoBanBtnClick">下载模板</el-button>*上传销售预测表格
            </p>
            <div v-if="inputData.length > 0">
                <el-table :data="inputData" style="width: 100%">
                <el-table-column prop="displayname" label="文件名称"></el-table-column>
                <el-table-column prop="createTime" label="上传时间"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                    <el-button @click="downloadFileBtnClick(scope.row)" type="text" size="small">下载文件</el-button>
                    <el-button @click="removeFileBtnClick(scope.row)" type="text" size="small">重新上传</el-button>
                    </template>
                </el-table-column>
                </el-table>
                <p>注：重新上传会覆盖原文件的数据，请下载原文件，并在原文件的基础上修改数据</p>
            </div>
            <el-upload
                v-else
                drag
                ref="popUpload"
                accept=".xls, .xlsx"
                action="/api/invoice-web/invoice-monitor/upload-sales-forecast"
                :on-success="fileUpSuccess"
                :on-error="upFileErr"
                :data="{fileName: fileName}"
                :multiple="false"
                :on-change="fileChange"
                :auto-upload="false">
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">请上传小于5M的xls或xlsx格式文件</div>
            </el-upload>

            <span slot="footer" class="dialog-footer">
                <el-button @click="upFilePopIsShow = false">取 消</el-button>
                <el-button type="primary" :loading="upLoading" @click="upFilePopOkBtnClick">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog title="添加票量" :visible.sync="addPiaoPopIsShow" @open="clearAdd" width="40%">
            <el-form :rules="rulesAdd" :model="formAdd" ref="formAdd">
                <div class="input-container">
                    <div class="label dialog-label">月份<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="month" size="small">
                            <el-select v-model="formAdd.month">
                                <el-option :value="new Date().getMonth() == 0 ? 12 : new Date().getMonth()"></el-option>
                                <el-option :value="new Date().getMonth() + 1"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label dialog-label">发票类型<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="invoiceType" size="small">
                            <el-select v-model="formAdd.invoiceType" placeholder="请选择发票类型">
                                <el-option label="增值税专用发票" value="ZP"></el-option>
                                <el-option label="增值税普通发票" value="PP"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label dialog-label">添加票量数量<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="addNum" size="small">
                            <el-input v-model.number="formAdd.addNum"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label dialog-label">添加备注<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="remark" size="small">
                            <el-input type="textarea" v-model="formAdd.remark"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addPiaoPopIsShow=false;" size="small">取 消</el-button>
                <el-button type="primary" @click="addInvoice('formAdd')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="领票记录" :visible.sync="lingQuJiLuPopIsShow" width="80%" :lock-scroll="true" style="margin-top:-5vh">
            <el-form :model="formSelect" ref="formSelect" :inline="true">
                <el-form-item label="状态" size="small" style="float:left;">
                    <el-select v-model="formSelect.selectStatus" placeholder="请选择" @change="handleRequest">
                        <el-option label="全部" value="00"></el-option>
                        <el-option label="有效" value="20"></el-option>
                        <el-option label="无效" value="10"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button type="primary" @click="handleExcel()" size="small">导表</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableInvoice.list" style="width: 100%;text-align:left;">
                <el-table-column prop="invoiceType" label="发票类型">
                    <template slot-scope="scope">
                        <div class="bill common" v-if="scope.row.invoiceType === 'PP'">普票</div>
                        <div class="bill special" v-else>专票</div>
                    </template>
                </el-table-column>
                <el-table-column prop="addNum" label="领票数量"></el-table-column>
                <el-table-column prop="maxNum" label="领取后票量" width="100"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="operatedBy" label="操作人"></el-table-column>
                <el-table-column prop="operatedTime" label="操作时间" width="200"></el-table-column>
                <el-table-column prop="statusName" label="状态"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" v-if="scope.row.status=='20'">
                        <el-button @click="handleCancel(scope.row.id)" type="text" size="medium" style="padding:0;">作废
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="padding: 20px;text-align: right;background-color: white">
                <el-pagination
                    background
                    @size-change="handleInvoiceSizeChange"
                    @current-change="handleInvoiceCurrentChange"
                    :current-page="currentInvoicePage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="tableInvoice.pageSize"
                    layout="total, prev, pager, next, sizes, jumper"
                    :total="tableInvoice.total">
                </el-pagination>
            </div>
        </el-dialog>
    </div>
</template>

<script>
  import {post, get} from '../../store/api';
  import {showNotify} from '../../plugin/utils-notify';
  import { DateFormat } from 'yb-tool'
  const phoneReg = /^[1-9]\d*$/;
  const validatenumber = (rule, value, callback) => {
    if (value == '') {
      callback(new Error('请填写票量数量'))
    } else if (!phoneReg.test(value)) {
      callback(new Error('票量数量必须为正整数'))
    } else if (value > 1000) {
      callback(new Error('票量数量不能大于1000'))
    } else {
      callback()
    }
  };
  export default {
    name: "monitoring",
    data() {
        return {
            form: {
                time: new Date().getTime(),
                taxlandingId: '',
                serviceCompanyId: '',
                page: 1,
                pageSize: 10
            },
            // 查找时间
            // searchDate: new Date(),
            tableData: [],
            // 上传文件提示
            upFilePopIsShow: false,
            // 添加票量弹窗
            addPiaoPopIsShow: false,
            formAdd: {
            month: '',
            invoiceType: '',
            addNum: '',
            remark: '',
            id: ''
            },
            // 领取记录
            lingQuJiLuPopIsShow: false,
            formSelect: {
            selectStatus: '20',
            },
            tableInvoice: {
            total: 0,
            pageNum: 1,
            pageSize: 10,
            list: [],
            companyName: '',
            id: ''
            },
            rulesAdd: {
            month: [
                {
                required: true,
                message: "请选择月份",
                trigger: "blur"
                }
            ],
            invoiceType: [
                {
                required: true,
                message: "请选择发票类型",
                trigger: "blur"
                }
            ],
            addNum: [
                {
                validator: validatenumber,
                trigger: "blur"
                }
            ],
            remark: [
                {
                required: true,
                message: "请填写备注",
                trigger: "blur"
                }
            ]
            },
            // 录入数据
            inputData: [],
            DateFormat: DateFormat,
            // 上传中的状态
            upLoading: false,
            // 上传的文件名
            fileName: '',
            landingList: [],
            companyList: []
        }
    },
    mounted() {
        this.searchBtnClick()
        get('/api/console-dlv/tax-landing/all-tax-landing').then(data => {
            this.landingList = data
        })
        get('/api/invoice-web/service-company/service-company-options').then(data => {
            this.companyList = data
        })
    },
    methods: {
        handleCancel(id) {
            this.$confirm('您确认要作废当前票量吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let param = {
                    id: id,
                };
                get('/api/invoice-web/service-company/cancel', param).then(data => {
                    showNotify('success', data);
                    this.requestInvoiceAction();
                })
            })
        },
        // 删除文件按钮点击
        removeFileBtnClick() {
            this.inputData = []
        },
        // 下载文件按钮点击
        downloadFileBtnClick(item) {
            window.open(`/api/sysmgr-web/file/download?downloadCode=${item.downloadCode}`)
        },
        // 文件上传成功调用
        fileUpSuccess(res) {
            this.upLoading = false
            if (res.code !== 200) {
                showNotify('error', res.msg);
                this.$refs.popUpload.clearFiles();
            } else {
                showNotify('success', '上传成功');
                this.searchBtnClick()
                this.upFilePopIsShow = false
            }
        },
        fileChange(file, fileList) {
            if (fileList.length > 1) {
                fileList.shift()
            }
            this.fileName = file.name
        },
        // 文件上传失败
        upFileErr() {
            this.upLoading = false
            showNotify('error', '文件上传失败');
            this.$refs.popUpload.clearFiles();
        },
        handleInvoiceSizeChange(size) {
            this.tableInvoice.pageSize = size
            this.requestInvoiceAction()
        },
        handleInvoiceCurrentChange(num) {
            this.tableInvoice.pageNum = num
            this.requestInvoiceAction()
        },
        // 查找按钮点击
        searchBtnClick(reload = false) {
            if (reload) {
                this.form.page = 1
            }
            post('/api/invoice-web/invoice-monitor/list', this.form).then(data => {
                this.tableData = data
            })
        },
        requestInvoiceAction() {
            let param = {
                serviceCompanyId: this.tableInvoice.id,
                page: this.tableInvoice.pageNum,
                pageSize: this.tableInvoice.pageSize,
                status: this.formSelect.selectStatus,
                };
                post('/api/invoice-web/service-company/add-num-list', param).then(data => {
                this.tableInvoice.list = data.list;
                this.tableInvoice.total = data.total
            })
        },
        handleRequest() {
            this.requestInvoiceAction()
        },
        addInvoice(formName) {
            this.$refs[formName].validate(valid => {
            if (valid) {
                let formAdd = JSON.parse(JSON.stringify(this.formAdd))
                // formAdd.month = parseInt(formAdd.month)
                post('/api/invoice-web/service-company/add-num', formAdd).then(data => {
                showNotify('success', data);
                this.$refs['formAdd'].resetFields()
                this.addPiaoPopIsShow = false;
                this.searchBtnClick()
                })
            }
            })
        },
        handleSizeChange(num) {
            this.form.pageSize = num
            this.searchBtnClick(true)
        },
        handleCurrentChange(num) {
            this.form.page = num
            this.searchBtnClick()
        },
        // 导出按钮点击
        daoChuClick() {
            const monthStr = `${this.form.month < 10 ? '0' : ''}${this.form.month}`
            window.open(`/api/invoice-web/invoice-monitor/export-list?year=${this.form.year}&month=${monthStr}&page=${this.form.page}&pageSize=${this.form.pageSize}`)
        },
        // 上传文件按钮点击
        upFilBtnClick() {
            this.enterAQuery()
            // this.upFilePopIsShow = true
        },
        // 上传文件确定按钮点击
        upFilePopOkBtnClick() {
            this.$refs.popUpload.submit();
            this.upLoading = true
        },
        // 弹窗下载模板按钮点击
        upFileDownMoBanBtnClick() {
            window.open('/api/invoice-web/invoice-monitor/download-sales-forecast-template')
        },
        // 录取前查询
        // enterAQuery() {
        //     const month = this.searchDate.getMonth() + 1
        //     const year = this.searchDate.getFullYear()
        //     post('/api/invoice-web/invoice-monitor/sales-forecast', {
        //     "month": `${month > 9 ? '' : '0'}${month}`,
        //     "page": this.pageData.page,
        //     "pageSize": this.pageData.pageSize,
        //     "year": `${year}`
        //     }).then(data => {
        //     this.upFilePopIsShow = true
        //     if (data) {
        //         data.createTime = DateFormat(data.createTime)
        //         this.inputData = [data]
        //     }
        //     })
        // },
        // 添加票量按钮点击
        addPiaoClick(item) {
            this.addPiaoPopIsShow = true
            this.formAdd.id = item.serviceCompanyId
        },
        // 领取记录按钮点击
        lingQuJiLuBtnClick(item) {
            this.lingQuJiLuPopIsShow = true
            this.tableInvoice.id = item.serviceCompanyId
            this.requestInvoiceAction()
        },
        handleExcel() {
            const url = '/api/invoice-web/service-company/export-add-num?serviceCompanyId=' + this.tableInvoice.id
            + '&page=1'
            + '&pageSize=1'
            + '&status=' + this.formSelect.selectStatus;
            window.open(url)
        },
        clearAdd() {
            this.$refs.formAdd && this.$refs.formAdd.resetFields()
            this.formAdd.month = new Date().getMonth() + 1
        }
    }
  }
</script>

<style lang="scss" scoped>
.billing-manager-monitoring {
  .table-cell-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .option {
    color: #3582e2;
    cursor: pointer;
  }
}
</style>
