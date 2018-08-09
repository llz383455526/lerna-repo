<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px; position: relative;">
        <div class="plan">
            <div class="phend">
                <span>订单号：{{msg.orderNo}}</span>
                <!-- <span @click="cancel">取消订单</span> -->
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
        <el-steps id="steps" :active="2" align-center size="small">
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
            </el-table>
        </div>
        <div id="result">
            <div class="mtitle">
                发放结果
            </div>
            <el-table :data="result">
                <el-table-column label="总人数" prop="totalCount"></el-table-column>
                <el-table-column label="发放中" prop="procCount">
                    <template slot-scope="scope">
                        {{scope.row.procCount}}笔 {{scope.row.procAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="发放成功" prop="successCount">
                    <template slot-scope="scope">
                        {{scope.row.successCount}}笔 {{scope.row.successAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="发放失败" prop="failCount">
                    <template slot-scope="scope">
                        {{scope.row.failCount}}笔 {{scope.row.failAmount | formatMoney}}
                    </template>
                </el-table-column>
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
                <el-form-item label="发放结果" prop="payState">
                    <el-select v-model="form.payState" filterable size="small">
                        <el-option v-for="e in payOrderState" :value="e.value" :label="e.text"></el-option>
                    </el-select>
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
                <el-table-column label="收款方账号" prop="accountNo"></el-table-column>
                <!-- <el-table-column label="开户行" prop="depositBank"></el-table-column> -->
                <el-table-column label="款项属性备注" prop="fund"></el-table-column>
                <el-table-column label="实发金额">
                    <template slot-scope="scope">
                        {{scope.row.shouldAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="成功发放时间" prop="payRespAt"></el-table-column>
                <el-table-column label="发放结果" prop="payStateName"></el-table-column>
                <el-table-column label="备注" prop="payMsg"></el-table-column>
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
        <!-- <el-dialog title="选择发放委托方" :visible.sync="show">
            <div class="dtitle">发放委托方</div>
            <el-radio v-model="clientId" :label="1">西瓜小视频-爱洋发放</el-radio>
            <el-radio v-model="clientId" :label="2">西瓜小视频-爱皖发放</el-radio>
            <el-radio v-model="clientId" :label="3">大话西游-爱洋发放</el-radio>
            <span slot="footer">
                <el-button size="small">确认</el-button>
                <el-button size="small" @click="show = false">取消</el-button>
            </span>
        </el-dialog> -->
    </div>
</template>
<script>
import {post, get} from '../../store/api'
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
      form: {
          accountName: '',
          idCard: '',
          accountNo: '',
          phone: '',
          orderId: '',
          payState: '',
          page: 1,
          pageSize: 10
      },
      msg: [],
      cost: [],
      result: [],
      detail: [],
      total: 5,
      term: '',
      baseUrl: baseUrl
    //   clientId: 1,
    //   show: false
    };
  },
  computed: {
      ...mapGetters({
          payOrderState: 'payOrderState'
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
      }
  },
  mounted() {
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
    })
    get('/api/console-dlv/company/salary-online-order/salary-order-pay-result', {
        orderId: this.data.id
    }).then(data => {
        this.result = [data]
    })
    this.query()
    this.$store.dispatch('getPayOrderState')
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
    //   cancel() {
    //     post('/api/console-dlv/company/salary-online-order/cancel-salary-order', {
    //         orderId: this.data.id
    //     }).then(data => {
    //         this.$message({
    //             type: 'success',
    //             message: '已成功取消订单！'
    //         })
    //         console.log(data)
    //     })
    //   },
      downList() {
        get('/api/console-dlv/company/salary-online-order/download-pay-item-details', {
          orderId: this.form.orderId
        }).then(data => {
          console.log(data)
        })
      },
      setSize(a) {
        this.form.pageSize = a
        this.query()
      },
      reset(name) {
          this.$refs[name].resetFields('getPayOrderState');
      }
  }
};
</script>
<style scoped>
/* .tip {
        background-color: #fcffe8;
    } */
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
#result {
    padding-bottom: 30px;
}
.dtitle{
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}
</style>
