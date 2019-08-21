<template>
  <div style="margin: 15px 0;background-color: #fff; padding: 15px;">
    <div>
      <slot name="title">
        <p style="display: inline-block;">{{ title }}</p>
      </slot>
    </div>
    <div class="upload-wrap">
      <el-upload
				ref="upload"
				class="div-block upload-block"
				drag action=""
				:auto-upload="false"
				:on-change="handleChange"
				:on-remove="handleRemove"
				:multiple="false"
				:file-list="fileList"
				accept=".xlsx, .xls">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
      </el-upload>
      <el-form class="div-block">
        <el-form-item>
          <el-button type="text" @click="handleDownload">标准模版下载</el-button>
        </el-form-item>
        <el-form-item
					v-for="(item, index) in formItem"
					:key="index"
					:label="item.formLabel">
          <template v-if="item.type === 'radio'">
            <el-radio-group v-model="form[item.prop]">
              <el-radio
								v-for="option in item.options"
								:key="option.value"
								:label="option.value">{{option.label}}</el-radio>
            </el-radio-group>
          </template>
          <template v-if="item.type === 'checkbox'">
            <el-checkbox-group v-model="form[item.prop]">
              <el-checkbox
								v-for="option in item.options"
								:key="option.value"
								:label="option.value">{{option.label}}</el-checkbox>
            </el-checkbox-group>
          </template>
        </el-form-item>
      </el-form>
    </div>
    <div class="btn-wrap">
      <el-button
				type="primary"
				@click="handleImport"
				:loading="!btnCanImport"
			>确定导入</el-button>
    </div>
    <div class="import-tips">
      <p>步骤</p>
      <p>1、首先下载标准模版；</p>
      <p>2、按模版中的格式编辑好数据：切勿增减调整列，以免引起数据混乱；请填写企业数据源，方便您以后查找和管理。</p>
      <p>3、选择编辑好的文件，点击上传文件；</p>
      <p>注意事项和常见问题</p>
      <p>1、以当前页面新下载的模版为准，建议使用office 2003或更高版本的办公软件打开，以避免导出数据错乱的问题；</p>
      <p>2、提示多少条导入失败：此时可以选择下载出错的数据，出错的表格中第一列会显示错误原因</p>
    </div>
  </div>
</template>

<script>
import { formPost, post } from '../store/api'

export default {
	props: {
		formItem: {
			type: Array,
		},
		title: {
			type: String,
		},
	},
	data() {
		return {
			fileList: [],
			form: {},
			isEnd: true,
			btnCanImport: true,
			referId: '',
			taskId: '',
			frame: '',
			pro: 0,
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
	created() {
		this.formItem.forEach(item => {
			const value = item.initialValue || ''
			this.$set(this.form, item.prop, value)
		})
	},
	methods: {
		// status:ready, uploading, success, fail
		// percentage: 进度
		handleFileStatus(status, percentage) {
			this.currentFile.status = status
			this.currentFile.percentage = percentage
		},
		handleChange(file, fileList) {
			this.fileList = fileList.slice(-1)
		},
		handleRemove(file, fileList) {
			this.fileList = fileList
		},
		handleDownload() {
			this.$emit('download')
		},
		handleImport() {
			const { form, fileList } = this
			if ( fileList.length <= 0) {
				this.$message({
					type: 'warning',
					message: '请上传文件'
				})
				return
			}
			this.$emit('import', { form, fileList })
		},
		handleSuccess() {
			this.$emit('success', this.taskId)
		},
		upload(formData) {
			this.btnCanImport = false
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
					console.log(this.pro)
					this.handleFileStatus('uploading', this.pro)
					this.$refs.upload.onProgress({percent: this.pro})
					if (this.pro == 100) {
						cancelAnimationFrame(this.frame)
						if(data.state == 30 || data.state == 20) {
							// 记录taskID, 
							this.taskId = data.taskId
							this.$message.success('导入成功')
							this.handleFileStatus('success', this.pro)
							this.btnCanImport = true
							this.handleSuccess()
						}
						if(data.state == 40) {
							this.$message({
								type: 'error',
								message: data.desc,
							})
							this.handleFileStatus('fail', this.pro)
							this.btnCanImport = true
						}
					}
				})
			}
		},
	},
}
</script>

<style lang="scss">
.upload-wrap {
	margin-top: 15px;
  background-color: #f9f9f9;
  padding: 20px 0;
}
.div-block {
  width: 500px;
  margin: 0 auto;

  &.upload-block {
    height: 223px;
  }
  .el-upload-dragger {
    width: 500px;
    background-color: #f9f9f9;
  }
  .pro_box {
    position: relative;
    display: inline-block;
    width: 193px;
    height: 10px;
    border: 1px solid #e9e9e9;
    border-radius: 5px;
    margin-top: 6px;
  }
  .pro_box > div {
    position: absolute;
    top: 1px;
    left: 0;
    height: 8px;
    border-radius: 4px;
    background-color: #108ee9;
  }
  .pro_box + span {
    margin-top: 6px;
    font-size: 12px;
    color: #999999;
  }
}

.btn-wrap {
  text-align: center;
  margin-top: 25px;
}

.import-tips {
  margin: 60px 0;
  p {
    color: #909399;
  }
}
</style>
