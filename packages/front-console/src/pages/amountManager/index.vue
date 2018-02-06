<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0px 30px 30px;">
            充值信用额度管理
            <el-button style="float:right;" @click="creatNew">添加信用额度</el-button>
        </div>
        <el-table :data="amountTable.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="appName" label="客户名称"></el-table-column>
        </el-table>
        <ayg-pagination
                v-if="amountTable.total"
                :total="amountTable.total"
                :currentPage="currentPage"
                v-on:handleSizeChange="handleSizeChange"
                v-on:handleCurrentChange="handleCurrentChange"></ayg-pagination>
        <el-dialog title="新增信用授权额度" :visible.sync="addFormVisible" width="30%">
            <el-form>
                <div class="input-container">
                    <div class="label">企业名字：</div>
                    <div class="input">
                        <el-select placeholder="请选择" v-model="formEdit.name">
                            <el-option label="今日头条" value=""></el-option>
                        </el-select>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">信用金额(万元)：</div>
                    <div class="input">
                        <el-form-item>
                            <el-input type="text" v-model="formEdit.money"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'

    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                addFormVisible: false,
                formEdit: {
                    name: '',
                    money: ''
                }
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
            creatNew: function () {
                this.addFormVisible = true
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