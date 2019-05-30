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
        <el-form
          :model="form.contract"
          :rules="check.rules"
          label-width="200px"
          ref="createAgentContract"
        >
          <contractOption :form="form.contract" />
          <channel-info :form="form.contract" />
          <sale-contact-info :form="form.contract" />
          <el-form-item>
            <el-button>返回</el-button>
            <el-button
              type="primary"
              @click="onSubmit('createAgentContract')"
            >
              下一步
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import Form from '../../model/agentContract/form'
import Check from '../../model/agentContract/check'
import contractOption from './components/contractOption'
import channelInfo from './components/channelInfo'
import saleContactInfo from './components/saleContactInfo'

export default {
    components: { contractOption, channelInfo, saleContactInfo },
    data() {
        return {
            form: new Form(),
            check: new Check(),
            active: 1
        }
    },
    methods: {
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    alert('submit!');
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });  
        }
    }
}
</script>

