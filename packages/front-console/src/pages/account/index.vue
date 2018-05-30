<template>
    <div class="company-build-container company-container">
        <el-tabs v-model="activeName">
            <el-tab-pane label="客户账户余额" name="new" v-loading="!aData">
                <div style="padding: 30px;">
                    <img src="../../image/money.png" style="width: 120px;height: 120px;float: left; margin-right: 50px;"/>
                    <p>账户总余额（元）： </p>
                    <h2>{{aData.totalAvailBalance | formatMoney}}</h2>
                </div>
                <el-table :data="aData.balanceAccountItems" style="width: 100%;margin-top: 20px;">
                    <el-table-column
                            align="left"
                            prop='companyName'
                            label='客户公司'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='appName'
                            label='接入应用'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            label='余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.availBalance | formatMoney}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
            <el-tab-pane label="渠道账户余额" name="old" v-loading="load">
                <div style="padding: 30px;">
                    <img src="../../image/money.png" style="width: 120px;height: 120px;float: left; margin-right: 50px;"/>
                    <p>账户总余额（元）： </p>
                    <h2>{{account.balanceAmount | formatMoney}}</h2>
                </div>
                <el-table :data="account.customerBalances" style="width: 100%;margin-top: 20px;">
                    <el-table-column
                            align="left"
                            prop='customerCompanyName'
                            label='客户名称'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='payUserName'
                            label='子账号名称'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop='payUserNo'
                            label='子账号'>
                    </el-table-column>
                    <el-table-column
                            align="left"
                            prop="balanceAmount"
                            label='余额（元）'>
                        <template slot-scope="scope">
                            <span>{{scope.row.balanceAmount | formatMoney}}</span>
                        </template>
                    </el-table-column>
                </el-table>
            </el-tab-pane>
        </el-tabs>
        <!--<ayg-pagination v-if="companyBuildList.total" :total="companyBuildList.total"-->
        <!--v-on:handleSizeChange="handleSizeChange"-->
        <!--v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>-->
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import {showConfirm} from '../../plugin/utils-message'
    import {showTopErrorToast} from '../../plugin/utils-toast'
    import {post} from '../../store/api'
    import { setTimeout } from 'timers';

    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                currentChangeBySetting: false,
                formSearch: {
                    nameLK: '',
                    createByNameLK: '',
                    stateEQ: '',
                },
                value9: '',
                activeName: 'old',
                aData: '',
                load: true
            }
        },
        computed: {
            ...mapGetters({
                account: 'account'
            })
        },
        watch: {
            companyDeleteResult() {
                this.requestAction({
                    page: this.currentPage,
                    pageSize: this.pageSize,
                });
            },
            account() {
                if(this.account.balanceAmount || this.account.balanceAmount === 0){
                    this.load = false
                }
            }
        },
        mounted() {
            post('/api/balance-web/balance-account/query-account').then(function(data){
                console.log(data)
                this.aData = data
            }.bind(this))
            setTimeout(function(){
                this.activeName = 'new'
            }.bind(this), 10)
        },
        methods: {
            // search() {
            //     this.currentChangeBySetting = true;
            //     this.currentPage = 1;
            //     this.requestAction({
            //         page: 1,
            //         pageSize: this.pageSize,
            //     });
            // },
            //
            // clear() {
            //     this.formSearch.nameLK = '';
            //     this.formSearch.createByNameLK = '';
            //     this.formSearch.stateEQ = '';
            // },
            //
            // buildCompany() {
            //     this.$router.push('contact');
            // },
            //
            // handleClick(isCheck, index) {
            //     if (isCheck) {
            //         if (this.companyBuildList.list[index].stateValue == 20) {
            //             this.$router.push('preview?id=' + this.companyBuildList.list[index].id);
            //         } else {
            //             this.$router.push('contact?id=' + this.companyBuildList.list[index].id);
            //         }
            //     } else {
            //         showConfirm({
            //             msg: '请确认是否进行该操作',
            //             confirmCallback: () => {
            //                 this.$store.dispatch('deleteCompany', {
            //                     companyId: this.companyBuildList.list[index].id
            //                 });
            //             }
            //         })
            //     }
            // },

            handleSizeChange(value) {                this.pageSize = value;                this.currentPage = 1;                this.requestAction({                    pageNo: this.currentPage,                    pageSize: value,                });            },
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
                    nameLK: this.formSearch.nameLK,
                    createByNameLK: this.formSearch.createByNameLK,
                    stateEQ: this.formSearch.stateEQ == '-1' ? '' : this.formSearch.stateEQ,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize,
                }
                // this.$store.dispatch('companyBuildList', param);
                this.$store.dispatch('account', param);
            }
        },

        created: function () {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
        },
    }
</script>

<style lang="scss" scoped>
    @import "../../style/color";

    .company-build-container {

    }
</style>
