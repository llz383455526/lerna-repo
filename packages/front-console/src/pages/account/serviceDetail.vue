<template>
    <div class="company-build-container company-container">
        <div class="title">账户余额明细（{{data.serviceCompanyName}}）</div>
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
        <el-tabs v-model="tabName" @tab-click="tab">
            <el-tab-pane label="渠道明细" name="channel">
                <el-table v-if="data.list" :data="data.list">
                    <el-table-column label="子账号名称" prop="payUserName"></el-table-column>
                    <el-table-column label="渠道别名" prop="channelAlias"></el-table-column>
                    <el-table-column label="渠道类型" prop="paymentThirdTypeName"></el-table-column>
                    <el-table-column label="关键标识">
                        <template slot-scope="scope">
                            <div>登录账号：{{scope.row.channelLoginAcctNo}}</div>
                            <div>商户号：{{scope.row.channelMerCustId}}</div>
                        </template>
                    </el-table-column>
                    <el-table-column label="业务类型" prop="bankTypeName"></el-table-column>
                    <el-table-column label="余额">
                        <template slot-scope="scope">
                            {{scope.row.availBalance | formatMoney}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="关联商户明细" name="relevance">
                <el-table v-if="data.list" :data="data.list">
                    <el-table-column label="商户名称" prop="appName"></el-table-column>
                    <el-table-column label="归属企业" prop="companyName"></el-table-column>
                    <el-table-column label="银行卡余额（元）" prop="bankList">
                        <template slot-scope="scope">
                            <div v-for="e in scope.row.bankList" v-if="e.name">
                                {{e.name}}：{{e.value | formatMoney}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="支付宝余额（元）" prop="alipayList">
                        <template slot-scope="scope">
                            <div v-for="e in scope.row.alipayList" v-if="e.name">
                                {{e.name}}：{{e.value | formatMoney}}
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="微信余额（元）" prop="wxList">
                        <template slot-scope="scope">
                            <div v-for="e in scope.row.wxList" v-if="e.name">
                                {{e.name}}：{{e.value | formatMoney}}
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column label="关键标识">
                        <template slot-scope="scope">
                            <div>登录账号：{{scope.row.channelLoginAcctNo}}</div>
                            <div>商户号：{{scope.row.channelMerCustId}}</div>
                        </template>
                    </el-table-column> -->
                    <el-table-column label="总余额（元）">
                        <template slot-scope="scope">
                            {{scope.row.availBalance | formatMoney}}
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
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
            data: {},
            tabName: 'channel'
        }
    },
    mounted() {
        this.msg = JSON.parse(sessionStorage.getItem('serviceDetail'))
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
            post(`/api/balance-web/balance-account/${this.tabName == 'channel' ? 'query-service-company-balance-account-channel-detail' : 'query-service-company-balance-account-app-detail'}`, this.form).then(data => {
                this.data = data
                this.data.list = this.data.list.filter(e => {
                    return this.tabName == 'channel' ? e.payUserName : e.appName
                })
            })
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        tab(a) {
            this.query()
            console.log(a)
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
