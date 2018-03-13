<template>
    <div style="background-color:#fff;padding:15px;">
        <div style="margin-bottom:30px;">合同管理</div>
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="客户名称" size="small" prop="customerName">
                <el-input v-model="formSearch.customerName"></el-input>
            </el-form-item>
            <el-form-item label="服务商名称" size="small" prop="serviceCompanyName">
                <el-input v-model="formSearch.serviceCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="结算周期" size="small" prop="settleType">
                <el-select v-model="formSearch.settleType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in options" :key="item.value" :label="item.label"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="请求起止时间:" size="small">
                <el-date-picker
                        v-model="dateValue"
                        type="datetimerange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd hh:mm:ss">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>
        <el-button size="small" @click="routerPush('/main/contract/create')">新增</el-button>
        <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="customerName" label="客户名称" width="200"></el-table-column>
            <el-table-column prop="serviceCompanyName" label="服务商名称" width="220"></el-table-column>
            <el-table-column prop="settleTypeName" label="结算周期"></el-table-column>
            <el-table-column prop="serviceFee" label="服务费收费比例"></el-table-column>
            <el-table-column prop="contractStartDate" label="合同开始时间"></el-table-column>
            <el-table-column prop="contractEndDate" label="合同结束时间"></el-table-column>
            <el-table-column prop="lastUpdateAt" label="更新时间" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.lastUpdateAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="handleLook(scope.row.id)" type="text" size="medium" style="padding:0;">查看</el-button>
                    <el-button @click="handleEdit(scope.row.id)" type="text" size="medium" style="padding:0;">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
    </div>
</template>

<script>
    import {post, get} from '../../store/api';
    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                tableList: [],
                options: [],
                formSearch: {
                    customerName: '',
                    serviceCompanyName: '',
                    settleType: '',
                    startAt: '',
                    endAt: ''
                },
                dateValue: ''
            }
        },
        methods: {
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dateValue = '';
            },
            search() {
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
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
                let startAt = '';
                let endAt = '';
                if (this.dateValue) {
                    startAt = this.dateValue[0];
                    endAt = this.dateValue[1];
                }
                let param = {
                    startAt: startAt,
                    endAt: endAt,
                    customerName: this.formSearch.customerName,
                    serviceCompanyName: this.formSearch.serviceCompanyName,
                    settleType: this.formSearch.settleType,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                post('/api/console-dlv/contract/query-contracts', param).then(data => {
                    this.tableList = data
                })
            },
            routerPush(val) {
                this.$router.push({path: val});
            },
            getSettleType() {
                let url = '/api/console-dlv/option/get-by-type';
                get(url, {type: 'SettleType'}).then(data => {
                    this.options = data
                })
            },
            handleLook(id) {
                this.$router.push({
                    path: '/main/contract/preview',
                    query: {contractId: id}
                });
            },
            handleEdit(id) {
                this.$router.push({
                    path: '/main/contract/create',
                    query: {contractId: id}
                });
            }
        },
        created() {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.getSettleType();
        },

    }
</script>

<style scoped>
    .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
        margin-left: 0;
    }
</style>