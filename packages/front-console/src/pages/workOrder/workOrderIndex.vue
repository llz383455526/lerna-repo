<template>
  <div class="main">
    <el-button
      type="primary"
      @click="show = true"
      v-if="showCreateBtn"
    >
      创建工单
    </el-button>
    <el-tabs
      class="mt20"
      v-model="activeName"
      @tab-click="tabClick"
    >
      <el-tab-pane name="getRuntimeTaskPageList">
        <span slot="label">待办 <span class="red_0">{{ count.TODO }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="getBizProcessPageList">
        <span slot="label">已处理 <span class="red_0 silver">{{ count.FINISH }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="getCreateByMePageList">
        <span slot="label">我创建的 <span class="red_0 green_0">{{ count.CREATE_BY_ME }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="getReadTaskPageList">
        <span slot="label">待阅 <span class="red_0 blue_0">{{ count.UNREAD }}</span></span>
      </el-tab-pane>
      <el-tab-pane name="getAboutMePageList">
        <!-- <span class="red_0">{{count.FINISH}}</span> -->
        <span slot="label">与我相关</span>
      </el-tab-pane>
    </el-tabs>
    <el-form
      :model="form"
      size="small"
      :inline="true"
      ref="form"
    >
      <el-form-item
        label="工单单号"
        prop="processInstanceId"
      >
        <el-input v-model="form.processInstanceId" />
      </el-form-item>
      <el-form-item
        label="客户名称"
        prop="customerCompanyId"
      >
        <el-select
          v-model="form.customerCompanyId"
          filterable
        >
          <el-option
            v-for="e in companys"
            :key="e.id"
            :value="e.id"
            :label="e.name" 
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="服务商"
        prop="serviceCompanyId"
      >
        <el-select
          v-model="form.serviceCompanyId"
          filterable
        >
          <el-option
            v-for="e in serviceCompanyList"
            :key="e.id"
            :value="e.id"
            :label="e.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="工单类型"
        prop="procDefKey"
      >
        <el-select
          v-model="form.procDefKey"
          filterable
          @change="getStatus"
        >
          <el-option
            v-for="e in typeList"
            :key="e.key"
            :value="e.key"
            :label="e.name"
          />
        </el-select>
      </el-form-item>
      <!-- <el-form-item label="当前步骤" prop="taskName">
                <el-select v-model="form.taskName" filterable :no-data-text="form.procDefKey ? '无数据' : '请先选择工单类型'">
                    <el-option v-for="e in stepList" :key="e.taskName" :value="e.taskName" :label="e.taskName"></el-option>
                </el-select>
            </el-form-item> -->
      <el-form-item
        label="工单状态"
        prop="parentBusinessStatus"
      >
        <el-select
          v-model="form.parentBusinessStatus"
          :no-data-text="form.procDefKey ? '无数据' : '请先选择工单类型'"
        >
          <el-option
            v-for="e in statusList"
            :key="e.parentBusinessStatus"
            :value="e.parentBusinessStatus"
            :label="e.parentBusinessStatus"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="相关交付"
        prop="deliveryName"
      >
        <el-select
          v-model="form.deliveryName"
          filterable
        >
          <el-option
            v-for="e in deliveryList"
            :key="e.id"
            :value="e.name"
            :label="e.name"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="相关销售"
        prop="salesName"
      >
        <el-select
          v-model="form.salesName"
          filterable
        >
          <el-option
            v-for="e in salesList"
            :key="e.id"
            :value="e.name"
            :label="e.name"
          />
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
          @change="getTime"
        />
      </el-form-item>
      <!-- <el-form-item label="我创建的" prop="createByMe" v-if="activeName == 'getAboutMePageList'">
                <el-select v-model="form.createByMe">
                    <el-option v-for="e in createByList" :key="e.text" :value="e.value" :label="e.text"></el-option>
                </el-select>
            </el-form-item> -->
      <el-form-item
        label="阅读状态"
        prop="status"
        v-if="activeName == 'getReadTaskPageList'"
      >
        <el-select v-model="form.status">
          <el-option
            value=""
            label="所有"
          />
          <el-option
            v-for="e in readStatusList"
            :key="e.value"
            :value="e.value"
            :label="e.text"
          />
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button
          type="primary"
          @click="query"
        >
          查询
        </el-button>
        <el-button @click="reset">
          清除
        </el-button>
        <el-button
          @click="exportList"
          v-if="activeName != 'getReadTaskPageList'"
        >
          导出excel
        </el-button>
      </el-form-item>
    </el-form>
    <el-button
      size="small"
      type="primary"
      v-if="activeName == 'getReadTaskPageList'"
      :disabled="!ids.length"
      @click="setAllread"
    >
      全部已阅
    </el-button>
    <el-table
      :data="tableList.list"
      :key="activeName"
    >
      <el-table-column
        label="阅读状态"
        v-if="activeName == 'getReadTaskPageList'"
        fixed
      >
        <template slot-scope="scope">
          <el-button
            type="text"
            v-if="scope.row.readStatus == '0'"
            @click="setRead([scope.row.id])"
          >
            待阅
          </el-button>
          <el-button
            type="text"
            v-else
          >
            <span class="disable">已阅</span>
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="工单单号"
        width="160px"
        fixed
      >
        <template slot-scope="scope">
          <!-- <el-button class="allow" type="text" @click="handle(scope.row, false, activeName != 'getRuntimeTaskPageList' && activeName != 'getBizProcessPageList')">{{scope.row.processInstanceId}}</el-button> -->
          <el-button
            class="allow"
            type="text"
            @click="handle(scope.row, activeName != 'getRuntimeTaskPageList', activeName == 'getCreateByMePageList')"
          >
            {{ scope.row.processInstanceId }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column
        label="工单类型"
        prop="procDefName"
        width="100px"
        fixed
      />
      <!-- <el-table-column label="当前步骤" prop="taskName" fixed></el-table-column> -->
      <el-table-column
        label="工单状态"
        prop="businessStatus"
        fixed
      />
      <el-table-column
        label="客户名称"
        prop="customerCompanyName"
        width="120px"
        fixed 
      />
      <el-table-column
        label="服务商"
        prop="serviceCompanyName"
        width="120px"
        fixed
      />
      <el-table-column
        label="紧急程度"
        width="140px"
        v-if="activeName != 'getBizProcessPageList'"
        fixed
      >
        <template slot-scope="scope">
          <div :class="`tag ${scope.row.emergencyTag}`">
            {{ scope.row.emergencyText }}
          </div>
        </template>
      </el-table-column>
      <!-- <el-table-column label="代理商" prop="agentCompanyName"></el-table-column> -->
      <el-table-column
        label="更新时间"
        prop="updateTime"
        width="160px" 
      />
      <el-table-column
        label="创建时间"
        prop="createTime"
        width="160px"
      />
      <el-table-column
        label="相关销售"
        prop="salesName"
        width="120px"
      >
        <template
          slot-scope="scope"
          v-if="scope.row.salesName"
        >
          <el-tooltip placement="top">
            <div slot="content">
              <div v-for="e in scope.row.salesName.split(',')">
                {{ e }}
              </div>
            </div>
            <div class="textOver">
              {{ scope.row.salesName }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="相关交付"
        prop="deliveryName"
        width="120px"
      >
        <template
          slot-scope="scope"
          v-if="scope.row.deliveryName"
        >
          <el-tooltip placement="top">
            <div slot="content">
              <div v-for="e in scope.row.deliveryName.split(',')">
                {{ e }}
              </div>
            </div>
            <div class="textOver">
              {{ scope.row.deliveryName }}
            </div>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        label="工单来源"
        prop="orderSource"
        width="160px" 
      />
      <template v-if="activeName == 'getAboutMePageList' || activeName == 'getCreateByMePageList' || activeName == 'getReadTaskPageList'">
        <el-table-column
          label="受理部门"
          prop="currentProcessDeptName"
          width="120px"
        >
          <template
            slot-scope="scope"
            v-if="scope.row.currentProcessDeptName"
          >
            <el-tooltip placement="top">
              <div slot="content">
                <div v-for="e in scope.row.currentProcessDeptName.split(',')">
                  {{ e }}
                </div>
              </div>
              <div class="textOver">
                {{ scope.row.currentProcessDeptName }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          label="受理人"
          prop="currentProcessorName"
          width="120px"
        >
          <template
            slot-scope="scope"
            v-if="scope.row.currentProcessorName"
          >
            <el-tooltip placement="top">
              <div slot="content">
                <div v-for="e in scope.row.currentProcessorName.split(',')">
                  {{ e }}
                </div>
              </div>
              <div class="textOver">
                {{ scope.row.currentProcessorName }}
              </div>
            </el-tooltip>
          </template>
        </el-table-column>
      </template>
      <el-table-column
        label="创建人"
        prop="createdByName"
        width="120px" 
      />
    </el-table>
    <ayg-pagination
      v-if="tableList.total"
      :total="tableList.total"
      :current-page="form.pageNo"
      @handleSizeChange="sizeChange"
      @handleCurrentChange="query"
    />
    <el-dialog
      title="创建工单"
      :visible.sync="show"
      width="500px"
    >
      <div class="flexBox">
        <el-button
          class="mb20"
          v-for="(e, i) in btnList"
          :key="e.text"
          v-if="checkRight(permissions, e.right)"
          type="primary"
          @click="showWork(i)"
        >
          {{ e.text }}
        </el-button>
      </div>
    </el-dialog>
    <recharge-dialog
      :submit-cb="submitCb"
      :show-step="true"
      ref="rechargeDialog" 
    />
    <recharge-audit-dialog
      :audit-cb="auditCb"
      :disable="rechargeDisable"
      :show-step="true"
      ref="rechargeAuditDialog" 
    />
    <make-invoice ref="makeInvoice" />
    <audit-invoice
      :query="query"
      ref="auditInvoice" 
    />
    <knotty
      @create="submitCb"
      @handle="auditCb"
      ref="knotty"
    />
    <insufficient ref="insufficient" />
    <service-insufficient ref="serviceInsufficient" />
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
import { Loading } from 'element-ui'
import insufficient from './dialog/insufficient'
import serviceInsufficient from './dialog/serviceInsufficient'

export default {
    components: {
        rechargeDialog,
        rechargeAuditDialog,
        makeInvoice,
        auditInvoice,
        knotty,
        insufficient,
        serviceInsufficient
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
                parentBusinessStatus: '',
                startDate: '',
                endDate: '',
                // createByMe: '',
                deliveryName: '',
                salesName: '',
                status: '',
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
                },
                {
                    text: '疑难工单',
                    right: 'balance-web:/puzzle-channel/puzzlChannelApply'  // 四个单绑在一起了，所以用一个单的权限进行判断
                }
            ],
            typeList: [],
            stepList: [],
            statusList: [],
            companys: [],
            range: [],
            count: {
                TODO: 0,
                FINISH: 0,
                CREATE_BY_ME: 0,
                UNREAD: 0
            },
            rechargeDisable: false,
            showCreateBtn: false,
            deliveryList: [],
            salesList: [],
            readStatusList: [
                {
                    text: '待阅',
                    value: 0
                },
                {
                    text: '已阅',
                    value: 1
                }
            ],
            emergencyList: []
        }
    },
    computed: {
        ...mapGetters({
            serviceCompanyList: 'serviceCompanyList',
            permissions: 'permissions'
        }),
        ids() {
            let ids = []
            this.tableList.list && this.tableList.list.forEach(e => {
                e.readStatus == '0' && ids.push(e.id)
            })
            
            return ids
        }
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
        post(sysmgr.relationGroupEmployeeList, {
            relationKeyList: ['DeliverUserRelation'],
            page: 1,
            pageSize: 10000000 // 临时处理，设置一个非常大的数，来获取全部
        }).then(data => {
            this.deliveryList = data.list
        })
        post(sysmgr.userList, {
            platFormType: 'console-admin',
            accountInfo: '',
            page: 1,
            pageSize: 10000000 // 临时处理，设置一个非常大的数，来获取全部
        }).then(data => {
            this.salesList = data.list
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
        // this.$refs.insufficient.transmit({
        //     show: true
        // })
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
                case 'getReadTaskPageList':
                    k = 'getCreateByMeTaskTypeList'
                    break;
                default:
                    k = 'getRuntimeTaskTypeList'
                    break;
            }
            get(workflow[k], {
                procDefKey: this.form.procDefKey
            }).then(data => {
                this.stepList = data
            })
            get(workflow.mappingList, {
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
            this.statusList = []
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
		exportList() {
			let k = 'runtimeTaskExportList', str = ''
			switch (this.activeName) {
                case 'getRuntimeTaskPageList':
                    k = 'runtimeTaskExportList'
                    break;
                case 'getBizProcessPageList':
                    k = 'bizProcessExportList'
                    break;
                case 'getAboutMePageList':
                    k = 'bizProcessExportListByAboutMe'
                    break;
                case 'getCreateByMePageList':
                    k = 'bizProcessExportListByCreateMe'
                    break;
                default:
                    k = 'runtimeTaskExportList'
                    break;
			}
			for(let k in this.form) {
				str += `${str ? '&' : '?'}${k}=${this.form[k]}`
			}
			window.open(`${workflow[k]}${str}`)
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
                case 4:
                    this.$refs.knotty.transmit({
                        show: true,
                        param: {},
                        look: false
                    })
                    break;
                default:
                    break;
            }
        },
        submitCb() {
            console.log('create')
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
            get(workflow.getTaskId, {processInsId: param.processInstanceId }).then(res => {
                param.id = res.processTaskId
            
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
                case 'puzzle-customer-flow':
                case 'puzzle-service-flow':
                case 'puzzle-channel-flow':
                case 'puzzle-merchant-flow':
                case 'puzzle-others-flow':
                    this.$refs.knotty.transmit({
                        show: true,
                        param,
                        look
					})
                    break;
                case 'puzzle-channel-balance-not-enough':
                    this.$refs.insufficient.transmit({
                        show: true,
                        param,
                        look
                    })
                    break;
                case 'puzzle-channel-fee-not-enough':
                    this.$refs.serviceInsufficient.transmit({
                        show: true,
                        param,
                        look
                    })
                    break;
                default:
                    break;
            }
            if(param.readStatus && param.readStatus == '0') {
                this.setRead([param.id])
            }
            })
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
        },
        setRead(ids) {
            if(ids instanceof Array) {
                post(workflow.batchUpdateReadStatus, { ids }).then(data => {
                    this.tableList.list.forEach(e => {
                        if(ids.includes(e.id)) {
                            e.readStatus = '1'
                        }
                    })
                })
            }
        },
        setAllread() {
            this.setRead(this.ids)
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
.blue_0 {
    background-color: #359cfc;
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
    background-color: #FAAE14;
}
.purple {
    background-color: #FAAE14;
}
.red {
    background-color: #FF5500;
}
.allow {
    user-select: all;
}
.disable {
    filter: grayscale(1);
    cursor: not-allowed;
}
.textOver {
    width: 100%;
    overflow: hidden;
    text-overflow:ellipsis;
    white-space:nowrap;
}
</style>
