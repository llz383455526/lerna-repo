
<template>
    <el-form :model="form.contract" :rules="check.rules" label-width="200px" ref="createAgentContract">
        <contractOption :contract="form.contract" :workflow-type="form.workflowType"></contractOption>
        <channel-info :contract="form.contract"></channel-info>
        <sale-contact-info :contract="form.contract"></sale-contact-info>
        <el-form-item>
            <el-button>返回</el-button>
            <el-button type="primary" @click="onSubmit('createAgentContract')">下一步</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import Form from 'src/model/agentContract/step1'
import Check from 'src/model/agentContract/check'
import contractOption from './contractOption'
import channelInfo from './channelInfo'
import saleContactInfo from './saleContactInfo'

export default {
    components: { contractOption, channelInfo, saleContactInfo },
    data() {
        return {
            form: new Form(),
            check: new Check(),
            instanceId: ''
        }
    },
    methods: {
        // 提交成功后，将数据发送给父组件，供后续步骤使用
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.$emit('step1', this.form.contract)
                    this.form.saveChannelInfo().then(() => {
                        this.$emit('step1', this.form.contract)
                        this.$router.push({
                            path: 'create',
                            query: {
                                instanceId: this.form.contract.instanceId
                            }
                        })
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });  
        },
    },
    created() {
        this.instanceId = this.$route.query.instanceId
        if (this.instanceId) {
            this.form.getChannelDetail(this.instanceId)
        }
        this.form.contract.standardEnum = 1
        this.form.contract.operateEnum = 1
        this.form.contract.subjectType = 'channel'
    }
}
</script>

