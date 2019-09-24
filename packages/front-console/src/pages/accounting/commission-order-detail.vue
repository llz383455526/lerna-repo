<template>
	<div style="margin-top: 15px;background-color: #fff;padding: 15px;">
		<div style="margin: 0 30px 30px;">
			<span>结算单明细</span>
		</div>
    <el-button size="small" @click="exportExl">导出Excel</el-button>
    <el-table :data="tableList.list" border style="margin-top: 25px;">
      <el-table-column prop="month" label="实发月份" width="100" fixed></el-table-column>
      <el-table-column prop="serviceCompanyName" label="发放服务公司" width="120" fixed></el-table-column>
      <el-table-column prop="settleCompanyName" label="结算主体" width="120" fixed></el-table-column>
      <el-table-column prop="settleCompanyName" label="客户公司" width="120" fixed></el-table-column>
      <el-table-column prop="agentCompanyName" label="代理商" width="120" fixed></el-table-column>
      <el-table-column prop="salesmanName" label="销售" width="120"></el-table-column>
      <el-table-column prop="groupName" label="所属团队" width="120"></el-table-column>
      <el-table-column prop="personStepAmount" label="服务费区间值" width="120"></el-table-column>
      <el-table-column prop="gtAmount" label="实发金额>服务费区间值(A)" width="120"></el-table-column>
      <el-table-column prop="lteAmount" label="实发金额<=服务费区间值(B)" width="120"></el-table-column>
      <el-table-column prop="amount" label="总实发金额" width="120">
        <template slot-scope="scope">
          <span>{{scope.row.amount | formatMoney}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="commissionType" label="返佣类型" width="120"></el-table-column>
      <el-table-column prop="commissionDescription" label="客户返佣公式" width="180"></el-table-column>
      <el-table-column prop="commissionAmount" label="客户返佣" width="100"></el-table-column>
      <el-table-column prop="currentCommissionAmount" label="次月返佣" width="120"></el-table-column>
      <el-table-column prop="nextCommissionAmount" label="次次月返佣" width="120"></el-table-column>
      <el-table-column prop="gtAgentSettleRate" label="渠道结算费率(>返佣结算区间值)(C)" width="100"></el-table-column>
      <el-table-column prop="lteAgentSettleRate" label="渠道结算费率(<=返佣结算区间值)(D)" width="100"></el-table-column>
      <el-table-column prop="serviceFeeDescription" label="服务费计算公式"  width="180"></el-table-column>
      <el-table-column prop="gtServiceFeeRate" label="服务费费率(>服务费区间值)(E)" width="120"></el-table-column>
      <el-table-column prop="lteServiceFeeRate" label="服务费费率(<=服务费区间值)(F)" width="120"></el-table-column>
      <el-table-column prop="prepayServiceFeeRate" label="预收比例" width="100"></el-table-column>
      <el-table-column prop="lteServiceFeeRate" label="返佣计算区间值" width="120"></el-table-column>
      <el-table-column prop="gtAmount" label="实发金额>返佣结算区间值(G)" width="120"></el-table-column>
      <el-table-column prop="lteAmount" label="实发金额<=返佣结算区间值(H)" width="120"></el-table-column>
    </el-table>
		<div style="text-align: right; margin-top: 25px;">
			<el-button
				size="small"
				type="primary"
				@click="$router.back()"
			>返回</el-button>
		</div>
	</div>
</template>

<script>
import { get } from '../../store/api'

export default {
  data() {
    return {
      tableList: {
        list: [],
      },
      id: null,
    }
  },
  created() {
    this.id = this.$route.query.id
    this.query()
  },
  methods: {
    query() {
      get('/api/accounting/commission-order/item/list', {
        id: this.id,
      }).then((data) => {
        this.tableList = data
      })
    },
    exportExl() {
      window.open(`/api/accounting/commission-order/item/export?itemRefIdEQ=${this.id}`)
    }
  },
}
</script>
