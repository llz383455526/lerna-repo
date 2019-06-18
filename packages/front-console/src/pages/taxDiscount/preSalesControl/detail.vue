<template>
    <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
            <el-form-item label="企业名称">
                <el-input v-model="searchForm.name" placeholder="输入企业名称" clearable></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="customerCompanyName"
                label="企业名称">
            </el-table-column>
            <el-table-column
                prop="approveTime"
                label="审核时间">
            </el-table-column>
            <el-table-column
                prop="highRiskIndustry"
                label="A-高风险行业企业">
            </el-table-column>
            <el-table-column
                prop="illegalRecordCompany"
                label="B-有违法违规记录的企业">
            </el-table-column>
            <el-table-column
                prop="applyBusinessNotSuit"
                label="C-申请业务不适用众包产品">
            </el-table-column>
            <el-table-column
                prop="applyBusinessInvoiceNotFit"
                label="D-申请业务与发票类目不一致">
            </el-table-column>
            <el-table-column
                prop="applyBusinessOutCompass"
                label="E-申请业务超出落地公司经营范围或资质">
            </el-table-column>
            <el-table-column
                prop="contractItemIllegal"
                label="F-合同条款不符合法务/风控要求">
            </el-table-column>
        </el-table>
        <div class="clearfix" style="padding-top: 15px">
            <el-pagination
                style="float: right"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageData.page"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="pageData.pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.total">
            </el-pagination>
        </div>
    </div>
</template>

<script>
    import { get, post } from "../../../store/api";
    export default {
        name: "detail",
        data() {
            return {
                searchForm: {
                    name: ''
                },
                tableData: [],
                pageData: {
                    page: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        methods: {
            searchBtnClick() {
                post('/api/console-dlv/sales-before-risk/company-detail-list', {
                    companyName: this.searchForm.name,
                    "page": this.pageData.page,
                    "pageSize": this.pageData.pageSize
                }).then((data) => {
                    this.tableData = data.list
                    this.pageData.total = data.total
                }).catch(() => {})
            },
            handleSizeChange(pageSize) {
                this.pageData.pageSize = pageSize
                this.searchBtnClick()
            },
            handleCurrentChange(page) {
                this.pageData.page = page
                this.searchBtnClick()
            }
        },
        mounted() {
            this.searchBtnClick()
        }
    }
</script>

<style scoped>

</style>