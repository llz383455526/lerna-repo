<template>
    <div class="main">
        <div class="title">{{detail.name}}</div>
        <el-form :model="form" size="small" label-width="120px" ref="form">
            <el-form-item label="任务名称">{{detail.name}}</el-form-item>
            <el-form-item label="任务来源">{{detail.missionSource}}</el-form-item>
            <el-form-item label="发布时间">{{detail.publishTime}}</el-form-item>
            <el-form-item label="结束时间">{{detail.endTime}}</el-form-item>
            <el-form-item label="任务内容">{{detail.missionText}}</el-form-item>
            <el-form-item label="任务绩效">{{detail.performance}}{{detail.performanceUnit}}</el-form-item>
            <el-form-item label="审核">{{detail.stateName}}</el-form-item>
            <el-form-item label="审核备注">{{detail.memo}}</el-form-item>
        </el-form>
        <div class="ml45">
            <template v-if="detail.state != 'pending'">
                <template v-if="detail.state != 'completed'">
                    <el-button type="primary" size="small" @click="show = true">添加{{detail.state == 'settle' ? '结算信息' : '用户信息'}}</el-button>
                    <el-button type="primary" size="small" @click="show_1 = true">导入{{detail.state == 'settle' ? '结算信息' : '用户信息'}}</el-button>
                </template>
                <el-table :data="form.missionUserList">
                    <el-table-column label="姓名" prop="name"></el-table-column>
                    <el-table-column label="身份证" prop="idCard"></el-table-column>
                    <el-table-column label="手机" prop="mobile"></el-table-column>
                    <template v-if="detail.state != 'processing'">
                        <el-table-column label="结算绩效" prop="mobile">
                            <template slot-scope="scope">
                                {{scope.row.performanceAmount | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column label="结算总额" prop="mobile">
                            <template slot-scope="scope">
                                {{scope.row.salaryAmount | formatMoney}}
                            </template>
                        </el-table-column>
                        <el-table-column label="状态" prop="state">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.state" v-if="detail.state != 'completed'">
                                    <el-option v-for="e in auditStatus" :key="e.value" :value="e.value" :label="e.text"></el-option>
                                </el-select>
                                <template v-else>{{scope.row.stateName}}</template>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="操作" v-if="detail.state != 'completed'">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteConsumer(scope.row.clientUserId)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </template>
            <el-button type="primary" @click="submit(true)" size="small" v-if="detail.state == 'settle'">提交</el-button>
            <el-button @click="$router.back()" size="small">返回</el-button>
        </div>
        <el-dialog title="添加" :visible.sync="show" @open="open" width="800px">
            <el-form :model="queryForm" :inline="true" size="small" ref="queryForm">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="queryForm.name"></el-input>
                </el-form-item>
                <el-form-item label="手机" prop="mobile">
                    <el-input v-model="queryForm.mobile"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="query">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableList.list" @selection-change="selectionChange" ref="table">
                <el-table-column type="selection" :selectable="checkSelect"></el-table-column>
                <el-table-column label="ID" prop="id"></el-table-column>
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="电话" prop="mobile"></el-table-column>
                <el-table-column label="状态" prop="stateName"></el-table-column>
                <el-table-column label="来源" prop="customSource"></el-table-column>
            </el-table>
            <ayg-pagination
                v-if="tableList.total"
                :total="tableList.total"
                v-on:handleSizeChange="sizeChange"
                v-on:handleCurrentChange="query"
                :currentPage="queryForm.page">
            </ayg-pagination>
            <span slot="footer">
                <el-button size="small" @click="resetList">关闭</el-button>
                <el-button type="primary" size="small" @click="addToForm">添加</el-button>
            </span>
        </el-dialog>
        <el-dialog title="导入" :visible.sync="show_1" @open="pro = 0" width="800px">
            <div class="dbox">
                <div class="ditem">
                    <div>下载模板文件：</div>
                    <div>
                        <a class="abtn" :href="`/api/sysmgr-web/${detail.state == 'settle' ? '/misson/download-mission-user-performance-import-template' : 'client-user/download-client-user-import-template'}`" :download="`${detail.state == 'settle' ? '结算信息模板' : 'C端客户导入模版'}.xlsx`" target="_blank">下载模板</a>
                        <div>请先下载{{detail.state == 'settle' ? '结算信息模板' : 'C端客户导入模版'}}.xlsx</div>
                    </div>
                </div>
                <div class="ditem">
                    <div>上传文件导入：</div>
                    <div>
                        <el-upload
                            class="form_input"
                            action=""
                            :auto-upload="false"
                            :on-change="upload"
                            :multiple="false"
                            :show-file-list="false"
                            accept=".xlsx, .xls">
                            <div class="up_icon">
                                <div>点击这里上传</div>
                                <div>请上传小于5M的xls或xlsx格式文件</div>
                            </div>
                        </el-upload>
                        <template v-if="pro">
                            <div class="pro_box">
                                <div :style="{ 'width': `${pro}%` }"></div>
                            </div>
                            <span>{{pro}}%</span>
                        </template>
                    </div>
                </div>
            </div>
            <span slot="footer">
                <el-button size="small" @click="show = false">关闭</el-button>
                <el-button type="primary" size="small" @click="show = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {post, get, formPost} from '../../store/api';
import { setTimeout } from 'timers';
export default {
    data() {
        return {
            form: {
                id: '',
                missionUserList: []
            },
            detail: {},
            taskState: [],
            show: false,
            queryForm: {
                mobile: '',
                name: '',
                state: 'Verified',
                page: 1,
                pageSize: 10
            },
            tableList: {},
            changeList: [],
            show_1: false,
            pro: 0,
            frame: '',
            isEnd: true,
            date: 0,
            auditStatus: []
        }
    },
    mounted() {
        this.$route.query.id && this.getDetail()
        get('/api/sysmgr-web/commom/option?enumType=MissionTaskState').then(data => {
            this.taskState = data
        })
        get('/api/sysmgr-web/commom/option?enumType=AuditStatus').then(data => {
            this.auditStatus = data
        })
    },
    methods: {
        getDetail() {
            get(`/api/sysmgr-web/misson/detail?id=${this.$route.query.id}`).then(data => {
                this.detail = data
                this.form.id = data.id
                data.missionUserList.forEach(e => {
                    e.id = e.clientUserId
                })
                this.form.missionUserList = data.missionUserList
            })
        },
        open() {
            this.pro = 0
            this.query()
        },
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.queryForm.page = a
            post('/api/sysmgr-web/client-user/list', this.queryForm).then(data => {
                this.tableList = data
                this.$nextTick(() => {
                    this.tableList.list.forEach(e => {
                        if(this.changeList.filter(ev => ev.id == e.id).length) {
                            this.$refs.table.toggleRowSelection(e)
                        }
                    })  
                })
            })
        },
        sizeChange(a) {
            this.queryForm.pageSize = a
            this.query()
        },
        selectionChange(a) {
            a.forEach(e => {
                if(!this.changeList.filter(ev => ev.id == e.id).length) {
                    this.changeList.push(e)
                }
            })
        },
        resetList() {
            this.changeList = []
            this.show = false
        },
        addToForm() {
            this.form.missionUserList = this.form.missionUserList.concat(this.changeList)
            this.resetList()
            this.submit()
        },
        checkSelect(a) {
            return !this.form.missionUserList.filter(e => e.id == a.id).length
        },
        upload(a) {
            var form = new FormData();
            form.append('fileName', a.name);
            form.append('file', a.raw);
            if(this.detail.state == 'settle') {
                form.append('targetId', '21')
                form.append('targetType', 'sysmgr-mission-user-performance-import')
            }
            else {
                form.append('targetId', '20')
                form.append('targetType', 'sysmgr-mission-user-import')
            }
            form.append('targetExt', JSON.stringify({
                missionId: this.form.id
            }))
            formPost('/api/sysmgr-web/file/upload-ext', form).then(data => {
                this.referId = data.referId
                this.progress()
            });
        },
        progress() {
            this.frame = requestAnimationFrame(this.progress)
            if(this.isEnd && (!this.date || this.date < new Date().getTime() - 1000)) {
                this.isEnd = false
                post('/api/sysmgr-web/file/progress', {
                    id: this.referId
                }, true).then(data => {
                    this.isEnd = true
                    this.date = new Date().getTime()
                    this.pro = data.progress
                    if (this.pro == 100) {
                        cancelAnimationFrame(this.frame)
                        if(data.state == 30 || data.state == 20) {
                            this.form.taskId = data.taskId
                            this.show_1 = false
                            if(data.failCount) {
                                this.$alert(data.desc, '错误提示', {
                                    confirmButtonText: '确定',
                                    type: 'warning',
                                    callback: () => {
                                        this.getDetail()
                                    }
                                })
                            }
                            else {
                                this.$message({
                                    message: '导入成功！',
                                    type: 'success'
                                })
                                this.getDetail()
                            }
                        }
                        if(data.state == 40) {
                            this.$message.error(data.desc)
                        }
                    }
                })
            }
        },
        submit(a) {
            let form = JSON.parse(JSON.stringify(this.form)), missionUserList = []
            form.missionUserList.forEach(e => {
                missionUserList.push({
                    clientUserId: e.clientUserId ? e.clientUserId : e.id,
                    performanceAmount: e.performanceAmount,
                    salaryAmount: e.salaryAmount,
                    state: this.auditStatus.filter(ev => ev.value == e.state).length ? e.state : this.auditStatus[0].value
                })
            })
            form.missionUserList = missionUserList
            post('/api/sysmgr-web/misson/update-mission-user', form).then(data => {
                this.$message({
                    type: 'success',
                    message: `${a ? '修改' : '添加'}用户信息成功！`
                })
                if(a) {
                    this.$router.back()
                }
                else {
                    this.getDetail()
                }
            })
        },
        deleteConsumer(clientUserId) {
            post('/api/sysmgr-web/misson/delete-mission-user', {
                clientUserId: clientUserId,
                id: this.form.id
            }).then(data => {
                this.$message({
                    message: '删除用户信息成功！',
                    type: 'success'
                })
                this.getDetail()
            })
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
.form_input {
    width: 400px;
}
.dbox {
    font-size: 14px;
    color: #666666;
}
.ditem {
    overflow: hidden;
    margin-bottom: 35px;
}
.ditem > div {
    float: left;
}
.abtn {
    display: inline-block;
    width: 80px;
    height: 22px;
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    background-image: url(../../image/download.png);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 7px center;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    text-indent: 22px;
    line-height: 20px;
}
.abtn + div {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
.up_icon {
    width: 228px;
    height: 124px;
    background-image: url(../../image/upload.png);
    background-size: 41px 33px;
    background-position: center 20px;
    background-repeat: no-repeat;
    padding-top: 70px;
    border: 1px solid #D9D9D9;
}
.up_icon > div:nth-child(1) {
    text-align: center;
    font-size: 12px;
    color: #666666;
}
.up_icon > div:nth-child(2) {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
.pro_box {
	position: relative;
	display: inline-block;
	width: 193px;
	height: 10px;
	border: 1px solid #E9E9E9;
	border-radius: 5px;
	margin-top: 6px;
}
.pro_box > div {
	position: absolute;
	top: 1px;
	left: 0;
	height: 8px;
	border-radius: 4px;
	background-color: #108EE9;
}
.pro_box + span {
	margin-top: 6px;
	font-size: 12px;
	color: #999999;
}
.ml45 {
    margin-left: 45px;
}
</style>
