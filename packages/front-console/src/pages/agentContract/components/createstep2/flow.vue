<template>
    <div>
        <el-form-item label="月收入" :prop="`${propName}incomeAmount`" :rules="{ required: true, message: '请输入月收入', trigger: 'blur' }">
            <el-input style="width: 120px;" v-model="serviceFeeContent.incomeAmount" :disabled="disabled">
                <template slot="append">万</template>
            </el-input>
            <span class="ml10">(含)以下</span>
        </el-form-item><br>
        <feeContent v-if="serviceFeeContent.feeContentMap.down" :feeContent="serviceFeeContent.feeContentMap.down" :propName="`${propName}feeContentMap.down`"></feeContent>
        <el-form-item label="月收入" :prop="`${propName}incomeAmount`" :rules="{ required: true, message: '请输入月收入', trigger: 'blur' }">
            <el-input style="width: 120px;" v-model="serviceFeeContent.incomeAmount" :disabled="disabled">
                <template slot="append">万</template>
            </el-input>
            <span class="ml10">以上</span>
        </el-form-item>
        <el-form-item v-if="serviceFeeContent.feeContentMap.up" label="实发金额" :prop="`${propName}feeContentMap.up.0.percent`" :rules="{ required: true, message: '请输入实发金额', trigger: 'blur' }">
            <el-input v-model="serviceFeeContent.feeContentMap['up'][0].percent" style="width: 150px;">
                <template slot="append">%</template>
            </el-input>
        </el-form-item>
    </div>
</template>

<script>
import feeContent from './feeContent'

export default {
    components: { feeContent },
    props: {
        serviceFeeContent: {
            type: Object
        },
        propName: {
            type: String,
        }
    }
}
</script>

