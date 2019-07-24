<template>
    <div>
        <el-button v-if="showAdd" style="margin-top: 30px" type="primary" @click="add">添加商户</el-button>
        <el-table class="table" :data="tableData" border>
            <el-table-column prop="appName" label="商户名称"></el-table-column>
            <el-table-column label="商户状态">
                <template slot-scope="scope">
                    {{scope.row.statusName}}&nbsp;&nbsp;
<!--                    <el-button type="text" @click="onLineAuditBtnClick(scope.row)"><i class="el-icon-setting"></i>上线审核</el-button>-->
                </template>
            </el-table-column>
            <el-table-column prop="updateByName" label="更新人"></el-table-column>
            <el-table-column prop="updateTime" label="更新时间"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text">配置</el-button>
                    <el-button v-show="scope.row.isEnable" @click="set(scope.row)" type="text">关闭</el-button>
                    <el-button v-show="!scope.row.isEnable" @click="set(scope.row)" type="text">开启</el-button>
                    <el-button v-show="scope.row.status == 'dealing'" @click="reviewDialog = true,reviewForm.appId = scope.row.appId" type="text">
                        上线审核
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="total"
            :total="total"
            v-on:handleSizeChange="sizeChange"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
        <el-dialog title="开通状态" :visible.sync="sshow" width="50%">
            <el-form label-width="120px" size="small">
                <div class="center">确定 {{curr.isEnable ? '关闭' : '开启'}} {{curr.appName}}？</div>
            </el-form>
            <span class="form_footer" slot="footer">
                <el-button @click="sureSet" type="primary" size="small">确定</el-button>
                <el-button @click="sshow = false" size="small">取消</el-button>
            </span>
        </el-dialog>
        <el-dialog title="上线审核" :visible.sync="reviewDialog" width="40%">
            <el-form :model="reviewForm" ref="reviewFormValidate" :rules="reviewRules" label-width="100px">
                <el-form-item label="是否上线：" prop="approve">
                    <el-switch v-model="reviewForm.approve"></el-switch>
                </el-form-item>
                <el-form-item label="备　　注：" prop="memo">
                    <el-input type="textarea" v-model="reviewForm.memo" style="width:80%"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="reviewDialog = false">取 消</el-button>
                <el-button type="primary" @click="review()">确 定</el-button>
            </div>
        </el-dialog>
        <auth-code @result="getAuthCode" ref="authCode"></auth-code>
        <el-dialog
            :visible.sync="onlineAuditIsShow"
            width="800px">
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="dialogVisible = false">取 消</el-button>
                <el-button size="small" type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
            <p v-if="popShangHu" slot="title" style="margin: 0px">
                {{ popShangHu.appName }}&nbsp;&nbsp;&nbsp;&nbsp;
                <el-switch v-model="popTitleSwitch"></el-switch>
                <span>是否上线</span>
            </p>
            <div class="online-audit-pop-content">
                <div class="section">
                    <p class="gongsi-name">
                        <span class="section-title">落地公司名称AA</span> &nbsp;&nbsp;
                        <el-switch></el-switch>
                    </p>
                    <el-row :gutter="20" class="content">
                        <el-col :span="6">
                            &nbsp;
                        </el-col>
                        <el-col :span="6" class="flex-center-column">
                            <span class="item-title">合同是否归档</span>
                            <span class="item-data">是</span>
                        </el-col>
                        <el-col :span="6" class="flex-center-column">
                            <span class="item-title">计算规则是否通过</span>
                            <span class="item-data">是</span>
                        </el-col>
                        <el-col :span="6" class="flex-center-column">
                            <span class="item-title">代理商名称</span>
                            <span class="item-data">代理商名称DD</span>
                        </el-col>
                    </el-row>
                </div>
                <div class="section">
                    <p class="gongsi-name">
                        <span>落地公司名称AA</span> &nbsp;&nbsp;
                        <el-switch></el-switch>
                    </p>
                    <el-row :gutter="20" class="content">
                        <el-col :span="6">
                            &nbsp;
                        </el-col>
                        <el-col :span="6" class="flex-center-column">
                            <span class="item-title">合同是否归档</span>
                            <span class="item-data">是</span>
                        </el-col>
                        <el-col :span="6" class="flex-center-column">
                            <span class="item-title">计算规则是否通过</span>
                            <span class="item-data">是</span>
                        </el-col>
                        <el-col :span="6" class="flex-center-column">
                            <span class="item-title">代理商名称</span>
                            <span class="item-data">代理商名称DD</span>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback } from "../store/api";
