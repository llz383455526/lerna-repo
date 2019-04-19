<template>
    <el-dialog title="选择落地公司和客户公司" :visible.sync="show" width="600px">
        <el-form :model="form" :rules="rules" size="small" label-width="110px" ref="form">
            <el-form-item label="客户公司" prop="customCompanyId">
                <el-select class="form_input" v-model="form.customCompanyId" filterable @change="getServiceCompanyList">
                    <el-option v-for="(e, i) in customCompanies" :key="i" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="落地公司" prop="serviceCompanyId">
                <el-select class="form_input" v-model="form.serviceCompanyId" filterable> <!-- @change="getCustomCompany" -->
                    <el-option v-for="(e, i) in serviceCompanyList" :key="i" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="show = false">取消</el-button>
            <el-button type="primary" @click="result">确认</el-button>
        </span>
    </el-dialog>
</template>
<script>
import { get, post, importPost } from "src/store/api";
import { invoiceApi } from "src/api";
export default {
    data() {
        return {
            form: {
                customCompanyId: '',
                serviceCompanyId: ''
            },
            rules: {
                serviceCompanyId: [
                    { required: true, message: "请选择落地公司", trigger: "change"}
                ],
                customCompanyId: [
                    { required: true, message: "请选择客户公司", trigger: "change"}
                ]
            },
            show: false,
            customCompanies: [],
            serviceCompanyList: []
        }
    },
    methods: {
        transmit(a) {
            this.show = a
            // get(invoiceApi.getServiceCompany).then(data => {
            //     this.serviceCompanyList = data
            // })
            get(invoiceApi.customCompanyOptions).then(data => {
                this.customCompanies = data
            })
        },
        result() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    this.show = false
                    let str = ''
                    for(let k in this.form) {
                        str += `${str ? '&' : '?'}${k}=${this.form[k]}`
                    }
                    this.$router.push(`/main/workOrder/invoice_sheet/index${str}`)
                }
            })
        },
        getServiceCompanyList() {
            get(invoiceApi.serviceCompanyOptions, {
                customCompanyId: this.form.customCompanyId
            }).then(data => {
                this.serviceCompanyList = data
            })
        }
        // getCustomCompany() {
        //     get(invoiceApi.getCustomCompanyByServiceId, {
        //         serviceCompanyId: this.form.serviceCompanyId
        //     }).then(data => {
        //         this.customCompanies = data
        //     })
        // }
    }
}
</script>
<style scoped>
.form_input {
    width: 400px;
}
</style>
