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
                {{detail.serviceFeeType == 'ratio' ?
                '固定比例收费，每笔' + detail.serviceFee + '%' :
                '固定金额，每笔' + detail.serviceFee + '元'}}
            </el-col>
        </el-row>
        <el-row class="mb15" style="font-weight: normal;">
            <el-col :span="4" style="text-align: right; margin-right: 20px;">合同起止时间：</el-col>
            <el-col :span="8">{{detail.startDate}} 至 {{detail.endDate}}</el-col>
        </el-row>
        <h4 class="ml50">合同文件</h4>
        <div style="margin-left: 120px; margin-right: 120px;">
            <el-table :data="tableList" style="width: 100%;margin-top: 20px;">
                <el-table-column prop="createByName" label="文件名称"></el-table-column>
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
                detail: {}
            }
        },
        methods: {
            getAttachments(id) {
              let url = '/api/console-dlv/contract/contract-attachments';
              get(url, {contractId: id}).then(data => {
                  this.tableList = data
              })
            },
            getDetail(id) {
                let url = '/api/console-dlv/contract/contract-detail';
                get(url, {contractId: id}).then(data => {
                    this.detail = data
                })
            },
            handleDowload(downloadCode) {
                window.location.href = baseUrl + '/api/console-dlv/file/download'
                    + '?downloadCode=' + downloadCode;
            }
        },
        created() {
            this.getAttachments(this.$route.query.contractId);
            this.getDetail(this.$route.query.contractId)
        },
    }
</script>

<style scoped>

</style>