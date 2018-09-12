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
                <el-form-item label="密钥文件密码" size="small" prop="pfx_file_pwd">
                    <el-input class="form_input" v-model="form.pfx_file_pwd"></el-input>
                </el-form-item>
                <el-form-item label="密钥文件路径" size="small" prop="pfx_file_fullname">
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
            <el-form-item label="备注" prop="memo" size="small">
                <el-input class="form_input" v-model="form.memo"></el-input>
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
import { baseUrl } from "../../config/address.js"
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
      rule: {
        channelAlias: [
          {
            required: true,
            message: "请输入别名",
            trigger: "blur"
          },
          {
            max: 256,
            message: '输入过长',
            trigger: 'blur'
          }
        ],
        loginAcctno: [
          {
            required: true,
            message: "请输入登录账号",
            trigger: "blur"
          },
          {
            max: 128,
            message: '输入过长',
            trigger: 'blur'
          }
        ],
        orderLimit: [
          {
            required: true,
            message: "请输入单笔限额",
            trigger: "blur"
          },
          {
            pattern: /^(?:[1-9]+\d*|0)$/,
            message: '请正确输入单笔限额',
            trigger: "blur"
          },
          {
            max: 20,
            message: '输入过长',
            trigger: 'blur'
          }
        ],
        dailyLimit: [
          {
            required: true,
            message: "请输入每日限额",
            trigger: "blur"
          },
          {
            pattern: /^(?:[1-9]+\d*|0)$/,
            message: '请正确输入每日限额',
            trigger: "blur"
          },
          {
            max: 20,
            message: '输入过长',
            trigger: 'blur'
          }
        ],
        memo: [
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        cj$merchant_id: [
            {
                required: true,
                message: '请输入商户号',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        cj$merchant_public_key: [
            {
                required: true,
                message: '请输入私钥',
                trigger: 'blur'
            },
            {
                max: 2048,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        cj$merchant_private_key: [
            {
                required: true,
                message: '请输入公钥',
                trigger: 'blur'
            },
            {
                max: 2048,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        wx$mchid: [
            {
                required: true,
                message: '请输入商户号',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        wx$submchid: [
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        wx$appid: [
            {
                required: true,
                message: '请输入AppId',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        wx$key: [
            {
                required: true,
                message: '请输入WxKey',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        wx$apikey: [
            {
                required: true,
                message: '请输入ApiKey',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        wx$certlocalpath: [
            {
                required: true,
                message: '请输入证书文件路径',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        wx$certpassword: [
            {
                required: true,
                message: '请输入证书文件密码',
                trigger: 'blur'
            },
            {
                max: 32,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        wx$notify_url: [
            // {
            //     required: true,
            //     message: '请输入通知地址',
            //     trigger: 'blur'
            // },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        alipay$appid: [
            {
                required: true,
                message: '请输入AppId',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        alipay$userid: [
            {
                required: true,
                message: '请输入UserId',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        alipay$rsatype: [
            {
                required: true,
                message: '请输入密钥类型',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        alipay$app_private_key: [
            {
                required: true,
                message: '请输入私钥',
                trigger: 'blur'
            },
            {
                max: 2048,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        alipay$alipay_public_key: [
            {
                required: true,
                message: '请输入公钥',
                trigger: 'blur'
            },
            {
                max: 2048,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        alipay$mapi_md5_key: [
            // {
            //     required: true,
            //     message: '请输入密钥',
            //     trigger: 'blur'
            // },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        alipay$gateway: [
            {
                required: true,
                message: '请输入支付宝网关',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        alipay$hb$notify_url: [
            {
                required: true,
                message: '请输入红包通知地址',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        alipay$deposit$notify_url: [
            {
                required: true,
                message: '请输入充值通知地址',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        partner_id: [
            // {
            //     required: true,
            //     message: '请输入商户号',
            //     trigger: 'blur'
            // },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        signtype: [
            {
                required: true,
                message: '请输入密钥类型',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        sercurity_key: [
            {
                required: true,
                message: '请输入密钥',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pfx_file_pwd: [
            {
                required: true,
                message: '请输入密钥文件密码',
                trigger: 'blur'
            },
            {
                max: 32,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pfx_file_fullname: [
            {
                required: true,
                message: '请输入密钥文件路径',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$outercustcode: [
            {
                required: true,
                message: '请输入外联客户号',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$mainacct$no: [
            {
                required: true,
                message: '请输入主账号',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$mainacct$name: [
            {
                required: true,
                message: '请输入主账号名',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$yingziacct$no: [
            {
                required: true,
                message: '请输入影子账户',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$yingziacct$name: [
            {
                required: true,
                message: '请输入影子账户名',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$khkf03$limitamount: [
            {
                required: true,
                message: '请输入单笔转账限额',
                trigger: 'blur'
            },
            {
                pattern: /^(?:[1-9]+\d*|0)$/,
                message: '请正确输入转账限额',
                trigger: "blur"
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$bank$name: [
            {
                required: true,
                message: '请输入银行名称',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$depositbank$name: [
            {
                required: true,
                message: '请输入开户银行名称',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$b2bic$url: [
            {
                required: true,
                message: '请输入服务器地址',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$upload$path: [
            {
                required: true,
                message: '请输入上传路径',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        pingan$download$path: [
            {
                required: true,
                message: '请输入下载路径',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        cmb$server: [
            {
                required: true,
                message: '请输入服务器地址',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        cmb$nteckopr$loginName: [
            {
                required: true,
                message: '请输入登录用户名',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        cmb$nteckopr$eacNbr: [
            {
                required: true,
                message: '请输入主账号',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        cmb$nteckopr$cmbBkNbr: [
            {
                required: true,
                message: '请输入分行号',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        cmb$nteckopr$autUSR: [
            {
                required: true,
                message: '请输入授权使用人',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        cmb$dcpaymnt$cmbBusMod: [
            {
                required: true,
                message: '请输入直接支付业务模式',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        cmb$nteckopr$cmbBusMod: [
            {
                required: true,
                message: '请输入移动支票业务模式',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        mer_id: [
            {
                required: true,
                message: '请输入商户号',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        mer_cust_id: [
            {
                required: true,
                message: '请输入客户号',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        rec$hf$sftp$host: [
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        rec$hf$sftp$port: [
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        rec$hf$sftp$dir: [
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        rec$hf$sftp$username: [
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        rec$hf$sftp$password: [
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        hxb$merchId: [
            {
                required: true,
                message: '请输入商户号',
                trigger: 'blur'
            },
            {
                max: 128,
                message: '输入过长',
                trigger: 'blur'
            }
        ],
        hxb$server: [
            {
                required: true,
                message: '请输入前置机地址',
                trigger: 'blur'
            },
            {
                max: 512,
                message: '输入过长',
                trigger: 'blur'
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
      msg: '',
      baseUrl
    };
  },
  mounted() {
    console.log(this.form)
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
    post("/api/sysmgr-web/company-app/get-two-step-phone").then(data => {
        this.phone = data;
    });
    this.createId();
    get("/api/console-dlv/option/get-option-service-companies").then(data => {
      this.company = data;
    });
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
.form_input {
  width: 500px;
}
.tool {
  margin: 20px 0;
}
</style>