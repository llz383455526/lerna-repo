<template>
	<div>
		<el-table :data="data">
			<!-- 导入表 -->
			<template v-if="type === 'upload'">
				<el-table-column key="settlementNum" prop="settlementNum" label="结算单号"></el-table-column>
				<el-table-column key="actualMonth" prop="actualMonth" label="实发月份"></el-table-column>
				<el-table-column key="agentCompanyName" prop="agentCompanyName" label="渠道代理商名字"></el-table-column>
				<el-table-column key="settleCompanyName" prop="settleCompanyName" label="结算主体公司"></el-table-column>
				<el-table-column key="payAmount" prop="payAmount" label="本次支付金额">
					<template slot-scope="scope">
						<span>{{scope.row.payAmount | formatMoney}}</span>
					</template>
				</el-table-column>
				<el-table-column key="payMonth" prop="payMonth" label="支付日期">
					<template slot-scope="scope">
						<span>{{scope.row.payMonth | formatTime('yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<el-table-column key="payRemark" prop="payRemark" label="付款备注"></el-table-column>
				<el-table-column prop="validateResult" label="导入状态">
					<template slot-scope="scope">
						<span :style="{ color: scope.row.validateResult === '不通过' ? 'red' : 'inherit'}"
						>{{scope.row.validateResult}}</span>
					</template>
				</el-table-column>
				<el-table-column key="errMsg" prop="errMsg" label="错误信息">
					<template slot-scope="scope">
						<div style="color: red;" v-for="(val, name) in scope.row.errMsg" :key="name">{{val}}</div>
					</template>
				</el-table-column>
			</template>
			<!-- 业务表 -->
			<template v-else>
				<el-table-column key="id" prop="id" label="结算单号">
					<!-- 服了，单号还得是单独传过来的 -->
					<template slot-scope="scope">
						<span>{{ id }}</span>
					</template>
				</el-table-column>
				<el-table-column key="month" prop="month" label="实发月份">
					<!-- IE有问题，先不做转换 -->
					<!-- <template slot-scope="scope">
						<span>{{scope.row.month | formatTime('yyyy-MM')}}</span>
					</template> -->
				</el-table-column>
				<el-table-column key="agentCompanyName" prop="agentCompanyName" label="渠道代理商名字"></el-table-column>
				<el-table-column key="serviceCompanyName" prop="serviceCompanyName" label="结算主体公司"></el-table-column>
				<el-table-column key="amount" prop="amount" label="本次支付金额">
					<template slot-scope="scope">
						<span>{{scope.row.amount | formatMoney}}</span>
					</template>
				</el-table-column>
				<el-table-column key="payTime" prop="payTime" label="支付日期">
					<template slot-scope="scope">
						<span>{{scope.row.payTime | formatTime('yyyy-MM-dd')}}</span>
					</template>
				</el-table-column>
				<el-table-column key="payRemarks" prop="payRemarks" label="付款备注"></el-table-column>
			</template>
		</el-table>
	</div>
</template>

<script>
export default {
	// 同样的明细表，导入结果和业务数据的字段还不一样的。。。。
	props: {
		type: {
			validator(val) {
				return ['upload', 'pay'].indexOf(val) !== -1
			}
		},
		data: {
			type: Array,
			default() {
				return []
			},
		},
		// 结算单号
		id: [Number, String],
	},
}
</script>