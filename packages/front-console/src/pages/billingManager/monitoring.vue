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
        <el-button type="primary" @click="searchBtnClick">查询</el-button>
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
          <span>专票：120</span>
          <span>普票：120</span>
        </div>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        header-align="center"
        label="销售预计开票总数">
        <div class="table-cell-item" slot-scope="scope">
          <span>专票：120</span>
          <span>普票：120</span>
        </div>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        header-align="center"
        label="待开票数（由实际流水推算）">
        <div class="table-cell-item" slot-scope="scope">
          <span>专票：120</span>
          <span>普票：120</span>
        </div>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        header-align="center"
        label="已开票数">
        <div class="table-cell-item" slot-scope="scope">
          <span>专票：120</span>
          <span>普票：120</span>
        </div>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        header-align="center"
        label="剩余票数">
        <div class="table-cell-item" slot-scope="scope">
          <span>专票：120</span>
          <span>普票：120</span>
        </div>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        header-align="center"
        label="预计待领票数">
        <div class="table-cell-item" slot-scope="scope">
          <span>专票：120</span>
          <span>普票：120</span>
        </div>
      </el-table-column>
      <el-table-column
        prop="address"
        align="center"
        header-align="center"
        label="操作">
        <div class="table-cell-item option" slot-scope="scope">
          <span @click="addPiaoClick">添加票量</span>
          <span @click="lingQuJiLuBtnClick">领取记录</span>
        </div>
      </el-table-column>
    </el-table>
    <div class="clearfix" style="padding-top: 10px">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageData.page"
        :page-sizes="[10, 20]"
        :page-size="pageData.pageSize"
        style="float: right"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pageData.total">
      </el-pagination>
    </div>
    <p style="color: #aaa">注：“待开票数（由实际流水推算）”仅对先款后票的客户流水进行推算</p>
    <el-dialog
      title="本地上传"
      :visible.sync="upFilePopIsShow"
      width="600px">
      <p>
        请按照模板填写销售预测数据
        <el-button size="mini" @click="upFileDownMoBanBtnClick">下载模板</el-button>
        *上传销售预测表格
      </p>
      <el-upload
        class="upload-demo"
        drag
        ref="popUpload"
        accept="application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        action="https://jsonplaceholder.typicode.com/posts/"
        :auto-upload="false"
        multiple>
        <i class="el-icon-upload"></i>
        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
        <div class="el-upload__tip" slot="tip">请上传小于5M的xls或xlsx格式文件</div>
      </el-upload>
      <span slot="footer" class="dialog-footer">
        <el-button @click="upFilePopIsShow = false">取 消</el-button>
        <el-button type="primary" @click="upFilePopOkBtnClick">确 定</el-button>
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
    <el-dialog title="领票记录" :visible.sync="lingQuJiLuPopIsShow" width="80%" @close="closeInvoiceDialog"
               :lock-scroll="true" style="margin-top:-5vh">
      <el-form :model="formSelect" ref="formSelect" :inline="true">
        <el-form-item label="状态" size="small" style="float:left;">
          <el-select v-model="formSelect.selectStatus" placeholder="请选择" @change="handleRequest()">
            <el-option label="全部" value="00"></el-option>
            <el-option label="有效" value="20"></el-option>
            <el-option label="无效" value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="handleExcel()" size="small">导表</el-button>
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
  </div>
</template>

<script>
  import {post, get} from '../../store/api';
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
          addInvoiceComment: ''
        },
        // 领取记录
        lingQuJiLuPopIsShow: false,
        formSelect: {
          selectStatus: '20',
        },
        tableInvoiceList: []
      }
    },
    methods: {
      // 查找按钮点击
      searchBtnClick() {
        const month = this.searchDate.getMonth() + 1
        const year = this.searchDate.getFullYear()
        post('/api/invoice-web/invoice-monitor/list', {
          "month": `${month}`,
          "page": this.pageData.page,
          "pageSize": this.pageData.pageSize,
          "year": `${year}`
        }).then(data => {
          this.pageData.total = data.total
          this.tableData = data.list
        })
      },
      handleSizeChange(num) {
        this.pageData.pageSize = num
      },
      handleCurrentChange(num) {
        this.pageData.page = num
      },
      // 导出按钮点击
      daoChuClick() {
        const month = this.searchDate.getMonth() + 1
        const year = this.searchDate.getFullYear()
        window.open(`/api/invoice-web/invoice-monitor/export-list?year=${year}&month=${month}`)
      },
      // 上传文件按钮点击
      upFilBtnClick() {
        this.enterAQuery()
      },
      // 上传文件确定按钮点击
      upFilePopOkBtnClick() {
        this.$refs.popUpload.submit();
      },
      // 弹窗下载模板按钮点击
      upFileDownMoBanBtnClick() {

      },
      // 录取前查询
      enterAQuery() {
        const month = this.searchDate.getMonth() + 1
        const year = this.searchDate.getFullYear()
        post('/api/invoice-web/invoice-monitor/sales-forecast', {
          "month": `${month}`,
          "page": this.pageData.page,
          "pageSize": this.pageData.pageSize,
          "year": `${year}`
        }).then(data => {
          // this.upFilePopIsShow = true
        })
      },
      // 添加票量按钮点击
      addPiaoClick() {
        this.addPiaoPopIsShow = true
      },
      // 领取记录按钮点击
      lingQuJiLuBtnClick() {
        this.lingQuJiLuPopIsShow = true
      },
      closeInvoiceDialog() {
        this.formSelect.selectStatus = '20';
        this.requestAction({
          page: this.$route.query.page || 1,
          pageSize: this.pageSize,
        });
      }
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
