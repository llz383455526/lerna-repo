<template>
<el-dialog
  title="合规通报告审批"
  :visible.sync="show"
  @close="resetForm"
  width="800px">
  <standard-risk-step :active="active" :step-list="stepList"></standard-risk-step>
  <!-- 创建或者驳回编辑 -->
  <standard-risk-form ref="standardRiskForm" :isEdit="isEdit"
    :ruleForm="ruleForm" :contractList="contractList"
    :look="look" :currentWorkflow="currentWorkflow"
    @getContractList="getContractList"></standard-risk-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="show = false">取消</el-button>
    <template v-if="!look">
      <!-- 创建 -->
      <el-button v-if="isCreate && !isExamine" type="primary" @click="submitForm">确定</el-button>
      <!-- 驳回编辑 -->
      <el-button v-if="currentWorkflow.currentTaskNodeId === 'rejectApprove'" type="primary" @click="editSubmitForm">确定</el-button>
      <template v-else-if="isExamine" >
        <!-- 复核  -->
        <el-button type="primary" @click="examineForm">复核通过</el-button>
        <!-- 驳回  -->
        <el-button type="primary" @click="rejectForm">驳回</el-button>
      </template>
    </template>
  </span>
</el-dialog>
</template>

<script>
import standardRiskStep from './standardRiskStep.vue'
import standardRiskForm from './standardRiskForm.vue'
import { get, post, postWaitbyTaskId } from "store/api";
import { workflow } from "src/api"

