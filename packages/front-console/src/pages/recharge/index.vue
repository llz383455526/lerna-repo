<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;" v-loading="isReady">
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
            <el-form-item label="处理状态:"   size="small" prop="state" v-if="!riskApprove">
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
            </el-form-item>
            <el-form-item style="margin-top: -4px" :class="`${riskApprove ? 'fr' : ''}`">
                <el-button type="primary" @click="query" size="small">查询</el-button>
                <el-button size="small" @click="clear">重置</el-button>
                <el-button size="small" @click="exportFile" v-if="!riskApprove">导出</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="showRecharge(true, false)" v-if="checkRight(permissions, 'balance-web:/recharge-order/comfirm') && !riskApprove">充值申请</el-button>
        <el-button type="primary" @click="showRecharge(true, true)" v-if="checkRight(permissions, 'balance-web:/recharge-order/serviceFeeConfirm')">服务费充值申请</el-button>
        <statistics-box :data-list="statisticsDataList"></statistics-box>
        <el-table :data="rechargeApplyList.list" style="width: 100%;margin-top: 20px;">
                <el-table-column prop="stateName" label="处理状态" width="100px">
                    <template slot-scope="scope">
                        {{scope.row.stateName}}
                        <template v-if="scope.row.isAutoRecharge && scope.row.state == 21">
                            <div class="red">（风险：打款方“{{scope.row.fromAccountName}}”跟客户企业名称不一致）</div>
                        </template>
                        <template v-if="scope.row.submittingFlat == 1">
                            <div class="red">（流转中）</div>
                        </template>
                    </template>
                </el-table-column>
                <el-table-column prop="companyName" label="充值单号" width="110px">
                    <template slot-scope="scope">
                        <el-button @click="getDetail(scope.row)" type="text">{{scope.row.orderNo}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="申请时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createAt |formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="appName" label="商户名称"></el-table-column>
                <el-table-column prop="companyName" label="公司名称"></el-table-column>
                <el-table-column label="服务商信息" width="200px">
                    <template slot-scope="scope">
                        <div>账户名称：{{scope.row.accountName || scope.row.serviceCompanyName}}</div>
                        <div>开户行：{{scope.row.depositBank}}</div>
                        <div>账号：{{scope.row.accountNo}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="channelBusinessTypeName" label="业务类型">
                    <template slot-scope="scope">
                        {{scope.row.rechargeType != 2 ? scope.row.channelBusinessTypeName : '银行卡'}}
                    </template>
                </el-table-column>
                <el-table-column label="充值渠道" align="center">
                    <template slot-scope="scope">
                        {{scope.row.payUser.thirdPaymentTypeName || "—"}}
                    </template>
                </el-table-column>
                <el-table-column label="充值明细" width="180px">
                    <template slot-scope="scope">
                        <div>收款总金额：{{(scope.row.rechargeType != 2 ? scope.row.amount : 0) + scope.row.serviceFee | formatMoney}}</div>
                        <div>实发金额：{{scope.row.rechargeType != 2 ? scope.row.amount : 0 | formatMoney}}</div>
                        <div>服务费：{{scope.row.serviceFee | formatMoney}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="purpose" label="备注"></el-table-column>
                <el-table-column prop="updateByNme" label="处理人" width="80px"></el-table-column>
                <el-table-column prop="updateAt" label="处理时间" width="100px"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.state == 30 && checkRight(permissions, 'balance-web:/recharge-order/generate-signature')" @click="downloadPdf(scope.row)">发放审核函</el-button>
                    </template>
                </el-table-column>
        </el-table>

        <ayg-pagination 
            v-if="rechargeApplyList.total"
            :total="rechargeApplyList.total"
            :currentPage="formSearch.page"
            v-on:handleSizeChange="sizeChange"
            v-on:handleCurrentChange="query">
        </ayg-pagination>
        <recharge-dialog :submitCb="submitCb" :showStep="true" ref="rechargeDialog"></recharge-dialog>
        <recharge-audit-dialog :auditCb="auditCb" :disable="true" ref="rechargeAuditDialog"></recharge-audit-dialog>
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
import {showLoading, hideLoading} from '../../plugin/utils-loading'
import rechargeDialog from '../../pageComponent/rechargeDialog.vue'
import rechargeAuditDialog from '../../pageComponent/rechargeAuditDialog.vue'
import statisticsBox from '../../component/statisticsBox.vue'
export default {
  name: "credit-bill",
  components: {
      rechargeDialog,
      rechargeAuditDialog,
      statisticsBox
  },
  data() {
    var time = new Date();
    var t = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1) }-${time.getDate()}`
    time = time.getTime() - 1000 * 60 * 60 * 24 * 7
    time = new Date(time);
    var t_0 = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1) }-${time.getDate()}`
    return {
      pageSize: 10,
      currentPage: 1,
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
      dateValue: [t_0, t],
      orderInfo: '',
      rechargeApplyList: {},
      detail: {},
      supUrl: '',
      calc: '',
      channlList: [],
      balanceAccountId: '',
      suggest: '',
      payUserId: '',
      payUserMsg: '',
      subCompany: '',
      subMsg: '',
      riskApprove: '',
      listen: '',
      isService: false,
      acccountList: [],
      isReady: true,
      prevUrl: '',
      statisticsDataList: []
    };
  },
  computed: {
    ...mapGetters({
        optionTypes: "optionTypes",
        curServiceCompanies: "curServiceCompanies",
        userInformation: "userInformation",
        permissions: 'permissions'
    })
  },
  mounted() {
    this.setTime()
    this.$store.dispatch("getByTypes", [
        "RechargeOrderStateType",
        "ChannelType",
        "ChannelBelongType"
    ]);
    this.$store.dispatch("getCurServiceCompanies");
    // this.riskApprove = this.$route.query.riskApprove
    // if(this.riskApprove) {
    //     this.formSearch.state = 21
    //     this.formSearch.isAutoRecharge = 1
    // }
    // this.query()
    this.listenSearch()
    
  },
  beforeDestroy() {
      cancelAnimationFrame(this.listen)
  },
  methods: {
    listenSearch() {
        this.listen = requestAnimationFrame(this.listenSearch)
        if(this.riskApprove != this.$route.query.riskApprove) {
            this.riskApprove = this.$route.query.riskApprove
            if(this.riskApprove) {
                this.formSearch.state = 21
                this.formSearch.isAutoRecharge = 1
            }
            else {
                this.formSearch.state = ''
                delete this.formSearch.isAutoRecharge
            }
            this.query()
        }
    },
    query(a) {
        if(isNaN(a)) {
            a = 1
        }
        this.formSearch.page = a
        post(`/api/balance-web/recharge-order/${this.riskApprove ? 'query-risk-approve-list': 'query-list'}`, this.formSearch).then(data => {
            this.rechargeApplyList = data
            this.isReady = false
            this.statisticsDataList = [
            {
                title: '充值成功总金额',
                type: 1,
                value: data.totalAmount || 0
            }
        ]
        })
        // this.$store.dispatch("getRechargeApplyList", this.formSearch);
    },
    submitCb() {
        this.query()
    },
    auditCb() {
        this.query(this.formSearch.page)
    },
    showRecharge() {
        this.$refs.rechargeDialog.showRecharge(...arguments)
    },
    exportFile() {
        var str = ''
        for(var k in this.formSearch) {
            if(k != 'page' && k != 'pageSize') {
                if(!str) {
                    str += `?${k}=${this.formSearch[k]}`
                }
                else {
                    str += `&${k}=${this.formSearch[k]}`
                }
            }
        }
        location.href = `${baseUrl}/api/balance-web/recharge-order/export-recharge-order-list${str}`
    },
    sizeChange(a) {
        this.formSearch.pageSize = a
        this.query()
    },
    getDetail(a) {
        this.$refs.rechargeAuditDialog.getDetail(a)
    },
    search() {
      this.currentPage = 1;
      this.requestAction({
        page: 1,
        pageSize: this.pageSize
      });
    },
    setTime() {
        if(this.dateValue && this.dateValue.length) {
            this.formSearch.createAtBegin = this.dateValue[0]
            this.formSearch.createAtEnd = this.dateValue[1]
        }
        else {
            this.formSearch.createAtBegin = ''
            this.formSearch.createAtEnd = ''
        }
    },
    clear: function() {
      this.$refs["formSearch"].resetFields();
      this.dateValue = [];
      this.setTime()
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
  }
};
</script>

<style scoped>
.uploadBox {
  width: 140px;
  float: left;
  text-align: center;
  margin-right: 20px;
}
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
}
.avatar {
  position: relative;
  width: 140px;
  height: 140px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
}
.avatar-uploader-icon > div {
  line-height: 20px;
  font-size: 12px;
  margin-top: -32px;
}
.title {
    font-weight: bold;
    margin-bottom: 15px;
}
.det {
    position: relative;
    margin-bottom: 10px;
    padding-left: 20px;
}
.mb35 {
    margin-bottom: 35px;
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
.v-modal {
    z-index: 9999;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 1000px auto;
    background-position: center center;
    transition: all 0.3s;
}
.auto {
    width: auto;
}
.mb0 {
    margin-bottom: 0px;
}
.pad {
    color: #999999;
    padding-left: 96px;
}
.toggle {
    color: #0283fb;
    display: inline-block;
    margin-left: 50px;
    cursor: pointer;
    user-select: none;
}
.tip {
    font-size: 16px;
}
.clear {
    position: absolute;
    bottom: 0px;
}
.auto {
    max-width: 700px;
}
.input-container .label {
    float: left;
}
.mr20 {
    margin-right: 20px;
    cursor: pointer;
}
.ml20 {
  margin-left: 20px;
}
.fr {
    float: right;
    margin-right: 54px;
}
</style>