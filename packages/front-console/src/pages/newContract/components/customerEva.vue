<template>
    <div>
        <h3 class="green">请输入销售信息</h3>
        <el-form-item label="预计月流水" prop="expectedMonthlyFlow">
            <el-input v-model="contractModel.contractForm.expectedMonthlyFlow" style="width:450px;"></el-input>
        </el-form-item>
        <el-form-item label="预计3万以上比例" prop="expectedProportion">
            <el-input v-model="contractModel.contractForm.expectedProportion" style="width:450px;">
                <template slot="append">%</template>
            </el-input>
        </el-form-item>
    </div>
</template>

<script>
    export default {
        name: "customerEvaluation",
        props: ['contractModel']
    }
</script>

<style scoped>

</style>