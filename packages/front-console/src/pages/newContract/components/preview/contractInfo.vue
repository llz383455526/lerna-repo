<template>
    <div>
        <div class="widget-box bg-white" style="margin-top:20px;">
            <div class="widget-header">
                <h4 class="widget-title">合同业务信息补充</h4>
            </div>
            <div class="widget-body">
                <div class="widget-main" style="font-size: 16px;line-height: 30px;">
                    <div class="row" style="margin-bottom: 15px;">
                        <div class="col-xs-12">
                            <h4 class="block green">合同收件人信息</h4>
                        </div>
                        <div class="col-xs-6">合同收件人姓名：{{ contractModel.contractForm.receiver }}</div>
                        <div class="col-xs-6">合同收件人电话：{{ contractModel.contractForm.receivePhone }}</div>
                        <div class="col-xs-12">合同收件人地址：{{ addr + ' ' }}{{ contractModel.contractForm.receiveAddr }}</div>
                        <div class="col-xs-12">
                            <h4 class="block green">合同证据链</h4>
                        </div>
                        <div class="col-xs-8">
                            <el-table :data="contractModel.contractForm.receiveAttachments" class="mb20">
                                <!-- <el-table-column label="附件类型">
                                    <template slot-scope="scope">
                                        {{scope.row.targetType == 'customerContact' ? '系统附件' : '补充附件'}}
                                    </template>
                                </el-table-column> -->
                                <el-table-column label="文件名称" prop="displayname"></el-table-column>
                                <el-table-column label="操作" width="100">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="medium" style="padding:0;" @click="handleDownload(scope.row.downloadCode)">下载</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                        <div class="col-xs-12">
                            <h4 class="block green">C端绩效计算规则</h4>
                            <div class="jie-suan-biao-zhun-box">
                                <div class="right-section" v-if="cWaitList.length > 0">
                                    <span class="title">待上传落地公司</span>
                                    <ul class="wait-list">
                                        <li class="item" v-for="v in  cWaitList" :key="v.serviceCompanyId">{{ v.serviceCompanyName }}</li>
                                    </ul>
                                </div>
                                <div class="right-section" v-if="cAlreadyList.length">
                                    <span class="title" style="color: #1D7CEE">已上传落地公司</span>
                                    <el-row :gutter="20" v-for="(v, k) in cAlreadyList">
                                        <el-col :span="12">{{ v.serviceCompanyName }}_计算规则.{{  v.attachments[0].displayname.split('.').pop() }}</el-col>
                                        <el-col :span="12">
                                            <el-button type="text" @click="handleDownload(v)">下载</el-button>
                                        </el-col>
                                    </el-row>
                                </div>
                            </div>
                        </div>
                        <div class="col-xs-12">
                            <h4 class="block green">合同备注</h4>
                        </div>
                        <div class="col-xs-12">{{ contractModel.contractForm.receiveMemo }}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { baseUrl } from '../../../../config/address.js'

export default {
    props: ['contractModel'],
    data() {
        return {
            addr: '',
        }
    },
    watch: {
        'contractModel.contractForm.receiveAddrList'() {
            this.getAdd()
        }
    },
    computed: {
        // C端绩效待上传列表
        cWaitList() {
            if (this.contractModel.contractForm.cUserStandardInfoList) {
                return this.contractModel.contractForm.cUserStandardInfoList.filter((item) => {
                    return !item.attachments || item.attachments.length === 0
                })
            } else {
                return  []
            }

        },
        cAlreadyList() {
            if (this.contractModel.contractForm.cUserStandardInfoList) {
                return this.contractModel.contractForm.cUserStandardInfoList.filter((item) => {
                    return item.attachments && item.attachments.length > 0
                })
            } else {
                return  []
            }

        }
    },
    methods: {
        getAdd() {
            this.contractModel.contractForm.receiveAddrList.forEach(element => {
                this.addr += element + ' - '
            });
        },
        handleDownload (downloadCode) {
            window.location.href = baseUrl + '/api/contract-web/file/download' +
            '?downloadCode=' + downloadCode;
        },
        jieSuanFileDown (downloadCode) {
            window.location.href = '/api/sysmgr-web/file/download' +
                '?downloadCode=' + downloadCode;
        },
        handleDownload (item) {
            window.open('/api/sysmgr-web/file/download' +
                '?downloadCode=' + item.attachments[0].downloadCode)
        },

    }
}
</script>
<style lang="scss" scoped>
    .jie-suan-biao-zhun-box {
        position: relative;
        .form_input {
            position: absolute;
            left: 0;
            top: 0;
        }
        .right-section {
            padding-bottom: 20px;
            position: relative;
            padding-left: 180px;
            >.title {
                position: absolute;
                left: 0;
                top: 0;
            }
            .wait-list {
                list-style: none;
                width: 100%;
                margin: 0;
                padding: 0;
                display: flex;
                flex-wrap: wrap;
                .item {
                    line-height: 20px;
                    color: rgba(204, 204, 204, 1);
                    font-size: 14px;
                    padding: 2px;
                    border: 1px dashed rgba(204, 204, 204, 1);
                    margin: 0 10px 5px 0;
                }
            }
        }
    }
</style>
