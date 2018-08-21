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
		<div class="title">基本信息</div><el-button type="primary" style="margin-left: 120px;" size="small" @click="open">编辑</el-button>
		<div class="box">
      		<el-row :gutter="20">
      		    <el-col :span="10">
					  <el-col :span="8" class="right">商户名称</el-col><el-col :span="10">{{data.appName}}</el-col>
				</el-col>
      		    <el-col :span="10">
					  <el-col :span="8" class="right">Company ID</el-col><el-col :span="10">{{data.companyId}}</el-col>
				</el-col>
      		</el-row>
			<el-row :gutter="20">
      		    <el-col :span="10">
					  <el-col :span="8" class="right">appId</el-col><el-col :span="10">{{data.appId}}</el-col>
				</el-col>
				<el-col :span="10">
					  <el-col :span="8" class="right">商户负责人</el-col><el-col :span="10">{{data.chargeByName}}</el-col>
				</el-col>
      		</el-row>
			<el-row :gutter="20">
				<el-col :span="20">
					  <el-col :span="4" class="right">异步通知appid</el-col><el-col :span="10" style="word-wrap: break-word;">{{data.notifyAppId}}</el-col>
				</el-col>
      		    <el-col :span="10">
					  <el-col :span="8" class="right">负责人电话</el-col><el-col :span="10">{{data.phone}}</el-col>
				</el-col>
      		</el-row>
			<el-row :gutter="20">
      		    <el-col :span="10">
					  <el-col :span="8" class="right">更新人</el-col><el-col :span="10">{{data.updateByName}}</el-col>
				</el-col>
				<el-col :span="10">
					  <el-col :span="8" class="right">更新时间</el-col><el-col :span="10">{{data.updateTime}}</el-col>
				</el-col>
      		</el-row>
			<el-row :gutter="20">
                <el-col :span="10">
					  <el-col :span="8" class="right">服务商</el-col><el-col :span="10">
                          <div v-for="e in data.serviceCompanyList">{{e.serviceCompanyName}}</div>
                      </el-col>
				</el-col>
      		</el-row>
            <el-row :gutter="20">
      		    <el-col :span="20">
					  <el-col :span="4" class="right">IP白名单（固定IP）</el-col><el-col :span="10" style="word-wrap: break-word;">{{data.allowIp}}</el-col>
				</el-col>
      		</el-row>
			<el-row :gutter="20">
      		    <el-col :span="20">
					  <el-col :span="4" class="right">异步通知接口</el-col><el-col :span="10" style="word-wrap: break-word;">{{data.notifyUrl}}</el-col>
				</el-col>
      		</el-row>
			<el-row :gutter="20">
      		    <el-col :span="20">
					  <el-col :span="4" class="right">RSA公钥</el-col><el-col :span="10" style="word-wrap: break-word;">{{data.appRsaPublickKey}}</el-col>
				</el-col>
      		</el-row>
      	</div>
          <!-- <div class="title">
              基本信息
          </div>
          <el-form label-width="180px" class="form">
              <el-form-item label="客户名称：">
                  <template>{{data.companyName}}</template>
              </el-form-item>
              <el-form-item label="接入应用：">
                  <template>{{data.appName}}</template>
              </el-form-item>
              <el-form-item label="appId：">
                  <template>{{data.appId}}</template>
              </el-form-item>
              <el-form-item label="服务商名称：">
                  <template>{{data.serviceCompanyName}}</template>
              </el-form-item>
          </el-form> -->
          <!-- <div class="title">客户应用配置信息</div> <el-button type="primary" style="margin-left: 120px;" size="small" @click="open">编辑</el-button>
          <el-form label-width="180px" class="form">
            <el-form-item label="应用类型：">
                <template>{{data.isFromOutApp ? '外部' : '内部'}}应用</template>
            </el-form-item>
            <el-form-item label="异步通知appid：">
                <template>{{data.notifyAppId}}</template>
            </el-form-item>
            <el-form-item label="Rsa公钥：">
                <el-input v-model="data.appRsaPublickKey" style="width: 400px;"></el-input>
            </el-form-item>
            <el-form-item label="IP白名单（固定IP）：">
                <template>{{data.allowIp}}</template>
            </el-form-item>
            <el-form-item label="工资单笔异步通知接口：">
                <template>{{data.notifyUrl}}</template>
            </el-form-item>
            <el-form-item label="手机号码(发放短信验证)：" v-if="!data.isFromOutApp">
                <template>{{data.phone}}</template>
            </el-form-item>
          </el-form> -->
          <div class="title">支付渠道</div> <el-button type="primary" style="margin-left: 120px;" size="small" @click="addChannel">添加支付渠道</el-button>
          <el-table :data="data.payUsers">
              <el-table-column prop="payUserId" label="支付用户ID"></el-table-column>
              <el-table-column prop="thirdPaymentTypeName" label="渠道名称"></el-table-column>
              <el-table-column prop="serviceCompanyName" label="关联服务商"></el-table-column>
              <el-table-column prop="payUserId" label="支付账号"></el-table-column>
              <!-- <el-table-column prop="payUserName" label="子账号名称"></el-table-column>
              <el-table-column prop="payUserNo" label="子账号"></el-table-column> -->
              <!-- <el-table-column prop="channelTypeName" label="渠道类型"></el-table-column> -->
              <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
                      <el-button type="text" @click="setDefault(scope.row)" v-if="!scope.row.isDefault">设为默认</el-button>
                      <el-button type="text" v-else disabled>已设为默认渠道</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </div>
      <el-dialog title="appid配置信息" :before-close="listInit" :visible.sync="ashow" width="70%">
          <el-form label-width="180px" :model="aform" :rules="arule" ref="aform">
              <!-- <el-form-item label="商品名称：" prop="appName">
                  <el-input class="f_input" v-model="aform.appName"></el-input>
              </el-form-item> -->
              <el-form-item label="商户负责人：" prop="chargeBy">
                  <el-select v-model="aform.chargeBy" class="form_input" @change="getName">
                  <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
              </el-select>
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
                <el-form-item label="手机号码(发放短信验证)：" prop="phone">
                    <el-input class="f_input" v-model="aform.phone"></el-input>
                </el-form-item>
              </template>
              <!-- v-if="isQuery" -->
              <el-form-item label="服务商">
                  <!-- :checked="isChecked(item)" -->
                  <el-checkbox-group v-model="aform.serviceCompanyList" @change="change">
                      <el-checkbox v-for="item in company" :label="item.value" :key="item.value">{{item.text}}</el-checkbox>
                  </el-checkbox-group>
              </el-form-item>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="update" type="primary">保存</el-button>
              <el-button @click="ashow = false">关闭</el-button>
          </span>
      </el-dialog>
      <el-dialog title="添加支付渠道" :visible.sync="addShow" width="70%">
          <el-form label-width="180px">
              <el-form-item label="接入应用：">
                  <template>{{data.appName}}</template>
              </el-form-item>
              <el-form-item label="服务商">
                  <el-select class="f_input" v-model="serviceCompanyId" @change="clear">
                      <el-option v-for="e in data.serviceCompanyList" :value="e.serviceCompanyId" :label="e.serviceCompanyName"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="支付渠道">
                  <el-select class="f_input" v-model="paymentThirdType" @change="getList">
                      <el-option v-for="e in types" :value="e.value" :label="e.text"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="子账号名称">
                  <el-select class="f_input" v-model="payeruserName" @change="pick">
                      <el-option v-for="e in others" :value="e.payeruserName" :label="e.payeruserName"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item v-show="result" label="支付账户" style="color: red;">
                  <template>{{result.userId}}</template>
              </el-form-item>
              <el-form-item v-show="result" label="子账号" style="color: red;">
                  <template>{{result.thirdpayUserId}}</template>
              </el-form-item>
              <el-form-item label="是否默认">
                  <el-checkbox checked @change="defa"></el-checkbox>
              </el-form-item>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button size="small" @click="addRow" type="primary">保存</el-button>
              <el-button size="small" @click="addShow = false">关闭</el-button>
          </span>
      </el-dialog>
      <el-dialog title="支付渠道" :visible.sync="dshow" width="50%">
          <el-form label-width="120px">
            <div class="center">确定 删除 {{curr.payUserName}}？</div>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button size="small" @click="sure" type="primary">确定</el-button>
              <el-button size="small" @click="dshow = false">取消</el-button>
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
              <el-button size="small" @click="submit" type="primary">提交</el-button>
              <el-button size="small" @click="cshow = false">关闭</el-button>
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
var baseUrl = require("../../config/address.js").baseUrl;
if (!baseUrl) {
  baseUrl = "";
}
export default {
  data() {
    return {
      appId: "",
      ashow: false,
      aform: {
        allowIp: "",
        // appName: '',
        appId: "",
        chargeBy: '',
        chargeByName: '',
        appRsaPublickKey: "",
        notifyAppId: "",
        notifyUrl: "",
        phone: "",
        authCode: "",
        serviceCompanyList: []
      },
    //   isQuery: true,
      arule: {
        // appName: [
        //   {
        //     required: true,
        //     message: "请输入商户名称",
        //     trigger: "change"
        //   }
        // ],
        chargeBy: [
            {
            required: true,
            message: "请选择商户负责人",
            trigger: "change"
          }
        ],
        notifyAppId: [
          {
            required: true,
            message: "请输入应用ID",
            trigger: "change"
          }
        ],
        appRsaPublickKey: [
          {
            required: true,
            message: "请输入Rsa公钥",
            trigger: "change"
          }
        ],
        allowIp: [
        //   {
        //     required: true,
        //     message: "请输入白名单IP",
        //     trigger: "change"
        //   }
        ],
        notifyUrl: [
          {
            required: true,
            message: "请输入异步通知接口",
            trigger: "change"
          }
        ]
      },
      baseUrl: baseUrl,
      addShow: false,
      dshow: false,
      data: '',
      result: "",
      types: [],
      paymentThirdType: "",
      payeruserName: "",
      others: [],
      curr: {},
      cshow: false,
      authCode: "",
      phone: "",
      req_id: "",
      chars: "",
      phoneCode: "",
      currEvent: "",
      isDefault: 1,
      serviceCompanyId: '',
      charges: [],
      company: []
    };
  },
  activated() {
    this.appId = sessionStorage.getItem("appId");
    this.aform.appId = this.appId;
    this.query();
    get("/api/console-dlv/option/get-by-type?type=ThirdPaymentType").then(
      data => {
        this.types = data;
      }
    );
    // post('/api/paymentmgt/front/payuser/qrybycompany', {
    //   companyId: this.data.id,
    //   thirdpaySystemId: "string"
    // })
    this.getPhone();
    this.createId();
    this.authCode = localStorage.getItem("authCode");
    get(`/api/sysmgr-web/user/get-platform-users?platformType=console-company`).then(data => {
      console.log(data);
      this.charges = data;
    });
  },
  methods: {
    query() {
    //   this.isQuery = false
      post("/api/sysmgr-web/company-app/detail", {
        appId: this.appId
      }).then(data => {
        this.data = data;
        !this.data.payUsers && (this.data.payUsers = []);
        this.listInit()
        // this.aform.serviceCompanyList
        // this.aform.appName = data.appName
        this.aform.chargeBy = data.chargeBy
        this.aform.chargeByName = data.chargeByName
        this.getService()
        // this.isQuery = true
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
    },
    getService() {
        get(`/api/sysmgr-web/commom/contract-service-company-options?customCompanyId=${this.data.companyId}`).then(data => {
            this.company = data;
        })
    },
    getName() {
      this.charges.forEach(e => {
        if (e.id == this.aform.chargeBy) {
          this.aform.chargeByName = e.name;
        }
      });
    },
    // isChecked(a) {
    //     var arr = this.data.serviceCompanyList.filter(e => {
    //         return e.serviceCompanyId == a.value
    //     })
    //     return arr.length > 0 ? true : false
    // },
    change() {
        console.log(this.aform.serviceCompanyList)
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
              })
              .catch(err => {
                if (err.message == "无效的授权码！") {
                  this.getAccredit(this.update);
                }
              })
          } else {
            this.getAccredit(this.update);
          }
        }
      });
    },
    clear() {
        this.paymentThirdType = ''
        this.others = [];
        this.result = "";
        this.payeruserName = "";
    },
    getList() {
      this.others = [];
      this.result = "";
      this.payeruserName = "";
      post("/api/paymentmgt/front/payuser/qrybycompany", {
        companyId: this.serviceCompanyId,
        thirdpaySystemId: this.paymentThirdType
      }).then(data => {
        console.log(data);
        this.others = data;
      });
    },
    pick() {
      var arr = this.others.filter(e => {
        return e.payeruserName == this.payeruserName;
      });
      console.log(arr);
      this.result = arr[0];
    },
    addChannel() {
      this.addShow = true;
      this.paymentThirdType = "";
      this.payeruserName = "";
      this.others = [];
      this.result = "";
    },
    addRow() {
      if (this.authCode) {
        post(`/api/paymentmgt/front/channel/qrydetail?channelId=${this.result.channelId}`).then(data => {
            console.log(data['cj.merchant_id'] || data['wx.mchid'] || data['partner_id'] || data['mer_id'])
            postWithErrorCallback("/api/sysmgr-web/company-app/add-payment-user", {
              appId: this.appId,
              payUserNo: this.result.thirdpayUserId,
              paymentThirdType: this.result.thirdpaySystemId,
              payUserName: this.result.payeruserName,
              paymentUserId: this.result.userId,
              authCode: this.authCode,
              isDefault: this.isDefault,
              channelAlias: data.channelAlias,
              channelLoginAcctNo: data.loginAcctno,
              channelMerCustId: data['cj.merchant_id'] || data['wx.mchid'] || data['partner_id'] || data['mer_id'] || data['alipay.userid'] || '',
              serviceCompanyId: this.serviceCompanyId
            }).then(data => {
              this.addShow = false;
              this.$message({
                type: "success",
                message: "添加成功"
              });
              this.query();
            })
            .catch(err => {
              if (err.message == "无效的授权码！") {
                this.getAccredit(this.addRow);
              }
            });
        })
      } else {
        this.getAccredit(this.addRow);
      }
    },
    deleteRow(e) {
      this.curr = e;
      this.dshow = true;
      console.log(this.curr);
    },
    sure() {
      if (this.authCode) {
        console.log(this.curr);
        postWithErrorCallback("/api/sysmgr-web/company-app/del-payment-user", {
          appId: this.appId,
          paymentThirdType: this.curr.thirdPaymentType,
          paymentUserId: this.curr.payUserId,
          authCode: this.authCode,
          serviceCompanyId: this.curr.serviceCompanyId
        })
          .then(data => {
            this.dshow = false;
            this.$message({
              type: "success",
              message: "删除成功"
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
    },
    defa(a) {
        if(a) {
            this.isDefault = 1
        }
        else {
            this.isDefault = 0
        }
        console.log(this.isDefault)
    },
    setDefault(a) {
        console.log(a)
        if(a) {
            this.curr = a
        }
        if (this.authCode) {
            postWithErrorCallback('/api/sysmgr-web/company-app/set-default-payment-user', {
                appId: this.appId,
                authCode: this.authCode,
                paymentThirdType: this.curr.thirdPaymentType,
                paymentUserId: this.curr.payUserId,
                serviceCompanyId: this.curr.serviceCompanyId
            }).then(data => {
                this.$message({
                  type: "success",
                  message: "设置成功"
                });
                this.query()
            }).catch(err => {
                console.log(err)
                if (err.message == "无效的授权码！") {
                  this.getAccredit(this.setDefault);
                }
            })
        }
        else {
          this.getAccredit(this.setDefault);
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
.content {
  margin-left: 30px;
}
.form {
  margin-top: 20px;
}
.title {
  display: inline-block;
  margin-top: 30px;
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
</style>