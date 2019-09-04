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
			<el-table-column prop="originalTypeName" label="客户类型"></el-table-column>
			<el-table-column prop="agentCompanyName" label="代理商公司"></el-table-column>
			<el-table-column prop="updateBy" label="操作记录">
				<template slot-scope="scope">
					<div>{{scope.row.updateByName}}</div>
					<div>{{scope.row.updateTime}}</div>
				</template>
			</el-table-column>
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
					// {
					// 	companyName: 'companyName',
					// 	updateByName: '111',
					// 	updateTime: '2019-09-04 13:35:32',
					// 	id: 10001618,
					// 	agentCompanyName: 'agentCompanyName',
					// 	originalTypeName: 'originalTypeName',
					// 	deliverList: [{name: 'name'}],
					// 	salesList: [{name:'salesList'}],
					// }
				],
				total: 1,
			},
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
	},
	methods: {
		query(a) {
			this.formSearch.page = 1
			if (a && !isNaN(a)) {
				this.formSearch.page = a
			}
			post('/api/sysmgr-web/company/query-company', this.formSearch).then((data) => {
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
	},
}
</script>