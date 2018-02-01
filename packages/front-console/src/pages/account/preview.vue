<template>
    <div class="company-build-container company-container">
        <div style="margin: 0 30px 30px;">发放流水记录</div>
        <el-form :inline="true" :model="formSearch" class="demo-form-inline" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="客户名称:" size="small">
                <el-select style="width: 150px" v-model="formSearch.appName" placeholder="请选择">
                    <el-option v-for="(item, index) in customerNameList"
                               :label="item.text"
                               :value="item.value"
                               :key="index">

                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户订单号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.outOrderNo" placeholder="客户订单号"></el-input>
            </el-form-item>
            <!--<el-form-item label="渠道交易流水号:" size="small">-->
                <!--<el-input style="width: 150px" v-model="formSearch.paymentThirdTradeNo" placeholder="渠道交易流水号">-->
                <!--</el-input>-->
            <!--</el-form-item>-->
            <el-form-item label="收款人姓名:" size="small">
                <el-input style="width: 150px" v-model="formSearch.accountName" placeholder="收款人姓名"></el-input>
            </el-form-item>
            <el-form-item label="收款账号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.accountNo" placeholder="收款账号">
                </el-input>
            </el-form-item>

            <!--<el-form-item label="交易状态:" size="small">-->
                <!--<el-select style="width: 150px" v-model="formSearch.stateName" placeholder="请选择">-->
                    <!--<el-option label="支付中" value="20"></el-option>-->
                    <!--<el-option label="支付成功" value="30"></el-option>-->
                    <!--<el-option label="支付失败" value="40"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item label="请求起止时间:" size="small">
                <el-date-picker
                        v-model="dataValue"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary"
                           @click="search"
                           size="small">查询

                </el-button>
                <el-button size="small"
                           @click="clear">清除

                </el-button>
                <el-button size="small"
                           @click="exportXls">导出xls

                </el-button>
            </el-form-item>

            <!--<el-form-item v-if="dictData.companyState" label="企业状态:" size="small">-->
            <!--<el-select style="width: 150px" v-model="formSearch.stateEQ" placeholder="请选择">-->
            <!--<el-option v-for="item in dictData.companyState" :label="item.name" :value="item.code"-->
            <!--:key="item.code"></el-option>-->
            <!--<el-option label="所有" value="-1"></el-option>-->
            <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item style="margin-top: -4px">
                <!--<el-button :disabled="!judgePermission('difactor:/company/companies')" @click="search" type="primary"-->
                <!--size="small">查询-->

                <!--</el-button>-->
                <!--<el-button :disabled="!judgePermission('difactor:/company/companies')" @click="clear" size="small">清除-->

                <!--</el-button>-->
            </el-form-item>
            <!--<el-button v-if="judgePermission('difactor:/company/detail/add')" @click="buildCompany" type="primary"-->
            <!--size="medium" style="float: right;margin-right: 35px">创建新企业-->


            <!--</el-button>-->
        </el-form>
        <el-table
                :data="orderList.list"
                style="width: 100%;margin-top: 20px;">
            <el-table-column
                    align="left"
                    prop="appName"
                    label='客户名称'
                    width="140">
            </el-table-column>
            <el-table-column
                    align="left"
                    prop="outOrderNo"
                    label='客户订单号'
                    width="220">
            </el-table-column>
            <!--<el-table-column-->
                    <!--align="left"-->
                    <!--prop="paymentThirdTypeName"-->
                    <!--label='发放渠道'-->
                    <!--width=100>-->
            <!--</el-table-column>-->
            <!--<el-table-column-->
                    <!--align="left"-->
                    <!--prop="paymentThirdTradeNo"-->
                    <!--label='渠道交易流水号'-->
                    <!--width="120">-->
            <!--</el-table-column>-->
            <el-table-column
                    align="left"
                    prop="createAt"
                    label='请求时间'
                    width=160>
                <template slot-scope="scope">
                    <span>{{scope.row.createAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="center"
                    prop='accountName'
                    label='收款人姓名'
                    width=120>
            </el-table-column>
            <el-table-column
                    align="left"
                    prop='accountNo'
                    label='收款账号'
                    width=260>
            </el-table-column>
            <el-table-column
                    align="left"
                    prop='amount'
                    label='交易金额'
                    width=120>
            </el-table-column>
            <el-table-column
                    align="left"
                    prop='rejectReason'
                    label='拒绝原因'>
            </el-table-column>
            <el-table-column
                    align="center"
                    label="查看请求报文"
                    width="160">
                <template slot-scope="scope">
                    <el-button @click="handleClick(scope.$index)" type="text" size="medium" style="padding:0;">查看

                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination v-if="orderList.total" :total="orderList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>

        <el-dialog title="请求报文" :before-close="closeClientDialog" :visible.sync="dialogClientVisible" width="30%">
            <div style="word-wrap: break-word; word-break: normal;overflow: auto;">{{orderMessage}}</div>
        </el-dialog>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import {showConfirm} from '../../plugin/utils-message'
    import {showTopErrorToast} from '../../plugin/utils-toast'
    import {formatTime} from '../../plugin/utils-functions'

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
                dialogClientVisible: false,
                message: '123123'
            }
        },
        computed: {
            ...mapGetters({
                companyBuildList: 'companyBuildList',
                // companyDeleteResult: 'companyDeleteResult',
                // dictData: 'dictData',
                customerNameList: 'customerNameList',
                payOrderList: 'payOrderList',
                rejectList: 'rejectList',
                orderMessage: 'orderMessage',
                orderList: 'orderList'
            })
        },
        watch: {
            companyDeleteResult() {
                this.requestAction({
                    page: this.currentPage,
                    pageSize: this.pageSize,
                });
            },

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
            },

            exportXls() {
                let createAtBegin = '';
                let createAtEnd = '';
                if (this.dataValue) {
                    createAtBegin = formatTime(this.dataValue[0], 'yyyy-MM-dd');
                    createAtEnd = formatTime(this.dataValue[1], 'yyyy-MM-dd');
                }
                // this.$store.dispatch('exportXls', this.formSearch);
                window.location.href = 'http://consoletest94.aiyuangong.com/api/console-deliver/pay-order-reject/export-list?appName=' + this.formSearch.appName
                    + '&outOrderNo=' + this.formSearch.outOrderNo
                    + '&paymentThirdTypeName=' + this.formSearch.paymentThirdTypeName
                    // + '&paymentThirdTradeNo=' + this.formSearch.paymentThirdTradeNo
                    // + '&createAt=' + this.formSearch.createAt
                    + '&createAtBegin=' + createAtBegin
                    + '&createAtEnd=' + createAtEnd
                    + '&accountName=' + this.formSearch.accountName
                    + '&accountNo=' + this.formSearch.accountNo
                    + '&account=' + this.formSearch.account
                    // + '&stateName=' + this.formSearch.stateName
                    + '&paymentResDesc=' + this.formSearch.paymentResDesc;
            },
            //
            // buildCompany() {
            //     this.$router.push('contact');
            // },
            //
            handleClick(index) {
                this.dialogClientVisible = true;
                this.$store.dispatch('getOrderMessage', {id: index + 1});
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
                if (this.currentChangeBySetting) {
                    this.currentChangeBySetting = false;
                    return;
                }
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
                    // paymentThirdTradeNo: this.formSearch.paymentThirdTradeNo,
                    // createAt: this.formSearch.createAt,
                    createAtBegin: createAtBegin,
                    createAtEnd: createAtEnd,
                    accountName: this.formSearch.accountName,
                    accountNo: this.formSearch.accountNo,
                    account: this.formSearch.account,
                    // state: this.formSearch.stateName,
                    paymentResDesc: this.formSearch.paymentResDesc,

                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                this.$store.dispatch('getOrderList', param);
            }
        },

        created: function () {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.$store.dispatch('customerNameList');
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../style/color";

    .company-build-container {

    }
</style>
