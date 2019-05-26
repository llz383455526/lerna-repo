<template> 
    <div class="r_main">
        <el-breadcrumb>
            <el-breadcrumb-item to="/main/clientManager/clientManager">
                客户管理
            </el-breadcrumb-item>
            <el-breadcrumb-item to="/main/clientManager/appManager">
                应用管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                应用详情
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <div class="title">基本信息</div>
            <el-button type="primary" style="margin-left: 120px;" size="small" @click="open">编辑</el-button>
            <div class="box">
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-col :span="8" class="right">商户名称</el-col>
                        <el-col :span="16">
                        {{data.appName}}
                        <el-switch
                            class="ml20"
                            v-if="data.isEnable == 1 && data.isOld == 1"
                            v-model="toggle"
                            :disabled="toggle"
                            active-text="参数同步"
                            inactive-text="旧App"
                            @change="messageSync">
                        </el-switch>
                        </el-col>
                    </el-col>
                    <el-col :span="10">
                        <el-col :span="8" class="right">Company ID</el-col>
                        <el-col :span="10">{{data.companyId}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-col :span="8" class="right">appId</el-col>
                        <el-col :span="10">{{data.appId}}</el-col>
                    </el-col>
                    <el-col :span="10">
                        <el-col :span="8" class="right">商户负责人</el-col>
                        <el-col :span="10">{{data.chargeByName}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-col :span="4" class="right">异步通知appid</el-col>
                        <el-col :span="10" style="word-wrap: break-word;">{{data.notifyAppId}}</el-col>
                    </el-col>
                    <el-col :span="10">
                        <el-col :span="8" class="right">负责人电话</el-col>
                        <el-col :span="10">{{data.chargeMobile}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-col :span="8" class="right">更新人</el-col>
                        <el-col :span="10">{{data.updateByName}}</el-col>
                    </el-col>
                    <el-col :span="10">
                        <el-col :span="8" class="right">更新时间</el-col>
                        <el-col :span="10">{{data.updateTime}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-col :span="4" class="right">服务商</el-col>
                        <el-col :span="10">
                            <div v-for="e in data.serviceCompanyList">
                                {{e.serviceCompanyName}}
                                <template v-if="e.subServiceList && e.subServiceList.length">
                                    <span style="color: red;">业务转包</span> {{`${e.subServiceList[0].subServiceCompanyName}`}}
                                </template>
                            </div>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-col :span="4" class="right">IP白名单（固定IP）</el-col>
                        <el-col :span="10" style="word-wrap: break-word;">{{data.allowIp}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-col :span="4" class="right">异步通知接口</el-col>
                        <el-col :span="10" style="word-wrap: break-word;">{{data.notifyUrl}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-col :span="4" class="right">RSA公钥</el-col>
                        <el-col :span="10" style="word-wrap: break-word;">{{data.appRsaPublickKey}}</el-col>
                    </el-col>
                </el-row>
            </div>
            <div class="title">系统配置</div> <el-button type="primary" style="margin-left: 120px;" size="small" @click="eshow = true">编辑</el-button>
            <div class="box">
                <!-- <el-row :gutter="20">
                    <el-col :span="20">
                        <el-col :span="6" class="right">先签约后发放</el-col>
                        <el-col :span="10" style="word-wrap: break-word;">{{data.signPayForm == '1' ? '是' : '否'}}</el-col>
                    </el-col>
                </el-row> -->
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-col :span="6" class="right">C端银行卡绑定（C端签约时）</el-col>
                        <el-col :span="10" style="word-wrap: break-word;">{{!data.clientAccountBind ? '关闭' : '开启'}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-col :span="6" class="right">安心记直充模式</el-col>
                        <el-col :span="10" style="word-wrap: break-word;">{{!data.apiRecharge ? '关闭' : '开启'}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-col :span="6" class="right">退汇回调地址</el-col>
                        <el-col :span="10" style="word-wrap: break-word;">{{data.reexchangeCallbackUrl}}</el-col>
                    </el-col>
                </el-row>
            </div>
            <payment-channel :data="data" :appId="appId" :query="query" ref="paymentChannel"></payment-channel>
            <div class="title" v-if="data.isFromOutApp">开发者信息</div>
            <div class="box" v-if="data.isFromOutApp">
                <el-row :gutter="20"><el-col :span="10"><el-col :span="8" class="rightHead">商户服务信息</el-col></el-col></el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-col :span="8" class="right">应用名称</el-col>
                        <el-col :span="10">{{appinfo.appName}}</el-col>
                    </el-col>
                    <el-col :span="10">
                        <el-col :span="8" class="right">AppID</el-col>
                        <el-col :span="10">{{appinfo.appId}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-col :span="8" class="right">开通服务</el-col>
                        <el-col :span="16">
                            <el-checkbox-group v-model="services">
                            <el-checkbox v-for="e in serviceList" :key="e.value" :label="e.value" @change="setService(e.value)">{{e.text}}</el-checkbox>
                            </el-checkbox-group>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-col :span="8" class="right">状态</el-col>
                        <el-col :span="10">{{appinfo.statusName}}<span class="danger" v-if="this.appinfo.status == 9">{{appinfo.memo}}</span></el-col>
                    </el-col>
                    <el-col :span="10">
                        <el-col :span="8" class="right">备注</el-col>
                        <el-col :span="10">{{appinfo.memo}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20"><el-col :span="10"><el-col :span="8" class="rightHead">沙箱环境配置</el-col></el-col></el-row>
                <el-row :gutter="20">
                    <el-col :span="10">
                        <el-col :span="8" class="right">回调地址</el-col>
                        <el-col :span="16">{{appinfo.sandboxConfig.notifyUrl}}</el-col>
                    </el-col>
                    <el-col :span="10">
                        <el-col :span="8" class="right">每日调用限制</el-col>
                        <el-col :span="10">{{appinfo.sandboxConfig.dailyLimit}}</el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="10" v-for="e in appinfo.sandboxConfig.services" :key="e.code">
                        <el-col :span="8" class="right">{{e.name}}</el-col>
                        <el-col :span="16">
                            <span class="usable" v-if="e.configured">可用</span>
                            <span class="disable" v-else>配置中</span>
                        </el-col>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="20">
                        <el-col :span="4" class="right">应用公钥</el-col>
                        <el-col :span="20" style="word-wrap: break-word;">{{appinfo.sandboxConfig.appPubKey}}</el-col>
                    </el-col>
                    <el-col :span="20">
                        <el-col :span="4" class="right">爱员工公钥</el-col>
                        <el-col :span="20" style="word-wrap: break-word;">{{appinfo.sandboxConfig.aygPubKey}}</el-col>
                    </el-col>
                </el-row>
                <div v-if="appinfo.prodConfig">
                    <el-row :gutter="20"><el-col :span="10"><el-col :span="8" class="rightHead">线上环境配置</el-col></el-col></el-row>
                    <el-row :gutter="20">
                        <el-col :span="10">
                            <el-col :span="8" class="right">回调地址</el-col>
                            <el-col :span="16">{{appinfo.prodConfig.notifyUrl}}</el-col>
                        </el-col>
                        <el-col :span="10">
                            <el-col :span="8" class="right">每日调用限制</el-col>
                            <el-col :span="10">{{appinfo.prodConfig.dailyLimit}}</el-col>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="10" v-for="e in appinfo.prodConfig.services" :key="e.code">
                            <el-col :span="8" class="right">{{e.name}}</el-col>
                            <el-col :span="16">
                                <span class="usable" v-if="e.configured">可用</span>
                                <span class="disable" v-else>配置中</span>
                            </el-col>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="20">
                            <el-col :span="4" class="right">应用公钥</el-col>
                            <el-col :span="20" style="word-wrap: break-word;">{{appinfo.prodConfig.appPubKey}}</el-col>
                        </el-col>
                        <el-col :span="20">
                            <el-col :span="4" class="right">爱员工公钥</el-col>
                            <el-col :span="20" style="word-wrap: break-word;">{{appinfo.prodConfig.aygPubKey}}</el-col>
                        </el-col>
                        <el-col :span="20">
                            <el-col :span="4" class="right">IP白名单</el-col>
                            <el-col :span="20" style="word-wrap: break-word;">{{appinfo.prodConfig.whiteIp}}</el-col>
                        </el-col>
                    </el-row>
                </div>
            </div>
        </div>
        <el-dialog title="appid配置信息" :before-close="listInit" :visible.sync="ashow" width="940px">
            <el-form label-width="200px" :model="aform" :rules="arule" ref="aform" size="small">
                <!-- <el-form-item label="商户负责人：" prop="chargeBy">
                    <el-select v-model="aform.chargeBy" class="form_input" @change="getName">
                    <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="商户负责人电话" prop="mobilePhone">
                    <el-input class="form_input" v-model="aform.mobilePhone" @change="getSelect"></el-input>
                </el-form-item>
                <el-form-item label="商户负责人姓名" prop="chargeByName">
                    <el-input class="form_input" v-model="aform.chargeByName" :disabled="aform.chargeBy ? true : false"></el-input>
                </el-form-item>
                <el-form-item label="商户负责人邮箱" prop="chargeEmail">
                    <el-input class="form_input" v-model="aform.chargeEmail" :disabled="aform.chargeBy ? true : false"></el-input>
                </el-form-item>
                <template v-if="data.isFromOutApp">
                    <el-form-item label="异步通知appId：" prop="notifyAppId">
                        <el-input class="f_input" v-model="aform.notifyAppId"></el-input>
                    </el-form-item>
                    <el-form-item label="Rsa公钥：" prop="appRsaPublickKey">
                        <el-input class="f_input" v-model="aform.appRsaPublickKey"></el-input>
                    </el-form-item>
                    <el-form-item label="IP白名单（固定IP）：" prop="allowIp">
                        <el-input class="f_input" v-model="aform.allowIp"></el-input>
                    </el-form-item>
                    <el-form-item label="工资单笔异步通知接口：" prop="notifyUrl">
                        <el-input class="f_input" v-model="aform.notifyUrl"></el-input>
                    </el-form-item>
                </template>
                <template v-else>
                    <el-form-item label="手机号码(发放短信验证)" prop="phone">
                        <el-input class="f_input" v-model="aform.phone"></el-input>
                    </el-form-item>
                </template>
                <el-form-item label="服务商">
                    <el-checkbox-group v-model="aform.serviceCompanyList" @change="change">
                        <el-checkbox v-for="(item, i) in company" :label="item.value" :key="item.value" class="block">
                            <span class="mr10">{{item.text}}</span>
                            <!-- <el-select v-model="assign[i].subcontractType" v-if="aform.serviceCompanyList.indexOf(item.value) > -1">
                                <el-option label="非转包" value="0"></el-option>
                                <el-option label="业务转包" value="1"></el-option>
                            </el-select> -->
                            <el-select v-model="assign[i].subServiceList[0].subServiceCompanyId" filterable v-if="aform.serviceCompanyList.indexOf(item.value) > -1 && assign[i].subcontractType - 0" @change="getassignCompanyName(i)">
                                <el-option v-for="e in filterAssignCompany(item.value)" :key="e.id" :label="e.name" :value="e.id"></el-option>
                            </el-select>
                        </el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
            </el-form>
            <span class="form_footer" slot="footer">
                <el-button @click="update" type="primary">保存</el-button>
                <el-button @click="close">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog title="编辑" :visible.sync="eshow" @open="initSetForm" width="50%">
            <el-form :model="setForm" label-width="220px" ref="setForm">
                <!-- <el-form-item label="先签约后发放" prop="signPayForm">
                    <el-radio v-model="setForm.signPayForm" label="1">是</el-radio>
                    <el-radio v-model="setForm.signPayForm" label="0">否</el-radio>
                </el-form-item> -->
                <el-form-item label="C端银行卡绑定（C端签约时）" prop="clientAccountBind">
                    <el-radio v-model="setForm.clientAccountBind" :label="1">开启</el-radio>
                    <el-radio v-model="setForm.clientAccountBind" :label="0">关闭</el-radio>
                </el-form-item>
                <el-form-item label="安心记直充模式" prop="apiRecharge">
                    <el-radio v-model="setForm.apiRecharge" :label="1">开启</el-radio>
                    <el-radio v-model="setForm.apiRecharge" :label="0">关闭</el-radio>
                </el-form-item>
                <el-form-item label="退汇回调地址" prop="reexchangeCallbackUrl">
                    <el-input v-model="setForm.reexchangeCallbackUrl"></el-input>
                </el-form-item>
            </el-form>
            <span class="form_footer" slot="footer">
                <el-button size="small" @click="changeStatus" type="primary">确定</el-button>
                <el-button size="small" @click="eshow = false">取消</el-button>
            </span>
        </el-dialog>
        <auth-code @result="getAuthCode" ref="authCode"></auth-code>
    </div>
</template>
<script>
import {
  get,
  post,
  formPost,
  postButNoErrorToast,
  postWithErrorCallback
} from "../../store/api";
import paymentChannel from '../../pageComponent/paymentChannel'
import authCode from '../../pageComponent/authCode'
export default {
    components: {
        paymentChannel,
        authCode
    },
    data() {
        return {
            appId: "",
            ashow: false,
            aform: {
            allowIp: "",
            chargeBy: '',
            chargeByName: '',
            appRsaPublickKey: "",
            notifyAppId: "",
            notifyUrl: "",
            phone: "",
            authCode: "",
            mobilePhone: '',
            chargeEmail: '',
            serviceCompanyList: {}
            },
            arule: {
            // chargeBy: [
            //     {
            //     required: true,
            //     message: "请选择商户负责人",
            //     trigger: "change"
            //   }
            // ],
            mobilePhone: [
                {
                required: true,
                message: "请填写手机号码",
                trigger: "change"
                },
                {pattern: /^(1\d{10})$/, message: '请正确输入手机号码', trigger: 'blur'}
            ],
            chargeByName: [
                {
                required: true,
                message: "请填写姓名",
                trigger: "change"
                }
            ],
            chargeEmail: [
                {
                required: true,
                message: "请填写邮箱",
                trigger: "change"
                }
            ],
            notifyAppId: [
                { required: true, message: "请输入应用ID", trigger: "blur" }
            ],
            appRsaPublickKey: [
                { required: true, message: "请输入Rsa公钥", trigger: "blur" }
            ],
            notifyUrl: [
                { required: true, message: "请输入异步通知接口", trigger: "blur" }
            ],
            phone: [
                { required: true, message: "手机号不能为空", trigger: "blur" },
                { pattern: /^(1[3-9]{1}\d{9})$/, message: '手机号格式不正确', trigger: 'blur' }
            ]
            },
            data: {},
            authCode: "",
            currEvent: "",
            isDefault: 1,
            charges: [],
            company: [],
            appinfo:{
                sandboxConfig:{
                    notifyUrl:""
                }
            },
            assign: [],
            assignCompany: [],
            subServiceCompanyName: "",
            services: [],
            serviceList: [],
            toggle: false,
            eshow: false,
            setForm: {
                appId: '',
                clientAccountBind: '',
                apiRecharge: '',
                reexchangeCallbackUrl: '',
                signPayForm: ''
            }
        };
    },
    mounted() {
        console.log(this.$refs)
        this.appId = sessionStorage.getItem("appId");
        this.aform.appId = this.appId;
        this.query();
        this.authCode = localStorage.getItem("authCode")
        get(`/api/sysmgr-web/user/get-platform-users?platformType=console-company`).then(data => {
            this.charges = data;
        });
        get("/api/openapi/developer/appinfo/" + this.appId).then(data => {
            this.appinfo = data;
            this.getServiceList()
        });
        get('/api/sysmgr-web/commom/company?companyIdentity=service').then(data => {
            this.assignCompany = data
        })
        get('/api/sysmgr-web/commom/service-config').then(data => {
            this.serviceList = data
            this.getServiceList()
        })
        this.arule.chargeByName = ''
        this.arule.chargeEmail = ''
    },
    methods: {
        getServiceList() {
            this.serviceList.length && this.appinfo.services && this.appinfo.services.forEach(e => {
                this.serviceList.forEach(ev => {
                    if(e == ev.text) {
                        this.services.push(ev.value)
                    }
                })
            })
        },
        query() {
            post("/api/sysmgr-web/company-app/detail", {
                appId: this.appId
            }).then(data => {
                this.data = data;
                !this.data.payUsers && (this.data.payUsers = []);
                for(let k in this.aform) {
                if(data[k]) {
                    this.aform[k] = data[k]
                }
                }
                this.listInit()
                this.aform.mobilePhone = data.chargeMobile
            });
        },
        listInit(next) {
            this.aform.serviceCompanyList = []
            this.data.serviceCompanyList.forEach(e => {
                this.aform.serviceCompanyList.push(e.serviceCompanyId.toString())
            })
            if(next) {
                next()
            }
            this.getService()
        },
        close() {
            this.ashow = false
            this.$refs.aform.clearValidate()
        },
        getService() {
            get(`/api/sysmgr-web/commom/contract-service-company-options?customCompanyId=${this.data.companyId}`).then(data => {
                this.company = data;
                this.company.forEach(e => {
                    var arr = this.data.serviceCompanyList.filter(ev =>{
                        return ev.serviceCompanyId == e.value
                    })
                    this.assign.push({
                        subcontractType: arr[0] && arr[0].subcontractType ? arr[0].subcontractType : '0',
                        subServiceList: [{
                            isDefault: 1,
                            subServiceCompanyId: arr[0] && arr[0].subServiceList ? arr[0].subServiceList[0].subServiceCompanyId : '',
                            subServiceCompanyName: arr[0] && arr[0].subServiceList ? arr[0].subServiceList[0].subServiceCompanyName : ''
                        }]
                    })
                })
            })
        },
        getSelect() {
            if(/^(1\d{10})$/.test(this.aform.mobilePhone)) {
                get('/api/sysmgr-web/user/get-user-by-mobile', {
                    mobile: this.aform.mobilePhone
                }, true).then(data => {
                    this.aform.chargeBy = data.id || ''
                    this.aform.chargeByName = data.name || ''
                    this.aform.chargeEmail = data.email || ''
                    if(this.aform.chargeBy) {
                        this.arule.chargeByName = ''
                        this.arule.chargeEmail = ''
                    }
                    else {
                        this.arule.chargeByName = [{ required: true, message: "请填写姓名", trigger: "change" }]
                        this.arule.chargeEmail = [{ required: true, message: "请填写邮箱", trigger: "change" }]
                    }
                    this.$nextTick(() => {
                        this.$refs.aform.clearValidate(['chargeByName', 'chargeEmail'])
                    })
                })
            }
        },
        getName() {
            this.charges.forEach(e => {
                if (e.id == this.aform.chargeBy) {
                this.aform.chargeByName = e.name;
                }
            });
        },
        filterAssignCompany(a) {
            return this.assignCompany.filter(e => {
                return a != e.id
            })
        },
        getassignCompanyName(a) {
            this.assignCompany.forEach(e => {
                if(e.id == this.assign[a].subServiceList[0].subServiceCompanyId) {
                    this.assign[a].subServiceList[0].subServiceCompanyName = e.name
                }
            })
        },
        change() {
            // console.log(this.aform.serviceCompanyList)
        },
        open() {
            this.ashow = true;
            Object.assign(this.aform, {
                allowIp: this.data.allowIp,
                appId: this.appId,
                appRsaPublickKey: this.data.appRsaPublickKey,
                notifyAppId: this.data.notifyAppId,
                notifyUrl: this.data.notifyUrl,
                phone: this.data.phone
            })
            this.$forceUpdate()
        },
        update() {
            this.$refs["aform"].validate(valid => {
                if (valid) {
                    if (this.authCode) {
                        this.aform.authCode = this.authCode;
                        var arr = [], form = {}
                        this.company.forEach((e, i) => {
                            if(this.aform.serviceCompanyList.indexOf(e.value.toString()) > -1) {
                                arr[arr.length] = {
                                    serviceCompanyId: e.value,
                                    serviceCompanyName: e.text
                                }
                                Object.assign(arr[arr.length - 1], this.assign[i])
                            }
                        })
                        for(var k in this.aform) {
                            form[k] = this.aform[k]
                        }
                        form.serviceCompanyList = arr
                        postWithErrorCallback("/api/sysmgr-web/company-app/update-app", form).then(data => {
                            this.ashow = false;
                            this.$message({
                                type: "success",
                                message: "操作成功"
                            });
                            this.query()
                            this.$refs.paymentChannel.getMsg()
                        }).catch(err => {
                            if (err.message == "无效的授权码！") {
                                this.$refs.authCode.getAccredit(this.update);
                            }
                        })
                    } else {
                        this.$refs.authCode.getAccredit(this.update);
                    }
                }
            });
        },
        setService(a) {
            post('/api/sysmgr-web/company-app/update-service-checked-status', {
                appId: this.data.appId,
                appName: this.data.appName,
                serviceCode: a,
                isChecked: this.services.indexOf(a) > -1 ? 1 : 0
            })
        },
        messageSync() {
            post('/api/sysmgr-web/company-app/disabled-old', {
                appId: this.data.appId
            }).then(data => {
                this.$message({
                    type: 'success',
                    message: '切换成功'
                })
            })
        },
        changeStatus() {
            post('/api/sysmgr-web/company-app/update-app-sys-config', this.setForm).then(data => {
                this.eshow = false
                this.query()
            })
        },
        initSetForm() {
            for(let k in this.setForm) {
                this.setForm[k] = this.data[k]
            }
        },
        getAuthCode(a) {
            this.authCode = a
        }
    }
};
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
  background-color: #fff;
}
.content {
  margin-left: 30px;
}
.form {
  margin-top: 20px;
}
.title {
  display: block;
  margin: 20px 0px;
  font-weight: bold;
}
.f_input {
  width: 400px;
}
.form_footer > button {
  margin: 0px 30px;
}
.center {
  text-align: center;
  font-size: 24px;
}
.box {
  font-size: 14px;
  padding: 20px;
  /* background-color: #fff; */
  color: #909399;
}
/* .box > div:nth-child(1) {
    margin-bottom: 20px;
} */
.right {
  font-weight: bold;
  text-align: right;
}
.rightHead{
    font-weight: bold;
    text-align: right;
    margin-bottom: 10px;
    font-size: 16px
}
.danger{
    color: #fff;
    text-align:center;
    border:1px solid #F56C6C;
    padding:1px 7px; 
    background:#F56C6C;
    border-radius:5px;
    -moz-border-radius:7px;
}
.usable{
    color: #fff;
    text-align:center;
    border:1px solid #67C23A;
    padding:1px 7px; 
    background:#67C23A;
    border-radius:5px;
    -moz-border-radius:7px;
}
.disable{
    color: #fff;
    text-align:center;
    border:1px solid #E6A23C;
    padding:1px 7px; 
    background:#E6A23C;
    border-radius:5px;
    -moz-border-radius:7px;
}
.el-col{
    margin-bottom: 5px;
}
.block {
    display: block;
    margin-bottom: 10px;
}
.mr10 {
    margin-right: 10px;
}
.ml20 {
  margin-left: 20px;
}
.text {
    font-size: 14px;
    margin-left: 32px;
    margin-top: 20px;
}
</style>