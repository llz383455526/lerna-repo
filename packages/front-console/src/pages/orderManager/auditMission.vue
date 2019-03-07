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
            <el-form-item label="审核备注" prop="memo">
                <el-input class="form_input" v-model="form.memo" v-if="detail.state == 'pending'"></el-input>
                <template v-else>{{form.memo}}</template>
            </el-form-item>
            <el-form-item>
                <template v-if="detail.state == 'pending'">
                    <el-button type="primary" @click="submit('pass')">审核通过</el-button>
                    <el-button @click="submit('reject')">审核不通过</el-button>
                </template>
                <template v-else>
                    <el-button type="primary" @click="next" v-if="detail.state != 'completed'">下一步</el-button>
                    <el-button @click="$router.back()">返回</el-button>
                </template>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import {post, get} from '../../store/api';
export default {
    data() {
        return {
            form: {
                action: '',
                id: '',
                memo: ''
            },
            detail: {},
            taskState: []
        }
    },
    mounted() {
        this.$route.query.id && get(`/api/sysmgr-web/misson/detail?id=${this.$route.query.id}`).then(data => {
            this.detail = data
            this.form.id = data.id
            this.form.action = data.state
            this.form.memo = data.memo
        })
        get('/api/sysmgr-web/commom/option?enumType=MissionTaskState').then(data => {
            this.taskState = data
        })
    },
    methods: {
        submit(a) {
            this.form.action = a
            post('/api/sysmgr-web/misson/audit', this.form).then(data => {
                this.$message({
                    type: 'success',
                    message: '审核成功！'
                })
                this.$router.back()
            })
        },
        next() {
            post('/api/sysmgr-web/misson/next-step', {
                id: this.form.id
            }).then(data => {
                this.$message({
                    type: 'success',
                    message: '审核成功！'
                })
                this.$router.back()
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
</style>
