<template>
  <div class="tax-discount-step-5">
    <p class="page-title">{{countTitle}}税优地资源信息(第五步)</p>
    <el-form :disabled="disabled" class="form-box" :model="form" label-width="150px">
      <el-form-item label="税优地合同">
        <input type="file" v-if="$route.query.state === '0' || $route.query.state === '1'" @change="heTongChange"/>
        <template>
          <a
            v-for="(v, k) in attachmentModelList"
            :key="k"
            target="_blank"
            :href="`/api/sysmgr-web/file/download?downloadCode=${v.downloadCode}`">{{v.displayname}}</a>
        </template>
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
        attachmentModelList: []
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
        get('/api/salemgt/taxLanding/tax/img', {
          taxLandingId: this.$route.query.id
        }).then((data) => {
          if (data.attachmentModelList) {
            this.attachmentModelList = data.attachmentModelList
          }
        }).catch(() => {
        })
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
      upFile() {
        if (!this.heTongInputData) {
          if (this.attachmentModelList && this.attachmentModelList.length > 0) {
            return Promise.resolve(this.attachmentModelList[0])
          }
          return Promise.resolve({})
        }
        const formData = new FormData()
        formData.append('fileName', this.heTongInputData.name)
        formData.append('file', this.heTongInputData)
        formData.append('targetType', 'tax_landing_contract')
        return importPost('/api/sysmgr-web/file/upload', formData)
      },
      // 保存数据
      saveData() {
        return new Promise((resolve, reject) => {
          // 合同
          this.upFile().then((data) => {
            const fileId = data.referId || data.id || null
            const id = parseInt(this.$route.query.id)
            const url = `/api/salemgt/taxLanding/tax/img?taxLandingId=${id}&contractAttachmentIds=${fileId}`
            post(url).then(() => {
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              resolve()
            }).catch(() => {
              this.$message.error('提交失败');
              reject()
            })
          }).catch((e) => {
            this.$message.error('文件上传失败');
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
      }
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

