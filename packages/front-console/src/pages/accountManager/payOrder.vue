<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;" v-loading="isReady">
        <div style="margin: 0 0 20px;">发放流水记录</div>

        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="全部" name="first"></el-tab-pane>
            <el-tab-pane label="支付成功" name="second"></el-tab-pane>
            <el-tab-pane label="支付中" name="third"></el-tab-pane>
            <el-tab-pane label="支付失败" name="fourth"></el-tab-pane>
        </el-tabs>

        <el-form :inline="true" :model="formSearch" size="small" style="padding-left: 35px;padding: 10px 0 10px 35px;" ref="formSearch">
			<el-form-item label="客户公司" prop="companyId">
                <el-select filterable style="width: 150px" v-model="formSearch.companyId">
					<el-option label="所有" value=""></el-option>
                    <el-option v-for="e in companys" :value="e.id" :label="e.name" :key="e.id"></el-option>
                </el-select>
            </el-form-item>
			<el-form-item label="服务公司" prop="serviceCompanyId">
                <el-select filterable style="width: 150px" v-model="formSearch.serviceCompanyId">
					<el-option label="所有" value=""></el-option>
                    <el-option v-for="e in servers" :value="e.id" :label="e.name" :key="e.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="商户名称:" prop="appId">
                <el-select filterable style="width: 150px" v-model="formSearch.appId" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in customNameList" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户订单号:" prop="outOrderNo">
                <el-input style="width: 150px" v-model="formSearch.outOrderNo" placeholder="客户订单号"></el-input>
            </el-form-item>
            <el-form-item label="发放渠道:" prop="paymentThirdType">
                <el-select style="width: 150px" v-model="formSearch.paymentThirdType" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in selectList2" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发放方式:" prop="sourceType">
                <el-select style="width: 150px" v-model="formSearch.sourceType" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in sourceTypeList" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道交易流水号:" prop="paymentThirdTradeNo">
                <el-input style="width: 150px" v-model="formSearch.paymentThirdTradeNo" placeholder="渠道交易流水号"></el-input>
            </el-form-item>
            <el-form-item label="收款人姓名:" prop="accountName">
                <el-input style="width: 150px" v-model="formSearch.accountName" placeholder="收款人姓名"></el-input>
            </el-form-item>
            <el-form-item label="收款账号:" prop="accountNo">
                <el-input style="width: 150px" v-model="formSearch.accountNo" placeholder="收款账号">
                </el-input>
            </el-form-item>
            <el-form-item label="交易状态:" v-if="activeTab === 'first'">
                <el-select style="width: 150px" v-model="formSearch.state" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option label="支付成功" value="30"></el-option>
                    <el-option label="支付失败" value="40"></el-option>
                    <el-option label="支付中" value="20"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请求起止时间:">
                <el-date-picker
					v-model="dateValue"
					type="daterange"
					value-format="yyyy-MM-dd"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					@change="getDate">
				</el-date-picker>
            </el-form-item>
			<el-form-item label="发放时间:">
                <el-date-picker
					v-model="paymentResTime"
					type="daterange"
					value-format="yyyy-MM-dd"
					start-placeholder="开始日期"
					end-placeholder="结束日期"
					@change="getTime">
				</el-date-picker>
            </el-form-item>
            <el-form-item label="代理商公司名称:" prop="agentCompanyName">
                <el-select style="width: 150px" v-model="formSearch.agentCompanyName" filterable placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in agentList" :label="item.companyName" :value="item.companyName" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="clear">清除</el-button>
                <el-button @click="exportXls">导出xls</el-button>
            </el-form-item>
        </el-form>

        <div style="margin: 0px 30px 30px;">
            <el-row :gutter="20">
                <el-col :span="6">发放总金额： <span>{{moneyFlow.amount | formatMoney}}</span>
                    <i class="el-icon-question" style="margin-left:5px;color:#f56c6c;cursor:pointer;" title="所选条件下的发放成功和发放中的金额总数"></i>
                </el-col>
                <el-col :span="5">发成功金额： <span>{{moneyFlow.doneAmount | formatMoney}}</span></el-col>
                <el-col :span="5">发放中金额： <span>{{moneyFlow.doingAmount | formatMoney}}</span></el-col>
				<el-col :span="4"><span style="color: red">当前金额按照请求时间统计</span></el-col>
            </el-row>
        </div>

        <div class="table-container el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-transition">
            <el-table :data="flowTableList.list" style="width: 100%">
                <el-table-column prop="companyName" label="操作" width="140" fixed v-if="checkRight(permissions, 'console-dlv:/pay-order/download-pay-item-electronic-return')">
                    <template slot-scope="scope">
                        <el-button type="text" v-if="scope.row.supportCertificateDownload && scope.row.state == 30" @click="download(scope.row)">下载电子回单</el-button>
                    </template>
                </el-table-column>
				<el-table-column prop="companyName" label="客户公司" width="140" fixed></el-table-column>
                <el-table-column prop="appName" label="商户名称" width="140" fixed></el-table-column>
                <el-table-column prop="salesList" label="关联销售" width="120">
                    <template slot-scope="scope">
                        <div v-for="e in scope.row.salesList" :key="e.id">{{e.name}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="outOrderNo" label="客户订单号" width="120"></el-table-column>
                <el-table-column prop="serviceCompanyName" label="服务公司" width="140"></el-table-column>
				<!-- <el-table-column prop="subServiceCompanyName" label="转包服务公司" width="140"></el-table-column> -->
                <el-table-column prop="agentCompanyName" label="代理商公司名称" width="140"></el-table-column>
                <el-table-column prop="paymentThirdTypeName" label="发放渠道" width="80"></el-table-column>
                <el-table-column prop="sourceTypeName" label="发放方式" width="80"></el-table-column>
				<el-table-column prop="paymentTradeNo" label="支付订单号" width="90"></el-table-column>
                <el-table-column prop="paymentThirdTradeNo" label="渠道交易流水号" width="120"></el-table-column>
                <el-table-column prop="createAt" label="请求时间" width="160">
                    <template slot-scope="scope">
                        <span>{{scope.row.createAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="accountName" label="收款人姓名" width="100"></el-table-column>
				<el-table-column prop="idCard" label="收款人身份证号" width="150"></el-table-column>
				<el-table-column prop="phone" label="收款人手机号" width="100"></el-table-column>
                <el-table-column prop="accountNo" label="收款账号" width="160"></el-table-column>
                <el-table-column prop="amount" label="交易金额" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.amount | formatMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="stateName" label="交易状态" width="140"></el-table-column>
                <el-table-column prop="paymentResDesc" label="失败原因" width="140">
                    <template slot-scope="scope">
                    <span style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;"
                          :title="scope.row.paymentResDesc">{{scope.row.paymentResDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="paymentResTime" label="发放时间" width="160">
                    <template slot-scope="scope">
                        <span>{{scope.row.paymentResTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="costTimeName" label="发放时长(秒)" width="140">
                </el-table-column>
                <el-table-column prop="notifyStateName" label="通知用户状态" width="120"></el-table-column>
                <el-table-column prop="memo" label="款项属性" width="120"></el-table-column>
                <el-table-column prop="stepName" label="当前步骤" width="120"></el-table-column>
            </el-table>
        </div>

        <ayg-pagination
			v-if="flowTableList.total"
			:total="flowTableList.total"
            v-on:handleSizeChange="handleSizeChange"
            v-on:handleCurrentChange="query"
			:currentPage="formSearch.page">
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
	import {showConfirm} from '../../plugin/utils-message'
	import {formatTime} from '../../plugin/utils-functions'
	import {baseUrl} from '../../config/address'
	import {post, get} from '../../store/api'
	import {showLoading, hideLoading} from '../../plugin/utils-loading'
	import { setInterval, clearInterval } from 'timers';

	export default {
		data() {
			return {
				formSearch: {
					companyId: '',
					serviceCompanyId: '',
					state: '',
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
					page: 1,
					pageSize: 10
				},
				dateValue: '',
				paymentResTime:'',
				selectList2: [],
				sourceTypeList: [],
				activeTab: 'first',
				companys: [],
				servers: [],
				downloadCode: '',
                interval: '',
                showPro: false,
                delay: '',
                proNum: 0,
                frame: '',
                isReady: true,
                agentList: []
			}
        },
        watch: {
            flowTableList() {
                this.isReady = false
            }
        },
		computed: {
			...mapGetters({
				flowTableList: 'flowTableList',
				customNameList: 'customNameList',
				moneyFlow: 'moneyFlow',
                permissions: 'permissions'
			})
		},
		mounted() {
			this.query()
			this.$store.dispatch('getCustomNameList');
			this.getSelectList2();
			this.getSourceType()
			get('/api/sysmgr-web/commom/company', {
    		    companyIdentity: 'custom'
    		}).then(data => {
    		    this.companys = data
    		})
			get('/api/sysmgr-web/commom/company', {
    		    companyIdentity: 'service'
    		}).then(data => {
    		    this.servers = data
            })
            get('/api/contract-web/agent-contract/agent-company-option?sign=true').then(data => {
                this.agentList = data
            })
		},
		methods: {
			getDate() {
				if (this.dateValue) {
					this.formSearch.createAtBegin = this.dateValue[0]
					this.formSearch.createAtEnd = this.dateValue[1]
				}
				else {
					this.formSearch.createAtBegin = ''
					this.formSearch.createAtEnd = ''
				}
			},
			getTime() {
				if (this.paymentResTime) {
					this.formSearch.paymentResTimeBegin = this.paymentResTime[0]
					this.formSearch.paymentResTimeEnd = this.paymentResTime[1]
				}
				else {
					this.formSearch.paymentResTimeBegin = ''
					this.formSearch.paymentResTimeEnd = ''
				}
			},
			getSourceType() {
				get('/api/console-dlv/option/get-by-type', {
					type: 'PayOrderSourceType'
				}).then(result => {
					this.sourceTypeList = result
				})
			},
			query(a) {
				if(isNaN(a)) {
					a = 1
				}
				this.formSearch.page = a
				this.$store.dispatch('getFlowTableList', this.formSearch);
			},
			clear() {
				this.$refs.formSearch.resetFields()
				if(this.activeTab === 'first') this.formSearch.state = '';
				this.dateValue = '';
				this.paymentResTime = '';
				this.getDate()
				this.getTime()
			},
			exportXls() {
				showLoading('请稍等...')
				var param = JSON.parse(JSON.stringify(this.formSearch))
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
			handleSizeChange(a) {
				this.formSearch.pageSize = a
				this.query()
			},
			getSelectList2() {
				get('/api/console-dlv/pay-order/payment-third-types').then(data => {
					this.selectList2 = data;
				});
			},
			handleTabClick(tab, event) {
				let _tab = tab.name
				switch (_tab) {
					case 'first':
						this.formSearch.state = ''
						break
					case 'second':
						this.formSearch.state = '30'
						break
					case 'third':
						this.formSearch.state = '20'
						break
					case 'fourth':
						this.formSearch.state = '40'
						break
				}
				this.query()
            },
            download(a) {
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
            }
		}
	}
</script>

<style lang="scss" scoped>
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
