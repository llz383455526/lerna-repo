<template>
  <div class="bg-white p15">
    <div style="margin-bottom:30px;">查看合同</div>
    <h4 class="ml50">基本信息
      <el-select v-model="contractHisId"
                 size="small ml10"
                 @change="handleChange">
        <el-option v-for="(e, k) in historyVer"
                   :key="k"
                   :label="e.versionMemo"
                   :value="e.contractHisId"></el-option>
      </el-select>
    </h4>
    <el-row class="mb15"
            style="font-weight: normal;">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">版本生效月份：</el-col>
      <el-col :span="8">{{detail.versonTimeMemo}}</el-col>
    </el-row>
    <el-row class="mb15"
            style="font-weight: normal;">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">企业名称：</el-col>
      <el-col :span="8">{{detail.customerName}}</el-col>
    </el-row>
    <el-row class="mb15"
            style="font-weight: normal;">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">服务商名称：</el-col>
      <el-col :span="8">{{detail.serviceCompanyName}}</el-col>
    </el-row>
    <el-row class="mb15"
            style="font-weight: normal;">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">行业类型：</el-col>
      <el-col :span="8">{{detail.cotractTypeName}}</el-col>
    </el-row>
    <el-row class="mb15"
            style="font-weight: normal;">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">服务类型：</el-col>
      <el-col :span="8">
        <span v-for="(e, i) in detail.serviceTypeList"
              :key="i">
          {{e.serviceName}}<template v-if="i + 1 != detail.serviceTypeList.length">，</template>
        </span>
      </el-col>
    </el-row>
    <el-row class="mb15"
            style="font-weight: normal;">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">结算方式：</el-col>
      <el-col :span="8">{{detail.settleTypeName}}</el-col>
    </el-row>
    <!-- <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">结算日期：</el-col>
            <el-col :span="8">{{detail.settleExp}}</el-col>
        </el-row> -->
    <el-row class="mb15"
            style="font-weight: normal;"
            v-if="!isExamine">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">服务费是否预开：</el-col>
      <el-col :span="8">{{detail.prePayType == 1 ? `是（${detail.prePayContent.serviceFeeType === 'real' ? '实发金额' : '应发金额'} * ${detail.prePayContent.serviceFeeRate}%）` : '否'}}</el-col>
    </el-row>
    <el-row class="mb15"
            style="font-weight: normal;">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">发票类型：</el-col>
      <el-col :span="8">{{detail.invoiceTypeName}}</el-col>
    </el-row>
    <el-row class="mb15"
            style="font-weight: normal;">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">开票类型：</el-col>
      <el-col :span="8">{{detail.openInvoiceType == 10 ? '账单开票' : '预开票'}}</el-col>
    </el-row>
    <el-row class="mb15"
            style="font-weight: normal;"
            v-if="!isExamine">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">服务费收费比例/金额：</el-col>
              <div v-if="detail.serviceFeeDescription">
                <span style="float: left;white-space: pre-line;">{{detail.serviceFeeDescription}}</span>
              </div>
      <show-service v-else :detail="detail"
                    :showSettledRate="false"></show-service>
    </el-row>
    <el-row class="mb15"
            style="font-weight: normal;">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">合同起止时间：</el-col>
      <el-col :span="8">{{detail.startDate}} 至 {{detail.endDate}}</el-col>
    </el-row>
    <!-- <el-row class="mb15"
            style="font-weight: normal;">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">客户类型：</el-col>
      <el-col :span="8">{{detail.originalTypeName}}</el-col>
    </el-row> -->
    <!-- <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">是否代理商客户：</el-col>
            <el-col :span="8">{{detail.agentClient ? '是' : '否'}}</el-col>
        </el-row> -->
    <!-- <template v-if="detail.originalType == 20"> -->
    <!-- <el-row class="mb15"
              style="font-weight: normal;"
              v-if="!historyId">
        <el-col :span="4"
                style="text-align: right; margin-right: 20px;">渠道名称：</el-col>
        <el-col :span="8">{{detail.agentCompanyName}}</el-col>
      </el-row> -->
    <!-- <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商分润：</el-col>
            <el-col :span="8">{{detail.agentFeeContent.serviceFeeRate}}%</el-col>
          </el-row> -->
    <!-- <el-row class="mb15"
              style="font-weight: normal;"
              v-if="!historyId">
        <el-col :span="4"
                style="text-align: right; margin-right: 20px;">渠道经理：</el-col>
        <el-col :span="8">{{detail.angentChargeByName}}</el-col>
      </el-row>
      <el-row class="mb15"
              style="font-weight: normal;"
              v-if="!historyId">
        <el-col :span="4"
                style="text-align: right; margin-right: 20px;">代理推广费率：</el-col>
        <el-col :span="16">
          <show-close-service :detail="detail"></show-close-service>
        </el-col>
      </el-row> -->
    <!-- </template> -->
    <!-- <el-row class="mb15"
            style="font-weight: normal;"
            v-if="!historyId">
      <el-col :span="4"
              style="text-align: right; margin-right: 20px;">客户归属：</el-col>
      <el-col :span="8">{{detail.originalName}}</el-col>
    </el-row> -->
    <h4 class="ml50 mt50">
      <span>归属代理商</span>
      <el-button type="text"
                 style="float: right; margin-right: 120px;"
                 @click="showGridData = !showGridData">{{showGridData?'收起':'展开'}}</el-button>
    </h4>
    <div style="margin-left: 120px; margin-right: 120px;">
      <el-table :data="gridData"
                v-if="showGridData">
        <el-table-column property="validDate"
                         label="生效月份"></el-table-column>
        <el-table-column property="version"
                         label="版本"></el-table-column>
        <el-table-column property="statusName"
                         label="状态"></el-table-column>
        <el-table-column property="originalTypeName"
                         label="客户类型"></el-table-column>
        <el-table-column property="agentCompanyName"
                         label="渠道名称"></el-table-column>
        <el-table-column property="angentChargeByName"
                         label="渠道经理"></el-table-column>
        <el-table-column property="agentQuotefeeDesc"
                         label="代理推广费率"
                         width="300"></el-table-column>
        <el-table-column property="updateTime"
                         label="更新时间"></el-table-column>
        <el-table-column property="updateBy"
                         label="更新人"></el-table-column>
      </el-table>
    </div>
    <h4 class="ml50 mt50">合同文件</h4>
    <el-upload class="upload-demo ml50"
               action=""
               :auto-upload="false"
               :on-change="handleUpload"
               multiple
               accept=".pdf,.doc,.docx,.jpg,.png,.gif"
               :show-file-list="false">
      <el-button size="small"
                 type="primary">点击上传</el-button>
    </el-upload>
    <div style="margin-left: 120px; margin-right: 120px;">
      <el-table :data="tableList"
                style="width: 100%;margin-top: 20px;">
        <el-table-column prop="fileName"
                         label="文件名称"></el-table-column>
        <el-table-column prop="createTime"
                         label="上传时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createByName"
                         label="操作人"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="handleDowload(scope.row.downloadCode)"
                       type="text"
                       size="medium"
                       style="padding:0;">下载</el-button>
            <el-button type="text"
                       @click="handleDelete(scope.row, scope.$index)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <h4 class="ml50 mt50"
        v-if="!isExamine">关联企业名称</h4>
    <div class="flex"
         v-if="!isExamine">
      <div v-for="e in detail.branchs"
           :key="e.branchId">
        {{e.branchName}}
      </div>
    </div>
    <el-button class="back"
               type="primary"
               @click="$router.back()"
               size="small">返回</el-button>
  </div>
