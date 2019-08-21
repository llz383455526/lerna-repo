<template>
	<import-template
		ref="importTemplate"
		title="导入个人黑名单"
		:formItem="formItem"
		@download="handleDownload"
		@import="handleImport"
		@success="handleSuccess"
	></import-template>
</template>

<script>
import { monitor } from '../../api/monitor'
import { formPost, post, get} from '../../store/api'
import ImportTemplate from '../../pageComponent/importTemplate'

export default {
	components: {
		ImportTemplate,
	},
	data() {
		return {
			formItem: [
				{
					type: 'radio',
					prop: 'riskType',
					formLabel: '选择类型',
					initialValue: '',
					options: [
						{
							label: '签约黑名单',
							value: 'sign-black',
							targetType: 'person_sign_black_import',
						},
						{
							label: '发放黑名单',
							value: 'deliver-black',
							targetType: 'person_deliver_black_import',
						}
					]
				}
			],
		}
	},
	methods: {
		// 下载按钮
		handleDownload() {
			const riskType = this.$refs.importTemplate.form.riskType
			console.log('download type: ' + riskType)
			if (!riskType) {
				this.$message({
					type: 'warning',
					message: '请选择类型'
				})
				return
			}
			this.downloadPersonBlackImportTemplate(riskType)
		},
		// 下载模版
		downloadPersonBlackImportTemplate(personBlackRiskType) {
			window.location.href = `${monitor.downloadPersonBlackImportTemplate}?personBlackRiskType=${personBlackRiskType}`
		},
		// 确认导入，处理formData
		handleImport({ form, fileList }) {

			if (!form.riskType) {
				this.$message({
					type: 'warning',
					message: '请选择类型'
				})
				return
			}

			this.targetType = this.getTargetType(form.riskType)

			const file = fileList[0]
			let formData = new FormData()
			formData.append('fileName', file.name)
			formData.append('file', file.raw)
			formData.append('targetType', this.targetType)
			this.$refs.importTemplate.upload(formData)
		},
		// 导入成功
		handleSuccess(taskId) {
			// 进入结果页面
			console.log(taskId)
			const { targetType } = this
			this.$router.push({
				path: 'personBlackResult',
				query: {
					taskId,
					targetType
				}
			})
		},
		getTargetType(riskType) {
			const { options } = this.formItem[0]
			const item = options.find((item) => {
				return item.value === riskType
			})
			return item.targetType
		},
	},
}
</script>

<style lang="scss">
</style>
