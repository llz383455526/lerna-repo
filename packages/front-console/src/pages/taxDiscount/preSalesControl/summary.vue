<template>
    <div>
        <el-form :inline="true" :model="searchForm" class="demo-form-inline" size="mini">
            <el-form-item label="时间月份">
                <el-date-picker
                    v-model="searchForm.month"
                    type="month"
                    placeholder="选择月份">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchBtnClick">查询</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableData"
            style="width: 100%">
            <el-table-column
                prop="date"
                label="审批月份">
            </el-table-column>
            <el-table-column
                prop="date"
                label="申请企业总量">
            </el-table-column>
            <el-table-column
                prop="date"
                label="不通过数据">
            </el-table-column>
            <el-table-column
                prop="date"
                label="A-高风险行业企业">
            </el-table-column>
            <el-table-column
                prop="date"
                label="B-有违法违规记录的企业">
            </el-table-column>
            <el-table-column
                prop="date"
                label="C-申请业务不适用众包产品">
            </el-table-column>
            <el-table-column
                prop="date"
                label="D-申请业务与发票类目不一致">
            </el-table-column>
            <el-table-column
                prop="date"
                label="E-申请业务超出落地公司经营范围或资质">
            </el-table-column>
            <el-table-column
                prop="date"
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
    export default {
        name: "detail",
        data() {
            return {
                searchForm: {
                    month: ''
                },
                tableData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1517 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1519 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1516 弄'
                }],
                pageData: {
                    page: 1,
                    pageSize: 10,
                    total: 0
                }
            }
        },
        methods: {
            searchBtnClick() {
            },
            handleSizeChange(page) {
                this.pageData.page = page
                this.searchBtnClick()
            },
            handleCurrentChange(pageSize) {
                this.pageData.pageSize = pageSize
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