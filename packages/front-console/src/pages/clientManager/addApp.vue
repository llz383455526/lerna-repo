<template>
  <div class="r_main">
    <el-breadcrumb>
      <el-breadcrumb-item>添加新商户</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="tool">
      <el-button size="small" @click="back">取消</el-button>
      <el-button size="small" type="primary" @click="sure">保存</el-button>
    </div>
    <el-form :model="form" :rules="rule" label-width="200px" ref="form">
      <el-form-item label="商户名称" prop="appName" size="small">
        <el-input class="form_input" v-model="form.appName"></el-input>
      </el-form-item>
      <!-- <el-form-item label="appId" prop="appId" size="small">
        <el-input class="form_input" v-model="form.appId"></el-input>
      </el-form-item> -->
      <el-form-item label="商户类型" prop="isFromOutApp">
        <el-radio v-model="form.isFromOutApp" label="1">API对接</el-radio>
        <el-radio v-model="form.isFromOutApp" label="0">SAAS系统</el-radio>
      </el-form-item>
      <!-- <el-form-item label="服务类型" prop="serviceCodes" size="small" v-show="form.isFromOutApp == 1">
        <el-checkbox-group v-model="form.serviceCodes">
          <el-checkbox
            :label="item.value"
            :key="item.value"
            v-for="item in serverConfig"
          >{{item.text}}</el-checkbox>
        </el-checkbox-group>
      </el-form-item> -->
      <el-form-item label="商户负责人电话" prop="mobilePhone">
        <el-input class="form_input" v-model="form.mobilePhone" @change="getSelect"></el-input>
      </el-form-item>
      <el-form-item label="商户负责人姓名" prop="chargeByName">
        <el-input class="form_input" v-model="form.chargeByName" :disabled="form.chargeBy ? true : false"></el-input>
      </el-form-item>
      <el-form-item label="商户负责人邮箱" prop="chargeEmail">
        <el-input class="form_input" v-model="form.chargeEmail" :disabled="form.chargeBy ? true : false"></el-input>
      </el-form-item>
      <!-- <el-form-item label="商户负责人" prop="chargeBy" size="small">
        <el-select v-model="form.chargeBy" class="form_input" @change="getName">
          <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
        </el-select>
      </el-form-item> -->
      <el-form-item label="选择服务商" prop="serviceCompanyList" size="small">
        <el-checkbox-group v-model="form.serviceCompanyList">
          <el-checkbox v-for="(item, i) in company" :label="item" :key="item.value" class="block">
            <span class="mr10">{{item.text}}</span>
            <el-select
              v-model="assign[i].subcontractType"
              v-if="form.serviceCompanyList.indexOf(item) > -1"
            >
              <el-option label="非转包" :value="0"></el-option>
              <el-option label="业务转包" :value="1"></el-option>
            </el-select>
            <el-select
              v-model="assign[i].subServiceList[0].subServiceCompanyId"
              v-if="form.serviceCompanyList.indexOf(item) > -1 && assign[i].subcontractType"
              @change="getassignCompanyName(i)"
            >
              <el-option
                v-for="e in filterAssignCompany(item.value)"
                :key="e.id"
                :label="e.name"
                :value="e.id"
              ></el-option>
            </el-select>
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <auth-code @result="getAuthCode" ref="authCode"></auth-code>
  </div>
</template>
<script>
import { get, post, postWithErrorCallback } from "../../store/api";
import authCode from '../../pageComponent/authCode'
export default {
    components: {
        authCode
    },
    data() {
      var validateService = (rule, value, callback) => {
        if (value == "" && this.form.isFromOutApp == 1) {
          callback(new Error("至少勾选一个选项"));
        } else {
          callback();
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
          chargeEmail: "",
          mobilePhone: "",
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
          serviceCodes: [
            {
              validator: validateService,
              trigger: "blur"
            }
          ],
          // chargeBy: [
          //   {
          //     required: true,
          //     message: "请选择负责人",
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
        msg: "",
        charges: [],
        serverConfig: [],
        assign: [],
        assignCompany: []
      };
    },
    mounted() {
      Object.assign(this.form, this.$route.query);
      // get("/api/console-dlv/option/get-option-service-companies").then(data => {
      //   this.company = data;
      // });
      get(`/api/sysmgr-web/commom/contract-service-company-options?customCompanyId=${this.form.companyId}`).then(data => {
        this.company = data;
        this.company.forEach(e => {
          this.assign.push({
            serviceCompanyId: e.value,
            subcontractType: 0,
            subServiceList: [
              {
                isDefault: 1,
                subServiceCompanyId: "",
                subServiceCompanyName: ""
              }
            ]
          });
        });
        // console.log(this.assign);
      });
      get(
        `/api/sysmgr-web/user/get-platform-users?platformType=console-company`
      ).then(data => {
        this.charges = data;
      });
      this.authCode = localStorage.getItem("authCode");
      get("/api/sysmgr-web/commom/service-config").then(data => {
        this.serverConfig = data;
        this.pushServiceCodes()
      });
      get("/api/sysmgr-web/commom/company?companyIdentity=service").then(data => {
        this.assignCompany = data;
      });
    },
    methods: {
        pushServiceCodes() {
            let arr = []
            this.serverConfig.forEach(el => {
                arr.push(el.value)
            });
            this.form.serviceCodes = arr;
            // console.log(this.form)
        },
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
      getSelect() {
        if(/^(1\d{10})$/.test(this.form.mobilePhone)) {
          get('/api/sysmgr-web/user/get-user-by-mobile', {
            mobile: this.form.mobilePhone
          }, true).then(data => {
            this.form.chargeBy = data.id || ''
            this.form.chargeByName = data.name || ''
            this.form.chargeEmail = data.email || ''
            if(this.form.chargeBy) {
              this.rule.chargeByName = ''
              this.rule.chargeEmail = ''
            }
            else {
              this.rule.chargeByName = [{ required: true, message: "请填写姓名", trigger: "change" }]
              this.rule.chargeEmail = [{ required: true, message: "请填写邮箱", trigger: "change" }]
            }
            this.$nextTick(() => {
              this.$refs.form.clearValidate(['chargeByName', 'chargeEmail'])
            })
          })
        }
      },
      filterAssignCompany(a) {
        return this.assignCompany.filter(e => {
          return a != e.id;
        });
      },
      getassignCompanyName(a) {
        this.assignCompany.forEach(e => {
          if (e.id == this.assign[a].subServiceList[0].subServiceCompanyId) {
            this.assign[a].subServiceList[0].subServiceCompanyName = e.name;
          }
        });
      },
      sure(e) {
        this.$refs["form"].validate(valid => {
          if (valid) {
            if (this.authCode) {
              this.form.authCode = this.authCode;
              var arr = [],
                oldArr = this.form.serviceCompanyList;
              this.form.serviceCompanyList.forEach((e, i) => {
                arr[i] = {};
                arr[i].serviceCompanyId = e.value;
                arr[i].serviceCompanyName = e.text;
                this.assign.forEach(e => {
                  if (e.serviceCompanyId == arr[i].serviceCompanyId) {
                    Object.assign(arr[i], e);
                  }
                });
              });
              this.form.serviceCompanyList = arr;
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
                    this.$refs.authCode.getAccredit(this.sure);
                  }
                })
                .finally(() => {
                  this.form.serviceCompanyList = oldArr;
                });
            } else {
              this.$refs.authCode.getAccredit(this.sure);
            }
          }
        });
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