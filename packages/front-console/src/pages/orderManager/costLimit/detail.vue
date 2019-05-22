<template>
  <div class="cost-limit-detail">
    <div>
        {{ detailData.companyName }}&nbsp;
        <el-button type="primary" size="mini" @click="statusBtnClick">{{ detailData.state === '10' ? '停用' : '启用' }}</el-button>
    </div>
    <br>
    <el-row :gutter="20" class="group-item">
      <el-col :span="4" class="group-title">信用等级</el-col>
      <el-col :span="20">
        <w-start :count="detailData.riskLevel"></w-start>
      </el-col>
    </el-row>
    <el-row :gutter="20" class="group-item">
      <el-col :span="4" class="group-title">状态</el-col>
      <el-col :span="20" class="group-detail">{{ detailData.stateName }}</el-col>
    </el-row>
    <el-row :gutter="20" class="group-item">
      <el-col :span="4" class="group-title">更新时间</el-col>
      <el-col :span="20" class="group-detail">{{ detailData.updateTime }}</el-col>
    </el-row>
    <el-row :gutter="20" class="group-item">
      <el-col :span="4" class="group-title">更新人</el-col>
      <el-col :span="20" class="group-detail">{{ detailData.updateByName }}</el-col>
    </el-row>
    <br>
    <div>
      发放规则
    </div>
    <br>
    <div>
      <el-button type="primary" size="mini" @click="addBtnClick">新增规则</el-button>
    </div>
    <br>
    <el-table
      :data="detailData.riskListResultList"
      border
      style="width: 100%">
      <el-table-column
        prop="riskPackId"
        label="ID">
      </el-table-column>
      <el-table-column
        label="落地公司">
        <template slot-scope="scope">
          <div v-for="(v, k) in scope.row.serviceCompanyNames">
            {{ v }}
          </div>
        </template>
      </el-table-column>
      <el-table-column
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="editBtnClick(scope.row)">编辑</el-button>
          <el-button type="text" size="small" @click="showBtnClick(scope.row)">查看</el-button>
          <el-button type="text" size="small" @click="removeBtnClick(scope.row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <br>
    <el-button size="mini" @click="backBtnClick">返回</el-button>
  </div>
</template>

<script>
  import {get, post} from "../../../store/api";
  import WStart from '../../../component/star'
  export default {
    name: "detail",
    components: {
      WStart
    },
    data() {
      return {
        detailData: {}
      }
    },
    methods: {
      getData() {
        get('/api/console-dlv/risk-special/risk-special-risk-pack-list', {
          "companyId": this.$route.query.id
        }).then((data) => {
          this.detailData = data
        }).catch(() => {})
      },
      addBtnClick() {
        const query = this.$route.query
        this.$router.push({ path: '/main/orderManager/costLimitAddRule' , query: query})
      },
      editBtnClick(item) {
        const query = this.$route.query
        this.$router.push({ path: '/main/orderManager/costLimitAddRule' , query: {
          ...query,
            ruleid: item.riskPackId
          }})
      },
      showBtnClick(item) {
        const query = this.$route.query
        this.$router.push({ path: '/main/orderManager/costLimitAddRule' , query: {
            ...query,
            ruleid: item.riskPackId,
            show: true
          }})
      },
      removeBtnClick(item) {
        this.$confirm('是否删除', '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post('/api/console-dlv/risk-special/risk-special-pack-delete', {
            companyId: parseInt(this.$route.query.id),
            riskPackId: item.riskPackId
          }).then((data) => {
            this.$message({
              showClose: true,
              message: '删除成功',
              type: 'success'
            });
            this.getData()
          }).catch(() => {})
        }).catch(() => {});
      },
      backBtnClick() {
        this.$router.go(-1)
      },
      statusBtnClick() {
          post('/api/console-dlv/risk-special/risk-special-state-update', {
              companyId: parseInt(this.$route.query.id),
              state: this.detailData.state === '10' ? '20' : '10'
          }).then((data) => {
              this.$message({
                  message: this.detailData.state === '10' ? '停用成功' : '启用成功',
                  type: 'success'
              });
              this.getData()
          }).catch(() => {})
      }
    },
    mounted() {
      this.getData()
    }
  }
</script>

<style lang="scss" scoped>
.cost-limit-detail {
  background-color: #fff;
  margin: 20px 0;
  padding: 20px;
  .group-item {
    .group-title {
      color: #666;
    }
    .group-detail {
      color: #999;
    }
  }
}
</style>
