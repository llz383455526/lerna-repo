<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0px 30px 30px;">充值记录<el-button style="float:right;" @click="creatNew">新增充值记录</el-button></div>

        <el-table :data="companyCreditRecordList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="companyName" label="客户公司"></el-table-column>
            <el-table-column prop="companyAccountNo" label="账户名"></el-table-column>
            <el-table-column prop="payRemarksName" label="充值说明"></el-table-column>
            <el-table-column prop="companyAccountName" label="客户账号"></el-table-column>
            <el-table-column prop="amount" label="金额(元)">
                <template slot-scope="scope">
                    <span>{{scope.row.amount | formatMoney()}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="state" label="状态"></el-table-column>
            <el-table-column prop="updateAt" label="记录">
                <template slot-scope="scope">
                    <span>{{scope.row.updateAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updateByName" label="操作人"></el-table-column>
        </el-table>

        <ayg-pagination v-if="companyCreditRecordList.total" :total="companyCreditRecordList.total" :currentPage="currentPage"
                v-on:handleSizeChange="handleSizeChange"
                v-on:handleCurrentChange="handleCurrentChange"></ayg-pagination>

        <el-dialog title="新增信用授权额度" :visible.sync="formEditVisible" width="30%">
            <el-form :model="formEdit" ref="formEdit">
                <el-form-item label="客户公司：">
                    <el-select v-model="formEdit.companyId" @change="handleChangeCompany">
                        <el-option v-for="(item, index) in companies" :label="item.companyName" :value="item.companyId" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="充值说明：">
                    <el-select v-model="formEdit.payRemarks">
                        <el-option v-for="(item, index) in payRemarks" :label="item.text" :value="item.value" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号名称：">
                    <el-select v-model="formEdit.accountNo" @change="handleChangeAccount">
                        <el-option v-for="(item, index) in accounts" :label="item.accountAliasName" :value="item.accountNo" :key="index"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="账号：">
                    <em style="width: 2em;min-height:1px;display:block;float:left;"></em>
                    <el-input style="width: 200px;" v-model="formEdit.accountNo" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="充值金额：">
                    <el-input style="width: 200px;" v-model="formEdit.amount" :maxlength="13"></el-input>
                    <span>元</span>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitFormEdit">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {get, post, formPost} from "../../store/api";
    import {showNotify} from "../../plugin/utils-notify";
    import _ from 'lodash';

    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                formEditVisible: false,
                formEdit: {
                    companyId: '',
                    payRemarks: '',
                    accountName: '',
                    accountNo: '',
                    amount: ''
                },
                payRemarks: [],
                accounts: [],
                companies: []
            }
        },
        computed: {
            ...mapGetters({
                companyCreditRecordList: 'companyCreditRecordList'
            })
        },
        methods: {
            handleSizeChange: function(value) {
                this.pageSize = value;
                if (this.currentPage == 1) {
                    this.requestAction({
                        page: 1,
                        pageSize: value,
                    });
                } else {
                    this.currentPage = 1;
                }
            },
            handleCurrentChange: function(value) {
                this.currentPage = value;
                this.requestAction({
                    page: value,
                    pageSize: this.pageSize,
                });
            },
            handleChangeCompany: function () {
                this.getAccounts();
            },
            handleChangeAccount: function (e) {
                _.forEach(this.accounts, n => {
                    if (n.accountNo === e) {
                        this.formEdit.accountName = n.accountAliasName
                    }
                })
            },
            requestAction: function (pageInfo) {
                let param = {
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize
                }
                this.$store.dispatch('getCompanyCreditRecord', param);
            },
            creatNew: function () {
                this.formEditVisible = true;
                this.getCompanies();
                this.getPayRemarks();
            },
            getPayRemarks: function () {
                let url = '/company-credit-record/all-pay-remarks';
                get(url).then(data => {
                    this.payRemarks = data
                });
            },
            getAccounts: function () {
                let url = '/company-credit-record/get-accounts';
                get(url, {
                    companyId: this.formEdit.companyId
                }).then(data => {
                    this.accounts = data
                });
            },
            getCompanies: function () {
                let url = '/company-credit/query-all-companies';
                get(url).then(data => {
                    this.companies = data
                });
            },
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
                this[formName] = {};
            },
            submitFormEdit: function () {
                this.$refs['formEdit'].validate(valid => {
                    if (valid) {
                        let url = '/company-credit-record/add';
                        let option = this.formEdit;
                        post(url, option).then(data => {
                            showNotify('success', '操作成功!');
                            this.resetForm('formEdit');
                            this.formEditVisible = false;
                            this.requestAction({
                                page: 1,
                                pageSize: this.pageSize,
                            });
                        })
                    }
                })
            }
        },
        created: function () {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            })
        }
    }
</script>

<style scoped>

</style>