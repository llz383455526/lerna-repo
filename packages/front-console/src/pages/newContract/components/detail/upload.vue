<template>
    <div>
        <div class="row" style="margin-bottom: 15px;">
            <div class="col-xs-4">
                <div style="padding:20px;">
                    <el-upload class="form_input" :action="`/api/econtract/template/parsefile`" :auto-upload="false" :on-change="upload" :on-remove="remove" :on-preview="handlePreview" multiple :show-file-list="false">
                        <el-button size="small" type="primary" @click="index = key">上传附件</el-button>
                    </el-upload>
                </div>
            </div>
            <div class="col-xs-8">
                <el-table :data="list">
                    <el-table-column label="附件类型">
                        <template slot-scope="scope">
                            {{scope.row.targetType == 'customerContact' ? '系统附件' : '补充附件'}}
                        </template>
                    </el-table-column>
                    <el-table-column label="文件名称" prop="displayname"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="medium" style="padding:0;" @click="handleDownload(scope.row.downloadCode)">下载</el-button>
                            <el-button type="text" size="medium" style="padding:0;" @click="handleRemove(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
import { importPost } from "../../../../store/api"
import { baseUrl } from '../../../../config/address.js'

export default {
    props: ['list'],
    methods: {
         upload (file) {
            let formData = new FormData();
            formData.append('targetType', 'vci_attach');
            formData.append('fileName', file.name);
            formData.append('file', file.raw);
            importPost('/api/contract-web/file/upload', formData, true).then(data => {
                this.list.push({
                    refId: data.referId,
                    downloadCode: data.downloadCode,
                    displayname: data.fileName,
                })
                this.$message({
                type: 'success',
                message: '上传成功！'
                })
            })
        },
        handleDownload (downloadCode) {
            window.location.href = baseUrl + '/api/contract-web/file/download' +
            '?downloadCode=' + downloadCode;
        },
        handleRemove (index) {
            this.$emit('remove', index)
        },
    }
}
</script>

