<template>
    <el-row>
        <el-col :span="2" style="text-align: right; padding-right: 30px;"><label class="label">代理期限</label></el-col>
        <el-col :span="22">
            <el-form :model="serviceCompanyFeeContent" ref="ruleForm">
                <el-form-item prop="agentStart" :rules="{ required: true, message: '请选择代理期限', trigger: 'change' }">
                    <el-date-picker type="daterange" v-model="dateValue" start-placeholder="开始日期" end-placeholder="结束日期" value-format="yyyy-MM-dd" @change="dateChange"></el-date-picker>
                </el-form-item>
            </el-form>
        </el-col>
    </el-row>
</template>

<script>
export default {
    data() {
        return {
            dateValue: ''
        }
    },
    props: {
        serviceCompanyFeeContent: {
            type: Object
        }
    },
    methods: {
        dateChange(ev) {
            if(ev) {
                this.serviceCompanyFeeContent.agentStart = ev[0]
                this.serviceCompanyFeeContent.agentEnd = ev[1]
            } else {
                this.serviceCompanyFeeContent.agentStart = this.serviceCompanyFeeContent.agentEnd = ''
            }
        },
        validate(callback) {
            if (typeof callback !== 'function') {
                console.log('agentDate no callback')
                return
            }
            this.$refs['ruleForm'].validate((valid) => {
                if (valid) {
                    callback(true)
                } else {
                    callback(false)
                }
            })
        }
    },
    created() {
        if(!this.dateValue && this.serviceCompanyFeeContent.agentStart) {
            this.dateValue = [this.serviceCompanyFeeContent.agentStart, this.serviceCompanyFeeContent.agentEnd]
        }
    }
}
</script>

<style lang="scss" scoped>
.label {
    font-size: 14px;
    color: #606266;
    line-height: 40px;
}
</style>


