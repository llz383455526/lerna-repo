<template>
    <div>
        <div class="title">支付渠道</div> <el-button type="primary" size="small" @click="addChannel">添加支付渠道</el-button>
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
            <el-table-column prop="accountBalance" label="账号余额(元)"></el-table-column>
            <el-table-column prop="isApiRecharege" label="模式">
            	<template slot-scope="scope">
	            	<template v-if="scope.row.isApiRecharge===1">
	            		实发实充
	            	</template>
            	</template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                	<el-button type="text" @click="updateRow(scope.row)">查看</el-button>
                    <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
                    <el-button type="text" @click="setDefault(scope.row)" v-if="!scope.row.isDefault">设为默认</el-button>
                    <el-button type="text" v-else disabled>已设为默认渠道</el-button>
                </template>
            </el-table-column>
        </el-table>
        
        <el-dialog title="添加支付渠道" :visible.sync="addShow" @open="clearForm" width="70%">
            <el-form label-width="180px">
                <el-form-item label="接入应用：">
                    <template>{{data.appName}}</template>
                </el-form-item>
                <el-form-item label="服务商">
                    <el-select class="f_input" v-model="serviceCompanyId" @change="clear" filterable>
                        <el-option v-for="e in data.serviceCompanyList" :key="e.serviceCompanyId" :value="e.serviceCompanyId" :label="e.serviceCompanyName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="转包服务商" v-if="subServiceList.length">
                    <el-select class="f_input" v-model="subServiceCompanyId" @change="getSubServiceCompanyName" filterable>
                        <el-option v-for="e in subServiceList" :key="e.subServiceCompanyId" :value="e.subServiceCompanyId" :label="e.subServiceCompanyName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="支付渠道">
                    <el-select class="f_input" v-model="paymentThirdType" @change="getList" filterable>
                        <el-option v-for="e in types" :key="e.value" :value="e.value" :label="e.text"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="子账号名称">
                    <el-select class="f_input" v-model="payeruserName" @change="pick" filterable>
                        <el-option v-for="(e, i) in others" :key="i" :value="e.payeruserName" :label="e.payeruserName"></el-option>
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
                <el-form-item v-show="isApiRechargeShow" label="启用实发实充">
                    <el-checkbox v-model="checkApiRecharge" @change="changeAddApiRecharge"></el-checkbox>
                </el-form-item>
                <el-form-item v-show="isApiPaymentUserIdShow" label="付款账号">
                    <el-select class="f_input" v-model="apiPaymentUserId" filterable>
                        <el-option v-for="e in paymentUserIdList" :key="e.userId" :value="e.userId" :label="e.merchId"></el-option>
                    </el-select>
                </el-form-item>
                <el-input v-show="false" v-model="apiRechargePaymentThirdType" placeholder=""></el-input>
                <el-input v-show="false" v-model="apiRechargePayUserId" placeholder=""></el-input>
            </el-form>
            <span class="form_footer" slot="footer">
                <el-button size="small" @click="addRow" type="primary">保存</el-button>
                <el-button size="small" @click="addShow = false">关闭</el-button>
            </span>
        </el-dialog>
        
        <el-dialog title="查看支付渠道" :visible.sync="updateShow" @open="clearForm" width="70%">
            <el-form label-width="180px">
                <el-form-item label="接入应用：">
                    <template>{{data.appName}}</template>
                </el-form-item>
                <el-form-item label="服务商" :disabled="true">
                    <!--<el-select class="f_input" v-model="updateDialog.serviceCompanyId" @change="clear" filterable >
                        <el-option v-for="e in data.serviceCompanyList" :key="e.serviceCompanyId" :value="e.serviceCompanyId" :label="e.serviceCompanyName"></el-option>
                    </el-select>-->
                    <template>{{updateDialog.serviceCompanyName}}</template>
                </el-form-item>
                <el-form-item label="转包服务商" v-if="subServiceList.length">
                    <!--<el-select class="f_input" v-model="updateDialog.subServiceCompanyId" @change="getSubServiceCompanyName" filterable>
                        <el-option v-for="e in subServiceList" :key="e.subServiceCompanyId" :value="e.subServiceCompanyId" :label="e.subServiceCompanyName"></el-option>
                    </el-select>-->
                    <template>{{updateDialog.subServiceCompanyId}}</template>
                </el-form-item>
                <el-form-item label="支付渠道">
                    <!--<el-select class="f_input" v-model="updateDialog.paymentThirdType" @change="getList" filterable>
                        <el-option v-for="e in types" :key="e.value" :value="e.value" :label="e.text"></el-option>
                    </el-select>-->
                    <template>{{updateDialog.paymentThirdType}}</template>
                </el-form-item>
                <el-form-item label="子账号名称">
                    <!--<el-select class="f_input" v-model="updateDialog.payeruserName" @change="pick" filterable>
                        <el-option v-for="(e, i) in others" :key="i" :value="e.payeruserName" :label="e.payeruserName"></el-option>
                    </el-select>-->
                    <template>{{updateDialog.payeruserName}}</template>
                </el-form-item>
                <el-form-item label="支付账户" style="color: red;">
                    <template>{{updateDialog.userId}}</template>
                </el-form-item>
                <el-form-item label="子账号" style="color: red;">
                    <template>{{updateDialog.thirdpayUserId}}</template>
                </el-form-item>
  <!--              <el-form-item label="是否默认">
                    <el-checkbox checked @change="defa"></el-checkbox>
                </el-form-item>-->
                <el-form-item label="启用实发实充" v-show="updateDialog.isApiRechargeShow">
                    <el-checkbox v-model="updateDialog.checkApiRecharge" @change="changeUpdateApiRecharge"></el-checkbox>
                </el-form-item>
                <el-form-item v-show="updateDialog.isApiPaymentUserIdShow" label="付款账号">
                    <el-select class="f_input" v-model="updateDialog.apiRechargePaymentUserId" filterable @change="updatePaymentUserChange">
                        <el-option v-for="e in updateDialog.paymentUserIdList" :key="e.userId" :value="e.userId" :label="e.merchId"></el-option>
                    </el-select>
                </el-form-item>
				<el-input v-show="false" v-model="updateDialog.apiRechargePaymentThirdType" placeholder=""></el-input>
                <el-input v-show="false" v-model="updateDialog.apiRechargePayUserId" placeholder=""></el-input>
            </el-form>
            <span class="form_footer" slot="footer">
                <el-button size="small" @click="updateSaveRow" type="primary">保存</el-button>
                <el-button size="small" @click="updateShow = false">关闭</el-button>
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
        <auth-code @result="getAuthCode" ref="authCode"></auth-code>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback, importPost } from "../store/api";
