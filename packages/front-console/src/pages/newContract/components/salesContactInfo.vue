<template>
<div>
    <el-form-item label="销售姓名" prop="contractPerson">
        <el-input v-model="contractModel.contractForm.contractPerson" style="width:450px;"></el-input>
    </el-form-item>
    <el-form-item label="销售联系邮箱" prop="contractEmail">
        <el-input v-model="contractModel.contractForm.contractEmail" style="width:450px;"></el-input>
    </el-form-item>
    <el-form-item label="销售联系电话" prop="contractTel">
        <el-input v-model="contractModel.contractForm.contractTel" style="width:450px;"></el-input>
    </el-form-item>
    <el-form-item label="合同联系人地址" prop="contractAddr">
        <el-input v-model="contractModel.contractForm.contractAddr" style="width:450px;"></el-input>
    </el-form-item>
    <hr>
    <el-form-item label="是否代理商客户" prop="agentClient">
        <el-radio-group v-model="contractModel.contractForm.agentClient" style="width:900px;">
            <el-radio :label="false">否</el-radio>
            <el-radio :label="true">是</el-radio>
        </el-radio-group>
    </el-form-item>
    <el-form-item label="代理商名称" prop="agentCompanyId" v-if="contractModel.contractForm.agentClient">
        <el-select v-model="contractModel.contractForm.agentCompanyId" style="width:900px;" @change="companyChange">
            <el-option v-for="e in contractModel.agentList" :key="e.companyId" :label="e.companyName" :value="e.companyId"></el-option>
        </el-select>
    </el-form-item>
</div>
</template>

<script>
import {
    get
} from '../../../store/api'
export default {
    name: "salesContactInfo",
    props: ['contractModel'],
    data() {
        return {
            // agentList: []
        }
    },
    mounted() {
        // get('/api/contract-web/agent-contract/agent-company-option?sign=true').then(data => {
        //     this.agentList = data

            // this.contractForm.agentCompanyId
            // this.contractModel.contractForm.contracts.forEach((e, i) => {
            //     this.companyChange(i)
            // })

        // })
    },
    methods: {
        companyChange(companyId) {
            this.contractModel.getChargeByName(companyId);
            // let obj = this.agentList.find(element => {
            //     return element.companyId === companyId;
            // });
            // this.contractModel.chargeByName = obj.chargeByName;
        }
    }
}
</script>

<style scoped>

</style>
