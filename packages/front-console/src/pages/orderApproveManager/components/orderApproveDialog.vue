<template>
	<el-dialog
		ref="orderApproveDialog"
		:visible.sync="approveDialogVisible"
		:title="title"
		width="400px"
		class="order-approve-dialog"
		>
		<div class="mount-wrap">
			<span>发放总流水：{{ amount | formatMoney }}</span>
			<el-button type="text" size="small" @click="go2OrderList">详情</el-button>
		</div>
		<el-form :model="formApprove">
			<el-form-item>
				<el-radio-group v-model="formApprove.approveState">
					<el-radio v-model="formApprove.approveState" :label="2">通过</el-radio>
					<el-radio v-model="formApprove.approveState" :label="3">不通过</el-radio>
				</el-radio-group>
				<div class="pass-tip">
					<span v-if="passTip && formApprove.approveState == 2">{{passTip}}</span>
				</div>
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
			},
			amount: 0,
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
		passTip() {
			if(this.order.approveType && this.order.approveType === 2) {
				return '审核通过的用户，会放入发放白名单，发放限额3星'
			}
			return ''
		}
	},
	watch: {
		order(val) {
			this.formApprove = Object.assign({
				id: val.id,
				approveState: '',
			})
		}
	},
	methods: {
		openDialog() {
			this.getAmount().then(() => {
				this.approveDialogVisible = true
			})
		},
		closeDialog() {
			this.approveDialogVisible = false
			this.$emit('close')
		},
		// 获取总金额
		getAmount() {
			const url = '/api/console-dlv/pay-order/get-person-amount'
			return new Promise((resolve, reject) => {
				const {accountName, idCard} = this.order
				const form = {
					idCard,
					name: accountName,
				}
				post(url, form).then((data) => {
					this.amount = data
					resolve()
				})
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
			post(url, this.formApprove).then(() => {
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
	}
	.pass-tip {
		color: #909399;
		font-size: 13px;
		min-height: 16px;
		line-height: 16px;
	}
}

</style>