<template>
    <div class="company-build-container company-container">
        <div style="margin: 0 30px 30px;">拒绝下单记录</div>

        <el-form :inline="true" :model="formSearch" class="demo-form-inline" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="商户名称:" size="small">
                <el-select filterable style="width: 150px" v-model="formSearch.appName" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in customNameList" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户订单号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.outOrderNo" placeholder="客户订单号"></el-input>
            </el-form-item>
            <el-form-item label="收款人姓名:" size="small">
                <el-input style="width: 150px" v-model="formSearch.accountName" placeholder="收款人姓名"></el-input>
            </el-form-item>
            <el-form-item label="收款账号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.accountNo" placeholder="收款账号">
                </el-input>
            </el-form-item>
            <el-form-item label="请求起止时间:" size="small">
                <el-date-picker v-model="dataValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
                <el-button size="small" @click="exportXls">导出xls</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="payOrderRejectList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column align="left" prop="appName" label="商户名称" width="140"></el-table-column>
            <el-table-column align="left" prop="outOrderNo" label="客户订单号" width="220"></el-table-column>
            <el-table-column align="left" prop="createAt" label="请求时间" width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.createAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" prop="accountName" label="收款人姓名" width="120"></el-table-column>
            <el-table-column align="left" prop="accountNo" label="收款账号" width="260"></el-table-column>
            <el-table-column align="left" prop="amount" label="交易金额" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.amount | formatMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column align="left" prop="rejectReason" label="拒绝原因">
                <template slot-scope="scope">
                    <span style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
                          :title="scope.row.rejectReason">{{scope.row.rejectReason}}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="查看请求报文" width="160">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.row.id)" type="text" size="medium" style="padding:0;">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <ayg-pagination v-if="payOrderRejectList.total" :total="payOrderRejectList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>

        <el-dialog title="请求报文" :before-close="closeClientDialog" :visible.sync="dialogClientVisible" width="30%">
            <div style="word-wrap: break-word; word-break: normal;overflow: auto;">{{payOrderRejectBody.value}}</div>
        </el-dialog>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import {showConfirm} from '../../plugin/utils-message'
    import {showTopErrorToast} from '../../plugin/utils-toast'
    import {formatTime} from '../../plugin/utils-functions'
    import {baseUrl} from '../../config/address'

    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                currentChangeBySetting: false,
                formSearch: {
                    appName: '',
                    outOrderNo: '',
                    paymentThirdTypeName: '',
                    paymentThirdTradeNo: '',
                    createAt: '',
                    accountName: '',
                    accountNo: '',
                    account: '',
                    stateName: '',
                    paymentResDesc: ''
                },
                dataValue: '',
                dialogClientVisible: false
            }
        },
        computed: {
            ...mapGetters({
                customNameList: 'customNameList',
                payOrderRejectList: 'payOrderRejectList',
                payOrderRejectBody: 'payOrderRejectBody'
            })
        },
        methods: {
            search() {
                this.currentChangeBySetting = true;
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            },
            clear() {
                this.formSearch.appName = '';
                this.formSearch.outOrderNo = '';
                this.formSearch.paymentThirdTypeName = '';
                this.formSearch.paymentThirdTradeNo = '';
                this.formSearch.createAt = '';
                this.formSearch.accountName = '';
                this.formSearch.accountNo = '';
                this.formSearch.account = '';
                this.formSearch.stateName = '';
                this.formSearch.paymentResDesc = '';
                this.dataValue = '';
            },
            exportXls() {
                let createAtBegin = '';
                let createAtEnd = '';
                if (this.dataValue) {
                    createAtBegin = formatTime(this.dataValue[0], 'yyyy-MM-dd');
                    createAtEnd = formatTime(this.dataValue[1], 'yyyy-MM-dd');
                }
                window.location.href = baseUrl+'/api/console-dlv/pay-order-reject/export-list?appId=' + this.formSearch.appName
                    + '&outOrderNo=' + this.formSearch.outOrderNo
                    + '&paymentThirdTypeName=' + this.formSearch.paymentThirdTypeName
                    + '&createAtBegin=' + createAtBegin
                    + '&createAtEnd=' + createAtEnd
                    + '&accountName=' + this.formSearch.accountName
                    + '&accountNo=' + this.formSearch.accountNo
                    + '&account=' + this.formSearch.account
                    + '&paymentResDesc=' + this.formSearch.paymentResDesc;
            },
            handleClick(index) {
                this.dialogClientVisible = true;
                this.$store.dispatch('getPayOrderRejectBody', {id: index});
            },
            handleSizeChange(value) {
                this.pageSize = value;
                this.currentPage = 1;
                this.requestAction({
                    page: this.currentPage,
                    pageSize: value,
                });
            },
            handleCurrentChange(value) {
                this.currentPage = value;
                this.requestAction({
                    page: value,
                    pageSize: this.pageSize,
                });
            },
            requestAction(pageInfo) {
                let createAtBegin = '';
                let createAtEnd = '';
                if (this.dataValue) {
                    createAtBegin = formatTime(this.dataValue[0], 'yyyy-MM-dd');
                    createAtEnd = formatTime(this.dataValue[1], 'yyyy-MM-dd');
                }
                let param = {
                    appId: this.formSearch.appName,
                    outOrderNo: this.formSearch.outOrderNo,
                    paymentThirdTypeName: this.formSearch.paymentThirdTypeName,
                    createAtBegin: createAtBegin,
                    createAtEnd: createAtEnd,
                    accountName: this.formSearch.accountName,
                    accountNo: this.formSearch.accountNo,
                    account: this.formSearch.account,
                    paymentResDesc: this.formSearch.paymentResDesc,

                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                this.$store.dispatch('getPayOrderRejectList', param);
            }
        },
        created: function () {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.$store.dispatch('getCustomNameList');
        },
    }
</script>

<style lang="scss" scoped>

</style>
