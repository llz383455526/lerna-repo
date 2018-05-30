<template>
  <div class="r_main">
      <el-breadcrumb>
          <el-breadcrumb-item>
              支付验证记录-白名单
          </el-breadcrumb-item>
      </el-breadcrumb>
      <el-form class="form" :model="form" :inline="true" label-width="100px">
          <el-form-item label="应用名称">
              <el-input v-model="form.extrSystemName" class="in_input"></el-input>
          </el-form-item>
          <el-form-item label="授权号">
              <el-input v-model="form.authorizationNo" class="in_input"></el-input>
          </el-form-item>
          <el-form-item label="姓名">
              <el-input v-model="form.name" class="in_input"></el-input>
          </el-form-item>
          <el-form-item label="手机号">
              <el-input v-model="form.mobile" class="in_input"></el-input>
          </el-form-item>
          <el-form-item label="验证状态">
              <el-select v-model="form.certState" class="in_input">
                  <el-option value="0" label="未上传"></el-option>
                  <el-option value="1" label="认证失败"></el-option>
                  <el-option value="2" label="认证成功"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="订单号">
              <el-input v-model="form.orderNo" class="in_input"></el-input>
          </el-form-item>
          <el-form-item class="form_foot">
              <el-button type="primary" @click="query">查询</el-button><el-button type="warning" @click="clear">重置</el-button>
          </el-form-item>
      </el-form>
      <el-table class="table" :data="tableData" border="">
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="extrSystemName" label="应用名称"></el-table-column>          
          <el-table-column prop="orderNo" label="订单号"></el-table-column>
          <el-table-column prop="name" label="收款人"></el-table-column>
          <el-table-column prop="payAccount" label="收款账号"></el-table-column>
          <el-table-column label="支付金额">
              <template slot-scope="scope">
                  {{scope.row.amount | formatMoney}}
              </template>
          </el-table-column>
          <el-table-column label="手机号码">
              <template slot-scope="scope">
                  {{scope.row.mobile || '暂无'}}
              </template>
          </el-table-column>
          <el-table-column label="身份证号码">
              <template slot-scope="scope">
                  {{scope.row.idcard || '暂无'}}
              </template>
          </el-table-column>
          <el-table-column label="请求时间">
              <template slot-scope="scope">
                  {{scope.row.time | formatTime}}
              </template>
          </el-table-column>
          <el-table-column prop="certStateDesc" label="验证状态"></el-table-column>
          <el-table-column prop="authorizationNo" label="授权号"></el-table-column>
      </el-table>
      <div class="page" v-show="total / form.pageSize > 1">
          <el-pagination
          background
          layout="prev, pager, next"
          :page-size="form.pageSize"
          :total="total"
          @current-change="query"
          :currentPage="form.pageNo"
          >
        </el-pagination>
      </div>
      <el-dialog title="已开发票" :visible.sync="ashow" width="70%">
        <div class="half">
            <span>申请编号： {{invoiceData.orderNo}}</span>
            <span>申请时间： {{invoiceData.createTime | formatTime}}</span>
        </div>
        <div class="half">
            <span>开票名称： {{invoiceData.customCompanyName}}</span>
            <span>纳税人识别号： {{invoiceData.taxCode}}</span>
        </div>
        <div class="half">
            <span>开户行： {{invoiceData.customBankName}}</span>
            <span>银行账号： {{invoiceData.customBankAccount}}</span>
        </div>
        <div class="half">
            <span>地址： {{invoiceData.customAddr}}</span>
            <span>电话： {{invoiceData.collectorPhone || '暂无'}}</span>
        </div>
        <div class="half">
            <span>开票类型： {{invoiceData.invoiceType}}</span>
        </div>
        <el-table class="table" :data="invoiceData.items" border>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="subjectName" label="开票类目"></el-table-column>
          <el-table-column prop="amount" label="开票金额"></el-table-column>
          <el-table-column prop="serviceCompanyName" label="开票公司"></el-table-column>
          <el-table-column prop="paperStatusName" label="状态"></el-table-column>
          <el-table-column prop="invoiceCode" label="发票代码"></el-table-column>
          <el-table-column prop="invoiceNo" label="发票号码"></el-table-column>
        </el-table>
        <span slot="footer">
            <el-button @click="ashow = false" type="primary">关闭</el-button>
        </span>
      </el-dialog>
      <el-dialog title="未开发票" :visible.sync="nshow" width="70%">
        <div class="half">
            <span>申请编号： {{invoiceData.orderNo}}</span>
            <span>申请时间： {{invoiceData.createTime | formatTime}}</span>
        </div>
        <div class="half">
            <span>开票名称： {{invoiceData.customCompanyName}}</span>
            <span>纳税人识别号： {{invoiceData.taxCode}}</span>
        </div>
        <div class="half">
            <span>开户行： {{invoiceData.customBankName}}</span>
            <span>银行账号： {{invoiceData.customBankAccount}}</span>
        </div>
        <div class="half">
            <span>地址： {{invoiceData.customAddr}}</span>
            <span>电话： {{invoiceData.collectorPhone || '暂无'}}</span>   
        </div>
        <div class="half">
            <span>开票类型： {{invoiceData.invoiceType}}</span>
        </div>
        <el-table class="table" @selection-change="select" :data="invoiceData.items" border>
          <el-table-column type="selection"></el-table-column>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="subjectName" label="开票类目"></el-table-column>
          <el-table-column prop="amount" label="开票金额"></el-table-column>
          <el-table-column prop="serviceCompanyName" label="开票公司"></el-table-column>
          <el-table-column prop="paperStatusName" label="状态"></el-table-column>
        </el-table>
        <span slot="footer">
            <el-button @click="make" type="primary">开票</el-button>
        </span>
      </el-dialog>
      <el-dialog title="填写" :visible.sync="eshow" width="70%">
          <el-form :inline="true" label-width="80px">
              <el-form-item label="快递渠道">
                  <el-input class="f_input"></el-input>
              </el-form-item>
              <el-form-item label="快递单号">
                  <el-input class="f_input"></el-input>
              </el-form-item>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="sure" type="primary">确定</el-button>
              <el-button @click="sure" type="warning">取消</el-button>
          </span>
      </el-dialog>
  </div>
