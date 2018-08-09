<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px; position: relative;">
      <!-- <div class="tip">
            <div>
                新增订单成功，服务商会在订单生成的当天内审核受理订单，审核成功后将会短信通知您，请您耐心等待，谢谢！
            </div>
            <div>如果您有任何疑问或紧急事项，请及时联系爱员工客服，联系电话：020-37127695。</div>
            <el-button size="small">
                <router-link to="/main/reconciliationCenter/orderManager" tag="span">返回订单管理</router-link>
            </el-button>
        </div> -->
        <div class="plan">
            <div class="phend">
                <span>订单号：{{msg.orderNo}}</span>
                <span @click="cancel">取消订单</span>
            </div>
            <div class="pstatus">
                {{msg.stateName}}
            </div>
            <div class="ptip">
                {{msg.productTypeName}}
            </div>
            <div class="pcreate">
                {{msg.createByName}} 创建于 {{msg.createAt}}
            </div>
        </div>
        <el-steps id="steps" :active="1" align-center size="small">
            <el-step title="支付费用"></el-step>
            <el-step title="执行发放"></el-step>
            <el-step title="查看结果"></el-step>
        </el-steps>
        <div id="orderCost">
            <div class="mtitle">
                订单费用
            </div>
            <el-table :data="cost">
                <el-table-column label="订单金额">
                    <template slot-scope="scope">
                      <span style="color: red;">{{scope.row.totalFee | formatMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="人数" prop="totalCount"></el-table-column>
                <el-table-column label="实发金额">
                    <template slot-scope="scope">
                        {{scope.row.realAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="服务费" v-if="cost[0] && cost[0].serviceFee">
                    <template slot-scope="scope">
                        {{scope.row.serviceFee | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="发放委托方" prop="appName"></el-table-column>
                <!-- <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="show = true">修改</el-button>
                    </template>
                </el-table-column> -->
            </el-table>
        </div>
        <div id="detail">
            <div class="mtitle">
                发放明细
            </div>
            <el-form :model="form" :inline="true" style="padding-left: 35px;padding: 10px 0 10px 35px;" label-width="120px;" ref="query">
                <el-form-item label="收款方账号名称：" prop="accountName">
                    <el-input v-model="form.accountName" size="small"></el-input>
                </el-form-item>
                <el-form-item label="身份证号：" prop="idCard">
                    <el-input v-model="form.idCard" size="small"></el-input>
                </el-form-item>
                <el-form-item label="银行卡号：" prop="accountNo">
                    <el-input v-model="form.accountNo" size="small"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="phone">
                    <el-input v-model="form.phone" size="small"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="query">查询</el-button>
                    <el-button size="small" @click="reset('query')">清空所有条件</el-button>
                </el-form-item>
            </el-form>
            <a target="_bank" :href="`${baseUrl}/api/console-dlv/company/salary-online-order/download-pay-item-details${term}`"><el-button type="primary" size="small" style="float: right;">导出数据</el-button></a>
            <el-table :data="detail" >
                <el-table-column label="收款方账号名称" prop="accountName"></el-table-column>
                <el-table-column label="身份证" prop="idCard"></el-table-column>
                <el-table-column label="手机号" prop="phone"></el-table-column>
                <el-table-column label="收款方账号" prop="accountNo"></el-table-column>
                <!-- <el-table-column label="开户行" prop="depositBank"></el-table-column> -->
                <el-table-column label="款项属性备注" prop="fund"></el-table-column>
                <!-- <el-table-column label="外籍人员信息备注" prop="foreignNationality"></el-table-column> -->
                <el-table-column label="实发金额">
                    <template slot-scope="scope">
                        {{scope.row.shouldAmount | formatMoney}}
                    </template>
                </el-table-column>
            </el-table>
            <ayg-pagination
                v-if="total"
                :total="total"
                v-on:handleSizeChange="setSize"
                :currentSize="form.pageSize"
                v-on:handleCurrentChange="query"
                :currentPage="form.page">
            </ayg-pagination>
        </div>
        <!-- <div id="pay">
            <div>
                <span>账户余额：<span class="red" v-if="balance.availBalance || balance.availBalance === 0">{{balance.availBalance.toFixed(2)}}</span>元</span>
                <el-button type="text" @click="getBalance">刷新余额</el-button>
                <div v-if="cost.length && (balance.availBalance || balance.availBalance === 0) && cost[0].totalFee > balance.availBalance" style="display: inline-block; padding: 0 40px">余额不足，请充值</div>
                <span class="client" v-if="cost[0]">发放委托方： {{cost[0].appName}}</span>
            </div>
            <div>
                <el-button type="primary" v-if="cost.length && (balance.availBalance || balance.availBalance === 0) && cost[0].totalFee > balance.availBalance" @click="recharge">充值</el-button>
                <el-button type="primary" v-else @click="getAccredit">支付费用</el-button>
                <router-link to="/main/reconciliationCenter/orderManager" tag="span"><el-button>取消</el-button></router-link>
            </div>
        </div> -->
        <!-- <div id="explain" v-if="cost.length && (balance.availBalance || balance.availBalance === 0) && cost[0].totalFee > balance.availBalance">
            <div>服务说明：</div>
            <div>
                <span>
                    1、如果您已经通过充值转账到您的专用账户，系统将自动检查更新该账户余额，当您的账户余额足够支付订单金额时，您即可点击“立即发放”按钮进行费用发放。
                </span>
                <span>
                    2、由于银行对对公转账的相关限制，转账可能无法实时到账，如需按时发放请提前做好相关工作准备。
                </span>
                <span>
                    如果您有任何疑问或紧急事项，请及时联系爱员工客服，联系电话：020-37127695。
                </span>
            </div>
        </div> -->
        <!-- <el-dialog title="选择发放委托方" :visible.sync="show">
            <div class="dtitle">发放委托方</div>
            <el-radio v-model="client" v-for="e in clientList" :key="e.value" :label="e.value">{{e.text}}</el-radio>
            <span slot="footer">
                <el-button size="small" @click="changeClient">确认</el-button>
                <el-button size="small" @click="show = false">取消</el-button>
            </span>
        </el-dialog> -->
        <!-- <el-dialog title="获取验证码" :visible.sync="cshow" width="70%">
          <span class="tip">为了保障您的账号安全，请完成一下身份验证。</span>
          <el-form label-width="150px">
              <el-form-item label="手机号码：">
                  {{phone}}
              </el-form-item>
              <el-form-item >
                  <img :src="`${baseUrl}/api/sysmgr-web/verify-codes/gen-captcha?req_id=${req_id}`">
                  <el-button type="text" style="margin-left: 30px;" @click="createId">刷新</el-button>
              </el-form-item>
              <el-form-item label="请输入图形中字符：">
                  <el-input v-model="chars" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="短信验证码：">
                  <el-input v-model="phoneCode" style="width: 300px;"></el-input><el-button type="text" style="margin-left: 30px;" @click="getCode">获取验证码</el-button>
              </el-form-item>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="submit" type="primary">提交</el-button>
              <el-button @click="cshow = false" type="warning">关闭</el-button>
          </span>
      </el-dialog> -->
    </div>
</template>
<script>
import {
  get,
  post,
  formPost,
  getButNoErrorToast,
  postWithErrorCallback
} from "../../store/api";
import { mapGetters } from "vuex"
import { setTimeout } from 'timers';
var baseUrl = require("../../config/address.js").baseUrl;
if (!baseUrl) {
  baseUrl = "";
}
export default {
  data() {
    return {
      data: '',
      msg: '',
      form: {
          accountName: '',
          idCard: '',
          accountNo: '',
          phone: '',
          orderId: '',
          page: 1,
          pageSize: 10
      },
      cost: [],
      detail: [],
      total: 5,
      client: {},
      show: false,
      term: '',
      req_id: '',
      phone: '',
      cshow: false,
      currEvent: '',
      authCode: '',
      balance: {},
      baseUrl: baseUrl,
      chars: ''
    };
  },
  computed: {
      ...mapGetters({
          userInformation: 'userInformation',
          clientList: 'clientList'
      })
  },
  watch: {
      form: {
          handler() {
              this.term = ''
              for(var k in this.form) {
                  if(this.form[k]){
                      if(this.term) {
                          this.term += `&${k}=${this.form[k]}`
                      }
                      else {
                          this.term += `?${k}=${this.form[k]}`
                      }
                  }
              }
              console.log(this.term)
          },
          deep: true
      },
      // userInformation() {
      //   if(this.cost.length){
      //     this.getBalance()
      //   }
      // }
  },
  mounted() {
    this.createId();
    this.authCode = localStorage.getItem("authCode");
    this.data = JSON.parse(sessionStorage.getItem('data'))
    this.form.orderId = this.data.id
    get('/api/console-dlv/company/salary-online-order/salary-order-step-detail', {
        orderId: this.data.id
    }).then(data => {
        this.msg = data
    })
    get('/api/console-dlv/company/salary-online-order/salary-order-fee-info', {
        orderId: this.data.id
    }).then(data => {
        this.cost = [data]
        // if(this.userInformation) {
        //   this.getBalance()
        // }
    })
    // this.getPhone();
    this.query()
    this.$store.dispatch('getClientList', {
      orderId: this.data.id
    })
    setTimeout(() => {
      console.log(this.clientList)
    }, 3000)
    // console.log(this.userInformation)
  },
  methods: {
    query(a) {
      if(isNaN(a)){
            a = 1
        }
        this.form.page = a
        post('/api/console-dlv/company/salary-online-order/query-salary-order-item', this.form).then(data => {
            this.detail = data.list
            this.total = data.total
        })
    },
    cancel() {
      post('/api/console-dlv/company/salary-online-order/cancel-salary-order', {
          orderId: this.data.id
      }).then(data => {
          this.$message({
              type: 'success',
              message: '已成功取消订单！'
          })
          console.log(data)
      })
    },
    // changeClient() {
    //   console.log(this.client)
    //   post('/api/console-dlv/company/salary-online-order/update-submited-app-info', {
    //     appId: this.client,
    //     orderId: this.data.id
    //   }).then(data => {
    //     this.$message({
    //       type: 'success',
    //       message: '已成功更改委托方！'
    //     })
    //     this.show = false
    //     this.cost[0].appId = this.client
    //     this.clientList.forEach(e => {
    //       if(e.value == this.client) {
    //         this.cost[0].appName = e.text
    //       }
    //     })
    //     this.getBalance()
    //   })
    // },
    downList() {
      get('/api/console-dlv/company/salary-online-order/download-pay-item-details', {
        orderId: this.form.orderId
      }).then(data => {
        console.log(data)
      })
    },
    setSize(a) {
      this.form.pageSize = a;
      this.query()
    },
    reset(name) {
      this.$refs[name].resetFields();
    },
    getBalance() {
      post('/api/balance-web/balance-account/query-app-account', {
        companyId: this.userInformation.companyId,
        appId: this.cost[0].appId
      }).then(data => {
        console.log(data)
        this.balance = data
      })
    },
    recharge() {
      this.$router.push('/main/reconciliationCenter/rechargeApplication')
    },
    // pay() {
    //   if (this.authCode) { 
    //     console.log(this.curr);
    //     postWithErrorCallback("/api/sysmgr-web/company-app/del-payment-user", {
    //       appId: this.appId,
    //       paymentThirdType: this.curr.thirdPaymentType,
    //       paymentUserId: this.curr.payUserId,
    //       authCode: this.authCode
    //     })
    //       .then(data => {
    //         this.dshow = false;
    //         this.$message({
    //           type: "success",
    //           message: "删除成功"
    //         });
    //         this.query();
    //       })
    //       .catch(err => {
    //         if (err.message == "无效的授权码！") {
    //           this.getAccredit(this.sure);
    //         }
    //       });
    //   } else {
    //     this.getAccredit(this.pay);
    //   }
    // },
    getPhone() {
      getButNoErrorToast("/api/console-dlv/company/salary-online-order/get-two-step-phone", {
        orderId: this.data.id
      }).then(data => {
        this.phone = data;
      });
    },
    guid() {
      function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
      }
      return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
    },
    createId() {
      this.req_id = this.guid();
      console.log(this.req_id);
    },
    getCode() {
      if (this.chars) {
        postWithErrorCallback("/api/console-dlv/company/salary-online-order/get-pay-msgcode", {
          captcha: this.chars,
          orderId: this.data.id,
          reqId: this.req_id
        }).then(data => {
            console.log(data);
            this.$message({
              type: "success",
              message: "验证码已发送，请注意查收"
            });
          })
          .catch(err => {
            this.createId();
          });
      } else {
        this.$message({
          type: "info",
          message: "请正确输入图片中的字符"
        });
      }
    },
    getAccredit(a) {
      if(this.phone){
        this.cshow = true;
        // this.currEvent = a;
      }
      else{
        this.$message({
          type: 'error',
          message: '未绑定手机号码，无法获取权限！'
        })
      }
    },
    submit() {
      if (this.phoneCode) {
        post("/api/console-dlv/company/salary-online-order/pay", {
          orderId: this.data.id,
          verifyCode: this.phoneCode
        }).then(data => {
          this.$message({
            type: "success",
            message: "受理成功"
          })
          this.cshow = false;
          // console.log(data);
          // this.authCode = data;
          // localStorage.setItem("authCode", data);
          // if (this.currEvent && typeof this.currEvent == "function") {
          //   this.currEvent();
          // }
        });
      } else {
        this.$message({
          type: "info",
          message: "请填写验证码后提交"
        });
      }
    }
  }
};
</script>
<style scoped>
.tip > div:nth-child(2) {
  margin-bottom: 20px;
}
.plan {
  width: 300px;
  padding: 20px 15px 35px;
  box-sizing: border-box;
  border: 1px solid rgba(234, 234, 234, 1);
  margin-top: 10px;
}
.phend {
  font-size: 12px;
  color: #666;
}
.phend > span:nth-child(2) {
  float: right;
  cursor: pointer;
}
.pstatus {
  color: #ef5187;
  font-size: 24px;
  margin-top: 35px;
  text-align: center;
}
.ptip {
  font-size: 14px;
  color: #333;
  text-align: center;
  margin-top: 20px;
}
.pcreate {
  font-size: 12px;
  color: #999;
  text-align: center;
  margin-top: 10px;
}
#steps {
  position: absolute;
  top: 110px;
  right: 15px;
  width: calc(100% - 345px);
}
#orderCost {
  padding: 30px 0px;
  box-sizing: border-box;
  /* background-color: #f2f2f2; */
}
.mtitle {
  font-size: 13px;
  color: #333;
  border-left: 4px solid #0283fb;
  height: 16px;
  text-indent: 10px;
}
.dtitle {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}
#pay {
  /* background-color: #999; */
}
#pay > :nth-child(1) {
  height: 80px;
  line-height: 80px;
  background-color: #f2f2f2;
  padding: 0px 30px;
  box-sizing: border-box;
}
#pay > :nth-child(1) > span:nth-child(1){
  color: #333;
  font-size: 18px;
  margin-right: 15px;
}
.red {
  font-size: 28px;
  color: #FF0000;
}
.client {
  float: right;
  padding: 0px 80px;
  box-sizing: border-box;
}
.client::before {
  position: relative;
  top: 15px;
  right: 80px;
  content: '';
  display: inline-block;
  height: 45px;
  border-left: 1px solid #666;
}
#pay > :nth-child(2) {
  background-color: #999;
  padding: 20px 30px;
  box-sizing: border-box;
}
#explain {
    overflow: hidden;
    padding: 30px 0px;
}
#explain > div {
  float: left;
  font-size: 14px;
}
#explain > div:nth-child(1) {
  color: #999;
  text-align: right;
  width: 100px;
}
#explain > div:nth-child(2) {
  color: #333;
  width: calc(100% - 100px);
}
#explain > div:nth-child(2) > span {
  display: block;
  margin-bottom: 20px;
}
#explain > div:nth-child(2) > span:last-child {
  color: #999;
  margin-bottom: 0px;
}
</style>
