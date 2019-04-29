<template>
    <div class="company-build-container company-container">
        <div class="title">调账管理</div>
        <el-form :model="form" :inline="true" ref="form">
            <el-form-item label="服务商名称" prop="serviceCompanyId">
                <el-select size="small" filterable v-model="form.serviceCompanyId">
                    <el-option v-for="e in companys" :value="e.id" :label="e.name" :key="e.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="操作时间">
                <!-- <el-date-picker v-model="dateValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker> -->
                <el-date-picker size="small"
                    v-model="dateValue"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format='yyyy-MM-dd'
                    @change="getTime">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary" @click="query">查询</el-button>
                <el-button size="small" @click="reset">清除</el-button>
            </el-form-item>
        </el-form>
        <el-button size="small" type="primary" @click="show = true">调账申请</el-button>
        <el-table :data="data.list">
            <el-table-column label="操作人" prop="createByName"></el-table-column>
            <el-table-column label="服务商信息" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="转出渠道信息" prop="fromPaymentThirdType">
                <template slot-scope="scope">
                    {{`${scope.row.fromBankTypeName}/${scope.row.fromChannelLoginAcctNo}/${scope.row.fromChannelMerCustId}/${scope.row.fromPayUserName}`}}
                </template>
            </el-table-column>
            <el-table-column label="转入渠道信息" prop="toPaymentThirdType">
                <template slot-scope="scope">
                    {{`${scope.row.toBankTypeName}/${scope.row.toChannelLoginAcctNo}/${scope.row.toChannelMerCustId}/${scope.row.toPayUserName}`}}
                </template>
            </el-table-column>
            <el-table-column label="金额（元）" prop="tradeAmount"></el-table-column>
            <el-table-column label="处理时间" prop="tradeAtStr"></el-table-column>
            <el-table-column label="调账备注" prop="remarks"></el-table-column>
        </el-table>
        <ayg-pagination
            :total="data.total"
            :currentPage="form.page"
            v-on:handleSizeChange="setSize"
            v-on:handleCurrentChange="query">
        </ayg-pagination>
        <el-dialog title="余额调账操作" @close="resetReg" :visible.sync="show" width="800px">
            <el-form :model="regForm" :rules="rules" label-width="150px" ref="regForm">
                <el-form-item label="选择商户" prop="appId">
                    <el-select filterable v-model="regForm.appId" size="small" placeholder="请选择商户名称" @change="getService">
                        <el-option v-for="e in productName" :label="e.text" :value="e.value" :key="e.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择服务商" prop="serviceCompanyId">
                    <el-select filterable v-model="regForm.serviceCompanyId" size="small" placeholder="请选择服务商名称" @change="getSubServiceCompany">
                        <el-option v-for="e in serviceName" :label="e.text" :value="e.value" :key="e.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转包服务商" prop="subServiceCompanyId" v-if="subServiceCompanys && subServiceCompanys.length">
                    <el-select filterable v-model="regForm.subServiceCompanyId" size="small" placeholder="请选择转包服务商" @change="getChannelType">
                        <el-option v-for="e in subServiceCompanys" :key="e.id" :label="e.name" :value="e.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择渠道" prop="bankType">
                    <el-select filterable v-model="regForm.bankType" size="small" placeholder="请选择渠道" @change="getChannel">
                        <el-option v-for="e in channelType" :label="e.text" :value="e.value" :key="e.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择转出的渠道帐号" prop="fromBalanceAccountId">
                    <el-select v-model="regForm.fromBalanceAccountId" size="small" placeholder="选择转出的渠道帐号" @change="outChannel">
                        <el-option v-for="e in channels" :label="`${e.channelAlias}/${e.channelLoginAcctNo}/${e.channelMerCustId}/${e.payUserId}`" :value="e.balanceAccountId" :key="e.balanceAccountId"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="outMsg">
                    <div class="half">
                        <span>帐号今日可充建议：{{outMsg.allowAvailBalance | formatMoney}}元</span>
                        <span>帐号当前余额：{{outMsg.currentAvailBalance | formatMoney}}元</span>
                    </div>
                    <div class="half">
                        <span>日发放限额：{{outMsg.limitAvailBalance | formatMoney}}元</span>
                        <span>当日已发：{{outMsg.outAvailBalance | formatMoney}}元</span>
                    </div>
                </template>
                <el-form-item label="选择转入的渠道帐号" prop="toBalanceAccountId">
                    <el-select v-model="regForm.toBalanceAccountId" size="small" placeholder="选择转入的渠道帐号" @change="inChannel">
                        <el-option v-for="e in channels_0" :label="`${e.channelAlias}/${e.channelLoginAcctNo}/${e.channelMerCustId}/${e.payUserId}`" :value="e.balanceAccountId" :key="e.balanceAccountId"></el-option>
                    </el-select>
                </el-form-item>
                <template v-if="inMsg">
                    <div class="half">
                        <span>帐号今日可充建议：{{inMsg.allowAvailBalance | formatMoney}}元</span>
                        <span>帐号当前余额：{{inMsg.currentAvailBalance | formatMoney}}元</span>
                    </div>
                    <div class="half">
                        <span>日发放限额：{{inMsg.limitAvailBalance | formatMoney}}元</span>
                        <span>当日已发：{{inMsg.outAvailBalance | formatMoney}}元</span>
                    </div>
                </template>
                <el-form-item label="输入调账金额（元）" prop="tradeAmount">
                    <el-input v-model="regForm.tradeAmount" size="small" style="width: 215px;"></el-input>
                </el-form-item>
                <el-form-item label="调账备注" prop="remarks">
                    <el-input v-model="regForm.remarks" size="small" style="width: 215px;"></el-input>
                </el-form-item>
            </el-form>
            <!-- <div>选择转入帐号后，系统自动切换当前发放渠道帐号到所选的帐号，请确保帐号内金额充足。</div> -->
            <span slot="footer">
                <el-button size="small" @click="show = false">取消</el-button>
                <el-button size="small" type="primary" @click="sure">确认</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { post, get, postWithErrorCallback } from "../../store/api";
