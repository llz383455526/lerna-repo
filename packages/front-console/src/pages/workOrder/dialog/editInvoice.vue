<template>
    <div>
        <el-dialog title="修改开票状态" :visible.sync="show" width="35%">
            <el-form :model="form" :rules="rules" ref="form" label-width="100px" class="demo-ruleForm">
                <el-form-item label="发票代码" prop="invoiceCode">
                    <el-input placeholder="发票代码一般在发票左上方" v-model="form.invoiceCode"></el-input>
                </el-form-item>
                <el-form-item label="发票号码" prop="invoiceNum">
                    <el-input placeholder="发票号码一般在发票右上方"  v-model="form.invoiceNum"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="show = false">取消</el-button>
                    <el-button type="primary" @click="submit">已开票</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from "src/store/api";
export default {
    data() {
        return {
            form: {
                id: '',
                invoiceCode: '',
                invoiceNum: ''
            },
            rules: {
                invoiceCode: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ],
                invoiceNum: [
                    { required: true, message: '请输入', trigger: 'blur' },
                ]
            },
        }
    },
    methods: {
        changeInvoiceStatus(item) {
            this.show = true
            this.form.id = item.id
        },
        submit() {
            post('/api/invoice-web/invoice/paper-invoice-update', this.form).then((data) => {
                this.$message({
                    type: 'success',
                    message: '修改成功'
                })
                this.show = false
                this.nshow = false
                this.query()
            })
        },
    }
}
</script>
<style scoped>

</style>
