<template>
    <el-form-item label="实发金额" v-if="serviceFeeContent.feeContentMap.no" :prop="`${propName}feeContentMap.no.0.percent`" :rules="[{ required: true, message: '请输入结算实发金额', trigger: 'blur' }, { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}]">
        <el-input v-model="serviceFeeContent.feeContentMap.no[0].percent" :disabled="disabled" style="width: 150px;">
            <template slot="append">% 每笔</template>
        </el-input>
        <i class="el-icon-question" title="表示按照固定比例来收取服务费。计算公式：实发发金额 * 收费比例 = 服务费"></i>
    </el-form-item>
</template>

<script>
export default {
    props: {
        serviceFeeContent: {
            type: Object
        },
        propName: {
            type: String,
        },
    },
}
</script>

