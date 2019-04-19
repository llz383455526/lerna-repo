<template>
    <div class="main">
        <!-- <div class="title">待受理</div>
        <el-table :data="[]">
            <el-table-column label="工单单号"></el-table-column>
            <el-table-column label="工单状态"></el-table-column>
            <el-table-column label="客户名称"></el-table-column>
            <el-table-column label="服务商"></el-table-column>
            <el-table-column label="代理商"></el-table-column>
            <el-table-column label="工单类型"></el-table-column>
            <el-table-column label="备注"></el-table-column>
            <el-table-column label="紧急程度"></el-table-column>
            <el-table-column label="受理部门"></el-table-column>
            <el-table-column label="受理人"></el-table-column>
            <el-table-column label="更新时间"></el-table-column>
            <el-table-column label="创建时间"></el-table-column>
            <el-table-column label="创建人"></el-table-column>
        </el-table> -->
        <el-button @click="$router.back()">账户开通  / 技术对接</el-button>
        <el-steps :active="active" align-center class="mb20">
            <el-step v-for="e in stepList" :key="e.activityId" :title="e.activityName" :description="e.userName"></el-step>
        </el-steps>
        <!-- <el-steps :active="active" align-center class="mb20">
            <el-step title="创建" description="销售部：陈英"></el-step>
            <el-step title="技术对接" description="产研中心：陈冰"></el-step>
            <el-step title="商户审核" description="交付部：叶家宝"></el-step>
        </el-steps> -->
        <div class="title">基本信息</div>
        <el-row>
            <el-col :span="12">企业名称：{{msg.fullName}}</el-col>
            <el-col :span="12">Company ID：{{msg.id}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">企业简称：{{msg.name}}</el-col>
            <el-col :span="12">创建人：{{msg.createByName}}</el-col>
        </el-row>
        <el-row>
            <el-col class="flex" :span="12">代理商名称：
                <div>
                    <div v-for="e in agentCompanyList" :key="e.agentCompanyId">{{e.agentCompanyName}}</div>
                </div>
            </el-col>
            <el-col :span="12">更新人：{{msg.updateByName}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">客户类型：{{msg.originalTypeName}}</el-col>
            <el-col :span="12">更新时间：{{msg.updateTime}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">客户归属：{{msg.originalName}}</el-col>
            <el-col :span="12">注册日期：{{msg.registerDate}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="12">企业类型：{{msg.originalTypeName}}</el-col>
        </el-row>
        <!-- <template v-if="active == 1">
            <el-row>
                <el-col :span="12">关联销售：伍淑宜</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <div class="title">企业负责人（账号）</div>
                </el-col>
                <el-col :span="12">
                    <div class="title">技术对接人（账号）</div>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">电话：{{user_0.mobilephone}}</el-col>
                <el-col :span="12">电话：{{user_1.mobilephone}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">姓名：{{user_0.name}}</el-col>
                <el-col :span="12">姓名：{{user_1.name}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="12">邮箱：{{user_0.email}}</el-col>
                <el-col :span="12">邮箱：{{user_1.email}}</el-col>
            </el-row>
            <div class="title">已上线商户</div>
            <app-list :companyId="row.customerCompanyId"></app-list>
        </template> -->
        <!-- <template v-else> -->
        <el-row>
            <el-col :span="12">关联销售：<el-button class="mt20" size="small" type="primary" @click="addSale">添加</el-button></el-col>
        </el-row>
        <el-table :data="saleList">
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="手机号" prop="mobilephone"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="deleteSale(scope.$index)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-row>
            <el-col :span="12">关联交付：<el-button class="mt20" size="small" type="primary" @click="chooseDelivery">添加</el-button></el-col>
        </el-row>
        <el-table :data="[delivery]">
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="手机号" prop="mobilephone"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" v-if="delivery.name" @click="deleteDelivery">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="red mb20" v-if="!delivery.name">*关联交付未配置</div>
        <!-- </template> -->
        <div class="title">申请上线</div>
        <el-row>
            <el-col :span="24">商户名称：{{appMsg.appName}}</el-col>
        </el-row>
        <el-row>
            <el-col :span="24">商户appid：{{appMsg.appId}}</el-col>
        </el-row>
        <el-row>
            <el-col class="flex" :span="24">服务公司：
                <div>
                    <template v-if="appMsg.serviceCompanyList">
                        <el-checkbox v-for="e in appMsg.serviceCompanyList" :key="e.serviceCompanyId" checked disabled>{{e.serviceCompanyName}}</el-checkbox>
                    </template>
                </div>
            </el-col>
        </el-row>
        <template v-if="appMsg.isFromOutApp == 1">
            <div class="title">appid配置（客户提供</div>
            <el-row>
                <el-col :span="24">客户异步通知appId：{{appMsg.notifyAppId}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="24">Rsa公钥：{{appMsg.appRsaPublickKey}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="24">IP白名单（固定IP）：{{appMsg.allowIp}}</el-col>
            </el-row>
            <el-row>
                <el-col :span="24">工资单笔异步通知接口：{{appMsg.notifyUrl}}</el-col>
            </el-row>
        </template>
        <!-- 添加渠道 -->
        <payment-channel class="mt20" :data="appMsg" :appId="row.businessId" :query="getAppDetail" ref="paymentChannel"></payment-channel>
        <div class="red mb20" v-if="withoutList.length">*
            <span class="mr5" v-for="e in withoutList">{{e.serviceCompanyName}}</span>
            支付渠道未配置</div>
        <!-- 电子签约 -->
        <div class="title">电子签约合同</div>
        <contract-manager-list :list="contractList" :query="getContractList"></contract-manager-list>
        <div class="red mb20" v-if="contractList && !contractList.length">*{{msg.fullName}} 电子签约合同缺失</div>
        <!-- 发放记录 -->
        <!-- <template v-if="active == 1">
            <el-button size="small" type="primary" @click="exportXls">导出</el-button>
            <pay-order-list :formSearch="payOrderForm" ref="payOrderList"></pay-order-list>
        </template>
        <template v-else> -->
        <sign-list @result="getSignListLength" ref="signList"></sign-list>
        <div class="red mb20" v-if="!signListLength">*{{msg.fullName}} 合同附件缺失</div>
        <!-- </template> -->
        <div class="footer mt20">
            <el-button :class="!delivery.name || withoutList.length || (contractList && !contractList.length) || !signListLength ? 'disable' : ''" v-if="active != 3" size="small" type="primary" @click="showDredgeAccount">下一步</el-button>
        </div>
        <dredge-account :row="row" ref="dredgeAccount"></dredge-account>
        <select-sale @result="saleResult" ref="selectSale"></select-sale>
        <select-delivery @result="deliveryResult" ref="selectDelivery"></select-delivery>
    </div>
</template>
<script>
import { get, post, importPost } from "../../store/api"
import { invoiceApi, workflow, sysmgr, contract, econtract } from "src/api"
import paymentChannel from '../../pageComponent/paymentChannel'
import contractManagerList from '../../pageComponent/contractManagerList'
import payOrderList from '../../pageComponent/payOrderList'
import signList from '../../pageComponent/signList'
import dredgeAccount from './dialog/dredgeAccount'
import appList from '../../pageComponent/appList'
import selectSale from './dialog/selectSale'
import selectDelivery from './dialog/selectDelivery'

export default {
    components: {
        paymentChannel,
        contractManagerList,
        payOrderList,
        signList,
        dredgeAccount,
        appList,
        selectSale,
        selectDelivery
    },
    data() {
        return {
            active: 1,
            box: true,
            row: {},
            msg: {},
            agentCompanyList: [],
            appMsg: {},
            user_0: {},
            user_1: {},
            appList: [],
            contractList: [],
            payOrderForm: {
                companyId: '',
                page: 1,
                pageSize: 10
            },
            stepList: [],
            saleList: [],
            delivery: {},
            signListLength: 0,
            withoutList: []
        }
    },
    mounted() {
        this.row = JSON.parse(sessionStorage.getItem('row'))
        this.payOrderForm.companyId = this.row.customerCompanyId
        // this.$refs.payOrderList.query()
        get(sysmgr.getCompanyDetail, {
            companyId: this.row.customerCompanyId
        }).then(data =>{
            this.msg = data
            this.getUserDetail(this.msg.chargeBy).then(data => {
                this.user_0 = data
            })
            this.delivery = {
                name: this.msg.deliverName,
                mobilephone: this.msg.deliverPhone,
                id: this.msg.deliverId
            }
        })
        get(contract.customReferenceAgents, {
            customCompanyId: this.row.customerCompanyId
        }).then(data => {
            this.agentCompanyList = data
        })
        this.getAppDetail()
        get(sysmgr.onlineCompanyApps, {
            customCompanyId: this.row.customerCompanyId
        }).then(data => {
            this.appList = data
        })
        Promise.all([
            get(workflow.getProcessAllProgress, { processInstanceId: this.row.processInstanceId }),
            get(workflow.getProcessCurrentProgress, { processInstanceId: this.row.processInstanceId })
        ]).then(data => {
            console.log(data)
            this.stepList = []
            data[0].default.forEach((e, i) => {
                this.stepList.push(Object.assign(data[1][i] ? data[1][i] : {}, e))
            })
            this.active = data[1].length + 1
            // this.realStep = JSON.parse(JSON.stringify(data[1]))
            // data[1] && (this.currentStpe = data[1].pop())
        })
        this.getSaleList()
        this.$refs.signList.transmit(this.row.customerCompanyId)
        this.getContractList()
    },
    methods: {
        exportXls() {
            this.$refs.payOrderList.exportXls()
        },
        showDredgeAccount() {
            if(!this.delivery.name || this.withoutList.length || this.contractList && !this.contractList.length || !this.signListLength) {
                return
            }
            this.$refs.dredgeAccount.transmit({
                show: true,
                principal: {
                    id: this.appMsg.chargeBy,
                    name: this.appMsg.chargeByName,
                    mobilephone: this.appMsg.chargeMobile,
                    email: this.appMsg.chargeEmail
                }
            })
        },
        getUserDetail(userId) {
            return get(sysmgr.getDetail, { userId })
        },
        getAppDetail() {
            post(sysmgr.getAppDetail, {
                appId: this.row.businessId
            }).then(data => {
                this.appMsg = data
                this.withoutList = []
                this.appMsg.serviceCompanyList.forEach(e => {
                    let length
                    if(this.appMsg.payUsers && this.appMsg.payUsers.length) {
                        length = this.appMsg.payUsers.filter(ev => ev.serviceCompanyId == e.serviceCompanyId).length
                    }
                    !length && this.withoutList.push(e)
                })
                this.$forceUpdate()
                this.getUserDetail(this.appMsg.chargeBy).then(data => {
                    this.user_1 = data
                })
            })
        },
        getContractList() {
            post(econtract.qrylistCompanyId, {
                companyId: this.row.customerCompanyId
            }).then(data => {
                this.contractList = data
            })
        },
        getSaleList() {
            get(sysmgr.customCompanySales, { customCompanyId: this.row.customerCompanyId }).then(data => {
                this.saleList = data
            })
        },
        addSale() {
            this.$refs.selectSale.transmit({
                show: true,
                saleList: this.saleList
            })
        },
        saleResult(a) {
            this.saleList = a
            this.updateSale()
        },
        updateSale() {
            post(sysmgr.modifyCustomCompanySales, {
                customCompanyId: this.row.customerCompanyId,
                salesList: this.saleList
            }).then(data => {
                this.$message({
                    type: 'success',
                    message: '更新成功！'
                })
            })
        },
        deleteSale(i) {
            this.saleList.splice(i, 1)
            this.updateSale()
        },
        chooseDelivery() {
            this.$refs.selectDelivery.transmit({
                show: true
            })
        },
        deliveryResult(a) {
            this.delivery = a
            this.editDelivery()
        },
        editDelivery() {
            post(sysmgr.changeCompanyDeliver, {
                customCompanyId: this.row.customerCompanyId,
                deliverId: this.delivery.id,
                deliverName: this.delivery.name
            }).then(data => {
                this.$message({
                    type: 'success',
                    message: '修改成功！'
                })
            })
        },
        deleteDelivery() {
            post(sysmgr.deleteCompanyDeliver, {
                customCompanyId: this.row.customerCompanyId,
                deliverId: this.delivery.id
            }).then(data => {
                this.delivery = {}
                this.$message({
                    type: 'success',
                    message: '删除成功！'
                })
            })
        },
        getSignListLength(a) {
            this.signListLength = a
        }
    }
}
</script>
<style scoped>
.main {
  background-color: #fff;
  padding: 20px 30px;
}
.title {
    font-weight: bold;
    margin: 20px 0px;
}
.mb20 {
    margin-bottom: 20px;
}
.mt20 {
    margin-top: 20px;
}
.footer {
    display: flex;
    justify-content: flex-end;
}
.red {
    color: red;
}
.disable {
    cursor: not-allowed;
    filter: grayscale(0.8);
}
.flex {
    display: flex;
}
.mr5 {
    margin-right: 5px;
}
</style>
