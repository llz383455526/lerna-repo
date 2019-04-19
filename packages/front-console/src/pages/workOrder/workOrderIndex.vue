<template>
    <div class="main">
        <el-button type="primary" @click="show = true" v-if="showCreateBtn">创建工单</el-button>
        <el-tabs class="mt20" v-model="activeName" @tab-click="tabClick">
            <el-tab-pane name="getRuntimeTaskPageList">
                <span slot="label">待办 <span class="red_0">{{count.TODO}}</span></span>
            </el-tab-pane>
            <el-tab-pane name="getBizProcessPageList">
                <span slot="label">已处理 <span class="red_0 silver">{{count.FINISH}}</span></span>
            </el-tab-pane>
            <el-tab-pane name="getAboutMePageList">
                <!-- <span class="red_0">{{count.FINISH}}</span> -->
                <span slot="label">与我相关</span>
            </el-tab-pane>
            <el-tab-pane name="getCreateByMePageList">
                <span slot="label">我创建的 <span class="red_0 green_0">{{count.CREATE_BY_ME}}</span></span>
            </el-tab-pane>
        </el-tabs>
        <el-form :model="form" size="small" :inline="true" ref="form">
            <el-form-item label="工单单号" prop="processInstanceId">
                <el-input v-model="form.processInstanceId"></el-input>
            </el-form-item>
            <el-form-item label="客户名称" prop="customerCompanyId">
                <el-select v-model="form.customerCompanyId" filterable>
                    <el-option v-for="e in companys" :key="e.id" :value="e.id" :label="e.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务商" prop="serviceCompanyId">
                <el-select v-model="form.serviceCompanyId" filterable>
                    <el-option v-for="e in serviceCompanyList" :key="e.id" :value="e.id" :label="e.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="工单类型" prop="procDefKey">
                <el-select v-model="form.procDefKey" filterable @change="getStatus">
                    <el-option v-for="e in typeList" :key="e.key" :value="e.key" :label="e.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="taskName">
                <el-select v-model="form.taskName" filterable>
                    <el-option v-for="e in statusList" :key="e.taskName" :value="e.taskName" :label="e.taskName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="创建时间">
                <el-date-picker
                    v-model="range"
                    type="daterange"
                    range-separator="至"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    @change="getTime">
                </el-date-picker>
            </el-form-item>
            <!-- <el-form-item label="我创建的" prop="createByMe" v-if="activeName == 'getAboutMePageList'">
                <el-select v-model="form.createByMe">
                    <el-option v-for="e in createByList" :key="e.text" :value="e.value" :label="e.text"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="reset">清除</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableList.list" v-if="activeName == 'getRuntimeTaskPageList'" key="1">
            <el-table-column label="工单单号" width="160px">
                <template slot-scope="scope">
                    <el-button class="allow" type="text" @click="handle(scope.row)">{{scope.row.processInstanceId}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="当前步骤" prop="taskName"></el-table-column>
            <el-table-column label="工单类型" prop="procDefName"></el-table-column>
            <el-table-column label="客户名称" prop="customerCompanyName"></el-table-column>
            <el-table-column label="服务商" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="代理商" prop="agentCompanyName"></el-table-column>
            <el-table-column label="紧急程度" width="150px">
                <template slot-scope="scope">
                    <div :class="`tag ${scope.row.emergencyTag}`">{{scope.row.emergencyText}}</div>
                </template>
            </el-table-column>
            <!-- <el-table-column label="受理部门" prop="currentProcessDeptName"></el-table-column>
            <el-table-column label="受理人" prop="currentProcessorName"></el-table-column> -->
            <el-table-column label="更新时间" prop="updateTime" width="160px"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="160px"></el-table-column>
            <el-table-column label="创建人" prop="createdByName" width="120px"></el-table-column>
        </el-table>
        <el-table :data="tableList.list" v-if="activeName == 'getBizProcessPageList'" key="2">
            <el-table-column label="工单单号" width="160px">
                <template slot-scope="scope">
                    <el-button class="allow" type="text" @click="handle(scope.row, true)">{{scope.row.processInstanceId}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="当前步骤" prop="taskName"></el-table-column>
            <el-table-column label="工单类型" prop="procDefName"></el-table-column>
            <el-table-column label="客户名称" prop="customerCompanyName"></el-table-column>
            <el-table-column label="服务商" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="代理商" prop="agentCompanyName"></el-table-column>
            <el-table-column label="更新时间" prop="updateTime" width="160px"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="160px"></el-table-column>
            <el-table-column label="创建人" prop="createdByName" width="120px"></el-table-column>
        </el-table>
        <el-table :data="tableList.list" v-if="activeName == 'getAboutMePageList'" key="3">
            <el-table-column label="工单单号" width="160px">
                <template slot-scope="scope">
                    <el-button class="allow" type="text" @click="handle(scope.row, true, true)">{{scope.row.processInstanceId}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="当前步骤" prop="taskName"></el-table-column>
            <el-table-column label="工单类型" prop="procDefName"></el-table-column>
            <el-table-column label="客户名称" prop="customerCompanyName"></el-table-column>
            <el-table-column label="服务商" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="代理商" prop="agentCompanyName"></el-table-column>
            <el-table-column label="紧急程度" width="150px">
                <template slot-scope="scope">
                    <div :class="`tag ${scope.row.emergencyTag}`">{{scope.row.emergencyText}}</div>
                </template>
            </el-table-column>
            <el-table-column label="受理部门" prop="currentProcessDeptName"></el-table-column>
            <el-table-column label="受理人" prop="currentProcessorName"></el-table-column>
            <el-table-column label="更新时间" prop="updateTime" width="160px"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="160px"></el-table-column>
            <el-table-column label="创建人" prop="createdByName" width="120px"></el-table-column>
        </el-table>
        <el-table :data="tableList.list" v-if="activeName == 'getCreateByMePageList'" key="3">
            <el-table-column label="工单单号" width="160px">
                <template slot-scope="scope">
                    <el-button class="allow" type="text" @click="handle(scope.row, true, true)">{{scope.row.processInstanceId}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="当前步骤" prop="taskName"></el-table-column>
            <el-table-column label="工单类型" prop="procDefName"></el-table-column>
            <el-table-column label="客户名称" prop="customerCompanyName"></el-table-column>
            <el-table-column label="服务商" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="代理商" prop="agentCompanyName"></el-table-column>
            <el-table-column label="紧急程度" width="150px">
                <template slot-scope="scope">
                    <div :class="`tag ${scope.row.emergencyTag}`">{{scope.row.emergencyText}}</div>
                </template>
            </el-table-column>
            <el-table-column label="受理部门" prop="currentProcessDeptName"></el-table-column>
            <el-table-column label="受理人" prop="currentProcessorName"></el-table-column>
            <el-table-column label="更新时间" prop="updateTime" width="160px"></el-table-column>
            <el-table-column label="创建时间" prop="createTime" width="160px"></el-table-column>
            <el-table-column label="创建人" prop="createdByName" width="120px"></el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            :currentPage="form.pageNo"
            v-on:handleSizeChange="sizeChange"
            v-on:handleCurrentChange="query">
        </ayg-pagination>
        <el-dialog title="创建工单" :visible.sync="show" width="500px">
            <div class="flexBox">
                <el-button class="mb20" v-for="(e, i) in btnList" :key="e.text" v-if="checkRight(permissions, e.right)" type="primary" @click="showWork(i)">{{e.text}}</el-button>
            </div>
        </el-dialog>
        <recharge-dialog :submitCb="submitCb" :showStep="true" ref="rechargeDialog"></recharge-dialog>
        <recharge-audit-dialog :auditCb="auditCb" :disable="rechargeDisable" :showStep="true" ref="rechargeAuditDialog"></recharge-audit-dialog>
        <make-invoice ref="makeInvoice"></make-invoice>
        <audit-invoice :query="query" ref="auditInvoice"></audit-invoice>
        <knotty ref="knotty"></knotty>
    </div>
</template>
<script>
import { get, post, importPost } from "../../store/api"
import { invoiceApi, workflow, sysmgr } from "src/api"
import {mapGetters} from 'vuex'
import rechargeDialog from '../../pageComponent/rechargeDialog.vue'
import rechargeAuditDialog from '../../pageComponent/rechargeAuditDialog.vue'
import makeInvoice from './dialog/makeInvoice'
import auditInvoice from './dialog/auditInvoice'
import knotty from './dialog/knotty'
import { Loading } from 'element-ui';

export default {
    components: {
        rechargeDialog,
        rechargeAuditDialog,
        makeInvoice,
        auditInvoice,
        knotty
    },
    data() {
        return {
            activeName: 'getRuntimeTaskPageList',
            form: {
                processInstanceId: '',
                customerCompanyId: '',
                serviceCompanyId: '',
                procDefKey: '',
                taskName: '',
                startDate: '',
                endDate: '',
                // createByMe: '',
                pageNo: 1,
                pageSize: 10
            },
            createByList: [
                {
                    text: '所有',
                    value: ''
                },
                {
                    text: '是',
                    value: true
                },
                {
                    text: '否',
                    value: false
                }
            ],
            tableList: {},
            show: false,
            // '发放工单', , '疑难工单'
            // checkRight(permissions, 'contract-web:/contract-tpl/update-contract-tpl')
            btnList: [
                {
                    text: '账户充值工单',
                    right: 'balance-web:/recharge-order/comfirm'
                },
                {
                    text: '服务费充值工单',
                    right: 'balance-web:/recharge-order/serviceFeeConfirm'
                },
                {
                    text: '发票工单',
                    right: 'invoice-web:/workflow/invoice-add'
                },
                {
                    text: '批量发票工单',
                    right: 'invoice-web:/workflow/invoice-import-submit'
                }
            ],
            typeList: [],
            statusList: [],
            companys: [],
            range: [],
            count: {
                TODO: 0,
                FINISH: 0,
                CREATE_BY_ME: 0
            },
            rechargeDisable: false,
            showCreateBtn: false
        }
    },
    computed: {
        ...mapGetters({
            serviceCompanyList: 'serviceCompanyList',
            permissions: 'permissions'
        })
    },
    watch: {
        permissions() {
            this.getCreateBtnStatus()
        }
    },
    mounted() {
        get(workflow.getWorkflowTypeList).then(data => {
            this.typeList = data
        })
        this.$store.dispatch('getServiceCompanyList');
        get(sysmgr.getCompany, {
    		companyIdentity: 'custom'
        }).then(data => {
            this.companys = data
        })
        this.getCreateBtnStatus()
        setTimeout(() =>{
            let isCreate = sessionStorage.getItem('isCreate')
            if(isCreate) {
                sessionStorage.removeItem('isCreate')
                this.submitCb()
            }
            else {
                this.query()
            }
        }, 100)
    },
    methods: {
        getCreateBtnStatus() {
            let result = []
            this.btnList.forEach(e => {
                result.push(this.checkRight(this.permissions, e.right))
            })
            this.showCreateBtn = result.includes(true)
        },
        getStatus() {
            this.form.taskName = ''
            let k = 'getRuntimeTaskTypeList'
            switch (this.activeName) {
                case 'getRuntimeTaskPageList':
                    k = 'getRuntimeTaskTypeList'
                    break;
                case 'getBizProcessPageList':
                    k = 'getBizProcessTypeList'
                    break;
                case 'getAboutMePageList':
                    k = 'getAboutMeTypeList'
                    break;
                case 'getCreateByMePageList':
                    k = 'getCreateByMeTaskTypeList'
                    break;
                default:
                    k = 'getRuntimeTaskTypeList'
                    break;
            }
            console.log(k)
            get(workflow[k], {
                procDefKey: this.form.procDefKey
            }).then(data => {
                this.statusList = data
            })
        },
        getTime() {
            this.form.startDate = this.range && this.range.length ? this.range[0] : ''
            this.form.endDate = this.range && this.range.length ? this.range[1] : ''
        },
        reset() {
            this.$refs.form.resetFields()
            this.range = []
            this.getTime()
        },
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            a !== true && (this.form.pageNo = a)
            post(workflow[this.activeName], this.form).then(data => {
                this.tableList = data
            })
            get(workflow.getTaskCountNum).then(data =>{
                data.forEach(e => {
                    this.count[e.type] = e.countNum
                })
            })
        },
        sizeChange(a) {
            this.form.pageSize = a
            this.query()
        },
        showWork(a) {
            this.show = false
            switch (a) {
                // case 0:
                //     this.$refs.rechargeDialog.showRecharge(true, false)
                //     break;
                case 0:
                    this.$refs.rechargeDialog.showRecharge(true, false)
                    break;
                case 1:
                    this.$refs.rechargeDialog.showRecharge(true, true)
                    break;
                case 2:
                    this.$refs.makeInvoice.transmit(true)
                    break;
                case 3:
                    this.$router.push('/main/invoice/batchApply')
                    break;
                // case 5:
                //     this.$refs.knotty.transmit(true)
                //     break;
                default:
                    break;
            }
        },
        submitCb() {
            let loading = Loading.service({ fullscreen: true })
            this.activeName = 'getCreateByMePageList'
            this.rechargeDisable = true
            setTimeout(() => {
                loading.close()
                this.query()
            }, 1000 * 2)
        },
        auditCb() {
            this.query(true)
        },
        handle(param, look = false, isMe = false) {
            console.log(param.businessType)
            switch (param.businessType) {
                case 'invoice-flow':
                    this.$refs.auditInvoice.transmit({
                        show: true,
                        param: param,
                        look: look,
                        isMe: isMe
                    })
                    break;
                case 'invoice-flow-exception':
                    this.$refs.auditInvoice.transmit({
                        show: true,
                        param: param,
                        look: look,
                        isMe: isMe
                    })
                    break;
                case 'manual-recharge-flow':
                    this.$refs.rechargeAuditDialog.getDetail(param)
                    break;
                case 'service-fee-recharge-flow':
                    this.$refs.rechargeAuditDialog.getDetail(param)
                    break;
                case 'create-app-flow':
                    sessionStorage.setItem('row', JSON.stringify(param))
                    this.$router.push('DockingApi')
                    break;
                case 'direct-recharge-flow':
                    this.$refs.rechargeAuditDialog.getDetail(param)
                    break;
                default:
                    break;
            }
        },
        tabClick(a) {
            if(this.activeName == 'getRuntimeTaskPageList') {
                this.rechargeDisable = false
            }
            else {
                this.rechargeDisable = true
            }
            this.reset()
            this.query()
        }
    }
}
</script>
<style scoped>
.main {
  background-color: #fff;
  padding: 20px 30px;
}
.red_0 {
    display: inline-block;
    width: 40px;
    height: 20px;
    margin-left: 10px;
    border-radius: 5px;
    text-align: center;
    line-height: 20px;
    background-color: red;
    color: #ffffff;
}
.green_0 {
    background-color: #69aa46;
}
.silver {
    background-color: silver;
}
.flexBox {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-around;
}
.mb20 {
    margin: 0px 0px 20px;
    width: 180px;
}
.tag {
    padding: 5px;
    border-radius: 10px;
    text-align: center;
    color: #fff;
}
.orange {
    background-color: orange;
}
.purple {
    background-color: purple;
}
.red {
    background-color: red;
}
.allow {
    user-select: all;
}
</style>
