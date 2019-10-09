<template>
  <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
    <div style="margin: 0 30px 30px;">渠道/代理商返佣结算管理</div>

      <el-form ref="formSearch" size="small" :inline="true" :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
        <el-form-item label="渠道/代理商" size="small" prop="agentCompanyIdEQ">
          <el-select filterable clearable v-model="formSearch.agentCompanyIdEQ">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in agentList" :label="item.companyName" :value="item.companyId" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算单号" size="small" prop="idEQ">
          <el-input v-model.trim="formSearch.idEQ"></el-input>
        </el-form-item>
        <el-form-item label="状态" size="small" prop="statusEQ">
          <el-select clearable v-model="formSearch.statusEQ">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in orderStatusOptions" :label="item.text" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算主体公司" size="small" prop="settleCompanyIdEQ">
          <el-select filterable clearable v-model="formSearch.settleCompanyIdEQ">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in settleCompanyList" :label="item.name" :value="item.id" :key="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发放服务公司" size="small" prop="serviceCompanyIdEQ">
          <el-select filterable clearable v-model="formSearch.serviceCompanyIdEQ">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="(item, index) in serviceCompanyList" :label="item.name" :value="item.id" :key="index"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="冻结状态" size="small" prop="frozenStatusEQ">
            <el-select v-model="formSearch.frozenStatusEQ">
              <el-option label="全部" value=""></el-option>
              <el-option v-for="item in frozenStatusOptions" :label="item.text" :value="item.value" :key="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="实发月份" size="small" prop="monthGTE">
          <el-date-picker
            v-model="formSearch.monthGTE"
            format="yyyy-MM"
            value-format="yyyy-MM"
            type="month"
            placeholder="开始月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="至" size="small" prop="monthLTE">
          <el-date-picker
            v-model="formSearch.monthLTE"
            format="yyyy-MM"
            value-format="yyyy-MM"
            type="month"
            placeholder="结束月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="销售人员" size="small" prop="salesmanNameLK">
          <el-input v-model.trim="formSearch.salesmanNameLK"></el-input>
       </el-form-item>
        <el-form-item label="结算方式" size="small" prop="settleTypeEQ">
          <el-select v-model="formSearch.settleTypeEQ">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in settleTypeOptions" :label="item.text" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
				<el-form-item label="结算月份" size="small" prop="currentSettleTypeEQ">
					<el-select v-model="formSearch.currentSettleTypeEQ">
						<el-option label="全部" value=""></el-option>
						<el-option v-for="item in currentSettleTypeOptions" :label="item.text" :value="item.value" :key="item.value"></el-option>
					</el-select>
				</el-form-item>
        <el-form-item label="支付状态" size="small" prop="payStatusEQ">
          <el-select v-model="formSearch.payStatusEQ">
            <el-option label="全部" value=""></el-option>
            <el-option v-for="item in payStatusOptions" :label="item.text" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query()" size="small">查询</el-button>
          <el-button size="small" @click="resetForm">重置</el-button>
          <el-button size="small" @click="exportOrder" v-if="checkRight(permissions, 'accounting:/commission-order/export')" >导出结算单列表</el-button>
          <el-button size="small" @click="exportOrderDetail" v-if="checkRight(permissions, 'accounting:/commission-order/item/export')" >导出结算明细</el-button>
          <el-button size="small" @click="handleBatch('sign')" v-if="checkRight(permissions, 'accounting:/commission-order/sign')" >批量签发</el-button>
          <el-button size="small" @click="handleBatch('sales-confirm')" v-if="checkRight(permissions, 'accounting:/commission-order/sales-confirm')">业务批量确认</el-button>
          <!-- <el-button size="small" @click="handleBatch('finance-confirm')">财务批量确认</el-button> -->
          <el-button size="small" @click="showImportDialog" v-if="checkRight(permissions, 'accounting:/commission-order/upload/pay-list-submit')" >导入支付明细</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;" max-height="600" border>
          <el-table-column prop="month" label="实发月份" width="120" fixed></el-table-column>
          <el-table-column prop="agentCompanyName" label="渠道/代理商" width="200" fixed></el-table-column>
          <el-table-column prop="serviceCompanyName" label="发放服务公司" width="200" fixed></el-table-column>
          <el-table-column prop="settleCompanyName" label="结算主体公司" width="200" fixed></el-table-column>
          <el-table-column prop="salesmanName" label="销售人员" width="120"></el-table-column>
          <el-table-column prop="groupName" label="所属团队" width="170"></el-table-column>
          <el-table-column prop="id" label="结算单号" width="170"></el-table-column>
          <el-table-column prop="statusText" label="单据状态" width="170"></el-table-column>
          <el-table-column prop="frozenStatus" label="冻结状态" width="170">
						<template slot-scope="scope">
              <span>{{scope.row.frozenStatus ? '是' : '否'}}</span>
            </template>
					</el-table-column>
          <el-table-column prop="frozenRemarks" label="冻结原因" width="170"></el-table-column>
          <el-table-column prop="amount" label="总实发流水金额" width="170">
            <template slot-scope="scope">
              <span>{{scope.row.amount | formatMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="commissionAmount" label="返佣总金额" width="170">
            <template slot-scope="scope">
              <span>{{scope.row.commissionAmount | formatMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="currentCommissionAmount" label="本期结算返佣金额" width="170">
            <template slot-scope="scope">
              <span>{{scope.row.currentCommissionAmount | formatMoney}}</span>
            </template>
          </el-table-column>
				<el-table-column prop="settleType" label="结算方式" width="170">
					<template slot-scope="scope">
						<span>{{formatOptionType('settleTypeOptions', scope.row.settleType)}}</span>
					</template>
				</el-table-column>
          <el-table-column prop="currentSettleType" label="结算月份" width="170">
						<template slot-scope="scope">
              <span>{{formatOptionType('currentSettleTypeOptions', scope.row.currentSettleType)}}</span>
            </template>
					</el-table-column>
          <el-table-column prop="payStatus" label="支付状态" width="170">
						<template slot-scope="scope">
              <span>{{formatOptionType('payStatusOptions', scope.row.payStatus)}}</span>
            </template>
					</el-table-column>
          <el-table-column prop="paidAmount" label="支付金额" width="170">
            <template slot-scope="scope">
              <span>{{scope.row.paidAmount | formatMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="notPaidAmount" label="未付金额" width="170">
            <template slot-scope="scope">
              <span>{{scope.row.notPaidAmount | formatMoney}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="lastPaidTime" label="最后支付时间" width="170">
            <template slot-scope="scope">
              <span>{{scope.row.lastPaidTime | formatTime('yyyy-MM-dd')}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="refRemarks" label="备注" width="170"></el-table-column>
          <el-table-column prop="action" label="操作" width="170" fixed="right">
            <template slot-scope="scope">
              <el-button
                v-if="(scope.row.status === 'Ready' || scope.row.status === 'Rejected') && checkRight(permissions, 'accounting:/commission-order/delete')"
                type="text"
                size="small"
                @click="handleDelete(scope.row)">删除</el-button>
							<el-button
								v-if="(scope.row.status === 'Ready' || scope.row.status === 'Rejected') && checkRight(permissions, 'accounting:/commission-order/sign')"
								type="text"
								size="small"
								@click="handleSignOne(scope.row)">签发</el-button>
							<el-button
								v-if="scope.row.status === 'Signed' && checkRight(permissions, 'accounting:/commission-order/sales-confirm')"
								type="text"
								size="small"
								@click="handleSalesConfirmOne(scope.row)">确认</el-button>
              <el-button
                v-if="scope.row.status === 'Signed' && checkRight(permissions, 'accounting:/commission-order/sales-reject')"
                type="text"
                size="small"
                @click="handleReject('sales-reject', scope.row)">驳回</el-button>
              <el-button type="text" size="small" @click="handlePrint(scope.row)" v-if="checkRight(permissions, 'accounting:/commission-order/detail-for-print')">打印</el-button>
              <el-button type="text" size="small" @click="showOrderDetail(scope.row)" v-if="checkRight(permissions, 'accounting:/commission-order/item/list')">查看明细</el-button>
							<el-button type="text" size="small" @click="showPayDetail(scope.row)" v-if="checkRight(permissions, 'accounting:/commission-order/pay/order/list')">查看支付明细</el-button>
            </template>
          </el-table-column>
      </el-table>
      <ayg-pagination v-if="tableList.total" :total="tableList.total"
                      v-on:handleSizeChange="sizeChange"
                      v-on:handleCurrentChange="query" :currentPage="formSearch.page"></ayg-pagination>

    <el-dialog
      v-loading="resLoading"
      title="付款导入"
      :visible.sync="importDialogVisible"
      width="30%"
      @close="resetImport">
      <div class="mtitle">下载模板</div>
      <div>
        <a class="download" href="/api/accounting/commission-order/pay/template/download" download="导入模板.xlsx" target="_blank">
          <el-button size="small">
            下载模板
          </el-button>
        </a>
        <span style="color: red;">下载模板后，按模板内说明填入业务数据。</span>
      </div>
      <div class="mtitle">上传数据</div>
      <div>
        <order-upload
          ref="orderUpload"
          targetType="settle-pay-order"
          @upload-success="handleUploadSuccess"
        ></order-upload>
      </div>
      <div class="mtitle" v-if="payTableList.total">导入结果</div>
      <div v-if="payTableList.total">
        <el-button size="small" @click="payTableVisible = true">查看导入日志</el-button>
        <span
          v-show="successNum || failNum"
          style="margin-left: 20px;"
        >导入结果：导入成功 {{successNum}}条，失败 {{failNum}}条</span>
      </div>
      <div v-if="payTableList.total" style="text-align: right;">
        <el-button size="small" type="primary" @click="importSubmit">确认导入</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="payType === 'upload' ? '导入结果' : '支付明细'"
      :visible.sync="payTableVisible"
      width="60%"
    >
			<div
				v-if="payType === 'pay'"
				style="text-align: center; color: red; font-size: 16px;"
			>支付金额合计：{{payTotalAmount | formatMoney}}</div>
      <pay-table :id="currentId" :data="payTableList.list" :type="payType"></pay-table>
      <ayg-pagination
        v-if="payTableList.total"
        :total="payTableList.total"
        v-on:handleSizeChange="sizeChangePay"
        v-on:handleCurrentChange="queryPay"
        :currentPage="formPay.page">
      </ayg-pagination>
    </el-dialog>
      
    <el-dialog :title="batchTitle" :visible.sync="batchDialogVisible" width="30%" @close="handleBatchClose">
      <el-form ref="formBatch" :model="formBatch" :inline="true" size="small" :rules="rulesBatch">
        <el-form-item prop="month" label="实发月份">
          <el-date-picker
            v-model="formBatch.month"
            format="yyyy-MM"
            value-format="yyyy-MM"
            type="month"
            placeholder="开始月份">
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="currentSettleType" label="结算方式">
          <el-select v-model="formBatch.currentSettleType">
            <el-option v-for="item in currentSettleTypeOptions" :label="item.text" :value="item.value" :key="item.value"></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button size="small" type="primary" @click="handleBatchSubmit">提交</el-button>
        <el-button size="small" @click="batchDialogVisible = false">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 打印 -->
    <commission-order-print ref="orderPrint" :detail="printDetail"></commission-order-print>
  </div>
</template>

<script>
import { get, post } from '../../store/api'
import commissionOrderPrint from './component/commission-order-print.vue'
import orderUpload from './component/order-upload.vue'
import payTable from './component/pay-table.vue'
import {mapGetters} from 'vuex'

export default {
  components: {
    commissionOrderPrint,
    orderUpload,
		payTable,
  },
  data() {
    return {
      formSearch: {
        agentCompanyIdEQ: '',
        idEQ: '',
        statusEQ: '',
        settleCompanyIdEQ: '',
        serviceCompanyIdEQ: '',
        frozenStatusEQ: '',
        monthGTE: '',
        monthLTE: '',
        salesmanNameLK: '',
        settleTypeEQ: '',
				currentSettleTypeEQ: '',
        payStatusEQ: '',
        page: 1,
        pageSize: 10,
      },
      monthDate: '',
      agentList: [],
      serviceCompanyList: [],
      settleCompanyList: [],
      // 单据状态
      orderStatusOptions: [
        { value: 'Ready', text: '结算组复核中'},
        { value: 'Signed', text: '结算组已确认'},
        { value: 'SalesConfirmed', text: '销售已确认'},
        { value: 'FinanceConfirmed', text: '财务已确认'},
        { value: 'Rejected', text: '已驳回'}
      ],
      // 冻结状态
      frozenStatusOptions: [
        { value: '0', text: '否'},
        { value: '1', text: '是'}
      ],
      // 支付状态
      payStatusOptions: [
        { value: 'PENDING', text: '未支付'},
        { value: 'PART_PAID', text: '部分已支付'},
        { value: 'PAID', text: '完全支付'}
      ],
      // 结算方式-月份
      currentSettleTypeOptions: [
        { value: 'NextMonth', text: '次月'},
        { value: 'MonthAfterNext', text: '次次月'}
      ],
			// 结算方式
			settleTypeOptions: [
				{ value: 'NextMonth', text: '次月'},
				{ value: 'MonthAfterNext', text: '次次月'},
				{ value: 'NMAndMANBy672', text: '次月+次次月（分6.72%）'},
				{ value: 'NMAndMANByPercent', text: '次月+次次月(约定比例)'},
			],
      tableList: {
        total: 0,
        list: [
          // {
          //   id: 11,
          //   confirmLogId: 222,
          // }
        ],
      },
      formBatch: {
        month: '',
        currentSettleType: '',
      },
      rulesBatch: {
        month: [
          { required: true, message: '请选择实发月份', trigger: 'blur' },
        ],
        currentSettleType: [
          { required: true, message: '请选择结算方式', trigger: 'blur' },
        ],
      },
      batchTitle: '批量签发',
      batchType: 'sign',
      batchDialogVisible: false,
      printDetail: {},
      formPay: {
        importTaskIdEQ: '',
				// agentCompanyIdEQ: '',
        page: 1,
        pageSize: 10,
      },
			// 存储当前选中的结算单号
			currentId: '',
      payTableList: {
        list: [],
        total: 0,
      },
			// 标识当前查看的是导入数据 upload，还是业务数据 pay
			payType: 'upload',
      failNum: 0,
      successNum: 0,
			payTotalAmount: 0,
      resLoading: false,
      importDialogVisible: false,
      payTableVisible: false,
    }
  },
	computed: {
		...mapGetters({
			permissions: 'permissions',
		})
	},
  created() {
    get('/api/contract-web/agent-contract/agent-company-option?sign=true').then((data) => {
      this.agentList = data
    })
    get('/api/sysmgr-web/commom/company', {
			companyIdentity: 'service'
		}).then(data => {
			this.serviceCompanyList = data
			this.settleCompanyList = data
		})
    this.query()
  },
  methods: {
    query(a) {
      this.formSearch.page = 1
      if (a && !isNaN(a)) {
        this.formSearch.page = a
      }
      get('/api/accounting/commission-order/list', this.formSearch).then((data) => {
        this.tableList = data
      })
    },
    sizeChange(size) {
      this.formSearch.pageSize = size
      this.query()
    },
    resetForm() {
      this.$refs.formSearch.resetFields()
    },
		// 导入支付明细
		showImportDialog() {
			this.payType = 'upload'
			// 重置下
			this.formPay = {
        importTaskIdEQ: '',
        page: 1,
        pageSize: 10,
      }
      this.payTableList = {
        list: [],
        total: 0,
      }
      this.successNum = 0
      this.failNum = 0
			this.$nextTick(() => {
				this.importDialogVisible = true
			})
		},
    exportOrder() {
      const param = Object.keys(this.formSearch).map(key => `${key}=${this.formSearch[key]}`).join('&')
      window.open(`/api/accounting/commission-order/export?${param}`)
    },
		exportOrderDetail() {
			const param = Object.keys(this.formSearch).map(key => `${key}=${this.formSearch[key]}`).join('&')
			window.open(`/api/accounting/commission-order/item/export?${param}`)
		},
    handleDelete(item) {
      this.$prompt('备注', '确认删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(?=.*\S).+$/,
        inputErrorMessage: '内容不能为空',
      }).then(({ value }) => {
        post('/api/accounting/commission-order/delete', {
          confirmLogId: item.confirmLogId,
          id: item.id,
          operationRemarks: value.trim(),
        }).then(() => {
          this.$message({
            type: 'success',
            message: '删除成功',
          })
					this.query()
        })
      })
    },
    handleReject(type, item) {
      this.$prompt('驳回原因', '驳回', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        inputPattern: /^(?=.*\S).+$/,
        inputErrorMessage: '内容不能为空',
      }).then(({ value }) => {
        post(`/api/accounting/commission-order/${type}`, {
          confirmLogId: item.confirmLogId,
          id: item.id,
          operationRemarks: value.trim()
        }).then(() => {
          this.$message({
            type: 'success',
            message: '驳回成功',
          })
					this.query()
        })
      })
    },
    handlePrint(item) {
      get('/api/accounting/commission-order/detail-for-print', {
        id: item.id,
      }).then(data => {
        this.printDetail = data
        this.$refs.orderPrint.print()
      })
    },
    handleBatch(type) {
      if (type === 'sign') {
        this.batchTitle = '批量签发'
      } else if (type === 'finance-confirm' || type === 'sales-confirm') {
        this.batchTitle = '批量确认'
      }
      this.batchType = type
      this.batchDialogVisible = true
    },
    handleBatchClose() {
      this.formBatch = {
        month: '',
        currentSettleType: '',
      }
    },
    handleBatchSubmit() {
      this.$refs.formBatch.validate((valid) => {
        if (!valid) {
          return false
        }
        post(`/api/accounting/commission-order/${this.batchType}`, this.formBatch).then(() => {
          this.$message({
            type: 'success',
            message: `${this.batchTitle}成功`
          })
          this.batchDialogVisible = false
					this.query()
        })
      }) 
    },
    // 查看明细
    showOrderDetail(item) {
      this.$router.push({
        path: 'commission-order-detail',
        query: {
          id: item.itemRefId,
        },
      })
    },
		// 查看支付明细
		showPayDetail(item) {
			this.payType = 'pay'
			this.payTableList = {
				list: [],
				total: 0,
			}
			this.formPay = {
				refIdEQ: item.id,
				page: 1,
				pageSize: 10,
			}
			this.payTotalAmount = 0
			this.currentId = item.id
			this.queryPay()
			this.queryPayTotalAmount()
			this.$nextTick(() => {
				this.payTableVisible = true
			})
		},
    importSubmit() {
      post('/api/accounting/commission-order/upload/pay-list-submit', {
        importTaskIdEQ: this.formPay.importTaskIdEQ,
      }).then(() => {
        this.importDialogVisible = false
				this.query()
      })
    },
    handleUploadSuccess(id) {
      this.formPay.importTaskIdEQ = id
      this.resLoading = true
      // 后端要求需要延迟2s后再查询结果
      setTimeout(() => {
        Promise.all([
						this.queryResStatics(),
						this.queryPay(),
					]).finally(() => {
          this.resLoading = false
        })
      }, 2000)
    },
    // 查询导入列表统计
    queryResStatics() {
      return get('/api/accounting/commission-order/settle/order/statics', {
        importTaskIdEQ: this.formPay.importTaskIdEQ,
      }).then((data) => {
        this.failNum = data.failNum
        this.successNum = data.successNum
      })
    },
		// 渠道返佣支付单明细单总金额统计信息
		queryPayTotalAmount() {
			return get('/api/accounting/commission-order/pay/order/total', this.formPay).then((data) => {
				this.payTotalAmount = data
			})
		},
    // 查询导入结果
    queryPay(page) {
      if (Number.isNaN(Number(page))) {
        page = 1
      }
      this.formPay.page = page
			const url = this.payType === 'upload'
				? '/api/accounting/commission-order/upload/pay-list'
				: '/api/accounting/commission-order/pay/order/list'
      return get(url, this.formPay).then((data) => {
        this.payTableList = data
      })
    },
    sizeChangePay(size) {
      this.formPay.pageSize = size
      this.queryPay()
    },
    resetImport() {
			// 重置上传组件
      this.$refs.orderUpload.resetUpload()
    },
		formatOptionType(type, val) {
			const item = this[type].find(item => item.value === val)
			if (!item) {
				return ''
			}
			return item.text
		},
		handleSignOne(item) {
			this.$prompt('备注', '确定签发', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^(?=.*\S).+$/,
				inputErrorMessage: '内容不能为空',
			}).then(({ value }) => {
				post('/api/accounting/commission-order/sign-one', {
					confirmLogId: item.confirmLogId,
					id: item.id,
					operationRemarks: value.trim(),
				}).then(() => {
					this.$message({
						type: 'success',
						message: '签发成功',
					})
					this.query()
				})
			})
		},
		handleSalesConfirmOne(item) {
			this.$prompt('备注', '确认', {
				confirmButtonText: '确定',
				cancelButtonText: '取消',
				inputPattern: /^(?=.*\S).+$/,
				inputErrorMessage: '内容不能为空',
			}).then(({ value }) => {
				post('/api/accounting/commission-order/sales-confirm-one', {
					confirmLogId: item.confirmLogId,
					id: item.id,
					operationRemarks: value.trim(),
				}).then(() => {
					this.$message({
						type: 'success',
						message: '确认成功',
					})
					this.query()
				})
			})
		}
  },
}
</script>

<style lang="less" scoped>
.mtitle {
	margin: 25px 0;
}
</style>
