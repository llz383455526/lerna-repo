<template>
  <div>
    <div v-for="(formItem, key) in contractAttachments"
         :key="key">
      <div class="row mb15">
        <div class="col-xs-4">
          <div style="padding:20px;">
            <el-upload class="form_input"
                       :action="`/api/econtract/template/parsefile`"
                       :auto-upload="false"
                       :on-change="upload"
                       :on-remove="remove"
                       :on-preview="handlePreview"
                       :multiple="false"
                       :show-file-list="false">
              <span class="mr10">{{ formItem.serviceCompanyName }}</span>
              <el-button size="small"
                         type="primary"
                         @click="index = key">上传附件</el-button>
            </el-upload>
          </div>
        </div>
        <div class="col-xs-8">
          <el-table :data="formItem.attachments">
            <el-table-column label="附件类型"
                             prop="targetTypeName"></el-table-column>
            <el-table-column label="文件名称"
                             prop="displayname"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text"
                           size="medium"
                           style="padding:0;"
                           @click="handleDownload(scope.row.downloadCode)">下载</el-button>
                <el-button type="text"
                           size="medium"
                           style="padding:0;"
                           @click="handleRemove(scope.row, key, scope.$index)"
                           v-if="scope.row.targetType == 'contractUserAttach'">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { importPost } from 'src/store/api'
export default {
    props: {
        contractAttachments: {
            type: Array
        },
        contractId: {
            // type: Number
        },
    },
    data() {
        return {
            index: ''
        }
    },
    methods: {
        upload (file) {
            let formData = new FormData();
            formData.append('targetType', 'vci_attach');
            formData.append('fileName', file.name);
            formData.append('file', file.raw);
            importPost('/api/contract-web/file/upload', formData, true).then(data => {
                this.contractAttachments[this.index].attachments.push({
                    refId: data.referId,
                    downloadCode: data.downloadCode,
                    displayname: data.fileName,
                    targetType: 'contractUserAttach',
                    targetTypeName: '自定义附件'
                })
                this.$message({
                    type: 'success',
                    message: '上传成功！'
                })
            })
        },
        handleDownload(downloadCode) {
            const url = '/api/contract-web/file/download?downloadCode='
            window.open(baseUrl + url + downloadCode);
        },
        handleRemove (row, key, index) {
            this.contractAttachments[key].attachments.splice(index, 1)
        },
    }
}
</script>

