<template>
    <div class="widget-box bg-white">
        <div class="widget-header">
            <h4 class="widget-title">合同业务信息补充</h4>
        </div>
        <div class="widget-body">
            <div class="widget-main">
                <el-form :inline="true">
                    <h4 class="h4">合同收件人信息</h4>
                    <el-form-item label="合同收件人姓名">
                        <el-input style="width:450px;" v-model="contractModel.contractForm.receiver"></el-input>
                    </el-form-item>
                    <el-form-item label="合同收件人电话">
                        <el-input style="width:450px;" v-model="contractModel.contractForm.receivePhone"></el-input>
                    </el-form-item>
                    <el-form-item label="合同收件人地址">
                        <div style="display: flex;justify-content: start;">
                            <area-select type="all" class="postion-sel" v-model="contractModel.contractForm.receiveAddrList" :level="2" :isLinkage="true" :data="pcaa" />
                            <span style="margin: 0 12px 0 10px;">备注地址</span>
                            <el-input style="width:400px;" v-model="contractModel.contractForm.receiveAddr"></el-input>
                        </div>
                    </el-form-item>
                    <hr>
                    <h4 class="h4">合同证据链</h4>
                    <upload :list="contractModel.contractForm.receiveAttachments" style="width: 1100px;" @remove="handleRemove" @uploadSuccess="uploadSuccess"></upload>
                    <template v-if="false">
                        <h4 class="h4">C端绩效计算规则</h4>
                        <div class="jie-suan-biao-zhun-box">
                            <el-upload class="form_input" :action="`/api/econtract/template/parsefile`" :auto-upload="false" :on-change="jieSuanBiaoZhunUpload" multiple :show-file-list="false">
                                <el-button style="margin-left: 20px" size="small" type="primary" @click="index = key">上传附件</el-button>
                            </el-upload>
                            <el-table
                                :data="contractModel.contractForm.cUserStandardAttachmentModels"
                                style="margin-left: 275px"
                            >
                                <el-table-column
                                    prop="displayname"
                                    label="名称">
                                </el-table-column>
                                <el-table-column
                                    prop="address"
                                    width="100px"
                                    label="操作">
                                    <template slot-scope="scope">
                                        <el-button type="text" size="small" @click="jieSuanFileRemove(scope)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </template>
                    <br>
                    <h4 class="h4">合同备注</h4>
                    <el-form-item>
                        <el-input style="width:1140px;" type="textarea" v-model="contractModel.contractForm.receiveMemo" maxlength="200"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import {pcaa, pca} from 'area-data'
import upload from './upload.vue'
import { importPost } from "../../../../store/api"
export default {
    props: ['contractModel'],
    components: { upload },
    data() {
        return {
             // 地区
            pcaa: pcaa
        }
    },
    methods: {
        handleRemove(index) {
            this.contractModel.contractForm.receiveAttachments.splice(index, 1)
        },
        uploadSuccess(obj) {
            this.contractModel.contractForm.receiveAttachments.push(obj)
        },
        /**
         * 结算标准文件改变的时候
         */
        jieSuanBiaoZhunUpload(file) {
            let formData = new FormData();
            formData.append('targetType', 'vci_attach');
            formData.append('fileName', file.name);
            formData.append('file', file.raw);
            importPost('/api/sysmgr-web/file/upload', formData, true).then(data => {
                this.$message({
                    type: 'success',
                    message: '上传成功！'
                })
                this.$emit('jieSuanBiaoZhunChange', {
                    displayname: data.fileName,
                    refId: data.referId,
                    downloadCode: data.downloadCode
                })
            })
        },
        /**
         * 结算标准删除
         */
        jieSuanFileRemove(row) {
            this.contractModel.contractForm.cUserStandardAttachmentModels.splice(row.$index, 1)
        }

    }
}
</script>
<style lang="scss">
    .jie-suan-biao-zhun-box {
        display: flex;
        padding-right: 245px;
    }
</style>

<style>
.h4 {
    margin: 0 0 10px;
}
.widget-box {
    margin-bottom: 20px;
}
.area-select-wrap .area-select {
    height: 40px;
}
.area-select-wrap .area-select .area-selected-trigger {
    padding: 0 10px;
}
</style>


