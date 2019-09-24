<template>
	<div class="order-approve item-wrap">
		<template v-if="!isEdit">
			<span class="item-text">{{currentValue | formatMoney}}</span>
			<i class="el-icon-edit item-edit" @click="showEdit"></i>
		</template>
		<el-input ref="input" size="small" v-else v-model="currentValue"></el-input>
	</div>
</template>

<script>
export default {
	name: 'orderApproveEditItem',
	props: {
		value: {
			type: [Number, String],
			required: true,
		},
	},
	data() {
		return {
			isEdit: false,
			currentValue: this.value,
		}
	},
	watch: {
		value(val) {
			this.currentValue = val
		},
		currentValue(val) {
			this.$emit('input', val)
			this.$emit('change', val)
		},
	},
	mounted() {
		const el = document.querySelector('.order-approve.item-wrap')
		if (!this.__handler) {
			this.__handler = (e) => {
				// if ((el.contains(e.target) || e.target.className.indexOf('item-edit')) && this.isEdit) {
				// 	this.isEdit = false
				// 	console.log('read')
				// }
				if (el.contains(e.target)) {
					return
				} else if (e.target.className.indexOf('item-edit') > -1) {
					return
				} else if (this.isEdit) {
					this.isEdit = false
					console.log('read')
				}
			}
			document.addEventListener('click', this.__handler)
		}
	},
	beforeDestroy () {
		document.removeEventListener('click', this.__handler)
	},
	methods: {
		showEdit(e) {
			console.log('edit')
			console.log(e)
			this.isEdit = true
		}
		
	},
}
</script>

<style lang="less" scoped>
.item-wrap {
	display: inline-block;
	min-width: 10px;
	// &:hover .item-edit {
	// 	display: inline-block;
	// }
}
.item-edit {
	color: #0283FB;
	margin-left: 7px;
	cursor: pointer;
}
</style>