<template>
  <el-steps :active="active" align-center>
    <el-step v-for="(e,i) in stepList" :key="i" :title="e.activityName" :description="e.userName"></el-step>
  </el-steps>
</template>

<script>
export default {
  props: {
    stepList: {
      type: Array,
    },
    active: {
      type: [Number, String]
    }
  },
}
</script>

<style scoped>
.el-steps{
  margin-bottom: 20px;
}
</style>