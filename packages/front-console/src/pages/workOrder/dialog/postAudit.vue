<template>
  <el-dialog
    title="岗位审核"
    custom-class="el-middle-dialog"
    :close-on-click-modal="false"
    width="600px"
    :visible.sync="postDialog"
    @close="closePostDialog"
  >
    <el-steps :active="1" align-center>
      <el-step title="创建" description="（来自：这是一个公司名称）"></el-step>
      <el-step title="风控审核" description="（审核人：xxx）"></el-step>
    </el-steps>
    <h3 class="green">岗位详情</h3>
    <el-form ref="form" size="mini" :inline="true">
      <el-form-item label="岗位名称：" :label-width="formLabelWidth">
        <div class="content">岗位名称</div>
      </el-form-item>
      <el-form-item label="落地公司名称：" :label-width="formLabelWidth">
        <div class="content">落地公司名称</div>
      </el-form-item>
      <el-form-item label="服务类型：" :label-width="formLabelWidth">
        <div class="content">岗位名称</div>
      </el-form-item>
      <el-form-item label="工作内容：" :label-width="formLabelWidth">
        <div class="content">岗位名称绩效费结算规则绩效费结算规则绩效费结算规则绩效费结算规则绩效费结算规则绩效费结算规则绩效费结算规则绩效费结算规则绩效费结算规则</div>
      </el-form-item>
      <el-form-item label="绩效费结算规则：" :label-width="formLabelWidth">
        <div class="content">岗位名称绩效费结算规则绩效费结算规则绩效费结算规则绩效费结算规则绩效费结算规则绩效费结算规则绩效费结算规则</div>
      </el-form-item>
      <el-form-item label="审核意见：" :label-width="formLabelWidth">
        <el-input
          size="small"
          type="textarea"
          v-model="opinion"
          class="input-width"
          :rows="4"
          placeholder="请输入审核意见"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" type="primary">通过</el-button>
      <el-button size="small">拒绝</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      formLabelWidth: "130px",
      postDialog: false,
      opinion: "" // 审核意见
    };
  },
  watch: {
    value(val) {
      this.postDialog = val;
    }
  },
  created() {},
  mounted() {},
  methods: {
    closePostDialog() {
      this.postDialog = false;
      this.$emit("input", false);
    }
  }
};
</script>

<style scoped>
.input-width {
  width: 380px;
}
.content {
  width: 400px;
}
</style>