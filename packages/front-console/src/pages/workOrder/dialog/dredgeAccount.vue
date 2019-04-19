<template>
    <div>
        <el-dialog title="开通企业账号" :visible.sync="show" width="800px">
            <el-row>
                <el-col :span="12">商户负责人：<el-button size="small" type="primary" @click="select">添加</el-button></el-col>
            </el-row>
            <el-table :data="[principal]">
                <el-table-column label="商户负责人" prop="name"></el-table-column>
                <el-table-column label="负责人手机" prop="mobilephone"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" v-if="principal.id">
                        <el-button type="text" @click="deletePrincipal">删除</el-button>
                        <el-button type="text" @click="resetPassword">重置密码</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="show = false">取消</el-button>
                <el-button size="small" type="primary" @click="dredge">开通账号（短信通知）</el-button>
            </span>
        </el-dialog>
        <select-principal @result="result" ref="selectPrincipal"></select-principal>
    </div>
</template>
<script>
import { get, post } from "src/store/api";
import { sysmgr } from "src/api";
import selectPrincipal from './selectPrincipal'
export default {
    props: {
        row: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    components: {
        selectPrincipal
    },
    data() {
        return {
            show: false,
            principal: {}
        }
    },
    methods: {
        transmit(a) {
            Object.assign(this, a)
        },
        select() {
            this.$refs.selectPrincipal.transmit({
                show: true
            })
        },
        result(a) {
            this.principal = a
            this.changePrincipal()
        },
        changePrincipal() {
            post(sysmgr.companyAppChangeCharge, {
                appId: this.row.businessId,
                chargeEmil: this.principal.email,
                chargeMobile: this.principal.mobilephone,
                chargeName: this.principal.name
            }).then(data => {
                this.$message({
                    type: 'success',
                    message: '修改成功！'
                })
            })
        },
        deletePrincipal() {
            post(sysmgr.companyAppDeleteCharge, {
                appId: this.row.businessId,
                chargeBy: this.principal.id
            }).then(data => {
                this.principal = {}
                this.$message({
                    type: 'success',
                    message: '删除成功！'
                })
            })
        },
        resetPassword() {
            this.$confirm("确认要重置密码吗？", "提示", {
                type: "warning",
                confirmButtonText: "确定",
                cancelButtonText: "取消"
            }).then(() => {
                post(`${sysmgr.adminResetPwd}?userId=${this.principal.id}`).then(data => {
                    this.$message({
                        type: "success",
                        message: "密码已重置！"
                    })
                })
            }).catch(err => {})
        },
        dredge() {
            if(!this.principal.name) {
                this.$message({
                    type: 'success',
                    message: '请选择商户负责人！'
                })
                return 
            }
            post(sysmgr.appRecheckSubmit, {
                appId: this.row.businessId,
                operate: 'pass',
                processInsId: this.row.processInstanceId,
                taskId: this.row.id
            }).then(data => {
                this.$message({
                    type: 'success',
                    message: '开通成功！'
                })
                this.show = false
                this.$router.back()
            })
        }
    }
}
</script>
