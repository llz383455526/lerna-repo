<template>
    <div class="c-detail risk-control-performance-manager-c-detail">
        <br/>
        <el-table
            :data="model.companyRiskRateDataDTOList"
            style="width: 100%">
            <el-table-column
                prop="date"
                width="120px"
                label="月份">
                <template slot-scope="scope">
                    <span>{{ scope.row.year }}年{{scope.row.month}}月</span>
                </template>
            </el-table-column>
            <el-table-column
                width="120px"
                label="数据状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.uploadServiceCompanyList && scope.row.uploadServiceCompanyList.length === 0" style="color: #ccc;">已上传</span>
                    <span v-else-if="scope.row.riskRateDataServiceDetailDTOList && scope.row.riskRateDataServiceDetailDTOList.length === 0">未上传</span>
                    <span v-else>待上传</span>
                </template>
            </el-table-column>
            <el-table-column
                label="落地公司">
                <template slot-scope="scope">
                    <ul class="gongsi-list">
                        <li class="cell" v-for="(v, k) in scope.row.riskRateDataServiceDetailDTOList" :key="k">
                            {{ v.cuserPerformanceFileName }}
                        </li>
                    </ul>
                    <ul class="wait-list">
                        <li class="cell" v-for="(v, k) in scope.row.uploadServiceCompanyList" :key="k">{{ v.name }}</li>
                    </ul>
                </template>
            </el-table-column>
            <el-table-column
                width="200px"
                class-name="option"
                label="操作">
                <template slot-scope="scope">
                    <ul class="gongsi-list">
                        <li class="cell" v-for="(v, k) in scope.row.riskRateDataServiceDetailDTOList" :key="k">
                            <el-button type="text" size="small" @click="preview(v)">下载</el-button>
                            <el-button type="text" size="small" @click="stateClick(v)">{{ v.cuserPerformanceStateName }}<i class="el-icon-edit"></i></el-button>
                        </li>
                    </ul>
                </template>
            </el-table-column>
        </el-table>
        <w-audit-pop ref="WAuditPop" @reload="$emit('reload')"></w-audit-pop>

    </div>
</template>

<script>
    import WAuditPop from './auditPop'
    export default {
        name: "cDetail",
        props: ['model'],
        components: {
            WAuditPop
        },
        data() {
            return {}
        },
        methods: {
            // C端绩效规则点击
            stateClick(item) {
                this.$refs.WAuditPop.show({
                    url: '/risk-level-approve/cuser-performance-detail-approve',
                    stateKey: 'cuserPerformanceState',
                    id: item.id,
                    stateArr: ['admin_success', 'admin_fail']
                })
            },
            preview(item) {
                window.open('/api/sysmgr-web/file/download?downloadCode=' + item.cuserPerformanceDownloadCode)
            }
        }
    }
</script>

<style scoped lang="scss">
    .c-detail {
        padding-left: 138px;
        .gongsi-list {
            list-style: none;
            padding: 0;
            margin: 0;
            .cell {
                line-height: 30px;
                -webkit-line-clamp: 1;
                overflow: hidden;
                text-overflow:ellipsis;
                white-space:nowrap
            }
        }
        .wait-list {
            display: flex;
            flex-wrap: wrap;
            margin: 0;
            padding: 0;
            .cell {
                color: rgba(204, 204, 204, 1);
                font-size: 14px;
                text-align: center;
                border: 1px dashed rgba(204, 204, 204, 1);
                padding: 2px;
                margin: 2px;
            }
        }
    }
</style>
<style lang="scss">
    .risk-control-performance-manager-c-detail {
        .option {
            vertical-align: top;
        }
    }
</style>
