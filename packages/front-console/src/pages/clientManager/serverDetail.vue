<template> 
    <div class="r_main">
        <el-breadcrumb>
            <el-breadcrumb-item to="/main/clientManager/clientManager">
                客户管理
            </el-breadcrumb-item>
            <el-breadcrumb-item to="/main/clientManager/serverManager">
                服务商管理
            </el-breadcrumb-item>
            <el-breadcrumb-item>
                服务商详情
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
	    	<div class="title">基本信息</div><el-button type="primary" style="margin-left: 120px;" size="small" @click="ashow = true">编辑</el-button>
	    	<div class="box">
            <!--common-->
        		<el-col :span="12">
	    				  <el-col :span="8" class="right">渠道别名</el-col><el-col :span="12">{{data.channelAlias }}</el-col>
	    			</el-col>
	    			<el-col :span="12">
	    				  <el-col :span="8" class="right">渠道类型</el-col><el-col :span="12">{{data.thirdpaySystemId}}</el-col>
	    			</el-col>
						<el-col :span="12">
	    				  <el-col :span="8" class="right">单笔限额（元）</el-col><el-col :span="12">{{data.orderLimit}}</el-col>
	    			</el-col>
						<el-col :span="12">
	    				  <el-col :span="8" class="right">单日限额（元）</el-col><el-col :span="12">{{data.dailyLimit}}</el-col>
	    			</el-col>
						<el-col :span="12">
	    				  <el-col :span="8" class="right">登录账号</el-col><el-col :span="12">{{data.loginAcctno}}</el-col>
	    			</el-col>
						<el-col :span="12">
	    				  <el-col :span="8" class="right">渠道标识</el-col><el-col :span="12">{{data.id}}</el-col>
	    			</el-col>
						<div v-if="data.thirdpaySystemId !== 'alipay' && data.thirdpaySystemId !== 'hf'">
							<el-col :span="12" v-for="propInfo in systemPropList" :key="propInfo.prop">
								<template v-if="data[propInfo.propJoinByDot]">
									<el-col :span="8" class="right">{{propInfo.title}}</el-col>
									<el-col :span="14">{{data[propInfo.propJoinByDot]}}</el-col>
								</template>
							</el-col>
						</div>
						<template v-if="data.thirdpaySystemId == 'alipay'">
							<el-row :gutter="20">
								<el-col :span="12">
										<el-col :span="8" class="right">APPID</el-col><el-col :span="12">{{data['alipay.appid']}}</el-col>
								</el-col>
								<el-col :span="12">
										<el-col :span="8" class="right">USERID</el-col><el-col :span="12">{{data['alipay.userid']}}</el-col>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
										<el-col :span="8" class="right">密钥类型</el-col><el-col :span="12">{{data['alipay.rsatype']}}</el-col>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
										<el-col :span="8" class="right">商户私钥</el-col><el-col :span="12">{{data['alipay.app_private_key']}}</el-col>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
										<el-col :span="8" class="right">支付宝公钥</el-col><el-col :span="12">{{data['alipay.alipay_public_key']}}</el-col>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
										<el-col :span="8" class="right">MAPI(md5)密钥</el-col><el-col :span="12">{{data['alipay.mapi_md5_key']}}</el-col>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
										<el-col :span="8" class="right">支付宝网关</el-col><el-col :span="12">{{data['alipay.gateway']}}</el-col>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
										<el-col :span="8" class="right">红包通知地址</el-col><el-col :span="12">{{data['alipay.hb.notify_url']}}</el-col>
								</el-col>
							</el-row>
							<el-row :gutter="20">
								<el-col :span="12">
										<el-col :span="8" class="right">充值通知地址</el-col><el-col :span="12">{{data['alipay.deposit.notify_url']}}</el-col>
								</el-col>
							</el-row>
							<div v-if="data['alipay.cert.enable']==='true'">
								<el-row :gutter="20">
									<el-col :span="12">
											<el-col :span="8" class="right">应用公钥证书路径</el-col><el-col :span="12">{{data['alipay.app_cert_path']}}</el-col>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :span="12">
											<el-col :span="8" class="right">支付宝公钥证书路径</el-col><el-col :span="12">{{data['alipay.alipay_cert_path']}}</el-col>
									</el-col>
								</el-row>
								<el-row :gutter="20">
									<el-col :span="12">
											<el-col :span="8" class="right">支付宝根证书路径</el-col><el-col :span="12">{{data['alipay.alipay_root_cert_path']}}</el-col>
									</el-col>
								</el-row>
							</div>
						</template>
						<template v-if="data.thirdpaySystemId == 'hf'">
							<el-row :gutter="20">
										<el-col :span="12">
										<el-col :span="8" class="right">商户号</el-col><el-col :span="12">{{data['mer_id']}}</el-col>
								</el-col>
										<el-col :span="12">
										<el-col :span="8" class="right">客户号</el-col><el-col :span="12">{{data['mer_cust_id']}}</el-col>
								</el-col>
								</el-row>
							<el-row :gutter="20">
										<el-col :span="12">
										<el-col :span="8" class="right">证书文件密码</el-col><el-col :span="12">{{data['pfx_file_pwd']}}</el-col>
								</el-col>
								</el-row>
							<el-row :gutter="20">
										<el-col :span="12">
										<el-col :span="8" class="right">证书文件路径</el-col><el-col :span="12">{{data['pfx_file_fullname']}}</el-col>
								</el-col>
								</el-row>
										<el-row :gutter="20">
										<el-col :span="12">
										<el-col :span="8" class="right">对账sftp地址</el-col><el-col :span="12">{{data['rec.hf.sftp.host']}}</el-col>
								</el-col>
								</el-row>
										<el-row :gutter="20">
										<el-col :span="12">
										<el-col :span="8" class="right">对账sftp端口</el-col><el-col :span="12">{{data['rec.hf.sftp.port']}}</el-col>
								</el-col>
								</el-row>
										<el-row :gutter="20">
										<el-col :span="12">
										<el-col :span="8" class="right">对账sftp目录</el-col><el-col :span="12">{{data['rec.hf.sftp.dir']}}</el-col>
								</el-col>
								</el-row>
										<el-row :gutter="20">
										<el-col :span="12">
										<el-col :span="8" class="right">对帐sftp用户名</el-col><el-col :span="12">{{data['rec.hf.sftp.username']}}</el-col>
								</el-col>
								</el-row>
										<el-row :gutter="20">
										<el-col :span="12">
										<el-col :span="8" class="right">对帐sftp密码</el-col><el-col :span="12">{{data['rec.hf.sftp.password']}}</el-col>
								</el-col>
								</el-row>
											<el-row :gutter="20">
										<el-col :span="12">
										<el-col :span="8" class="right">msg是否忽略base64转换</el-col><el-col :span="12">{{data['hf.msg.sign.base64.disable'] == "true" ? "是" : "否"}}</el-col>
								</el-col>
								</el-row>
											<el-row :gutter="20">
										<el-col :span="12">
										<el-col :span="8" class="right">对账单是否使用http下载</el-col><el-col :span="14">{{data['hf.rec.api.use.http'] == "true" ? "是" : "否"}}</el-col>
								</el-col>
								</el-row>
						</template>
        	</div>
          <div class="title">支付用户</div> <el-button type="primary" style="margin-left: 120px;" size="small" @click="addChannel">添加支付用户</el-button>
          <el-form :model="form" class="mt20" :inline="true" size="small">
            <el-form-item label="支付用户名称">
              <el-input v-model="form.payeruserName" placeholder="请输入支付用户名称"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="query('1')">查询</el-button>
            </el-form-item>
          </el-form>
          <el-table :data="payUsers">
              <el-table-column prop="payeruserName" label="支付用户名称"></el-table-column>
              <el-table-column prop="thirdpayUserId" label="子账户"></el-table-column>
              <el-table-column prop="amount" label="当前余额（元）">
	    			<template slot-scope="scope">
	    				{{scope.row.amount | formatMoney}}
	    			</template>
	    		</el-table-column>
              <template v-if="data.thirdpaySystemId == 'hxb'">
                  <el-table-column prop="othBankPayeeSubAcc" label="跨行收款子账号"></el-table-column>
                  <el-table-column prop="othBankPayeeSubAccName" label="跨行收款子账号户名"></el-table-column>
                  <el-table-column prop="othBankPayeeSubAccSetteName" label="跨行收款子账号清算行"></el-table-column>
              </template>
              <el-table-column prop="memo" label="备注"></el-table-column>
              <el-table-column label="操作">
                  <template slot-scope="scope">
	    				<el-button type="text" @click="editRow(scope.row)">修改</el-button>
                      <el-button type="text" @click="deleteRow(scope.row)">删除</el-button>
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
        <el-dialog title="编辑" :visible.sync="ashow" width="70%">
            <el-form label-width="180px" :model="eform" :rules="erule" ref="eform">
	    		<el-form-item label="渠道别名" prop="channelAlias">
	    			<el-input v-model="eform.channelAlias"></el-input>
	    		</el-form-item>
	    		<el-form-item label="登录帐号" prop="loginAcctno">
	    			<el-input v-model="eform.loginAcctno"></el-input>
	    		</el-form-item>
	    		<el-form-item label="单笔限额（元）" prop="orderLimit">
	    			<el-input v-model="eform.orderLimit"></el-input>
	    		</el-form-item>
	    		<el-form-item label="单日限额（元）" prop="dailyLimit">
	    			<el-input v-model="eform.dailyLimit"></el-input>
	    		</el-form-item>
        	<template v-if="eform.thirdpaySystemId == 'changjie'">
	    			<el-form-item label="商户号" prop="cj$merchant_id">
	    				<el-input v-model="eform.cj$merchant_id"></el-input>
	    			</el-form-item>
	    			<el-form-item label="我方私钥" prop="cj$merchant_private_key">
	    				<el-input v-model="eform.cj$merchant_private_key"></el-input>
	    			</el-form-item>
	    			<el-form-item label="畅捷公钥" prop="cj$merchant_public_key">
	    				<el-input v-model="eform.cj$merchant_public_key"></el-input>
	    			</el-form-item>
	    		</template>
	    		<template v-if="eform.thirdpaySystemId == 'wx'">
	    			<el-form-item label="商户号" prop="wx$mchid">
	    				<el-input v-model="eform.wx$mchid"></el-input>
	    			</el-form-item>
	    			<el-form-item label="子商户号" prop="wx$submchid">
	    				<el-input v-model="eform.wx$submchid"></el-input>
	    			</el-form-item>
	    			<el-form-item label="APPID" prop="wx$appid">
	    				<el-input v-model="eform.wx$appid"></el-input>
	    			</el-form-item>
	    			<el-form-item label="WXKEY" prop="wx$key">
	    				<el-input v-model="eform.wx$key"></el-input>
	    			</el-form-item>
	    			<el-form-item label="APIKEY" prop="wx$apikey">
	    				<el-input v-model="eform.wx$apikey"></el-input>
	    			</el-form-item>
	    			<el-form-item label="证书文件路径" prop="wx$certlocalpath">
	    				<el-input v-model="eform.wx$certlocalpath"></el-input>
	    			</el-form-item>
	    			<el-form-item label="证书文件密码" prop="wx$certpassword">
	    				<el-input v-model="eform.wx$certpassword"></el-input>
	    			</el-form-item>
	    			<el-form-item label="通知地址" prop="wx$notify_url">
	    				<el-input v-model="eform.wx$notify_url"></el-input>
	    			</el-form-item>
	    		</template>
	    		<template v-if="eform.thirdpaySystemId == 'alipay'">
	    			<el-form-item label="APPID" prop="alipay$appid">
	    				<el-input v-model="eform.alipay$appid"></el-input>
	    			</el-form-item>
	    			<el-form-item label="USERID" prop="alipay$userid">
	    				<el-input v-model="eform.alipay$userid"></el-input>
	    			</el-form-item>
	    			<el-form-item label="密钥类型" prop="alipay$rsatype">
	    				<el-input v-model="eform.alipay$rsatype"></el-input>
	    			</el-form-item>
	    			<el-form-item label="商户私钥" prop="alipay$app_private_key">
	    				<el-input v-model="eform.alipay$app_private_key"></el-input>
	    			</el-form-item>
	    			<el-form-item label="支付宝公钥" prop="alipay$alipay_public_key">
	    				<el-input v-model="eform.alipay$alipay_public_key"></el-input>
	    			</el-form-item>
                  <el-form-item label="MAPI(md5)密钥" prop="alipay$mapi_md5_key">
                      <el-input v-model="eform.alipay$mapi_md5_key"></el-input>
                  </el-form-item>
	    			<el-form-item label="支付宝网关" prop="alipay$gateway">
	    				<el-input  v-model="eform.alipay$gateway"></el-input>
	    			</el-form-item>
	    			<el-form-item label="红包通知地址" prop="alipay$hb$notify_url">
	    				<el-input  v-model="eform.alipay$hb$notify_url"></el-input>
	    			</el-form-item>
	    			<el-form-item label="充值通知地址" prop="alipay$deposit$notify_url">
	    				<el-input  v-model="eform.alipay$deposit$notify_url"></el-input>
	    			</el-form-item>
						<el-form-item label="是否启用公钥证书签名方式" size="small" prop="alipay$cert$enable">
							<el-checkbox class="form_input" v-model="eform.alipay$cert$enable" true-label="true" false-label="false"></el-checkbox>
						</el-form-item>
						<div v-if="eform.alipay$cert$enable==='true'">
							<el-form-item label="应用公钥证书路径" size="small" prop="alipay$app_cert_path">
								<el-input class="form_input" v-model="eform.alipay$app_cert_path"></el-input>
							</el-form-item>
							<el-form-item label="支付宝公钥证书路径" size="small" prop="alipay$alipay_cert_path">
								<el-input class="form_input" v-model="eform.alipay$alipay_cert_path"></el-input>
							</el-form-item>
							<el-form-item label="支付宝根证书路径 " size="small" prop="alipay$alipay_root_cert_path">
								<el-input class="form_input" v-model="eform.alipay$alipay_root_cert_path"></el-input>
							</el-form-item>
						</div>
	    		</template>
	    		<template v-if="eform.thirdpaySystemId == 'yjf'">
	    			<el-form-item label="APPID" prop="partner_id">
	    				<el-input v-model="eform.partner_id"></el-input>
	    			</el-form-item>
	    			<el-form-item label="密钥类型" prop="signtype">
	    				<el-input v-model="eform.signtype"></el-input>
	    			</el-form-item>
                  <el-form-item label="密钥" prop="sercurity_key">
                      <el-input v-model="eform.sercurity_key"></el-input>
                  </el-form-item>
	    			<el-form-item label="证书文件密码" prop="pfx_file_pwd">
	    				<el-input v-model="eform.pfx_file_pwd"></el-input>
	    			</el-form-item>
	    			<el-form-item label="证书文件路径" prop="pfx_file_fullname">
	    				<el-input v-model="eform.pfx_file_fullname"></el-input>
	    			</el-form-item>
	    		</template>
	    		<template v-if="eform.thirdpaySystemId == 'pingan'">
	    			<el-form-item label="主账号" prop="pingan$mainacct$no">
	    				<el-input v-model="eform.pingan$mainacct$no"></el-input>
	    			</el-form-item>
	    			<el-form-item label="主账号名称" prop="pingan$mainacct$name">
	    				<el-input v-model="eform.pingan$mainacct$name"></el-input>
	    			</el-form-item>
	    			<el-form-item label="外联客户号" prop="pingan$outercustcode">
	    				<el-input v-model="eform.pingan$outercustcode"></el-input>
	    			</el-form-item>
	    			<el-form-item label="单笔转账限额" prop="pingan$khkf03$limitamount">
	    				<el-input v-model="eform.pingan$khkf03$limitamount"></el-input>
	    			</el-form-item>
	    			<el-form-item label="影子账户" prop="pingan$yingziacct$no">
	    				<el-input v-model="eform.pingan$yingziacct$no"></el-input>
	    			</el-form-item>
	    			<el-form-item label="影子账户名" prop="pingan$yingziacct$name">
	    				<el-input v-model="eform.pingan$yingziacct$name"></el-input>
	    			</el-form-item>
	    			<el-form-item label="银行名称" prop="pingan$bank$name">
	    				<el-input v-model="eform.pingan$bank$name"></el-input>
	    			</el-form-item>
	    			<el-form-item label="开户银行名称" prop="pingan$depositbank$name">
	    				<el-input v-model="eform.pingan$depositbank$name"></el-input>
	    			</el-form-item>
	    			<el-form-item label="服务器地址" prop="pingan$b2bic$url">
	    				<el-input  v-model="eform.pingan$b2bic$url"></el-input>
	    			</el-form-item>
	    			<el-form-item label="上传路径" prop="pingan$upload$path">
	    				<el-input  v-model="eform.pingan$upload$path"></el-input>
	    			</el-form-item>
	    			<el-form-item label="下载路径" prop="pingan$download$path">
	    				<el-input  v-model="eform.pingan$download$path"></el-input>
	    			</el-form-item>
	    		</template>
	    		<template v-if="eform.thirdpaySystemId == 'cmb'">
	    			<el-form-item label="用户名" prop="cmb$nteckopr$loginName">
	    				<el-input v-model="eform.cmb$nteckopr$loginName"></el-input>
	    			</el-form-item>
	    			<el-form-item label="主账号" prop="cmb$nteckopr$eacNbr">
	    				<el-input v-model="eform.cmb$nteckopr$eacNbr"></el-input>
	    			</el-form-item>
						<el-form-item label="主账号户名" size="small" prop="cmb$mainacc$name">
							<el-input class="form_input" v-model="eform.cmb$mainacc$name"></el-input>
						</el-form-item>
	    			<el-form-item label="招行前置机地址" prop="cmb$server">
	    				<el-input v-model="eform.cmb$server"></el-input>
	    			</el-form-item>
						<el-form-item label="招行前置机GoServer地址" prop="cmb$goserver$front">
	    				<el-input v-model="eform.cmb$goserver$front"></el-input>
	    			</el-form-item>
	    			<el-form-item label="主账号开户分行号" prop="cmb$nteckopr$cmbBkNbr">
	    				<el-input v-model="eform.cmb$nteckopr$cmbBkNbr"></el-input>
	    			</el-form-item>
						<el-form-item label="主账号开户分行名称" size="small" prop="cmb$mainacc$bankname">
							<el-input class="form_input" v-model="eform.cmb$mainacc$bankname"></el-input>
						</el-form-item>
	    			<el-form-item label="直接支付业务模式" prop="cmb$dcpaymnt$cmbBusMod">
	    				<el-input v-model="eform.cmb$dcpaymnt$cmbBusMod"></el-input>
	    			</el-form-item>
	    			<el-form-item label="移动支票业务模式" prop="cmb$nteckopr$cmbBusMod">
	    				<el-input v-model="eform.cmb$nteckopr$cmbBusMod"></el-input>
	    			</el-form-item>
	    			<el-form-item label="授权使用人" prop="cmb$nteckopr$autUSR">
	    				<el-input v-model="eform.cmb$nteckopr$autUSR"></el-input>
	    			</el-form-item>
	    		</template>
	    		<template v-if="eform.thirdpaySystemId == 'hf'">
	    			<el-form-item label="商户号" prop="mer_id">
	    				<el-input v-model="eform.mer_id"></el-input>
	    			</el-form-item>
	    			<el-form-item label="客户号" prop="mer_cust_id">
	    				<el-input v-model="eform.mer_cust_id"></el-input>
	    			</el-form-item>
	    			<el-form-item label="证书文件密码" prop="pfx_file_pwd">
	    				<el-input v-model="eform.pfx_file_pwd"></el-input>
	    			</el-form-item>
	    			<el-form-item label="证书文件路径" prop="pfx_file_fullname">
	    				<el-input v-model="eform.pfx_file_fullname"></el-input>
	    			</el-form-item>
                  <el-form-item label="对账sftp地址" prop="rec$hf$sftp$host">
                      <el-input class="form_input" v-model="eform.rec$hf$sftp$host"></el-input>
                  </el-form-item>
                  <el-form-item label="对账sftp端口" prop="rec$hf$sftp$port">
                      <el-input class="form_input" v-model="eform.rec$hf$sftp$port"></el-input>
                  </el-form-item>
                  <el-form-item label="对账sftp目录" prop="rec$hf$sftp$dir">
                      <el-input class="form_input" v-model="eform.rec$hf$sftp$dir"></el-input>
                  </el-form-item>
                  <el-form-item label="对帐sftp用户名" prop="rec$hf$sftp$username">
                      <el-input class="form_input" v-model="eform.rec$hf$sftp$username"></el-input>
                  </el-form-item>
                  <el-form-item label="对帐sftp密码" prop="rec$hf$sftp$password">
                      <el-input class="form_input" v-model="eform.rec$hf$sftp$password"></el-input>
                  </el-form-item>
                  <el-form-item label="msg是否忽略base64转换" size="small" prop="hf$msg$sign$base64$disable">                  
                    <el-radio-group v-model="eform.hf$msg$sign$base64$disable">
                        <el-radio label="true">是</el-radio>
                        <el-radio label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="对账单是否使用http下载" size="small" prop="hf$rec$api$use$http">
                    <el-radio-group v-model="eform.hf$rec$api$use$http">
                        <el-radio label="true">是</el-radio>
                        <el-radio label="false">否</el-radio>
                    </el-radio-group>
                </el-form-item>
	    		</template>
					<template v-if="eform.thirdpaySystemId == 'hxb'">
							<el-form-item label="商户号" prop="hxb$merchId">
									<el-input class="form_input" v-model="eform.hxb$merchId"></el-input>
							</el-form-item>
							<el-form-item label="前置机地址" prop="hxb$server">
									<el-input class="form_input" v-model="eform.hxb$server"></el-input>
							</el-form-item>
					</template>
					<template v-if="eform.thirdpaySystemId == 'yeepay'">
							<el-form-item label="商户号" size="small" prop="yeepay$merchId">
									<el-input class="form_input" v-model="eform.yeepay$merchId"></el-input>
							</el-form-item>
							<el-form-item label="我方私钥" size="small" prop="yeepay$privatekey">
									<el-input class="form_input" v-model="eform.yeepay$privatekey"></el-input>
							</el-form-item>
							<el-form-item label="易宝公钥" size="small" prop="yeepay$thirdPublickey">
									<el-input class="form_input" v-model="eform.yeepay$thirdPublickey"></el-input>
							</el-form-item>
					</template>
					<template v-if="eform.thirdpaySystemId == 'lianlianpay'">
							<el-form-item label="商户号" size="small" prop="lianlianpay$merchId">
									<el-input class="form_input" v-model="eform.lianlianpay$merchId"></el-input>
							</el-form-item>
							<el-form-item label="我方私钥" size="small" prop="lianlianpay$privatekey">
									<el-input class="form_input" v-model="eform.lianlianpay$privatekey"></el-input>
							</el-form-item>
							<el-form-item label="连连支付公钥" size="small" prop="lianlianpay$thirdPublickey">
									<el-input class="form_input" v-model="eform.lianlianpay$thirdPublickey"></el-input>
							</el-form-item>
							<el-form-item label="凭证sftp地址" size="small" prop="lianlianpay$vou$sftp$host">
									<el-input class="form_input" v-model="eform.lianlianpay$vou$sftp$host"></el-input>
							</el-form-item>
							<el-form-item label="凭证sftp端口" size="small" prop="lianlianpay$vou$sftp$port">
									<el-input class="form_input" v-model="eform.lianlianpay$vou$sftp$port"></el-input>
							</el-form-item>
							<el-form-item label="凭证sftp用户名" size="small" prop="lianlianpay$vou$sftp$username">
									<el-input class="form_input" v-model="eform.lianlianpay$vou$sftp$username"></el-input>
							</el-form-item>
							<el-form-item label="凭证sftp密码" size="small" prop="lianlianpay$vou$sftp$password">
									<el-input class="form_input" v-model="eform.lianlianpay$vou$sftp$password"></el-input>
							</el-form-item>

							<el-form-item label="对账sftp地址" size="small" prop="lianlianpay$rec$sftp$host">
									<el-input class="form_input" v-model="eform.lianlianpay$rec$sftp$host"></el-input>
							</el-form-item>
							<el-form-item label="对账sftp端口" size="small" prop="lianlianpay$rec$sftp$port">
									<el-input class="form_input" v-model="eform.lianlianpay$rec$sftp$port"></el-input>
							</el-form-item>
							<el-form-item label="对账sftp用户名" size="small" prop="lianlianpay$rec$sftp$username">
									<el-input class="form_input" v-model="eform.lianlianpay$rec$sftp$username"></el-input>
							</el-form-item>
							<el-form-item label="对账sftp密码" size="small" prop="lianlianpay$rec$sftp$password">
									<el-input class="form_input" v-model="eform.lianlianpay$rec$sftp$password"></el-input>
							</el-form-item>
							<el-form-item label="对账sftp目录" size="small" prop="lianlianpay$rec$sftp$dir">
									<el-input class="form_input" v-model="eform.lianlianpay$rec$sftp$dir"></el-input>
							</el-form-item>
					</template>
					<template v-if="eform.thirdpaySystemId == 'alibank'">
							<el-form-item label="商户号" size="small" prop="alibank$merchId">
									<el-input class="form_input" v-model="eform.alibank$merchId"></el-input>
							</el-form-item>
							<el-form-item label="我方私钥" size="small" prop="alibank$privatekey">
									<el-input class="form_input" v-model="eform.alibank$privatekey"></el-input>
							</el-form-item>
							<el-form-item label="阿里网商公钥" size="small" prop="alibank$thirdPublickey">
									<el-input class="form_input" v-model="eform.alibank$thirdPublickey"></el-input>
							</el-form-item>
							<el-form-item label="开户行" size="small" prop="alibank$deposit$depositBankName">
									<el-input class="form_input" v-model="eform.alibank$deposit$depositBankName"></el-input>
							</el-form-item>
							<el-form-item label="开户名称" size="small" prop="alibank$deposit$accountName">
									<el-input class="form_input" v-model="eform.alibank$deposit$accountName"></el-input>
							</el-form-item>
							<el-form-item label="账户" size="small" prop="alibank$deposit$account">
									<el-input class="form_input" v-model="eform.alibank$deposit$account"></el-input>
							</el-form-item>
					</template>
					<template v-if="eform.thirdpaySystemId == 'xtr'">
							<el-form-item label="商户号" size="small" prop="xtr$merchId">
									<el-input class="form_input" v-model="eform.xtr$merchId"></el-input>
							</el-form-item>
							<el-form-item label="发薪单位编号" size="small" prop="xtr$companyId">
								<el-input class="form_input" v-model="eform.xtr$companyId"></el-input>
						</el-form-item>
						<el-form-item label="发薪单位名称" size="small" prop="xtr$companyName">
								<el-input class="form_input" v-model="eform.xtr$companyName"></el-input>
						</el-form-item>
						<el-form-item label="渠道类型" size="small" prop="xtr$channelType">
								<el-input class="form_input" v-model="eform.xtr$channelType"></el-input>
						</el-form-item>
						<el-form-item label="付款账号" size="small" prop="xtr$accountNumber">
								<el-input class="form_input" v-model="eform.xtr$accountNumber"></el-input>
						</el-form-item>
						<el-form-item label="付款账户名称" size="small" prop="xtr$acctName">
								<el-input class="form_input" v-model="eform.xtr$acctName"></el-input>
						</el-form-item>
						<el-form-item label="开户支行名称" size="small" prop="xtr$depositBankName">
								<el-input class="form_input" v-model="eform.xtr$depositBankName"></el-input>
						</el-form-item>
						<el-form-item label="支付密码" size="small" prop="xtr$payPassword">
								<el-input class="form_input" v-model="eform.xtr$payPassword"></el-input>
						</el-form-item>
						<el-form-item label="我方私钥" size="small" prop="xtr$privatekey">
								<el-input class="form_input" v-model="eform.xtr$privatekey"></el-input>
						</el-form-item>
						<el-form-item label="薪太软公钥" size="small" prop="xtr$thirdPublickey">
								<el-input class="form_input" v-model="eform.xtr$thirdPublickey"></el-input>
						</el-form-item>
					</template>
					<template v-if="eform.thirdpaySystemId == 'aliMYbank'">
							<el-form-item label="商户号" size="small" prop="aliMYbank$merchId">
								<el-input class="form_input" v-model="eform.aliMYbank$merchId"></el-input>
							</el-form-item>
							<el-form-item label="证书文件路径" size="small" prop="aliMYbank$privatekeyFilepath">
								<el-input class="form_input" v-model="eform.aliMYbank$privatekeyFilepath"></el-input>
						</el-form-item>
						<el-form-item label="证书文件密码" size="small" prop="aliMYbank$privatekeyFilepwd">
								<el-input class="form_input" v-model="eform.aliMYbank$privatekeyFilepwd"></el-input>
						</el-form-item>
						<el-form-item label="第三方公钥" size="small" prop="aliMYbank$thirdPublickey">
								<el-input class="form_input" v-model="eform.aliMYbank$thirdPublickey"></el-input>
						</el-form-item>
						<el-form-item label="平台专属出款渠道编码" size="small" prop="aliMYbank$whiteChannelCode">
								<el-input class="form_input" v-model="eform.aliMYbank$whiteChannelCode"></el-input>
						</el-form-item>
						<el-form-item label="网商结算户" size="small" prop="aliMYbank$merchCustCode">
								<el-input class="form_input" v-model="eform.aliMYbank$merchCustCode"></el-input>
						</el-form-item>
						<el-form-item label="开户行" size="small" prop="aliMYbank$deposit$depositBankName">
								<el-input class="form_input" v-model="eform.aliMYbank$deposit$depositBankName"></el-input>
						</el-form-item>
						<el-form-item label="开户名称" size="small" prop="aliMYbank$deposit$accountName">
								<el-input class="form_input" v-model="eform.aliMYbank$deposit$accountName"></el-input>
						</el-form-item>
					</template>
					<template v-if="eform.thirdpaySystemId == 'spdb'">
						<el-form-item label="主账号" size="small" prop="spdb$mainAcc$merchId">
								<el-input class="form_input" v-model="eform.spdb$mainAcc$merchId"></el-input>
						</el-form-item>
						<el-form-item label="主账号名称" size="small" prop="spdb$mainAcc$merchName">
								<el-input class="form_input" v-model="eform.spdb$mainAcc$merchName"></el-input>
						</el-form-item>
						<el-form-item label="主账号开户行名称" size="small" prop="spdb$mainAcc$bankName">
								<el-input class="form_input" v-model="eform.spdb$mainAcc$bankName"></el-input>
						</el-form-item>
						<el-form-item label="企业客户号" size="small" prop="spdb$mainAcc$merchCustCode">
								<el-input class="form_input" v-model="eform.spdb$mainAcc$merchCustCode"></el-input>
						</el-form-item>
						<el-form-item label="交易客户号" size="small" prop="spdb$transMasterID">
								<el-input class="form_input" v-model="eform.spdb$transMasterID"></el-input>
						</el-form-item>
						<el-form-item label="项目编号" size="small" prop="spdb$projectNumber">
								<el-input class="form_input" v-model="eform.spdb$projectNumber"></el-input>
						</el-form-item>
						<el-form-item label="费项编码" size="small" prop="spdb$costItemCode">
								<el-input class="form_input" v-model="eform.spdb$costItemCode"></el-input>
						</el-form-item>
						<el-form-item label="交易服务器地址" size="small" prop="spdb$server">
								<el-input class="form_input" v-model="eform.spdb$server"></el-input>
						</el-form-item>
						<el-form-item label="签名服务器地址" size="small" prop="spdb$sign$server">
								<el-input class="form_input" v-model="eform.spdb$sign$server"></el-input>
						</el-form-item>
					</template>

	    	  </el-form>
            <span class="form_footer" slot="footer">
                <el-button @click="update" type="primary">保存</el-button>
                <el-button @click="ashow = false" type="warning">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="`${isEdit ? '修改' : '添加'}支付用户`" :visible.sync="addShow" width="70%">
            <el-form :model="aform" :rules="arule" label-width="120px" ref="aform">
                <el-form-item label="用户名" prop="payeruserName">
	    			  <el-input v-model="aform.payeruserName" size="small" type="primary"></el-input>
                </el-form-item>
                <el-form-item label="子账号" prop="thirdpayUserId" v-if="showThirdPayUser">
                    <el-input v-model="aform.thirdpayUserId" size="small" type="primary"></el-input>
                </el-form-item>
                <el-form-item label="备注" prop="memo">
                    <el-input v-model="aform.memo" size="small" type="primary"></el-input>
                </el-form-item>
            </el-form>
            <span class="form_footer" slot="footer">
                <el-button @click="addRow" type="primary">保存</el-button>
                <el-button @click="addShow = false" type="warning">关闭</el-button>
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
import channel,{ commonRule } from '../../rule/channel.js'
export default {
    data() {
      return {
        form: {
          channelId: '',
          payeruserName: '',
          pageNo: 1,
          pageSize: 10
        },
        erule: '',
        eform: {},
        appId: "",
        ashow: false,
        aform: {
          channelId: "",
          memo: "",
          payeruserName: "",
          thirdpaySystemId: "",
          thirdpayUserId: "",
          userId: ""
        },
        arule: {
            payeruserName: [
              {
                  required: true,
                  message: '请输入用户名',
                  trigger: 'blur'
              },
            ],
            thirdpayUserId: [
              {
                  required: true,
                  message: '请输入子账号',
                  trigger: 'blur'
              },
            ]
        },
        addShow: false,
        data: [],
        result: "",
        types: [],
        paymentThirdType: "",
        paymentUserId: "",
        others: [],
        curr: {},
        id: "",
        total: 0,
        payUsers: [],
				isEdit: false,
				systemPropList:''
      };
    },
    mounted() {
      this.form.channelId = sessionStorage.getItem("id");
      this.aform.channelId = this.form.channelId;
      this.getMsg();
      this.query();
    },
    computed: {
        showThirdPayUser(){
            let notShowThirdPayUserChannelIds = [
                "changjie",
								"wx",
								"cmb",
                "hxb",
                "pingan",
                "xtr",
								"aliMYbank",
								"spdb"
            ]

            let result = notShowThirdPayUserChannelIds.filter(id => this.eform.thirdpaySystemId === id)
            return !(result.length > 0)
            // return eform.thirdpaySystemId != 'changjie' && eform.thirdpaySystemId != 'wx' && eform.thirdpaySystemId != 'hxb' && eform.thirdpaySystemId != 'pingan'
        }
    },
    methods: {
        getMsg() {
            post(`/api/paymentmgt/front/channel/qrydetail?channelId=${this.form.channelId}`).then(data => {
                var form = {}
                for( var k in data ) {
                    var newKey = k.replace(/\./g, '$')
                    form[newKey] = data[k]
                }
                this.data = data;
                this.eform = form;
								this.aform.thirdpaySystemId = data.thirdpaySystemId;
								this.erule = { ...commonRule, ...channel[`${this.aform.thirdpaySystemId}Rule`]}
								this.systemPropList = [ ...channel[`${this.aform.thirdpaySystemId}Prop`]]
								this.systemPropList.forEach(item => {
									item.propJoinByDot = item.prop.replace(/\$/g, '.')
								})
                if(this.data.thirdpaySystemId == 'yjf') {
                    if(this.erule.signtype[0].required) {
                        this.erule.signtype.shift()
                    }
                    if(this.erule.sercurity_key[0].required) {
                        this.erule.sercurity_key.shift()
                    }
                    if(this.erule.pfx_file_pwd[0].required) {
                        this.erule.pfx_file_pwd.shift()
                    }
                    if(this.erule.pfx_file_fullname[0].required) {
                        this.erule.pfx_file_fullname.shift()
                    }
                }
            });
        },
        query(a=1) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.pageNo = a
            post("/api/paymentmgt/front/channel/payuser/qrylist", this.form).then(data => {
                this.payUsers = data.data;
                this.total = data.total;
            });
        },
        update() {
            this.$refs['eform'].validate(valid => {
                if(valid) {
                    var form = {}
                    for(var k in this.eform) {
                        var newKey = k.replace(/\$/g, '.')
                        form[newKey] = this.eform[k]
                    }
                    post("/api/paymentmgt/front/channel/update", form).then(data => {
                        this.$message({
                          type: "success",
                          message: "修改成功！"
                        });
                        this.ashow = false;
                        this.getMsg();
                    });
                }
            })
        },
        addChannel() {
            this.isEdit = false;
            this.addShow = true;
            this.paymentThirdType = "";
            this.paymentUserId = "";
            this.others = [];
            this.result = "";
            this.aform.payeruserName = ''
            this.aform.thirdpayUserId = ''
            this.aform.memo = ''
        },
        addRow() {
            this.$refs['aform'].validate(valid => {
                if(valid) {
                    post(`/api/paymentmgt/front/channel/payuser/${this.isEdit ? "update" : "add"}`, this.aform).then(data => {
                        this.$message({
                          type: "success",
                          message: `${this.isEdit ? "修改" : "添加"}成功！`
                        });
                        this.addShow = false;
                        this.query();
                    });
                }
            })
        },
        editRow(e) {
            Object.assign(this.aform, e);
            delete this.aform.amount;
            this.isEdit = true;
            this.addShow = true;
        },
        deleteRow(e) {
            delete e.amount;
            post(`/api/paymentmgt/front/channel/payuser/delete`, e).then(data => {
                this.$message({
                    type: "success",
                    message: "删除成功！"
                });
                this.query();
            });
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
	overflow: hidden;
}
/* .box > div:nth-child(1) {
	margin-bottom: 20px;
} */
.right {
  font-weight: bold;
  text-align: right;
	margin-right: 15px;
}
.page {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
.mt20 {
  margin-top: 20px;
}
</style>