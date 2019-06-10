<template>
    <div>
        <el-form-item label="月收入" :prop="`${propName}incomeAmount`" :rules="[{ required: true, message: '请输入月收入', trigger: 'blur' }, { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}]" style="width: 250px;">
            <el-input style="width: 120px;" v-model.number="serviceFeeContent.incomeAmount">
                <template slot="append">万</template>
            </el-input><span class="ml10" style="color: #606266;">(含)以下</span>
        </el-form-item>
        <el-form-item v-if="serviceFeeContent.feeContentMap.down" label="实发金额" :prop="`${propName}feeContentMap.down[0].percent`" :rules="[{ required: true, message: '请输入实发金额', trigger: 'blur' }, { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}]">
            <el-input style="width: 120px;" v-model="serviceFeeContent.feeContentMap.down[0].percent">
                <template slot="append">%</template>
            </el-input>
        </el-form-item><br>
        <el-form-item label="月收入" :prop="`${propName}incomeAmount`" :rules="[{ required: true, message: '请输入月收入', trigger: 'blur' }, { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}]" style="width: 250px;">
            <el-input style="width: 120px;" v-model="serviceFeeContent.incomeAmount">
                <template slot="append">万</template>
            </el-input><span class="ml10" style="color: #606266;">以上</span>
        </el-form-item>
        <el-form-item v-if="serviceFeeContent.feeContentMap.up" label="实发金额" :prop="`${propName}feeContentMap.up[0].percent`" :rules="[{ required: true, message: '请输入实发金额', trigger: 'blur' }, { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}]">
            <el-input style="width: 120px;" v-model="serviceFeeContent.feeContentMap.up[0].percent">
                <template slot="append">%</template>
            </el-input>
        </el-form-item>
    </div>
</template>

<script>
export default {
    props: {
        propName: {
            type: String,
        },
        serviceFeeContent: {
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