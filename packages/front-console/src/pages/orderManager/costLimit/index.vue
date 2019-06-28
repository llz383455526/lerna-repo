<template>
    <div class="client-risk-rule">
        <div class="title">客户需求限额</div>
        <el-form label-width="80px" size="mini" :inline="true">
            <el-form-item label="企业名称">
                <el-input v-model="companyName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="findBtnClick">查询</el-button>
            </el-form-item>
        </el-form>
        <br>
        <el-table
            :data="tableData"
            border
            style="width: 100%">
            <el-table-column
                prop="companyName"
                label="公司名字">
            </el-table-column>
            <el-table-column
                prop="name"
                label="关联销售">
                <template slot-scope="scope">
                    <div v-for="(v, k) in scope.row.salesmanInfoDTOList">
                        {{ v.name }}
                    </div>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="当前风控等级">
                <template slot-scope="scope">
                    <w-start :count="scope.row.riskLevel"/>
                </template>
            </el-table-column>
            <el-table-column
                prop="stateName"
                label="需求限额状态">
                <template slot-scope="scope">
                    <el-tooltip class="item" effect="dark"
                                :content="scope.row.stateName === '有效' ? '成本限额与星级限同时生效' : '默认生效星级限额'" placement="top">
                        <el-tag size="mini" :type="scope.row.stateName === '有效' ? 'success' : 'danger'">{{
                            scope.row.stateName }}
                        </el-tag>
                    </el-tooltip>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                label="操作">
                <template slot-scope="scope">
                    <el-button @click="showClick(scope.row)" type="text" size="small">查看</el-button>
                    <el-button @click="addRuleClick(scope.row)" type="text" size="small">添加规则</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div style="padding-top: 20px" class="clearfix">
            <el-pagination
                style="float: right;"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="paging.pageNum"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="paging.pagheSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="paging.total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
    import {get, post} from "../../../store/api";
    import WStart from '../../../component/star'

    export default {
        components: {
            WStart
        },
        data() {

            return {
                // 企业名称
                companyName: '',
                // 列表数据
                tableData: [],
                paging: {
                    pagheSize: 10,
                    pageNum: 1,
                    total: 0
                }
            }
        },
        mounted() {

        },
        methods: {
            getListData() {
                post('/api/console-dlv/risk-special/risk-special-list', {
                    "companyName": this.companyName,
                    "page": this.paging.pageNum,
                    "pageSize": this.paging.pagheSize
                }).then((data) => {
                    this.tableData = data.list
                    this.paging.total = data.total
                }).catch(() => {
                })
            },
            findBtnClick() {
                this.getListData()
            },
            showClick(item) {
                this.$router.push({ path: '/main/orderManager/costLimitAddRule' , query: {id: item.companyId, show: true}})
            },
            handleSizeChange(size) {
                this.paging.pagheSize = size
                this.getListData()
            },
            handleCurrentChange(num) {
                this.paging.pageNum = num
                this.getListData()
            },
            addRuleClick(item) {
                this.$router.push({ path: '/main/orderManager/costLimitAddRule' , query: {id: item.companyId}})
            }
        },
        mounted() {
            this.getListData()
        }
    }
</script>
<style scoped lang="scss">
    .client-risk-rule {
        margin: 20px 0;
        padding: 20px;
        background-color: #fff;
        .title {
            margin-left: 0;
        }
    }
</style>
