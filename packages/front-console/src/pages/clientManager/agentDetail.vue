<template>
    <div class="r_main">
        <el-breadcrumb>
            <el-breadcrumb-item>
                代理商名称
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="title">
            基础信息
        </div>
        <div class="box">
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="8" class="right">代理商名称</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.fullName}}</el-col>
                </el-col>
				<el-col :span="12">
                    <el-col :span="8" class="right">机构代码</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.chargeBy}}</el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="8" class="right">代理商简称</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.name}}</el-col>
                </el-col>
				<el-col :span="12">
                    <el-col :span="8" class="right">代理商单位地址</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.address}}</el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="8" class="right">渠道经理</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.chargeByName}}</el-col>
                </el-col>
				<el-col :span="12">
                    <el-col :span="8" class="right">代理商电话码</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.telephone}}</el-col>
                </el-col>
            </el-row>
            <!-- <el-row :gutter="20">
				        <el-col :span="12">
                    <el-col :span="8" class="right">开户名称</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.accountName}}</el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
				        <el-col :span="12">
                    <el-col :span="8" class="right">开户银行</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.depositBank}}</el-col>
                </el-col>
            </el-row> -->
			<el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="8" class="right">代理商联系人</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.contactName}}</el-col>
                </el-col>
                <el-col :span="12">
                    <el-col :span="8" class="right">开户名称</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.accountName}}</el-col>
                </el-col>
            </el-row>
			<el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="8" class="right">代理商联系人电话</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.contactPhone}}</el-col>
                </el-col>
                <el-col :span="12">
                    <el-col :span="8" class="right">开户银行</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.depositBank}}</el-col>
                </el-col>
            </el-row>
			<el-row :gutter="20">
                <el-col :span="12">
                    <el-col :span="8" class="right">代理商联系人地址</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.contactAddr}}</el-col>
                </el-col>
                <el-col :span="12">
                    <el-col :span="8" class="right">银行账号</el-col>
                    <el-col :span="16" style="word-wrap: break-word;">{{detail.accountNo}}</el-col>
                </el-col>
            </el-row>
        </div>
        <div class="title">代理商合同</div>
        <el-table :data="detail.agentContractList">
            <el-table-column label="合同编号" prop="contractNo"></el-table-column>
            <el-table-column label="代理期限" align="center">
                <template slot-scope="scope">
                    {{scope.row.agentStart | formatTime('yyyy-MM-dd')}} 至 {{scope.row.agentEnd | formatTime('yyyy-MM-dd')}}
                </template>
            </el-table-column>
            <el-table-column label="文件原件">
                <template slot-scope="scope">
                    <a v-for="e in scope.row.attachments" :key="e.refId" :href="`/api/contract-web/file/download?downloadCode=${e.downloadCode}`" target="_blank" rel="noopener noreferrer">
                        <div>{{e.displayname}}</div>
                    </a>
                </template>
            </el-table-column>
            <el-table-column label="上传时间">
                <template slot-scope="scope">
                    {{scope.row.createAt | formatTime('yyyy-MM-dd')}}
                </template>
            </el-table-column>
            <el-table-column label="代理推广费率" prop="quoteFeeName"></el-table-column>
            <el-table-column label="操作人" prop="createByName"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <a :href="`/api/contract-web/agent-contract/download-agent-contract-attachments?contractId=${scope.row.id}`" target="_blank" rel="noopener noreferrer">
                        <el-button type="text">下载</el-button>
                    </a>
                </template>
            </el-table-column>
        </el-table>
        <div class="title">签约信息</div>
        <el-table :data="detail.clientContractList">
            <el-table-column label="合同编号" prop="contractNo"></el-table-column>
            <el-table-column label="客户名称" prop="customerName"></el-table-column>
            <el-table-column label="签约服务商" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="签约费率" prop="serviceFeeName"></el-table-column>
			<el-table-column label="代理推广费率" prop="quoteFeeName"></el-table-column>
            <!-- <el-table-column label="代理商分润">
                <template slot-scope="scope">
                    {{scope.row.agentFeeContent.serviceFeeRate}}%
                </template>
            </el-table-column> -->
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <router-link :to="`/main/contract/preview?contractId=${scope.row.contractId}`">
                        <el-button type="text">查看合同</el-button>
                    </router-link>
                </template>
            </el-table-column>
        </el-table>
        <el-button class="fr" type="primary" size="small" @click="$router.back()">返回</el-button>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback } from "../../store/api";
export default {
    data() {
        return {
            detail: ''
        }
    },
    mounted() {
        get('/api/contract-web/agent-company/detail', {
            companyId: this.$route.query.id
        }).then(data => {
            this.detail = data
        })
    }
}
</script>
<style scoped>
.r_main {
  padding: 30px 10px 50px;
  background-color: #fff;
}
.title {
    display: inline-block;
    margin-top: 30px;
    font-weight: 700;
}
.box {
  font-size: 14px;
  padding: 20px;
  color: #909399;
}
.right {
  font-weight: bold;
  text-align: right;
}
.fr {
    float: right;
    margin-right: 30px;
}
</style>
