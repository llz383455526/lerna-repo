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
      <el-button type="info">导出</el-button>
    </div>
    <br>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="date"
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
          <span>添加票量</span>
          <span>领取记录</span>
        </div>
      </el-table-column>
    </el-table>
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
  </div>
</template>

<script>
  export default {
    name: "monitoring",
    data() {
      return {
        // 查找时间
        searchDate: null,
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        // 上传文件提示
        upFilePopIsShow: false
      }
    },
    methods: {
      // 查找按钮点击
      searchBtnClick() {

      },
      // 上传文件按钮点击
      upFilBtnClick() {
        this.upFilePopIsShow = true
      },
      // 上传文件确定按钮点击
      upFilePopOkBtnClick() {
        this.$refs.popUpload.submit();
      },
      // 弹窗下载模板按钮点击
      upFileDownMoBanBtnClick() {

      }
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
