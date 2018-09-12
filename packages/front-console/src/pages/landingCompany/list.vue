<template>
    <div style="background-color:#fff;padding:15px;">
        <div style="margin-bottom:30px;">落地公司开票信息管理</div>
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch" s>
            <el-form-item label="" size="small" prop="companyName">
                <el-input v-model="formSearch.companyName"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-button size="small" @click="routerPush('/main/billingManager/create')">添加落地企业信息</el-button>

        <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column label="操作" width="100" fixed>
                <template slot-scope="scope">
                    <el-button @click="dialogAddInvoiceVisible = true;id = scope.row.id;" type="text" size="medium" style="padding:0;margin-left: 11px;">添加票量
                    </el-button>
                    <el-button @click="dialogInvoicelistVisible = true;id = scope.row.id;handleRequest();" type="text" size="medium" style="padding:0;">领票记录
                    </el-button>
                    <el-button @click="handleEdit(scope.row.id)" type="text" size="medium" style="padding:0;">修改
                    </el-button>
                    <el-button @click="handleDelete(scope.row.id)" type="text" size="medium" style="padding:0;" v-if="tableList.ppLeftNum <= 0 && tableList.zpLeftNum <= 0">删除
                    </el-button>
                </template>
            </el-table-column>
            <el-table-column prop="name" label="企业名称" width="220"></el-table-column>
            <el-table-column prop="taxIdcd" label="纳税人识别号" width="200"></el-table-column>
            <el-table-column prop="addr" label="企业所在地" width="500"></el-table-column>
            <el-table-column prop="payee" label="收款人"></el-table-column>
            <el-table-column prop="checker" label="复核"></el-table-column>
            <el-table-column prop="drawer" label="开票人"></el-table-column>
            <el-table-column prop="ppMaxAmount" label="普票最大限额" width="120"></el-table-column>
            <!-- <el-table-column prop="ppMaxNum" label="普票最大张数" width="120"></el-table-column> -->
            <el-table-column prop="ppLeftNum" label="普票剩余票量" width="120"></el-table-column>
            <el-table-column prop="zpMaxAmount" label="专票最大限额" width="120"></el-table-column>
            <!-- <el-table-column prop="zpMaxNum" label="专票最大张数" width="120"></el-table-column> -->
            <el-table-column prop="zpLeftNum" label="专票剩余票量" width="120"></el-table-column>
            <el-table-column prop="phone" label="电话" width="150"></el-table-column>
            <el-table-column prop="bankName" label="开户行" width="150"></el-table-column>
            <el-table-column prop="bankAccount" label="银行账号" width="200"></el-table-column>
            <el-table-column prop="supportSelfInvoice" label="是否支持企业自主开票" width="200"></el-table-column>
        </el-table>
        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
    </div>
</template>

<style>
    .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
        margin-left: 0;
    }
    .el-dialog__body{
        text-align: center;
    }
    .bill {
        display: inline-block;
        padding: 3px 8px;
        border-radius: 5px;
        color: #fff;
    }
    .common {
        background-color:  #6BDDA2;
    }
    .special {
        background-color: #63D1F2;
    }
</style>

<script>
    import {post, get} from '../../store/api';
    import {showNotify} from '../../plugin/utils-notify';
    import { baseUrl } from '../../config/address'
    export default {
        data() {
            return {
                pageSize: 10,
                pageInvoiceSize: 10,
                currentPage: parseInt(this.$route.query.page) || 1,
                currentInvoicePage: parseInt(this.$route.query.page) || 1,
                tableList: [],
                options: [],
                formSearch: {
                    companyName: '',
                },
                
            }
        },
        methods: {
            search() {
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            },
            requestAction(pageInfo) {
                let param = {
                    companyName: this.formSearch.companyName,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                };
                post('/api/invoice-web/service-company/qry', param).then(data => {
                    data.list.forEach(item => {
                        if (item) {
                            if (item.addr) {
                                item.addr = item.addr.replace(/\s+/g, '');
                            }
                        }
                    })
                    this.tableList = data;
                })
            },
            
        },
        activated() {
            this.requestAction({
                page: this.$route.query.page || 1,
                pageSize: this.pageSize,
            });
        },

    }
</script>