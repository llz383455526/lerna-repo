<template>
    <div>
    	<input class="my-uploader" id="myUploader" type="file" accept=".xlsx,.xls"/>
    	<el-dialog  title="文件进度条" :visible.sync="progressShow"  width="40%">
			<el-progress :text-inside="true" :stroke-width="18" :percentage="percent"></el-progress>
		</el-dialog>
    </div>
    
</template>

<script>
	//import { mapGetters } from 'vuex'
	import { showNotify } from '../plugin/utils-notify'
    import { importPost, post } from '../store/api'
    import { showLoading, hideLoading } from '../plugin/utils-loading'

    import _ from 'lodash'

	export default {
		name: "ayg-file-uploader",
		props: ['url', 'options', 'needProgress','progressUrl'],
		data() {
			return {
				selectedFile: false,
				uploadElement: false,
                interval: null,
                taskId: null,
                progressShow :false,
                percent:0,
            }
        },
		mounted() {
			let el = this.$el.childNodes[0]
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
                    		this.progressShow = true
		                    this.taskId = result.referId
		                    this.getImportProgress(this.progressUrl)
                        }else {
		                    this.setUploadFile(result)
                    		this.resetElement()
                        }

                    })
            })
        },
        methods: {
            getImportProgress(url) {
                this.interval = window.setInterval(() => {
                	post(url, {
                		id: this.taskId
                    }, false).then(result => {
                    	this.percent = result.progress
                    	if(result.state === 30) {
		                    this.setUploadFile(result)
                            this.finishUpload()
                        }else if(result.state === 40) {
		                    showNotify('error', result.desc)
		                    this.finishUpload()
                        }
                    })
                }, 2000)
            },
            finishUpload() {
            	setTimeout(() => {
                	this.progressShow = false
                },1000)
	            hideLoading()
	            this.resetElement()
	            window.clearInterval(this.interval)
            },
            resetElement() {
	            this.uploadElement.value = ''
	            this.selectedFile = false
            },
            setUploadFile(file) {
            	console.log(file)
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












