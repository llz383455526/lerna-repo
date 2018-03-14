<template>
    <div class="bg-white p15">
        <div class="mb30">大额资金发放审批</div>
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="客户名称" size="small">
                <el-autocomplete
                        class="inline-input"
                        v-model="appName"
                        :fetch-suggestions="querySearch1"
                        placeholder="请输入内容"
                        style="width:100%;">
                </el-autocomplete>
            </el-form-item>
            <el-form-item label="客户订单号" size="small" prop="outOrderNo">
                <el-input v-model="formSearch.outOrderNo"></el-input>
            </el-form-item>
            <el-form-item label="处理状态" size="small" prop="approveState">
                <el-select v-model="formSearch.approveState" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in options2" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提交时间:" size="small">
                <el-date-picker
                        v-model="dateValue"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd hh:mm:ss">
                </el-date-picker>
            </el-form-item>
            <br>
            <el-form-item label="收款人" size="small" prop="accountName">
                <el-input v-model="formSearch.accountName"></el-input>
            </el-form-item>
            <el-form-item label="收款账号" size="small" prop="accountNo">
                <el-input v-model="formSearch.accountNo"></el-input>
            </el-form-item>
            <el-form-item label="发放渠道" size="small" prop="paymentThirdType">
                <el-select v-model="formSearch.paymentThirdType" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in options1" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData.list">
            <el-table-column prop="appName" label="账户名称"></el-table-column>
            <el-table-column prop="accountName" label="收款人"></el-table-column>
            <el-table-column prop="accountNo" label="收款账号" width="180"></el-table-column>
            <el-table-column prop="amount" label="交易金额"></el-table-column>
            <el-table-column prop="createAt" label="提交时间" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.createAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="paymentThirdTypeName" label="发放渠道"></el-table-column>
            <el-table-column prop="outOrderNo" label="客户订单号" width="220"></el-table-column>
            <el-table-column prop="approveStateName" label="处理状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="handlePass(scope.row.id, 2)" type="text" size="medium" style="padding:0;"
                               v-if="scope.row.approveState == 1">通过
                    </el-button>
                    <el-button @click="handlePass(scope.row.id, 3)" type="text" size="medium" style="padding:0;"
                               v-if="scope.row.approveState == 1">不通过
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination v-if="tableData.total" :total="tableData.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {get, post, formPost} from "../../store/api";
    import {showNotify} from '../../plugin/utils-notify';
    export default {
        data() {
            return {
                dateValue: '',
                appName: '',
                pageSize: 10,
                tableData: [],
                formSearch: {
                    appId: '',
                    outOrderNo: '',
                    approveState: '',
                    createAtBegin: '',
                    createAtEnd: '',
                    accountName: '',
                    accountNo: '',
                    paymentThirdType: '',
                },
                options1: [],
                options2: [],
                restaurants1: [],
                allAppList: []
            }
        },
        methods: {
            querySearch1(queryString, cb) {
                var restaurants = this.restaurants1;
                var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
                // 调用 callback 返回建议列表的数据
                cb(results);
            },
            createFilter(queryString) {
                return (restaurant) => {
                    return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
                };
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dateValue = '';
                this.appName = '';
            },
            search() {
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            },
            handlePass(id, approveState) {
                let url = '/api/console-dlv/pay-order/query-big-amount-approve';
                post(url, {id: id, approveState: approveState}).then(data => {
                    showNotify('success', data);
                    this.currentPage = 1;
                    this.requestAction({
                        page: 1,
                        pageSize: this.pageSize,
                    });
                })
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
                let url = '/api/console-dlv/pay-order/query-big-amount-approve-list';
                let self = this;
                _.foreach(this.allAppList, function (value) {
                    if (value['text'] == self.appName) {
                        self.formSearch.appId = value['value'];
                        return false;
                    } else {
                        self.formSearch.appId = '';
                    }
                });
                let startAt = '';
                let endAt = '';
                if (this.dateValue) {
                    startAt = this.dateValue[0];
                    endAt = this.dateValue[1];
                }
                let param = {
                    createAtBegin: startAt,
                    createAtEnd: endAt,
                    appId: this.formSearch.appId,
                    outOrderNo: this.formSearch.outOrderNo,
                    approveState: this.formSearch.approveState,
                    accountName: this.formSearch.accountName,
                    accountNo: this.formSearch.accountNo,
                    paymentThirdType: this.formSearch.paymentThirdType,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                post(url, param).then(data => {
                    this.tableData = data;
                })
            },
            getThirdPaymentType() {
                let url = '/api/console-dlv/option/get-by-types';
                get(url, {type: 'ThirdPaymentType'}).then(data => {
                    this.options1 = data.ThirdPaymentType;
                })
            },
            getPayOrderApproveState() {
                let url = '/api/console-dlv/option/get-by-types';
                get(url, {type: 'PayOrderApproveState'}).then(data => {
                    this.options2 = data.PayOrderApproveState;
                })
            },
            getAllApp() {
                let url = '/api/console-dlv/option/get-all-app';
                let self = this;
                get(url).then(data => {
                    self.allAppList = data;
                    _.foreach(data, function(value) {
                        self.restaurants1.push({
                            "value": value['text']
                        });
                    });
                })
            },
        },
        created() {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.getThirdPaymentType();
            this.getPayOrderApproveState();
            this.getAllApp();
        }
    }
</script>

<style scoped>

</style>