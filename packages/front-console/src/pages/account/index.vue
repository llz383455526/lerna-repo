<template>
    <div class="company-build-container company-container">
        <el-tabs v-model="activeName">
            <!-- <el-tab-pane label="客户账户余额" name="new" v-loading="!aData">
                <div style="padding: 30px;">
                    <img src="../../image/money.png" style="width: 120px;height: 120px;float: left; margin-right: 50px;"/>
                    <p>账户总余额（元）： </p>
                    <h2>{{aData.totalAvailBalance | formatMoney}}</h2>
                </div>
                <el-table :data="aData.balanceAccountItems" style="width: 100%;margin-top: 20px;">
                    <el-table-column
                            align="left"
                            prop='companyName'
                            label='客户公司'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='appName'
                            label='接入应用'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            label='余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.availBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane> -->
            <!-- v-loading="load" -->
            <el-tab-pane label="客户账户余额" name="client">
                <!-- <div style="padding: 30px;">
                    <img src="../../image/money.png" style="width: 120px;height: 120px;float: left; margin-right: 50px;"/>
                    <p>账户总余额（元）： </p>
                    <h2>{{account.balanceAmount | formatMoney}}</h2>
                </div> -->
                <el-form :inline="true" :model="clientForm" ref="clientForm">
                    <!-- <el-form-item label="账户类型" prop="balanceType">
                        <el-select size="small" v-model="clientForm.balanceType">
                            <el-option :value="1" label="实发账户余额"></el-option>
                            <el-option :value="3" label="服务费账户余额"></el-option>
                        </el-select>
                    </el-form-item> -->
                    <el-form-item label="企业" prop="companyId">
                        <el-select size="small" filterable v-model="clientForm.companyId">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="e in companys" :value="e.id" :label="e.name" :key="e.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="商户" prop="appId">
                        <el-select size="small" filterable v-model="clientForm.appId">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="e in apps" :value="e.value" :label="e.text" :key="e.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务商" prop="serviceCompanyId">
                        <el-select size="small" filterable v-model="clientForm.serviceCompanyId">
                            <el-option label="全部" value=""></el-option>
                            <el-option v-for="(item, key) in option.serveCompanyList" :key="key" :value="item.id" :label="item.name"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="clientBalance">查询</el-button>
                        <el-button size="small" @click="reset('clientForm')">清除</el-button>
                        <el-button size="small" style="margin-left: 60px" @click="exportClient">导出搜索结果</el-button>
                    </el-form-item>
                </el-form>
                <el-table v-if="clientData.list" :data="clientData.list" style="width: 100%;margin-top: 20px;">
                    <el-table-column
                            align="left"
                            prop='companyName'
                            label='企业名称'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='appName'
                            label='商户名称'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='serviceCompanyName'
                            label='服务商'>
                    </el-table-column>
                    <el-table-column prop="balanceTypeName" label="账户类型"></el-table-column>
                    <el-table-column
                            align="left"
                            prop="bankAvailBalance"
                            label='银行卡余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.bankAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="alipayAvailBalance"
                            label='支付宝余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.alipayAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="wxAvailBalance"
                            label='微信余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.wxAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="totalAvailBalance"
                            label='总余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.totalAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="serviceFeeAvailBalance" label="服务费账户余额（元）">
                        <template slot-scope="scope">
                            <span>{{scope.row.serviceFeeAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="balanceAmount"
                            label='操作'>
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="goClientDetail(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <ayg-pagination
                    :total="clientData.total"
                    :currentPage="clientForm.page"
                    v-on:handleSizeChange="setSizeClient"
                    v-on:handleCurrentChange="clientBalance">
                </ayg-pagination>
            </el-tab-pane>
            <!-- v-loading="load" -->
            <el-tab-pane label="服务商账户余额" name="service" v-if="userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'">
                <el-form :inline="true" :model="serviceForm" ref="serviceForm">
                    <el-form-item label="服务商" prop="serviceCompanyId">
                        <el-select size="small" filterable v-model="serviceForm.serviceCompanyId">
                            <el-option v-for="e in serviceOption" :value="e.id" :label="e.name" :key="e.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="serviceBalance">查询</el-button>
                        <el-button size="small" @click="reset('serviceForm')">清除</el-button>
                        <el-button size="small" style="margin-left: 60px" @click="exportService">导出搜索结果</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="serviceData.list" style="width: 100%;margin-top: 20px;">
                    <el-table-column
                            align="left"
                            prop='serviceCompanyName'
                            label='服务商名称'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="bankAvailBalance"
                            label='银行卡余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.bankAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="alipayAvailBalance"
                            label='支付宝余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.alipayAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="wxAvailBalance"
                            label='微信余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.wxAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="totalAvailBalance"
                            label='总余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.totalAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            label='操作'>
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="goServiceDetail(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <ayg-pagination
                    :total="serviceData.total"
                    :currentPage="serviceForm.page"
                    v-on:handleSizeChange="setSizeService"
                    v-on:handleCurrentChange="serviceBalance">
                </ayg-pagination>
            </el-tab-pane>
            <!-- v-loading="load" -->
            <!-- <el-button size="small" style="margin-left: 60px" @click="exportService">导出搜索结果</el-button> -->
            <!-- <el-tab-pane label="转包服务商账户余额" name="assign">
                <el-form :inline="true" :model="assignForm" ref="assignForm">
                    <el-form-item label="商户" prop="appId">
                        <el-select size="small" filterable v-model="assignForm.appId">
                            <el-option v-for="e in apps" :value="e.value" :label="e.text" :key="e.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="服务商" prop="serviceCompanyId">
                        <el-select size="small" filterable v-model="assignForm.serviceCompanyId">
                            <el-option v-for="e in serviceOption" :value="e.id" :label="e.name" :key="e.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="转包服务商" prop="subServiceCompanyId">
                        <el-select size="small" filterable v-model="assignForm.subServiceCompanyId">
                            <el-option v-for="e in serviceOption" :value="e.id" :label="e.name" :key="e.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" type="primary" @click="assignBalance">查询</el-button>
                        <el-button size="small" @click="reset('assignForm')">清除</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="assignData.list" style="width: 100%;margin-top: 20px;">
                    <el-table-column
                            align="left"
                            prop='companyName'
                            label='企业名称'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='appName'
                            label='商户名称'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='serviceCompanyName'
                            label='服务商名称'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='subServiceCompanyName'
                            label='转包服务商名称'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="bankAvailBalance"
                            label='银行卡余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.bankAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="alipayAvailBalance"
                            label='支付宝余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.alipayAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="wxAvailBalance"
                            label='微信余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.wxAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="totalAvailBalance"
                            label='总余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.totalAvailBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            label='操作'>
                        <template slot-scope="scope">
                            <el-button size="small" type="text" @click="goAssignDetail(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <ayg-pagination
                    :total="assignData.total"
                    :currentPage="assignForm.page"
                    v-on:handleSizeChange="setSizeAssign"
                    v-on:handleCurrentChange="assignBalance">
                </ayg-pagination>
            </el-tab-pane> -->
            <el-tab-pane label="渠道账户余额" name="old" v-loading="load" v-if="userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'">
                <div style="padding: 30px;">
                    <img src="../../image/money.png" style="width: 120px;height: 120px;float: left; margin-right: 50px;"/>
                    <p>账户总余额（元）： </p>
                    <h2>{{account.balanceAmount | formatMoney}}</h2>
                </div>
                <el-table :data="account.customerBalances" style="width: 100%;margin-top: 20px;">
                    <el-table-column
                            align="left"
                            prop='customerCompanyName'
                            label='接入应用'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='payUserName'
                            label='子账号名称'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='payUserNo'
                            label='子账号'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="balanceAmount"
                            label='余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.balanceAmount | formatMoney}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!--<ayg-pagination v-if="companyBuildList.total" :total="companyBuildList.total"-->
        <!--v-on:handleSizeChange="handleSizeChange"-->
        <!--v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>-->
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import { showConfirm } from "../../plugin/utils-message";
import { showTopErrorToast } from "../../plugin/utils-toast";
import { post, get } from "../../store/api";
import { setTimeout } from "timers";
import optionModel from '../../model/option/optionModel.js'

export default {
  data() {
    return {
      pageSize: 10,
      currentPage: 1,
      currentChangeBySetting: false,
      formSearch: {
        nameLK: "",
        createByNameLK: "",
        stateEQ: ""
      },
      value9: "",
      activeName: "client",
    //   aData: "",
      load: true,
      clientForm: {
        serviceCompanyId: '',
        balanceType: '',
        appId: '',
        companyId: '',
        page: 1,
        pageSize: 10
      },
      clientData: {},
      clientTotal: 0,
      serviceOption: [],
      serviceForm: {
        appId: '',
        companyId: '',
        orderBy: '',
        page: 1,
        pageSize: 10,
        serviceCompanyId: ''
      },
      serviceData: {},
      companys: [],
      apps: [],
      assignForm: {
          appId: '',
          serviceCompanyId: '',
          subServiceCompanyId: '',
          page: 1,
          pageSize: 10
      },
      assignData: {},
      option: new optionModel()
    };
  },
  computed: {
    ...mapGetters({
      account: "account",
      userInformation: 'userInformation'
    })
  },
  watch: {
    companyDeleteResult() {
      this.requestAction({
        page: this.currentPage,
        pageSize: this.pageSize
      });
    },
    account() {
      if (this.account.balanceAmount || this.account.balanceAmount === 0) {
        this.load = false;
      }
    },
    activeName() {
        if(this.activeName == 'old' && !this.account) {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize
            });
        }
    }
  },
  mounted() {
    // post("/api/balance-web/balance-account/query-account").then(
    //   function(data) {
    //     this.aData = data;
    //   }.bind(this)
    // );
    // setTimeout(
    //   function() {
    //     this.activeName = "new";
    //   }.bind(this),
    //   10
    // );
    // this.getService()
    this.clientBalance()
    this.serviceBalance()
    this.assignBalance()
    this.option.getServeCompanyList();
    get('/api/sysmgr-web/commom/company', {
        companyIdentity: 'custom'
    }).then(data => {
        this.companys = data
    })
    get('/api/sysmgr-web/commom/company', {
        companyIdentity: 'service'
    }).then(data => {
        this.serviceOption = data
    })
    get('/api/sysmgr-web/commom/app-list').then(data => {
        this.apps = data
    })
  },
  methods: {
    handleSizeChange(value) {
      this.pageSize = value;
      this.currentPage = 1;
      this.requestAction({
        pageNo: this.currentPage,
        pageSize: value
      });
    },
    handleCurrentChange(value) {
      this.currentPage = value;
      if (this.currentChangeBySetting) {
        this.currentChangeBySetting = false;
        return;
      }
      this.requestAction({
        page: value,
        pageSize: this.pageSize
      });
    },
    requestAction(pageInfo) {
      let param = {
        nameLK: this.formSearch.nameLK,
        createByNameLK: this.formSearch.createByNameLK,
        stateEQ: this.formSearch.stateEQ == "-1" ? "" : this.formSearch.stateEQ,
        page: pageInfo.page,
        pageSize: pageInfo.pageSize
      };
      // this.$store.dispatch('companyBuildList', param);
      this.$store.dispatch("account", param);
    },
    // getService() {
    //     get('/api/sysmgr-web/commom/app-service-company-list').then(data => {
    //         this.serviceOption = data
    //     })
    //     // get('/api/invoice-web/commom/service-company-options').then(data => {
    //     //     this.serviceOption = data
    //     // })
    // },
    clientBalance(a) {
        if(isNaN(a)) {
            a = 1
        }
        this.clientForm.page = a
        post('/api/balance-web/balance-account/query-app-balance-account', this.clientForm).then(data => {
            this.clientData = data
        })
    },
    exportClient() {
        var str = ''
        for (var k in this.clientForm) {
            if(!str) {
                str += `?${k}=${this.clientForm[k]}`
            }
            else {
                str += `&${k}=${this.clientForm[k]}`
            }
        }
        window.open(`/api/balance-web/balance-account/export-app-balance-account-list${str}`)
    },
    setSizeClient(a) {
        this.clientForm.pageSize = a
        this.clientBalance()
    },
    goClientDetail(a) {
        sessionStorage.setItem('clientDetail', JSON.stringify(a))
        this.$router.push('clientDetail')
    },
    serviceBalance(a) {
        if(isNaN(a)) {
            a = 1
        }
        this.serviceForm.page = a
        post('/api/balance-web/balance-account/query-service-company-balance-account', this.serviceForm).then(data => {
            this.serviceData = data
        })
    },
    exportService() {
        var str = ''
        for (var k in this.serviceForm) {
            if(!str) {
                str += `?${k}=${this.serviceForm[k]}`
            }
            else {
                str += `&${k}=${this.serviceForm[k]}`
            }
        }
        window.open(`/api/balance-web/balance-account/export-service-company-balance-account-list${str}`)
    },
    setSizeService(a) {
        this.serviceForm.pageSize = a
        this.serviceBalance()
    },
    goServiceDetail(a) {
        sessionStorage.setItem('serviceDetail', JSON.stringify(a))
        this.$router.push('serviceDetail')
    },
    assignBalance(a) {
        if(isNaN(a)) {
            a = 1
        }
        this.assignForm.page = a
        post('/api/balance-web/balance-account/query-sub-service-company-balance-account', this.assignForm).then(data => {
            this.assignData = data
        })
    },
    setSizeAssign(a) {
        this.assignForm.pageSize = a
        this.assignBalance()
    },
    goAssignDetail(a) {
        sessionStorage.setItem('assignDetail', JSON.stringify(a))
        this.$router.push('assignDetail')
    },
    reset(name) {
        console.log(name)
        this.$refs[name].resetFields()
        // this.$refs[name].resetFields()
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../style/color";

.company-build-container {
}
</style>
