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
      <!-- <el-form :model="form" :rules="rule" ref="ruleForm" label-width="100px">
        <el-form-item label="活动名称" prop="channelAlias">
            <el-input v-model="form.channelAlias"></el-input>
        </el-form-item>
      </el-form> -->
      <el-form :model="form" :rules="rule" label-width="200px" ref="form">
            <el-form-item label="渠道别名" prop="channelAlias" size="small">
                <el-input class="form_input" v-model="form.channelAlias"></el-input>
            </el-form-item>
            <el-form-item label="登录帐号" prop="loginAcctno" size="small">
                <el-input class="form_input" v-model="form.loginAcctno"></el-input>
            </el-form-item>
            <el-form-item label="单笔限额（元）" prop="orderLimit" size="small">
                <el-input class="form_input" v-model="form.orderLimit "></el-input>
            </el-form-item>
            <el-form-item label="单日限额（元）" prop="dailyLimit" size="small">
                <el-input class="form_input" v-model="form.dailyLimit "></el-input>
            </el-form-item>
            <template v-if="form.thirdpaySystemId == 'changjie'">
                <el-form-item label="商户号" size="small" prop="cj$merchant_id">
                    <el-input class="form_input" v-model="form['cj$merchant_id']"></el-input>
                </el-form-item>
                <el-form-item label="我方私钥" size="small" prop="cj$merchant_private_key">
                    <el-input class="form_input" v-model="form.cj$merchant_private_key"></el-input>
                </el-form-item>
                <el-form-item label="畅捷公钥" size="small" prop="cj$merchant_public_key">
                    <el-input class="form_input" v-model="form.cj$merchant_public_key"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.thirdpaySystemId == 'wx'">
                <el-form-item label="商户号" size="small" prop="wx$mchid">
                    <el-input class="form_input" v-model="form.wx$mchid"></el-input>
                </el-form-item>
                <el-form-item label="子商户号" size="small" prop="wx$submchid">
                    <el-input class="form_input" v-model="form.wx$submchid"></el-input>
                </el-form-item>
                <el-form-item label="APPID" size="small" prop="wx$appid">
                    <el-input class="form_input" v-model="form.wx$appid"></el-input>
                </el-form-item>
                <el-form-item label="WXKEY" size="small" prop="wx$key">
                    <el-input class="form_input" v-model="form.wx$key"></el-input>
                </el-form-item>
                <el-form-item label="APIKEY" size="small" prop="wx$apikey">
                    <el-input class="form_input" v-model="form.wx$apikey"></el-input>
                </el-form-item>
                <el-form-item label="证书文件路径" size="small" prop="wx$certlocalpath">
                    <el-input class="form_input" v-model="form.wx$certlocalpath"></el-input>
                </el-form-item>
                <el-form-item label="证书文件密码" size="small" prop="wx$certpassword">
                    <el-input class="form_input" v-model="form.wx$certpassword"></el-input>
                </el-form-item>
                <el-form-item label="通知地址" size="small" prop="wx$notify_url">
                    <el-input class="form_input" v-model="form.wx$notify_url"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.thirdpaySystemId == 'alipay'">
                <el-form-item label="APPID" size="small" prop="alipay$appid">
                    <el-input class="form_input" v-model="form.alipay$appid"></el-input>
                </el-form-item>
                <el-form-item label="USERID" size="small" prop="alipay$userid">
                    <el-input class="form_input" v-model="form.alipay$userid"></el-input>
                </el-form-item>
                <el-form-item label="密钥类型" size="small" prop="alipay$rsatype">
                    <el-input class="form_input" v-model="form.alipay$rsatype"></el-input>
                </el-form-item>
                <el-form-item label="我方私钥" size="small" prop="alipay$app_private_key">
                    <el-input class="form_input" v-model="form.alipay$app_private_key"></el-input>
                </el-form-item>
                <el-form-item label="支付宝公钥" size="small" prop="alipay$alipay_public_key">
                    <el-input class="form_input" v-model="form.alipay$alipay_public_key"></el-input>
                </el-form-item>
                <el-form-item label="MAPI(md5)密钥" size="small" prop="alipay$mapi_md5_key">
                    <el-input class="form_input" v-model="form.alipay$mapi_md5_key"></el-input>
                </el-form-item>
                <el-form-item label="支付宝网关" size="small" prop="alipay$gateway">
                    <el-input class="form_input"  v-model="form.alipay$gateway"></el-input>
                </el-form-item>
                <el-form-item label="红包通知地址" size="small" prop="alipay$hb$notify_url">
                    <el-input class="form_input"  v-model="form.alipay$hb$notify_url"></el-input>
                </el-form-item>
                <el-form-item label="充值通知地址" size="small" prop="alipay$deposit$notify_url">
                    <el-input class="form_input"  v-model="form.alipay$deposit$notify_url"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.thirdpaySystemId == 'yjf'">
                <el-form-item label="商户号" size="small" prop="partner_id">
                    <el-input class="form_input" v-model="form.partner_id"></el-input>
                </el-form-item>
                <el-form-item label="密钥类型" size="small" prop="signtype">
                    <el-input class="form_input" v-model="form.signtype"></el-input>
                </el-form-item>
                <el-form-item label="密钥" size="small" prop="sercurity_key">
                    <el-input class="form_input" v-model="form.sercurity_key"></el-input>
                </el-form-item>
                <el-form-item label="密钥文件密码" size="small" prop="pfx_file_pwd">
                    <el-input class="form_input" v-model="form.pfx_file_pwd"></el-input>
                </el-form-item>
                <el-form-item label="密钥文件路径" size="small" prop="pfx_file_fullname">
                    <el-input class="form_input" v-model="form.pfx_file_fullname"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.thirdpaySystemId == 'pingan'">
                <el-form-item label="外联客户号" size="small" prop="pingan$outercustcode">
                    <el-input class="form_input" v-model="form.pingan$outercustcode"></el-input>
                </el-form-item>
                <el-form-item label="主账号" size="small" prop="pingan$mainacct$no">
                    <el-input class="form_input" v-model="form.pingan$mainacct$no"></el-input>
                </el-form-item>
                <el-form-item label="主账号名" size="small" prop="pingan$mainacct$name">
                    <el-input class="form_input" v-model="form.pingan$mainacct$name"></el-input>
                </el-form-item>
                <el-form-item label="影子账户" size="small" prop="pingan$yingziacct$no">
                    <el-input class="form_input" v-model="form.pingan$yingziacct$no"></el-input>
                </el-form-item>
                <el-form-item label="影子账户名" size="small" prop="pingan$yingziacct$name">
                    <el-input class="form_input" v-model="form.pingan$yingziacct$name"></el-input>
                </el-form-item>
                <el-form-item label="单笔转账限额" size="small" prop="pingan$khkf03$limitamount">
                    <el-input class="form_input" v-model="form.pingan$khkf03$limitamount"></el-input>
                </el-form-item>
                <el-form-item label="银行名称" size="small" prop="pingan$bank$name">
                    <el-input class="form_input" v-model="form.pingan$bank$name"></el-input>
                </el-form-item>
                <el-form-item label="开户银行名称" size="small" prop="pingan$depositbank$name">
                    <el-input class="form_input" v-model="form.pingan$depositbank$name"></el-input>
                </el-form-item>
                <el-form-item label="服务器地址" size="small" prop="pingan$b2bic$url">
                    <el-input class="form_input"  v-model="form.pingan$b2bic$url"></el-input>
                </el-form-item>
                <el-form-item label="上传路径" size="small" prop="pingan$upload$path">
                    <el-input class="form_input"  v-model="form.pingan$upload$path"></el-input>
                </el-form-item>
                <el-form-item label="下载路径" size="small" prop="pingan$download$path">
                    <el-input class="form_input"  v-model="form.pingan$download$path"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.thirdpaySystemId == 'cmb'">
                <el-form-item label="服务器地址" size="small" prop="cmb$server">
                    <el-input class="form_input" v-model="form.cmb$server"></el-input>
                </el-form-item>
                <el-form-item label="登录用户名" size="small" prop="cmb$nteckopr$loginName">
                    <el-input class="form_input" v-model="form.cmb$nteckopr$loginName"></el-input>
                </el-form-item>
                <el-form-item label="主账号" size="small" prop="cmb$nteckopr$eacNbr">
                    <el-input class="form_input" v-model="form.cmb$nteckopr$eacNbr"></el-input>
                </el-form-item>
                <el-form-item label="分行号" size="small" prop="cmb$nteckopr$cmbBkNbr">
                    <el-input class="form_input" v-model="form.cmb$nteckopr$cmbBkNbr"></el-input>
                </el-form-item>
                <el-form-item label="授权使用人" size="small" prop="cmb$nteckopr$autUSR">
                    <el-input class="form_input" v-model="form.cmb$nteckopr$autUSR"></el-input>
                </el-form-item>
                <el-form-item label="直接支付业务模式" size="small" prop="cmb$dcpaymnt$cmbBusMod">
                    <el-input class="form_input" v-model="form.cmb$dcpaymnt$cmbBusMod"></el-input>
                </el-form-item>
                <el-form-item label="移动支票业务模式" size="small" prop="cmb$nteckopr$cmbBusMod">
                    <el-input class="form_input" v-model="form.cmb$nteckopr$cmbBusMod"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.thirdpaySystemId == 'hf'">
                <el-form-item label="商户号" size="small" prop="mer_id">
                    <el-input class="form_input" v-model="form.mer_id"></el-input>
                </el-form-item>
                <el-form-item label="客户号" size="small" prop="mer_cust_id">
                    <el-input class="form_input" v-model="form.mer_cust_id"></el-input>
                </el-form-item>
                <el-form-item label="证书文件密码" size="small" prop="pfx_file_pwd">
                    <el-input class="form_input" v-model="form.pfx_file_pwd"></el-input>
                </el-form-item>
                <el-form-item label="证书文件路径" size="small" prop="pfx_file_fullname">
                    <el-input class="form_input" v-model="form.pfx_file_fullname"></el-input>
                </el-form-item>
                <el-form-item label="对账sftp地址" size="small" prop="rec$hf$sftp$host">
                    <el-input class="form_input" v-model="form.rec$hf$sftp$host"></el-input>
                </el-form-item>
                <el-form-item label="对账sftp端口" size="small" prop="rec$hf$sftp$port">
                    <el-input class="form_input" v-model="form.rec$hf$sftp$port"></el-input>
                </el-form-item>
                <el-form-item label="对账sftp目录" size="small" prop="rec$hf$sftp$dir">
                    <el-input class="form_input" v-model="form.rec$hf$sftp$dir"></el-input>
                </el-form-item>
                <el-form-item label="对帐sftp用户名" size="small" prop="rec$hf$sftp$username">
                    <el-input class="form_input" v-model="form.rec$hf$sftp$username"></el-input>
                </el-form-item>
                <el-form-item label="对帐sftp密码" size="small" prop="rec$hf$sftp$password">
                    <el-input class="form_input" v-model="form.rec$hf$sftp$password"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.thirdpaySystemId == 'hxb'">
                <el-form-item label="商户号" size="small" prop="hxb$merchId">
                    <el-input class="form_input" v-model="form.hxb$merchId"></el-input>
                </el-form-item>
                <el-form-item label="前置机地址" size="small" prop="hxb$server">
                    <el-input class="form_input" v-model="form.hxb$server"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.thirdpaySystemId == 'yeepay'">
                <el-form-item label="商户号" size="small" prop="yeepay$merchId">
                    <el-input class="form_input" v-model="form.yeepay$merchId"></el-input>
                </el-form-item>
                <el-form-item label="我方私钥" size="small" prop="yeepay$privatekey">
                    <el-input class="form_input" v-model="form.yeepay$privatekey"></el-input>
                </el-form-item>
                <el-form-item label="易宝公钥" size="small" prop="yeepay$thirdPublickey">
                    <el-input class="form_input" v-model="form.yeepay$thirdPublickey"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.thirdpaySystemId == 'lianlianpay'">
                <el-form-item label="商户号" size="small" prop="lianlianpay$merchId">
                    <el-input class="form_input" v-model="form.lianlianpay$merchId"></el-input>
                </el-form-item>
                <el-form-item label="我方私钥" size="small" prop="lianlianpay$privatekey">
                    <el-input class="form_input" v-model="form.lianlianpay$privatekey"></el-input>
                </el-form-item>
                <el-form-item label="连连支付公钥" size="small" prop="lianlianpay$thirdPublickey">
                    <el-input class="form_input" v-model="form.lianlianpay$thirdPublickey"></el-input>
                </el-form-item>
                <el-form-item label="凭证sftp地址" size="small" prop="lianlianpay$vou$sftp$host">
                    <el-input class="form_input" v-model="form.lianlianpay$vou$sftp$host"></el-input>
                </el-form-item>
                <el-form-item label="凭证sftp端口" size="small" prop="lianlianpay$vou$sftp$port">
                    <el-input class="form_input" v-model="form.lianlianpay$vou$sftp$port"></el-input>
                </el-form-item>
                <el-form-item label="凭证sftp用户名" size="small" prop="lianlianpay$vou$sftp$username">
                    <el-input class="form_input" v-model="form.lianlianpay$vou$sftp$username"></el-input>
                </el-form-item>
                <el-form-item label="凭证sftp密码" size="small" prop="lianlianpay$vou$sftp$password">
                    <el-input class="form_input" v-model="form.lianlianpay$vou$sftp$password"></el-input>
                </el-form-item>
                
                <el-form-item label="对账sftp地址" size="small" prop="lianlianpay$rec$sftp$host">
                    <el-input class="form_input" v-model="form.lianlianpay$rec$sftp$host"></el-input>
                </el-form-item>
                <el-form-item label="对账sftp端口" size="small" prop="lianlianpay$rec$sftp$port">
                    <el-input class="form_input" v-model="form.lianlianpay$rec$sftp$port"></el-input>
                </el-form-item>
                <el-form-item label="对账sftp用户名" size="small" prop="lianlianpay$rec$sftp$username">
                    <el-input class="form_input" v-model="form.lianlianpay$rec$sftp$username"></el-input>
                </el-form-item>
                <el-form-item label="对账sftp密码" size="small" prop="lianlianpay$rec$sftp$password">
                    <el-input class="form_input" v-model="form.lianlianpay$rec$sftp$password"></el-input>
                </el-form-item>
                <el-form-item label="对账sftp目录" size="small" prop="lianlianpay$rec$sftp$dir">
                    <el-input class="form_input" v-model="form.lianlianpay$rec$sftp$dir"></el-input>
                </el-form-item>
            </template>
            <template v-if="form.thirdpaySystemId == 'alibank'">
                <el-form-item label="商户号" size="small" prop="alibank$merchId">
                    <el-input class="form_input" v-model="form.alibank$merchId"></el-input>
                </el-form-item>
                <el-form-item label="我方私钥" size="small" prop="alibank$privatekey">
                    <el-input class="form_input" v-model="form.alibank$privatekey"></el-input>
                </el-form-item>
                <el-form-item label="阿里网商公钥" size="small" prop="alibank$thirdPublickey">
                    <el-input class="form_input" v-model="form.alibank$thirdPublickey"></el-input>
                </el-form-item>
                <el-form-item label="开户行" size="small" prop="alibank$deposit$depositBankName">
                    <el-input class="form_input" v-model="form.alibank$deposit$depositBankName"></el-input>
                </el-form-item>
                <el-form-item label="开户名称" size="small" prop="alibank$deposit$accountName">
                    <el-input class="form_input" v-model="form.alibank$deposit$accountName"></el-input>
                </el-form-item>
                <el-form-item label="账户" size="small" prop="alibank$deposit$account">
                    <el-input class="form_input" v-model="form.alibank$deposit$account"></el-input>
                </el-form-item>
            </template>
            <el-form-item label="备注" prop="memo" size="small">
                <el-input class="form_input" v-model="form.memo"></el-input>
            </el-form-item>
      </el-form>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback } from "../../store/api"
