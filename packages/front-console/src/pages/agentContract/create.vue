<template>
    <div class="contract-container bg-white">
        <div class="widget-header">
            <div class="widget-title">新增代理商合同</div>
            <el-steps :active="active" simple finish-status="success">
                <el-step title="完善渠道信息"></el-step>
                <el-step title="添加落地公司"></el-step>
                <el-step title="提交送审"></el-step>
            </el-steps>
        </div>
        <div class="widget-body">
            <div class="widget-main">
                <createstep1 v-if="active === 1" :form="form" @step="active = 2" @step1="step1"></createstep1>
                <createstep2 v-if="active === 2" :form="form" @step="active = 3" @prev="active = 1"></createstep2>
                <createstep3 v-if="active === 3"></createstep3>
            </div>
        </div>
    </div>
</template>

<script>
import createstep1 from './components/createstep1'
import createstep2 from './components/createstep2'
import createstep3 from './components/createstep3'
import Form from 'src/model/agentContract/form'

export default {
    components: { createstep1, createstep2, createstep3 },
    data() {
        return {
            form: new Form(),
            active: 1
        }
    },
    methods: {
        step1(res) {
            this.form = res;
            this.active = 2;
        },
    },
    created() {
        this.form.contract.instanceId = this.$route.query.instanceId || ''
        this.form.contract.operateEnum = this.$route.query.operateEnum || ''
        if(this.$route.query.active) {
            this.active = this.$route.query.active
        }
    }
}
</script>

