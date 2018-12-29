<template>
  <div class="tax-discount-step-5">
    <p class="page-title">{{countTitle}}税优地资源信息(第五步)</p>
    <el-form class="form-box" :model="form" label-width="150px">
      <el-form-item label="税优地合同">
        <el-upload
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
          <el-button size="small" type="primary" :disabled="disabled">点击上传</el-button>
        </el-upload>
        <!-- <input type="file" v-if="$route.query.state === '0' || $route.query.state === '1'" @change="heTongChange"/> -->
        <div class="pl50 mb50">
            <el-table :data="fileList">
                <el-table-column prop="fileName" label="文件名称"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                      <el-button type="text" @click="handleDown(scope.row.downloadCode)" :disabled="scope.row.downloadCode ? false : true">下载</el-button>
                      <el-button type="text" @click="handleDelete(scope.$index)" :disabled="disabled">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
      </el-form-item>
    </el-form>

    <div style="padding: 30px 0 30px 100px;">
      <el-button @click="onStepClick">上一步</el-button>
      <el-button v-if="$route.query.state === '0' || $route.query.state === '1'" type="primary" @click="saveDateClick">保存并返回列表</el-button>
      <el-button @click="backList">取消</el-button>
    </div>
  </div>
</template>

<script>
  import {get, post, importPost} from '../../../store/api'
  import SectionInput from '../com/sectionInput'
  export default {
    name: "TaxDiscountStep2",
    components: {
      SectionInput
    },
    data() {
      return {
        form: {
        },
        // 合同数据
        heTongInputData: null,
        // 是否可以编辑
        disabled: false,
        attachmentModelList: [],
        fileList: [],
        referArr: [],
        formData: ''
      }
    },
    computed: {
      countTitle() {
        switch (this.$route.query.state) {
          case '0':
            return '新增'
          case '1':
            return '编辑'
          case '2':
            return '查看'
          default:
            return ''
        }
      }
    },
    mounted() {
      this.disabled = !(this.$route.query.state === '0' || this.$route.query.state === '1')
      this.getStep5data()
    },
    methods: {
      // 获取第4部数据
      getStep5data() {
        get('/api/salemgt/taxLanding/tax/contract/get', {
          taxLandingId: this.$route.query.id
        }).then((data) => {
          if (data.attachmentModelList) {
            // this.attachmentModelList = data.attachmentModelList
            data.attachmentModelList.forEach(e => {
              this.referArr.push(e.id)
              this.fileList.push({
                fileName: e.displayname,
                downloadCode: e.downloadCode
              })
            })
          }
        }).catch(() => {})
      },
      // 合同改变的时候调用
      heTongChange(e) {
        if (e && e.target && e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]
          const fileSize = file.size
          if (fileSize > (10 * 1024 * 1024)) {
            this.$message.error('文件大小不能超过10M');
            e.target.outerHTML = e.target.outerHTML;
          } else {
            this.heTongInputData = file
          }
        }
      },
      // 上传文件
      // upFile() {
      //   if (!this.heTongInputData) {
      //     if (this.attachmentModelList && this.attachmentModelList.length > 0) {
      //       return Promise.resolve(this.attachmentModelList[0])
      //     }
      //     return Promise.resolve({})
      //   }
      //   const formData = new FormData()
      //   formData.append('fileName', this.heTongInputData.name)
      //   formData.append('file', this.heTongInputData)
      //   formData.append('targetType', 'tax_landing_contract')
      //   return importPost('/api/sysmgr-web/file/upload', formData)
      // },
      // 保存数据
      saveData() {
        return new Promise((resolve, reject) => {
          // 合同
          const id = parseInt(this.$route.query.id)
          post('/api/salemgt/taxLanding/tax/contract', {
            taxLandingId: id,
            imageIds: this.referArr
          }).then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            resolve()
          }).catch(() => {
            this.$message.error('提交失败');
            reject()
          })
        })
      },
      // 上一步
      onStepClick() {
        this.$router.push({ path: '/main/taxDiscount/step4', query: this.$route.query })
      },
      // 保存并返回列表
      async saveDateClick() {
        this.saveData().then(() => {
          this.backList()
        }).catch((c) => {
          console.log(c)
        })
      },
      // 返回列表
      backList() {
        console.log('xxx')
        this.$router.replace('/main/taxDiscount/list')
      },
      // --------------------------------------2.4.6.2
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
      handleDown(downloadCode) {
        location.href = `/api/sysmgr-web/file/download?downloadCode=${downloadCode}`
      },
      handleDelete(a) {
          this.fileList.splice(a, 1)
          this.referArr.splice(a, 1)
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
    }
  }
</script>

<style lang="scss" scoped>

  .tax-discount-step-5 {
    > .page-title {
      font-size: 30px;
      color: #666;
    }
    .form-box {
      background-color: #fff;
      padding: 20px;
    }
    .postion-box {
      display: flex;
      justify-content: start;
      vertical-align: center;
      .beizhu-title {
        padding: 0 10px 0 50px;
      }
      .beizhu {
        width: 400px;
      }
    }
    .interval-line {
      margin: 30px 0;
      height: 1px;
      background-color: #ddd;
    }
  }

</style>

