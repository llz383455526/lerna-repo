<template>
  <div class="r_main">
    <el-breadcrumb>
      <el-breadcrumb-item>
        纸票开具
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="form" :model="form" :inline="true" label-width="100px" ref="form">
      <el-form-item label="商户名称" prop="customCompanyName">
        <el-input v-model="form.customCompanyName" class="in_input" size="small"></el-input>
      </el-form-item>
      <el-form-item label="申请编号" prop="orderNo">
        <el-input v-model="form.orderNo" class="in_input" size="small"></el-input>
      </el-form-item>
      <el-form-item label="申请日期">
        <el-date-picker
          size="small"
          v-model="timeRange"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="发票类型" prop="invoiceType">
        <el-select v-model="form.invoiceType" class="in_input" size="small">
          <el-option v-for="item in categoryList" :key="item.value" :label="item.text" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="申请类型" size="small" prop="applyType">
        <el-select v-model="form.applyType" placeholder="请选择" style="width:100%;">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in applyState" :key="item.value" :label="item.text" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户开票类型" size="small" prop="customerInvoiceType">
        <el-select v-model="form.customerInvoiceType" placeholder="请选择" style="width:100%;">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="item in customerInvoiceTypes" :key="item.value" :label="item.text"
                     :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item class="form_foot">
        <el-button type="primary" @click="query" size="small">查询</el-button>
        <el-button @click="clear" size="small">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="t_head">已开发票共计：{{companyData.count}}张，金额共计 {{companyData.amount | formatMoney}}元，税额共计
      {{companyData.taxRateAmount | formatMoney}}元，价税合计 {{companyData.taxRateTotalAmount | formatMoney}}元
    </div>
    <el-table class="table" :data="tableData" border="">
      <el-table-column prop="orderNo" label="申请编号">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="showDetail(scope.row)">{{scope.row.orderNo}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="applyType" label="申请类型" width="120"></el-table-column>
      <el-table-column label="待开">
        <template slot-scope="scope">
          <el-button type="text" @click="not(scope.row)">{{scope.row.needOpenNum}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="已开">
        <template slot-scope="scope">
          <el-button type="text" @click="already(scope.row)">{{scope.row.openedNum}}</el-button>
        </template>
      </el-table-column>
      <el-table-column label="开票中">
        <template slot-scope="scope">
          <el-button type="text" @click="open(scope.row)">{{scope.row.openingNum}}</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="serviceCompanyName" label="服务商"></el-table-column>
      <el-table-column prop="customCompanyName" label="商户名称"></el-table-column>
      <el-table-column prop="purpose" label="发票用途"></el-table-column>
      <el-table-column label="金额">
        <template slot-scope="scope">
          {{scope.row.totalAmount | formatMoney}}
        </template>
      </el-table-column>
      <el-table-column prop="invoiceTypeName" label="发票类型">
        <template slot-scope="scope">
          <div class="bill common" v-if="scope.row.invoiceTypeName.indexOf('普通') > -1">普票</div>
          <div class="bill special" v-else>专票</div>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="totalNum" label="申请开票数"></el-table-column> -->
      <el-table-column prop="subjectName" label="发票类目"></el-table-column>
      <el-table-column prop="customerInvoiceType" label="客户开票类型"></el-table-column>
      <el-table-column label="审批通过时间">
        <template slot-scope="scope">
          {{scope.row.lastTime | formatTime}}
        </template>
      </el-table-column>
      <!-- <el-table-column label="操作">
          <template slot-scope="scope">
              <el-button @click="expressage(scope.row)" type="text">快递单号</el-button>
          </template>
      </el-table-column> -->
    </el-table>
    <el-pagination
      style="float: right; margin-top: 20px;"
      @size-change="setSize"
      @current-change="query"
      :background="true"
      :small="true"
      :current-page="form.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size="form.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    <!-- <div class="page" v-show="total / form.pageSize > 1">
        <el-pagination
        background
        layout="prev, pager, next"
        :page-size="form.pageSize"
        :total="total"
        @current-change="query"
        :currentPage="form.page">
      </el-pagination>
    </div> -->
    <el-dialog title="已开发票" :visible.sync="ashow" width="70%">
      <div class="half">
        <span>申请编号： {{invoiceData.orderNo}}</span>
        <span>申请时间： {{invoiceData.createTime | formatTime}}</span>
      </div>
      <div class="half">
        <span>开票名称： {{invoiceData.customCompanyName}}</span>
        <span>纳税人识别号： {{invoiceData.customTaxIdcd}}</span>
      </div>
      <div class="half">
        <span>开户行： {{invoiceData.customBankName}}</span>
        <span>银行账号： {{invoiceData.customBankAccount}}</span>
      </div>
      <div class="half">
        <span>地址： {{invoiceData.customAddr}}</span>
        <span>电话： {{invoiceData.customPhone || '暂无'}}</span>
      </div>
      <div class="half">
        <span>开票类型： {{invoiceData.invoiceTypeName}}</span>
      </div>
      <el-table class="table" :data="invoiceData.items" border>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="subjectName" label="开票类目"></el-table-column>
        <el-table-column prop="amount" label="开票金额"></el-table-column>
        <el-table-column prop="serviceCompanyName" label="开票公司"></el-table-column>
        <el-table-column prop="paperStatusName" label="状态"></el-table-column>
        <el-table-column prop="invoiceCode" label="发票代码"></el-table-column>
        <el-table-column prop="invoiceNo" label="发票号码"></el-table-column>
        <el-table-column prop="createByName" label="开票人"></el-table-column>
        <el-table-column prop="createTime" label="开票时间">
          <template slot-scope="scope">
            {{scope.row.createTime | formatTime}}
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
            <el-button @click="ashow = false" type="primary">关闭</el-button>
        </span>
    </el-dialog>
    <el-dialog title="未开发票" :visible.sync="nshow" width="1000px">
      <div class="half">
        <span>申请编号： {{invoiceData.orderNo}}</span>
        <span>申请时间： {{invoiceData.createTime | formatTime}}</span>
      </div>
      <div class="half">
        <span>开票名称： {{invoiceData.customCompanyName}}</span>
        <span>纳税人识别号： {{invoiceData.customTaxIdcd}}</span>
      </div>
      <div class="half">
        <span>开户行： {{invoiceData.customBankName}}</span>
        <span>银行账号： {{invoiceData.customBankAccount}}</span>
      </div>
      <div class="half">
        <span>地址： {{invoiceData.customAddr}}</span>
        <span>电话： {{invoiceData.customPhone || '暂无'}}</span>
      </div>
      <div class="half">
        <span>开票类型： {{invoiceData.invoiceTypeName}}</span>
      </div>
      <el-table class="table" @selection-change="select" :data="invoiceData.items" border>
        <el-table-column type="selection"></el-table-column>
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="subjectName" label="开票类目"></el-table-column>
        <el-table-column prop="amount" label="开票金额"></el-table-column>
        <el-table-column prop="serviceCompanyName" label="开票公司"></el-table-column>
        <el-table-column prop="statusMsg" label="状态"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 'fail' || scope.row.status === 'dealing'" size="mini" @click="changeInvoiceStatus(scope.row)">线下已开票，修改状态</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
        	<el-button @click="preview" type="primary">预览</el-button>
        <!-- make -->
            <el-button @click="needSure" type="primary">开票</el-button>
        </span>
    </el-dialog>
    <el-dialog title="申请中" :visible.sync="oshow" width="1000px">
      <div class="half">
        <span>申请编号： {{invoiceData.orderNo}}</span>
        <span>申请时间： {{invoiceData.createTime | formatTime}}</span>
      </div>
      <div class="half">
        <span>开票名称： {{invoiceData.customCompanyName}}</span>:
        <span>纳税人识别号： {{invoiceData.customTaxIdcd}}</span>
      </div>
      <div class="half">
        <span>开户行： {{invoiceData.customBankName}}</span>
        <span>银行账号： {{invoiceData.customBankAccount}}</span>
      </div>
      <div class="half">
        <span>地址： {{invoiceData.customAddr}}</span>
        <span>电话： {{invoiceData.customPhone || '暂无'}}</span>
      </div>
      <div class="half">
        <span>开票类型： {{invoiceData.invoiceTypeName}}</span>
      </div>
      <el-table class="table" @selection-change="select" :data="invoiceData.items" border>
        <!-- <el-table-column type="selection"></el-table-column> -->
        <el-table-column type="index" label="序号"></el-table-column>
        <el-table-column prop="subjectName" label="开票类目"></el-table-column>
        <el-table-column prop="amount" label="开票金额"></el-table-column>
        <el-table-column prop="serviceCompanyName" label="开票公司"></el-table-column>
        <el-table-column prop="statusMsg" label="状态"></el-table-column>
        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status === 'fail' || scope.row.status === 'dealing'" size="mini" @click="changeInvoiceStatus(scope.row)">线下已开票，修改状态</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
            <!--<el-button @click="oshow = false" type="primary">确定</el-button>-->
        </span>
    </el-dialog>
    <el-dialog title="开票确认" :visible.sync="sureShow" width="35%">
      <p v-if="invoiceData.items">申请发票数：<span class="red">{{invoiceData.items.length}}</span>张</p>
      <p>确认开票数 <span class="red">{{mform.invoiceIds.length}}</span>张</p>
      <template v-if="invoiceData.items && invoiceData.items.length != mform.invoiceIds.length">
        <p>未勾选发票的备注原因</p>
        <el-input v-model="mform.memo"></el-input>
      </template>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="make">确认提交</el-button>
      </div>
    </el-dialog>
    <el-dialog title="发票详情" :visible.sync="dShow" width="70%">
      <div class="title">邮寄地址</div>
      <div class="half">
        <span>收票人：{{billDatail.collector}}</span>
        <span>收票人电话：{{billDatail.collectorPhone}}</span>
      </div>
      <div class="half">
        <span>收票人地址：{{billDatail.collectorAddr}}</span>
      </div>
      <div class="title">填写物流单号</div>
      <el-table :data="express">
        <el-table-column label="添加时间" prop="addExpressTime">
          <template slot-scope="scope">
            {{scope.row.addExpressTime | formatTime}}
          </template>
        </el-table-column>
        <el-table-column label="物流公司" prop="expressCompany"></el-table-column>
        <el-table-column label="物流单号" prop="expressNo"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="eshow = true">{{scope.row.addExpressTime ? '编辑' : '添加'}}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="title">发票扫描件</div>
      <el-button size="small" type="primary" @click="addBill">上传文件</el-button>
      <el-table :data="billDatail.attachments">
        <el-table-column label="发票代码" prop="invoiceCode"></el-table-column>
        <el-table-column label="发票号码" prop="invoiceNo"></el-table-column>
        <el-table-column label="文件名" prop="name"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editorBill(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="prevBill(scope.row)">预览</el-button>
            <el-button type="text" size="small" @click="deleteBill(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer">
              <!-- <el-button size="small" @click="dShow = false" type="primary">确定</el-button> -->
              <el-button size="small" @click="dShow = false">关闭</el-button>
          </span>
    </el-dialog>
    <el-dialog title="修改" @close="showDetail" :visible.sync="eshow" width="70%">
      <el-form label-width="80px" :model="express[0]" :rules="erules" v-if="express[0]" ref="express">
        <el-form-item label="添加时间">
          {{express[0].addExpressTime | formatTime}}
        </el-form-item>
        <el-form-item label="物流公司" prop="expressCompany">
          <el-select size="small" filterable v-model="express[0].expressCompany" class="f_input">
            <el-option v-for="e in companys" :value="e.value" :label="e.label" :key="e.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="物流单号" prop="expressNo">
          <el-input size="small" v-model="express[0].expressNo" class="f_input"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
              <el-button size="small" @click="sure" type="primary">确定</el-button>
              <el-button size="small" @click="eshow = false">取消</el-button>
          </span>
    </el-dialog>
    <el-dialog title="扫描件" @close="imgUrl = '';showDetail()" :visible.sync="attrShow">
      <el-form :model="attrForm" :rules="arules" ref="attrForm">
        <el-form-item label="发票代码：" prop="invoiceCode">
          <el-input class="f_input" size="small" v-model="attrForm.invoiceCode"></el-input>
        </el-form-item>
        <el-form-item label="发票号码：" prop="invoiceNo">
          <el-input class="f_input" size="small" v-model="attrForm.invoiceNo"></el-input>
        </el-form-item>
        <el-form-item label="上传文件：" prop="file">
          <el-upload
            class="form_input"
            :action="`/api/econtract/template/parsefile`"
            :auto-upload="false"
            :on-change="save"
            :multiple="false"
            :show-file-list="false"
            accept=".jpg, .png, .pdf">
            <!-- <img v-if="attrForm.attachmentId" :src="`https://openadmintest92.aiyuangong.com/api/invoice-web/invoice/attachment/preview/${attrForm.attachmentId}`" alt="" width="200px"> -->
            <!-- <template v-else> -->
            <el-button v-if="!imgUrl" size="small" type="primary">上传文件</el-button>
            <img v-else :src="this.imgUrl" alt="" width="200px">
            <!-- </template> -->
          </el-upload>
        </el-form-item>
      </el-form>
      <span slot="footer">
              <el-button size="small" @click="attrShow = false">取消</el-button>
              <el-button size="small" @click="upload" type="primary">确定</el-button>
          </span>
    </el-dialog>
    <el-dialog title="修改开票状态" :visible.sync="xiuGaiKaiPiaoZhuangTaiPop" width="35%">
      <el-form :model="xiuGaiKaiPiaoZhuangTaiForm" :rules="xiuGaiKaiPiaoZhuangTaiRules" ref="xiuGaiKaiPiaoZhuangTaiForm" label-width="100px" class="demo-ruleForm">
        <el-form-item label="发票代码" prop="invoiceCode">
          <el-input placeholder="发票代码一般在发票左上方" v-model="xiuGaiKaiPiaoZhuangTaiForm.invoiceCode"></el-input>
        </el-form-item>
        <el-form-item label="发票号码" prop="invoiceNum">
          <el-input placeholder="发票号码一般在发票右上方"  v-model="xiuGaiKaiPiaoZhuangTaiForm.invoiceNum"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button @click="xiuGaiKaiPiaoZhuangTaiPop = false">取消</el-button>
          <el-button type="primary" @click="xiuGaiKaiPiaoZhuangTaiOkBtnClick">已开票</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

    <div class="v-modal" v-if="showDown" @click.self="showDown = false"
         :style="{ backgroundImage: `url(/api/invoice-web/invoice/attachment/preview/${attachmentId})`}">
      <a class="abtn" :href="`/api/invoice-web/invoice/attachment/download/${attachmentId}`" target="_blank">下载发票</a>
    </div>
  </div>
</template>
<script>
  import {get, post, formPost, importPost, postButNoErrorToast} from "../../store/api";

  export default {
    data() {
      var time = new Date()
      var t = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)}-${time.getDate()}`
      return {
        companyData: {},
        form: {
          customCompanyName: '',
          startAt: '',
          endAt: '',
          invoiceType: '',
          orderBy: '',
          orderNo: '',
          applyType: '',
          customerInvoiceType: '',
          page: 1,
          pageSize: 10
        },
        // 修改开票状态
        xiuGaiKaiPiaoZhuangTaiPop: false,
        xiuGaiKaiPiaoZhuangTaiForm: {
          id: '',
          invoiceCode: '',
          invoiceNum: ''
        },
        xiuGaiKaiPiaoZhuangTaiRules: {
          invoiceCode: [
            { required: true, message: '请输入', trigger: 'blur' },
          ],
          invoiceNum: [
            { required: true, message: '请输入', trigger: 'blur' },
          ]
        },
        timeRange: [t, t],
        applyState: [
          {
            text: '客户申请',
            value: 20
          },
          {
            text: '交付申请',
            value: 10
          }
        ],
        customerInvoiceTypes: [
          {
            text: '账单开票',
            value: 10
          },
          {
            text: '预开票',
            value: 20
          }
        ],
        categoryList: [],
        tableData: [],
        total: 0,
        ashow: false,
        invoiceData: {},
        nshow: false,
        mform: {
          invoiceIds: [],
          memo: '',
          orderNo: ''
        },
        oshow: false,
        eshow: false,
        sureShow: false,
        dShow: false,
        billDatail: {},
        express: [],
        erules: {
          expressCompany: [
            {
              required: true,
              message: "请选择物流公司",
              trigger: "blur"
            }
          ],
          expressNo: [
            {
              required: true,
              message: "请填写物流单号",
              trigger: "blur"
            }
          ]
        },
        orderNo: '',
        companys: [],
        attrShow: false,
        attrForm: {
          orderId: '',
          attachmentId: '',
          invoiceCode: '',
          invoiceNo: '',
          file: ''
        },
        imgUrl: '',
        showDown: false,
        attachmentId: '',
        arules: {
          invoiceCode: [
            {
              required: true,
              message: "请填写发票代码",
              trigger: "blur"
            }
          ],
          invoiceNo: [
            {
              required: true,
              message: "请填写发票号码",
              trigger: "blur"
            }
          ],
          file: [
            {
              required: true,
              message: "请上传文件",
              trigger: "blur"
            }
          ]
        }
      };
    },
    activated() {
      this.query()
    },
    mounted() {
      //  var serviceCompanyId = this.$route.query.serviceCompanyId || 1000
      get('/api/invoice-web/commom/option?enumType=InvoiceType').then(function (data) {
        console.log(data)
        this.categoryList = data
      }.bind(this))
      this.getCompany()
      //  get('/api/invoice-web/invoice/opened-paper-invoice-info?serviceCompanyId=' + serviceCompanyId).then(function(data){
      //      console.log(data)
      //      this.companyData = data
      //  }.bind(this))
    },
    methods: {
      // 修改开票状态
      changeInvoiceStatus(item) {
        this.xiuGaiKaiPiaoZhuangTaiPop = true
        this.xiuGaiKaiPiaoZhuangTaiForm.id = item.id
      },
      // 膝盖开票状态确定按钮点击
      xiuGaiKaiPiaoZhuangTaiOkBtnClick() {
        post('/api/invoice-web/invoice/paper-invoice-update', this.xiuGaiKaiPiaoZhuangTaiForm).then((data) => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.xiuGaiKaiPiaoZhuangTaiPop = false
          this.nshow = false
          this.query()
        }).catch(() => {})
      },
      query(a) {
        this.form.page = 1
        if (a && !isNaN(a)) {
          this.form.page = a
        }
        if (this.timeRange && this.timeRange.length) {
          this.form.startAt = this.timeRange[0]
          this.form.endAt = this.timeRange[1]
        } else {
          this.form.startAt = ''
          this.form.endAt = ''
        }
        post('/api/invoice-web/invoice/paper-invoice-list', this.form).then(function (data) {
          console.log(data)
          this.tableData = data.list
          this.total = data.total
        }.bind(this))
        post('/api/invoice-web/invoice/sum-paper-invoice-list', this.form).then(function (data) {
          console.log(data)
          this.companyData = data
        }.bind(this))
      },
      setSize(a) {
        this.form.pageSize = a
        this.query()
      },
      clear() {
        this.$refs['form'].resetFields();
        this.form.startAt = ''
        this.form.endAt = ''
        this.timeRange = []
      },
      already(a) {
        console.log(a)
        this.ashow = true
        get('/api/invoice-web/invoice/get-invoice-info', {
          orderNo: a.orderNo,
          paperStatus: 2
        }).then(function (data) {
          console.log(data)
          this.invoiceData = data
        }.bind(this))
      },
      open(a) {
        this.oshow = true
        this.mform.orderNo = a.orderNo
        get('/api/invoice-web/invoice/get-invoice-info', {
          orderNo: a.orderNo,
          paperStatus: 3
        }).then(function (data) {
          console.log(data)
          this.invoiceData = data
        }.bind(this))
      },
      not(a) {
        console.log(a)
        this.nshow = true
        this.mform.orderNo = a.orderNo
        get('/api/invoice-web/invoice/get-invoice-info', {
          orderNo: a.orderNo,
          paperStatus: 1
        }).then(function (data) {
          console.log(data)
          this.invoiceData = data
        }.bind(this))
      },
      select(a) {
        console.log(a)
        this.mform.invoiceIds = []
        a.forEach(function (e) {
          this.mform.invoiceIds.push(e.id)
        }, this)
      },
      needSure() {
        if (this.mform.invoiceIds.length) {
          this.nshow = false
          this.sureShow = true
          this.mform.memo = '将在月底最后一周开具'
        } else {
          this.$message({
            type: 'info',
            message: '请至少选择一项'
          })
        }
      },
      make() {
        if (this.invoiceData.items.length != this.mform.invoiceIds.length && !this.mform.memo) {
          this.$message({
            type: 'warning',
            message: '请填写原因！'
          })
          return
        }
        post('/api/invoice-web/invoice/open-paper-invoice', this.mform).then(function (data) {
          this.sureShow = false
          this.$message({
            type: 'success',
            message: '提交成功！'
          })
          this.query(this.form.page)
        }.bind(this))
      },
      preview(a) {
        let url = '/api/invoice-web/invoice/open-paper-preview';
        let length = this.mform.invoiceIds.length;
        if (length) {
          for (let i = 0; i < length; i++) {
            get(url + "?invoiceId=" + this.mform.invoiceIds[i]).then(data => {
              let newWindow = window.open();
              newWindow.location.href = data;
            });
          }
        } else {
          this.$message({
            type: 'info',
            message: '请至少选择一项'
          })
        }
      },
      showDetail(a) {
        //   a.orderNo
        if (a) {
          this.orderNo = a.orderNo
        }
        get(`/api/invoice-web/invoice/invoice-note-info/${this.orderNo}`).then(data => {
          console.log(data)
          this.dShow = true
          this.billDatail = data
          var time = new Date()
          //   this.billDatail.addExpressTime = this.billDatail.addExpressTime || time.getFullYear() + '-' + (time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)) + '-' +(time.getDay() > 9 ? time.getDay() : '0' + time.getDay())
          this.express = [
            {
              addExpressTime: this.billDatail.addExpressTime,
              expressCompany: this.billDatail.expressCompany,
              expressNo: this.billDatail.expressNo
            }
          ]
        })
      },
      expressage(a) {
        console.log(a)
        this.eshow = true
      },
      sure(e) {
        this.$refs['express'].validate(valid => {
          if (valid) {
            post('/api/invoice-web/invoice/save-express-info', {
              id: this.orderNo,
              expressCompany: this.express[0].expressCompany,
              expressNo: this.express[0].expressNo
            }).then(data => {
              console.log(data)
              this.eshow = false
              this.showDetail()
            })
          }
        })
      },
      getCompany() {
        get('/api/invoice-web/commom/express-company-list').then(data => {
          this.companys = data
          console.log('companys', this.companys)
        })
      },
      save(a) {
        var reader = new FileReader()
        this.attrForm.file = a.raw
        reader.onload = e => {
          this.imgUrl = e.target.result
        }
        reader.readAsDataURL(a.raw)
        this.$refs['attrForm'].clearValidate()
      },
      upload() {
        this.$refs['attrForm'].validate(valid => {
          if (valid) {
            this.attrForm.orderId = this.orderNo
            var formData = new FormData()
            for (var k in this.attrForm) {
              formData.append(k, this.attrForm[k])
            }
            importPost('/api/invoice-web/invoice/attachment/upload', formData, true).then(data => {
              console.log(data)
              this.attrShow = false
              this.showDetail()
            })
          }
        })
      },
      prevBill(a) {
        this.showDown = true
        this.attachmentId = a.id
      },
      addBill() {
        this.attrShow = true
        this.attrForm.attachmentId = ''
        this.attrForm.invoiceCode = ''
        this.attrForm.invoiceNo = ''
        this.attrForm.file = ''
        this.imgUrl = ''
      },
      editorBill(a) {
        this.attrShow = true
        this.attrForm.attachmentId = a.id
        this.attrForm.invoiceCode = a.invoiceCode
        this.attrForm.invoiceNo = a.invoiceNo
      },
      deleteBill(a) {
        this.$confirm('是否确认删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post('/api/invoice-web/invoice/attachment/delete', {
            id: a.id
          }).then(data => {
            this.showDetail()
          })
        }).catch(err => {
        })
      }
    }
  };
</script>
<style scoped>
  .r_main {
    padding: 30px 10px;
    background-color: #fff;
    overflow: hidden;
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

  .half {
    margin-bottom: 10px;
  }

  .half > span {
    display: inline-block;
    width: 40%;
  }

  .f_input {
    width: 300px;
  }

  .form_footer > button {
    margin: 0px 30px;
  }

  .bill {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 5px;
    color: #fff;
  }

  .common {
    background-color: #6BDDA2;
  }

  .special {
    background-color: #63D1F2;
  }

  .title {
    font-weight: bold;
    margin: 10px 0px 20px;
  }

  .v-modal {
    z-index: 4280;
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.5);
    background-repeat: no-repeat;
    background-size: 900px 600px;
    background-position: center center;
    transition: all 0.3s;
  }

  .abtn {
    position: absolute;
    top: calc(50% - 346px);
    left: calc(50% - 450px);
    display: inline-block;
    width: 80px;
    height: 22px;
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    background-image: url(../../image/download_logo.png);
    background-color: #fff;
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 7px center;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    text-indent: 22px;
    line-height: 20px;
  }
</style>
