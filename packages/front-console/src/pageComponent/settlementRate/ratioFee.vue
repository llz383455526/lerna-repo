<template>
  <el-form-item
    label="实发金额"
    :prop="`${propName1}.agentType`"
  >
    <el-input>
      <template slot="append">
        %每笔
      </template>
    </el-input>
  </el-form-item>
</template>

<script>
export default {
    
}
</script>
