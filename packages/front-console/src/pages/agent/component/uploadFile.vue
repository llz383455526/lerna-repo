<template lang="html">
  <div class="">
    <el-upload
      class="form_input"
      action=""
      :auto-upload="false"
      :on-change="upload"
      :multiple="false"
      :show-file-list="false"
      accept=".key, .crt">
      <div class="up_icon">
          <div>点击这里上传</div>
      </div>
    </el-upload>
  </div>
</template>

<script>
import { get, post, formPost } from "../../../store/api";
export default {
  methods: {
    upload(file) {
        var form = new FormData();
        form.append('fileName', file.name);
        form.append('file', file.raw);
        formPost('/api/sysmgr-web/file/upload-ext', form).then(data => {
            this.$emit('success', data, file)
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
