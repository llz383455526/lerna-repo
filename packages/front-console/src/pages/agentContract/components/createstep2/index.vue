<template>
    <div>
        <h3 class="green">请添加落地公司
            <el-button size="small" type="primary" @click="dialogVisible = true">添加</el-button>
        </h3>
        <div class="mb25">报价规则：代理商返佣结算模式（实发*返佣比例）</div>
        <div class="widget-box mb20" v-for="(formItem,index) in ruleForm.serviceCompanyFeeContentList" :key="index">
            <div class="widget-header">
                <!-- 落地公司名称 -->
                <h4 class="widget-title mr25">{{ formItem.taxLandingName }} / {{ formItem.serviceCompanyName || '落地公司名称' }}</h4>
                <div class="widget-toolbar">
                    <el-button @click="deleteForm(index)" type="text" size="medium" v-if="!showDelBtn">删除</el-button>
                </div>
            </div>
            <div class="widget-main">
                <!-- 这里是服务合同的细节 -->
                <settlement-rate ref="settlementRate" :serviceCompanyFeeContent="formItem"></settlement-rate>
            </div>
        </div>
        <div>
            <el-button>返回</el-button>
            <el-button @click="prev">上一步</el-button>
            <el-button type="primary" @click="submitForm">下一步</el-button>
        </div>
        <el-dialog title="添加公司信息" :visible.sync="dialogVisible" width="700px">
            <el-form :inline="true" :model="appForm" label-width="150px" ref="appForm">
                <el-form-item label="服务商名称">
                    <el-select v-model="appForm.serviceCompanyId" filterable placeholder="请选择" style="width: 450px;">
                        <el-option v-for="(item,key) in filterList" :key="key" :label="item.name" :value="item.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="margin-left: 150px;">
                    <el-button type="primary" @click="formAdd">保存</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
import settlementRate from 'src/pageComponent/settlementRate'
import Form from 'src/model/agentContract/step2'

export default {
    components: { settlementRate },
    props: {
        form: {
            type: Object
        }
    },
    data() {
        return {
            dialogVisible: false,
            appForm: {
                serviceCompanyId: '',
                serviceCompanyName: '',
                taxLandingName: ''
            },
            ruleForm: new Form()
        }
    },
    computed: {
        filterList() {
            return this.$store.getters.serviceCompaniesList
        }
    },
    methods: {
        formAdd() {
            const { serviceCompanyId } = this.appForm
            const obj = this.filterList.find((item) => {
                return item.companyId === serviceCompanyId
            })
            this.appForm.serviceCompanyName = obj.name
            this.appForm.taxLandingName = obj.taxLandingName
            this.ruleForm.serviceCompanyFeeContentList.push(this.appForm)
            this.dialogVisible = false
        },
        submitForm() {
            if(!this.ruleForm.serviceCompanyFeeContentList.length) {
                this.$message('请最少选择一个服务商')
                return
            }
            this.$refs['settlementRate'].forEach((item, i) => {
                item.validate((res) => {
                    if(res && this.ruleForm.serviceCompanyFeeContentList[i]) {
                        Object.assign(this.ruleForm.serviceCompanyFeeContentList[i], res)
                    }
                })
            })
            this.form.datas.agentContract.serviceCompanyFeeContentList = this.ruleForm.serviceCompanyFeeContentList
            this.ruleForm.submitForm(this.form)
        },
        prev() {
            this.$emit('prev')
        }
    },
    created() {
        this.$store.dispatch('getServiceCompaniesList')
    }
}
</script>
