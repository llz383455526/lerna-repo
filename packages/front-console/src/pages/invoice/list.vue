<template>
  <div
    class="content"
    v-loading="isReady"
  >
    <el-form :inline="true">
      <el-form-item
        label="服务公司"
        size="small"
        style="padding-top: 7px"
      >
        <el-select
          v-model="serviceCompanyId"
          placeholder="查看落地公司剩余票量"
          @change="getCompanyInfo"
        >
          <el-option
            v-for="item in companyList"
            :key="item.value"
            :label="item.text"
            :value="item.value" 
          />
        </el-select>
      </el-form-item>
      <div
        class="server-gongsi-piao-text"
        v-if="companyInfo"
        style="display: inline-block;vertical-align: middle;"
      >
        <span>专票剩余票数：{{ companyInfo.leftZPCount }}</span>
        <span>专票可开金额：{{ companyInfo.leftZPAmount }}</span><br>
        <span>普票剩余票数：{{ companyInfo.leftPPCount }}</span>
        <span>普票剩余金额：{{ companyInfo.leftPPAmount }}</span>
      </div>
    </el-form>

    <div class="title">
      申请开票列表
    </div>
    <el-form
      :inline="true"
      :model="formSearch"
      :rules="formSearch"
      ref="formSearch"
    >
      <el-form-item
        label="客户名称"
        size="small"
      >
        <el-input v-model="formSearch.customCompanyName" />
      </el-form-item>
      <el-form-item
        label="申请编号"
        size="small"
      >
        <el-input v-model="formSearch.orderNo" />
      </el-form-item>
      <el-form-item
        label="开票公司"
        size="small"
      >
        <el-select
          v-model="formSearch.serviceCompanyName"
          placeholder="请选择开票公司"
        >
          <el-option
            v-for="item in companyList"
            :key="item.value"
            :label="item.text"
            :value="item.text" 
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="开票金额"
        size="small"
      >
        <el-col :span="11">
          <el-input v-model="formSearch.amountStart" />
        </el-col>
        <el-col
          class="line"
          :span="2"
        >
          -
        </el-col>
        <el-col :span="11">
          <el-input v-model="formSearch.amountEnd" />
        </el-col>
      </el-form-item>
      <el-form-item
        label="申请状态"
        size="small"
      >
        <el-select
          v-model="formSearch.status"
          placeholder="请选择"
          style="width:100%;"
        >
          <el-option
            label="全部"
            value="" 
          />
          <el-option
            v-for="item in InvoiceState"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="发票类型"
        size="small"
      >
        <el-select
          v-model="formSearch.invoiceType"
          placeholder="请选择"
          style="width:100%;"
        >
          <el-option
            label="全部"
            value=""
          />
          <el-option
            v-for="item in InvoiceType"
            :key="item.value"
            :label="item.text"
            :value="item.value" 
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="申请日期"
        size="small"
      >
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item size="small">
        <el-button
          type="primary"
          @click="search"
          size="small"
        >
          查询
        </el-button>
        <el-button
          size="small"
          @click="resetForm('formSearch')"
        >
          清除
        </el-button>
      </el-form-item>
    </el-form>

    <div class="title">
      发票申请列表
    </div>
    <el-button
      type="primary"
      size="small"
      v-if="checkRight(this.permissions, 'invoice-web:/workflow/invoice-add')"
      @click="$refs.makeInvoice.transmit(true)"
    >
      单张申请
    </el-button>
    <router-link
      to="batchApply"
      v-if="checkRight(this.permissions, 'invoice-web:/workflow/invoice-import-submit')"
    >
      <el-button
        type="primary"
        size="small"
      >
        批量申请
      </el-button>
    </router-link>
    <el-button
      type="primary"
      size="small"
      @click="exportList"
    >
      导出
    </el-button>
    <el-button
      size="small"
      style="margin-left: 240px"
      @click="isWait"
    >
      待审批
    </el-button>
    <span style="color: #999">申请票数：{{ statistics.applyNum }}张，申请金额：{{ statistics.applyAmount | formatMoney }}元</span>
    <el-table
      :data="tableList.list"
      @sort-change="sortChange"
      style="width: 100%;margin-top: 20px;"
    >
      <el-table-column
        label="操作"
        width="120"
      >
        <template slot-scope="scope">
          <el-button
            v-if="(scope.row.status == 0 || scope.row.status == 1 || scope.row.status == 2) && scope.row.createBy == userId"
            @click="showDetail(scope.row.processInsId, scope.row.orderNo, scope.row.createBy, true)"
            type="text"
            size="medium"
            style="padding:0;"
          >
            作废
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNo"
        label="申请编号"
        width="100"
      >
        <template slot-scope="scope">
          <el-button
            size="small"
            type="text"
            @click="showDetail(scope.row.processInsId, scope.row.orderNo, scope.row.createBy)"
          >
            {{ scope.row.orderNo }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="statusName"
        label="申请状态"
        width="120"
      />
      <el-table-column
        prop="customCompanyName"
        label="客户名称"
        width="220"
      />
      <el-table-column
        prop="purpose"
        label="发票用途"
        width="220" 
      />
      <el-table-column
        prop="fullName"
        label="发票类目"
        width="220" 
      />
      <el-table-column
        sortable="custom"
        prop="amount"
        label="申请金额"
        width="120" 
      />
      <el-table-column
        prop="num"
        label="申请票数"
        width="120" 
      />
      <el-table-column
        prop="serviceCompanyName"
        label="开票公司"
        width="220"
      />
      <el-table-column
        prop="invoiceTypeName"
        label="发票类型"
        width="120"
      >
        <template slot-scope="scope">
          <div
            class="bill common"
            v-if="scope.row.invoiceTypeName.indexOf('普通') > -1"
          >
            普票
          </div>
          <div
            class="bill special"
            v-else
          >
            专票
          </div>
        </template>
      </el-table-column>
      <el-table-column
        prop="createByName"
        label="申请人"
        width="120" 
      />
      <!--<el-table-column prop="realAmount" label="实开金额" width="120"></el-table-column>-->
      <!--<el-table-column prop="realNum" label="实开票数" width="120"></el-table-column>-->
      <!--<el-table-column prop="rejectAmount" label="拒开金额" width="120"></el-table-column>-->
      <!--<el-table-column prop="rejectNum" label="拒开票数" width="120"></el-table-column>-->
      <el-table-column
        sortable="custom"
        prop="createTime"
        label="申请时间"
        width="220"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss') }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="checkByName"
        label="审批人"
        width="120"
      />
      <el-table-column
        prop="checkTime"
        label="审批时间"
        width="220"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.checkTime | formatTime('yyyy-MM-dd hh:mm:ss') }}</span>
        </template>
      </el-table-column>
    </el-table>

    <ayg-pagination
      v-if="tableList.total"
      :total="tableList.total"
      @handleSizeChange="handleSizeChange"
      @handleCurrentChange="handleCurrentChange"
      :current-page="currentPage"
    />

    <el-dialog
      title="选择发票类型和开票公司"
      :visible.sync="dialogClientVisible"
      width="35%"
    >
      <el-form
        :rules="rulesClient"
        :model="formClient"
        ref="formClient"
      >
        <div class="input-container">
          <div class="label dialog-label">
            发票类型<span>*</span>
          </div>
          <div class="input">
            <el-form-item prop="invoiceType">
              <el-radio-group v-model="formClient.invoiceType">
                <el-radio
                  v-for="item in InvoiceType"
                  :key="item.value"
                  :label="item.value"
                >
                  {{ item.text }}
                </el-radio>
              </el-radio-group>
            </el-form-item>
          </div>
        </div>
        <div class="input-container">
          <div class="label dialog-label">
            开票公司<span>*</span>
          </div>
          <div class="input">
            <el-form-item prop="serviceCompanyId">
              <el-select
                v-model="formClient.serviceCompanyId"
                placeholder="请选择开票公司"
              >
                <el-option
                  v-for="item in companyList"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="dialogClientVisible=false;">
          取 消
        </el-button>
        <el-button
          type="primary"
          @click="showClientForm('formClient')"
        >
          确 定
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="发票申请单"
      :visible.sync="dialogDetailVisible"
      width="50%"
    >
      <div class="detailContext">
        <span>申请编号:</span>
        <span>{{ formDetail.orderNo }}</span>
      </div>
      <div class="detailContext">
        <span>申请时间:</span>
        <span>{{ formDetail.createTime | formatTime('yyyy-MM-dd hh:mm:ss') }}</span>
      </div>
      <div class="detailContext">
        <span>开票名称:</span>
        <span>{{ formDetail.customCompanyName }}</span>
      </div>
      <div class="detailContext">
        <span>纳税人识别号:</span>
        <span>{{ formDetail.customTaxIdcd }}</span>
      </div>
      <el-button
        size="small"
        type="text"
        @click="dshow = !dshow"
      >
        {{ dshow ? '收起' : '详情' }}
      </el-button>
      <template v-if="dshow">
        <div class="detailContext">
          <span>公司地址:</span>
          <span>{{ formDetail.customAddr }}</span>
        </div>
        <div class="detailContext">
          <span>公司电话:</span>
          <span>{{ formDetail.customPhone }}</span>
        </div>
        <div class="detailContext">
          <span>开户行名称:</span>
          <span>{{ formDetail.customBankName }}</span>
        </div>
        <div class="detailContext">
          <span>账号:</span>
          <span>{{ formDetail.customBankAccount }}</span>
        </div>
      </template>
      <div class="detailContext">
        <span>剩余票数:</span>
        <span><span class="red">{{ formDetail.leftInvoiceNum }}</span>张</span>
      </div>
      <div class="detailContext">
        <span>可开票金额:</span>
        <span class="red">{{ formDetail.leftInvoiceAmount }}</span>
      </div>
      <div class="detailContext">
        <span>申请发票数:</span>
        <span><span class="red">{{ formDetail.applyInvoiceNum }}</span>张</span>
      </div>
      <div class="detailContext">
        <span>开票类型:</span>
        <span>{{ formDetail.invoiceTypeName }}</span>
      </div>
      <div class="detailContext">
        <span>开票金额合计:</span>
        <span>{{ formDetail.applyInvoiceAmount }}</span>
      </div>
      <div class="detailContext">
        <span>发票用途:</span>
        <span>{{ formDetail.remark }}</span>
      </div>

      <el-table
        :data="formDetail.items"
        style="width: 100%;margin-top: 20px;"
        @selection-change="handleSelectionChange"
        height="450px"
      >
        <el-table-column
          type="selection"
          v-if="formDetail.status == '1' && !isCancel"
        />
        <el-table-column
          type="index"
          :index="indexMethod"
          width="70" 
        />
        <el-table-column
          prop="fullName"
          label="开票类目"
        />
        <el-table-column
          prop="amount"
          label="开票金额（含税）"
          width="150"
        />
        <el-table-column
          prop="serviceCompanyName"
          label="开票公司"
          width="220"
        />
        <el-table-column
          prop="statusName"
          label="状态"
        />
      </el-table>

      <div
        slot="footer"
        class="dialog-footer"
      >
        <!-- v-if="formDetail.status == '1' || isCancel" -->
        <el-button
          size="small"
          @click="dialogDetailVisible = false"
        >
          关闭
        </el-button>
        <template v-if="formDetail.isOperate">
          <template v-if="formDetail.status == '1' || !isCancel">
            <el-button
              size="small"
              @click="dialogDetailVisible = false;dialogRejectVisible = true"
              v-if="isCan"
            >
              整单拒开
            </el-button>
            <el-button
              size="small"
              type="primary"
              @click="showOpenDialog"
              v-if="isCan"
            >
              审核通过
            </el-button>
          </template>
          <template v-else>
            <el-button
              size="small"
              type="primary"
              @click="cancel"
            >
              申请作废
            </el-button>
          </template>
        </template>
      </div>
    </el-dialog>

    <el-dialog
      title="拒开确认"
      :visible.sync="dialogRejectVisible"
      width="35%"
      :before-close="handleCloseReject"
    >
      <el-form>
        <div class="input-container">
          <div class="label dialog-label">
            拒开原因
          </div>
          <div class="input">
            <el-form-item>
              <el-input
                type="textarea"
                :rows="5"
                v-model="formInvoice.memo"
              />
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="formInvoice.memo = '';formInvoice.allReject=true;dialogRejectVisible=false;submitInvoice()">
          确认拒开
        </el-button>
      </div>
    </el-dialog>

    <el-dialog
      title="开票确认"
      :visible.sync="dialogOpenVisible"
      width="35%"
      :before-close="handleCloseOpen"
    >
      <p>
        申请发票数：<span class="red">{{ formOpen.lengthAll }}</span>张，确认开票数 <span
          class="red"
        >{{ formOpen.lengthChoose }}</span>张，
      </p>
      <p>
        欠票 <span class="red">{{ formOpen.lengthAll - formOpen.lengthChoose }}</span>张，欠票总金额为 <span class="red">{{ formOpen.amount }}</span>
      </p>
      <h3>提交开票后，未勾选的部分将做欠票处理</h3>
      <div
        slot="footer"
        class="dialog-footer"
      >
        <el-button @click="formInvoice.allReject=false;dialogOpenVisible=false;submitInvoice();">
          确认提交
        </el-button>
      </div>
    </el-dialog>
    <make-invoice ref="makeInvoice" />
    <audit-invoice
      :query="search"
      ref="auditInvoice" 
    />
  </div>
