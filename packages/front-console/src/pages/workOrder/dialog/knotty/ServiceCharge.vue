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
                <span class="label-title">{{typeName}}</span>
            </el-form-item>
            <el-form-item
              label="客户公司"
              prop="customerCompanyId"
            >
                <el-select
                  v-if="isCreate" 
                  class="form_input"
                  v-model="form.customerCompanyId"
                  filterable
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
                  filterable
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
                  filterable
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
            <company-info :companyInfo="form.companyInfo"></company-info>
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
                  v-model.number="form.actualAmount"
                >
                    <template slot="append">元</template>
                </el-input>
                <span v-else>{{form.actualAmount}}元</span>
            </el-form-item>
            <el-form-item
              label="服务费账户"
            >
                <!-- <el-input
                  type="number"
                  class="form_input"
                  v-if="active == 1"
                  v-model.number="form.serviceAmount"
                >
                    <template slot="append">元</template>
                </el-input> -->
                <span>{{-form.actualAmount}}元</span>
            </el-form-item>
            <el-form-item label="总金额">
                <span>{{active === 1 ? amount : form.amount}}元</span>
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
              prop="uploadCredentialsIds"
            >
                <el-input
                  type="hidden"
                  v-model="uploadCredentialsIds"
                ></el-input>
                <upload-multiple
                  @result="result"
                  targetType="puzzle_service_img"
                  :look="active != 1 || !isCreate"
                  ref="uploadMultiple"
                ></upload-multiple>
            </el-form-item>
            <el-form-item
              label="审批备注"
              prop="approvalRemark"
              v-if="active > 1"
            >
                <el-input
                  class="form_input"
                  v-if="active === 2 && !finished"
                  v-model="form.approvalRemark"
                  type="textarea"
                ></el-input>
                <span v-else>{{form.approvalRemark}}</span>
            </el-form-item>
        </el-form>
        <slot></slot>
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
            <template v-if="active == 2  && !finished">
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
        </div>
    </div>
</template>
<script>
import { mapGetters, mapActions } from 'vuex'
import { get, post, importPost, formPost, postWaitbyTaskId } from "store/api";
import {balance} from 'src/api'
import uploadSingle from 'pageComponent/uploadSingle'
import uploadMultiple from 'pageComponent/uploadMultiple'
import CompanyInfo from './CompanyInfo'

