<template>
    <import-template
        ref="importTemplate"
        title="添加白名单"
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
                    formLabel: '选择场景事件',
                    initialValue: '',
                    options: [
                        {
                            label: '签约白名单',
                            value: 'sign-white',
                            targetType: 'person_sign_white_import',
                        },
                        {
                            label: '发放白名单',
                            value: 'deliver-white',
                            targetType: 'person_deliver_white_import',
                        }
                    ]
                },
            ],
        }
    },
    computed: {
        options() {
            return this.formItem[0].options
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
                    message: '请选择场景事件'
                })
                return
            }
            this.downloadPersonWhiteImportTemplate(type)
        },
        // 下载模版
        downloadPersonWhiteImportTemplate(personWhiteRiskType) {
            window.location.href = `${monitor.downloadPersonWhiteImportTemplate}?personWhiteRiskType=${personWhiteRiskType}`
        },
        // 确认导入，处理formData
        handleImport({ form, fileList }) {

						if (!form.riskType) {
								this.$message({
										type: 'warning',
										message: '请选择场景事件'
								})
								return
						}
            // 需要记录下白名单类型，传给结果页面。。。。
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
            const { targetType } = this
            console.log(taskId)
            this.$router.push({
                path: 'personWhiteResult',
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