</template>

<script>
    import _ from 'lodash';
    import {post, get} from '../../store/api';
    import {mapGetters} from 'vuex';
    import makeInvoice from '../workOrder/dialog/makeInvoice'
    import auditInvoice from '../workOrder/dialog/auditInvoice'
    import { workflow } from "src/api"
    import {urlEncode} from '../../plugin/utils-functions'

    export default {
        name: "List",
        components: {
            makeInvoice,
            auditInvoice
        },
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
                    serviceCompanyName: '',
                    orderNo: '',
                    company: '',
                    amountStart: '',
                    amountEnd: '',
                    status: '',
                    invoiceType: '',
                    startAt: '',
                    endAt: '',
                    approveInvoiceOrderParams: [
                        {
                            order: 0,
                            sortProperty: 'create_time_',
                            sortVal: 'desc'
                        },
                        {
                            order: 1,
                            sortProperty: 'amount_',
                            sortVal: 'asc'
                        }
                    ]
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
                isReady: true,
                statistics: {},
            }
        },
        computed: {
            ...mapGetters({
                permissions: 'permissions'
            }),
            userId() {
                return window.localStorage.getItem('userId')
            }
        },
        mounted() {
            if(this.permissions) {
                this.isCan = this.checkRight(this.permissions, 'invoice-web:/invoice/invoice-approve-submit')
            }
            this.getWait()
            get('/api/invoice-web/invoice/invoice-proposer-list').then(data => {
                this.proposerList = data
            })
            
        },
        watch: {
            permissions() {
                this.isCan = this.checkRight(this.permissions, 'invoice-web:/invoice/invoice-approve-submit')
                // console.log(this.isCan)
            }
        },
        methods: {
            getWait() {
                get('/api/invoice-web/invoice/applying-invoice-num').then(data => {
                    this.wait = data
                })
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
                this.formSearch.serviceCompanyName = ''
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
                    serviceCompanyName: this.formSearch.serviceCompanyName,
                    orderNo: this.formSearch.orderNo,
                    amountStart: this.formSearch.amountStart,
                    amountEnd: this.formSearch.amountEnd,
                    status: this.formSearch.status,
                    invoiceType: this.formSearch.invoiceType,
                    approveInvoiceOrderParams: this.formSearch.approveInvoiceOrderParams,
                    startAt: startAt,
                    endAt: endAt,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                post('/api/invoice-web/invoice/invoice-approve-list', param).then(data => {
                    this.tableList = data
                    this.isReady = false
                })
                let isCreate = sessionStorage.getItem('isCreate')
                // 如果是从创建跳过来的，延迟2秒再刷新一次
                if(isCreate) {
                    sessionStorage.removeItem('isCreate')
                    setTimeout(() => {
                        post('/api/invoice-web/invoice/invoice-approve-list', param).then(data => {
                            this.tableList = data
                            this.isReady = false
                        })
                    }, 2000)
                }
                this.getStatistics(param)
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
            showDetail(processInsId, orderNo, userId, isCancel) {
                // this.dialogDetailVisible = true;
                // this.formInvoice.orderNo = orderNo;
                // this.isCancel = isCancel
                // console.log(this.isCancel)

                // let url = '/api/invoice-web/invoice/get-invoice-approve-info';
                // let param = {
                //     orderNo: orderNo
                // }
                // let self = this;
                // get(url, param).then(data => {
                //     self.formDetail = data;
                // })
                // 这里要判断权限
                /**
                 * tag： 有审核权限
                 */
                const tag = !!this.$store.state.permissions['invoice-web:/workflow/invoice-approve-submit']
                get(workflow.getTaskId, {processInsId}).then(res => {
                    const param = {}
                    param.businessId = res.businessId || orderNo
                    param.id = res.processTaskId
                    param.processInstanceId = processInsId
                    param.insVariables = res.insVariables
                    param.finishedStatus = res.status
                    // 判断是否点作废
                    if(isCancel) {
                        this.$refs.auditInvoice.transmit({
                            show: true,
                            param: param,
                            look: true,
                            isMe:  true
                        })
                    } else {
                        this.$refs.auditInvoice.transmit({
                            show: true,
                            param: param,
                            look: !tag,
                            isMe:  false
                        })
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
                        this.requestAction({
                            page: 1,
                            pageSize: this.pageSize,
                        });
                        this.getWait()
                    })
                }).catch(() => {})
            },
            showOpenDialog() {

                if (this.ChooseList.length === 0) {
                    this.$message({
                        message: '请至少选择一项',
                        type: 'warning'
                    });
                    return
                }

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
                this.dialogDetailVisible = false
                let url = '/api/invoice-web/invoice/invoice-approve-submit';
                let param = this.formInvoice;
                let self = this;
                post(url, param).then(res => {
                    self.requestAction({
                        page: 1,
                        pageSize: self.pageSize,
                    });
                    this.getWait()
                })
            },
            // checkRight() {
            //     console.log('1')
            //     this.userInformation && this.userInformation.roles.forEach(e => {
            //         console.log(e.name)
            //         if(e.name == "发票管理员" || e.name == "开票审批") {
            //             this.isCan = true
            //         }
            //     })
            // },
            isWait() {
                this.resetForm('formSearch')
                this.formSearch.status = '1'
                this.search()
            },
            // 查询发票统计数据
            getStatistics(data) {
                post('/api/invoice-web/invoice/invoice-approve-statistics',data).then(res => {
                    this.statistics = res
                })
            },
            // 导出
            exportList() {
                const formSearch = JSON.parse(JSON.stringify(this.formSearch))
                formSearch.startAt = this.dateValue[0]
                formSearch.endAt = this.dateValue[1]
                delete formSearch.approveInvoiceOrderParams
                console.log(urlEncode(formSearch))
                window.open(`/api/invoice-web/invoice/invoice-approve-export?${urlEncode(formSearch).substring(1)}`)
                // get('/api/invoice-web/invoice/invoice-approve-export').then(res => {
                //     // this.statistics = res
                // })
                
            },
            // 排序
            sortChange({prop, order}) {
                if(prop === 'amount') {
                    this.formSearch.approveInvoiceOrderParams[0].order = 1
                    this.formSearch.approveInvoiceOrderParams[1].order = 0
                } else if(prop === 'createTime') {
                    this.formSearch.approveInvoiceOrderParams[0].order = 0
                    this.formSearch.approveInvoiceOrderParams[1].order = 1
                }
                if(order === 'ascending') {//升序
                    if(prop === 'amount') { // 金额
                        this.formSearch.approveInvoiceOrderParams[1].sortVal = 'asc'
                    } else if(prop === 'createTime')  {
                        this.formSearch.approveInvoiceOrderParams[0].sortVal = 'asc'
                    }
                } else if(order === 'descending') { // 降序
                    if(prop === 'amount') { // 金额
                        this.formSearch.approveInvoiceOrderParams[1].sortVal = 'desc'
                    } else if(prop === 'createTime')  {
                        this.formSearch.approveInvoiceOrderParams[0].sortVal = 'desc'
                    }
                }
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            }
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
    .server-gongsi-piao-text span {
        font-size: 12px;
        width: 200px;
        display: inline-block;
    }
</style>
