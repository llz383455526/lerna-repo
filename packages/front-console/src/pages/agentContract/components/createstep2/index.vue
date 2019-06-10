<template>
    <div>
        <h3 class="green">请添加落地公司
            <el-button size="small" type="primary" @click="$refs['dialog'].showDialog()">添加</el-button>
        </h3>
        <div class="mb25">{{form.contract.datas.agentCompanyBaseInfo.agentType === 'agent' ? '*报价规则：返佣规则（实发*费率）' : '*报价规则：结算规则（客户报价-渠道结算价）'}}</div>
        <el-form ref="serviceFeeContent" :model="form.contract.datas.agentContract" :inline="true">
            <serviceFeeContent v-for="(item, key) in form.contract.datas.agentContract.serviceCompanyFeeContentList" :key="key" :serviceFeeContent="item" :propName="`serviceCompanyFeeContentList.${key}.`" @formDel="formDel"></serviceFeeContent>
        </el-form>
        <serviceDialog :companyId="form.contract.datas.agentCompanyBaseInfo.id" @save="formAdd" ref="dialog"></serviceDialog>
        <div style="text-align: right;">
            <el-button @click="$router.push('list')">返回</el-button>
            <el-button @click="$emit('prev')">上一步</el-button>
            <el-button type="primary" @click="submitForm">下一步</el-button>
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
        validateContract(serviceCompanyId) {
            let someCompany = false;
            const companyId = this.form.contract.datas.agentCompanyBaseInfo.id
            get(`/api/contract-web/agent-residence-flow/check-agent-contract-exists?companyId=${companyId}&serviceCompanyId=${serviceCompanyId}`)
            .then(res => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
                someCompany = true
            })
            return someCompany;
        },
        formDel(index) {
            this.form.contract.datas.agentContract.serviceCompanyFeeContentList.splice(index, 1)
        },
        formAdd(appForm) {
            let someCompany = this.form.contract.datas.agentContract.serviceCompanyFeeContentList.find((el) => {
                return el.serviceCompanyId === appForm.serviceCompanyId
            });
            if (someCompany) {
                this.$message('已经选择该服务商')
                return
            }
            // console.log(this.form.contract)
            // console.log(this.form.contract.operateEnum === 2)
            if (this.form.contract.operateEnum === 2 && this.validateContract(appForm.serviceCompanyId)) {
                this.$message('代理商合同已存在')
                return
            }
            const rObj = Object.assign({}, new Form().serviceCompanyFeeContent, appForm)
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
