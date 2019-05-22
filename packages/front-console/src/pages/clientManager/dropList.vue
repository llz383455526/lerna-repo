<template>
  <div class="drop-list">
    <div>企业风控等级降级列表</div>
    <br>
    <el-table
      :data="dataArr"
      border
      style="width: 100%">
      <el-table-column
        prop="companyName"
        label="企业名称">
      </el-table-column>
      <el-table-column
        prop="date"
        label="当前等级">
        <template slot-scope="scope">
          <w-start :count="scope.row.riskLevelNow"></w-start>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="降级等级">
        <template slot-scope="scope">
          <w-start :count="scope.row.riskLevelTo"></w-start>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="关联销售">
        <template slot-scope="scope">
            <div v-for="(v, k) in scope.row.salesmanInfoDTOList">{{ v.name }}</div>
        </template>
      </el-table-column>
      <el-table-column
        prop="date"
        label="限额规则">
        <template slot-scope="scope">
          <span>{{ scope.row.existRiskRuleSpecial ? '有' : '无' }}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="endTime"
        label="降级生效时间">
      </el-table-column>
      <el-table-column
        prop="date"
        label="操作"
        width="60px">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="detailBtnClick(scope.row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="clearfix pagination">
      <el-pagination
        style="float: right"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="1"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="10"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import { get, post } from "../../store/api";
  import WStart from '../../component/star'
  export default {
    components: {
      WStart
    },
    data() {
      return {
        dataArr: [],
        pageNum: 1,
        pageSize: 10,
        total: 0
      }
    },
    methods: {
      getListData() {
        post('/api/console-dlv/risk_level_degrade/list', {
          "page": this.pageNum,
          "pageSize": this.pageSize
        }).then((data) => {
          this.total = data.total
          this.dataArr = data.list
        }).catch(() => {})
      },
      handleSizeChange(size) {
        this.pageSize = size
        this.getListData()
      },
      handleCurrentChange(num) {
        this.pageNum = num
        this.getListData()
      },
      detailBtnClick(item) {
        this.$router.push(`/main/clientManager/dropDetail?id=${item.companyId}`)
      }
    },
    mounted() {
      this.getListData()
    }
  }
</script>
<style scoped lang="scss">
.drop-list {
  margin: 20px 0;
  background-color: #fff;
  padding: 20px;
  .pagination {
    padding-top: 10px;
  }
}
</style>