</template>
<script>
import { get, post, formPost, postButNoErrorToast } from "../../store/api";
export default {
  data() {
    return {
      companyData: {},
      form: {
        payAccount: '',
        authorizationNo: '',
        name: '',
        mobile: '',
        certStateDesc: '',
        orderNo: '',
        pageNo: 1,
        pageSize: 5
      },
      timeRange: [],
      tableData: [],
      total: 0,
      ashow: false,
      invoiceData: {},
      nshow: false,
      mform: {
          invoiceIds: [],
          orderNo: ''
      },
      eshow: false
    };
  },
  activated() {
      this.query()
  },
  mounted() {
    
  },
  methods: {
      change() {
          console.log(this.timeRange)
          this.form.startAt = this.timeRange[0]
          this.form.endAt = this.timeRange[1]
      },
      query(a) {
          this.form.pageNo = 1
          if(a && !isNaN(a)){
              this.form.pageNo = a
          }
          post('/api/econtract/inner/payauthorizeflows', this.form).then(function(data){
              console.log(data)
              this.tableData = data.data
              this.total = data.total
          }.bind(this))
      },
      clear() {
          this.form = {
              payAccount: '',
              authorizationNo: '',
              name: '',
              mobile: '',
              certStateDesc: '',
              orderNo: '',
              pageNo: 1,
              pageSize: 5
          }
      },
      already(a) {
          console.log(a)
          this.ashow = true
          get('/api/invoice-web/invoice/get-invoice-info', {
              orderNo: a.orderNo,
              paperStatus: 2
          }).then(function(data){
              console.log(data)
              this.invoiceData = data
          }.bind(this))
      },
      not(a){
          console.log(a)
          this.nshow = true
          this.mform.orderNo = a.orderNo
          get('/api/invoice-web/invoice/get-invoice-info', {
              orderNo: a.orderNo,
              paperStatus: 1
          }).then(function(data){
              console.log(data)
              this.invoiceData = data
          }.bind(this))
      },
      select(a) {
          console.log(a)
          this.mform.invoiceIds = []
          a.forEach(function(e){
             this.mform.invoiceIds.push(e.id)
          }, this)
      },
      make(a) {
          if(this.mform.invoiceIds.length){
            post('/api/invoice-web/invoice/open-paper-invoice', this.mform).then(function(data){
                console.log(data)
                this.nshow = false
                this.query()
            }.bind(this))
          }
          else{
              this.$message({
                  type: 'info',
                  message: '请至少选择一项'
              })
          }
      },
      expressage(a) {
          console.log(a)
          this.eshow = true
      },
      sure(e) {
          console.log(e)
      }
  }
};
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
  background-color: #fff;
}
.form {
  margin-top: 20px;
}
.in_input {
  width: 200px;
}
.form_foot {
  display: block;
  padding: 0 0 0 820px;
}
.form_foot button {
  margin: 0 30px 0;
}
.t_head{
  margin: 30px 0;
  font-size: 20px;
  color: #666;
}
.table {
  margin-top: 20px;
}
.page{
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
.half > span{
    display: inline-block;
    width: 40%;
}
.f_input{
    width: 400px;
}
.form_footer > button{
    margin: 0px 30px;
}
</style>
