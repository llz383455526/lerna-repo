<template>

  <div class="main-container">
    <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
      <el-form-item label="服务公司" size="small">
        <el-select filterable v-model="formSearch.serviceCompanyId" placeholder="请选择">
          <el-option v-for="item in serviceCompanyList" :key="item.value" :label="item.text" :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="客户公司:" size="small" prop="customCompanyId">
        <el-select filterable v-model="formSearch.customCompanyId">
          <el-option v-for="item in customCompanyList" :label="item.name" :value="item.id" :key="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发票类目" size="small" prop="subjectId">
        <el-select v-model="formSearch.subjectId" placeholder="请选择" style="width:100%;">
          <el-option v-for="item in invoiceOptions" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="发票类型" size="small" prop="invoiceType">
        <el-select v-model="formSearch.invoiceType" placeholder="请选择" style="width:100%;">
          <el-option v-for="item in searchOptions.InvoiceType" :key="item.id" :label="item.text" :value="item.value"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注" size="small" prop="status">
          <el-select v-model="formSearch.status">
              <el-option value="" label="全部"></el-option>
              <el-option v-for="e in statusList" :key="e.value" :value="e.value" :label="e.text"></el-option>
          </el-select>
      </el-form-item>

      <el-form-item label="开票时间" size="small">
        <el-date-picker
          v-model="dateValue"
          type="daterange"
          :unlink-panels="true"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd">
        </el-date-picker>
      </el-form-item>

      <el-form-item style="margin-top: -4px">
        <el-button type="primary" @click="search" size="small">查询</el-button>
        <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
        <el-button size="small" @click="exportFile">导出</el-button>
      </el-form-item>
    </el-form>

    <div class="t_head">已开发票共计：{{companyData.count}}张，金额共计 {{companyData.amount | formatMoney}}元，税额共计
        {{companyData.taxRateAmount | formatMoney}}元，价税合计 {{companyData.taxRateTotalAmount |formatMoney}}元&#x3000;注：作废或冲红的金额不列入统计
        <router-link to="invoiceImport">
            <el-button class="fr" type="primary" size="small">导入纸票</el-button>
        </router-link>
    </div>

    <div class="table-container">
      <el-table :data="tableList.list">
        <el-table-column prop="contractStartDate" label="开票时间">
          <template slot-scope="scope">{{scope.row.invoiceDate | formatTime('yyyy-MM-dd')}}</template>
        </el-table-column>
        <el-table-column prop="customCompanyName" label="客户公司"></el-table-column>
        <el-table-column prop="fullName" label="发票类目"></el-table-column>
        <el-table-column prop="invoiceTypeName" label="发票类型"></el-table-column>
        <el-table-column prop="invoiceCode" label="发票代码"></el-table-column>
        <el-table-column prop="invoiceNo" label="发票号码"></el-table-column>
        <el-table-column prop="serviceCompanyName" label="销方名称"></el-table-column>
        <el-table-column prop="serviceTaxIdcd" label="销方税号"></el-table-column>
        <el-table-column prop="amount" label="金额（元）">
          <template slot-scope="scope">{{scope.row.amount - scope.row.taxAmount | formatMoney}}</template>
        </el-table-column>
        <el-table-column prop="totalTaxAmount" label="税额（元）">
          <template slot-scope="scope">{{scope.row.taxAmount | formatMoney}}</template>
        </el-table-column>
        <el-table-column prop="totalTaxAmount" label="价税合计（元）">
          <template slot-scope="scope">{{scope.row.amount | formatMoney}}</template>
        </el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column label="操作">
            <template slot-scope="scope">
                <el-button type="text" @click="remove(scope.row.id)" v-if="scope.row.status == 'offline_success'">移除</el-button>
                <el-button type="text" @click="cancel(scope.row)" v-if="scope.row.cancelable && (scope.row.status == 'offline_success' || scope.row.status == 'success')">作废</el-button>
                <el-button type="text" @click="red(scope.row)" v-if="!scope.row.disable && (scope.row.status == 'offline_success' || scope.row.status == 'success')">冲红</el-button>
                <el-button type="text" @click="look(scope.row)" v-if="scope.row.status == 'spillover'">查看红字发票</el-button>
            </template>
        </el-table-column>
      </el-table>
    </div>

    <ayg-pagination
        v-if="tableList.total"
        :total="tableList.total"
        v-on:handleSizeChange="handleSizeChange"
        :currentSize="pageSize"
        v-on:handleCurrentChange="handleCurrentChange"
        :currentPage="pageIndex">
    </ayg-pagination>
    <el-dialog title="作废" :visible.sync="cancel_show" width="600px">
        <el-table :data="[current]">
            <el-table-column label="开票名称" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="开票公司" prop="customCompanyName"></el-table-column>
            <el-table-column label="发票代码" prop="invoiceCode"></el-table-column>
            <el-table-column label="发票号码" prop="invoiceNo"></el-table-column>
            <el-table-column label="开票类目" prop="fullName"></el-table-column>
            <el-table-column label="开票金额">
                <template slot-scope="scope">{{scope.row.amount | formatMoney}}</template>
            </el-table-column>
        </el-table>
        <div class="top20">作废后，该发票失效；若需重新开具，则重新提交开票申请，是否确认作废？</div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="cancel_show = false">取消</el-button>
            <el-button type="primary" @click="csure">确定</el-button>
        </div>
    </el-dialog>
    <el-dialog :title="red_look ? '查看红字发票' : '请输入红字发票信息'" :visible.sync="red_show" width="600px" @open="clearRed">
        <el-form :model="red_form" :rules="red_rules" size="small" ref="red_form">
            <el-form-item label="发票代码" prop="invoiceCode">
                <el-input class="form_input" v-model="red_form.invoiceCode" :disabled="red_look"></el-input>
            </el-form-item>
            <el-form-item label="发票号码" prop="invoiceNo">
                <el-input class="form_input" v-model="red_form.invoiceNo" :disabled="red_look"></el-input>
            </el-form-item>
            <el-form-item label="发票金额" prop="amount" required>
                <el-input class="form_input" v-model="red_form.amount" disabled></el-input>
            </el-form-item>
        </el-form>
        <div class="top20" v-if="!red_look">若需重新开具，则重新提交开票申请，是否确认冲红？</div>
        <div slot="footer" class="dialog-footer">
            <el-button @click="red_show = false">取消</el-button>
            <el-button type="primary" @click="rsure" v-if="!red_look">确定</el-button>
        </div>
    </el-dialog>
  </div>

