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
                <el-col :span="10">{{data.appName}}</el-col>
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
                <el-col :span="10">{{data.phone}}</el-col>
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
          <div class="title">支付渠道</div> <el-button type="primary" style="margin-left: 120px;" size="small" @click="addChannel">添加支付渠道</el-button>
          <el-table :data="data.payUsers">
              <el-table-column prop="payUserId" label="支付用户ID"></el-table-column>
              <el-table-column prop="thirdPaymentTypeName" label="渠道名称"></el-table-column>
              <el-table-column prop="serviceCompanyName" label="关联服务商" width=280>
                  <template slot-scope="scope">
                      <template v-if="scope.row.subServiceCompanyName">
                          {{scope.row.subServiceCompanyName}} <br>
                          <span style="color: red;">（{{scope.row.serviceCompanyName}} 业务转包）</span>
                      </template>
                      <template v-else>
                          {{scope.row.serviceCompanyName}}
                      </template>
                  </template>
              </el-table-column>
              <el-table-column prop="payUserName" label="支付账号"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
                      <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
                      <el-button type="text" @click="setDefault(scope.row)" v-if="!scope.row.isDefault">设为默认</el-button>
                      <el-button type="text" v-else disabled>已设为默认渠道</el-button>
                  </template>
              </el-table-column>
          </el-table>
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
                        <el-col :span="16"><el-checkbox v-for="e in appinfo.services" :key="e" :label="e" :checked="true" disabled></el-checkbox></el-col>
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
              <el-form-item label="服务商">
                  <el-checkbox-group v-model="aform.serviceCompanyList" @change="change">
                      <el-checkbox v-for="(item, i) in company" :label="item.value" :key="item.value" class="block">
                          <span class="mr10">{{item.text}}</span>
                          <el-select v-model="assign[i].subcontractType" v-if="aform.serviceCompanyList.indexOf(item.value) > -1">
							<el-option label="非转包" value="0"></el-option>
                            <el-option label="业务转包" value="1"></el-option>
                        </el-select>
                        <el-select v-model="assign[i].subServiceList[0].subServiceCompanyId" filterable v-if="aform.serviceCompanyList.indexOf(item.value) > -1 && assign[i].subcontractType - 0" @change="getassignCompanyName(i)">
                            <el-option v-for="e in filterAssignCompany(item.value)" :key="e.id" :label="e.name" :value="e.id"></el-option>
                        </el-select>
                      </el-checkbox>
                  </el-checkbox-group>
              </el-form-item>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="update" type="primary">保存</el-button>
              <el-button @click="ashow = false">关闭</el-button>
          </span>
      </el-dialog>
      <el-dialog title="添加支付渠道" :visible.sync="addShow" @open="clearForm" width="70%">
          <el-form label-width="180px">
              <el-form-item label="接入应用：">
                  <template>{{data.appName}}</template>
              </el-form-item>
              <el-form-item label="服务商">
                  <el-select class="f_input" v-model="serviceCompanyId" @change="clear" filterable>
                      <el-option v-for="e in data.serviceCompanyList" :key="e" :value="e.serviceCompanyId" :label="e.serviceCompanyName"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="转包服务商" v-if="subServiceList.length">
                  <el-select class="f_input" v-model="subServiceCompanyId" @change="getSubServiceCompanyName" filterable>
                      <el-option v-for="e in subServiceList" :key="e" :value="e.subServiceCompanyId" :label="e.subServiceCompanyName"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="支付渠道">
                  <el-select class="f_input" v-model="paymentThirdType" @change="getList" filterable>
                      <el-option v-for="e in types" :key="e" :value="e.value" :label="e.text"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item label="子账号名称">
                  <el-select class="f_input" v-model="payeruserName" @change="pick" filterable>
                      <el-option v-for="e in others" :key="e" :value="e.payeruserName" :label="e.payeruserName"></el-option>
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
        appId: "",
        chargeBy: '',
        chargeByName: '',
        appRsaPublickKey: "",
        notifyAppId: "",
        notifyUrl: "",
        phone: "",
        authCode: "",
        serviceCompanyList: {}
      },
      arule: {
        chargeBy: [
          { required: true, message: "请选择商户负责人", trigger: "blur" }
        ],
        notifyAppId: [
          { required: true, message: "请输入应用ID", trigger: "blur" }
        ],
        appRsaPublickKey: [
          { required: true, message: "请输入Rsa公钥", trigger: "blur" }
        ],
        // allowIp: [],
        notifyUrl: [
          { required: true, message: "请输入异步通知接口", trigger: "blur" }
        ],
        phone: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { pattern: /^(1[3-9]{1}\d{9})$/, message: '手机号格式不正确', trigger: 'blur' }
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
      company: [],
      appinfo:{
        sandboxConfig:{
          notifyUrl:""
        }
      },
      assign: [],
      assignCompany: [],
      subServiceCompanyId: "",
      subServiceCompanyName: "",
      subServiceList: []
    };
  },
  mounted() {
    this.appId = sessionStorage.getItem("appId");
    this.aform.appId = this.appId;
    this.query();
    this.getMsg();
    this.getPhone();
    this.createId();
    this.authCode = localStorage.getItem("authCode")
    get(`/api/sysmgr-web/user/get-platform-users?platformType=console-company`).then(data => {
      this.charges = data;
    });
    get("/api/openapi/developer/appinfo/" + this.appId).then(data => {
      this.appinfo = data;
    });
    get('/api/sysmgr-web/commom/company?companyIdentity=service').then(data => {
		this.assignCompany = data
	})
  },
  methods: {
    getMsg() {
      get("/api/console-dlv/option/get-by-type?type=ThirdPaymentType").then(
        data => {
          this.types = data;
        }
      );
    },
    query() {
      post("/api/sysmgr-web/company-app/detail", {
        appId: this.appId
      }).then(data => {
        this.data = data;
        !this.data.payUsers && (this.data.payUsers = []);
        this.listInit()
        this.aform.chargeBy = data.chargeBy
        this.aform.chargeByName = data.chargeByName
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
                this.getMsg()
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
        this.subServiceCompanyId = ""
        this.data.serviceCompanyList.forEach(e => {
            if(e.serviceCompanyId == this.serviceCompanyId) {
                this.subServiceList = e.subServiceList || []
            }
        })
    },
    getSubServiceCompanyName() {
        this.paymentThirdType = ''
        this.others = [];
        this.result = "";
        this.payeruserName = "";
        this.subServiceCompanyName = this.subServiceList[0].subServiceCompanyName
        console.log(this.paymentThirdType)
    },
    getList() {
      this.others = [];
      this.result = "";
      this.payeruserName = "";
      post("/api/paymentmgt/front/payuser/qrybycompany", {
        companyId: this.subServiceCompanyId || this.serviceCompanyId,
        thirdpaySystemId: this.paymentThirdType
      }).then(data => {
        this.others = data;
      });
    },
    pick() {
      var arr = this.others.filter(e => {
        return e.payeruserName == this.payeruserName;
      });
      this.result = arr[0];
    },
    addChannel() {
      this.addShow = true;
      this.paymentThirdType = "";
      this.payeruserName = "";
      this.others = [];
      this.result = "";
    },
    clearForm() {
        this.serviceCompanyId = ''
        this.subServiceList = ''
        this.subServiceCompanyId = ''
        this.subServiceCompanyName = ''
    },
    addRow() {
      if (this.authCode) {
        post(`/api/paymentmgt/front/channel/qrydetail?channelId=${this.result.channelId}`).then(data => {
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
              channelMerCustId: data['cj.merchant_id'] || data['wx.mchid'] || data['partner_id'] || data['mer_id'] || data['alipay.appid'] || data['pingan.mainacct.no'] || data['cmb.nteckopr.eacNbr'] || data['hxb.merchId'] || '',
              serviceCompanyId: this.serviceCompanyId,
              subServiceCompanyId: this.subServiceCompanyId,
              subServiceCompanyName: this.subServiceCompanyName
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
    },
    sure() {
      if (this.authCode) {
        postWithErrorCallback("/api/sysmgr-web/company-app/del-payment-user", {
          appId: this.appId,
          paymentThirdType: this.curr.thirdPaymentType,
          paymentUserId: this.curr.payUserId,
          authCode: this.authCode,
          serviceCompanyId: this.curr.serviceCompanyId,
          subServiceCompanyId: this.curr.subServiceCompanyId,
          subServiceCompanyName:this.curr.subServiceCompanyName
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
    defa(a) {
        if(a) {
            this.isDefault = 1
        }
        else {
            this.isDefault = 0
        }
    },
    setDefault(a) {
        if(a) {
            this.curr = a
        }
        if (this.authCode) {
            postWithErrorCallback('/api/sysmgr-web/company-app/set-default-payment-user', {
                appId: this.appId,
                authCode: this.authCode,
                paymentThirdType: this.curr.thirdPaymentType,
                paymentUserId: this.curr.payUserId,
                serviceCompanyId: this.curr.serviceCompanyId,
                subServiceCompanyId: this.curr.subServiceCompanyId
            }).then(data => {
                this.$message({
                  type: "success",
                  message: "设置成功"
                });
                this.query()
            }).catch(err => {
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
  display: block;
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
</style>