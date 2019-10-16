<template>
  <div class="col-xs-12 hegui">
    <h4 class="block green">合规通信息</h4>
    <div class="hegui-tab"
         v-if="companyId">
      <div class="hegui-title">客户历史表现</div>
      <div class="row content">
        <div class="col-xs-6"
             v-if="info.quarterSignRate !== undefined">近三个月加权电子签约率: {{info.quarterSignRate}}%</div>
        <div class="col-xs-6"
             v-if="info.industryFeeAverage !== undefined">所属行业平均服务费: {{info.industryFeeAverage}}</div>
        <div class="col-xs-6"
             v-if="info.signRate !== undefined">历史加权电子签约率: {{info.signRate}}%</div>
        <div class="col-xs-6"
             v-if="info.customerFeeAverage !== undefined">客户平均服务费: {{info.customerFeeAverage}}</div>
      </div>
    </div>
    <div v-if="checkRight(permissions, 'risk-mgt-service:/compliance-risk/get-contract-compliance-risk-report')" class="hegui-tab">
      <div class="hegui-title">合规通报告</div>
      <el-table :data="riskReportList"
                class="hegui-table">
        <el-table-column prop="reportNo"
                         label="报告编号"></el-table-column>
        <el-table-column prop="reportName"
                         label="报告名称"></el-table-column>
        <el-table-column prop="createTime"
                         label="报告时间"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text"
                       size="medium"
                       style="padding:0;"
                       @click="downloadReport(scope)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script>
import {post, get} from '../../../../store/api'
import {mapGetters} from 'vuex'

export default {
	name: 'heguitong',
	props: {
		contractModel: {
			type: Object
		}
	},
	data(){
		return {
			info: '',
			companyId: '',
			riskReportList: [],
		}
	},
	created() {
	},
	watch: {
		'contractModel.contractId': function(){
			this.getRiskReport()
		},
		'contractModel.contractForm.customerId': function(){
			this.getInfoById()
		}
  },
  computed: {
    ...mapGetters({
            permissions: 'permissions'
        }),
  },
	methods: {
		getInfoById(){
			let industryType = this.contractModel.contractForm.industryType //行业类型
			this.companyId = this.contractModel.contractForm.customerId // id取值
			debugger
			if(!this.companyId) {
				return
			}
			get('/api/risk-mgt-service/company-performance/get-info-by-id', {
					industryType,
					companyId: this.companyId
			}).then(result => {
					this.info = result
			})
		},
		getRiskReport(){
			let contractNo = this.$route.query.id// 合同编号
			if(!contractNo) {
				return
      }
      if(!this.checkRight(this.permissions, 'risk-mgt-service:/compliance-risk/get-contract-compliance-risk-report')) {
        return
      }
			get('/api/risk-mgt-service/compliance-risk/get-contract-compliance-risk-report', {
					contractNo
			}).then(result => {
					this.riskReportList = result
			})
		},
		downloadReport(item){
			const url = '/api/risk-mgt-service/compliance-risk/download-compliance-risk-report' +
            '?id=' + item.row.id;
            window.open(url)
		}
	}
};
</script>
<style lang="scss" scoped>
.hegui {
  &-tab {
    .hegui-title {
      padding-left: 10px;
    }
    .hegui-title:nth-last-of-type(2) {
      margin-top: 10px;
    }

    .content {
      padding-left: 40px;
      font-size: 13px;
    }
  }

  &-table {
    width: 80%;
    margin-left: 40px;
  }
}
</style>