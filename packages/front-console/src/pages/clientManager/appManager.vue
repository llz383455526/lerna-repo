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
            @click="editCompany">
            编辑
        </el-button>
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
            <el-col :span="10">
                <el-col :span="5" class="right">关联销售</el-col>
                <el-col :span="10">
                <span v-for="e in msg.salesList" :key="e.id" class="mr8">{{e.name}}</span>
                </el-col>
            </el-col>
            </el-row>
            <el-row :gutter="20">
            <el-col :span="10">
                <el-col :span="5" class="right">注册日期</el-col>
                <el-col :span="10">{{msg.registerDate}}</el-col>
            </el-col>
            <el-col :span="10">
                <el-col :span="5" class="right">客户类型</el-col>
                <el-col :span="10">{{msg.originalTypeName}}</el-col>
            </el-col>
            </el-row>
            <el-row :gutter="20">
            <el-col :span="10">
                <el-col :span="5" class="right">负责人</el-col>
                <el-col :span="10">{{msg.chargeByName}}</el-col>
            </el-col>
            <el-col :span="10">
                <el-col :span="5" class="right">客户归属</el-col>
                <el-col :span="10">{{msg.originalName}}</el-col>
            </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-col :span="5" class="right">关联交付</el-col>
                    <el-col :span="10">{{msg.deliverName}}</el-col>
                </el-col>
            </el-row>
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-col :span="5" class="right">代理商名称</el-col>
                    <el-col :span="10">{{msg.agentCompanyName}}</el-col>
                </el-col>
            </el-row>
        </div>
        <app-list :showAdd="true" :companyId="companyId"></app-list>
    </div>
    <div class="content">
        <sign-list ref="signList"></sign-list>
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
                <el-input class="f_input" v-model="cform.chargeByName" :disabled="cform.chargeBy ? true : false"></el-input>
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
                    value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="关联交付" prop="deliverId">
                <el-select class="f_input" v-model="cform.deliverId" filterable @change="getDeliverName">
                    <el-option v-for="e in deliverList" :key="e.id" :value="e.id" :label="e.name"></el-option>
                </el-select>
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
                <el-select v-model="cform.agentCompanyId" style="width:400px;" filterable @change="companyChange" disabled>
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
                    @change="getOriginalName">
                    {{e.text}}
                </el-radio>
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
                :currentPage="queryForm.page">
            </el-pagination>
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
                        :label="item.companyName">
                    </el-option>
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
    <auth-code @result="getAuthCode" ref="authCode"></auth-code>
  </div>
</template>
<script>
import { get, post, formPost, postButNoErrorToast, postWithErrorCallback } from "../../store/api";
import {mapGetters} from 'vuex'
import { createUser } from "../../service/userApi";
import { setTimeout } from "timers";
import { sysmgr } from "src/api";
import authCode from '../../pageComponent/authCode'
import signList from '../../pageComponent/signList'
import appList from '../../pageComponent/appList'
export default {
    computed: {
      ...mapGetters({
          agentList: 'agentList',
        })
    },
    components: {
        authCode,
        signList,
        appList
    },
    data() {
    return {
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
        deliverId: '',
        deliverName: '',
        agentCompanyId: ''
      },
      show: false,
      queryForm: {
        accountInfo: "",
        platFormType: 'console-admin',
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
        deliverId: [
          {
            required: true,
            message: "请选择关联交付",
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
      invoiceData: {},
      nshow: false,
      mform: {
        invoiceIds: [],
        orderNo: ""
      },
      eshow: false,
      authCode: "",
      msg: "",
      msgForm: {
        companyId: "",
        pageSize: 10,
        pageNo: 1
      },
      msgData: {},
      originals: [],
      originalTypeList: [],
      companyId: '',
      deliverList: []
    };
  },
  created() {
    this.$store.dispatch('getAgentList')
  },
  activated() {
    this.companyId = localStorage.getItem("appId");
    this.aform.companyId = localStorage.getItem("appId");
    this.msgForm.companyId = localStorage.getItem("appId");
    this.fullName = localStorage.getItem("fullName");
    get("/api/console-dlv/option/get-option-service-companies").then(data => {
      this.company = data;
    });
    this.getDetail();
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
    get(sysmgr.getGroupUsers, { relationKey: 'DeliverUserRelation' }).then(data => {
        this.deliverList = data
    })
  },
  methods: {
    getDeliverName() {
        this.cform.deliverName = this.deliverList.filter(e => e.id == this.cform.deliverId)[0].name
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
      post("/api/sysmgr-web/commom/user-list", this.queryForm).then(data => {
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
        companyId: this.companyId
      }).then(data => {
        this.msg = data;
        get(
          `/api/sysmgr-web/user/get-platform-users?platformType=console-company`
        ).then(data => {
          this.charges = data;
        });
        this.$refs.signList.transmit(this.msg.id)
      });
    },
    change() {
      this.form.startAt = this.timeRange[0];
      this.form.endAt = this.timeRange[1];
    },
    editCompany() {
      this.coshow = true;
      for(let k in this.cform) {
          if(k in this.msg) {
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
    sure(e) {
      if (this.authCode) {
        this.aform.authCode = this.authCode;
        postWithErrorCallback("/api/sysmgr-web/company-app/add-app", this.aform).then(data => {
            this.eshow = false;
            this.$message({
              type: "success",
              message: "添加成功！"
            });
            this.query();
          }).catch(err => {
            if (err.message == "无效的授权码！") {
                this.$refs.authCode.getAccredit(this.sure);
            }
          });
      } else {
        this.$refs.authCode.getAccredit(this.sure);
      }
    },
    isOut() {
      if (this.aform.isFromOutApp == 0) {
        this.aform.appId = localStorage.getItem("appId");
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
  margin: 20px 0px;
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