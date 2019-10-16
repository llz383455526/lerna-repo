<template>
  <el-table
    :data="tableData"
    style="width: 100%">
    <el-table-column
      prop="fileName"
      label="附件名称">
    </el-table-column>
    <el-table-column
      prop="createByName"
      label="上传人">
    </el-table-column>
    <el-table-column
      prop="createTime"
      label="上传时间">
    </el-table-column>
    <el-table-column
      label="操作">
      <span slot-scope="scope">
        <el-button v-if="isEdit && !look" type="text" @click="handleDelete(scope.row.downloadCode, scope.$index)">删除</el-button>
        <el-button type="text" @click="handleDownload(scope.row.downloadCode)">下载</el-button>
      </span>
    </el-table-column>
  </el-table>
</template>

<script>
import { baseUrl } from 'src/config/address.js';
import { get, post, formPost } from "store/api";
import { workflow } from "src/api"

export default {
  props: {
    isEdit: {
      type: Boolean,
    },
    tableData: {
      type: Array,
      default: () => {
        return []
      }
    },
    look: {
      type: Boolean,
    },
  },
  methods: {
    handleDownload(downloadCode) {
      window.location.href = baseUrl + '/api/sysmgr-web/file/download' +
        '?downloadCode=' + downloadCode;
    },
    // 通用的删除
    normalDelete(downloadCode, index) {
      get('/api/sysmgr-web/inner/attachment-delete', { downloadCode }).then(data => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        this.$emit('deleteFile', index)
      });
    },
    // 合规通附件的删除
    normalDelete(id, reportNo) {
      get(workflow.delRiskReport, { id, reportNo }).then(data => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        this.$emit('deleteFile')
      });
    },
    handleDelete(downloadCode, index) {
      // 这里的删除，如果是新增就用通用的删除，如果是重新修改，那么就用另一个
      get('/api/sysmgr-web/inner/attachment-delete', { downloadCode }).then(data => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        this.$emit('deleteFile', index)
      });
    }
  }
}
</script>

<style>

</style>