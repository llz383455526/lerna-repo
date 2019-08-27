<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0 30px 30px;">客户公司毛利成本列表</div>

        <el-form :inline="true" :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">

            <el-form-item label="客户公司" prop="companyId">
                <el-select filterable style="width: 150px" v-model="formSearch.customerCompanyIdEQ">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="e in companys" :value="e.id" :label="e.name" :key="e.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务公司" prop="serviceCompanyId">
                <el-select filterable style="width: 150px" v-model="formSearch.serviceCompanyIdEQ">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="e in serviceCompanyIds" :value="e.id" :label="e.name" :key="e.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="代理商公司名称:" prop="agentCompanyIdEQ">
                <el-select style="width: 150px" v-model="formSearch.agentCompanyIdEQ" filterable placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in agentList" :label="item.companyName" :value="item.companyId" :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="实发月份:" size="small">
                <el-date-picker v-model="formSearch.monthGTE" type="month" placeholder="开始月份" value-format="yyyy-MM"></el-date-picker>
                至
                <el-date-picker v-model="formSearch.monthLTE" type="month" placeholder="结束月份" value-format="yyyy-MM"></el-date-picker>
            </el-form-item>

            <el-form-item label="销售:" size="small">
                <el-input style="width: 150px" v-model="formSearch.salesmanLK" placeholder="销售"></el-input>
            </el-form-item>

            <el-form-item label="销售团队编号:" size="small">
                <el-input style="width: 150px" v-model="formSearch.groupIdLK" placeholder="销售团队编号"></el-input>
            </el-form-item>

            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
                <el-button size="small" @click="batchExportClick">导出EXCEL</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="flowTableList.list" style="width: 100%;margin-top: 20px;" max-height="600" border>
            <el-table-column prop="month" label="月份" width="120" fixed></el-table-column>
            <el-table-column prop="customerCompanyName" label="客户名称" width="200" fixed></el-table-column>
            <el-table-column prop="serviceCompanyName" label="服务公司" width="200" fixed></el-table-column>
            <el-table-column prop="agentCompanyName" label="代理商公司" width="120"></el-table-column>
            <el-table-column prop="districtName" label="税优地" width="120"></el-table-column>
            <el-table-column prop="totalTaxDesc" label="税优地阶梯" width="120"></el-table-column>
            <el-table-column prop="salesman" label="关联销售" width="120"></el-table-column>
            <el-table-column prop="groupId" label="销售团队" width="120"></el-table-column>
            <el-table-column prop="groupName" label="销售总监" width="120"></el-table-column>
            <el-table-column prop="amount" label="实发总额（绩效费）" width="120"></el-table-column>
            <el-table-column prop="taxAmount" label="总税费" width="120"></el-table-column>
            <el-table-column prop="retAmount" label="总返税" width="120"></el-table-column>

            <el-table-column prop="sepAmount" label="服务费（管理费）区间值" width="120"></el-table-column>
            <el-table-column prop="serviceFeeAmount" label="服务费（管理费）" width="120"></el-table-column>
            <el-table-column prop="serviceFeeAmountGt30k" label="服务费（>区间值）" width="120"></el-table-column>
            <el-table-column prop="serviceFeeAmountLte30k" label="服务费（<=区间值）" width="120"></el-table-column>
            <el-table-column prop="serviceCalcRemarks" label="服务费文案" width="120"></el-table-column>
            <el-table-column prop="serviceFeeRateGt" label="服务费费率（>区间值）" width="120"></el-table-column>
            <el-table-column prop="serviceFeeRateLte" label="服务费（<=区间值）" width="120"></el-table-column>

            <el-table-column prop="partnerShareProfitAmount" label="合伙人分润" width="120"></el-table-column>
            <el-table-column prop="partnerShareProfitWay" label="合伙人分润文案" width="120"></el-table-column>

            <el-table-column prop="districtFixedCostAmount" label="税优地硬成本(总税费-返税+合伙人分润+缓征税-缓征返税)" width="120"></el-table-column>
            <el-table-column prop="districtFixedCostRate" label="税优地硬成本率" width="120"></el-table-column>
            <el-table-column prop="grossProfit1Amount" label="毛利1（服务费-税优地硬成本）" width="120"></el-table-column>
            <el-table-column prop="grossProfit1Rate" label="毛利率1" width="120"></el-table-column>
            <el-table-column prop="hardCost" label="交易硬成本（不含支付渠道手续费）" width="120"></el-table-column>
            <el-table-column prop="signFee" label="签约+签约认证" width="120"></el-table-column>
            <el-table-column prop="certifyFee" label="支付认证费" width="120"></el-table-column>
            <el-table-column prop="channelFee" label="支付渠道手续费" width="120"></el-table-column>

            <el-table-column prop="grossProfit2Amount" label="毛利2（服务费-税优地应成本-交易硬成本）" width="120"></el-table-column>
            <el-table-column prop="grossProfit2Rate" label="毛利率2" width="120"></el-table-column>
            <el-table-column prop="salesSettleCostSepAmount" label="返佣结算区间值" width="120"></el-table-column>

            <el-table-column prop="gtSscSaAmount" label="实发金额>返佣结算区间值" width="120"></el-table-column>
            <el-table-column prop="lteSscSaAmount" label="实发金额<=返佣结算区间值" width="120"></el-table-column>

            <el-table-column prop="commissionType" label="返佣类型" width="120"></el-table-column>
            <el-table-column prop="customerCommissionFunc" label="客户返佣公式" width="120"></el-table-column>
            <el-table-column prop="customerCommissionAmount" label="客户返佣金额" width="120"></el-table-column>

            <el-table-column prop="agentTotalAmount" label="代理商发放总金额(阶梯报价时)" width="120"></el-table-column>
            <el-table-column prop="grossProfit3Amount" label="毛利3（服务费-税优地硬成本-交易硬成本-渠道返佣）" width="120"></el-table-column>
            <el-table-column prop="grossProfit3Rate" label="毛利率3" width="120"></el-table-column>

            <el-table-column prop="salesSettleCostWay" label="销售结算成本文案" width="120"></el-table-column>
            <el-table-column prop="salesSettleCostAmount" label="销售结算成本" width="120"></el-table-column>
            <el-table-column prop="groupTotalAmountLte" label="团队业绩(<=服务费区间值)" width="120"></el-table-column>
            <el-table-column prop="offlineFeeAmount" label="手工发放服务费" width="120"></el-table-column>

            <el-table-column prop="grossProfit4Amount" label="毛利4（服务费 - 税优地硬成本 -交易硬成本- 客户返佣-收益池金额）" width="120"></el-table-column>
            <el-table-column prop="grossProfit4Rate" label="毛利率4" width="120"></el-table-column>

            <el-table-column prop="refId" label="任务ID" width="120"></el-table-column>
            <el-table-column prop="createTime" label="创建时间" width="170">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="更新时间" width="170">
                <template slot-scope="scope">
                    <span>{{scope.row.updateTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="说明" min-width="180"></el-table-column>
        </el-table>

        <ayg-pagination v-if="flowTableList.total" :total="flowTableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>

        <el-dialog title="导出对账单" :visible.sync="createExportDialogVisible" width="60%" @close="closeExportDialog">
            <el-form class="small-space" :rules="exportRules" :model="exportPostForm" ref="exportPostForm" label-position="left"
                     label-width="110px" style='margin-left:20px;margin-right: 20px'>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="结算开始月份" prop="monthGTE" required>
                            <el-date-picker
                                v-model="exportPostForm.monthGTE"
                                type="month"
                                value-format="yyyy-MM"
                                placeholder="提交日期" style="width: 180px;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结算结束月份" prop="monthLTE" required>
                            <el-date-picker
                                v-model="exportPostForm.monthLTE"
                                type="month"
                                value-format="yyyy-MM"
                                placeholder="提交日期" style="width: 180px;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createExportDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doExport">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    // import {showConfirm} from '../../plugin/utils-message'
    import {formatTime} from '../../plugin/utils-functions'
    import {baseUrl} from '../../config/address'
    import {showNotify} from "../../plugin/utils-notify";
    import {get, post, formPost} from "../../store/api";
    import fileUploader from '../../component/fileUploader'
    import fileUpload from '../../component/fileUpload'
    import _ from 'lodash'
    // import Ajax from "../../ajax/index"

    export default {
        components: {
            fileUploader,
            fileUpload
        },
        data() {
            const validateRequire = (rule, value, callback) => {
                // console.log('rule: ' + JSON.stringify(rule))
                // if (value === '') {
                if (!value) {
                    // this.$message({
                    //   message: rule.field + '为必传项',
                    //   type: 'error'
                    // })
                    callback(new Error(rule.label + '为必传项'))
                } else {
                    callback()
                }
            };
            return {
                pageSize: 10,
                currentPage: 1,
                currentChangeBySetting: false,
                formSearch: {
                    salesmanLK: '',
                    groupIdLK: '',
                    customerCompanyIdEQ: '',
                    serviceCompanyIdEQ: '',
                    agentCompanyIdEQ: '',
                    monthGTE: '',
                    monthLTE: ''
                },
                createDateValue: '',
                updateDateValue: '',
                monthGTE: '',
                monthLTE: '',
                selectList2: [],
                StatusOptions: [
                    {'value': 'Ready', 'text': '新建'},
                    {'value': 'Signed', 'text': '已签发'},
                    {'value': 'Confirmed', 'text': '已确认'},
                    {'value': 'Rejected', 'text': '已驳回'},
                    {'value': 'Deleted', 'text': '已删除'}
                    ],
                hasReceivablesOptions: [
                    {'value': '0', 'text': '否'},
                    {'value': '1', 'text': '是'}
                ],
                flowTableList: [],
                dialogVisible: false,
                createSignDialogVisible: false,
                createConfirmDialogVisible: false,
                createDeleteDialogVisible: false,
                createRejectDialogVisible: false,
                createExportDialogVisible: false,
                reconParam: {
                    id: null,
                    taskTypeId: '',
                    startDate: '',
                    endDate: ''
                },
                uploadUrl: '',
                fileList1: [],
                fileList2: [],
                referArr1: [],
                referArr2: [],
                formData1: '',
                formData2: '',
                sourceId: undefined,
                taskTypeId: undefined,
                rowToDelete: undefined,
                isApp: false,
                createSignPostForm: {
                    operationRemarks: '',
                    month: ''
                },
                confirmPostForm: {
                    operationRemarks: '',
                    month: ''
                },
                rejectPostForm: {
                    operationRemarks: '',
                    confirmLogId:''
                },
                deletePostForm: {
                    operationRemarks: '',
                    confirmLogId:''
                },
                exportPostForm: {
                    monthGTE: '',
                    monthLTE: '',
                },
                rules: {
                    taskTypeId: [{required: true, validator: validateRequire, label: '发放渠道'}],
                    startDate: [{required: true, validator: validateRequire, label: '结算开始月份'}],
                    endDate: [{required: true, validator: validateRequire, label: '结算结束月份'}],
                    remarks: [{required: true, validator: validateRequire, label: '结算说明'}],
                },
                signRules: {
                    month: [{required: true, validator: validateRequire, label: '实发月份'}],
                },
                rejectRules: {
                    operationRemarks: [{required: true, validator: validateRequire, label: '驳回备注'}],
                },
                deleteRules: {
                    operationRemarks: [{required: true, validator: validateRequire, label: '删除备注'}],
                },
                exportRules: {
                    monthGTE: [{required: true, validator: validateRequire, label: '实发月份开始'}],
                    monthLTE: [{required: true, validator: validateRequire, label: '实发月份结束'}],
                },
                taskType: undefined,
                confirmLogId:'',
                exportMonth:'',

            }
        },
        computed: {
            ...mapGetters({
                permissions: 'permissions',
            })
        },
        mounted() {
            get('/api/sysmgr-web/commom/company', {
                companyIdentity: 'custom'
            }).then(data => {
                this.companys = data
            });
            get('/api/sysmgr-web/commom/company', {
                companyIdentity: 'service'
            }).then(data => {
                this.serviceCompanyIds = data
            });
            get('/api/contract-web/agent-contract/agent-company-option?sign=true').then(data => {
                this.agentList = data
            })
        },
        methods: {
            search() {
                this.currentChangeBySetting = true;
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            },
            clear() {
                this.createDateValue = '';
                this.updateDateValue = '';
                this.formSearch = {
                    salesmanLK: '',
                    groupIdLK: '',
                    customerCompanyIdEQ: '',
                    serviceCompanyIdEQ: '',
                    agentCompanyIdEQ: '',
                    monthGTE: '',
                    monthLTE: ''
                };
            },
            handleSizeChange(value) {
                this.pageSize = value;
                this.currentPage = 1;
                this.requestAction({page: this.currentPage, pageSize: value,});
            },
            handleCurrentChange(value) {
                this.currentPage = value;
                if (this.currentChangeBySetting) {
                    this.currentChangeBySetting = false;
                    return;
                }
                this.requestAction({
                    page: value,
                    pageSize: this.pageSize,
                });
            },
            requestAction(pageInfo) {
                this.formSearch.page = pageInfo.page;
                this.formSearch.pageSize = pageInfo.pageSize;
                get('/api/accounting/costs-customer-company/list', this.formSearch).then(data => {
                    this.flowTableList = data;
                })
            },
            doExport() {
                this.$refs['exportPostForm'].validate(valid => {
                    if (valid) {
                        this.createExportDialogVisible = false;
                        window.open(`/api/accounting/costs-customer-company/export?monthGTE=` + this.exportPostForm.monthGTE +
                            '&monthLTE=' + this.exportPostForm.monthLTE);
                    }
                })

            },
            resetExportForm() {
                this.exportPostForm = {
                    monthGTE: '',
                    monthLTE: '',
                };
            },
            batchExportClick() {
                this.createExportDialogVisible = true;
            },
            closeExportDialog() {
                this.resetExportForm();
            }
        },
        created: function () {
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
        },
    }
</script>

<style lang="scss" scoped>
</style>
