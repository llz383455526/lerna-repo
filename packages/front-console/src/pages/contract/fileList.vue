<template>
    <div style="background-color:#fff;padding:15px;">
    <div style="margin-bottom:30px;">附件管理</div>
    <h4 class="ml50 mt50">合同文件</h4>
        <el-upload
            class="upload-demo ml50"
            :action="uploadUrl"
            :on-success="handleSuccess"
            :on-error="handleError"
            :before-upload="handleBeforeUpload"
            :http-request="hanldleHttpRequest"
            multiple
            accept=".pdf,.doc,.docx,.jpg,.png,.gif"
            :show-file-list="false"
            :file-list="fileList">
            <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
        <div class="pl50 mb50">
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
                        <el-button @click="handleDownload(scope.row.downloadCode)" type="text" size="medium"
                                    style="padding:0;">下载
                        </el-button>
                        <el-button  type="text" size="medium"
                                    style="padding:0;" @click="dialogVisible = true, downloadCode = scope.row.downloadCode, deleteKey = scope.$index">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
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
import {post, get, formPost} from '../../store/api';
import {showNotify} from '../../plugin/utils-notify';
import {baseUrl} from '../../config/address';
export default {
    data() {
        return {
            contractId: '',
            uploadUrl: '',
            fileList: [],
            referArr: [],
            dialogVisible: false,
        }
    },
    methods: {
        queryAttachments(id) {
            let url = '/api/contract-web/contract/contract-attachments';
            get(url, {contractId: id}).then(data => {
                this.fileList = data;
            });
        },
        handleDownload(downloadCode) {
            window.location.href = baseUrl + '/api/contract-web/file/download'
                + '?downloadCode=' + downloadCode;
        },
        handleDelete() {
            if (this.downloadCode) {
                post('/api/contract-web/file/delete', {downloadCode: this.downloadCode}).then(data => {
                    // showNotify('success', data);
                    //this.queryAttachments(this.$route.query.contractId);
                    showNotify('success', '删除成功')
                    this.fileList.splice(this.deleteKey, 1)
                    this.referArr.splice(this.deleteKey, 1)
                    this.dialogVisible = false;
                });
            }
        },
        handleBeforeUpload(file) {
            var AllImgExt = ".doc|.docx|.pdf|.jpg|.png|.gif|.jpeg";
            var extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
            if (AllImgExt.indexOf(extName) == -1) {
                showNotify('error', '文件类型错误');
                return false;
            }
            let formData = new FormData();
            formData.append('fileName', file.name);
            formData.append('file', file);
            formData.append('contractId', this.contractId);
            this.formData = formData;
        },
        hanldleHttpRequest() {
            let url = '/api/contract-web/contract/upload-attachment';
            formPost(url, this.formData).then(data => {
                this.fileList.push(data);
                this.referArr.push(data.referId);
                showNotify('success', '上传成功!');
                // if (this.$route.query.contractId) {
                //     this.updateAttachment(this.$route.query.contractId, data.referId);
                // }
            });
        },
    },
    created() {
        this.contractId = this.$route.query.contractId
        this.queryAttachments(this.contractId)
    }
}
</script>

