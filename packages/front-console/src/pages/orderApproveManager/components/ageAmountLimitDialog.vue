<template>
	<el-dialog
		:visible.sync="visible"
		title="月额度"
		width="400px"
		class="order-approve-dialog"
		>
		<div class="mount-wrap">
			<label>当前额度：<edit-item v-model.trim.number="ageMonthLimitForm.ageAmountMonthLimit"></edit-item></label>
			<el-button type="text" size="small" @click="showAgeMonthLimitComment = !showAgeMonthLimitComment">备注</el-button>
		</div>
		<el-input
			v-if="showAgeMonthLimitComment"
			v-model.trim="ageMonthLimitForm.remark"
			size="small"
			placeholder="请输入备注"
			style="margin-bottom: 22px;"
		></el-input>
		<div style="text-align: right;">
			<el-button size="small" @click="visible = false">取 消</el-button>
			<el-button size="small" type="primary" @click="handleSumbit">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import {get, post} from "../../../store/api"
import editItem from './editItem.vue'

export default {
	name: 'ageAmountLimitDialog',
	components: {
		editItem,
	},
	props: ['order'],
	data() {
		return {
			visible: false,
			ageMonthLimitForm: {
				ageAmountMonthLimit: 0,
				accountNo: '',
				customerCompanyId: '',
				idCard: '',
				name: '',
				serviceCompanyId: '',
				remark: '',
			},
			showAgeMonthLimitComment: false,
		}
	},
	computed: {
	},
	watch: {
		order(val) {
			this.approveForm = Object.assign({
				id: val.id,
				approveState: '',
				approveComment: '超龄/低龄发放审批不通过',
			})
			this.ageMonthLimitForm = Object.assign({
				accountNo: val.accountNo,
				customerCompanyId: val.companyId,
				idCard: val.idCard,
				name: val.accountName,
				serviceCompanyId: val.serviceCompanyId,
				ageAmountMonthLimit: 0,
				remark: '',
			})
		},
	},
	methods: {
		openDialog() {
			this.getAgeAmountMonthLimit().then(() => {
				this.visible = true
			})
		},
		closeDialog() {
			this.visible = false
			this.$emit('close')
		},
		// 查询个人超龄风控限额
		getAgeAmountMonthLimit() {
			const url = '/api/risk-mgt-service/person-risk/query-person-age-month-limit'
			const {companyId, idCard, accountName, serviceCompanyId} = this.order
			return post(url, {
				customerCompanyId: companyId,
				name: accountName,
				idCard,
				serviceCompanyId,
			}).then((data) => {
				this.ageMonthLimitForm.ageAmountMonthLimit = data
			})
		},
		updataAgeAmountMonthLimit() {
			const url = '/api/risk-mgt-service/person-risk/update-person-age-month-limit'
			return post(url, this.ageMonthLimitForm)
		},
		handleSumbit() {
			this.updataAgeAmountMonthLimit().then(() => {
				this.visible = false
				this.$emit('success')
			})
		}
	},
}
</script>

<style lang="scss">
.order-approve-dialog {
	.mount-wrap {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
		background: #f9f9f9;
		padding: 6px 12px;
		margin-bottom: 22px;
	}
	.pass-tip {
		color: #909399;
		font-size: 13px;
		min-height: 32px;
		line-height: 16px;
		
		span {
			display: inline-block;
			padding-top: 8px;
			font-size: 14px;
		}
	}
}

</style>