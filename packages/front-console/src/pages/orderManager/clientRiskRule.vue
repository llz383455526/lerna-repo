<template>
  <div class="main">
    <div class="title">查看客户风控规则</div>
    <el-form class="form" :model="form" :inline="true" size="small" ref="form">
      <el-form-item label="客户名称" prop="customerCompanyId">
        <el-select v-model="form.customerCompanyId" filterable>
          <el-option v-for="e in customList" :key="e.id" :value="e.id" :label="e.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="税优地" prop="taxLandingId">
        <el-select v-model="form.taxLandingId" filterable>
          <el-option v-for="e in taxList" :key="e.id" :value="e.id" :label="e.taxLandingName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="落地公司" prop="serviceCompanyId">
        <el-select v-model="form.serviceCompanyId" filterable>
          <el-option v-for="e in companyList" :key="e.id" :value="e.id" :label="e.name"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="query">查询</el-button>
        <el-button @click="$refs.form.resetFields()">清除</el-button>
      </el-form-item>
    </el-form>
    <el-button size="small" @click="exportFile">导表</el-button>
    <el-table class="table" :data="data.list" border>
      <el-table-column label="客户名称" prop="customerCompanyName"></el-table-column>
      <el-table-column label="税优地" prop="taxLandingName"></el-table-column>
      <el-table-column label="落地公司" prop="serviceCompanyName"></el-table-column>
      <el-table-column label="发放限制规则" width="240px">
        <template slot-scope="scope">
          <template v-if="scope.row.riskRuleStr">
            <div v-for="(e, i) in scope.row.riskRuleStr" :key="i">{{e}}</div>
          </template>
          <div v-else>暂无规则</div>
        </template>
      </el-table-column>
      <el-table-column label="是否为默认规则">
        <template slot-scope="scope">
          {{scope.row.isDefault == 0 ? '否' : '是'}}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" @click="removeRule(scope.row.id)" v-if="scope.row.isDefault == 0 && scope.row.id">移除规则</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ayg-pagination
      v-if="data.total"
      :total="data.total || 0"
      v-on:handleSizeChange="setSize"
      :currentSize="form.pageSize"
      v-on:handleCurrentChange="query"
      :currentPage="form.page">
    </ayg-pagination>
  </div>
</template>
<script>
  import { get, post } from "../../store/api";
  export default {
    data() {
      return {
        form: {
          customerCompanyId: '',
          page: 1,
          pageSize: 10,
          serviceCompanyId: '',
          taxLandingId: ''
        },
        taxList: [],
        companyList: [],
        data: {}
      }
    },
    mounted() {
      get('/api/console-dlv/tax-landing/all-tax-landing').then(data => {
        this.taxList = data;
      })
      get('/api/sysmgr-web/commom/company?companyIdentity=service').then(data => {
        this.companyList = data
      })
      get('/api/sysmgr-web/commom/company?companyIdentity=custom').then(data => {
        this.customList = data
      })
      this.query()
    },
    methods: {
      query(a) {
        if(isNaN(a)) {
          a = 1
        }
        this.form.page = a
        post('/api/console-dlv/risk-rule/get-customer-risk-rule-list', this.form).then(data => {
          this.data = data
        })
      },
      setSize(a) {
        this.form.pageSize = a
        this.query()
      },
      exportFile() {
        let str = ''
        for(let k in this.form) {
          if(str) {
            str += `&${k}=${this.form[k]}`
          }
          else {
            str += `?${k}=${this.form[k]}`
          }
        }
        window.open(`/api/console-dlv/risk-rule/export-customer-risk-rule-list${str}`)
      },
      removeRule(id) {
        get('/api/console-dlv/risk-rule/remove-customer-risk-rule', { id }).then(data => {
          this.$message({
            type: 'success',
            message: '移除规则成功！'
          })
          this.query()
        })
      }
    }
  }
</script>
<style scoped>
  .main {
    padding: 15px;
    margin-top: 15px;
    background-color: #fff;
  }
  .title {
    margin-left: 0px;
  }
  .form {
    margin-top: 30px;
  }
  .table {
    margin-top: 20px;
  }
</style>
