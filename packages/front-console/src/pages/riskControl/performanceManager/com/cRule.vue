<template>
    <div class="c-rule" v-if="model.companyRiskRateDTO">
        <br />
        <div class="wait-up-list">
            <div class="title">待上传落地公司</div>
            <ul class="list">
                <li class="item" v-for="(v, k) in model.companyRiskRateDTO.uploadServiceCompanyList" :key="k">{{ v.name }}</li>
            </ul>
        </div>
        <el-table
            :data="model.companyRiskRateDTO.companyRiskRateServiceDetailDTOList"
            style="width: 100%">
            <el-table-column
                prop="cuserBalanceStandardFileName"
                label="附件名称">
            </el-table-column>
            <el-table-column
                prop="cuserBalanceStandardUpdateTime"
                label="上传时间">
            </el-table-column>
            <el-table-column
                width="200px"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="preview(scope.row)">下载</el-button>
                    <el-button type="text" size="small" @click="cRuleStateClick(scope.row)">
                        {{ scope.row.cuserBalanceStandardStateName }}
                        <i class="el-icon-edit"></i></el-button>
                </template>
            </el-table-column>
        </el-table>
        <br />
        <w-audit-pop ref="WAuditPop" @reload="$emit('reload')"></w-audit-pop>
    </div>
</template>

<script>
    import WAuditPop from './auditPop'
    export default {
        name: "cRule",
        props: ['model'],
        components: {
            WAuditPop
        },
        data() {
            return {}
        },
        methods: {
            // C端绩效规则点击
            cRuleStateClick(item) {
                this.$refs.WAuditPop.show({
                    url: '/risk-level-approve/cuser-balance-standard-detail-approve',
                    stateKey: 'cuserBalanceStandardState',
                    id: item.id,
                    stateArr: ['admin_success', 'admin_fail']
                })
            },
            preview(item) {
                window.open('/api/sysmgr-web/file/download?downloadCode=' + item.cuserBalanceStandardDownloadCode)
            }
        }
    }
</script>

<style scoped lang="scss">
.c-rule {
    padding-left: 147px;
    .wait-up-list {
        position: relative;
        .title {
            width: 130px;
            margin: 0;
            position: absolute;
            left: 0;
            top: 5px;
        }
        .list {
            list-style: none;
            display: flex;
            flex-wrap: wrap;
            margin: 0;
            padding: 0 0 0 130px;
            .item {
                color: rgba(204, 204, 204, 1);
                font-size: 14px;
                padding: 5px;
                border: 1px dashed rgba(204, 204, 204, 1);
                margin: 0 10px 10px 0
            }
        }
    }
}
</style>