<template>
    <div class="r_main">
        <el-breadcrumb>
            <el-breadcrumb-item to="/main/clientManager/clientManager">
                客户管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                查看
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <el-row :gutter="20" class="box">
                <el-col :span="12">
                    <div class="title">基本信息</div>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">企业名称</el-col>
                        <el-col :span="19">{{msg.fullName}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">Company ID</el-col>
                        <el-col :span="19">{{msg.id}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">企业简称</el-col>
                        <el-col :span="19">{{msg.name}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">创建人</el-col>
                        <el-col :span="19">{{msg.createByName}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">企业地址</el-col>
                        <el-col :span="19">{{msg.areaName}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">创建时间</el-col>
                        <el-col :span="19">{{msg.createTime}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">企业类型</el-col>
                        <el-col :span="19">{{msg.custom ? '客户' : msg.service ? '服务商' : '' }}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">更新人</el-col>
                        <el-col :span="19">{{msg.updateByName}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">更新时间</el-col>
                        <el-col :span="19">{{msg.updateTime}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">注册日期</el-col>
                        <el-col :span="19">{{msg.registerDate}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">负责人</el-col>
                        <el-col :span="19">{{msg.chargeByName}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">关联销售</el-col>
                        <el-col :span="19">
                            <span v-for="e in msg.salesList" :key="e.id" class="mr8">{{e.name}}</span>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">客户归属</el-col>
                        <el-col :span="19">{{msg.originalName}}</el-col>
                    </el-row>
                </el-col>
                <el-col :span="12" v-if="false && checkRight(permissions, 'console-dlv:/risk_level_degrade/refresh-company-risk-level')">
                    <div class="title" style="width: 200px">
                        风控信息
                        <el-button type="text" style="float: right; padding: 0" @click="fengKongDetail">查看细项</el-button>
                    </div>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">信用等级</el-col>
                        <el-col :span="19">
                            <w-start :count="companyRiskLevelInfo.riskLevel"></w-start>
                        </el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">操作人员</el-col>
                        <el-col :span="19">{{companyRiskLevelInfo.approveByName}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">等级更新时间</el-col>
                        <el-col :span="19">{{companyRiskLevelInfo.approveTime}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">风控特例</el-col>
                        <el-col :span="19">{{companyRiskLevelInfo.existRiskSpecial ? '有' : '无'}}</el-col>
                    </el-row>
                    <el-row :gutter="20">
                        <el-col :span="5" class="right">审核指标</el-col>
                        <el-col :span="19" v-if="companyRiskLevelInfo.companyRiskRateDTO">
                            <el-table
                                :data="companyRiskLevelInfo.shenHeArr"
                                border
                                style="width: 100%">
                                <el-table-column
                                    prop="title"
                                    label="评级细项">
                                </el-table-column>
                                <el-table-column
                                    prop="value"
                                    label="评级标准">
                                </el-table-column>
<!--                                <el-table-column label="操作" prop="lastUpdateAt">-->
<!--                                    <template slot-scope="scope">-->
<!--                                        <router-link-->
<!--                                            :to="`/main/contract/preview?contractId=${scope.row.id}&examine=1`">-->
<!--                                            <el-button type="text">查看合同</el-button>-->
<!--                                        </router-link>-->
<!--                                    </template>-->
<!--                                </el-table-column>-->
                            </el-table>
                        </el-col>
                    </el-row>
                </el-col>
            </el-row>
        </div>
        <div class="content">
            <div class="title">C端协议信息</div>
            <el-table class="table" v-if="msgData.data" :data="msgData.data">
                <el-table-column label="商户名称" prop="platformName"></el-table-column>
                <el-table-column label="合同模板名称" prop="name"></el-table-column>
                <el-table-column label="服务商名称" prop="serviceCompanyName">
                    <template slot-scope="scope">
                        <div v-for="(e, i) in scope.row.serviceCompanyName" :key="i">{{e}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="对接方式" prop="accessTypeDesc"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="prevFile(scope.row)">预览协议原件</el-button>
                        <router-link :to="`/main/eContract/index?templateName=${scope.row.name}`"
                                     v-if="userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'">
                            <el-button type="text">查看签约记录</el-button>
                        </router-link>
                    </template>
                </el-table-column>
            </el-table>
            <ayg-pagination
                v-if="msgData.total"
                :total="msgData.total"
                v-on:handleSizeChange="msgSizeChange"
                :currentSize="msgForm.pageSize"
                v-on:handleCurrentChange="msgQuery"
                :currentPage="msgForm.pageNo">
            </ayg-pagination>
        </div>
        <el-button class="back" type="primary" size="small" @click="$router.back()">返回</el-button>
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
    import WStart from '../../component/star'
    import {mapGetters} from 'vuex'
    import {createUser} from "../../service/userApi";
    import {setTimeout} from 'timers';

    var baseUrl = require("../../config/address.js").baseUrl;
    export default {
        computed: {
            ...mapGetters({
                userInformation: 'userInformation',
                permissions: 'permissions',
            }),
        },
        components: {
            WStart
        },
        data() {
            var reviewMemo = (rule, value, callback) => {
                if (!value && this.reviewForm.approve == false) {
                    callback(new Error('请填写备注信息'))
                } else {
                    callback()
                }
            };
            return {
                baseUrl: baseUrl,
                fullName: '',
                cform: {},
                show: false,
                queryForm: {
                    accountInfo: '',
                    pageSize: 5,
                    page: 1
                },
                result: {},
                crules: {
                    fullName: [
                        {
                            required: true,
                            message: "请输入名称",
                            trigger: "change"
                        }
                    ],
                    name: [
                        {
                            required: true,
                            message: "请输入简称",
                            trigger: "change"
                        }
                    ],
                    chargeBy: [
                        {
                            required: true,
                            message: "请选择负责人",
                            trigger: "change"
                        }
                    ],
                    areaName: [
                        {
                            required: true,
                            message: "请输入地址",
                            trigger: "change"
                        }
                    ],
                    registerDate: [
                        {
                            required: true,
                            message: "请输入注册日期",
                            trigger: "change"
                        }
                    ]
                },
                coshow: false,
                form: {
                    companyId: "",
                    endAt: "",
                    orderBy: "",
                    page: 1,
                    pageSize: 5
                },
                rules: {
                    appName: [
                        {
                            required: true,
                            message: "请输入应用名称",
                            trigger: "change"
                        }
                    ],
                    serviceCompanyId: [
                        {
                            required: true,
                            message: "请选择服务商",
                            trigger: "change"
                        }
                    ],
                    isFromOutApp: [
                        {
                            required: true,
                            message: "请选择应用类型",
                            trigger: "change"
                        }
                    ],
                    appId: [
                        {
                            required: true,
                            message: "请输入应用ID",
                            trigger: "change"
                        },
                        {
                            pattern: /^[^\u4e00-\u9fa5]+$/,
                            message: "不允许输入中文符号",
                            trigger: "change"
                        }
                    ]
                },
                tableData: [],
                total: 0,
                invoiceData: {},
                nshow: false,
                mform: {
                    invoiceIds: [],
                    orderNo: ""
                },
                msg: '',
                contractForm: {
                    customerId: '',
                    page: 1,
                    pageSize: 10
                },
                contractData: {},
                reviewDialog: false,
                reviewForm: {
                    approve: false,
                },
                reviewRules: {
                    memo: [
                        {
                            validator: reviewMemo,
                            trigger: "blur"
                        }
                    ]
                },
                msgForm: {
                    companyId: '',
                    pageSize: 10,
                    pageNo: 1
                },
                msgData: {},
                companyRiskLevelInfo: {}
            };
        },
        activated() {
            this.form.companyId = localStorage.getItem("appId");
            this.msgForm.companyId = localStorage.getItem("appId");
            this.fullName = localStorage.getItem('fullName')
            this.query();
            this.getDetail()
            this.msgQuery()

            this.getCompanyRiskLevelInfo()
        },
        methods: {
            /**
             * 风控查看细项
             */
            fengKongDetail() {
                this.$router.push(`/main/clientManager/dropDetail?id=${this.form.companyId}`)
            },
            /**
             * 查看企业风控等级信息
             */
            getCompanyRiskLevelInfo() {
                get('/api/console-dlv/risk-level/get-company-risk-level-info', {
                    companyId: this.form.companyId
                }).then((data) => {
                    this.companyRiskLevelInfo = data
                    if (this.companyRiskLevelInfo.companyRiskRateDTO) {
                        const cuserQuarterSignRate = this.companyRiskLevelInfo.companyRiskRateDTO.cuserQuarterSignRate
                        this.companyRiskLevelInfo.shenHeArr = [
                            {
                                title: 'C端用户签约率',
                                value: `${cuserQuarterSignRate ? cuserQuarterSignRate : 0}%`
                            },
                            {
                                title: 'C端绩效计算规则',
                                value: this.companyRiskLevelInfo.companyRiskRateDTO.cuserBalanceStandardState === 'fail' ? '不通过' : '审核通过'
                            },
                            {
                                title: 'C端绩效费计算明细表',
                                value: this.companyRiskLevelInfo.companyRiskRateDTO.cuserPerformanceState === 'fail' ? '不通过' : '审核通过'
                            }
                        ]
                    }
                }).catch(() => {
                })
            },
            addSale(a) {
                this.cform.salesList.push(a)
            },
            isHas(a) {
                var arr = []
                arr = this.cform.salesList.filter(e => {
                    return e.id == a.id
                })
                return !arr.length
            },
            deleteSale(a) {
                this.cform.salesList.splice(a, 1)
            },
            // -------------------------------------------------
            getDetail() {
                get('/api/sysmgr-web/company/get-company-detail', {
                    companyId: this.form.companyId
                }).then(data => {
                    this.msg = data
                    get(`/api/sysmgr-web/user/get-platform-users?platformType=console-company`).then(data => {
                        this.charges = data
                    })
                    this.contractForm.customerId = this.msg.id
                    this.contractQuery()
                })
            },
            change() {
                this.form.startAt = this.timeRange[0];
                this.form.endAt = this.timeRange[1];
            },
            query(a) {
                this.form.page = 1;
                if (a && !isNaN(a)) {
                    this.form.page = a;
                }
                post("/api/sysmgr-web/company-app/query-app", this.form).then(
                    function (data) {
                        this.tableData = data.list;
                        this.total = data.total;
                    }.bind(this)
                );
            },
            sizeChange(a) {
                this.form.pageSize = a
                this.query()
            },
            contractQuery(a) {
                if (isNaN(a)) {
                    a = 1
                }
                this.contractForm.page = a
                post('/api/contract-web/contract/query-contracts', this.contractForm).then(data => {
                    this.contractData = data
                })
            },
            contractSizeChange(a) {
                this.contractForm.pageSize = a
                this.contractQuery()
            },
            //   -----------------------------------
            msgQuery(a) {
                if (isNaN(a)) {
                    a = 1
                }
                this.msgForm.pageNo = a
                post('/api/econtract/template/client-signqry', this.msgForm).then(data => {
                    this.msgData = data
                })
            },
            msgSizeChange(a) {
                this.msgForm.pageSize = a
                this.msgQuery()
            },
            prevFile(a) {
                a.templateFileName.forEach(e => {
                    window.open(`/api/econtract/template/preview?templateId=${e.templateId}`)
                })
            }
        }
    };
</script>
<style scoped>
    .r_main {
        padding: 30px 10px 50px;
        background-color: #fff;
    }

    .form {
        margin-top: 20px;
    }

    .in_input {
        width: 200px;
    }

    .form_foot {
        display: block;
        padding: 0 0 0 820px;
    }

    .form_foot button {
        margin: 0 30px 0;
    }

    .t_head {
        margin: 30px 0;
        font-size: 20px;
        color: #666;
    }

    .table {
        margin-top: 20px;
    }

    .page {
        margin-top: 30px;
        display: flex;
        justify-content: space-around;
    }

    .half > span {
        display: inline-block;
        width: 40%;
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

    .tip {
        display: block;
        font-weight: bold;
        margin-bottom: 20px;
        text-indent: 30px;
    }

    .box {
        font-size: 14px;
        padding: 20px;
        /* background-color: #fff; */
        color: #909399;
    }

    .right {
        font-weight: bold;
        text-align: right;
    }

    .title {
        display: inline-block;
        margin-top: 30px;
        font-weight: bold;
    }

    .content {
        margin-left: 30px;
    }

    .mr8 {
        margin-right: 8px;
    }

    .back {
        float: right;
        margin-right: 40px;
        margin-bottom: 40px;
    }
</style>
