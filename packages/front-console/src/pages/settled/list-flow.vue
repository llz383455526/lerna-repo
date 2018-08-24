<template>
    <div class="bg-white p15">
        <div class="mb30">流水账单</div>
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
                <el-select v-model="formSearch.serviceCompanyId" placeholder="请选择" @change="getStatusList">
                    <el-option v-for="item in serviceCompanies" :label="item.companyName" :value="item.companyId" :key="item.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" size="small" prop="status">
                <el-select v-model="formSearch.status" placeholder="请选择" @change="getStatusList">
                    <el-option v-for="item in statusList" :label="item.text" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-bottom: 25px; text-align: right">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
                <el-button size="small"  @click="exportFile">导出xls</el-button>
                <!-- <el-button size="small" @click="exportFile" icon="el-icon-document">导出xls</el-button> -->
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <span style="color: red">账单结算按照发放成功时间统计</span>
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
            <el-table-column prop="amount" label="总金额">
                <template slot-scope="scope">
                    <span>{{scope.row.amount | formatMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="count" label="发放总笔数"></el-table-column>
            <el-table-column label="银行卡">
                <template slot-scope="scope">
                    <div>{{scope.row.bankAmount | formatMoney}}</div>
                    <div>发放{{scope.row.bankCount}}笔</div>
                </template>
            </el-table-column>
            <el-table-column label="支付宝">
                <template slot-scope="scope">
                    <div>{{scope.row.alipayAmount | formatMoney}}</div>
                    <div>发放{{scope.row.alipayCount}}笔</div>
                </template>
            </el-table-column>
            <el-table-column label="微信">
                <template slot-scope="scope">
                    <div>{{scope.row.wechatAmount | formatMoney}}</div>
                    <div>发放{{scope.row.wechatCount}}笔</div>
                </template>
            </el-table-column>
            <el-table-column prop="statusName" label="状态"></el-table-column>
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleDownload(scope.row.appId, scope.row.billType, scope.row.settleDate)"
                               type="text" size="medium" style="padding:0;">
                        账单下载
                    </el-button>
                </template>
            </el-table-column> -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <a class="download" v-if="scope.row.status !== '10'" :href="`/api/console-dlv/settled/flow-order-download?appId=${scope.row.appId}&billType=${scope.row.billType}&settledTime=${scope.row.settleDate}&${formSearch.billType == 'month' ? 'settleOrderInvoiceMonthId' : 'settleOrderInvoiceId'}=${scope.row.id}`" target="_blank">
                        账单下载
                    </a>
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
    import { urlEncode } from '../../plugin/utils-functions'

    export default {
        data() {
            return {
                formSearch: {
                    appId: '',
                    serviceCompanyId: '',
                    status: '',
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
                serviceCompanies: [],
                statusList: []
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
            exportFile() {
	            if (this.formSearch.billType === 'month') {
		            this.formSearch.startAt = this.valueMonth
		            this.formSearch.endAt = this.valueMonth
	            }
	            else if (this.formSearch.billType === 'day' && this.valueDate.length) {
		            this.formSearch.startAt = this.valueDate[0]
		            this.formSearch.endAt = this.valueDate[1]
	            }
                window.location.href = `/api/console-dlv/settled/flow-order-summing-download?${urlEncode(this.formSearch)}`
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
                this.getStatusList()
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
                    serviceCompanyId: this.formSearch.serviceCompanyId,
                    status: this.formSearch.status,
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
            },
            getStatusList() {
                get('/api/console-dlv/option/get-invoice-status', {
                    appId: this.formSearch.appId,
                    serviceCompanyId: this.formSearch.serviceCompanyId,
                    billType: this.formSearch.billType
                }).then(data => {
                    this.statusList = data
                })
	            // get('/api/console-dlv/option/get-by-type', {
		        //     type: 'OpenInvoiceStatus'
                // }).then(result => {
                //     // this.statusList = result
                //     // _.forEach(result, item => {
	            //     //     this.statusList[item.value] = item
                //     // })
                //     this.statusList = result
                //     console.log(this.statusList)
                // })
            }
        },
        created() {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.getServiceCompany()
            this.getStatusList()
            this.getAllApp();
        }
    }
</script>

<style scoped>
.download {
    text-decoration: unset;
}
</style>