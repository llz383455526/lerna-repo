<template>
	<div class="bg-white p15">
		<el-tabs v-model="activeName">
			<el-tab-pane label="大额发放审批" name="1"></el-tab-pane>
			<el-tab-pane label="超龄发放审批" name="2"></el-tab-pane>
		</el-tabs>
		<el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
      <el-form-item label="客户名称" size="small" prop="companyId">
        <el-select v-model="formSearch.companyId" filterable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in customerCompanyList" :key="item.value" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="落地公司" size="small" prop="serviceCompanyId">
        <el-select v-model="formSearch.serviceCompanyId" filterable>
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in serviceCompanyList" :key="item.value" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发放渠道" size="small" prop="paymentThirdType">
        <el-select v-model="formSearch.paymentThirdType" placeholder="请选择" style="width:100%;">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in paymentThirdTypeList" :key="item.value" :label="item.text" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="收款人" size="small" prop="accountName">
        <el-input v-model="formSearch.accountName"></el-input>
      </el-form-item>
      <el-form-item label="收款账号" size="small" prop="accountNo">
        <el-input v-model="formSearch.accountNo"></el-input>
      </el-form-item>
      <el-form-item label="处理状态" size="small" prop="approveState">
        <el-select v-model="formSearch.approveState" placeholder="请选择" style="width:100%;">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in approveStateList" :key="item.value" :label="item.text" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="提交时间:" size="small">
        <el-date-picker v-model="dateValue" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <el-form-item style="margin-top: -4px">
        <el-button type="primary" @click="getApproveList" size="small">查询</el-button>
        <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
      </el-form-item>
    </el-form>
		<el-table :data="tableData.list">
      <el-table-column key="outOrderNo" prop="outOrderNo" label="客户订单号" width="180"></el-table-column>
      <el-table-column key="companyName" prop="companyName" label="客户名称" width="200"></el-table-column>
      <el-table-column key="serviceCompanyName" prop="serviceCompanyName" label="落地公司" width="200"></el-table-column>
      <el-table-column key="paymentThirdTypeName" prop="paymentThirdTypeName" label="发放渠道"></el-table-column>
      <el-table-column key="accountName" prop="accountName" label="收款人"></el-table-column>
      <el-table-column key="accountNo" prop="accountNo" label="收款账号" width="180"></el-table-column>
      <el-table-column key="idCard" prop="idCard" label="身份证号" width="180"></el-table-column>
			<el-table-column v-if="activeName === '2'" key="age" prop="age" label="年龄" width="100"></el-table-column>
      <el-table-column key="amount" prop="amount" label="交易金额" width="150">
				<template slot-scope="scope">
          <span>{{scope.row.amount | formatMoney}}</span>
        </template>
			</el-table-column>
      <el-table-column key="createAt" prop="createAt" label="提交时间" width="180">
        <template slot-scope="scope">
          <span>{{scope.row.createAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column key="approveStateName" prop="approveStateName" label="处理状态"></el-table-column>
			<el-table-column key="approveComment" prop="approveComment" label="备注" width="120"></el-table-column>
			<el-table-column key="" prop="approveAt" label="记录" width="180">
				<template slot-scope="scope">
          <span>
						{{scope.row.approveByName}}<br />
            {{scope.row.approveAt | formatTime('yyyy-MM-dd hh:mm:ss')}}
          </span>
        </template>
			</el-table-column>
      <el-table-column key="action" label="操作" width="180" fixed="right">
        <template slot-scope="scope">
          <el-button
						type="text"
						v-if="scope.row.approveState == 1"
						@click="openApproveDialog(scope.row)"
					>审批</el-button>
					<el-button
						v-if="activeName === '2'"
						type="text"
						@click="openAgeAmountLimitDialog(scope.row)"
					>月额度</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ayg-pagination
			v-if="tableData.total"
			:total="tableData.total"
			@handleCurrentChange="getApproveList"
			@handleSizeChange="handleSizeChange"
			:currentPage="formSearch.page">
    </ayg-pagination>
		<order-approve-dialog
			ref="orderApproveDialog"
			:order="selectedOrder"
			@success="handleActionSuccess"
		></order-approve-dialog>
		<age-amount-limit-dialog
			ref="ageAmountLimitDialog"
			:order="selectedOrder"
			@success="handleActionSuccess"
		></age-amount-limit-dialog>
	</div>
</template>

<script>
import {get, post} from "../../store/api"
import orderApproveDialog from './components/orderApproveDialog.vue'
import ageAmountLimitDialog from './components/ageAmountLimitDialog.vue'

/**
 * 后续业务发展，可能会出现不同业务不同表格，
 */

export default {
	components: {
		orderApproveDialog,
		ageAmountLimitDialog,
	},
	data() {
		return {
			activeName: '1',
			formSearch: {
				// 需要传多一个类型参数
				approveType: 1,
				companyId: '',
				serviceCompanyId: '',
				approveState: '',
				paymentThirdType: '',
				accountName: '',
				accountNo: '',
				createAtBegin: '',
				createAtEnd: '',
				pageSize: 10,
				page: 1,
			},
			dateValue: '',
			tableData: {
				total: 0,
				list: [],
			},
			selectedOrder: {},
			customerCompanyList: [],
			serviceCompanyList: [],
			paymentThirdTypeList: [],
			approveStateList: [],
		}
	},
	watch: {
		activeName(val) {
			this.formSearch.approveType = Math.floor(val)
			this.resetForm('formSearch')
			this.getApproveList()
		}
	},
	created() {
		this.getCustomerCompanyList()
		this.getServiceCOmpanyList()
		this.getThirdPaymentType()
		this.getPayOrderApproveState()
	},
	mounted() {
		this.getApproveList()
	},
	methods: {
		// 获取审批列表
		getApproveList(page) {
			const url = '/api/console-dlv/pay-order/query-approve-list'
			if(isNaN(page)) {
				page = 1
			}
			this.formSearch.page = page
			if (!this.dateValue) {
				this.formSearch.createAtBegin = ''
				this.formSearch.createAtEnd = ''
			} else {
				this.formSearch.createAtBegin = this.dateValue[0]
				this.formSearch.createAtEnd = this.dateValue[1]
			}
			post(url, this.formSearch).then(data => {
				this.tableData = data
			})
		},
		handleSizeChange(size) {
			this.formSearch.pageSize = size
			this.getApproveList()
		},
		// 清空
		resetForm(formName) {
			this.$refs[formName].resetFields()
			this.dateValue = ''
			this.formSearch.createAtBegin = ''
			this.formSearch.createAtEnd = ''
		},
		// 审批按钮
		openApproveDialog(row) {
			this.selectedOrder = Object.assign({}, row)
			this.$nextTick(() => {
				this.$refs.orderApproveDialog.openDialog()
			})
		},
		// 超龄风控限额
		openAgeAmountLimitDialog(row) {
			this.selectedOrder = Object.assign({}, row)
			this.$nextTick(() => {
				this.$refs.ageAmountLimitDialog.openDialog()
			})
		},
		handleActionSuccess() {
			this.getApproveList()
		},
		// 客户公司
		getCustomerCompanyList() {
			get('/api/sysmgr-web/commom/company', {
				companyIdentity: 'custom'
			}).then(data => {
				this.customerCompanyList = data
			})
		},
		// 服务公司
		getServiceCOmpanyList() {
			get('/api/sysmgr-web/commom/company', {
				companyIdentity: 'service'
			}).then(data => {
				this.serviceCompanyList = data
			})
		},
		// 发放渠道
		getThirdPaymentType() {
			const url = '/api/console-dlv/option/get-by-types'
			get(url, {type: 'ThirdPaymentType'}).then(data => {
				this.paymentThirdTypeList = data.ThirdPaymentType;
			})
		},
		// 审批状态
		getPayOrderApproveState() {
			const url = '/api/console-dlv/option/get-by-types'
			get(url, {type: 'PayOrderApproveState'}).then(data => {
				this.approveStateList = data.PayOrderApproveState;
			})
		},
	},
}
</script>