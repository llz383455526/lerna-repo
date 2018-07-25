<template>
    <div class="main">
        <div class="title">签约批次记录</div>
        <el-form :model="form" :inline="true" ref="form">
            <el-form-item label="签约批次号" prop="batchId">
                <el-input v-model="form.batchId" size="small"></el-input>
            </el-form-item>
            <el-form-item label="合同模板" prop="templateName">
                <el-select
                    class="form_input_short"
                    v-model="form.templateName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getName"
                    :loading="loading"
                    size="small">
                    <el-option
                        v-for="e in names"
                        :key="e.name"
                        :label="e.name"
                        :value="e.name">
                    </el-option>
                </el-select>
                <!-- <el-input v-model="form.templateName" size="small"></el-input> -->
            </el-form-item>
            <el-form-item label="发起时间">
                <el-date-picker
                    v-model="range"
                    type="daterange"
                    range-separator="至"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    size="small"
                    @change="getTime">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="query">查询</el-button>
                <el-button type="text" size="small" @click="reset('form')">清空所有条件</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list">
            <el-table-column label="发起签约时间" prop="createTimeDesc"></el-table-column>
            <el-table-column label="签约批次号" prop="batchId"></el-table-column>
            <el-table-column label="合同模板名称" prop="templateName"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="reCall(scope.row)" v-if="scope.row.canRenotify">重发通知</el-button>
                    <el-button type="text" size="small" @click="record(scope.row)">查看签约记录</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="total"
            :total="total"
            v-on:handleSizeChange="setSize"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.pageNo">
        </ayg-pagination>
    </div>
</template>
<script>
import { post, get } from '../../store/api';
export default {
    data() {
        return {
            form: {
                templateName: '',
                batchId: '',
                startTime: '',
                endTime: '',
                pageNo: 1,
                pageSize: 10
            },
            names: [],
            objects: [],
            list: [],
            total: 0,
            range: [],
            partys: ['甲方', '乙方', '丙方']
        }
    },
    mounted() {
        Object.assign(this.form, this.$route.query)
        this.query()
    },
    methods: {
        getName(a) {
            if(a !== '') {
                post('/api/econtract/template/qrylist', {
                    name: a,
                    pageNo: 1,
                    pageSize: 10
                }).then(data => {
                    this.names = data.data
                })
            }
        },
        getObject(a) {
            post('/api/econtract/user/company/qrylist', {
                name: a,
                pageNo: 1,
                pageSize: 10
            }).then(data => {
                this.objects = data.data
            })
        },
        query(a) {
            if(isNaN(a)){
                a = 1
            }
            this.form.pageNo = a
            post('/api/econtract/order/batchqry', this.form).then(data => {
                this.list = data.data
                this.total = data.total
            })
        },
        getTime() {
            this.form.startTime = this.range[0]
            this.form.endTime = this.range[1]
        },
        reset(a) {
            this.range = []
            this.form.startTime = ''
            this.form.endTime = ''
            this.$refs[a].resetFields()
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        launch(a) {
            sessionStorage.setItem('sign', JSON.stringify(a))
            this.$router.push('uploadObject')
        },
        reCall(a) {
            this.$confirm(`最近通知时间 ${a.lastNotifyTimeDesc} 确认重新发送通知吗？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {    
					post(`/api/econtract/order/batchrenotify?batchId=${a.batchId}`).then(data => {
						this.$message({
							type: 'success',
							message: '已重发通知！'
						})
                    })
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消！'
					})
				})
        },
        record(a) {
            this.$router.push(`index?batchId=${a.batchId}`)
        }
    }
}
</script>
<style scoped>
.main {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
}
.title {
    margin-bottom: 20px;
}
.form_input_short {
    width: 200px;
}
</style>