</template>

<script>
    import {post, get, formPost} from '../../store/api';
    import {baseUrl} from '../../config/address';
    import showService from '../../pageComponent/showService'
    import showCloseService from '../../pageComponent/showCloseService'
    export default {
        components: {
            showService,
            showCloseService
        },
        data() {
            return {
                tableList: [],
                detail: {},
                isExamine: false,
                historyId: '',
                historyVer: [],
                contractId: '',
                contractHisId: '',
                gridData: [],
                showGridData: false,
            }
        },
        methods: {
            getAttachments() {
                const id = this.$route.query.contractId || this.$route.query.originId
                const versionSeq = this.$route.query.versionSeq
                // const url = this.$route.query.contractId ? '/api/contract-web/contract/contract-attachments' : '/api/contract-web/contract/attachment-infos';
                const url = '/api/contract-web/contract/attachment-infos'
                // const param = this.$route.query.contractId ? { contractId: id } : { contractId: id, versionSeq }
                const param = { contractId: id, versionSeq }
                get(url, param).then(data => {
                    this.tableList = data
                })
            },
            getDetail() {
                const { contractHisId } = this
                const url = '/api/contract-web/contract/contract-history-detail'
                const param = { contractHisId }
                get(url, param).then(data => {
                    this.detail = data
                    this.gridData = data.quoteFeeInfos
                    // 根据服务公司id过滤
                    this.detail.quoteFeeContent.serviceCompanyRateList = this.detail.quoteFeeContent.serviceCompanyRateList.filter(e => {
                        return this.detail.serviceCompanyIds.filter(ev => ev == e.serviceCompanyId).length
                    })
                    this.getOptionCustomerCompanies()
                })
            },
            handleDowload(downloadCode) {
                window.location.href = baseUrl + '/api/contract-web/file/download'
                    + '?downloadCode=' + downloadCode;
            },
            getOptionCustomerCompanies() {
                let url = '/api/console-dlv/option/get-option-customer-companies';
                let self = this;
                get(url).then(data => {
                    self.customerCompaniesList = data;
                })
            },
            getOptionHistory() {
                const url = '/api/contract-web/contract/query-contracts-history-simple'
                const id = this.$route.query.contractId || this.$route.query.originId
                const param = {
                    contractId: id
                }
                get(url, param).then(data => {
                    this.historyVer = data
                })
            },
            handleChange(contractHisId) {
                const obj = this.historyVer.find(el => {
                    return el.contractHisId === contractHisId
                })
                const { versionSeq } = obj
                const { contractId } = this.$route.query
                this.$router.push({
                    path: '/main/contract/preview',
                    query: { contractId, contractHisId, versionSeq }
                });
                this.getAttachments()
                this.getDetail()
            },
            handleUpload(file) {
                var AllImgExt = ".doc|.docx|.pdf|.jpg|.png|.gif";
                var extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
                if (AllImgExt.indexOf(extName) == -1) {
                    this.$message.error('文件类型错误');
                    return false;
                }
                let formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('file', file.raw);
                formData.append('contractHisId', this.$route.query.contractHisId)
                const url = '/api/contract-web/contract/upload-current-attachment'
                formPost(url, formData).then(data => {
                    this.tableList.push(data);
                    this.$message.success('上传成功!');
                });
            },
            handleDelete(row, index) {
                const { downloadCode } = row
                this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/api/contract-web/file/delete', { downloadCode }).then(data => {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.tableList.splice(index, 1)
                    });
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            }
        },
        created() {
            this.contractId = this.$route.query.contractId
            this.contractHisId = parseInt(this.$route.query.contractHisId)
            this.getAttachments()
            this.getDetail()
            this.getOptionHistory()
            this.isExamine = this.$route.query.examine ? true : false
            this.historyId = this.$route.query.historyId ? parseInt(this.$route.query.historyId) : ''
        }
    }
</script>

<style scoped>
.bg-white {
  overflow: hidden;
}
.indent {
  text-indent: 10px;
}
.inline {
  display: inline-block;
  width: 200px;
}
.flex {
  display: flex;
  margin-top: 24px;
  margin-left: 120px;
  flex-direction: row;
  flex-wrap: wrap;
}
.flex > div {
  font-size: 14px;
  border-radius: 2px;
  background-color: #f4f4f5;
  padding: 5px 5px;
  margin-bottom: 10px;
  margin-right: 10px;
}
.back {
  float: right;
  margin-right: 40px;
}
.mr8 {
  margin-right: 8px;
}
</style>

<style lang="scss">
.el-table .cell {
  white-space: pre-line;
}
</style>
