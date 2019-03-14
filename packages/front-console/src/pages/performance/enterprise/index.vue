<template>
  <div class="performance-enterprise">
    <p>企业用工绩效</p>
    <br>
    <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="small">
      <el-form-item label="企业名称">
        <el-select @change="appIdChange" class="inline-input" v-model="searchForm.app" filterable>
          <el-option v-for="e in allAppList" :key="e.companyId" :value="e.companyId" :label="e.companyName"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="落地公司">
        <el-select v-model="searchForm.serviceCompany" placeholder="请选择" filterable>
          <el-option v-for="item in serviceCompanies" :label="item.companyName" :value="item.companyId" :key="item.companyId"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="时间">
        <el-date-picker
          v-model="searchForm.startMonth"
          type="month"
          @change="monthChange"
          placeholder="开始月份">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-date-picker
          v-model="searchForm.endMonth"
          type="month"
          @change="monthChange"
          placeholder="结束月份">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit(true)">查询</el-button>
        <el-button @click="clearBtnClick">清除</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="tableData.arr"
      style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-table
            border
            :data="props.row.perfEndBMonthListVoList"
            style="width: 100%">
            <el-table-column
              prop="codeName"
              header-align="center"
              align="center"
              label="绩效类型">
            </el-table-column>
            <el-table-column
              prop="issuePercent"
              header-align="center"
              align="center"
              width="80"
              label="绩效比例">
            </el-table-column>
            <el-table-column
              prop="amount"
              header-align="center"
              align="center"
              label="实际发放绩效">
            </el-table-column>
            <el-table-column
              prop="extAmount"
              header-align="center"
              align="center"
              label="绩效基数">
            </el-table-column>
            <el-table-column
              prop="kpAmount"
              header-align="center"
              align="center"
              label="绩效金额">
            </el-table-column>
            <el-table-column
              prop="formula"
              align="center"
              header-align="center"
              width="400"
              label="绩效说明">
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column
        prop="customerCompanyName"
        header-align="center"
        align="center"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="serviceCompanyName"
        header-align="center"
        align="center"
        label="落地公司">
      </el-table-column>
      <el-table-column
        prop="month"
        header-align="center"
        align="center"
        label="数据日期">
      </el-table-column>
      <el-table-column
        prop="amount"
        header-align="center"
        align="center"
        label="实际发放绩效">
      </el-table-column>
      <el-table-column
        prop="extAmount"
        header-align="center"
        align="center"
        label="绩效基数">
      </el-table-column>
      <el-table-column
        prop="kpAmount"
        header-align="center"
        align="center"
        label="绩效金额">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        header-align="center"
        align="center"
        label="更新时间">
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="downloadBtnClick(scope.row)" type="text" size="small">下载</el-button>
          <el-button @click="downloadPdf(scope.row)" type="text" size="small">下载结算函</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div style="padding-top: 10px" class="clearfix">
      <el-pagination
        style="float: right;"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="tableData.page"
        :page-sizes="[10, 20, 30]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="tableData.total">
      </el-pagination>
    </div>
    <br> <br> <br>
  </div>
</template>

<script>
  import {get, post, formPost} from "../../../store/api";
  import { DateFormat } from 'yb-tool'
  export default {
    name: "index",
    data() {
      return {
        searchForm: {
          app: '',
          serviceCompany: '',
          startMonth: '',
          endMonth: ''
        },
        tableData: {
          arr: [],
          total: 0,
          page: 1,
          size: 10
        },
        allAppList: [],
        serviceCompanies: []
      }
    },
    methods: {

      onSubmit(again = false) {
        if (again) {
          this.tableData.page = 1
        }
        const endAt = this.searchForm.endMonth ? DateFormat(this.searchForm.endMonth, 'YYYY-MM') : ""
        const startAt = this.searchForm.startMonth ? DateFormat(this.searchForm.startMonth, 'YYYY-MM') : ""
        post('/api/recon/perf/company-month-perf-summing-list', {
          "customerCompanyId": this.searchForm.app,
          "endAt": endAt,
          "page": this.tableData.page,
          "pageSize": this.tableData.size,
          "serviceCompanyId": this.searchForm.serviceCompany,
          "startAt": startAt,
        }).then((data) => {
          this.tableData.arr = data.list;
          this.tableData.total = data.total;
        }).catch(() => {})
      },
      handleSizeChange(size) {
        this.tableData.size = size
        this.onSubmit()
      },
      handleCurrentChange(page) {
        this.tableData.page = page
        this.onSubmit()
      },
      monthChange() {
        if (this.searchForm.startMonth && this.searchForm.endMonth) {
          if (this.searchForm.startMonth.getTime() > this.searchForm.endMonth.getTime()) {
            const time = this.searchForm.startMonth
            this.searchForm.startMonth = this.searchForm.endMonth
            this.searchForm.endMonth = time
          }
        }
      },
      getAllApp() {
        let url = '/api/console-dlv/option/get-option-customer-companies';
        let self = this;
        get(url).then(data => {
          self.allAppList = data;
        })
      },
      appIdChange() {
      },
      getServiceCompany() {
        get('/api/console-dlv/option/get-option-service-companies')
          .then(result => {
            this.serviceCompanies = result
          })
      },
      clearBtnClick() {
        this.searchForm = {
          app: '',
          serviceCompany: '',
          startMonth: '',
          endMonth: ''
        }
      },
      // 下载按钮点击
      downloadBtnClick(e) {
        window.open(`/api/recon/perf/export-month-perf-by-id?id=${e.id}`)
      },
      downloadPdf(e) {
        window.open(`/api/recon/perf/pdf-export-month-perf-by-id?id=${e.id}`)
      }
    },
    mounted() {
      this.getAllApp()
      this.getServiceCompany()
      this.onSubmit()
    }
  }
</script>

<style scoped lang="scss">
  .performance-enterprise {
    background-color: #fff;
    padding: 10px;
  }

</style>
