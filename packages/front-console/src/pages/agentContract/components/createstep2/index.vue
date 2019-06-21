<template>
  <div>
    <h3 class="green">请添加落地公司
      <el-button size="small"
        type="primary"
        @click="$refs['dialog'].showDialog()">添加</el-button>
    </h3>
    <div class="mb25">{{form.contract.datas.agentCompanyBaseInfo.agentType === 'agent' ? '*报价规则：返佣规则（实发*费率）' : '*报价规则：底价结算（客户报价-渠道结算价）'}}</div>
    <el-form ref="serviceFeeContent"
      :model="form.contract.datas.agentContract"
      :inline="true">
      <serviceFeeContent v-for="(item, key) in form.contract.datas.agentContract.serviceCompanyFeeContentList"
        :key="key"
        :serviceFeeContent="item"
        :propName="`serviceCompanyFeeContentList.${key}.`"
        @formDel="formDel(key)"></serviceFeeContent>
    </el-form>
    <serviceDialog :companyId="form.contract.datas.agentCompanyBaseInfo.id"
      @save="formAdd"
      ref="dialog"></serviceDialog>
    <div style="text-align: right;">
      <el-button @click="$router.push('list')">返回</el-button>
      <el-button @click="$emit('prev')">上一步</el-button>
      <el-button type="primary"
        @click="submitForm">下一步</el-button>
    </div>
  </div>
</template>

<script>
import Form from 'src/model/settlementRate'
import serviceDialog from './serviceDialog'
import { get, post } from 'src/store/api'
import serviceFeeContent from './serviceFeeContent'

export default {
    components: { serviceDialog, serviceFeeContent },
    props: {
        form: {
            type: Object
        }
    },
    data() {
        return {
            settlementRate: new Form()
        }
    },
    methods: {
        validateCompanyExists(appForm) {
            const companyId = this.form.contract.datas.agentCompanyBaseInfo.id
            return new Promise(resolve => {
                get(`/api/contract-web/agent-residence-flow/check-agent-contract-exists?companyId=${companyId}&serviceCompanyId=${appForm.serviceCompanyId}`)
                .then(res => {
                    resolve(res)
                })
            }) 
        },
        getFeeContent(appForm) {
            const companyId = this.form.contract.datas.agentCompanyBaseInfo.id
            const { serviceCompanyId } = appForm
            return new Promise(resolve => {
                get(`/api/contract-web/agent-residence-flow/agent-contract-flow-form?companyId=${companyId}&serviceCompanyId=${serviceCompanyId}`)
                .then(res => {
                    resolve(res)
                })
            })
        },
        formDel(index) {
            this.form.contract.datas.agentContract.serviceCompanyFeeContentList.splice(index, 1)
        },
        async formAdd(appForm) {
            const someCompany = this.form.contract.datas.agentContract.serviceCompanyFeeContentList.find((el) => {
                return el.serviceCompanyId === appForm.serviceCompanyId
            });
            if (someCompany) {
                this.$message('已经选择该服务商')
                return
            }
            if (this.form.contract.operateEnum === 2) {
                const result = await this.validateCompanyExists(appForm)
                if (!result.result) {
                    this.$message(result.message)
                    return
                }
            }
            let feeContent = {}
            if (this.form.contract.operateEnum === 3) {
                feeContent = await this.getFeeContent(appForm)
            }
            const rObj = Object.assign({}, new Form().serviceCompanyFeeContent, appForm, feeContent)
            this.form.contract.datas.agentContract.serviceCompanyFeeContentList.push(rObj)
            this.$refs['dialog'].hideDialog()
        },
        submitForm() {
            if(!this.form.contract.datas.agentContract.serviceCompanyFeeContentList.length) {
                this.$message('请最少选择一个服务商')
                return
            }
            this.$refs['serviceFeeContent'].validate((valid) => {
                if (valid) {
                    this.form.submit().then(() => {
                        this.$emit('next')
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            })
        },
    },
    created() {
        this.$store.dispatch('getServiceCompaniesList')
    }
}
</script>
