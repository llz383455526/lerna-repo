<template>
    <div>
        <el-form :model="form" :rules="rules" size="small" label-width="140px" ref="form">
            <el-form-item label="申请类型" v-if="!isCreate">
                商户间余额调账（充值冲正）
            </el-form-item>
            <el-form-item label="客户公司" prop="customerCompanyId">
                <el-select class="form_input" v-if="isCreate" v-model="form.customerCompanyId" filterable @change="getApp">
                    <el-option v-for="e in customCompanies" :key="e.companyId" :value="e.companyId" :label="e.companyName"></el-option>
                </el-select>
                <span v-else>{{form.customerCompanyName}}</span>
            </el-form-item>
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
            <el-form-item label="业务类型" prop="businessId">
                <el-select class="form_input" v-if="isCreate" v-model="form.businessId" @change="getChannl">
                    <el-option v-for="e in businessList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                </el-select>
                <span v-else>{{form.businessName}}</span>
            </el-form-item>
            <el-form-item label="渠道账号" prop="channelAccount">
                <el-select class="form_input" v-if="isCreate" v-model="form.channelAccount" @change="getCurrChannl">
                    <el-option v-for="e in channlList" :key="e.balanceAccountId" :label="`${e.channelAlias}/${e.channelLoginAcctNo}/${e.channelMerCustId}/${e.payUserId}`" :value="e.balanceAccountId"></el-option>
                </el-select>
                <span v-else>{{form.channelAccount}}</span>
            </el-form-item>
            <el-form-item label="业务渠道">
                {{form.channelName}}
            </el-form-item>
            <el-form-item label="实发账户金额" prop="actualAmount">
                <el-input class="form_input" v-if="isCreate" v-model="form.actualAmount">
                    <template slot="append">元</template>
                </el-input>
                <span v-else>{{form.actualAmount}}元</span>
            </el-form-item>
            <el-form-item label="服务费账户金额" prop="serviceAmount">
                <el-input class="form_input" v-if="isCreate" v-model="form.serviceAmount">
                    <template slot="append">元</template>
                </el-input>
                <span v-else>{{form.serviceAmount}}元</span>
            </el-form-item>
            <el-form-item label="总金额">
                {{form.actualAmount - 0 + (form.serviceAmount - 0) || 0}}元
            </el-form-item>
            <div class="title">转入商户</div>
            <el-form-item label="商户名称" prop="transferMerchantId">
                <el-select class="form_input" v-if="isCreate" v-model="form.transferMerchantId" filterable @change="getTransferMerchantName">
                    <el-option v-for="e in merchantList" :key="e.merchantId" :value="e.merchantId" :label="e.merchantName"></el-option>
                </el-select>
                <span v-else>{{form.transferMerchantName}}</span>
            </el-form-item>
            <el-form-item label="业务类型">
                {{form.businessName}}
            </el-form-item>
            <el-form-item label="渠道账号">
				<span v-if="active == 1 && currChannel.channelAlias">{{`${currChannel.channelAlias}/${currChannel.channelLoginAcctNo}/${currChannel.channelMerCustId}/${currChannel.payUserId}`}}</span>
                <span v-else>{{form.channelAccount}}</span>
            </el-form-item>
            <el-form-item label="业务渠道">
                {{form.transferMerchantChannelName}}
            </el-form-item>
            <el-form-item label="实发账户">
                {{form.actualAmount || 0}}元
            </el-form-item>
            <el-form-item label="服务费账户">
                {{form.serviceAmount || 0}}元
            </el-form-item>
            <el-form-item label="总金额">
                {{form.actualAmount - 0 + (form.serviceAmount - 0) || 0}}元
            </el-form-item>
            <div class="title">申请说明</div>
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
                <el-input class="form_input" v-if="isCreate" v-model="form.remark" type="textarea"></el-input>
                <span v-else>{{form.remark}}</span>
            </el-form-item>
            <el-form-item label="上传凭证">
				<upload-multiple @result="result" :look="!isCreate || isEnd" :targetType="targetType" ref="uploadMultiple"></upload-multiple>
            </el-form-item>
            <el-form-item label="审批备注" v-if="active >= 2" prop="approvalRemark">
                <el-input class="form_input" type="textarea" v-if="active == 2 && !isEnd" v-model="form.approvalRemark"></el-input>
                <span v-else>{{form.approvalRemark}}</span>
            </el-form-item>
        </el-form>
        <slot></slot>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="$emit('update:show', false)">取消</el-button>
            <el-button size="small" type="primary" @click="submit" v-if="isCreate">确认提交</el-button>
            <template v-if="active == 2 && !isEnd">
                <el-button size="small" @click="approve(80)">驳回</el-button>
                <el-button size="small" type="primary" @click="approve(20)">审核通过</el-button>
            </template>
        </span>
    </div>
