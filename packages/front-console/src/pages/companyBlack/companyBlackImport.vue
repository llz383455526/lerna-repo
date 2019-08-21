<template>
	<import-template
		ref="importTemplate"
		title="导入企业至黑名单列表"
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
					formLabel: '导入至',
					initialValue: '',
					options: [
						{   
							label: '企业黑名单',
							value: 'black',
							targetType: 'company_black_import'
						},
						{
							label: '企业监控列表',
							value: 'monitor',
							targetType: 'monitor',
						}
					]
				} 
			],
		}
	},
	methods: {
		// 下载按钮
		handleDownload() {
			const type = this.$refs.importTemplate.form.riskType
			console.log('download type: ' + type)
			if (!type) {
				this.$message({
					type: 'warning',
					message: '请选择模版类型'
				})
				return
			}
			this.downloadTempalte(type)
		},
		// 下载模版
		downloadTempalte(riskType) {
			// 企业黑名单模版
			if (riskType === 'black') {
				window.location.href = monitor.downloadCompanyBlackImportTemplate
			} else if (riskType === 'monitor') {
				window.location.href = '/assets/企业监控列表导入模版.xlsx'
			}
		},
		// 确认导入，处理formData
		handleImport({ form, fileList }) {
			// console.log('submit', { form, fileList })
			if (!form.riskType) {
				this.$message({
					type: 'warning',
					message: '请选择模版类型'
				})
				return
			}
			if (form.riskType === 'monitor') {
				this.specialMonitorImport(fileList)
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

		// 监控导入特殊处理
		specialMonitorImport(fileList) {
			const file = fileList[0]
			let formData = new FormData()
			formData.append('src_file', file.raw)
			formPost(monitor.monitorCompanyAddFromExl, formData).then(res => {
				const {insert_batch} = res
				this.$router.push({
					path: '/main/monitorCompany/monitorImportResult',
					query: {
						insert_batch,
					}
				})
			}).catch(() => {
				this.$refs.importTemplate.btnCanImport = true
			})
		},
		// 导入成功
		handleSuccess(taskId) {
			// 进入结果页面
			const { targetType } = this
			this.$router.push({
				path: 'companyBlackResult',
				query: {
					taskId,
					targetType,
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
