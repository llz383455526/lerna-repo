<template>
    <div class="bg-white p15" style="background-color: #fff;padding: 15px;">
        <!--<div class="mb30" style="margin-bottom: 30px;">流水账单</div>-->
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <!--<el-form-item label="客户名称" size="small">
                <el-autocomplete
                        class="inline-input"
                        v-model="appName"
                        :fetch-suggestions="querySearch1"
                        placeholder="请输入内容"
                        style="width:100%;">
                </el-autocomplete>
            </el-form-item>-->
            <el-form-item size="small">
                <el-radio-group v-model="formSearch.billType">
                    <el-radio label="month">月账单</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item size="small" v-if="this.formSearch.billType === 'month'">
                <el-date-picker
                        v-model="valueMonth"
                        type="month"
                        placeholder="选择月"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item size="small">
                <el-radio-group v-model="formSearch.billType">
                    <el-radio label="day">日账单</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item size="small" v-if="this.formSearch.billType === 'day'">
                <el-date-picker
                        v-model="valueDate"
                        type="daterange"
                        placeholder="选择日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>

        <div class="table-container">
            <el-table :data="tableData.list">
                <el-table-column prop="appName" label="客户名称"></el-table-column>
                <el-table-column prop="settleDate" label="记账时间">
                    <template slot-scope="scope">
                        <span v-if="scope.row.billType === 'month'">{{scope.row.settleDate | formatTime('yyyy-MM')}}</span>
                        <span v-if="scope.row.billType === 'day'">{{scope.row.settleDate | formatTime('yyyy-MM-dd')}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="支付宝">
                    <template slot-scope="scope">
                        <span>总金额 {{scope.row.alipayAmount}}元  发放{{scope.row.alipayCount}}笔</span>
                    </template>
                </el-table-column>
                <el-table-column label="银行卡">
                    <template slot-scope="scope">
                        <span>总金额 {{scope.row.bankAmount}}元  发放{{scope.row.bankCount}}笔</span>
                    </template>
                </el-table-column>
                <el-table-column label="微信">
                    <template slot-scope="scope">
                        <span>总金额 {{scope.row.wechatAmount}}元  发放{{scope.row.wechatCount}}笔</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleDownload(scope.row.appId, scope.row.billType, scope.row.settleDate)"
                                   type="text" size="medium" style="padding:0;">
                            账单下载
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <ayg-pagination v-if="tableData.total" :total="tableData.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {get, post, formPost} from "../../store/api";
    import {baseUrl} from '../../config/address';
    import {formatTime} from '../../plugin/utils-functions';
    export default {
        data() {
            return {
                formSearch: {
                    appId: '',
                    billType: 'month',
                    startAt: '',
                    endAt: '',
                },
                restaurants1: [],
                showDatePick: 'month',
                valueMonth: '',
                valueDate: '',
                appName: '',
                pageSize: 10,
                tableData: [],
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
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.formSearch.billType = 'month';
                this.valueDate = '';
                this.valueMonth = '';
                this.appName = '';
            },
            search() {
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            },
            requestAction(pageInfo) {
                let url = '/api/console-dlv/settled/flow-order-list';
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
                if (this.formSearch.billType === 'month') {
                    startAt = this.valueMonth;
                    endAt = this.valueMonth;
                }
                if (this.formSearch.billType === 'day') {
                    startAt = this.valueDate[0];
                    endAt = this.valueDate[1];
                }
                let param = {
                    startAt: startAt,
                    endAt: endAt,
                    appId: this.formSearch.appId,
                    billType: this.formSearch.billType,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                post(url, param).then(data => {
                    this.tableData = data;
                })
            },
            handleDownload(appId, billType, settledTime) {
                settledTime = formatTime(settledTime, 'yyyy-MM-dd');
                window.location.href = baseUrl + '/api/console-dlv/settled/flow-order-download'
                    + '?appId=' + appId + '&billType=' + billType
                    + '&settledTime=' + settledTime;
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
        },
        created() {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.getAllApp();
        }
    }
</script>

<style scoped>

</style>