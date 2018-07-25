<template>
    <div class="bg-white p15">
        <div style="margin-bottom:30px;">查看合同</div>
        <h4 class="ml50">基本信息</h4>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">客户名称：</el-col>
            <el-col :span="8">{{detail.customerName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">服务商名称：</el-col>
            <el-col :span="8">{{detail.serviceCompanyName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">合同类型：</el-col>
            <el-col :span="8">{{detail.cotractTypeName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">结算方式：</el-col>
            <el-col :span="8">{{detail.settleTypeName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">结算日期：</el-col>
            <el-col :span="8">{{detail.settleExp}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">发票类型：</el-col>
            <el-col :span="8">{{detail.invoiceTypeName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">服务费收费比例/金额：</el-col>
            <el-col :span="8">
                <template v-if="detail.serviceFeeType != 'ratio' && detail.serviceFeeType != 'step'">
                    {{'固定金额，每笔' + detail.serviceFee + '元'}}
                </template>
                <template v-else-if="detail.serviceFeeType == 'ratio' && !detail.shouldAmountRate">
                    {{'实发金额 * ' + detail.serviceFeeRate + '%'}}
                </template>
                <template v-else-if="!detail.stepwiseList || !detail.stepwiseList.length">
                    {{'实发金额 / ( 1 - '+ detail.shouldAmountRate +'%) * ' + detail.serviceFeeRate + '%'}}
                </template>
                <template v-else>
                    {{`阶梯收费，${detail.stepwiseList[0].startAmount}~${detail.stepwiseList[0].endAmount}元: ${detail.stepwiseList[0].percent}%，${detail.stepwiseList[1].startAmount}~${detail.stepwiseList[1].endAmount}元: ${detail.stepwiseList[1].percent}%`}}
                </template>
            </el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">合同起止时间：</el-col>
            <el-col :span="8">{{detail.startDate}} 至 {{detail.endDate}}</el-col>
        </el-row>
        <h4 class="ml50 mt50">发票信息</h4>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">公司名称：</el-col>
            <el-col :span="8">{{invoiceMsg.name}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">纳税人识别号：</el-col>
            <el-col :span="8">{{invoiceMsg.taxIdcd}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">地址：</el-col>
            <el-col :span="8">{{invoiceMsg.addr}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">电话：</el-col>
            <el-col :span="8">{{invoiceMsg.phone}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">开户银行：</el-col>
            <el-col :span="8">{{invoiceMsg.bankName}}</el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">银行账号：</el-col>
            <el-col :span="8">{{invoiceMsg.bankAccount}}</el-col>
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
                invoiceMsg: {}
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
                    this.getInvoice()
                })
            },
            getInvoice() {
                var id = ''
                this.customerCompaniesList.forEach(e => {
                    if(e.companyName == this.detail.customerName) {
                        id = e.companyId
                    }
                })
                get('/api/invoice-web/custom-company/detail', {
                    id: id
                }).then(data => {
                    if(data) {
                        this.invoiceMsg = data
                    }
                })
            },
        },
        created() {
            this.getAttachments(this.$route.query.contractId);
            this.getDetail(this.$route.query.contractId)
            // this. getOptionCustomerCompanies()
        },
    }
</script>

<style scoped>

</style>