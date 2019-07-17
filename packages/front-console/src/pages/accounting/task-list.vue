<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0 30px 30px;">结算任务列表</div>

        <el-form :inline="true" :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="结算任务名:" size="small">
                <el-select style="width: 150px" v-model="formSearch.taskTypeIdEQ" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in selectList2" :label="item.name" :value="item.id"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提交时间:" size="small">
                <el-date-picker v-model="createDateValue" type="daterange" start-placeholder="开始日期"
                                end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="完成时间:" size="small">
                <el-date-picker v-model="updateDateValue" type="daterange" start-placeholder="开始日期"
                                end-placeholder="结束日期"></el-date-picker>
            </el-form-item>

            <el-form-item label="任务状态:" size="small">
                <el-select style="width: 150px" v-model="formSearch.stateEQ" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in taskStateOptions" :label="item.text" :value="item.value"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="提交人:" size="small">
                <el-input style="width: 150px" v-model="formSearch.createByNameLK" placeholder="提交人"></el-input>
            </el-form-item>

            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
                <el-button size="small" @click="createTaskClick">新建任务</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="flowTableList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="id" label="任务ID" width="200" fixed></el-table-column>
            <el-table-column prop="taskTypeName" label="任务名称" width="200" fixed></el-table-column>
            <el-table-column label="任务时间范围" width="180" :formatter="taskPeriodFormatter"></el-table-column>
            <el-table-column prop="state" label="状态" width="120" :formatter="stateNameFormatter"></el-table-column>
            <el-table-column prop="createByName" label="提交人" width="120"></el-table-column>
            <el-table-column prop="createTime" label="提交时间" width="170">
                <template slot-scope="scope">
                    <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="updateTime" label="完成时间" width="170">
                <template slot-scope="scope">
                    <span>{{scope.row.updateTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="remarks" label="说明" min-width="180"></el-table-column>
            <!--<el-table-column prop="toEmail" label="邮件地址" min-width="180"></el-table-column>-->
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <span v-if="scope.row.state === 'PENDING' && scope.row.byManual === 1">
                        <el-button @click="cancelTask(scope.row)" type="text" size="small">取消</el-button>
                    </span>
                </template>
            </el-table-column>
        </el-table>

        <ayg-pagination v-if="flowTableList.total" :total="flowTableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>

        <el-dialog title="新建结算任务" :visible.sync="createTaskDialogVisible" width="60%" @close="closeCreateDialog">
            <el-form class="small-space" :rules="rules" :model="createTaskPostForm" ref="createTaskPostForm" label-position="left"
                     label-width="110px" style='margin-left:20px;margin-right: 20px'>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="结算任务名:" size="small" prop="taskTypeId" required>
                            <el-select style="width: 180px" v-model="createTaskPostForm.taskTypeId" placeholder="请选择" @change="taskTypeChange">
                                <el-option label="请选择" value=""></el-option>
                                <el-option v-for="(item, index) in selectList2" :label="item.name" :value="item.id"
                                           :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="结算开始月份" prop="startDate" required>
                            <el-date-picker
                                    v-model="createTaskPostForm.startDate"
                                    type="month"
                                    value-format="yyyy-MM"
                                    placeholder="提交日期" style="width: 180px;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="结算结束月份" prop="endDate" required>
                            <el-date-picker
                                v-model="createTaskPostForm.endDate"
                                type="month"
                                value-format="yyyy-MM"
                                placeholder="提交日期" style="width: 180px;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="备注:" size="small" prop="remarks" required>
                            <el-input style="width: 450px" v-model="createTaskPostForm.remarks" placeholder="备注"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="邮件地址:" size="small">
                            <el-input type="textarea" :rows="3" style="width: 450px" v-model="createTaskPostForm.toEmail" placeholder="邮件地址（多个地址逗号分开）"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="createTaskDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doCreateTask" icon="el-icon-d-arrow-right">保存</el-button>
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
                    taskTypeIdEQ: '',
                    createByNameLK: '',
                    stateEQ: ''
                },
                createDateValue: '',
                updateDateValue: '',
                selectList2: [],
                taskStateOptions: [
                    {'value': 'PENDING', 'text': '排队中'},
                    {'value': 'PROCESSING', 'text': '运行中'},
                    {'value': 'COMPLETED', 'text': '已完成'},
                    {'value': 'FAILED', 'text': '失败'},
                    {'value': 'CANCELED', 'text': '已取消'}
                    ],
                flowTableList: [],
                dialogVisible: false,
                createTaskDialogVisible: false,
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
                createTaskPostForm: {
                    taskTypeId: '',
                    startDate: '',
                    endDate: '',
                    remarks: '',
                    toEmail: '',
                    batchId: undefined
                },
                rules: {
                    taskTypeId: [{required: true, validator: validateRequire, label: '发放渠道'}],
                    startDate: [{required: true, validator: validateRequire, label: '结算开始月份'}],
                    endDate: [{required: true, validator: validateRequire, label: '结算结束月份'}],
                    remarks: [{required: true, validator: validateRequire, label: '结算说明'}],
                },
                taskType: undefined

            }
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
                    taskTypeIdEQ: '',
                    payerAppNameLK: '',
                    stateEQ: ''
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
                this.formSearch.createTimeGTE = formatTime(this.createDateValue[0], 'yyyy-MM-dd');
                this.formSearch.createTimeLTE = formatTime(this.createDateValue[1], 'yyyy-MM-dd');
                this.formSearch.updateTimeGTE = formatTime(this.updateDateValue[0], 'yyyy-MM-dd');
                this.formSearch.updateTimeLTE = formatTime(this.updateDateValue[1], 'yyyy-MM-dd');

                get('/api/accounting/task/task-list', this.formSearch).then(data => {
                    this.flowTableList = data;
                })
            },
            cancelTask(row) {
                this.$confirm('此操作将取消该任务，是否确认', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let deleteTaskForm = {'taskId': row.id}
                    post('/api/accounting/task/delete-task', deleteTaskForm).then(data => {
                        showNotify('success', '操作成功!');
                        this.resetCreatePostForm();
                        this.createTaskDialogVisible = false;
                        this.requestAction({
                            page: 1,
                            pageSize: this.pageSize,
                        });
                    });

                }).catch(() => {
                    showNotify('info', '已取消删除')
                })
            },
            doCreateTask() {
                this.createTaskPostForm.batchId = this.sourceId
                this.$refs['createTaskPostForm'].validate(valid => {
                    if (valid) {
                        post('/api/accounting/task/add-task', this.createTaskPostForm).then(data => {
                            showNotify('success', '操作成功!');
                            this.resetCreatePostForm();
                            this.createTaskDialogVisible = false;
                            this.requestAction({
                                page: 1,
                                pageSize: this.pageSize,
                            });
                        });
                    }
                })
            },
            resetCreatePostForm() {
                this.createTaskPostForm = {
                    taskTypeId: '',
                    startDate: '',
                    endDate: ''
                };
            },
            createTaskClick() {
                this.createTaskDialogVisible = true;
            },
            getTaskTypeList() {
                get('/api/accounting/task/task-type-list').then(data => {
                    this.selectList2 = data;
                })
            },
            //重置dialogue数据
            closeCreateDialog() {
                this.resetCreatePostForm();
            },
            stateNameFormatter(row, column) {
                return this.taskStateOptions.filter(function (state) {
                    return state.value === row.state
                })[0].text
            },
            taskPeriodFormatter(row, column) {
                return row.startDate === row.endDate ? row.startDate : row.startDate + '至' + row.endDate
            },
            taskTypeChange() {
                let taskTypeId = this.createTaskPostForm.taskTypeId;
                if (taskTypeId) {
                    var param = {taskTypeId: taskTypeId};
                    get('/api/accounting/task/task-type-email-addr', param, true).then(data => {
                        this.createTaskPostForm.toEmail = data;
                    });
                } else {
                    this.createTaskPostForm.toEmail = '';
                }
            }
        },
        created: function () {
            this.uploadUrl = baseUrl + "/api/recon/file/upload";
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.getTaskTypeList();
        },
    }
</script>

<style lang="scss" scoped>
</style>
