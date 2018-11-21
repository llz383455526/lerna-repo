<template>
    <div class="contract-container bg-white p15">
        <el-form :model="contractModel.contractForm"
                 :rules="contractModel.rules"
                 ref="contractForm"
                 label-width="200px"
                 class="contractForm"
                 :disabled="editType === 'watch'||editType ==='workflow'">
            <!--合同选项-->
            <contractOption :contractModel="contractModel" @setSettleType="setSettleType"></contractOption>
            <!--客户企业评估-->
            <customerEva :contractModel="contractModel"></customerEva>
            <!--销售联系信息-->
            <salesContactInfo :contractModel="contractModel"></salesContactInfo>
            <!--企业基本信息-->
            <companyBasicInfo :contractModel="contractModel"></companyBasicInfo>
            <!--相关商户信息-->
            <relevantMerchantInfo :contractModel="contractModel"></relevantMerchantInfo>
            <!--企业开票信息-->
            <businessBillingInfo :contractModel="contractModel"></businessBillingInfo>
            <!--落地公司信息-->
            <companyInfo :contractModel="contractModel"></companyInfo>
            <!--合同附加条款-->
            <additionalClause :contractModel="contractModel" :editType="editType"
                              :files="contractModel.files"></additionalClause>
            <!--操作按钮-->
            <el-form-item v-if="editType != 'watch'&&editType!='workflow'">
                <el-button type="primary" @click="submitContract('contractForm')">提交审核</el-button>
                <el-button type="primary" @click="saveContract(false)">保存</el-button>
                <el-button @click="backToList('list')">取消</el-button>
            </el-form-item>
        </el-form>
        <!--生成合同-->
        <generateContract :contractModel="contractModel"></generateContract>
        <!--审核意见-->
        <auditOption :contractModel="contractModel" :editType="editType"></auditOption>
    </div>
</template>

<script>
    import { post } from "../../store/api"
    import { showNotify } from "../../plugin/utils-notify";

    import ContractModel from '../../model/ContractModel'
    import contractOption from './components/contractOption'
    import customerEva from './components/customerEva'
    import salesContactInfo from './components/salesContactInfo'
    import companyBasicInfo from './components/companyBasicInfo'
    import relevantMerchantInfo from './components/relevantMerchantInfo'
    import businessBillingInfo from './components/businessBillingInfo'
    import companyInfo from './components/companyInfo'
    import additionalClause from './components/additionalClause'
    import generateContract from './components/generateContract'
    import auditOption from './components/auditOption'
    import upload from './components/upload'

    export default {
        components: {
            contractOption,
            customerEva,
            salesContactInfo,
            companyBasicInfo,
            relevantMerchantInfo,
            businessBillingInfo,
            companyInfo,
            additionalClause,
            generateContract,
            auditOption,
            upload
        },
        created() {
        	let id = this.$route.query.id;
            if (id) {
            	this.contractModel.contractId = id;
                this.contractModel.getContractDetail(id);
            } else {
            	this.contractModel.getContractId();
            }
            let workflowType = this.$route.query.workflowType;
            if (workflowType) {
                this.contractModel.workflowType = workflowType;
            }
            this.editType = this.$route.query.editType || 'new';
            this.contractModel.editType = this.$route.query.editType || 'new';
        },
        data() {
        	return {
                contractModel: new ContractModel()
            }
        },
        methods: {
            saveContract(isSubmit) {
                this.contractModel.changeServiceFeeList();
                let url = this.editType === 'edit' ? '/api/opencrm/workflow/update_data' : '/api/opencrm/workflow/create'
                let _form = {
                    datas: this.contractModel.contractForm,
	                instanceId: this.contractModel.contractId,
                    workflowType: this.contractModel.workflowType
                };
                return new Promise((resolve, reject) => {
	                post(url, _form).then(result => {
                        resolve('save');
                        if(!isSubmit) {
                            showNotify('success', '保存成功');
                            this.backToList('list')
                        }
                    })
                })
            },
            submitContract(formName) {
                this.$refs[formName].validate(valid => {
                    if (valid && this.contractModel.contractForm.contracts.length
                            && this.contractModel.contractForm.companyApps.length) {
                        // 其它都通过了 再检测上传清单
                        if (this.contractModel.workflowType === 'create_sale_contract'
                            && this.contractModel.contractForm.collector === '0'
                            && this.contractModel.contractForm.referIds.length === 0) {
                            showNotify('error', '请上传清单');
                            return;
                        }

                        this.saveContract(true).then(result => {
                            post('/api/opencrm/workflow/submit', {
                                id: this.contractModel.contractId
                            }).then(result => {
                                showNotify('success', '提交审核成功');
                                this.backToList('list')
                            })
                        })
                    } else {
                        showNotify('error', '请检查输入项错误！')
                    }
                })
            },
            backToList(path) {
                this.$router.replace({
                    path: path
                })
            },
            setSettleType () {
                this.$refs['contractForm'].validateField('serviceType')
            }
        }
    }
</script>

<style lang="scss" scoped>
    .contract-container {
        margin-bottom: 30px;
    }
    .contractForm {
        width: 900px;
    }
    .detail-form .el-form-item {
        margin-bottom: 0;
    }
</style>