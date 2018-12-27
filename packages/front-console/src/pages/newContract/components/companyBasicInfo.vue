<template>
    <div>
        <h3 class="green">请输客户企业信息</h3>
        <el-form-item label="客户性质" prop="customNature" style="width:100%;">
            <el-radio v-model="contractModel.contractForm.customNature"
                      v-for="(item, key) in contractModel.customNatureList"
                      :key="key" :label="item.value">{{item.text}}</el-radio>
            <i class="el-icon-question ml10" title="非直接用工企业：人力资源公司、服务外包公司、城市合伙人公司、第三方平台等"></i>
        </el-form-item>
        <el-form-item label="企业名称" prop="customerName">
            <el-input v-model="contractModel.contractForm.customerName" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="企业地址" prop="areaName">
            <el-input v-model="contractModel.contractForm.areaName" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="法定代表人" prop="customLegalPerson">
            <el-input v-model="contractModel.contractForm.customLegalPerson" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="企业负责人" prop="customCollector">
            <el-input v-model="contractModel.contractForm.customCollector" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="负责人手机" prop="customCollectorPhone">
            <el-input v-model="contractModel.contractForm.customCollectorPhone" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="负责人邮箱" prop="customMail1">
            <el-input v-model="contractModel.contractForm.customMail1" style="width:450px;"></el-input>
        </el-form-item>
        <!-- <el-form-item label="负责人邮箱2" prop="customMail2">
            <el-input v-model="contractModel.contractForm.customMail2" style="width:450px;"></el-input>
        </el-form-item> -->
        <el-form-item label="负责人地址" prop="customCollectorAddr">
            <el-input v-model="contractModel.contractForm.customCollectorAddr" style="width:450px;"></el-input>
        </el-form-item>
    </div>
</template>

<script>
    export default {
        name: "companyBasicInfo",
        props: ['contractModel']
    }
</script>

<style scoped>
    .el-icon-question {
        margin-right: 5px;
        color: #f56c6c;
        cursor: pointer;
    }
</style>