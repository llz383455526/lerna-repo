<template> 
  <div class="r_main">
      <el-breadcrumb>
          <el-breadcrumb-item to="/main/clientManager/clientManager">
            客户管理
          </el-breadcrumb-item>
          <el-breadcrumb-item>
              服务商管理
          </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="content">
          <div class="title">{{fullName}}</div><el-button type="primary" style="margin-left: 120px;" size="small" @click="editCompany">编辑</el-button>
          <div class="box">
        	<el-row :gutter="20">
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">企业名称</el-col><el-col :span="10">{{msg.fullName}}</el-col>
	    		  </el-col>
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">Company ID</el-col><el-col :span="10">{{msg.id}}</el-col>
	    		</el-col>
        	</el-row>
	    	  <el-row :gutter="20">
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">企业简称</el-col><el-col :span="10">{{msg.name}}</el-col>
	    		  </el-col>
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">创建人</el-col><el-col :span="10">{{msg.createByName}}</el-col>
	    		</el-col>
        	</el-row>
	    	  <el-row :gutter="20">
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">企业地址</el-col><el-col :span="10">{{msg.areaName}}</el-col>
	    		  </el-col>
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">创建时间</el-col><el-col :span="10">{{msg.createTime}}</el-col>
	    		</el-col>
        	</el-row>
	    	  <el-row :gutter="20">
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">企业类型</el-col><el-col :span="10">{{msg.custom ? '客户' : msg.service ? '服务商' : '' }}</el-col>
	    		  </el-col>
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">更新人</el-col><el-col :span="10">{{msg.updateBy}}</el-col>
	    		</el-col>
        	</el-row>
	    	  <el-row :gutter="20">
        	    <!-- <el-col :span="10">
	    			  <el-col :span="5" class="right">税优地</el-col><el-col :span="10">{{msg.taxLandingName}}</el-col>
	    		</el-col> -->
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">更新时间</el-col><el-col :span="10">{{msg.updateTime}}</el-col>
	    		</el-col>
        	</el-row>
	    	  <el-row :gutter="20">
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">注册日期</el-col><el-col :span="10">{{msg.registerDate}}</el-col>
	    		  </el-col>
        	</el-row>
	    	<el-row :gutter="20">
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">负责人</el-col><el-col :span="10">{{msg.chargeByName}}</el-col>
	    		  </el-col>
        	</el-row>
	    	<!-- <el-row :gutter="20">
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">负责人电话</el-col><el-col :span="10">18699887766</el-col>
	    		  </el-col>
        	</el-row> -->
	    	</el-row>
	    	  <!-- <el-row :gutter="20">
        	    <el-col :span="10">
	    			  <el-col :span="5" class="right">企业状态</el-col><el-col :span="10">正常</el-col>
	    		  </el-col>
        	</el-row> -->
	    </div>
        <el-button style="margin-top: 30px" type="primary" @click="eshow = true">新增账号渠道</el-button>
        <el-table class="table" :data="tableData" border="">
            <el-table-column prop="channelAlias" label="渠道别名"></el-table-column>
            <el-table-column prop="thirdpaySystemId" label="渠道类型"></el-table-column>
            <el-table-column prop="keywordsMap" label="关键标识">
                <template slot-scope="scope">
                    <div v-for="(e, k) in scope.row.keywordsMap" v-if="e">
                        {{k}}：{{e}}
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="orderLimit" label="单笔限额（元）">
                <template slot-scope="scope">
                    {{scope.row.orderLimit | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column prop="dailyLimit" label="单日限额（元）">
                <template slot-scope="scope">
                    {{scope.row.dailyLimit | formatMoney}}
                </template>
            </el-table-column>
            <el-table-column prop="memo" label="备注"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button @click="edit(scope.row)" type="text">
                        管理
                    </el-button>
                    <el-button @click="channelDelete(scope.row)" type="text">
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="page">
            <el-pagination
            background
            layout="prev, pager, next"
            :page-size="form.pageSize"
            :total="total"
            @current-change="query"
            :currentPage="form.pageNo"
            >
          </el-pagination>
        </div>
      </div>
      <el-dialog title="修改信息" :visible.sync="coshow" width="70%">
          <el-form label-width="120px" :rules="crules" :model="cform" ref="cform">
              <el-form-item label="企业名称" prop="fullName" size="small">
                  <el-input v-model="cform.fullName" class="f_input"></el-input>
              </el-form-item>
              <el-form-item label="企业简称" prop="name" size="small">
                  <el-input v-model="cform.name" class="f_input"></el-input>
              </el-form-item>
              <el-form-item label="企业负责人" prop="chargeBy" size="small">
                  <el-select v-model="cform.chargeBy" class="f_input" @change="getName">
                    <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
                  </el-select>
              </el-form-item>
			  <el-form-item label="税优地" prop="taxLandingId" size="small">
          	      <el-select v-model="cform.taxLandingId" class="f_input">
          	          <el-option v-for="e in list" :label="e.taxLandingName" :value="e.id" :key="e.id"></el-option>
          	      </el-select>
          	  </el-form-item>
              <el-form-item label="企业地址" prop="areaName" size="small">
                  <el-input v-model="cform.areaName" class="f_input"></el-input>
              </el-form-item>
              <el-form-item label="注册日期" prop="registerDate" size="small">
                  <el-date-picker
                    class="f_input"
                    v-model="cform.registerDate"
                    type="date"
                    value-format="yyyy-MM-dd">
                  </el-date-picker>
              </el-form-item>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="upDate" type="primary" size="small">保存</el-button>
              <el-button @click="coshow = false" size="small">关闭</el-button>
          </span>
      </el-dialog>
      <el-dialog title="请选择渠道" :visible.sync="eshow" width="70%">
          <el-button size="small" type="primary" v-for="e in channels" @click="add(e.value)">{{e.text}}</el-button>
          <span class="form_footer" slot="footer">
              <el-button @click="eshow = false" size="small">取消</el-button>
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
              <el-form-item label="手机号码：" size="small">
                  {{phone}}
              </el-form-item>
              <el-form-item  size="small">
                  <img :src="`${baseUrl}/api/sysmgr-web/verify-codes/gen-captcha?req_id=${req_id}`">
                  <el-button type="text" style="margin-left: 30px;" @click="createId">刷新</el-button>
              </el-form-item>
              <el-form-item label="请输入图形中字符：" size="small">
                  <el-input v-model="chars" style="width: 300px;"></el-input>
              </el-form-item>
              <el-form-item label="短信验证码：" size="small">
                  <el-input v-model="phoneCode" style="width: 300px;"></el-input><el-button type="text" style="margin-left: 30px;" @click="getCode">获取验证码</el-button>
              </el-form-item>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="submit" type="primary" size="small">提交</el-button>
              <el-button @click="cshow = false" size="small">关闭</el-button>
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
export default {
  data() {
    return {
      baseUrl: baseUrl,
      fullName: '',
      cform: {},
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
		taxLandingId: [
            {
                required: true,
                message: "请选择税优地",
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
        pageNo: 1,
        pageSize: 10
      },
    //   aform: {
    //     isFromOutApp: "",
    //     companyId: "",
    //     appId: "",
    //     appName: "",
    //     serviceCompanyId: "",
    //     authCode: ""
    //   },
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
      msg: '',
      channels: [
          {
              text: '畅捷',
              value: 'changjie'
          },
          {
              text: '微信',
              value: 'wx'
          },
          {
              text: '支付宝',
              value: 'alipay'
          },
          {
              text: '易极付',
              value: 'yjf'
          },
          {
              text: '平安银行',
              value: 'pingan'
          },
          {
              text: '招商银行',
              value: 'cmb'
          },
          {
              text: '汇付',
              value: 'hf'
          }
      ],
	  list: []
    };
  },
  activated() {
    console.log(localStorage.getItem("appId"));
    this.form.companyId = localStorage.getItem("appId");
    // this.aform.appId = localStorage.getItem("appId");
    this.fullName = localStorage.getItem('fullName')
    this.query();
    get("/api/console-dlv/option/get-option-service-companies").then(data => {
      this.company = data;
    });
    this.getDetail()
    this.getPhone();
    this.createId();
	this.getList()
    this.authCode = localStorage.getItem("authCode");
  },
  mounted() {},
  // computed: {
  //     ...mapGetters({
  //         userInformation: 'userInformation'
  //     })
  // },
  methods: {
    getDetail() {
        get('/api/sysmgr-web/company/get-company-detail', {
          companyId: this.form.companyId
        }).then(data => {
            this.msg = data
            get(`/api/sysmgr-web/user/get-platform-users?platformType=console-admin`).then(data => {
                  console.log(data)
                  this.charges = data
            })
        })
    },
	getList() {
        get('/api/console-dlv/tax-landing/all-tax-landing').then(data => {
            this.list = data
        })
    },
    change() {
      console.log(this.timeRange);
      this.form.startAt = this.timeRange[0];
      this.form.endAt = this.timeRange[1];
    },
    query(a) {
      this.form.pageNo = 1;
      if (a && !isNaN(a)) {
        this.form.pageNo = a;
      }
      post("/api/paymentmgt/front/channel/qrylist", this.form).then(
        function(data) {
          console.log(data);
          this.tableData = data.data;
          this.total = data.total;
        }.bind(this)
      );
    },
    editCompany() {
        this.coshow = true
        this.cform = {
            id: this.msg.id,
            fullName: this.msg.fullName,
            name: this.msg.name,
            // companyType: "",
            chargeBy: this.msg.chargeBy,
            chargeByName: this.msg.chargeByName,
            legalPerson: this.msg.legalPerson,
            areaName: this.msg.areaName,
            registerDate: this.msg.registerDate,
			taxLandingId: this.msg.taxLandingId
        }
    },
    upDate() {
        this.$refs['cform'].validate((valid) => {
            if(valid) {
                post('/api/sysmgr-web/company/edit-company', this.cform).then(data => {
                    this.$message({
                        type: 'success',
                        message: '更改成功！'
                    })
                    this.getDetail()
                    this.coshow = false
                })
            }
        })
    },
    getName() {
        this.charges.forEach(e => {
            if(e.id == this.cform.chargeBy) {
                this.cform.chargeByName = e.name
            }
        })
    },
    clear() {
      this.form = {
        companyId: this.form.companyId,
        endAt: "",
        orderBy: "",
        pageNo: 1,
        pageSize: 10
      };
      this.timeRange = [];
    },
    add(a) {
		this.$router.push(`addServer?&thirdpaySystemId=${a}&companyId=${this.msg.id}&companyName=${this.msg.fullName}`)
      // console.log(a);
      this.eshow = false;
    },
    // sure(e) {
    //   if (this.authCode) {
    //     this.aform.authCode = this.authCode;
    //     postWithErrorCallback("/api/sysmgr-web/company-app/add-app", this.aform)
    //       .then(data => {
    //         console.log(data);
    //         this.eshow = false;
    //         this.$message({
    //           type: "success",
    //           message: "添加成功！"
    //         });
    //         this.query()
    //       })
    //       .catch(err => {
    //         if (err.message == "无效的授权码！") {
    //           this.getAccredit(this.sure);
    //         }
    //       });
    //   } else {
    //     this.getAccredit(this.sure);
    //   }
    // },
    edit(e) {
      sessionStorage.setItem("id", e.id);
      sessionStorage.setItem("channelAlias", e.channelAlias)
      this.$router.push("serverDetail");
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
    // isOut() {
    //   console.log(this.aform.isFromOutApp)
    //   if(this.aform.isFromOutApp == 0){
    //     this.aform.appId = localStorage.getItem("appId")
    //   }
    // },
    channelDelete(a) {
        console.log(a)
        post(`/api/paymentmgt/front/channel/delete?channelId=${a.id}`).then(() => {
            this.$message({
                type: 'success',
                message: '删除成功！'
            })
            this.query()
        })
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
.right {
	font-weight: bold;
	text-align: right;
}
</style>
