<template>
    <div>
        <el-dialog :title="`创建${isService ? '服务费' : ''}充值申请`" @open="closeEditDialog" :before-close="closeEditDialog"  :visible.sync="dialogCreateVisible" width="900px">
            <recharge-step v-if="showStep" :stepList="stepList"></recharge-step>
            <!-- <service-step v-if="showStep && isService" ></service-step> -->
            <el-form :model="dialogCreateForm" :rules="dialogCreateFormRules" ref="dialogCreateForm">
                <div class="input-container">
                    <div class="label">客户公司：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="companyId">
                            <el-select filterable v-model="dialogCreateForm.companyId" no-data-text="请选择" @change="clearApp">
                                <el-option style="width: 100%;" v-for="(item, index) in customCompanies" :label="item.companyName" :value="item.companyId" :key="item.companyId"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">商户名称：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="appId">
                            <el-select filterable v-model="dialogCreateForm.appId" :no-data-text="dialogCreateForm.companyId ? '无数据' : '请先选择客户公司'" @change="getService">
                                <el-option v-for="(item, index) in productName" :label="item.text" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">商户类型：</div>
                    <div class="input">
                        <el-form-item>
                            {{extInfo == '' ? '' : extInfo == 1 ? 'API商户' : 'Saas商户'}}
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">服务商名称：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="serviceCompanyId">
                            <el-select filterable v-model="dialogCreateForm.serviceCompanyId" :no-data-text="dialogCreateForm.appId ? '无数据' : '请先选择商户'" @change="getChannlType" k='getChannlType'>
                                <el-option v-for="(item, index) in serviceName" :label="item.text" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container" v-if="!isService">
                    <div class="label">支付方式：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="channelBusinessType">
                            <el-select filterable v-model="dialogCreateForm.channelBusinessType" :no-data-text="dialogCreateForm.serviceCompanyId ? '无数据' : '请先选择商户'" @change="getRechargeMsg">
                                <el-option v-for="(item, index) in channelTypes" :label="item.text" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container" v-if="msg && !rechargeMsg && isRecharge">
                    <div class="label"></div>
                    <div class="input">
                        <div>开户行：{{msg.depositBank}}</div>
                        <div>账户名称：{{msg.accountName}}</div>
                        <div>账号：{{msg.accountNo}}</div>
                        <div>(请通过线下支付方式支付费用到该收款账号)</div>
                    </div>
                </div>
                <template v-if="rechargeMsg && (dialogCreateForm.channelBusinessType == 'bank' || dialogCreateForm.channelBusinessType == 'alipay')">
                    <div class="input-container">
                        <div class="label"></div>
                        <div class="input">
                            <div>开户行：{{rechargeMsg.depositBankName}}</div>
                            <div>账户名称：{{rechargeMsg.mainAcctName}}</div>
                            <div>账号：{{rechargeMsg.payUserNo}}</div>
                            <div>(请通过线下支付方式支付费用到该收款账号)</div>
                        </div>
                    </div>
                </template>
                <div class="input-container">
                    <div class="label">{{isService ? '服务费金额' : '实发金额'}}：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="amount">
                            <el-input :maxlength=15 v-model="dialogCreateForm.amount" placeholder=""></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container" v-if="!isService">
                    <div class="label">服务费金额：<span>*</span></div>
                    <div class="input">
                        <el-form-item>
                            <el-input placeholder="实发金额*服务费收费比例" disabled :value="serviceFee.toFixed(2)"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">打款金额：<span>*</span></div>
                    <div class="input">
                        <el-form-item>
                            <el-input disabled :value="(dialogCreateForm.amount - 0 + (isService ? 0 : serviceFee)).toFixed(2)"></el-input>
                        </el-form-item>
                    </div>
                    <div v-if="prePayContent && !isService">
                        合计充值金额 = 
                        <template v-if="prePayContent.secondType == 'real'">
                            实发金额 + 实发金额 * {{prePayContent.serviceFeeRate}}%
                        </template>
                        <template v-else>
                            实发金额 / (1 - {{prePayContent.serviceFeeRate}}%)
                        </template>
                        ;保留2位小数，四舍五入
                    </div>
                </div>
                <template v-if="!rechargeMsg">
                    <div class="input-container">
                        <div class="label">转账凭证：<span>*</span></div>
                        <div class="input auto">
                            <el-form-item prop="attachmentIds" ref="attachmentIds">
                                <upload-multiple @result="result" ref="uploadMultiple"></upload-multiple>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="input-container" v-if="isService">
                        <div class="label">服务费所属月份：<span>*</span></div>
                        <div class="input">
                            <el-form-item prop="yearMonth">
                                <el-date-picker
                                    v-model="dialogCreateForm.yearMonth"
                                    type="month"
                                    placeholder="选择月"
                                    value-format="yyyyMM">
                                </el-date-picker>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="input-container">
                        <div class="label">备注：<span>*</span></div>
                        <div class="input">
                            <el-form-item prop="purpose">
                                <el-input :maxlength=50 v-model="dialogCreateForm.purpose" placeholder=""></el-input>
                            </el-form-item>
                        </div>
                    </div>
                    <div class="input-container">
                        <div class="label"></div>
                        <div class="input">
                            <el-checkbox checked @change="setSmsOpen">
                                <span class="f14">接收充值成功短信</span>
                            </el-checkbox>
                        </div>
                    </div>
                </template>
                <template v-if="rechargeMsg">
                    <div class="tip">温馨提示</div>
                    <hr>
                    <div class="input">
                        请线下汇款，由于银行对公转账的相关限制，建议在工作日周一 至 周五 09:30-15:30之间进行充值汇款，超过该时间则顺延至第二个工作日办理。预计2个小时内到账，如需按时发放请提前做好相关工作准备。
                    </div>
                </template>
                <template v-if="sub">
                    <hr>
                    <div class="input-container mb0">
                        <div class="label">业务模式：</div>
                        <div class="input">
                            业务转包
                        </div>
                    </div>
                    <div class="input-container mb0">
                        <div class="label">转包服务商：</div>
                        <div class="input">
                            {{sub.companyName}}
                        </div>
                    </div>
                    <div class="input-container mb0">
                        <div class="label"></div>
                        <div class="input">
                            <div>开户行：{{sub.depositBank}}</div>
                            <div>账户名称：{{sub.accountName}}</div>
                            <div>账号：{{sub.accountNo}}</div>
                        </div>
                    </div>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <template v-if="rechargeMsg">
                    <el-button size="small" type="primary" @click="dialogCreateVisible = false;$refs['dialogCreateForm'].resetFields()">知道了</el-button>
                </template>
                <template v-else>
                    <el-button size="small" @click="dialogCreateVisible = false;$refs['dialogCreateForm'].resetFields()">取 消</el-button>
                    <el-button size="small" type="primary" @click="submitDialogCreateForm()">确 定</el-button>
                </template>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { get, post, importPost } from "../store/api";
