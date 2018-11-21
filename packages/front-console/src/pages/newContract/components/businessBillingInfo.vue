<template>
    <div>
        <h4 class="ml50">企业开票信息</h4>
        <el-form-item label="企业名称" prop="invoiceCompanyName">
            <el-input v-model="contractModel.contractForm.invoiceCompanyName"></el-input>
        </el-form-item>
        <el-form-item label="纳税人识别号" prop="customTaxIdcd" >
            <el-input v-model="contractModel.contractForm.customTaxIdcd"></el-input>
        </el-form-item>
        <el-form-item label="企业地址" prop="areaName">
            <el-input v-model="contractModel.contractForm.areaName"></el-input>
        </el-form-item>
        <el-form-item label="企业电话" prop="customPhone">
            <el-input v-model="contractModel.contractForm.customPhone"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="customBankName">
            <el-input v-model="contractModel.contractForm.customBankName"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="customBankAccount">
            <el-input v-model="contractModel.contractForm.customBankAccount"></el-input>
        </el-form-item>
        <el-form-item label="发票类型" prop="invoiceType">
            <el-select v-model="contractModel.contractForm.invoiceType" placeholder="请选择" style="width:100%;">
                <el-option v-for="(item,key) in contractModel.invoiceTypeList" :key="key" :label="item.text" :value="item.value"></el-option>
            </el-select>
            <el-checkbox v-model="contractModel.contractForm.showSubjectInfo">合同中显示发票类型</el-checkbox>
        </el-form-item>
    </div>
</template>

<script>
    export default {
        name: "BusinessBillingInfo",
        props: ['contractModel']
    }
</script>

<style scoped>

</style>