<template>
    <div class="r_main">
        <el-form :model="form" size="small" :inline="true" ref="form">
            <el-form-item label="统计" prop="statisticsType">
                <el-select v-model="form.statisticsType">
                    <el-option v-for="e in type" :label="e.text" :value="e.value" :key="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="年" prop="year">
                <el-select v-model="form.year">
                    <el-option v-for="e in years" :label="`${e}年`" :value="e" :key="e"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="月" prop="month" v-if="form.statisticsType == 'month'">
                <el-select v-model="form.month">
                    <el-option v-for="e in months" :label="`${e.replace(/^0/, '')}月`" :value="e" :key="e"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="收款方名称" prop="accountName">
                <el-input v-model="form.accountName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="收款方账户" prop="accountNo">
                <el-input v-model="form.accountNo" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="客户公司" prop="customerCompanyName">
                <el-input v-model="form.customerCompanyName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="税优地" prop="taxLandingName">
                <el-input v-model="form.taxLandingName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item label="服务商公司" prop="serviceCompanyName">
                <el-input v-model="form.serviceCompanyName" placeholder="请输入"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <el-button style="float: right;" size="small" type="primary" @click="down">下载导出</el-button>
        <el-table :data="data.list">
            <el-table-column label="排名">
                <template slot-scope="scope">
                    {{scope.$index + 1}}
                </template>
            </el-table-column>
            <el-table-column label="时间" prop="date"></el-table-column>
            <el-table-column label="身份证号" prop="idcd"></el-table-column>
            <el-table-column label="收款方账号" prop="accountNo"></el-table-column>
            <el-table-column label="年收入" prop="yearAmount" v-if="form.statisticsType == 'year'"></el-table-column>
            <el-table-column label="月收入" prop="monthAmount" v-if="form.statisticsType == 'month'"></el-table-column>
            <el-table-column label="客户公司" prop="customCompanyName"></el-table-column>
            <el-table-column label="税优地" prop="taxLandingName"></el-table-column>
            <el-table-column label="服务商公司" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="风控规则">
                <template slot-scope="scope">
                    <div v-for="e in scope.row.riskRuleStrList" :key="e">{{e}}</div>
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <el-pagination
                background
                layout="prev, pager, next"
                :page-size="form.pageSize"
                :total="data.total"
                @current-change="query"
                :currentPage="form.page">
        </el-pagination>
      </div>
    </div>
</template>
<script>
import { get, post } from "../../store/api";
export default {
    data() {
        var currentYear = new Date().getFullYear(), years = [], months = []
        console.log(currentYear)
        for(var i = currentYear - 10; i < currentYear + 10; i++){
            years.push(i)
        }
        for(var i = 1; i < 13; i++) {
            months.push(i > 9 ? i.toString() : '0' + i)
        }
        return {
            form: {
                statisticsType: 'year',
                year: '',
                month: '',
                accountNo: '',
                accountName: '',
                customerCompanyName: '',
                taxLandingName: '',
                serviceCompanyName: '',
                page: 1,
                pageSize: 10
            },
            type: [
                {
                    text: '年收入',
                    value: 'year'
                },
                {
                    text: '月收入',
                    value: 'month'
                }
            ],
            years: years,
            months: months,
            data: {}
        }
    },
    mounted() {
        this.form.year = this.years[10]
        this.query()
    },
    methods: {
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            this.form.statisticsType == 'year' && (this.form.month = '')
            post('/api/console-dlv/tax-landing/user-amount-statistics', this.form).then(data => {
                this.data = data
            })
        },
        reset() {
            this.$refs.form.resetFields()
            this.form.statisticsType = 'years'
            this.form.year = this.years[10]
        },
        down() {
            var str = ''
            for(var k in this.form) {
                if(!str) {
                    str += `?${k}=${this.form[k]}`
                }
                else {
                    str += `&${k}=${this.form[k]}`
                }
            }
            window.open(`/api/console-dlv/tax-landing/download-user-amount-statistics${str}`)
        }
    }
}
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
  background-color: #fff;
}
.page {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
</style>