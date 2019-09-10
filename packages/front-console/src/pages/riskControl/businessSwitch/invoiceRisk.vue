<template>
	<div style="padding-top: 10px;">
		<el-form :inline="true" label-position="top" :model="formSearch" ref="formSearch" size="small">
			<el-form-item label="客户名称" prop="customerCompanyId">
				<el-select filterable clearable style="width: 200px" v-model="formSearch.customerCompanyId">
						<el-option v-for="e in companyList" :value="e.id" :label="e.name" :key="e.id"></el-option>
				</el-select>
			</el-form-item>
      <el-form-item label="开票开关" prop="switchStatus">
				<el-select filterable clearable style="width: 200px" v-model="formSearch.switchStatus">
          <el-option v-for="item in invoiceApplySwitch" :key="item.value"
            :label="item.label" :value="item.value"></el-option>
				</el-select>
			</el-form-item>
			<el-form-item label=".">
				<el-button type="primary" @click="searchQuery">查询</el-button>
				<el-button @click="resetFormSearch">清空</el-button>
			</el-form-item>
		</el-form>
    <el-button type="text" @click="forbidInvoiceApplyShow = true">+ 添加配置</el-button>
		<el-table :data="tableData.list">
			<el-table-column prop="customerCompanyName" label="客户名称"></el-table-column>
			<el-table-column prop="serviceCompanyName" label="落地公司"></el-table-column>
			<el-table-column prop="switchStatus" label="开票开关">
				<template slot-scope="scope">
					<span>{{scope.row.switchStatus === '0' ? '禁止开票申请' : '可以开票申请'}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="remark" label="原因"></el-table-column>
			<el-table-column prop="updateBy" label="操作记录">
				<template slot-scope="scope">
					<div>{{scope.row.updateByName}}</div>
					<div>{{scope.row.updateTime}}</div>
				</template>
			</el-table-column>
			<el-table-column prop="action" label="操作">
				<template slot-scope="scope">
          <el-button
						type="text"
						@click="changeInvoiceStatus(scope.row)"
					>
          {{scope.row.switchStatus === '0' ? '启用开票' : '禁用开票'}}
					</el-button>
          <router-link :to="`invoiceRiskDetail?customerCompanyId=${scope.row.customerCompanyId}&serviceCompanyId=${scope.row.serviceCompanyId}`">
					<el-button
						v-if="checkRight(permissions, 'risk-mgt-service:/company-business-risk/get-customer-business-risk')"
						type="text"
					>
            查看详情
					</el-button>
          </router-link>
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
    <forbid-invoice-apply 
      :show.sync="forbidInvoiceApplyShow"
      :companyList="companyList"
      @success="resetQuery"></forbid-invoice-apply>
    <el-dialog
      title="开票申请开关"
			:visible.sync="invocieApplyConfigShow"
      @close="$refs.invoiceApplyForm.resetFields()"
			width="400px">
      <el-form :model="invoiceApplyForm" :rules="rules" ref="invoiceApplyForm" size="small">
        <el-form-item prop="switchStatus">
          <el-radio-group v-model="invoiceApplyForm.switchStatus">
            <el-radio v-for="item in invoiceApplySwitch.slice(1)" :key="item.value"
              :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="invoiceApplyForm.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="invocieApplyConfigShow = false">取 消</el-button>
        <el-button type="primary" @click="submitInvoiceApplyForm">确 定</el-button>
      </span>
    </el-dialog>
	</div>
</template>

<script>
import {mapGetters} from 'vuex'
import {post, get} from '../../../store/api'
import {risk} from 'src/api'
import forbidInvoiceApply from './forbidInvoiceApply.vue'

export default {
  components: {
    forbidInvoiceApply
  },
	data() {
		return {
      invocieApplyConfigShow: false, // 配置弹窗
      forbidInvoiceApplyShow: false, // 添加配置弹窗
			formSearch: {
        companyId: '',
        switchStatus: '',
				page: 1,
				pageSize: 10,
      },
      rules: {
        remark: {required: true, message: '请填写备注', trigger: 'blur'}
      },
      companyList: [],
      invoiceApplySwitch: [ // 开票申请枚举
        {
          label: '全部',
          value: '',
        },
        {
          label: '可以开票申请',
          value: '1',
        },
        {
          label: '禁止开票申请',
          value: '0'
        }
      ],
      // 更新要提交的表单
      invoiceApplyForm: {
        customerCompanyId: '',
        remark: '',
        serviceCompanyId: '',
        switchStatus: ''
      },
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
				total: 0,
			},
		}
	},
	computed: {
		...mapGetters({
			permissions: 'permissions',
			// userInformation: 'userInformation'
		})
	},
	activated () {
	},
	methods: {
		query() {
			post(risk.invoiceRiskList, this.formSearch).then((data) => {
        this.tableData.list = data ? data.list : []
        this.tableData.total = data ? data.total :0
			})
    },
    searchQuery() {
      this.formSearch.page = 1
      this.query()
    },
		sizeChange(size) {
      this.formSearch.page = 1
			this.formSearch.pageSize = size
			this.query()
		},
		resetFormSearch() {
			this.$refs['formSearch'].resetFields();
    },
    // 提交成功后重新拉取数据
    resetQuery() {
      this.resetFormSearch()
      this.searchQuery()
    },
    changeInvoiceStatus(val) {
      // 将行数据更新到要提交的对象
      Object.assign(this.invoiceApplyForm, val)
      this.invoiceApplyForm.remark = ''
      this.invocieApplyConfigShow = true

    },
    // 修改开关
    submitInvoiceApplyForm() {
      this.$refs.invoiceApplyForm.validate((valid) => {
        if (valid) {
         post(risk.invoiceRiskSwitch, this.invoiceApplyForm).then(res => {
          this.invocieApplyConfigShow = false
          this.query()
        })
        }
      })
    }
  },
  created() {
    // 获取列表
    this.query()
		// 客户公司
		get('/api/sysmgr-web/commom/company', {
			companyIdentity: 'custom'
		}).then(data => {
			this.companyList = data
		})
	},
}
</script>