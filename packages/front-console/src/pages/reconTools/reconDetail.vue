<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0 30px 30px;">对账明细</div>

        <div>
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span style="font-size: 14px">对账结果信息</span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="exportXls">对账明细导出</el-button>
                </div>
                <div>
                    <!--<h5 class="ml50 mt50" style="margin: 0 30px 15px;">对账结果信息</h5>-->
                    <el-table :data="reconBatchInfoList.list" style="width: 100%;">
                        <!--<el-table-column prop="batchNo" label="对账批次号" width="140" fixed></el-table-column>-->
                        <el-table-column prop="billDate" label="提交日期" width="90" fixed></el-table-column>
                        <!--<el-table-column prop="billDate" label="对账日期" width="120"></el-table-column>-->
                        <el-table-column prop="channelCodeName" label="发放渠道" width="80"></el-table-column>
                        <el-table-column prop="payerAppName" label="商户名称"></el-table-column>
                        <el-table-column prop="status" label="对账进度" width="80"></el-table-column>
                        <!--<el-table-column prop="fromAccountNo" label="发放账号" width="80"></el-table-column>-->
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
                                <span style="color: red;" v-if="scope.row.comparedStatus === '不一致'">{{scope.row.comparedStatus}}</span>
                                <span v-else>{{scope.row.comparedStatus}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="errorAmount" label="差异金额" width="120">
                            <template slot-scope="scope">
                                <span style="color: red;" v-if="scope.row.errorAmount > 0">{{scope.row.errorAmount | formatMoney}}</span>
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

                        <el-table-column prop="reconStartTime" label="对账发起" width="165">
                            <template slot-scope="scope">
                                <span>{{scope.row.reconStartTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column prop="reconEndTime" label="对账完成" width="165">
                            <template slot-scope="scope">
                                <span>{{scope.row.reconEndTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-card>
        </div>

        <div style="margin-top: 50px">

            <el-tabs v-model="activeTabName" @tab-click="handleClickTabs">
                <el-tab-pane name="errorDetailType1">
                    <span slot="label">异常对账明细</span>
                </el-tab-pane>
                <el-tab-pane label="支付失败明细" name="errorDetailType2" >
                </el-tab-pane>
            </el-tabs>
            <recon-detail-error :errorDetailType="errorDetailType"></recon-detail-error>
        </div>

    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import {showConfirm} from '../../plugin/utils-message'
    import {formatTime} from '../../plugin/utils-functions'
    import {baseUrl} from '../../config/address'
    import {showNotify} from "../../plugin/utils-notify";
    import {get, post, formPost} from "../../store/api";
    // import fileUploader from '../../component/fileUploader'
    import reconDetailError from './reconDetailError'

    export default {
        components: {
            reconDetailError
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
                    reconBatchIdEQ: undefined
                },
                dateValue: '',
                selectList2: [],
                flowTableList: [],
                reconBatchInfoList: [],
                dialogVisible: false,
                reconDialogVisible: false,
                uploadUrl: '',
                sourceId: undefined,
                channelCode: undefined,
                taskIdToDelete: undefined,
                isApp:false,
                rules: {
                    channelCode: [{ required: true, validator: validateRequire, label: '发放渠道' }],
                    payerAppName: [{ required: true, validator: validateRequire, label: '客户公司名称' }],
                },
                batchId: undefined,
                errorDetailType: '1',
                activeTabName: 'errorDetailType1',
                activeTabNameText: '异常对账明细'

            }
        },
        computed: {
            ...mapGetters({
                // flowTableList: 'flowTableList',
                customNameList: 'customNameList',
                moneyFlow: 'moneyFlow'
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
                this.dateValue = '';
                this.formSearch.channelCodeEQ = '';
            },
            exportXls() {
                window.location.href = baseUrl + '/api/recon/tools/export-recon-batch-details?reconBatchId=' + this.batchId
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

                get('/api/recon/tools/recon-batch-details', this.formSearch).then(data => {
                    this.flowTableList = data;
                })
            },
            getReconBatchInfo() {
                var param = {idEQ: this.batchId}
                get('/api/recon/tools/recon-batches', param).then(data => {
                    this.reconBatchInfoList = data;
                })
            },
            newReconBatchId(){
                get('/api/recon/tools/recon-batch-id').then(data => {
                    this.sourceId = data;
                })
            },
            getOfflineChannels() {
                get('/api/recon/tools/offline-channels').then(data => {
                    this.selectList2 = data;
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
            handleClickTabs(tab, event) {
                // console.log(tab, event);
                if (tab.name === 'errorDetailType1') {
                    this.errorDetailType = '1';
                    this.activeTabNameText = '异常对账明细';
                }
                if (tab.name === 'errorDetailType2') {
                    this.errorDetailType = '2';
                    this.activeTabNameText = '支付失败明细';
                }
            },
            init() {
                this.uploadUrl = baseUrl + "/file/upload";
                this.batchId = this.$route.query.batchId;
                this.formSearch.reconBatchIdEQ = this.batchId;
                this.getOfflineChannels();
                this.getReconBatchInfo();
            }
        },
        activated(){
            //若使用了keepAlive，页面会进行缓存，则可以通过此方法刷新页面
            // console.log("activated")
            // this.init();
        },
        created: function () {
            this.init();
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
