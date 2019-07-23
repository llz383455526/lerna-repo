<template>
    <div class="risk-control-pm-nav-detail">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="small">
            <el-form-item label="客户公司">
                <el-select v-model="searchForm.companyId" filterable placeholder="查询、审合">
                    <el-option
                        v-for="item in qiYeList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="落地公司">
                <el-select v-model="searchForm.cuserBalanceStandardState" filterable placeholder="请选择">
                    <el-option
                        v-for="item in ruleTypeArr"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间月份">
                <el-select v-model="searchForm.cuserBalanceStandardState" filterable placeholder="请选择">
                    <el-option
                        v-for="item in ruleTypeArr"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="绩效规则附件状态">
                <el-select v-model="searchForm.cuserPerformanceState" filterable placeholder="请选择">
                    <el-option
                        v-for="item in ruleTypeArr"
                        :key="item.value"
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
                label="客户公司">
            </el-table-column>
            <el-table-column
                label="落地公司">
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
                prop="companyName"
                label="时间月份">
            </el-table-column>
            <el-table-column
                label="绩效规则附件状态">
                <template slot-scope="scope">
                    <el-badge :hidden="!scope.row.cuserBalanceStandardWaitApproveNum"
                              :value="scope.row.cuserBalanceStandardWaitApproveNum" class="item">
                        <span>{{ scope.row.cuserBalanceStandardStateName }}</span>
                    </el-badge>
                </template>
            </el-table-column>
            <el-table-column
                label="审合记录">
                <template slot-scope="scope">
                    <el-badge :hidden="!scope.row.cuserPerformanceWaitApproveNum"
                              :value="scope.row.cuserPerformanceWaitApproveNum" class="item">
                        <span>{{ scope.row.cuserPerformanceStateName }}</span>
                    </el-badge>
                </template>
            </el-table-column>
            <!--            v-if="checkRight(permissions, 'console-dlv:/risk_level_degrade/refresh-company-risk-level')"-->
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="auditBtnClick(scope.row)">下载</el-button>
                    <el-button type="text" size="small" @click="auditBtnClick(scope.row)">审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <w-paging ref="WPaging" :total="pageData.total" @onChange="pageChange"></w-paging>
    </div>
</template>

<script>
    import WPaging from '../../../../component/paging/index'
    export default {
        name: "navRule",
        components: {
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
            }
        },
        methods: {
            searchBtnClick() {},
            clearBtnClick() {},
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
        }
    }
</script>

<style scoped>

</style>