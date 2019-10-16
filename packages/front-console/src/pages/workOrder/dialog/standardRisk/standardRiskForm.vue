<template>
  <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="140px" class="demo-ruleForm">
  <el-form-item label="客户名称" prop="customerCompanyName">
    <el-input v-if="isEdit" :disabled="currentWorkflow.currentTaskNodeId === 'rejectApprove'"  v-model="ruleForm.customerCompanyName" @blur="getContractList"></el-input>
    <span v-else>{{ruleForm.customerCompanyName}}</span>
  </el-form-item>
  <!-- 没有查到 -->
  <el-form-item v-if="contractList.length || ruleForm.contractNo" label="合同申请编号" prop="contractNo" :rules="[
      { required: true, message: '请选择合同申请编号', trigger: 'change' },
    ]">
    <!-- 如果是官网意向客户，这里不显示，不验证  -->
    <el-select v-if="isEdit" v-model="ruleForm.contractNo" placeholder="请选择合同申请编号" @change="changeMobile">
      <el-option
        v-for="item in contractList"
        :key="item.instanceId"
        :label="item.instanceId"
        :value="item.instanceId">
      </el-option>
    </el-select>
    <span v-else>{{ruleForm.contractNo}}</span>
  </el-form-item>
  <el-form-item label="纳税人识别号" prop="taxpayerIdentificationNo">
    <!-- 如果是官网意向客户，这里可编辑 -->
    <el-input v-if="isEdit" :disabled="!!contractList.length" v-model="ruleForm.taxpayerIdentificationNo"></el-input>
    <span v-else>{{ruleForm.taxpayerIdentificationNo}}</span>
  </el-form-item>
  <el-form-item label="申请人手机号" prop="mobile">
    <!-- 如果是官网意向客户，这里可编辑 -->
    <el-input v-if="isEdit" :disabled="!!contractList.length" v-model="ruleForm.mobile"></el-input>
    <span v-else>{{ruleForm.mobile}}</span>
  </el-form-item>
  <el-form-item label="上传合规通初稿" prop="referIds">
    <el-upload
      v-if="!(ruleForm.referIdList && ruleForm.referIdList.length)"
      class="upload-demo"
      drag
      :show-file-list="false"
      :on-change="uploadReport"
      action=""
      accept=".xlsx, .xls"
      :auto-upload="false"
      multiple>
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
    </el-upload>
    <risk-report v-else :isEdit="isEdit" :look="look"
      :tableData="referIdList" @deleteFile="deleteReport"></risk-report>
  </el-form-item>
  <el-form-item label="附件" prop="adjunctFileIds">
    <el-upload
      v-if="isEdit"
      class="upload-demo"
      :show-file-list="false"
      action=""
      :auto-upload="false"
      :on-change="uploadPlugin">
      <el-button v-if="!look" size="small" type="primary">点击上传</el-button>
    </el-upload>
    <risk-plugin v-if="ruleForm.adjunctFileIdList && ruleForm.adjunctFileIdList.length"
      :isEdit="isEdit" :look="look" :tableData="ruleForm.adjunctFileIdList" @deleteFile="deletePlugin"></risk-plugin>
  </el-form-item>
  <el-form-item label="备注" prop="remark">
    <el-input v-if="currentWorkflow.currentTaskNodeId !== 'endEvent' && !look" type="textarea" v-model="ruleForm.remark"></el-input>
    <risk-remark v-if="ruleForm.remarkList && ruleForm.remarkList.length" :tableData="ruleForm.remarkList"></risk-remark>
  </el-form-item>
  </el-form>
</template>

<script>
import { get, post, formPost } from "store/api";
import { workflow } from "src/api"
import riskReport from './riskReport.vue'
import riskPlugin from './riskPlugin.vue'
import riskRemark from './riskRemark.vue'

