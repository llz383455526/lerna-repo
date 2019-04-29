<template>
    <el-dialog
        title="编辑发票信息"
        :visible.sync="showSync"
        :close-on-click-modal="false"
        width="800px"
    >
        <el-form
            ref="invoiceInfo"
            label-width="200px"
            class="invoice-form"
            :model="invoiceInfo"
            :rules="rules"
        >
            <el-form-item 
                label="开票名称"
                prop="name"
            >
                 <el-input
                    disabled
                    v-model="invoiceInfo.name"
                ></el-input>
            </el-form-item>
            <el-form-item 
                label="纳税人识别号"
                prop="taxIdcd"
            >
                <el-input
                    v-model="invoiceInfo.taxIdcd"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="公司地址"
                prop="addr"
            >
                <el-input
                    v-model="invoiceInfo.addr"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="电话号码"
                prop="phone"
            >
                <el-input
                    v-model="invoiceInfo.phone"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="开户行"
                prop="bankName"
            >
                <el-input
                    v-model="invoiceInfo.bankName"
                ></el-input>
            </el-form-item>
            <el-form-item
                label="银行账号"
                prop="bankAccount"
            >
                <el-input
                    v-model.number="invoiceInfo.bankAccount"
                ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="$emit('update:show', false)">取消</el-button>
                <el-button
                    type="primary"
                    @click="onSubmit('invoiceInfo')"
                >确定</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import {invoiceApi} from 'src/api'
import { get, post, importPost } from "src/store/api";

export default {
    props: {
        show: {
            type:Boolean
        },
        info: {
            type: Object
        }
    },
    data() {
        return {
            rules: {
                taxIdcd: [{
                    required: true, message: '请填写纳税人识别号', trigger: 'blur'
                }]
            }
        }
    },
    computed: {
        showSync: {
            get: function() {
                return this.show
            },
            set: function(newValue) {
                console.log(newValue)
                this.$emit('update:show', newValue)
            }
        },
        invoiceInfo() {
            return JSON.parse(JSON.stringify(this.info))
        }
    },
    methods: {
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // 去掉前后空格
                    for(let k in this.invoiceInfo) {
                        let val = this.invoiceInfo[k]
                        this.invoiceInfo[k] = (val && val.trim) ? val.trim() : val
                    }
                    post(invoiceApi.editCustomerInfo,this.invoiceInfo).then(res => {
                        this.$emit('update:show', false)
                        this.$emit('changeInfo', this.invoiceInfo)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            
        }
    }
}
</script>

<style lang="scss" scoped>
.el-form-item{
    margin-bottom: 22px;
}
</style>
