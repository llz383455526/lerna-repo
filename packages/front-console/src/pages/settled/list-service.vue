<template>
    <div class="bg-white p15">
        <div class="mb30">服务费账单</div>
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="结算方式" size="small" prop="settleType">
              <el-select v-model="formSearch.settleType">
                <el-option value="month" label="月结"></el-option>
                <el-option value="day" label="日结"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="商户" size="small" prop="appId">
                <el-select filterable v-model="formSearch.appId">
                    <el-option v-for="e in apps" :value="e.value" :label="e.text" :key="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务商名称" size="small" prop="serviceCompanyId">
                <el-select v-model="formSearch.serviceCompanyId" placeholder="请选择" filterable>
                    <el-option v-for="item in serviceCompanies" :label="item.companyName" :value="item.companyId" :key="item.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="账单状态" size="small" prop="reconciled">
                <el-select v-model="formSearch.reconciled" placeholder="请选择">
                    <el-option v-for="item in reconcileds" :label="item.text" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="付款状态" size="small" prop="payStatus">
                <el-select v-model="formSearch.payStatus" placeholder="请选择">
                    <el-option v-for="item in payStatusList" :label="item.text" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
          <el-form-item label="开票状态" size="small" prop="payStatus">
            <el-select v-model="formSearch.payStatus" placeholder="请选择">
              <el-option label="待开票" value="待开票"></el-option>
              <el-option label="开票中" value="开票中"></el-option>
              <el-option label="已开票" value="已开票"></el-option>
            </el-select>
          </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>
        <div>待结算服务费金额：{{fee.notPaidAmount | formatMoney}}</div>
        <el-table :data="tableData.list">
            <el-table-column prop="startDate" label="账单开始时间" width="120px"></el-table-column>
            <el-table-column prop="endDate" label="账单结束时间" width="120px"></el-table-column>
            <el-table-column prop="companyName" label="企业名称"></el-table-column>
            <el-table-column prop="appName" label="商户名称"></el-table-column>
            <el-table-column prop="serviceCompanyName" label="服务商名称"></el-table-column>
            <el-table-column prop="count" label="成功发放笔数" width="120px"></el-table-column>
            <el-table-column prop="amount" label="成功发放金额" width="120px">
              <template slot-scope="scope">
                {{scope.row.amount | formatMoney}}
              </template>
            </el-table-column>
            <el-table-column prop="serviceFee" label="应收服务费金额" width="120px">
              <template slot-scope="scope">
                {{scope.row.serviceFee | formatMoney}}
              </template>
            </el-table-column>
            <el-table-column prop="reconciled" label="账单状态">
              <template slot-scope="scope">
                {{transformText(reconcileds, scope.row.reconciled)}}
              </template>
            </el-table-column>
          <el-table-column prop="reconciled" label="开票状态">
            <template slot-scope="scope">
              已开票
            </template>
          </el-table-column>
            <el-table-column prop="payStatus" label="付款状态">
              <template slot-scope="scope">
                {{transformText(payStatusList, scope.row.payStatus)}}
              </template>
            </el-table-column>
            <el-table-column prop="settleTypeName" label="结算方式"></el-table-column>
            <el-table-column prop="nextClearDate" label="系统结算"></el-table-column>
            <el-table-column prop="settlePeriodDate" label="结算期限"></el-table-column>
            <el-table-column prop="updateByName" label="操作人"></el-table-column>
            <el-table-column prop="updateAt" label="操作时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <a class="download" v-if="scope.row.reconciled" :href="`/api/recon/settled/service-free-order-download-by-id?id=${scope.row.id}`" target="_blank">账单下载</a>
                    <el-button v-if="scope.row.reconciled && scope.row.payStatus == '10'" class="download" type="text" @click="refund(scope.row.id)">立即还款</el-button>
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
        <el-dialog title="服务费账单结算" :visible.sync="show" width="550px">
          <div class="dialog-content">
                当前服务费账户余额: <span>{{refundData.accountBalanceAmount | formatMoney}}</span> <span v-if="parseFloat(refundData.accountBalanceAmount) < parseFloat(refundData.notPaidAmount) && refundData.notPaidAmount != 0" id="warn_text">服务费账户余额不足</span>
          </div>
          <div class="dialog-content">
                本期待结算服务费金额: <span>{{refundData.notPaidAmount | formatMoney}}</span>
          </div>
          <div class="dialog-content">
                账单起始时间：{{refundData.startDate | formatTime('yyyy-MM-dd')}} 至 {{refundData.endDate | formatTime('yyyy-MM-dd')}}
          </div>
          <span slot="footer">
            <el-button size="small" @click="show = false">关闭</el-button>
            <el-button v-if="parseFloat(refundData.accountBalanceAmount) >= parseFloat(refundData.notPaidAmount) && refundData.notPaidAmount != 0" size="small" type="primary" @click="pay">立即付款</el-button>
          </span>
        </el-dialog>
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
                    settleType: '',
                    reconciled: '',
                    payStatus: '',
                    // startAt: '',
                    // endAt: '',
                },
                restaurants1: [],
                showDatePick: 'day',
                valueMonth: '',
                valueDate: '',
                appName: '',
                pageSize: 10,
                tableData: [],
                serviceCompanies: [],
                apps: [],
                reconcileds: [],
                payStatusList: [],
                show: false,
                refundData: {},
                id: '',
                fee: {}
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
                // this.formSearch.settleType = '';
                // this.valueDate = '';
                // this.valueMonth = '';
                // this.appName = '';
                // this.formSearch.reconciled = ''
                // this.formSearch.payStatus = ''
            },
            search() {
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            },
            requestAction(pageInfo) {
                let url = '/api/recon/settled/service-free-order-list';
                let self = this;
                // _.foreach(this.allAppList, function (value) {
                //     if (value['text'] == self.appName) {
                //         self.formSearch.appId = value['value'];
                //         return false;
                //     } else {
                //         self.formSearch.appId = '';
                //     }
                // });
                // let startAt = '';
                // let endAt = '';
                // if (this.formSearch.settleType === 'month') {
                //     startAt = this.valueMonth;
                //     endAt = this.valueMonth;
                // }
                // if (this.formSearch.settleType === 'day') {
                //     if(this.valueDate && this.valueDate.length) {
                //         startAt = this.valueDate[0];
                //         endAt = this.valueDate[1];
                //     }
                // }
                let param = {
                    appId: this.formSearch.appId,
                    settleType: this.formSearch.settleType,
                    serviceCompanyId: this.formSearch.serviceCompanyId,
                    reconciled: this.formSearch.reconciled,
                    payStatus: this.formSearch.payStatus,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                post(url, param).then(data => {
                    this.tableData = data;
                })
                get('/api/recon/settled/sf-account-balance-info', param).then(data => {
                  this.fee = data
                })
            },
            handleDownload(a) {
                var settledTime = formatTime(a.settleDate, 'yyyy-MM-dd');
                window.location.href = baseUrl + '/api/recon/settled/service-free-order-download'
                    + '?appId=' + a.appId + '&settleType=' + a.settleType
                    + '&settledTime=' + settledTime + (this.formSearch.settleType == 'month' ? '&settledOrderServiceFeeNpttMonthId=' + a.id : '&settledOrderServiceFeeNpttId=' + a.id)
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
            refund(id) {
              this.id = id
              get('/api/recon/settled/sf-order-balance-info', {
                id: id
              }).then(data => {
                this.show = true
                this.refundData = data
                console.log(data)
              })
            },
            pay() {
              post('/api/recon/settled/sf-immediate-pay', {
                id: this.id
              }).then(data => {
                this.show = false
                this.$message({
                  type: 'success',
                  message: '还款成功！'
                })
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
              })
            },
            transformText(a, b) {
              var arr = a.filter(e => e.value == b)
              console.log(arr)
              return arr.length ? arr[0].text : ''
            }
        },
        created() {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.getServiceCompany()
            this.getAllApp();
            get('/api/sysmgr-web/commom/app-list').then(data => {
                this.apps = data
            })
            get('/api/recon/option/get-reconcile-status').then(data => {
              this.reconcileds = data
            })
            get('/api/recon/option/get-sf-order-pay-status').then(data => {
              this.payStatusList = data
            })
        }
    }
</script>

<style lang="scss" scoped>
.dialog-content {
    font-size: 14px;
    color: #999999;
    margin-bottom: 12px;

   span {
        color: #2A2A2A;
        margin-left: 8px;
    }

   a {
        font-size: 14px;
        color: #108EE9;
        margin-left: 15px;
    }
}
.download {
    color: #108EE9;
    font-size: 12px;
    text-decoration: unset;
}
#warn_text {
  color: red;
  margin-left: 20px;
}
</style>
