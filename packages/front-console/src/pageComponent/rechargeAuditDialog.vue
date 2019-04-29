<template>
    <div>
        <!-- detail.state == 20 ? '待制单' : detail.state == 21 ? '待审核' : '查看' -->
        <el-dialog title=""  :visible.sync="show" @close="needQuery && query()" width="960px">
            <div class="tip" v-if="showStep">
                <span class="mr20">充值单号：{{current.processInstanceId}}</span>
                <span class="mr20">创建时间：{{current.createTime}}</span>
                <span class="mr20">创建人：{{stepList.length ? stepList[0].userName : ''}}</span>
            </div>
            <recharge-step class="m20" v-if="showStep" :stepList="stepList" :active="active" :key="stepList.length"></recharge-step>
            <div class="title green_0">状态：{{detail.stateName}}</div>
            <div class="title red_0" v-if="(detail.isAutoRecharge && detail.state == 21) || detail.submittingFlat == 1">充值异常挂起原因：
                <template v-if="detail.isAutoRecharge && detail.state == 21">
                    <span>（风险：打款方“{{detail.fromAccountName}}”跟客户企业名称不一致）</span>
                </template>
                <template v-if="detail.submittingFlat == 1">
                    <span>（流转中）</span>
                </template>
            </div>
            <div class="title">客户充值凭证</div>
            <div class="det">企业名称：{{detail.companyName}}</div>
            <div class="det">商户名称：{{detail.appName}}</div>
            <div class="det">收款总金额：{{detail.amount + detail.serviceFee | formatMoney}}</div>
            <template v-if="detail.rechargeType != 2">
                <div class="det" v-if="detail.serviceFee">支付渠道充值金额：{{detail.amount | formatMoney}}</div>
                <div class="det" v-if="detail.serviceFee">服务费金额：{{detail.serviceFee | formatMoney}}</div>
                <div class="det pad">
                    *收款总金额=支付渠道充值金额+服务费金额
                </div>
            </template>
            <div class="det" v-if="detail.customDownloadCodes || (detail.supportCertificateDownload && detail.state == 30 && checkRight(permissions, 'balance-web:/recharge-order/download-recharge-certificate'))">
                <div style="float: left;">转账凭证：</div>
                <div class="avatar mr20" v-if="!detail.supportCertificateDownload" v-for="(e, i) in detail.customDownloadCodes" @click="showAttr = true;attrIndex = i" :style="{'background-image': `url(/api/sysmgr-web/file/download?downloadCode=${e})`}"></div>
                <el-button v-if="detail.supportCertificateDownload" type="primary" size="small" @click="download">
                    下载充值凭证
                </el-button>
            </div>
            <div class="det">备注：{{detail.purpose}}</div>
            <div class="title">服务商信息</div>
            <div class="det">名称：{{detail.serviceCompanyName}}<div class="toggle" @click="showDetail = !showDetail">{{ showDetail ? '收起' : '展开'}}</div></div>
            <template v-if="showDetail">
                <!-- <div class="det">所属银行：{{detail.depositBank}}</div> -->
                <div class="det">开户行：{{detail.depositBank}}</div>
                <div class="det">账户名：{{detail.accountName}} </div>
            </template>
            <div class="det">账号：
              <template v-if="!isToggle">
                {{detail.accountNo}}
              </template>
              <el-select size="small" v-else v-model="toggleAccount" @change="cutAccount" filterable>
                <el-option v-for="e in acccountList" :value="e.balanceAccountId" :key="e.balanceAccountId" :label="`${e.payUserName}/${e.payUserNo}`"></el-option>
              </el-select>
              <el-button class="ml20" v-if="!disable && detail.isAutoRecharge && detail.payUser.thirdPaymentType == 'pingan' && detail.state == 21" type="primary" size="mini" @click="isToggle = true">切换入账账号</el-button>
            </div>
            <div class="det" v-if="detail.payUser && detail.rechargeType != 2">业务渠道：{{detail.payUser.thirdPaymentTypeName}}</div>
            <template v-if="!detail.subServiceCompanyId && detail.rechargeType != 2">
                <div class="det">选择渠道帐号：
                    <el-select size="small" v-model="balanceAccountId" @change="getSuggest" style="width: 500px" :disabled="detail.state != 20 ? true : false">
                        <el-option v-for="e in channlList" :key="e.balanceAccountId" :label="`${e.channelAlias}/${e.channelLoginAcctNo}/${e.channelMerCustId}`" :value="e.balanceAccountId"></el-option>
                    </el-select>
                </div>
                <div class="det" v-if="suggest">帐号今日可充建议：{{suggest.allowAvailBalance | formatMoney}}元&#x3000;帐号当前余额：{{suggest.currentAvailBalance | formatMoney}}元&#x3000;
                    日发放限额：{{suggest.limitAvailBalance | formatMoney}}元&#x3000;当日已发：{{suggest.outAvailBalance | formatMoney}}元
                </div>
            </template>
            <!-- <template v-if="!detail.subServiceCompanyId && (detail.state == 21 || (detail.state == 30 && detail.financeDownloadCode)) && !detail.isAutoRecharge">
                <div class="title">渠道金额充值</div>
                <div class="det">
                    <div style="float: left;">上传充值凭证：</div>
                    <el-upload
                        v-if="!imageUrl"
                        class="upload"
                        :file-list="fileList"
                        ref="upload"
                        :show-file-list="false"
                        :action="`/api/sysmgr-web/file/upload`"
                        :auto-upload="false"
                        :on-change="getImg"
                        :multiple="false"
                        name="file"
                        accept=".jpg, .png">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <img @click="showVoucher = true" style="width: 300px" v-else :src="`/api/sysmgr-web/file/download?downloadCode=${imageUrl}`" alt="">
                    &nbsp;<el-button type="text" class="clear" @click="clearImg">重新上传充值凭证</el-button>
                </div>
            </template> -->
            <div class="det">{{detail.state == 40 ? '审核不通过原因' : '备注'}} ：
                <el-input size="small" v-model="memo" style="width: 300px" v-if="detail.state == 21 || detail.state == 20"></el-input>
                <span v-else>{{detail.memo}}</span>
            </div>
            <template v-if="detail.subServiceCompanyId">
                <hr>
                <div class="det">
                    业务模式：业务转包
                </div>
                <div class="title">转包服务商：
                    <el-select size="small" filterable v-model="detail.subServiceCompanyId" @change="getSubMsg" :disabled="detail.state != 20 ? true : false">
                        <el-option v-for="(item, index) in subCompany" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </div>
                <div class="det">开户行：{{subMsg.depositBank}}</div>
                <div class="det">账户名称：{{subMsg.accountNo}}</div>
                <div class="det">账号：{{subMsg.accountName}}</div>
                <template v-if="detail.state == 21 || detail.state == 30">
                    <div class="title">渠道金额充值</div>
                    <div class="det">
                        <div style="float: left;">上传充值凭证：</div>
                        <el-upload
                            v-if="!imageUrl"
                            class="upload"
                            :file-list="fileList"
                            ref="upload"
                            :show-file-list="false"
                            :action="`/api/sysmgr-web/file/upload`"
                            :auto-upload="false"
                            :on-change="getImg"
                            :multiple="false"
                            name="file"
                            accept=".jpg, .png">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <img @click="showVoucher = true" style="width: 300px" v-else :src="`/api/sysmgr-web/file/download?downloadCode=${imageUrl}`" alt="">
                        &nbsp;<el-button type="text" class="clear" @click="clearImg">重新上传充值凭证</el-button>
                    </div>
                    <div class="title">充值凭证</div>
                    <div class="det">
                        <div style="float: left;">上传充值凭证：</div>
                        <el-upload
                            v-if="!detail.subDownloadCode"
                            ref="upload"
                            class="upload"
                            :show-file-list="false"
                            :action="`/api/sysmgr-web/file/upload`"
                            :auto-upload="false"
                            :on-change="getUploadId"
                            :multiple="false"
                            name="file"
                            accept=".jpg, .png">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <!-- <img @click="showSub = true" style="width: 300px" v-else :src="`/api/sysmgr-web/file/download?downloadCode=${detail.subDownloadCode}`" alt=""> -->
                        &nbsp;<el-button type="text" class="clear" @click="clearUploadId">重新上传充值凭证</el-button>
                    </div>
                </template>
                <div class="det">选择渠道帐号：
                    <el-select size="small" v-model="balanceAccountId" @change="getSuggest" style="width: 500px" :disabled="detail.state != 20 ? true : false">
                        <el-option v-for="e in channlList" :key="e.balanceAccountId" :label="`${e.channelAlias}/${e.channelLoginAcctNo}/${e.channelMerCustId}`" :value="e.balanceAccountId"></el-option>
                    </el-select>
                </div>
                <div class="det" v-if="suggest">帐号今日可充建议：{{suggest.allowAvailBalance | formatMoney}}元&#x3000;帐号当前余额：{{suggest.currentAvailBalance | formatMoney}}元&#x3000;
                    日发放限额：{{suggest.limitAvailBalance | formatMoney}}元&#x3000;当日已发：{{suggest.outAvailBalance | formatMoney}}元
                </div>
            </template>
            <template v-if="realStep && realStep.length">
                <div class="title">操作记录</div>
                <div class="det" v-for="(e, i) in realStep" :key="e.activityId">
                    {{i + 1}}.{{e.userName ? e.userName : '系统'}}  于{{e.processDate}} {{e.operate || e.activityName}}
                    <template v-if="e.comment">
                        ，备注： {{e.comment}}
                    </template>
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="show = false;">取消</el-button>
                <template v-if="detail.state == 20 && checkRight(permissions, 'balance-web:/recharge-order/failOnRechargeDocumentMake')">
                    <el-button size="small" type="primary" @click="notArrive" v-if="!disable">未到账</el-button>
                </template>
                <template v-if="detail.state == 21 && checkRight(permissions, `balance-web:/recharge-order/${detail.isAutoRecharge == 1 ? 'risk-approve' : 'approve'}`)">
                    <el-button size="small" type="primary" @click="showMemo = true" v-if="!disable">未到账</el-button>
                </template>
                <template v-if="detail.state == 20 && checkRight(permissions, 'balance-web:/recharge-order/rechargeDocumentMake')">
                    <el-button size="small" type="primary" @click="touch" v-if="!disable">我已制单</el-button>
                </template>
                <template v-if="detail.state == 21 && checkRight(permissions, `balance-web:/recharge-order/${detail.isAutoRecharge == 1 ? 'risk-approve' : 'approve'}`)">
                    <el-button size="small" type="primary" @click="ensure(30)" v-if="!disable">确认到账</el-button>
                </template>
                <template v-if="detail.state == 30 && checkRight(permissions, 'balance-web:/recharge-order/editRechargeCertificate')">
                    <el-button size="small" type="primary" @click="save" v-if="!disable">保存</el-button>
                </template>
            </div>
        </el-dialog>
        <div class="v-modal" v-if="detail && detail.customDownloadCodes" v-show="showAttr" @click="showAttr = false" :style="{ backgroundImage: `url(/api/sysmgr-web/file/download?downloadCode=${detail.customDownloadCodes[attrIndex]}`}"></div>
        <div class="v-modal" v-if="detail && detail.financeDownloadCode" v-show="showVoucher" @click="showVoucher = false" :style="{ backgroundImage: `url(/api/sysmgr-web/file/download?downloadCode=${detail.financeDownloadCode}`}"></div>
        <div class="v-modal" v-if="detail && detail.subDownloadCode" v-show="showSub" @click="showSub = false" :style="{ backgroundImage: `url(/api/sysmgr-web/file/download?downloadCode=${detail.subDownloadCode}`}"></div>
        <el-dialog title="进度" :visible.sync="showPro" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
            <div class="pro_box">
                <div :style="{width: `${proNum}%`}"></div>
            </div>
            <div class="pro_num">
                {{proNum}}%
            </div>
        </el-dialog>
        <el-dialog title="审核不通过" :visible.sync="showMemo" @open="setMomo" width="500px">
            <el-form :model="memoForm" :rules="memoRules" size="small" ref="memoForm">
                <el-form-item label="不通过原因" prop="memo">
                    <el-input class="w360" type="textarea" v-model="memoForm.memo"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="showMemo = false">取消</el-button>
                <el-button type="primary" @click="turnDown">确认驳回</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { mapGetters } from "vuex";
