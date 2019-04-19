<template>
    <div>
        <el-dialog title="获取验证码" :visible.sync="cshow" width="70%">
            <span class="tip">为了保障您的账号安全，请完成一下身份验证。</span>
            <el-form label-width="150px">
                <el-form-item label="手机号码：">
                    {{phone}}
                </el-form-item>
                <el-form-item >
                    <img :src="`/api/sysmgr-web/verify-codes/gen-captcha?req_id=${req_id}`">
                    <el-button type="text" style="margin-left: 30px;" @click="createId">刷新</el-button>
                </el-form-item>
                <el-form-item label="请输入图形中字符：">
                    <el-input v-model="chars" style="width: 300px;"></el-input>
                </el-form-item>
                <el-form-item label="短信验证码：">
                    <el-input v-model="phoneCode" style="width: 300px;"></el-input><el-button type="text" style="margin-left: 30px;" @click="getCode">获取验证码</el-button>
                </el-form-item>
            </el-form>
            <span class="form_footer" slot="footer">
                <el-button size="small" @click="submit" type="primary">提交</el-button>
                <el-button size="small" @click="cshow = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post, importPost, postButNoErrorToast, postWithErrorCallback } from "../store/api";
export default {
    data() {
        return {
            cshow: false,
            phone: '',
            req_id: '',
            chars: '',
            phoneCode: '',
        }
    },
    mounted() {
        this.getPhone();
        this.createId();
    },
    methods: {
        getPhone() {
            post("/api/sysmgr-web/company-app/get-two-step-phone").then(data => {
                this.phone = data;
            });
        },
        guid() {
            function S4() {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            }
            return `${S4()}${S4()}-${S4()}-${S4()}-${S4()}-${S4()}${S4()}${S4()}`;
        },
        createId() {
            this.req_id = this.guid();
        },
        getCode() {
            if (this.chars) {
                postWithErrorCallback("/api/sysmgr-web/company-app/send-phone-code", {
                    captcha: this.chars,
                    reqId: this.req_id
                }).then(data => {
                    this.$message({
                        type: "success",
                        message: "验证码已发送，请注意查收"
                    });
                }).catch(err => {
                    this.createId();
                });
            } else {
                this.$message({
                    type: "info",
                    message: "请正确输入图片中的字符"
                });
            }
        },
        getAccredit(a) {
            if (this.phone) {
                this.cshow = true;
                this.currEvent = a;
            } else {
                this.$message({
                    type: "error",
                    message: "未绑定手机号码，无法获取权限！"
                });
            }
        },
        submit() {
            if (this.phoneCode) {
                post("/api/sysmgr-web/company-app/get-auth-code-by-phone-code", {
                    phoneCode: this.phoneCode
                }).then(data => {
                    this.cshow = false;
                    this.authCode = data;
                    localStorage.setItem("authCode", data);
                    this.$emit('result', data)
                    if (this.currEvent && typeof this.currEvent == "function") {
                        this.currEvent();
                    }
                });
            } else {
                this.$message({
                    type: "info",
                    message: "请填写验证码后提交"
                });
            }
        },
    }
}
</script>
