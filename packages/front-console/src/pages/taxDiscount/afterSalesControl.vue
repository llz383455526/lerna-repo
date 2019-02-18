<template>
    <div class="main-container">
        <div>售后风控报表 （针对承接业务的自由职业者的风险控制）</div>
        <el-table class="mt20" :data="tableList.list">
            <el-table-column label="月份">
                <template slot-scope="scope">
                    {{scope.row.year}}年{{scope.row.month}}月
                </template>
            </el-table-column>
            <el-table-column label="服务公司" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="申请发放人数" prop="applySalaryNum" width="120px"></el-table-column>
            <el-table-column label="风控金额" prop="riskAmount"></el-table-column>
            <el-table-column label="挂起人数" prop="hangNum"></el-table-column>
            <el-table-column label="挂起金额" prop="hangAmount"></el-table-column>
            <el-table-column label="二次审核通过人数" prop="secondVerifySuccessNum"></el-table-column>
            <el-table-column label="二次审核通过金额" prop="secondVerifySuccessAmount"></el-table-column>
            <el-table-column label="二次审核拒绝人数" prop="secondVerifyFailNum"></el-table-column>
            <el-table-column label="二次审核拒绝金额" prop="secondVerifyFailAmount"></el-table-column>
            <el-table-column label="个人不处于合理就业年龄段-被拒人数" prop="ageIllegalFailNum" :render-header="renderHeader" width="180px"></el-table-column>
            <el-table-column label="个人收入不符合行业平均线-被拒人数" prop="incomeAverageIllegalFailNum" :render-header="renderHeader" width="180px"></el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            v-on:handleSizeChange="sizeChange"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
    </div>
</template>
<script>
import {get, post} from '../../store/api'
export default {
    data() {
        return {
            title: {
                10: '18岁（含18岁）< 适合就业年龄 <60岁（含60岁）',
                11: `• 一般行业风控审核金额：单笔超过20万，单月超过50万；
• 文娱传媒及医疗业：单月超过9.3万；
提示：未来将继续客户星级评定和行业平均值细化风控金额；`
            },
            form: {
                page: 1,
                pageSize: 10
            },
            tableList: {}
        }
    },
    mounted() {
        this.query()
    },
    methods: {
        renderHeader(h, data) {
            return h("div", [
                h("span", [data.column.label]),
                h("i", {
                        attrs: {
                            'class': 'el-icon-question',
                            'title': this.title[data.$index]
                        }
                    }
                )
            ])
        },
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post('/api/console-dlv/after-sales-risk/list', this.form).then(data => {
                this.tableList = data
            })
        },
        sizeChange(a) {
            this.form.pageSize = a
            this.query()
        }
    }
}
</script>
<style scoped>
.main-container {
    background-color: #fff;
    padding: 15px;
}
.mt20 {
    margin-top: 20px;
}
</style>