export default {
    components: {
        uploadSingle,
        uploadMultiple,
        CompanyInfo
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
        },
        typeName: {
            type: String
        }
    },
    data() {
        return {
            form: {
                "actualAmount": "", // 实发账户金额
                "amount": "", // 总金额
                "applicationType": 4, // 申请类型
                "businessId": "", // 业务类型ID
                "businessName": "", // 业务类型名称
                "channelAccount": "", // 渠道账户
                "channelType": "", // 渠道ID
                "channelName": "", // 渠道名称
                "customerCompanyId": "", // 客户公司ID
                "customerCompanyName": "", // 客户公司名称
                "executionId": "", // 任务执行ID
                "id": "", // 业务ID
                "merchantId": "", // 商户ID
                "merchantName": "", // 商户名称
                "processInsId": "", // 任务ID
                "remark": "", // 申请备注
                "serviceAmount": "", // 服务费账户金额
                "serviceCompanyId": "", // 服务公司ID
                "serviceCompanyName": "", // 服务公司名称
                "companyInfo": "", // 服务商户信息
                "state": 10, // 处理状态 // 10 初始， 20 待审批 30 待制单/待复核 40 待财务审核 50 调账成功 60 调账失败 80 驳回
                "taskId": "", // 任务ID
                "transactionTime": "", // 所属月份
                "uploadCredentialsIds": [],  // 上传凭证,
                "approvalRemark":"", // 审核凭证
                channelInfo: {
                  channelAlias: '',
                  channelLoginAcctNo: '',
                  channelMerCustId: '',
                  payUserId: ''
                }
            },
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
                channelAccount: [{
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
                uploadCredentialsIds: [{
                    required: true, message: '请上传凭证', trigger: 'change'
                }],
                approvalRemark: [{
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
        this.form.serviceAmount = 0 - this.form.actualAmount
        this.form.amount = this.form.actualAmount + this.form.serviceAmount
        return this.form.actualAmount + this.form.serviceAmount
      },
      channelAlias(val) {
          const len = this.channlList.length
          for(let i = 0; i < len; i++) {
              if(this.channlList[i].balanceAccountId === this.form.channelAccount) {
                  return this.channlList[i].channelAlias
              }
          }
          return ''
      }
    },
    watch: {
      'form.customerCompanyId': function(newVal) {
        this.watchFun(newVal, '', ['merchantId', 'serviceCompanyId',  'businessId', 'channelAccount'],
           'customCompanies', 'customerCompanyName', 'companyId', 'companyName')
        this.active === 1 && this.resetData({}, ['companyInfo']) // companyInfo要求是对象
      },
      'form.merchantId': function(newVal) {
        this.watchFun(newVal, '', ['serviceCompanyId', 'businessId', 'channelAccount'],
           'productName', 'merchantName')
        this.active === 1 && this.resetData({}, ['companyInfo']) // companyInfo要求是对象
      },
      'form.serviceCompanyId': function(newVal) {
        this.watchFun(newVal, '', ['businessId', 'channelAccount'],
           'serviceName', 'serviceCompanyName')
        this.active === 1 && this.resetData({}, ['companyInfo']) // companyInfo要求是对象
      },
      'form.businessId': function(newVal) {
        this.watchFun(newVal, '', ['channelAccount'],
           'channlName', 'businessName')
      },
      'form.channelAccount': function(newVal) {
        this.watchFun(newVal, '', [],
           'channlList', 'channelType', 'balanceAccountId', 'paymentThirdType')
        this.watchFun(newVal, '', [],
           'channlList', 'channelName', 'balanceAccountId', 'paymentThirdTypeName')
      }
    },
    methods: {
        ...mapActions([
          "getServiceList",
          "getAppList",
          "getBusinessList",
          "getChannlList",
          "getServiceInfo"
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
          this.getServiceInfo({
            companyId: this.form.customerCompanyId,
            serviceCompanyId: val
          }).then(res => {
              this.form.companyInfo = res
          })
        },
        selectBusiness(val) {
          this.getChannlList({
            appId: this.form.merchantId,
            serviceCompanyId: this.form.serviceCompanyId,
            bankType: val
          })
        },
        result(res) {
            let arr = []
            res.forEach(item => {
                arr.push(item.downloadCode)
            })
            this.form.uploadCredentialsIds = arr
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
        rejectForm(formName) {// 驳回，
            this.validateForm(formName).then(res => {
                this.form.state = 80
                return postWaitbyTaskId(balance.puzzlServiceApprove, this.form)
            }).then(res => {
                this.$emit('update:show', false)
                this.$emit('handle')
            })
        },
        examineForm(formName) { // 审核通过
            this.validateForm(formName).then(res => {
                this.form.state = 20
                return postWaitbyTaskId(balance.puzzlServiceApprove, this.form)
            }).then(res => {
                this.$emit('update:show', false)
                this.$emit('handle')
            })
        },
        submitForm(formName) { // 申请
            this.validateForm(formName).then(res => {
                return post(balance.puzzlServiceApply, this.form)
            }).then(res => {
                this.$emit('update:show', false)
                this.$emit('create')
            })
            // this.$refs[formName].validate((valid) => {
            // if (valid) {
            //     post(balance.puzzlServiceApply, this.form).then(res => {
            //       this.$emit('update:show', false)
            //     })
            //     // alert('submit!');
            // } else {
            //     console.log('error submit!!');
            //     return false;
            // }
            // });
        }
    },
    created() {
        // 将后端返回的数据拼接到form上去
        if(this.param.processInstanceId) {
            get(balance.puzzlServiceInfo, {
                id: this.param.businessId
            }).then(data => {
                for(let k in this.form) {
                    if(k in data) {
                        this.form[k] = data[k]
                    }
                }
                // 从prop.param中拼接processInsId，taskId到form上去
                this.form.taskId = this.param.id
                this.form.processInsId = this.param.processInstanceId
                // 为上传组件加上预览的地址
                let uploadList = []
                this.form.uploadCredentialsIds && this.form.uploadCredentialsIds.forEach(e => {
                    uploadList.push({
                        imageUrl: `/api/sysmgr-web/file/download?downloadCode=${e}`,
                        downloadCode: e,
                        attachmentId: ''
                    })
                })
                uploadList.length && this.$refs.uploadMultiple.transmit({
                    uploadList
                })
            })
        }
    },
    destroyed() {
      this.$store.commit('initDifficultData')
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
