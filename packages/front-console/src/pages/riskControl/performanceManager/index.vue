<template>
    <div class="risk-control-performance-manager">
        <p class="title">企业绩效管理</p>
        <br/>
        <el-tabs v-model="navIndex">
            <el-tab-pane label="全部" name="0">
                <nav-all v-if="navIndex === '0'"></nav-all>
            </el-tab-pane>
            <el-tab-pane label="计算规则附件审核" name="1" v-if="checkRight(permissions, 'console-dlv:/risk-level-approve/cuser-balance-standard-detail-approve')">
                <nav-rule v-if="navIndex === '1'"></nav-rule>
            </el-tab-pane>
            <el-tab-pane label="绩效明细附件待审核" name="2" v-if="checkRight(permissions, 'console-dlv:/risk-level-approve/cuser-performance-detail-approve')">
                <nav-detail v-if="navIndex === '2'"></nav-detail>
            </el-tab-pane>
        </el-tabs>

    </div>
</template>

<script>
    import NavAll from './com/navAll'
    import NavRule from './com/navRule'
    import NavDetail from './com/navDetail'

    export default {
        name: "RiskControlPerformanceManager",
        components: {
            NavAll,
            NavRule,
            NavDetail
        },
        data() {
            return {
                navIndex: '0',
            }
        },
    }
</script>

<style lang="scss" scoped>
    .risk-control-performance-manager {
        >.title {
            font-size: 22px;
            margin: 0;
        }
        min-height: calc(100vh - 80px);
        padding: 15px;
        background-color: #fff;
    }

</style>