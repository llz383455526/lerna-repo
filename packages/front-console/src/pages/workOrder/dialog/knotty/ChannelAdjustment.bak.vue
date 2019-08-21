<template>
    <div>
        <el-form
          :model="form"
          :rules="rules"
          size="small"
          label-width="140px"
          ref="form"
        >
            <el-form-item
              label="申请类型"
              v-if="active > 1"
            >
                <span class="label-title">渠道调账申请（充值冲正）</span>
            </el-form-item>
            <el-form-item
              label="客户公司"
              prop="customerCompanyId"
            >
                <el-select
                  v-if="isCreate"
                  class="form_input"
                  v-model="form.customerCompanyId"
                  @change="selectCompany"
                >
                  <el-option
                    v-for="item in customCompanies"
                    :key="item.companyId"
                    :label="item.companyName"
                    :value="item.companyId"
                  ></el-option>
                </el-select>
                <span v-else>{{form.customerCompanyName}}</span>
            </el-form-item>
            <el-form-item
              label="商户名称"
              prop="merchantId"
            >
                <el-select
                  class="form_input"
                  v-if="isCreate"
                  v-model="form.merchantId"
                  @change="selectMerchant"
                >
                  <el-option
                    v-for="item in productName"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span v-else>{{form.merchantName}}</span>
            </el-form-item>
            <el-form-item
              label="服务公司"
              prop="serviceCompanyId"
            >
                <el-select
                  class="form_input"
                  v-if="isCreate"
                  v-model="form.serviceCompanyId"
                  @change="selectServiceCompany"
                >
                  <el-option
                    v-for="item in serviceName"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span v-else>{{form.serviceCompanyName}}</span>
            </el-form-item>
            <p class="label-title">转出支付渠道账号</p>
            <el-form-item
              label="业务类型"
              prop="businessId"
            >
                <el-select
                  class="form_input"
                  v-if="isCreate"
                  v-model="form.businessId"
                  @change="selectBusiness"
                >
                  <el-option
                    v-for="item in channlName"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span v-else>{{form.businessName}}</span>
            </el-form-item>
            <el-form-item
              label="渠道账号"
              prop="channelAccount"
            >
                <el-select
                  class="form_input"
                  v-if="isCreate"
                  v-model="form.channelAccount"
                >
                  <el-option
                    v-for="item in channlList"
                    :key="item.balanceAccountId"
                    :label="`${item.channelAlias}/${item.channelLoginAcctNo}/${item.channelMerCustId}/${item.payUserId}`"
                    :value="item.balanceAccountId"
                  ></el-option>
                </el-select>
                <span v-else>{{`${form.channelInfo.channelAlias}/${form.channelInfo.channelLoginAcctNo}/${form.channelInfo.channelMerCustId}/${form.channelInfo.payUserId}`}}</span>
            </el-form-item>
            <el-form-item label="业务渠道">
                <span>{{isCreate ? channelAlias : this.form.channelInfo.channelAlias}}</span>
            </el-form-item>
            <el-form-item
              label="实发账户"
              prop="actualAmount"
            >
                <el-input
                  type="number"
                  class="form_input"
                  v-if="isCreate"
                  v-model.number="actualAmount"
                >
                    <template slot="prepend">-</template>
                    <template slot="append">元</template>
                </el-input>
                <span v-else>{{form.actualAmount}}元</span>
            </el-form-item>
            <el-form-item
              label="服务费账户"
              prop="serviceAmount"
            >
                <el-input
                  type="number"
                  class="form_input"
                  v-if="isCreate"
                  v-model.number="serviceAmount"
                >
                    <template slot="prepend">-</template>
                    <template slot="append">元</template>
                </el-input>
                <span v-else>{{form.serviceAmount}}元</span>
            </el-form-item>
            <el-form-item label="总金额">
                <span>{{amount}}元</span>
            </el-form-item>
            <p class="label-title">转入支付渠道账号</p>
            <el-form-item
              label="业务类型"
              prop="transferBusinessId"
            >
                <el-select
                  class="form_input"
                  v-if="isCreate"
                  v-model="form.transferBusinessId"
                  @change="selectTransferBusiness"
                >
                  <el-option
                    v-for="item in channlName"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <span v-else>{{form.transferBusinessName}}</span>
            </el-form-item>
            <el-form-item
              label="渠道账号"
              prop="transferChannelAccount"
            >
                <el-select
                  class="form_input"
                  v-if="isCreate"
                  v-model="form.transferChannelAccount"
                >
                  <el-option
                    v-for="item in transferChannelList"
                    :key="item.balanceAccountId"
                    :label="`${item.channelAlias}/${item.channelLoginAcctNo}/${item.channelMerCustId}/${item.payUserId}`"
                    :value="item.balanceAccountId"
                  ></el-option>
                </el-select>
                <span v-else>{{`${form.transferChannelInfo.channelAlias}/${form.transferChannelInfo.channelLoginAcctNo}/${form.transferChannelInfo.channelMerCustId}/${form.transferChannelInfo.payUserId}`}}</span>
            </el-form-item>
            <el-form-item label="业务渠道">
                <span>{{isCreate ? transferChannelAlias : form.transferChannelInfo.channelAlias}}</span>
            </el-form-item>
            <el-form-item
              label="实发账户"
            >
                <span>{{form.transferActualAmount}}元</span>
            </el-form-item>
            <el-form-item
              label="服务费账户"
            >
                <span>{{form.transferServiceAmount}}元</span>
            </el-form-item>
            <el-form-item label="总金额">
                <span>{{transferAmout}}元</span>
            </el-form-item>
            <p class="label-title">申请说明</p>
            <el-form-item
              label="所属月份"
              prop="transactionTime"
            >
                <el-date-picker
                    v-if="isCreate"
                    class="form_input"
                    v-model="form.transactionTime"
                    type="month"
                    value-format="yyyy-MM"
                  >
                </el-date-picker>
                <span v-else>{{form.transactionTime}}</span>
            </el-form-item>
            <el-form-item
              label="申请备注"
              prop="remark"
            >
                <el-input
                  class="form_input"
                  v-if="isCreate"
                  v-model="form.remark"
                  type="textarea"
                ></el-input>
                <span v-else>{{form.remark}}</span>
            </el-form-item>
            <el-form-item
              label="上传凭证"
            >
                <upload-multiple
                  @result="result"
                  targetType="puzzle_channel_img"
                  :look="active != 1 || !isCreate"
                  ref="uploadMultiple_0"
                ></upload-multiple>
            </el-form-item>
            <el-form-item
                v-if="active > 1"
              label="审批备注"
              prop="approvalRemark"
            >
                <el-input
                  class="form_input"
                  v-if="active === 2  && !finished"
                  v-model="form.approvalRemark"
                  type="textarea"
                ></el-input>
                <span v-else>{{form.approvalRemark}}</span>
            </el-form-item>
            <el-form-item
                v-if="active > 2"
                label="制单上传凭证"
                prop="preparedocUploadCredentialsIds"
            >
                <el-input
                  type="hidden"
                  v-model="preparedocUploadCredentialsIds"
                ></el-input>
                <upload-multiple
                  @result="result1"
                  targetType="puzzle_channel_img"
                  :look="active !== 3 || finished"
                  ref="uploadMultiple_1"
                ></upload-multiple>
            </el-form-item>
            result1
        </el-form>
        <div
          slot="footer"
          class="dialog-footer"
        >
            <el-button
              size="small"
              @click="$emit('update:show', false)"
            >取消</el-button>
            <el-button
              v-if="isCreate"
              size="small"
              type="primary"
              @click="submitForm('form')"
            >确认提交</el-button>
            <template v-if="active == 2 && !finished">
                <el-button
                  size="small"
                  type="primary"
                  @click="rejectForm('form')"
                >驳回</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="examineForm('form')"
                >确认提交</el-button>
            </template>
            <template v-if="active == 3 && !finished">
                <el-button
                  size="small"
                  type="primary"
                  @click="makingRejectForm('form')"
                >驳回</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="makingExamineForm('form')"
                >已制单</el-button>
            </template>
            <template v-if="active == 4 && !finished">
                <el-button
                  size="small"
                  type="primary"
                  @click="financeRejectForm('form')"
                >驳回</el-button>
                <el-button
                  size="small"
                  type="primary"
                  @click="financeExamineForm('form')"
                >已审批</el-button>
            </template>
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { get, post, importPost, formPost, postWaitbyTaskId } from "store/api";
import {balance} from 'src/api'
import uploadSingle from 'pageComponent/uploadSingle'
import uploadMultiple from 'pageComponent/uploadMultiple'
export default {
    components: {
        uploadSingle,
        uploadMultiple
    },
    props: {
        active: {
            default: 1
        },
        customCompanies: {
          type: Array
        },
        param: {
            type: Object
        },
        look: {
            type: Boolean
        }
    },
    data() {
        return {
            form: {
                "actualAmount": "", // 实发账户金额
                "amount": "", // 总金额
                "applicationType": 2, // 申请类型
                "approvalRemark": "", // 审批备注
                "preparedocRemark": "", // 制单备注
                "financeAuditRemark": "", // 财务审核备注
                "approveUploadCredentialsIds": [],  // 申请单上传凭证ID集合
                "businessId": "", // 业务类型ID
                "businessName": "", // 业务类型名称
                "channelAccount": "", // 渠道账户
                "channelType": "", // 渠道名称
                "channelName": "", // 渠道名称
                "customerCompanyId": "", // 客户公司ID
                "customerCompanyName": "", // 客户公司名称
                "executionId": "", // 任务执行ID
                "id": "", // 业务ID
                "merchantId": "", // 商户ID
                "merchantName": "", // 商户名称
                "preparedocUploadCredentialsIds": [], // 制单上传凭证ID集合,
                "processInsId": "", // 任务ID
                "remark": "", // 申请备注
                "serviceAmount": "", // 服务费账户金额
                "serviceCompanyId": "", // 服务公司ID
                "serviceCompanyName": "", // 服务公司名称
                "state": 10, // 处理状态
                "taskId": "", // 任务ID
                "transactionTime": "", // 所属月份
                "transferActualAmount": "", // 转入实发账户
                "transferAmout": "", // 转入总金额
                "transferBusinessId": "", // 业务类型ID
                "transferChannelType": "", // 转入渠道类型
                "transferBusinessName": "", // 业务类型名称
                "transferChannelAccount": "", // 转入渠道账户
                "transferChannelName": "", // 转入渠道名称
                "transferServiceAmount": "", // 转入服务费账户
                channelInfo: {
                  channelAlias: '',
                  channelLoginAcctNo: '',
                  channelMerCustId: '',
                  payUserId: ''
                },
                "transferChannelInfo": {
                    channelAlias: '',
                    channelLoginAcctNo: '',
                    channelMerCustId: '',
                    payUserId: ''
                }
            },
            transferChannelList: [],
            actualAmount: '', // 输入的账户余额
            serviceAmount: '', // 输入的服务费余额
            rules: {
                customerCompanyId: [{
                    required: true, message: '请选择客户公司', trigger: 'change'
                }],
                serviceCompanyId: [{
                    required: true, message: '请选择服务公司', trigger: 'change'
                }],
                merchantId: [{
                    required: true, message: '请选择商户名称', trigger: 'change'
                }],
                businessId: [{
                    required: true, message: '请选择业务类型', trigger: 'change'
                }],
                transferBusinessId:  [{
                    required: true, message: '请选择业务类型', trigger: 'change'
                }],
                channelAccount: [{
                    required: true, message: '请选择渠道账号', trigger: 'change'
                }],
                transferChannelAccount: [{
                    required: true, message: '请选择渠道账号', trigger: 'change'
                }],
                actualAmount: [{
                    required: true, message: '请填写实发金额', trigger: 'blur'
                }],
                serviceAmount: [{
                    required: true, message: '请填写服务费金额', trigger: 'blur'
                }],
                transactionTime: [{
                    required: true, message: '请选择所属月份', trigger: 'change'
                }],
                remark: [{
                    required: true, message: '请填写申请备注', trigger: 'change'
                }],
                preparedocUploadCredentialsIds: [{
                    required: true, message: '请上传凭证', trigger: 'change'
                }],
                approvalRemark: [{
                    required: true, message: '请填写审批备注', trigger: 'change'
                }],
                preparedocRemark: [{
                    required: true, message: '请填写审批备注', trigger: 'change'
                }],
                financeAuditRemark: [{
                    required: true, message: '请填写审批备注', trigger: 'change'
                }]
            }
        }
    },
    computed: {
      ...mapGetters([
        "productName",
        "serviceName",
        "channlName",
        "channlList"
      ]),
      isCreate() {
            return this.active === 1 && !this.look
        },
      finished() {
          return this.param.finishedStatus === 'FINISHED' || this.look
      },
      amount() {
          this.form.amount = this.form.actualAmount + this.form.serviceAmount
          return this.form.amount
      },
      transferAmout() {
          this.form.transferAmout = this.form.transferActualAmount + this.form.transferServiceAmount
          return this.form.transferAmout
      },
      channelAlias(val) {
          const len = this.channlList.length
          for(let i = 0; i < len; i++) {
              if(this.channlList[i].balanceAccountId === this.form.channelAccount) {
                  return this.channlList[i].channelAlias
              }
          }
          return ''
      },
      transferChannelAlias(val) {
          const len = this.transferChannelList.length
          for(let i = 0; i < len; i++) {
              if(this.transferChannelList[i].balanceAccountId === this.form.transferChannelAccount) {
                  return this.transferChannelList[i].channelAlias
              }
          }
          return ''
      }
    },
    watch: {
      'form.customerCompanyId': function(newVal) {
        this.watchFun(newVal, '', ['merchantId', 'serviceCompanyId', 'businessId', 'channelAccount'],
           'customCompanies', 'customerCompanyName', 'companyId', 'companyName')
      },
      'form.merchantId': function(newVal) {
        this.watchFun(newVal, '', ['serviceCompanyId', 'businessId', 'channelAccount'],
           'productName', 'merchantName')
      },
      'form.serviceCompanyId': function(newVal) {
        this.watchFun(newVal, '', ['businessId', 'channelAccount'],
           'serviceName', 'serviceCompanyName')
      },
      actualAmount: function(val) {
          this.form.actualAmount = 0 - val
          this.form.transferActualAmount = val

      },
      serviceAmount: function(val) {
          this.form.serviceAmount = 0 - val
          this.form.transferServiceAmount = val
      },
      'form.businessId': function(newVal) {
        this.watchFun(newVal, '', ['channelAccount'],
           'channlName', 'businessName')
      },
      'form.transferBusinessId': function(newVal) {
        this.watchFun(newVal, '', ['transferChannelAccount'],
           'channlName', 'transferBusinessName')
      },
      'form.channelAccount': function(newVal) {
        this.watchFun(newVal, '', [],
           'channlList', 'channelType', 'balanceAccountId', 'paymentThirdType')
        this.watchFun(newVal, '', [],
           'channlList', 'channelName', 'balanceAccountId', 'paymentThirdTypeName')
      },
      'form.transferChannelAccount': function(newVal) {
        this.watchFun(newVal, '', [],
           'transferChannelList', 'transferChannelType', 'balanceAccountId', 'paymentThirdType')
        this.watchFun(newVal, '', [],
           'transferChannelList', 'transferChannelName', 'balanceAccountId', 'paymentThirdTypeName')
      }
    },
    methods: {
        ...mapActions([
          "getServiceList",
          "getAppList",
          "getBusinessList",
          "getChannlList"
        ]),
        // watch 函数
        /**
         * @param resetVal: any 重置的值
         * @param resetKey: array 重置的属性
         * @param newVal 新值，
         * @param propArr option数组，
         * @param itemKey 需要改变的字段,
         * @param idKey id字段，
         * @param nameKey name字段
         *
         */
        watchFun(newVal, resetVal, resetKey, propArr, itemKey, idKey='value', nameKey='text') {
            if(this.active > 1) { // 如果是审核阶段，那么不做任何操作
                return
            }
            resetKey.length && this.resetData(resetVal, resetKey) // 重置
            const len = this[propArr].length
            for(let i = 0; i < len; i++) { // 为id相关的name字段赋值
              if(this[propArr][i][idKey] === newVal) {
                this.form[itemKey] = this[propArr][i][nameKey]
                return
              }
            }
            this.form[itemKey] = ''
        },
        // 使用这个函数最好在data初始化完整对象，防止出错
        resetData(val, formItemArr) { // 相关联的选择器修改时需要重置
          formItemArr.forEach(i => {
            this['form'][i] = val
          })
        },
        selectCompany(val) {
          this.getAppList({companyId: val})
        },
        selectMerchant(val) {
          this.getServiceList({appId: val})
        },
        selectServiceCompany(val) {
          this.getBusinessList({
            appId: this.form.merchantId,
            serviceCompanyId: val
          })
        },
        selectBusiness(val) {
          this.getChannlList({
            appId: this.form.merchantId,
            serviceCompanyId: this.form.serviceCompanyId,
            bankType: val
          })
        },
        selectTransferBusiness(val) {
            get('/api/balance-web/balance-account/query-balance-account-channel-list', {
                appId: this.form.merchantId,
                serviceCompanyId: this.form.serviceCompanyId,
                bankType: val
            }).then(result => {
                this.transferChannelList = result
            })
        },
        result(res) {
            let arr = []
            res.forEach(item => {
                arr.push(item.downloadCode)
            })
            this.form.approveUploadCredentialsIds = arr
        },
        result1(res) {
            let arr = []
            res.forEach(item => {
                arr.push(item.downloadCode)
            })
            this.form.preparedocUploadCredentialsIds = arr
        },
        close() {
            this.$emit('update:show', false)
        },
        validateForm(formName) {
            return new Promise((resolve, reject) => {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        resolve()
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            })
        },
        rejectForm(formName, url = balance.puzzlChannelApprove, state = 80) {// 申请驳回，
            this.validateForm(formName).then(res => {
                this.form.state = state
                return postWaitbyTaskId(url, this.form)
            }).then(res => {
                this.$emit('update:show', false)
                this.$emit('handle')
            })
        },
        makingRejectForm(formName) {
            this.rejectForm(formName, balance.puzzlChannelPrepareDoc)
        },
        financeRejectForm(formName) {
            this.rejectForm(formName, balance.puzzlChannelFinanceAudit)
        },
        examineForm(formName, url = balance.puzzlChannelApprove, state = 20) { // 申请审核通过
            this.validateForm(formName).then(res => {
                this.form.state = state
                return postWaitbyTaskId(url, this.form)
            }).then(res => {
                this.$emit('update:show', false)
                this.$emit('handle')
            })
        },
        makingExamineForm(formName) {
             this.examineForm(formName, balance.puzzlChannelPrepareDoc, 30)
        },
        financeExamineForm(formName) {
             this.examineForm(formName, balance.puzzlChannelFinanceAudit, 40)
        },
        submitForm(formName) { // 申请
            this.validateForm(formName).then(res => {
                return postWaitbyTaskId(balance.puzzlChannelApply, this.form)
            }).then(res => {
                this.$emit('update:show', false)
                this.$emit('create')
            })
        }
    },
    created() {
        // 从prop.param中拼接processInsId，taskId到form上去
        this.form.taskId = this.param.id
        this.form.processInsId = this.param.processInstanceId
        // 将后端返回的数据拼接到form上去
        if(this.param.processInstanceId) {
            get(balance.puzzlChannelInfo, {
                id: this.param.businessId
            }).then(data => {
                for(let k in this.form) {
                    if(data[k]) {
                        this.form[k] = data[k]
                    }
                }
                // 申请凭证
                let uploadList = []
                this.form.approveUploadCredentialsIds && this.form.approveUploadCredentialsIds.forEach(e => {
                    uploadList.push({
                        imageUrl: `/api/sysmgr-web/file/download?downloadCode=${e}`,
                        downloadCode: e,
                        attachmentId: ''
                    })
                })
                uploadList.length && this.$refs.uploadMultiple_0.transmit({
                    uploadList
                })
                // 制单凭证
                let uploadList1 = []
                this.form.preparedocUploadCredentialsIds && this.form.preparedocUploadCredentialsIds.forEach(e => {
                    uploadList1.push({
                        imageUrl: `/api/sysmgr-web/file/download?downloadCode=${e}`,
                        downloadCode: e,
                        attachmentId: ''
                    })
                })
                uploadList1.length && this.$refs.uploadMultiple_1.transmit({
                    uploadList: uploadList1
                })
                // this.$refs.uploadSingle.transmit({
                //     imageUrl: `${data.uploadCredentialsIds[0]}`
                // })
            })
        }
    },
    // 销毁组件时也要初始化相关联的数据
    destroyed() {
      this.$store.commit('initDifficultData', [])
    }
}
</script>
<style scoped>
.form_input {
    width: 400px;
}
.dialog-footer {
    display: flex;
    justify-content: flex-end;
}
.det {
    position: relative;
    margin-left: 30px;
    margin-bottom: 10px;
}
.label-title{
    color: #0283fb;
}
</style>