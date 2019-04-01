<template>
    <div class="bg-white p15">
        <div class="mb30">代理商OEM管理</div>
        <el-form :inline="true" :model="searchForm" :rules="searchForm" ref="searchForm">
            <el-form-item label="代理商名称" size="small" prop="outOrderNo">
                <el-input v-model="searchForm.outOrderNo"></el-input>
            </el-form-item>
            <el-form-item label="负责人" size="small" prop="accountName">
                <el-input v-model="searchForm.accountName"></el-input>
            </el-form-item>
            <el-form-item label="手机号" size="small" prop="accountNo">
                <el-input v-model="searchForm.accountNo"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('searchForm')">清除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableData.list">
            <el-table-column prop="agentName" label="代理商名称" width="200"></el-table-column>
            <el-table-column prop="accountName" label="负责人"></el-table-column>
            <el-table-column prop="chargeByPhone" label="负责人手机号"></el-table-column>
            <el-table-column prop="domain" label="专属域名"></el-table-column>
            <el-table-column prop="smsSign" label="短信签名"></el-table-column>
            <el-table-column prop="platformName" label="平台名称"></el-table-column>
            <el-table-column label="logo">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="getVModal(scope.row.id)">查看图片</el-button>
                </template>
            </el-table-column>
            <el-table-column label="客户登录页">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="getVModal(scope.row.id)">查看图片</el-button>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="edit(scope.row.agentId)">配置</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination v-if="tableData.total" :total="tableData.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
        <vmodal :prevList="prevList" :showVModal="showVModal" @clickSelf="showVModal = false"></vmodal>
    </div>
</template>

<script>
    import _ from 'lodash';
    import {get, post, formPost} from "../../store/api";
    import {showNotify} from '../../plugin/utils-notify';
    import vmodal from '../../pageComponent/v-modal.vue'

    export default {
        components: {vmodal},
        data() {
            return {
                dateValue: '',
                appName: '',
                pageSize: 10,
                tableData: [],
                searchForm: {
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
                allAppList: [],
                prevList: [],
                showVModal: false,
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
            edit(agentId) {
                this.$router.push({
                  path: '/main/agentSet',
                  query: {
                    agentId: agentId,
                  },
                })
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
                let url = '/api/sysmgr-web/agent-oem/query-agent-list';
                let param = _.assign({}, pageInfo, this.searchForm);
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
                    _.foreach(data, function (value) {
                        self.restaurants1.push({
                            "value": value['text']
                        });
                    });
                })
            },
            getVModal(id) {
                let url = '/api/balance-web/balance-adjust/attachments';
                let param = {
                    id: id
                };
                post(url, param).then(res => {
                    this.prevList = res;
                    this.showVModal = true;
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
