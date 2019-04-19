<template>
    <el-dialog title="录入物流信息" :visible.sync="show" width="500px">
        <el-form :model="form" :rules="rules" label-width="80px" size="small" ref="form">
            <el-form-item label="物流公司" prop="expressCompany">
                <el-input class="form_input" v-model="form.expressCompany"></el-input>
            </el-form-item>
            <el-form-item label="物流单号" prop="expressOrderNo">
                <el-input class="form_input" v-model="form.expressOrderNo"></el-input>
            </el-form-item>
            <el-form-item label="寄送凭证" prop="expressVoucherName">
                <el-upload
                    class="form_input"
                    :action="`/api/econtract/template/parsefile`"
                    :auto-upload="false"
                    :on-change="upload"
                    :multiple="false"
                    :file-list="fileList"
                    accept="image/*, .pdf">
                    <!-- .xlsx, .xls -->
                    <el-button type="primary">点击上传</el-button>
                </el-upload>
            </el-form-item>
            <el-form-item>
                <el-button @click="show = false">取消</el-button>
                <el-button type="primary" @click="submit">确认</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>
<script>
import { get, post, importPost, formPost } from "../../../store/api"
import { invoiceApi, workflow, sysmgr } from "src/api"
export default {
    data() {
        return {
            show: false,
            orderId: '',
            taskId: '',
            form: {
                expressCompany: '',
                expressOrderNo: '',
                expressVoucherName: '',
                addExpressTime: ''
            },
            rules: {
                expressCompany: [
                    { required: true, message: "请填写快递公司", trigger: "blur"}
                ],
                expressOrderNo: [
                    { required: true, message: "请填写快递单号", trigger: "blur"}
                ],
                // expressVoucherName: [
                //     { required: true, message: "请上传快递凭证", trigger: "blur"}
                // ]
            },
            fileList: []
        }
    },
    methods: {
        transmit(a) {
            Object.assign(this, a)
            this.fileList = []
            this.form.expressVoucherName && this.fileList.push({
                name: this.form.expressVoucherName
            })
            // this.$refs.form && this.$refs.form.resetFields()
            // this.form.expressVoucherName = ''
        },
        upload(a) {
            var form = new FormData();
            form.append('fileName', a.name);
            form.append('file', a.raw);
            form.append('targetType', 'invoiceExpress')
            form.append('targetId', this.orderId)
            form.append('taskId', this.taskId)
            formPost(invoiceApi.uploadExt, form).then(data => {
                // this.referId = data.referId
                // this.progress()
                this.form.expressVoucherName = a.name
                this.form.addExpressTime = new Date().getTime()
                this.$refs.form.clearValidate('expressVoucherName')
                this.fileList = []
                this.fileList.push({
                    name: a.name
                })
            });
        },
        submit() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    this.show = false                    
                    this.$emit('result', this.form)
                }
            })
        }
    }
}
</script>
<style scoped>
.form_input {
    width: 300px;
}
</style>
