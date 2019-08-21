<template>
    <div>
        <!-- https://jsonplaceholder.typicode.com/posts/ -->
        <el-upload
            :disabled="!edit"
            list-type="picture-card"
            action=""
            :multiple="false"
            :file-list="fileList"
            :http-request="upload"
            :on-preview="handlePictureCardPreview"
            :on-change="handleChange"
            :on-remove="handleRemove"
						accept=".png, .jpg">
            <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog>
    </div>
</template>

<script>
import { formPost, post } from '../../store/api'

export default {
    props: {
        id: [Number, String],
        downloadCodeList: {
            type: Array,
            default() {
                return []
            }
        },
        edit: {
            type: Boolean,
            default: false,
        },
    },
    data() {
        return {
            dialogImageUrl: '',
            dialogVisible: false,
            fileList: [
                // {
                //     name: 'xxx.png',
                //     url: '/api/sysmgr-web/file/img-scan?downloadCode=0b91ff5db2ab40ad99bd10fe0724a6e0ce47911820fe461fb84b46eab3ccac5a',
                // }
            ],
            referIdList: [],
        }
    },
    mounted() {
        this.downloadCodeList.forEach(item => {
            this.fileList.push({
                name: item,
                url: `/api/sysmgr-web/file/img-scan?downloadCode=${item}`,
                downloadCode: item,
            })
        })
    },
    methods: {
        // status:ready, uploading, success, fail
        // percentage: 进度
        handleFileStatus(file, status, percentage) {
            file.status = status
            file.percentage = percentage
        },
        handleChange(file, fileList) {
            this.fileList = fileList
        },
        handleRemove(file, fileList) {
            console.log(file, fileList)
            this.$emit('remove', file, fileList)
        },
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.url
            this.dialogVisible = true
        },
        upload(event) {
            const _file = this.fileList.find(file => file.raw === event.file)
            // _file.status = 'uploading'
            // _file.percentage = 50
            const formData = new FormData()

            formData.append('fileName', _file.name)
            formData.append('file', _file.raw)
            // formData.append('targetType', form.targetType)

            this.handleFileStatus(_file, 'uploading', 0)
            formPost('/api/sysmgr-web/file/upload', formData).then(data => {
                console.log(data)
                // 正常需要将downloadCode 发送给接口
                _file.downloadCode = data.downloadCode
                this.$emit('upload-success', _file, this.fileList)
                this.handleFileStatus(_file, 'success', 0)
            })
        }
    }
}
</script>

<style lang="scss">
.el-upload-list--picture-card .el-upload-list__item {
    width: 68px;
    height: 68px;
}
.el-upload--picture-card {
    width: 68px;
    height: 68px;
    line-height: 66px;
}
.el-upload--picture-card i {
    font-size: 16px;
}
.el-upload-list--picture-card .el-upload-list__item-actions {
    font-size: 16px;
}
ul.el-upload-list.is-disabled + div.el-upload {
    cursor: not-allowed;
    visibility: hidden;
		display: none;
}
</style>

