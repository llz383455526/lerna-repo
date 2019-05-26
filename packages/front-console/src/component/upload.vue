<template>
    <div>
        <el-dialog title="导入" :visible.sync="show" @open="pro = 0" width="800px">
            <div class="dbox">
                <div class="ditem">
                    <div>下载模板文件：</div>
                    <div>
                        <a class="abtn" :href="uploadDowload" :download="uploadTitle+'.xlsx'" target="_blank">下载模板</a>
                        <div>请先下载{{uploadTitle}}</div>
                    </div>
                </div>
                <div class="ditem">
                    <div>上传文件导入：</div>
                    <div>
                        <el-upload
                            class="form_input"
                            action=""
                            :auto-upload="false"
                            :on-change="upload"
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
                </div>
            </div>
            <span slot="footer">
                <el-button size="small" @click="close">关闭</el-button>
                <el-button type="primary" size="small" @click="close">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { post, formPost } from '../store/api'

export default {
    data() {
        return {
            pro: 0,
            frame: '',
            isEnd: true,
            date: 0
        }
    },
    props: {
        show: {
            default: false,
            type: Boolean,
        },
        uploadTitle: {
            type: String,
            default: 'C端客户导入模版'
        },
        uploadDowload: {
            type: String,
            default: '/api/sysmgr-web/client-user/download-client-user-import-template'
        },
        targetType: {
            type: String
        },
    },
    methods: {
        upload(a) {
            var form = new FormData();
            form.append('fileName', a.name);
            form.append('file', a.raw);
            form.append('targetId', '18')
            form.append('targetType', this.targetType || 'sysmgr-client-user-import')
            formPost('/api/sysmgr-web/file/upload', form).then(data => {
                this.referId = data.referId
                this.progress()
            });
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
                    if (this.pro == 100) {
                        cancelAnimationFrame(this.frame)
                        if(data.state == 30 || data.state == 20) {
                            // console.log('there?')
                            // this.form.taskId = data.taskId
                            // this.show = false
                            this.close()
                            if(data.failCount) {
                                this.$alert(data.desc, '错误提示', {
                                    confirmButtonText: '确定',
                                    type: 'warning',
                                    callback: () => {
                                        this.query()
                                    }
                                })
                            }
                            else {
                                this.$alert('上传成功!')
                                this.$emit('query')
                                // this.query()
                            }
                        }
                        if(data.state == 40) {
                            this.$message({
                                type: 'error',
                                message: data.desc
                            });
                        }
                    }
                })
            }
        },
        close() {
            this.$emit('close')
        }
    }
}
</script>

<style scoped>
.dbox {
    font-size: 14px;
    color: #666666;
}
.ditem {
    overflow: hidden;
    margin-bottom: 35px;
}
.ditem > div {
    float: left;
}
.abtn {
    display: inline-block;
    width: 80px;
    height: 22px;
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    background-image: url(../image/download.png);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 7px center;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    text-indent: 22px;
    line-height: 20px;
}
.abtn + div {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
.up_icon {
    width: 228px;
    height: 124px;
    background-image: url(../image/upload.png);
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
</style>

