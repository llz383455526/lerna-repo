<template>
    <div class="main-container">
        <el-tabs>
            <el-tab-pane label="企业明细" name="0">
                <w-detail />
            </el-tab-pane>
            <el-tab-pane label="历史汇总" name="1">
                <w-summary />
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import WDetail from './detail'
    import WSummary from './summary'

    export default {
        components: {
            WDetail,
            WSummary
        },
        data() {
            return {}
        },
        mounted() {
        }
    }
</script>
<style scoped>
    .main-container {
        background-color: #fff;
        padding: 15px;
    }
</style>
