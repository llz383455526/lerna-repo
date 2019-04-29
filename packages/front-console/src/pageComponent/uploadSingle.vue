<template>
    <div>
        <el-upload
            v-if="!imageUrl && !look"
            class="upload"
            ref="upload"
            :show-file-list="false"
            action=""
            :auto-upload="false"
            :on-change="getImg"
            :multiple="false"
            name="file"
            accept=".jpg, .png">
            <i class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <img @click="showVoucher = true" style="width: 300px" v-else-if="imageUrl" :src="`/api/sysmgr-web/file/download?downloadCode=${imageUrl}`" alt="">
        &nbsp;<el-button type="text" class="clear" @click="clearImg" v-if="!look">{{tip}}</el-button>
        <div class="v-modal" v-if="imageUrl" v-show="showVoucher" @click="showVoucher = false" :style="{ backgroundImage: `url(/api/sysmgr-web/file/download?downloadCode=${imageUrl}`}"></div>
    </div>
</template>
<script>
import { get, post, importPost } from "../store/api";
export default {
    props: {
        url: {
            type: String,
            default: '/api/sysmgr-web/file/upload'
        },
        tip: {
            type: String,
            default: '重新上传充值凭证'
        },
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
            imageUrl: '',
            showVoucher: false
        }
    },
    methods: {
        transmit(a) {
            Object.assign(this, a)
        },
        getImg(a) {
            var formData = new FormData()
            formData.append('targetType', this.targetType)
            formData.append('fileName', a.name)
            formData.append('file', a.raw)
            importPost(this.url, formData).then(data => {
                this.$emit('result', data)
                // this.attachmentId = data.referId
                this.imageUrl = data.downloadCode
            })
        },
        clearImg() {
            this.imageUrl = ''
            this.$emit('result', {})
        }
    }
}
</script>
<style scoped>
.v-modal {
    z-index: 9999;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 1000px auto;
    background-position: center center;
    transition: all 0.3s;
}
.upload {
    position: relative;
    top: -5px;
    display: inline-block;
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
.clear {
    position: absolute;
    bottom: 0px;
}
</style>
