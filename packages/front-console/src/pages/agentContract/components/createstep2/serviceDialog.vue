<template>
    <el-dialog title="添加公司信息" :visible.sync="dialogVisible" width="700px">
        <el-form :inline="true" :model="appForm" label-width="150px" ref="appForm">
            <el-form-item label="服务商名称">
                <el-select v-model="appForm.serviceCompanyId" filterable placeholder="请选择" style="width: 450px;">
                    <el-option v-for="(item,key) in filterList" :key="key" :label="item.name" :value="item.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-left: 150px;">
                <el-button type="primary" @click="formAdd">保存</el-button>
                <el-button @click="close">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</template>

<script>
export default {
    props: {
        dialogVisible: {
            type: Boolean
        }
    },
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
        }
    },
    methods: {
        close() {
            this.$emit('close')
        },
        formAdd() {
            const { serviceCompanyId } = this.appForm
            const obj = this.filterList.find((item) => {
                return item.companyId === serviceCompanyId
            })
            this.appForm.serviceCompanyName = obj.name
            this.appForm.taxLandingName = obj.taxLandingName
            this.$emit('formAdd', this.appForm)
        }
    }
}
</script>

