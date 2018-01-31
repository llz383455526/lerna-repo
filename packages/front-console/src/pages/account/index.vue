<template>
    <div class="company-build-container company-container">
        <div style="margin: 0 30px 30px;">账户管理</div>
        <div style="padding: 30px;">
            <img src="../../image/money.png" style="width: 120px;height: 120px;float: left; margin-right: 50px;"/>
            <p>账户总余额（元）： </p>
            <h2>{{account.balanceAmount}}</h2>
        </div>
        <el-table :data="account.customerBalances" style="width: 100%;margin-top: 20px;">
            <el-table-column
                    align="left"
                    prop='customerCompanyName'
                    label='客户名称'
                    width='160'>
            </el-table-column>
            <el-table-column
                    align="left"
                    prop='payUserName'
                    label='子账号名称'>
            </el-table-column>
            <el-table-column
                    align="left"
                    prop='payUserNo'
                    label='子账号'
                    width=140>
            </el-table-column>
            <el-table-column
                    align="left"
                    prop="balanceAmount"
                    label='余额（元）'
                    width='200'>
            </el-table-column>
        </el-table>
        <!--<ayg-pagination v-if="companyBuildList.total" :total="companyBuildList.total"-->
        <!--v-on:handleSizeChange="handleSizeChange"-->
        <!--v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>-->
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import {showConfirm} from '../../plugin/utils-message'
    import {showTopErrorToast} from '../../plugin/utils-toast'

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
                value9: ''
            }
        },
        computed: {
            ...mapGetters({
                account: 'account',
                // companyDeleteResult: 'companyDeleteResult',
                // dictData: 'dictData',
            })
        },
        watch: {
            companyDeleteResult() {
                this.requestAction({
                    page: this.currentPage,
                    pageSize: this.pageSize,
                });
            },

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

            handleSizeChange(value) {
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
