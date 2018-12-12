<template>
<div class="wrap">
    <div class="title">清分记录</div>

    <el-form :inline="true" ref="searchForm" :model="searchForm">
        <el-form-item label="企业公司" prop="companyId">
            <el-select filterable v-model="searchForm.companyId" @change="changeCompany">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item, key) in option.customerCompanies" :key="key" :label="item.companyName" :value="item.companyId"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="商户名称" prop="appId">
            <el-select filterable v-model="searchForm.appId" :no-data-text="searchForm.appId ? '无数据' : '请先选择企业'">
                <!-- <el-option label="全部" value=""></el-option> -->
                <el-option v-for="(item, key) in option.appList" :key="key" :label="item.text" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="转出子账户" prop="fromPaymentUserNo">
            <el-input v-model.number="searchForm.fromPaymentUserNo"></el-input>
        </el-form-item>
        <el-form-item label="转入子账户" prop="toPaymentUserNo">
            <el-input v-model.number="searchForm.toPaymentUserNo"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="state">
            <el-select filterable v-model="searchForm.state">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item, key) in option.clearingStateList" :key="key" :label="item.text" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="处理时间">
            <el-date-picker v-model="dateValue" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" @change="setTime"></el-date-picker>
            <!-- <dataPicker @setTime="setTime"></dataPicker> -->
        </el-form-item>
        <el-form-item>
            <el-button @click="query">查询</el-button>
            <el-button @click="resetForm('searchForm')">清除</el-button>
            <el-button @click="exportFile">导出</el-button>
        </el-form-item>
    </el-form>

    <el-button @click="dialogCreateVisible=true">手动清分</el-button>

    <el-table :data="tableData.list">
        <el-table-column label="客户公司" prop="companyName"></el-table-column>
        <el-table-column label="商户名称" prop="appName"></el-table-column>
        <el-table-column label="服务商名称" prop="serviceCompanyName"></el-table-column>
        <el-table-column label="支付渠道" prop="paymentThirdType"></el-table-column>
        <el-table-column label="主账户账号" prop="mainAccountNo"></el-table-column>
        <el-table-column label="主账户户名" prop="mainAccountName"></el-table-column>
        <el-table-column label="转出子账户账号" prop="fromPaymentUserNo"></el-table-column>
        <el-table-column label="转出子账户名" prop="fromPaymentUserName"></el-table-column>
        <el-table-column label="转入子账户账号" prop="toPaymentUserNo"></el-table-column>
        <el-table-column label="转入子账户名" prop="toPaymentUserName"></el-table-column>
        <el-table-column label="金额" prop="tradeAmount"></el-table-column>
        <el-table-column label="调整备注" prop="remarks"></el-table-column>
        <el-table-column label="操作人" prop="createByName"></el-table-column>
        <el-table-column label="处理时间" prop="updateTime"></el-table-column>
        <el-table-column label="状态" prop="stateName"></el-table-column>
    </el-table>
    <ayg-pagination v-if="tableData.total" :total="tableData.total" :currentPage="searchForm.page" v-on:handleSizeChange="sizeChange" v-on:handleCurrentChange="query"></ayg-pagination>

    <el-dialog title="手动清分" :visible.sync="dialogCreateVisible">
        <el-form label-width="150px" ref="createForm" :rules="check.rules" :model="createForm">
            <el-form-item label="服务商名称" prop="serviceCompanyId">
                <el-select filterable v-model="createForm.serviceCompanyId" class="form-width" @change="changeService">
                    <el-option v-for="(item, key) in option.serveCompanyList" :key="key" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主账户账号" prop="mainAccountNo">
                <el-select filterable v-model="createForm.mainAccountNo" class="form-width" @change="changeChannel">
                    <el-option v-for="(item, key) in option.primaryAccountList" :key="key" :label="item.channelAlias" :value="item.merchId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="转出子账户" prop="fromPaymentUserId">
                <el-select filterable v-model="createForm.fromPaymentUserId" class="form-width" @change="changeFrom">
                    <el-option v-for="(item, key) in option.bypassAccountList" :key="key" :label="item.payeruserName" :value="item.userId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="转入子账户" prop="toPaymentUserId">
                <el-select filterable v-model="createForm.toPaymentUserId" class="form-width" @change="changeTo">
                    <el-option v-for="(item, key) in option.bypassAccountList" :key="key" :label="item.payeruserName" :value="item.userId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="转入调账金额" prop="tradeAmount">
                <el-input v-model="createForm.tradeAmount" class="form-width"></el-input>
            </el-form-item>
            <el-form-item label="备注说明" prop="remarks">
                <el-input v-model="createForm.remarks" class="form-width"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="submitForm('createForm')">保存</el-button>
                <el-button @click="cancel('createForm')">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</div>
