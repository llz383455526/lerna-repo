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
        <div id="steps">
            <template v-if="msg.signState === '-1'">
                <el-steps :active="3" align-center size="small">
                    <el-step title="支付费用"></el-step>
                    <el-step title="执行发放"></el-step>
                    <el-step title="查看结果"></el-step>
                </el-steps>
            </template>
            <template v-if="msg.signState === '10'">
                <el-steps :active="4" align-center size="small">
                    <el-step title="未发起签约"></el-step>
                    <el-step title="支付费用"></el-step>
                    <el-step title="执行发放"></el-step>
                    <el-step title="查看结果"></el-step>
                </el-steps>
            </template>
            <template v-if="msg.signState === '20'">
                <el-steps :active="4" align-center size="small">
                    <el-step title="已发起签约"></el-step>
                    <el-step title="支付费用"></el-step>
                    <el-step title="执行发放"></el-step>
                    <el-step title="查看结果"></el-step>
                </el-steps>
            </template>
        </div>
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
                <el-table-column label="发放渠道">
                    <template slot-scope="scope">
                        {{scope.row.serviceCompanyName}} - {{scope.row.channelTypeName}}
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div id="result">
            <div class="mtitle">
                发放结果
            </div>
            <el-table :data="result">
                <el-table-column label="总人数" prop="totalCount"></el-table-column>
                <el-table-column label="发放中" prop="procCount"></el-table-column>
                <el-table-column label="发放成功" prop="successCount"></el-table-column>
                <el-table-column label="发放失败" prop="failCount"></el-table-column>
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
                        <el-option v-for="e in payOrderState" :key="e.value" :value="e.value" :label="e.text"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button size="small" type="primary" @click="query">查询</el-button>
                    <el-button size="small" @click="reset('query')">清空所有条件</el-button>
                </el-form-item>
            </el-form>
            <div class="clearfix">
                <a target="_bank" :href="`${baseUrl}/api/console-dlv/company/salary-online-order/download-pay-item-details${term}`">
                    <el-button type="primary" size="small" style="float: right;">导出数据</el-button>
                </a>
                <el-tabs v-model="activeTab" @tab-click="handleStateClick" style="float: left;">
                    <el-tab-pane :label="`全部(${stateStatistics['totalCount']})`" name="all"></el-tab-pane>
                    <el-tab-pane :label="`发放成功(${stateStatistics['successCount']})`" name="30"></el-tab-pane>
                    <el-tab-pane :label="`发放失败(${stateStatistics['failCount']})`" name="40"></el-tab-pane>
                </el-tabs>
            </div>
            <el-button class="mr20" v-if="checkRight(permissions, 'console-dlv:/company/salary-online-order/download-batch-electronic-return') && msg.supportCertificateDownload" type="primary" size="small" style="float: right;" @click="download">导出流水回单</el-button>
            <el-table :data="detail" >
                <el-table-column label="收款方账号名称" prop="accountName"></el-table-column>
                <el-table-column label="身份证" prop="idCard"></el-table-column>
                <el-table-column label="手机号" prop="phone"></el-table-column>
                <el-table-column label="收款方账号" prop="accountNo"></el-table-column>
                <!-- <el-table-column label="开户行" prop="depositBank"></el-table-column> -->
                <el-table-column label="款项属性备注" prop="fund"></el-table-column>
                <el-table-column label="实发金额">
                    <template slot-scope="scope">
                        {{scope.row.shouldAmount | formatMoney}}
                    </template>
                </el-table-column>
                <el-table-column label="成功发放时间" prop="payRespAt"></el-table-column>
                <el-table-column label="签约状态" prop="signMsg" v-if="msg.signState !== '-1'"></el-table-column>
                <el-table-column label="发放结果" prop="payStateName"></el-table-column>
                <el-table-column label="备注" prop="payMsg"></el-table-column>
                <el-table-column label="操作" v-if="checkRight(permissions, 'console-dlv:/company/salary-online-order/download-electronic-return')">
                    <template slot-scope="scope">
                        <el-button v-if="msg.supportCertificateDownload && scope.row.payState == 30" type="text" @click="downloadSalary(scope.row)">下载流水回单</el-button>
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
            <el-dialog title="进度" :visible.sync="showPro" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
                <div class="pro_box">
                    <div :style="{width: `${proNum}%`}"></div>
                </div>
                <div class="pro_num">
                    {{proNum}}%
                </div>
            </el-dialog>
        </div>
        <!-- <div id="list">
            <div>
                <div class="mtitle">订单发放明细表</div>
                <span>[薪酬发放] [{{data.id}}].xls</span>
                <a target="_bank" :href="`${baseUrl}/api/console-dlv/company/salary-online-order/download-pay-item-details?orderId=${form.orderId}`"><el-button type="text">点击下载</el-button></a>
            </div>
            <div>
                <div class="mtitle">原始薪酬明细表</div>
                <span>[薪酬发放] [{{data.id}}].xls</span>
                <a target="_bank" :href="`${baseUrl}/api/console-dlv/company/salary-online-order/download-original-item-details?orderId=${form.orderId}`"><el-button type="text">点击下载</el-button></a>
            </div>
        </div> -->
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
import {post, get, postWithErrorCallback} from '../../store/api'
import { mapGetters } from "vuex"
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
          pageSize: 10,
          signState: ''
      },
      term: '',
      msg: [],
      cost: [],
      result: [],
      detail: [],
      total: '',
      baseUrl: baseUrl,
      showList: ['huaxia', 'hf', 'pingan'],
      key: '',
      showPro: false,
      delay: '',
      proNum: 0,
      frame: '',
      activeTab: 'all',
      stateStatistics: [],
      windowOpener: ''
    };
  },
  computed: {
      ...mapGetters({
          payOrderState: 'payOrderState',
          permissions: 'permissions'
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
      handleStateClick(tab) {
        const { name } = tab
        if (name === 'all') {
            this.form.payState = ''
        } else {
            this.form.payState = name
        }
        this.query()
    },
      query(a) {
        if(isNaN(a)){
            a = 1
        }
        this.form.page = a
        post('/api/console-dlv/company/salary-online-order/query-salary-order-item', this.form).then(data => {
            this.detail = data.list
            this.total = data.total
            this.stateStatistics = data.stateStatistics
        })
      },
      setSize(a) {
        this.form.pageSize = a
        this.query()
      },
      reset(name) {
          this.$refs[name].resetFields();
      },
      download() {
          this.windowOpener = window.open()
          get('/api/console-dlv/company/salary-online-order/download-batch-electronic-return', {
              orderId: this.data.id
          }).then(data => {
              this.key = data
              this.progress()
              this.showPro = true
          })
      },
      downloadSalary(a) {
          this.windowOpener = window.open('')
          get('/api/console-dlv/company/salary-online-order/download-electronic-return', {
              salaryOrderItemId: a.id
          }).then(data => {
              this.key = data
              this.progress()
              this.showPro = true
          })
      },
      progress() {
          this.frame = requestAnimationFrame(this.progress)
          var currTime = new Date().getTime()
          if(!this.delay || currTime- this.delay > 1000) {
              this.delay = currTime
              post(`/api/console-dlv/file/download-progress?key=${this.key}`, {}, true).then(data => {
                if(data) {
                    if(data.state == 30) {
                        this.$message({
                            type: 'success',
                            message: '下载成功'
                        })
                        this.showPro = false
                        cancelAnimationFrame(this.frame)
                        this.windowOpener.location.href = `/api/sysmgr-web/file/download?downloadCode=${data.downloadCode}`
                    }
                    if(data.state == 40) {
                        this.$message({
                            type: 'error',
                            message: '下载失败'
                        })
                        this.showPro = false
                        cancelAnimationFrame(this.frame)
                    }
                    this.proNum = data.progress
                }
              }).catch(err =>{
                  this.showPro = false
                  cancelAnimationFrame(this.frame)
              })
          }
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
.dtitle {
  font-size: 16px;
  color: #333;
  margin-bottom: 20px;
}
#list {
  display: flex;
  margin-top: 20px;
}
#list > div {
  width: 50%;
  font-size: 14px;
  color: #999;
  /* padding-left: 10px; */
  padding-bottom: 20px;
  box-sizing: border-box;
}
#list .mtitle {
  margin-bottom: 20px;
}
#list span {
    margin-right: 15px;
}
.mr20 {
    margin-right: 20px;
}
.pro_box {
    display: inline-block;
    width: calc(100% - 50px);
    height: 20px;
    background-color: #ccc;
    border-radius: 10px;
    overflow: hidden;
}
.pro_box > div {
    background-color: #0283fb;
    width: 0%;
    height: 100%;
    border-radius: 10px;
}
.pro_num {
    position: relative;
    top: -5px;
    margin-left: 5px;
    display: inline-block;
    width: 36px;
    font-size: 14px;
    color: #606266;
}
</style>
