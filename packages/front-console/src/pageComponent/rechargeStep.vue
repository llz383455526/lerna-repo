<template>
    <el-steps :active="active" align-center class="mb20">
        <el-step v-for="e in stepList" :key="e.activityId" :title="e.activityName" :description="e.userName"></el-step>
    </el-steps>
</template>
<script>
export default {
    props: {
        stepList: {
            type: Array,
            default() {
                return []
            }
        },
        active: {
            type: Number,
            default: 1
        }
    }
}
</script>
<style scoped>

</style>
