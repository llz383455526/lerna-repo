<template>
    <div class="r_main">
        <el-breadcrumb>
          <el-breadcrumb-item>
              添加新商户
          </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="tool">
        <el-button size="small" @click="back">取消</el-button>
        <el-button size="small" type="primary" @click="sure">保存</el-button>
      </div>
      <el-form :model="form" :rules="rule" label-width="200px" ref="form">
          <el-form-item label="商户名称" prop="appName" size="small">
              <el-input class="form_input" v-model="form.appName"></el-input>
          </el-form-item>
          <el-form-item label="appId" prop="appId" size="small">
              <el-input class="form_input" v-model="form.appId"></el-input>
          </el-form-item>
          <el-form-item label="商户类型" prop="isFromOutApp">
			  <el-radio v-model="form.isFromOutApp" label="1">API对接</el-radio>
  			  <el-radio v-model="form.isFromOutApp" label="0">SAAS系统</el-radio>
          </el-form-item>
		  <el-form-item label="企业负责人" prop="chargeBy" size="small">
              <el-select v-model="form.chargeBy" class="form_input" @change="getName">
                  <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
              </el-select>
          </el-form-item>
          <!-- <el-form-item label="商户负责人" prop="companyType" size="small">
              <el-select v-model="form.companyType" class="form_input">
                  <el-option v-for="e in types" :label="e.text" :value="e.value" :key="e.value"></el-option>
              </el-select>
          </el-form-item> -->
          <el-form-item label="选择服务商" prop="serviceCompanyId" size="small">
              <!-- <el-select v-model="form.serviceCompanyId" class="form_input" filterable>
                  <el-option v-for="item in company" :value="item.companyId" :label="item.companyName"></el-option>
              </el-select> -->
              <el-checkbox-group v-model="form.serviceCompanyIds">
                  <el-checkbox v-for="item in company" :label="item.companyId" :key="item.companyId">{{item.companyName}}</el-checkbox>
              </el-checkbox-group>
          </el-form-item>
          <!-- <el-form-item label="企业负责人" prop="legalPerson" size="small">
              <el-button type="primary">选择负责人</el-button>
          </el-form-item> -->
          <!-- <el-form-item label="企业地址" prop="areaName" size="small">
              <el-input class="form_input" v-model="form.areaName"></el-input>
          </el-form-item>
          <el-form-item label="注册日期" prop="registerDate" size="small">
              <el-input class="form_input" v-model="form.registerDate"></el-input>
          </el-form-item> -->
      </el-form>
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
import { get, post, postWithErrorCallback } from "../../store/api";
import { baseUrl } from "../../config/address.js";
export default {
  data() {
    return {
      form: {
        isFromOutApp: "",
        companyId: "",
        appId: "",
        appName: "",
        serviceCompanyIds: [],
        authCode: "",
        chargeBy: "",
        chargeByName: ""
      },
      rule: {
        isFromOutApp: [
          {
            required: true,
            message: "请选择",
            trigger: "change"
          }
        ],
        appName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "change"
          }
        ],
        appId: [
          {
            required: true,
            message: "请输入appId",
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
        serviceCompanyIds: [
          {
            required: true,
            message: "请选择服务公司",
            trigger: "change"
          }
        ]
      },
      types: [
        {
          text: "客户",
          value: "company"
        },
        {
          text: "服务商",
          value: "provider"
        }
      ],
      company: [],
      cshow: false,
      curr: "",
      authCode: "",
      phone: "",
      req_id: "",
      chars: "",
      phoneCode: "",
      currEvent: "",
      msg: "",
      baseUrl,
      charges: []
    };
  },
  mounted() {
    Object.assign(this.form, this.$route.query);
    console.log(this.form);
    post("/api/sysmgr-web/company-app/get-two-step-phone").then(data => {
      this.phone = data;
    });
    this.createId();
    // get("/api/console-dlv/option/get-option-service-companies").then(data => {
    //   this.company = data;
    // });
    get(`/api/sysmgr-web/company-app/get-app-service-company-options?customCompanyId=${this.form.companyId}`).then(data => {
        this.company = data;
    })
    get(
      `/api/sysmgr-web/user/get-platform-users?platformType=console-company`
    ).then(data => {
      console.log(data);
      this.charges = data;
    });
    this.authCode = localStorage.getItem('authCode')
  },
  methods: {
    back() {
      this.$router.back();
    },
    getName() {
      this.charges.forEach(e => {
        if (e.id == this.form.chargeBy) {
          this.form.chargeByName = e.name;
        }
      });
    },
    sure(e) {
        console.log(this.form)
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.authCode) {
            this.form.authCode = this.authCode;
            postWithErrorCallback(
              "/api/sysmgr-web/company-app/add-app",
              this.form
            )
              .then(data => {
                console.log(data);
                this.eshow = false;
                this.$message({
                  type: "success",
                  message: "添加成功！"
                });
                this.back();
              })
              .catch(err => {
                if (err.message == "无效的授权码！") {
                  this.getAccredit(this.sure);
                }
              });
          } else {
            this.getAccredit(this.sure);
          }
        }
      });
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
    // submit() {
    //   this.$refs["form"].validate(valid => {
    //     if (valid) {
    //       post("/api/sysmgr-web/company/add-company", this.form).then(() => {
    //         this.$message({
    //           type: "success",
    //           message: "添加成功！"
    //         });
    //         this.back();
    //       });
    //     }
    //   });
    // }
  }
};
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
  background-color: #fff;
}
.form_input {
  width: 500px;
}
.tool {
  margin: 20px 0;
}
</style>