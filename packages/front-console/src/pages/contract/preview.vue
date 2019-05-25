<template>
    <div class="bg-white p15">
        <div style="margin-bottom:30px;">查看合同</div>
        <h4 class="ml50">基本信息</h4>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">版本生效月份：</el-col>
            <el-col :span="8">{{detail.versionStartDate}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">企业名称：</el-col>
            <el-col :span="8">{{detail.customerName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">服务商名称：</el-col>
            <el-col :span="8">{{detail.serviceCompanyName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">行业类型：</el-col>
            <el-col :span="8">{{detail.cotractTypeName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">服务类型：</el-col>
            <el-col :span="8">
                <span v-for="(e, i) in detail.serviceTypeList" :key="i">
                    {{e.serviceName}}<template v-if="i + 1 != detail.serviceTypeList.length">，</template>
                </span>
            </el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">结算方式：</el-col>
            <el-col :span="8">{{detail.settleTypeName}}</el-col>
        </el-row>
        <!-- <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">结算日期：</el-col>
            <el-col :span="8">{{detail.settleExp}}</el-col>
        </el-row> -->
        <el-row class="mb15" style="font-weight: normal;" v-if="!isExamine">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">服务费是否预开：</el-col>
            <el-col :span="8">{{detail.prePayType == 1 ? `是（${detail.prePayContent.serviceFeeType === 'real' ? '实发金额' : '应发金额'} * ${detail.prePayContent.serviceFeeRate}%）` : '否'}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">发票类型：</el-col>
            <el-col :span="8">{{detail.invoiceTypeName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">开票类型：</el-col>
            <el-col :span="8">{{detail.openInvoiceType == 10 ? '账单开票' : '预开票'}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;" v-if="!isExamine">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">服务费收费比例/金额：</el-col>
            <show-service :detail="detail"></show-service>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">合同起止时间：</el-col>
            <el-col :span="8">{{detail.startDate}} 至 {{detail.endDate}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">客户类型：</el-col>
            <el-col :span="8">{{detail.originalTypeName}}</el-col>
        </el-row>
        <!-- <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">是否代理商客户：</el-col>
            <el-col :span="8">{{detail.agentClient ? '是' : '否'}}</el-col>
        </el-row> -->
        <template v-if="detail.originalType == 20">
          <el-row class="mb15" style="font-weight: normal;" v-if="!historyId">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商名称：</el-col>
            <el-col :span="8">{{detail.agentCompanyName}}</el-col>
          </el-row>
          <!-- <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商分润：</el-col>
            <el-col :span="8">{{detail.agentFeeContent.serviceFeeRate}}%</el-col>
          </el-row> -->
          <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">渠道经理：</el-col>
            <el-col :span="8">{{detail.angentChargeByName}}</el-col>
          </el-row>
          <el-row class="mb15" style="font-weight: normal;" v-if="!historyId">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">代理推广费率：</el-col>
            <el-col :span="16">
              <show-close-service :detail="detail"></show-close-service>
            </el-col>
          </el-row>
        </template>
        <el-row class="mb15" style="font-weight: normal;" v-if="!historyId">
          <el-col :span="4" style="text-align: right; margin-right: 20px;">客户归属：</el-col>
          <el-col :span="8">{{detail.originalName}}</el-col>
        </el-row>
        <h4 class="ml50 mt50">合同文件</h4>
        <div style="margin-left: 120px; margin-right: 120px;">
            <el-table :data="tableList" style="width: 100%;margin-top: 20px;">
                <el-table-column prop="fileName" label="文件名称"></el-table-column>
                <el-table-column prop="createTime" label="上传时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createByName" label="操作人"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button @click="handleDowload(scope.row.downloadCode)" type="text" size="medium" style="padding:0;">下载</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <h4 class="ml50 mt50" v-if="!isExamine">关联企业名称</h4>
        <div class="flex" v-if="!isExamine">
            <div v-for="(e, i) in detail.branchs" :key="e.branchId">
                {{e.branchName}}
            </div>
        </div>
        <el-button class="back" type="primary" @click="$router.back()" size="small">返回</el-button>
    </div>
</template>

<script>
    import {post, get} from '../../store/api';
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
                historyId: ''
            }
        },
        methods: {
            getAttachments() {
                const id = this.$route.query.contractId || this.$route.query.originId
                const versionSeq = this.$route.query.versionSeq
                const url = this.$route.query.contractId ? '/api/contract-web/contract/contract-attachments' : '/api/contract-web/contract/attachment-infos';
                const param = this.$route.query.contractId ? { contractId: id } : { contractId: id, versionSeq }
                get(url, param).then(data => {
                    this.tableList = data
                })
            },
            getDetail() {
                const id = this.$route.query.contractId || this.$route.query.historyId
                const versionSeq = this.$route.query.versionSeq
                const url = this.$route.query.contractId ? '/api/contract-web/contract/contract-detail' : '/api/contract-web/contract/contract-history-detail'
                const param = this.$route.query.contractId ? { contractId: id } : { historyId: id, versionSeq }
                get(url, param).then(data => {
                    this.detail = data
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
            }
        },
        created() {
            this.getAttachments();
            this.getDetail()
            this.isExamine = this.$route.query.examine ? true : false
            this.historyId = this.$route.query.historyId
        }
    }
</script>

<style scoped>
    .bg-white {
        overflow: hidden;
    }
    .indent {
        text-indent: 10px
    }
    .inline {
        display: inline-block;
        width: 136px;
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