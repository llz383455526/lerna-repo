<template>
	<div style="margin: 15px 0;background-color: #fff; padding: 15px;">
		<el-tabs v-model="activeName">
			<el-tab-pane v-if="checkRight(permissions, 'risk-mgt-service:/invoice-risk-info/switch-list')" label="发票申请开关配置" name="invoice"></el-tab-pane>
			<el-tab-pane v-if="checkRight(permissions, 'risk-mgt-service:/company-business-risk/list-customer-business-risk')" label="发放开关配置" name="business"></el-tab-pane>
		</el-tabs>
		<keep-alive>
			<invoice-risk v-if="activeName === 'invoice' && checkRight(permissions, 'risk-mgt-service:/invoice-risk-info/switch-list')"></invoice-risk>
			<customer-business-risk v-else-if="activeName === 'business' && checkRight(permissions, 'risk-mgt-service:/company-business-risk/list-customer-business-risk')"></customer-business-risk>
		</keep-alive>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
import CustomerBusinessRisk from './customerBusinessRisk'
import InvoiceRisk from './invoiceRisk'

export default {
	components: {
		CustomerBusinessRisk,
		InvoiceRisk,
	},
	data() {
		return {
			activeName: 'invoice',
		}
  },
  computed: {
		...mapGetters({
			permissions: 'permissions',
			// userInformation: 'userInformation'
		})
	},
	methods: {
		// handleClick(instance) {
		// 	console.log(instance)
		// }
	},
}
</script>
