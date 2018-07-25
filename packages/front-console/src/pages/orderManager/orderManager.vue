<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px; position: relative;">
        <el-tabs @tab-click="tab">
            <el-tab-pane label="所有订单">
                <el-form :model="form" :inline="true" ref="query">
                    <el-form-item label="订单号：" prop="orderNo">
                        <el-input v-model="form.orderNo" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="订单创建时间：">
                        <el-date-picker
                            v-model="range"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                            size="small"
                            @change="change">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="订单状态：" prop="state">
                        <el-select v-model="form.state" size="small">
                            <el-option v-for="e in status" :value="e.value" :label="e.text"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click="query">查询</el-button>
                        <el-button size="small" @click="reset('query')">清空所有条件</el-button>
                    </el-form-item>
                </el-form>
                <!-- <el-button type="primary" size="small">新增订单</el-button> -->
                <el-table :data="list">
                    <el-table-column label="订单号">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="detail(scope.row)">{{scope.row.orderNo}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务名称" prop="productTypeName"></el-table-column>
                    <el-table-column label="发放委托方" prop="appName"></el-table-column>
                    <el-table-column label="订单金额">
                        <template slot-scope="scope">
                            {{scope.row.totalFee | formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单创建时间" prop="createAt"></el-table-column>
                    <el-table-column label="订单完成时间" prop="completeAt"></el-table-column>
                    <el-table-column label="订单状态" prop="stateName"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="getOrderMsg(scope.row)" v-if="scope.row.nextActions.indexOf('accept') > -1">受理</el-button>
                            <el-button type="text" size="small" @click="getOrderPayMsg(scope.row)" v-if="scope.row.nextActions.indexOf('NeedConfirm') > -1">确认</el-button>
                            <el-button type="text" size="small" @click="cancel(scope.row)" v-if="scope.row.nextActions.indexOf('Canceled') > -1">取消订单</el-button>
                            <el-button type="text" size="small" @click="detail(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <ayg-pagination
                    v-if="total"
                    :total="total"
                    v-on:handleSizeChange="setSize"
                    :currentSize="form.pageSize"
                    v-on:handleCurrentChange="query"
                    :currentPage="form.page">
                </ayg-pagination>
            </el-tab-pane>
            <el-tab-pane label="待受理">
                <el-form :model="form" :inline="true" ref="queryWait">
                    <el-form-item label="订单号" prop="orderNo">
                        <el-input v-model="form.orderNo" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="订单创建时间：">
                        <el-date-picker
                            v-model="range"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                            size="small"
                            @change="change">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click="query">查询</el-button>
                        <el-button size="small" @click="reset('queryWait')">清空所有条件</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="list">
                    <el-table-column label="订单号">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="detail(scope.row)">{{scope.row.orderNo}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务名称" prop="productTypeName"></el-table-column>
                    <el-table-column label="发放委托方" prop="appName"></el-table-column>
                     <el-table-column label="实发金额（银行卡）">
                        <template slot-scope="scope">
                            {{scope.row.bankAmount | formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column label="实发金额（微信）">
                        <template slot-scope="scope">
                            {{scope.row.wechatAmount | formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column label="实发金额（支付宝）">
                        <template slot-scope="scope">
                            {{scope.row.aliPayAmount | formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单金额">
                        <template slot-scope="scope">
                            {{scope.row.totalFee | formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单创建时间" prop="createAt"></el-table-column>
                    <el-table-column label="订单完成时间" prop="completeAt"></el-table-column>
                    <el-table-column label="订单状态" prop="stateName"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="getOrderMsg(scope.row)" v-if="scope.row.nextActions.indexOf('accept') > -1">受理</el-button>
                            <el-button type="text" size="small" @click="getOrderPayMsg(scope.row)" v-if="scope.row.nextActions.indexOf('NeedConfirm') > -1">确认</el-button>
                            <el-button type="text" size="small" @click="cancel(scope.row)" v-if="scope.row.nextActions.indexOf('Canceled') > -1">取消订单</el-button>
                            <el-button type="text" size="small" @click="detail(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <ayg-pagination
                    v-if="total"
                    :total="total"
                    v-on:handleSizeChange="setSize"
                    :currentSize="form.pageSize"
                    v-on:handleCurrentChange="query"
                    :currentPage="form.page">
                </ayg-pagination>
            </el-tab-pane>
            <el-tab-pane label="待支付">
                <el-form :model="form" :inline="true" ref="queryPay">
                    <el-form-item label="订单号" prop="orderNo">
                        <el-input v-model="form.orderNo" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="订单创建时间：">
                        <el-date-picker
                            v-model="range"
                            type="daterange"
                            value-format="yyyy-MM-dd"
                            placeholder="选择日期"
                            size="small"
                            @change="change">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <el-button size="small" @click="query">查询</el-button>
                        <el-button size="small" @click="reset('queryPay')">清空所有条件</el-button>
                    </el-form-item>
                </el-form>
                <el-table :data="list">
                    <el-table-column label="订单号">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="detail(scope.row)">{{scope.row.orderNo}}</el-button>
                        </template>
                    </el-table-column>
                    <el-table-column label="服务名称" prop="productTypeName"></el-table-column>
                    <el-table-column label="发放委托方" prop="appName"></el-table-column>
                    <el-table-column label="订单金额">
                        <template slot-scope="scope">
                            {{scope.row.totalFee | formatMoney}}
                        </template>
                    </el-table-column>
                    <el-table-column label="订单创建时间" prop="createAt"></el-table-column>
                    <el-table-column label="订单完成时间" prop="completeAt"></el-table-column>
                    <el-table-column label="订单状态" prop="stateName"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="getOrderMsg(scope.row)" v-if="scope.row.nextActions.indexOf('accept') > -1">受理</el-button>
                            <el-button type="text" size="small" @click="getOrderPayMsg(scope.row)" v-if="scope.row.nextActions.indexOf('NeedConfirm') > -1">确认</el-button>
                            <el-button type="text" size="small" @click="cancel(scope.row)" v-if="scope.row.nextActions.indexOf('Canceled') > -1">取消订单</el-button>
                            <el-button type="text" size="small" @click="detail(scope.row)">详情</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <ayg-pagination
                    v-if="total"
                    :total="total"
                    v-on:handleSizeChange="setSize"
                    :currentSize="form.pageSize"
                    v-on:handleCurrentChange="query"
                    :currentPage="form.page">
                </ayg-pagination>
            </el-tab-pane>
        </el-tabs>
        <el-dialog title="运营受理" :visible.sync="show" width="60%">
             <el-form label-width="120px">
                 <el-form-item label="发放委托方">
                     {{orderMsg.appName}}
                 </el-form-item>
                 <el-form-item label="订单金额">
                     {{orderMsg.totalFee | formatMoney}}
                 </el-form-item>
                 <el-form-item label="发放人数">
                     {{orderMsg.totalCount}}人
                 </el-form-item>
             </el-form>
             <div class="channel" v-if="orderMsg.bankAccounts && orderMsg.bankAccounts.length">
                 <div>银行卡渠道</div>
                 <el-table :data="orderMsg.bankAccounts">
                     <el-table-column label="单选">
                         <template slot-scope="scope">
                             <el-radio v-model="runAcceptForm.accountInfos[0]" :label="scope.row">{{''}}</el-radio>
                         </template>
                     </el-table-column>
                     <el-table-column label="支付渠道" prop="channelName"></el-table-column>
                     <el-table-column label="渠道别名" prop="channelNameAlias"></el-table-column>
                     <el-table-column label="渠道账号" prop="channelAccount"></el-table-column>
                     <el-table-column label="渠道子账号" prop="channelChildAccount"></el-table-column>
                 </el-table>
             </div>
             <div class="channel" v-if="orderMsg.wechatAccounts && orderMsg.wechatAccounts.length">
                 <div>微信渠道</div>
                 <el-table :data="orderMsg.wechatAccounts">
                     <el-table-column label="单选">
                         <template slot-scope="scope">
                             <el-radio v-model="runAcceptForm.accountInfos[1]" :label="scope.row">{{''}}</el-radio>
                         </template>
                     </el-table-column>
                     <el-table-column label="支付渠道" prop="channelName"></el-table-column>
                     <el-table-column label="渠道别名" prop="channelNameAlias"></el-table-column>
                     <el-table-column label="渠道账号" prop="channelAccount"></el-table-column>
                     <el-table-column label="渠道子账号" prop="channelChildAccount"></el-table-column>
                 </el-table>
             </div>
             <div class="channel" v-if="orderMsg.alipayAccounts && orderMsg.alipayAccounts.length">
                 <div>支付宝渠道</div>
                 <el-table :data="orderMsg.alipayAccounts">
                     <el-table-column label="单选">
                         <template slot-scope="scope">
                             <el-radio v-model="runAcceptForm.accountInfos[2]" :label="scope.row">{{''}}</el-radio>
                         </template>
                     </el-table-column>
                     <el-table-column label="支付渠道" prop="channelName"></el-table-column>
                     <el-table-column label="渠道别名" prop="channelNameAlias"></el-table-column>
                     <el-table-column label="渠道账号" prop="channelAccount"></el-table-column>
                     <el-table-column label="渠道子账号" prop="channelChildAccount"></el-table-column>
                 </el-table>
             </div>
             <span slot="footer">
                 <el-button size="small" type="primary" @click="accept">确认</el-button>
                 <el-button size="small" @click="show = false">关闭弹窗</el-button>
             </span>
         </el-dialog>
         <el-dialog title="财务确认" :visible.sync="payShow" width="60%">
             <el-form label-width="120px">
                 <el-form-item label="发放委托方">
                     {{PayMsg.appName}}
                 </el-form-item>
                 <el-form-item label="订单金额">
                     {{PayMsg.totalFee | formatMoney}}
                 </el-form-item>
                 <el-form-item label="发放人数">
                     {{PayMsg.totalCount}}人
                 </el-form-item>
             </el-form>
             <div class="channel" v-if="PayMsg.bankAccounts && PayMsg.bankAccounts.length">
                 <div>银行卡渠道</div>
                 <el-table :data="PayMsg.bankAccounts">
                     <el-table-column label="支付渠道" prop="channelName"></el-table-column>
                     <el-table-column label="渠道别名" prop="channelNameAlias"></el-table-column>
                     <el-table-column label="渠道账号" prop="channelAccount"></el-table-column>
                     <el-table-column label="渠道子账号" prop="channelChildAccount"></el-table-column>
                 </el-table>
             </div>
             <div class="channel" v-if="PayMsg.wechatAccounts && PayMsg.wechatAccounts.length">
                 <div>微信渠道</div>
                 <el-table :data="PayMsg.wechatAccounts">
                     <el-table-column label="支付渠道" prop="channelName"></el-table-column>
                     <el-table-column label="渠道别名" prop="channelNameAlias"></el-table-column>
                     <el-table-column label="渠道账号" prop="channelAccount"></el-table-column>
                     <el-table-column label="渠道子账号" prop="channelChildAccount"></el-table-column>
                 </el-table>
             </div>
             <div class="channel" v-if="PayMsg.alipayAccounts && PayMsg.alipayAccounts.length">
                 <div>支付宝渠道</div>
                 <el-table :data="PayMsg.alipayAccounts">
                     <el-table-column label="支付渠道" prop="channelName"></el-table-column>
                     <el-table-column label="渠道别名" prop="channelNameAlias"></el-table-column>
                     <el-table-column label="渠道账号" prop="channelAccount"></el-table-column>
                     <el-table-column label="渠道子账号" prop="channelChildAccount"></el-table-column>
                 </el-table>
             </div>
             <span slot="footer">
                 <el-button size="small" type="primary" @click="ensure(true)">同意</el-button>
                 <el-button size="small" @click="ensure(false)">不同意</el-button>
             </span>
         </el-dialog>
    </div>
</template>
<script>
import {post, get} from '../../store/api'
export default {
    data() {
        return {
            form: {
                orderNo: '',
                state: '',
                acceptState: '',
                confirmState: '',
                endAt: '',
                startAt: '',
                pageSize: 10,
                page: 1
            },
            range: [],
            total: 0,
            status: [],
            list: [],
            show: false,
            runAcceptForm: {
                accountInfos: [],
                orderId: ''
            },
            currOrder: '',
            orderMsg: '',
            payShow: false,
            PayAcceptForm: {
                orderId: '',
                pass: ''
            },
            PayMsg: '',
            isWait: false,
            channelCount: 0
        }
    },
    mounted() {
        get('/api/console-dlv/option/get-by-type', {
            type: 'OnlineSalaryDeliverOrderState'
        }).then(data => {
            this.status = data
            console.log(data)
        })
        this.query()
    },
    methods: {
        query(a) {
            if(isNaN(a)){
                a = 1
            }
            this.form.page = a
            if(this.form.state == 10) {
                this.form.acceptState = 10
            }
            else if(this.form.state == 20) {
                this.form.confirmState = 20
            }
            if (this.isWait) {
                this.form.state = ''
                this.form.acceptState = 10
                this.form.confirmState = 20
            }
            else {
                this.form.acceptState = ''
                this.form.confirmState = ''
            }
            post('/api/console-dlv/company/salary-online-order/query-salary-order', this.form).then(data => {
                console.log(data)
                this.list = data.list
                this.total = data.total
            })
        },
        tab(a) {
            this.reset('query')
            this.form.state = ''
            this.status.forEach(e => {
                if(e.text.indexOf(a.label) > -1){
                    this.form.state = e.value
                }
            })
            if(a.label == '待受理') {
                this.isWait = true
            }
            else {
                this.isWait = false
            }
            this.query()
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        reset(name) {
            this.range = []
            this.form.startAt = ''
            this.form.endAt = ''
            this.$refs[name].resetFields();
        },
        change() {
            this.form.startAt = this.range[0]
            this.form.endAt = this.range[1]
        },
        cancel(a) {
            this.$confirm('确定取消该订单吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                post('/api/console-dlv/company/salary-online-order/cancel-salary-order', {
                    orderId: a.orderId
                }).then(data => {
                    this.$message({
                        type: 'success',
                        message: '已成功取消订单！'
                    })
                    this.query()
                })
            }).catch(err => {
                console.log(err)
            })
        },
        getOrderMsg(a) {
            get('/api/console-dlv/company/salary-online-order/get-app-channel-info', {
                orderId: a.orderId
            }).then(data => {
                this.show = true
                this.runAcceptForm.orderId = a.orderId
                this.orderMsg = data
                this.channelCount = 0
                this.runAcceptForm.accountInfos = []
                if(this.orderMsg.bankAccounts.length) {
                    this.channelCount++
                }
                if(this.orderMsg.wechatAccounts.length) {
                    this.channelCount++
                }
                if(this.orderMsg.alipayAccounts.length) {
                    this.channelCount++
                }
                console.log('channelCount:')
                console.log(this.channelCount)
            })
        },
        accept(a) {
            var arr = this.runAcceptForm.accountInfos.filter(e => {
                return e
            })
            this.runAcceptForm.accountInfos = arr
            if(this.runAcceptForm.accountInfos.length == this.channelCount){
                this.runAcceptForm.accountInfos.forEach(e => {
                    if(e) {
                        delete e.channelChildAccount
                        delete e.channelName
                        delete e.channelNameAlias
                        delete e.selected
                    }
                })
                post('/api/console-dlv/company/salary-online-order/accept', this.runAcceptForm).then(() => {
                    this.$message({
                        type: 'success',
                        message: '订单已受理！'
                    })
                    this.show = false
                    this.query()
                })
            }
            else {
                this.$message({
                    type: 'info',
                    message: '请为每种渠道分别选择一项！'
                })
            }
        },
        getOrderPayMsg(a) {
            console.log(a)
            get('/api/console-dlv/company/salary-online-order/get-order-channel-info', {
                orderId: a.orderId
            }).then(data => {
                this.payShow = true
                this.PayAcceptForm.orderId = a.orderId
                this.PayMsg = data
            })
        },
        ensure(a) {
            this.PayAcceptForm.pass = a
            post('/api/console-dlv/company/salary-online-order/confirm', this.PayAcceptForm).then(() => {
                this.$message({
                    type: 'success',
                    message: '订单状态已更改！'
                })
                this.payShow = false
                this.query()
            })
        },
        detail(a) {
            console.log(a)
            var url = ''
            a.state = a.state - 0
            switch (a.state) {
                case 30:
                    url = '/main/orderManager/defrayment'
                    break;
                case 10:
                    url = '/main/orderManager/submitOrder'
                    break;
                case 20:
                    url = '/main/orderManager/submitOrder'
                    break;
                case 50:
                    url = '/main/orderManager/postalService'
                    break;
                case 80:
                    url = '/main/orderManager/orderComplete'
                    break;
                case 90:
                    url = '/main/orderManager/cancleOrder'
                    break;
                default:
                    url = '/main/orderManager/cancleOrder'
                    break;
            }
            sessionStorage.setItem('data', JSON.stringify({
                id: a.orderId,
                appId: a.appId
            }))
            this.$router.push(url)
        }
    }
}
</script>