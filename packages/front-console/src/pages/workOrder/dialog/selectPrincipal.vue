<template>
    <div>
        <el-dialog title="选择负责人" :visible.sync="show" width="500px">
            <el-form :model="form" :rules="rules" size="small" ref="form">
                <el-form-item label="商户负责人" prop="name">
                    <el-input class="form_input" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item label="负责人手机" prop="mobilephone">
                    <el-input class="form_input" v-model="form.mobilephone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="show = false">取消</el-button>
                <el-button type="primary" @click="sure">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from "src/store/api";
import { sysmgr } from "src/api";
export default {
    props: {
        customCompanyId: {
            type: null,
            default: ''
        }
    },
    data() {
        return {
            form: {
                name: '',
                mobilephone: ''
            },
            rules: {
                name: [
                    { required: true, message: "请填写负责人名称", trigger: "blur"}
                ],
                mobilephone: [
                    { required: true, message: "请填写负责人手机", trigger: "blur"}
                ]
            },
            show: false
        }
    },
    methods: {
        transmit(a) {
            Object.assign(this, a)
        },
        sure() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    this.$emit('result', this.form)
                    this.show = false
                }
            })
        }
    }
}
</script>
<style scoped>
.form_input {
    width: 320px;
}
</style>
