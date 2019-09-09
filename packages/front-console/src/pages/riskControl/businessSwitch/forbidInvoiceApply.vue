<template>
  <el-dialog
    title="添加配置：禁止开票申请"
    :visible="show"
    @close="closeDialog"
    width="500px">
    <el-form :rules="rules" :model="forbidInvoiceApplyForm" ref="forbidInvoiceApplyForm" size="small" label-width="80px">
      <el-form-item label="客户公司" prop="customerCompanyId">
        <el-select filterable style="width: 380px" v-model="forbidInvoiceApplyForm.customerCompanyId" @change="getServiceCompany">
						<el-option v-for="e in companyList" :value="e.id" :label="e.name" :key="e.id"></el-option>
				</el-select>
      </el-form-item>
      <el-form-item label="落地公司" prop="serviceCompanyIds">
        <el-checkbox v-if="serviceCompany.length" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
        <el-checkbox-group v-model="forbidInvoiceApplyForm.serviceCompanyIds" @change="handleCheckedServiceChange">
          <el-checkbox v-for="item in serviceCompany" :label="item.id" :key="item.id">{{item.name}}
            <el-tag v-if="item.direct" type="success" size="small">自营</el-tag>
            <el-tag v-else size="small">非自营</el-tag>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="原因" prop="remark">
        <el-input type="textarea" v-model="forbidInvoiceApplyForm.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitForbidInvoiceApplyForm">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import {post, get} from 'store/api'
import {risk} from 'src/api'

export default {
  props: {
    show: {
      type: Boolean
    },
    companyList: {
      type: Array
    }
  },
  data() {
    return {
      forbidInvoiceApplyForm: {
        customerCompanyId: '',
        serviceCompanyIds: [],
        remark: ''
      },
      checkAll: false,
      serviceCompany: [],
      rules: {
        customerCompanyId: [
          {required: true, message: '请选择客户公司', trigger: 'change'}
        ],
        serviceCompanyIds: [
          {required: true, message: '请选择落地公司', trigger: 'change'}
        ],
        remark: [
          {required: true, message: '请填写禁止原因', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    closeDialog() {
      this.$refs.forbidInvoiceApplyForm.resetFields()
      this.serviceCompany = []
      this.$emit('update:show',false)
    },
    // 全选操作
    handleCheckAllChange(val) {
      // 全选，取消全选
      this.forbidInvoiceApplyForm.serviceCompanyIds = val ? this.serviceCompany.map(item => item.id) : [];
    },
    // 选择落地公司
    handleCheckedServiceChange(val) {
      console.log(val)
      if(val.length === this.serviceCompany.length) {
        this.checkAll = true
      } else {
        this.checkAll = false
      }
    },
    // 获取服务公司
    getServiceCompany(customerCompanyId) {
      get(risk.getServiceCompany, {customerCompanyId}).then(data => {
        this.serviceCompany = data || []
      })
    },
     // 提交表单按钮
    submitForbidInvoiceApplyForm() {
      this.$refs.forbidInvoiceApplyForm.validate((valid) => {
        if (valid) {
          this.postForbidInvoiceApplyForm()
        }
      })
    },
    // 提交表单
    postForbidInvoiceApplyForm() {
      post(risk.invoiceRiskAdd, this.forbidInvoiceApplyForm).then(res => {
        this.closeDialog()
        this.$emit('success')
      })
    }
  }
}
</script>

<style>

</style>