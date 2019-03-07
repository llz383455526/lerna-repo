<template>
    <div class="r_main">
        <div style="margin-bottom:30px;">{{$route.query.id ? '修改' : '新增'}}企业客户审核信息</div>
        <el-form :model="form" :rules="rules" size="small" label-width="120px" ref="form">
            <el-form-item label="企业名称" prop="companyName">
                <el-input class="form_input" v-model="form.companyName"></el-input>
            </el-form-item>
            <el-form-item label="企业负责人" prop="chargeByName">
                <el-input class="form_input" v-model="form.chargeByName"></el-input>
            </el-form-item>
            <el-form-item label="企业负责人电话" prop="chargePhone">
                <el-input class="form_input" v-model="form.chargePhone"></el-input>
            </el-form-item>
            <el-form-item label="企业负责人邮箱" prop="chargeEmail">
                <el-input class="form_input" v-model="form.chargeEmail"></el-input>
            </el-form-item>
            <el-form-item label="企业主营业务" prop="mainBusiness">
                <el-input class="form_input" v-model="form.mainBusiness"></el-input>
            </el-form-item>
            <el-form-item label="企业相关描述" prop="remark">
                <el-input class="form_input" type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
            <el-form-item label="补充附件">
                <el-upload
                    class="form_input"
                    action
                    :auto-upload="false"
                    :on-change="upload"
                    :on-remove="remove"
                    :multiple="true"
                    :show-file-list="true"
                    :file-list="fileList"
                    accept=".pdf, .doc, .docx, .png, .jpg, .gif">
                    <el-button size="small" type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <template v-if="form.id">
                <el-form-item label="状态">
                    <el-select class="form_input" v-model="form.action">
                        <el-option v-for="e in auditStatus" :key="e.value" :label="e.text" :value="e.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="拒绝理由" v-if="form.action == 'reject'">
                    <el-select class="form_input" v-model="form.rejectType">
                        <el-option v-for="e in InterimCompany" :key="e.value" :label="e.text" :value="e.value"></el-option>
                    </el-select>
                </el-form-item>
            </template>
            <el-form-item>
                <el-button type="primary" @click="submit">提交</el-button>
                <el-button @click="$router.back()">取消</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
export default {
    data() {
        return {
            form: {
                id: '',
                chargeByName: '',
                chargeEmail: '',
                chargePhone: '',
                companyName: '',
                mainBusiness: '',
                remark: '',
                referIds: [],
                // 审核
                action: '',
                rejectType: ''
            },
            rules: {
                companyName: [
                    { required: true, message: '请填写企业名称', trigger: 'blur' }
                ],
                chargePhone: [
                    { pattern: /^[\d\-]+$/, message: '请正确输入电话号码'}
                ],
                mainBusiness: [
                    { required: true, message: '请填写企业主营业务', trigger: 'blur' }
                ],
                remark: [
                    { required: true, message: '请填写企业相关描述', trigger: 'blur' }
                ]
            },
            fileList: [],
            auditStatus: [],
            InterimCompany: []
        }
    },
    mounted() {
        this.$route.query.id && post(`/api/sysmgr-web/interim-company/detail?id=${this.$route.query.id}`).then(data => {
            for(let k in this.form) {
                this.form[k] = data[k]
            }
            this.form.action = data.status
            if(data.auditMemoList[0]) {
                this.form.rejectType = data.auditMemoList[0].rejectType
            }
            data.attachments.forEach(e => {
                this.fileList.push({
                    name: e.displayname,
                    url: e.downloadCode,
                    referId: e.id
                })
            })
        })
        get('/api/sysmgr-web/commom/option?enumType=AuditStatus').then(data => {
            this.auditStatus = data
        })
        get('/api/sysmgr-web/commom/option?enumType=InterimCompany').then(data => {
            this.InterimCompany = data
        })
    },
    methods: {
        upload(a) {
            var form = new FormData();
            form.append("fileName", a.name);
            form.append("file", a.raw);
            formPost('/api/sysmgr-web/file/upload', form).then(data => {
                this.fileList.push({
                    name: data.fileName,
                    url: data.downloadCode,
                    referId: data.referId
                })
                this.$message({
                    type: "success",
                    message: "上传成功！"
                });
            });
        },
        remove(a) {
            this.fileList = this.fileList.filter(e => e.referId != a.referId)
        },
        submit() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    this.fileList.forEach(e => {
                        this.form.referIds.push(e.referId)
                    })
                    let form = JSON.parse(JSON.stringify(this.form))
                    delete form.action
                    delete form.rejectType
                    post(`/api/sysmgr-web/interim-company/${this.form.id ? 'update' : 'add'}`, form).then(data => {
                        if(this.form.action) {
                            post('/api/sysmgr-web/interim-company/audit', {
                                action: this.form.action,
                                id: this.form.id,
                                rejectType: this.form.rejectType
                            }).then(data => {
                                this.msgAndBack()
                            })
                        }
                        else {
                            this.msgAndBack()
                        }
                    })
                }
            })
        },
        msgAndBack() {
            this.$message({
                type: 'success',
                message: `${this.form.id ? '修改' : '新增'}成功！`
            })
            this.$router.back()
        }
    }
}
</script>
<style scoped>
.r_main {
    padding: 15px;
    background-color: #fff;
}
.form_input {
    width: 400px;
}
</style>
