<template>
  <div class="r_main">
      <el-breadcrumb>
          <el-breadcrumb-item>
              纸票开具
          </el-breadcrumb-item>
      </el-breadcrumb>
      <el-form class="form" :model="form" :inline="true" label-width="100px">
          <el-form-item label="客户名称">
              <el-input v-model="form.customCompanyName" class="in_input" size="small"></el-input>
          </el-form-item>
          <el-form-item label="申请编号">
              <el-input v-model="form.orderNo" class="in_input" size="small"></el-input>
          </el-form-item>
          <el-form-item label="申请日期">
              <el-date-picker
              size="small"
              v-model="timeRange"
              type="daterange"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd"
              ></el-date-picker>
          </el-form-item>
          <el-form-item label="发票类型">
              <el-select v-model="form.invoiceType" class="in_input" size="small">
                  <el-option v-for="item in categoryList" :key="item.value" :label="item.text" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item class="form_foot">
              <el-button type="primary" @click="query" size="small">查询</el-button><el-button @click="clear" size="small">重置</el-button>
          </el-form-item>
      </el-form>
      <div class="t_head">已开发票共计：{{companyData.count}}张，金额共计 {{companyData.amount | formatMoney}}元，税额共计 {{companyData.taxRateAmount | formatMoney}}元，价税合计 {{companyData.taxRateTotalAmount | formatMoney}}元</div>
      <el-table class="table" :data="tableData" border="">
          <el-table-column prop="orderNo" label="申请编号"></el-table-column>
          <el-table-column label="待开">
              <template slot-scope="scope">
                  <el-button type="text" @click="not(scope.row)">{{scope.row.needOpenNum}}</el-button>
              </template>
          </el-table-column>
          <el-table-column label="已开">
              <template slot-scope="scope">
                  <el-button type="text" @click="already(scope.row)">{{scope.row.openedNum}}</el-button>
              </template>
          </el-table-column>
          <el-table-column label="开票中">
              <template slot-scope="scope">
                  <el-button type="text" @click="open(scope.row)">{{scope.row.openingNum}}</el-button>
              </template>
          </el-table-column>
          <el-table-column prop="serviceCompanyName" label="服务商"></el-table-column>
          <el-table-column prop="customCompanyName" label="客户名称"></el-table-column>
          <el-table-column prop="purpose" label="发票用途"></el-table-column>
          <el-table-column label="金额">
              <template slot-scope="scope">
                  {{scope.row.totalAmount | formatMoney}}
              </template>
          </el-table-column>
          <el-table-column prop="invoiceTypeName" label="发票类型">
              <template slot-scope="scope">
                    <div class="bill common" v-if="scope.row.invoiceTypeName.indexOf('普通') > -1">普票</div>
                    <div class="bill special" v-else>专票</div>
                </template>
          </el-table-column>
          <!-- <el-table-column prop="totalNum" label="申请开票数"></el-table-column> -->
          <el-table-column prop="subjectName" label="发票类目"></el-table-column>
          <el-table-column label="操作时间">
              <template slot-scope="scope">
                  {{scope.row.lastTime | formatTime}}
              </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button @click="expressage(scope.row)" type="text">快递单号</el-button>
              </template>
          </el-table-column> -->
      </el-table>
      <el-pagination
          style="float: right; margin-top: 20px;"
          @size-change="setSize"
          @current-change="query"
          :background="true"
          :small="true"
          :current-page="form.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="form.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
      <!-- <div class="page" v-show="total / form.pageSize > 1">
          <el-pagination
          background
          layout="prev, pager, next"
          :page-size="form.pageSize"
          :total="total"
          @current-change="query"
          :currentPage="form.page">
        </el-pagination>
      </div> -->
      <el-dialog title="已开发票" :visible.sync="ashow" width="70%">
        <div class="half">
            <span>申请编号： {{invoiceData.orderNo}}</span>
            <span>申请时间： {{invoiceData.createTime | formatTime}}</span>
        </div>
        <div class="half">
            <span>开票名称： {{invoiceData.customCompanyName}}</span>
            <span>纳税人识别号： {{invoiceData.customTaxIdcd}}</span>
        </div>
        <div class="half">
            <span>开户行： {{invoiceData.customBankName}}</span>
            <span>银行账号： {{invoiceData.customBankAccount}}</span>
        </div>
        <div class="half">
            <span>地址： {{invoiceData.customAddr}}</span>
            <span>电话： {{invoiceData.customPhone || '暂无'}}</span>   
        </div>
        <div class="half">
            <span>开票类型： {{invoiceData.invoiceTypeName}}</span>
        </div>
        <el-table class="table" :data="invoiceData.items" border>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="subjectName" label="开票类目"></el-table-column>
          <el-table-column prop="amount" label="开票金额"></el-table-column>
          <el-table-column prop="serviceCompanyName" label="开票公司"></el-table-column>
          <el-table-column prop="paperStatusName" label="状态"></el-table-column>
          <el-table-column prop="invoiceCode" label="发票代码"></el-table-column>
          <el-table-column prop="invoiceNo" label="发票号码"></el-table-column>
          <el-table-column prop="createByName" label="开票人"></el-table-column>
          <el-table-column prop="createTime" label="开票时间">
              <template slot-scope="scope">
                  {{scope.row.createTime | formatTime}}
              </template>
          </el-table-column>
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
            <span>纳税人识别号： {{invoiceData.customTaxIdcd}}</span>
        </div>
        <div class="half">
            <span>开户行： {{invoiceData.customBankName}}</span>
            <span>银行账号： {{invoiceData.customBankAccount}}</span>
        </div>
        <div class="half">
            <span>地址： {{invoiceData.customAddr}}</span>
            <span>电话： {{invoiceData.customPhone || '暂无'}}</span>   
        </div>
        <div class="half">
            <span>开票类型： {{invoiceData.invoiceTypeName}}</span>
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
        	<el-button @click="preview" type="primary">预览</el-button>
            <el-button @click="make" type="primary">开票</el-button>
        </span>
      </el-dialog>
      <el-dialog title="申请中" :visible.sync="oshow" width="70%">
        <div class="half">
            <span>申请编号： {{invoiceData.orderNo}}</span>
            <span>申请时间： {{invoiceData.createTime | formatTime}}</span>
        </div>
        <div class="half">
            <span>开票名称： {{invoiceData.customCompanyName}}</span>
            <span>纳税人识别号： {{invoiceData.customTaxIdcd}}</span>
        </div>
        <div class="half">
            <span>开户行： {{invoiceData.customBankName}}</span>
            <span>银行账号： {{invoiceData.customBankAccount}}</span>
        </div>
        <div class="half">
            <span>地址： {{invoiceData.customAddr}}</span>
            <span>电话： {{invoiceData.customPhone || '暂无'}}</span>   
        </div>
        <div class="half">
            <span>开票类型： {{invoiceData.invoiceTypeName}}</span>
        </div>
        <el-table class="table" @selection-change="select" :data="invoiceData.items" border>
          <!-- <el-table-column type="selection"></el-table-column> -->
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column prop="subjectName" label="开票类目"></el-table-column>
          <el-table-column prop="amount" label="开票金额"></el-table-column>
          <el-table-column prop="serviceCompanyName" label="开票公司"></el-table-column>
          <el-table-column prop="paperStatusName" label="状态"></el-table-column>
        </el-table>
        <!-- <span slot="footer">
            <el-button @click="oshow = false" type="primary">确定</el-button>
        </span> -->
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
    var time = new Date()
    var t = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)}-${time.getDate()}`
    return {
      companyData: {},
      form: {
        customCompanyName: '',
        endAt: '',
        invoiceType: '',
        orderBy: '',
        orderNo: '',
        page: 1,
        pageSize: 10,
        startAt: ''
      },
      timeRange: [t, t],
      categoryList: [],
      tableData: [],
      total: 0,
      ashow: false,
      invoiceData: {},
      nshow: false,
      mform: {
          invoiceIds: [],
          orderNo: ''
      },
      oshow: false,
      eshow: false
    };
  },
  activated() {
      this.query()
  },
  mounted() {
    //  var serviceCompanyId = this.$route.query.serviceCompanyId || 1000
     get('/api/invoice-web/commom/option?enumType=InvoiceType').then(function(data){
         console.log(data)
         this.categoryList = data
     }.bind(this))
    //  get('/api/invoice-web/invoice/opened-paper-invoice-info?serviceCompanyId=' + serviceCompanyId).then(function(data){
    //      console.log(data)
    //      this.companyData = data
    //  }.bind(this))
  },
  methods: {
      query(a) {
          this.form.page = 1
          if(a && !isNaN(a)){
              this.form.page = a
          }
          if(this.timeRange && this.timeRange.length) {
              this.form.startAt = this.timeRange[0]
              this.form.endAt = this.timeRange[1]
          }
          else {
              this.form.startAt = ''
              this.form.endAt = ''
          }
          post('/api/invoice-web/invoice/paper-invoice-list', this.form).then(function(data){
              console.log(data)
              this.tableData = data.list
              this.total = data.total
          }.bind(this))
          post('/api/invoice-web/invoice/sum-paper-invoice-list', this.form).then(function(data){
              console.log(data)
              this.companyData = data
          }.bind(this))
      },
      setSize(a) {
          this.form.pageSize = a
          this.query()
      },
      clear() {
          this.form = {
            customCompanyName: '',
            endAt: '',
            invoiceType: '',
            orderBy: '',
            orderNo: '',
            page: 1,
            pageSize: this.form.pageSize,
            startAt: ''
        }
        this.timeRange = []
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
      open(a){
          this.oshow = true
          this.mform.orderNo = a.orderNo
          get('/api/invoice-web/invoice/get-invoice-info', {
              orderNo: a.orderNo,
              paperStatus: 3
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
                this.$message({
                    type: 'success',
                    message: '开票成功！'
                })
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
      preview(a) {
      	  let url = '/api/invoice-web/invoice/open-paper-preview';
      	  let length = this.mform.invoiceIds.length;
          if(length){
	        for (let i = 0; i < length; i++) {
	        	get(url+"?invoiceId="+this.mform.invoiceIds[i]).then(data => {
	         		let newWindow = window.open();
               		newWindow.location.href = data;
            	});
	        }
          }else{
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
  overflow: hidden;
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
</style>