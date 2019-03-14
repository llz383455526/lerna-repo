<template>
    <div class="main-container">
        <el-form :model="form" size="small" :inline="true" ref="form">
            <el-form-item label="时间">
                <el-date-picker
                    v-model="range"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    @change="getTime">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select v-model="form.status">
                    <el-option value="" label="全部"></el-option>
                    <el-option v-for="e in statusList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="clear">清除</el-button>
            </el-form-item>
        </el-form>
        <router-link to="forecastFlowList" v-if="!check">
            <el-button type="primary">录入预测流水</el-button>
        </router-link>
        <!-- <el-button type="primary" @click="show = true">导出文件</el-button> -->
        <el-table class="mt20" :data="listData.list">
            <el-table-column label="文件名称" prop="displayname"></el-table-column>
            <el-table-column label="操作时间">
                <template slot-scope="scope">
                    {{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}
                </template>
            </el-table-column>
            <el-table-column label="操作人" prop="createByName"></el-table-column>
            <el-table-column label="状态" prop="statusName"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <a :href="`/api/sysmgr-web/file/download?downloadCode=${scope.row.downloadCode}`">
                        <el-button type="text">下载文件</el-button>
                    </a>
                    <el-button type="text" v-if="scope.row.status == 'enabled'" @click="edit(scope.row.importTaskId)">修改</el-button>
                    <el-button type="text" v-if="scope.row.status == 'enabled'" @click="cancellation(scope.row.importTaskId)">作废</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="listData.total"
            :total="listData.total"
            v-on:handleSizeChange="sizeChange"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
        <el-dialog title="导出销售预测流水表格" :visible.sync="show" width="500px">
            <el-form :model="form">
                <el-form-item label="选择时间">
                    <el-date-picker
                        v-model="form.v1"
                        type="date"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期">
                    </el-date-picker>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="show = false">取消</el-button>
                <el-button type="primary" @click="show = false">确认导出</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
export default {
    data() {
        return {
            form: {
                page: 1,
                pageSize: 10,
                startAt: '',
                endAt: '',
                status: ''
            },
            show: false,
            range: [],
            statusList: [
                {
                    text: '无效',
                    value: 'disabled'
                },
                {
                    text: '有效',
                    value: 'enabled'
                }
            ],
            listData: {},
            check: false
        }
    },
    mounted() {
        this.query()
        this.getStatus()
    },
    methods: {
        getTime() {
            this.form.startAt = this.range[0] ? this.range[0] : ''
            this.form.endAt = this.range[1] ? this.range[1] : ''
        },
        query(a) {
            if(isNaN(a)) {
                a= 1
            }
            this.form.page = a
            post('/api/invoice-web/invoice-monitor/sales-forecast-file-query', this.form).then(data => {
                this.listData = data
            })
        },
        sizeChange(a) {
            this.form.pageSize = a
            this.query()
        },
        clear() {
            this.$refs.form.resetFields()
            this.range = []
            this.getTime()
        },
        edit(importTaskId) {
            this.$confirm('是否确认修改,确认则删除本条数据', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                post('/api/invoice-web/invoice-monitor/sales-forecast-file-disabled', {
                    importTaskId,
                    isUpdate: true
                }).then(data => {
                    this.$router.push('forecastFlowList')
                })
            }).catch(() => {})
        },
        cancellation(importTaskId) {
            this.$confirm('是否确认作废此文件？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                post('/api/invoice-web/invoice-monitor/sales-forecast-file-disabled', {
                    importTaskId,
                    isUpdate: false
                }).then(data => {
                    this.query()
                    this.getStatus()
                    this.$message({
                        type: 'success',
                        message: '作废成功！'
                    })
                })
            }).catch(() => {})
        },
        getStatus() {
            get('/api/invoice-web/invoice-monitor/check-sales-forecast-file-upload').then(data => {
                this.check = data
            })
        }
    }
}
</script>
<style scoped>
.main-container {
    background-color: #fff;
    padding: 15px;
}
.mt20 {
    margin-top: 20px;
}
</style>
