<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0 30px 30px;">人工对账</div>

        <el-form :inline="true" :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="发放渠道:" size="small">
                <el-select style="width: 150px" v-model="formSearch.channelCodeEQ" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in selectList2" :label="item.text" :value="item.value"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提交日期:" size="small">
                <el-date-picker v-model="dateValue" type="daterange" start-placeholder="开始日期"
                                end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item label="客户名称:" size="small">
                <el-input style="width: 150px" v-model="formSearch.payerAppNameLK" placeholder="客户名称"></el-input>
            </el-form-item>
            <el-form-item label="对账状态:" size="small">
                <el-select style="width: 150px" v-model="formSearch.comparedStatusEQ" placeholder="请选择">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in comparedStatusOptions" :label="item.text" :value="item.value"
                               :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
                <el-button size="small" @click="startRecon">发起对账</el-button>
            </el-form-item>
        </el-form>

        <el-table :data="flowTableList.list" style="width: 100%;margin-top: 20px;">
            <!--<el-table-column prop="batchNo" label="对账批次号" width="140" fixed></el-table-column>-->
            <el-table-column prop="billDate" label="提交日期" width="90" fixed></el-table-column>
            <!--<el-table-column prop="billDate" label="对账日期" width="120"></el-table-column>-->
            <el-table-column prop="channelCodeName" label="发放渠道" width="80"></el-table-column>
            <el-table-column prop="payerAppName" label="客户名称"></el-table-column>
            <!--<el-table-column prop="fromAccountNo" label="发放账号" width="80"></el-table-column>-->
            <el-table-column prop="status" label="对账进度" width="80"></el-table-column>
            <el-table-column prop="appAmount" label="业务发放金额" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.appAmount | formatMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="thirdAmount" label="渠道发放金额" width="120">
                <template slot-scope="scope">
                    <span>{{scope.row.thirdAmount | formatMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="appCount" label="业务发放笔数" width="110"></el-table-column>
            <el-table-column prop="thirdCount" label="渠道发放笔数" width="110"></el-table-column>
            <el-table-column prop="comparedStatus" label="对账状态" width="80">
                <template slot-scope="scope">
                    <span style="color: red;"
                          v-if="scope.row.comparedStatus === '不一致'">{{scope.row.comparedStatus}}</span>
                    <span v-else>{{scope.row.comparedStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="errorAmount" label="差异金额" width="120">
                <template slot-scope="scope">
                    <span style="color: red;"
                          v-if="scope.row.errorAmount > 0">{{scope.row.errorAmount | formatMoney}}</span>
                    <span v-else>{{scope.row.errorAmount | formatMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="errorCount" label="差异数量" width="80">
                <template slot-scope="scope">
                    <span style="color: red;" v-if="scope.row.errorCount > 0">{{scope.row.errorCount}}</span>
                    <span v-else>{{scope.row.errorCount}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="reconType" label="对账类型" width="80"></el-table-column>

            <!--<el-table-column prop="reconStartTime" label="对账发起" width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.reconStartTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="reconEndTime" label="对账完成" width="160">
                <template slot-scope="scope">
                    <span>{{scope.row.reconEndTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>-->
            <el-table-column
                    fixed="right"
                    label="操作"
                    width="100">
                <template slot-scope="scope">
                    <el-button @click="handleReconDetail(scope.row)" type="text" size="small">查看</el-button>
                </template>
            </el-table-column>
        </el-table>

        <ayg-pagination v-if="flowTableList.total" :total="flowTableList.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>

        <el-dialog title="人工对账" :visible.sync="reconDialogVisible" width="60%" @close="closeReconDialog">
            <el-form class="small-space" :rules="rules" :model="reconPostForm" ref="reconPostForm" label-position="left"
                     label-width="110px" style='margin-left:20px;margin-right: 20px'>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="发放渠道:" size="small" prop="channelCode" required>
                            <el-select style="width: 180px" v-model="reconPostForm.channelCode" placeholder="请选择">
                                <el-option label="请选择" value=""></el-option>
                                <el-option v-for="(item, index) in selectList2" :label="item.text" :value="item.value"
                                           :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="客户公司名称" prop="payerAppName" required>
                            <el-input v-model="reconPostForm.payerAppName" placeholder="客户公司名称"
                                      style="width: 180px"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="24">
                        <el-form-item label="提交日期" prop="billDate" required>
                            <el-date-picker
                                    v-model="reconPostForm.billDate"
                                    type="date"
                                    value-format="yyyyMMdd"
                                    placeholder="提交日期" style="width: 180px;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span style="font-size: 14px">业务方对账文件</span>
                            </div>
                            <file-upload :sourceId="sourceId" :channelCode="reconPostForm.channelCode"
                                         taskType="App" :uploadUrl="uploadUrl"
                                         v-on:handleDelete="handleDelete"
                                         v-on:addToUploadedFileList="addToUploadedFileList"
                                         ref="appFileUpload"></file-upload>
                        </el-card>
                    </el-col>

                    <el-col :span="12">
                        <el-card class="box-card">
                            <div slot="header" class="clearfix">
                                <span style="font-size: 14px">第三方对账文件</span>
                            </div>
                            <file-upload :sourceId="sourceId" :channelCode="reconPostForm.channelCode"
                                         taskType="Third" :uploadUrl="uploadUrl"
                                         v-on:handleDelete="handleDelete"
                                         v-on:addToUploadedFileList="addToUploadedFileList"
                                         ref="thirdFileUpload"></file-upload>
                        </el-card>
                    </el-col>
                </el-row>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="reconDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doRecon" icon="el-icon-d-arrow-right">开始对账</el-button>
            </div>
        </el-dialog>

        <el-dialog :visible.sync="dialogVisible" width="30%">
            <span>确认删除该对账文件吗？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="doDelete">确 定</el-button>
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
                    channelCodeEQ: '',
                    payerAppNameLK: '',
                    comparedStatusEQ: ''
                },
                dateValue: '',
                selectList2: [],
                comparedStatusOptions: [{'value': 'EQ', 'text': '一致'}, {'value': 'NEQ', 'text': '不一致'}],
                flowTableList: [],
                dialogVisible: false,
                reconDialogVisible: false,
                reconParam: {
                    id: null,
                    channelCode: '',
                    billDate: ''
                },
                uploadUrl: '',
                fileList1: [],
                fileList2: [],
                referArr1: [],
                referArr2: [],
                formData1: '',
                formData2: '',
                sourceId: undefined,
                channelCode: undefined,
                // taskIdToDelete: undefined,
                // taskIdDeleted: undefined,
                rowToDelete: undefined,
                isApp: false,
                reconPostForm: {
                    channelCode: '',
                    payerAppName: '',
                    billDate: '',
                    batchId: undefined
                },
                rules: {
                    channelCode: [{required: true, validator: validateRequire, label: '发放渠道'}],
                    payerAppName: [{required: true, validator: validateRequire, label: '客户公司名称'}],
                    billDate: [{required: true, validator: validateRequire, label: '提交日期'}],
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
                this.dateValue = '';
                this.formSearch = {
                    channelCodeEQ: '',
                    payerAppNameLK: '',
                    comparedStatusEQ: ''
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
                let billDate = this.getBillDate();
                this.formSearch.pageNumber = pageInfo.page;
                this.formSearch.pageSize = pageInfo.pageSize;
                this.formSearch.billDateGTE = billDate.billDateGTE;
                this.formSearch.billDateLTE = billDate.billDateLTE;
                get('/api/recon/tools/recon-batches', this.formSearch).then(data => {
                    this.flowTableList = data;
                })
            },
            getBillDate() {
                let billDate = {
                    billDateGTE: '',
                    billDateLTE: ''
                }
                if (this.dateValue) {
                    billDate.billDateGTE = formatTime(this.dateValue[0], 'yyyyMMdd');
                    billDate.billDateLTE = formatTime(this.dateValue[1], 'yyyyMMdd');
                }
                return billDate;
            },
            handleReconDetail(row) {
                this.$router.push({
                    path: '/main/reconTools/reconDetail',
                    query: {batchId: row.id}
                });
            },
            doRecon() {
                // let url = '/api/recon/tools/do-recon';
                // let option = this.reconParam;
                this.reconPostForm.batchId = this.sourceId
                this.$refs['reconPostForm'].validate(valid => {
                    if (valid) {
                        if (!this.fileList1 || this.fileList1.length === 0) {
                            showNotify('error', '至少需要上传一个业务方的对账文件');
                            return;
                        }
                        if (!this.fileList2 || this.fileList2.length === 0) {
                            showNotify('error', '至少需要上传一个第三方的对账文件');
                            return;
                        }
                        post('/api/recon/tools/do-recon', this.reconPostForm).then(data => {
                            showNotify('success', '操作成功!');
                            this.resetReconPostForm();
                            this.reconDialogVisible = false;
                            this.requestAction({
                                page: 1,
                                pageSize: this.pageSize,
                            });
                            this.newReconBatchId()
                        });
                    }
                })
            },
            resetReconPostForm() {
                this.reconPostForm = {
                    channelCode: '',
                    payerAppName: '',
                    billDate: '',
                    batchId: undefined
                }
                this.fileList1 = [];
                this.fileList2 = [];
            },
            resetReconParam() {
                this.reconParam = {
                    id: null,
                    channelCode: '',
                    billDate: ''
                }
            },
            startRecon() {
                this.fileList1 = []
                this.fileList2 = []
                get('/api/recon/tools/recon-batch-id').then(data => {
                    this.sourceId = data;
                    this.reconDialogVisible = true;
                })
            },
            newReconBatchId() {
                get('/api/recon/tools/recon-batch-id').then(data => {
                    this.sourceId = data;
                })
            },
            getOfflineChannels() {
                get('/api/recon/tools/offline-channels').then(data => {
                    this.selectList2 = data;
                })
            },
            handleDelete(row) {
                this.dialogVisible = true;
                // this.taskIdToDelete = row.taskId;
                this.rowToDelete = row;
            },
            doDelete() {
                var tId = this.rowToDelete.taskId;
                if (tId) {
                    post('/api/recon/file/delete', {importTaskId: tId}).then(data => {
                        showNotify('success', '删除成功');
                        // this.taskIdDeleted = tId;

                        if (this.rowToDelete.taskType === 'App') {
                            this.$refs['appFileUpload'].removeFile(tId);
                            _.remove(this.fileList1, function (obj) {
                                return obj.taskId === tId;
                            })
                        }
                        if (this.rowToDelete.taskType === 'Third') {
                            this.$refs['thirdFileUpload'].removeFile(tId);
                            _.remove(this.fileList2, function (obj) {
                                return obj.taskId === tId;
                            })
                        }
                        this.dialogVisible = false;
                    });
                }
            },
            addToUploadedFileList(data) {
                if (data.taskType === 'App') {
                    this.fileList1.push(data);
                }
                if (data.taskType === 'Third') {
                    this.fileList2.push(data);
                }
            },
            //重置dialogue数据
            closeReconDialog() {
                this.$refs['appFileUpload'].removeAllFile();
                this.$refs['thirdFileUpload'].removeAllFile();
                this.resetReconPostForm();
            }
        },
        created: function () {
            this.uploadUrl = baseUrl + "/api/recon/file/upload";
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            this.getOfflineChannels();
        },
    }
</script>

<style lang="scss" scoped>
</style>
