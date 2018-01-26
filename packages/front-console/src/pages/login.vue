<template>
    <div id="container">
        <div class="login-container">
            <div class="left">

            </div>
            <div class="right">
                <el-form :model="loginForm" :rules="rules" ref="loginForm" action='' onsubmit="return false;"
                         class="demo-ruleForm">
                    <div class="login-tips">登&nbsp;&nbsp;录</div>
                    <el-form-item prop="username">
                        <el-input type="text" v-model="loginForm.username" placeholder="帐号/注册手机/注册邮箱"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"
                                  auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <button width="100%" type="submit" @click="login">登录</button>
                    </el-form-item>
                </el-form>
            </div>

        </div>
        <div class="footer">
            如有任何问题，请拨打咨询热线：020-61652668
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {showTopToast} from '../plugin/utils-toast'
    import {formSubmitChecker} from '../plugin/utils-input-checker'

    export default {
        data() {
            return {
                loginForm: {
                    username: '',
                    password: ''
                },
                rules: {
                    username: [{
                        required: true,
                        message: '请输入帐号/注册手机/注册邮箱',
                        trigger: 'blur'
                    }],
                    password: [{
                        required: true,
                        message: '请输入密码',
                        trigger: 'change'
                    }],
                }
            }
        },
        computed: {
            ...mapGetters({
                userInformation: 'userInformation',
            })
        },
        watch: {

        },
        methods: {
            login() {

            },

        }
    }
</script>

<style lang="scss" scoped>
    @import '../style/color';

    #container {
        position: absolute;
        width: 100%;
        bottom: 0;
        top: 0;
        left: 0;
        right: 0;
        overflow: auto;
        background-image: url(../image/login-out-bg.png);
        background-size: cover;
    }

    .login-container {
        width: 840px;
        height: 542px;
        position: absolute;
        top: 50%;
        margin-top: -250px;
        left: 50%;
        margin-left: -420px;
        background: url(../image/login-background.png) no-repeat;

        .left {
            float: left;
            width: 360px;
            height: 542px;

        }
        .right {
            float: left;
            width: 460px;
            height: 542px;
            padding-right: 20px;
            .el-form {
                text-align: center;
                width: 250px;
                margin: 158px auto;

                .login-tips {
                    font-size: 22px;
                    color: $dark-grey;
                    margin-bottom: 30px;
                }

                .el-input__inner {
                    border-radius: 2px !important;
                }

                button {
                    line-height: 40px;
                    height: 40px;
                    color: $white;
                    font-size: 14px;
                    border-radius: 2px;
                    width: 100%;
                    background-color: $basic-green;
                }
            }
        }
    }

    .el-form-item.is-success .el-input__inner,
    .el-form-item.is-success .el-input__inner:focus {
        border-color: $blue !important;
    }

    .footer {
        text-align: center;
        position: absolute;
        bottom: 20px;
        font-size: 12px;
        color: $grey;
        width: 100%;
    }

</style>













