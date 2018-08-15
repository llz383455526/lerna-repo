<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0px 30px 30px;">充值申请记录</div>

        <el-form :inline="true" ref="formSearch" onsubmit="return false;"  :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="申请时间:" size="small">
                <el-date-picker
                v-model="dateValue"
                type="daterange"
                value-format="yyyy-MM-dd"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
                @change="setTime">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="处理状态:"   size="small" prop="state">
                <el-select v-model="formSearch.state">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option v-for="(item, index) in optionTypes.RechargeOrderStateType" :label="item.text" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="充值渠道:"   size="small" prop="channelCode">
                <el-select v-model="formSearch.channelCode">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option v-for="(item, index) in optionTypes.ChannelType" :label="item.text" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户公司:" size="small" prop="customCompanyName">
                <el-input style="width: 150px" v-model="formSearch.customCompanyName" placeholder="请输入关键词"></el-input>
            </el-form-item>
            <el-form-item label="账户名称:"   size="small" prop="accountName">
                <el-input v-model="formSearch.accountName"></el-input>
                <!-- <el-select v-model="formSearch.accountName">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option v-for="(item, index) in optionTypes.RechargeOrderStateType" :label="item.text" :value="item.value" :key="item.value"></el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="query" size="small">查询</el-button>
                <el-button size="small" @click="clear">重置</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="dialogCreateVisible=true">创建充值申请</el-button>
        <el-table :data="rechargeApplyList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="companyName" label="充值单号" width="120px">
                <template slot-scope="scope">
                    <el-button @click="getDetail(scope.row)" type="text">{{scope.row.orderNo}}</el-button>
                </template>
            </el-table-column>
            <!-- <el-table-column label="申请时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createAt |formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column> -->
            <el-table-column prop="stateName" label="处理状态"></el-table-column>
            <el-table-column prop="channelBusinessTypeName" label="业务类型"></el-table-column>
            <el-table-column prop="payUser.thirdPaymentTypeName" label="充值渠道"></el-table-column>
            <el-table-column label="充值金额">
                <template slot-scope="scope">
                    <span>{{scope.row.amount |formatMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="companyName" label="客户公司"></el-table-column>
            <el-table-column prop="appName" label="商户名称"></el-table-column>
            <el-table-column prop="accountName" label="账户名称"></el-table-column>
            <el-table-column prop="depositBank" label="开户行"></el-table-column>
            <el-table-column prop="accountNo" label="账号"></el-table-column>
            <el-table-column prop="purpose" label="充值用途"></el-table-column>
            <el-table-column prop="createByNme" label="申请人"></el-table-column>
            <el-table-column prop="createAt" label="申请时间"></el-table-column>
            <el-table-column prop="approveByNme" label="审批人"></el-table-column>
            <el-table-column prop="approveAt" label="审批时间"></el-table-column>
            <!-- <el-table-column prop="rechargeCode" label="充值码"></el-table-column>
            <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                    <span class="operation" v-if="scope.row.state == 20" @click="receiveMoney(scope.row.orderNo)">已到账</span>
                    <span class="operation" v-if="scope.row.state == 20" @click="unReceiveMoney(scope.row.orderNo)">未到账</span>
                </template>
            </el-table-column> -->
        </el-table>

        <ayg-pagination 
            v-if="rechargeApplyList.total"
            :total="rechargeApplyList.total"
            :currentPage="formSearch.page"
            v-on:handleSizeChange="sizeChange"
            v-on:handleCurrentChange="query">
        </ayg-pagination>
        <el-dialog title="创建充值申请" :before-close="closeEditDialog"  :visible.sync="dialogCreateVisible" width="50%">
            <el-form :model="dialogCreateForm" :rules="dialogCreateFormRules" ref="dialogCreateForm">
                <div class="input-container">
                    <div class="label">客户公司：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="companyId">
                            <el-select filterable v-model="dialogCreateForm.companyId" @change="clearApp">
                                <el-option v-for="(item, index) in customCompanies" :label="item.companyName" :value="item.companyId" :key="item.companyId"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">商户名称：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="appId">
                            <el-select filterable v-model="dialogCreateForm.appId" no-data-text="请先选择客户公司" @change="getService">
                                <el-option v-for="(item, index) in productName" :label="item.text" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                     <div class="label">服务商名称：<span>*</span></div>
                     <div class="input">
                         <el-form-item prop="serviceCompanyId">
                             <el-select filterable v-model="dialogCreateForm.serviceCompanyId" no-data-text="请先选择商户" @change="getChannlType">
                                 <el-option v-for="(item, index) in serviceName" :label="item.text" :value="item.value" :key="item.value"></el-option>
                             </el-select>
                         </el-form-item>
                     </div>
                </div>
                <div class="input-container">
                    <div class="label">业务类型：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="channelBusinessType">
                            <el-select filterable v-model="dialogCreateForm.channelBusinessType" no-data-text="请先选择商户" @change="getServiceFee">
                                <el-option v-for="(item, index) in channelTypes" :label="item.text" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">充值用途：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="purpose">
                            <el-input :maxlength=50 v-model="dialogCreateForm.purpose" placeholder=""></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">充值金额：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="amount">
                            <el-input :maxlength=15 v-model="dialogCreateForm.amount" placeholder=""></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container" v-if="calcServiceFee">
                    <div class="label">服务费金额：<span>*</span></div>
                    <div class="input">
                        <el-form-item v-if="calcServiceFee">
                            <el-input placeholder="实发金额*服务费收费比例" disabled v-model="serviceFee"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                   <div class="label">充值凭证：<span>*</span></div>
                   <div class="input">
                       <el-form-item prop="attachmentId">
                           <el-upload
                                class="det"
                                ref="upload"
                                :show-file-list="false"
                                :action="`/api/sysmgr-web/file/upload`"
                                :auto-upload="false"
                                :on-change="getAttachment"
                                :multiple="false"
                                name="file"
                                accept=".jpg, .png">
                                <img v-if="attachmentUrl" :src="attachmentUrl" class="avatar">
                                <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                            </el-upload>
                       </el-form-item>
                   </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogCreateVisible = false;$refs['dialogCreateForm'].resetFields()">取 消</el-button>
                <el-button type="primary" @click="submitDialogCreateForm()">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title=""  :visible.sync="dialogConfirmVisible" width="40%">
            <div class="input-container">
                <div class="label">账户名称：</div>
                <div class="input">{{orderInfo.accountName}}</div>
            </div>
            <div class="input-container">
                <div class="label">开户行：</div>
                <div class="input">{{orderInfo.depositBank}}</div>
            </div>
            <div class="input-container">
                <div class="label">账号：</div>
                <div class="input">{{orderInfo.accountNo}}</div>
            </div>
            <div class="input-container">
                <div class="label">充值用途：</div>
                <div class="input">{{orderInfo.purpose}}</div>
            </div>
            <div class="input-container">
                <div class="label">充值金额：</div>
                <div class="input">{{orderInfo.amount | formatMoney}}</div>
            </div>
            <div class="input-container">
                <div class="label">充值码：</div>
                <div class="input red" style="width:400px;">{{orderInfo.rechargeCode}}（请务必备注在付款信息中，便于收款方确认款项）</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitConfirmOrder">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="到账操作"  :visible.sync="show" width="960px">
            <div class="title">客户充值凭证</div>
            <div class="det">充值金额：{{detail.amount | formatMoney}}</div>
            <div class="det" v-if="detail.serviceFee">服务费金额：{{detail.serviceFee | formatMoney}}</div>
            <div class="det">企业名称：{{detail.companyName}}</div>
            <div class="det">商户名称：{{detail.appName}}</div>
            <div class="title">服务商信息</div>
            <div class="det">名称：{{detail.serviceCompanyName}}</div>
            <div class="det">所属银行：{{detail.depositBank}}</div>
            <div class="det">开户行：{{detail.depositBank}}</div>
            <div class="det">账户名：{{detail.accountName}}</div>
            <div class="det">账号：{{detail.accountNo}}</div>
            <div class="det" v-if="detail.payUser">业务渠道：{{detail.payUser.thirdPaymentTypeName}}</div>
            <div class="voucher">
                <div class="title">转账凭证</div>
                <img style="width: 400px" :src="`/api/sysmgr-web/file/download?downloadCode=${detail.customDownloadCode}`" alt="">
            </div>
            <!-- <div class="det red" v-if="detail.payUser">子账号名称：{{detail.payUser.payUserName}}</div>
            <div class="det red" v-if="detail.payUser">子账号：{{detail.payUser.payUserNo}}</div> -->
            <!-- <div class="det">业务类型：{{detail.channelBusinessTypeName}}</div> -->
            <div class="title">渠道金额充值</div>
            <div class="det">
                <div style="float: left;">上传充值凭证：</div>
                <el-upload
                    v-if="detail.state != 30 && detail.state != 40"
                    class="upload"
                    :file-list="fileList"
                    ref="upload"
                    :show-file-list="false"
                    :action="`/api/sysmgr-web/file/upload`"
                    :auto-upload="false"
                    :on-change="getImg"
                    :multiple="false"
                    name="file"
                    accept=".jpg, .png">
                    <img v-if="imageUrl" :src="imageUrl" class="avatar">
                    <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
                <img style="width: 400px" v-else :src="`/api/sysmgr-web/file/download?downloadCode=${detail.financeDownloadCode}`" alt="">
            </div>
            <div class="det">备注：
                <el-input size="small" v-model="memo" style="width: 300px" v-if="detail.state != 30 && detail.state != 40"></el-input>
                <span>{{detail.memo}}</span>
            </div>
            <div class="det">选择渠道帐号：
                <el-select size="small" v-model="balanceAccountId" @change="getSuggest">
                    <el-option v-for="e in channlList" :label="`${e.channelAlias}/${e.channelLoginAcctNo}/${e.channelMerCustId}`" :value="e.balanceAccountId"></el-option>
                </el-select>
            </div>
            <div class="det" v-if="suggest">帐号今日可充建议：{{suggest.allowAvailBalance | formatMoney}}元 帐号当前余额：{{suggest.currentAvailBalance | formatMoney}}元
                日发放限额：{{suggest.limitAvailBalance | formatMoney}}元 当日已发：{{suggest.outAvailBalance | formatMoney}}元
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="show = false">取消</el-button>
                <template v-if="detail.state != 30 && detail.state != 40">
                    <el-button size="small" type="primary" @click="ensure(40)">未到账</el-button>
                    <el-button size="small" type="primary" @click="ensure(30)">确认到账</el-button>
                </template>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import _ from "lodash";
import { formatTime, urlEncode } from "../../plugin/utils-functions";
import { checkMoney } from "../../plugin/utils-element-validator";
import { showNotify } from "../../plugin/utils-notify";
import { showConfirm, showAlert } from "../../plugin/utils-message";
import { baseUrl } from "../../config/address";
import { get, post, importPost } from "../../store/api";

export default {
  name: "credit-bill",
  data() {
    var time = new Date();
    var t = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1) }-${time.getDate()}`
    return {
      pageSize: 10,
      currentPage: 1,
      dialogCreateForm: {
        companyId: "",
        appId: "",
        channelBusinessType: "",
        amount: "",
        purpose: "",
        serviceCompanyId: '',
        attachmentId: ''
      },
      dialogCreateFormRules: {
        companyId: [
          {
            required: true,
            message: "请选择客户公司",
            trigger: "blur"
          }
        ],
        appId: [
          {
            required: true,
            message: "请选择商户",
            trigger: "blur"
          }
        ],
        channelBusinessType: [
          {
            required: true,
            message: "请选择业务类型",
            trigger: "blur"
          }
        ],
        serviceCompanyId: [
          {
            required: true,
            message: "请选择充值服务商",
            trigger: "blur"
          }
        ],
        purpose: [
          {
            required: true,
            message: "请填写充值用途",
            trigger: "blur"
          }
        ],
        amount: [
          {
            required: true,
            message: "请选择充值金额",
            trigger: "blur"
          },
          {
            validator: checkMoney
          }
        ],
        attachmentId: [
            {
            required: true,
            message: "请上传凭证",
            trigger: "blur"
          },
        ]
      },
      dialogCreateVisible: false,
      formSearch: {
        // rechargeCode: "",
        // state: "",
        // dateValue: [t, t]
        accountName: "",
        channelCode: "",
        createAtBegin: "",
        createAtEnd: "",
        customCompanyName: "",
        page: 1,
        pageSize: 10,
        state: ''
      },
      dateValue: [t, t],
      orderInfo: "",
      dialogConfirmVisible: false,
      rechargeApplyList: {},
      show: false,
      fileList: [],
      detail: {},
      imageUrl: '',
      attachmentId: '',
      memo: '',
      channelTypes: [],
      attachmentUrl: '',
      calc: '',
      calcServiceFee: '',
      serviceFee: '',
      serviceName: [],
      channlList: [],
      balanceAccountId: '',
      suggest: ''
    };
  },
  watch: {
    "dialogCreateForm.companyId": function() {
      console.log(this.dialogCreateForm.companyId);
      if (this.dialogCreateForm.companyId) {
        this.$store.dispatch("getProductName", {
          companyId: this.dialogCreateForm.companyId
        });
      }
    },
    'dialogCreateForm.amount': function(a) {
        clearTimeout(this.calc)
        this.calc = setTimeout(() => {
            this.getServiceFee()
        }, 500)
    }
  },
  computed: {
    ...mapGetters({
    //   rechargeApplyList: "rechargeApplyList",
      optionTypes: "optionTypes",
      curServiceCompanies: "curServiceCompanies",
      userInformation: "userInformation",
      productName: "productName",
      customCompanies: "customCompanies"
    })
  },
  mounted() {
    this.setTime()
    this.query()
    this.$store.dispatch("getByTypes", [
      "RechargeOrderStateType",
      "ChannelType",
      "ChannelBelongType"
    ]);
    this.$store.dispatch("getCurServiceCompanies");
    //
    this.$store.dispatch("getCustomCompanies");
  },
  methods: {
    query(a) {
        if(isNaN(a)) {
            a = 1
        }
        this.formSearch.page = a
        console.log(this.formSearch)
        post('/api/balance-web/recharge-order/query-list', this.formSearch).then(data => {
            console.log(data)
            this.rechargeApplyList = data
        })
        // this.$store.dispatch("getRechargeApplyList", this.formSearch);
    },
    sizeChange(a) {
        this.formSearch.pageSize = a
        this.query()
    },
    getDetail(a) {
        this.attachmentId = ''
        this.imageUrl = ''
        this.memo = ''
        get('/api/balance-web/recharge-order/query-detail', {
            orderNo: a.orderNo
        }).then(data => {
            console.log(data)
            this.detail = data
            this.show = true
            this.getChannlList()
        })
    },
    getChannlList() {
        get('/api/balance-web/balance-account/query-balance-account-channel-list', {
            serviceCompanyId: this.detail.serviceCompanyId,
            appId: this.detail.appId,
            bankType: this.detail.channelBusinessType
        }).then(data => {
            this.channlList = data
        })
    },
    getSuggest() {
        this.channlList.forEach(e => {
            if(e.balanceAccountId == this.balanceAccountId) {
                get('/api/balance-web/balance-account/get-avail-balance-info', {
                    balanceAccountId: e.balanceAccountId,
                    payUserId: e.payUserId,
                    paymentThirdType: e.paymentThirdType
                }).then(data => {
                    this.suggest = data
                })
            }
        })
    },
    clearApp() {
        this.dialogCreateForm.appId = ''
        this.dialogCreateForm.channelBusinessType = ''
        this.dialogCreateForm.serviceCompanyId = ''
    },
    getService() {
        get('/api/sysmgr-web/commom/app-service-company-list', {
            appId: this.dialogCreateForm.appId
        }).then(data => {
            console.log(data)
            this.dialogCreateForm.channelBusinessType = ''
            this.dialogCreateForm.serviceCompanyId = ''
            this.serviceName = data
        })
    },
    getChannlType() {
        console.log(this.dialogCreateForm.serviceCompanyId)
        get('/api/balance-web/recharge-order/pre-recharge', {
            appId: this.dialogCreateForm.appId,
            companyId: this.dialogCreateForm.companyId,
            serviceCompanyId: this.dialogCreateForm.serviceCompanyId
        }).then(data => {
            this.channelTypes = data.channelTypes
            this.calcServiceFee = data.calcServiceFee
            this.getServiceFee()
        })
    },
    getServiceFee() {
        var digit = this.dialogCreateForm.amount.toString().split('.')[1]
        if(this.calcServiceFee && this.dialogCreateForm.companyId && this.dialogCreateForm.serviceCompanyId && !isNaN(this.dialogCreateForm.amount) && (!digit || (digit && digit.length <= 2))) {
            get('/api/contract-web/contract/calc-serviceFee', {
                amount: this.dialogCreateForm.amount,
                companyId: this.dialogCreateForm.companyId,
                serviceCompanyId: this.dialogCreateForm.serviceCompanyId
            }).then(data => {
                this.serviceFee = data
            })
        }
    },
    getImg(a) {
      this.imageUrl = URL.createObjectURL(a.raw);
      var formData = new FormData()
      formData.append('targetType', 'recharge_voucher_img')
      formData.append('fileName', a.name)
      formData.append('file', a.raw)
      importPost('/api/sysmgr-web/file/upload', formData).then(data => {
        this.attachmentId = data.referId
      })
    },
    getAttachment(a) {
      this.attachmentUrl = URL.createObjectURL(a.raw);
      var formData = new FormData()
      formData.append('targetType', 'recharge_voucher_img')
      formData.append('fileName', a.name)
      formData.append('file', a.raw)
      importPost('/api/sysmgr-web/file/upload', formData).then(data => {
        this.dialogCreateForm.attachmentId = data.referId
      })
    },
    ensure(state) {
        if(!this.attachmentId && state == 30) {
            this.$message({
                type: 'warning',
                message: '请上传凭证！'
            })
            return
        }
        post("/api/balance-web/recharge-order/approve", {
            attachmentId: this.attachmentId,
            memo: this.memo,
            orderNo: this.detail.orderNo,
            payUserId: this.detail.payUserId,
            state: state
        }).then(
          data => {
            this.attachmentId = ''
            showNotify("success", "操作成功！");
            this.show = false;
            this.query()
          }
        );
    },
    search: function() {
      this.currentPage = 1;
      this.requestAction({
        page: 1,
        pageSize: this.pageSize
      });
    },
    setTime() {
        if(this.dateValue.length) {
            this.formSearch.createAtBegin = this.dateValue[0]
            this.formSearch.createAtEnd = this.dateValue[1]
        }
        else {
            this.formSearch.createAtBegin = ''
            this.formSearch.createAtEnd = ''
        }
        console.log(this.formSearch)
    },
    clear: function() {
      this.$refs["formSearch"].resetFields();
      this.dateValue = [];
      this.setTime()
    //   this.query()
    },
    handleSizeChange(value) {
      this.pageSize = value;
      this.currentPage = 1;
      this.requestAction({ page: this.currentPage, pageSize: value });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      this.requestAction({
        page: value,
        pageSize: this.pageSize
      });
    },
    requestAction: function(pageInfo) {
      let startTime = "";
      let endTime = "";
      if (this.formSearch.dateValue) {
        startTime = formatTime(this.formSearch.dateValue[0], "yyyy-MM-dd");
        endTime = formatTime(this.formSearch.dateValue[1], "yyyy-MM-dd");
      }
      let param = {
        createAtBegin: startTime,
        createAtEnd: endTime,
        page: pageInfo.page,
        pageSize: pageInfo.pageSize
      };
      param = _.assign(param, this.formSearch);
      this.$store.dispatch("getRechargeApplyList", param);
    },
    receiveMoney(orderNo) {
      showConfirm({
        title: "提示",
        msg: "确定已到账吗？",
        confirmCallback: () => {
          post("/api/balance-web/recharge-order/approve", {
            orderNo: orderNo,
            state: 30
          }).then(data => {
            showNotify("success", "操作成功！");
            this.search();
          });
        }
      });
    },
    unReceiveMoney(orderNo) {
      showConfirm({
        title: "提示",
        msg: "确定未到账吗？",
        confirmCallback: () => {
          post("/api/balance-web/recharge-order/approve", {
            orderNo: orderNo,
            state: 40
          }).then(data => {
            showNotify("success", "操作成功！");
            this.search();
          });
        }
      });
    },
    submitDialogCreateForm() {
        console.log(this.dialogCreateForm)
      this.$refs["dialogCreateForm"].validate(valid => {
        if (valid) {
          post("/api/balance-web/recharge-order/comfirm", this.dialogCreateForm).then(data => {
            // showNotify('success','操作成功！')
            this.$refs["dialogCreateForm"].resetFields();
            this.orderInfo = data;
            this.attachmentUrl = ''
            this.attachmentId = ''
            this.calcServiceFee = false
            this.dialogCreateVisible = false;
            // this.dialogConfirmVisible = true;
            this.query()
          });
        }
      });
    },
    closeEditDialog(next) {
      this.attachmentUrl = ''
      this.$refs["dialogCreateForm"].resetFields();
      next();
    },
    submitConfirmOrder() {
      post("/api/balance-web/recharge-order/comfirm", this.orderInfo).then(
        data => {
          showNotify("success", "操作成功！");
          this.dialogConfirmVisible = false;
          this.search();
        }
      );
    }
  }
};
</script>

<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  background: #FCFCFC;
  border: 1px solid #CCCCCC;
  margin-top: 8px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
  margin: auto;
}
.title {
    font-weight: bold;
    margin-bottom: 15px;
}
.det {
    margin-bottom: 10px;
    padding-left: 20px;
}
.voucher {
    position: absolute;
    top: 75px;
    right: 50px;
}
.upload {
    position: relative;
    top: -5px;
    display: inline-block;
}
</style>