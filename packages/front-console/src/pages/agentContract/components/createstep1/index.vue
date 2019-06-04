
<template>
    <el-form :model="form.contract" :rules="check.rules" label-width="200px" ref="createAgentContract">
        <addOption :contract="form.contract" v-if="operateEnum === '2'"></addOption>
        <changeOption :contract="form.contract" v-if="operateEnum === '3'"></changeOption>
        <contractOption :contract="form.contract" :workflow-type="form.workflowType"></contractOption>
        <channel-info :contract="form.contract"></channel-info>
        <sale-contact-info :contract="form.contract"></sale-contact-info>
        <el-form-item>
            <el-button @click="$router.push('list')">返回</el-button>
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
import addOption from './addOption'
import changeOption from './changeOption'

export default {
    components: { contractOption, channelInfo, saleContactInfo, addOption, changeOption },
    data() {
        return {
            form: new Form(),
            check: new Check(),
            instanceId: '',
            operateEnum: ''
        }
    },
    methods: {
        // 提交成功后，将数据发送给父组件，供后续步骤使用
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    // this.$emit('step1', this.form.contract)
                    this.form.saveDraft().then(() => {
                        this.$emit('step1', this.form.contract)
                        this.$router.push({
                            path: 'create',
                            query: {
                                instanceId: this.form.contract.instanceId,
                                operateEnum: this.operateEnum
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
        this.operateEnum = this.$route.query.operateEnum
        if (this.instanceId) {
            this.form.getDetail(this.instanceId).then(() => {
                this.form.contract.operateEnum = this.operateEnum
            })
        } else {
            this.form.contract.operateEnum = this.operateEnum
        }
    }
}
</script>

