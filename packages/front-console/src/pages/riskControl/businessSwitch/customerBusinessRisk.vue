<template>
	<div style="padding-top: 10px;">
		<el-form :inline="true" :model="formSearch" ref="formSearch" size="small">
			<el-form-item label="客户公司" prop="companyId">
				<el-select filterable clearable style="width: 200px" v-model="formSearch.companyId">
						<el-option label="所有" value=""></el-option>
						<el-option v-for="e in companyList" :value="e.id" :label="e.name" :key="e.id"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="query()">查询</el-button>
				<el-button @click="resetFormSearch">清空</el-button>
			</el-form-item>
		</el-form>
		<el-table :data="tableData.list">
			<el-table-column prop="companyName" label="客户公司"></el-table-column>
			<el-table-column prop="salesList" label="关联销售">
				<template slot-scope="scope">
					<div
						v-for="e in scope.row.salesList"
						:key="e.id">{{e.name}}
					</div>
				</template>
			</el-table-column>
			<el-table-column prop="deliverList" label="关联交付">
				<template slot-scope="scope">
						<p
							style="margin: 0"
							v-for="(v, k) in scope.row.deliverList"
							:key="k">{{ v.name }}</p>
				</template>
			</el-table-column>
			<el-table-column prop="customerTypeName" label="客户类型"></el-table-column>
			<el-table-column prop="agentCompanyName" label="代理商公司"></el-table-column>
			<!-- <el-table-column prop="updateBy" label="操作记录">
				<template slot-scope="scope">
					<div>{{scope.row.updateByName}}</div>
					<div>{{scope.row.updateTime}}</div>
				</template>
			</el-table-column> -->
			<el-table-column prop="action" label="操作">
				<template slot-scope="scope">
					<el-button
						v-if="checkRight(permissions, 'risk-mgt-service:/company-business-risk/get-customer-business-risk')"
						type="text"
						@click="onLineAuditBtnClick(scope.row)"
					>发放管理
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<ayg-pagination v-if="tableData.total"
				:total="tableData.total"
				v-on:handleSizeChange="sizeChange"
				:currentSize="formSearch.pageSize"
				v-on:handleCurrentChange="query"
				:currentPage="formSearch.page">
		</ayg-pagination>

		<el-dialog
			:visible.sync="onlineAuditIsShow"
			width="800px">
			<p slot="title" style="margin: 0px" v-if="shangHuShangXianModel">
				{{ shangHuShangXianModel.customerCompanyName }}&nbsp;&nbsp;&nbsp;&nbsp;
				<el-switch v-model="shangHuShangXianModel.enable" @change="faFangTitleChange(shangHuShangXianModel)"></el-switch>
				<span>客户发放开关</span><br /><br />
				<span v-if="shangHuShangXianModel.agentCompanyName" style="font-size: 14px; color: #3a3a3a">代理商名称：{{ shangHuShangXianModel.agentCompanyName }}</span>
				<span v-else style="font-size: 14px; color: #999">代理商名称：非代理商客户</span>
			</p>
			<el-table
				v-if="shangHuShangXianModel"
				:data="shangHuShangXianModel.detailResultList"
				style="width: 100%">
				<el-table-column
					label=""
					width="50px">
					<template slot-scope="scope">
						<el-switch v-model="scope.row.enable" @change="faFangCellChange(scope.row)"></el-switch>
					</template>
				</el-table-column>
				<el-table-column
					label="落地公司名称">
					<template slot-scope="scope">
						{{ scope.row.serviceCompanyName }}
					</template>
				</el-table-column>
				<el-table-column
					label="合同是否归档">
					<template slot-scope="scope">
						<span class="item-data">{{ scope.row.contractOk ? '是' : '否' }}</span>
					</template>
				</el-table-column>
				<el-table-column
					prop="cuserBalanceStandardStateName"
					label="计算规则是否通过">
				</el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
import {post, get} from '../../../store/api'

export default {
	data() {
		return {
			formSearch: {
				companyId: '',
				page: 1,
				pageSize: 10,
			},
			companyList: [],
			tableData: {
				list: [
					{
						companyName: 'companyName',
						updateByName: '111',
						updateTime: '2019-09-04 13:35:32',
						id: 10001618,
						agentCompanyName: 'agentCompanyName',
						originalTypeName: 'originalTypeName',
						deliverList: [{name: 'name'}],
						salesList: [{name:'salesList'}],
					}
				],
				total: 1,
			},
			onlineAuditIsShow: false,
			shangHuShangXianModel: null,
		}
	},
	computed: {
		...mapGetters({
			permissions: 'permissions',
			// userInformation: 'userInformation'
		})
	},
	created() {
		// 客户公司
		get('/api/sysmgr-web/commom/company', {
			companyIdentity: 'custom'
		}).then(data => {
			this.companyList = data
		})
	},
	activated () {
		this.query()
	},
	methods: {
		query(a) {
			this.formSearch.page = 1
			if (a && !isNaN(a)) {
				this.formSearch.page = a
			}
			post('/api/risk-mgt-service/company-business-risk/list-customer-business-risk', this.formSearch).then((data) => {
				this.tableData = data
			})
		},
		sizeChange(size) {
			this.formSearch.pageSize = size
			this.query()
		},
		resetFormSearch() {
			this.formSearch.companyId = ''
		},
		// 发放管理按钮
		onLineAuditBtnClick(item) {
			this.shangHuShangXianModel = null
			get('/api/risk-mgt-service/company-business-risk/get-customer-business-risk', {
				customerCompanyId: item.companyId
			}).then((data) => {
				data.enable = !!data.businessStatus
				if (!data.detailResultList) {
					data.detailResultList = []
				}
				data.detailResultList.forEach((item) => {
					item.enable = !!item.businessStatus
				})
				this.shangHuShangXianModel = data
			}).catch(() => {
			})
			this.onlineAuditIsShow = true
		},
		faFangTitleChange(data) {
			post('/api/risk-mgt-service/company-business-risk/update-customer-business-enable', {
				"customerCompanyId": data.customerCompanyId,
				"enable": data.enable ? 1 : 0
			}).then((data) => {
				this.$message({
					message: '修改成功',
					type: 'success'
				})
			}).catch(() => {

			})
		},
		faFangCellChange(data) {
			post('/api/risk-mgt-service/company-business-risk/update-customer-business-enable', {
				"customerCompanyId": this.shangHuShangXianModel.customerCompanyId,
				"enable": data.enable ? 1 : 0,
				"serviceCompanyId": data.serviceCompanyId
			}).then((data) => {
				this.$message({
					message: '修改成功',
					type: 'success'
				})
			}).catch(() => {

			})
		},
	},
}
</script>