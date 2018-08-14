<template>
    <div class="company-build-container company-container">
        <div class="title">{{data.appName}}账户余额明细（{{data.companyName}}）</div>
        <div class="collect">
            <div>
                <span>总余额（元）</span>
                <span>{{data.totalAvailBalance | formatMoney}}</span>
            </div>
            <div>
                <span>银行卡余额（元）</span>
                <span>{{data.bankAvailBalance | formatMoney}}</span>
            </div>
            <div>
                <span>支付宝余额（元）</span>
                <span>{{data.alipayAvailBalance | formatMoney}}</span>
            </div>
            <div>
                <span>微信余额（元）</span>
                <span>{{data.wxAvailBalance	 | formatMoney}}</span>
            </div>
        </div>
        <el-table v-if="data.list" :data="data.list">
            <el-table-column label="业务类型" prop="bankType"></el-table-column>
            <el-table-column label="渠道别名" prop="channelAlias"></el-table-column>
            <el-table-column label="渠道类型" prop="paymentThirdType"></el-table-column>
            <el-table-column label="关键标识">
                <template slot-scope="scope">
                    <div>登录账号：{{scope.row.channelLoginAcctNo}}</div>
                    <div>商户号：{{scope.row.channelMerCustId}}</div>
                </template>
            </el-table-column>
            <el-table-column label="余额">
                <template slot-scope="scope">
                    {{scope.row.totalAvailBalance | formatMoney}}
                </template>
            </el-table-column>
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
export default {
    data() {
        return {
            form: {
                appId: '',
                companyId: '',
                page: 1,
                pageSize: 10,
                serviceCompanyId: ''
            },
            total: 0,
            msg: {},
            data: {}
        }
    },
    mounted() {
        this.msg = JSON.parse(sessionStorage.getItem('clientDetail'))
        for(var k in this.form) {
            if(this.msg[k]) {
                this.form[k] = this.msg[k]
            }
        }
        this.query()
    },
    methods: {
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post('/api/balance-web/balance-account/query-app-balance-account-detail', this.form).then(data => {
                this.data = data
            })
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        }
    }
}
</script>
<style scoped>
.title {
    margin-bottom: 20px;
}
.collect {
    display: flex;
    justify-content: space-around;
    margin-bottom: 20px;
}
.collect > div > span{
    display: block;
}
</style>
