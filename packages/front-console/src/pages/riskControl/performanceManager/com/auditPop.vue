<template>
    <el-dialog
        title="审核提示"
        :visible.sync="isShow"
        width="500px">
        <el-form ref="form" label-width="80px">
            <el-form-item label="风控审核">
                <el-select v-model="status" placeholder="请选择">
                    <el-option label="审核通过" value="0"></el-option>
                    <el-option label="审核不通过" value="1"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="isShow = false">取 消</el-button>
            <el-button type="primary" @click="okBtnClick">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
    import {get, post} from "../../../../store/api";
    export default {
        name: "auditPop",
        data() {
            return {
                isShow: false,
                status: '0',
                inputData: null
            }
        },
        methods: {
            show(data) {
                this.inputData = data
                this.isShow = true
            },
            okBtnClick() {
                const p  = {
                    id: this.inputData.id
                }
                p[this.inputData.stateKey] = this.inputData.stateArr[this.status]
                post(`/api/console-dlv${this.inputData.url}`, p).then((data) => {
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                    this.isShow = false
                    this.$emit('reload')
                }).catch(() => {})
            }
        }
    }
</script>

<style scoped>

</style>