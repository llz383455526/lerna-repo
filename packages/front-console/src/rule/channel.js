const validateRule = {
  requiredRule(required = true, message = '', trigger = 'blur') {
    return {
      required,
      message: `请输入${message}`,
      trigger,
    }
  },
  lengthRule(max = 256, message = '', trigger = 'blur') {
    return {
      max,
      message: message || `输入长度不能超过${max}`,
      trigger,
    }
	},
	patternRule(pattern, message='', trigger = 'blur'){
		return {
			pattern: /^(?:[1-9]+\d*|0)$/,
			message: `请正确输入${message}`,
			trigger,
		}
	},
	validator(validator, trigger = 'blur'){
		return {
			validator,
			trigger,
		}
	}
}
function ruleGenerate(propList) {
	let result = {}
	propList.forEach(item => {
		let required = (item.required===false) ? false : true
		let requiredRule = validateRule.requiredRule(required, item.title)
		let lengthRule = item.length!==-1 ? validateRule.lengthRule(item.length||512) : {}
		let patternRule = item.pattern ? validateRule.patternRule(item.pattern, item.title, item.trigger) : {}
		let validatorRule = item.validator ? validateRule.validator(item.validator) : {}
		result[item.prop] = [
			requiredRule,
			lengthRule,
			patternRule,
			validatorRule
		]
	})
	return result
}

const certPathValidator = (rule, value, cb)=>{
	if (!value) {
		cb('证书路径不能为空')
	} else if (!value.endsWith('.crt')) {
		cb('证书必须以.crt结尾')
	} else {
		cb()
	}
}

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

//支付宝
export const alipayProp =[
	{prop: 'alipay$appid', title: 'AppId', length: 128},
	{prop: 'alipay$userid', title: 'UserId', length: 512},
	{prop: 'alipay$rsatype', title: '密钥类型', length: 512},
	{prop: 'alipay$app_private_key', title: '私钥', length: 2048},
	{prop: 'alipay$alipay_public_key', title: '支付宝公钥', length: 2048},
	{prop: 'alipay$mapi_md5_key', title: 'MAPI(md5)密钥', length: 512, required: false},
	{prop: 'alipay$gateway', title: '支付宝网关', length: 512},
	{prop: 'alipay$hb$notify_url', title: '红包通知地址', length: 512},
	{prop: 'alipay$deposit$notify_url', title: '充值通知地址', length: 512},
	{prop: 'alipay$app_cert_path', title: '应用公钥证书路径', length: 1024,validator:certPathValidator},
	{prop: 'alipay$alipay_cert_path', title: '支付宝公钥证书路径', length: 1024,validator:certPathValidator},
	{prop: 'alipay$alipay_root_cert_path', title: '支付宝根证书路径', length: 1024,validator:certPathValidator},
]
export const alipayRule = ruleGenerate(alipayProp)

//阿里网商
export const alibankProp = [
	{prop: 'alibank$merchId', title: '商户名', length: 128},
	{prop: 'alibank$privatekey', title: '我方私钥', length: 2048},
	{prop: 'alibank$thirdPublickey', title: '阿里网商公钥', length: 2048},
	{prop: 'alibank$deposit$depositBankName', title: '开户行', length: 512},
	{prop: 'alibank$deposit$accountName', title: '开户行名称', length: 512},
	{prop: 'alibank$deposit$account', title: '账户', length: 512},
]
export const alibankRule = ruleGenerate(alibankProp)

// 阿里网商直连
export const aliMYbankProp = [
	{prop: 'aliMYbank$merchId', title: '商户号', length: 128},
	{prop: 'alibank$privatekey', title: '我方私钥', length: 2048},
	{prop: 'aliMYbank$thirdPublickey', title: '第三方公钥', length: 2048},
	{prop: 'aliMYbank$privatekeyFilepath', title: '证书文件路径', length: 512},
	{prop: 'aliMYbank$privatekeyFilepwd', title: '证书文件密码', length: 512},
	{prop: 'aliMYbank$whiteChannelCode', title: '平台专属出款渠道编码', length: 512},
	{prop: 'aliMYbank$merchCustCode', title: '网商结算户', length: 512},
	{prop: 'aliMYbank$deposit$depositBankName', title: '开户行', length: 512},
	{prop: 'aliMYbank$deposit$accountName', title: '开户行名称', length: 512},
]
export const aliMYbankRule = ruleGenerate(aliMYbankProp)
// 畅捷
export const changjieProp = [
	{prop: 'cj$merchant_id', title: '客户号', length: 128},
	{prop: 'cj$merchant_public_key', title: '畅捷公钥', length: 2028},
	{prop: 'cj$merchant_private_key', title: '我方私钥', length: 2028}
]
export const changjieRule = ruleGenerate(changjieProp)

