<template>
<<<<<<< HEAD

</template>

<script>
  export default {
    name: "shuntTool"
  }
</script>

<style scoped>

=======
  <div>
    <div class="content">
      <div class="mtitle">选择发放渠道</div>
      <div class="mcontent">
        <el-form :model="applyForm" :inline="true" :rules="rules" ref="applyForm">
          <el-form-item label="客户公司" prop="keHuId">
            <el-select filterable size="small" class="form_input_short" v-model="applyForm.keHuId" placeholder="请选择商户" @change="keHuGongSiSelChange">
              <el-option v-for="v in keHuGongSiArr" :value="v.companyId" :label="v.companyName" :key="v.companyId"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商户公司" prop="shangHuId">
            <el-select filterable size="small" class="form_input_short" v-model="applyForm.shangHuId" placeholder="请选择服务商">
              <el-option v-for="v in shangHuGongSiArr" :value="v.value" :label="v.text" :key="v.value"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div class="mtitle">上传薪酬明细表</div>
      <div class="mcontent">
        <a class="abtn" href="" download="发放明细导入模板.xlsx" target="_blank" @click.prevent="downloadMoBanBtnClick">下载模板</a>
        <div>请按照模板填写人员薪酬数据</div>
      </div>
      <div class="mcontent">
        <el-upload
          class="form_input"
          :action="`/api/sysmgr-web/file/upload-ext`"
          :auto-upload="false"
          :on-change="upload"
          :multiple="false"
          :show-file-list="false"
          accept=".xlsx, .xls">
          <div class="up_icon">
            <div>点击这里上传</div>
            <div>请上传小于5M的xls或xlsx格式文件</div>
          </div>
        </el-upload>
        <el-progress v-if="progress !== null" style="width: 316px" :percentage="progress"></el-progress>
        <br>
        <template v-if="analyticalData.list.length > 0">
          <el-table
            :data="analyticalData.list"
            style="width: 100%">
            <el-table-column
              prop="accountName"
              label="收款账号名称"
              width="180">
            </el-table-column>
            <el-table-column
              prop="idCard"
              label="身份证"
              width="180">
            </el-table-column>
            <el-table-column
              prop="phone"
              label="手机号">
            </el-table-column>
            <el-table-column
              prop="accountNo"
              label="收款方账号">
            </el-table-column>
            <el-table-column
              prop="fund"
              label="款项属性备注">
            </el-table-column>
            <el-table-column
              prop="realAmount"
              label="实发金额">
            </el-table-column>
          </el-table>
          <br>
          <el-pagination
            style="float: right;"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage4"
            :page-sizes="[5, 10]"
            :page-size="5"
            layout="total, sizes, prev, pager, next, jumper"
            :total="analyticalData.total">
          </el-pagination>
        </template>
      </div>
      <div class="footer">
        <el-button @click="cancel" size="small">返回</el-button>
        <el-button v-if="analyticalData.list.length > 0 && !downloadCode" type="primary" :loading="isZuiYouHuaLoading" @click="zuiYouHuaClick" size="small">最优化拆分</el-button>
        <el-button v-if="upSuccess && analyticalData.list.length === 0" type="primary" @click="okBtnClick" size="small">确定</el-button>
        <el-button type="primary" v-if="downloadCode" @click="downloadBtnClick" size="small">下载</el-button>
      </div>
    </div>
  </div>
