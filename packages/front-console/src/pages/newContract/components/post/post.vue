<template>
  <el-dialog
    title="添加岗位模板"
    custom-class="el-middle-dialog"
    :close-on-click-modal="false"
    width="600px"
    :visible.sync="postDialog"
    @close="closePostDialog"
  >
    <el-form :model="form" :rules="rules" ref="form" size="mini" :inline="true">
      <el-form-item label="岗位名称：" prop="name" :label-width="formLabelWidth">
        <el-input size="small" v-model="form.name" class="input-width" placeholder="请输入岗位名称"></el-input>
      </el-form-item>
      <el-form-item label="岗位内容：" prop="content" :label-width="formLabelWidth">
        <el-input
          size="small"
          type="textarea"
          v-model="form.content"
          class="input-width"
          :rows="4"
          placeholder="请输入岗位内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="绩效结算规则：" prop="rule" :label-width="formLabelWidth">
        <el-input
          size="small"
          type="textarea"
          v-model="form.rule"
          class="input-width"
          :rows="4"
          placeholder="请输入绩效结算规则"
        ></el-input>
      </el-form-item>
      <el-form-item label="绩效计算明细模板：" prop="file" :label-width="formLabelWidth">
        <el-upload
          class="upload-demo"
          :action="`${baseUrl}/api/sysmgr-web/file/upload`"
          :on-error="handleError"
          :before-upload="handleBeforeUpload"
          :http-request="handleHttpRequest"
          accept=".xls, .xlsx"
          :show-file-list="false"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="closePostDialog">取消</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { formPost } from "../../../../store/api";
import { baseUrl } from "../../../../config/address";
import { showNotify } from "../../../../plugin/utils-notify";

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      baseUrl,
      formLabelWidth: "140px",
      postDialog: false,
      form: {
        name: "", // 岗位名称
        content: "", // 岗位内容
        rule: "", // 绩效结算规则
        file: "" // 绩效明细计算模板
      },
      rules: {
        name: [
          { required: true, message: "请输入岗位名称", trigger: "blur" },
          { max: 16, message: "岗位名称不能超过16个字", trigger: "blur" }
        ],
        content: [
          { required: true, message: "请输入岗位内容", trigger: "blur" },
          { max: 1000, message: "岗位内容不能超过1000个字", trigger: "blur" }
        ],
        rule: [
          { required: true, message: "请输入绩效结算规则", trigger: "blur" },
          {
            max: 1000,
            message: "绩效结算规则不能超过1000个字",
            trigger: "blur"
          }
        ]
      },
      formData: {}
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
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          alert("submit!");
        } else {
          return false;
        }
      });
    },
    closePostDialog() {
      this.postDialog = false;
      this.$emit("input", false);
    },
    handleError() {
      showNotify("error", "上传失败!");
    },
    handleError() {
      showNotify("error", "上传失败!");
    },
    handleBeforeUpload(file) {
      let formData = new FormData();
      formData.append("fileName", file.name);
      formData.append("file", file);
      formData.append("targetType", "ad_img");
      this.formData = formData;
    },
    handleHttpRequest() {
      formPost("/api/sysmgr-web/file/upload", this.formData).then(result => {
        console.log(result);
        showNotify("success", "上传成功，为你生成《服务合同补充协议》");
      });
    }
  }
};
</script>

<style scoped>
.input-width {
  width: 380px;
}
</style>