<template>
  <div class="r_main">
      <el-form :inline="true" label-width="80px">
          <el-form-item label="客户名称">
              <el-input v-model="form.customCompanyName" class="in_input" placeholder="请输入名称"></el-input>
          </el-form-item>
          <el-form-item label="发票类型">
              <el-select v-model="form.invoiceType" class="in_input">
                  <el-option v-for="item in categoryList" :key="item.value" :label="item.text" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="欠票金额">
              <el-input v-model="form.amountStart" placeholder="最小值" class="in_input"></el-input> - <el-input v-model="form.amountEnd" placeholder="最大值" class="in_input"></el-input>
          </el-form-item>
          <el-form-item class="form_foot">
              <el-button type="primary" @click="query">查询</el-button><el-button type="warning" @click="clear">清除</el-button>
          </el-form-item>
      </el-form>
      <div class="form_head">欠票列表</div>
      <el-table class="table" :data="tableData" border>
          <el-table-column type="index" label="序号"></el-table-column>
          <el-table-column label="操作" width="120">
              <template slot-scope="scope">
                  <el-button type="text" @click="detail(scope.row)">欠票详细记录</el-button>
              </template>
          </el-table-column>
          <el-table-column prop="customCompanyName" label="客户名称"></el-table-column>
          <el-table-column label="欠票金额合计">
              <template slot-scope="scope">
                  {{(scope.row.totalAmount - 0).toFixed(2)}}
              </template>
          </el-table-column>
          <el-table-column prop="invoiceTypeName" label="发票类型"></el-table-column>
          <el-table-column prop="serviceCompanyName" label="开票企业"></el-table-column>
          <el-table-column label="更新时间">
              <template slot-scope="scope">
                  {{scope.row.lastTime | formatTime}}
              </template>
          </el-table-column>
      </el-table>
      <div class="page" v-show="total / form.pageSize > 1">
          <el-pagination
          background
          layout="prev, pager, next"
          :page-size="form.pageSize"
          :total="total"
          @current-change="query"
          :currentPage="form.page"
          >
        </el-pagination>
      </div>
    <el-dialog title="历史欠票" :visible.sync="show">
        <div>客户名称： {{dForm.customCompanyName}}</div>
        <div>发票类型： {{dForm.invoiceTypeName}}</div>
        <el-table class="table" :data="dtData" border>
            <el-table-column prop="subjectName" label="发票类目名"></el-table-column>
            <el-table-column prop="amount" label="单价（含税）"></el-table-column>
            <el-table-column label="税率">
                <template slot-scope="scope">
                    {{scope.row.taxRate + '%'}}
                </template>
            </el-table-column>
            <el-table-column label="欠票日期（审批后日期）">
                <template slot-scope="scope">
                    {{scope.row.createTime | formatTime}}
                </template>
            </el-table-column>
            <el-table-column prop="statusName" label="状态"></el-table-column>
            <el-table-column prop="remark" label="发票用途"></el-table-column>
        </el-table>
        <div class="dpage">
          欠票记录{{rows}}条，累计欠票金额合计： {{totalMoney}}元
          <el-pagination v-show="dtotal / dForm.pageSize  > 1" style="float: right"
          background
          layout="prev, pager, next"
          :page-size="dForm.pageSize"
          :total="dtotal"
          @current-change="dquery"
          :currentPage="dForm.page"
          >
          </el-pagination>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import { get, post, formPost, postButNoErrorToast } from "../../store/api";
export default {
  data() {
      return {
          form: {
              customCompanyName: '',
              invoiceType: '',
              amountStart: '',
              amountEnd: '',
              page: 1,
              pageSize: 5
          },
          tableData: [],
          total: 0,
          categoryList: [],
          show: false,
          dForm: {
              customCompanyId: '',
              serviceCompanyId: '',
              invoiceType: '',
              statusList: [0, 1],
              page: 1,
              pageSize: 5
          },
          dtData: [],
          dtotal: 0,
          rows: 0,
          totalMoney: 0
      }
  },
  activated() {
      this.query()
  },
  mounted() {
      get('/api/invoice-web/commom/option?enumType=InvoiceType').then(function(data){
          console.log(data)
          this.categoryList = data
      }.bind(this))
  },
  methods: {
      query(a) {
          this.form.page = 1
          if(a && !isNaN(a)){
              this.form.page = a
          }
          if(!isNaN(this.form.amountStart) && !isNaN(this.form.amountEnd) && this.form.amountStart > this.form.amountEnd){
              this.form.amountStart = this.form.amountStart + this.form.amountEnd
              this.form.amountEnd = this.form.amountStart - this.form.amountEnd
              this.form.amountStart = this.form.amountStart - this.form.amountEnd
          }
          post('/api/invoice-web/invoice/debt-invoice-list', this.form).then(function(data){
              console.log(data)
              this.tableData = data.list
              this.total = data.total
          }.bind(this))
      },
      detail(e) {
          this.show = true
          console.log(e)
          this.dForm.customCompanyId = e.customCompanyId
          this.dForm.customCompanyName = e.customCompanyName
          this.dForm.invoiceType = e.invoiceType
          this.dForm.invoiceTypeName = e.invoiceTypeName
          this.dForm.serviceCompanyId = e.serviceCompanyId
          this.dquery()
      },
      clear() {
          this.form.customCompanyName = ''
          this.form.invoiceType = ''
          this.form.amountStart = ''
          this.form.amountEnd = ''
      },
      dquery(a) {
          this.dForm.page = 1
          if(a && !isNaN(a)){
              this.dForm.page = a
          }
          post('/api/invoice-web/invoice/history-debt-invoice-items', this.dForm).then(function(data){
              console.log(data)
              this.dtData = data.list
              this.rows = data.total
              this.dtotal = data.total
          }.bind(this))
          post('/api/invoice-web/invoice/history-debt-invoice-info', {
              customCompanyId: this.dForm.customCompanyId,
              serviceCompanyId: this.dForm.serviceCompanyId
          }).then(function(data){
              console.log(data)
              this.totalMoney = data.totalAmount
          }.bind(this))
      }
  }
}
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
  background-color: #fff;
}
.form {
  margin-top: 20px;
}

.in_input{
    width: 200px;
}
.form_foot {
  display: block;
  padding: 50px 0 0 820px;
}
.form_foot button {
  margin: 0 30px 0;
}
.form_head {
  margin-top: 20px;
  font-size: 24px;
  color: #333;
}
.table {
  margin-top: 20px;
}
.page{
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
.dpage{
    margin-top: 30px;
}
</style>

