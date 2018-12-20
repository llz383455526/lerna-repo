<template>
  <div class="main-invoice-pre-step1">
    <p>预开票</p>
    <el-steps :active="step" align-center>
      <el-step title="选择账单"></el-step>
      <el-step title="核对"></el-step>
    </el-steps>
    <br><br>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px" v-if="step === 1">
      <el-form-item label="发票类型" prop="invoiceType">
        <el-radio-group v-model="rules.invoiceType">
          <el-radio v-for="(v) in invoiceTypeList" :label="v.text"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发票类目" prop="invoiceLeiMu">
        <el-select v-model="form.invoiceLeiMu" placeholder="请选择活动区域">
          <el-option v-for="v in involiceLeiMuList" :label="v.name" :value="v.id"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="税率">
        <span>{{ form.taxRate }}%</span>
      </el-form-item>
      <el-form-item label="开票金额（含税）" prop="jine">
        <el-input v-model="form.jine"></el-input>
      </el-form-item>
      <el-form-item label="发票用途（对内说明" prop="content">
        <el-input v-model="form.content"></el-input>
      </el-form-item>
      <el-form-item label="发票显示备注">
        <el-input type="textarea" v-model="form.beizhu"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @cancel="cancleBtnClick">取消</el-button>
        <el-button type="primary" @click="nextBtnClick">下一步</el-button>
      </el-form-item>
    </el-form>
    <div class="step2" v-else>
      <p class="section-title">账单信息</p>
      <div class="section">
        <el-form label-width="170px">
          <el-form-item label="开票金额合计">
            <span style="color: #ef000d">￥284,596.00</span>
          </el-form-item>
        </el-form>
      </div>
      <p class="section-title">发票信息</p>
      <div class="section">
        <el-form label-width="170px">
          <el-form-item label="发票类型">
            <span>增值税专用发票</span>
          </el-form-item>
          <el-form-item label="发票类目">
            <span>*现代服务*信息服务费</span>
          </el-form-item>
          <el-form-item label="税率">
            <span>6%</span>
          </el-form-item>
          <el-form-item label="落地公司名称">
            <span>河南爱洋信息科技有限公司</span>
          </el-form-item>
          <el-form-item label="开票名称">
            <span>天津金狐文化传播有限公司</span>
          </el-form-item>
          <el-form-item label="纳税人识别号">
            <span>911201165864250487</span>
          </el-form-item>
          <el-form-item label="公司地址">
            <span>北京市朝阳区将台路5号院5号楼二层2025室</span>
          </el-form-item>
          <el-form-item label="公司电话">
            <span>010-64398176</span>
          </el-form-item>
          <el-form-item label="开户行">
            <span>中信银行北京三元桥支行</span>
          </el-form-item>
          <el-form-item label="银行账号">
            <span>7113 5101 8260 0085 641</span>
          </el-form-item>
          <el-form-item label="发票显示备注">
            <span>无</span>
          </el-form-item>
        </el-form>
      </div>
      <p class="section-title">邮寄信息</p>
      <div class="section">
        <el-form label-width="170px">
          <el-form-item label="收票人">
            <span>吴琪琳</span>
          </el-form-item>
          <el-form-item label="收票人电话">
            <span>15521272056</span>
          </el-form-item>
          <el-form-item label="收票人地址">
            <span>北京市朝阳区将台路5号院5号楼二层2025室</span>
          </el-form-item>
        </el-form>
      </div>
      <p class="section-title">其他</p>
      <div class="section">
        <el-form label-width="170px">
          <el-form-item label="发票用途（对内说明）">
            <span>7月业务费</span>
          </el-form-item>
          <el-form-item>
            <el-button @click="step = 1">返回上一步</el-button>
            <el-button>预览</el-button>
            <el-button type="primary" @click="onSubmit">提交申请</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
  import {post, get} from '../../../store/api';
  export default {
    name: "step1",
    data() {
      return {
        // 进度
        step: 1,
        form: {
          invoiceType: null,
          invoiceLeiMu: null,
          zhangdan: '日账单',
          content: null,
          beizhu: null,
          jine: null,
          // 税率
          taxRate: 0
        },
        rules: {
          invoiceType: [
            { required: true, message: '请选择发票类型', trigger: 'blur' },
          ],
          jine: [
            { required: true, message: '请选择发票类型', trigger: 'blur' },
          ],
          invoiceLeiMu: [
            { required: true, message: '请选择发票类目', trigger: 'blur' },
          ],
          content: [
            { required: true, message: '请选择发票类目', trigger: 'blur' },
          ]
        },
        // 发票类型列表
        invoiceTypeList: [],
        // 发票类目列表
        involiceLeiMuList: []
      }
    },
    watch: {
      'form.invoiceLeiMu'(newVal) {
        this.involiceLeiMuList.forEach((item) => {
          if (item.id === newVal) {
            this.form.taxRate = item.taxRate
          }
        })
      }
    },
    methods: {
      // 账单选择改变
      zhangDanSelChange(e) {
        console.log(e)
      },
      // 下一步按钮点击
      nextBtnClick() {
        this.step = 2
      },
      // 取消按钮点击
      cancleBtnClick() {
        this.$router.replace('/main/invoice/list')
      },
      // 提交申请
      onSubmit() {

      },
      // 获取发票类型列表
      getInvoiceTypeList() {
        get('/api/invoice-web/commom/option?enumType=InvoiceType').then(function(data){
          this.invoiceTypeList = data
          this.rules.invoiceType = this.invoiceTypeList[0].text
        }.bind(this))
      },
      // 获取发票类目
      getInvoiceLeiMu() {
        let url = '/api/invoice-web/custom-invoice-subject/qry';
        let param = {
          name: '',
          orderBy: '',
          page: 0,
          pageSize: 0,
          status: 1
        };
        post(url, param).then(data => {
          this.involiceLeiMuList = data.list
        })
      }
    },
    mounted() {
      this.getInvoiceTypeList()
      this.getInvoiceLeiMu()
    }
  }
</script>

<style scoped lang="scss">
  .main-invoice-pre-step1 {
    background-color: #fff;
    padding: 15px;
    .step2 {
      .section {
        padding-left: 80px;
      }
    }
  }
</style>

<style lang="scss">
  .main-invoice-pre-step1 {
    .step2 {
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
</style>
