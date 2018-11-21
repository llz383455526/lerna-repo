<template>
    <div>
        <el-upload
                v-if="!notShowBtn"
                :action="uploadUrl"
                :on-success="handleSuccess"
                :on-error="handleError"
                :before-upload="handleBeforeUpload"
                :http-request="hanldleHttpRequest"
                multiple
                accept=".pdf,.doc,.docx,.jpg,.png,.gif"
                :show-file-list=false
                :file-list="fileList">
            <el-button size="small" type="primary"
                       v-if="showUploadBtn">点击上传</el-button>
        </el-upload>
        <el-table :data="fileList">
            <el-table-column prop="fileName" label="文件名称"></el-table-column>
            <el-table-column prop="createTime" label="上传时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="createByName" label="操作人"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <a class="el-button el-button--text el-button--medium"
                       @click="handleDownload(scope.row.downloadCode)"
                       type="text" size="medium" style="padding:0;">下载</a>
                    <el-button  type="text" size="medium"
                                style="padding:0;"
                                @click="dialogVisible = true, downloadCode = scope.row.downloadCode, deleteKey = scope.$index">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-dialog :visible.sync="dialogVisible" width="30%">
            <span>确认删除该合同文件吗？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleDelete">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {showNotify} from '../../../plugin/utils-notify';
    import {post,formPost} from "../../../store/api";
    import {baseUrl} from '../../../config/address';
    export default {
        name: "upload",
        props: ['arrIndex','fileList','notShowBtn','showUploadBtn'],
        data () {
            return {
                uploadUrl: '/api/console-dlv/file/upload',
                // fileList: [],
                referArr: [],
                downloadCode: '',
                deleteKey: '',
                dialogVisible: false
            }
        },
        methods: {
            handleSuccess(file) {
                this.fileList.push(file.data);
                this.referArr.push(file.data.referId);
            },
            handleError() {
                showNotify('error', '上传失败!');
            },
            handleBeforeUpload(file) {
                var AllImgExt = ".doc|.docx|.pdf|.jpg|.png|.gif";
                var extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
                if (AllImgExt.indexOf(extName) == -1) {
                    showNotify('error', '文件类型错误');
                    return false;
                }
                let formData = new FormData();
                formData.append('fileName', file.name);
                formData.append('file', file);
                this.formData = formData;
            },
            hanldleHttpRequest() {
                let url = '/api/contract-web/file/upload';
                formPost(url, this.formData).then(data => {
                    this.fileList.push(data);
                    this.referArr.push(data.referId);
                    showNotify('success', '上传成功!');
                    this.$emit('handleSuccess', this.fileList, this.referArr, this.arrIndex);
                    // if (this.$route.query.contractId) {
                    //     this.updateAttachment(this.$route.query.contractId, data.referId);
                    // }
                });
            },
            handleDelete() {
                if (this.downloadCode) {
                    post('/api/contract-web/file/delete', {downloadCode: this.downloadCode}).then(data => {
                        showNotify('success', '删除成功');
                        this.fileList.splice(this.deleteKey, 1);
                        this.referArr.splice(this.deleteKey, 1);
                        this.dialogVisible = false;
                    });
                }
            },
            handleDownload(downloadCode) {
                window.location.href = baseUrl + '/api/contract-web/file/download'
                    + '?downloadCode=' + downloadCode;
            }
        }
    }
</script>

<style scoped>

</style>