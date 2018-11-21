<template>
    <div>
        <h4 class="ml50">相关商户信息</h4>
        <el-form-item label="商户信息">
            <el-button size="normal" type="primary" @click="openAppDialog"
                       v-if="contractModel.editType != 'watch'">添加商户信息</el-button>
            <span class="btn-add" v-if="contractModel.contractForm.companyApps.length === 0">请添加商户信息</span>
            <el-table :data="contractModel.contractForm.companyApps">
                <el-table-column prop="appName" label="商户名称"></el-table-column>
                <el-table-column prop="chargeByName" label="商户负责人姓名"></el-table-column>
                <el-table-column prop="chargeByPhone" label="商户负责人手机"></el-table-column>
                <el-table-column prop="chargeByMail" label="商户负责人邮箱"></el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="editApp(scope.row, scope.$index)" type="text" size="medium" style="padding:0;">编辑</el-button>
                        <el-button @click="deleteApp(scope.$index)" type="text" size="medium" style="padding:0;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-form-item>
        <el-dialog title="添加商户信息" :visible.sync="dialogVisible" width="700px">
            <el-form :model="appForm" label-width="200px" ref="appForm" style="padding-right: 100px;">
                <el-form-item label="商户名称" size="small">
                    <el-input class="form_input" v-model="appForm.appName"></el-input>
                </el-form-item>
                <el-form-item label="商户负责人姓名" size="small">
                    <el-input class="form_input" v-model="appForm.chargeByName"></el-input>
                </el-form-item>
                <el-form-item label="商户负责人手机" size="small">
                    <el-input class="form_input" v-model="appForm.chargeByPhone"></el-input>
                </el-form-item>
                <el-form-item label="商户负责人邮箱" size="small">
                    <el-input class="form_input" v-model="appForm.chargeByMail"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="addApp">保存</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    export default {
        name: "relevantMerchantInfo",
        props: ['contractModel'],
        data () {
            return {
                dialogVisible: false,
                isAppEdit: false,
                appForm: {
                    appName: '',
                    chargeByName: '',
                    chargeByPhone: '',
                    chargeByMail: '',
                    isFromOutApp: '0'
                }
            }
        },
        methods: {
            openAppDialog() {
                this.appForm = {
                    appName: '',
                    chargeByName: '',
                    chargeByPhone: '',
                    chargeByMail: '',
                    isFromOutApp: '0'
                };
                this.dialogVisible = true;
            },
            addApp() {
                if (!this.isAppEdit) {
                    let appForm = _.cloneDeep(this.appForm);
                    appForm.companyId = '${companyId}';
                    appForm.appId = 'app${companyId}';
                    // appForm.serviceCompanyList = [{
                    //     serviceCompanyId: this.serviceCompany.companyId,
                    //     serviceCompanyName: this.serviceCompany.companyName,
                    // }];
                    this.contractModel.contractForm.companyApps.push(appForm);
                } else {
                    let i = parseInt(this.isAppEdit);
                    this.contractModel.contractForm.companyApps.splice(i, 1, this.appForm);
                    this.isAppEdit = false;
                }
                this.dialogVisible = false;
            },
            deleteApp(i) {
                this.contractModel.contractForm.companyApps.splice(i, 1);
            },
            editApp(form, i) {
                let appForm = _.cloneDeep(this.appForm);
                this.appForm = appForm;
                this.isAppEdit = i.toString();
                this.dialogVisible = true;
            }
        }
    }
</script>

<style scoped>
    .btn-add {
        font-weight: normal;
        color: red;
        margin-left: 30px;
    }
</style>