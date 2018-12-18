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
      <el-button type="success">录入销售预测票量</el-button>
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
        }]
      }
    },
    methods: {
      // 查找按钮点击
      searchBtnClick() {

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
