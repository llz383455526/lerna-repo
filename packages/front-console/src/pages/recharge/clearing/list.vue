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
        <el-form-item label="转入账户" prop="toPaymentUserNo">
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
        <el-form-item label="调账类型" prop="sourceType">
            <el-select filterable v-model="searchForm.sourceType">
                <el-option label="全部" value=""></el-option>
                <el-option v-for="(item, key) in option.sourceTypeList" :key="key" :label="item.text" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item>
            <el-button @click="query">查询</el-button>
            <el-button @click="resetForm('searchForm')">清除</el-button>
            <el-button @click="exportFile">导出</el-button>
        </el-form-item>
    </el-form>

    <el-button @click="dialogCreateVisible=true">手动清分</el-button>
    <el-button @click="show=true">平安对公转账</el-button>

    <el-table :data="tableData.list">
        <el-table-column label="客户公司" prop="companyName"></el-table-column>
        <el-table-column label="商户名称" prop="appName"></el-table-column>
        <el-table-column label="服务商名称" prop="serviceCompanyName"></el-table-column>
        <el-table-column label="支付渠道" prop="paymentThirdType"></el-table-column>
        <el-table-column label="主账户账号" prop="mainAccountNo"></el-table-column>
        <el-table-column label="主账户户名" prop="mainAccountName"></el-table-column>
        <el-table-column label="转出子账户账号" prop="fromPaymentUserNo"></el-table-column>
        <el-table-column label="转出子账户名" prop="fromPaymentUserName"></el-table-column>
        <el-table-column label="转入账户账号" prop="toPaymentUserNo"></el-table-column>
        <el-table-column label="转入账户名" prop="toPaymentUserName"></el-table-column>
        <el-table-column label="金额" prop="tradeAmount"></el-table-column>
        <el-table-column label="调整备注" prop="remarks"></el-table-column>
        <el-table-column label="渠道反馈" prop="errMsg" width="180"></el-table-column>
        <el-table-column label="操作人" prop="createByName"></el-table-column>
        <el-table-column label="处理时间" prop="updateTime"></el-table-column>
        <el-table-column label="状态" prop="stateName"></el-table-column>
        <el-table-column label="调账类型" prop="sourceTypeName"></el-table-column>
    </el-table>
    <ayg-pagination v-if="tableData.total" :total="tableData.total" :currentPage="searchForm.page" v-on:handleSizeChange="sizeChange" v-on:handleCurrentChange="query"></ayg-pagination>

    <el-dialog title="手动清分" :visible.sync="dialogCreateVisible" @open="resetForm('createForm')">
        <el-form label-width="150px" ref="createForm" :rules="check.rules" :model="createForm">
            <el-form-item label="服务商名称" prop="serviceCompanyId">
                <el-select filterable v-model="createForm.serviceCompanyId" class="form-width" @change="changeService">
                    <el-option v-for="(item, key) in option.serveCompanyList" :key="key" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道类型" prop="channelType">
                <el-select filterable v-model="createForm.channelType" class="form-width" @change="changeChannelType">
                    <el-option v-for="item in option.channelTypeList" :key="item.value" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="主账户账号" prop="mainAccountNo">
                <el-select filterable v-model="createForm.mainAccountNo" class="form-width" @change="changeChannel">
                    <el-option v-for="item in option.primaryAccountList" :key="item.id" :label="item.channelAlias" :value="item.merchId"></el-option>
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

    <el-dialog title="服务费提现" :visible.sync="show" @open="resetForm('withdrawForm')" width="800px">
        <el-form label-width="150px" ref="withdrawForm" :rules="check.rules" :model="withdrawForm">
            <el-form-item label="服务商名称" prop="serviceCompanyId">
                <el-select filterable v-model="withdrawForm.serviceCompanyId" class="form-width" @change="changeService_0">
                    <el-option v-for="(item, key) in option.serveCompanyList" :key="key" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="转出账户账号">
                {{option.withdrawInfo.fromPaymentUserName}}
            </el-form-item>
            <el-form-item label="转入账户" prop="toAccountNo">
                <el-select filterable v-model="withdrawForm.toAccountNo" class="form-width" @change="changeTo_0">
                    <el-option v-for="(item, key) in option.withdrawInfo.toBankAccounts" :key="key" :label="item.accountName" :value="item.accountNo"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item v-if="option.withdrawInfo.toBankAccounts">
                <template v-if="bankMsg">
                    <div>账户名称：{{bankMsg.accountName}}</div>
                    <div>开户行：{{bankMsg.depositBank}}</div>
                    <div>账号：{{bankMsg.accountNo}}</div>
                </template>
                <div>待提服务费金额：{{option.withdrawInfo.withdrawAmount | formatMoney}} 
                    <i class="el-icon-question ml10" title="服务费子账户当前余额 &lt;= {平安主账户余额 - 【全部客户公司平安余额总和】-3万（手续费预留）}；
