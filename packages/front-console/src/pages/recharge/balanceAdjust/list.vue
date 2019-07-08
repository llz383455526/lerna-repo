<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0px 30px 30px;">平账管理</div>

        <el-form :inline="true" ref="formSearch" onsubmit="return false;" :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="企业名称:" size="small" prop="companyId">
                <el-select filterable v-model="formSearch.companyId">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option v-for="(item, key) in customCompanies" :label="item.companyName" :value="item.companyId" :key="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="业务类型:" size="small" prop="bankType">
                <el-select filterable v-model="formSearch.bankType">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option v-for="(item, key) in ChannelTypeList" :label="item.text" :value="item.value" :key="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="申请时间:" size="small">
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        value-format="yyyy-MM-dd"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        @change="setTime">
                </el-date-picker>
            </el-form-item>
            <br>
            <el-form-item label="商户名称:" size="small" prop="appId">
                <el-select filterable v-model="formSearch.appId" :no-data-text="formSearch.appId ? '无数据' : '请先选择企业'">
                    <!--<el-option label="全部" value="" key=""></el-option>-->
                    <el-option v-for="(item, key) in productNameList" :label="item.text" :value="item.value" :key="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道类型:" size="small" prop="paymentThirdType">
                <el-select filterable v-model="formSearch.paymentThirdType">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option v-for="(item, key) in ThirdPaymentTypeList" :label="item.text" :value="item.value" :key="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="平账操作:" size="small" prop="adjustType">
                <el-select filterable v-model="formSearch.adjustType">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option v-for="(item, key) in adjustTypeList" :label="item.text" :value="item.value" :key="key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -4px" :class="`${riskApprove ? 'fr' : ''}`">
                <el-button type="primary" @click="query" size="small">查询</el-button>
                <el-button size="small" @click="clear">重置</el-button>
                <el-button size="small" @click="exportFile" v-if="!riskApprove">导出</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="dialogCreateVisible=true" v-if="checkRight(permissions, 'balance-web:/recharge-order/comfirm') && !riskApprove">平账申请</el-button>

        <el-table :data="rechargeApplyList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column label="工单单号" width="160px" fixed>
                <template slot-scope="scope">
                    <el-button class="allow" type="text" @click="handle(scope.row, false, false)" :disabled="!scope.row.sourceType">{{scope.row.orderNo}}</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="orderNo" label="申请单" width="120px"></el-table-column>
            <el-table-column prop="companyName" label="企业名称"></el-table-column>
            <el-table-column prop="appName" label="商户名称"></el-table-column>
            <el-table-column prop="serviceCompanyName" label="服务商名称"></el-table-column>
            <el-table-column prop="amount" label="实发金额">
                <template slot-scope="scope">
                    <div>{{scope.row.amount | formatMoney}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="serviceFeeAmount" label="服务费金额">
                <template slot-scope="scope">
                    <div>{{scope.row.serviceFeeAmount | formatMoney}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="totalAmount" label="总金额">
                <template slot-scope="scope">
                    <div>{{scope.row.totalAmount | formatMoney}}</div>
                </template>
            </el-table-column>
            <el-table-column prop="bankTypeName" label="业务类型"></el-table-column>
            <el-table-column prop="paymentThirdTypeName" label="发放渠道"></el-table-column>
            <el-table-column prop="adjustTypeName" label="平账操作"></el-table-column>
            <el-table-column prop="sourceTypeName" label="申请类型"></el-table-column>
            <el-table-column prop="yearMonth" label="所属月份"></el-table-column>
            <el-table-column prop="memo" label="备注"></el-table-column>
            <el-table-column label="查看凭证">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="getVModal(scope.row.id)">查看凭证</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="updateByName" label="操作人" width="100px"></el-table-column>
            <el-table-column prop="adjustAt" label="操作时间" width="100px"></el-table-column>
        </el-table>
        <ayg-pagination
                v-if="rechargeApplyList.total"
                :total="rechargeApplyList.total"
                :currentPage="formSearch.page"
                v-on:handleSizeChange="sizeChange"
                v-on:handleCurrentChange="query">
        </ayg-pagination>

        <el-dialog title="平账操作" @open="closeEditDialog" :before-close="closeEditDialog"  :visible.sync="dialogCreateVisible" width="900px">
            <el-form :model="dialogCreateForm" :rules="dialogCreateFormRules" ref="dialogCreateForm">
                <div class="input-container">
                    <div class="label">客户公司：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="companyId">
                            <el-select filterable v-model="dialogCreateForm.companyId" no-data-text="请选择" @change="clearApp">
                                <el-option style="width: 100%;" v-for="(item, key) in customCompanies" :label="item.companyName" :value="item.companyId" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">商户名称：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="appId">
                            <el-select filterable v-model="dialogCreateForm.appId" :no-data-text="dialogCreateForm.companyId ? '无数据' : '请先选择客户公司'" @change="getService">
                                <el-option v-for="(item, key) in productName" :label="item.text" :value="item.value" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">服务商名称：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="serviceCompanyId">
                            <el-select filterable v-model="dialogCreateForm.serviceCompanyId" :no-data-text="dialogCreateForm.appId ? '无数据' : '请先选择商户'" @change="getChannlType">
                                <el-option v-for="(item, index) in serviceName" :label="item.text" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">平账操作：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="adjustType">
                            <el-select filterable v-model="dialogCreateForm.adjustType" no-data-text="请选择">
                                <el-option style="width: 100%;" v-for="(item, key) in adjustTypeList" :key="key"
                                           :label="item.text" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">业务类型：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="bankType">
                            <el-select filterable
                                       v-model="dialogCreateForm.bankType"
                                       :no-data-text="dialogCreateForm.serviceCompanyId ? '无数据' : '请先选择商户'"
                                       @change="getChannel">
                                <el-option v-for="(item, key) in channelTypes" :label="item.text" :value="item.value" :key="key"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">渠道账号：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="channelBalanceAccountId">
                            <el-select v-model="dialogCreateForm.channelBalanceAccountId"
                                       placeholder="选择转出的渠道账号" @change="getRechargeMsg">
                                <el-option v-for="(e, key) in channels" :key="key"
                                           :label="`${e.channelAlias}/${e.channelLoginAcctNo}/${e.channelMerCustId}/${e.payUserId}`"
                                           :value="e.balanceAccountId"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <template v-if="outMsg">
                    <div class="half">
                        <span>帐号今日可充建议：{{outMsg.allowAvailBalance | formatMoney}}元</span>
                        <span>帐号当前余额：{{outMsg.currentAvailBalance | formatMoney}}元</span>
                    </div>
                    <div class="half">
                        <span>日发放限额：{{outMsg.limitAvailBalance | formatMoney}}元</span>
                        <span>当日已发：{{outMsg.outAvailBalance | formatMoney}}元</span>
                    </div>
                </template>
                <div class="input-container" v-if="msg && !rechargeMsg && isRecharge">
                    <div class="label"></div>
                    <div class="input">
                        <div>开户行：{{msg.depositBank}}</div>
                        <div>账户名称：{{msg.accountName}}</div>
                        <div>账号：{{msg.accountNo}}</div>
                        <div>(请通过线下支付方式支付费用到该收款账号)</div>
                    </div>
                </div>
                <template v-if="rechargeMsg && dialogCreateForm.channelBusinessType == 'bank'">
                    <div class="input-container">
                        <div class="label"></div>
                        <div class="input">
                            <div>开户行：{{rechargeMsg.depositBankName}}</div>
                            <div>账户名称：{{rechargeMsg.mainAcctName}}</div>
                            <div>账号：{{rechargeMsg.payUserNo}}</div>
                            <div>(请通过线下支付方式支付费用到该收款账号)</div>
                        </div>
                    </div>
                </template>
                <template>
                    <div class="input-container">*负值为账户余额减去金额，正值为账户余额增加金额</div>
                </template>
                <div class="input-container">
                    <div class="label">实发金额：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="amount">
                            <el-input :maxlength="15" v-model.number="dialogCreateForm.amount" placeholder=""></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">服务费金额：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="serviceFeeAmount">
                            <el-input v-model.number="dialogCreateForm.serviceFeeAmount"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">总金额：</div>
                    <div class="input">
                        <template v-if="dialogCreateForm.amount !== ''
                                        && dialogCreateForm.serviceFeeAmount !== ''
                                        && dialogCreateForm.amount !== '-'
                                        && dialogCreateForm.serviceFeeAmount !== '-'">
                            {{(dialogCreateForm.amount + dialogCreateForm.serviceFeeAmount).toFixed(2)}}
                        </template>
                        <!--<el-form-item>-->
                            <!--<el-input :value="(dialogCreateForm.amount - 0 + serviceFee).toFixed(2)"></el-input>-->
                        <!--</el-form-item>-->
                    </div>
                    <div v-if="prePayContent">
                        合计充值金额 =
                        <template v-if="prePayContent.serviceFeeType == 'real'">
                            实发金额 + 实发金额 * {{prePayContent.serviceFeeRate}}%
                        </template>
                        <template v-else>
                            实发金额 / (1 - {{prePayContent.serviceFeeRate}}%)
                        </template>
                        ;保留2位小数，四舍五入
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">所属月份：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="yearMonth">
                            <el-date-picker
                                  v-model="dialogCreateForm.yearMonth"
                                  type="month"
                                  placeholder="选择月"
                                  value-format="yyyyMM">
                                </el-date-picker>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">申请说明：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="memo">
                            <el-input :maxlength=50 v-model="dialogCreateForm.memo" placeholder=""></el-input>
                        </el-form-item>
                    </div>
                </div>
                <template v-if="!rechargeMsg">
                    <div class="input-container">
                        <div class="label">充值凭证：<span>*</span></div>
                        <div class="input auto">
                            <div class="uploadBox" v-for="(e, i) in uploadList" @click.capture="currentIndex = i">
                                <el-form-item prop="attachmentIds">
                                    <el-upload
                                            v-show="!uploadList[i].imageUrl"
                                            class="det"
                                            ref="upload"
                                            :show-file-list="false"
                                            :action="`/api/sysmgr-web/file/upload`"
                                            :auto-upload="false"
                                            :on-change="getAttachment"
                                            :multiple="true"
                                            name="file"
                                            accept=".jpg, .png">
                                        <i class="el-icon-plus avatar-uploader-icon">
                                            <div>可以同时上传多张</div>
                                        </i>
                                    </el-upload>
                                    <div v-if="uploadList[i].imageUrl" class="avatar" :style="{'background-image': `url(${uploadList[i].imageUrl})`}">
                                        <div class="magnify" @click="prevImg(uploadList[i].imageUrl)"></div>
                                    </div>
                                    <el-button type="text" v-show="uploadList[i].imageUrl" @click="reUpload()">重新上传</el-button>
                                    <el-button type="text" @click="deleteImg()" v-show="(uploadList.length > 1 && uploadList.length -1 != i) || i == 9">删除</el-button>
                                </el-form-item>
                            </div>
                        </div>
                    </div>
                    <!--<div class="input-container">-->
                    <!--<div class="label"></div>-->
                    <!--<div class="input">-->
                    <!--<el-checkbox checked @change="setSmsOpen">-->
                    <!--<span class="f14">目前支持线下转账充值，充值到账处理成功，免费短信通知至手机</span>-->
                    <!--</el-checkbox>-->
                    <!--</div>-->
                    <!--</div>-->
                </template>
                <template v-if="rechargeMsg">
                    <div class="tip">温馨提示</div>
                    <hr>
                    <div class="input">
                        请线下汇款，由于银行对公转账的相关限制，建议在工作日周一 至 周五 09:30-15:30之间进行充值汇款，超过该时间则顺延至第二个工作日办理。预计2个小时内到账，如需按时发放请提前做好相关工作准备。
                    </div>
                </template>
                <template v-if="sub">
                    <hr>
                    <div class="input-container mb0">
                        <div class="label">业务模式：</div>
                        <div class="input">
                            业务转包
                        </div>
                    </div>
                    <div class="input-container mb0">
                        <div class="label">转包服务商：</div>
                        <div class="input">
                            {{sub.companyName}}
                        </div>
                    </div>
                    <div class="input-container mb0">
                        <div class="label"></div>
                        <div class="input">
                            <div>开户行：{{sub.depositBank}}</div>
                            <div>账户名称：{{sub.accountName}}</div>
                            <div>账号：{{sub.accountNo}}</div>
                        </div>
                    </div>
                </template>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <template v-if="rechargeMsg">
                    <el-button size="small" type="primary" @click="dialogCreateVisible = false;$refs['dialogCreateForm'].resetFields()">知道了</el-button>
                </template>
                <template v-else>
                    <el-button size="small" @click="dialogCreateVisible = false;$refs['dialogCreateForm'].resetFields()">取 消</el-button>
                    <el-button size="small" type="primary" @click="submitDialogCreateForm()">确 定</el-button>
                </template>
            </div>
        </el-dialog>
        <el-dialog title=""  :visible.sync="dialogConfirmVisible" width="40%">
            <div class="input-container">
                <div class="label">账户名称：</div>
                <div class="input">{{orderInfo.accountName}}</div>
            </div>
            <div class="input-container">
                <div class="label">开户行：</div>
                <div class="input">{{orderInfo.depositBank}}</div>
            </div>
            <div class="input-container">
                <div class="label">账号：</div>
                <div class="input">{{orderInfo.accountNo}}</div>
            </div>
            <div class="input-container">
                <div class="label">充值用途：</div>
                <div class="input">{{orderInfo.purpose}}</div>
            </div>
            <div class="input-container">
                <div class="label">充值金额：</div>
                <div class="input">{{orderInfo.amount | formatMoney}}</div>
            </div>
            <div class="input-container">
                <div class="label">充值码：</div>
                <div class="input red" style="width:400px;">{{orderInfo.rechargeCode}}（请务必备注在付款信息中，便于收款方确认款项）</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitConfirmOrder">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="detail.state == 20 ? '待制单' : detail.state == 21 ? '待审核' : '查看'"  :visible.sync="show" width="960px">
            <div class="title">客户充值凭证</div>
            <div class="det">企业名称：{{detail.companyName}}</div>
            <div class="det">商户名称：{{detail.appName}}</div>
            <div class="det">收款总金额：{{detail.amount + detail.serviceFee | formatMoney}}</div>
            <div class="det" v-if="detail.serviceFee">充值到第三方渠道金额：{{detail.amount | formatMoney}}</div>
            <div class="det" v-if="detail.serviceFee">服务费金额：{{detail.serviceFee | formatMoney}}</div>
            <div class="det pad">
                *收款总金额=充值到第三方渠道金额+服务费金额<br>
                阶梯报价时，服务费金额按商定预收比例计算
            </div>
            <div class="det" v-if="detail.customDownloadCodes || (detail.supportCertificateDownload && detail.state == 30 && checkRight(permissions, 'balance-web:/recharge-order/download-recharge-certificate'))">
                <div style="float: left;">转账凭证：</div>
                <div class="avatar mr20" v-if="!detail.supportCertificateDownload" v-for="(e, i) in detail.customDownloadCodes" @click="showAttr = true;attrIndex = i" :style="{'background-image': `url(/api/sysmgr-web/file/download?downloadCode=${e})`}"></div>
                <el-button v-if="detail.supportCertificateDownload" type="primary" size="small" @click="download">
                    下载充值凭证
                </el-button>
            </div>
            <div class="title">服务商信息</div>
            <div class="det">名称：{{detail.serviceCompanyName}}<div class="toggle" @click="showDetail = !showDetail">{{ showDetail ? '收起' : '展开'}}</div></div>
            <template v-if="showDetail">
                <div class="det">所属银行：{{detail.depositBank}}</div>
                <div class="det">开户行：{{detail.depositBank}}</div>
                <div class="det">账户名：{{detail.accountName}}</div>
            </template>
            <div class="det">账号：{{detail.accountNo}}</div>
            <div class="det" v-if="detail.payUser">业务渠道：{{detail.payUser.thirdPaymentTypeName}}</div>
            <template v-if="!detail.subServiceCompanyId">
                <div class="det">选择渠道帐号：
                    <el-select size="small" v-model="balanceAccountId" @change="getSuggest" style="width: 500px" :disabled="detail.state != 20 ? true : false">
                        <el-option v-for="e in channlList" :key="e" :label="`${e.channelAlias}/${e.channelLoginAcctNo}/${e.channelMerCustId}`" :value="e.balanceAccountId"></el-option>
                    </el-select>
                </div>
                <div class="det" v-if="suggest">帐号今日可充建议：{{suggest.allowAvailBalance | formatMoney}}元&#x3000;帐号当前余额：{{suggest.currentAvailBalance | formatMoney}}元&#x3000;
                    日发放限额：{{suggest.limitAvailBalance | formatMoney}}元&#x3000;当日已发：{{suggest.outAvailBalance | formatMoney}}元
                </div>
            </template>
            <template v-if="!detail.subServiceCompanyId && (detail.state == 21 || (detail.state == 30 && detail.financeDownloadCode)) && !detail.isAutoRecharge">
                <div class="title">渠道金额充值</div>
                <div class="det">
                    <div style="float: left;">上传充值凭证：</div>
                    <el-upload
                            v-if="!imageUrl"
                            class="upload"
                            :file-list="fileList"
                            ref="upload"
                            :show-file-list="false"
                            :action="`/api/sysmgr-web/file/upload`"
                            :auto-upload="false"
                            :on-change="getImg"
                            :multiple="false"
                            name="file"
                            accept=".jpg, .png">
                        <i class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                    <img @click="showVoucher = true" style="width: 300px" v-else :src="`/api/sysmgr-web/file/download?downloadCode=${imageUrl}`" alt="">
                    &nbsp;<el-button type="text" class="clear" @click="clearImg">重新上传充值凭证</el-button>
                </div>
            </template>
            <div class="det">备注：
                <el-input size="small" v-model="memo" style="width: 300px" v-if="detail.state == 21 || detail.state == 20"></el-input>
                <span v-else>{{detail.memo}}</span>
            </div>
            <template v-if="detail.subServiceCompanyId">
                <hr>
                <div class="det">
                    业务模式：业务转包
                </div>
                <div class="title">转包服务商：
                    <el-select size="small" filterable v-model="subServiceCompanyId" @change="getSubMsg" :disabled="detail.state != 20 ? true : false">
                        <el-option v-for="(item, index) in subCompany" :label="item.name" :value="item.id" :key="item.id"></el-option>
                    </el-select>
                </div>
                <div class="det">开户行：{{subMsg.depositBank}}</div>
                <div class="det">账户名称：{{subMsg.accountNo}}</div>
                <div class="det">账号：{{subMsg.accountName}}</div>
                <template v-if="detail.state == 21 || detail.state == 30">
                    <div class="title">渠道金额充值</div>
                    <div class="det">
                        <div style="float: left;">上传充值凭证：</div>
                        <el-upload
                                v-if="!imageUrl"
                                class="upload"
                                :file-list="fileList"
                                ref="upload"
                                :show-file-list="false"
                                :action="`/api/sysmgr-web/file/upload`"
                                :auto-upload="false"
                                :on-change="getImg"
                                :multiple="false"
                                name="file"
                                accept=".jpg, .png">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <img @click="showVoucher = true" style="width: 300px" v-else :src="`/api/sysmgr-web/file/download?downloadCode=${imageUrl}`" alt="">
                        &nbsp;<el-button type="text" class="clear" @click="clearImg">重新上传充值凭证</el-button>
                    </div>
                    <div class="title">充值凭证</div>
                    <div class="det">
                        <div style="float: left;">上传充值凭证：</div>
                        <el-upload
                                v-if="!detail.subDownloadCode"
                                ref="upload"
                                class="upload"
                                :show-file-list="false"
                                :action="`/api/sysmgr-web/file/upload`"
                                :auto-upload="false"
                                :on-change="getUploadId"
                                :multiple="false"
                                name="file"
                                accept=".jpg, .png">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <img @click="showSub = true" style="width: 300px" v-else :src="`/api/sysmgr-web/file/download?downloadCode=${detail.subDownloadCode}`" alt="">
                        &nbsp;<el-button type="text" class="clear" @click="clearUploadId">重新上传充值凭证</el-button>
                    </div>
                </template>
                <div class="det">选择渠道帐号：
                    <el-select size="small" v-model="balanceAccountId" @change="getSuggest" style="width: 500px" :disabled="detail.state != 20 ? true : false">
                        <el-option v-for="e in channlList" :key="e" :label="`${e.channelAlias}/${e.channelLoginAcctNo}/${e.channelMerCustId}`" :value="e.balanceAccountId"></el-option>
                    </el-select>
                </div>
                <div class="det" v-if="suggest">帐号今日可充建议：{{suggest.allowAvailBalance | formatMoney}}元&#x3000;帐号当前余额：{{suggest.currentAvailBalance | formatMoney}}元&#x3000;
                    日发放限额：{{suggest.limitAvailBalance | formatMoney}}元&#x3000;当日已发：{{suggest.outAvailBalance | formatMoney}}元
                </div>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button size="small" @click="show = false">取消</el-button>
                <template v-if="detail.state == 20 && checkRight(permissions, 'balance-web:/recharge-order/failOnRechargeDocumentMake')">
                    <el-button size="small" type="primary" @click="ensure(40, 1)">未到账</el-button>
                </template>
                <template v-if="detail.state == 21 && checkRight(permissions, `balance-web:/recharge-order/${detail.isAutoRecharge == 1 ? 'risk-approve' : 'approve'}`)">
                    <el-button size="small" type="primary" @click="ensure(40)">未到账</el-button>
                </template>
                <template v-if="detail.state == 20 && checkRight(permissions, 'balance-web:/recharge-order/rechargeDocumentMake')">
                    <el-button size="small" type="primary" @click="touch">我已制单</el-button>
                </template>
                <template v-if="detail.state == 21 && checkRight(permissions, `balance-web:/recharge-order/${detail.isAutoRecharge == 1 ? 'risk-approve' : 'approve'}`)">
                    <el-button size="small" type="primary" @click="ensure(30)">确认到账</el-button>
                </template>
                <template v-if="detail.state == 30 && checkRight(permissions, 'balance-web:/recharge-order/editRechargeCertificate')">
                    <el-button size="small" type="primary" @click="save">保存</el-button>
                </template>
            </div>
        </el-dialog>
        <div class="v-modal" v-show="showExa" @click="showExa = false" :style="prevUrl ? {'background-image': `url(${prevUrl})`} : ''"></div>
        <div class="v-modal" v-if="detail && detail.customDownloadCodes" v-show="showAttr" @click="showAttr = false" :style="{ backgroundImage: `url(/api/sysmgr-web/file/download?downloadCode=${detail.customDownloadCodes[attrIndex]}`}"></div>
        <div class="v-modal" v-if="detail" v-show="showVoucher" @click="showVoucher = false" :style="{ backgroundImage: `url(/api/sysmgr-web/file/download?downloadCode=${detail.financeDownloadCode}`}"></div>
        <div class="v-modal" v-if="detail" v-show="showSub" @click="showSub = false" :style="{ backgroundImage: `url(/api/sysmgr-web/file/download?downloadCode=${detail.subDownloadCode}`}"></div>
        <el-dialog title="进度" :visible.sync="showPro" :show-close="false" :close-on-press-escape="false" :close-on-click-modal="false">
            <div class="pro_box">
                <div :style="{width: `${proNum}%`}"></div>
            </div>
            <div class="pro_num">
                {{proNum}}%
            </div>
        </el-dialog>
        <vmodal :prevList="prevList" :showVModal="showVModal" @clickSelf="showVModal = false"></vmodal>
        <knotty @handle="auditCb" ref="knotty"></knotty>
    </div>
</template>

<script>
    import { mapGetters } from "vuex";
    import _ from "lodash";
    import { formatTime, urlEncode } from "../../../plugin/utils-functions";
    import { checkMoney } from "../../../plugin/utils-element-validator";
    import { showNotify } from "../../../plugin/utils-notify";
    import { showConfirm, showAlert } from "../../../plugin/utils-message";
    import { baseUrl } from "../../../config/address";
    import { get, post, importPost } from "../../../store/api";
    import {showLoading, hideLoading} from '../../../plugin/utils-loading'
    import vmodal from '../../../pageComponent/v-modal.vue'
    import knotty from '../../workOrder/dialog/knotty'
    import { workflow } from "src/api"

    function minNumber (value) {
        var str = value.toString();
        var ArrMen = str.split('.');    //截取字符串
        if(ArrMen.length==2) {
            if(ArrMen[1].length>2) {    //判断小数点后面的字符串长度
                return false;
            }
        }
        return true;
    }

    export default {
        name: "credit-bill",
        components: {
            vmodal,
            knotty
        },
        data() {
            var time = new Date();
            var t = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1) }-${time.getDate()}`
            time = time.getTime() - 1000 * 60 * 60 * 24 * 7
            time = new Date(time);
            var t_0 = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1) }-${time.getDate()}`
            var checkNumber = (rule, value, callback) => {
                if(!minNumber(value)) {
                    callback(new Error('只能输入2位小数'));
                } else {
                    callback();
                }
            }
            return {
                pageSize: 10,
                currentPage: 1,
                dialogCreateForm: {
                    companyId: "",
                    appId: "",
                    serviceCompanyId: '',
                    adjustType: '',
                    bankType: "",
                    channelBalanceAccountId: '',
                    amount: '',
                    serviceFeeAmount: '',
                    yearMonth: '',
                    memo: "",
                    attachmentIds: [],
                    subServiceCompanyId: ''
                },
                dialogCreateFormRules: {
                    companyId: [{ required: true, message: "请选择客户公司", trigger: "change"}],
                    appId: [{ required: true, message: "请选择商户", trigger: "change"}],
                    serviceCompanyId: [{ required: true, message: '请选择服务商', trigger: 'change' }],
                    adjustType: [{ required: true, message: '请选择平账操作', trigger: 'change' }],
                    bankType: [{ required: true, message: "请选择业务类型", trigger: "change"}],
                    channelBalanceAccountId: [{ required: true, message: '请选择渠道账号', trigger: 'change'}],
                    amount: [
                        { required: true, message: "请输入实发金额", trigger: "blur" },
                        { validator: checkNumber, trigger: 'blur' }
                    ],
                    serviceFeeAmount: [
                        { required: true, message: "请输入服务费金额", trigger: "blur" },
                        { validator: checkNumber, trigger: 'blur' }
                    ],
                    yearMonth: [{ required: true, message: "请选择月份", trigger: "blur" }],
                    memo: [{ required: true, message: "请填写申请说明", trigger: "blur"}],
                    attachmentIds: [{ required: true, message: "请上传凭证", trigger: "blur"},]
                },
                dialogCreateVisible: false,
                formSearch: {
                    adjustAtBegin: "",
                    adjustAtEnd: "",
                    page: 1,
                    pageSize: 10,
                    companyId: '',
                    appId: '',
                    adjustType: '',
                    bankType: '',
                    paymentThirdType: ''
                },
                dateValue: [],
                orderInfo: "",
                dialogConfirmVisible: false,
                rechargeApplyList: {},
                show: false,
                fileList: [],
                detail: {},
                imageUrl: '',
                attachmentId: '',
                memo: '',
                channelTypes: [],
                channels: [],
                attachmentUrl: '',
                supUrl: '',
                calc: '',
                calcServiceFee: '',
                serviceFee: 0,
                serviceName: [],
                channlList: [],
                balanceAccountId: '',
                suggest: '',
                payUserId: '',
                showAttr: false,
                showVoucher: false,
                showSub: false,
                detail: '',
                msg: '',
                sub: '',
                payUserMsg: '',
                subCompany: '',
                subServiceCompanyId: '',
                uploadUrl: '',
                subMsg: '',
                showDetail: false,
                rechargeMsg: '',
                isRecharge: false,
                showExa: false,
                uploadList: [
                    {
                        imageUrl: '',
                        attachmentId: ''
                    }
                ],
                attrIndex: 0,
                currentIndex: 0,
                readyList: [],
                delay: 0,
                isRe: false,
                showPro: false,
                delay: '',
                proNum: 0,
                frame: '',
                riskApprove: '',
                listen: '',
                outMsg: '',
                adjustType: '',
                adjustTypeList: [],
                productNameList: [],
                ChannelTypeList: [],
                ThirdPaymentTypeList: [],
                prevList: [],
                showVModal: false,
                windowOpener: ''
            };
        },
        watch: {
            "dialogCreateForm.companyId": function() {
                if (this.dialogCreateForm.companyId) {
                    this.$store.dispatch("getAppList", {
                        companyId: this.dialogCreateForm.companyId
                    });
                }
            },
            'formSearch.companyId': function () {
                if (this.formSearch.companyId) {
                    this.formSearch.appId = '';
                    let param = {
                        companyId: this.formSearch.companyId
                    };
                    get('/api/sysmgr-web/commom/app-list', param).then(result => {
                        this.productNameList = result;
                    })
                }
            },
            'dialogCreateForm.amount': function(a) {
                clearTimeout(this.calc)
                this.calc = setTimeout(() => {
                    this.getServiceFee()
                }, 500)
            }
        },
        computed: {
            ...mapGetters({
                //   rechargeApplyList: "rechargeApplyList",
                optionTypes: "optionTypes",
                curServiceCompanies: "curServiceCompanies",
                userInformation: "userInformation",
                productName: "productName",
                customCompanies: "customCompanies",
                permissions: 'permissions'
            })
        },
        mounted() {
            this.setTime();
            this.$store.dispatch("getByTypes", [
                "RechargeOrderStateType",
                "ChannelType",
                "ChannelBelongType",
                "ThirdPaymentType"
            ]);
            this.getOptions();
            this.$store.dispatch("getCurServiceCompanies");
            this.$store.dispatch("getCustomCompanies");
            this.listenSearch();
            this.getAdjustTypeList();
        },
        beforeDestroy() {
            cancelAnimationFrame(this.listen)
        },
        methods: {
            handle(param, look = false, isMe = false) {
                param.businessType = param.sourceType
                param.businessId = param.sourceId
                switch (param.businessType) {
                    case 'puzzle-customer-flow':
                    case 'puzzle-service-flow':
                    case 'puzzle-channel-flow':
                    case 'puzzle-merchant-flow':
                    case 'puzzle-others-flow':
                        get(workflow.queryInstanceId, {
                            businessType: param.businessType,
                            businessId: param.businessId
                        }).then(data => {
                            param.processInstanceId = data
                            this.$refs.knotty.transmit({
                                show: true,
                                param,
                                look
                            })
                        })
                        break;
                    default:
                        break;
                }
            },
            auditCb() {

            },
            getOptions() {
                get('/api/balance-web/commom/option?enumType=ChannelType').then(result => {
                    this.ChannelTypeList = result;
                });
                get('/api/balance-web/commom/option?enumType=ThirdPaymentType').then(result => {
                    this.ThirdPaymentTypeList = result;
                });
            },
            listenSearch() {
                this.listen = requestAnimationFrame(this.listenSearch);
                if(this.riskApprove != this.$route.query.riskApprove) {
                    this.riskApprove = this.$route.query.riskApprove;
                    if(this.riskApprove) {
                        this.formSearch.state = 21;
                        this.formSearch.isAutoRecharge = 1;
                    }
                    else {
                        this.formSearch.state = '';
                        delete this.formSearch.isAutoRecharge;
                    }
                    this.query()
                }
            },
            query(page) {
                if(isNaN(page)) {
                    page = 1
                }
                this.formSearch.page = page;
                post(`/api/balance-web/balance-adjust/list`, this.formSearch).then(data => {
                    this.rechargeApplyList = data
                })
            },
            exportFile() {
                var str = ''
                for(var k in this.formSearch) {
                    if(k != 'page' && k != 'pageSize') {
                        if(!str) {
                            str += `?${k}=${this.formSearch[k]}`
                        }
                        else {
                            str += `&${k}=${this.formSearch[k]}`
                        }
                    }
                }
                location.href = `${baseUrl}/api/balance-web/balance-adjust/export-balance-adjust-list${str}`
            },
            sizeChange(a) {
                this.formSearch.pageSize = a
                this.query()
            },
            getDetail(a) {
                this.attachmentId = ''
                this.imageUrl = ''
                this.memo = ''
                this.uploadUrl = ''
                this.subUploadId = ''
                get('/api/balance-web/recharge-order/query-detail', {
                    orderNo: a.orderNo
                }).then(data => {
                    this.detail = data
                    this.show = true
                    this.showDetail = false
                    this.subServiceCompanyId = this.detail.subServiceCompanyId
                    this.imageUrl = this.detail.financeDownloadCode
                    this.memo = this.detail.memo
                    // this.subUploadId = this.detail.subUploadId
                    // this.uploadUrl = this.detail.subDownloadCode ? `/api/sysmgr-web/file/download?downloadCode=${this.detail.subDownloadCode}` : ''
                    this.getChannlList()
                    this.getSubCompany()
                    this.getSubMsg()
                })
            },
            getVModal(id) {
                let url = '/api/balance-web/balance-adjust/attachments';
                let param = {
                    id: id
                };
                post(url, param).then(res => {
                    this.prevList = res;
                    this.showVModal = true;
                })
            },
            getChannlList() {
                get('/api/balance-web/balance-account/query-balance-account-channel-list', {
                    serviceCompanyId: this.detail.serviceCompanyId,
                    subServiceCompanyId: this.subServiceCompanyId ? this.subServiceCompanyId : '',
                    appId: this.detail.appId,
                    bankType: this.detail.bankType
                }).then(data => {
                    this.channlList = data
                    this.balanceAccountId = ''
                    this.channlList.forEach(e => {
                        if(e.payUserId == this.detail.payUser.payUserId) {
                            this.balanceAccountId = e.balanceAccountId
                            this.getSuggest()
                        }
                    })
                })
            },
            getSubCompany() {
                get('/api/sysmgr-web/commom/subcontract-service-companies', {
                    appId: this.detail.appId,
                    serviceCompanyId: this.detail.serviceCompanyId
                }).then(data => {
                    this.subCompany = data
                })
            },
            getSuggest() {
                this.channlList.forEach(e => {
                    if(e.balanceAccountId == this.balanceAccountId) {
                        this.payUserId = e.payUserId
                        get('/api/balance-web/balance-account/get-avail-balance-info', {
                            balanceAccountId: e.balanceAccountId,
                            payUserId: e.payUserId,
                            paymentThirdType: e.paymentThirdType
                        }).then(data => {
                            this.suggest = data
                        })
                    }
                })
            },
            clearApp() {
                this.dialogCreateForm.appId = ''
                this.dialogCreateForm.bankType = ''
                this.dialogCreateForm.serviceCompanyId = ''
                this.msg = ''
                this.sub = ''
            },
            getService() {
                get('/api/sysmgr-web/commom/app-service-company-list', {
                    appId: this.dialogCreateForm.appId
                }).then(data => {
                    this.dialogCreateForm.bankType = ''
                    this.dialogCreateForm.serviceCompanyId = ''
                    this.msg = ''
                    this.sub = ''
                    this.serviceName = data
                })
            },
            getChannlType() {
                this.dialogCreateForm.bankType = ''
                get('/api/balance-web/balance-adjust/select-bank-type', {
                    appId: this.dialogCreateForm.appId,
                    // companyId: this.dialogCreateForm.companyId,
                    serviceCompanyId: this.dialogCreateForm.serviceCompanyId
                }).then(data => {
                    // this.msg = data.serviceCompanyInfo
                    // this.sub = data.subCompanyInfo
                    // this.sub && (this.dialogCreateForm.subServiceCompanyId = this.sub.companyId)
                    this.channelTypes = data
                    // this.calcServiceFee = data.calcServiceFee
                    // this.prePayContent = JSON.parse(data.prePayContent)
                    // this.isRecharge = false
                    // this.getServiceFee()
                })
            },
            getChannel() {
                this.dialogCreateForm.channelBalanceAccountId = ''
                // this.outMsg = ''
                // this.dialogCreateForm.toBalanceAccountId = ''
                // this.inMsg = ''
                this.channels = []
                // this.channels_0 = []
                this.serviceName.forEach(e => {
                    if(e.value == this.dialogCreateForm.serviceCompanyId) {
                        this.dialogCreateForm.serviceCompanyName = e.text
                    }
                })
                if(this.dialogCreateForm.appId && this.dialogCreateForm.serviceCompanyId && this.dialogCreateForm.bankType) {
                    get('/api/balance-web/balance-account/query-balance-account-channel-list', {
                        appId: this.dialogCreateForm.appId,
                        serviceCompanyId: this.dialogCreateForm.serviceCompanyId,
                        bankType: this.dialogCreateForm.bankType,
                        subServiceCompanyId: this.dialogCreateForm.subServiceCompanyId
                    }).then(data => {
                        this.channels = data
                    })
                }
            },
            getAdjustTypeList() {
                get('/api/balance-web/commom/option?enumType=BalanceAdjustType').then(data => {
                    this.adjustTypeList = data
                })
            },
            getRechargeMsg(e) {
                let item = this.channels.find(function (element) {
                    return element.balanceAccountId == e;
                });
                this.dialogCreateForm.paymentThirdType = item.paymentThirdType;
                this.dialogCreateForm.bankType = item.bankType;
                get('/api/balance-web/recharge-order/query-direct-recharge-user-account', {
                    appId: this.dialogCreateForm.appId,
                    serviceCompanyId: this.dialogCreateForm.serviceCompanyId,
                    channelType: this.dialogCreateForm.channelBusinessType
                }).then(data => {
                    // this.rechargeMsg = data
                    !this.rechargeMsg && this.getServiceFee()
                    this.isRecharge = true
                })
            },
            getServiceFee() {
                var digit = this.dialogCreateForm.amount.toString().split('.')[1]
                this.serviceFee = 0
                if(this.calcServiceFee && this.dialogCreateForm.companyId && this.dialogCreateForm.serviceCompanyId && !isNaN(this.dialogCreateForm.amount) && (!digit || (digit && digit.length <= 2))) {
                    get('/api/contract-web/contract/calc-serviceFee', {
                        amount: this.dialogCreateForm.amount,
                        companyId: this.dialogCreateForm.companyId,
                        serviceCompanyId: this.dialogCreateForm.serviceCompanyId,
                        calcType: 'prePay'
                    }).then(data => {
                        this.serviceFee = data
                    })
                    if(this.sub) {
                        get('/api/balance-web/recharge-order/payuser', {
                            appId: this.dialogCreateForm.appId,
                            companyId: this.dialogCreateForm.companyId,
                            serviceCompanyId: this.dialogCreateForm.serviceCompanyId,
                            channelType: this.dialogCreateForm.channelBusinessType
                        }).then(data => {
                            this.payUserMsg = data
                        })
                    }
                }
            },
            getImg(a) {
                var formData = new FormData()
                formData.append('targetType', 'recharge_voucher_img')
                formData.append('fileName', a.name)
                formData.append('file', a.raw)
                importPost('/api/sysmgr-web/file/upload', formData).then(data => {
                    this.attachmentId = data.referId
                    this.imageUrl = data.downloadCode
                    this.detail.financeDownloadCode = data.downloadCode
                })
            },
            clearImg() {
                this.imageUrl = ''
                this.attachmentId = ''
                // this.detail.financeDownloadCode = ''
            },
            getUploadId(a) {
                this.uploadUrl = URL.createObjectURL(a.raw);
                var formData = new FormData()
                formData.append('targetType', 'recharge_voucher_img')
                formData.append('fileName', a.name)
                formData.append('file', a.raw)
                importPost('/api/sysmgr-web/file/upload', formData).then(data => {
                    this.subUploadId = data.referId
                    this.detail.subDownloadCode = data.downloadCode
                })
            },
            clearUploadId() {
                this.uploadUrl = ''
                this.subUploadId = ''
                this.detail.subDownloadCode = ''
            },
            getAttachment(a) {
                this.readyList.push(a)
                clearTimeout(this.delay)
                this.delay = setTimeout(() => {
                    showLoading()
                    this.uploadByOrder()
                }, 10)
            },
            uploadByOrder() {
                var a = this.readyList.shift()
                if(!a) {
                    hideLoading()
                    return
                }
                if(this.uploadList.length >= 10 && this.uploadList[this.uploadList.length - 1].imageUrl && !this.isRe) {
                    hideLoading()
                    this.$message({
                        type: 'warning',
                        message: '最多只能上传10张图片！'
                    })
                    return
                }
                this.uploadList[this.currentIndex].imageUrl = URL.createObjectURL(a.raw);
                var formData = new FormData()
                formData.append('targetType', 'recharge_voucher_img')
                formData.append('fileName', a.name)
                formData.append('file', a.raw)
                importPost('/api/sysmgr-web/file/upload', formData, true).then(data => {
                    this.uploadList[this.currentIndex].attachmentId = data.referId
                    if(this.currentIndex + 1 == this.uploadList.length && this.uploadList.length < 10) {
                        this.uploadList.push({
                            imageUrl: '',
                            attachmentId: ''
                        })
                    }
                    if(!this.isRe) {
                        this.currentIndex++
                        this.uploadByOrder()
                    }
                    else {
                        hideLoading()
                        this.readyList.length = 0
                        this.isRe = false
                    }
                })
            },
            getSubUploadId(a) {
                this.supUrl = URL.createObjectURL(a.raw);
                var formData = new FormData()
                formData.append('targetType', 'recharge_voucher_img')
                formData.append('fileName', a.name)
                formData.append('file', a.raw)
                importPost('/api/sysmgr-web/file/upload', formData).then(data => {
                    this.dialogCreateForm.subUploadId = data.referId
                })
            },
            getSubMsg() {
                if(!this.subServiceCompanyId) {
                    return
                }
                get('/api/balance-web/recharge-order/company-bank', {
                    companyId: this.subServiceCompanyId
                }).then(data => {
                    this.subMsg = data
                })
                this.getChannlList()
            },
            save() {
                post('/api/balance-web/recharge-order/editRechargeCertificate', {
                    orderNo: this.detail.orderNo,
                    attachmentId: this.attachmentId,
                    subUploadId: this.subUploadId
                }).then(data => {
                    showNotify("success", "操作成功！");
                    this.attachmentId = ''
                    this.imageUrl = ''
                    this.subUploadId = ''
                    this.uploadUrl = ''
                    this.show = false;
                    this.query(this.formSearch.page)
                })
            },
            touch() {
                post('/api/balance-web/recharge-order/rechargeDocumentMake', {
                    orderNo: this.detail.orderNo,
                    state: 21,
                    payUserId: this.payUserId,
                    memo: this.memo
                }).then(data => {
                    this.show = false;
                    this.query(this.formSearch.page)
                })
            },
            ensure(state, type) {
                if(((!this.attachmentId || (!this.subUploadId && this.detail.subServiceCompanyId)) && state == 30) && !this.detail.isAutoRecharge) {
                    this.$message({
                        type: 'warning',
                        message: '请上传凭证！'
                    })
                    return
                }
                if(!this.balanceAccountId && state == 21) {
                    this.$message({
                        type: 'warning',
                        message: '请选择渠道账号！'
                    })
                    return
                }
                if(!this.memo && state == 40) {
                    this.$message({
                        type: 'warning',
                        message: '请填写备注！'
                    })
                    return
                }
                post(`/api/balance-web/recharge-order/${type ? 'failOnRechargeDocumentMake' : this.detail.isAutoRecharge == 1 ? 'risk-approve' : 'approve'}`, {
                    attachmentId: this.attachmentId,
                    memo: this.memo,
                    orderNo: this.detail.orderNo,
                    payUserId: this.payUserId,
                    state: state,
                    subServiceCompanyId: this.subServiceCompanyId,
                    subUploadId: this.subUploadId
                }).then(
                    data => {
                        this.attachmentId = ''
                        this.imageUrl = ''
                        this.subUploadId = ''
                        this.uploadUrl = ''
                        showNotify("success", "操作成功！");
                        this.show = false;
                        this.query(this.formSearch.page)
                    }
                );
            },
            search: function() {
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize
                });
            },
            setTime() {
                if(this.dateValue && this.dateValue.length) {
                    this.formSearch.adjustAtBegin = this.dateValue[0]
                    this.formSearch.adjustAtEnd = this.dateValue[1]
                }
                else {
                    this.formSearch.adjustAtBegin = ''
                    this.formSearch.adjustAtEnd = ''
                }
            },
            clear: function() {
                this.$refs["formSearch"].resetFields();
                this.dateValue = [];
                this.setTime()
                console.log(this.formSearch)
            },
            handleSizeChange(value) {
                this.pageSize = value;
                this.currentPage = 1;
                this.requestAction({ page: this.currentPage, pageSize: value });
            },
            handleCurrentChange(value) {
                this.currentPage = value;
                this.requestAction({
                    page: value,
                    pageSize: this.pageSize
                });
            },
            requestAction: function(pageInfo) {
                let startTime = "";
                let endTime = "";
                if (this.formSearch.dateValue) {
                    startTime = formatTime(this.formSearch.dateValue[0], "yyyy-MM-dd");
                    endTime = formatTime(this.formSearch.dateValue[1], "yyyy-MM-dd");
                }
                let param = {
                    adjustAtBegin: startTime,
                    adjustAtEnd: endTime,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize
                };
                param = _.assign(param, this.formSearch);
                this.$store.dispatch("getRechargeApplyList", param);
            },
            receiveMoney(orderNo) {
                showConfirm({
                    title: "提示",
                    msg: "确定已到账吗？",
                    confirmCallback: () => {
                        post("/api/balance-web/recharge-order/approve", {
                            orderNo: orderNo,
                            state: 30
                        }).then(data => {
                            showNotify("success", "操作成功！");
                            this.search();
                        });
                    }
                });
            },
            unReceiveMoney(orderNo) {
                showConfirm({
                    title: "提示",
                    msg: "确定未到账吗？",
                    confirmCallback: () => {
                        post("/api/balance-web/recharge-order/approve", {
                            orderNo: orderNo,
                            state: 40
                        }).then(data => {
                            showNotify("success", "操作成功！");
                            this.search();
                        });
                    }
                });
            },
            submitDialogCreateForm() {
                this.dialogCreateForm.attachmentIds = []
                this.uploadList.forEach(e => {
                    e.attachmentId && this.dialogCreateForm.attachmentIds.push(e.attachmentId)
                })
                this.$refs["dialogCreateForm"].validate(valid => {
                    if (valid) {
                        post("/api/balance-web/balance-adjust/create", this.dialogCreateForm).then(data => {
                            // showNotify('success','操作成功！')
                            this.$refs["dialogCreateForm"].resetFields();
                            this.orderInfo = data;
                            this.attachmentUrl = ''
                            this.attachmentId = ''
                            this.calcServiceFee = false
                            this.dialogCreateVisible = false;
                            // this.dialogConfirmVisible = true;
                            this.query()
                        });
                    }
                });
            },
            closeEditDialog(next) {
                this.attachmentUrl = ''
                this.msg = ''
                this.sub = ''
                this.$refs["dialogCreateForm"] && this.$refs["dialogCreateForm"].resetFields();
                this.rechargeMsg = ''
                this.isRecharge = false
                this.prePayContent = ''
                this.uploadList = [
                    {
                        imageUrl: '',
                        attachmentId: ''
                    }
                ]
                next && next();
            },
            submitConfirmOrder() {
                post("/api/balance-web/recharge-order/comfirm", this.orderInfo).then(
                    data => {
                        showNotify("success", "操作成功！");
                        this.dialogConfirmVisible = false;
                        this.search();
                    }
                );
            },
            setSmsOpen(a) {
                this.dialogCreateForm.smsOpen = a
            },
            prevImg(a) {
                this.prevUrl = a
                this.showExa = true
            },
            reUpload() {
                this.isRe = true
                this.$refs.upload[this.currentIndex].$el.children[0].children[1].click()
            },
            deleteImg() {
                this.uploadList.splice(this.currentIndex, 1)
                if(this.uploadList.length == 9 && this.uploadList[this.uploadList.length -1].imageUrl) {
                    this.uploadList.push({
                        imageUrl: '',
                        attachmentId: ''
                    })
                }
            },
            download() {
                this.windowOpener = window.open()
                get('/api/balance-web/recharge-order/download-recharge-certificate', {
                    rechargeOrderId: this.detail.id
                }).then(data => {
                    this.key = data
                    this.progress()
                    this.showPro = true
                })
            },
            progress() {
                this.frame = requestAnimationFrame(this.progress)
                var currTime = new Date().getTime()
                if(!this.delay || currTime- this.delay > 1000) {
                    this.delay = currTime
                    post(`/api/console-dlv/file/download-progress?key=${this.key}`, {}, true).then(data => {
                        if(data) {
                            if(data.state == 30) {
                                this.$message({
                                    type: 'success',
                                    message: '下载成功'
                                })
                                this.showPro = false
                                cancelAnimationFrame(this.frame)
                                this.windowOpener.location.href = `/api/sysmgr-web/file/download?downloadCode=${data.downloadCode}`
                            }
                            if(data.state == 40) {
                                this.$message({
                                    type: 'error',
                                    message: '下载失败'
                                })
                                this.showPro = false
                                cancelAnimationFrame(this.frame)
                            }
                            this.proNum = data.progress
                        }
                    }).catch(err =>{
                        this.showPro = false
                        cancelAnimationFrame(this.frame)
                    })
                }
            }
        }
    };
