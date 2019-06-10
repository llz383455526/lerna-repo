<template>
  <div class="level-detail">
    <div>
      {{ $route.query.name }}规则管理
    </div>
    <div>
      <p style="color: #999">风险评级细项</p>
      <el-table
        :data="fengXianList"
        border
        style="width: 100%">
        <el-table-column
          prop="title"
          label="评级细项">
        </el-table-column>
        <el-table-column
          prop="detail"
          label="评级标准">
        </el-table-column>
      </el-table>
      <p style="color: #f00">
        规则备注： 五星必须满足以上全部三条；四星必须满足以上任意一条或两条；以上都不满足则为三星；
      </p>
      <div>发放规则</div>
      <div style="padding: 10px 0;">
        <el-button type="primary" size="mini" @click="addRuleBtnClick">新增规则</el-button>
      </div>
      <el-table
        :data="ruleList"
        border
        style="width: 100%">
        <el-table-column
          prop="riskPackId"
          label="ID">
        </el-table-column>
        <el-table-column
          label="落地公司">
          <template slot-scope="scope">
            <div v-for="(v, k) in scope.row.serviceCompanyNames">{{ v }}</div>
          </template>
        </el-table-column>
        <el-table-column
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editBtnClick(scope.row)">编辑</el-button>
            <el-button type="text" size="small" @click="removeBtnClick(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="clearfix" style="padding-top: 10px">
        <el-pagination
          style="float: right"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageModel.page"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageModel.size"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageModel.total">
        </el-pagination>
      </div>
    </div>
    <div>
      <el-button size="small" @click="$router.go(-1)">返回</el-button>
    </div>
  </div>
</template>

<script>
  import {get, post} from "../../store/api";
  export default {
    name: "levelDetail",
    data() {
      return {
        // 规则列表
        ruleList: [],
        pageModel: {
          page: 1,
          size: 10,
          total: 0
        }
      }
    },
    computed: {
      fengXianList() {
        switch (this.$route.query.star) {
          case 'three-star':
            return [{
              title: 'C端用户签约率',
              detail: '小于50.00%'
            }, {
              title: 'C端绩效计算规则',
              detail: '审核不通过'
            }, {
              title: 'C端绩效费计算明细表',
              detail: '审核不通过'
            }]
          case 'four-star':
          case 'five-star':
            return [{
              title: 'C端用户签约率',
              detail: '大于等于50.00%'
            }, {
              title: 'C端绩效计算规则',
              detail: '审核通过'
            }, {
              title: 'C端绩效费计算明细表',
              detail: '审核通过'
            }]
        }
        return []
      }
    },
    methods: {
      /**
       * 获取规则列表数据
       */
      getRuleList() {
        post('/api/console-dlv/risk-level/risk-rule-pack-list', {
          page: this.pageModel.page,
          pageSize: this.pageModel.size,
          riskLevel: this.$route.query.star
        }).then((data) => {
          this.ruleList = data.list
          this.pageModel.total = data.total
        }).catch(() => {})
      },
      handleSizeChange(size) {
        this.pageModel.size = size
        this.getRuleList()
      },
      handleCurrentChange(page) {
        this.pageModel.page = page
        this.getRuleList()
      },
      addRuleBtnClick() {
        this.$router.push({ path: '/main/orderManager/ruleEdit', query: this.$route.query })
      },
      editBtnClick(item) {
        const p = {
          ...this.$route.query,
          id: item.riskPackId
        }
        this.$router.push({ path: '/main/orderManager/ruleEdit', query: p })
      },
      /**
       * 删除规则
       */
      removeRule(id) {
        get('/api/console-dlv/risk-level/delete-risk-rule-pack', {
          riskRulePackId: id
        }).then((data) => {
          this.$message({
            showClose: true,
            message: `删除成功`,
            type: 'success'
          });
          this.getRuleList()
        }).catch(() => {})
      },
      removeBtnClick(item) {
        this.$confirm(`确定要删除 ${item.riskPackId} ？`, '删除提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
        }).then(() => {
          this.removeRule(item.riskPackId)
        }).catch(() => {});
      }
    },
    mounted() {
      this.getRuleList()
    }
  }
</script>

<style lang="scss" scoped>
.level-detail {
  margin: 20px 0;
  padding: 20px;
  background-color: #fff;
}
</style>
