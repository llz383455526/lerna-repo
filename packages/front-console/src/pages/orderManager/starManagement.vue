<template>
  <div class="risk-rule">
    <div class="title">风控等级管理</div>
    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="date"
        label="星级">
        <template slot-scope="scope">
          <w-start :count="scope.row.code"></w-start>
        </template>
      </el-table-column>
      <el-table-column
        prop="updateByName"
        label="更新人">
      </el-table-column>
      <el-table-column
        prop="updateTime"
        label="更新时间">
      </el-table-column>
      <el-table-column
        prop="address"
        label="操作">
        <template slot-scope="scope">
          <el-button @click="showClick(scope.row)" type="text" size="small">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
  import {get, post} from "../../store/api";
  import WStart from '../../component/star'
  export default {
    components: {
      WStart
    },
    data() {
      return {
        tableData: []
      }
    },
    mounted() {
      this.getListData()
    },
    methods: {
      // 查看按钮点击
      showClick(row) {
        this.$router.push({ path: '/main/orderManager/levelDetail', query: { star: row.code, name: row.name }})
      },
      // 获取列表数据
      getListData() {
        get('/api/console-dlv/risk-level/risk-level-list').then((dataArr) => {
          this.tableData = dataArr
        }).catch(() => {})
      }
    }
  };
</script>
<style scoped>
  .risk-rule {
    margin: 20px 0;
    padding: 20px;
    background-color: #fff;
  }
</style>
