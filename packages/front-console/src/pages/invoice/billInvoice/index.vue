<template>
  <div class="main-invoice-bill-step1">
    <p>账单开票</p>
    <el-steps :active="step" align-center>
      <el-step title="选择账单"></el-step>
      <el-step title="核对"></el-step>
    </el-steps>
    <br><br>
    <el-form ref="form" :rules="rules" :model="form" label-width="150px" v-if="step === 1">
      <el-form-item label="发票类型">
        <span v-for="(v, k) in invoiceTypes">{{ v.text }}&nbsp;&nbsp;</span>
      </el-form-item>
      <el-form-item label="发票类目" prop="invoiceLeiMu">
        <el-select v-model="form.invoiceLeiMu" placeholder="请选择发票类目">
          <el-option v-for="v in involiceLeiMuList" :label="v.text" :value="v"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="税率">
        <span>{{(form.invoiceLeiMu && form.invoiceLeiMu.taxRate) ? form.invoiceLeiMu.taxRate : 0 }}%</span>
      </el-form-item>
      <el-form-item label="请选择账单">
        <el-radio-group v-model="form.zhangdan">
          <el-radio label="日账单"></el-radio>
          <el-radio label="月账单"></el-radio>
        </el-radio-group>
        <el-table
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="zhangDanSelChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="入账日期"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="账单类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="总金额"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-table
          ref="multipleTable"
          :data="tableData3"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="zhangDanSelChange">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="入账日期"
            width="120">
            <template slot-scope="scope">{{ scope.row.date }}</template>
          </el-table-column>
          <el-table-column
            prop="name"
            label="账单类型"
            width="120">
          </el-table-column>
          <el-table-column
            prop="address"
            label="总金额"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <span style="color: #aaa">备注：只有已出账且未开票的账单能开票</span>
      </el-form-item>
      <el-form-item label="开票金额（含税）">
        <span>32,657.00</span>
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
          <el-table
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="zhangDanSelChange">
            <el-table-column
              label="入账日期"
              width="120">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="账单类型"
              width="120">
            </el-table-column>
            <el-table-column
              prop="address"
              label="总金额"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
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
        // 发票类型
        invoiceTypes: '',
        // 服务IDs
        serviceIds: [],
        // 进度
        step: 1,
        form: {
          invoiceLeiMu: null,
          zhangdan: '日账单',
          content: null,
          beizhu: null
        },
        rules: {
          invoiceLeiMu: [
            { required: true, message: '请选择发票类目', trigger: 'blur' },
          ],
          content: [
            { required: true, message: '请选择发票类目', trigger: 'blur' },
          ]
        },
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        // 发票类目列表
        involiceLeiMuList: []
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
      // 获取列表数据
      getListData_1() {
        const dayType = this.form.zhangdan === '日账单' ? 'day' : 'month'
        const companyId = this.$route.query.keHuId
        const serviceCompanyId = this.$route.query.luoDiId
        get(`/api/recon/settled/to-invoice-flow-order-list?billType=${dayType}&serviceCompanyId=${serviceCompanyId}&companyId=${companyId}`, {}).then(data => {

        })
      },
      getListData_2() {
        const companyId = this.$route.query.keHuId
        const serviceCompanyId = this.$route.query.luoDiId
        get(`/api/recon/settled/to-invocie-service-free-order-list?serviceCompanyId=${serviceCompanyId}&companyId=${companyId}`, {}).then(data => {
          this.involiceLeiMuList = data
        })
      },
      jineForm (source, length = 3) {
        source = String(source).split(".");
        source[0] = source[0].replace(new RegExp('(\\d)(?=(\\d{'+length+'})+$)','ig'),"$1,");
        return source.join(".");
      },
      // 发票类目选择给变的时候调用
      involiceLeiMuSelChange(v) {
        console.log(v)
      },
      // 获取发票类目
      getInvoiceLeiMu() {
        let url = '/api/contract-web/service-mgr/get-service-subject-options';
        let param = {
          serviceIds:this.serviceIds
        };
        post(url, param).then(data => {
          this.involiceLeiMuList = data
        })
      }
    },
    mounted() {
      this.invoiceTypes = JSON.parse(this.$route.query.invoiceTypes)
      this.serviceIds = JSON.parse(this.$route.query.serviceIds)
      this.getInvoiceLeiMu()
      this.getListData_1()
      this.getListData_2()
    }
  }
</script>

<style scoped lang="scss">
  .main-invoice-bill-step1 {
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
  .main-invoice-bill-step1 {
    .step2 {
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
</style>
