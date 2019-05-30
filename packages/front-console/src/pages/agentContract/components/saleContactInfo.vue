
<template>
  <div>
    <h3 class="green">
      归属销售联系信息
    </h3>
    <el-form-item
      label="销售姓名"
    >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      label="销售联系电话"
    >
      <el-input v-model="form.name" />
    </el-form-item>
    <el-form-item
      label="销售地址"
    >
      <el-input v-model="form.name" />
    </el-form-item>
  </div>
</template>

<script>
export default {
    data() {
        return {
            form: {}
        }
    }
}
</script>


<style lang="scss" scoped>
.el-input {
    width: 400px;
}
</style>
