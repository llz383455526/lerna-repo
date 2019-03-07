<template>
    <div class="main">
        <div class="title">{{$route.query.id ? '修改' : '新增'}}C端客户信息</div>
        <el-form :model="form" :rules="rules" label-width="120px" size="small" ref="form">
            <el-form-item label="姓名" prop="name">
                <el-input class="form_input" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="手机" prop="mobile">
                <el-input class="form_input" v-model="form.mobile"></el-input>
            </el-form-item>
            <el-form-item label="身份证" prop="idCard">
                <el-input class="form_input" v-model="form.idCard"></el-input>
            </el-form-item>
            <el-form-item label="客户来源" prop="customSource">
                <el-input class="form_input" v-model="form.customSource"></el-input>
            </el-form-item>
            <el-form-item label="客户状态" prop="state">
                <el-select class="form_input" v-model="form.state">
                    <el-option v-for="e in clientUserState" :key="e.value" :label="e.text" :value="e.value"></el-option>
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
import { post, get, importPost } from "../../store/api"
import { valid } from 'semver';
export default {
    data() {
        return {
            form: {
                customSource: '',
                id: '',
                idCard: '',
                mobile: '',
                name: '',
                state: ''
            },
            rules: {
                name: [
                    { required: true, message: '请填写姓名', trigger: 'blur' }
                ],
                mobile: [
                    { pattern: /^1[34578]\d{9}$/, message: '请正确输入手机号码', trigger: 'blur'}
                ],
                idCard: [
                    { pattern: /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/, message: '请正确输入身份证', trigger: 'blur'}
                ],
                customSource: [
                    { required: true, message: '请填写客户来源', trigger: 'blur' }
                ],
                state: [
                    { required: true, message: '请选着状态', trigger: 'blur' }
                ]
            },
            clientUserState: []
        }
    },
    mounted() {
        this.$route.query.id && get(`/api/sysmgr-web/client-user/detail?id=${this.$route.query.id}`).then(data => {
            for(let k in this.form) {
                this.form[k] = data[k]
            }
        })
        get('/api/sysmgr-web/commom/option?enumType=ClientUserState').then(data => {
            this.clientUserState = data
        })
    },
    methods: {
        submit() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    post(`/api/sysmgr-web/client-user/${this.form.id ? 'update' : 'add'}`, this.form).then(data => {
                        this.$message({
                            type: 'success',
                            message: `${this.form.id ? '修改' : '新增'}成功！`
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
</style>
