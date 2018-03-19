<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0px 30px 30px;">电子签约记录</div>

        <el-form :inline="true" ref="formSearch" onsubmit="return false;" :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="应用名称:"   size="small" prop="extrSystemIds">
                <el-select multiple v-model="formSearch.extrSystemIds">
                    <el-option v-for="(item, index) in extrSystemOptions" :label="item.extrSystemName" :value="item.extrSystemId" :key="item.extrSystemId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="签约订单号:" size="small" prop="orderId">
                <el-input style="width: 150px" v-model="formSearch.orderId" placeholder="签约订单号"></el-input>
            </el-form-item>
            <el-form-item label="姓名:" size="small" prop="personalName">
                <el-input style="width: 150px" v-model="formSearch.personalName" placeholder="姓名"></el-input>
            </el-form-item>
            <el-form-item label="证件号:" size="small" prop="personalIdentity">
                <el-input style="width: 150px" v-model="formSearch.personalIdentity" placeholder="证件号"></el-input>
            </el-form-item>
            <el-form-item label="手机号:" size="small" prop="personalMobile">
                <el-input style="width: 150px" v-model="formSearch.personalMobile" placeholder="手机号"></el-input>
            </el-form-item>
            <el-form-item label="签约服务商:" size="small" prop="serverName">
                <el-input style="width: 150px" v-model="formSearch.serverName" placeholder="签约服务商"></el-input>
            </el-form-item>
            <el-form-item label="发起签约时间范围:" size="small" prop="dateValue">
                <el-date-picker v-model="formSearch.dateValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="签约状态:" size="small" prop="signState">
                <el-select v-model="formSearch.signState">
                    <el-option v-for="(item, index) in signStateOptions" :label="item.value" :value="item.key" :key="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="订单状态:" size="small" prop="orderState">
                <el-select v-model="formSearch.orderState">
                    <el-option v-for="(item, index) in orderStateOptions" :label="item.value" :value="item.key" :key="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" native-type="submit" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
                <el-button size="small" @click="exportXls">导出xls</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="eContractList.data" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="extrSystemName" label="应用名称"></el-table-column>
            <el-table-column prop="orderId" label="签约订单号"></el-table-column>
            <el-table-column prop="createTime" label="发起时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime |formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="personalName" label="姓名"></el-table-column>
            <el-table-column prop="personalIdentity" label="证件号"></el-table-column>
            <el-table-column prop="personalMobile" label="手机号"></el-table-column>
            <el-table-column prop="serverName" label="签约服务商"></el-table-column>
            <el-table-column prop="signStateDesc" label="签约状态"></el-table-column>
            <el-table-column prop="certStateDesc" label="身份证认证状态"></el-table-column>
            <el-table-column prop="orderStateDesc" label="订单状态"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <a v-if="scope.row.downloadUrl" class="operation">合同下载</a>
                </template>
            </el-table-column>
        </el-table>

        <ayg-pagination v-if="eContractList.total" :total="eContractList.total" :currentPage="currentPage"
                v-on:handleSizeChange="handleSizeChange"
                v-on:handleCurrentChange="handleCurrentChange"></ayg-pagination>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import _ from 'lodash'
    import {formatTime, urlEncode} from '../../plugin/utils-functions'
    import {baseUrl} from '../../config/address'

    export default {
        name: "credit-bill",
        created () {
            this.search()
            this.$store.dispatch('getExtrSystemOptions')
            this.$store.dispatch('getSignStateOptions')
            this.$store.dispatch('getOrderStateOptions')
        },
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                formSearch: {
                    extrSystemIds:[],
                    dateValue: '',
                    signState:'',
                    orderState:'',
                    orderId:'',
                    personalName:'',
                    personalIdentity:'',
                    personalMobile:'',
                    serverName:''
                }
            }
        },
        computed: {
            ...mapGetters({
                eContractList: 'eContractList',
                extrSystemOptions: 'extrSystemOptions',
                signStateOptions: 'signStateOptions',
                orderStateOptions: 'orderStateOptions',
            })
        },
        methods: {
            search: function () {
                this.currentPage = 1;
                this.requestAction({
                    pageNo: 1,
                    pageSize: this.pageSize,
                });
            },
            clear: function () {
                this.$refs['formSearch'].resetFields();
                this.search()
            },
            exportXls: function () {
                let startTime = '';
                let endTime = '';
                if (this.formSearch.dateValue) {
                    startTime = formatTime(this.formSearch.dateValue[0], 'yyyy-MM-dd');
                    endTime = formatTime(this.formSearch.dateValue[1], 'yyyy-MM-dd');
                }
                
                window.location.href = baseUrl + '/api/econtract/inner/export?' + urlEncode(this.formSearch)
            },
            handleSizeChange(value) {
                this.pageSize = value;
                if (this.currentPage == 1) {
                    this.requestAction({
                        pageNo: 1,
                        pageSize: value,
                    });
                } else {
                    this.currentPage = 1;
                }
            },
            handleCurrentChange(value) {
                this.currentPage = value;
                this.requestAction({
                    pageNo: value,
                    pageSize: this.pageSize,
                });
            },
            requestAction: function (pageInfo) {
                let startTime = '';
                let endTime = '';
                if (this.formSearch.dateValue) {
                    startTime = formatTime(this.formSearch.dateValue[0], 'yyyy-MM-dd');
                    endTime = formatTime(this.formSearch.dateValue[1], 'yyyy-MM-dd');
                }
                let param = {
                    startTime: startTime,
                    endTime: endTime,
                    pageNo: pageInfo.pageNo,
                    pageSize: pageInfo.pageSize
                };
                param = _.assign(param, this.formSearch)
                this.$store.dispatch('getEContractList', param);
            }
        }
    }
</script>

<style scoped>

</style>