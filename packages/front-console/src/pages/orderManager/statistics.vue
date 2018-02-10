<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0 30px 30px;">失败率统计</div>

        <el-form :inline="true" :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="请求起止时间:" size="small">
                <el-date-picker v-model="dateValue" type="datetimerange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="exportXls">导出xls</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="appName" label="客户名称"></el-table-column>
            <el-table-column prop="startAt" label="开始时间">
                <template slot-scope="scope">
                    <span>{{scope.row.startAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="endAt" label="结束时间">
                <template slot-scope="scope">
                    <span>{{scope.row.endAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="failCount" label="失败次数"></el-table-column>
            <el-table-column prop="totalCount" label="请求总数"></el-table-column>
            <el-table-column prop="failRate" label="失败率"></el-table-column>
        </el-table>
    </div>
</template>

<script>
    import {post, get} from '../../store/api'
    import {formatTime} from '../../plugin/utils-functions'
    import {baseUrl} from '../../config/address'
    export default {
        // name: "statistics.vue"
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                currentChangeBySetting: false,
                tableList: '',
                dateValue: '',
                formSearch: {

                }
            }
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
            exportXls() {
                let startAt = '';
                let endAt = '';
                if (this.dateValue) {
                    startAt = formatTime(this.dateValue[0], 'yyyy-MM-dd hh:mm:ss');
                    endAt = formatTime(this.dateValue[1], 'yyyy-MM-dd hh:mm:ss');
                }
                window.location.href = baseUrl + '/pay-order-statistics/export-list'
                    + '?startAt=' + startAt
                    + '&endAt=' + endAt;
            },
            requestAction(pageInfo) {
                let startAt = '';
                let endAt = '';
                if (this.dateValue) {
                    startAt = formatTime(this.dateValue[0], 'yyyy-MM-dd hh:mm:ss');
                    endAt = formatTime(this.dateValue[1], 'yyyy-MM-dd hh:mm:ss');
                }
                let param = {
                    startAt: startAt,
                    endAt: endAt,

                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                post('/pay-order-statistics/query-list', param).then(data => {
                    this.tableList = data
                })
            },
        },
        created: function () {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
        },
    }
</script>

<style>
    .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
        margin-left: 0;
    }
</style>