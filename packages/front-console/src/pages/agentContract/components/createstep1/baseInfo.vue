<template>
  <div>
    <h3 class="green">
      渠道信息
    </h3>
    <el-form-item
      label="渠道名称"
      :prop="`${propName}.name`"
    >
      <el-input v-model="contract.datas.agentCompanyBaseInfo.name" />
    </el-form-item>
    <el-form-item
      label="税号"
      :prop="`${propName}.taxIdcd`"
    >
      <el-input v-model="contract.datas.agentCompanyBaseInfo.taxIdcd" />
    </el-form-item>
    <el-form-item
      label="渠道单位地址"
      :prop="`${propName}.registerAddr`"
    >
      <el-input v-model="contract.datas.agentCompanyBaseInfo.registerAddr" />
    </el-form-item>
    <el-form-item
      label="渠道电话"
      :prop="`${propName}.telephone`"
    >
      <el-input v-model="contract.datas.agentCompanyBaseInfo.telephone" />
    </el-form-item>
    <el-form-item
      label="开户名称"
      :prop="`${propName}.accountName`"
    >
      <el-input v-model="contract.datas.agentCompanyBaseInfo.accountName" />
    </el-form-item>
    <el-form-item
      label="开户银行"
      :prop="`${propName}.depositBank`"
    >
      <el-input v-model="contract.datas.agentCompanyBaseInfo.depositBank" />
    </el-form-item>
    <el-form-item
      label="银行账号"
      :prop="`${propName}.accountNo`"
    >
      <el-input v-model="contract.datas.agentCompanyBaseInfo.accountNo" />
    </el-form-item>
    <el-form-item
      label="渠道联系人"
      :prop="`${propName}.contactName`"
    >
      <el-input v-model="contract.datas.agentCompanyBaseInfo.contactName" />
    </el-form-item>
    <el-form-item
      label="渠道联系人电话"
      :prop="`${propName}.contactPhone`"
    >
      <el-input v-model="contract.datas.agentCompanyBaseInfo.contactPhone" />
    </el-form-item>
    <el-form-item
      label="渠道联系人地址"
      :prop="`${propName}.contactAddr`"
    >
      <el-input v-model="contract.datas.agentCompanyBaseInfo.contactAddr" />
    </el-form-item>
  </div>
</template>

<script>
export default {
    props: {
        contract: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            form: {},
            propName: 'datas.agentCompanyBaseInfo',

        }
    }
}
</script>

<style lang="scss" scoped>
.el-input {
    width: 400px;
}
</style>
