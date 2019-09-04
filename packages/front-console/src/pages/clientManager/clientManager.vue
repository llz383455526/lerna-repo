<template>
    <div class="r_main">
        <el-breadcrumb>
            <el-breadcrumb-item>
                客户管理
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-form class="form"
                 :model="form"
                 :inline="true"
                 label-width="100px">
            <el-form-item label="企业名称"
                          size="small">
                <el-input v-model="form.fullName"
                          class="in_input"></el-input>
            </el-form-item>
            <el-form-item label="企业简称"
                          size="small">
                <el-input v-model="form.name"
                          class="in_input"></el-input>
            </el-form-item>
            <el-form-item label="关联交付"
                          size="small">
                <el-select v-model="form.deliverId"
                           class="in_input"
                           filterable>
                    <el-option label="全部"
                               value=""></el-option>
                    <el-option v-for="e in DeliverList"
                               :key="e.id"
                               :label="e.name"
                               :value="e.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联销售"
                          size="small">
                <!-- <el-select v-model="form.salesId"
                           class="in_input"
                           filterable>
                  <el-option label="全部"
                             value=""></el-option>
                  <el-option v-for="e in SalesList"
                             :key="e.id"
                             :label="e.name"
                             :value="e.id"></el-option>
                </el-select> -->
                <el-input v-model="form.salesName"
                          class="in_input"></el-input>
            </el-form-item>
            <el-form-item label="客户类型"
                          size="small">
                <el-select v-model="form.originalType"
                           class="in_input"
                           filterable>
                    <el-option label="全部"
                               value=""></el-option>
                    <el-option v-for="e in OriginaTypelList"
                               :key="e.value"
                               :label="e.text"
                               :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道名称"
                          size="small">
                <el-select v-model="form.agentCompanyId"
                           class="in_input"
                           filterable>
                    <el-option label="全部"
                               value=""></el-option>
                    <el-option v-for="e in AgentCompanyList"
                               :key="e.agentCompanyId"
                               :label="e.agentCompanyName"
                               :value="e.agentCompanyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item size="small">
                <el-button type="primary"
                           @click="query">查询
                </el-button>
                <el-button @click="clear">重置</el-button>
                <el-button @click="handleExport">导出</el-button>
            </el-form-item>
        </el-form>
        <router-link to="addClient"
                     v-if="checkRight(permissions, 'sysmgr-web:/company/add-company')">
            <el-button size="small"
                       type="primary">新建企业
            </el-button>
        </router-link>
        <el-table class="table"
                  :data="tableData"
                  border="">
            <el-table-column prop="fullName"
                             label="企业全称"></el-table-column>
            <el-table-column prop="chargeByName"
                             label="企业负责人"></el-table-column>
            <el-table-column prop="salesList"
                             label="关联销售">
                <template slot-scope="scope">
                    <div v-for="e in scope.row.salesList"
                         :key="e.id">{{e.name}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="deliverList"
                             label="关联交付">
                <template slot-scope="scope">
                    <p style="margin: 0"
                       v-for="(v, k) in scope.row.deliverList"
                       :key="k">{{ v.name }}</p>
                </template>
            </el-table-column>
            <el-table-column prop="originalTypeName"
                             label="客户类型"></el-table-column>
            <el-table-column prop="agentCompanyName"
                             label="所属渠道"></el-table-column>
            <el-table-column prop="createTime"
                             label="添加时间"></el-table-column>
            <el-table-column prop="updateTime"
                             label="更新时间"></el-table-column>
            <el-table-column label="操作"
                             width="200">
                <template slot-scope="scope">
                    <el-button v-if="checkRight(permissions, 'sysmgr-web:/company/edit-company')"
                               @click="appManager(scope.row)"
                               type="text">管理
                    </el-button>
                    <el-button @click="appExamine(scope.row)"
                               type="text">查看
                    </el-button>
                    <el-button type="text"
                               @click="getDialogTable(scope.row)">历史版本
                    </el-button>
                    <!-- <el-button v-if="checkRight(permissions, 'risk-mgt-service:/company-business-risk/get-customer-business-risk')" type="text" @click="onLineAuditBtnClick(scope.row)">
                        发放管理
                    </el-button> -->
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination v-if="total"
                        :total="total"
                        v-on:handleSizeChange="setSize"
                        :currentSize="form.pageSize"
                        v-on:handleCurrentChange="query"
                        :currentPage="form.page">
        </ayg-pagination>
        <el-dialog :visible.sync="dialogTableVisible">
            <el-tabs>
                <el-tab-pane label="客户归属变更记录">
                    <el-table :data="OriginaTypeTable">
                        <el-table-column property="versionStartDate"
                                         label="版本生效时间"></el-table-column>
                        <el-table-column property="version"
                                         label="版本号"></el-table-column>
                        <el-table-column property="statusName"
                                         label="状态"></el-table-column>
                        <el-table-column property="memo"
                                         label="变更版本说明"></el-table-column>
                        <el-table-column property="createTime"
                                         label="创建时间"></el-table-column>
                        <el-table-column property="createByName"
                                         label="创建人"></el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="关联销售变更记录">
                    <el-table :data="SalesTable">
                        <el-table-column property="versionStartDate"
                                         label="版本生效时间"></el-table-column>
                        <el-table-column property="versionSeq"
                                         label="版本号"></el-table-column>
                        <el-table-column property="statusName"
                                         label="状态"></el-table-column>
                        <el-table-column property="memo"
                                         label="变更版本说明"></el-table-column>
                        <el-table-column property="createTime"
                                         label="创建时间"></el-table-column>
                        <el-table-column property="createByName"
                                         label="创建人"></el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>

        </el-dialog>
        <!-- <el-dialog
            :visible.sync="onlineAuditIsShow"
            width="800px">
            <p slot="title" style="margin: 0px" v-if="shangHuShangXianModel">
                {{ shangHuShangXianModel.customerCompanyName }}&nbsp;&nbsp;&nbsp;&nbsp;
                <el-switch v-model="shangHuShangXianModel.enable" @change="faFangTitleChange(shangHuShangXianModel)"></el-switch>
                <span>客户发放开关</span><br /><br />
							<span v-if="shangHuShangXianModel.agentCompanyName" style="font-size: 14px; color: #3a3a3a">代理商名称：{{ shangHuShangXianModel.agentCompanyName }}</span>
							<span v-else style="font-size: 14px; color: #999">代理商名称：非代理商客户</span>
            </p>
					<el-table
						v-if="shangHuShangXianModel"
						:data="shangHuShangXianModel.detailResultList"
						style="width: 100%">
						<el-table-column
							label=""
							width="50px">
							<template slot-scope="scope">
								<el-switch v-model="scope.row.enable" @change="faFangCellChange(scope.row)"></el-switch>
							</template>
						</el-table-column>
						<el-table-column
							label="落地公司名称">
							<template slot-scope="scope">
								{{ scope.row.serviceCompanyName }}
							</template>
						</el-table-column>
						<el-table-column
							label="合同是否归档">
							<template slot-scope="scope">
								<span class="item-data">{{ scope.row.contractOk ? '是' : '否' }}</span>
							</template>
						</el-table-column>
						<el-table-column
							prop="cuserBalanceStandardStateName"
							label="计算规则是否通过">
						</el-table-column>
					</el-table>
        </el-dialog> -->
    </div>
</template>
<script>
    import {mapGetters} from 'vuex';
    import {get, post, formPost, postButNoErrorToast} from "../../store/api";

    export default {
        data() {
            return {
                form: {
                    name: "",
                    fullName: "",
                    page: 1,
                    pageSize: 10,
                    deliverId: '',
                    salesId: '',
                    salesName: '',
                    agentCompanyId: '',
                    originalType: '',
                },
                tableData: [],
                total: 0,
                appId: "",
                loading: false,
                remoteData: [],
                activeData: '',
                OriginaTypeTable: [],
                dialogTableVisible: false,
                DeliverList: [],
                SalesList: [],
                OriginaTypelList: [],
                AgentCompanyList: [],
                // onlineAuditIsShow: false,
                // shangHuShangXianModel: null
            };
        },
        computed: {
            ...mapGetters({
                permissions: 'permissions',
                userInformation: 'userInformation'
            })
        },
        activated() {
            this.activeData && (this.form = JSON.parse(this.activeData))
            this.query(this.form.page);
            this.getDeliverList()
            //   this.getSalesList()
            this.getOriginaTypelList()
            this.getAgentCompanyList()
        },
        methods: {
            // faFangTitleChange(data) {
            //     post('/api/risk-mgt-service/company-business-risk/update-customer-business-enable', {
            //         "customerCompanyId": data.customerCompanyId,
            //         "enable": data.enable ? 1 : 0
            //     }).then((data) => {
            //         this.$message({
            //             message: '修改成功',
            //             type: 'success'
            //         });
            //     }).catch(() => {

            //     })
            // },
            // faFangCellChange(data) {
            //     post('/api/risk-mgt-service/company-business-risk/update-customer-business-enable', {
            //         "customerCompanyId": this.shangHuShangXianModel.customerCompanyId,
            //         "enable": data.enable ? 1 : 0,
            //         "serviceCompanyId": data.serviceCompanyId
            //     }).then((data) => {
            //         this.$message({
            //             message: '修改成功',
            //             type: 'success'
            //         });
            //     }).catch(() => {

            //     })
            // },
            // onLineAuditBtnClick(item) {
            //     this.shangHuShangXianModel = null
            //     get('/api/risk-mgt-service/company-business-risk/get-customer-business-risk', {
            //         customerCompanyId: item.id
            //     }).then((data) => {
            //         data.enable = !!data.businessStatus
            //         if (!data.detailResultList) {
            //             data.detailResultList = []
            //         }
            //         data.detailResultList.forEach((item) => {
            //             item.enable = !!item.businessStatus
            //         })
            //         this.shangHuShangXianModel = data
            //     }).catch(() => {

            //     })
            //     this.onlineAuditIsShow = true
            // },
            // getDeliverList() {
            //     get('/api/sysmgr-web/user/get-group-users?relationKey=DeliverUserRelation').then((res) => {
            //         this.DeliverList = res
            //     })
            // },
            getSalesList() {
                const queryForm = {
                    accountInfo: "",
                    platFormType: 'console-admin',
                    pageSize: 500,
                    page: 1,
                }
                post("/api/sysmgr-web/commom/user-list", queryForm).then(({list}) => {
                    this.SalesList = list;
                })
                // get('/api/sysmgr-web/user/get-group-users?relationKey=SalesUserRelation').then((res) => {
                //     this.SalesList = res
                // })
            },
            getOriginaTypelList() {
                get('/api/sysmgr-web/commom/option?enumType=OriginalType').then((res) => {
                    this.OriginaTypelList = res
                })
            },
            getAgentCompanyList() {
                get('/api/sysmgr-web/commom/agent-company-options').then((res) => {
                    this.AgentCompanyList = res
                })
            },
            getDialogTable(row) {
                const one = get('/api/sysmgr-web/company/custom-company-change-hist', {customCompanyId: row.id}).then(res => {
                    //   console.log(res)
                    this.OriginaTypeTable = res
                })
                const two = get('/api/sysmgr-web/company/custom-company-hist-sales', {customCompanyId: row.id}).then(res => {
                    this.SalesTable = res
                })
                Promise.all([one, two]).then(() => {
                    this.dialogTableVisible = true
                })
            },
            query(a) {
                this.form.page = 1;
                if (a && !isNaN(a)) {
                    this.form.page = a;
                }
                this.activeData = JSON.stringify(this.form)
                post("/api/sysmgr-web/company/query-company", this.form).then(
                    function (data) {
                        this.tableData = data.list;
                        this.total = data.total;
                    }.bind(this)
                );
            },
            handleExport() {
                var str = ''
                for (var k in this.form) {
                    if (!str) {
                        str += `?${k}=${this.form[k]}`
                    } else {
                        str += `&${k}=${this.form[k]}`
                    }
                }
                window.open(`/api/sysmgr-web/company/export-custom-company${str}`)
            },
            setSize(a) {
                this.form.pageSize = a
                this.query()
            },
            clear() {
                this.form = {
                    name: "",
                    fullName: "",
                    orderBy: "",
                    page: 1,
                    pageSize: 5
                };
            },
            remoteMethod(query) {
                if (query !== "") {
                    var that = this;
                    this.loading = true;
                    get("/api/sysmgr-web/company/search-principal-company", {
                        name: query
                    }).then(function (data) {
                        that.loading = false;
                        that.remoteData = data;
                    });
                }
            },
            sure(e) {
                if (this.appId) {
                    post("/api/sysmgr-web/company/add-customer-company", {
                        id: this.appId
                    }).then(
                        function (data) {
                            this.appId = "";
                            this.eshow = false;
                            this.$message({
                                type: "success",
                                message: "添加成功！"
                            });
                        }.bind(this)
                    );
                }
            },
            appManager(e) {
                localStorage.setItem('appId', e.id)
                localStorage.setItem('fullName', e.fullName)
                this.$router.push("/main/clientManager/appManager");
            },
            appExamine(e) {
                localStorage.setItem('appId', e.id)
                localStorage.setItem('fullName', e.fullName)
                this.$router.push("/main/clientManager/appExamine");
            },
            serverManager(e) {
                localStorage.setItem('appId', e.id)
                localStorage.setItem('fullName', e.fullName)
                this.$router.push("/main/clientManager/serverManager");
            }
        }
    };
</script>
<style scoped lang="scss">
    .online-audit-pop-content {
        .flex-center-column {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
        }
    }
    .r_main {
        padding: 30px 10px;
        background-color: #fff;
    }

    .form {
        margin-top: 20px;
    }

    .in_input {
        width: 200px;
    }

    .t_head {
        margin: 30px 0;
        font-size: 20px;
        color: #666;
    }

    .table {
        margin-top: 20px;
    }

    .page {
        margin-top: 30px;
        display: flex;
        justify-content: space-around;
    }

    .half > span {
        display: inline-block;
        width: 40%;
    }

    .f_input {
        width: 400px;
    }

    .form_footer > button {
        margin: 0px 30px;
    }

    .start-icon {
        color: #ddd;
    }

    .start-action {
        color: #30652e;
    }
</style>
