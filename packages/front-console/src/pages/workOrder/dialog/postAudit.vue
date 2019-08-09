<template>
  <el-dialog
    title="岗位审核"
    custom-class="el-middle-dialog"
    :close-on-click-modal="false"
    width="600px"
    :visible.sync="postDialog"
    @close="closePostDialog"
  >
    <el-steps :active="active" align-center v-if="detail">
      <el-step v-for="(item, index) in step" :key="index"
        :title="item.activityName"
        :description="item.activityId === 'taskCreate' ? `（来自：${detail.ServiceCompanyName}）` : `（审核人：${current.userName}）`"></el-step>
    </el-steps>
    <h3 class="green">岗位详情</h3>
    <el-form ref="form" size="mini" :model="form" :rules="rules" :inline="true" v-if="detail">
      <el-form-item label="岗位名称：" :label-width="formLabelWidth">
        <div class="content">{{detail.Name}}</div>
      </el-form-item>
      <el-form-item label="落地公司名称：" :label-width="formLabelWidth">
        <div class="content">{{detail.ServiceCompanyName}}</div>
      </el-form-item>
      <el-form-item label="服务类型：" :label-width="formLabelWidth">
        <div class="content">{{detail.ServiceTypeName}}</div>
      </el-form-item>
      <el-form-item label="工作内容：" :label-width="formLabelWidth">
        <div class="content">{{detail.Requirement}}</div>
      </el-form-item>
      <el-form-item label="绩效费结算规则：" :label-width="formLabelWidth">
        <div class="content">{{detail.SettlementRule}}</div>
      </el-form-item>
      <el-form-item label="审核意见：" prop="remark" :label-width="formLabelWidth">
        <el-input
          size="small"
          type="textarea"
          v-model="form.remark"
          class="input-width"
          :rows="4"
          placeholder="请输入审核意见"
        ></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer">
      <el-button size="small" type="primary" @click="pass('form')">通过</el-button>
      <el-button size="small" @click="refuse('form')">拒绝</el-button>
    </div>
    <!-- <pre>{{form}}</pre> -->
  </el-dialog>
</template>

<script>
import { get, post } from "../../../store/api"
import { workflow, asr } from "src/api"
import { showNotify } from '../../../plugin/utils-notify.js'

export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
  },
  data() {
    return {
      formLabelWidth: "130px",
      postDialog: false,
      form: {
        id: '', // 岗位模板id
        remark: '',  // 审核意见
        processInsId: '',
        taskId: '',
        userId: null,
        userName: '',
        profileId: null,
        isPass: false, //true 通过, false 拒绝
      },
      step: [], // 总步骤
      current: null, // 当前步骤
      detail: null, // 岗位模板详情
      rules: {
        remark: [
          { required: true, message: "请输入岗位名称", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    value(val) {
      this.postDialog = val;
    },
  },
  computed: {
      active() {
        let index = 0
        if (this.current) {
            index = this.step.findIndex(val => val.activityId === this.current.activityId)
        }
        return index + 1
      }
  },
  created() {
  },
  mounted() {},
  methods: {
    closePostDialog() {
      this.postDialog = false;
      this.$emit("input", false);
    },
    query(params) {
        Promise.all([
            get(workflow.getProcessAllProgress, { processInstanceId: params.processInstanceId }),
            get(workflow.getProcessCurrentProgress, { processInstanceId: params.processInstanceId }),
            get(`${asr.postDetail}/${params.businessId}`)
        ]).then(data => {
            this.step = data[0].default
            this.current = data[1][0]
            this.detail = data[2]
            this.form.id = parseInt(params.businessId, 10) // 岗位模板ID parseInt(params.businessId, 10)
            this.form.processInsId = params.processInstanceId
            this.form.taskId = `${params.taskId}`
            // console.log(this.$store.getters.userInformation)
        })
    },
    pass() {
        this.form.isPass = true
        this.audit()
    },
    refuse(formName) {
        this.form.isPass = false
      this.$refs[formName].validate(valid => {
        if (valid) {
            this.audit()
        } else {
          return false;
        }
      });
    },
    audit() {
        // 当前用户信息
        const user = this.$store.getters.userInformation
        if (!user) {
            showNotify('error', '获取用户信息失败！');
            return
        }
        this.form.userId = user.id
        this.form.userName = user.name
        this.form.profileId = user.userProfile.id
        this.form.userId = user.id
        post(asr.postAudit, this.form).then(() => {
            this.$emit('change')
            this.closePostDialog()
        })
    },
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