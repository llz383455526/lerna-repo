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
  			  <el-radio v-model="form.isFromOutApp" label="0" @change="form.serviceCodes = [];">SAAS系统</el-radio>
          </el-form-item>
          <el-form-item label="服务类型" prop="serviceCodes" size="small" v-show="form.isFromOutApp == 1">
                <el-checkbox-group v-model="form.serviceCodes">
                  <el-checkbox :label="item.value" :key="item.value" v-for="item in serverConfig">{{item.text}}</el-checkbox>
                </el-checkbox-group>
          </el-form-item>
		  <el-form-item label="商户负责人" prop="chargeBy" size="small">
              <el-select v-model="form.chargeBy" class="form_input" @change="getName">
                  <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="选择服务商" prop="serviceCompanyList" size="small">
              <el-checkbox-group v-model="form.serviceCompanyList">
                  <el-checkbox v-for="(item, i) in company" :label="item" :key="item.value" class="block">
						<span class="mr10">{{item.text}}</span>
                        <el-select v-model="assign[i].subcontractType" v-if="form.serviceCompanyList.indexOf(item) > -1">
							<el-option label="非转包" :value="0"></el-option>
                            <el-option label="业务转包" :value="1"></el-option>
                        </el-select>
                        <el-select v-model="assign[i].subServiceList[0].subServiceCompanyId" v-if="form.serviceCompanyList.indexOf(item) > -1 && assign[i].subcontractType" @change="getassignCompanyName(i)">
                            <el-option v-for="e in filterAssignCompany(item.value)" :key="e.id" :label="e.name" :value="e.id"></el-option>
                        </el-select>
				  </el-checkbox>
              </el-checkbox-group>
          </el-form-item>
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
    var validateService = (rule, value, callback) => {
        if(value == '' && this.form.isFromOutApp == 1){
            callback(new Error('至少勾选一个选项'))
        }else{
            callback()
        }
    };
    return {
      form: {
        isFromOutApp: "",
        companyId: "",
        appId: "",
        appName: "",
        serviceCompanyList: [],
        authCode: "",
        chargeBy: "",
        chargeByName: "",
        serviceCodes: []
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
        serviceCodes:[
        {
          validator: validateService,
          trigger: "blur"
        }
        ],
        chargeBy: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "change"
          }
        ],
        serviceCompanyList: [
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
      charges: [],
	  serverConfig: [],
	  assign: [],
	  assignCompany: []
    };
  },
  mounted() {
    Object.assign(this.form, this.$route.query);
    post("/api/sysmgr-web/company-app/get-two-step-phone").then(data => {
      this.phone = data;
    });
    this.createId();
    // get("/api/console-dlv/option/get-option-service-companies").then(data => {
    //   this.company = data;
    // });
    get(`/api/sysmgr-web/commom/contract-service-company-options?customCompanyId=${this.form.companyId}`).then(data => {
		this.company = data;
		this.company.forEach(e => {
			this.assign.push({
				serviceCompanyId: e.value,
				subcontractType: 0,
				subServiceList: [{
					isDefault: 1,
					subServiceCompanyId: '',
					subServiceCompanyName: ''
				}]
			})
		})
		console.log(this.assign)
    })
    get(
      `/api/sysmgr-web/user/get-platform-users?platformType=console-company`
    ).then(data => {
      this.charges = data;
    });
    this.authCode = localStorage.getItem('authCode')
    get("/api/sysmgr-web/commom/service-config").then(data => {
        this.serverConfig = data;
    })
	get('/api/sysmgr-web/commom/company?companyIdentity=service').then(data => {
		this.assignCompany = data
	})
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
    sure(e) {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.authCode) {
            this.form.authCode = this.authCode;
			var arr = [], oldArr = this.form.serviceCompanyList
            this.form.serviceCompanyList.forEach((e, i) => {
                arr[i] = {}
                arr[i].serviceCompanyId = e.value
				arr[i].serviceCompanyName = e.text
				this.assign.forEach(e => {
					if(e.serviceCompanyId == arr[i].serviceCompanyId) {
						Object.assign(arr[i], e)
					}
				})
            })
            this.form.serviceCompanyList = arr
            postWithErrorCallback(
              "/api/sysmgr-web/company-app/add-app",
              this.form
            )
              .then(data => {
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
              }).finally(() => {
                  this.form.serviceCompanyList = oldArr
              })
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
.block {
    display: block;
    margin-bottom: 10px;
}
.mr10 {
    margin-right: 10px;
}
</style>