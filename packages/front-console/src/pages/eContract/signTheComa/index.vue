<template>
    <div class="e-contract-sign-the-coma">
        <div class="section">
            <p class="page-title">
                配置先签后发
                <span class="show">(三种模式，配置落地，配置客户，配置客户+落地；优先级依次增高)</span>
            </p>
            <br/>
            <el-form size="small" ref="searchForm" :inline="true" :model="searchForm" class="demo-form-inline">
                <el-form-item label="客户名称" prop="user">
                    <el-select v-model="searchForm.customerCompanyId" filterable clearable placeholder="查询客户">
                        <el-option
                            v-for="item in customerCompanies"
                            :key="item.companyId"
                            :label="item.companyName"
                            :value="item.companyId">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="落地公司" prop="user">
                    <el-select v-model="searchForm.serviceCompanyId" filterable clearable placeholder="查询落地公司">
                        <el-option
                            v-for="item in companyList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="region">
                    <el-select clearable v-model="searchForm.esignType" placeholder="选择状态">
                        <el-option label="先签" value="e_sign_first"></el-option>
                        <el-option label="补签" value="no_need_sign"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="searchBtnClick">查询</el-button>
                    <el-button @click="clearBtnClick">清空</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="section" style="margin-top: 10px">
            <el-tabs>
                <el-tab-pane label="配置列表"></el-tab-pane>
            </el-tabs>
            <div>
                <el-button type="text" @click="addBtnClick">
                    <i class="el-icon-plus"></i>
                    添加配置
                </el-button>
            </div>
            <el-table
                :data="tableData"
                style="width: 100%">
                <el-table-column
                    prop="customerCompanyName"
                    label="客户名称">
                    <template slot-scope="scope">
                        <template v-if="scope.row.customerCompanyId">
                            <span>{{ scope.row.customerCompanyName }}</span>
                            <span class="pei-icon">配</span>
                        </template>
                        <span v-else class="action-text">
                            配置了落地，默认签约客户先签后发
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="serviceCompanyName"
                    label="落地公司名称">
                    <template slot-scope="scope">
                        <template v-if="scope.row.serviceCompanyId">
                            <span>{{ scope.row.serviceCompanyName }}</span>
                            <span class="pei-icon">配</span>
                        </template>
                        <span v-else class="action-text">
                            配置了客户，默认签约客户先签后发
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="esignType"
                    width="100px"
                    label="先签后发">
                    <template slot-scope="scope">
                        <span v-if="scope.row.esignType !== 'e_sign_first'"  class="sign-label">{{ scope.row.esignTypeName }}</span>
                        <span v-else class="sign-label sign-label-action">{{ scope.row.esignTypeName }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="level"
                    width="100px"
                    label="优先级">
                    <template slot-scope="scope">
                        <span>{{ scope.row.level }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                    label="操作记录">
                    <template slot-scope="scope">
                        <span>
                            {{ scope.row.updateByName }}|{{ scope.row.updateTime }}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    width="100px"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="editBtnClick(scope.row)">
                            编辑
                        </el-button>
                        <el-button type="text" @click="removeBtnClick(scope.row)">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <w-paging ref="WPaging" :total="total" :padding-top="10" @onChange="pageChange"/>
        </div>
        <w-pop @reload="getListData" :customerCompanies="customerCompanies" :companyList="companyList" ref="WPop"/>
    </div>
</template>

<script>
    import WPaging from '../../../component/paging/index'
    import WPop from './pop'
    import { post, get, importPost } from "../../../store/api"

    export default {
        name: "SignTheComa",
        components: {
            WPaging,
            WPop
        },
        data() {
            return {
                searchForm: {
                    customerCompanyId: '',
                    serviceCompanyId: '',
                    esignType: ''
                },
                pageData: {
                    page: 1,
                    pageSize: 10
                },
                customerCompanies: [],
                companyList: [],
                tableData: [],
                total: 0
            }
        },
        methods: {
            searchBtnClick() {
                this.$refs.WPaging.clear()
            },
            clearBtnClick() {
                this.searchForm = {
                    customerCompanyId: '',
                    serviceCompanyId: '',
                    esignType: ''
                }
                this.$refs.WPaging.clear()
            },
            editBtnClick(item) {
                const str = `确认将${item.esignType === 'e_sign_first' ? '先签后发' : '无需签约'}改为${item.esignType === 'e_sign_first' ? '无需签约' : '先签后发'}`
                this.$confirm(str, '修改提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    post('/api/risk-mgt-service/esign-config/update-esign-config', {
                        config: item.esignType === 'e_sign_first' ? 'no_need_sign' : 'e_sign_first',
                        id: item.id
                    }).then(() => {
                        this.$message({
                            message: '修改成功',
                            type: 'success'
                        });
                        this.getListData()
                    })
                }).catch(() => {
                });
            },
            addBtnClick() {
                this.$refs.WPop.show()
            },
            pageChange(data) {
                this.pageData.page = data.pageNum
                this.pageData.pageSize = data.pageSize
                this.getListData()
            },
            getListData() {
                post('/api/risk-mgt-service/esign-config/company-config-list', {
                    ...this.pageData,
                    ...this.searchForm
                }).then((tableData) => {
                    this.tableData = tableData.list
                    this.total = tableData.total
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
            removeBtnClick(item) {
                this.$confirm('确定需要删除嘛?', '删除提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    get('/api/risk-mgt-service/esign-config/delete-esign-config', {
                        id: item.id
                    }).then(() => {
                        this.$message({
                            message: '删除成功',
                            type: 'success'
                        });
                        this.$refs.WPaging.clear()
                    })
                }).catch(() => {
                });
            }
        },
        mounted() {
            this.getLuoDiGongSi()
            this.getCustomerCompanies()
            this.getListData()
        }
    }
</script>

<style scoped lang="scss">
    .e-contract-sign-the-coma {
        min-height: calc(100vh - 100px);

        > .section {
            background-color: #fff;
            padding: 20px;

            > .page-title {
                margin: 0;
                color: rgba(16, 16, 16, 1);
                font-size: 20px;

                > .show {
                    color: rgba(187, 187, 187, 1);
                    font-size: 14px;
                }
            }

            .pei-icon {
                width: 28px;
                color: rgba(187, 187, 187, 1);
                font-size: 16px;
                display: inline-block;
                border: 1px solid rgba(187, 187, 187, 1);
                border-radius: 50%;
                line-height: 26px;
                text-align: center;
            }

            .action-text {
                color: rgba(26, 179, 148, 1);
            }

            .sign-label {
                color: rgba(187, 187, 187, 1);
                padding: 2px;
                font-size: 16px;
                display: inline-block;
                border: 1px dashed rgba(187, 187, 187, 1);
            }

            .sign-label-action {
                color: #1D7CEE;
                border-color: #1D7CEE;
            }
        }
    }
</style>