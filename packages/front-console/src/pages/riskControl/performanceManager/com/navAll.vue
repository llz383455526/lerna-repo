<template>
    <div class="risk-control-pm-nav-all">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="small">
            <el-form-item label="企业名称">
                <el-select v-model="searchForm.companyId" filterable placeholder="请选择">
                    <el-option
                        v-for="item in qiYeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="计算规则">
                <el-select v-model="searchForm.cuserBalanceStandardState" filterable placeholder="请选择">
                    <el-option
                        v-for="item in ruleTypeArr"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="计算明细">
                <el-select v-model="searchForm.cuserPerformanceState" filterable placeholder="请选择">
                    <el-option
                        v-for="item in ruleTypeArr"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="签约率">
                <el-select v-model="searchForm.cuserSignRateParam" placeholder="">
                    <el-option
                        v-for="item in contractRateArr"
                        :key="item.text"
                        :label="item.text"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
                <el-button @click="clearBtnClick">清空</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="dataArr"
            style="width: 100%">
            <el-table-column
                prop="companyName"
                label="企业名称"
                width="180">
            </el-table-column>
            <el-table-column
                label="风控星级"
                width="160">
                <div style="display: flex;justify-content: flex-start;align-items: center" slot-scope="scope">
                    <w-star :count="scope.row.riskLevel" style="display: inline-block"/>
                    &nbsp;
                    <el-tooltip class="item" effect="dark" content="查看绩效明细" placement="top">
                        <img @click="fengKongmingXiClick(scope.row)" style="width: 16px; cursor: pointer;"
                             src="../../../../assets/img/mingxi.png" alt="">
                    </el-tooltip>&nbsp;
                    <el-tooltip class="item" effect="dark" content="查看限额明细" placement="top">
                        <img @click="fengKongLimitClick(scope.row)" style="width: 16px; cursor: pointer;"
                             src="../../../../assets/img/xiane.png" alt="">
                    </el-tooltip>
                </div>
            </el-table-column>
            <el-table-column
                label="计算规则状态">
                <template slot-scope="scope">
                    <el-badge :hidden="!scope.row.cuserBalanceStandardWaitApproveNum"
                              :value="scope.row.cuserBalanceStandardWaitApproveNum" class="item">
                        <span>{{ scope.row.cuserBalanceStandardStateName }}</span>
                    </el-badge>
                </template>
            </el-table-column>
            <el-table-column
                label="计算明细状态">
                <template slot-scope="scope">
                    <el-badge :hidden="!scope.row.cuserPerformanceWaitApproveNum"
                              :value="scope.row.cuserPerformanceWaitApproveNum" class="item">
                        <span>{{ scope.row.cuserPerformanceStateName }}</span>
                    </el-badge>
                </template>
            </el-table-column>
            <el-table-column
                label="签约率">
                <template slot-scope="scope">
                    <span>{{ scope.row.cuserSignRate || 0 }}%</span>
                </template>
            </el-table-column>
            <el-table-column
                width="300px"
                label="审核记录">
                <template slot-scope="scope">
                    <span>{{ scope.row.approveName }}</span>
                    <span v-if="scope.row.approveName && scope.row.approveTime">&nbsp;|&nbsp;</span>
                    <span>{{ scope.row.approveTime }}</span>
                </template>
            </el-table-column>
            <el-table-column
                v-if="checkRight(permissions, 'console-dlv:/risk_level_degrade/refresh-company-risk-level')"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="auditBtnClick(scope.row)">审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <w-paging ref="WPaging" :total="pageData.total" @onChange="pageChange"></w-paging>
        <w-issue-limit ref="WIssueLimit"/>
    </div>
</template>

<script>
    import {get, post} from "../../../../store/api";
    import WIssueLimit from '../fengkong/issueLimit'
    import { mapGetters } from 'vuex'
    import  WStar from '../../../../component/star'
    import WPaging from '../../../../component/paging/index'
    export default {
        name: "navAll",
        components: {
            WIssueLimit,
            WStar,
            WPaging
        },
        data() {
            return {
                searchForm: {
                    // 企业ID
                    companyId: '',
                    cuserBalanceStandardState: '',
                    cuserPerformanceState: '',
                    cuserSignRateParam: ''
                },
                dataArr: [],
                pageData: {
                    page: 1,
                    pageSize: 10,
                    total: 0
                },
                // 企业列表
                qiYeList: [],
                // 规则列表
                ruleTypeArr: [],
                // 签约率
                contractRateArr: []
            }
        },
        computed: {
            ...mapGetters({
                permissions: 'permissions',
            }),
        },
        methods: {
            auditBtnClick(item) {
                this.$router.push({
                    path: '/main/riskControl/performanceManagerDetail',
                    query: {id: item.companyId}
                })
            },
            clearBtnClick() {
                this.searchForm = {
                    companyId: '',
                    cuserBalanceStandardState: '',
                    cuserPerformanceState: '',
                    cuserSignRateParam: ''
                }
                this.$refs.WPaging.clear()
            },
            searchBtnClick() {
                this.$refs.WPaging.clear()
            },
            pageChange(data) {
                this.pageData.page = data.pageNum
                this.pageData.pageSize = data.pageSize
                this.getListData()
            },
            getListData() {
                post('/api/console-dlv/risk-level-approve/approve-list', {
                    page: this.pageData.page,
                    pageSize: this.pageData.pageSize,
                    ...this.searchForm
                }).then((data) => {
                    this.dataArr = data.list
                    this.pageData.total = data.total
                })
            },
            getQiYeList() {
                get('/api/sysmgr-web/commom/company?companyIdentity=custom').then(data => {
                    this.qiYeList = data
                })
            },
            getRuleType() {
                get('/api/console-dlv/option/get-by-type', {
                    type: 'RiskLevelState'
                }).then(result => {
                    this.ruleTypeArr = result
                })
            },
            // 获取签约率数组
            getContractRate() {
                get('/api/console-dlv/option/get-by-type', {
                    type: 'RiskLevelCuserSignApproveParam'
                }).then(result => {
                    this.contractRateArr = result
                })
            },
            fengKongmingXiClick(item) {
                this.$router.push({
                    path: '/main/riskControl/performanceManagerStar',
                    query: {
                        id: item.companyId
                    }
                })
            },
            fengKongLimitClick(item) {
                this.$refs.WIssueLimit.show(item)
            },
        },
        mounted() {
            this.getQiYeList()
            this.getRuleType()
            this.getListData()
            this.getContractRate()
        },
    }
</script>

<style lang="scss">
.risk-control-pm-nav-all {
    .el-badge__content {
        top: 10px;
        right: -2px;
    }
}
</style>