<template>
    <div>
        <div class="table-container el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-transition">
            <el-table
                ref="flowTable"
                :data="flowTableList.list"
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column
                    key="selection"
                    v-if="canHandUpOrder"
                    fixed
                    type="selection"
                    width="45">
                </el-table-column>
				<el-table-column prop="companyName" label="客户公司" width="140" fixed></el-table-column>
                <el-table-column prop="appName" label="商户名称" width="140" fixed></el-table-column>
                <el-table-column prop="serviceCompanyName" label="服务公司" width="140"></el-table-column>
                <el-table-column prop="paymentThirdTypeName" label="发放渠道" width="80"></el-table-column>
                <el-table-column prop="sourceTypeName" label="发放方式" width="80"></el-table-column>
                <el-table-column prop="createAt" label="请求时间" width="160">
                    <template slot-scope="scope">
                        <span>{{scope.row.createAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="paymentResTime" label="完成时间" width="160">
                    <template slot-scope="scope">
                        <span>{{scope.row.paymentResTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="accountName" label="收款人姓名" width="100"></el-table-column>
				<el-table-column prop="idCard" label="收款人身份证号" width="150"></el-table-column>
                <el-table-column prop="accountNo" label="收款账号" width="160"></el-table-column>
                <el-table-column prop="amount" label="交易金额" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.amount | formatMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="收款人手机号" width="100"></el-table-column>
                <el-table-column prop="stateName" label="交易状态" width="140"></el-table-column>
                <el-table-column prop="stepName" label="当前步骤" width="120"></el-table-column>
				<el-table-column prop="paymentResDesc" label="返回结果" width="140">
                    <template slot-scope="scope">
                    <span style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
                          :title="scope.row.paymentResDesc">{{scope.row.paymentResDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="originErrMsg" label="渠道返回" width="140">
                    <template slot-scope="scope">
                    <span style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
                          :title="scope.row.originErrMsg">{{scope.row.originErrMsg}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="outOrderNo" label="客户订单号" width="120"></el-table-column>
                <el-table-column prop="paymentTradeNo" label="支付订单号" width="90"></el-table-column>
                <el-table-column prop="paymentThirdTradeNo" label="渠道交易流水号" width="120"></el-table-column>
                <el-table-column prop="memo" label="款项属性" width="120"></el-table-column>
                <el-table-column prop="notifyStateName" label="通知用户状态" width="120"></el-table-column>
                <el-table-column prop="salesList" label="关联销售" width="120">
                    <template slot-scope="scope">
                        <div v-for="e in scope.row.salesList" :key="e.id">{{e.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="deliverList" label="关联交付" width="120">
                	<template slot-scope="scope">
                        <div v-for="e in scope.row.deliverList" :key="e.id">{{e.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="agentCompanyName" label="代理商公司名称" width="140"></el-table-column>
                <!--<el-table-column prop="originErrMsg" label="渠道反馈" width="140"></el-table-column>-->
                <el-table-column prop="costTimeName" label="发放时长(秒)" width="140"></el-table-column>
                <el-table-column key="ation" prop="ation" label="操作" width="140" fixed="right" v-if="checkRight(permissions, 'console-dlv:/pay-order/download-pay-item-electronic-return')">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.supportCertificateDownload && scope.row.state == 30" @click="download(scope.row)">下载电子回单</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <ayg-pagination
			v-if="flowTableList.total"
			:total="flowTableList.total"
            v-on:handleSizeChange="handleSizeChange"
            v-on:handleCurrentChange="query"
			:currentPage="form.page">
		</ayg-pagination>
        <el-dialog title="进度" :visible.sync="showPro" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
            <div class="pro_box">
                <div :style="{width: `${proNum}%`}"></div>
            </div>
            <div class="pro_num">
                {{proNum}}%
            </div>
        </el-dialog>
    </div>
</template>
<script>
import {mapGetters} from 'vuex'
import {post, get} from '../store/api'
import {showLoading, hideLoading} from '../plugin/utils-loading'
export default {
    props: {
        formSearch: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            form: {
                companyId: '',
                serviceCompanyId: '',
                state: '',
                // isHangUp: 0,
                appId: '',
                outOrderNo: '',
                paymentThirdTypeName: '',
                paymentThirdTradeNo: '',
                createAt: '',
                accountName: '',
                accountNo: '',
                account: '',
                paymentResDesc: '',
                paymentThirdType: '',
                sourceType: '',
                createAtBegin: '',
                createAtEnd: '',
                paymentResTimeBegin: '',
                paymentResTimeEnd: '',
                agentCompanyName: '',
                paymentTradeNo:'',
                page: 1,
                pageSize: 10
            },
            showPro: false,
            proNum: 0,
            interval: '',
            key: '',
            frame: '',
            delay: '',
            flowTableList: {},
            windowOpener: '',
            cancelSelection: [],
        }
    },
    computed: {
        ...mapGetters({
            // flowTableList: 'flowTableList',
            permissions: 'permissions'
        }),
        canHandUpOrder() {
            return this.formSearch.state == '20' && this.formSearch.isHangUp == 1 && this.checkRight(this.permissions, 'console-dlv:/pay-order/cancel-hang-up-order')
        }
    },
    mounted() {
		this.query()
    },
    methods: {
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            for(let k in this.formSearch) {
                if(k != 'page' && k != 'pageSize') {
                    this.form[k] = this.formSearch[k]
                }
            }
            // 不是支付中状态不能传这个值
            if (this.formSearch.isHangUp === undefined || this.formSearch.isHangUp === null) {
                delete(this.form.isHangUp)
            }
            post('/api/console-dlv/pay-order/query-item', this.form).then(data => {
                this.flowTableList = data.pageInfo
                this.$emit('ready', data)
            });
            // this.$store.dispatch('getFlowTableList', this.form);
        },
        handleSizeChange(a) {
            this.form.pageSize = a
            this.query()
        },
        exportXls() {
            showLoading('请稍等...')
            var param = JSON.parse(JSON.stringify(this.form))
            delete param.page
            delete param.pageSize
            get('/api/console-dlv/pay-order/export-item', param, true).then(data => {
                this.downloadCode = data
                this.interval = setInterval(() => {
                    get('/api/console-dlv/file/check-export', {
                        downloadCode: this.downloadCode
                    }, true).then(res => {
                        if(res) {
                            clearInterval(this.interval)
                            hideLoading()
                            location.href = `/api/console-dlv/file/download-export?downloadCode=${this.downloadCode}`
                        }
                    })
                }, 1000 * 1)
            })
        },
        download(a) {
            this.windowOpener = window.open()
            get('/api/console-dlv/pay-order/download-pay-item-electronic-return', {
                itemId: a.id
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
                            this.windowOpener.location.href = `/api/sysmgr-web/file/download?downloadCode=${data.downloadCode}`
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
        // 选项处理
        handleSelectionChange(val) {
            this.cancelSelection = val
        },
        // 清空选项
        clearSelection() {
            this.$refs.flowTable.clearSelection();
        },
        // 取消挂起订单
        cancelHangUpOrder() {
            const items = []
            this.cancelSelection.forEach(item => {
                items.push({
                    appId: item.appId,
                    outOrderNo: item.outOrderNo
                })
            })

            post('/api/console-dlv/pay-order/cancel-hang-up-order', { items }, true).then(data => {
                this.$message({
                    type: 'success',
                    message: '取消成功'
                })
                this.clearSelection()
                this.query()
            })
        },
        // 取消挂起订单对话框
        showCancelModal() {
            if (!this.cancelSelection.length) {
                this.$message({
                    type: 'warning',
                    message: '请勾选需要取消的订单'
                })
                return
            }
            this.$confirm('部分已提交银行订单可能无法取消，请以订单最终状态为准。', '确定取消交易？', {
                confirmButtonText: '确定',
                cancelButtonText: '我再想想',
                type: 'warning'
            }).then(() => {
                this.cancelHangUpOrder()
            }).catch(() => {
                this.clearSelection()
            })

        }
    }
}
</script>
<style scoped>
.pro_box {
    display: inline-block;
    width: calc(100% - 50px);
    height: 20px;
    background-color: #ccc;
    border-radius: 10px;
    overflow: hidden;
}
.pro_box > div {
    background-color: #0283fb;
    width: 0%;
    height: 100%;
    border-radius: 10px;
}
.pro_num {
    position: relative;
    top: -5px;
    margin-left: 5px;
    display: inline-block;
    width: 36px;
    font-size: 14px;
    color: #606266;
}
</style>
