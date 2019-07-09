<template>
    <div class="r_main">
        <div style="margin:30px 20px;font-size:20px">{{msg.serviceCompanyInfo.name}}<el-button size="small" @click="back" style="margin-left:30px">返回</el-button></div>
        <div class="content">
            <el-card class="box-card">
                <div slot="header">
                    <span>基本信息</span>
                    <el-button type="primary" style="margin-left: 20px;" size="small" @click="routerPush('/main/landingCompany/create')">编辑</el-button>
                </div>
                <div class="text">
                    <div class="box">
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-col :span="8" class="right">公司全称</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.name}}</el-col>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="8" class="right">支持开票类型</el-col>
                                <el-col :span="15"><span>{{msg.serviceCompanyInfo.supportInvoiceTypeName}}</span></el-col>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-col :span="8" class="right">公司简称</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.shortName}}</el-col>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="8" class="right">法人姓名</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.corporateName}}</el-col>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-col :span="8" class="right">所在省市</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.provinceName}} {{msg.serviceCompanyInfo.cityName}}</el-col>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="8" class="right">法人证件号</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.corporateIdentity}}</el-col>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-col :span="8" class="right">是否直营</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.directName}}</el-col>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="8" class="right">纳税人识别号</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.taxIdcd}}</el-col>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-col :span="8" class="right">负责人</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.masterName}}</el-col>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="8" class="right">公司详细地址</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.address}}</el-col>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-col :span="8" class="right">注册状态</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.registeredName}}</el-col>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="8" class="right">联系电话</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.telephone}}</el-col>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-col :span="8" class="right">注册日期</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.registrationAt}}</el-col>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="8" class="right">公司开户行</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.bankName}}</el-col>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-col :span="8" class="right">银行账号</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.bankAccount}}</el-col>
                            </el-col>
                            <el-col :span="10">
                                <el-col :span="8" class="right">税优地</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.taxLandingName}}</el-col>
                            </el-col>
                        </el-row>
                        <el-row :gutter="20">
                            <el-col :span="10">
                                <el-col :span="10" class="right">是否有业务（用于合同）</el-col>
                                <el-col :span="10">{{msg.serviceCompanyInfo.businessedName}}</el-col>
                            </el-col>
                        </el-row>
                    </div>
                </div>
            </el-card>
            <!-- 公司业务状态及备注 s-->
            <el-card class="box-card">
                <div slot="header">
                    <span>公司业务状态及备注</span>
                </div>
                <div class="text">
                    <el-tabs v-model="checkValue">
                        <el-tab-pane label="票据状态" name="first">
                            <div v-if="this.invoice">
                                <el-button type="primary" style="margin-left: 20px;" size="small" @click="dialogAddInvoiceVisible = true">添加票量</el-button>
                                <el-button type="primary" style="margin-left: 20px;" size="small" @click="dialogInvoicelistVisible = true;handleRequest();">领票记录</el-button>
                                <el-button type="primary" style="margin-left: 20px;" size="small" @click="handleEdit">修改</el-button>
                                <div style="width:60%">
                                    <p class="fp" style="margin-left: 20px;">增值税普通发票量</p>
                                    <p class="fp">剩余票量:{{invoice.surplusPpNum}}</p>
                                    <p class="fp">最大限额：{{invoice.ppMaxAmount}}</p><br/>
                                    <p class="fp" style="margin-left: 20px;">增值税专用发票量</p>
                                    <p class="fp">剩余票量:{{invoice.surplusZpNum}}</p>
                                    <p class="fp">最大限额：{{invoice.zpMaxAmount}}</p>
                                </div>
                            </div>
                            <div v-else>
                                <el-button type="primary" style="margin-left: 20px;" size="small" @click="addLanding">添加落地公司信息</el-button>
                            </div>
                        </el-tab-pane>
                        <el-tab-pane label="穿行测试" name="second">
                            <el-button type="primary" style="margin-left: 20px;margin-bottom:20px" size="small" @click="handleChangeTest">{{testStatusWord}}</el-button>
                            <br/>
                            <el-form v-model="testForm" label-width="80px">
                                <el-form-item v-for="(e, i) in msg.testInfoList" :key="i" :label="e.serviceName" size="small" class="form_input">
                                    <el-select :disabled="testCanModify" v-model="e.status">
                                        <el-option v-for="o in testData" :value="o.id" :label="o.name" :key="o.id"></el-option>
                                    </el-select>
                                </el-form-item>
                            </el-form>
                        </el-tab-pane>
                        <el-tab-pane label="管理备注" name="third">
                            <el-button type="primary" style="margin-left: 20px;" size="small" @click="addMemoShow=true">添加备注</el-button>
                            <br/>
                            <el-table class="table" :data="memoList.list" border="">
                                <el-table-column prop="content" label="备注信息"></el-table-column>
                                <el-table-column prop="createdByName" label="添加人"></el-table-column>
                                <el-table-column prop="updatedAt" label="更新日期"></el-table-column>
                                <el-table-column label="操作">
                                    <template slot-scope="scope">
                                        <el-button @click="editMemo(scope.row)" type="text">
                                            编辑
                                        </el-button>
                                        <el-button @click="deleteMemo(scope.row.id)" type="text">
                                            删除
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                            <div class="page">
                                <el-pagination background layout="prev, pager, next" :page-size="memoList.pageSize" :total="memoList.total" @current-change="getMemoList" :currentPage="memoList.pageNum">
                                </el-pagination>
                            </div>
                        </el-tab-pane>
                    </el-tabs>
                </div>
            </el-card>
            <!-- 税优地业务方案管理 s-->
            <el-card class="box-card">
                <div slot="header">
                    <span>税优地业务方案管理</span>
                </div>
                <div class="text">
                    <el-button type="primary" size="small" @click="toScheme">新增方案</el-button>
                    <el-table v-if="schemeData.list" :data="schemeData.list">
                        <el-table-column label="方案名称" prop="name"></el-table-column>
                        <el-table-column label="适用行业">
                            <template slot-scope="scope">
                                <div v-if="scope.row.industies" v-for="e in scope.row.industies">
                                    {{e.text}}
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="服务类型">
                            <template slot-scope="scope">
                                <div v-if="scope.row.serviceTypes" v-for="e in scope.row.serviceTypes" :key="e.id">
                                    {{e.serviceName}}
                                    <!-- （{{e.taxRate}}%） -->
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="销售结算成本">
                            <template slot-scope="scope">
                                <div v-if="scope.row.costs" v-for="e in scope.row.costs" :key="e.id">
                                    {{e.name}}：{{e.rate}}%
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="合伙人分佣">
                            <template slot-scope="scope">
                                <div v-if="scope.row.commission">
                                    {{scope.row.commission.name}} * {{scope.row.commission.rate}}%
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="toScheme(scope.row.id)">修改</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="page">
      	                <el-pagination
      	                    background
      	                    layout="prev, pager, next"
      	                    :page-size="schemeForm.pageSize"
      	                    :total="schemeData.total"
      	                    @current-change="getSchemeList"
      	                    :currentPage="schemeForm.pageNo">
      	                </el-pagination>
                    </div>
                </div>
            </el-card>
            <!-- 税优地业务方案管理 e-->
            <el-card class="box-card">
                <div slot="header">
                    <span>银行账号</span>
                    <el-button type="primary" style="margin-left: 20px;" size="small" @click="bankAccountShow = true">新增</el-button>
                    <span style="font-size:14px;color:red;margin-left:10px">爱员工平台将会以此默认账号进行结算</span>
                </div>
                <div class="text">
                    <el-table class="table" :data="banklist.list" border="">
                        <el-table-column prop="bankAccount" label="账号"></el-table-column>
                        <el-table-column prop="bankAccountName" label="账户名称"></el-table-column>
                        <el-table-column prop="bankName" label="银行"></el-table-column>
                        <el-table-column prop="bankBranchName" label="开户行"></el-table-column>
                        <el-table-column prop="isDefaultName" label="默认账号"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button @click="setDefault(scope.row)" type="text" v-if="scope.row.default == false">
                                    设为默认
                                </el-button>
                                <el-button @click="updateBank(scope.row)" type="text">
                                    修改
                                </el-button>
                                <el-button @click="bankDelete(scope.row.id)" type="text">
                                    删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <div class="page">
                        <el-pagination background layout="prev, pager, next" :page-size="banklist.pageSize" :total="banklist.total" @current-change="getBankList" :currentPage="banklist.pageNum">
                        </el-pagination>
                    </div>
                </div>
            </el-card>
            <!-- 银行账号 e-->

            <el-card class="box-card">
                <div slot="header">
                    <span>账号渠道</span>
                    <el-button style="margin-left: 20px;" size="small" type="primary" @click="eshow = true">新增</el-button>
                </div>
                <div class="text">
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
                        <el-pagination background layout="prev, pager, next" :page-size="form.pageSize" :total="total" @current-change="query" :currentPage="form.pageNo">
                        </el-pagination>
                    </div>
                </div>
            </el-card>
        </div>

        <!-- 业务方案管理对话框 S -->
        <!-- <el-dialog title="新建落地公司业务方案" :visible.sync="businessShow" width="60%" style="text-align:left;">
            <el-form label-width="130px" :rules="111" :model="business" ref="cform">
                <el-form-item label="选择方案类型" prop="schemeName" size="small">
                    <el-input v-model="business.schemeName" class="f_input"></el-input>
                </el-form-item>
                <el-form-item label="关联税优地" prop="taxLandingName" size="small">
                    <el-input v-model="business.taxLandingName" class="f_input"></el-input>
                </el-form-item>
                <el-form-item label="适用行业" prop="applyIndustries" size="small">
                    <el-select v-model="business.applyIndustries" class="f_input" @change="getName">
                        <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开票类目" prop="invoiceSubjects" size="small">
                    <el-input v-model="business.invoiceSubjects" class="f_input"></el-input>
                </el-form-item>
                <el-form-item label="报税资料" prop="taxReturnInfos" size="small">
                    <el-input v-model="business.taxReturnInfos" class="f_input"></el-input>
                </el-form-item>
                <el-progress :text-inside="true" :stroke-width="2" :percentage="0"></el-progress>
                <p style="width: 130px;text-align: right;padding: 0 12px 0 0;font-weight: bold;"><span style='color: #f56c6c;margin-right: 4px;'>*</span>税费方案</p>
                <el-form-item label="落地公司增值税" prop="registerDate" size="small" class="formInline">
                    <el-input class="f_input" placeholder="请输入内容" v-model="cform.registerDate" style="width:150px">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="落地公司附加税" prop="registerDate" size="small" class="formInline">
                    <el-input class="f_input" placeholder="请输入内容" v-model="cform.registerDate" style="width:150px">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="个人增值税" prop="registerDate" size="small" class="formInline">
                    <el-input class="f_input" placeholder="请输入内容" v-model="cform.registerDate" style="width:150px">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="个人附加税" prop="registerDate" size="small" class="formInline">
                    <el-input class="f_input" placeholder="请输入内容" v-model="cform.registerDate" style="width:150px">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="个人所得税" prop="registerDate" size="small" class="formInline">
                    <el-input class="f_input" placeholder="请输入内容" v-model="cform.registerDate" style="width:150px">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="印花税" prop="registerDate" size="small" class="formInline">
                    <el-input class="f_input" placeholder="请输入内容" v-model="cform.registerDate" style="width:150px">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="资源税" prop="registerDate" size="small" class="formInline">
                    <el-input class="f_input" placeholder="请输入内容" v-model="cform.registerDate" style="width:150px">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="设置服务费率" prop="registerDate" size="small">
                    <el-input class="f_input" placeholder="请输入内容" v-model="cform.registerDate">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="设置返佣比例" prop="registerDate" size="small">
                    <el-input class="f_input" placeholder="请输入内容" v-model="cform.registerDate">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <span class="form_footer" slot="footer">
              <el-button @click="upDateBusiness" type="primary" size="small">保存</el-button>
              <el-button @click="businessShow = false" size="small">关闭</el-button>
          </span>
        </el-dialog> -->
        <!-- 业务方案管理对话框 E -->
        
        <!-- 银行账号对话框 S -->
        <el-dialog title="新增银行账号" :visible.sync="bankAccountShow" width="85%;text-align:left;" @close="bankClearData">
            <el-form label-width="130px" :rules="crules" :model="bankAccount" ref="bankAccount">
                <el-form-item label="账号" prop="bankAccount" size="small">
                    <el-input v-model="bankAccount.bankAccount" class="f_input"></el-input>
                </el-form-item>
                <el-form-item label="账户名称" prop="bankAccountName" size="small">
                    <el-input v-model="bankAccount.bankAccountName" class="f_input"></el-input>
                </el-form-item>
                <el-form-item label="银行" prop="bankName" size="small">
                    <el-input v-model="bankAccount.bankName" class="f_input"></el-input>
                </el-form-item>
                <el-form-item label="开户行" prop="bankBranchName" size="small">
                    <el-input v-model="bankAccount.bankBranchName" class="f_input"></el-input>
                </el-form-item>
                <el-form-item label="是否默认" prop="default" size="small">
                    <el-select v-model="bankAccount.default" placeholder="请选择" class="f_input">
                        <el-option v-for="item in bankStatus" :label="item.text" :value="item.value" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <span class="form_footer" slot="footer">
              <el-button @click="bankUpDate('bankAccount')" type="primary" size="small">保存</el-button>
              <el-button @click="bankAccountShow = false" size="small">关闭</el-button>
          </span>
        </el-dialog>
        <!-- 银行账号对话框 E -->

        <!-- 增加票量弹窗 s-->
        <el-dialog title="添加票量" :visible.sync="dialogAddInvoiceVisible" width="40%">
            <el-form :rules="rulesAdd" :model="formAdd" ref="formAdd">
                <div class="input-container">
                    <div class="label dialog-label text-label">月份<span>*</span>
                    </div>
                    <div class="input">
                        <el-form-item prop="selectInvoiceType" size="small">
                            <el-select v-model="formAdd.month">
                                <el-option :value="new Date().getMonth() == 0 ? 12 : new Date().getMonth()"></el-option>
                                <el-option :value="new Date().getMonth() + 1"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label dialog-label text-label">发票类型<span>*</span>
                    </div>
                    <div class="input">
                        <el-form-item prop="selectInvoiceType" size="small">
                            <el-select v-model="formAdd.selectInvoiceType" placeholder="请选择发票类型">
                                <el-option label="增值税专用发票" value="ZP"></el-option>
                                <el-option label="增值税普通发票" value="PP"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label dialog-label text-label">添加票量数量<span>*</span>
                    </div>
                    <div class="input">
                        <el-form-item prop="addInvoiceAmount" size="small">
                            <el-input v-model.number="formAdd.addInvoiceAmount"></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label dialog-label text-label">添加备注<span>*</span>
                    </div>
                    <div class="input">
                        <el-form-item prop="addInvoiceComment" size="small">
                            <el-input type="textarea" v-model="formAdd.addInvoiceComment"></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogAddInvoiceVisible=false;" size="small">取 消</el-button>
                <el-button type="primary" @click="addInvoice('formAdd')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 增加票量弹窗 e-->
        
        <!-- 领票记录弹窗 s-->
        <el-dialog title="领票记录" :visible.sync="dialogInvoicelistVisible" width="80%" @close="closeInvoiceDialog" :lock-scroll="true" style="margin-top:-5vh">
            <el-form v-model="formSelect" ref="formSelect" :inline="true">
                <el-form-item label="状态" size="small" style="float:left;">
                    <el-select v-model="formSelect.selectStatus" placeholder="请选择" @change="handleRequest()">
                        <el-option label="全部" value="00"></el-option>
                        <el-option label="有效" value="20"></el-option>
                        <el-option label="无效" value="10"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item style="float:right">
                    <el-button type="primary" @click="handleExcel" size="small">导表</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="tableInvoiceList.list" style="width: 100%;text-align:left;">
                <el-table-column prop="invoiceType" label="发票类型">
                    <template slot-scope="scope">
                        <div class="bill common" v-if="scope.row.invoiceType.indexOf('普票') > -1">普票</div>
                        <div class="bill special" v-else>专票</div>
                    </template>
                </el-table-column>
                <el-table-column prop="addNum" label="领票数量"></el-table-column>
                <el-table-column prop="maxNum" label="领取后票量" width="100"></el-table-column>
                <el-table-column prop="remark" label="备注"></el-table-column>
                <el-table-column prop="operatedBy" label="操作人"></el-table-column>
                <el-table-column prop="operatedTime" label="操作时间" width="200"></el-table-column>
                <el-table-column prop="statusName" label="状态"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" v-if="scope.row.status=='20'">
                        <el-button @click="handleCancel(scope.row.id)" type="text" size="medium" style="padding:0;">作废
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div style="padding: 20px;text-align: right;background-color: white">
                <el-pagination
                    background
                    v-if="tableInvoiceList.total > 10"
                    @size-change="handleInvoiceSizeChange"
                    @current-change="handleInvoiceCurrentChange"
                    :current-page="currentInvoicePage"
                    :page-sizes="[10, 20, 30, 40]"
                    :page-size="pageInvoiceSize || 10"
                    layout="total, prev, pager, next, sizes, jumper"
                    :total="tableInvoiceList.total">
                </el-pagination>
            </div>
        </el-dialog>
        <!-- 领票记录弹窗 e-->
        
        <!-- 备注管理弹窗 s-->
        <el-dialog title="添加备注" :visible.sync="addMemoShow" width="40%">
            <el-form label-width="80px" :rules="rulesMemoAdd" :model="formMemoAdd" ref="formMemoAdd">
               <el-form-item label="备注信息" prop="content" size="small">
                    <el-input type="textarea" v-model="formMemoAdd.content"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addMemoShow=false;" size="small">取 消</el-button>
                <el-button type="primary" @click="updateMemo('formMemoAdd')" size="small">确 定</el-button>
            </div>
        </el-dialog>
        <!-- 备注管理弹窗 e-->

        <el-dialog title="请选择渠道" :visible.sync="eshow" width="70%">
            <el-button size="small" type="primary" v-for="e in channels" :key="e.value" @click="add(e.value)">{{e.text}}</el-button>
            <span class="form_footer" slot="footer">
              <el-button @click="eshow = false" size="small">取消</el-button>
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
import {showNotify} from '../../plugin/utils-notify';
import { setTimeout } from 'timers';
var baseUrl = require("../../config/address.js").baseUrl;
export default {
    data() {
        var numReg = /^[1-9]\d*$/;
        var validatenumber = (rule, value, callback) => {
            if(value == ''){
                callback(new Error('请填写票量数量'))
            }else if(!numReg.test(value)) {
                callback(new Error('票量数量必须为正整数'))
            } else if(value > 1000){
                callback(new Error('票量数量不能大于1000'))
            }else{
                callback()
            }
        };
        var validateMemo = (rule, value, callback) => {
            if(value == ''){
                callback(new Error('请填写备注信息'))
            }else if(value.length > 64) {
                callback(new Error('备注信息最多64个字符'))
            }else{
                callback()
            }
        };
        return {
            baseUrl: baseUrl,
            fullName: '',
            cform: {},
            crules: {
                bankAccount: [{
                    required: true,
                    message: "请输入账号",
                    trigger: "change"
                }],
                bankAccountName: [{
                    required: true,
                    message: "请输入账户名称",
                    trigger: "change"
                }],
                bankBranchName: [{
                    required: true,
                    message: "请输入开户行",
                    trigger: "change"
                }],
                bankName: [{
                    required: true,
                    message: "请输入银行",
                    trigger: "change"
                }]
            },
            form: {
                companyId: "",
                endAt: "",
                orderBy: "",
                pageNo: 1,
                pageSize: 10
            },
            rules: {
                appName: [{
                    required: true,
                    message: "请输入应用名称",
                    trigger: "change"
                }],
                serviceCompanyId: [{
                    required: true,
                    message: "请选择服务商",
                    trigger: "change"
                }],
                isFromOutApp: [{
                    required: true,
                    message: "请选择应用类型",
                    trigger: "change"
                }],
                appId: [{
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
            chars: "",
            phoneCode: "",
            currEvent: "",
            msg: {
                serviceCompanyInfo:{},
            },
            channels: [{
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
                },
                {
			        text: '华夏银行',
			        value: 'hxb'
                },
                {
                    text: '易宝',
                    value: 'yeepay'
                },
                {
                    text: '连连支付',
                    value: 'lianlianpay'
    		    },
                {
                    text: '阿里网商',
                    value: 'alibank'
                },
                {
                    text: '薪太软',
                    value: 'xtr'
                }
            ],
            checkValue: 'first',
            businessShow:false,
            dialogAddInvoiceVisible:false,
            formAdd: {
                month: '',
                selectInvoiceType: '',
                addInvoiceAmount: '',
                addInvoiceComment: ''
            },
            rulesAdd: {
                selectInvoiceType: [
                    {
                        required: true,
                        message: "请选择发票类型",
                        trigger: "blur"
                    }
                ],
                addInvoiceAmount: [
                    {
                        validator: validatenumber,
                        trigger: "blur"
                    }
                ],
                addInvoiceComment: [
                    {
                        required: true,
                        message: "请填写备注",
                        trigger: "blur"
                    }
                ]
            },
            dialogInvoicelistVisible:false,
            pageInvoiceSize: 10,
            currentInvoicePage: parseInt(this.$route.query.page) || 1,
            formSelect:{
                selectStatus: '20',
            },
            tableInvoiceList:[],
            //票据状态
            invoice:{},
            //穿行测试
            testCanModify:true,
            testStatusWord:'修改状态',
            testData:{},
            testForm:[],
            oldTest:{},
            //备注
            addMemoShow:false,
            memoList:[],
            formMemoAdd:{
                id:"",
                content:""
            },
            rulesMemoAdd:{
                content: [
                    {
                        validator: validateMemo,
                        trigger: "blur"
                    }
                ],
            },
            //业务方案管理
            // business:{},
            //银行账号管理
            bankAccountShow:false,
            banklist:{},
            bankAccount:{
                bankAccount:"",
                bankAccountName:"",
                bankName:"",
                bankBranchName:"",
                default:false,
            },
            bankStatus:[
                {
                    text:'是',
                    value:true
                },{
                    text:'否',
                    value:false
                }
            ],
            schemeForm: {
                pageNo: 1,
                pageSize: 10,
                serviceCompanyId: ''
            },
            schemeData: {}
        };
    },
    activated() {
        this.form.companyId = localStorage.getItem("appId");
        this.schemeForm.serviceCompanyId = localStorage.getItem("appId");
        this.fullName = localStorage.getItem('fullName')
        this.getData();
        this.getBankList();
        //备注列表
        this.getMemoList();
        this.query();
        /*get("/api/console-dlv/option/get-option-service-companies").then(data => {
            this.company = data;
        });*/
        this.getSchemeList();
    },
    mounted() {
        this.formAdd.month = new Date().getMonth() + 1
    },
    // computed: {
    //     ...mapGetters({
    //         userInformation: 'userInformation'
    //     })
    // },
    methods: {
        back() {
            this.$router.push({path:'/main/landingCompany/list'})
        },
        getData(){
            //票据状态
            // get(`/api/invoice-web/service-company/detail?id=${this.form.companyId}`).then(data => {
            //     this.invoice = data;
            // })
            get(`/api/invoice-web/invoice-monitor/serviceCompanyTicket?serviceCompanyId=${this.form.companyId}`).then(data => {
                this.invoice = data;
            })

            //get all
            get(`/api/salemgt/service-company/query/details/${this.form.companyId}`).then(data => {
                //深拷贝保存老数据
                this.oldTest = JSON.parse(JSON.stringify(data.testInfoList));
                this.msg = data;
            })

            //穿行测试
            get(`/api/salemgt/config/service_tests`).then(data => {
                data.forEach(r => {
                    r.id = parseInt(r.id)
                });
                this.testData = data;
            })
        },
        addInvoice(formName) {
            let self = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    let param = {
                        id: this.form.companyId,
                        addNum: this.formAdd.addInvoiceAmount,
                        invoiceType: this.formAdd.selectInvoiceType,
                        remark: this.formAdd.addInvoiceComment,
                        month: this.formAdd.month
                    };
                    post('/api/invoice-web/service-company/add-num', param).then(data => {
                        showNotify('success', data);

                        this.$refs['formAdd'].resetFields()
                        this.dialogAddInvoiceVisible = false;
                        //重新调用数据接口 todo
                    })
                }
            })
        },
        handleInvoiceSizeChange(value) {
            this.pageInvoiceSize = value;
            this.currentInvoicePage = 1;
            this.requestInvoiceAction({page: this.currentInvoicePage, pageSize: value,});
        },
        handleInvoiceCurrentChange(value) {
            this.currentInvoicePage = value;
            if (this.currentChangeBySetting) {
                this.currentChangeBySetting = false;
                return;
            }
            this.requestInvoiceAction({
                page: value,
                pageSize: this.pageInvoiceSize,
            });
        },
        requestInvoiceAction(pageInfo) {
            let param = {
                serviceCompanyId: this.form.companyId,
                page: pageInfo.page,
                pageSize: pageInfo.pageSize,
                status:this.formSelect.selectStatus,
            };
            post('/api/invoice-web/service-company/add-num-list', param).then(data => {
                data.list.forEach(item => {
                    if (item) {
                        if (item.maxNum == 0) {
                            item.maxNum = '--';
                        }
                        if(item.invoiceType == 'ZP'){
                            item.invoiceType = '专票';
                        }else{
                            item.invoiceType = '普票';
                        }
                    }
                })
                this.tableInvoiceList = data;
            })
        },
        handleRequest(){
            this.requestInvoiceAction({
                page: this.currentInvoicePage,
                pageSize: this.pageInvoiceSize,
            });
        },
        handleExcel(){
            window.location.href = baseUrl + '/api/invoice-web/service-company/export-add-num?serviceCompanyId=' + this.form.companyId
                + '&page=1'
                + '&pageSize=1'
                + '&status=' + this.formSelect.selectStatus;
        },
        handleCancel(id){
            this.$confirm('您确认要作废当前票量吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let param = {
                    id: id,
                };
                get('/api/invoice-web/service-company/cancel', param).then(data => {
                    showNotify('success', data);
                    this.requestInvoiceAction({
                        page: this.currentInvoicePage,
                        pageSize: this.pageInvoiceSize,
                    });
                })
            })
        },
        closeInvoiceDialog(){
            this.formSelect.selectStatus = '20';
            //重新调用数据接口 todo
        },
        handleEdit() {
            this.$router.push({
                path: '/main/billingManager/create',
                query: {
                    companyId: this.form.companyId,
                    page: this.$route.query.page
                }
            });
        },
        //穿行测试
        handleChangeTest(){
            if(this.testCanModify == true){
                this.testCanModify = false;
                this.testStatusWord = '保存状态';
            }else{
                //修改
                this.testForm = [];
                for(var i in this.msg.testInfoList){
                    if(this.oldTest[i].status != this.msg.testInfoList[i].status){
                        this.testForm.push({'serviceCode':this.msg.testInfoList[i].serviceCode,'status':this.msg.testInfoList[i].status});
                    }
                };
                let param = {
                    companyId:this.form.companyId,
                    serviceTestParamList:this.testForm,
                };
                post('/api/salemgt/service-company/test/update',param).then(data => {
                    showNotify('success', data);
                    this.getData();
                    this.testCanModify = true;
                    this.testStatusWord = '修改状态';
                });
            }
        },
        //票据状态
        addLanding(){
            let newlink = '/main/billingManager/create' + '?taxIdcd=' + this.msg.serviceCompanyInfo.taxIdcd + '&name=' + this.msg.serviceCompanyInfo.name;
            this.$router.push(newlink);
        },
        //基本信息编辑
        routerPush(link) {
            let newlink = link + '?id=' + this.form.companyId;
            this.$router.push({path: newlink});
            
        },
        //管理备注
        getMemoList(num = 1){
            let param = {
                id: this.form.companyId,
                pageNo: num,
                pageSize: 5
            };
            post('/api/salemgt/service-company/query/memo/list',param).then(data => {
                this.memoList = data;
                console.log(data);
            })
        },
        editMemo(val){
            this.formMemoAdd.id = val.id;
            this.formMemoAdd.content = val.content;
            this.addMemoShow = true;
        },
        updateMemo(formName){
            let self = this;
            this.$refs[formName].validate(valid => {
                if (valid) {
                    if(this.formMemoAdd.id){
                        var param = {
                            id:this.formMemoAdd.id,
                            companyId:this.form.companyId,
                        }
                    }else{
                        var param = {
                            companyId:this.form.companyId,
                        }
                    }
                    Object.assign(param, param, this.formMemoAdd);
                    post('/api/salemgt/service-company/memo/save-update',param).then(data => {
                        showNotify('success', data);
                        this.formMemoAdd.id = '';
                        this.formMemoAdd.content = '';
                        this.addMemoShow = false;
                        this.getMemoList();
                    })
                }
            })
        },
        deleteMemo(id){
            this.$confirm('是否删除该条备注?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                get(`/api/salemgt/service-company/memo/${id}`).then(data => {
                    showNotify('success', data);
                    this.getMemoList();
                })
            })
        },
        // 税优地业务方案管理
        getSchemeList(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.schemeForm.pageNo = a
            post('/api/salemgt/goods/page', this.schemeForm).then(data => {
                console.log(data)
                this.schemeData = data
            })
        },
        //银行账号
        getBankList(num = 1){
            let param = {
                id:this.form.companyId,
                pageNo:num,
                pageSize:5
            }
            post('/api/salemgt/service-company/query/bank/list',param).then(data => {
                this.banklist = data;
            })
        },
        updateBank(val){
            this.bankAccountShow = true;
            this.bankAccount = val;
        },
        bankUpDate(formName){
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    if(this.bankAccount.id){
                        var param = {
                            id:this.bankAccount.id,
                            companyId:this.form.companyId,
                        }
                    }else{
                        var param = {
                            companyId:this.form.companyId,
                        }
                    }
                    Object.assign(param, param, this.bankAccount);
                    post('/api/salemgt/service-company/bank/save-update',param).then(data => {
                        showNotify('success', data);
                        this.getBankList();
                        this.bankAccountShow = false;
                    })
                }
            })
        },
        bankClearData(){
            this.getBankList();
            this.bankAccount = {default:false};
        },
        bankDelete(id){
            this.$confirm('是否删除该条银行账号?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                get(`/api/salemgt/service-company/bank/${id}`).then(data => {
                    showNotify('success', data);
                    this.getBankList();
                })
            })
        },
        setDefault(val){
            val.default = true;
            post('/api/salemgt/service-company/bank/save-update',val).then(data => {
                showNotify('success', data);
                this.getBankList();
            })
        },
        /*getDetail() {
            get('/api/sysmgr-web/company/get-company-detail', {
                companyId: this.form.companyId
            }).then(data => {
                this.msg = data
                get(`/api/sysmgr-web/user/get-platform-users?platformType=console-admin`).then(data => {
                    console.log(data)
                    this.charges = data
                })
            })
        },*/
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
        /*getName() {
            this.charges.forEach(e => {
                if (e.id == this.cform.chargeBy) {
                    this.cform.chargeByName = e.name
                }
            })
        },*/
        add(a) {
            this.$router.push(`addServer?&thirdpaySystemId=${a}&companyId=${this.msg.serviceCompanyInfo.id}&companyName=${this.msg.serviceCompanyInfo.name}`)
            // console.log(a);
            this.eshow = false;
        },
        edit(e) {
            sessionStorage.setItem("id", e.id);
            sessionStorage.setItem("channelAlias", e.channelAlias)
            this.$router.push("serverDetail");
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
        toScheme(id) {
            sessionStorage.setItem('taxLandingId', this.msg.serviceCompanyInfo.taxLandingId)
            this.$router.push(`scheme${isNaN(id) ? '' : `?id=${id}`}`)
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

.half>span {
    display: inline-block;
    width: 40%;
}

.f_input {
    /*width: 433px;*/
    width:100%;
}

.form_footer>button {
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
.box-card{
    margin-bottom: 20px;
}
.form_input{
    width: 33%;
    display: inline-block;
}
.box-card div span{
    font-weight: bold;
}
.fp{
    display:inline-block;
    width:30%;
    margin-top: 10px;
    color:#606266;
    font-size: 14px;
}
.formInline{
    display:inline-block;
    margin-left: 0px;
}
.text-label{
    text-align: right;
}
</style>