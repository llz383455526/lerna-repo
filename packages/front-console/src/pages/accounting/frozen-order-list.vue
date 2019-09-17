<template>
  <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
    <div style="margin: 0 30px 30px;">代理商冻结管理</div>

    <el-form
      ref="formSearch"
      :inline="true"
      :model="formSearch"
      style="padding-left: 35px;padding: 10px 0 10px 35px;">
      <el-form-item label="渠道/代理商:" size="small" prop="agentCompanyIdEQ">
        <el-select filterable clearable v-model="formSearch.agentCompanyIdEQ">
          <el-option label="全部" value=""></el-option>
          <el-option v-for="(item, index) in agentList" :label="item.companyName" :value="item.companyId" :key="index"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="状态:" size="small" prop="frozen">
        <el-select v-model="formSearch.frozen">
          <el-option label="全部" value=""></el-option>
          <el-option label="有效" :value="1"></el-option>
          <el-option label="无效" :value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="创建人:" size="small" prop="createdBy">
        <el-input v-model.trim="formSearch.createdBy" placeholder="请输入"></el-input>
      </el-form-item>

      <el-form-item style="margin-top: -4px">
        <el-button type="primary" @click="query" size="small">查询</el-button>
        <el-button size="small" @click="resetFormSearch">清除</el-button>
        <el-button size="small" @click="importExl" v-if="checkRight(permissions, 'accounting:/commission-order/upload/frozen-list-submit')">批量导入</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;">
      <el-table-column prop="agentCompanyName" label="渠道/代理商" width="200"></el-table-column>
      <el-table-column prop="settleCompanyName" label="结算主体公司" width="200"></el-table-column>
      <el-table-column prop="frozen" label="状态" width="120">
				<template slot-scope="scope">
          <span>{{scope.row.frozen ? '有效' : '无效'}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="startMonth" label="起始月份" width="120"></el-table-column>
      <el-table-column prop="frozenRemarks" label="原因说明"></el-table-column>
			<el-table-column prop="createUserName" label="创建人"></el-table-column>
      <el-table-column prop="createTime" label="创建日期" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column prop="updateTime" label="最后更新日期" width="170">
        <template slot-scope="scope">
          <span>{{scope.row.updateTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
        </template>
      </el-table-column> -->
    </el-table>

    <ayg-pagination v-if="tableList.total" :total="tableList.total"
                    v-on:handleSizeChange="sizeChage"
                    v-on:handleCurrentChange="query" :currentPage="formSearch.page"></ayg-pagination>

    <el-dialog
			v-loading="resLoading"
			title="冻结导入"
			:visible.sync="importDialogVisible"
			width="30%"
			@close="resetImport">
      <div class="mtitle">下载模板</div>
      <div>
        <a class="download" href="/api/accounting/commission-order/frozen/template/download" download="导入模板.xlsx" target="_blank">
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
          targetType="settle-frozen-order"
          @upload-success="handleUploadSuccess"
        ></order-upload>
      </div>
      <div class="mtitle" v-if="resTableList.total">导入结果</div>
      <div v-if="resTableList.total">
        <el-button size="small" @click="importDialogResVisible = true">查看导入日志</el-button>
        <span
          v-show="successNum || failNum"
          style="margin-left: 20px;"
        >导入结果：导入成功 {{successNum}}条，失败 {{failNum}}条</span>
      </div>
      <div v-if="resTableList.total" style="text-align: right;">
        <el-button size="small" type="primary" @click="importSubmit">确认导入</el-button>
      </div>
    </el-dialog>
    <el-dialog title="导入结果"
      :visible.sync="importDialogResVisible"
      width="60%"
    >
      <el-table :data="resTableList.list">
        <el-table-column prop="agentCompanyName" label="渠道/代理商"></el-table-column>
        <el-table-column prop="settleCompanyName" label="结算主体公司"></el-table-column>
        <el-table-column prop="startTime" label="起始月份"></el-table-column>
        <el-table-column prop="status" label="状态">
				</el-table-column>
        <el-table-column prop="reason" label="原因说明"></el-table-column>
        <el-table-column prop="validateResult" label="导入状态">
          <template slot-scope="scope">
            <span :style="{ color: scope.row.validateResult === '不通过' ? 'red' : 'inherit'}"
            >{{scope.row.validateResult}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="errMsg" label="错误信息">
          <template slot-scope="scope">
            <div style="color: red;" v-for="(val, name) in scope.row.errMsg" :key="name">{{val}}</div>
          </template>
        </el-table-column>
      </el-table>
      <ayg-pagination
        v-if="resTableList.total"
        :total="resTableList.total"
        v-on:handleSizeChange="sizeChangeRes"
        v-on:handleCurrentChange="queryRes"
        :currentPage="formRes.page">
      </ayg-pagination>
    </el-dialog>
  </div>
</template>

<script>
import { get, post } from '../../store/api'
import OrderUpload from './component/order-upload.vue'
import {mapGetters} from 'vuex'

export default {
  components: {
    OrderUpload,
  },
  data() {
    return {
      formSearch: {
        agentCompanyIdEQ: '',
        frozen: '',
        createdBy: '',
        page: 1,
        pageSize: 10,
      },
      tableList: {
        total: 0,
        list: [],
      },
      agentList: [],
      formRes: {
        importTaskIdEQ: '',
        page: 1,
        pageSize: 10,
      },
      resTableList: {
        list: [],
        total: 0,
      },
      failNum: 0,
      successNum: 0,
      resLoading: false,
      importDialogVisible: false,
      importDialogResVisible: false,
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
    this.query()
  },
  methods: {
    query(page) {
      if (Number.isNaN(Number(page))) {
        page = 1
      }
      this.formSearch.page = page
      get('/api/accounting/commission-order/frozen/order/list', this.formSearch).then((data) => {
        this.tableList = data
      })
    },
    sizeChage(size) {
      this.formSearch.pageSize = size
      this.query()
    },
    resetFormSearch() {
      this.$refs.formSearch.resetFields()
    },
    importExl() {
      this.importDialogVisible = true
    },
    importSubmit() {
      post('/api/accounting/commission-order/upload/frozen-list-submit', {
        importTaskIdEQ: this.formRes.importTaskIdEQ,
      }).then(() => {
        this.importDialogVisible = false
        this.query()
      })
    },
    handleUploadSuccess(id) {
      this.formRes.importTaskIdEQ = id
      this.resLoading = true
      setTimeout(() => {
        Promise.all([this.queryResStatics(), this.queryRes()]).finally(() => {
          this.resLoading = false
        })
      }, 2000)
    },
    // 查询导入列表统计
    queryResStatics() {
      return get('/api/accounting/commission-order/settle/order/statics', {
        importTaskIdEQ: this.formRes.importTaskIdEQ,
      }).then((data) => {
        this.failNum = data.failNum
        this.successNum = data.successNum
      })
    },
    // 查询导入结果
    queryRes(page) {
      if (Number.isNaN(Number(page))) {
        page = 1
      }
      this.formRes.page = page
      return get('/api/accounting/commission-order/upload/frozen-list', this.formRes).then((data) => {
        this.resTableList = data
      })
    },
    sizeChangeRes(size) {
      this.formRes.pageSize = size
      this.queryRes()
    },
    resetImport() {
      this.formRes = {
        importTaskIdEQ: '',
        page: 1,
        pageSize: 10,
      }
      this.resTableList = {
        list: [],
        total: 0,
      }
      // 重置上传组件
      this.$refs.orderUpload.resetUpload()
    },
  },
}
</script>

<style lang="less" scoped>
.mtitle {
	margin: 25px 0;
}
</style>
