<template>
    <div v-loading="isReady">
        <el-breadcrumb separator="/" class="w-top-nav">
            <el-breadcrumb-item :to="{ path: '/dashboard' }"><span class="w-link">首页</span></el-breadcrumb-item>
            <el-breadcrumb-item><span class="w-item">资金明细</span></el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <el-form :model="form" :inline="true" ref="form">
                <el-form-item label="企业" prop="companyId">
                    <el-select size="small" class="form_input_short" filterable v-model="form.companyId">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="e in companys" :value="e.id" :label="e.name" :key="e.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="商户" prop="appId">
                    <el-select size="small" class="form_input_short" filterable v-model="form.appId">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="e in apps" :value="e.value" :label="e.text" :key="e.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账户类型" prop="balanceType">
                    <el-select size="small" class="form_input_short" filterable v-model="form.balanceType">
                        <el-option label="全部" value=""></el-option>
                        <el-option :value="1" label="实发账户余额"></el-option>
                        <el-option :value="3" label="服务费账户余额"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="操作" prop="bizTradeName">
                    <el-select size="small" class="form_input_short" filterable v-model="form.bizTradeName">
                        <el-option label="全部" value=""></el-option>
                        <el-option v-for="e in handles" :value="e.value" :label="e.text" :key="e.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="完成时间">
                    <el-date-picker
                        size="small"
				    	class="form_input_short"
                        v-model="form.createAtBegin"
                        type="date"
                        :unlink-panels="true"
                        placeholder="开始时间"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
				    <span class="mid">至</span>
				    <el-date-picker
                        size="small"
				    	class="form_input_short"
                        v-model="form.createAtEnd"
                        type="date"
                        :unlink-panels="true"
                        placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="form_btn40">
                    <el-button size="small" type="primary" @click="query">查询</el-button>
                    <el-button size="small" @click="reset">清除</el-button>
                    <!-- <el-button size="small" @click="exportDetail">导出</el-button> -->
                </el-form-item>
            </el-form>
            <div class="detail_box">
                <!-- <div class="detail_item">
                    <div>已开发票</div>
                    <div>{{0 || 0}}张</div>
                </div> -->
                <div class="detail_item">
                    <div>充值总金额</div>
                    <div>{{amount | formatMoney}}</div>
                </div>
                <!-- <div class="detail_item">
                    <div>税额共计</div>
                    <div>{{0 | formatMoney}}</div>
                </div>
		    	<div class="detail_item">
                    <div>价税合计</div>
                    <div>{{0 | formatMoney}}</div>
                </div> -->
            </div>
        </div>
        <div class="bottom">
            <div class="text-right export-xls">
                <el-button size="small" class="btn" @click="exportDetail"><svg-icon class="svg-icon" icon-class="folder-icon"/> 导出xls</el-button>
      	    </div>
            <el-table :data="data.list" class="custom-table">
                <el-table-column label="关联订单号" prop="orderNo"></el-table-column>
                <el-table-column label="商户" prop="appName"></el-table-column>
                <el-table-column label="企业" prop="companyName"></el-table-column>
                <el-table-column label="服务商" prop="serviceCompanyName"></el-table-column>
                <el-table-column label="渠道" prop="bankTypeName"></el-table-column>
                <el-table-column label="账户类型" prop="balanceTypeName"></el-table-column>
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
                <el-table-column label="操作" prop="bizTradeNameName"></el-table-column>
                <el-table-column label="完成时间" prop="tradeAtStr"></el-table-column>
            </el-table>
            <!-- <ayg-pagination
                :total="data.total"
                :currentPage="form.page"
                v-on:handleSizeChange="setSize"
                v-on:handleCurrentChange="query">
            </ayg-pagination> -->
            <el-pagination
                @size-change="setSize"
                @current-change="query"
                :background="true"
                :small="true"
                :current-page="form.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="form.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="data.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import Ajax from "../ajax/index"
import optionModel from '../model/optionModel.js'
export default {
  data() {
    return {
      form: {
        appId: "",
        bizTradeName: "",
        companyId: "",
        createAtBegin: "",
        createAtEnd: "",
        page: 1,
        pageSize: 10,
        serviceCompanyId: "",
        balanceType: ''
      },
    //   range: [],
      data: {},
      companys: [],
      apps: [],
      handles: [],
      amount: 0,
      option: new optionModel(),
      isReady: true
    };
  },
  mounted() {
      Ajax.get('/api/sysmgr-web/commom/company').then(data => {
          this.companys = data
      })
      Ajax.get('/api/sysmgr-web/commom/app-list').then(data => {
          this.apps = data
      })
      Ajax.get('/api/balance-web/commom/option', {
          enumType: 'BalanceAppTradeType'
      }).then(data => {
          this.handles = data
      })
      this.query()
      this.option.getChannelType();
  },
  methods: {
      query(a) {
          if(isNaN(a)) {
              a = 1
          }
          this.form.page = a
          Ajax.post('/api/balance-web/balance-account/query-app-admin-fund', this.form).then(data => {
              this.data = data
              this.isReady = false
          })
          Ajax.post('/api/balance-web/balance-account/query-recharge-statistics', this.form).then(data => {
              this.amount = data
          })
      },
      setSize(a) {
          this.form.pageSize = a
          this.query()
      },
      reset() {
        //   console.log(this.$refs['form'])
          this.$refs['form'].resetFields()
        //   this.range = []
          this.form.createAtBegin = ''
          this.form.createAtEnd = ''
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
.content {
    background-color: #fff;
    padding: 20px 30px;
    margin-top: 18px;
}
/* .detail_box > div:nth-child(1) {
	background-image: url(../../../image/icon03.png);
} */
.detail_box > div:nth-child(1) {
	background-image: url(../../image/icon05.png);
}
/* .detail_box > div:nth-child(3) {
	background-image: url(../../../image/icon04.png);
}
.detail_box > div:nth-child(4) {
	background-image: url(../../../image/icon01.png);
} */
.detail_item {
	width: calc(25% - 40px);
}
.export-xls {
	margin-bottom: 24px;
}
.bottom {
    position: relative;
    margin-top: 24px;
    background-color: #fff;
    padding: 19px 42px;
}
</style>
