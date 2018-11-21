<template>
    <div>
        <h4 class="ml50">销售联系信息</h4>
        <el-form-item label="销售姓名" prop="contractPerson">
            <el-input v-model="contractModel.contractForm.contractPerson"></el-input>
        </el-form-item>
        <el-form-item label="销售联系邮箱" prop="contractEmail">
            <el-input v-model="contractModel.contractForm.contractEmail"></el-input>
        </el-form-item>
        <el-form-item label="销售联系电话" prop="contractTel">
            <el-input v-model="contractModel.contractForm.contractTel"></el-input>
        </el-form-item>
        <el-form-item label="合同联系人地址" prop="contractAddr">
            <el-input v-model="contractModel.contractForm.contractAddr"></el-input>
        </el-form-item>
    </div>
</template>

<script>
    export default {
        name: "salesContactInfo",
        props: ['contractModel']
    }
</script>

<style scoped>

</style>