</template>
<script>
import { mapActions } from 'vuex'
import { balance } from "src/api"
import { get, post, postWaitbyTaskId } from "store/api"
import uploadMultiple from 'pageComponent/uploadMultiple'
export default {
    components: {
        uploadMultiple
    },
    props: {
        active: {
            default: 1
        },
        customCompanies: {
            type: Array,
            default: []
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
                amount: 0,
                applicationType: 3,
                businessId: '',
                businessName: '',
                channelAccount: '',
                channelName: '',
                channelType: '',
                customerCompanyId: '',
                customerCompanyName: '',
                executionId: '',
                id: '',
                merchantId: '',
                merchantName: '',
                processInsId: '',
                remark: '',
                serviceAmount: '',
                serviceCompanyId: '',
                serviceCompanyName: '',
                state: 10,
                taskId: '',
                transactionTime: '',
                transferMerchantActualAmount: '',
                transferMerchantAmount: '',
                transferMerchantChannelName: '',
                transferMerchantChannelAccount: '',
                transferMerchantChannelType: '',
                transferMerchantId: '',
                transferMerchantName: '',
                transferMerchantServiceAmount: '',
                uploadCredentialsIds: [],
                approvalRemark: ''
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
                    { pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "请正确填写实发账户金额", trigger: "blur"}
                ],
                serviceAmount: [
                    { required: true, message: "请填写服务费账户金额", trigger: "blur" },
                    { pattern: /^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: "请正确填写服务费账户金额", trigger: "blur"}
                ],
                transactionTime: [
                    { required: true, message: "请选择所属月份", trigger: "change" }
                ],
                remark: [
                    { required: true, message: "请填写申请备注", trigger: "blur" }
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
			currChannel: {},
            merchantList: [],
            targetType: 'puzzle_merchant_img',
            isEnd: false
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
		}
	},
	mounted() {
		this.param.businessId && get(balance.puzzlMerchantInfo, {
			id: this.param.businessId
		}).then(data => {
			for(let k in this.form) {
				if(data[k]) {
					this.form[k] = data[k]
				}
			}
			this.form.processInsId = this.param.processInstanceId
			this.form.taskId = this.param.id
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
            this.setRule()
        })
        this.isEnd = this.param.finishedStatus == 'FINISHED' || this.look
	},
    methods: {
        ...mapActions([
            'getAppList',
            'getServiceList',
            'getBusinessList',
            'getChannlList'
        ]),
        setRule() {
			if(this.active == 2) {
				this.rules = {
					approvalRemark: [
						{ required: true, message: "请填写审批备注", trigger: "blur" }
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
		getCurrChannl() {
			this.clearAndGetName(4)
			this.currChannel = this.channlList.filter(e => e.balanceAccountId == this.form.channelAccount)[0]
			get(balance.puzzlMerchantBaseInfo, {
				serviceCompanyId: this.form.serviceCompanyId,
				customerCompanyId: this.form.customerCompanyId,
                payUserId: this.currChannel.payUserId,
                businessType: this.currChannel.bankType
			}).then(data => {
				this.merchantList = data
			})
		},
        clearAndGetName(a) { // 根据传入的index获取其他form需要的属性，并清空有关联的选项
            if(isNaN(a)) {
                a = 0
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
		getTransferMerchantName() {
            let curr = this.merchantList.filter(e => e.merchantId == this.form.transferMerchantId)
            if(curr && curr.length) {
                this.form.transferMerchantName = curr[0].merchantName
			    this.form.transferMerchantChannelName = curr[0].channelNmae
                this.form.transferMerchantChannelType = curr[0].channelType
            }
		},
        result(a) {
            this.form.uploadCredentialsIds = []
            a.forEach(e => {
                this.form.uploadCredentialsIds.push(e.downloadCode)
            })
		},
		titleCase(str) {  
    		return str.toLowerCase().replace(/( |^)[a-z]/g, (L) => L.toUpperCase());  
		},
		submit() {
			this.form.transferMerchantActualAmount = this.form.actualAmount
			this.form.transferMerchantAmount = this.form.amount
			this.form.transferMerchantChannelAccount = this.form.channelAccount
			this.form.transferMerchantServiceAmount = this.form.serviceAmount
			this.$refs.form.validate(valid => {
                if(valid) {
                    postWaitbyTaskId(balance.puzzlMercahntApply, this.form).then(data => {
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
					postWaitbyTaskId(balance.puzzlMerchantApprove, this.form).then(data => {
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
    margin-top: 20px;
    margin-bottom: 15px;
}
</style>
