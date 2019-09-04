<template>
	<div style="margin: 15px 0;background-color: #fff; padding: 15px;">
		<el-tabs v-model="activeName">
			<el-tab-pane label="发票申请开关配置" name="invoice"></el-tab-pane>
			<el-tab-pane label="发放开关配置" name="business"></el-tab-pane>
		</el-tabs>
		<keep-alive>
			<invoice-risk v-if="activeName === 'invoice'"></invoice-risk>
			<customer-business-risk v-else-if="activeName === 'business'"></customer-business-risk>
		</keep-alive>
	</div>
</template>

<script>
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
	methods: {
		// handleClick(instance) {
		// 	console.log(instance)
		// }
	},
}
</script>
