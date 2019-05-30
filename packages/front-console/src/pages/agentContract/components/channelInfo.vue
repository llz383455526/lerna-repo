<template>
  <div>
    <h3 class="green">
      渠道信息
    </h3>
    <el-form-item
      label="代理商名称"
      prop="datas.agentCompanyBaseInfo.name"
    >
      <el-input v-model="form.datas.agentCompanyBaseInfo.name" />
    </el-form-item>
    <el-form-item
      label="税号"
    >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      label="代理商单位地址"
    >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      label="代理商电话"
    >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      label="开户名称"
    >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      label="开户银行"
    >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      label="银行账号"
    >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      label="代理商联系人"
    >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      label="代理商联系人电话"
    >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      label="代理商联系人地址"
    >
      <el-input v-model="form.name" />
    </el-form-item>
  </div>
</template>

<script>
export default {
    props: {
        form: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
        }
    }
}
</script>

<style lang="scss" scoped>
.el-input {
    width: 400px;
}
</style>
