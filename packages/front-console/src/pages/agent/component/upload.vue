<template lang="html">
  <div class="">
    <el-upload
      class="form_input"
      action=""
      :auto-upload="false"
      :on-change="upload"
      :multiple="false"
      :show-file-list="false"
      accept=".png, .jpg, .jpeg">
      <div class="up_icon">
          <div>点击这里上传</div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { get, post, formPost } from "../../../store/api";
export default {
  data() {
    return {
      referId: '',
    }
  },
  props: {
    targetId: '',
    targetType: '',
    targetExt: '',
  },
  methods: {
    upload(a) {
      var form = new FormData();
      form.append('fileName', a.name);
      form.append('file', a.raw);
      form.append('targetId', this.targetId)
      form.append('targetType', this.targetType)
      form.append('targetExt', this.targetExt)
      formPost('/api/sysmgr-web/file/upload-ext', form).then(data => {
          this.referId = data.referId
          this.$emit('success', data, a)
      });
    },
  },
}
</script>

<style lang="css" scoped>
.up_icon {
    width: 228px;
    height: 124px;
    background-image: url(../../../image/upload.png);
    background-size: 41px 33px;
    background-position: center 20px;
    background-repeat: no-repeat;
    padding-top: 70px;
    border: 1px solid #D9D9D9;
}
.up_icon > div:nth-child(1) {
    text-align: center;
    font-size: 12px;
    color: #666666;
}
.up_icon > div:nth-child(2) {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
</style>
