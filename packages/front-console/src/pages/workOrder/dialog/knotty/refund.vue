<template>
    <div>
        <el-form :model="form" :rules="rules" size="small" label-width="140px" ref="form">
            <el-form-item label="申请类型" v-if="!isCreate">
                客户退款申请
            </el-form-item>
            <el-form-item label="转出公司" prop="customerCompanyId" v-if="isCreate">
                <el-select class="form_input" v-model="form.customerCompanyId" filterable @change="getApp">
                    <el-option v-for="e in customCompanies" :key="e.companyId" :value="e.companyId" :label="e.companyName"></el-option>
                </el-select>
            </el-form-item>
            <div class="title" v-else>转出公司：{{form.customerCompanyName}}</div>
            <el-form-item label="商户名称" prop="merchantId">
                <el-select class="form_input" v-if="isCreate" v-model="form.merchantId" filterable @change="getService">
                    <el-option v-for="e in appList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                </el-select>
                <span v-else>{{form.merchantName}}</span>
            </el-form-item>
            <el-form-item label="服务公司" prop="serviceCompanyId">
                <el-select class="form_input" v-if="isCreate" v-model="form.serviceCompanyId" filterable @change="getBusiness">
                    <el-option v-for="e in serviceList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                </el-select>
                <span v-else>{{form.serviceCompanyName}}</span>
            </el-form-item>
            <company-info :companyInfo="serviceInfo"></company-info>
            <!-- <template v-if="serviceInfo">
                <el-form-item label="开户行">{{serviceInfo.depositBank}}</el-form-item>
                <el-form-item label="账号名">{{serviceInfo.accountName}}</el-form-item>
                <el-form-item label="账号">{{serviceInfo.accountNo}}</el-form-item>
            </template> -->
            <el-form-item label="业务类型" prop="businessId">
                <el-select class="form_input" v-if="isCreate" v-model="form.businessId" @change="getChannl">
                    <el-option v-for="e in businessList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                </el-select>
                <span v-else>{{form.businessName}}</span>
            </el-form-item>
            <el-form-item label="渠道账号" prop="channelAccount">
                <el-select class="form_input" v-if="isCreate" v-model="form.channelAccount" @change="clearAndGetName(4)">
                    <el-option v-for="e in channlList" :key="e.balanceAccountId" :label="`${e.channelAlias}/${e.channelLoginAcctNo}/${e.channelMerCustId}/${e.payUserId}`" :value="e.balanceAccountId"></el-option>
                </el-select>
                <span v-else>{{`${channelInfo.channelAlias}/${channelInfo.channelLoginAcctNo}/${channelInfo.channelMerCustId}/${channelInfo.payUserId}`}}</span>
            </el-form-item>
            <el-form-item label="实发账户金额" prop="actualAmount">
                <el-input class="form_input" v-if="isCreate" v-model="actualAmount">
                    <template slot="prepend">-</template>
                    <template slot="append">元</template>
                </el-input>
                <span v-else>{{form.actualAmount || 0}}元</span>
            </el-form-item>
            <el-form-item label="服务费账户金额" prop="serviceAmount">
                <el-input class="form_input" v-if="isCreate" v-model="serviceAmount">
                    <template slot="prepend">-</template>
                    <template slot="append">元</template>
                </el-input>
                <span v-else>{{form.serviceAmount || 0}}元</span>
            </el-form-item>
            <el-form-item label="总金额">
                {{form.actualAmount - 0 + (form.serviceAmount - 0) || 0}}元
            </el-form-item>
            <el-form-item label="所属月份" prop="transactionTime">
                <el-date-picker
                    v-if="isCreate"
                    class="form_input"
                    v-model="form.transactionTime"
                    type="month"
                    value-format="yyyy-MM">
                </el-date-picker>
                <span v-else>{{form.transactionTime}}</span>
            </el-form-item>
            <el-form-item label="申请备注" prop="remark">
                <el-input class="form_input" v-if="isCreate" type="textarea" v-model="form.remark"></el-input>
                <span v-else>{{form.remark}}</span>
            </el-form-item>
            <el-form-item label="上传凭证" prop="approveUploadCredentialsIds">
                <upload-multiple @result="result" :look="!isCreate" :targetType="targetType" ref="uploadMultiple_0"></upload-multiple>
            </el-form-item>
            <el-form-item label="制单路径">
                原路退回<span class="red">（对公转账：T+1）</span>
            </el-form-item>
            <div class="title">转入公司：{{form.customerCompanyName}}</div>
            <el-form-item label="账户名称" prop="transferAccountName">
                <el-input class="form_input" v-if="isCreate" v-model="form.transferAccountName"></el-input>
                <span v-else>{{form.transferAccountName}}</span>
            </el-form-item>
            <el-form-item label="开户行" prop="transferOpenBank">
                <el-input class="form_input" v-if="isCreate" v-model="form.transferOpenBank"></el-input>
                <span v-else>{{form.transferOpenBank}}</span>
            </el-form-item>
            <el-form-item label="收款账号" prop="transferAccountNo">
                <el-input class="form_input" v-if="isCreate" v-model="form.transferAccountNo"></el-input>
                <span v-else>{{form.transferAccountNo}}</span>
            </el-form-item>
            <el-form-item label="审批备注" v-if="active > 1" prop="approvalRemark">
                <el-input class="form_input" type="textarea" v-if="active == 2 && !isEnd" v-model="form.approvalRemark"></el-input>
                <span v-else>{{form.approvalRemark}}</span>
            </el-form-item>
            <template v-if="!isCreate && active > 2">
                <el-form-item label="上传凭证" prop="preparedocUploadCredentialsIds">
                    <upload-multiple @result="result_1" :look="active != 3 || isEnd" :targetType="targetType" ref="uploadMultiple_1"></upload-multiple>
                </el-form-item>
                <el-form-item label="备注" prop="preparedocRemark">
                    <el-input class="form_input" type="textarea" v-if="active == 3 && !isEnd" v-model="form.preparedocRemark"></el-input>
                    <span v-else>{{form.preparedocRemark}}</span>
                </el-form-item>
            </template>
            <el-form-item label="备注" v-if="active >= 4" prop="financeAuditRemark">
                <el-input class="form_input" type="textarea" v-if="active == 4 && !isEnd" v-model="form.financeAuditRemark"></el-input>
                <span v-else>{{form.financeAuditRemark}}</span>
            </el-form-item>
        </el-form>
        <slot></slot>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="$emit('update:show', false)">取消</el-button>
            <el-button size="small" type="primary" @click="submit" v-if="isCreate">确认提交</el-button>
            <template v-if="active == 2 && !isEnd">
                <el-button size="small" type="primary" @click="approve(80)">驳回</el-button>
                <el-button size="small" type="primary" @click="approve(20)">审核通过</el-button>
            </template>
            <template v-if="active == 3 && !isEnd">
                <el-button size="small" type="primary" @click="touching(80)">驳回</el-button>
                <el-button size="small" type="primary" @click="touching(30)">已制单</el-button>
            </template>
            <template v-if="active == 4 && !isEnd">
                <el-button size="small" type="primary" @click="examine(80)">驳回</el-button>
                <el-button size="small" type="primary" @click="examine(40)">已审批</el-button>
            </template>
        </span>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { workflow, balance } from "src/api"