</template>

<script>
import createForm from '../../../model/clearing/createForm.js'
import searchForm from '../../../model/clearing/searchForm.js'
import check from '../../../model/clearing/check.js'
import optionModel from '../../../model/option/optionModel.js'
import dataPicker from '../../../pageComponent/dataPicker'
import {
    get,
    post
} from "../../../store/api"
import { baseUrl } from "../../../config/address.js"
export default {
    data() {
        return {
            dialogCreateVisible: false,
            createForm: new createForm(),
            searchForm: new searchForm(),
            option: new optionModel(),
            check: new check(),
            tableData: '',
            dateValue: []
        }
    },
    components: {
        dataPicker
    },
    created() {
        this.option.getCustomerCompanies();
        this.option.getServeCompanyList();
        this.option.getClearingStateList();
        this.query();
    },
    methods: {
        setTime(e) {
            this.searchForm.createAtBegin = e[0];
            this.searchForm.createAtEnd = e[1];
        },
        changeCompany(e) {
            this.option.getAppList(e);
            this.searchForm.appId = '';
        },
        changeService(e) {
            let json = this.option.getJson(this.option.serveCompanyList, 'id', e);
            this.option.getPrimaryAccountList(e);
            this.createForm.serviceCompanyName = json.name;
            this.createForm.mainAccountNo = '';
            this.createForm.fromPaymentUserId = '';
            this.createForm.toPaymentUserId = '';
        },
        changeChannel(e) {
            let json = this.option.getJson(this.option.primaryAccountList, 'merchId', e);
            this.option.getBypassAccountList(json.id);
            this.createForm.mainAccountName = json.merchName;
            this.createForm.fromPaymentUserId = '';
            this.createForm.toPaymentUserId = '';
        },
        changeFrom(e) {
            let json = this.option.getJson(this.option.bypassAccountList, 'userId', e);
            this.createForm.fromPaymentUserName = json.payeruserName;
            this.createForm.fromPaymentUserNo = json.thirdpayUserId;
        },
        changeTo(e) {
            let json = this.option.getJson(this.option.bypassAccountList, 'userId', e);
            this.createForm.toPaymentUserName = json.payeruserName;
            this.createForm.toPaymentUserNo = json.thirdpayUserId;
        },
        submitForm(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    post("/api/balance-web/pay-user-recon/create", this.createForm).then(data => {
                        this.query();
                        this.dialogCreateVisible = false;
                        this.resetForm(formName);
                    });
                }
            })
        },
        cancel(formName) {
            this.dialogCreateVisible = false;
            this.resetForm(formName);
        },
        query(page) {
            if (isNaN(page)) {
                page = 1
            }
            this.searchForm.page = page;
            post(`/api/balance-web/pay-user-recon/list`, this.searchForm).then(data => {
                this.tableData = data
            })
        },
        exportFile() {
            var str = ''
            for (var k in this.searchForm) {
                if (k != 'page' && k != 'pageSize') {
                    if (!str) {
                        str += `?${k}=${this.searchForm[k]}`
                    } else {
                        str += `&${k}=${this.searchForm[k]}`
                    }
                }
            }
            location.href = `${baseUrl}/api/balance-web/pay-user-recon/export-recon-list${str}`
        },
        sizeChange(pageSize) {
            this.searchForm.pageSize = pageSize
            this.query()
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
            this.dateValue = [];
            this.searchForm.createAtBegin = '';
            this.searchForm.createAtEnd = '';
        },
        setTime() {
            if (this.dateValue && this.dateValue.length) {
                this.searchForm.createAtBegin = this.dateValue[0]
                this.searchForm.createAtEnd = this.dateValue[1]
            } else {
                this.searchForm.createAtBegin = ''
                this.searchForm.createAtEnd = ''
            }
        }
    }
}
</script>

<style scoped>
.form-width {
    width: 300px;
}
</style>
