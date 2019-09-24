<template>
	<el-dialog
		:visible.sync="approveDialogVisible"
		:title="title"
		width="400px"
		class="order-approve-dialog"
		>
		<div class="mount-wrap">
			<span>发放总流水：{{ amount | formatMoney }}</span>
			<el-button type="text" size="small" @click="go2OrderList">详情</el-button>
		</div>
		<div v-if="order.approveType === 2" class="mount-wrap">
			<span>当前额度：{{ ageAmountMonthLimit | formatMoney }}</span>
		</div>
		<el-form ref="formApprove" :model="formApprove" size="small">
			<el-form-item prop="approveState">
				<el-radio-group v-model="formApprove.approveState">
					<el-radio :label="2">通过</el-radio>
					<el-radio :label="3">不通过</el-radio>
				</el-radio-group>
				<div class="pass-tip">
					<!-- <span v-if="passTip && formApprove.approveState === 2">{{passTip}}</span> -->
					<el-input
						v-if="formApprove.approveState === 3"
						v-model.trim="formApprove.approveComment"
						size="small"
						maxlength="50"
						placeholder="请输入审批不通过原因"></el-input>
				</div>
			</el-form-item>
			<el-form-item>
				
			</el-form-item>
		</el-form>
		<div style="text-align: right;">
			<el-button size="small" @click="approveDialogVisible = false">取 消</el-button>
			<el-button size="small" type="primary" @click="handleSumbit">确 定</el-button>
		</div>
	</el-dialog>
</template>

<script>
import {get, post} from "../../../store/api"

export default {
	name: 'orderApproveDialog',
	props: ['order'],
	data() {
		return {
			approveDialogVisible: false,
			formApprove: {
				id: '',
				approveState: '',
				approveComment: '',
			},
			amount: 0,
			ageAmountMonthLimit: 0,
		}
	},
	computed: {
		title() {
			if (!this.order.approveType) {
				return ''
			}
			if (this.order.approveType === 1)  {
				return '大额发放审核'
			} else if (this.order.approveType === 2) {
				return '超龄发放审批'
			}
		},
		// passTip() {
		// 	if (this.order.approveType && this.order.approveType === 2) {
		// 		return '审核通过的用户，会放入发放白名单，发放限额3星'
		// 	}
		// 	return ''
		// },
		// 各发放审批的默认备注文案
		defaultApproveComment () {
			const {order, formApprove} = this
			if (order.approveType === 1) {
				return '大额审批不通过'
			} else if (order.approveType === 2) {
				return '超龄/低龄发放审批不通过'
			} else {
				return ''
			}
		}
	},
	watch: {
		order(val) {
			this.formApprove = Object.assign({
				id: val.id,
				approveState: '',
				approveComment: this.defaultApproveComment,
			})
		}
	},
	methods: {
		openDialog() {
			Promise.all([this.getAmount(), this.getAgeAmountMonthLimit()]).then(() => {
				this.approveDialogVisible = true
			})
			// this.getAmount().then(() => {
			// })
		},
		closeDialog() {
			this.approveDialogVisible = false
			this.$emit('close')
		},
		// 获取总金额
		getAmount() {
			const url = '/api/console-dlv/pay-order/get-person-amount'
			const {accountName, idCard} = this.order
			const form = {
				idCard,
				name: accountName,
			}
			return post(url, form).then((data) => {
				this.amount = data
			})
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
				this.ageAmountMonthLimit = data
			})
		},
		// 详情跳转
		go2OrderList() {
			this.$router.push({
				path: '/main/accountManager/payOrder',
				query: {
					accountName: this.order.accountName,
					idCard: this.order.idCard,
					// 测试反馈这里过去的订单需要是支付成功的
					state: '30',
				}
			})
			// 先暂时这么处理，解决蒙层问题
			this.closeDialog()
		},
		handleSumbit() {
			if (!this.formApprove.approveState) {
				this.$message({
					type: 'warning',
					message: '请选择',
				})
				return
			}
			const url = '/api/console-dlv/pay-order/approve'
			const form = Object.assign({},this.formApprove)
			// 产品要求 通过默认不传备注
			form.approveComment = form.approveState === 3 ? form.approveComment : ''
			post(url, form).then(() => {
				this.approveDialogVisible = false
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
		}
	}
}

</style>