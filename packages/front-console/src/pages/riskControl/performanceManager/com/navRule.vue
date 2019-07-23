<template>
    <div class="risk-control-pm-nav-rule">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="small">
            <el-form-item label="客户公司">
                <el-select v-model="searchForm.customerCompanyId" filterable placeholder="请选择">
                    <el-option
                        v-for="item in customerCompanies"
                        :key="item.companyId"
                        :label="item.companyName"
                        :value="item.companyId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="落地公司">
                <el-select v-model="searchForm.xxx" filterable placeholder="请选择">
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="计算规则附件状态">
                <el-select v-model="searchForm.cuserBalanceStandardState" filterable placeholder="请选择">
                    <el-option
                        v-for="item in riskSignRateDetailApproveState"
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
                prop="customerCompanyName"
                label="客户公司">
            </el-table-column>
            <el-table-column
                prop="customerCompanyName"
                label="落地公司">
                <template slot-scope="scope">
                    <span>{{ scope.row.customerCompanyName }}</span>
                    <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover"
                        content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。">
                        <el-button slot="reference">hover 激活</el-button>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                prop="cuserBalanceStandardState"
                label="计算规则附件状态">
            </el-table-column>
            <el-table-column
                label="审核记录">
                <template slot-scope="scope">
                    <span>{{ scope.row.approveName }}</span>
                    <span v-if="scope.row.approveName && scope.row.approveTime">&nbsp;|&nbsp;</span>
                    <span>{{ scope.row.approveTime }}</span>
                </template>
            </el-table-column>
<!--            v-if="checkRight(permissions, 'console-dlv:/risk_level_degrade/refresh-company-risk-level')"-->
            <el-table-column
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="downloadBtnClick(scope.row)">下载</el-button>
                    <el-button type="text" size="small" @click="auditBtnClick(scope.row)">审核</el-button>
                </template>
            </el-table-column>
        </el-table>
        <w-paging ref="WPaging" :total="pageData.total" @onChange="pageChange"></w-paging>
    </div>
</template>

<script>
    import WPaging from '../../../../component/paging/index'
    import {get, post} from "../../../../store/api";
    export default {
        name: "navRule",
        components: {
            WPaging
        },
        data() {
            return {
                searchForm: {
                    customerCompany: '',
                    cuserBalanceStandardState: ''
                },
                dataArr: [
                    {
                        "cuserBalanceStandardAttachment": {
                            "createByName": "@ctitle(2,3)",
                            "createTime": "@datetime(yyyy-MM-dd HH:mm:ss)",
                            "displayname": "@ctitle(10,11)",
                            "downloadCode": "@string(8,15)",
                            "refId": "@integer(10000,50000)",
                            "targetId": 0,
                            "targetType": "string",
                            "targetTypeName": "string"
                        },
                        "cuserBalanceStandardFileName": "@ctitle(10,15)",
                        "cuserBalanceStandardState": "@string(5,7)",
                        "cuserBalanceStandardUpdateName": "@ctitle(2,3)",
                        "cuserBalanceStandardUpdateTime": "@datetime(yyyy-MM-dd HH:mm:ss)",
                        "customerCompanyId": "@integer(10000,50000)",
                        "customerCompanyName": "@ctitle(10,11)",
                        "id": "@integer(10000,50000)",
                        "serviceCompanyId": "@integer(10000,50000)",
                        "serviceCompanyName": "@ctitle(10,11)",
                        "serviceTypeNames": [
                            "@ctitle(10,11)"
                        ]
                    }
                ],
                pageData: {
                    page: 1,
                    pageSize: 10,
                    total: 0
                },
                riskSignRateDetailApproveState: [],
                companyList: [],
                customerCompanies: []
            }
        },
        methods: {
            downloadBtnClick(item) {
                window.open('/api/sysmgr-web/file/download?downloadCode=' + item.cuserPerformanceDownloadCode)
            },
            searchBtnClick() {},
            clearBtnClick() {},
            pageChange(data) {
                this.pageData.page = data.pageNum
                this.pageData.pageSize = data.pageSize
                this.getListData()
            },
            getListData() {
                post('/api/console-dlv/risk-level-approve/get-cuser-balance-standard-wait-approve-list', {
                    page: this.pageData.page,
                    pageSize: this.pageData.pageSize,
                    ...this.searchForm
                }).then((data) => {
                    this.dataArr = data.list
                    this.pageData.total = data.total
                })
            },
            getRiskSignRateDetailApproveState() {
                get('/api/console-dlv/option/get-by-type', {
                    type: 'RiskSignRateDetailApproveState'
                }).then(result => {
                    this.riskSignRateDetailApproveState = result
                })
            },
            getLuoDiGongSi() {
                get('/api/sysmgr-web/commom/company?companyIdentity=service').then(data => {
                    this.companyList = data
                })
            },
            getCustomerCompanies() {
                get('/api/console-dlv/option/get-option-customer-companies').then(res => {
                    this.customerCompanies = res
                })
            }
        },
        mounted() {
            this.getCustomerCompanies()
            this.getRiskSignRateDetailApproveState()
            this.getLuoDiGongSi()
        }
    }
</script>

<style scoped>

</style>