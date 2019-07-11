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
                    <template>
                        <h4 class="h4">C端绩效计算规则</h4>
                        <div class="jie-suan-biao-zhun-box">
                            <el-button v-if="cWaitList.length > 0" class="form_input" style="margin-left: 20px" size="small" type="primary" @click="upFileBtnClick">上传附件</el-button>
                            <div class="right-section" v-if="cWaitList.length > 0">
                                <span class="title">待上传落地公司</span>
                                <ul class="wait-list">
                                    <li class="item" v-for="v in  cWaitList" :key="v.serviceCompanyId">{{ v.serviceCompanyName }}</li>
                                </ul>
                            </div>
                            <div class="right-section" v-if="cAlreadyList.length">
                                <span class="title" style="color: #1D7CEE">已上传落地公司</span>
                                <el-row :gutter="20" v-for="(v, k) in cAlreadyList" :key="v.serviceCompanyId">
                                    <el-col :span="12">{{ v.serviceCompanyName }}_计算规则.{{  v.attachments[0].displayname.split('.').pop() }}</el-col>
                                    <el-col :span="12">
                                        <el-button type="text" @click="handleDownload(v)">下载</el-button>
                                        <el-button type="text" @click="jieSuanFileRemove(v)">删除</el-button>
                                    </el-col>
                                </el-row>
                            </div>
                        </div>
                    </template>
                    <br><br>
                    <h4 class="h4">合同备注</h4>
                    <el-form-item>
                        <el-input style="width:1140px;" type="textarea" v-model="contractModel.contractForm.receiveMemo" maxlength="200"></el-input>
                    </el-form-item>
                </el-form>
            </div>
        </div>
        <w-pop ref="WPop" @upFinish="upFinish" :file-format="['.pdf', '.xls', '.xlsx', '.doc', '.docx', '.txt', '.csv']" :file-size="32"/>
    </div>
</template>

<script>
import {pcaa, pca} from 'area-data'
import upload from './upload.vue'
import { importPost } from "../../../../store/api"
import WPop from './pop'
export default {
    props: ['contractModel', 'cUserStandardInfoList'],
    components: { upload, WPop },
    data() {
        return {
             // 地区
            pcaa: pcaa
        }
    },
    computed: {
        // C端绩效待上传列表
      cWaitList() {
          return this.cUserStandardInfoList.filter((item) => {
              return !item.attachments || item.attachments.length === 0
          })
      },
        cAlreadyList() {
            return this.cUserStandardInfoList.filter((item) => {
                return item.attachments && item.attachments.length > 0
            })
        }
    },
    methods: {
        upFinish(list) {
            this.$emit('jieSuanBiaoZhunChange', list)
        },
        // 上传文件按钮点击
        upFileBtnClick() {
            const p = {
                servers: this.cWaitList
            }
            this.$refs.WPop.show(p)
        },
        handleRemove(index) {
            this.contractModel.contractForm.receiveAttachments.splice(index, 1)
        },
        uploadSuccess(obj) {
            this.contractModel.contractForm.receiveAttachments.push(obj)
        },
        /**
         * 结算标准删除
         */
        jieSuanFileRemove(item) {
            item.attachments = []
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
        padding-left: 200px;
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


