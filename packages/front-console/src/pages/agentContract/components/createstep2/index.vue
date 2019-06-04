<template>
    <div>
        <h3 class="green">请添加落地公司
            <el-button size="small" type="primary" @click="dialogVisible = true">添加</el-button>
        </h3>
        <div class="mb25">报价规则：代理商返佣结算模式（实发*返佣比例）</div>
        <serviceList :serviceCompanyFeeContentList="serviceCompanyFeeContentList" ref="serviceList"></serviceList>
        <serviceDialog :dialogVisible="dialogVisible" @close="dialogVisible = false" @formAdd="formAdd"></serviceDialog>
        <div>
            <el-button>返回</el-button>
            <el-button @click="prev">上一步</el-button>
            <el-button type="primary" @click="submitForm">下一步</el-button>
        </div>
    </div>
</template>

<script>
import Form from 'src/model/agentContract/step2'
import serviceDialog from './serviceDialog'
import serviceList from './serviceList'

export default {
    components: { serviceDialog, serviceList },
    props: {
        form: {
            type: Object
        }
    },
    data() {
        return {
            dialogVisible: false,
            ruleForm: new Form()
        }
    },
    computed: {
        serviceCompanyFeeContentList() {
            return this.form.datas.agentContract.serviceCompanyFeeContentList || ruleForm.serviceCompanyFeeContentList
        }
    },
    methods: {
        formAdd(appForm) {
            this.ruleForm.serviceCompanyFeeContentList.push(appForm)
            this.dialogVisible = false
        },
        submitForm() {
            if(!this.serviceCompanyFeeContentList.length) {
                this.$message('请最少选择一个服务商')
                return
            }
            const result = this.$refs['serviceList'].validate()
            if (result) {
                this.form.datas.agentContract.serviceCompanyFeeContentList = result
                this.ruleForm.submitForm(this.form).then(() => {
                    this.$emit('step')
                })
            }
        },
        prev() {
            this.$emit('prev')
        }
    },
    created() {
        // console.log(this.serviceCompanyFeeContentList)
        this.$store.dispatch('getServiceCompaniesList')
    }
}
</script>
