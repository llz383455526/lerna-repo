<template>
    <div>
        <h3 class="green">请添加落地公司
            <el-button size="small" type="primary" @click="showDialog">添加</el-button>
        </h3>
        <div class="mb25">报价规则：代理商返佣结算模式（实发*返佣比例）</div>
        <serviceList :serviceCompanyFeeContentList="form.datas.agentContract.serviceCompanyFeeContentList" ref="serviceList" @formDel="formDel"></serviceList>
        <serviceDialog @save="formAdd" ref="dialog"></serviceDialog>
        <div>
            <el-button>返回</el-button>
            <el-button @click="prev">上一步</el-button>
            <el-button type="primary" @click="submitForm">下一步</el-button>
        </div>
    </div>
</template>

<script>
// import Form from 'src/model/agentContract/step2'
import Form from 'src/model/settlementRate'
import serviceDialog from './serviceDialog'
import serviceList from './serviceList'
import { post } from 'src/store/api'

export default {
    components: { serviceDialog, serviceList },
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
        formDel(index) {
            this.form.datas.agentContract.serviceCompanyFeeContentList.splice(index, 1)
        },
        formAdd(appForm) {
            const someCompany = this.form.datas.agentContract.serviceCompanyFeeContentList.find((el) => {
                return el.serviceCompanyId === appForm.serviceCompanyId
            });
            if (someCompany) {
                this.$message('已经选择该服务商')
                return
            }
            const rObj = Object.assign({}, this.settlementRate.serviceCompanyFeeContent, appForm)
            this.form.datas.agentContract.serviceCompanyFeeContentList.push(rObj)
            this.$refs['dialog'].hideDialog()
        },
        submitForm() {
            if(!this.form.datas.agentContract.serviceCompanyFeeContentList.length) {
                this.$message('请最少选择一个服务商')
                return
            }
            const result = this.$refs['serviceList'].validate()
            if (result) {
                // this.form.datas.agentContract.serviceCompanyFeeContentList = result
                post('/api/contract-web/agent-residence-flow/agent-residence-submit', this.form).then(() => {
                    this.$emit('step')
                })
            }
        },
        prev() {
            this.$emit('prev')
        },
        showDialog() {
            this.$refs['dialog'].showDialog()
        }
    },
    created() {
        this.$store.dispatch('getServiceCompaniesList')
    }
}
</script>
