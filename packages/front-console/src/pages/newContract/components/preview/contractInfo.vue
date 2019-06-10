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
                            <template v-if="contractModel.contractForm.cUserStandardAttachmentModels">
                                <div v-for="(v, k) in contractModel.contractForm.cUserStandardAttachmentModels">
                                    <span>{{ v.displayname }}</span>
                                    <a
                                        href="javascript:;"
                                        @click="jieSuanFileDown(v.downloadCode)"
                                        style="margin-left:10px;">下载</a>
                                </div>
                            </template>
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
        }

    }
}
</script>
