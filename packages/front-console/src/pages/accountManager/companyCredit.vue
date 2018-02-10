<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0px 30px 30px;">企业信用账单</div>

        <div style="margin: 0px 30px 30px;">
            <el-row :gutter="20">
                <el-col :span="7">信用额度： <span style="font-size: 26px;">{{moneyCompanyCredit.amount | formatMoney}}</span>元
                    <i class="el-icon-question" style="margin-left:5px;color:#f56c6c;cursor:pointer;" title="为官方提供资金垫付的总额度（单位：元）"></i>
                </el-col>
                <el-col :span="7">已用信用额度： <span style="font-size: 26px;">{{moneyCompanyCredit.usedAmount | formatMoney}}</span>元
                    <i class="el-icon-question" style="margin-left:5px;color:#f56c6c;cursor:pointer;" title="已提供垫付资金的资金数（单位：元）"></i>
                </el-col>
                <el-col :span="6">可用信用额度： <span style="font-size: 26px;">{{moneyCompanyCredit.availAmount | formatMoney}}</span>元
                    <i class="el-icon-question" style="margin-left:5px;color:#f56c6c;cursor:pointer;" title="还可使用的垫付资金的资金数（单位：元）"></i>
                </el-col>
            </el-row>
        </div>

        <el-form :inline="true" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="状态:" size="small">
                <el-select v-model="formSearch.state">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item, index) in companyCreditStates" :label="item" :value="item" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="充值说明:" size="small">
                <el-select v-model="formSearch.payRemarks">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="(item, index) in companyCreditRemarks" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="记录时间:" size="small">
                <el-date-picker v-model="dateValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
                <el-button size="small" @click="exportXls">导出xls</el-button>
            </el-form-item>
        </el-form>

        <div style="margin: 0px 30px 30px;">
            <el-row :gutter="20">
                <el-col :span="7">累计充值： <span>{{moneyCompanyCredit.sumCZAmount | formatMoney}}</span>元
                    <i class="el-icon-question" style="margin-left:5px;color:#f56c6c;cursor:pointer;" title="所选条件下，本公司充值的总数（单位：元）"></i>
                </el-col>
                <el-col :span="7">累计代付额度： <span>{{moneyCompanyCredit.sumDFAmount | formatMoney}}</span>元
                    <i class="el-icon-question" style="margin-left:5px;color:#f56c6c;cursor:pointer;" title="所选条件下，官方提供的垫付金额总数统计（单位：元）"></i>
                </el-col>
                <el-col :span="6">累计还款： <span>{{moneyCompanyCredit.sumHKAmount | formatMoney}}</span>元
                    <i class="el-icon-question" style="margin-left:5px;color:#f56c6c;cursor:pointer;" title="所选条件下，本公司还款的资金总数（单位：元）"></i>
                </el-col>
            </el-row>
        </div>

        <el-table :data="companyCreditList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="companyAccountName" label="账户名"></el-table-column>
            <el-table-column prop="payRemarksName" label="充值说明"></el-table-column>
            <el-table-column prop="amount" label="金额(元)">
                <template slot-scope="scope">
                    <span>{{scope.row.amount | formatMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
            <el-table-column prop="updateAt" label="记录">
                <template slot-scope="scope">
                    <span>{{scope.row.updateAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updateByName" label="操作人"></el-table-column>
        </el-table>

        <ayg-pagination v-if="companyCreditList.total" :total="companyCreditList.total" :currentPage="currentPage"
                v-on:handleSizeChange="handleSizeChange"
                v-on:handleCurrentChange="handleCurrentChange"></ayg-pagination>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {formatTime} from '../../plugin/utils-functions'
    import {baseUrl} from '../../config/address'

    export default {
        name: "credit-bill",
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                dateValue: '',
                formSearch: {
                    state: '',
                    payRemarks: ''
                }
            }
        },
        computed: {
            ...mapGetters({
                companyCreditList: 'companyCreditList',
                moneyCompanyCredit: 'moneyCompanyCredit',
                companyCreditStates: 'companyCreditStates',
                companyCreditRemarks: 'companyCreditRemarks'
            })
        },
        methods: {
            search: function () {
                this.currentChangeBySetting = true;
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            },
            clear: function () {
                this.formSearch.state = '';
                this.formSearch.payRemarks = '';
                this.dateValue = '';
            },
            exportXls: function () {
                let updateAtBegin = '';
                let updateAtEnd = '';
                if (this.dateValue) {
                    updateAtBegin = formatTime(this.dateValue[0], 'yyyy-MM-dd');
                    updateAtEnd = formatTime(this.dateValue[1], 'yyyy-MM-dd');
                }
                window.location.href = baseUrl + '/company-credit-record/export-list'
                    + '?state=' + this.formSearch.state
                    + '&payRemarks=' + this.formSearch.payRemarks
                    + '&updateAtBegin=' + updateAtBegin
                    + '&updateAtEnd=' + updateAtEnd;
            },
            handleSizeChange(value) {
                this.pageSize = value;
                if (this.currentPage == 1) {
                    this.requestAction({
                        page: 1,
                        pageSize: value,
                    });
                } else {
                    this.currentPage = 1;
                }
            },
            handleCurrentChange(value) {
                this.currentPage = value;
                this.requestAction({
                    page: value,
                    pageSize: this.pageSize,
                });
            },
            requestAction: function (pageInfo) {
                let updateAtBegin = '';
                let updateAtEnd = '';
                if (this.dateValue) {
                    updateAtBegin = formatTime(this.dateValue[0], 'yyyy-MM-dd');
                    updateAtEnd = formatTime(this.dateValue[1], 'yyyy-MM-dd');
                }
                let param = {
                    state: this.formSearch.state,
                    payRemarks: this.formSearch.payRemarks,
                    updateAtBegin: updateAtBegin,
                    updateAtEnd: updateAtEnd,

                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize
                };
                this.$store.dispatch('getCompanyCreditList', param);
            }
        },
        created: function () {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.$store.dispatch('getCompanyCreditStates');
            this.$store.dispatch('getCompanyCreditRemarks');
        }
    }
</script>

<style scoped>

</style>