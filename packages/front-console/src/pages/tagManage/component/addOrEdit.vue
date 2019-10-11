<template>
  <el-dialog :title="editFormTitle"  :visible.sync="showModel" :before-close="clearForm" width="558px">
    <el-form label-width="150px" :rules="rules" ref="editForms">
      <el-form-item label="服务类型：" prop="serviceName">
        <el-input v-model="editForm.serviceName" class="f_input"></el-input>
      </el-form-item>
      <el-form-item label="序号：" prop="seqNo">
        <el-input v-model="editForm.seqNo"></el-input>
      </el-form-item>
      <el-form-item label="备注：" prop="serviceContent">
        <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="editForm.serviceContent"></el-input>
      </el-form-item>
    </el-form>
    <span class="form_footer" slot="footer">
        <el-button @click="sure" type="primary">保存</el-button>
        <el-button @click="closeModel">关闭</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { get, post, importPost } from "src/store/api";
import { invoiceApi } from "src/api";
import { showNotify } from '../../../plugin/utils-notify'

export default {
  name:'addOrEdit',
  props: {
    editFormShow: {
      type: Boolean,
      default: false
    },
    editFormTitle: {
      type: String,
      default: ''
    },
    editForm: {
      type: Object,
      default() {
        return {
          serviceId: '',
          seqNo: '',
          serviceName: '',
          serviceContent: '',
          subjects: [],
          vciStatus: 0
        }
      },
    }
  },
  data() {
    return {
      showModel: false,
      // editForm: {},
      rules: {
        serviceName: [
          { required: true, message: '请填写服务类型', trigger: 'blur' }
        ],
        seqNo: [
          { required: true, message: '请填写序号', trigger: 'blur' },
        ],
        subjects: [
          { required: true, message: '请选择开票类目', trigger: 'blur' }
        ]
      },
    }
  },
  watch: {
    levels: {
      editFormShow (val) {
        this.showModel = val
      },
      deep: true
    }
  },
  created() {
    this.showModel = this.editFormShow
    console.log('123',this.editFormShow);
  },
  methods: {
    closeModel() {
      this.$emit('closeModel')
    },
    clearForm(next) {
      this.$refs['editForms'].clearValidate()
      next()
    },
    sure() {
      showNotify('success', '添加标签组')
    }
  }
}
</script>
<style lang="scss" scoped>

</style>
