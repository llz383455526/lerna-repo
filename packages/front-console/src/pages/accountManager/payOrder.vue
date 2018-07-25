<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0 0 20px;">发放流水记录</div>

        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="全部" name="first"></el-tab-pane>
            <el-tab-pane label="支付成功" name="second"></el-tab-pane>
            <el-tab-pane label="支付中" name="third"></el-tab-pane>
            <el-tab-pane label="支付失败" name="fourth"></el-tab-pane>
        </el-tabs>

        <el-form :inline="true" :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="客户名称:" size="small">
                <el-select filterable style="width: 150px" v-model="formSearch.appName" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in customNameList" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户订单号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.outOrderNo" placeholder="客户订单号"></el-input>
            </el-form-item>
            <el-form-item label="发放渠道:" size="small">
                <el-select style="width: 150px" v-model="formSearch.paymentThirdType" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in selectList2" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发放方式:" size="small">
                <el-select style="width: 150px" v-model="formSearch.sourceType" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in sourceTypeList" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道交易流水号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.paymentThirdTradeNo" placeholder="渠道交易流水号"></el-input>
            </el-form-item>
            <el-form-item label="收款人姓名:" size="small">
                <el-input style="width: 150px" v-model="formSearch.accountName" placeholder="收款人姓名"></el-input>
            </el-form-item>
            <el-form-item label="收款账号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.accountNo" placeholder="收款账号">
                </el-input>
            </el-form-item>
            <el-form-item label="交易状态:" size="small" v-if="activeTab === 'first'">
                <el-select style="width: 150px" v-model="formSearch.stateName" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option label="支付成功" value="30"></el-option>
                    <el-option label="支付失败" value="40"></el-option>
                    <el-option label="支付中" value="20"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请求起止时间:" size="small">
                <el-date-picker v-model="dateValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
			<el-form-item label="发放时间:" size="small">
                <el-date-picker v-model="paymentResTime" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
                <el-button size="small" @click="exportXls">导出xls</el-button>
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
                <el-table-column prop="appName" label="客户名称" width="140" fixed></el-table-column>
                <el-table-column prop="outOrderNo" label="客户订单号" width="120"></el-table-column>
                <el-table-column prop="serviceCompanyName" label="服务公司" width="140"></el-table-column>
                <el-table-column prop="paymentThirdTypeName" label="发放渠道" width="80"></el-table-column>
                <el-table-column prop="sourceTypeName" label="发放方式" width="80"></el-table-column>sourceTypeName
                <el-table-column prop="paymentThirdTradeNo" label="渠道交易流水号" width="120"></el-table-column>
                <el-table-column prop="createAt" label="请求时间" width="160">
                    <template slot-scope="scope">
                        <span>{{scope.row.createAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="accountName" label="收款人姓名" width="100"></el-table-column>
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
                    <!--<template slot-scope="scope">-->
                    <!--<span>{{scope.row.costTime | formatTimes()}}</span>-->
                    <!--</template>-->
                </el-table-column>
                <el-table-column prop="notifyStateName" label="通知用户状态" width="120"></el-table-column>
            </el-table>
        </div>

        <ayg-pagination v-if="flowTableList.total" :total="flowTableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
    </div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import {showConfirm} from '../../plugin/utils-message'
	import {formatTime} from '../../plugin/utils-functions'
	import {baseUrl} from '../../config/address'
	import {post, get} from '../../store/api'

	export default {
		data() {
			return {
				pageSize: 10,
				currentPage: 1,
				currentChangeBySetting: false,
				formSearch: {
					appName: '',
					outOrderNo: '',
					paymentThirdTypeName: '',
					paymentThirdTradeNo: '',
					createAt: '',
					accountName: '',
					accountNo: '',
					account: '',
					stateName: '',
					paymentResDesc: '',
					paymentThirdType: '',
					sourceType: ''
				},
				dateValue: '',
				paymentResTime:'',
				selectList2: [],
				sourceTypeList: [],
				activeTab: 'first'
			}
		},
		computed: {
			...mapGetters({
				flowTableList: 'flowTableList',
				customNameList: 'customNameList',
				moneyFlow: 'moneyFlow'
			})
		},
		methods: {
			getSourceType() {
				get('/api/console-dlv/option/get-by-type', {
					type: 'PayOrderSourceType'
				}).then(result => {
					this.sourceTypeList = result
				})
			},
			search() {
				// this.currentChangeBySetting = true;
				this.currentPage = 1;
				this.requestAction({
					page: 1,
					pageSize: this.pageSize,
				});
			},
			clear() {
				this.formSearch.appName = '';
				this.formSearch.outOrderNo = '';
				this.formSearch.paymentThirdTypeName = '';
				this.formSearch.paymentThirdTradeNo = '';
				this.formSearch.createAt = '';
				this.formSearch.accountName = '';
				this.formSearch.accountNo = '';
				this.formSearch.account = '';
				if(this.activeTab === 'first') this.formSearch.stateName = '';
				this.formSearch.paymentResDesc = '';
				this.dateValue = '';
				this.paymentResTime = '';
				this.formSearch.paymentThirdType = '';
				this.formSearch.sourceType = ''
			},
			exportXls() {
				let createAtBegin = '';
				let createAtEnd = '';
				let paymentResTimeBegin = '';
				let paymentResTimeEnd = '';
				
				if (this.dateValue) {
					createAtBegin = formatTime(this.dateValue[0], 'yyyy-MM-dd');
					createAtEnd = formatTime(this.dateValue[1], 'yyyy-MM-dd');
				}
				if (this.paymentResTime) {
					paymentResTimeBegin = formatTime(this.paymentResTime[0], 'yyyy-MM-dd');
					paymentResTimeEnd = formatTime(this.paymentResTime[1], 'yyyy-MM-dd');
				}
				window.location.href = baseUrl + '/api/console-dlv/pay-order/export-item?appId=' + this.formSearch.appName
					+ '&outOrderNo=' + this.formSearch.outOrderNo
					+ '&paymentThirdTypeName=' + this.formSearch.paymentThirdTypeName
					+ '&paymentThirdTradeNo=' + this.formSearch.paymentThirdTradeNo
					+ '&createAtBegin=' + createAtBegin
					+ '&createAtEnd=' + createAtEnd
					+ '&paymentResTimeBegin=' + paymentResTimeBegin
					+ '&paymentResTimeEnd=' + paymentResTimeEnd
					+ '&accountName=' + this.formSearch.accountName
					+ '&accountNo=' + this.formSearch.accountNo
					+ '&account=' + this.formSearch.account
					+ '&state=' + this.formSearch.stateName
					+ '&paymentResDesc=' + this.formSearch.paymentResDesc
					+ "&paymentThirdType=" + this.formSearch.paymentThirdType
					+ "&sourceType=" + this.formSearch.sourceType;
			},
			handleSizeChange(value) {
				this.pageSize = value;
				/*if (this.currentPage == 1) {
                    this.requestAction({
                        page: 1,
                        pageSize: value,
                    });
                } else {
                    this.currentPage = 1;
                }*/
				this.currentPage = 1
				this.requestAction({
					page: 1,
					pageSize: value,
				})
			},
			handleCurrentChange(value) {
				this.currentPage = value;
				/*if (this.currentChangeBySetting) {
                    this.currentChangeBySetting = false;
                    return;
                }*/
				this.requestAction({
					page: value,
					pageSize: this.pageSize,
				});
			},
			requestAction(pageInfo) {
				let createAtBegin = '';
				let createAtEnd = '';
				let paymentResTimeBegin = '';
				let paymentResTimeEnd = '';
				if (this.dateValue) {
					createAtBegin = formatTime(this.dateValue[0], 'yyyy-MM-dd');
					createAtEnd = formatTime(this.dateValue[1], 'yyyy-MM-dd');
				}
				if (this.paymentResTime) {
					paymentResTimeBegin = formatTime(this.paymentResTime[0], 'yyyy-MM-dd');
					paymentResTimeEnd = formatTime(this.paymentResTime[1], 'yyyy-MM-dd');
				}
				let param = {
					appId: this.formSearch.appName,
					outOrderNo: this.formSearch.outOrderNo,
					paymentThirdTypeName: this.formSearch.paymentThirdTypeName,
					paymentThirdTradeNo: this.formSearch.paymentThirdTradeNo,
					createAtBegin: createAtBegin,
					createAtEnd: createAtEnd,
					paymentResTimeBegin: paymentResTimeBegin,
					paymentResTimeEnd: paymentResTimeEnd,
					accountName: this.formSearch.accountName,
					accountNo: this.formSearch.accountNo,
					account: this.formSearch.account,
					state: this.formSearch.stateName,
					paymentResDesc: this.formSearch.paymentResDesc,
					paymentThirdType: this.formSearch.paymentThirdType,
					sourceType: this.formSearch.sourceType,

					page: pageInfo.page,
					pageSize: pageInfo.pageSize,
				};
				this.$store.dispatch('getFlowTableList', param);
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
						this.formSearch.stateName = ''
						break
					case 'second':
						this.formSearch.stateName = '30'
						break
					case 'third':
						this.formSearch.stateName = '20'
						break
					case 'fourth':
						this.formSearch.stateName = '40'
						break
				}

				this.search()

			}
		},
		created: function () {
			this.requestAction({
				page: 1,
				pageSize: this.pageSize,
			});
			this.$store.dispatch('getCustomNameList');
			this.getSelectList2();

			this.getSourceType()
		},
	}
</script>

<style lang="scss" scoped>
</style>
