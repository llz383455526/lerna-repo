<template>
    <div class="contract-container bg-white">
        <div class="widget-header">
            <div class="widget-title">{{operateEnum[form.contract.operateEnum] || '新增'}}代理商合同</div>
            <el-steps :active="active" simple finish-status="success">
                <el-step title="完善渠道信息"></el-step>
                <el-step title="添加落地公司"></el-step>
                <el-step title="提交送审"></el-step>
            </el-steps>
        </div>
        <div class="widget-body">
            <div class="widget-main">
                <createstep1 v-if="active === 1" :form="form" @next="active = 2"></createstep1>
                <createstep2 v-if="active === 2" :form="form" @next="active = 3" @prev="active = 1"></createstep2>
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
            active: 1,
            operateEnum: {
                1: '新增',
                2: '补签',
                3: '变更'
            }
        }
    },
    created() {
        this.form.contract.instanceId = this.$route.query.instanceId
        this.form.contract.operateEnum = parseInt(this.$route.query.operateEnum)
        if(this.$route.query.active) {
            this.active = this.$route.query.active
        }
    }
}
</script>