</script>

<style scoped>
    .uploadBox {
        width: 140px;
        float: left;
        text-align: center;
        margin-right: 20px;
    }
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409eff;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
        background: #FCFCFC;
        border: 1px solid #CCCCCC;
    }
    .avatar {
        position: relative;
        width: 140px;
        height: 140px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
        display: inline-block;
    }
    .avatar-uploader-icon > div {
        line-height: 20px;
        font-size: 12px;
        margin-top: -32px;
    }
    .magnify {
        position: absolute;
        bottom: 2px;
        right: 2px;
        width: 30px;
        height: 30px;
        background-image: url(../../../image/magnify.png);
        cursor: pointer;
    }
    .title {
        font-weight: bold;
        margin-bottom: 15px;
    }
    .det {
        position: relative;
        margin-bottom: 10px;
        padding-left: 20px;
    }
    .mb35 {
        margin-bottom: 35px;
    }
    .voucher {
        position: absolute;
        top: 75px;
        right: 50px;
    }
    .upload {
        position: relative;
        top: -5px;
        display: inline-block;
    }
    .v-modal {
        z-index: 9999;
        opacity: 1;
        background-color: rgba(0, 0, 0, 0.5);
        background-repeat: no-repeat;
        background-size: 1000px auto;
        background-position: center center;
        transition: all 0.3s;
    }
    .auto {
        width: auto;
    }
    .mb0 {
        margin-bottom: 0px;
    }
    .pad {
        color: #999999;
        padding-left: 96px;
    }
    .toggle {
        color: #0283fb;
        display: inline-block;
        margin-left: 50px;
        cursor: pointer;
        user-select: none;
    }
    .tip {
        font-size: 16px;
    }
    .clear {
        position: absolute;
        bottom: 0px;
    }
    .auto {
        max-width: 700px;
    }
    .input-container .label {
        float: left;
    }
    .mr20 {
        margin-right: 20px;
        cursor: pointer;
    }
    .fr {
        float: right;
        margin-right: 54px;
    }
</style>