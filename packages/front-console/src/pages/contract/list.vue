<template>
    <div style="background-color:#fff;padding:15px;">
        <div style="margin-bottom:30px;">合同管理</div>
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="企业名称" size="small" prop="customerName">
                <el-input v-model="formSearch.customerName"></el-input>
            </el-form-item>
            <el-form-item label="服务商名称" size="small" prop="serviceCompanyName">
                <el-input v-model="formSearch.serviceCompanyName"></el-input>
            </el-form-item>
            <el-form-item label="结算周期" size="small" prop="settleType">
                <el-select v-model="formSearch.settleType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="item in options" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <br>
            <el-form-item label="更新时间:" size="small">
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        :unlink-panels="true"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>
        <el-button size="small" @click="routerPush('/main/contract/create')">新增</el-button>
        <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="customerName" label="企业名称" width="200"></el-table-column>
            <el-table-column prop="serviceCompanyName" label="服务商名称" width="220"></el-table-column>
            <el-table-column prop="settleTypeName" label="结算周期"></el-table-column>
            <el-table-column prop="serviceFeeName" label="服务费收费比例"></el-table-column>
            <el-table-column prop="prePayFeeName" label="服务费是否预收" width="140"></el-table-column>
            <el-table-column prop="contractStartDate" label="合同开始时间"></el-table-column>
            <el-table-column prop="contractEndDate" label="合同结束时间"></el-table-column>
            <el-table-column prop="lastUpdateAt" label="更新时间" width="180">
                <template slot-scope="scope">
                    <span>{{scope.row.lastUpdateAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="handleLook(scope.row.id)" type="text">查看</el-button>
                    <el-button @click="handleEdit(scope.row.id)" type="text">编辑</el-button>
                    <el-button @click="handleCopy(scope.row)" type="text">复制</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            v-on:handleSizeChange="handleSizeChange"
            v-on:handleCurrentChange="handleCurrentChange"
            :currentPage="currentPage">
        </ayg-pagination>
        <el-dialog :title="`复制${source.customerName}-${source.serviceCompanyName}合同`" :visible.sync="show" width="500px">
            <el-form :model="copyForm" size="small" :rules="copyRules" label-width="100px" ref="copyForm">
                <el-form-item label="企业名称" prop="customerId">
                    <el-select v-model="copyForm.customerId" filterable class="input_full" @change="getCompanyName">
                        <el-option v-for="item in customerCompaniesList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="服务商名称" prop="serviceCompanyId">
                    <el-select v-model="copyForm.serviceCompanyId" filterable class="input_full">
                        <el-option v-for="item in serviceCompaniesList" :key="item.companyId" :label="item.companyName" :value="item.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <span class="tip">
                    *新合同的企业和服务商不支持修改
                </span>
                <el-form-item>
                    <el-button @click="show=false">取消</el-button>
                    <el-button @click="execute" type="primary">保存</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<style>
    .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
        margin-left: 0;
    }
</style>

<script>
    import {post, get} from '../../store/api';
import { setTimeout } from 'timers';

    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: parseInt(this.$route.query.page) || 1,
                tableList: [],
                options: [],
                formSearch: {
                    customerName: '',
                    serviceCompanyName: '',
                    settleType: '',
                    startAt: '',
                    endAt: ''
                },
                dateValue: '',
                show: false,
                customerCompaniesList: [],
                serviceCompaniesList: [],
                source: '',
                copyRules: {
                    customerId: [
                        {
                            required: true,
                            message: '请选择企业',
                            trigger: 'change'
                        }
                    ],
                    serviceCompanyId: [
                        {
                            required: true,
                            message: '请选择服务商',
                            trigger: 'change'
                        }
                    ]
                },
                copyForm: {
                    contractId: '',
                    customerId: '',
                    customerName: '',
                    serviceCompanyId: ''
                }
            }
        },
        methods: {
            resetForm(formName) {
                this.$refs[formName].resetFields();
                this.dateValue = '';
            },
            search() {
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            },
            handleSizeChange(value) {
                this.pageSize = value;
                this.currentPage = 1;
                this.requestAction({
                    page: this.currentPage,
                    pageSize: value,
                });
            },
            handleCurrentChange(value) {
                this.currentPage = value;
                if (this.currentChangeBySetting) {
                    this.currentChangeBySetting = false;
                    return;
                }
                this.requestAction({
                    page: value,
                    pageSize: this.pageSize,
                });
            },
            requestAction(pageInfo) {
                let startAt = '';
                let endAt = '';
                if (this.dateValue) {
                    startAt = this.dateValue[0];
                    endAt = this.dateValue[1];
                }
                let param = {
                    startAt: startAt,
                    endAt: endAt,
                    customerName: this.formSearch.customerName,
                    serviceCompanyName: this.formSearch.serviceCompanyName,
                    settleType: this.formSearch.settleType,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                post('/api/contract-web/contract/query-contracts', param).then(data => {
                    this.$router.push({
                        path: '/main/contract/list',
                        query: {page: pageInfo.page}
                    });
                    this.tableList = data
                })
            },
            routerPush(val) {
                this.$router.push({path: val});
            },
            getSettleType() {
                let url = '/api/contract-web/commom/option';
                get(url, {enumType: 'SettleType'}).then(data => {
                    this.options = data
                })
            },
            handleLook(id) {
                this.$router.push({
                    path: '/main/contract/preview',
                    query: {contractId: id}
                });
            },
            handleEdit(id) {
                this.$router.push({
                    path: '/main/contract/create',
                    query: {
                        contractId: id,
                        page: this.$route.query.page
                    }
                });
            },
            handleCopy(a) {
                this.source = a
                this.copyForm.contractId = a.id
                this.show = true
                this.copyForm = {
                    contractId: this.copyForm.contractId,
                    customerId: '',
                    customerName: '',
                    serviceCompanyId: ''
                }
                setTimeout(() => {
                    this.$refs['copyForm'] && this.$refs['copyForm'].clearValidate()
                }, 30)
            },
            getCompanyName() {
                this.customerCompaniesList.forEach(e => {
                    if(e.companyId == this.copyForm.customerId) {
                        this.copyForm.customerName = e.companyName
                    }
                })
            },
            execute() {
                this.$refs['copyForm'].validate(valid => {
                    if(valid) {
                        post('/api/contract-web/contract/copy-contract', this.copyForm).then(data => {
                            this.$message({
                                type: 'success',
                                message: '复制成功！'
                            })
                            this.show = false
                            this.search()
                        })
                    }
                })
            },
            getOptionCustomerCompanies() {
                let url = '/api/console-dlv/option/get-option-customer-companies';
                get(url).then(data => {
                    this.customerCompaniesList = data;
                })
            },
            getOptionServiceCompanies() {
                let url = '/api/console-dlv/option/get-option-service-companies';
                get(url).then(data => {
                    this.serviceCompaniesList = data
                })
            }
        },
        created() {
            this.requestAction({
                page: this.$route.query.page || 1,
                pageSize: this.pageSize,
            });
            this.getSettleType();
            this.getOptionCustomerCompanies();
            this.getOptionServiceCompanies();
        },
        activated() {
            this.requestAction({
                page: this.$route.query.page || 1,
                pageSize: this.pageSize,
            });
        }
    }
</script>
<style lang="scss" scoped>
    .input_full {
        width: 300px;
    }
    .tip {
        color: #999;
        font-size: 14px;
        margin-left: 100px;
        padding-bottom: 22px;
        display: block;
    }
</style>