export default {
  props: {
    id: {
      type: [String, Number],
    },
    processInstanceId: {
      type: [String, Number],
    }
  },
  data() {
    return {
      show: false,
      look: false, // 是否只能查看
      processTypeKey: 'compliance-risk-flow', // 工单步骤条类型
      isCreate: true, // 新建
      stepList: [], // 步骤条
      active: 1,
      currentWorkflow: {},
      ruleForm: { // 工单详情
        "adjunctFileIds": [], // 扩展附件
        "contractNo": "", // 合同编号
        "customerCompanyName": "", // 客户公司名称
        "mobile": "", // 手机号
        "referIds": [], // 初稿文件ID
        "remark": "", // 备注
        "taxpayerIdentificationNo": "", // 纳税人识别号
        "processDefinitionKey": 'compliance-risk-flow', // 流程的key
        "workOrderId": "", // 工单号
        "referIdList": [], // 上传的报告
        "adjunctFileIdList": [], // 上传的附件
        "remarkList": []
      },
      contractList: [],// 关联的合同
    };
  },
  components: {
    standardRiskStep,
    standardRiskForm,
  },
  computed: {
    // 是否在审核阶段
    isExamine() {
      return this.currentWorkflow.currentTaskNodeId === "finalizedApprove"
    },
    // 是否在可编辑状态
    isEdit() {
      return this.isCreate || this.currentWorkflow.currentTaskNodeId === "rejectApprove"
    },
  },
  watch: {
    show(newVal) {
      // 弹窗展示时获取详情
      if(newVal && !this.isCreate) {
        this.getWorkflowProcess()
        this.getRiskWorkflow()
      }
      if(newVal && this.isCreate) {
        this.getStep()
      }
    }
  },
  methods: {
    // 获取合同编号的options
    getContractList(customerCompanyName) {
      get(workflow.getContractList, {companyName: customerCompanyName}).then(res => {
        this.contractList = res
      })
    },
    // 获取合规通详情
    getRiskWorkflow() {
      get(workflow.getRiskWorkflow, {id: this.currentWorkflow.businessId}).then(res => {
        // 初始化表单中的需要字段，给重新编辑需要
        res.referIds = [res.referIdList[0].referId]
        res.adjunctFileIds = res.adjunctFileIdList.map(item => item.referId)
        this.$refs.standardRiskForm.customerCompanyName = res.customerCompanyName
        
        this.ruleForm = res
        // 如果是修改状态，并且有合同编号，还要去获取合同编号的options
        if(this.isEdit) {
          this.getContractList(res.customerCompanyName)
        }
      })
    },
    // 验证表单
    validateForm() {
      return new Promise((resolve, reject) => {
          this.$refs.standardRiskForm.$refs.ruleForm.validate((valid) => {
              if (valid) {
                  resolve(this.$refs.standardRiskForm.ruleForm)
              } else {
                  console.log('error submit!!');
                  return false;
              }
          });
      })
    },
    // 初始化表单
    resetForm() {
      this.$refs.standardRiskForm.$refs.ruleForm.resetFields()
      this.contractList = []
      this.currentWorkflow = {}
      this.ruleForm.referIdList = []
      this.ruleForm.adjunctFileIdList = []
      this.ruleForm.remarkList = []
      this.ruleForm.contractNo = ''
      this.$refs.standardRiskForm.customerCompanyName = ''
    },
    // 驳回，
    rejectForm() {
      const obj = {
        "id": this.currentWorkflow.businessId,
        "processInsId": this.currentWorkflow.processInstanceId,
        "remark": this.ruleForm.remark,
        "taskId": this.currentWorkflow.id
      }
      postWaitbyTaskId(workflow.rejectRiskWorkflow, obj).then(res => {
          this.show = false
          this.$emit('handle')
      })
    },
    // 审核通过
    examineForm() { // 审核通过
      const obj = {
        "id": this.currentWorkflow.businessId,
        "processInsId": this.currentWorkflow.processInstanceId,
        "remark": this.ruleForm.remark,
        "taskId": this.currentWorkflow.id
      }
      postWaitbyTaskId(workflow.approveRiskWorkflow, obj).then(res => {
          this.show = false
          this.$emit('handle')
      })
    },
    // 创建
    submitForm() { // 申请
      this.validateForm().then(res => {
          return post(workflow.addRiskWorkflow, res)
      }).then(res => {
          this.show = false
          this.$emit('create')
      })
    },
    editSubmitForm() {
      this.validateForm().then(res => {
        res.taskId = this.currentWorkflow.id
        res.processInsId = this.currentWorkflow.processInstanceId
        return postWaitbyTaskId(workflow.editRiskWorkflow, res)
      }).then(res => {
          this.show = false
          this.$emit('create')
      })
    },
    // 获取实际工单的步骤条
    getWorkflowProcess() {
      Promise.all([
        get(workflow.getProcessAllProgress, { processInstanceId: this.currentWorkflow.processInstanceId }),
        get(workflow.getProcessCurrentProgress, { processInstanceId: this.currentWorkflow.processInstanceId })
      ]).then(data => {
        this.stepList = []
        // 这里涉及到回到创建，所以要重新整合数据
        // 先判断data[1]的最后一个是不是驳回编辑，如果是，修改一下data[0]的activityName，然后重新开始直接用
        const currentStepLen = data[1].length
        if(data[1] && data[1][currentStepLen-1].activityId === 'finalizedApprove') {
          // 判断是通过还是驳回
          if(this.currentWorkflow.finishedStatus === 'FINISHED') {
            this.active = 3
            const arr = data[0].default
            arr[0] = data[1][currentStepLen-2]
            arr[1] = data[1][currentStepLen-1]
            arr[0].activityName = "创建"
            this.stepList = arr
          } else {
            this.active = 1
            this.stepList = data[0].default
          }
        } else if(data[1] && data[1][currentStepLen-1].activityId === 'rejectApprove') {
          this.active = 2
          const arr = data[0].default
          arr[0] = data[1][currentStepLen-1]
          arr[0].activityName = "创建"
          this.stepList = arr
        }
      })
    },
    // 创建的时候获取合规通的步骤条 
    getStep() {
      get(workflow.getProcessAllProgressByTypeKey, { processTypeKey: this.processTypeKey }).then(data => {
        this.active = 1
        this.stepList = data.default
      })
		}
  }
}
</script>

<style>

</style>