import { get, post, importPost, postWaitbyTaskId } from "../store/api";
import { invoiceApi, workflow, sysmgr } from "src/api"
import { showNotify } from "../plugin/utils-notify";
import rechargeStep from './rechargeStep'
export default {
    props: {
        auditCb: {
            type: Function
        },
        disable: {
            type: Boolean,
            default: false
        },
        showStep: {
            type: Boolean,
            default: false
        }
    },
    components: {
        rechargeStep
    },
    data() {
        return {
            show: false,
            detail: {},
            channlList: [],
            payUserId: '',
            suggest: [],
            subCompany: [],
            subMsg: [],
            acccountList: [],
            showAttr: false,
            attrIndex: 0,
            key: '',
            needQuery: false,
            showPro: false,
            frame: '',
            delay: '',
            proNum: 0,
            showDetail: true,
            isToggle: false,
            toggleAccount: '',
            balanceAccountId: '',
            imageUrl: '',
            fileList: [],
            subUploadId: '',
            memo: '',
            uploadUrl: '',
            showVoucher: false,
            showSub: false,
            current: {},
            stepList: [],
            active: 1,
            showMemo: false,
            memoForm: {
                memo: ''
            },
            memoRules: {
                memo: [
                    { required: true, message: '请输入备注', trigger: 'blur' }
                ]
            },
            realStep: []
        }
    },
    computed: {
        ...mapGetters({
            permissions: 'permissions'
        })
    },
    methods: {
        getDetail(a) {
            this.current = a
            get('/api/balance-web/recharge-order/query-detail', {
                id: a.businessId ? a.businessId : a.id
            }).then(data => {
                this.detail = data
                this.show = true
                this.showDetail = true
                this.attachmentId = ''
                this.imageUrl = this.detail.financeDownloadCode
                this.memo = this.detail.memo
                this.uploadUrl = ''
                this.subUploadId = ''
                this.isToggle = ''
                this.toggleAccount = ''
                this.needQuery = ''

                this.getChannlList()
                this.getSubCompany()
                this.getSubMsg()
                if(this.detail.isAutoRecharge && this.detail.payUser.thirdPaymentType == 'pingan' && this.detail.state == 21) {
                    this.getSwitch()
                }
            })
            a.processInstanceId && Promise.all([
                get(workflow.getProcessAllProgress, { processInstanceId: a.processInstanceId }),
                get(workflow.getProcessCurrentProgress, { processInstanceId: a.processInstanceId })
            ]).then(data => {
                console.log(data)
                this.stepList = []
                data[0].default.forEach((e, i) => {
                    this.stepList.push(Object.assign(data[1][i] ? data[1][i] : {}, e))
                })
                this.active = data[1].length + 1
                this.realStep = JSON.parse(JSON.stringify(data[1]))
                // data[1] && (this.currentStpe = data[1].pop())
            })
        },
        getChannlList() {
            get('/api/balance-web/balance-account/query-balance-account-channel-list', {
                serviceCompanyId: this.detail.serviceCompanyId,
                subServiceCompanyId: this.detail.subServiceCompanyId ? this.detail.subServiceCompanyId : '',
                appId: this.detail.appId,
                bankType: this.detail.channelBusinessType
            }).then(data => {
                this.channlList = data
                this.balanceAccountId = ''
                this.channlList.forEach(e => {
                    if(e.payUserId == this.detail.payUser.payUserId) {
                        this.balanceAccountId = e.balanceAccountId
                        this.getSuggest()
                    }
                })
            })
        },
        getSubCompany() {
            get('/api/sysmgr-web/commom/subcontract-service-companies', {
                appId: this.detail.appId,
                serviceCompanyId: this.detail.serviceCompanyId
            }).then(data => {
                this.subCompany = data
            })
        },
        getSubMsg() {
            if(!this.detail.subServiceCompanyId) {
                return
            }
            get('/api/balance-web/recharge-order/company-bank', {
                companyId: this.detail.subServiceCompanyId
            }).then(data => {
                this.subMsg = data
            })
            this.getChannlList()
        },
        getSwitch() {
            get('/api/balance-web/recharge-order/query-switch-balance-account', {
                serviceCompanyId: this.detail.serviceCompanyId,
                paymentThirdType: this.detail.payUser.thirdPaymentType
            }).then(data => {
                this.acccountList = data
            })
        },
        getSuggest() {
            this.channlList.forEach(e => {
                if(e.balanceAccountId == this.balanceAccountId) {
                    this.payUserId = e.payUserId
                    get('/api/balance-web/balance-account/get-avail-balance-info', {
                        balanceAccountId: e.balanceAccountId,
                        payUserId: e.payUserId,
                        paymentThirdType: e.paymentThirdType
                    }).then(data => {
                        this.suggest = data
                    })
                }
            })
        },
        download() {
            get('/api/balance-web/recharge-order/download-recharge-certificate', {
                rechargeOrderId: this.detail.id
            }).then(data => {
                this.key = data
                this.progress()
                this.showPro = true
            })
        },
        progress() {
            this.frame = requestAnimationFrame(this.progress)
            var currTime = new Date().getTime()
            if(!this.delay || currTime- this.delay > 1000) {
                this.delay = currTime
                post(`/api/console-dlv/file/download-progress?key=${this.key}`, {}, true).then(data => {
                if(data) {
                    if(data.state == 30) {
                        this.$message({
                            type: 'success',
                            message: '下载成功'
                        })
                        this.showPro = false
                        cancelAnimationFrame(this.frame)
                        window.open(`/api/sysmgr-web/file/download?downloadCode=${data.downloadCode}`)
                    }
                    if(data.state == 40) {
                        this.$message({
                            type: 'error',
                            message: '下载失败'
                        })
                        this.showPro = false
                        cancelAnimationFrame(this.frame)
                    }
                    this.proNum = data.progress
                }
                }).catch(err =>{
                    this.showPro = false
                    cancelAnimationFrame(this.frame)
                })
            }
        },
        cutAccount() {
            post('/api/balance-web/recharge-order/switch-balance-account', {
                id: this.detail.id,
                channelBalanceAccountId: this.toggleAccount,
                doSave: 1
            }).then(data => {
                for(let k in data) {
                    if(k in this.detail) {
                        this.detail[k] = data[k]
                    }
                }
                this.needQuery = true
                this.getChannlList()
            })
        },
        getImg(a) {
            var formData = new FormData()
            formData.append('targetType', 'recharge_voucher_img')
            formData.append('fileName', a.name)
            formData.append('file', a.raw)
            importPost('/api/sysmgr-web/file/upload', formData).then(data => {
                this.attachmentId = data.referId
                this.imageUrl = data.downloadCode
                this.detail.financeDownloadCode = data.downloadCode
            })
        },
        clearImg() {
            this.imageUrl = ''
            this.attachmentId = ''
        },
        getUploadId(a) {
            this.uploadUrl = URL.createObjectURL(a.raw);
            var formData = new FormData()
            formData.append('targetType', 'recharge_voucher_img')
            formData.append('fileName', a.name)
            formData.append('file', a.raw)
            importPost('/api/sysmgr-web/file/upload', formData).then(data => {
                this.subUploadId = data.referId
                this.detail.subDownloadCode = data.downloadCode
            })
        },
        clearUploadId() {
            this.uploadUrl = ''
            this.subUploadId = ''
            this.detail.subDownloadCode = ''
        },
        ensure(state, type) {
            // if(((!this.attachmentId || (!this.subUploadId && this.detail.subServiceCompanyId)) && state == 30) && !this.detail.isAutoRecharge) {
            //     this.$message({
            //         type: 'warning',
            //         message: '请上传凭证！'
            //     })
            //     return
            // }
            if(!this.balanceAccountId && state == 21) {
                this.$message({
                    type: 'warning',
                    message: '请选择渠道账号！'
                })
                return
            }
            if(!this.memo && state == 40) {
                this.$message({
                    type: 'warning',
                    message: '请填写备注！'
                })
                return
            }
            postWaitbyTaskId(`/api/balance-web/recharge-order/${type ? 'failOnRechargeDocumentMake' : this.detail.isAutoRecharge == 1 ? 'risk-approve' : 'approve'}`, {
                attachmentId: this.attachmentId,
                memo: this.memo,
                orderNo: this.detail.orderNo,
                payUserId: this.payUserId,
                state: state,
                subServiceCompanyId: this.detail.subServiceCompanyId,
                subUploadId: this.subUploadId,
                processInsId: this.current.processInstanceId,
                // executionId: '',
                taskId: this.current.id
            }).then(data => {
                this.needQuery = false
                this.attachmentId = ''
                this.imageUrl = ''
                this.subUploadId = ''
                this.uploadUrl = ''
                showNotify("success", "操作成功！");
                this.show = false;
                this.auditCb()
            }
            );
        },
        notArrive() {
            this.$confirm('是否确认未到账？', '未到账', {
                confirmButtonText: '确认',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(data => {
                this.ensure(40, 1)
            }).catch(err => {})
        },
        setMomo() {
            this.memoForm.memo = this.memo
            this.$refs.memoForm && this.$refs.memoForm.clearValidate()
        },
        turnDown() {
            this.$refs.memoForm.validate((valid) => {
                if(valid) {
                    this.showMemo = false
                    this.memo = this.memoForm.memo
                    this.ensure(40)
                }
            })
        },
        touch() {
            console.log(postWaitbyTaskId)
            postWaitbyTaskId('/api/balance-web/recharge-order/rechargeDocumentMake', {
                orderNo: this.detail.orderNo,
                state: 21,
                payUserId: this.payUserId,
                memo: this.memo,
                processInsId: this.current.processInstanceId,
                // executionId: '',
                taskId: this.current.id
            }).then(data => {
                this.needQuery = false
                this.show = false;
                this.auditCb()
            })
        },
        save() {
            post('/api/balance-web/recharge-order/editRechargeCertificate', {
                orderNo: this.detail.orderNo,
                attachmentId: this.attachmentId,
                subUploadId: this.subUploadId,
                processInsId: this.current.processInstanceId,
                // executionId: '',
                taskId: this.current.id
            }).then(data => {
                showNotify("success", "操作成功！");
                this.attachmentId = ''
                this.imageUrl = ''
                this.subUploadId = ''
                this.uploadUrl = ''
                this.show = false;
                this.auditCb()
            })
        },
        transmit(a) {
            console.log(a)
            for(let k in a) {
                this[k] = a[k]
            }
        }
    }
}
</script>
<style scoped>
.uploadBox {
  width: 140px;
  float: left;
  text-align: center;
  margin-right: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  background: #FCFCFC;
  border: 1px solid #CCCCCC;
}
.avatar {
  position: relative;
  width: 140px;
  height: 140px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
}
.avatar-uploader-icon > div {
  line-height: 20px;
  font-size: 12px;
  margin-top: -32px;
}
.title {
    font-weight: bold;
    margin-bottom: 15px;
    margin-left: 20px;
}
.det {
    position: relative;
    margin-bottom: 10px;
    padding-left: 20px;
}
.mb35 {
    margin-bottom: 35px;
}
.voucher {
    position: absolute;
    top: 75px;
    right: 50px;
}
.upload {
    position: relative;
    top: -5px;
    display: inline-block;
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
.auto {
    width: auto;
}
.mb0 {
    margin-bottom: 0px;
}
.pad {
    color: #999999;
    padding-left: 96px;
}
.toggle {
    color: #0283fb;
    display: inline-block;
    margin-left: 50px;
    cursor: pointer;
    user-select: none;
}
.tip {
    font-size: 16px;
}
.clear {
    position: absolute;
    bottom: 0px;
}
.auto {
    max-width: 700px;
}
.input-container .label {
    float: left;
}
.mr20 {
    margin-right: 20px;
    cursor: pointer;
}
.ml20 {
  margin-left: 20px;
}
.fr {
    float: right;
    margin-right: 54px;
}
.tip {
    font-size: 12px;
}
.m20 {
    margin: 20px 0 20px;
}
.w360 {
    width: 360px;
}
.red_0 {
    color: red;
}
.green_0 {
    color: #69aa46;
}
</style>
