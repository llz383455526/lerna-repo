<template>
  <div class="main">
    <div class="title">基本信息</div>
    <el-form class="form"
      :model="form"
      ref="form"
      :rules="rules"
      label-width="120px">
      <el-form-item label="生效月份">
        {{ form.versionStartDate && form.versionStartDate.substr(0, 7) }}
      </el-form-item>
      <el-form-item label="渠道名称">
        {{ form.companyName }}
      </el-form-item>
      <el-form-item label="渠道经理">
        {{ form.salesInfo && form.salesInfo.salesName }}
      </el-form-item>
      <el-form-item label="代理期限">
        {{ form.agentStart + ' - ' + form.agentEnd }}
      </el-form-item>
      <el-form-item label="落地公司">
        {{ form.serviceCompanyName }}
      </el-form-item>
      <el-form-item label="申请主体">
        {{ form.agentTypeName }}
      </el-form-item>
      <el-form-item label="结算费率">
        <span v-if="agentFeeInfo.quoteFeeType === 'ratio'">固定费率结算：{{ agentFeeInfo.feeContentMap.no[0].percent }}%</span>
        <template v-else>
          <span>分{{ agentFeeInfo.incomeAmount }}万 - {{ agentFeeInfo.subType === 'nonflow'?'无流水阶梯':'按流水分阶梯' }}报价</span>
          <div style="padding-left: 20px">
            <p>(1) {{ agentFeeInfo.incomeAmount }}万含以下<span v-if="agentFeeInfo.subType === 'nonflow'">，实发金额*{{ agentFeeInfo.feeContentMap.down[0].percent }}%</span></p>
            <template v-if="agentFeeInfo.subType === 'flow'">
              <p class="list-item"
                v-for="(downitem, downindex) in agentFeeInfo.feeContentMap.down"
                :key="'downindex'+downindex">
                {{ downindex === 0 ?'小于':downitem.startAmount+'万' + (downitem.equalsStart?'含':'') + (downindex === agentFeeInfo.feeContentMap.down.length-1 ?'以上':'~') }}
                <span v-if="downindex < agentFeeInfo.feeContentMap.down.length-1">{{ downitem.endAmount }}万{{ downitem.equalsEnd?'含':'' }}</span>，
                实发金额*{{ downitem.percent }}%
              </p>
            </template>
            <p>(2) {{ agentFeeInfo.incomeAmount }}万以上<span v-if="agentFeeInfo.subType === 'nonflow' || agentFeeInfo.subType === 'flow'">，实发金额*{{ agentFeeInfo.feeContentMap.up[0].percent }}%</span></p>
          </div>
        </template>
      </el-form-item>
    </el-form>
    <div class="title">合同文件</div>
    <div class="m30">
      <el-upload :action="uploadUrl"
        :on-error="handleError"
        :before-upload="handleBeforeUpload"
        :http-request="handleHttpRequest"
        multiple
        accept=".docx, .xlsx, .xls, .pdf"
        :show-file-list="false"
        :file-list="fileList">
        <el-button size="small"
          type="primary">点击上传</el-button>
      </el-upload>
      <el-table class="mt20"
        :data="form.attachments">
        <el-table-column label="文件名称"
          prop="displayname"></el-table-column>
        <el-table-column label="上传时间"
          prop="createTime"></el-table-column>
        <el-table-column label="操作人"
          prop="createByName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <a :href="`/api/contract-web/file/download?downloadCode=${scope.row.downloadCode}`"
              target="_bank">
              <el-button type="text">下载</el-button>
            </a>
            <el-button type="text"
              @click="deleteFile(scope.row.downloadCode, scope.$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button class="mt20"
        size="small"
        type="primary"
        @click="$router.back()">返回</el-button>
    </div>
  </div>
</template>
<script>
import { get, post, formPost } from "../../store/api";
import { contract } from 'src/api/contract';

export default {
    data() {
        return {
            form: {},
            agentFeeInfo: {},
            contractHisId: '',
            uploadUrl: ''
        };
    },
    created() {
        this.contractHisId = this.$route.query.contractHisId;
        // console.log(this.contractHisId)
        this.contractHisId && this.getDetail();
        // 上传接口
        this.uploadUrl = contract.uploadUrl
    },
    methods: {
        getDetail() {
            get("/api/contract-web/agent-contract/agent-contractHis-detail", {
                contractHisId: this.contractHisId
            }).then(data => {
                this.form = data
                this.agentFeeInfo = data.agentFeeInfo
            });
        },
        handleError() {
            this.$message({ type: 'error', message: '上传失败!'})
        },
        handleBeforeUpload(file) {
            const AllImgExt = ".docx, .xlsx, .xls, .pdf";
            let extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
            if (AllImgExt.indexOf(extName) < 0) {
                this.$message({ type: 'error', message: '文件类型错误'})
                return false
            }

            let formData = new FormData()
            formData.append('fileName', file.name)
            formData.append('file', file);
            formData.append('contractHisId', this.contractHisId)
            this.formData = formData
        },
        handleHttpRequest() {
            formPost(this.uploadUrl, this.formData).then(result => {
                this.form.attachments.push(result)
                this.$message({ type:'success', message: '上传成功!' })
            })
        },
        deleteFile(downloadCode, index) {
            const param = { downloadCode }
            post('/api/contract-web/file/delete', param).then(() => {
                this.form.attachments.splice(index, 1);
            })
        },
    }
};
</script>

<style scoped>
.main {
  padding: 30px 10px 50px;
  background-color: #fff;
}
.title {
  margin-top: 30px;
  font-weight: 700;
}
</style>
