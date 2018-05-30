<template>
    <div class="block">
        <!--<h4 class="ml50 mt50">第三方对账文件</h4>-->
        <el-upload
                class="upload-demo ml50"
                :action="uploadUrl"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="handleBeforeUpload"
                :http-request="handleHttpRequest"
                :on-remove="handleRemove"
                multiple
                accept=".xls,.xlsx"
                :show-file-list=false
                :file-list="fileList">
            <el-button size="small" type="success" icon="el-icon-upload">点击上传</el-button>
            <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件,
                <el-button @click="exportTemplate" type="text" size="small">下载模板</el-button>
            </div>
        </el-upload>
        <div class="pl50 mb50">
            <el-table :data="fileList" max-height="200" :stripe=true>
                <el-table-column prop="fileName" label="文件名称"></el-table-column>
                <el-table-column prop="createTime" label="上传时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="progress" label="上传进度">
                    <template slot-scope="scope">
                        <progress-component :taskId="scope.row.taskId"></progress-component>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button  type="text" size="medium"
                                    style="padding:0;" @click="handleDelete(scope.row)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

    import { showNotify } from '../plugin/utils-notify'
    import { formPost } from '../store/api'
    import progressComponent from './progressComponent'
    import {baseUrl} from '../config/address'

    import _ from 'lodash'

    export default {
        components: {
            progressComponent
        },
        name: "fileUpload",
        props: ['uploadUrl', 'needProgress','sourceId', 'channelCode', 'taskType', 'taskIdDeleted'],
        data() {
            return {
                percent: 0,
                fileList: [],
                taskIdToDelete: undefined,
                formData: null,
                dialogVisible: false,
                progress: 0
            }
        },
        mounted() {
            let el = this.$el
            // this.uploadElement = el
        },
        watch: {
            /*'taskIdDeleted': function (n, o) {
                console.log(n, o);
                if (n != o) {
                    if (n) {
                        this.removeFile(n);
                    }
                }
            }*/
        },
        methods: {
            handleSuccess(file) {
                console.log('handleSuccess:')
            },
            handleError() {
                showNotify('error', '上传失败!');
            },
            handleRemove(file, fileList) {
                console.log(file, fileList)
            },
            exportTemplate() {
                var fileType = 'offlineApp';
                if (this.taskType === 'Third') {
                    fileType = 'offlineThird';
                }
                if (this.taskType === 'Third' && !this.channelCode) {
                    showNotify('error', '请先选择第三方的发放渠道才能下载对应模板');
                    return;
                }
                window.location.href = baseUrl + '/api/recon/tools/export-file-template?fileType=' + fileType
                    + "&channelCode=" + this.channelCode;
            },
            handleBeforeUpload(file) {
                this.formData = this.getFormData(file, this.sourceId, this.taskType);
            },
            getFormData(file, sourceId, taskType) {
                var AllImgExt = ".xls|.xlsx|";
                var extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
                if (AllImgExt.indexOf(extName + "|") == -1) {
                    showNotify('error', '文件类型错误');
                    return false;
                }
                let formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('file', file);
                formData.append('sourceId', sourceId);
                formData.append('taskType', taskType);
                formData.append('channelCode', this.channelCode);
                return formData;
            },
            handleHttpRequest() {
                if (!this.channelCode) {
                    showNotify('error', '请先选择支付通道');
                    return false;
                }
                let url = '/api/recon/file/upload';
                formPost(url, this.formData).then(data => {
                    this.fileList.push(data);
                    // showNotify('success', '上传成功!');
                    this.$emit('addToUploadedFileList', data);
                });
            },
            handleDelete(row) {
                this.$emit('handleDelete', row);
                // this.$parent.handleDelete(row);
            },
            removeFile(tId) {
                for (var i=0;i<this.fileList.length;i++) {
                    if (this.fileList[i].taskId === tId) {
                        this.fileList.splice(i, 1);
                        break;
                    }
                }
            },
            removeAllFile() {
                this.fileList = [];
            }

        }
    }

</script>

<style scoped>

</style>