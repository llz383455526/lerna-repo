<template>
    <div class="main">
        <div class="title">新增签约对象</div>
        <el-form :model="form" :rules="rules" label-width="150px" ref="form">
            <el-form-item label="企业名称：" prop="name">
                <el-select
                    class="form_input"
                    v-model="form.name"
                    filterable
                    placeholder="请输入关键词"
                    @change="getCompanyId"
                    size="small">
                    <el-option
                        v-for="e in company"
                        :key="e.id"
                        :label="e.name"
                        :value="e.name">
                    </el-option>
                </el-select>
                <!-- <el-input v-model="" class="form_input"></el-input> -->
            </el-form-item>
            <el-form-item label="公司简称：" prop="abbrName">
                <el-input v-model="form.abbrName" class="form_input" size="small"></el-input><i class="el-icon-question" title="公司简称作为发送给签约对象时短信所显示的公司名称"></i>
            </el-form-item>
            <!-- <el-form-item label="注册账号：" prop="account">
                <el-input v-model="form.account" class="form_input" size="small"></el-input>
            </el-form-item> -->
            <el-form-item label="工商注册号：" prop="regCode">
                <el-input v-model="form.regCode" class="form_input" size="small"></el-input>
                <span class="info">如果是三证合一，则填写统一社会信用代码</span>
            </el-form-item>
            <el-form-item label="税务登记号：" prop="taxCode">
                <el-input v-model="form.taxCode" class="form_input" size="small"></el-input>
                <span class="info">如果是三证合一，则填写统一社会信用代码</span>
            </el-form-item>
            <el-form-item label="组织机构代码：" prop="orgCode">
                <el-input v-model="form.orgCode" class="form_input" size="small"></el-input>
                <span class="info">如果是三证合一，则填写统一社会信用代码</span>
            </el-form-item>
            <el-form-item label="法人姓名：" prop="legalPerson">
                <el-input v-model="form.legalPerson" class="form_input" size="small"></el-input>
            </el-form-item>
            <el-form-item label="法人证件类型：" prop="legalPersonIdentityType">
                <el-select v-model="form.legalPersonIdentityType" class="form_input" size="small">
                    <el-option v-for="e in type" :key="e" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="法人证件号码：" prop="legalPersonIdentity">
                <el-input v-model="form.legalPersonIdentity" class="form_input" size="small"></el-input>
            </el-form-item>
            <el-form-item label="法人手机号码：" prop="legalPersonMobile">
                <el-input v-model="form.legalPersonMobile" class="form_input" size="small"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="submit">提交</el-button>
                <el-button size="small" @click="back">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { post, get, importPost } from "../../store/api"
export default {
    data() {
        return {
            form: {
                name: '',
                companyId: '',
                abbrName: '',
                // account: '',
                regCode: '',
                taxCode: '',
                orgCode: '',
                legalPerson: '',
                legalPersonIdentityType: "0",
                legalPersonIdentity: '',
                legalPersonMobile: ''
            },
            rules: {
                name: [
                    { required: true, message: '请输入公司名称', trigger: 'blur' }
                ],
                abbrName: [
                    { required: true, message: '请输入公司简称', trigger: 'blur' }
                ],
                regCode: [
                    { required: true, message: '请输入工商注册号', trigger: 'blur' },
                    { pattern: /^[\w]+$/, message: '请正确输入工商注册号'}
                ],
                taxCode: [
                    { required: true, message: '请输入税务登记号', trigger: 'blur' },
                    { pattern: /^[\w]+$/, message: '请正确输入税务登记号'}
                ],
                orgCode: [
                    { required: true, message: '请输入组织机构代码', trigger: 'blur' },
                    { pattern: /^[\w]+$/, message: '请正确输入组织机构代码'}
                ],
                legalPerson: [
                    { required: true, message: '请输入名字', trigger: 'blur' }
                ],
                legalPersonIdentityType: [
                    { required: true, message: '请选择证件类型', trigger: 'blur' }
                ],
                legalPersonIdentity: [
                    { required: true, message: '请输入证件号码', trigger: 'blur' },
                    { pattern: /^[\w]+$/, message: '请正确输入证件号码'}
                ],
                legalPersonMobile: [
                    { required: true, message: '请输入手机号码', trigger: 'blur' },
                    { pattern: /^[\d\-]+$/, message: '请正确输入手机号码'}
                ]
            },
            type: [
                {
                    text: '居民身份证',
                    value: '0'
                },
                {
                    text: '护照',
                    value: '1'
                }
            ],
            company: []
        }
    },
    mounted() {
        get('/api/sysmgr-web/commom/company').then(data => {
                    console.log(data)
                    this.company = data
                })
    },
    methods: {
        submit() {
            this.$refs['form'].validate(valid => {
                if(valid) {
                    post('/api/econtract/user/company/add', this.form).then(data => {
                        console.log(data)
                        this.$message({
                            type: 'success',
                            message: '添加成功！'
                        })
                        this.back()
                    })
                }
            })
        },
        getCompanyId() {
            this.company.forEach(e => {
                if(e.name == this.form.name) {
                    this.form.companyId = e.id
                }
            })
        },
        back() {
            this.$router.back()
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
.el-icon-question {
    color: red;
    margin-left: 15px;
}
.info {
    font-size: 14px;
    color: #999;
    margin-left: 10px;
}
</style>
