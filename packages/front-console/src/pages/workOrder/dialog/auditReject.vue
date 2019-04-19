<template>
    <div>
        <el-dialog title="拒开确认" :visible.sync="show" width="600px">
            <el-form :model="form" :rules="rules" ref="form">
                <el-form-item label="拒开原因" prop="memo">
                    <el-input class="form_input" v-model="form.memo" type="textarea"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="show = false">取消</el-button>
                <el-button type="primary" @click="sure">确认拒开</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
export default {
    data() {
        return {
            show: false,
            form: {
                allReject: true,
                memo: ''
            },
            rules: {
                memo: [
                    { required: true, message: "请填写拒开原因", trigger: "bulr"}
                ],
            }
        }
    },
    methods: {
        transmit(a) {
            Object.assign(this, a)
            this.$nextTick(() => {
                this.$refs.form.resetFields()
            })
        },
        sure() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    this.$emit('reject', this.form)
                    this.show = false
                }
            })
        }
    }
}
</script>
<style scoped>
.form_input {
    width: 400px;
}
</style>
