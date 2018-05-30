<template> 
  <div class="r_main">
      <el-breadcrumb>
          <el-breadcrumb-item to="/main/clientManager/clientManager">
            客户管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>
              应用管理
          </el-breadcrumb-item>
      </el-breadcrumb>
      <el-button style="margin-top: 30px" type="primary" @click="add">添加应用</el-button>
      <el-table class="table" :data="tableData" border="">
          <!-- <el-table-column prop="orderNo" label="申请编号"></el-table-column> -->
          <el-table-column prop="companyName" label="客户名称"></el-table-column>
          <el-table-column prop="appName" label="接入应用"></el-table-column>
          <el-table-column label="开通状态">
              <template slot-scope="scope">
                  {{scope.row.isEnable ? '已开通' : '未开通'}}
              </template>
          </el-table-column>
          <el-table-column label="应用类型">
              <template slot-scope="scope">
                  {{scope.row.isFromOutApp ? '外' : '内'}}部应用
                  <el-button type="text" @click="already(scope.row)">{{scope.row.openedNum}}</el-button>
              </template>
          </el-table-column>
          <el-table-column prop="serviceCompanyName" label="服务商名称"></el-table-column>
          <el-table-column prop="updateByName" label="更新人"></el-table-column>
          <!-- <template slot-scope="scope">
              {{scope.row.lastTime | formatTime}}
          </template> -->
          <el-table-column prop="updateTime" label="更新时间"></el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                  <el-button @click="edit(scope.row)" type="text">
                      编辑
                  </el-button>
                  <el-button v-show="scope.row.isEnable" @click="set(scope.row)" type="text">
                      设置关闭
                  </el-button>
                  <el-button v-show="!scope.row.isEnable" @click="set(scope.row)" type="text">
                      设置开启
                  </el-button>
              </template>
          </el-table-column>
      </el-table>
      <div class="page" v-show="total / form.pageSize > 1">
          <el-pagination
          background
          layout="prev, pager, next"
          :page-size="form.pageSize"
          :total="total"
          @current-change="query"
          :currentPage="form.page"
          >
        </el-pagination>
      </div>
      <el-dialog title="添加应用" :visible.sync="eshow" width="70%">
          <el-form label-width="120px" :rules="rules" :model="aform">
              <el-form-item label="客户名称">
                  {{fullName}}
              </el-form-item>
              <el-form-item label="服务商名称" prop="serviceCompanyId">
                  <el-select v-model="aform.serviceCompanyId" class="f_input" filterable>
                      <el-option v-for="item in company" :value="item.companyId" :label="item.companyName"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="应用类型" prop="isFromOutApp">
                  <el-select v-model="aform.isFromOutApp" class="f_input" filterable @change="isOut">
                      <el-option value="1" label="外部"></el-option>
                      <el-option value="0" label="内部"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="appId" prop="appId">
                  <el-input v-model="aform.appId" class="f_input"></el-input>
              </el-form-item>
              <el-form-item label="接入应用" prop="appName">
                  <el-input v-model="aform.appName" class="f_input"></el-input>
              </el-form-item>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="sure" type="primary">保存</el-button>
              <el-button @click="eshow = false" type="warning">关闭</el-button>
          </span>
      </el-dialog>
      <el-dialog title="开通状态" :visible.sync="sshow" width="50%">
          <el-form label-width="120px">
              <div class="center">确定 {{curr.isEnable ? '关闭' : '开启'}} {{curr.appName}}？</div>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="sureSet" type="primary">确定</el-button>
              <el-button @click="sshow = false" type="warning">取消</el-button>
          </span>
      </el-dialog>
      <el-dialog title="获取验证码" :visible.sync="cshow" width="70%">
          <span class="tip">为了保障您的账号安全，请完成一下身份验证。</span>
          <el-form label-width="150px">
              <el-form-item label="手机号码：">
                  {{phone}}
              </el-form-item>
              <el-form-item >
                  <img :src="`${baseUrl}/api/sysmgr-web/verify-codes/gen-captcha?req_id=${req_id}`">
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
              <el-button @click="submit" type="primary">提交</el-button>
              <el-button @click="cshow = false" type="warning">关闭</el-button>
          </span>
      </el-dialog>
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
// import {mapGetters} from 'vuex'
import { createUser } from "../../service/userApi";
import { setTimeout } from 'timers';
var baseUrl = require("../../config/address.js").baseUrl;
if(!baseUrl){
  baseUrl = ''
}
export default {
  data() {
    return {
      baseUrl: baseUrl,
      fullName: '',
      form: {
        companyId: "",
        endAt: "",
        orderBy: "",
        page: 1,
        pageSize: 5
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
      currEvent: ""
    };
  },
  activated() {
    console.log(localStorage.getItem("appId"));
    this.form.companyId = localStorage.getItem("appId");
    this.aform.companyId = localStorage.getItem("appId");
    this.fullName = localStorage.getItem('fullName')
    this.query();
    get("/api/console-dlv/option/get-option-service-companies").then(data => {
      this.company = data;
    });
    this.getPhone();
    this.createId();
    this.authCode = localStorage.getItem("authCode");
  },
  mounted() {},
  // computed: {
  //     ...mapGetters({
  //         userInformation: 'userInformation'
  //     })
  // },
  methods: {
    change() {
      console.log(this.timeRange);
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
          console.log(data);
          this.tableData = data.list;
          this.total = data.total;
        }.bind(this)
      );
    },
    clear() {
      this.form = {
        companyId: this.form.companyId,
        endAt: "",
        orderBy: "",
        page: 1,
        pageSize: 5
      };
      this.timeRange = [];
    },
    add(a) {
      console.log(a);
      this.eshow = true;
    },
    sure(e) {
      if (this.authCode) {
        this.aform.authCode = this.authCode;
        postWithErrorCallback("/api/sysmgr-web/company-app/add-app", this.aform)
          .then(data => {
            console.log(data);
            this.eshow = false;
            this.$message({
              type: "success",
              message: "添加成功！"
            });
            this.query()
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
      console.log(this.aform.isFromOutApp)
      if(this.aform.isFromOutApp == 0){
        this.aform.appId = localStorage.getItem("appId")
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
      console.log(this.req_id);
    },
    getCode() {
      if (this.chars) {
        postWithErrorCallback("/api/sysmgr-web/company-app/send-phone-code", {
          captcha: this.chars,
          reqId: this.req_id
        })
          .then(data => {
            console.log(data);
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
      if(this.phone){
        this.cshow = true;
        this.currEvent = a;
      }
      else{
        this.$message({
          type: 'error',
          message: '未绑定手机号码，无法获取权限！'
        })
      }
    },
    submit() {
      if (this.phoneCode) {
        post("/api/sysmgr-web/company-app/get-auth-code-by-phone-code", {
          phoneCode: this.phoneCode
        }).then(data => {
          console.log(data);
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
    }
  }
};
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
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
</style>
