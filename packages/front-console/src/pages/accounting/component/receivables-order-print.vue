<template>
	<ayg-print ref="aygPrint">
		<template>
			<div class="receivables-order-print">
				<div class="print-head">
					<h1>客户对账单</h1>
					<h3>{{detail.customerCompanyName}}</h3>
				</div>
				<div class="print-content">
					<div class="print-form-head">
						<div style="flex: 4">
							<p>实发月份：{{detail.month}}</p>
							<p>落地服务商：{{detail.serviceCompanyName}}</p>
						</div>
						<div style="flex: 2">
							<p>对账单编号：{{detail.id}}</p>
							<p>交付人员：{{detail.deliveryPersonName}}</p>
						</div>
					</div>
					<table>
						<colgroup>
							<col width="14.8%">
							<col width="27.7%">
							<col width="14.8%">
							<col width="27.7%">
							<col width="14.8%">
						</colgroup>
						<thead>
							<tr>
								<th>项目序号</th>
								<th>费用组成</th>
								<th>事项</th>
								<th>结算金额（人民币）</th>
								<th>备注</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td>1</td>
								<td>应收绩效费总额</td>
								<td>实发</td>
								<td>{{detail.amount}}</td>
								<td></td>
							</tr>
							<tr>
								<td>2</td>
								<td>管理费比例</td>
								<td>费率</td>
								<td>{{detail.serviceFeeDescription}}</td>
								<td></td>
							</tr>
							<tr>
								<td>3</td>
								<td>应收管理费</td>
								<td>实发*费率</td>
								<td>{{detail.serviceFeeAmount}}</td>
								<td>
									<div style="text-align: left;">低于阶梯发放金额{{detail.lteAmount}};</div>
									<div style="text-align: left;">高于阶梯发放金额{{detail.gtAmount}};</div>
								</td>
							</tr>
							<tr>
								<td>4</td>
								<td>应收服务费(绩效费+管理费)</td>
								<td>实发+管理费</td>
								<td>{{detail.kpAmount}}</td>
								<td>项目1+项目3</td>
							</tr>
							<tr>
								<td>5</td>
								<td>已收到本月绩效费</td>
								<td>实发</td>
								<td>{{detail.amount}}</td>
								<td></td>
							</tr>
							<tr>
								<td>6</td>
								<td>本月实际收到管理费</td>
								<td>实发*预收费率</td>
								<td>{{currentReceiveServiceFeeAmount}}</td>
								<td></td>
							</tr>
							<tr>
								<td>7</td>
								<td>贵公司尚欠/(预收贵公司)管理费</td>
								<td></td>
								<td>{{preServiceFeeAmount}}</td>
								<td>项目4-项目5-项目6</td>
							</tr>
						</tbody>
					</table>
					<p>此对账单仅供做我司与贵公司对账使用，不做其他用途，如任意一方使用此函件另做他用均为无效函件。特此确认！</p>
				</div>
			</div>
		</template>
	</ayg-print>
</template>

<script>
import aygPrint from '../../../component/aygPrint.vue'
import { isNumber } from '../../../utils/reg'

export default {
	components: {
		aygPrint,
	},
	props: ['detail'],
	computed: {
		// null 当 0 处理
		currentReceiveServiceFeeAmount() {
			if (!this.detail) {
				return 0
			}
			let { serviceFeeAmount, notSettledServiceFeeAmount } = this.detail
			serviceFeeAmount = isNumber(serviceFeeAmount) ? serviceFeeAmount : 0
			notSettledServiceFeeAmount = isNumber(notSettledServiceFeeAmount) ? notSettledServiceFeeAmount : 0
			return (serviceFeeAmount - notSettledServiceFeeAmount).toFixed(2)
		},
		preServiceFeeAmount() {
			if (!this.detail) {
				return 0
			}
			let {kpAmount, amount} = this.detail
			kpAmount = isNumber(kpAmount) ? kpAmount : 0
			amount = isNumber(amount) ? amount : 0
			return (kpAmount - amount - this.currentReceiveServiceFeeAmount).toFixed(2)
		}
	},
	methods: {
		print() {
			this.$refs.aygPrint.writeIframe()
		}
	},
}
</script>

<style lang="less">
.receivables-order-print {
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

	h3 {
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
			padding: 14px 10px;
			font-size: 16px;
			border: 1px solid #8DADDC;
			text-align: center;
			font-size: 16px;
			font-weight: 400;
			color: #3B4655;
		}
	}
}
</style>