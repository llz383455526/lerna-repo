<template>
    <div>
        <div class="uploadBox" v-for="(e, i) in uploadList" @click.capture="currentIndex = i">
            <!-- mb35 -->
            <el-upload
                v-show="!uploadList[i].imageUrl && !look"
                class="det"
                ref="upload"
                :show-file-list="false"
                :action="`/api/sysmgr-web/file/upload`"
                :auto-upload="false"
                :on-change="getAttachment"
                :multiple="true"
                name="file"
                accept=".jpg, .png">
                <i class="el-icon-plus avatar-uploader-icon">
                    <div>可以同时上传多张</div>
                </i>
            </el-upload>
            <div v-if="uploadList[i].imageUrl" class="avatar" :style="{'background-image': `url(${uploadList[i].imageUrl})`}">
                <div class="magnify" @click="prevImg(uploadList[i].imageUrl)"></div>
            </div>
            <el-button type="text" v-show="uploadList[i].imageUrl && !look" @click="reUpload()">重新上传</el-button><br v-show="uploadList[i].imageUrl">
            <el-button type="text" @click="deleteImg()" v-show="((uploadList.length > 1 && uploadList.length -1 != i) || i == 9) && !show && !look">删除</el-button>
        </div>
        <div class="v-modal" v-show="showExa" @click="showExa = false" :style="prevUrl ? {'background-image': `url(${prevUrl})`} : ''"></div>
    </div>
</template>
<script>
import { get, post, importPost } from "../store/api";
import {showLoading, hideLoading} from '../plugin/utils-loading'
export default {
    props: {
        look: {
            type: Boolean,
            default: false
        },
        targetType: {
            type: String,
            default: 'recharge_voucher_img'
        }
    },
    data() {
        return {
            uploadList: [
                {
                    imageUrl: '',
                    attachmentId: ''
                }
            ],
            currentIndex: 0,
            readyList: [],
            isRe: false,
            delay: '',
            showExa: false,
            prevUrl: ''
        }
    },
    methods: {
        getAttachment(a) {
            this.readyList.push(a)
            clearTimeout(this.delay)
            this.delay = setTimeout(() => {
                showLoading()
                this.uploadByOrder()
            }, 10)
        },
        uploadByOrder() {
            var a = this.readyList.shift()
            if(!a) {
                hideLoading()
                return
            }
            if(this.uploadList.length >= 10 && this.uploadList[this.uploadList.length - 1].imageUrl && !this.isRe) {
                hideLoading()
                this.$message({
                    type: 'warning',
                    message: '最多只能上传10张图片！'
                })
                return
            }
            this.uploadList[this.currentIndex].imageUrl = URL.createObjectURL(a.raw);
            var formData = new FormData()
            formData.append('targetType', this.targetType)
            formData.append('fileName', a.name)
            formData.append('file', a.raw)
            importPost('/api/sysmgr-web/file/upload', formData, true).then(data => {
                this.uploadList[this.currentIndex].attachmentId = data.referId
                this.uploadList[this.currentIndex].downloadCode = data.downloadCode
                if(this.currentIndex + 1 == this.uploadList.length && this.uploadList.length < 10) {
                    this.uploadList.push({
                        imageUrl: '',
                        downloadCode: '',
                        attachmentId: ''
                    })
                    this.$emit('result', this.uploadList.filter(e => e.attachmentId))
                }
                if(!this.isRe) {
                    this.currentIndex++
                    this.uploadByOrder()
                }
                else {
                    hideLoading()
                    this.readyList.length = 0
                    this.isRe = false
                }
            })
        },
        prevImg(a) {
            this.prevUrl = a
            this.showExa = true
        },
        reUpload() {
            this.isRe = true
			this.$refs.upload[this.currentIndex].$el.children[0].children[1].click()
			this.$emit('result', this.uploadList.filter(e => e.attachmentId))
        },
        deleteImg() {
            this.uploadList.splice(this.currentIndex, 1)
            if(this.uploadList.length == 9 && this.uploadList[this.uploadList.length -1].imageUrl) {
                this.uploadList.push({
                    imageUrl: '',
                    attachmentId: ''
                })
            }
            this.$emit('result', this.uploadList.filter(e => e.attachmentId))
        },
        transmit(a) {
            Object.assign(this, a)
        }
    }
}
</script>
<style scoped>
.uploadBox {
    width: 140px;
    float: left;
    text-align: center;
    margin-right: 20px;
}
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}
.avatar-uploader .el-upload:hover {
    border-color: #409eff;
}
.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
    background: #FCFCFC;
    border: 1px solid #CCCCCC;
}
.avatar {
    position: relative;
    width: 140px;
    height: 140px;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    display: inline-block;
}
.avatar-uploader-icon > div {
    line-height: 20px;
    font-size: 12px;
    margin-top: -32px;
}
.det {
    position: relative;
    margin-bottom: 10px;
    padding-left: 20px;
}
.mb35 {
    margin-bottom: 35px;
}
.v-modal {
    z-index: 9999;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 1000px auto;
    background-position: center center;
    transition: all 0.3s;
}
.magnify {
    position: absolute;
    bottom: 2px;
    right: 2px;
    width: 30px;
    height: 30px;
    background-image: url(../image/magnify.png);
    cursor: pointer;
}
</style>
