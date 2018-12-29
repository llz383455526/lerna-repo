<template>
  <div class="main-container">
    <div style="margin: 0 0 20px;">脱敏文件</div>
    <el-upload
      v-if="checkRight(permissions, 'salemgt:/taxLanding/tax/desensitization')"
      class="upload-demo ml50"
      action='uploadUrl'
      :on-success="handleSuccess"
      :on-error="handleError"
      :before-upload="handleBeforeUpload"
      :http-request="hanldleHttpRequest"
      multiple
      accept=".pdf,.doc,.docx,.jpg,.png,.gif"
      :show-file-list=false
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
                  <el-button @click="handleDownload(scope.row.downloadCode)" type="text" size="medium" style="padding:0;">下载</el-button>
                  <el-button  type="text" size="medium" style="padding:0;" @click="handleDelete(scope.row.id, scope.$index)" v-if="checkRight(permissions, 'salemgt:/taxLanding/tax/desensitization/delete')">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
    </div>
    <el-button class="right" @click="$router.back()">返回</el-button>
    <el-button class="right" type="primary" @click="saveData" v-if="checkRight(permissions, 'salemgt:/taxLanding/tax/desensitization')">保存</el-button>
  </div>
</template>
<script>
import {mapGetters} from 'vuex';
import {baseUrl} from '../../config/address';
import {get, post, importPost} from '../../store/api'
export default {
  data() {
    return {
      fileList: [],
      referArr: [],
      formData: '',
      id: ''
    }
  },
  computed: {
    ...mapGetters({
        permissions: 'permissions'
    })
  },
  mounted() {
    this.id = this.$route.query.id
    get(`/api/salemgt/taxLanding/tax/desensitization/get`, {
      taxLandingId: this.id
    }).then(data => {
      data.attachmentModelList.forEach(e => {
        e.fileName = e.displayname
        this.fileList.push(e)
        this.referArr.push(e.id)
      })
    })
  },
  methods: {
    handleSuccess(file) {
        this.fileList.push(file.data);
        this.referArr.push(file.data.referId);
    },
    handleError() {
      this.$message({
        type: 'error',
        message: '上传失败'
      })
    },
    handleDownload(downloadCode) {
        window.location.href = `${baseUrl}/api/sysmgr-web/file/download?downloadCode=${downloadCode}`
    },
    handleDelete(id, index) {
      console.log(index)
      this.fileList.splice(index, 1)
      this.referArr.splice(index, 1)
      this.$message({
        type: 'success',
        message: '删除成功'
      })
      // if(id) {
      //   post('/api/salemgt/taxLanding/tax/desensitization/delete', {
      //     taxLandingId: this.id,
      //     imageIds: this.referArr
      //   }).then(data => {
      //     this.$message({
      //       type: 'success',
      //       message: '删除成功'
      //     })
      //   })
      // }
      // else {
      // }
    },
    handleBeforeUpload(file) {
        var AllImgExt = ".doc|.docx|.pdf|.jpg|.png|.gif";
        var extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
        if (AllImgExt.indexOf(extName) == -1) {
            this.$message({
              type: 'error',
              message: '文件类型错误'
            })
            return false;
        }
        let formData = new FormData();
        formData.append('fileName', file.name);
        formData.append('file', file);
        formData.append('targetType', 'tax_landing_contract')
        this.formData = formData;
    },
    hanldleHttpRequest() {
      importPost('/api/sysmgr-web/file/upload', this.formData).then(data => {
          this.fileList.push(data);
          this.referArr.push(data.referId);
          this.$message({
            type: 'success',
            message: '上传成功'
          })
      });
    },
    saveData() {
      post('/api/salemgt/taxLanding/tax/desensitization', {
        taxLandingId: this.id,
        imageIds: this.referArr
      }).then(() => {
        this.$message({
          message: '提交成功',
          type: 'success'
        });
      })
    }
  }
}
</script>
<style scoped>
.main-container {
  margin-top: 15px;
  background-color: #fff;
  padding: 15px;
  margin-bottom: 20px;
  overflow: hidden;
}
.right {
  float: right;
  margin-left: 20px;
}
</style>