// 招商
export const cmbProp = [
	{prop: 'cmb$server', title: '前置机地址', length: 512},
	{prop: 'cmb$goserver$front', title: '前置机GoServer地址', length: 512},
	{prop: 'cmb$nteckopr$loginName', title: '登录用户名', length: 512},
	{prop: 'cmb$nteckopr$eacNbr', title: '主账号', length: 512},
	{prop: 'cmb$mainacc$name', title: '主账号户名', length: 512},
	{prop: 'cmb$nteckopr$cmbBkNbr', title: '主账号开户分行号', length: 512},
	{prop: 'cmb$mainacc$bankname', title: '主账号开户分行名称', length: 512},
	{prop: 'cmb$nteckopr$autUSR', title: '授权使用人', length: 512},
	{prop: 'cmb$dcpaymnt$cmbBusMod', title: '直接支付业务模式', length: 512},
	{prop: 'cmb$nteckopr$cmbBusMod', title: '移动支票业务模式', length: 512}
]
export const cmbRule = ruleGenerate(cmbProp)

//汇付
export const hfProp =[
	{prop: 'mer_id', title: '商户号', length: 128},
	{prop: 'mer_cust_id', title: '客户号', length: 128},
	{prop: 'rec$hf$sftp$host', title: '对账sftp地址', length: 512, required: false},
	{prop: 'rec$hf$sftp$port', title: '对账sftp端口', length: 512, required: false},
	{prop: 'rec$hf$sftp$dir', title: '对账sftp目录', length: 512, required: false},
	{prop: 'rec$hf$sftp$username', title: '对帐sftp用户名', length: 512, required: false},
	{prop: 'rec$hf$sftp$password', title: '对帐sftp密码', length: 512, required: false},
	{prop: 'hf$rec$api$use$http', title: '对账单是否使用http下载', length: -1, required: false},
	{prop: 'hf$msg$sign$base64$disable', title: 'msg是否忽略base64转换', length: -1, required: false},
]
export const hfRule = ruleGenerate(hfProp)

//华夏银行
export const hxbProp =  [
	{prop: 'hxb$merchId', title: '商户号', length: 128},
	{prop: 'hxb$server', title: '前置机地址', length: 512},
]
export const hxbRule = ruleGenerate(hxbProp)

// 连连支付
export const lianlianpayProp = [
	{prop: 'lianlianpay$merchId', title: '商户号', length: 128},
	{prop: 'lianlianpay$privatekey', title: '我方私钥', length: 2048},
	{prop: 'lianlianpay$thirdPublickey', title: '连连支付公钥', length: 2048},
	{prop: 'lianlianpay$vou$sftp$host', title: '凭证sftp地址', length: 256},
	{prop: 'lianlianpay$vou$sftp$port', title: '凭证sftp端口', length: 256},
	{prop: 'lianlianpay$vou$sftp$username', title: '凭证sftp用户名', length: 256},
	{prop: 'lianlianpay$vou$sftp$password', title: '凭证sftp用户密码', length: 256},
	{prop: 'lianlianpay$vou$sftp$password', title: '凭证sftp用户密码', length: 256},
	{prop: 'lianlianpay$rec$sftp$host', title: '对账sftp用户地址', length: 256},
	{prop: 'lianlianpay$rec$sftp$port', title: '对账sftp用户端口', length: 256},
	{prop: 'lianlianpay$rec$sftp$username', title: '对账sftp用户名', length: 256},
	{prop: 'lianlianpay$rec$sftp$password', title: '对账sftp密码', length: 256},
	{prop: 'lianlianpay$rec$sftp$dir', title: '对账sftp目录', length: 256},
]
export const lianlianpayRule = ruleGenerate(lianlianpayProp)

