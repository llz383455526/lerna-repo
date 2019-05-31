
<template>
  <div>
    <h3 class="green">
      归属销售联系信息
    </h3>
    <el-form-item
      label="销售姓名"
      :prop="`${propName}.salesName`"
    >
      <el-input v-model="contract.datas.salesInfo.salesName" />
    </el-form-item>
    <el-form-item
      label="销售联系电话"
      :prop="`${propName}.mobilePhone`"
    >
      <el-input v-model="contract.datas.salesInfo.mobilePhone" />
    </el-form-item>
    <el-form-item
      label="销售地址"
      :prop="`${propName}.salesAddress`"
    >
      <el-input v-model="contract.datas.salesInfo.salesAddress" />
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
            propName: 'datas.salesInfo'
        }
    }
}
</script>


<style lang="scss" scoped>
.el-input {
    width: 400px;
}
</style>