则 待提现服务费金额 = 服务费子账户当前余额；
服务费子账户当前余额 > {平安主账户余额 - 【全部客户公司平安余额总和】-3万（手续费预留）};
则 待提现服务费金额 =  {平安主账户余额 - 【全部客户公司平安余额总和】-3万（手续费预留）};">
                    </i>
                </div>
            </el-form-item>
            <el-form-item label="转入调账金额" prop="tradeAmount">
                <el-input v-model="withdrawForm.tradeAmount" class="form-width"></el-input>
            </el-form-item>
            <el-form-item label="备注说明" prop="remarks">
                <el-input v-model="withdrawForm.remarks" class="form-width"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="save">保存</el-button>
                <el-button @click="show = false">取消</el-button>
            </el-form-item>
        </el-form>
    </el-dialog>
</div>
</template>

<script>
import createForm from '../../../model/clearing/createForm.js'
import searchForm from '../../../model/clearing/searchForm.js'
import withdrawForm from '../../../model/clearing/withdrawForm.js'
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
            withdrawForm: new withdrawForm(),   // todo 提现是否涉及平安与阿里网商直连？
            option: new optionModel(),
            check: new check(),
            tableData: '',
            dateValue: [],
            show: false,
            bankMsg: ''
        }
    },
    components: {
        dataPicker
    },
    created() {
        this.option.getCustomerCompanies();
        this.option.getServeCompanyList();
        this.option.getClearingStateList();
        this.option.getSourceTypeList();
        this.option.getChannelTypeList();
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
        changeChannelType() {
            this.createForm.paymentThirdType = this.createForm.channelType
            this.option.getPrimaryAccountList(this.createForm.serviceCompanyId, this.createForm.channelType);
        },
        changeService(e) {
            let json = this.option.getJson(this.option.serveCompanyList, 'id', e);
            // this.option.getPrimaryAccountList(e);
            this.createForm.serviceCompanyName = json.name;
            this.createForm.mainAccountNo = '';
            this.createForm.fromPaymentUserId = '';
            this.createForm.toPaymentUserId = '';
        },
        changeService_0(e) {
            let json = this.option.getJson(this.option.serveCompanyList, 'id', e);
            this.option.getPrimaryAccountList(e);
            this.option.getWithdrawInfo({
                paymentThirdType: this.withdrawForm.paymentThirdType,
                serviceCompanyId: this.withdrawForm.serviceCompanyId
            })
            this.withdrawForm.toAccountNo = ''
            this.bankMsg = ''
            this.withdrawForm.serviceCompanyName = json.name;
        },
        changeChannel(e) {
            let json = this.option.getJson(this.option.primaryAccountList, 'merchId', e);
            this.createForm.mainAccountName = json.merchName;
            this.createForm.fromPaymentUserId = '';
            this.createForm.toPaymentUserId = '';
            this.option.getBypassAccountList(json.id);
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
        changeTo_0(e) {
            let json = this.option.getJson(this.option.withdrawInfo.toBankAccounts, 'accountNo', e);
            this.withdrawForm.toAccountName = json.accountName;
            this.withdrawForm.toDepositBank = json.depositBank;
            this.bankMsg = json
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
        save() {
            this.$refs.withdrawForm.validate(valid => {
                if(valid) {
                    post('/api/balance-web/pay-user-recon/withdraw',this.withdrawForm).then(data => {
                        this.query();
                        this.show = false;
                    })
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
            location.href = `/api/balance-web/pay-user-recon/export-recon-list${str}`
        },
        sizeChange(pageSize) {
            this.searchForm.pageSize = pageSize
            this.query()
        },
        resetForm(formName) {
            this.$refs[formName] && this.$refs[formName].resetFields();
            this.dateValue = [];
            this.searchForm.createAtBegin = '';
            this.searchForm.createAtEnd = '';
            this.option.withdrawInfo = {}
        },
        setTime() {
            if (this.dateValue && this.dateValue.length) {
                this.searchForm.createAtBegin = this.dateValue[0]
                this.searchForm.createAtEnd = this.dateValue[1]
            } else {
                this.searchForm.createAtBegin = ''
                this.searchForm.createAtEnd = ''
            }
        },
        toPublic() {
            post('/api/balance-web/pay-user-recon/get-withdraw-info', {
                paymentThirdType: '',
                serviceCompanyId: ''
            })
            this.dialogCreateVisible = true
        }
    }
}
</script>

<style scoped>
.form-width {
    width: 300px;
}
.el-icon-question {
    margin-right: 5px;
    color: #f56c6c;
    cursor: pointer;
}
</style>
