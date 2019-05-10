<template>
    <div>
        <el-dialog title="渠道余额不足" :visible.sync="show" width="800px">
            <el-form :model="form" :rules="rules" label-width="80px" size="small" ref="form">
                <el-form-item label="挂起原因">
                    <span class="red">渠道余额不足</span>
                </el-form-item>
                <el-form-item label="客户公司">{{msg.companyName}}</el-form-item>
                <el-form-item label="商户名称">{{msg.appName}}</el-form-item>
                <el-form-item label="服务公司">{{msg.serviceCompanyName}}</el-form-item>
                <el-form-item label="业务类型">{{msg.bankTypeName}}</el-form-item>
                <el-form-item label="业务渠道">{{msg.paymentThirdTypeName}}</el-form-item>
                <el-form-item label="渠道账号">{{msg.channelLoginAcctNo}}</el-form-item>
                <el-form-item label="渠道余额">{{msg.payUserBalance || 0.00}}元</el-form-item>
                <el-form-item label="渠道手续费余额">{{msg.serviceFeeBalance || 0.00}}元</el-form-item>
            </el-form>
            <!-- <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="show = false">关闭</el-button>
                <el-button size="small" type="primary" @click="show = false">已处理</el-button>
            </span> -->
        </el-dialog>
    </div>
</template>
<script>
import { get, post, importPost } from "src/store/api";
import { balance, workflow } from "src/api";
export default {
    data() {
        return {
            form: {},
            show: false,
            param: {},
            msg: {}
        }
    },
    methods: {
        transmit(a) {
            Object.assign(this, a)
            get(workflow.getBizExtendData, {
                processInsId: this.param.processInstanceId
            }).then(data => {
                this.msg = data
                let { payUserId, paymentThirdType, serviceCompanyId } = data
                post(balance.queryChannelPayUserBalance, {
                    payUserId,
                    paymentThirdType,
                    serviceCompanyId
                }).then(data => {
                    this.msg.payUserBalance = data.payUserBalance
                    this.msg.serviceFeeBalance = data.serviceFeeBalance
                    this.$forceUpdate()
                })
            })
        },
    }
}
</script>
<style scoped>
.form_input {
    width: 450px;
}
.red {
    color: red;
}
</style>
