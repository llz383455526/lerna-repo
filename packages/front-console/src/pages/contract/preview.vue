<template>
    <div class="bg-white p15">
        <div style="margin-bottom:30px;">查看合同</div>
        <h4 class="ml50">基本信息</h4>
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
                <span v-for="(e, i) in detail.serviceTypeList">
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
            <el-col :span="8">{{detail.prePayType == 1 ? `是（${detail.prePayContent.secondType == 'real' ? '实发金额' : '应发金额'} * ${detail.prePayContent.serviceFeeRate}%）` : '否'}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">开票类型：</el-col>
            <el-col :span="8">{{detail.invoiceTypeName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;" v-if="!isExamine">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">服务费收费比例/金额：</el-col>
            <el-col :span="8" v-if="detail.serviceFeeContent && detail.serviceFeeContent.serviceFeeType">
                <template v-if="detail.serviceFeeContent.serviceFeeType == 'standard'">
                    {{detail.serviceFeeContent.serviceFeeRate}}
                </template>
                <template v-if="detail.serviceFeeContent.serviceFeeType == 'dummy'">
                    {{'无'}}
                </template>
                <template v-else-if="detail.serviceFeeContent.serviceFeeType == 'fixed'">
                    {{'固定金额，每笔' + detail.serviceFeeContent.fixFee + '元'}}
                </template>
                <template v-else-if="detail.serviceFeeContent.serviceFeeType == 'ratio'">
                    {{`${detail.serviceFeeContent.secondType == 'real' ? '实发金额' : '应发金额'} * ${detail.serviceFeeContent.serviceFeeRate}%`}}
                </template>
                <template v-else-if="detail.serviceFeeContent.serviceFeeType == 'step' && detail.serviceFeeContent.secondType == '0'">
                    {{`分${detail.serviceFeeContent.monthIncomeAmount}万 - 无流水阶梯报价：`}}
                    <div v-for="(e, i) in detail.serviceFeeContent.stepwiseList">
                        <div class="indent">
                            <span class="inline">
                                <template v-if="!e.startAmount && !i">
                                    {{`小于${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}
                                </template>
                                <template v-else-if="e.startAmount && e.endAmount">
                                    {{`${e.startAmount}万${e.equalsStart ? '（含）' : ''}~${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}
                                </template>
                                <template v-else-if="!e.endAmount">
                                    {{`大于${e.startAmount}万${e.equalsStart ? '（含）' : ''}`}}
                                </template>
                            </span>
                            {{`实发金额*${e.percent}%`}}
                        </div>
                    </div>
                </template>
                <template v-else-if="detail.serviceFeeContent.serviceFeeType == 'step' && detail.serviceFeeContent.secondType == '1'">
                    {{`不分2.8万 - 按流水总额阶梯报价：`}}
                    <div v-for="(e, i) in detail.serviceFeeContent.stepwiseList">
                        <div class="indent">
                            <span class="inline">
                                <template v-if="!e.startAmount && !i">
                                    {{`小于${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}
                                </template>
                                <template v-else-if="e.startAmount && e.endAmount">
                                    {{`${e.startAmount}万${e.equalsStart ? '（含）' : ''}~${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}
                                </template>
                                <template v-else-if="!e.endAmount">
                                    {{`大于${e.startAmount}万${e.equalsStart ? '（含）' : ''}`}}
                                </template>
                            </span>
                            {{`实发金额*${e.percent}%`}}
                        </div>
                    </div>
                </template>
                <template v-else-if="detail.serviceFeeContent.serviceFeeType == 'step' && detail.serviceFeeContent.secondType == '2'">
                    {{`分${detail.serviceFeeContent.monthIncomeAmount}万 - 按流水分阶梯报价：`}}
                    <div class="indent">
                        {{`（1）月收入小于${detail.serviceFeeContent.monthIncomeAmount}万（含）：`}}
                        <div v-for="(e, i) in detail.serviceFeeContent.stepwiseList">
                            <div class="indent">
                                <span class="inline">
                                    <template v-if="!e.startAmount && !i">
                                        {{`小于${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}
                                    </template>
                                    <template v-else-if="e.startAmount && e.endAmount">
                                        {{`${e.startAmount}万${e.equalsStart ? '（含）' : ''}~${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}
                                    </template>
                                    <template v-else-if="!e.endAmount">
                                        {{`大于${e.startAmount}万${e.equalsStart ? '（含）' : ''}`}}
                                    </template>
                                </span>
                                {{`实发金额*${e.percent}%`}}
                            </div>
                        </div>
                        {{`（2） 月收入大于${detail.serviceFeeContent2.monthIncomeAmount}万：`}}
                        <div v-for="(e, i) in detail.serviceFeeContent2.stepwiseList">
                            <div class="indent">
                                <span class="inline">
                                    <template v-if="!e.startAmount && !i">
                                        {{`小于${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}
                                    </template>
                                    <template v-else-if="e.startAmount && e.endAmount">
                                        {{`${e.startAmount}万${e.equalsStart ? '（含）' : ''}~${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}
                                    </template>
                                    <template v-else-if="!e.endAmount">
                                        {{`大于${e.startAmount}万${e.equalsStart ? '（含）' : ''}`}}
                                    </template>
                                </span>
                                {{`实发金额*${e.percent}%`}}
                            </div>
                        </div>
                    </div>
                </template>
            </el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">合同起止时间：</el-col>
            <el-col :span="8">{{detail.startDate}} 至 {{detail.endDate}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">是否代理商客户：</el-col>
            <el-col :span="8">{{detail.agentClient ? '是' : '否'}}</el-col>
        </el-row>
        <template v-if="detail.agentClient">
          <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商名称：</el-col>
            <el-col :span="8">{{detail.agentCompanyName}}</el-col>
          </el-row>
          <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">代理商分润：</el-col>
            <el-col :span="8">{{detail.agentFeeContent.serviceFeeRate}}%</el-col>
          </el-row>
          <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">渠道经理：</el-col>
            <el-col :span="8">{{detail.angentChargeByName}}</el-col>
          </el-row>
        </template>
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
    export default {
        data() {
            return {
                tableList: [],
                detail: {},
                isExamine: false
            }
        },
        methods: {
            getAttachments(id) {
              let url = '/api/contract-web/contract/contract-attachments';
              get(url, {contractId: id}).then(data => {
                  this.tableList = data
              })
            },
            getDetail(id) {
                let url = '/api/contract-web/contract/contract-detail';
                get(url, {contractId: id}).then(data => {
                    this.detail = data
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
            this.getAttachments(this.$route.query.contractId);
            this.getDetail(this.$route.query.contractId)
            this.isExamine = this.$route.query.examine ? true : false
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