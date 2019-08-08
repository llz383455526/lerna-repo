<template>
  <div>
    <div class="hm-title mt30">固定比例收费(实发金额)</div>
    <el-form :model="formInline"
             label-width="150px">
      <el-form-item label="设置默认底价">
        <el-input v-model="formInline.user"
                  placeholder="落地公司通用"
                  style="width: 200px;"></el-input>
        <el-button type="primary"
                   @click="onSubmit">确定</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        }
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      }
    }
  }
</script>
