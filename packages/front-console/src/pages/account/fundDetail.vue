<template>
    <div class="company-build-container company-container" v-loading="isReady">
        <div class="title">资金明细</div>
        <el-form :model="form" :inline="true" ref="form">
            <el-form-item label="企业" prop="companyId">
                <el-select size="small" filterable v-model="form.companyId">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="e in companys" :value="e.id" :label="e.name" :key="e.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商户" prop="appId">
                <el-select size="small" filterable v-model="form.appId">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="e in apps" :value="e.value" :label="e.text" :key="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务商" prop="serviceCompanyId">
                <el-select size="small" filterable v-model="form.serviceCompanyId">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item, key) in option.serveCompanyList" :key="key" :value="item.id" :label="item.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账户类型" prop="balanceType">
                <el-select size="small" filterable v-model="form.balanceType">
                    <el-option label="全部" value=""></el-option>
                    <el-option :value="1" label="实发账户余额"></el-option>
                    <el-option :value="3" label="服务费账户余额"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="操作" prop="bizTradeName">
                <el-select size="small" filterable v-model="form.bizTradeName">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="e in handles" :value="e.value" :label="e.text" :key="e.value"></el-option>
                </el-select>
                <!-- <el-input size="small" v-model="form.bizTradeName"></el-input> -->
            </el-form-item>
            <el-form-item label="完成时间">
                <el-date-picker
                    size="small"
                    v-model="range"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format='yyyy-MM-dd'
                    @change="getTime">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="query">查询</el-button>
                <el-button size="small" @click="reset">清除</el-button>
                <el-button size="small" @click="exportDetail">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="data.list">
            <el-table-column label="关联订单号" prop="orderNo"></el-table-column>
            <el-table-column label="商户" prop="appName"></el-table-column>
            <el-table-column label="企业" prop="companyName"></el-table-column>
            <el-table-column label="服务商" prop="serviceCompanyName"></el-table-column>
            <!-- <el-table-column label="转包服务商" prop="serviceCompanyName"></el-table-column> -->
            <el-table-column label="渠道" prop="bankTypeName"></el-table-column>
            <!-- <el-table-column label="支付账号" prop="payUserName"></el-table-column> -->
            <el-table-column label="金额" prop="tradeAmount">
                <template slot-scope="scope">
                    ￥{{scope.row.tradeAmount > 0 ? '+' : ''}}{{scope.row.tradeAmount.toFixed(2)}}
                </template>
            </el-table-column>
            <el-table-column label="余额" prop="currentAvailBalance">
                <template slot-scope="scope">
                    {{scope.row.currentAvailBalance | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column label="账户类型" prop="balanceTypeName"></el-table-column>
            <el-table-column label="操作" prop="bizTradeNameName"></el-table-column>
            <el-table-column label="备注" prop="memo"></el-table-column>
            <el-table-column label="完成时间" prop="tradeAtStr"></el-table-column>
        </el-table>
        <ayg-pagination
            :total="data.total"
            :currentPage="form.page"
            v-on:handleSizeChange="setSize"
            v-on:handleCurrentChange="query">
        </ayg-pagination>
    </div>
</template>
<script>
import { post, get } from "../../store/api";
import optionModel from '../../model/option/optionModel.js'
export default {
  data() {
    return {
      form: {
        appId: "",
        balanceType: '',
        bizTradeName: "",
        companyId: "",
        createAtBegin: "",
        createAtEnd: "",
        page: 1,
        pageSize: 10,
        serviceCompanyId: ""
      },
      range: [],
      data: {},
      companys: [],
      apps: [],
      handles: [],
      option: new optionModel(),
      isReady: true
    };
  },
  mounted() {
      get('/api/sysmgr-web/commom/company?companyIdentity=custom').then(data => {
          this.companys = data
      })
      get('/api/sysmgr-web/commom/app-list').then(data => {
          this.apps = data
      })
      get('/api/balance-web/commom/option?enumType=BalanceAppTradeType').then(data => { //1
          this.handles = data
      })
      this.query()
      this.option.getServeCompanyList()
  },
  methods: {
      query(a) {
          if(isNaN(a)) {
              a = 1
          }
          this.form.page = a
          post('/api/balance-web/balance-account/query-fund', this.form).then(data => {
              this.data = data
              this.isReady = false
          })
      },
      setSize(a) {
          this.form.pageSize = a
          this.query()
      },
      reset() {
        //   console.log(this.$refs['form'])
          this.$refs['form'].resetFields()
          this.range = []
          this.form.createAtBegin = ''
          this.form.createAtEnd = ''
      },
      getTime() {
          if(this.range && this.range.length) {
              this.form.createAtBegin = this.range[0]
              this.form.createAtEnd = this.range[1]
          }
          else {
              this.form.createAtBegin = ''
              this.form.createAtEnd = ''
          }
      },
      exportDetail() {
          var str = ''
          for (var k in this.form) {
              if(!str) {
                  str += `?${k}=${this.form[k]}`
              }
              else {
                  str += `&${k}=${this.form[k]}`
              }
          }
          window.open(`/api/balance-web/balance-account/export-fund-list${str}`)
      }
  }
};
</script>
<style scoped>
.title {
    margin-bottom: 20px;
}
</style>
