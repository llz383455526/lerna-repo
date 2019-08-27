<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0 30px 30px;">客户应收对账单列表</div>

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

            <el-form-item label="实发月份:" size="small">
                <el-date-picker v-model="formSearch.monthGTE" type="month" placeholder="开始月份" value-format="yyyy-MM"></el-date-picker>
                至
                <el-date-picker v-model="formSearch.monthLTE" type="month" placeholder="结束月份" value-format="yyyy-MM"></el-date-picker>
            </el-form-item>

            <el-form-item label="是否有应收:" size="small">
                <el-select style="width: 150px" v-model="formSearch.hasReceivablesEQ" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in hasReceivablesOptions" :label="item.text" :value="item.value"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="状态:" size="small">
                <el-select style="width: 150px" v-model="formSearch.statusEQ" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in StatusOptions" :label="item.text" :value="item.value"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="任务ID:" size="small">
                <el-input style="width: 150px" v-model="formSearch.refIdEQ" placeholder="任务ID"></el-input>
            </el-form-item>

						<el-form-item label="对账单编号:" size="small">
							<el-input style="width: 150px" v-model="formSearch.idEQ" placeholder="对账单编号"></el-input>
						</el-form-item>

            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
                <el-button size="small" @click="batchExportClick">导出EXCEL</el-button>
                <el-button size="small" @click="batchSignClick" v-if="checkRight(permissions, 'accounting:/receivables-order/sign')" >批量签发</el-button>
                <el-button size="small" @click="batchConfirmClick" v-if="checkRight(permissions, 'accounting:/receivables-order/confirm')">批量确认</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="flowTableList.list" style="width: 100%;margin-top: 20px;" max-height="600" border>
            <el-table-column prop="customerCompanyName" label="客户名称" width="200" fixed></el-table-column>
            <el-table-column prop="serviceCompanyName" label="服务公司" width="200" fixed></el-table-column>
            <el-table-column prop="salesmanName" label="关联销售" width="120"></el-table-column>
            <el-table-column prop="deliveryPersonName" label="关联交付" width="120"></el-table-column>
            <el-table-column prop="id" label="对账单编号" width="120"></el-table-column>
            <el-table-column prop="month" label="实发月份" width="120"></el-table-column>
            <el-table-column prop="status" label="状态" width="120" :formatter="stateNameFormatter"></el-table-column>

            <el-table-column prop="amount" label="应收绩效费总金额(A)" width="120"></el-table-column>
            <el-table-column prop="serviceFeeDescription" label="管理费结算公式" width="120"></el-table-column>
            <el-table-column prop="personStepAmount" label="管理费阶梯" width="120"></el-table-column>
            <el-table-column prop="gtAmount" label="高于阶梯发放金额（B）" width="120"></el-table-column>
            <el-table-column prop="gtServiceFeeRate" label="管理费比例(C)" width="120"></el-table-column>
            <el-table-column prop="lteAmount" label="本期低于阶梯发放金额(D)" width="120"></el-table-column>
            <el-table-column prop="lteServiceFeeRate" label="管理费比例(E)" width="120"></el-table-column>
            <el-table-column prop="serviceFeeAmount" label="本期应收管理费F=B*C+D*E)" width="120"></el-table-column>
            <el-table-column prop="kpAmount" label="服务费（绩效+管理费金额）(G=A+F)" width="120"></el-table-column>
            <el-table-column prop="rechargedAmount" label="本期到账绩效费（H）" width="120"></el-table-column>
            <el-table-column prop="startServiceFeeBalanceAmount" label="应收期初余额（I）" width="120"></el-table-column>
            <el-table-column prop="prepayServiceFeeAmount" label="本期发放对应已收当期管理费（M）= 当月实发*预收比例" width="120"></el-table-column>
            <el-table-column prop="notSettledServiceFeeAmount" label="本期未结管理费费（N=F-M-O）" width="120"></el-table-column>
            <el-table-column prop="endServiceFeeBalanceAmount" label="应收期末余额（L=I+N-S）" width="120"></el-table-column>

						<el-table-column prop="rechargeTotalAmount" label="本期充值总金额（R=H+S+T）" width="120"></el-table-column>
						<el-table-column prop="earlyRechargedServiceFeeAmount" label="本期收到前期服务费回款（S）" width="120"></el-table-column>
						<el-table-column prop="rechargedServiceFeeAmount" label="本期收到本期服务费回款（T）" width="120"></el-table-column>
						<el-table-column prop="prepayServiceFeeDescription" label="预收服务费比例（P）" width="120"></el-table-column>
						<el-table-column prop="serviceFeePreRechargeAmount" label="预收服务费欠费（负数）或多充（正数）（O）" width="120"></el-table-column>

						<el-table-column prop="refId" label="任务ID" width="180"></el-table-column>
            <el-table-column prop="refRemarks" label="任务说明" width="120"></el-table-column>
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
            <!--<el-table-column prop="remarks" label="说明" min-width="180"></el-table-column>-->
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.status === 'Signed' && checkRight(permissions, 'accounting:/receivables-order/reject')">
                        <el-button @click="rejectClick(scope.row)" type="text" size="small">驳回</el-button>
                    </span>
                    <span v-else-if="(scope.row.status === 'Ready' || scope.row.status === 'Rejected') && checkRight(permissions, 'accounting:/receivables-order/delete')">
                        <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <ayg-pagination v-if="flowTableList.total" :total="flowTableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>

        <el-dialog title="签发对账单" :visible.sync="createSignDialogVisible" width="40%" @close="closeSignDialog">
            <el-form class="small-space" :rules="signRules" :model="createSignPostForm" ref="createSignPostForm" label-position="left"
                     label-width="110px" style='margin-left:20px;margin-right: 20px'>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="实发月份" prop="month" required>
                            <el-date-picker
                                    v-model="createSignPostForm.month"
                                    type="month"
                                    value-format="yyyy-MM"
                                    placeholder="实发月份" style="width: 180px;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="备注:" size="small" prop="operationRemarks">
                            <el-input type="textarea" :rows="3" style="width: 200px" v-model="createSignPostForm.operationRemarks" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createSignDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doBatchSign">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="确认对账单" :visible.sync="createConfirmDialogVisible" width="40%" @close="closeConfirmDialog">
            <el-form class="small-space" :rules="signRules" :model="confirmPostForm" ref="confirmPostForm" label-position="left"
                     label-width="110px" style='margin-left:20px;margin-right: 20px'>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="实发月份" prop="month" required>
                            <el-date-picker
                                v-model="confirmPostForm.month"
                                type="month"
                                value-format="yyyy-MM"
                                placeholder="实发月份" style="width: 180px;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="备注:" size="small" prop="operationRemarks">
                            <el-input type="textarea" :rows="3" style="width: 200px" v-model="confirmPostForm.operationRemarks" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createConfirmDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doBatchConfirm">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="驳回对账单" :visible.sync="createRejectDialogVisible" width="40%" @close="closeRejectDialog">
            <el-form class="small-space" :rules="rejectRules" :model="rejectPostForm" ref="rejectPostForm" label-position="left"
                     label-width="110px" style='margin-left:20px;margin-right: 20px'>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="备注:" size="small" prop="operationRemarks" required>
                            <el-input type="textarea" :rows="3" style="width: 200px" v-model="rejectPostForm.operationRemarks" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createRejectDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doReject">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="删除对账单" :visible.sync="createDeleteDialogVisible" width="40%" @close="closeDeleteDialog">
            <el-form class="small-space" :rules="deleteRules" :model="deletePostForm" ref="deletePostForm" label-position="left"
                     label-width="110px" style='margin-left:20px;margin-right: 20px'>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="备注:" size="small" prop="operationRemarks" required>
                            <el-input type="textarea" :rows="3" style="width: 200px" v-model="deletePostForm.operationRemarks" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createDeleteDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doDelete">确定</el-button>
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
                    idEQ: '',
										refIdEQ: '',
                    hasReceivablesEQ: '',
                    customerCompanyIdEQ: '',
                    serviceCompanyIdEQ: '',
                    statusEQ: '',
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
                    {'value': 'Rejected', 'text': '已驳回'}
                    // {'value': 'Deleted', 'text': '已删除'}
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
									  idEQ: '',
                    refIdEQ: '',
                    hasReceivablesEQ: '',
                    customerCompanyIdEQ: '',
                    serviceCompanyIdEQ: '',
                    statusEQ: '',
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
                get('/api/accounting/receivables-order/list', this.formSearch).then(data => {
                    this.flowTableList = data;
                })
            },
            rejectClick(row) {
                this.createRejectDialogVisible = true;
                this.confirmLogId = row.confirmLogId;
            },
            deleteClick(row) {
                this.createDeleteDialogVisible = true;
                this.confirmLogId = row.confirmLogId;
            },
            doBatchSign() {
                this.$refs['createSignPostForm'].validate(valid => {
                    if (valid) {
                        post('/api/accounting/receivables-order/sign', this.createSignPostForm).then(data => {
                            showNotify('success', '操作成功!');
                            this.resetSignForm();
                            this.createSignDialogVisible = false;
                            this.requestAction({
                                page: 1,
                                pageSize: this.pageSize,
                            });
                        });
                    }
                })
            },
            doBatchConfirm() {
                this.$refs['confirmPostForm'].validate(valid => {
                    if (valid) {
                        post('/api/accounting/receivables-order/confirm', this.confirmPostForm).then(data => {
                            showNotify('success', '操作成功!');
                            this.resetConfirmForm();
                            this.createConfirmDialogVisible = false;
                            this.requestAction({
                                page: 1,
                                pageSize: this.pageSize,
                            });
                        });
                    }
                })
            },
            doDelete() {
                this.deletePostForm.confirmLogId = this.confirmLogId;
                this.$refs['deletePostForm'].validate(valid => {
                    if (valid) {
                        post('/api/accounting/receivables-order/delete', this.deletePostForm).then(data => {
                            showNotify('success', '操作成功!');
                            this.resetDeleteForm();
                            this.createDeleteDialogVisible = false;
                            this.requestAction({
                                page: 1,
                                pageSize: this.pageSize,
                            });
                        });
                    }
                })
            },
            doReject() {
                this.rejectPostForm.confirmLogId = this.confirmLogId;
                this.$refs['rejectPostForm'].validate(valid => {
                    if (valid) {
                        post('/api/accounting/receivables-order/reject', this.rejectPostForm).then(data => {
                            showNotify('success', '操作成功!');
                            this.resetRejectForm();
                            this.createRejectDialogVisible = false;
                            this.requestAction({
                                page: 1,
                                pageSize: this.pageSize,
                            });
                        });
                    }
                })
            },
            doExport() {
                let param = Object.keys(this.formSearch).map(key => key + '=' + this.formSearch[key]).join('&');
                window.open(`/api/accounting/receivables-order/export?` + param);

            },
            resetSignForm() {
                this.createSignPostForm = {
                    operationRemarks: '',
                    month: ''
                };
            },
            resetConfirmForm() {
                this.confirmPostForm = {
                    operationRemarks: '',
                    month: ''
                };
            },
            resetDeleteForm() {
                this.deletePostForm = {
                    operationRemarks: '',
                    confirmLogId:''
                };
            },
            resetExportForm() {
                this.exportPostForm = {
                    monthGTE: '',
                    monthLTE: '',
                };
            },
            resetRejectForm() {
                this.rejectPostForm = {
                    operationRemarks: '',
                    confirmLogId:''
                };
            },
            batchSignClick() {
                this.createSignDialogVisible = true;
            },
            batchConfirmClick() {
                this.createConfirmDialogVisible = true;
            },
            batchExportClick() {
                this.doExport();
            },
            //重置dialogue数据
            closeSignDialog() {
                this.resetSignForm();
            },
            closeConfirmDialog() {
                this.resetConfirmForm();
            },
            closeDeleteDialog() {
                this.resetDeleteForm();
            },
            closeRejectDialog() {
                this.resetRejectForm();
            },
            closeExportDialog() {
                this.resetExportForm();
            },
            stateNameFormatter(row, column) {
                return this.StatusOptions.filter(function (state) {
                    return state.value === row.status
                })[0].text
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
