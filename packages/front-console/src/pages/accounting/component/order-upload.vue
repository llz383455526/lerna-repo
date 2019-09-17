<template>
  <el-upload
    class="order-upload"
    :limit="1"
    action=""
    :file-list="fileList"
    :on-change="handleChange"
    :on-remove="handleRemove"
    :on-exceed="handleExceed"
    :multiple="false"
    :auto-upload="false"
    accept=".xlsx, .xls"
  >
    <el-button size="small" :disabled="!!this.fileList.length">点击上传</el-button>
  </el-upload>
</template>

<script>
import { formPost, post } from '../../../store/api'

export default {
  props: {
    targetType: {
      type: String,
      required: true,
    },
    autoUpload: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      fileList: [],
      referId: '',
      taskId: '',
      frame: '',
      pro: 0,
      isEnd: true,
    }
  },
  computed: {
		currentFile() {
			if (this.fileList.length > 0) {
				return this.fileList[0]
			} else {
				return ''
			}
		}
	},
  methods: {
    // status:ready, uploading, success, fail
		// percentage: 进度
		handleFileStatus(status, percentage) {
			this.currentFile.status = status
			this.currentFile.percentage = percentage
		},
    handleChange(file, fileList) {
			this.fileList = fileList
      if (this.autoUpload) {
        this.upload()
      }
		},
    handleRemove(file, fileList) {
			this.fileList = fileList
      if (this.frame) {
        cancelAnimationFrame(this.frame)
      }
      this.$emit('file-remove')
		},
    handleExceed(files, fileList) {
      this.$message({
        type: 'warning',
        message: '只允许上传单个文件',
      })
    },
    resetUpload() {
      this.fileList = []
      if (this.frame) {
        cancelAnimationFrame(this.frame)
      }
    },
    upload() {
      const formData = new FormData()
      formData.append('fileName', this.currentFile.name)
      formData.append('file', this.currentFile.raw)
      formData.append('targetType', this.targetType)
      formPost('/api/sysmgr-web/file/upload', formData).then(data => {
        // 记录下 referId
        this.referId = data.referId
        // 初始化文件进度条
        this.pro = 0
        this.handleFileStatus('uploading', this.pro)
        this.progress()
      })
    },
    progress() {
      this.frame = requestAnimationFrame(this.progress)
      if(this.isEnd && (!this.date || this.date < new Date().getTime() - 1000)) {
        this.isEnd = false
        post('/api/sysmgr-web/file/progress', {
          id: this.referId
        }, true).then(data => {
          this.isEnd = true
          this.date = new Date().getTime()
          // 调试用的
          // if (typeof data !== 'object') {
          //     cancelAnimationFrame(this.frame)
          //     this.handleFileStatus('fail', this.pro)
          //     this.btnCanImport = true
          //     this.handleSuccess()
          //     return
          // }
          // 
          this.pro = Number(data.progress)
          this.handleFileStatus('uploading', this.pro)
          if (this.pro == 100) {
            cancelAnimationFrame(this.frame)
            if(data.state == 30 || data.state == 20) {
              // 记录taskID, 
              this.taskId = data.taskId
              this.handleFileStatus('success', this.pro)
              this.$emit('upload-success', this.taskId)
            }
            if(data.state == 40) {
              this.handleFileStatus('fail', this.pro)
              this.$message({
                type: 'error',
                message: data.desc,
              })
              this.$emit('upload-fail')
            }
          }
        })
      }
    },
  },
}
</script>>