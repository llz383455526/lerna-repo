<template lang="html">
  <el-form-item prop="settledRate"
                :rules="[{ required: true, message: '请输入预收服务费', trigger: 'blur' }]">
      甲乙双方同意在结 算当日暂按
      <el-input style="width: 200px;"
                v-model="settledRate"
                @input="handleInput">
          <template slot="append">%</template>
      </el-input>
      的标准计算管理费，并在此基础上计算服务费总额。
  </el-form-item>
</template>

<script>
export default {
  props: {
    value: {
      // type: String,
    }
  },
  watch: {
    value(val) {
      this.settledRate = val
    }
  },
  data() {
    return {
      settledRate: this.value || ''
    }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    },
  }
}
</script>

<style lang="css" scoped>
</style>
