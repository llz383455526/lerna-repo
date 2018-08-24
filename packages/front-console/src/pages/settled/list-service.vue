<template>
    <div class="bg-white p15">
        <div class="mb30">服务费账单</div>
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
            <el-form-item size="small">
                <el-radio-group v-model="formSearch.billType" @change="search">
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
                <el-radio-group v-model="formSearch.billType" @change="search">
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
            <el-form-item label="服务商名称" size="small" prop="serviceCompanyId">
                <el-select v-model="formSearch.serviceCompanyId" placeholder="请选择">
                    <el-option v-for="item in serviceCompanies" :label="item.companyName" :value="item.companyId" :key="item.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData.list">
            <el-table-column prop="appName" label="客户名称"></el-table-column>
            <el-table-column prop="settleDate" label="入账时间">
                <template slot-scope="scope">
                    <span v-if="scope.row.billType === 'month'">{{scope.row.settleDate | formatTime('yyyy-MM')}}</span>
                    <span v-if="scope.row.billType === 'day'">{{scope.row.settleDate | formatTime('yyyy-MM-dd')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="serviceCompanyName" label="服务商名称"></el-table-column>
            <el-table-column prop="settleTypeName" label="结算方式"></el-table-column>
            <el-table-column label="计费标准" prop="serviceFeeName">
                <!-- <template slot-scope="scope">
                    <span>{{scope.row.serviceFeeType == 'ratio' ? '发放金额 *' + scope.row.serviceFeeRate + '%' : scope.row.serviceFeeRate + '元/笔'}} </span>
                </template> -->
            </el-table-column>
            <el-table-column label="计费依据">
                <template slot-scope="scope">
                    <div>发放成功金额 {{scope.row.amount}}</div>
                    <div>发放成功笔数 {{scope.row.count}}笔</div>
                </template>
            </el-table-column>
            <el-table-column prop="serviceFee" label="服务费金额"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="medium" @click="handleDownload(scope.row)" v-if="scope.row.reconciled != '0'">
                        账单下载
                    </el-button>
                    <div v-else>未出帐</div>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination 
            v-if="tableData.total"
            :total="tableData.total"
            v-on:handleSizeChange="handleSizeChange"
            v-on:handleCurrentChange="handleCurrentChange"
            :currentPage="currentPage">
        </ayg-pagination>
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
                    serviceCompanyId: '',
                    billType: 'day',
                    startAt: '',
                    endAt: '',
                },
                restaurants1: [],
                showDatePick: 'day',
                valueMonth: '',
                valueDate: '',
                appName: '',
                pageSize: 10,
                tableData: [],
                serviceCompanies: []
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
                    _.foreach(data, function (value) {
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
                let url = '/api/console-dlv/settled/service-free-order-list';
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
                    serviceCompanyId: this.formSearch.serviceCompanyId,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                post(url, param).then(data => {
                    this.tableData = data;
                })
            },
            handleDownload(a) {
                var settledTime = formatTime(a.settleDate, 'yyyy-MM-dd');
                window.location.href = baseUrl + '/api/console-dlv/settled/service-free-order-download'
                    + '?appId=' + a.appId + '&billType=' + a.billType
                    + '&settledTime=' + settledTime + (this.formSearch.billType == 'month' ? '&settledOrderServiceFeeNpttMonthId=' + a.id : '&settledOrderServiceFeeNpttId=' + a.id)
            },
            handleSizeChange(value) {
                this.pageSize = value;
                this.currentPage = 1;
                this.requestAction({page: this.currentPage, pageSize: value,});
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
            getServiceCompany() {
        	    get('/api/console-dlv/option/get-option-service-companies')
                    .then(result => {
                    	this.serviceCompanies = result
                    })
            }
        },
        created() {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.getServiceCompany()
            this.getAllApp();
        }
    }
</script>

<style scoped>

</style>