</template>

<script>
    import {post, get} from "../../store/api"

    import _ from 'lodash'

    import {showNotify} from '../../plugin/utils-notify'

    import {baseUrl} from '../../config/address'

    import {urlEncode} from '../../plugin/utils-functions'

    export default {
        created() {
            this.getSearchOptions ()
            this.getInvoiceOptions ()

            this.getList ()
            this.getCompanyData ()

            this.getCompanyList ()
            this.getServiceCompanyList()
        },
        data() {
            let minus = (rule, value, callback) => {
                if (isNaN(value)) {
                    callback(new Error('请输入金额'));
                } else if (value > 0) {
                    callback(new Error('金额必须为负数'));
                } else {
                    callback();
                }
            }
            return {
                searchOptions: {},
                statusList: [
                    {
                        value: 'invalid',
                        text: '已作废'
                    },
                    {
                        value: 'spillover',
                        text: '已冲红'
                    },
                    {
                        value: 'offline_success',
                        text: '线下开票成功'
                    },
                    {
                        value: 'success',
                        text: '成功'
                    }
                ],
                formSearch: {
                  subjectId: '',
                  invoiceType: '',
                  serviceComanyTaxIdcd: '',
                  customCompanyId: '',
                  /**
                   * 服务公司IS
                   */
                  serviceCompanyId: null,
                  status: ''
                },
                dateValue: '',
                tableList: [],
                pageSize: 10,
                pageIndex: 1,
                invoiceOptions: {},
                companyData: {},
                customCompanyList: [],
                /**
                 * 服务公司列表
                 */
                serviceCompanyList: [],
                cancel_show: false,
                current: {},
                red_show: false,
                red_form: {
                    amount: '',
                    id: '',
                    invoiceCode: '',
                    invoiceNo: '',
                    type: 2
                },
                red_rules: {
                    invoiceCode: [
                        { required: true, message: "请填写发票代码", trigger: "blur" }
                    ],
                    invoiceNo: [
                        { required: true, message: "请填写发票号码", trigger: "blur" }
                    ],
                    amount: [
                        { validator: minus, trigger: "blur" }
                    ]
                },
                red_look: false
            }
        },
        methods: {
            invoiceTypeChange(data) {
              console.log(data)
            },
            /**
             * 获取服务公司列表
             */
            getServiceCompanyList() {
              let url = '/api/invoice-web/invoice/service-company-options';
              get (url).then (res => {
                this.serviceCompanyList = res;
              })
            },
            getCompanyList() {
              get ('/api/sysmgr-web/commom/company', {
                companyIdentity: 'custom'
              }).then (result => {
                this.customCompanyList = result
              })
            },
            getSearchOptions() {
              post ('/api/sysmgr-web/commom/options?enumTypes=InvoiceType', {})
              .then (result => {
                this.searchOptions = result
              })
            },
            getInvoiceOptions() {
              post ('/api/invoice-web/custom-invoice-subject/qry', {
                name: '',
                pageSize: 0,
                page: 0
              }).then (result => {
                this.invoiceOptions = result.list
              })
            },
            resetForm() {
              this.dateValue = ''
              this.formSearch.subjectId = null
              this.formSearch.invoiceType = null
              this.formSearch.serviceComanyTaxIdcd = null
              this.formSearch.customCompanyId = null
              this.formSearch.serviceCompanyId = null
              this.formSearch.status = null
            },
            search() {
              this.pageIndex = 1
              this.getList ()
              this.getCompanyData()
            },
            handleSizeChange(value) {
              this.pageSize = value
              this.pageIndex = 1
              this.getList ()
            },
            handleCurrentChange(value) {
              this.pageIndex = value
              this.getList ()
            },
            getList() {
              let startAt = ''
              let endAt = ''
              if (this.dateValue) {
                startAt = this.dateValue[0]
                endAt = this.dateValue[1]
              }

              let formSearch = _.cloneDeep (this.formSearch)
              formSearch.issueStartDate = startAt
              formSearch.issueEndDate = endAt
              let options = _.assign (formSearch, {
                page: this.pageIndex,
                pageSize: this.pageSize,
                source: 'platform'
              })

              post ('/api/invoice-web/invoice/custom-company-invoice-list', options).then (result => {
                    result.list.forEach(e => {
                        e.disable = false
                        e.cancelable = false
                        let date = new Date(e.invoiceDate), now = new Date()
                        if(date.getFullYear() == now.getFullYear()) {
                            if(date.getMonth() == now.getMonth()) {
                                e.disable = true
                                e.cancelable = true
                            }
                        }
                        else if(date.getFullYear() + 1 == now.getFullYear()) {
                            if(date.getMonth() < now.getMonth()) {
                                e.disable = true
                            }
                        }
                    })
                    this.tableList = result
              })
            },
            exportFile() {
              let startAt = ''
              let endAt = ''
              if (this.dateValue) {
                startAt = this.dateValue[0]
                endAt = this.dateValue[1]
              }

              let formSearch = _.cloneDeep (this.formSearch)
              formSearch.issueStartDate = startAt
              formSearch.issueEndDate = endAt
              formSearch.source = 'platform'

              window.location.href = `/api/invoice-web/invoice/export-custom-invoice-details?${urlEncode(formSearch)}`
            },
            getCompanyData() {
              const issueStartDate = this.dateValue[0]
              const issueEndDate = this.dateValue[1]
              post('/api/invoice-web/invoice/sum-paper-invoice-list', {
                ...this.formSearch,
                issueStartDate,
                issueEndDate
              }).then(function (data) {
                this.companyData = data
              }.bind(this))
            },
            remove(id) {
                this.$confirm('是否确定进行移除?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(data => {
                    post(`/api/invoice-web/invoice/invoice-detail-delete?ids=${id}`).then(data => {
                        this.$message({
                            type: 'success',
                            message: '移除成功！' 
                        })
                        this.search()
                    })
                }).catch(err => {})
            },
            cancel(a) {
                this.current = a
                this.cancel_show = true
            },
            csure(a) {
                post('/api/invoice-web/invoice/invoice-operate-status', {
                    id: this.current.id,
                    invoiceCode: this.current.invoiceCode,
                    invoiceNo: this.current.invoiceNo,
                    type: 1
                }).then(data => {
                    this.cancel_show = false
                    this.$message({
                        type: 'success',
                        message: '作废成功！'
                    })
                    this.getList()
                })
            },
            red(a) {
                this.red_form = {
                    amount: -1 * a.amount,
                    id: a.id,
                    invoiceCode: '',
                    invoiceNo: '',
                    type: 2
                }
                this.red_show = true
                this.red_look = false
            },
            clearRed(next) {
                this.$refs.red_form && this.$refs.red_form.clearValidate()
                typeof next == 'function' && next()
            },
            rsure() {
                this.$refs.red_form.validate(valid => {
                    if(valid) {
                        post('/api/invoice-web/invoice/invoice-operate-status', this.red_form).then(data => {
                            this.red_show = false
                            this.$message({
                                type: 'success',
                                message: '冲红成功！'
                            })
                            this.getList()
                        })
                    }
                })
            },
            look(a) {
                post(`/api/invoice-web/invoice/invoice-spillover-detail?invoiceItemId=${a.id}`).then(data => {
                    this.red_form = {
                        amount: -1 * data.amount,
                        id: a.id,
                        invoiceCode: data.invoiceCode,
                        invoiceNo: data.invoiceNo,
                        type: 2
                    }
                    this.red_show = true
                    this.red_look = true
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-container {
        background-color: #fff;
        padding: 15px;
    }

    .table-container {
        width: 100%;
        margin-top: 20px;
    }

    .t_head {
        margin: 30px 0;
        font-size: 20px;
        color: #666;
    }
    .fr {
        float: right;
    }
    .top20 {
        margin-top: 20px;
    }
    .form_input {
        width: 400px;
    }
</style>
















