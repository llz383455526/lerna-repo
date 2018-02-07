<template>
    <div class="main-container2">
        <div class="top-menu">
            <div class="menu-container">
                <el-menu class="login-menu-wrap"
                         text-color="rgba(255, 255, 255, .7)"
                         active-text-color="#fff"
                         mode="horizontal"
                         @select="handleSelect"
                         background-color="#128888" style="float:right;margin-right: 50px;">
                    <el-submenu index="0">
                        <template slot="title">{{userInformation.name}}</template>
                        <!--<el-menu-item index="0-1" style="min-width: 100px">账户中心</el-menu-item>-->
                        <el-menu-item index="0-2" style="min-width: 100px">修改密码</el-menu-item>
                        <el-menu-item index="0-3" style="min-width: 100px">退出登录</el-menu-item>
                    </el-submenu>
                </el-menu>
                <div style="float:right;width: 28px;margin-top: 15px; margin-left: 35px;margin-right: 15px;">
                    <img src="../image/ic-person-avatar.png" style="width: 100%; border-radius: 50%"/>
                </div>
                <!--<div @click="messageClick" style="float: right;cursor: pointer">-->
                    <!--<el-badge :value="userTaskCount" :max="99" background-color="#3582e2"-->
                              <!--style="margin-left:20px; margin-top: 18px;">-->
                        <!--<i class="el-icon-bell" width="16" style="width: 16px;color: white"></i>-->
                    <!--</el-badge>-->
                <!--</div>-->
                <i @click="search" slot="prefix" class="el-input__icon el-icon-search"
                   style="float: right;color: white;margin-top: 20px;cursor: pointer;display: none"></i>
                <el-menu style="float: right" v-if="principalMenu&&principalMenu.length!=0"
                         :default-active="activeIndex"
                         text-color="rgba(255, 255, 255, .7)"
                         active-text-color="#fff"
                         mode="horizontal"
                         @select="handleSelect" background-color="#128888">
                    <div v-for="item in principalMenu" :key="item.orderSeq" style="display: inline-block">
                        <el-menu-item v-if="item.children.length==0" :index="buildMenuIndex(item.orderSeq)">{{item.title}}</el-menu-item>
                        <el-submenu :index="buildMenuIndex(item.orderSeq)" v-else>
                            <template slot="title">{{item.title}}</template>
                            <el-menu-item style="min-width: 140px" v-for="child in item.children" :key="child.orderSeq"
                                          :index="buildMenuIndex(item.orderSeq,child.orderSeq)">{{child.title}}

                            </el-menu-item>
                        </el-submenu>
                    </div>
                </el-menu>
            </div>
        </div>

        <div id="container">
            <div id="mainContainer">
                <router-view></router-view>
            </div>
        </div>
        <el-dialog title="请填写信息" :before-close="closeClientDialog" :visible.sync="dialogClientVisible" width="30%">
            <el-form :rules="clientFormRules" :model="clientForm" ref="clientForm">
                <div class="input-container">
                    <div class="label">原密码<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="oldPassword">
                            <el-input type="password" v-model="clientForm.oldPassword" placeholder="请输入原密码"></el-input>
                        </el-form-item>
                    </div>
                </div>

                <div class="input-container">
                    <div class="label">新密码<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="newPassword">
                            <el-input type="password" v-model="clientForm.newPassword" placeholder="请输入新密码"></el-input>
                        </el-form-item>
                    </div>
                </div>

                <div class="input-container">
                    <div class="label">确认新密码<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="confirmPwd">
                            <el-input type="password" v-model="clientForm.confirmPwd" placeholder="请输入新密码"></el-input>
                        </el-form-item>
                    </div>
                </div>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogClientVisible=false;resetForm('clientForm');">取 消</el-button>
                <el-button type="primary" @click="submitClientForm">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
    import {mapGetters} from 'vuex'
    import {showConfirm, showAlert} from '../plugin/utils-message'
    import {showNotify} from '../plugin/utils-notify'
    import {get, post, importPost} from '../store/api'

    export default {

        data() {
            let confirmPwd = (rule, value, callback) => {
                if (value == this.clientForm.newPassword) {
                    callback();
                } else {
                    callback(new Error('两次输入密码不一致'));
                }
            }
            return {
                activeIndex: '',
                clientForm: {
                    "oldPassword": "",
                    "newPassword": "",
                    "confirmPwd": "",
                },
                clientFormRules: {
                    oldPassword: [{
                        required: true,
                        message: '请填写旧密码',
                        trigger: 'blur'
                    }],
                    newPassword: [{
                        required: true,
                        message: '请填写新密码',
                        trigger: 'blur'
                    }],
                    confirmPwd: [{
                        required: true,
                        message: '请确认密码',
                        trigger: 'blur'
                    }, {
                        validator: confirmPwd
                    }],
                },
                dialogClientVisible: false,
            }
        },

        computed: {
            ...mapGetters({
                userInformation: 'userInformation',
                logoutRandomTime: 'logoutRandomTime',
                principalMenu: 'principalMenu',
                userTaskCount: 'userTaskCount',
            })
        },
        watch: {
            logoutRandomTime() {
                this.$router.replace('/login')
            },
            principalMenu() {
                this.checkActiveIndex();
            },

        },
        methods: {

            buildMenuIndex(index, subIndex) {
                return index + (subIndex ? ('-' + subIndex) : '');
            },

            search() {
//                alert('search');
            },

            messageClick() {
                this.activeIndex = '';
                this.$router.push('/main/backlog')
            },

            handleSelect(key, keyPath) {
                // console.log(keyPath)
                if (keyPath[0] == '0') {
                    this.activeIndex = '#';
                    if (key == '0-1') {
                        console.log('账户中心')
                    } else if (key == '0-2') {
                        console.log('修改密码')
                        this.dialogClientVisible = true
                    } else {
                        console.log('退出登录')
                        this.logout();
                    }
                } else {
                    for (let i = 0; i < this.principalMenu.length; ++i) {
                        if (keyPath[0] == this.principalMenu[i].orderSeq) {
                            if (keyPath.length === 1) {
                                this.$router.push(this.principalMenu[i]['action']);
                                console.log(this.principalMenu[i]['title'] + '---' + this.principalMenu[i]['action']);
                                break;
                            } else {
                                let children = this.principalMenu[i].children;
                                for (let j = 0; j < children.length; ++j) {
                                    if (key == this.buildMenuIndex(this.principalMenu[i].orderSeq, children[j].orderSeq)) {
                                        this.$router.push(children[j]['action']);
                                        // console.log(this.principalMenu[i]['title'] + '---' + children[j]['title']);
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            },

            checkActiveIndex() {
                let path = this.$route.path;
                for (let i = 0; i < this.principalMenu.length; ++i) {
                    if (path == this.principalMenu[i]['action']) {
                        this.activeIndex = this.principalMenu[i].orderSeq + '';
                        break;
                    } else {
                        let children = this.principalMenu[i].children;
                        for (let j = 0; j < children.length; ++j) {
                            if (path == children[j]['action']) {
                                this.activeIndex = this.buildMenuIndex(this.principalMenu[i].orderSeq, children[j].orderSeq);
                                return;
                            }
                        }
                    }
                }
            },

            logout() {
                this.$store.dispatch('logout');
            },
            resetForm(formName) {
                this.$refs[formName].resetFields()
                this[formName] = {}
            },
            submitClientForm() {
                this.$refs['clientForm'].validate(valid => {
                    if (valid) {
                        let url = '/auth/reset-password'
                        let option = this.clientForm
                        post(url, option).then(data => {
                            showNotify('success', '操作成功！')
                            this.resetForm('clientForm')
                            this.dialogClientVisible = false
                        })
                    }
                })
            },
            closeClientDialog(done) {
                this.resetForm('clientForm')
                done();
            },
        },
        created() {
            this.$store.dispatch('principal');
            // this.$store.dispatch('getDictData');

            // this.$store.dispatch('getUserTaskCount')
        }
    }
</script>

<style lang="scss" scoped>
    @import "../style/color";

    .top-menu {
        height: 60px;
        background-color: $basic-green;
        position: relative;
        .menu-container {
            position: absolute;
            right: 0;

            .login-menu-wrap {
                .el-menu {
                    width: 80px;
                    .el-menu-item {
                        width: 100%;
                        min-width: unset;
                    }
                }
                .el-submenu__title {
                    padding: 0 30px;
                }
            }

        }
    }

    #container {
        position: absolute;
        width: 100%;
        bottom: 0;
        top: 55px;
        overflow: auto;
        background-color: $bg-color;

        #mainContainer {
            width: 1366px;
            margin: 20px auto 0;
            /*background-color: $white;
            border-radius: 15px;*/
        }
    }

</style>

<style lang="scss">

    .el-submenu__title i {
        color: #fff;
    }

    .el-menu--horizontal .el-submenu > .el-menu {
        top: 60px !important;
    }

</style>