import authCode from './authCode'
export default {
    components: {
        authCode
    },
    props: {
        data: {
            type: Object,
            default() {
                return {}
            }
        },
        query: {
            type: Function,
            default() {
                return function() {}
            }
        },
        appId: {
            type: null,
            default: ''
        }
    },
    data() {
        return {
        	isApiRecharege:false,
            addShow: false,
            updateShow:false,
            serviceCompanyId: '',
            subServiceCompanyId: "",
            paymentThirdType: "",
            payeruserName: "",
            result: "",
            curr: {},
            authCode: '',
            subServiceList: [],
            types: [],
            others: [],
            dshow: false,
            isDefault: 1,
            isApiRecharge:0,
            apiRechargePayUserId:"",
            apiRechargePaymentThirdType:"",
            isApiRechargeShow:false,
            isApiPaymentUserIdShow:false,
            checkApiRecharge:false,
            paymentUserIdList:[],
            apiPaymentUserId:"",
            updateDialog:{
            	id:"",
            	isApiRecharge: 0,
	            serviceCompanyId: '',
	            subServiceCompanyId:"",
	            paymentThirdType: "",
	            payeruserName: "",
	            userId:"",
	            thirdpayUserId:"",
				isApiRecharege:0,
				apiRechargePaymentUserId:"",
				apiRechargePaymentThirdType:"",
				serviceCompanyName:"",
				payUserNo:"",
				isApiPaymentUserIdShow:false,
				paymentUserIdList:[],
				checkApiRecharge:false,
				isApiRechargeShow:false,
				channelId:"",
				result:"",
	    	},
        }
    },
    mounted() {
        this.authCode = localStorage.getItem('authCode')
        this.getMsg()
    },
    methods: {
        getMsg() {
            get("/api/console-dlv/option/get-by-type?type=ThirdPaymentType").then(
                data => {
                    this.types = data;
                }
            );
        },
        addChannel() {
            this.addShow = true;
            this.paymentThirdType = "";
            this.payeruserName = "";
            this.others = [];
            this.result = "";
            this.apiPaymentUserId ="";
            this.paymentUserIdList = [];
            this.isApiRechargeShow = false;
            this.isApiPaymentUserIdShow = false;
            this.checkApiRecharge = false;
            this.isApiRecharge = 0;
        },
        deleteRow(e) {
            this.curr = e;
            this.dshow = true;
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
                        this.$refs.authCode.getAccredit(this.setDefault);
                    }
                })
            }
            else {
                this.$refs.authCode.getAccredit(this.setDefault);
            }
        },
        clearForm() {
            this.serviceCompanyId = ''
            this.subServiceList = ''
            this.subServiceCompanyId = ''
            this.subServiceCompanyName = ''
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
        },
        getList() {
            this.others = [];
            this.result = "";
            this.payeruserName = "";
            this.isApiRechargeShow = false;
            this.isApiPaymentUserIdShow = false;
            this.checkApiRecharge = false;
            let paymentThirdType = this.paymentThirdType
            if(paymentThirdType == 'alibank-bank' || paymentThirdType == 'alibank-alipay') {
                paymentThirdType = 'alibank'
            }

            if(paymentThirdType == 'alimybank-bank' || paymentThirdType == 'alimybank-alipay') {
                paymentThirdType = 'aliMYbank'
            }
            if(paymentThirdType == 'alicard'){
            	paymentThirdType = 'alipay'
            }
            post("/api/paymentmgt/front/payuser/qrybycompany", {
                companyId: this.subServiceCompanyId || this.serviceCompanyId,
                thirdpaySystemId: paymentThirdType
            }).then(data => {
                this.others = data;
            });
        },
        pick() {
            var arr = this.others.filter(e => {
                return e.payeruserName == this.payeruserName;
            });
            this.result = arr[0];
            if(this.paymentThirdType=="pingan"){
            	this.isApiRechargeShow = true;
            }else{
            	this.isApiRechargeShow = false;
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
        addRow() {
            if (this.authCode) {
                post(`/api/paymentmgt/front/channel/qrydetail?channelId=${this.result.channelId}`).then(data => {
                    postWithErrorCallback("/api/sysmgr-web/company-app/add-payment-user", {
                        appId: this.appId,
                        payUserNo: this.result.thirdpayUserId,
                        paymentThirdType: this.paymentThirdType,
                        payUserName: this.result.payeruserName,
                        paymentUserId: this.result.userId,
                        authCode: this.authCode,
                        isDefault: this.isDefault,
                        channelAlias: data.channelAlias,
                        channelLoginAcctNo: data.loginAcctno,
                        channelMerCustId: data['cj.merchant_id'] || data['wx.mchid'] || data['partner_id'] || data['mer_id'] || data['alipay.appid'] || data['pingan.mainacct.no'] || data['cmb.nteckopr.eacNbr'] || data['hxb.merchId'] || '',
                        serviceCompanyId: this.serviceCompanyId,
                        subServiceCompanyId: this.subServiceCompanyId,
                        subServiceCompanyName: this.subServiceCompanyName,
						isApiRecharge:this.isApiRecharge,
						apiRechargePayUserId:this.apiPaymentUserId,
						apiRechargePaymentThirdType:this.paymentThirdType,
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
                            this.$refs.authCode.getAccredit(this.addRow);
                        }else{
	                        this.$message({
	                            type: "error",
	                            message: err.message
	                        });
	                        this.query();	
                        }
                    });
                })
            } else {
                this.$refs.authCode.getAccredit(this.addRow);
            }
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
                }).then(data => {
                    this.dshow = false;
                    this.$message({
                        type: "success",
                        message: "删除成功"
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
        transmit(a) {
            Object.assign(this, a)
        },
        getAuthCode(a) {
            this.authCode = a
        },
        updateRowClear(){
        	this.updateDialog.serviceCompanyId = "";
        	this.updateDialog.subServiceCompanyId = "";
        	this.updateDialog.serviceCompanyName = "";
        	this.updateDialog.paymentThirdType = "";
        	this.updateDialog.payeruserName = "";
        	this.updateDialog.userId = "";
        	this.updateDialog.thirdpayUserId = "";
			this.updateDialog.isApiRecharge = "";
			this.updateDialog.apiRechargePaymentUserId = "";
			this.updateDialog.apiRechargePaymentUserName = "";
			this.updateDialog.apiRechargePaymentThirdType = "";
			this.updateDialog.id = "";
			this.updateDialog.checkApiRecharge = false;
			this.other = [];
        },
        updateRow(row){
        	this.updateRowClear();
        	this.updateShow = true;
        	this.updateDialog.serviceCompanyId = row.serviceCompanyId;
        	this.updateDialog.subServiceCompanyId = row.subServiceCompanyId;
        	this.updateDialog.serviceCompanyName = row.serviceCompanyName;
        	this.updateDialog.paymentThirdType = row.thirdPaymentType;
        	this.updateDialog.payeruserName = row.payUserName;
        	this.updateDialog.userId = row.payUserId;
        	this.updateDialog.thirdpayUserId = row.payUserNo;
			this.updateDialog.isApiRecharge = row.isApiRecharge;
			this.updateDialog.apiRechargePaymentUserId = row.apiRechargePaymentUserId;
			this.updateDialog.apiRechargePaymentUserName = row.apiRechargePaymentUserName;
			this.updateDialog.apiRechargePaymentThirdType = row.thirdPaymentType;
			this.updateDialog.id = row.id;
			if(this.updateDialog.isApiRecharge==1){
				this.updateDialog.checkApiRecharge = true;
				this.updateDialog.isApiPaymentUserIdShow = true;
			}else{
				this.updateDialog.checkApiRecharge = false;
				this.updateDialog.isApiPaymentUserIdShow =  false;
			}
			this.$forceUpdate();
			//为了获取到验证码
			post("/api/paymentmgt/front/payuser/qrybycompany", {
                companyId:row.subServiceCompanyId||row.serviceCompanyId,
                thirdpaySystemId: row.thirdPaymentType
            }).then(data => {
                this.others = data;
                var arr = this.others.filter(e => {
            		return e.payeruserName == row.payUserName;
       			});
       			this.updateDialog.result = arr[0]
            });
			if(this.updateDialog.paymentThirdType=="pingan"){
				this.updateDialog.isApiRechargeShow = true;
				postWithErrorCallback("/api/sysmgr-web/company-app/find-payment-user", {
                    appId: this.data.appId,
                    companyId:this.data.companyId,
                    paymentThirdType: row.thirdPaymentType,
                    paymentUserId: row.payUserId,
                    serviceCompanyId: row.serviceCompanyId,
                    subServiceCompanyId: row.subServiceCompanyId,
               }).then(data => {
                	this.updateDialog.paymentUserIdList = data;
                	this.updateDialog.apiPaymentUserId = row.apiRechargePaymentUserId;
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '系统异常,请稍后重试'
                    })
                });
            }else{
            	this.updateDialog.isApiRechargeShow = false;
            }
        },
        changeAddApiRecharge(a){
        	if(a){
        		this.isApiRecharge = 1;
        		postWithErrorCallback("/api/sysmgr-web/company-app/find-payment-user", {
                    appId: this.data.appId,
                    companyId:this.data.companyId,
                    paymentThirdType: this.paymentThirdType,
                    paymentUserId: this.payUserId,
                    serviceCompanyId: this.serviceCompanyId,
                    subServiceCompanyId: this.subServiceCompanyId,
             	}).then(data => {
              		this.paymentUserIdList = data;
              		if(data !==undefined && data.length > 0 ){
              			this.apiPaymentUserId = data[0].userId;	
              		}
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '系统异常,请稍后重试'
                    })
                });
               this.isApiPaymentUserIdShow = true;
        	}else{
				this.isApiRecharge = 0;
				this.isApiPaymentUserIdShow = false;
        	}
        },
        changeUpdateApiRecharge(a){
        	if(a){
        		this.updateDialog.isApiRecharge = 1;
        		postWithErrorCallback("/api/sysmgr-web/company-app/find-payment-user", {
                    appId: this.data.appId,
                    companyId:this.data.companyId,
                    paymentThirdType: this.paymentThirdType,
                    paymentUserId: this.payUserId,
                    serviceCompanyId: this.serviceCompanyId,
                    subServiceCompanyId: this.subServiceCompanyId,
               }).then(data => {
                	this.updateDialog.paymentUserIdList = data;
                	if(data !==undefined && data.length > 0 ){
              			this.updateDialog.apiRechargePaymentUserId = data[0].userId;
              		}
                }).catch(err => {
                    this.$message({
                        type: 'error',
                        message: '系统异常,请稍后重试'
                    })
                });
               this.updateDialog.isApiPaymentUserIdShow = true;
        	}else{
				this.updateDialog.isApiRecharge = 0;
        		this.updateDialog.isApiPaymentUserIdShow = false;
        		updateDialog.paymentUserIdList = [];
        	}
        },
        updateSaveRow(){
        	console.log(this.authCode)
        	if (this.authCode) {
                post(`/api/paymentmgt/front/channel/qrydetail?channelId=${this.updateDialog.result.channelId}`).then(data => {
	                postWithErrorCallback("/api/sysmgr-web/company-app/update-payment-user", {
	                    id:this.updateDialog.id,
	                    appId:this.data.appId,
	                    isApiRecharge:this.updateDialog.isApiRecharge,
	                    apiRechargePaymentThirdType:this.updateDialog.apiRechargePaymentThirdType,
	                    apiRechargePayUserId:this.updateDialog.apiRechargePaymentUserId,
	                    authCode: this.authCode,
	                }).then(data => {
	                    this.updateShow = false;
	                    this.$message({
	                        type: "success",
	                        message: "更新成功"
	                    });
	                    this.query();
	                })
	                .catch(err => {
	                    if (err.message == "无效的授权码！") {
	                        this.$refs.authCode.getAccredit(this.updateSaveRow);
	                    }
	                });
                })
            } else {
                this.$refs.authCode.getAccredit(this.updateSaveRow);
            }
        },
        updatePaymentUserChange(){
        	this.$forceUpdate();
        }
    }
}
</script>
<style scoped>
.title {
    margin: 20px 0px;
    font-weight: bold;
}
</style>
