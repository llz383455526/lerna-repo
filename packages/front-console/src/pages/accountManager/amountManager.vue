<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0px 30px 30px;">充值信用额度管理<el-button style="float:right;" @click="creatNew">添加信用额度</el-button></div>

        <el-table :data="amountTable.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="companyName" label="企业名称"></el-table-column>
            <el-table-column prop="amount" label="信用额度（元）">
                <template slot-scope="scope">
                    <span>{{scope.row.amount | formatMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updateAt" label="更新时间记录">
                <template slot-scope="scope">
                    <span>{{scope.row.updateAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="companyName" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" @click="creatNew(scope.row)">修改信用额度</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="updateByName" label="操作人"></el-table-column>
        </el-table>

        <ayg-pagination v-if="amountTable.total" :total="amountTable.total" :currentPage="currentPage"
                v-on:handleSizeChange="handleSizeChange"
                v-on:handleCurrentChange="handleCurrentChange"></ayg-pagination>

        <el-dialog :title="formEditTitle" :visible.sync="formEditVisible" width="30%">
            <el-form :model="formEdit" ref="formEdit">
                <div class="input-container">
                    <div class="label">企业名字：</div>
                    <div class="input">
                        <el-select placeholder="请选择" v-model="formEdit.companyId">
                            <el-option v-for="(item, index) in appNameList" :label="item.companyName" :value="item.companyId" :key="index"></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">信用金额(元)：</div>
                    <div class="input">
                        <el-form-item>
                            <el-input type="text" v-model="formEdit.amount" :maxlength="13"></el-input>
                        </el-form-item>
                    </div>
                </div>
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
    import {showNotify} from "../../plugin/utils-notify"

    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                formEditVisible: false,
                formEdit: {
                    companyId: '',
                    amount: ''
                },
                formEditTitle: '新增信用授权额度',
                appNameList: []
            }
        },
        computed: {
            ...mapGetters({
                amountTable: 'amountTable'
            })
        },
        methods: {
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
                this.requestAction({
                    page: value,
                    pageSize: this.pageSize,
                });
            },
            requestAction: function (pageInfo) {
                let param = {
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize
                }
                this.$store.dispatch('getAmountTable', param);
            },
            creatNew: function (obj) {
                if (obj.companyName) {
                    this.formEdit.companyId = obj.companyId;
                    this.formEdit.amount = obj.amount;
                    this.formEditTitle = '修改信用授权额度';
                } else {
                    this.formEditTitle = '新增信用授权额度';
                }
                this.formEditVisible = true;
                let url = '/company-credit/query-all-companies';
                get(url).then(data => {
                    this.appNameList = data
                });
            },
            resetForm: function (formName) {
                this.$refs[formName].resetFields();
                this[formName] = {};
            },
            submitFormEdit: function () {
                this.$refs['formEdit'].validate(valid => {
                    if (valid) {
                        let url = '/api/console-dlv/company-credit/add-update';
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