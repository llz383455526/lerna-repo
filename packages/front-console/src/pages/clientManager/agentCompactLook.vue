<template>
  <div class="r_main">
    <el-button size="medium" @click="$router.back()">返回</el-button>
    <a :href="`/api/contract-web/agent-contract-generate/download-pdf-attachments?generateId=${this.generateId}`">
      <el-button size="medium" type="primary">下载pdf合同</el-button>
    </a><span class="tip">注意：若已签约，请在下方上传已盖章扫描件</span><br>
    <div class="title">
      合同基本信息
    </div>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">合同模板：</el-col>
      <el-col :span="8">{{getName()}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">试合作期：</el-col>
      <el-col :span="8">若乙方第一次代理甲方产品，则本合同前 {{data.probation}} 个月为试合作期</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">代理期限：</el-col>
      <el-col :span="8">{{data.agentStart}} - {{data.agentEnd}}</el-col>
    </el-row>
    <div class="title">
      代理商基本信息
    </div>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商名称：</el-col>
      <el-col :span="8">{{data.agentName}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">机构代码：</el-col>
      <el-col :span="8">{{data.agency}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商单位地址：</el-col>
      <el-col :span="8">{{data.address}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商电话：</el-col>
      <el-col :span="8">{{data.telephone}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">开户名称：</el-col>
      <el-col :span="8">{{data.accountName}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">开户银行：</el-col>
      <el-col :span="8">{{data.depositBank}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">银行账号：</el-col>
      <el-col :span="8">155515</el-col>
    </el-row>
    <div class="title">
      代理商联系信息
    </div>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商联系人：</el-col>
      <el-col :span="8">{{data.contactName}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商联系人电话：</el-col>
      <el-col :span="8">{{data.contactPhone}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商联系人地址：</el-col>
      <el-col :span="8">{{data.contactAddr}}</el-col>
    </el-row>
    <div class="title">
      代理推广费报价
    </div>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">落地公司：</el-col>
      <el-col :span="8" v-if="data.quoteFeeContent">
        <span class="mr10" v-for="e in data.quoteFeeContent.serviceCompanyRateList" :key="e.serviceCompanyId">{{e.serviceCompanyName}}</span>
      </el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">报价规则：</el-col>
      <el-col :span="8">{{data.quoteRule == '0' ? '结算规则' : '返佣规则'}} <i class="el-icon-question ml10" title="结算规则：按高于结算费率的部分结算返佣规则：按返佣费率直接返佣"></i></el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">结算费率：</el-col>
      <el-col :span="16">
        <show-close-service :detail="data"></show-close-service>
      </el-col>
    </el-row>
    <div class="title">
      销售（渠道经理）联系信息
    </div>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">销售姓名：</el-col>
      <el-col :span="8">{{data.chargeByName}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">销售联系电话：</el-col>
      <el-col :span="8">{{data.chargePhone	}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">销售地址：</el-col>
      <el-col :span="8">{{data.chargeAddr}}</el-col>
    </el-row>
    <div class="title">
      合同扫描件上传
    </div>
    <el-upload
      v-if="data.status == 20"
      class="upload-demo ml50"
      :action='`url`'
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="handleBeforeUpload"
      :http-request="hanldleHttpRequest"
      multiple
      accept=".pdf,.doc,.docx,.jpg,.png,.gif"
      :show-file-list=false
      :file-list="fileList">
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
    <el-table class="pl50 mb50" :data="fileList">
      <el-table-column prop="fileName" label="文件名称"></el-table-column>
      <el-table-column prop="createTime" label="上传时间">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="createByName" label="操作人"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="handleDownload(scope.row.downloadCode)" type="text" size="medium" style="padding:0;">下载</el-button>
          <el-button  type="text" size="medium" style="padding:0;" v-if="data.status == 20" @click="handleDelete(scope.row.downloadCode, scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="footer top_24" v-if="data.status == 20 && fileList.length">
      <el-button size="medium" @click="fileList = []">取消</el-button>
      <el-button size="medium" type="primary" @click="submit">确认上传</el-button>
    </div>
  </div>
</template>
<script>
import {baseUrl} from '../../config/address';
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
import showCloseService from '../../pageComponent/showCloseService'
export default {
  components: {
    showCloseService
  },
  data() {
    return {
      fileList: [],
      referArr: [],
      generateId: '',
      data: {},
      contractTplList: []
    }
  },
  mounted() {
    this.generateId = this.$route.query.generateId
    this.generateId && get('/api/contract-web/agent-contract-generate/detail', {
      generateId: this.generateId
    }).then(data => {
      this.data = data
      this.data.attachments.forEach(e => {
        this.fileList.push({
          fileName: e.displayname,
          createTime: e.createTime,
          createByName: e.createByName,
          downloadCode: e.downloadCode
        })
        this.referArr.push(e.refId)
      })
    })
    get('/api/contract-web/contract-tpl/tpl-options?agentTpl=true').then(data => {
      this.contractTplList = data
    })
  },
  methods: {
    getName() {
      return (this.contractTplList.filter(e => e.value == this.data.tplId)[0] || {}).text
    },
    handleSuccess(file) {
      this.fileList.push(file.data);
      this.referArr.push(file.data.referId);
    },
    handleError() {
      this.$message({
        type: 'error',
        message: '上传失败！'
      })
    },
    handleDownload(downloadCode) {
      window.location.href = baseUrl + '/api/contract-web/file/download' + '?downloadCode=' + downloadCode;
    },
    handleDelete(downloadCode, index) {
      this.$confirm('是否删除该文件?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        post('/api/contract-web/file/delete', { downloadCode }).then(data => {
          this.$message({
            type: 'success',
            message: '删除成功！'
          })
          this.fileList.splice(index, 1)
          this.referArr.splice(index, 1)
        });
      }).catch(() => {})
    },
    handleBeforeUpload(file) {
      var AllImgExt = ".doc|.docx|.pdf|.jpg|.png|.gif";
      var extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
      if (AllImgExt.indexOf(extName) == -1) {
        this.$message({
          type: 'error',
          message: '文件类型错误！'
        })
        return false;
      }
      let formData = new FormData();
      formData.append('fileName', file.name);
      formData.append('file', file);
      this.formData = formData;
    },
    hanldleHttpRequest() {
      let url = '/api/contract-web/file/upload';
      formPost(url, this.formData).then(data => {
        this.fileList.push(data);
        this.referArr.push(data.referId);
        this.$message({
          type: 'success',
          message: '上传成功！'
        })
      });
    },
    submit() {
      post('/api/contract-web/agent-contract-generate/confirm-submit', {
        generateId: this.generateId,
        referIds: this.referArr
      }).then(data => {
        this.$router.back()
        this.$message({
          type: 'success',
          message: '提交成功！'
        })
      })
    }
  }
}
</script>
<style scoped>
.r_main {
  padding: 30px 15px 50px;
  background-color: #fff;
}
.title {
  display: inline-block;
  margin: 30px 0px 30px 0px;
  font-weight: 700;
}
.mb15 {
  margin-bottom: 15px;
}
.el-icon-question {
  margin-right: 5px;
  color: #f56c6c;
  cursor: pointer;
}
.mr10 {
  margin-right: 10px;
}
.tip {
    color: #999;
    font-size: 14px;
}
</style>
