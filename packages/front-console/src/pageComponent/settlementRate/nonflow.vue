<template>
    <div>
        <el-form-item label="月收入" prop="incomeAmount" :rules="{ required: true, message: '请输入月收入', trigger: 'blur' }">
            <el-input style="width: 120px;" v-model="serviceCompanyFeeContent.incomeAmount">
                <template slot="append">万</template>
            </el-input>
            <el-checkbox>含以下</el-checkbox>
        </el-form-item>
        <el-form-item label="实发金额" prop="feeContentMap.down[0].percent" :rules="{ required: true, message: '请输入实发金额', trigger: 'blur' }">
            <el-input style="width: 120px;" v-model="serviceCompanyFeeContent.feeContentMap.down[0].percent">
                <template slot="append">%</template>
            </el-input>
        </el-form-item><br>
        <el-form-item label="月收入" prop="incomeAmount" :rules="{ required: true, message: '请输入月收入', trigger: 'blur' }">
            <el-input style="width: 120px;" v-model="serviceCompanyFeeContent.incomeAmount">
                <template slot="append">万</template>
            </el-input>
            <el-checkbox>含以下</el-checkbox>
        </el-form-item>
        <el-form-item label="实发金额" prop="feeContentMap.up[0].percent" :rules="{ required: true, message: '请输入实发金额', trigger: 'blur' }">
            <el-input style="width: 120px;" v-model="serviceCompanyFeeContent.feeContentMap.up[0].percent">
                <template slot="append">%</template>
            </el-input>
        </el-form-item>
    </div>
</template>

<script>
export default {
    props: {
        serviceCompanyFeeContent: {
            type: Object
        }
    },
    created() {
        // console.log(this.serviceCompanyFeeContent)
    }
}
</script>

<style lang="scss" scoped>
.center {
    text-align: center;
}
</style>