import { mapGetters } from "vuex";
export default {
    data() {
        var moreThenZero = (rule, value, cb) => {
            if(isNaN(value) || value <= 0) {
                return cb(new Error('实发金额必须大于零'))
            }
            else {
                return cb()
            }
        }
        return {
            form: {
                serviceCompanyId: '',
                tradeAtBegin: '',
                tradeAtEnd: '',
                page: 1,
                pageSize: 10
            },
            dateValue: [],
            total: 0,
            show: false,
            data: '',
            serviceName: [],
            channelType: [],
            channels: [],
            channels_0: [],
            regForm: {
                appId: '',
                appName: '',
                serviceCompanyId: '',
                serviceCompanyName: '',
                subServiceCompanyId: '',
                bankType: '',
                fromBalanceAccountId: '',
                toBalanceAccountId: '',
                tradeAmount: '',
                remarks: ''
            },
            rules: {
                appId: [
                    {
                        required: true,
                        message: "请选择商户",
                        trigger: "blur"
                    }
                ],
                serviceCompanyId: [
                    {
                        required: true,
                        message: "请选择服务商",
                        trigger: "blur"
                    }
                ],
                bankType: [
                    {
                        required: true,
                        message: "请选择渠道",
                        trigger: "blur"
                    }
                ],
                fromBalanceAccountId: [
                    {
                        required: true,
                        message: "请选择转出渠道",
                        trigger: "blur"
                    }
                ],
                toBalanceAccountId: [
                    {
                        required: true,
                        message: "请选择转入渠道",
                        trigger: "blur"
                    }
                ],
                tradeAmount: [
                    {
                        required: true,
                        message: "请输入金额",
                        trigger: "blur"
                    },
                    {
                        pattern: /^\d+(\.\d{1,2})?$/,
                        message: '请正确填写实发金额',
                        trigger: 'blur'
                    },
                    {
                        validator: moreThenZero,
                        trigger: 'blur'
                    }
                ],
                remarks: [
                    {
                        required: true,
                        message: "请填写备注",
                        trigger: "blur"
                    }
                ]
            },
            outMsg: '',
            inMsg: '',
            companys: [],
            subServiceCompanys: []
        }
    },
    computed: {
        ...mapGetters({
            productName: 'productName',
            // customCompanies: "customCompanies"
        })
    },
    mounted() {
        // get('/api/sysmgr-web/commom/service').then(data => {
        //     console.log(data)
        // })
        this.query()
        this.$store.dispatch("getAppList");
        // get('/api/balance-web/commom/option?enumType=ChannelType').then(data => {
        //     this.channelType = data
        // })
        get('/api/sysmgr-web/commom/company?companyIdentity=service').then(data => {
          this.companys = data
      })
    },
    methods: {
        getTime() {
            if(this.dateValue && this.dateValue.length) {
                this.form.tradeAtBegin = this.dateValue[0]
                this.form.tradeAtEnd = this.dateValue[1]
            }
            else {
                this.form.tradeAtBegin = ''
                this.form.tradeAtEnd = ''
            }
        },
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post('/api/balance-web/balance-trade-recon/get-trade-recon-list', this.form).then(data => {
                this.data = data
            })
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        reset() {
            this.$refs['form'].resetFields()
            this.dateValue = []
            this.form.tradeAtBegin = ''
            this.form.tradeAtEnd = ''
        },
        getService() {
            this.regForm.serviceCompanyId = ''
            this.regForm.bankType = ''
            this.regForm.fromBalanceAccountId = ''
            this.outMsg = ''
            this.regForm.toBalanceAccountId = ''
            this.inMsg = ''
            this.channelType = []
            this.channels = []
            this.channels_0 = []
            this.productName.forEach(e => {
                if(e.value == this.regForm.appId) {
                    this.regForm.appName = e.text
                }
            })
            get('/api/sysmgr-web/commom/app-service-company-list', {
                appId: this.regForm.appId
            }).then(data => {
                this.serviceName = data
            })
            this.getChannel()
        },
        getSubServiceCompany() {
            this.resetReg.subServiceCompanyId = ''
            this.subServiceCompanys = []
            this.regForm.subServiceCompanyId = ''
            get('/api/sysmgr-web/commom/subcontract-service-companies', {
                appId: this.regForm.appId,
                serviceCompanyId: this.regForm.serviceCompanyId
            }).then(data => {
                this.subServiceCompanys = data
            })
            this.getChannelType()
        },
        getChannelType() {
            this.regForm.bankType = ''
            this.channels = []
            this.channels_0 = []
            get('/api/balance-web/balance-trade-recon/select-bank-type', {
                appId: this.regForm.appId,
                serviceCompanyId: this.regForm.serviceCompanyId
            }).then(data => {
                this.channelType = data
            })
            this.getChannel()
        },
        getChannel() {
            this.regForm.fromBalanceAccountId = ''
            this.outMsg = ''
            this.regForm.toBalanceAccountId = ''
            this.inMsg = ''
            this.channels = []
            this.channels_0 = []
            this.serviceName.forEach(e => {
                if(e.value == this.regForm.serviceCompanyId) {
                    this.regForm.serviceCompanyName = e.text
                }
            })
            if(this.regForm.appId && this.regForm.serviceCompanyId && this.regForm.bankType) {
                get('/api/balance-web/balance-account/query-balance-account-channel-list', {
                    appId: this.regForm.appId,
                    serviceCompanyId: this.regForm.serviceCompanyId,
                    bankType: this.regForm.bankType,
                    subServiceCompanyId: this.regForm.subServiceCompanyId
                }).then(data => {
                    this.channels = data
                })
            }
        },
        outChannel() {
            this.regForm.toBalanceAccountId = ''
            this.inMsg = ''
            this.filterChannels()
            var a
            this.channels.forEach(e => {
                if(e.balanceAccountId == this.regForm.fromBalanceAccountId) {
                    a = e
                }
            })
            get('/api/balance-web/balance-account/get-avail-balance-info', {
                balanceAccountId: a.balanceAccountId,
                payUserId: a.payUserId,
                paymentThirdType: a.paymentThirdType
            }).then(data => {
                this.outMsg = data
            })
        },
        inChannel() {
            var a
            this.channels.forEach(e => {
                if(e.balanceAccountId == this.regForm.toBalanceAccountId) {
                    a = e
                }
            })
            get('/api/balance-web/balance-account/get-avail-balance-info', {
                balanceAccountId: a.balanceAccountId,
                payUserId: a.payUserId,
                paymentThirdType: a.paymentThirdType
            }).then(data => {
                this.inMsg = data
            })
        },
        filterChannels() {
            this.regForm.toBalanceAccountId = ''
            this.channels_0 = this.channels.filter(e => {
                return this.regForm.fromBalanceAccountId != e.balanceAccountId
            })
        },
        resetReg() {
            this.$refs['regForm'].resetFields()
            this.outMsg = ''
            this.inMsg = ''
        },
        sure() {
            this.$refs["regForm"].validate(valid => {
                if(valid) {
                    if(this.outMsg && this.outMsg.currentAvailBalance >= this.regForm.tradeAmount) {
                        var bankType = this.regForm.bankType, subServiceCompanyId = this.regForm.subServiceCompanyId
                        delete this.regForm.bankType
                        delete this.regForm.subServiceCompanyId
                        postWithErrorCallback('/api/balance-web/balance-trade-recon/do-trade-recon', this.regForm).then(data => {
                            this.show = false
                            this.regForm.bankType = bankType
                            this.query()
                        }).catch(err => {
                            this.regForm.bankType = bankType
                            this.regForm.subServiceCompanyId = subServiceCompanyId
                        })
                    }
                    else {
                        this.$message({
                            type: 'warning',
                            message: '当前所渠道余额不足！'
                        })
                    }
                }
            })
        }
    }
}
</script>
<style scoped>
.title {
  margin-bottom: 20px;
}
.half {
  margin-bottom: 15px;
  padding-left: 20px;
}
.half > span {
  display: inline-block;
  width: 45%;
}
</style>