import authCode from './authCode'
export default {
    components: {
        authCode
    },
    props: {
        showAdd: {
            type: Boolean,
            default: false
        },
        companyId: {
            type: null,
            default: ''
        }
    },
    data() {
        let reviewMemo = (rule, value, callback) => {
            if (!value && this.reviewForm.approve == false) {
                callback(new Error("请填写备注信息"));
            } else {
                callback();
            }
        };
        return {
            form: {
                companyId: "",
                endAt: "",
                orderBy: "",
                page: 1,
                pageSize: 10
            },
            tableData: [],
            total: 0,
            sshow: false,
            curr: {},
            reviewDialog: false,
            reviewForm: {
                approve: false
            },
            reviewRules: {
                memo: [
                    { validator: reviewMemo, trigger: "blur" }
                ]
            },
            authCode: '',
            onlineAuditIsShow: false,
            popShangHu: null,
            popTitleSwitch: false
        }
    },
    watch:{
        companyId() {
            this.init()
        }
    },
    activated() {
        this.init()
    },
    mounted() {
        this.init()
    },
    methods:{
        onLineAuditBtnClick(item) {
            console.log(item)
            this.onlineAuditIsShow = true
            this.popShangHu = item
        },
        init() {
            this.authCode = localStorage.getItem('authCode')
            if(this.companyId) {
                this.form.companyId = this.companyId
                this.query();
            }
        },
        add(a) {
            this.$router.push(`/main/clientManager/addApp?companyId=${this.companyId}`);
        },
        edit(e) {
            sessionStorage.setItem("appId", e.appId);
            this.$router.push("/main/clientManager/appDetail");
        },
        set(e) {
            this.sshow = true;
            this.curr = e;
        },
        sureSet() {
            if (this.authCode) {
                postWithErrorCallback("/api/sysmgr-web/company-app/enable-switch", {
                    appId: this.curr.appId,
                    isEnable: this.curr.isEnable ? 0 : 1,
                    authCode: this.authCode
                }).then(data => {
                    this.sshow = false;
                    this.$message({
                        type: "success",
                        message: "操作成功"
                    });
                    this.query();
                }).catch(err => {
                    if (err.message == "无效的授权码！") {
                        this.$refs.authCode.getAccredit(this.sureSet);
                    }
                });
            } else {
                this.$refs.authCode.getAccredit(this.sureSet);
            }
        },
        query(a) {
            this.form.page = 1;
            if (a && !isNaN(a)) {
                this.form.page = a;
            }
            post("/api/sysmgr-web/company-app/query-app", this.form).then(
                function(data) {
                this.tableData = data.list;
                this.total = data.total;
                }.bind(this)
            );
        },
        sizeChange(a) {
            this.form.pageSize = a;
            this.query();
        },
        review() {
            this.$refs.reviewFormValidate.validate(valid => {
                if (valid) {
                    post("/api/sysmgr-web/company-app/online-approve", this.reviewForm).then(data => {
                        if (data == "OK") {
                            this.$message({
                                type: "success",
                                message: "审核成功"
                            });
                            this.reviewDialog = false;
                            this.query();
                        } else {
                            this.$message({
                                type: "error",
                                message: data
                            });
                        }
                    });
                }
            });
        },
        getAuthCode(a) {
            this.authCode = a
        }
    }
}
</script>
<style scoped>
.table {
  margin-top: 20px;
}
    .flex-center-column {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .section-title {
        background-color: rgba(242, 242, 242, 1);
        color: rgba(16, 16, 16, 1);
        font-size: 18px;
        text-align: center;
        padding: 2px 15px;
    }
    .item-title {
        color: rgba(16, 16, 16, 1);
        font-weight: bold;
        font-size: 16px;
    }
    .item-data {
        margin-top: 20px;
        color: #999;
        font-size: 16px;
    }
    .section {
        padding-top: 20px;
    }
    .section:nth-child(1) {
        padding-top: 0px;
    }
</style>
