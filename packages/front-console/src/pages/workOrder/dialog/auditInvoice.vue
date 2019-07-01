<template>
  <div>
    <el-dialog
      title=""
      :visible.sync="show"
      width="800px"
    >
      <div class="tip">
        <span class="mr20">开票申请单号：{{ param.processInstanceId }}</span>
        <span class="mr20">创建时间：{{ param.createTime }}</span>
        <span class="mr20">创建人：{{ realStep.length ? realStep[0].userName : '' }}</span>
      </div>
      <el-steps
        :active="active"
        align-center
        class="mt20 mb20"
        :key="stepList.length"
      >
        <el-step
          v-for="e in stepList"
          :key="e.activityId"
          :title="e.activityName"
          :description="e.userName" 
        />
      </el-steps>
      <div class="title mb20 green_0">
        状态：{{ msg.statusName }}
      </div>
      <div v-if="currentStpe.activityId == 'taskApply' || currentStpe.activityId == 'taskAudit'">
        剩余票量：<span class="red">{{ amount }}</span>张
      </div>
      <div v-if="active === 3">
        <p class="title">
          购买方信息
        </p> 
        <div style="padding-left: 20px">
          <p> 开票名称：{{ msg.customCompanyResult.name }}</p>
          <p> 纳税人识别号：{{ msg.customCompanyResult.taxIdcd }}</p>
          <p> 地址、电话：{{ msg.customCompanyResult.collectorAddr }} {{ msg.customCompanyResult.collectorPhone }}</p>
          <p> 开户行及账号：{{ msg.customCompanyResult.bankName }} {{ msg.customCompanyResult.bankAccount }}</p>
        </div>
      </div> 
      <el-table
        class="mt20"
        :data="[msg.orderTitle]"
      >
        <el-table-column
          label="客户名称"
          prop="customCompanyName"
        />
        <el-table-column
          label="开票公司"
          prop="serviceCompanyName"
        />
        <el-table-column
          label="开票类型"
          prop="invoiceTypeName" 
        />
        <el-table-column label="开票总金额">
          <template slot-scope="scope">
            {{ scope.row ? scope.row.amount : 0 | formatMoney }}
          </template>
        </el-table-column>
        <el-table-column
          label="申请发票数"
          v-if="currentStpe.activityId == 'taskApply' || currentStpe.activityId == 'taskAudit'"
          :prop="currentStpe.activityId == 'taskApply' ? 'totalNum' : 'realNum'" 
        />
        <el-table-column
          label="寄送发票数"
          v-else
          prop="realNum" 
        />
      </el-table>
      <template v-if="currentStpe.activityId == 'taskApply' || currentStpe.activityId == 'taskAudit' || currentStpe.activityId == 'taskCreate' || currentStpe.activityId == 'taskExceptionCheck'">
        <el-table
          class="mt20"
          :data="msg.orderItems"
          @selection-change="selectionChange"
          key="1"
        >
          <el-table-column
            type="selection"
            v-if="currentStpe.activityId == 'taskAudit' && !look"
            :selectable="selecCheck" 
          />
          <el-table-column
            label="序号"
            prop="orderItemId"
          />
          <el-table-column label="开票类目">
            <template slot-scope="scope">
              <div
                v-for="(e, i) in scope.row.invoiceOrderItemSubjects"
                :key="i"
              >
                {{ e.subjectName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="开票金额（含税）">
            <template slot-scope="scope">
              <div
                v-for="(e, i) in scope.row.invoiceOrderItemSubjects"
                :key="i"
              >
                {{ e.amount | formatMoney }}
              </div>
              <!-- {{ scope.row.amount | formatMoney }} -->
            </template>
          </el-table-column>
          <el-table-column
            label="状态"
            prop="stateName"
          >
            <template slot-scope="scope">
              <span :class="scope.row.state == 'fail' ? 'red' : 'green_0'">{{ scope.row.stateName }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button v-if="scope.row.status === 'fail' || scope.row.status === 'dealing'" type="text">线下已开票，修改状态</el-button>
                        </template>
                    </el-table-column> -->
        </el-table>
        <el-form
          :model="form"
          label-width="120px"
          ref="form"
        >
          <el-form-item
            label="发票用途"
            v-if="msg.purpose"
          >
            <!-- !look || stepList.length == 2 -->
            {{ msg.purpose }}
          </el-form-item>
          <el-form-item
            label="发票显示备注"
            v-if="msg.remark"
          >
            {{ msg.remark }}
          </el-form-item>
          <el-form-item
            label="备注"
            v-if="(currentStpe.activityId == 'taskApply' && !look) || (msg.busiRemark && look)"
            prop="busiRemark"
          >
            <el-input
              class="form_input"
              v-model="form.busiRemark"
              type="textarea"
              v-if="currentStpe.activityId == 'taskApply' && !look"
            />
            <template v-else-if="msg.busiRemark && look">
              {{ msg.busiRemark }}
            </template>
          </el-form-item>
        </el-form>
      </template>
      <template v-else-if="stepList.length == 5">
        <div class="title">
          上传发票扫描件
        </div>
        <!-- <el-upload
                    class="form_input mt20"
                    :action="`/api/econtract/template/parsefile`"
                    :auto-upload="false"
                    :on-change="upload"
                    :multiple="false"
                    :show-file-list="false"
                    accept="*"> -->
        <!-- .xlsx, .xls -->
        <!-- <el-button size="small" type="primary" v-if="!look">上传文件</el-button>
                </el-upload> -->
        <el-table
          :data="msg.orderItems"
          key="2"
        >
          <el-table-column
            label="序号"
            prop="orderItemId"
          />
          <el-table-column label="开票类目">
            <template slot-scope="scope">
              <div
                v-for="(e, i) in scope.row.invoiceOrderItemSubjects"
                :key="i"
              >
                {{ e.subjectName }}
              </div>
            </template>
          </el-table-column>
          <el-table-column label="开票金额（含税）">
            <template slot-scope="scope">
              <div
                v-for="(e, i) in scope.row.invoiceOrderItemSubjects"
                :key="i"
              >
                {{ e.amount }}
              </div>
            </template>
            <!-- <template slot-scope="scope">
              {{ scope.row.amount | formatMoney }}
            </template> -->
          </el-table-column>
          <el-table-column
            label="发票代码"
            prop="invoiceCode"
          >
            <template slot-scope="scope">
              <span v-if="msg.channel != 'pxx' || currentStpe.activityId != 'taskMakeInvoice'">{{ scope.row.invoiceCode }}</span>
              <el-input
                v-else
                v-model="scope.row.invoiceCode" 
              />
            </template>
          </el-table-column>
          <el-table-column
            label="发票号码"
            prop="invoiceNo"
          >
            <template slot-scope="scope">
              <span v-if="msg.channel != 'pxx' || currentStpe.activityId != 'taskMakeInvoice'">{{ scope.row.invoiceNo }}</span>
              <el-input
                v-else
                v-model="scope.row.invoiceNo"
              />
            </template>
          </el-table-column>
          <el-table-column
            label="开票状态"
            prop="stateName"
          >
            <template slot-scope="scope">
              <span :class="scope.row.state == 'fail' ? 'red' : 'green_0'">{{ scope.row.stateName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="发票扫描件"
            prop="invoiceVoucherName"
          >
            <template slot-scope="scope">
              <span v-if="!look">{{ scope.row.invoiceVoucherName }}</span>
              <a
                v-else-if="scope.row.invoiceVoucher && scope.row.state != 'fail'"
                :href="`${invoiceApi.preview}?ossId=${scope.row.invoiceVoucher}`"
                target="_bank"
              >
                <el-button type="text">{{ scope.row.invoiceVoucherName }}</el-button>
              </a>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-upload
                v-if="!look"
                class="form_input mt20"
                :action="`/api/econtract/template/parsefile`"
                :auto-upload="false"
                :on-change="upload"
                :multiple="false"
                :show-file-list="false"
                accept="image/*, .pdf"
              >
                <el-button
                  type="text"
                  @click="targetId = scope.row.trasactionOrderItemId"
                >
                  上传文件
                </el-button>
              </el-upload>
              <a
                v-else-if="scope.row.invoiceVoucher"
                :href="`${invoiceApi.download}?ossId=${scope.row.invoiceVoucher}`"
                :download="scope.row.invoiceVoucherName"
                target="_bank"
              >
                <el-button type="text">下载</el-button>
              </a>
            </template>
          </el-table-column>
        </el-table>
        <template v-if="msg.expressLink">
          <div class="title">
            邮寄信息
          </div>
          <div>收票人：{{ msg.expressLink.collector }}</div>
          <div>收票人电话：{{ msg.expressLink.collectorPhone }}</div>
          <div>收票人地址：{{ msg.expressLink.collectorAddr }}</div>
        </template>
        <div class="title">
          寄送发票
        </div>
        <el-button
          class="mt20"
          size="small"
          type="primary"
          @click="showInput"
          v-if="!look"
        >
          录入物流信息
        </el-button>
        <el-table :data="[inputForm]">
          <el-table-column
            label="录入时间"
            width="180px"
          >
            <template slot-scope="scope">
              {{ scope.row.addExpressTime | formatTime('yyyy-MM-dd hh:mm:ss') }}
            </template>
          </el-table-column>
          <el-table-column
            label="物流公司"
            prop="expressCompany" 
          />
          <el-table-column
            label="物流单号"
            prop="expressOrderNo"
          />
          <el-table-column
            label="寄送凭证"
            prop="expressVoucherName"
          >
            <template slot-scope="scope">
              <span v-if="!look">{{ scope.row.expressVoucherName }}</span>
              <a
                v-else-if="scope.row.expressVoucher"
                :href="`${invoiceApi.preview}?ossId=${scope.row.expressVoucher}`"
                target="_bank"
              >
                <el-button type="text">{{ scope.row.expressVoucherName }}</el-button>
              </a>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                v-if="!look && inputForm.expressCompany"
                @click="showInput(true)"
              >
                编辑
              </el-button>
              <a
                v-else-if="scope.row.expressVoucher"
                :href="`${invoiceApi.download}?ossId=${scope.row.expressVoucher}`"
                :download="scope.row.expressVoucherName"
                target="_bank"
              >
                <el-button type="text">下载</el-button>
              </a>
            </template>
          </el-table-column>
        </el-table>
      </template>
      <div class="title">
        操作记录
      </div>
      <div
        v-for="(e, i) in realStep"
        :key="e.activityId"
      >
        {{ i + 1 }}.{{ e.userName ? e.userName : '系统' }}  于{{ e.processDate }} {{ e.operate || e.activityName }}
        <template v-if="e.comment">
          ，备注： {{ e.comment }}
        </template>
      </div>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <template v-if="stepList.length == 5 || look">
          <el-button @click="show = false">关闭</el-button>
          <template v-if="!look">
            <template v-if="currentStpe.activityId == 'taskApply'">
              <el-button @click="showReject">整单拒开</el-button>
              <el-button
                type="primary"
                @click="pass"
              >审核通过</el-button>
            </template>
            <template v-if="currentStpe.activityId == 'taskAudit'">
              <el-button
                type="primary"
                @click="makeInvoice"
              >开票</el-button>
            </template>
            <template v-if="currentStpe.activityId == 'taskMakeInvoice' && !look">
              <el-button
                type="primary"
                @click="ensure"
              >确认</el-button>
            </template>
          </template>
          <template v-else-if="(currentStpe.activityId == 'taskApply' || currentStpe.activityId == 'taskAudit') && isMe">
            <el-button
              type="primary"
              v-if="param.taskName != '结束'"
              @click="cancel"
            >取消申请</el-button>
          </template>
        </template>
        <template v-else>
          <template v-if="currentStpe.activityId == 'taskCreate'">
            <el-button @click="dispose(2)">重新开票</el-button>
            <el-button @click="dispose(1)">开票成功</el-button>
          </template>
          <el-button
            v-else
            @click="show = false"
          >关闭</el-button>
        </template>
      </span>
    </el-dialog>
    <audit-reject
      @reject="reject"
      ref="auditReject"
    />
    <input-msg
      @result="inputResult"
      ref="inputMsg"
    />
  </div>
</template>
<script>
import { get, post, importPost, formPost, postWaitbyTaskId  } from "../../../store/api"
import { invoiceApi, workflow, sysmgr } from "src/api"
import auditReject from './auditReject'
import inputMsg from './inputMsg'
export default {
    props: {
        query: {
            type: Function,
            default() {
                return () => {}
            }
        }
    },
    components: {
        auditReject,
        inputMsg
    },
    data() {
        return {
            show: false,
            active: 1,
            look: false,
            isMe: false,
            form: {
                taskId: '',
                processInsId: '',
                orderNo: '',
                allReject: false,
                memo: '',
                busiRemark: '',
            },
            param: {},
            input_show: false,
            msg: {
                customCompanyResult: {}
            },
            amount: 0,
            invoiceList: [],
            stepList: [],
            currentStpe: {},
            realStep: [],
            targetId: '',
            inputForm: {},
            invoiceApi
        }
    },
    mounted() {
        // get(invoiceApi.getTicketSurplus).then(data => {

        // })
    },
    methods: {
        transmit(a) {
            Object.assign(this, a)
            this.form.orderNo = this.param.businessId
            this.form.taskId = this.param.id
            this.form.processInsId = this.param.processInstanceId
            this.$refs.form && this.$refs.form.resetFields()
            get(invoiceApi.getApplyInfo, {
                orderNo: this.param.businessId
            }).then(data => {
                data.orderItems[0].invoiceSubjects = [data.orderItems[0].invoiceSubjects, data.orderItems[0].invoiceSubjects]
                this.msg = data
                this.inputForm = data.expressInfo
                get(invoiceApi.getTicketSurplus, {
                    serviceCompanyId: this.msg.orderTitle.serviceCompanyId,
                    invoiceType: this.msg.orderTitle.invoiceType
                }).then(data => {
                    this.amount = data
                })
                // get(invoiceApi.invoiceHangup, { orderId: this.msg.orderId})
                Promise.all([
                    get(workflow.getProcessAllProgress, { processInstanceId: this.param.processInstanceId }),
                    get(workflow.getProcessCurrentProgress, { processInstanceId: this.param.processInstanceId })
                ]).then(data => {
                    // if(data[2].data.flag) {
                    //     data[0].default.splice(3, 0, data[2].data.defaultX[0])
                    // }
                    this.stepList = []
                    data[0].default.forEach((e, i) => {
                        if(data[1][i] && data[1][i].activityId == 'taskProcessing') {
                            data[1].splice(i, 1)
                        }
                        this.stepList.push(Object.assign(data[1][i] ? data[1][i] : {}, e))
                    })
                    this.active = data[1].length + ((this.look || this.param.finishedStatus == 'FINISHED') && this.param.currentTaskNodeId != 'endEvent' ? 0 : 1)
                    this.realStep = JSON.parse(JSON.stringify(data[1]))
                    data[1] && (this.currentStpe = data[1].pop())
                })
            })
            // get(workflow.getProcessAllProgress, {
            //     processInstanceId: this.param.processInstanceId
            // }).then(data => {
            //     this.stepList = data
            // })
            // get(workflow.getProcessCurrentProgress, {
            //     processInstanceId: this.param.processInstanceId
            // }).then(data => {
                
            // })
        },
        showInput(a) {
            this.$refs.inputMsg.transmit({
                show: true,
                orderId: this.msg.orderId,
                taskId: this.param.id,
                form: a === true ? this.inputForm : {}
            })
        },
        inputResult(a) {
            this.inputForm = a
            console.log(a)
        },
        showReject() {
            this.$refs.auditReject.transmit({
                show: true
            })
        },
        pass() {
            Object.assign(this.form, {
                allReject: false,
                memo: '',
            })
            this.approveSubmit()
        },
        reject(a) {
            Object.assign(this.form, a)
            this.approveSubmit()
        },
        approveSubmit() {
            postWaitbyTaskId(invoiceApi.approveSubmit, this.form).then(data => {
                this.$message({
                    message: `${this.form.allReject ? '已拒开' : '审核通过'}！`,
                    type: 'success'
                })
                this.show = false
                this.query(true)
            })
        },
        selectionChange(a) {
            this.invoiceList = a
        },
        makeInvoice() {
            if(!this.invoiceList.length) {
                this.$message({
                    message: '请至少选择一条记录',
                    type: 'warning'
                })
                return
            }
            let invoiceIds = []
            this.invoiceList.forEach(e => {
                invoiceIds.push(e.trasactionOrderItemId)
            })
            postWaitbyTaskId(invoiceApi.openPaperInvoice, {
                taskId: this.form.taskId,
                processInsId: this.form.processInsId,
                orderNo: this.form.orderNo,
                invoiceIds
            }).then(data => {
                this.$message({
                    message: '开票成功！',
                    type: 'success'
                })
                this.show = false
                this.query(true)
            })
        },
        selecCheck(a) {
            return a.state == 'init'
        },
        ensure() {
            let {expressCompany, expressOrderNo} = this.inputForm, offlineInvoiceInfoList = []
            if(this.msg.channel == 'pxx' && this.msg.orderItems.filter(e => !e.invoiceCode || !e.invoiceNo).length) {
                this.$message({
                    type: 'warning',
                    message: '请补齐所有发票代码、发票号码！'
                })
                return
            }
            else {
                this.msg.orderItems.forEach(e => {
                    offlineInvoiceInfoList.push({
                        invoiceCode: e.invoiceCode,
                        invoiceNo: e.invoiceNo,
                        transItemId: e.trasactionOrderItemId
                    })
                })
            }
            if(this.msg.orderItems.filter(e => !e.invoiceVoucherName).length) {
                this.$message({
                    type: 'warning',
                    message: '请补齐所有发票扫描件！'
                })
                return
            }
            if(!this.inputForm.expressCompany) {
                this.$message({
                    type: 'warning',
                    message: '请录入物流信息！'
                })
                return
            }
            postWaitbyTaskId(invoiceApi.workflowExpress, {
                orderId: this.msg.orderId,
                taskId: this.form.taskId,
                processInsId: this.form.processInsId,
                expressCompany,
                expressOrderNo,
                offlineInvoiceInfoList
            }).then(data => {
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                })
                this.show = false
                this.query(true)
            })
        },
        cancel() {
            postWaitbyTaskId(invoiceApi.invoiceCancel, {
                orderNo: this.form.orderNo,
                processInsId: this.form.processInsId,
                taskId: this.form.taskId,
            }).then(data => {
                this.$message({
                    message: '已取消！',
                    type: 'success'
                })
                this.show = false
                this.query(true)
            })
        },
        dispose(type) {
            postWaitbyTaskId(invoiceApi.invoiceException, {
                orderNo: this.form.orderNo,
                processInsId: this.form.processInsId,
                taskId: this.form.taskId,
                type
            }).then(data => {
                this.$message({
                    message: '操作成功！',
                    type: 'success'
                })
                this.show = false
                this.query(true)
            })
        },
        // --------------------
        upload(a) {
            var form = new FormData();
            form.append('fileName', a.name);
            form.append('file', a.raw);
            form.append('targetType', 'invoiceTicket')
            form.append('targetId', this.targetId)

            formPost(invoiceApi.uploadExt, form).then(data => {
                // this.referId = data.referId
                // this.progress()
                this.msg.orderItems.forEach(e => {
                    if(e.trasactionOrderItemId == this.targetId) {
                        e.invoiceVoucherName = a.name
                    }
                })
            });
        },
        // progress() {
        //     this.frame = requestAnimationFrame(this.progress)
        //     if(this.isEnd && (!this.date || this.date < new Date().getTime() - 1000)) {
        //         this.isEnd = false
        //         post('/api/sysmgr-web/file/progress', {
        //             id: this.referId
        //         }, true).then(data => {
        //             this.isEnd = true
        //             this.date = new Date().getTime()
        //             this.pro = data.progress
        //             if (this.pro == 100) {
        //                 cancelAnimationFrame(this.frame)
        //                 if(data.state == 30 || data.state == 20) {
        //                     this.form.taskId = data.taskId
        //                     this.show = false
        //                     this.query()
        //                 }
        //                 if(data.state == 40) {
        //                     this.$message.error(data.desc)
        //                 }
        //             }
        //         })
        //     }
        // },
    }
}
</script>
<style scoped>
.form_input {
    width: 400px;
}
.title {
    font-weight: bold;
    margin: 20px 0px 0px;
}
.mt20 {
    margin-top: 20px;
}
.mr20 {
    margin-right: 20px;
}
.mb20 {
    margin-bottom: 20px;
}
.tip {
    font-size: 12px;
}
.red {
    color: red;
}
.v-modal {
    z-index: 9999;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 1000px auto;
    background-position: center center;
    transition: all 0.3s;
}
.green_0 {
    color: #69aa46;
}
</style>