</template>
<script>
  import Ajax from "../../ajax/index"
  export default {
    data(){
      return {
        applyForm: {
          keHuId: null,
          shangHuId: null
        },
        rules: {
          keHuId: [
            {
              required: true,
              message: '请选择客户公司',
              trigger: 'blur'
            }
          ],
          shangHuId: [
            {
              required: true,
              message: '请选择商户公司',
              trigger: 'blur'
            }
          ]
        },
        // 客户公司数组
        keHuGongSiArr: [],
        // 商户公司数组
        shangHuGongSiArr: [],
        // 上传的数据
        upLoadData: null,
        // 查询定时器
        timer: null,
        // 进度
        progress: null,
        // 是否上传唱功
        upSuccess: false,
        // 列表数据
        analyticalData: {
          total: 0,
          list: [],
          pageNumber: 1,
          pageSize: 5
        },
        downloadCode: null,
        // 是否正在最优化拆分
        isZuiYouHuaLoading: false
      }
    },
    created(){
      this.getKeHuGongSiList()
      // this.getTemplate()
    },
    methods: {
      // 获取客户公司列表
      getKeHuGongSiList() {
        Ajax.get('/api/console-dlv/option/get-option-customer-companies', {
        }).then(data => {
          this.keHuGongSiArr = data
          this.applyForm.shangHuId = null
          this.shangHuGongSiArr = []
        })
      },
      // 客户公司选择改变的时候调用
      keHuGongSiSelChange(e) {
        Ajax.get(`/api/console-dlv/option/get-app-options?companyId=${e}`, {
        }).then(data => {
          this.shangHuGongSiArr = data
        })
      },
      // 校验发放起到是否选中
      checkFaFangQuDao() {
        return new Promise((resolve, reject) => {
          this.$refs.applyForm.validate(err => {
            if (err) {
              resolve()
            } else {
              reject()
            }
          })
        })
      },
      downloadMoBanBtnClick() {
        this.checkFaFangQuDao().then(() => {
          window.open(`/api/console-dlv/company/salary-split/download-salary-order-item-template?appId=${this.applyForm.keHuId}`)
        }).catch(() => {})
      },
      upload(a) {
        this.checkFaFangQuDao().then(() => {
          this.clearTimer()
          this.progress = 0
          // 清除列表数据
          this.clearListData()
          const formData = new FormData()
          formData.append('targetType', 'dlv_salary_split_import')
          formData.append('fileName', a.name)
          formData.append('file', a.raw)
          formData.append('targetExt', JSON.stringify({ appId: this.applyForm.shangHuId }))
          Ajax.importPost('/api/sysmgr-web/file/upload-ext', formData, true).then(data => {
            console.log('data = ', data)
            this.upLoadData = data
            this.searchProgress()
          })
        }).catch(() => {})
      },
      searchProgress() {
        this.timer = setInterval(() => {
          Ajax.post('/api/sysmgr-web/file/progress', {
            id: this.upLoadData.referId
          }, true).then(data => {
            console.log('data = ', data)
            this.progress = data.progress
            if (this.progress === 100) {
              this.clearTimer()
              if(data.state == 30) {
                this.$message({
                  type: 'success',
                  message: '上传成功！'
                })
                this.upSuccess = true
              } else if (data.state == 20) {
                this.$message({
                  type: 'error',
                  message: '内部错误！'
                })
              } else if (data.state == 40) {
                this.$message({
                  type: 'error',
                  message: data.desc || '导入失败'
                })
              }
            }
          })
        }, 2000)
      },
      // 清除定时器
      clearTimer() {
        console.log('this.timer = ', this.timer)
        if (this.timer) {
          clearInterval(this.timer)
          this.progress = null
        }
      },
      okBtnClick() {
        this.getTemplate()
      },
      cancel(){
        this.$router.back()
      },
      // 分页大小改变的时候调用
      handleSizeChange(count) {
        this.analyticalData.pageSize = count
        this.getTemplate()
      },
      handleCurrentChange(count) {
        this.analyticalData.pageNumber = count
        this.getTemplate()
      },
      clearListData() {
        this.analyticalData.pageNumber = 1
        this.analyticalData.pageSize = 5
        this.analyticalData.list = []
        this.analyticalData.total = 0
        this.upSuccess = false
        this.downloadCode = null
        this.isZuiYouHuaLoading = false
      },
      getTemplate() {
        Ajax.post('/api/console-dlv/company/salary-split/query-import-order-item', {
          importTaskId: this.upLoadData.referId,
          page: this.analyticalData.pageNumber,
          pageSize: this.analyticalData.pageSize
        }).then((data) => {
          this.analyticalData.list = data.list
          this.analyticalData.total = data.total
        })
      },
      // 执行最优化拆分
      zuiYouHuaClick() {
        this.isZuiYouHuaLoading = true
        Ajax.post('/api/console-dlv/company/salary-split/deal', {
          importTaskId: this.upLoadData.referId
        }).then((data) => {
          this.getCaiFenProgress()
        }).catch(() => {
          this.$message({
            type: 'error',
            message: '拆分失败！'
          })
          this.isZuiYouHuaLoading = false
        })
      },
      // 获取拆分进度
      getCaiFenProgress() {
        this.timer = setInterval(() => {
          Ajax.get(`/api/console-dlv/company/salary-split/get-file-info?importTaskId=${this.upLoadData.referId}`).then((data) => {
            console.log('data = ', data)
            if (data.isComplete) {
              this.isZuiYouHuaLoading = false
              this.downloadCode = data.downloadCode
              clearInterval(this.timer)
            }
          })
        }, 2000)
      },
      // 下载按钮点击
      downloadBtnClick() {
        window.open(`/api/console-dlv/company/salary-split/download?downloadCode=${this.downloadCode}`)
      }
    }
  }
