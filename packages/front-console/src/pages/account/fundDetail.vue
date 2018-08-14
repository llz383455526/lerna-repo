<template>
    <div class="company-build-container company-container">
        <div>资金明细</div>
        <el-form :model="form" :inline="true">
            <el-form-item label="企业">
                <el-input size="small" v-model="form.companyId"></el-input>
            </el-form-item>
            <el-form-item label="商户">
                <el-input size="small" v-model="form.serviceCompanyId"></el-input>
            </el-form-item>
            <el-form-item label="操作">
                <el-input size="small" v-model="form.bizTradeName"></el-input>
            </el-form-item>
            <el-form-item label="完成时间">
                <el-date-picker size="small" v-model="dateValue" type="dateRange" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="query">查询</el-button>
                <el-button size="small">清除</el-button>
                <el-button size="small">导出</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="[]">
            <el-table-column label="关联订单号"></el-table-column>
            <el-table-column label="商户"></el-table-column>
            <el-table-column label="企业"></el-table-column>
            <el-table-column label="服务商"></el-table-column>
            <el-table-column label="渠道"></el-table-column>
            <el-table-column label="支付账号"></el-table-column>
            <el-table-column label="金额"></el-table-column>
            <el-table-column label="操作"></el-table-column>
            <el-table-column label="完成时间"></el-table-column>
        </el-table>
        <ayg-pagination
            :total="total"
            :currentPage="form.page"
            v-on:handleSizeChange="setSize"
            v-on:handleCurrentChange="query">
        </ayg-pagination>
    </div>
</template>
<script>
import { post, get } from "../../store/api";
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
        serviceCompanyId: ""
      },
      dateRange: [],
      total: 0
    };
  },
  mounted() {
      this.query()
  },
  methods: {
      query(a) {
          if(isNaN(a)) {
              a = 1
          }
          this.form.page = a
          post('/api/balance-web/balance-account/query-fund', this.form).then(data => {
              console.log(data)
          })
      },
      setSize(a) {
          this.form.pageSize = a
          this.query()
      },
      getTime() {
          if(this.dateRange.length) {
              this.form.createAtBegin = this.dateRange[0]
              this.form.createAtEnd = this.dateRange[1]
          }
      }
  }
};
</script>