import rule from '../../rule/channel.js'
export default {
  data() {
    return {
      form: {
        id: '',
        thirdpaySystemId: '',
        companyId: '',
        companyName: '',
        channelAlias: '',
        orderLimit: '',
        dailyLimit: '',
        memo: '',
        loginAcctno: ''
      },
      rule
    };
  },
  mounted() {
    Object.assign(this.form, this.$route.query)
    if(this.form.thirdpaySystemId == 'changjie'){
        Object.assign(this.form, {
            'cj$merchant_id': '',
            'cj$merchant_public_key': '',
            'cj$merchant_private_key': '',
        })
    }
    if(this.form.thirdpaySystemId == 'wx'){
        Object.assign(this.form, {
            'wx$mchid': '',
            'wx$submchid': '',
            'wx$appid': '',
            'wx$key': '',
            'wx$apikey': '',
            'wx$certlocalpath': '',
            'wx$certpassword': '',
            'wx$notify_url': ''
        })
    }
    if(this.form.thirdpaySystemId == 'alipay'){
        Object.assign(this.form, {
            'alipay$appid': '',
            'alipay$userid': '',
            'alipay$rsatype': '',
            'alipay$app_private_key': '',
            'alipay$alipay_public_key': '',
            'alipay$mapi_md5_key': '',
            'alipay$gateway': 'https://openapi.alipay.com/gateway.do',
            'alipay$hb$notify_url': 'https://hmjsjopenapi.aiyuangong.net/payment/api/alipay/async/hb',
            'alipay$deposit$notify_url': 'https://hmjsjopenapi.aiyuangong.net/payment/api/alipay/async/deposit'
        })
    }
    if(this.form.thirdpaySystemId == 'yjf'){
        Object.assign(this.form, {
            'partner_id': '',
            'signtype': '',
            'sercurity_key': '',
            'pfx_file_pwd': '',
            'pfx_file_fullname': ''
        })
        if(this.rule.signtype[0].required) {
            this.rule.signtype.shift()
        }
        if(this.rule.sercurity_key[0].required) {
            this.rule.sercurity_key.shift()
        }
        if(this.rule.pfx_file_pwd[0].required) {
            this.rule.pfx_file_pwd.shift()
        }
        if(this.rule.pfx_file_fullname[0].required) {
            this.rule.pfx_file_fullname.shift()
        }
    }
    if(this.form.thirdpaySystemId == 'pingan'){
        Object.assign(this.form, {
            'pingan$outercustcode': '',
            'pingan$mainacct$no': '',
            'pingan$mainacct$name': '',
            'pingan$yingziacct$no': '',
            'pingan$yingziacct$name': '',
            'pingan$khkf03$limitamount': '',
            'pingan$bank$name': '',
            'pingan$depositbank$name': '',
            'pingan$b2bic$url': 'http://10.29.209.231:7072',
            'pingan$upload$path': '/mnt/nfs',
            'pingan$download$path': '/mnt/nfs'
        })
    }
    if(this.form.thirdpaySystemId == 'cmb'){
        Object.assign(this.form, {
            'cmb$server': '',
            'cmb$nteckopr$loginName': '',
            'cmb$nteckopr$cmbBkNbr': '',
            'cmb$nteckopr$eacNbr': '',
            'cmb$nteckopr$cmbBusMod': '',
            'cmb$nteckopr$autUSR': '',
            'cmb$dcpaymnt$cmbBusMod': ''
        })
    }
    if(this.form.thirdpaySystemId == 'hf'){
        Object.assign(this.form, {
            'mer_id': '',
            'mer_cust_id': '',
            'pfx_file_fullname': '',
            'pfx_file_pwd': '',
            'rec$hf$sftp$host': '',
            'rec$hf$sftp$port': '',
            'rec$hf$sftp$dir': '',
            'rec$hf$sftp$username': '',
            'rec$hf$sftp$password': ''
        })
    }
    if(this.form.thirdpaySystemId == 'hxb'){
        Object.assign(this.form, {
            'hxb$merchId': '',
            'hxb$server': ''
        })
    }
    if(this.form.thirdpaySystemId == 'yeepay'){
        Object.assign(this.form, {
            'yeepay$merchId': '',
            'yeepay$privatekey': '',
            'yeepay$thirdPublickey': ''
        })
    }
    if(this.form.thirdpaySystemId == 'lianlianpay'){
        Object.assign(this.form, {
            'lianlianpay$merchId': '',
            'lianlianpay$privatekey': '',
            'lianlianpay$thirdPublickey': '',
            'lianlianpay$vou$sftp$host': '',
            'lianlianpay$vou$sftp$port': '',
            'lianlianpay$vou$sftp$username': '',
            'lianlianpay$vou$sftp$password': '',

            'lianlianpay$rec$sftp$host': '',
            'lianlianpay$rec$sftp$port': '',
            'lianlianpay$rec$sftp$username': '',
            'lianlianpay$rec$sftp$password': '',
            'lianlianpay$rec$sftp$dir': ''
        })
    }
    if(this.form.thirdpaySystemId == 'alibank'){
        Object.assign(this.form, {
            'alibank$merchId': '',
            'alibank$privatekey': '',
            'alibank$thirdPublickey': '',
            'alibank$deposit$depositBankName': '',
            'alibank$deposit$accountName': '',
            'alibank$deposit$account': ''
        })
    }
  },
  methods: {
    back() {
      this.$router.back();
    },
    sure(e) {
        this.$refs['form'].validate(valid => {
            if(valid) {
                var form = {}
                for( var k in this.form) {
                    var newKey = k.replace(/\$/g, '.')
                    form[newKey] = this.form[k]
                }
                post("/api/paymentmgt/front/channel/add", form).then(data => {
                  console.log(data);
                  this.eshow = false;
                  this.$message({
                    type: "success",
                    message: "添加成功！"
                  });
                  this.back()
                })
            }
        })
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
</style>