<template>
    <div class="main">
        <div class="title">{{$route.query.id ? `修改任务-${form.name}` : '新增任务信息'}}</div>
        <el-form :model="form" :rules="rules" size="small" label-width="120px" ref="form">
            <el-form-item label="任务名称" prop="name">
                <el-input class="form_input" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="任务来源" prop="missionSource">
                <el-input class="form_input" v-model="form.missionSource"></el-input>
            </el-form-item>
            <el-form-item label="发布时间" prop="publishTime">
                <el-date-picker class="form_input" v-model="form.publishTime" type="datetime" placeholder="发布时间" value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
            </el-form-item>
            <el-form-item label="结束时间" prop="endTime">
                <el-date-picker class="form_input" v-model="form.endTime" type="datetime" placeholder="发布时间" value-format='yyyy-MM-dd HH:mm:ss'></el-date-picker>
            </el-form-item>
            <el-form-item label="任务内容" prop="missionText">
                <el-input class="form_input" v-model="form.missionText" type="textarea"></el-input>
            </el-form-item>
            <el-form-item label="任务绩效" prop="performance">
                <el-input class="input_250" v-model="form.performance"></el-input>
                <el-select class="input_150" v-model="form.performanceUnit">
                    <el-option v-for="e in unitList" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button @click="$router.back()">取消</el-button>
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
                endTime: '',
                id: '',
                missionText: '',
                missionSource: '',
                name: '',
                performance: '',
                performanceUnit: '',
                publishTime: ''
            },
            rules: {
                name: [
                    { required: true, message: '请填写任务名称', trigger: 'blur' }
                ],
                missionSource: [
                    { required: true, message: '请填写任务来源', trigger: 'blur' }
                ],
                publishTime: [
                    { required: true, message: '请选择发布时间', trigger: 'blur' }
                ],
                performance: [
                    { required: true, message: '请填写绩效', trigger: 'blur' },
                    { pattern: /^[\d]+$/, message: '请正确填写绩效（数字）', trigger: 'blur'}
                ]
            },
            unitList: []
        }
    },
    mounted() {
        this.$route.query.id && get(`/api/sysmgr-web/misson/detail?id=${this.$route.query.id}`).then(data => {
            for(let k in this.form) {
                this.form[k] = data[k]
            }
        })
        get('/api/sysmgr-web/commom/option?enumType=PerformanceUnit').then(data => {
            this.unitList = data
            this.form.performanceUnit = data[0].value
        })
    },
    methods: {
        submit() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    post(`/api/sysmgr-web/misson/${this.$route.query.id ? 'update' : 'add'}`, this.form).then(data => {
                        this.$message({
                            type: 'success',
                            message: `${this.$route.query.id ? '修改' : '新增'}任务成功！`
                        })
                        this.$router.back()
                    })
                }
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
.input_250 {
    width: 250px;
}
.input_150 {
    width: 150px;
}
</style>