//平安
export const pinganProp = [
	{prop: 'pingan$outercustcode', title: '外联客户号', length: 128},
	{prop: 'pingan$mainacct$no', title: '主账号', length: 128},
	{prop: 'pingan$mainacct$name', title: '主账号名', length: 128},
	{prop: 'pingan$yingziacct$no', title: '影子账户', length: 512},
	{prop: 'pingan$yingziacct$name', title: '影子账户名', length: 512},
	{prop: 'pingan$khkf03$limitamount', title: '单笔转账限额', length: 512, pattern: /^(?:[1-9]+\d*|0)$/ },
	{prop: 'pingan$bank$name', title: '银行名称', length: 512},
	{prop: 'pingan$depositbank$name', title: '开户银行名称', length: 512},
	{prop: 'pingan$b2bic$url', title: '服务器地址', length: 512},
	{prop: 'pingan$upload$path', title: '上传路径', length: 512},
	{prop: 'pingan$download$path', title: '下载路径', length: 512},
]
export const pinganRule = ruleGenerate(pinganProp)


// 浦发银行
export const spdbProp = [
	{prop: 'spdb$mainAcc$merchId', title: '主账号', length: 512},
	{prop: 'spdb$mainAcc$merchName', title: '主账号名称', length: 512},
	{prop: 'spdb$mainAcc$bankName', title: '主账号开户行名称', length: 512},
	{prop: 'spdb$mainAcc$merchCustCode', title: '企业客户号', length: 512},
	{prop: 'spdb$transMasterID', title: '交易客户号', length: 512},
	{prop: 'spdb$projectNumber', title: '项目编号', length: 512},
	{prop: 'spdb$costItemCode', title: '费项编码', length: 512},
	{prop: 'spdb$server', title: '交易服务器地址', length: 512},
	{prop: 'spdb$sign$server', title: '签名服务器地址', length: 512}
]
export const spdbRule = ruleGenerate(spdbProp)

// 微信
export const wxProp = [
	{prop: 'wx$mchid', title: '商户号', length: 128},
	{prop: 'wx$submchid', title: '子商户号', length: 512, required: false},
	{prop: 'wx$appid', title: 'AppId', length: 128},
	{prop: 'wx$key', title: 'WxKey', length: 512},
	{prop: 'wx$apikey', title: 'apikey', length: 512},
	{prop: 'wx$certlocalpath', title: '证书文件路径', length: 512},
	{prop: 'wx$certpassword', title: '证书文件密码', length: 32},
	{prop: 'wx$notify_url', title: '通知地址', length: 512, required: false},
]
export const wxRule = ruleGenerate(wxProp)

//薪太软
export const xtrProp = [
	{prop: 'xtr$merchId', title: '商户号', length: 512},
	{prop: 'xtr$companyId', title: '发薪单位编号', length: 512},
	{prop: 'xtr$companyName', title: '发薪单位名称', length: 512},
	{prop: 'xtr$channelType', title: '渠道类型', length: 512},
	{prop: 'xtr$accountNumber', title: '付款账号', length: 512},
	{prop: 'xtr$acctName', title: '付款账户名称', length: 512},
	{prop: 'xtr$depositBankName', title: '开户支行名称', length: 512},
	{prop: 'xtr$payPassword', title: '支付密码', length: 512},
	{prop: 'xtr$thirdPublickey', title: '薪太软公钥', length: 2048},
	{prop: 'xtr$privatekey', title: '我方私钥', length: 2048},
]
export const xtrRule = ruleGenerate(xtrProp)

//易宝
export const yeepayProp = [
	{prop: 'yeepay$merchId', title: '商户名', length: 128},
	{prop: 'yeepay$privatekey', title: '我方私钥', length: 2048},
	{prop: 'yeepay$thirdPublickey', title: '易宝公钥', length: 2048},
]
export const yeepayRule = ruleGenerate(yeepayProp)

//易极付
export const yjfProp = [
	{prop: 'partner_id', title: '商户号', length: 128, required: false},
	{prop: 'signtype', title: '密钥类型', length: 512},
	{prop: 'sercurity_key', title: '密钥', length: 512},
	{prop: 'pfx_file_pwd', title: '密钥文件密码', length: 32},
	{prop: 'pfx_file_fullname', title: '密钥文件路径', length: 512},
	{prop: 'pfx_file_fullname', title: '密钥文件路径', length: 512},
]
export const yjfRule = ruleGenerate(yjfProp)







export default {
  commonRule,
  changjieRule,
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
	spdbRule,
	alibankProp,
	alipayProp,
	cmbProp,
	changjieProp,
	hfProp,
	hxbProp,
	lianlianpayProp,
	spdbProp,
	pinganProp,
	wxProp,
	xtrProp,
	yeepayProp,
	yjfProp
}
