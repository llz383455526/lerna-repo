
<template>
    <el-form :model="form.contract" :rules="check.rules" label-width="200px" ref="createAgentContract">
        <!-- <addOption :contract="form.contract" v-if="operateEnum === '2'"></addOption> -->
        <!-- <changeOption :contract="form.contract" v-if="operateEnum === '3'"></changeOption> -->
        <contractOption :contract="form.contract" ref="contractOption"></contractOption>
        <channel-info :contract="form.contract"></channel-info>
        <sale-contact-info :contract="form.contract"></sale-contact-info>
        <el-form-item>
            <el-button @click="$router.push('list')">返回</el-button>
            <el-button type="primary" @click="onSubmit('createAgentContract')">下一步</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import Check from 'src/model/agentContract/check'
import contractOption from './contractOption'
import channelInfo from './channelInfo'
import saleContactInfo from './saleContactInfo'
import changeOption from './changeOption'

export default {
    components: { contractOption, channelInfo, saleContactInfo, changeOption },
    props: {
        form: {
            type: Object
        }
    },
    data() {
        return {
            // form: new Form(),
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
                    this.form.saveDraft().then(() => {
                        this.$emit('step')
                        this.$router.push({
                            path: 'create',
                            query: {
                                id: this.form.contract.id,
                                operateEnum: this.form.contract.operateEnum
                            }
                        })
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });  
        }
    },
    created() {
        if (this.form.contract.instanceId) {
            this.form.getDetail(this.form.contract.instanceId).then(() => {
                this.$refs['contractOption'].showDate()
            })
        }
    }
}
</script>

