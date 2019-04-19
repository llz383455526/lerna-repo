<template>
  <div class="r_main">
    <el-breadcrumb>
      <el-breadcrumb-item to="/main/clientManager/clientManager">客户管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{isExamine ? '查看' : '应用管理'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="content">
      <div class="title">基本信息</div>
      <el-button
        v-if="!isExamine"
        type="primary"
        style="margin-left: 120px;"
        size="small"
        @click="editCompany"
      >编辑</el-button>
      <div class="box">
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">企业名称</el-col>
            <el-col :span="10">{{msg.fullName}}</el-col>
          </el-col>
          <el-col :span="10">
            <el-col :span="5" class="right">Company ID</el-col>
            <el-col :span="10">{{msg.id}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">企业简称</el-col>
            <el-col :span="10">{{msg.name}}</el-col>
          </el-col>
          <el-col :span="10">
            <el-col :span="5" class="right">创建人</el-col>
            <el-col :span="10">{{msg.createByName}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">企业地址</el-col>
            <el-col :span="10">{{msg.areaName}}</el-col>
          </el-col>
          <el-col :span="10">
            <el-col :span="5" class="right">创建时间</el-col>
            <el-col :span="10">{{msg.createTime}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">企业类型</el-col>
            <el-col :span="10">{{msg.custom ? '客户' : msg.service ? '服务商' : '' }}</el-col>
          </el-col>
          <el-col :span="10">
            <el-col :span="5" class="right">更新人</el-col>
            <el-col :span="10">{{msg.updateByName}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">更新时间</el-col>
            <el-col :span="10">{{msg.updateTime}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">注册日期</el-col>
            <el-col :span="10">{{msg.registerDate}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">负责人</el-col>
            <el-col :span="10">{{msg.chargeByName}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">关联销售</el-col>
            <el-col :span="10">
              <span v-for="e in msg.salesList" :key="e.id" class="mr8">{{e.name}}</span>
            </el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">客户类型</el-col>
            <el-col :span="10">{{msg.originalTypeName}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">客户归属</el-col>
            <el-col :span="10">{{msg.originalName}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">企业审核人</el-col>
            <el-col :span="10">{{msg.companyAuditor}}</el-col>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10">
            <el-col :span="5" class="right">代理商名称</el-col>
            <el-col :span="10">{{msg.agentCompanyName}}</el-col>
          </el-col>
        </el-row>
      </div>
      <el-button style="margin-top: 30px" type="primary" @click="add">添加商户</el-button>
      <el-table class="table" :data="tableData" border>
        <el-table-column prop="appName" label="商户名称"></el-table-column>
        <el-table-column label="商户状态">
          <template slot-scope="scope">{{scope.row.statusName}}</template>
        </el-table-column>
        <el-table-column prop="updateByName" label="更新人"></el-table-column>
        <el-table-column prop="updateTime" label="更新时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button @click="edit(scope.row)" type="text">配置</el-button>
            <el-button v-show="scope.row.isEnable" @click="set(scope.row)" type="text">关闭</el-button>
            <el-button v-show="!scope.row.isEnable" @click="set(scope.row)" type="text">开启</el-button>
            <el-button
              v-show="scope.row.status == 'dealing'"
              @click="reviewDialog = true,reviewForm.appId = scope.row.appId"
              type="text"
            >上线审核</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ayg-pagination
        v-if="total"
        :total="total"
        v-on:handleSizeChange="sizeChange"
        :currentSize="form.pageSize"
        v-on:handleCurrentChange="query"
        :currentPage="form.page"
      ></ayg-pagination>
    </div>
    <div class="content">
      <div class="title">签约信息</div>
      <el-table class="table" :data="contractData.list" border>
        <el-table-column label="合同编号" prop="contractNo"></el-table-column>
        <el-table-column label="签约服务商" prop="serviceCompanyName"></el-table-column>
        <el-table-column label="结算方式" prop="settleTypeName"></el-table-column>
        <el-table-column label="服务费比例" prop="serviceFeeName"></el-table-column>
        <el-table-column label="发票类型" prop="invoiceTypeName"></el-table-column>
        <el-table-column label="合同起止时间" prop="lastUpdateAt">
          <template
            slot-scope="scope"
          >{{scope.row.contractStartDate}} 至 {{scope.row.contractEndDate}}</template>
        </el-table-column>
        <el-table-column label="操作" prop="lastUpdateAt">
          <template slot-scope="scope">
            <router-link :to="`/main/contract/preview?contractId=${scope.row.id}&examine=1`">
              <el-button type="text">查看合同</el-button>
            </router-link>
          </template>
        </el-table-column>
      </el-table>
      <ayg-pagination
        v-if="contractData.total"
        :total="contractData.total"
        v-on:handleSizeChange="contractSizeChange"
        :currentSize="contractForm.pageSize"
        v-on:handleCurrentChange="contractQuery"
        :currentPage="contractForm.page"
      ></ayg-pagination>
    </div>
    <el-button class="back" type="primary" size="small" @click="$router.back()">返回</el-button>
    <el-dialog title="修改信息" :visible.sync="coshow" :before-close="clear" width="70%">
      <el-form label-width="140px" :rules="crules" :model="cform" ref="cform" size="small">
        <el-form-item label="企业名称" prop="fullName">
          <el-input v-model="cform.fullName" class="f_input"></el-input>
        </el-form-item>
        <el-form-item label="企业简称" prop="name">
          <el-input v-model="cform.name" class="f_input"></el-input>
        </el-form-item>
        <el-form-item label="企业负责人电话" prop="chargeMobile">
          <el-input class="f_input" v-model="cform.chargeMobile" @change="getSelect"></el-input>
        </el-form-item>
        <el-form-item label="企业负责人姓名" prop="chargeByName">
          <el-input
            class="f_input"
            v-model="cform.chargeByName"
            :disabled="cform.chargeBy ? true : false"
          ></el-input>
        </el-form-item>
        <el-form-item label="企业负责人邮箱" prop="email">
          <el-input class="f_input" v-model="cform.email" :disabled="cform.chargeBy ? true : false"></el-input>
        </el-form-item>
        <el-form-item label="企业地址" prop="areaName">
          <el-input v-model="cform.areaName" class="f_input"></el-input>
        </el-form-item>
        <el-form-item label="注册日期" prop="registerDate">
          <el-date-picker
            class="f_input"
            v-model="cform.registerDate"
            type="date"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item label="客户类型" prop="originalType">
          <el-radio
            v-for="e in originalTypeList"
            v-model="cform.originalType"
            :key="e.value"
            :label="e.value"
            @change="getOriginalTypeName">
            {{e.text}}
          </el-radio>
        </el-form-item>
        <template v-if="cform.originalType == 20">
          <el-form-item label="代理商名称" prop="agentCompanyId">
            <el-select v-model="cform.agentCompanyId" style="width:400px;" filterable @change="companyChange">
                <el-option v-for="e in agentList" :key="e.companyId" :label="e.companyName" :value="e.companyId"></el-option>
            </el-select>
          </el-form-item>
        </template>
        <el-form-item label="客户归属" prop="original">
          <el-radio
            v-for="e in originals"
            v-model="cform.original"
            :key="e.value"
            :label="e.value"
            @change="getOriginalName"
          >{{e.text}}</el-radio>
        </el-form-item>
        <el-form-item label="关联销售" prop="salesList">
          <el-button type="primary" @click="show = true">添加</el-button>
          <el-table :data="cform.salesList" class="form_input">
            <el-table-column label="姓名" prop="name"></el-table-column>
            <el-table-column label="手机号" prop="mobilephone"></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button type="text" @click="deleteSale(scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="企业审核人" prop="companyAuditor">
          <el-input v-model="cform.companyAuditor" class="f_input"></el-input>
        </el-form-item>
      </el-form>
      <span class="form_footer" slot="footer">
        <el-button @click="upDate" type="primary" size="small">保存</el-button>
        <el-button @click="close" size="small">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加" :visible.sync="show">
      <el-form :model="queryForm" size="small" :inline="true">
        <el-form-item label="姓名/电话：">
          <el-input v-model="queryForm.accountInfo" class="form_input200"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="queryForm.accountInfo = ''">清除</el-button>
          <el-button type="primary" @click="cquery">查询</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="result.list">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="电话" prop="mobilephone"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              v-if="isHas(scope.row)"
              @click="addSale(scope.row)"
            >添加</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="page" v-show="result.total / queryForm.pageSize > 1">
        <el-pagination
          background
          layout="prev, pager, next"
          :page-size="queryForm.pageSize"
          :total="result.total"
          @current-change="cquery"
          :currentPage="queryForm.page"
        ></el-pagination>
      </div>
      <span slot="footer">
        <el-button size="small" type="primary" @click="show = false">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加应用" :visible.sync="eshow" width="70%">
      <el-form label-width="120px" :rules="rules" :model="aform">
        <el-form-item label="商户名称" size="small">{{fullName}}</el-form-item>
        <el-form-item label="服务商名称" prop="serviceCompanyId" size="small">
          <el-select v-model="aform.serviceCompanyId" class="f_input" filterable>
            <el-option
              v-for="item in company"
              :key="item.companyId"
              :value="item.companyId"
              :label="item.companyName"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="应用类型" prop="isFromOutApp" size="small">
          <el-select v-model="aform.isFromOutApp" class="f_input" filterable @change="isOut">
            <el-option value="1" label="外部"></el-option>
            <el-option value="0" label="内部"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="appId" prop="appId" size="small">
          <el-input v-model="aform.appId" class="f_input"></el-input>
        </el-form-item>
        <el-form-item label="接入应用" prop="appName" size="small">
          <el-input v-model="aform.appName" class="f_input"></el-input>
        </el-form-item>
      </el-form>
      <span class="form_footer" slot="footer">
        <el-button @click="sure" type="primary" size="small">保存</el-button>
        <el-button @click="eshow = false" size="small">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="开通状态" :visible.sync="sshow" width="50%">
      <el-form label-width="120px" size="small">
        <div class="center">确定 {{curr.isEnable ? '关闭' : '开启'}} {{curr.appName}}？</div>
      </el-form>
      <span class="form_footer" slot="footer">
        <el-button @click="sureSet" type="primary" size="small">确定</el-button>
        <el-button @click="sshow = false" size="small">取消</el-button>
      </span>
    </el-dialog>
    <el-dialog title="获取验证码" :visible.sync="cshow" width="70%">
      <span class="tip">为了保障您的账号安全，请完成一下身份验证。</span>
      <el-form label-width="150px">
        <el-form-item label="手机号码：">{{phone}}</el-form-item>
        <el-form-item>
          <img :src="`${baseUrl}/api/sysmgr-web/verify-codes/gen-captcha?req_id=${req_id}`">
          <el-button type="text" style="margin-left: 30px;" @click="createId">刷新</el-button>
        </el-form-item>
        <el-form-item label="请输入图形中字符：">
          <el-input v-model="chars" style="width: 300px;"></el-input>
        </el-form-item>
        <el-form-item label="短信验证码：">
          <el-input v-model="phoneCode" style="width: 300px;"></el-input>
          <el-button type="text" style="margin-left: 30px;" @click="getCode">获取验证码</el-button>
        </el-form-item>
      </el-form>
      <span class="form_footer" slot="footer">
        <el-button @click="submit" type="primary">提交</el-button>
        <el-button @click="cshow = false" type="warning">关闭</el-button>
      </span>
    </el-dialog>
    <el-dialog title="上线审核" :visible.sync="reviewDialog" width="40%">
      <el-form
        :model="reviewForm"
        ref="reviewFormValidate"
        :rules="reviewRules"
        label-width="100px"
      >
        <el-form-item label="是否上线：" prop="approve">
          <el-switch v-model="reviewForm.approve"></el-switch>
        </el-form-item>
        <el-form-item label="备　　注：" prop="memo">
          <el-input type="textarea" v-model="reviewForm.memo" style="width:80%"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="reviewDialog = false">取 消</el-button>
        <el-button type="primary" @click="review('reviewFormValidate')">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { get, post, formPost, postButNoErrorToast, postWithErrorCallback } from "../../store/api";
// import {mapGetters} from 'vuex'
import { createUser } from "../../service/userApi";
import { setTimeout } from "timers";
import { mapGetters } from 'vuex'
var baseUrl = require("../../config/address.js").baseUrl;
export default {
  computed: {
    ...mapGetters({
        agentList: 'agentList',
      })
  },
  data() {
    var reviewMemo = (rule, value, callback) => {
      if (!value && this.reviewForm.approve == false) {
        callback(new Error("请填写备注信息"));
      } else {
        callback();
      }
    };
    return {
      baseUrl: baseUrl,
      fullName: "",
      cform: {
        id: '',
        fullName: '',
        name: '',
        taxLandingId: '',
        chargeBy: '',
        chargeByName: '',
        legalPerson: '',
        areaName: '',
        registerDate: '',
        salesList: [],
        email: '',
        chargeMobile: '',
        original: '',
        originalType: '',
        originalTypeName: '',
        companyAuditor: '',
        agentCompanyId: ''
      },
      show: false,
      queryForm: {
        accountInfo: "",
        pageSize: 10,
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
        chargeMobile: [
          {
            required: true,
            message: "请填写手机号码",
            trigger: "change"
          },
          {
            pattern: /^(1\d{10})$/,
            message: "请正确输入手机号码",
            trigger: "blur"
          }
        ],
        chargeByName: [
          {
            required: true,
            message: "请填写姓名",
            trigger: "change"
          }
        ],
        email: [
          {
            required: true,
            message: "请填写邮箱",
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
        ],
        originalType: [
          {
            required: true,
            message: "请选择客户类型",
            trigger: "change"
          }
        ],
        original: [
          {
            required: true,
            message: "请选择客户归属",
            trigger: "change"
          }
        ],
        agentCompanyId: [
            { required: true, message: '请选择代理商', trigger: 'change' }
        ],
      },
      coshow: false,
      form: {
        companyId: "",
        endAt: "",
        orderBy: "",
        page: 1,
        pageSize: 10
      },
      aform: {
        isFromOutApp: "",
        companyId: "",
        appId: "",
        appName: "",
        serviceCompanyId: "",
        authCode: ""
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
      company: [],
      tableData: [],
      total: 0,
      invoiceData: {},
      nshow: false,
      mform: {
        invoiceIds: [],
        orderNo: ""
      },
      eshow: false,
      sshow: false,
      cshow: false,
      curr: "",
      authCode: "",
      phone: "",
      req_id: "",
      chars: "",
      phoneCode: "",
      currEvent: "",
      msg: "",
      contractForm: {
        customerId: "",
        page: 1,
        pageSize: 10
      },
      contractData: {},
      reviewDialog: false,
      reviewForm: {
        approve: false
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
        companyId: "",
        pageSize: 10,
        pageNo: 1
      },
      msgData: {},
      originals: [],
      originalTypeList: []
    };
  },
  created() {
    this.$store.dispatch('getAgentList')
  },
  activated() {
    this.form.companyId = localStorage.getItem("appId");
    this.aform.companyId = localStorage.getItem("appId");
    this.msgForm.companyId = localStorage.getItem("appId");
    this.fullName = localStorage.getItem("fullName");
    this.query();
    get("/api/console-dlv/option/get-option-service-companies").then(data => {
      this.company = data;
    });
    this.getDetail();
    this.getPhone();
    this.createId();
    this.cquery();
    this.authCode = localStorage.getItem("authCode");
    this.crules.chargeByName = "";
    this.crules.email = "";
    get("/api/sysmgr-web/commom/option?enumType=CustomOriginal").then(data => {
      this.originals = data;
    });
    get('/api/sysmgr-web/commom/option?enumType=OriginalType').then(data => {
        this.originalTypeList = data
    })
  },
  methods: {
    companyChange(companyId) {
      if (!companyId || !this.agentList.length) return;
      let obj = this.agentList.find(element => {
          return element.companyId === companyId;
      });
      // this.chargeByName = obj.chargeByName;
    },
    getOriginalTypeName() {
      this.originalTypeList.forEach(e => {
        if(this.cform.originalType == e.value) {
          this.cform.originalTypeName = e.text
        }
      })
    },
    getOriginalName() {
      var arr = this.originals.filter(e => e.value == this.cform.original);
      arr.length && (this.cform.originalName = arr[0].text);
    },
    getSelect() {
      if (/^(1\d{10})$/.test(this.cform.chargeMobile)) {
        get(
          "/api/sysmgr-web/user/get-user-by-mobile",
          {
            mobile: this.cform.chargeMobile
          },
          true
        ).then(data => {
          this.cform.chargeBy = data.id || "";
          this.cform.chargeByName = data.name || "";
          this.cform.email = data.email || "";
          if (this.cform.chargeBy) {
            this.crules.chargeByName = "";
            this.crules.email = "";
          } else {
            this.crules.chargeByName = [
              { required: true, message: "请填写姓名", trigger: "change" }
            ];
            this.crules.email = [
              { required: true, message: "请填写邮箱", trigger: "change" }
            ];
          }
          this.$nextTick(() => {
            this.$refs.cform.clearValidate(["chargeByName", "email"]);
          });
        });
      }
    },
    clear(next) {
      console.log("clear");
      this.$refs.cform.clearValidate();
      typeof next == "function" && next();
    },
    close() {
      this.coshow = false;
      this.clear();
    },
    cquery(a) {
      if (isNaN(a)) {
        a = 1;
      }
      this.queryForm.page = a;
      post("/api/sysmgr-web/user/list", this.queryForm).then(data => {
        this.result = data;
      });
    },
    addSale(a) {
      this.cform.salesList.push(a);
    },
    isHas(a) {
      var arr = [];
      arr = this.cform.salesList.filter(e => {
        return e.id == a.id;
      });
      return !arr.length;
    },
    deleteSale(a) {
      this.cform.salesList.splice(a, 1);
    },
    // -------------------------------------------------
    getDetail() {
      get("/api/sysmgr-web/company/get-company-detail", {
        companyId: this.form.companyId
      }).then(data => {
        this.msg = data;
        get(
          `/api/sysmgr-web/user/get-platform-users?platformType=console-company`
        ).then(data => {
          this.charges = data;
        });
        this.contractForm.customerId = this.msg.id;
        this.contractQuery();
      });
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
    editCompany() {
      this.coshow = true;
      for(let k in this.cform) {
          if(this.msg[k]) {
              this.cform[k] = this.msg[k]
          }
      }
      this.cform.email = this.msg.chargeEmail
    },
    upDate() {
      this.$refs["cform"].validate(valid => {
        if (valid) {
          var cform = JSON.parse(JSON.stringify(this.cform));
          if (cform.salesList) {
            var salesList = [];
            cform.salesList.forEach(e => {
              salesList.push({
                id: e.id,
                name: e.name,
                mobilephone: e.mobilephone
              });
            });
            cform.salesList = salesList;
          }
          post("/api/sysmgr-web/company/edit-company", cform).then(data => {
            this.$message({
              type: "success",
              message: "更改成功！"
            });
            this.getDetail();
            this.coshow = false;
          });
        }
      });
    },
    getName() {
      this.charges.forEach(e => {
        if (e.id == this.cform.chargeBy) {
          this.cform.chargeByName = e.name;
        }
      });
    },
    add(a) {
      this.$router.push(`addApp?companyId=${this.msg.id}`);
    },
    sure(e) {
      if (this.authCode) {
        this.aform.authCode = this.authCode;
        postWithErrorCallback("/api/sysmgr-web/company-app/add-app", this.aform)
          .then(data => {
            this.eshow = false;
            this.$message({
              type: "success",
              message: "添加成功！"
            });
            this.query();
          })
          .catch(err => {
            if (err.message == "无效的授权码！") {
              this.getAccredit(this.sure);
            }
          });
      } else {
        this.getAccredit(this.sure);
      }
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
        })
          .then(data => {
            this.sshow = false;
            this.$message({
              type: "success",
              message: "操作成功"
            });
            this.query();
          })
          .catch(err => {
            if (err.message == "无效的授权码！") {
              this.getAccredit(this.sureSet);
            }
          });
      } else {
        this.getAccredit(this.sureSet);
      }
    },
    isOut() {
      if (this.aform.isFromOutApp == 0) {
        this.aform.appId = localStorage.getItem("appId");
      }
    },
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
        })
          .then(data => {
            this.$message({
              type: "success",
              message: "验证码已发送，请注意查收"
            });
          })
          .catch(err => {
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
    contractQuery(a) {
      if (isNaN(a)) {
        a = 1;
      }
      this.contractForm.page = a;
      post(
        "/api/contract-web/contract/query-contracts",
        this.contractForm
      ).then(data => {
        this.contractData = data;
      });
    },
    contractSizeChange(a) {
      this.contractForm.pageSize = a;
      this.contractQuery();
    },
    review(formName) {
      let self = this;
      this.$refs[formName].validate(valid => {
        if (valid) {
          let param = this.reviewForm;
          post("/api/sysmgr-web/company-app/online-approve", param).then(
            data => {
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
            }
          );
        }
      });
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