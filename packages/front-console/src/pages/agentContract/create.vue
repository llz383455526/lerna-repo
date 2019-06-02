<template>
  <div class="contract-container bg-white">
    <div class="widget-header">
      <div class="widget-title">
        新增代理商合同
      </div>
      <el-steps
        :active="active"
        simple
        finish-status="success"
      >
        <el-step title="完善渠道信息" />
        <el-step title="添加落地公司" />
        <el-step title="提交送审" />
      </el-steps>
    </div>
    <div class="widget-body">
      <div class="widget-main">
        <createstep1
          v-if="active === 1"
          @step1="step1"
        />
        <createstep2
          v-if="active === 2"
          :form="form"
        />
      </div>
    </div>
  </div>
</template>

<script>
import createstep1 from './components/createstep1'
import createstep2 from './components/createstep2'


export default {
    components: { createstep1, createstep2 },
    data() {
        return {
            form: {},
            active: 1
        }
    },
    methods: {
        step1(res) {
            this.form = res;
            this.active = 2;
        }
    },
    created() {

    }
}
</script>

