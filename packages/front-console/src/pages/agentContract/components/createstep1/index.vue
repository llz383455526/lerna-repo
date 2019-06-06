
<template>
    <el-form :model="form.contract" :rules="check.rules" label-width="200px" ref="createAgentContract">
        <agentContract :contract="form.contract" ref="contractOption"></agentContract>
        <agentCompanyBaseInfo :contract="form.contract"></agentCompanyBaseInfo>
        <salesInfo :contract="form.contract"></salesInfo>
        <el-form-item>
            <el-button @click="$router.push('list')">返回</el-button>
            <el-button type="primary" @click="onSubmit('createAgentContract')">下一步</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import Check from 'src/model/agentContract/check'
import agentContract from './agentContract'
import agentCompanyBaseInfo from './agentCompanyBaseInfo'
import salesInfo from './salesInfo'

export default {
    components: { agentContract, agentCompanyBaseInfo, salesInfo },
    props: {
        form: {
            type: Object
        }
    },
    data() {
        return {
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
                                instanceId: this.form.contract.instanceId,
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