import { get, post, postWaitbyTaskId } from "store/api"
import uploadMultiple from 'pageComponent/uploadMultiple'
import CompanyInfo from './CompanyInfo'
export default {
    components: {
        uploadMultiple,
        CompanyInfo
    },
    props: {
        active: {
            default: 1
        },
        customCompanies: {
            type: Array,
            default() {
                return []
            }
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
                actualAmount: '',
                amount: 0, // 后端要求，默认传0
                applicationType: 1,
                approvalRemark: '',
                approveUploadCredentialsIds: [],
                businessId: '',
                businessName: '',
                channelAccount: '',
                channelType: '',
                channelName: '',
                customerCompanyId: '',
                customerCompanyName: '',
				executionId: '',
				financeAuditRemark: '',
                id: '',
                merchantId: '',
                merchantName: '',
				preparedocUploadCredentialsIds: [],
				preparedocRemark: '',
                processInsId: '',
                remark: '',
                serviceAmount: '',
                serviceCompanyId: '',
                serviceCompanyName: '',
                state: 10,
                taskId: '',
                transactionTime: '',
                transferAccountName: '',
                transferAccountNo: '',
                transferOpenBank: ''
            },
            rules: {
                customerCompanyId: [
                    { required: true, message: "请选择客户公司", trigger: "change" }
                ],
                merchantId: [
                    { required: true, message: "请选择商户", trigger: "change" }
                ],
                serviceCompanyId: [
                    { required: true, message: "请选择服务公司", trigger: "change" }
                ],
                businessId: [
                    { required: true, message: "请选择业务类型", trigger: "change" }
                ],
                channelAccount: [
                    { required: true, message: "请选择渠道账号", trigger: "change" }
                ],
                actualAmount: [
                    { required: true, message: "请填写实发账户金额", trigger: "blur" },
                    { pattern: /(^-(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))|0)$/, message: "请正确填写实发账户金额", trigger: "blur"}
                ],
                serviceAmount: [
                    { required: true, message: "请填写服务费账户金额", trigger: "blur" },
                    { pattern: /(^-(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))|0)$/, message: "请正确填写服务费账户金额", trigger: "blur"}
                ],
                transactionTime: [
                    { required: true, message: "请选择所属月份", trigger: "change" }
                ],
                remark: [
                    { required: true, message: "请填写申请备注", trigger: "blur" }
                ],
                transferAccountName: [
                    { required: true, message: "请填写账户名称", trigger: "blur" }
                ],
                transferOpenBank: [
                    { required: true, message: "请填写开户行", trigger: "blur" }
                ],
                transferAccountNo: [
                    { required: true, message: "请填写收款账号", trigger: "blur" }
				]
            },
            appList: [],
            serviceList: [],
            channlTypeList: [],
            businessList: [],
            channlList: [],
            clearList: [
                {
                    formKey: 'customerCompanyId',
                    listKey: 'companyId',
                    list: 'customCompanies',
                    nameList: [
                        {
                            formKey: 'customerCompanyName',
                            listKey: 'companyName'
                        }
                    ]
                },
                {
                    formKey: 'merchantId',
                    listKey: 'value',
                    list: 'appList',
                    nameList: [
                        {
                            formKey: 'merchantName',
                            listKey: 'text'
                        }
                    ]
                },
                {
                    formKey: 'serviceCompanyId',
                    listKey: 'value',
                    list: 'serviceList',
                    nameList: [
                        {
                            formKey: 'serviceCompanyName',
                            listKey: 'text'
                        }
                    ]
                },
                {
                    formKey: 'businessId',
                    listKey: 'value',
                    list: 'businessList',
                    nameList: [
                        {
                            formKey: 'businessName',
                            listKey: 'text'
                        }
                    ]
                },
                {
                    formKey: 'channelAccount',
                    listKey: 'balanceAccountId',
                    list: 'channlList',
                    nameList: [
                        {
                            formKey: 'channelType',
                            listKey: 'paymentThirdType'
                        },
                        {
                            formKey: 'channelName',
                            listKey: 'paymentThirdTypeName'
                        }
                    ]
                }
            ],
            targetType: 'puzzle_customer_img',
            isEnd: false,
            actualAmount: '',
            serviceAmount: '',
            serviceInfo: '',
            channelInfo: {}
        }
    },
    computed: {
        isCreate() {
            return this.active == 1 && !this.look
        }
    },
	watch: {
		active() {
			this.setRule()
        },
        actualAmount: function(val) {
            this.form.actualAmount = 0 - val
            
        },
        serviceAmount: function(val) {
            this.form.serviceAmount = 0 - val
        }
	},
    mounted() {
        this.param.businessId && get(balance.puzzlCustomerInfo, {
			id: this.param.businessId
		}).then(data => {
			for(let k in this.form) {
				if(k in data) {
					this.form[k] = data[k]
				}
			}
			this.form.processInsId = this.param.processInstanceId
            this.form.taskId = this.param.id
            this.channelInfo = data.channelInfo
            this.serviceInfo = data.companyInfo
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

			uploadList = []
			this.form.preparedocUploadCredentialsIds && this.form.preparedocUploadCredentialsIds.forEach(e => {
				uploadList.push({
					imageUrl: `/api/sysmgr-web/file/download?downloadCode=${e}`,
					downloadCode: e,
					attachmentId: ''
				})
			})
			uploadList.length && this.$refs.uploadMultiple_1.transmit({
				uploadList
			})
			this.setRule()
        })
        this.isEnd = this.param.finishedStatus == 'FINISHED' || this.look
    },
    methods: {
        ...mapActions([
            'getAppList',
            'getServiceList',
            'getBusinessList',
            'getChannlList',
            'getServiceInfo'
		]),
		setRule() {
			if(this.active == 2) {
				this.rules = {
					approvalRemark: [
						{ required: true, message: "请填写审批备注", trigger: "blur" }
					]
				}
			}
			else if(this.active == 3) {
				this.rules = {
					preparedocUploadCredentialsIds: [
						{ required: true, message: "请上传凭证", trigger: "blur" }
					]
				}
			}
			this.$nextTick(() => {
				this.$refs.form.clearValidate()	
			})
		},
        getApp() {
            this.clearAndGetName(0)
            this.getAppList({
                companyId: this.form.customerCompanyId
            }).then(data => {
                this.appList = data
            })
        },
        getService() {
            this.clearAndGetName(1)
            this.getServiceList({
                appId: this.form.merchantId
            }).then(data => {
                this.serviceList = data
            })
        },
        getBusiness() {
            this.clearAndGetName(2)
            this.getBusinessList({
                appId: this.form.merchantId,
                serviceCompanyId: this.form.serviceCompanyId
            }).then(data => {
                this.businessList = data
            })
            this.getServiceInfo({
                companyId: this.form.customerCompanyId,
                serviceCompanyId: this.form.serviceCompanyId
            }).then(data => {
                this.serviceInfo = data
            })
        },
        getChannl() {
            this.clearAndGetName(3)
            this.getChannlList({
                appId: this.form.merchantId,
                serviceCompanyId: this.form.serviceCompanyId,
                bankType: this.form.businessId
            }).then(data => {
                this.channlList = data
            })
        },
        clearAndGetName(a) { // 根据传入的index获取其他form需要的属性，并清空有关联的选项
            if(isNaN(a)) {
                a = 0
            }
            if(a < 2) {
                this.serviceInfo = ''
            }
            let curr = this[this.clearList[a].list].filter(e => e[this.clearList[a].listKey] == this.form[this.clearList[a].formKey])
            if(curr && curr.length) {
                this.clearList[a].nameList.forEach(e => {
                    this.form[e.formKey] = curr[0][e.listKey]
                })
            }
            this.clearList.forEach((e, i) => {
                if(i > a) {
                    this.form[e.formKey] = ''
                    this[e.list] = []
                    this.clearList[i].nameList.forEach(ev => {
                        this.form[ev.formKey] = ''
                    })
                }
            })
        },
        result(a) {
            this.form.approveUploadCredentialsIds = []
            a.forEach(e => {
                this.form.approveUploadCredentialsIds.push(e.downloadCode)
            })
        },
        submit() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    postWaitbyTaskId(balance.puzzlCustomerApply, this.form).then(data => {
                        this.$message({
                            type: 'success',
                            message: '创建成功！'
						})
						this.$emit('create')
                        this.$emit('update:show', false)
                    })
                }
            })
		},
		approve(a) {
			this.$refs.form.validate(valid => {
				if(valid) {
					this.form.state = a
					postWaitbyTaskId(balance.puzzlCustomerApprove, this.form).then(data => {
						this.$message({
                            type: 'success',
                            message: '操作成功！'
						})
						this.$emit('handle')
                        this.$emit('update:show', false)
					})
				}
			})
		},
		result_1(a) {
			this.form.preparedocUploadCredentialsIds = []
            a.forEach(e => {
                this.form.preparedocUploadCredentialsIds.push(e.downloadCode)
			})
			if(this.form.preparedocUploadCredentialsIds.length == 0) {
				this.form.preparedocUploadCredentialsIds = ''
			}
			else {
				this.$nextTick(() => {
					this.$refs.form.clearValidate()
				})
			}
		},
		touching(a) {
			if(this.form.preparedocUploadCredentialsIds && this.form.preparedocUploadCredentialsIds.length == 0) {
				this.form.preparedocUploadCredentialsIds = ''
			}
			this.$refs.form.validate(valid => {
				if(valid) {
					this.form.state = a
					postWaitbyTaskId(balance.puzzlCustomerPrepareDoc, this.form).then(data => {
						this.$message({
                            type: 'success',
                            message: '操作成功！'
						})
						this.$emit('handle')
                        this.$emit('update:show', false)
					})
				}
			})
		},
		examine(a) {
			this.$refs.form.validate(valid => {
				if(valid) {
					this.form.state = a
					postWaitbyTaskId(balance.puzzlCustomerFinanceAudit, this.form).then(data => {
						this.$message({
                            type: 'success',
                            message: '操作成功！'
						})
						this.$emit('handle')
                        this.$emit('update:show', false)
					})
				}
			})
		},
        close() {
            this.$emit('close')
        }
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
.title {
    font-weight: bold;
}
</style>
