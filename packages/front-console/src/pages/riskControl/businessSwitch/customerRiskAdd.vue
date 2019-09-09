<template>
  <el-dialog
    :visible="show"
    @close="closeDialog"
    width="800px">
    <el-form :model="customerRiskAddForm" :rules="rules" ref="customerRiskAddForm" size="small" label-width="80px">
      <el-form-item label="客户公司" prop="customerCompanyId">
        <el-select filterable style="width: 380px" v-model="customerRiskAddForm.customerCompanyId" @change="getCustomerBusinessRisk">
						<el-option v-for="e in companyList" :value="e.id" :label="e.name" :key="e.id"></el-option>
				</el-select>
      </el-form-item>
      <el-form-item label="">
        已选客户公司名称：{{ customerRiskAddForm.customerCompanyName }}&nbsp;&nbsp;&nbsp;&nbsp;
        <el-switch v-model="customerRiskAddForm.enable" :active-value="1" :inactive-value="0"></el-switch>
        <span>客户发放开关</span><br /><br />
      </el-form-item>
      <el-table
        :data="customerRiskAddForm.detailResultList"
        style="width: 100%">
        <el-table-column
          label="落地公司名称">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.enable" :active-value="1" :inactive-value="0"></el-switch><span> {{ scope.row.serviceCompanyName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="合同是否归档">
          <template slot-scope="scope">
            <span class="item-data">{{ scope.row.contractOk ? '是' : '否' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cuserBalanceStandardStateName"
          label="计算规则是否通过">
        </el-table-column>
      </el-table>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="submitCustomerRiskAddForm">确 定</el-button>
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
      customerRiskAddForm: {
        customerCompanyId: '',
        enable: 0,
        detailAddParamList: []
      },
      rules: {
        customerCompanyId: [{required: true, message: '请选择客户公司', trigger: 'change'}]
      }
    }
  },
  methods: {
    closeDialog() {
      this.$refs.customerRiskAddForm.resetFields()
      this.customerRiskAddForm.detailResultList = []
      this.customerRiskAddForm.customerCompanyName = ''
      this.$emit('update:show',false)
    },
    getCustomerBusinessRisk(customerCompanyId) {
      get(risk.getCustomerBusinessRisk, {
				customerCompanyId
			}).then((data) => {
        data.enable = data.businessStatus
        if (!data.detailResultList) {
					data.detailResultList = []
				}
				data.detailResultList.forEach((item) => {
					item.enable = item.businessStatus
				})
				
				this.customerRiskAddForm = data
			})
    },
     // 提交表单按钮
    submitCustomerRiskAddForm() {
      this.$refs.customerRiskAddForm.validate((valid) => {
        if (valid) {
          this.postCustomerRiskAddForm()
        }
      })
    },
    // 提交表单
    postCustomerRiskAddForm() {
      this.customerRiskAddForm.detailAddParamList = this.customerRiskAddForm.detailResultList
      post(risk.addCustomerBusinessConfig, this.customerRiskAddForm).then(res => {
        this.closeDialog()
        this.$emit('success')
      })
    }
  }
}
</script>

<style>

</style>