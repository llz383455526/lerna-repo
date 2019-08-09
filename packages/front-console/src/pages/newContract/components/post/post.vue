<template>
  <el-dialog
    title="添加岗位模板"
    custom-class="el-middle-dialog"
    :close-on-click-modal="false"
    width="600px"
    :visible.sync="postDialog"
    @close="closePostDialog"
  >
    <el-form :model="form" :rules="rules" ref="form" size="mini" :inline="true" v-if="postDialog">
      <el-form-item label="岗位名称：" prop="posName" :label-width="formLabelWidth">
        <el-input size="small" v-model="form.posName" class="input-width" placeholder="请输入岗位名称"></el-input>
      </el-form-item>
      <el-form-item label="岗位内容：" prop="description" :label-width="formLabelWidth">
        <el-input
          size="small"
          type="textarea"
          v-model="form.description"
          class="input-width"
          :rows="4"
          placeholder="请输入岗位内容"
        ></el-input>
      </el-form-item>
      <el-form-item label="绩效结算规则：" prop="performance" :label-width="formLabelWidth">
        <el-input
          size="small"
          type="textarea"
          v-model="form.performance"
          class="input-width"
          :rows="4"
          placeholder="请输入绩效结算规则"
        ></el-input>
      </el-form-item>
      <el-form-item label="绩效计算明细模板：" prop="attachment" :label-width="formLabelWidth">
        <el-upload
          class="upload-demo"
          :action="`${baseUrl}/api/sysmgr-web/file/upload`"
          :limit="1"
          :on-error="handleError"
          :on-remove="handleRemove"
          :before-upload="handleBeforeUpload"
          :http-request="handleHttpRequest"
          accept=".xls, .xlsx"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" @click="closePostDialog">取消</el-button>
      <el-button size="small" type="primary" @click="submitForm('form')">确定</el-button>
    </div>
    <!-- <pre>{{form}}</pre> -->
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
      formLabelWidth: "150px",
      postDialog: false,
      form: {
        posName: "", // 岗位名称
        description: "", // 岗位内容
        performance: "", // 绩效结算规则
        attachment: {
            refId: ''
        } // 绩效明细计算模板
      },
      rules: {
        posName: [
          { required: true, message: "请输入岗位名称", trigger: "blur" },
          { max: 16, message: "岗位名称不能超过16个字", trigger: "blur" }
        ],
        description: [
          { required: true, message: "请输入岗位内容", trigger: "blur" },
          { max: 1000, message: "岗位内容不能超过1000个字", trigger: "blur" }
        ],
        performance: [
          { required: true, message: "请输入绩效结算规则", trigger: "blur" },
          {
            max: 1000,
            message: "绩效结算规则不能超过1000个字",
            trigger: "blur"
          }
        ],
        attachment: [{ required: true }]
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
          if (!this.form.attachment.refId) {
            showNotify("error", "请上传绩效明细计算模板!");
            return
          }
          // console.log(this.form)
          const form = Object.assign({}, this.form)
          this.$emit("addServicePost", form);
          setTimeout(() => {
            this.$refs['form'].resetFields();
            this.form.attachment = { refId: '' }
            this.closePostDialog();
          }, 0)
        } else {
          return false;
        }
      });
    },
    closePostDialog() {
      this.postDialog = false;
      this.$emit("input", false);
    },
    handleRemove() {
      this.form.attachment = {};
    },
    handleError() {
      showNotify("error", "上传失败!");
    },
    handleBeforeUpload(file) {
      let formData = new FormData();
      formData.append("fileName", file.name);
      formData.append("file", file);
      // formData.append("targetType", "ad_img");
      this.formData = formData;
    },
    handleHttpRequest() {
      formPost("/api/sysmgr-web/file/upload", this.formData).then(result => {
        // console.log(result);
        this.form.attachment.refId = result.referId;
        this.form.attachment.downloadCode = result.downloadCode;
        this.form.attachment.displayname = result.fileName;
        this.form.attachment.createByName = result.createByName;
        this.form.attachment.createTime = result.createTime;
        // this.imgUrl = result.referId;
        // this.imgUrlNew = `${baseUrl}/api/sysmgr-web/file/img-scan?downloadCode=${result.downloadCode}`;
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