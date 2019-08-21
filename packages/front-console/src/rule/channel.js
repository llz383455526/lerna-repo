export const commonRule = {
  channelAlias: [{
    required: true,
    message: '请输入别名',
    trigger: 'blur',
  },
  {
    max: 256,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  loginAcctno: [{
    required: true,
    message: '请输入登录账号',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  orderLimit: [{
    required: true,
    message: '请输入单笔限额',
    trigger: 'blur',
  },
  {
    pattern: /^(?:[1-9]+\d*|0)$/,
    message: '请正确输入单笔限额',
    trigger: 'blur',
  },
  {
    max: 20,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  dailyLimit: [{
    required: true,
    message: '请输入每日限额',
    trigger: 'blur',
  },
  {
    pattern: /^(?:[1-9]+\d*|0)$/,
    message: '请正确输入每日限额',
    trigger: 'blur',
  },
  {
    max: 20,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  memo: [{
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  }],
}

export const cjRule = {
  cj$merchant_id: [{
    required: true,
    message: '请输入商户号',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  cj$merchant_public_key: [{
    required: true,
    message: '请输入私钥',
    trigger: 'blur',
  },
  {
    max: 2048,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  cj$merchant_private_key: [{
    required: true,
    message: '请输入公钥',
    trigger: 'blur',
  },
  {
    max: 2048,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
}

export const wxRule = {
  wx$mchid: [{
    required: true,
    message: '请输入商户号',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  wx$submchid: [{
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  }],
  wx$appid: [{
    required: true,
    message: '请输入AppId',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  wx$key: [{
    required: true,
    message: '请输入WxKey',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  wx$apikey: [{
    required: true,
    message: '请输入ApiKey',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  wx$certlocalpath: [{
    required: true,
    message: '请输入证书文件路径',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  wx$certpassword: [{
    required: true,
    message: '请输入证书文件密码',
    trigger: 'blur',
  },
  {
    max: 32,
    message: '输入过长',
    trigger: 'blur',
  },
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
      trigger: 'blur',
    },
  ],
}

export const certPathRule = [
  {
    max: 1024,
    message: '输入过长',
    trigger: 'blur',
  },
  {
    validator(rule, value, cb) {
      if (!value) {
        cb('证书路径不能为空')
      } else if (!value.endsWith('.crt')) {
        cb('证书必须以.crt结尾')
      } else {
        cb()
      }
    },
    trigger: 'blur',
  },
]
export const alipayRule = {
  alipay$appid: [{
    required: true,
    message: '请输入AppId',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alipay$userid: [{
    required: true,
    message: '请输入UserId',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alipay$rsatype: [{
    required: true,
    message: '请输入密钥类型',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alipay$app_private_key: [{
    required: true,
    message: '请输入私钥',
    trigger: 'blur',
  },
  {
    max: 2048,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alipay$alipay_public_key: [{
    required: true,
    message: '请输入公钥',
    trigger: 'blur',
  },
  {
    max: 2048,
    message: '输入过长',
    trigger: 'blur',
  },
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
      trigger: 'blur',
    },
  ],
  alipay$gateway: [{
    required: true,
    message: '请输入支付宝网关',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alipay$hb$notify_url: [{
    required: true,
    message: '请输入红包通知地址',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alipay$deposit$notify_url: [{
    required: true,
    message: '请输入充值通知地址',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alipay$app_cert_path: certPathRule,
  alipay$alipay_cert_path: certPathRule,
  alipay$alipay_root_cert_path: certPathRule,
}

export const yjfRule = {
  partner_id: [
    // {
    //     required: true,
    //     message: '请输入商户号',
    //     trigger: 'blur'
    // },
    {
      max: 128,
      message: '输入过长',
      trigger: 'blur',
    },
  ],
  signtype: [{
    required: true,
    message: '请输入密钥类型',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  sercurity_key: [{
    required: true,
    message: '请输入密钥',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pfx_file_pwd: [{
    required: true,
    message: '请输入密钥文件密码',
    trigger: 'blur',
  },
  {
    max: 32,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pfx_file_fullname: [{
    required: true,
    message: '请输入密钥文件路径',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
}

export const pinganRule = {
  pingan$outercustcode: [{
    required: true,
    message: '请输入外联客户号',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pingan$mainacct$no: [{
    required: true,
    message: '请输入主账号',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pingan$mainacct$name: [{
    required: true,
    message: '请输入主账号名',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pingan$yingziacct$no: [{
    required: true,
    message: '请输入影子账户',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pingan$yingziacct$name: [{
    required: true,
    message: '请输入影子账户名',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pingan$khkf03$limitamount: [{
    required: true,
    message: '请输入单笔转账限额',
    trigger: 'blur',
  },
  {
    pattern: /^(?:[1-9]+\d*|0)$/,
    message: '请正确输入转账限额',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pingan$bank$name: [{
    required: true,
    message: '请输入银行名称',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pingan$depositbank$name: [{
    required: true,
    message: '请输入开户银行名称',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pingan$b2bic$url: [{
    required: true,
    message: '请输入服务器地址',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pingan$upload$path: [{
    required: true,
    message: '请输入上传路径',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  pingan$download$path: [{
    required: true,
    message: '请输入下载路径',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
}

export const cmbRule = {
  cmb$server: [{
    required: true,
    message: '请输入服务器地址',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  cmb$nteckopr$loginName: [{
    required: true,
    message: '请输入登录用户名',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  cmb$nteckopr$eacNbr: [{
    required: true,
    message: '请输入主账号',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  cmb$nteckopr$cmbBkNbr: [{
    required: true,
    message: '请输入分行号',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  cmb$nteckopr$autUSR: [{
    required: true,
    message: '请输入授权使用人',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  cmb$dcpaymnt$cmbBusMod: [{
    required: true,
    message: '请输入直接支付业务模式',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  cmb$nteckopr$cmbBusMod: [{
    required: true,
    message: '请输入移动支票业务模式',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
}

export const hfRule = {
  mer_id: [{
    required: true,
    message: '请输入商户号',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  mer_cust_id: [{
    required: true,
    message: '请输入客户号',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  rec$hf$sftp$host: [{
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  }],
  rec$hf$sftp$port: [{
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  }],
  rec$hf$sftp$dir: [{
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  }],
  rec$hf$sftp$username: [{
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  }],
  rec$hf$sftp$password: [{
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  }],
}

export const hxbRule = {
  hxb$merchId: [{
    required: true,
    message: '请输入商户号',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  hxb$server: [{
    required: true,
    message: '请输入前置机地址',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
}

export const yeepayRule = {
  yeepay$merchId: [{
    required: true,
    message: '请输入商户名',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  yeepay$privatekey: [{
    required: true,
    message: '请输我方私钥',
    trigger: 'blur',
  },
  {
    max: 2048,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  yeepay$thirdPublickey: [{
    required: true,
    message: '请输入公钥',
    trigger: 'blur',
  },
  {
    max: 2048,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
}

export const lianlianpayRule = {
  lianlianpay$merchId: [{
    required: true,
    message: '请输入商户名',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$privatekey: [{
    required: true,
    message: '请输我方私钥',
    trigger: 'blur',
  },
  {
    max: 2048,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$thirdPublickey: [{
    required: true,
    message: '请输入公钥',
    trigger: 'blur',
  },
  {
    max: 2048,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$vou$sftp$host: [{
    required: true,
    message: '请输入对帐sftp地址',
    trigger: 'blur',
  },
  {
    max: 256,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$vou$sftp$port: [{
    required: true,
    message: '请输入对帐sftp端口',
    trigger: 'blur',
  },
  {
    max: 256,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$vou$sftp$username: [{
    required: true,
    message: '请输入对帐sftp用户名',
    trigger: 'blur',
  },
  {
    max: 256,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$vou$sftp$password: [{
    required: true,
    message: '请输入对帐sftp密码',
    trigger: 'blur',
  },
  {
    max: 256,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$rec$sftp$host: [{
    required: true,
    message: '请输入凭证sftp地址',
    trigger: 'blur',
  },
  {
    max: 256,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$rec$sftp$port: [{
    required: true,
    message: '请输入凭证sftp端口',
    trigger: 'blur',
  },
  {
    max: 256,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$rec$sftp$username: [{
    required: true,
    message: '请输入凭证sftp用户名',
    trigger: 'blur',
  },
  {
    max: 256,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$rec$sftp$password: [{
    required: true,
    message: '请输入凭证sftp密码',
    trigger: 'blur',
  },
  {
    max: 256,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  lianlianpay$rec$sftp$dir: [{
    required: true,
    message: '请输入凭证sftp目录',
    trigger: 'blur',
  },
  {
    max: 256,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
}

export const alibankRule = {
  alibank$merchId: [{
    required: true,
    message: '请输入商户名',
    trigger: 'blur',
  },
  {
    max: 128,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alibank$privatekey: [{
    required: true,
    message: '请输我方私钥',
    trigger: 'blur',
  },
  {
    max: 2048,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alibank$thirdPublickey: [{
    required: true,
    message: '请输入公钥',
    trigger: 'blur',
  },
  {
    max: 2048,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alibank$deposit$depositBankName: [{
    required: true,
    message: '请输入开户行',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alibank$deposit$accountName: [{
    required: true,
    message: '请输入开户名称',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  alibank$deposit$account: [{
    required: true,
    message: '请输入账户',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
}

export const xtrRule = {
  xtr$merchId: [{
    required: true,
    message: '请输入商户号',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  xtr$companyId: [
    {
      required: true,
      message: '请输入发薪单位编号',
      trigger: 'blur',
    },
    {
      max: 512,
      message: '输入过长',
      trigger: 'blur',
    },
  ],
  xtr$companyName: [
    {
      required: true,
      message: '请输入发薪单位名称',
      trigger: 'blur',
    },
    {
      max: 512,
      message: '输入过长',
      trigger: 'blur',
    },
  ],
  xtr$channelType: [
    {
      message: '请输入渠道类型',
      trigger: 'blur',
    },
    {
      max: 512,
      message: '输入过长',
      trigger: 'blur',
    },
  ],
  xtr$accountNumber: [
    {
      message: '请输入付款账号',
      trigger: 'blur',
    },
    {
      max: 512,
      message: '输入过长',
      trigger: 'blur',
    },
  ],
  xtr$acctName: [
    {
      message: '请输入付款账户名称',
      trigger: 'blur',
    },
    {
      max: 512,
      message: '输入过长',
      trigger: 'blur',
    },
  ],
  xtr$depositBankName: [
    {
      message: '请输入开户支行名称',
      trigger: 'blur',
    },
    {
      max: 1024,
      message: '输入过长',
      trigger: 'blur',
    },
  ],
  xtr$payPassword: [
    {
      required: false,
      message: '请输入支付密码',
      trigger: 'blur',
    },
    {
      max: 512,
      message: '输入过长',
      trigger: 'blur',
    },
  ],
  xtr$thirdPublickey: [
    {
      required: true,
      message: '请输入薪太软公钥',
      trigger: 'blur',
    },
  ],
  xtr$privatekey: [
    {
      required: true,
      message: '请输入我方私钥',
      trigger: 'blur',
    },
  ],
}

export const aliMYbankRule = {
  aliMYbank$merchId: [{
    required: true,
    message: '请输入商户号',
    trigger: 'blur',
  },
  {
    max: 512,
    message: '输入过长',
    trigger: 'blur',
  },
  ],
  aliMYbank$thirdPublickey: [
    {
      required: true,
      message: '请输入薪太软公钥',
      trigger: 'blur',
    },
  ],
  aliMYbank$privatekeyFilepath: [
    {
      required: true,
      message: '请输入证书文件路径',
      trigger: 'blur',
    },
  ],
  aliMYbank$privatekeyFilepwd: [
    {
      required: true,
      message: '请输入证书文件密码',
      trigger: 'blur',
    },
  ],
  aliMYbank$whiteChannelCode: [
    {
      required: true,
      message: '请输入平台专属出款渠道编码',
      trigger: 'blur',
    },
  ],
  aliMYbank$merchCustCode: [
    {
      required: true,
      message: '请输入网商结算户',
      trigger: 'blur',
    },
  ],
  aliMYbank$deposit$depositBankName: [
    {
      required: true,
      message: '请输入开户行',
      trigger: 'blur',
    },
  ],
  aliMYbank$deposit$accountName: [
    {
      required: true,
      message: '请输入开户名称',
      trigger: 'blur',
    },
  ],
}

export default {
  commonRule,
  cjRule,
  wxRule,
  alipayRule,
  yjfRule,
  pinganRule,
  cmbRule,
  hfRule,
  hxbRule,
  yeepayRule,
  lianlianpayRule,
  alibankRule,
  xtrRule,
  aliMYbankRule,
}
