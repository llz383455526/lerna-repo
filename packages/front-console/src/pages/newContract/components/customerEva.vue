<template>
    <div>
        <h4 class="ml50">客户企业评估</h4>
        <el-form-item label="预计月流水" prop="expectedMonthlyFlow">
            <el-input v-model="contractModel.contractForm.expectedMonthlyFlow"></el-input>
        </el-form-item>
        <el-form-item label="预计3万以上比例" prop="expectedProportion">
            <el-input v-model="contractModel.contractForm.expectedProportion">
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