import { invoiceApi, workflow, sysmgr } from "src/api"
import {showLoading, hideLoading} from '../plugin/utils-loading'
import { checkMoney } from "../plugin/utils-element-validator";
import rechargeStep from './rechargeStep'
import serviceStep from './serviceStep'
import uploadMultiple from './uploadMultiple'
export default {
    props: {
        submitCb: {
            type: Function
        },
        showStep: {
            type: Boolean,
            default: false
        }
    },
    components: {
        rechargeStep,
        serviceStep,
        uploadMultiple
    },
    data() {
        return {
            msg: '',
            sub: '',
            rechargeMsg: '',
            isRecharge: false,
            prePayContent: '',
            uploadList: [
                {
                    imageUrl: '',
                    attachmentId: ''
                }
            ],
            dialogCreateForm: {
                companyId: "",
                appId: "",
                channelBusinessType: "",
                amount: "",
                purpose: "",
                serviceCompanyId: '',
                attachmentIds: '',
                smsOpen: true,
                subServiceCompanyId: '',
                subUploadId: '',
                yearMonth: '',
                uploadListLength: ''
            },
            dialogCreateFormRules: {
                companyId: [
                    { required: true,message: "请选择客户公司", trigger: "change" }
                ],
                appId: [
                    { required: true, message: "请选择商户", trigger: "change" }
                ],
                channelBusinessType: [
                    { required: true, message: "请选择业务类型", trigger: "change" }
                ],
                serviceCompanyId: [
                    { required: true, message: "请选择充值服务商", trigger: "change" }
                ],
                purpose: [
                    { required: true, message: "请填写充值用途", trigger: "blur" }
                ],
                amount: [
                    { required: true, message: "请选择充值金额", trigger: "blur" },
                    { validator: checkMoney, trigger: "blur" }
                ],
                yearMonth: [
                    { required: true, message: "请选择月份", trigger: "change" }
                ],
                attachmentIds: [
                    { required: true, message: "请上传凭证", trigger: "change" },
                ]
            },
            serviceFee: 0,
            calcServiceFee: false,
            serviceName: [],
            channelTypes: [],
            orderInfo: '',
            isService: false,
            dialogCreateVisible: false,
            stepList: [],
            extInfo: ''
        }
    },
    watch: {
        "dialogCreateForm.companyId": function() {
            if (this.dialogCreateForm.companyId) {
                this.$store.dispatch("getAppList", {
                companyId: this.dialogCreateForm.companyId
                });
            }
        },
        productName() {
            if(this.productName.length == 1 && this.dialogCreateVisible) {
                this.dialogCreateForm.appId = this.productName[0].value
                this.getService()
            }
        },
        'dialogCreateForm.amount': function(a) {
            clearTimeout(this.calc)
            this.calc = setTimeout(() => {
                !this.isService && this.getServiceFee()
            }, 500)
        }
    },
    computed: {
        ...mapGetters({
            customCompanies: "customCompanies",
            productName: "productName",
        })
    },
    mounted() {
        this.$store.dispatch("getCustomCompanies");
    },
    methods: {
        closeEditDialog(next) {
            this.msg = ''
            this.sub = ''
            this.extInfo = ''
            this.rechargeMsg = ''
            this.isRecharge = false
            this.prePayContent = ''
            this.uploadList = [
                {
                    imageUrl: '',
                    attachmentId: ''
                }
            ]
            try {
                console.log(this.$refs["dialogCreateForm"])
                if(this.$refs["dialogCreateForm"]) {
                    this.$refs["dialogCreateForm"].resetFields();
                }
            }
            catch(err) {
                console.log(err)
            }
            this.$nextTick(() => {
                this.$refs.uploadMultiple.transmit({
                    uploadList: this.uploadList
                })
            })
            next && next();
        },
        clearApp() {
            this.dialogCreateForm.appId = ''
            this.extInfo = ''
            this.dialogCreateForm.channelBusinessType = ''
            this.dialogCreateForm.serviceCompanyId = ''
            this.msg = ''
            this.sub = ''
        },
        getService() {
            this.extInfo = this.productName.filter(e => e.value == this.dialogCreateForm.appId)[0].extInfo
            get('/api/sysmgr-web/commom/app-service-company-list', {
                appId: this.dialogCreateForm.appId
            }).then(data => {
                this.dialogCreateForm.channelBusinessType = ''
                this.dialogCreateForm.serviceCompanyId = ''
                this.msg = ''
                this.sub = ''
                this.serviceName = data
                if(this.serviceName.length == 1) {
                    this.dialogCreateForm.serviceCompanyId = this.serviceName[0].value
                    this.getChannlType()
                }
            })
        },
        getServiceFee() {
            var digit = this.dialogCreateForm.amount.toString().split('.')[1]
            this.serviceFee = 0
            if(this.calcServiceFee && this.dialogCreateForm.companyId && this.dialogCreateForm.serviceCompanyId && !isNaN(this.dialogCreateForm.amount) && (!digit || (digit && digit.length <= 2))) {
                get('/api/contract-web/contract/calc-serviceFee', {
                    amount: this.dialogCreateForm.amount,
                    companyId: this.dialogCreateForm.companyId,
                    serviceCompanyId: this.dialogCreateForm.serviceCompanyId,
                    calcType: 'prePay'
                }).then(data => {
                    this.serviceFee = data
                })
                if(this.sub) {
                    get('/api/balance-web/recharge-order/payuser', {
                        appId: this.dialogCreateForm.appId,
                        companyId: this.dialogCreateForm.companyId,
                        serviceCompanyId: this.dialogCreateForm.serviceCompanyId,
                        channelType: this.dialogCreateForm.channelBusinessType
                    }).then(data => {
                        this.payUserMsg = data
                    })
                }
            }
        },
        getChannlType() {
            this.dialogCreateForm.channelBusinessType = ''
            get('/api/balance-web/recharge-order/pre-recharge', {
                appId: this.dialogCreateForm.appId,
                companyId: this.dialogCreateForm.companyId,
                serviceCompanyId: this.dialogCreateForm.serviceCompanyId
            }).then(data => {
                this.msg = data.serviceCompanyInfo
                this.sub = data.subCompanyInfo
                this.sub && (this.dialogCreateForm.subServiceCompanyId = this.sub.companyId)
                this.channelTypes = data.channelTypes
                this.calcServiceFee = data.calcServiceFee
                this.prePayContent = JSON.parse(data.prePayContent)
                this.isRecharge = false
                if(!this.isService && this.channelTypes.length == 1) {
                    this.dialogCreateForm.channelBusinessType = this.channelTypes[0].value
                    this.getRechargeMsg()
                }
                if(!this.isService) {
                    this.getServiceFee()
                }
            })
        },
        getRechargeMsg() {
            get('/api/balance-web/recharge-order/query-direct-recharge-user-account', {
                appId: this.dialogCreateForm.appId,
                serviceCompanyId: this.dialogCreateForm.serviceCompanyId,
                channelType: this.dialogCreateForm.channelBusinessType
            }).then(data => {
                this.rechargeMsg = data
                !this.rechargeMsg && !this.isService && this.getServiceFee()
                this.isRecharge = true
            })
        },
        result(a) {
            this.uploadList = a
            if(a && a.length) {
                this.dialogCreateForm.attachmentIds = []
                this.$refs.attachmentIds.clearValidate()
            }
            else {
                this.dialogCreateForm.attachmentIds = ''
            }
        },
        setSmsOpen(a) {
            this.dialogCreateForm.smsOpen = a
        },
        submitDialogCreateForm() {
            this.dialogCreateForm.attachmentIds = []
            this.uploadList.forEach(e => {
                e.attachmentId && this.dialogCreateForm.attachmentIds.push(e.attachmentId)
            })
            this.$refs["dialogCreateForm"].validate(valid => {
                if (valid) {
                    post(`/api/balance-web/recharge-order/${this.isService ? 'serviceFeeConfirm' : 'comfirm'}`, this.dialogCreateForm).then(data => {
                        this.orderInfo = data;
                        this.calcServiceFee = false
                        this.dialogCreateVisible = false;
                        this.isService = false
                        if(this.submitCb && typeof this.submitCb == 'function') {
                            this.$message({
                                type: 'success',
                                message: '提交成功！'
                            })
                            this.submitCb()
                        }
                    });
                }
            });
        },
        showRecharge(a, b) {
            this.dialogCreateVisible = a
            this.isService = b
            this.getStep()
        },
        getStep() {
            get(workflow.getProcessAllProgressByTypeKey, {
                processTypeKey: this.isService ? 'service-fee-recharge-flow' : 'manual-recharge-flow'
            }).then(data => {
                this.stepList = data.default
            })
        }
    }
}
</script>
<style scoped>
.input-container .label {
    float: left;
}
.auto {
    width: auto;
}
</style>
