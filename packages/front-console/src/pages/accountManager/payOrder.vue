<template>
	<div style="margin-top: 15px;background-color: #fff;padding: 15px;" v-loading="isReady">
		<div style="margin: 0 0 20px;">发放流水记录</div>

		<el-tabs v-model="activeTab" @tab-click="handleTabClick">
			<el-tab-pane label="全部" name="first"></el-tab-pane>
			<el-tab-pane label="支付成功" name="second"></el-tab-pane>
			<el-tab-pane label="支付中" name="third"></el-tab-pane>
			<el-tab-pane label="挂起" name="fifth"></el-tab-pane>
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
			<el-form-item label="收款人身份证:" prop="idCard">
				<el-input style="width: 150px" v-model="formSearch.idCard" placeholder="收款人身份证"></el-input>
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
			<el-form-item label="完成时间:">
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
				<el-button @click="exportXls" v-if="!userInformation || !userInformation.scrutator">导出xls</el-button>
				<el-button
					v-if="activeTab === 'fifth' && checkRight(permissions, 'console-dlv:/pay-order/cancel-hang-up-order')"
					@click="cancelHangUpOrder">取消交易</el-button>
			</el-form-item>
		</el-form>

		<div style="margin: 0px 30px 30px;" v-if="!userInformation || !userInformation.scrutator">
			<el-row :gutter="20">
				<el-col :span="6">发放总金额： <span>{{moneyFlow.amount | formatMoney}}</span>
					<i class="el-icon-question" style="margin-left:5px;color:#f56c6c;cursor:pointer;" title="所选条件下的发放成功和发放中的金额总数"></i>
				</el-col>
				<el-col :span="5">发成功金额： <span>{{moneyFlow.doneAmount | formatMoney}}</span></el-col>
				<el-col :span="4">发放中金额： <span>{{moneyFlow.doingAmount | formatMoney}}</span></el-col>
				<el-col :span="4">挂起金额： <span>{{moneyFlow.hangUpAmount | formatMoney}}</span></el-col>
				<el-col :span="4"><span style="color: red">当前金额按照请求时间统计</span></el-col>
			</el-row>
		</div>
		<pay-order-list :formSearch="formSearch" @ready="ready" ref="payOrderList"></pay-order-list>
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
import payOrderList from '../../pageComponent/payOrderList'
export default {
	components: {
		payOrderList
	},
	data() {
		let t = formatTime(new Date().getTime(), 'yyyy-MM-dd');
		return {
			formSearch: {
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
				idCard: '',
				accountNo: '',
				account: '',
				paymentResDesc: '',
				paymentThirdType: '',
				sourceType: '',
				createAtBegin: t,
				createAtEnd: t,
				paymentResTimeBegin: '',
				paymentResTimeEnd: '',
				agentCompanyName: '',
				page: 1,
				pageSize: 10
			},
			dateValue: [t, t],
			paymentResTime:'',
			selectList2: [],
			sourceTypeList: [],
			activeTab: 'first',
			companys: [],
			servers: [],
			downloadCode: '',
			isReady: true,
			agentList: [],
			moneyFlow: {}
		}
	},
	// watch: {
	// 	userInformation() {
	// 		console.log(this.userInformation)
	// 		this.userInformation.userProfile.roles.forEach(e => {
	// 			console.log(`${e.name}: ${e.id}`)
	// 		})
	// 	}
	// },
	computed: {
		...mapGetters({
			userInformation: 'userInformation',
			customNameList: 'customNameList',
			permissions: 'permissions',
		})
	},
	created() {
		// 带参数的跳转需要处理下，
		const {query} = this.$route
		const keyList = Object.keys(query)
		if (keyList.length) {
			// 对于有带参数的，需要清空完成时间
			this.dateValue = ''
			this.formSearch.createAtBegin = ''
			this.formSearch.createAtEnd = ''
			keyList.forEach(key => {
				this.formSearch[key] = query[key]
			})
		}
	},
	mounted() {
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
		ready(data) {
			this.moneyFlow = data
			this.isReady = false
		},
		query() {
			this.$refs.payOrderList.query()
		},
		exportXls() {
			this.$refs.payOrderList.exportXls()
		},
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
		clear() {
			this.$refs.formSearch.resetFields()
			if(this.activeTab === 'first') this.formSearch.state = '';
			this.dateValue = '';
			this.paymentResTime = '';
			this.getDate()
			this.getTime()
		},
		getSelectList2() {
			get('/api/console-dlv/pay-order/payment-third-types').then(data => {
				this.selectList2 = data;
			});
		},
		handleTabClick(tab, event) {
			let _tab = tab.name
			delete(this.formSearch.isHangUp)

			switch (_tab) {
				case 'first':
					this.formSearch.state = ''
					break
				case 'second':
					this.formSearch.state = '30'
					break
				case 'third':
					// 支付中
					this.formSearch.state = '20'
					this.formSearch.isHangUp = 0
					break
				case 'fourth':
					this.formSearch.state = '40'
					break
				case 'fifth':
					// 挂起
					this.formSearch.state = '20'
					this.formSearch.isHangUp = 1
					break
			}
			this.query()
		},
		// 取消挂起订单
		cancelHangUpOrder() {
			// this.$refs.payOrderList.clearSelection()
			this.$refs.payOrderList.showCancelModal()
		},
	}
}
</script>

<style lang="scss" scoped>

</style>
