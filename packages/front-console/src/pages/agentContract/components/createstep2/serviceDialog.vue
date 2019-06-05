<template>
    <el-dialog title="添加公司信息" :visible.sync="dialogVisible" width="700px">
        <el-form :inline="true" :model="appForm" label-width="150px" ref="appForm">
            <el-form-item label="服务商名称">
                <el-select v-model="appForm.serviceCompanyId" filterable placeholder="请选择" style="width: 450px;">
                    <el-option v-for="(item,key) in operateEnum == '3' ? agentServiceCompanyList : filterList" :key="key" :label="item.name" :value="item.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 150px;">
                <el-button type="primary" @click="save">保存</el-button>
                <el-button @click="hideDialog">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
import { get } from 'src/store/api'

export default {
    computed: {
        filterList() {
            return this.$store.getters.serviceCompaniesList
        }
    },
    data() {
        return {
            appForm: {
                serviceCompanyId: '',
                serviceCompanyName: '',
                taxLandingName: ''
            },
            dialogVisible: false,
            operateEnum: '',
            agentServiceCompanyList: []
        }
    },
    props: {
        companyId: {}
    },
    methods: {
        save() {
            const { serviceCompanyId } = this.appForm
            const obj = this.filterList.find((item) => {
                return item.companyId === serviceCompanyId
            })
            this.appForm.serviceCompanyName = obj.name
            this.appForm.taxLandingName = obj.taxLandingName
            this.$emit('save', this.appForm)
        },
        hideDialog() {
            this.dialogVisible = false
        },
        showDialog() {
            this.dialogVisible = true
        },
        getAgentServiceCompany() {
            get('/api/contract-web/agent-residence-flow/agent-service-company-options?companyId='+this.companyId).then((data) => {
                this.agentServiceCompanyList = data
            })
        }
    },
    created() {
        this.operateEnum = this.$route.query.operateEnum
        if (this.operateEnum == '3') {
            this.getAgentServiceCompany()
        }
    }
}
</script>

