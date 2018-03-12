<template>
    <input class="my-uploader" id="myUploader" type="file" accept=".xlsx,.xls"/>
</template>

<script>
	//import { mapGetters } from 'vuex'
	import { showNotify } from '../plugin/utils-notify'
    import { importPost, post } from '../store/api'
    import { showLoading, hideLoading } from '../plugin/utils-loading'

    import _ from 'lodash'

	export default {
		name: "file-uploader",
		props: ['url', 'options', 'needProgress'],
		data() {
			return {
				selectedFile: false,
				uploadElement: false,
                interval: null,
                taskId: null
            }
        },
		mounted() {
			let el = this.$el
			this.uploadElement = el

			el.addEventListener('change', e => {
				let file = el.files[0]
				this.selectedFile = file

				let formData = new FormData()
                formData.append('fileName', file.name)
                formData.append('file', file)

                let keys = _.keys(this.options)
                _.forEach(keys, key => {
                	formData.append(key, this.options[key])
                })

                importPost(this.url, formData)
                    .then(result => {
                    	if(this.needProgress) {
		                    this.taskId = result
		                    this.getImportProgress()
                        }else {
		                    this.setUploadFile(result)
                    		this.resetElement()
                        }

                    })
            })
        },
        methods: {
            getImportProgress() {
	            showLoading({
                    text: '导入中'
	            })
                this.interval = window.setInterval(() => {
                	post('/import-task-progress/detail', {
                		id: this.taskId
                    }, true).then(result => {
                    	if(result.state === '30') {
		                    this.setUploadFile(result)
                            this.finishUpload()
                        }else if(result.state === '40') {
		                    showNotify('error', result.desc)
		                    this.finishUpload()
                        }
                    	/*if(result.state >= 30) {
                    		this.setUploadFile(result)
                            hideLoading()
                            this.resetElement()
                    		window.clearInterval(this.interval)
                        }*/
                    })
                }, 1000)
            },
            finishUpload() {
	            hideLoading()
	            this.resetElement()
	            window.clearInterval(this.interval)
            },
            resetElement() {
	            this.uploadElement.value = ''
	            this.selectedFile = false
            },
            setUploadFile(file) {
	            let fileDetail = file
	            fileDetail.fileName = this.selectedFile.name
	            this.$store.dispatch('setUploadFile', fileDetail)
            }
        }
	}
</script>

<style lang="scss" scoped>

    .my-uploader {
        width: 100%;
        height: 100%;
        opacity: 0;
        position: absolute;
        z-index: 99;
        left: 0;
        top: 0;
        cursor: pointer;
        overflow: hidden;
    }

</style>












