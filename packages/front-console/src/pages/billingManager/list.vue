<template>
    <div style="background-color:#fff;padding:15px;">
        <div style="margin-bottom:30px;">落地公司开票信息管理</div>
        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="" size="small" prop="companyName">
                <el-input v-model="formSearch.companyName"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">搜索</el-button>
            </el-form-item>
        </el-form>
        <el-button size="small" @click="routerPush('/main/billingManager/create')">添加落地企业信息</el-button>

        <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;">
        	<el-table-column label="操作" width="100">
                <template slot-scope="scope">
                    <el-button @click="handleEdit(scope.row.id)" type="text" size="medium" style="padding:0;">修改
                    </el-button>
                    <el-button @click="handleDelete(scope.row.id)" type="text" size="medium" style="padding:0;">删除
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
            <el-table-column prop="ppMaxNum" label="普票最大张数" width="120"></el-table-column>
            <el-table-column prop="zpMaxAmount" label="专票最大限额" width="120"></el-table-column>
            <el-table-column prop="zpMaxNum" label="专票最大张数" width="120"></el-table-column>
            <el-table-column prop="phone" label="电话" width="150"></el-table-column>
            <el-table-column prop="bankName" label="开户行" width="150"></el-table-column>
            <el-table-column prop="bankAccount" label="银行账号" width="200"></el-table-column>
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
</style>

<script>
    import {post, get} from '../../store/api';
    import {showNotify} from '../../plugin/utils-notify';

    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: parseInt(this.$route.query.page) || 1,
                tableList: [],
                options: [],
                formSearch: {
                    companyName: '',
                },
                dateValue: ''
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
                this.requestAction({page: this.currentPage, pageSize: value,});
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
            routerPush(val) {
                this.$router.push({path: val});
            },
            handleDelete(id) {
                this.$confirm('是否确定删除该条记录?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        id: id,
                    };
                    post('/api/invoice-web/service-company/del', param).then(data => {
                        showNotify('success', data);
                        this.requestAction({
                            page: this.$route.query.page || 1,
                            pageSize: this.pageSize,
                        });
                    })
                })
            },
            handleEdit(id) {
                this.$router.push({
                    path: '/main/billingManager/create',
                    query: {
                        companyId: id,
                        page: this.$route.query.page
                    }
                });
            }
        },
        activated() {
            this.requestAction({
                page: this.$route.query.page || 1,
                pageSize: this.pageSize,
            });
        },

    }
</script>