export default {
  props: {
    ruleForm: {
      type: Object,
    },
    contractList: {
      type: Array,
    },
    isEdit: {
      type: Boolean,
    },
    currentWorkflow: {
      type: Object,
    },
    look: {
      type: Boolean,
    }
  },
  components: {
    riskReport,
    riskPlugin,
    riskRemark,
  },
  data() {
    var checkMobile = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请填写申请人手机号'));
      } else if(!/^1\d{10}$/.test(value)) {
        callback(new Error('请填写正确的手机号'));
      } else {
        callback()
      }
    };
    return {
      customerCompanyName: '', // 要查询的公司，避免再次查询
      targetExt: {}, // 上传的对象
      rules: {
        customerCompanyName: [
          { required: true, message: '请选择正确的客户名称', trigger: 'change' }
        ],
        taxpayerIdentificationNo: [
          { required: true, message: '请填写纳税人识别号', trigger: 'blur' }
        ],
        mobile: [
          { validator: checkMobile, trigger: 'blur' }
        ],
        referIds: [
          { required: true, message: '请上传合规通初稿', trigger: 'blur' }
        ],
      }
    };
  },
  computed: {
    referIdList() {
      const arr = this.currentWorkflow.finishedStatus === "FINISHED" ? 
        this.ruleForm.referIdList.filter(i => i.fileBusinessType === '2') : 
        this.ruleForm.referIdList.filter(i => i.fileBusinessType === '1')
      return arr
    }
  },
  methods: {
    // 获取合同申请编号
    getContractList() {
      if(this.ruleForm.customerCompanyName === this.customerCompanyName) {
        return
      }
      this.customerCompanyName = this.ruleForm.customerCompanyName
      // 初始化合同申请编号，纳税人识别号，申请人手机号
      this.ruleForm.contractNo = ''
      this.ruleForm.taxpayerIdentificationNo = ''
      this.ruleForm.mobile = ''
      this.$emit('getContractList', this.customerCompanyName)
    },
    upload(file,targetType,targetExt) {
      var form = new FormData();
      form.append('fileName', file.name);
      form.append('file', file.raw);
      targetExt && form.append('targetExt', targetExt)
      form.append('targetType', targetType)
      return formPost('/api/sysmgr-web/file/upload', form).then(data => {
          return data
      });
    },
    // 修改纳税人识别号
    changeMobile(e) {
      const contract = this.contractList.filter(i => i.instanceId === e)[0]
      console.log(contract)
      this.$set(this.ruleForm, 'taxpayerIdentificationNo', contract.taxIdcd)
      this.$set(this.ruleForm, 'mobile', contract.chargePhone)
    },
    // 上传
    uploadReport(file) {
      // 先去请求后端的预上传接口
      get(workflow.getUploadNo).then(data => {
        // 返回后再执行真真的上传
        this.targetExt = JSON.stringify(data)
        this.upload(file, 'compliance_risk_report_import', this.targetExt).then(res => {
          this.$set(this.ruleForm, 'referIdList', [])
          this.$set(this.ruleForm, 'referIds', [])
          // 将结构狗造成和编辑的一样
          res.fileBusinessType = "1"
          res.reportNo = data.reportNo
          this.$set(this.ruleForm.referIdList, 0, res)
          this.$set(this.ruleForm.referIds, 0, res.referId)
          // 重新校验一下
          this.$refs.ruleForm.validateField('referIds')
        })
      })
    },
    // 上传附件
    uploadPlugin(file) {
      this.upload(file, 'compliance_risk_report_import_ext_file').then(res => {
        this.$set(this.ruleForm, 'adjunctFileIdList', this.ruleForm.adjunctFileIdList || [])
        this.$set(this.ruleForm, 'adjunctFileIds', this.ruleForm.adjunctFileIds || [])
        this.ruleForm.adjunctFileIdList.push(res)
        this.ruleForm.adjunctFileIds.push(res.referId)
      })
    },
    // 删除报告
    deleteReport() {
      this.ruleForm.referIdList = []
      this.ruleForm.referIds = []
    },
    // 删除附件
    deletePlugin(index) {
      this.ruleForm.adjunctFileIdList.splice(index, 1)
      this.ruleForm.adjunctFileIds.splice(index, 1)
    }
  },
}
</script>

<style>

</style>