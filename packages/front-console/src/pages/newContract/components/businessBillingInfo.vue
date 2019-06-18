<template>
  <div>
    <h3 class="green">请输企业开票信息</h3>
    <el-form-item label="开票企业名称"
      prop="invoiceCompanyName">
      <el-input v-model="contractModel.contractForm.invoiceCompanyName"
        style="width:450px;"
        @focus="focusInvoiceCompanyName"
        :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item label="纳税人识别号"
      prop="customTaxIdcd">
      <el-input v-model="contractModel.contractForm.customTaxIdcd"
        style="width:450px;"
        :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item label="开票企业地址"
      prop="invoiceAddress">
      <el-input v-model="contractModel.contractForm.invoiceAddress"
        style="width:450px;"
        @focus="focusAreaName"
        :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item label="企业电话"
      prop="customPhone">
      <el-input v-model="contractModel.contractForm.customPhone"
        style="width:450px;"
        :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item label="开户银行"
      prop="customBankName">
      <el-input v-model="contractModel.contractForm.customBankName"
        style="width:450px;"
        :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item label="银行账号"
      prop="customBankAccount">
      <el-input v-model="contractModel.contractForm.customBankAccount"
        style="width:450px;"
        :disabled="isChange"></el-input>
    </el-form-item>
    <el-form-item label="发票类型"
      prop="invoiceType">
      <el-select v-model="contractModel.contractForm.invoiceType"
        placeholder="请选择"
        style="width:450px;"
        :disabled="isChange">
        <el-option v-for="(item,key) in contractModel.invoiceTypeList"
          :key="key"
          :label="item.text"
          :value="item.value"></el-option>
      </el-select>
      <el-checkbox v-model="contractModel.contractForm.showSubjectInfo"
        :disabled="isChange">合同中显示发票类型</el-checkbox>
    </el-form-item>
  </div>
</template>

<script>
    export default {
        name: "BusinessBillingInfo",
        props: ['contractModel'],
        computed: {
            isChange() {
                return this.contractModel.workflowType.indexOf('update') !== -1
            }
        },
        methods: {
            focusInvoiceCompanyName(e) {
                if(!e.target.value) {
                    this.contractModel.contractForm.invoiceCompanyName = this.contractModel.contractForm.customerName
                }
            },
            focusAreaName(e) {
                if(!e.target.value) {
                    this.contractModel.contractForm.invoiceAddress = this.contractModel.contractForm.areaName
                }
            }
        },
        created () {
            this.contractModel.contractForm.showSubjectInfo = this.contractModel.contractForm.showSubjectInfo === '1' ? true : false;
        }
    }
</script>

<style scoped>
</style>