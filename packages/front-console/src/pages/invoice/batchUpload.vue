<template>
    <div class="content">
        <div>本地上传</div>
        <div class="mtitle">下载模板</div>
        <div>
            <a class="download" href="/api/invoice-web/invoice/download-invoice-import-template" download="导入模板.xlsx" target="_blank">
                <el-button size="small">
                    下载模板
                </el-button>
            </a>
            <span>发票批量申请下载模板</span>
        </div>
        <div class="mtitle">上传发票申请文件</div>
        <div>
            <el-upload
              class="form_input"
              :action="`/api/econtract/template/parsefile`"
              :auto-upload="false"
              :on-change="upload"
              :on-remove="remove"
              :multiple="false"
              :show-file-list="false"
              accept=".xlsx, .xls">
                <div class="up_icon">
                    <div>点击这里上传</div>
                    <div>请上传小于5M的xls或xlsx格式文件</div>
                </div>
            </el-upload>
            <template v-if="pro">
                <div class="pro_box">
                    <div :style="{ 'width': `${pro}%` }"></div>
                </div>
                <span>{{pro}}%</span>
            </template>
        </div>
        <div class="footer">
            <el-button size="small" @click="back()">取消</el-button>
            <el-button size="small" type="primary" @click="sure" :class="{disable: !taskId}">确认</el-button>
        </div>
    </div>
</template>
<script>
import { post, get, importPost } from "../../store/api"
export default {
    data() {
        return {
            pro: 0,
            referId: '',
            frame: '',
            date: '',
            taskId: '',
            isEnd: true
        }
    },
    methods: {
        upload(a) {
            var formData = new FormData()
            formData.append('targetType', 'invoice_apply_import')
            formData.append('fileName', a.name)
            formData.append('file', a.raw)
            importPost('/api/sysmgr-web/file/upload', formData, true).then(data => {
                this.referId = data.referId
                this.progress()
                console.log(data)
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
                    this.pro = data.progress
                    console.log(data.progress)
					if (this.pro == 100) {
                        cancelAnimationFrame(this.frame)
						if(data.state == 30 || data.state == 20) {
		    				this.taskId = data.taskId;
							this.$message({
                		    	type: 'success',
                		    	message: '上传成功！'
							})
						}
						if(data.state == 40) {
							this.$message.error(data.desc)
						}
					}
				})
			}
		},
        remove() {

        },
        back() {
            this.$router.back()
        },
        sure() {
            if(!this.taskId) {
                return
            }
            this.$router.push(`batchApply?importTaskId=${this.taskId}`)
        }
    }
}
</script>
<style scoped>
.content {
    background-color: #fff;
    padding: 20px 30px;
}
.content > div:nth-child(1) {
    font-size: 24px;
}
.mtitle {
  font-size: 16px;
  color: #333;
  text-indent: 15px;
  margin-top: 30px;
  margin-bottom: 30px;
  position: relative;
}
.mtitle::after {
  content: "";
  position: absolute;
  left: 0;
  top: 4px;
  width: 4px;
  height: 15px;
  background: #108EE9;
}
.mtitle + div {
    padding-left: 30px;
}
.download + span {
  font-size: 14px;
}
.form_input {
    width: 400px;
}
.up_icon {
    width: 228px;
    height: 124px;
    background-image: url(../../image/upload.png);
    background-size: 41px 33px;
    background-position: center 20px;
    background-repeat: no-repeat;
    padding-top: 70px;
    border: 1px solid #D9D9D9;
}
.up_icon > div:nth-child(1) {
    text-align: center;
    font-size: 12px;
    color: #666666;
}
.up_icon > div:nth-child(2) {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
.pro_box {
	position: relative;
	display: inline-block;
	width: 193px;
	height: 10px;
	border: 1px solid #E9E9E9;
	border-radius: 5px;
	margin-top: 6px;
}
.pro_box > div {
	position: absolute;
	top: 1px;
	left: 0;
	height: 8px;
	border-radius: 4px;
	background-color: #108EE9;
}
.pro_box + span {
	margin-top: 6px;
	font-size: 12px;
	color: #999999;
}
.footer {
    margin-top: 30px;
}
.disable {
    cursor: not-allowed;
    filter: grayscale(1);
}
</style>
