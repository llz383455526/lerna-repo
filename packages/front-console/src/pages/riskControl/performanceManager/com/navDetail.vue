<template>
    <div class="risk-control-pm-nav-detail">
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
                <el-select v-model="searchForm.serviceCompanyId" filterable placeholder="请选择">
                    <el-option
                        v-for="item in companyList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="时间月份">
                <el-date-picker
                    v-model="searchMonth"
                    type="month"
                    placeholder="选择月">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="绩效规则附件状态">
                <el-select style="width: 340px;" multiple v-model="searchForm.cuserPerformanceStates" filterable placeholder="请选择">
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
                    <span>{{ scope.row.serviceCompanyName }}</span>
                    <el-popover
                        placement="top-start"
                        width="200"
                        trigger="hover">
                        <i class="el-icon-tickets" slot="reference"></i>
                        <p v-for="item in scope.row.serviceTypeNames">{{item}}</p>
                    </el-popover>
                </template>
            </el-table-column>
            <el-table-column
                label="时间月份">
                <template slot-scope="scope">
                    <span>{{ scope.row.year }}-{{ scope.row.month }}</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="cuserPerformanceStateName"
                label="绩效规则附件状态">
            </el-table-column>
            <el-table-column
                label="审合记录">
                <template slot-scope="scope">
                    <span>{{ scope.row.cuserPerformanceUpdateName }}</span>
                    <span v-if="scope.row.cuserPerformanceUpdateName && scope.row.cuserPerformanceUpdateTime">&nbsp;|&nbsp;</span>
                    <span>{{ scope.row.cuserPerformanceUpdateTime }}</span>
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
        <el-dialog
            title="审核"
            :visible.sync="shenHePop"
            width="500px">
            <el-radio v-model="shenHeRadio" label="admin_success">审核通过</el-radio>
            <el-radio v-model="shenHeRadio" label="admin_fail">审核不通过</el-radio>
            <span slot="footer" class="dialog-footer">
                <el-button @click="shenHePop = false">取 消</el-button>
                <el-button type="primary" @click="shenHePopOkClick">确 定</el-button>
            </span>
        </el-dialog>
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
                    // 企业ID
                    customerCompanyId: '',
                    serviceCompanyId: '',
                    year: '',
                    month: '',
                    cuserPerformanceStates: []
                },
                searchMonth: null,
                dataArr: [],
                pageData: {
                    page: 1,
                    pageSize: 10,
                    total: 0
                },
                shenHePop: false,
                shenHeItem: null,
                shenHeRadio: null,
                companyList: [],
                customerCompanies: [],
                riskSignRateDetailApproveState: []
            }
        },
        methods: {
            shenHePopOkClick() {
                if (!this.shenHeRadio) {
                    this.$message({
                        message: '请选择',
                        type: 'warning'
                    });
                    return
                }

                const api = false ?
                    'https://yapi.aiyuangong.com/mock/34/risk-level-approve/cuser-performance-detail-approve'
                    :
                    '/api/console-dlv/risk-level-approve/cuser-performance-detail-approve'
                post(api, {
                    cuserPerformanceState: this.shenHeRadio,
                    id: this.shenHeItem.id
                }).then((data) => {
                    this.shenHePop = false
                    this.$refs.WPaging.clear()
                })
            },
            downloadBtnClick(item) {
                window.open('/api/sysmgr-web/file/download?downloadCode=' + item.cuserPerformanceAttachment.downloadCode)
            },
            auditBtnClick(item) {
                this.shenHeRadio = null
                this.shenHePop = true
                this.shenHeItem = item
            },
            searchBtnClick() {
                if (this.searchMonth) {
                    this.searchForm.month = this.searchMonth.getMonth() + 1
                    this.searchForm.year = `${this.searchMonth.getFullYear()}`
                    this.searchForm.month = `${this.searchForm.month > 9 ? '' : '0'}${this.searchForm.month}`
                }
                this.$refs.WPaging.clear()
            },
            clearBtnClick() {
                this.searchForm = {
                    // 企业ID
                    customerCompanyId: '',
                    serviceCompanyId: '',
                    year: '',
                    month: '',
                    cuserPerformanceStates: []
                }
                this.$refs.WPaging.clear()
            },
            pageChange(data) {
                this.pageData.page = data.pageNum
                this.pageData.pageSize = data.pageSize
                this.getListData()
            },
            getListData() {
                const api = false ?
                    'https://yapi.aiyuangong.com/mock/34/risk-level-approve/get-cuser-performance-wait-approve-list'
                    :
                    '/api/console-dlv/risk-level-approve/get-cuser-performance-list'
                post(api, {
                    page: this.pageData.page,
                    pageSize: this.pageData.pageSize,
                    ...this.searchForm
                }).then((data) => {
                    this.dataArr = data.list
                    this.pageData.total = data.total
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
            },
            getRiskSignRateDetailApproveState() {
                get('/api/console-dlv/option/get-by-type', {
                    type: 'RiskSignRateDetailApproveState'
                }).then(result => {
                    this.riskSignRateDetailApproveState = result
                })
            },
        },
        mounted() {
            this.getLuoDiGongSi()
            this.getCustomerCompanies()
            this.getRiskSignRateDetailApproveState()
            this.getListData()
        }
    }
</script>

<style scoped>

</style>