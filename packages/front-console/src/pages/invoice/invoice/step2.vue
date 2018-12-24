<template>
  <div class="main-invoice-bill-step1">
    <p>账单开票</p>
    <el-steps :active="2" align-center>
      <el-step title="选择账单"></el-step>
      <el-step title="核对"></el-step>
    </el-steps>
    <br><br>
    <div class="step2">
      <p class="section-title">账单信息</p>
      <div class="section">
        <el-form label-width="170px">
          <el-table
            ref="multipleTable"
            :data="tableData3"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="zhangDanSelChange">
            <el-table-column
              label="入账日期"
              width="120">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column
              prop="name"
              label="账单类型"
              width="120">
            </el-table-column>
            <el-table-column
              prop="address"
              label="总金额"
              show-overflow-tooltip>
            </el-table-column>
          </el-table>
          <el-form-item label="开票金额合计">
            <span style="color: #ef000d">￥284,596.00</span>
          </el-form-item>
        </el-form>
      </div>
      <p class="section-title">发票信息</p>
      <div class="section">
        <el-form label-width="170px">
          <el-form-item label="发票类型">
            <span>增值税专用发票</span>
          </el-form-item>
          <el-form-item label="发票类目">
            <span>*现代服务*信息服务费</span>
          </el-form-item>
          <el-form-item label="税率">
            <span>6%</span>
          </el-form-item>
          <el-form-item label="落地公司名称">
            <span>河南爱洋信息科技有限公司</span>
          </el-form-item>
          <el-form-item label="开票名称">
            <span>天津金狐文化传播有限公司</span>
          </el-form-item>
          <el-form-item label="纳税人识别号">
            <span>911201165864250487</span>
          </el-form-item>
          <el-form-item label="公司地址">
            <span>北京市朝阳区将台路5号院5号楼二层2025室</span>
          </el-form-item>
          <el-form-item label="公司电话">
            <span>010-64398176</span>
          </el-form-item>
          <el-form-item label="开户行">
            <span>中信银行北京三元桥支行</span>
          </el-form-item>
          <el-form-item label="银行账号">
            <span>7113 5101 8260 0085 641</span>
          </el-form-item>
          <el-form-item label="发票显示备注">
            <span>无</span>
          </el-form-item>
        </el-form>
      </div>
      <p class="section-title">邮寄信息</p>
      <div class="section">
        <el-form label-width="170px">
          <el-form-item label="收票人">
            <span>吴琪琳</span>
          </el-form-item>
          <el-form-item label="收票人电话">
            <span>15521272056</span>
          </el-form-item>
          <el-form-item label="收票人地址">
            <span>北京市朝阳区将台路5号院5号楼二层2025室</span>
          </el-form-item>
        </el-form>
      </div>
      <p class="section-title">其他</p>
      <div class="section">
        <el-form label-width="170px">
          <el-form-item label="发票用途（对内说明）">
            <span>7月业务费</span>
          </el-form-item>
          <el-form-item>
            <el-button @click="step = 1">返回上一步</el-button>
            <el-button>预览</el-button>
            <el-button type="primary" @click="onSubmit">提交申请</el-button>
          </el-form-item>
        </el-form>
      </div>

    </div>
  </div>
</template>

<script>
  import {post, get} from '../../../store/api';
  export default {
    name: "step1",
    data() {
      return {
        tableData3: [{
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }],
        // 发票类目列表
        involiceLeiMuList: [],
        // 流水账单列表
        liuShuiDataArr: [],
        // 服务费账单列表
        serverDataArr: []
      }
    },
    methods: {

    },
    mounted() {
    }
  }
</script>

<style scoped lang="scss">
  .main-invoice-bill-step1 {
    background-color: #fff;
    padding: 15px;
    .step2 {
      .section {
        padding-left: 80px;
      }
    }
  }
</style>

<style lang="scss">
  .main-invoice-bill-step1 {
    .step2 {
      .el-form-item {
        margin-bottom: 0px;
      }
    }
  }
</style>
