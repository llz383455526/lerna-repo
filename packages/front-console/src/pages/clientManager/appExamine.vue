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
            <div class="title">基本信息</div>
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
    	        		<el-col :span="5" class="right">更新人</el-col><el-col :span="10">{{msg.updateByName}}</el-col>
    	        	</el-col>
                </el-row>
    	        	<el-row :gutter="20">
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
    	        		  <el-col :span="5" class="right">客户归属</el-col><el-col :span="10">{{msg.originalName}}</el-col>
    	        	  </el-col>
                </el-row>
    	    </div>
            <el-table class="table" :data="tableData" border="">
                <el-table-column prop="appName" label="商户名称"></el-table-column>
                <el-table-column label="商户状态">
                    <template slot-scope="scope">
                        {{scope.row.statusName}}
                    </template>
                </el-table-column>
    	      	<el-table-column prop="updateByName" label="更新人"></el-table-column>
    	      	<el-table-column prop="updateTime" label="更新时间"></el-table-column>
            </el-table>
            <ayg-pagination
                v-if="total"
                :total="total"
                v-on:handleSizeChange="sizeChange"
                :currentSize="form.pageSize"
                v-on:handleCurrentChange="query"
                :currentPage="form.page">
            </ayg-pagination>
        </div>
        <div class="content">
            <div class="title">签约信息</div>
            <el-table class="table" :data="contractData.list" border="">
                <el-table-column label="签约服务商" prop="serviceCompanyName"></el-table-column>
                <el-table-column label="结算方式" prop="settleTypeName"></el-table-column>
                <el-table-column label="合同起止时间" prop="lastUpdateAt">
                    <template slot-scope="scope">
                        {{scope.row.contractStartDate}} 至 {{scope.row.contractEndDate}}
                    </template>
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
                :currentPage="contractForm.page">
            </ayg-pagination>
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
                        <router-link :to="`/main/eContract/index?templateName=${scope.row.name}`">
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
                <el-button @click="coshow = false" size="small">关闭</el-button>
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
      var reviewMemo = (rule, value, callback) => {
          if(!value && this.reviewForm.approve == false){
              callback(new Error('请填写备注信息'))
          }else{
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
        msg: '',
        contractForm: {
            customerId: '',
            page: 1,
            pageSize: 10
        },
        contractData: {},
        reviewDialog:false,
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
        msgData: {}
      };
    },
    activated() {
      this.form.companyId = localStorage.getItem("appId");
      this.aform.companyId = localStorage.getItem("appId");
      this.msgForm.companyId = localStorage.getItem("appId");
      this.fullName = localStorage.getItem('fullName')
      this.query();
      get("/api/console-dlv/option/get-option-service-companies").then(data => {
        this.company = data;
      });
      this.getDetail()
    //   this.getPhone();
      this.createId();
    //   this.cquery();
      this.authCode = localStorage.getItem("authCode");
      this.msgQuery()
    },
    methods: {
    //   cquery(a) {
    //       if(isNaN(a)) {
    //           a = 1
    //       }
    //       this.queryForm.page = a
    //       post('/api/sysmgr-web/user/list', this.queryForm).then(data => {
    //           this.result = data
    //       })
    //   },
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
          function(data) {
            this.tableData = data.list;
            this.total = data.total;
          }.bind(this)
        );
      },
      sizeChange(a) {
          this.form.pageSize = a
          this.query()
      },
      editCompany() {
          this.coshow = true
          this.cform = {
              id: this.msg.id,
              fullName: this.msg.fullName,
              name: this.msg.name,
              taxLandingId: this.msg.taxLandingId,
              chargeBy: this.msg.chargeBy,
              chargeByName: this.msg.chargeByName,
              legalPerson: this.msg.legalPerson,
              areaName: this.msg.areaName,
              registerDate: this.msg.registerDate,
              salesList: this.msg.salesList || []
          }
      },
      upDate() {
          this.$refs['cform'].validate((valid) => {
              if(valid) {
                  var cform = JSON.parse(JSON.stringify(this.cform))
                  if(cform.salesList) {
                      var salesList = []
                      cform.salesList.forEach(e => {
                          salesList.push({
                              id: e.id,
                              name: e.name,
                              mobilephone: e.mobilephone
                          })
                      })
                      cform.salesList = salesList
                  }
                  post('/api/sysmgr-web/company/edit-company', cform).then(data => {
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
      add(a) {
    		this.$router.push(`addApp?companyId=${this.msg.id}`)
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
        if(this.aform.isFromOutApp == 0){
          this.aform.appId = localStorage.getItem("appId")
        }
      },
    //   getPhone() {
    //     post("/api/sysmgr-web/company-app/get-two-step-phone").then(data => {
    //       this.phone = data;
    //     });
    //   },
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
          if(isNaN(a)) {
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
      review(formName){
          let self = this;
          this.$refs[formName].validate(valid => {
              if (valid) {
                  let param = this.reviewForm;
                  post('/api/sysmgr-web/company-app/online-approve', param).then(data => {
                      if(data == 'OK'){
                          this.$message({
                            type: "success",
                            message: '审核成功'
                          });
                          this.reviewDialog = false;
                          this.query();
                      }else{
                          this.$message({
                            type: 'error',
                            message: data
                          })
                      }
                  })
              }
          })
      },
      //   -----------------------------------
      msgQuery(a) {
          if(isNaN(a)) {
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
        //   /api/econtract/template/download?fileName=${}
        console.log(a.templateFileName)
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