</script>
<style>
  .content {
    margin-top: 14px;
    background-color: #fff;
    padding: 48px 33px;
  }
  .mcontent {
    margin: 34px 0px 30px 150px;
  }
  .abtn {
    display: inline-block;
    width: 80px;
    height: 22px;
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    background-image: url(../../image/download.png);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 7px center;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    text-indent: 22px;
    line-height: 20px;
  }
  .abtn + div {
    display: inline-block;
    font-size: 14px;
    color: #999;
    margin-left: 15px;
  }
  .form_input {
    width: 400px;
  }
  .up_icon {
    width: 300px;
    height: 163px;
    background-image: url(../../image/upload.png);
    background-size: 52.8px 43.3px;
    background-position: center 30px;
    background-repeat: no-repeat;
    padding-top: 90px;
    border: 1px solid #D9D9D9;
  }
  .up_icon > div:nth-child(1) {
    text-align: center;
    font-size: 16px;
    color: #666666;
  }
  .up_icon > div:nth-child(2) {
    font-size: 13px;
    color: #999;
    margin-top: 11px;
  }
  .pro_box {
    position: relative;
    display: inline-block;
    width: 263px;
    height: 10px;
    border: 1px solid #E9E9E9;
    border-radius: 5px;
    margin-top: 6px;
  }
  .pro_box > div {
    position: absolute;
    top: 1px;
    left: 0;
    height: 8px;
    border-radius: 4px;
    background-color: #108EE9;
  }
  .pro_box + span {
    margin-top: 6px;
    font-size: 12px;
    color: #999999;
  }
  .footer {
    text-align: center;
    margin-top: 30px;
  }
  .tip {
    margin: 65px 34px 0px;
    font-size: 14px;
    color: #8E8E8E;
    letter-spacing: 0.6px;
    text-align: left;
    line-height: 37px;
    border-top: 1px solid #EBEBEB;
    padding: 12px 30px 0px;
  }
  .tip > div:nth-child(1) {
    font-size: 16px;
  }
  .c6 {
    color: #666;
    font-size: 16px;
  }
  .c15 {
    color: #151515;
  }
  .c108EE9 {
    color: #108EE9;
    text-decoration: underline;
    cursor: pointer;
    margin-left: 10px;
  }
  .mt15 {
    margin-top: 15px;
  }
  .f14 {
    font-size: 14px;
  }
  .form_300 {
    width: 300px;
  }
  .mb8 {
    margin-bottom: 8px;
  }
  .balance {
    color: #333;
    font-size: 14px;
  }
  .balance > span {
    color: red;
  }
>>>>>>> master
</style>
