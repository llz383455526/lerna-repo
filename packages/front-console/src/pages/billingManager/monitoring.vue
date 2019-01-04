<template>
  <div class="billing-manager-monitoring">
    <p>落地公司票量预测与监控</p>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="">
        <el-date-picker
          v-model="searchDate"
          type="month"
          placeholder="选择月">
        </el-date-picker>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="searchBtnClick(true)">查询</el-button>
      </el-form-item>
    </el-form>
    <div>
      <el-button type="success" @click="upFilBtnClick">录入销售预测票量</el-button>
      <el-button type="info" @click="daoChuClick">导出</el-button>
    </div>
    <br>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="serviceCompanyName"
        align="center"
        header-align="center"
        label="落地公司名称">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        header-align="center"
        label="期初剩余票量">
        <div class="table-cell-item" slot-scope="scope">
          <span>专票：{{ scope.row.periodInitialZpNum }}</span>
          <span>普票：{{ scope.row.periodInitialPpNum }}</span>
        </div>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        header-align="center"
        label="销售预计开票总数">
        <div class="table-cell-item" slot-scope="scope">
          <span>专票：{{ scope.row.salesForecastZpNum }}</span>
          <span>普票：{{ scope.row.salesForecastPpNum }}</span>
        </div>
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="address"-->
        <!--align="center"-->
        <!--header-align="center"-->
        <!--label="预计待开票数（由到款金额推算）">-->
        <!--<div class="table-cell-item" slot-scope="scope">-->
          <!--<span>专票：{{ scope.row.waitZpNum }}</span>-->
          <!--<span>普票：{{ scope.row.waitPpNum }}</span>-->
        <!--</div>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="address"
        align="center"
        header-align="center"
        label="已开票数">
        <div class="table-cell-item" slot-scope="scope">
          <span>专票：{{ scope.row.alreadyZpNum }}</span>
          <span>普票：{{ scope.row.alreadyPpNum }}</span>
        </div>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        header-align="center"
        label="剩余票数">
        <div class="table-cell-item" slot-scope="scope">
          <span>专票：{{ scope.row.surplusZpNum }}</span>
          <span>普票：{{ scope.row.surplusPpNum }}</span>
        </div>
      </el-table-column>
      <!--<el-table-column-->
        <!--prop="address"-->
        <!--align="center"-->
        <!--header-align="center"-->
        <!--label="预计待领票数">-->
        <!--<div class="table-cell-item" slot-scope="scope">-->
          <!--<span>专票：{{ scope.row.forecastWaitZpNum > 0 ? scope.row.forecastWaitZpNum : '&#45;&#45;' }}</span>-->
          <!--<span>普票：{{ scope.row.forecastWaitPpNum > 0 ? scope.row.forecastWaitPpNum : '&#45;&#45;' }}</span>-->
        <!--</div>-->
      <!--</el-table-column>-->
      <el-table-column
        prop="address"
        align="center"
        header-align="center"
        label="操作">
        <div class="table-cell-item option" slot-scope="scope">
          <span @click="addPiaoClick(scope.row)">添加票量</span>
          <span @click="lingQuJiLuBtnClick(scope.row)">领取记录</span>
        </div>
      </el-table-column>
    </el-table>
    <div class="clearfix" style="padding-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page.sync="pageData.page"
        :page-sizes="[10, 20]"
        :page-size="pageData.pageSize"
        style="float: right"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total">
      </el-pagination>
    </div>
    <p style="color: #aaa">注：销售预计开票总数为预测业务流水的最少开票数，且不包含服务费开票数。</p>
    <el-dialog
      title="本地上传"
      :visible.sync="upFilePopIsShow"
      width="800px">
      <p>
        请按照模板填写销售预测数据
        <el-button size="mini" @click="upFileDownMoBanBtnClick">下载模板</el-button>
        *上传销售预测表格
      </p>
      <div v-if="inputData.length > 0">
        <el-table
          :data="inputData"
          style="width: 100%">
          <el-table-column
            prop="displayname"
            label="文件名称">
          </el-table-column>
          <el-table-column
            prop="createTime"
            label="上传时间">
          </el-table-column>
          <el-table-column
            label="操作">
            <template slot-scope="scope">
              <el-button @click="downloadFileBtnClick(scope.row)" type="text" size="small">下载文件</el-button>
              <el-button @click="removeFileBtnClick(scope.row)" type="text" size="small">重新上传</el-button>
            </template>
          </el-table-column>
        </el-table>
        <p>注：重新上传会覆盖原文件的数据，请下载原文件，并在原文件的基础上修改数据</p>
      </div>
      <el-upload
        v-else
        drag
        ref="popUpload"
        accept=".xls, .xlsx"
        action="/api/invoice-web/invoice-monitor/upload-sales-forecast"
        :on-success="fileUpSuccess"
        :on-error="upFileErr"
        :multiple="false"
        :on-change="fileChange"
        :auto-upload="false">
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请上传小于5M的xls或xlsx格式文件</div>
      </el-upload>

      <span slot="footer" class="dialog-footer">
        <el-button @click="upFilePopIsShow = false">取 消</el-button>
        <el-button type="primary" :loading="upLoading" @click="upFilePopOkBtnClick">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog title="添加票量" :visible.sync="addPiaoPopIsShow" width="40%">
      <el-form :rules="rulesAdd" :model="formAdd" ref="formAdd">
        <div class="input-container">
          <div class="label dialog-label">发票类型<span>*</span>
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
          <div class="label dialog-label">添加票量数量<span>*</span>
          </div>
          <div class="input">
            <el-form-item prop="addInvoiceAmount" size="small">
              <el-input v-model.number="formAdd.addInvoiceAmount"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="input-container">
          <div class="label dialog-label">添加备注<span>*</span>
          </div>
          <div class="input">
            <el-form-item prop="addInvoiceComment" size="small">
              <el-input type="textarea" v-model="formAdd.addInvoiceComment"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPiaoPopIsShow=false;" size="small">取 消</el-button>
        <el-button type="primary" @click="addInvoice('formAdd')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog title="领票记录" :visible.sync="lingQuJiLuPopIsShow" width="80%" :lock-scroll="true" style="margin-top:-5vh">
      <el-form :model="formSelect" ref="formSelect" :inline="true">
        <el-form-item label="状态" size="small" style="float:left;">
          <el-select v-model="formSelect.selectStatus" placeholder="请选择" @change="handleRequest">
            <el-option label="全部" value="00"></el-option>
            <el-option label="有效" value="20"></el-option>
            <el-option label="无效" value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="handleExcel()" size="small">导表</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableInvoice.list" style="width: 100%;text-align:left;">
        <el-table-column prop="invoiceType" label="发票类型">
          <template slot-scope="scope">
            <div class="bill common" v-if="scope.row.invoiceType === 'PP'">普票</div>
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
          @size-change="handleInvoiceSizeChange"
          @current-change="handleInvoiceCurrentChange"
          :current-page="currentInvoicePage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="tableInvoice.pageSize"
          layout="total, prev, pager, next, sizes, jumper"
          :total="tableInvoice.total">
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  import {post, get} from '../../store/api';
  import {showNotify} from '../../plugin/utils-notify';
  import { DateFormat } from 'yb-tool'
  const phoneReg = /^[1-9]\d*$/;
  const validatenumber = (rule, value, callback) => {
    if (value == '') {
      callback(new Error('请填写票量数量'))
    } else if (!phoneReg.test(value)) {
      callback(new Error('票量数量必须为正整数'))
    } else if (value > 1000) {
      callback(new Error('票量数量不能大于1000'))
    } else {
      callback()
    }
  };
  export default {
    name: "monitoring",
    data() {
      return {
        // 查找时间
        searchDate: new Date(),
        tableData: [],
        // 上传文件提示
        upFilePopIsShow: false,
        // 分页数据
        pageData: {
          page: 1,
          pageSize: 10,
          total: 0
        },
        // 添加票量弹窗
        addPiaoPopIsShow: false,
        formAdd: {
          selectInvoiceType: '',
          addInvoiceAmount: '',
          addInvoiceComment: '',
          id: ''
        },
        // 领取记录
        lingQuJiLuPopIsShow: false,
        formSelect: {
          selectStatus: '20',
        },
        tableInvoice: {
          total: 0,
          pageNum: 1,
          pageSize: 10,
          list: [],
          companyName: '',
          id: ''
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
        // 录入数据
        inputData: [],
        DateFormat: DateFormat,
        // 上传中的状态
        upLoading: false
      }
    },
    methods: {
      handleCancel(id) {
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
            this.requestInvoiceAction();
          })
        })
      },
      // 删除文件按钮点击
      removeFileBtnClick() {
        this.inputData = []
      },
      // 下载文件按钮点击
      downloadFileBtnClick(item) {
        window.open(`/api/sysmgr-web/file/download?downloadCode=${item.downloadCode}`)
      },
      // 文件上传成功调用
      fileUpSuccess(res) {
        this.upLoading = false
        if (res.code !== 200) {
          showNotify('error', res.msg);
          this.$refs.popUpload.clearFiles();
        } else {
          showNotify('success', '上传成功');
          this.searchBtnClick()
          this.upFilePopIsShow = false
        }
      },
      fileChange(file, fileList) {
        if (fileList.length > 1) {
          fileList.shift()
        }
      },
      // 文件上传失败
      upFileErr() {
        this.upLoading = false
        showNotify('error', '文件上传失败');
        this.$refs.popUpload.clearFiles();
      },
      handleInvoiceSizeChange(size) {
        this.tableInvoice.pageSize = size
        this.requestInvoiceAction()
      },
      handleInvoiceCurrentChange(num) {
        this.tableInvoice.pageNum = num
        this.requestInvoiceAction()
      },
      // 查找按钮点击
      searchBtnClick(reload = false) {
        const month = this.searchDate.getMonth() + 1
        const year = this.searchDate.getFullYear()
        if (reload) {
          this.pageData.page = 1
        }
        post('/api/invoice-web/invoice-monitor/list', {
          "month": `${month < 10 ? '0' : ''}${month}`,
          "page": this.pageData.page,
          "pageSize": this.pageData.pageSize,
          "year": `${year}`
        }).then(data => {
          this.pageData.total = data.total
          this.tableData = data.list
        })
      },
      requestInvoiceAction() {
        let param = {
          serviceCompanyId: this.tableInvoice.id,
          page: this.tableInvoice.pageNum,
          pageSize: this.tableInvoice.pageSize,
          status: this.formSelect.selectStatus,
        };
        post('/api/invoice-web/service-company/add-num-list', param).then(data => {
          this.tableInvoice.list = data.list;
          this.tableInvoice.total = data.total
        })
      },
      handleRequest() {
        this.requestInvoiceAction()
      },
      addInvoice(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let param = {
              id: this.formAdd.id,
              addNum: this.formAdd.addInvoiceAmount,
              invoiceType: this.formAdd.selectInvoiceType,
              remark: this.formAdd.addInvoiceComment
            };
            post('/api/invoice-web/service-company/add-num', param).then(data => {
              showNotify('success', data);
              this.$refs['formAdd'].resetFields()
              this.addPiaoPopIsShow = false;
              this.searchBtnClick()
            })
          }
        })
      },
      handleSizeChange(num) {
        this.pageData.pageSize = num
        this.searchBtnClick(true)
      },
      handleCurrentChange(num) {
        this.pageData.page = num
        this.searchBtnClick()
      },
      // 导出按钮点击
      daoChuClick() {
        const month = this.searchDate.getMonth() + 1
        const year = this.searchDate.getFullYear()
        const monthStr = `${month < 10 ? '0' : ''}${month}`
        window.open(`/api/invoice-web/invoice-monitor/export-list?year=${year}&month=${monthStr}&page=${this.pageData.page}&pageSize=${this.pageData.pageSize}`)
      },
      // 上传文件按钮点击
      upFilBtnClick() {
        this.enterAQuery()
        // this.upFilePopIsShow = true
      },
      // 上传文件确定按钮点击
      upFilePopOkBtnClick() {
        this.$refs.popUpload.submit();
        this.upLoading = true
      },
      // 弹窗下载模板按钮点击
      upFileDownMoBanBtnClick() {
          window.open('/api/invoice-web/invoice-monitor/download-sales-forecast-template')
      },
      // 录取前查询
      enterAQuery() {
        const month = this.searchDate.getMonth() + 1
        const year = this.searchDate.getFullYear()
        post('/api/invoice-web/invoice-monitor/sales-forecast', {
          "month": `${month > 9 ? '' : '0'}${month}`,
          "page": this.pageData.page,
          "pageSize": this.pageData.pageSize,
          "year": `${year}`
        }).then(data => {
          this.upFilePopIsShow = true
          if (data) {
            data.createTime = DateFormat(data.createTime)
            this.inputData = [data]
          }
        })
      },
      // 添加票量按钮点击
      addPiaoClick(item) {
        this.addPiaoPopIsShow = true
        this.formAdd.id = item.serviceCompanyId
      },
      // 领取记录按钮点击
      lingQuJiLuBtnClick(item) {
        this.lingQuJiLuPopIsShow = true
        this.tableInvoice.id = item.serviceCompanyId
        this.requestInvoiceAction()
      },
      handleExcel() {
        const url = '/api/invoice-web/service-company/export-add-num?serviceCompanyId=' + this.tableInvoice.id
          + '&page=1'
          + '&pageSize=1'
          + '&status=' + this.formSelect.selectStatus;
        window.open(url)
      },
    },
    mounted() {
      this.searchBtnClick()
    }
  }
</script>

<style lang="scss" scoped>
.billing-manager-monitoring {
  .table-cell-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .option {
    color: #3582e2;
    cursor: pointer;
  }
}
</style>
