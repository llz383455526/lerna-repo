<template>
	<ayg-print ref="aygPrint">
		<template>
			<div class="commission-order-print">
				<div class="print-head">
					<h1>返佣结算对账单</h1>
					<h3>{{detail.agentCompanyName}}</h3>
				</div>
				<div class="print-content">
					<div class="print-form-head">
						<div style="flex: 2">
							<p>对账单编号：{{detail.id}}</p>
						</div>
						<div style="flex: 3">
							<p>落地服务商：{{detail.serviceCompanyName}}</p>
						</div>
					</div>
					<table>
						<colgroup>
							<col width="20%">
							<col width="20%">
							<col width="20%">
							<col width="20%">
						</colgroup>
						<tbody>
							<tr>
								<td>发放月份：</td>
								<td>{{detail.month}}</td>
								<td>结算方式：</td>
								<td>{{detail.currentSettleTypeText}}</td>
							</tr>
							<tr>
								<td>绩效费总金额：</td>
								<td>{{detail.amount}}</td>
								<td>返佣总金额：</td>
								<td>{{detail.commissionAmount}}</td>
							</tr>
							<tr>
								<td>本期返佣金额：</td>
								<td>{{detail.currentCommissionAmount}}</td>
								<td></td>
								<td></td>
							</tr>
							<tr>
								<td colspan="4">
									<h4>开票信息区</h4>
								</td>
							</tr>
							<tr>
								<td>公司名称：</td>
								<td colspan="3">{{invoiceInfo.name}}</td>
							</tr>
							<tr>
								<td>税号：</td>
								<td colspan="3">{{invoiceInfo.taxIdcd}}</td>
							</tr>
							<tr>
								<td>地址、电话：</td>
								<td colspan="3">{{invoiceInfo.address}} {{invoiceInfo.telephone}}</td>
							</tr>
							<tr>
								<td>银行开户名：</td>
								<td colspan="3">{{invoiceInfo.bankName}}</td>
							</tr>
							<tr>
								<td>银行账号：</td>
								<td colspan="3">{{invoiceInfo.bankAccount}}</td>
							</tr>
							<tr>
								<td colspan="4">
									<div style="height: 200px;"></div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</template>
	</ayg-print>
</template>

<script>
import aygPrint from '../../../component/aygPrint.vue'

export default {
	components: {
		aygPrint,
	},
  props: {
    detail: {
      type: Object,
      required: true,
    },
  },
  computed: {
    invoiceInfo() {
      if (this.detail.invoiceInfo) {
        return this.detail.invoiceInfo
      }
      return {}
    },
  },
 	methods: {
		print() {
			this.$refs.aygPrint.writeIframe()
		}
	},
}
</script>

<style lang="less">
.commission-order-print {
	height: 100%;
	padding: 0 34px;
  background-color: white;
	.print-head {
    text-align: center;
    color: #2B3346;
    background-color: white;
    padding: 36px 0 20px;
    border-bottom: 1px solid #3F74C4;

		p {
			white-space: nowrap;
		}
  }
	h1 {
		font-size: 32px;
		margin: 0 0 10px;
	}

	h3, h4 {
		font-size: 19px;
		margin: 0;
	}

	p, span {
		font-size: 15px;
		color: #3B4655;
	}
	.print-content {
		padding: 5px 0;
	}

	.print-form-head {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: flex-end;
	}

	table {
		width: 100%;
		border-collapse: collapse;
		thead {
			background-color: #F0F6FE;
		}
		tbody {
			background-color: white;
		}
		th,td {
			padding: 14px 20px;
			font-size: 16px;
			border: 1px solid #8DADDC;
			text-align: left;
			font-size: 16px;
			font-weight: 400;
			color: #3B4655;
		}
	}
}
</style>