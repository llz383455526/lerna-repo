<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0 30px 30px;">客户未结服务费列表</div>

        <el-form :inline="true" :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="客户公司" prop="companyId">
                <el-select filterable style="width: 250px" v-model="formSearch.customerCompanyIdEQ">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="e in companys" :value="e.id" :label="e.name" :key="e.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务公司" prop="serviceCompanyId">
                <el-select filterable style="width: 250px" v-model="formSearch.serviceCompanyIdEQ">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="e in serviceCompanyIds" :value="e.id" :label="e.name" :key="e.id"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="所属月份:" size="small">
                <el-date-picker v-model="formSearch.monthBelongGTE" type="month" placeholder="开始月份" value-format="yyyy-MM"></el-date-picker>
                至
                <el-date-picker v-model="formSearch.monthBelongLTE" type="month" placeholder="结束月份" value-format="yyyy-MM"></el-date-picker>
            </el-form-item>

            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
                <el-button size="small" @click="addClick">添加</el-button>
                <el-button size="small" @click="batchExportClick">导出</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="flowTableList.list" style="width: 100%;margin-top: 20px;" max-height="600" border>
            <el-table-column prop="customerCompanyName" label="客户公司" width="200" fixed></el-table-column>
            <el-table-column prop="serviceCompanyName" label="服务公司" width="200" fixed></el-table-column>
            <el-table-column prop="monthBelong" label="所属月份" width="120"></el-table-column>
            <el-table-column prop="salesman" label="销售" width="120"></el-table-column>
            <el-table-column prop="amount" label="实发工资" width="120"></el-table-column>
            <el-table-column prop="notSettleServiceFeeAmount" label="当月未结算服务费" width="180"></el-table-column>
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
            <el-table-column prop="updateUserName" label="操作人员" min-width="180"></el-table-column>
            <el-table-column prop="remarks" label="说明" min-width="180"></el-table-column>
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="updateClick(scope.row)" type="text" size="small">编辑</el-button>
                    <el-button @click="deleteClick(scope.row)" type="text" size="small">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <ayg-pagination v-if="flowTableList.total" :total="flowTableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>

        <el-dialog title="新增客户未结服务费" :visible.sync="addDialogVisible" width="60%" @close="closeCreateDialog">
            <el-form class="small-space" :rules="addRules" :model="addPostForm" ref="addPostForm" label-position="left"
                     label-width="140px" style='margin-left:20px;margin-right: 20px'>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="所属月份" prop="month" required>
                            <el-date-picker
                                    v-model="addPostForm.month"
                                    type="month"
                                    value-format="yyyy-MM"
                                    placeholder="所属月份" style="width: 180px;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="客户公司" prop="customerCompanyId" required>
                            <el-select filterable v-model="addPostForm.customerCompanyId" style="width: 450px" >
                                <el-option label="所有" value=""></el-option>
                                <el-option v-for="e in companys" :value="e.id" :label="e.name" :key="e.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="服务公司" prop="serviceCompanyId" required>
                            <el-select filterable v-model="addPostForm.serviceCompanyId" style="width: 450px" >
                                <el-option label="所有" value=""></el-option>
                                <el-option v-for="e in serviceCompanyIds" :value="e.id" :label="e.name" :key="e.id"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="实发工资" prop="amount" required>
                            <el-input style="width: 450px" v-model="addPostForm.amount" placeholder="实发工资"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="当月未结服务费" prop="notSettleServiceFeeAmount" required>
                            <el-input style="width: 450px" v-model="addPostForm.notSettleServiceFeeAmount" placeholder="当月未结服务费"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="备注:" size="small" prop="remarks">
                            <el-input style="width: 450px" v-model="addPostForm.remarks" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doAdd">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog title="编辑客户未结服务费" :visible.sync="updateDialogVisible" width="60%" @close="closeUpdateDialog">
            <el-form class="small-space" :rules="updateRules" :model="updatePostForm" ref="updatePostForm" label-position="left"
                     label-width="140px" style='margin-left:20px;margin-right: 20px'>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="所属月份" prop="month">
                            <!--<el-date-picker
                                v-model="updatePostForm.month"
                                type="month"
                                value-format="yyyy-MM"
                                placeholder="所属月份" style="width: 180px;">
                            </el-date-picker>-->
                            <el-input style="width: 450px" v-model="updatePostForm.monthBelong" placeholder="所属月份" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="客户公司" prop="customerCompanyId">
                            <!--<el-select filterable v-model="updatePostForm.customerCompanyId">
                                <el-option label="所有" value=""></el-option>
                                <el-option v-for="e in companys" :value="e.id" :label="e.name" :key="e.id"></el-option>
                            </el-select>-->
                            <el-input style="width: 450px" v-model="updatePostForm.customerCompanyName" placeholder="客户公司" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="服务公司" prop="serviceCompanyId">
                            <!--<el-select filterable v-model="updatePostForm.serviceCompanyId">
                                <el-option label="所有" value=""></el-option>
                                <el-option v-for="e in serviceCompanyIds" :value="e.id" :label="e.name" :key="e.id"></el-option>
                            </el-select>-->
                            <el-input style="width: 450px" v-model="updatePostForm.serviceCompanyName" placeholder="服务公司" readonly></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="实发工资" prop="amount" required>
                            <el-input style="width: 450px" v-model="updatePostForm.amount" placeholder="实发工资"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="当月未结服务费" prop="notSettleServiceFeeAmount" required>
                            <el-input style="width: 450px" v-model="updatePostForm.notSettleServiceFeeAmount" placeholder="当月未结服务费"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="备注:" size="small" prop="remarks">
                            <el-input style="width: 450px" v-model="updatePostForm.remarks" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="updateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doUpdate">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    // import {mapGetters} from 'vuex'
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
            }
            return {
                pageSize: 10,
                currentPage: 1,
                currentChangeBySetting: false,
                formSearch: {
                    monthBelongGTE: '',
                    monthBelongLTE: '',
                    serviceCompanyIdEQ: '',
                    customerCompanyIdEQ: ''
                },
                selectList2: [],
                flowTableList: [],
                dialogVisible: false,
                addDialogVisible: false,
                updateDialogVisible: false,
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
                addPostForm: {
                    month: '',
                    customerCompanyId: '',
                    serviceCompanyId: '',
                    amount: '',
                    notSettleServiceFeeAmount: '',
                    remarks: ''
                },
                updatePostForm: {
                    id: '',
                    amount: '',
                    notSettleServiceFeeAmount: '',
                    remarks: ''
                },
                addRules: {
                    month: [{required: true, validator: validateRequire, label: '所属月份'}],
                    customerCompanyId: [{required: true, validator: validateRequire, label: '客户公司'}],
                    serviceCompanyId: [{required: true, validator: validateRequire, label: '服务公司'}],
                    amount: [{required: true, validator: validateRequire, label: '实发工资'}],
                    notSettleServiceFeeAmount: [{required: true, validator: validateRequire, label: '当月未结服务费'}]
                },
                updateRules: {
                    amount: [{required: true, validator: validateRequire, label: '实发工资'}],
                    notSettleServiceFeeAmount: [{required: true, validator: validateRequire, label: '当月未结服务费'}]
                },
                taskType: undefined,
							  companys:[],
							  serviceCompanyIds:[]

            }
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
                this.formSearch = {
                    monthBelongGTE: '',
                    monthBelongLTE: '',
                    serviceCompanyIdEQ: '',
                    customerCompanyIdEQ: ''
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
                this.formSearch.pageNumber = pageInfo.page;
                this.formSearch.pageSize = pageInfo.pageSize;

                get('/api/accounting/receivables/list', this.formSearch).then(data => {
                    this.flowTableList = data;
                })
            },
            deleteClick(row) {
                this.$confirm('此操作将删除该记录，是否确认', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let deleteTaskForm = {'id': row.id}
                    post('/api/accounting/receivables/delete', deleteTaskForm).then(data => {
                        showNotify('success', '操作成功!');
                        this.addDialogVisible = false;
                        this.requestAction({
                            page: 1,
                            pageSize: this.pageSize,
                        });
                    });

                }).catch(() => {
                    showNotify('info', '已取消删除')
                })
            },
            updateClick(row) {
                get('/api/accounting/receivables/detail', {
                    id: row.id
                }).then(data => {
                    this.updatePostForm = data;
                    this.updateDialogVisible = true;
                });
            },
            doAdd() {
                this.$refs['addPostForm'].validate(valid => {
                    if (valid) {
                        post('/api/accounting/receivables/add', this.addPostForm).then(data => {
                            showNotify('success', '操作成功!');
                            this.resetCreatePostForm();
                            this.addDialogVisible = false;
                            this.requestAction({
                                page: 1,
                                pageSize: this.pageSize,
                            });
                        });
                    }
                })
            },
            doUpdate() {
                this.$refs['updatePostForm'].validate(valid => {
                    if (valid) {
                        post('/api/accounting/receivables/update', this.updatePostForm).then(data => {
                            showNotify('success', '操作成功!');
                            this.resetUpdatePostForm();
                            this.updateDialogVisible = false;
                            this.requestAction({
                                page: 1,
                                pageSize: this.pageSize,
                            });
                        });
                    }
                })
            },
            resetCreatePostForm() {
                this.addPostForm = {
                    month: '',
                    customerCompanyId: '',
                    serviceCompanyId: '',
                    amount: '',
                    notSettleServiceFeeAmount: '',
                    remarks: ''
                };
            },
            resetUpdatePostForm() {
                this.updatePostForm = {
                    monthBelong: '',
                    customerCompanyId: '',
                    serviceCompanyId: '',
                    amount: '',
                    notSettleServiceFeeAmount: '',
                    remarks: ''
                };
            },
            addClick() {
                this.addDialogVisible = true;
            },
            //重置dialogue数据
            closeCreateDialog() {
                this.resetCreatePostForm();
            },
            closeUpdateDialog() {
                this.resetUpdatePostForm();
            },
            batchExportClick() {
                this.doExport();
            },
            doExport() {
                this.createExportDialogVisible = false;
                let param = Object.keys(this.formSearch).map(key => key + '=' + this.formSearch[key]).join('&');
                window.open(`/api/accounting/receivables/export?` + param);
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
