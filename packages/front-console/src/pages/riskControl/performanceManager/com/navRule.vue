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
                <el-select v-model="searchForm.serviceCompanyId" filterable placeholder="请选择">
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
                prop="cuserBalanceStandardStateName"
                label="计算规则附件状态">
            </el-table-column>
            <el-table-column
                label="审核记录">
                <template slot-scope="scope">
                    <span>{{ scope.row.cuserBalanceStandardUpdateName }}</span>
                    <span v-if="scope.row.cuserBalanceStandardUpdateName && scope.row.cuserBalanceStandardUpdateTime">&nbsp;|&nbsp;</span>
                    <span>{{ scope.row.cuserBalanceStandardUpdateTime }}</span>
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
            width="500px"
            :before-close="handleClose">
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
                    customerCompanyId: '',
                    cuserBalanceStandardState: '',
                    serviceCompanyId: ''
                },
                dataArr: [],
                pageData: {
                    page: 1,
                    pageSize: 10,
                    total: 0
                },
                riskSignRateDetailApproveState: [],
                companyList: [],
                customerCompanies: [],
                shenHePop: false,
                shenHeItem: null,
                shenHeRadio: null
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

                const api = true ?
                    'https://yapi.aiyuangong.com/mock/34/risk-level-approve/cuser-balance-standard-detail-approve'
                    :
                    '/api/console-dlv/risk-level-approve/cuser-balance-standard-detail-approve'
                post(api, {
                    cuserBalanceStandardState: this.shenHeRadio,
                    id: this.shenHeItem.id
                }).then((data) => {
                    this.shenHePop = false
                    this.$refs.WPaging.clear()
                })
            },
            downloadBtnClick(item) {
                console.log(item)
                window.open('/api/sysmgr-web/file/download?downloadCode=' + item.cuserBalanceStandardAttachment.downloadCode)
            },
            auditBtnClick(item) {
                this.shenHePop = true
                this.shenHeItem = item
            },
            searchBtnClick() {
                this.getListData()
            },
            clearBtnClick() {
                this.searchForm = {
                    customerCompanyId: '',
                    cuserBalanceStandardState: '',
                    serviceCompanyId: ''
                }
                this.$refs.WPaging.clear()
            },
            pageChange(data) {
                this.pageData.page = data.pageNum
                this.pageData.pageSize = data.pageSize
                this.getListData()
            },
            getListData() {
                const api = true ?
                    'https://yapi.aiyuangong.com/mock/34/risk-level-approve/get-cuser-balance-standard-wait-approve-list'
                    :
                    '/api/console-dlv/risk-level-approve/get-cuser-balance-standard-wait-approve-list'
                post(api, {
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
            this.getListData()
        }
    }
</script>

<style scoped>

</style>