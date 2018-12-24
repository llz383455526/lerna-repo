<template>
  <div class="main-invoice-bill-step1">
    <p>{{ kaiPiaoType ? '账单开票' : '预开票' }}</p>
    <el-steps :active="1" align-center>
      <el-step title="选择账单"></el-step>
      <el-step title="核对"></el-step>
    </el-steps>
    <br><br>
    <el-form ref="form" :rules="rules" :model="form" label-width="170px">
      <el-form-item label="发票类型" prop="invoiceType">
        <el-radio-group @change="zhangDanDateChange" v-model="form.invoiceType">
          <el-radio v-for="(v, k) in invoiceTypes" :label="v.text"></el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="发票类目" prop="invoiceLeiMu">
        <el-select v-model="form.invoiceLeiMu" placeholder="请选择发票类目">
          <el-option v-for="v in involiceLeiMuList" :label="v.text" :value="v"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="税率">
        <span>{{(form.invoiceLeiMu && form.invoiceLeiMu.taxRate) ? form.invoiceLeiMu.taxRate : 0 }}%</span>
      </el-form-item>
      <el-form-item label="请选择账单" v-if="kaiPiaoType">
        <el-radio-group @change="zhangDanDateChange" v-model="form.zhangdan">
          <el-radio label="日账单"></el-radio>
          <el-radio label="月账单"></el-radio>
        </el-radio-group>
        <el-table
          ref="multipleTable"
          :data="liuShuiDataArr"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="zhangDanSelChange_0">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="入账日期"
            prop="settleDate"
            width="220">
          </el-table-column>
          <el-table-column
            label="账单类型"
            width="120">
            <template slot-scope="scope">流水账单</template>
          </el-table-column>
          <el-table-column
            prop="amount"
            label="总金额"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <el-table
          ref="multipleTable"
          :data="serverDataArr"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="zhangDanSelChange_1">
          <el-table-column
            type="selection"
            width="55">
          </el-table-column>
          <el-table-column
            label="入账日期"
            prop="settleDate"
            width="220">
          </el-table-column>
          <el-table-column
            label="账单类型"
            width="120">
            <template slot-scope="scope">服务费账单</template>
          </el-table-column>
          <el-table-column
            prop="serviceFee"
            label="总金额"
            show-overflow-tooltip>
          </el-table-column>
        </el-table>
        <span style="color: #aaa">备注：只有已出账且未开票的账单能开票</span>
      </el-form-item>
      <el-form-item label="开票金额（含税）" v-if="kaiPiaoType">
        <span>{{ kaiPiaoTotalStr }}</span>
      </el-form-item>
      <el-form-item prop="kaiPiaoTotal" label="开票金额（含税）" v-else>
        <el-input type="number" v-model.number="form.kaiPiaoTotal"></el-input>
      </el-form-item>
      <el-form-item label="发票用途（对内说明)" prop="purpose">
        <el-input v-model="form.purpose"></el-input>
      </el-form-item>
      <el-form-item label="发票显示备注">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @cancel="cancleBtnClick">取消</el-button>
        <el-button type="primary" @click="nextBtnClick">下一步</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
  import {post, get} from '../../../store/api';
  import { NumberComma } from 'yb-tool'
  export default {
    name: "step1",
    data() {
      return {
        // 发票类型
        invoiceTypes: [],
        // 服务IDs
        serviceIds: [],
        form: {
          // 发票类型
          invoiceType: '',
          invoiceLeiMu: '',
          zhangdan: '日账单',
          // 开票总金额
          kaiPiaoTotal: '',
          // 发票用途
          purpose: '',
          remark: ''
        },
        rules: {
          invoiceLeiMu: [
            { required: true, message: '请选择发票类目', trigger: 'blur' },
          ],
          purpose: [
            { required: true, message: '请填写发票用途', trigger: 'blur' },
          ],
          invoiceType: [
            { required: true, message: '请选择发票类型', trigger: 'blur' },
          ],
          kaiPiaoTotal: [
            { required: true, message: '请输入数据', trigger: 'blur' },
          ]
        },
        // 发票类目列表
        involiceLeiMuList: [],
        // 流水账单列表
        liuShuiDataArr: [],
        // 服务费账单列表
        serverDataArr: [],
        // 流水选择列表
        liuShuiSelList: [],
        // 服务费账单选择列表
        serverSelList: []
      }
    },
    computed: {
      kaiPiaoTotalStr() {
        return NumberComma(this.form.kaiPiaoTotal)
      },
      // true: 账单开票 false: 预开票
      kaiPiaoType() {
        return this.$route.query.openInvoiceType === '10'
      }
    },
    methods: {
      // 账单选择改变
      zhangDanSelChange_0(e) {
        this.liuShuiSelList = e
        this.getKaiPiaoTotal()
      },
      zhangDanSelChange_1(e) {
        this.serverSelList = e
        this.getKaiPiaoTotal()
      },
      // 账单日期选择改变的时候调用
      zhangDanDateChange() {
        this.getListData_1()
        this.getKaiPiaoTotal()
      },
      // 获取开票总金额
      getKaiPiaoTotal() {
        let money = 0
        this.liuShuiSelList.forEach((item) => {
          money += (item.amount ? item.amount : 0)
        })
        this.serverSelList.forEach((item) => {
          money += (item.serviceFee ? item.serviceFee : 0)
        })
        this.form.kaiPiaoTotal = money
      },
      // 下一步按钮点击
      nextBtnClick() {
        this.check().then(() => {
          if (this.liuShuiSelList.length === 0 && this.serverSelList.length === 0 && this.kaiPiaoType) {
            this.$message.error('请选择账单');
            return
          }
          let invoiceType = ''
          this.invoiceTypes.forEach((item) => {
            if (this.form.invoiceType === item.text) {
              invoiceType = item.value
            }
          })
          const invoiceServiceOrderItems = []
          if (this.kaiPiaoType) {
            this.liuShuiSelList.forEach((item) => {
              invoiceServiceOrderItems.push({
                amount: item.amount ? item.amount : 0,
                businessId: item.id,
                entryDate: item.settleDate,
                orderType: true
              })
            })
            this.serverSelList.forEach((item) => {
              invoiceServiceOrderItems.push({
                amount: item.serviceFee ? item.serviceFee : 0,
                businessId: item.id,
                entryDate: item.settleDate,
                orderType: false
              })
            })
          }
          const p = {
            // 账单类型
            billType: this.form.zhangdan === '日账单' ? 'day' : 'month',
            // 客户公司ID
            customCompanyId: parseInt(this.$route.query.keHuId),
            // 开票申请类型(1:账单开票；2预开票)
            drawBillType:  this.kaiPiaoType ? 1 : 2,
            invoiceServiceOrderItems: invoiceServiceOrderItems,
            // 发票类型
            invoiceType: invoiceType,
            // 发票用途
            purpose: this.form.purpose,
            // 开票公司发票备注
            remark: this.form.remark,
            // 服务公司ID
            serviceCompanyId: parseInt(this.$route.query.luoDiId),
            // 发票类目
            subjectId: parseInt(this.form.invoiceLeiMu.value),
            // 发票类目名称
            subjectName: this.form.invoiceLeiMu.text,
            // 开票总金额
            totalAmount: Number(this.form.kaiPiaoTotal.toFixed(2))
          }
          post(`/api/invoice-web/invoice/restruct-invoice-add`, p).then(data => {

          })
        }).catch(() => {})
      },
      // 取消按钮点击
      cancleBtnClick() {
        this.$router.replace('/main/invoice/list')
      },
      // 获取列表数据
      getListData_1() {
        const dayType = this.form.zhangdan === '日账单' ? 'day' : 'month'
        const companyId = this.$route.query.keHuId
        const serviceCompanyId = this.$route.query.luoDiId
        get(`/api/recon/settled/to-invoice-flow-order-list?billType=${dayType}&serviceCompanyId=${serviceCompanyId}&companyId=${companyId}`, {}).then(data => {
          this.liuShuiDataArr = data
        })
      },
      getListData_2() {
        const companyId = this.$route.query.keHuId
        const serviceCompanyId = this.$route.query.luoDiId
        get(`/api/recon/settled/to-invocie-service-free-order-list?serviceCompanyId=${serviceCompanyId}&companyId=${companyId}`, {}).then(data => {
          this.serverDataArr = data
        })
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
      },
      // 数据校验
      check() {
        return new Promise((resolve, reject) => {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              resolve()
            } else {
              reject()
              return false;
            }
          });
        })
      }
    },
    mounted() {
      this.invoiceTypes = JSON.parse(this.$route.query.invoiceTypes)
      this.form.invoiceType = this.invoiceTypes[0].text
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

