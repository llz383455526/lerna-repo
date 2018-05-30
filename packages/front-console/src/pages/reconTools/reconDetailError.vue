<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin-top: 10px">
            <el-form :inline="true" :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
                <el-form-item label="收款人姓名:" size="small">
                    <el-input style="width: 150px" v-model="formSearch.toAccountNameLK" placeholder="收款人姓名"></el-input>
                </el-form-item>
                <el-form-item label="收款账号:" size="small">
                    <el-input style="width: 150px" v-model="formSearch.toAccountNoLK" placeholder="收款账号">
                    </el-input>
                </el-form-item>
                <el-form-item style="margin-top: -4px">
                    <el-button type="primary" @click="search" size="small">查询</el-button>
                    <el-button size="small" @click="clear">清除</el-button>
                    <!--<el-button size="small" @click="exportXls">导出xls</el-button>-->
                </el-form-item>
            </el-form>

            <el-table :data="flowTableList.list" style="width: 100%;margin-top: 20px;">
                <el-table-column prop="reconType" label="对账类型" width="80" fixed></el-table-column>
                <el-table-column prop="thirdOrderNo" label="流水号" width="120"></el-table-column>

                <el-table-column prop="thirdSubmitTime" label="提交时间" width="120"></el-table-column>
                <el-table-column prop="thirdTrxTime" label="入账时间" width="120"></el-table-column>

                <el-table-column prop="toAccountName" label="收款单位名称" width="120"></el-table-column>
                <el-table-column prop="toAccountNo" label="收款账号" width="120"></el-table-column>
                <el-table-column prop="appOrderAmount" label="业务发放金额" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.appOrderAmount | formatMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="thirdOrderAmount" label="渠道发放金额" width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.thirdOrderAmount | formatMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="errorType" label="对账结果" width="90"></el-table-column>
                <el-table-column prop="thirdStatus" label="入账状态（渠道）" width="140"></el-table-column>
                <el-table-column prop="remarks" label="通知备注"></el-table-column>
                <!--<el-table-column prop="reconStartTime" label="对账时间" width="160">-->
                <!--<template slot-scope="scope">-->
                <!--<span>{{scope.row.reconStartTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>-->
                <!--</template>-->
                <!--</el-table-column>-->

                <el-table-column
                        fixed="right"
                        label="操作"
                        width="100" v-if="errorDetailType === '1'">
                    <template slot-scope="scope">
                        <el-button @click="handleReconDetail(scope.row)" type="text" size="small">平账</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <ayg-pagination v-if="flowTableList.total" :total="flowTableList.total"
                            v-on:handleSizeChange="handleSizeChange"
                            v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>

        </div>

        <el-dialog title="平账" :visible.sync="reconDialogVisible" width="880px">
            <el-form class="small-space" :rules="rules" :model="reconPostForm" ref="reconPostForm" label-position="left"
                     label-width="180px" style='margin-left:20px;margin-right: 20px'>

                <el-row :gutter="20">
                    <!--<el-col :span="12">-->
                        <!--<el-form-item label="客户订单号" prop="appOrderNo" >-->
                            <!--<el-input v-model="reconPostForm.appOrderNo" placeholder="客户订单号" style="width: 180px" ></el-input>-->
                        <!--</el-form-item>-->
                    <!--</el-col>-->
                    <el-col :span="24">
                        <el-form-item label="渠道交易流水号" prop="thirdOrderNo" >
                            <el-input v-model="reconPostForm.thirdOrderNo" placeholder="渠道交易流水号" style="width: 180px" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="请求发放时间" prop="thirdSubmitTime" >
                            <!--<el-input v-model="reconPostForm.thirdSubmitTime" placeholder="请求发放时间" style="width: 180px" ></el-input>-->
                            <el-date-picker
                                    v-model="reconPostForm.thirdSubmitTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="请求发放时间" style="width: 180px;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="成功发放时间" prop="thirdTrxTime" >
                            <!--<el-input v-model="reconPostForm.thirdTrxTime" placeholder="成功发放时间" style="width: 180px" ></el-input>-->
                            <el-date-picker
                                    v-model="reconPostForm.thirdTrxTime"
                                    type="datetime"
                                    value-format="yyyy-MM-dd HH:mm:ss"
                                    placeholder="成功发放时间" style="width: 180px;">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="收款人姓名" prop="toAccountName" >
                            <el-input v-model="reconPostForm.toAccountName" placeholder="收款人姓名" style="width: 180px" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="收款人账号" prop="toAccountNo" >
                            <el-input v-model="reconPostForm.toAccountNo" placeholder="收款人账号" style="width: 180px" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="业务发放金额" prop="appOrderAmount" >
                            <el-input v-model="reconPostForm.appOrderAmount" placeholder="业务发放金额" style="width: 180px" ></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="渠道发放金额" prop="thirdOrderAmount" >
                            <el-input v-model="reconPostForm.thirdOrderAmount" placeholder="渠道发放金额" style="width: 180px" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="备注" prop="remarks" >
                            <el-input v-model="reconPostForm.remarks" placeholder="备注" style="width: 180px" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <!--<el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="对账结果:" size="small" prop="errorType" >
                            <el-select style="width: 180px" v-model="reconPostForm.errorType" placeholder="请选择">
                                <el-option v-for="(item, index) in errorTypeOptions" :label="item.text" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="交易状态:" size="small" prop="thirdStatus" >
                            <el-select style="width: 180px" v-model="reconPostForm.thirdStatus" placeholder="请选择">
                                <el-option v-for="(item, index) in orderStatusOptions" :label="item.text" :value="item.value" :key="index"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="reconDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="handleBalance" >确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {showConfirm} from '../../plugin/utils-message'
    import {formatTime} from '../../plugin/utils-functions'
    import {baseUrl} from '../../config/address'
    import {showNotify} from "../../plugin/utils-notify";
    import {get, post, formPost} from "../../store/api";
    import fileUploader from '../../component/fileUploader'

    export default {
        components: {
            fileUploader
        },
        // props: {
        //     errorDetailType: {
        //         default: '1'
        //     }
        // },
        props: ['errorDetailType'],
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
                    reconBatchIdEQ: undefined,
                    thirdStatusEQ: '',
                    thirdStatusNEQ: '',
                    toAccountNameLK: '',
                    toAccountNoLK: ''
                },
                dateValue: '',
                selectList2: [],
                flowTableList: [],
                reconBatchInfoList: [],
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
                taskIdToDelete: undefined,
                isApp:false,
                reconPostForm: {
                    appOrderNo: '',
                    thirdOrderNo: '',
                    thirdSubmitTime: '',
                    thirdTrxTime: '',
                    toAccountName: '',
                    toAccountNo: '',
                    appOrderAmount: '',
                    thirdOrderAmount: '',
                    errorType: '',
                    thirdStatus: '',
                    batchId: undefined,
                    remarks:'',
                    id:undefined
                },
                rules: {
                    // appOrderNo: [{ required: true, validator: validateRequire, label: '客户订单号' }],
                    thirdOrderNo: [{ required: true, validator: validateRequire, label: '渠道交易流水号' }],
                    thirdSubmitTime: [{ required: true, validator: validateRequire, label: '请求发放时间' }],
                    thirdTrxTime: [{ required: true, validator: validateRequire, label: '成功发放时间' }],
                    toAccountName: [{ required: true, validator: validateRequire, label: '收款人姓名' }],
                    toAccountNo: [{ required: true, validator: validateRequire, label: '收款人账号' }],
                    appOrderAmount: [{ required: true, validator: validateRequire, label: '业务发放金额' }],
                    thirdOrderAmount: [{ required: true, validator: validateRequire, label: '渠道发放金额' }],
                },
                batchId: undefined,
                errorTypeOptions: [],
                orderStatusOptions: [],
            }
        },
        computed: {
            ...mapGetters({
                // flowTableList: 'flowTableList',
                customNameList: 'customNameList',
                moneyFlow: 'moneyFlow'
            })
        },
        watch: {
            'errorDetailType': function(n, o) {
                if (n !== o) {
                    this.requestAction({
                        page: 1,
                        pageSize: this.pageSize,
                    });
                }
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
                    thirdStatusEQ: '',
                    thirdStatusNEQ: '',
                    toAccountNameLK: '',
                    toAccountNoLK: ''
                };
            },
            exportXls() {
                let billDateGTE = '';
                let billDateLTE = '';
                if (this.dateValue) {
                    billDateGTE = formatTime(this.dateValue[0], 'yyyyMMdd');
                    billDateLTE = formatTime(this.dateValue[1], 'yyyyMMdd');
                }
                window.location.href = baseUrl + '/pay-order/export-item?billDateGTE=' + billDateGTE
                    + '&billDateLTE=' + billDateLTE
                    + "&channelCodeEQ=" + this.formSearch.channelCodeEQ;
            },
            handleSizeChange(value) {                this.pageSize = value;                this.currentPage = 1;                this.requestAction({                    pageNo: this.currentPage,                    pageSize: value,                });            },
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
                if (this.errorDetailType === '1') {
                    this.formSearch.thirdStatusNEQ = 'FAILED';
                    this.formSearch.thirdStatusEQ = '';
                } else {
                    this.formSearch.thirdStatusEQ = 'FAILED';
                    this.formSearch.thirdStatusNEQ = '';
                }
                this.formSearch.reconBatchIdEQ = this.batchId;
                get('/api/recon/tools/recon-batch-details', this.formSearch).then(data => {
                    this.flowTableList = data;
                });
            },
            getReconBatchInfo() {
                var param = {idEQ: this.batchId}
                get('/api/recon/tools/recon-batches', param).then(data => {
                    this.reconBatchInfoList = data;
                })
            },
            handleReconDetail(row) {
                get('/api/recon/tools/error-detail/' + row.id).then(data => {
                    this.reconPostForm = data;
                    this.reconDialogVisible = true;
                })
            },
            handleBalance() {
                let url = '/api/recon/tools/do-balance';
                this.$refs['reconPostForm'].validate(valid => {
                    if (valid) {
                        post(url, this.reconPostForm).then(data => {
                            console.log(data)
                            showNotify('success', '操作成功!');
                            this.resetReconPostForm();
                            this.reconDialogVisible = false;
                            this.requestAction({
                                page: 1,
                                pageSize: this.pageSize,
                            });
                        });
                    }
                })
            },
            resetReconPostForm() {
                this.reconPostForm = {
                    appOrderNo: '',
                    thirdOrderNo: '',
                    thirdSubmitTime: '',
                    thirdTrxTime: '',
                    toAccountName: '',
                    toAccountNo: '',
                    appOrderAmount: '',
                    thirdOrderAmount: '',
                    errorType: '',
                    thirdStatus: '',
                    batchId: undefined,
                    remarks:'',
                    id:undefined
                }
            },
            resetReconParam() {
                this.reconParam = {
                    id: null,
                    channelCode: '',
                    billDate: ''
                }
            },
            getOfflineChannels() {
                get('/api/recon/tools/offline-channels').then(data => {
                    this.selectList2 = data;
                })
            },
            getErrorTypeOptions() {
                get('/api/recon/tools/recon-error-types').then(data => {
                    this.errorTypeOptions = data;
                })
            },
            getOrderStatusOptions() {
                get('/api/recon/tools/order-status').then(data => {
                    this.orderStatusOptions = data;
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
            }
        },
        created: function () {
            this.uploadUrl = baseUrl + "/file/upload";
            this.batchId = this.$route.query.batchId;
            this.formSearch.reconBatchIdEQ = this.batchId;
            // console.log('batchId: ' + this.formSearch.reconBatchIdEQ)
            this.requestAction({
                page: 1,
                pageSize: this.pageSize,
            });
            // this.$store.dispatch('getCustomNameList');
            this.getOfflineChannels();
            // this.getErrorTypeOptions();
            // this.getOrderStatusOptions();
        },
    }
</script>

<style lang="scss" scoped>
</style>
<style>
    .clearfix:before,
    .clearfix:after {
        display: table;
        content: "";
    }
    .clearfix:after {
        clear: both
    }

    /*.box-card {*/
        /*width: 480px;*/
    /*}*/
</style>
