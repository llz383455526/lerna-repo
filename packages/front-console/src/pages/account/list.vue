<template>
    <div class="company-build-container company-container">
        <div style="margin: 0 30px 30px;">发放流水记录</div>
        <el-form :inline="true" :model="formSearch" class="demo-form-inline" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="客户名称:" size="small">
                <el-select style="width: 150px" v-model="formSearch.stateEQ" placeholder="请选择">
                    <el-option label="所有" value="-1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="客户订单号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.nameLK" placeholder="客户订单号"></el-input>
            </el-form-item>
            <el-form-item label="渠道交易流水号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.createByNameLK" placeholder="渠道交易流水号">
                </el-input>
            </el-form-item>
            <el-form-item label="收款人姓名:" size="small">
                <el-input style="width: 150px" v-model="formSearch.stateEQ" placeholder="收款人姓名"></el-input>
            </el-form-item>
            <el-form-item label="收款账号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.nameLK" placeholder="收款账号">
                </el-input>
            </el-form-item>

            <el-form-item label="交易状态:" size="small">
                <el-select style="width: 150px" v-model="formSearch.createByNameLK" placeholder="请选择">
                    <el-option label="所有" value="-1"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="请求起止时间:" size="small">
                <el-date-picker
                        v-model="value9"
                        type="daterange"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        default-value="2010-10-01">
                </el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" size="small">查询

                </el-button>
                <el-button size="small">清除

                </el-button>
                <el-button size="small">导出xls

                </el-button>
            </el-form-item>

            <!--<el-form-item v-if="dictData.companyState" label="企业状态:" size="small">-->
                <!--<el-select style="width: 150px" v-model="formSearch.stateEQ" placeholder="请选择">-->
                    <!--<el-option v-for="item in dictData.companyState" :label="item.name" :value="item.code"-->
                               <!--:key="item.code"></el-option>-->
                    <!--<el-option label="所有" value="-1"></el-option>-->
                <!--</el-select>-->
            <!--</el-form-item>-->
            <el-form-item style="margin-top: -4px">
                <!--<el-button :disabled="!judgePermission('difactor:/company/companies')" @click="search" type="primary"-->
                           <!--size="small">查询-->

                <!--</el-button>-->
                <!--<el-button :disabled="!judgePermission('difactor:/company/companies')" @click="clear" size="small">清除-->

                <!--</el-button>-->
            </el-form-item>
            <!--<el-button v-if="judgePermission('difactor:/company/detail/add')" @click="buildCompany" type="primary"-->
                       <!--size="medium" style="float: right;margin-right: 35px">创建新企业-->


            <!--</el-button>-->
        </el-form>
        <el-table
                :data="companyBuildList.list"
                style="width: 100%;margin-top: 20px;">
            <el-table-column
                    align="left"
                    prop='code'
                    label='企业编号'
                    width=160>
            </el-table-column>
            <el-table-column
                    align="left"
                    prop='name'
                    label='企业名称'>
            </el-table-column>
            <el-table-column
                    align="left"
                    prop='createByName'
                    label='企业创建人'
                    width=140>
            </el-table-column>
            <el-table-column
                    align="left"
                    label='企业创建日期'
                    width=200>
                <template slot-scope="scope">
                    <span>{{scope.row.createAt | formatTime}}</span>
                </template>
            </el-table-column>
            <el-table-column
                    align="left"
                    prop='state'
                    label='企业创建状态'
                    width=140>
            </el-table-column>
            <el-table-column
                    label="操作"
                    width="160">
                <template slot-scope="scope">
                    <el-button :disabled="!judgePermission('difactor:/company/detail/contacts')"
                               @click="handleClick(true, scope.$index)" type="text" size="medium">查看

                    </el-button>
                    <el-button :disabled="!judgePermission('difactor:/company/delete')||scope.row['stateValue']=='20'"
                               @click="handleClick(false, scope.$index)"
                               type="text" size="medium">删除


                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination v-if="companyBuildList.total" :total="companyBuildList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
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
                companyBuildList: 'companyBuildList',
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
            clear() {
                this.formSearch.nameLK = '';
                this.formSearch.createByNameLK = '';
                this.formSearch.stateEQ = '';
            },
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
                };
                this.$store.dispatch('companyBuildList', param);
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
