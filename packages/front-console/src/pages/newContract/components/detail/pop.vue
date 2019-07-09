<template>
    <div class="performance-manager-star-manger-pop">
        <el-dialog
            :visible.sync="isShow"
            width="900px">
            <p slot="title">
                上传C端绩效计算规则
            </p>
            <div class="performance-manager-star-manger-pop-content">
                <div class="section">
                    <p class="title">选择服务商</p>
                    <ul class="service-providers-list">
                        <li
                            class="item" v-for="(v, k) in allowSelServer"
                            :key="k"
                            @click="serviceProvidersItemClick(v, k)"
                            :class="{ action: v.isSel }"
                        >{{ v.serviceCompanyName }}</li>
                    </ul>
                </div>
                <br />
                <div class="section up-box">
                    <p class="title">上传附件</p>
                    <el-row class="content" :gutter="20">
                        <el-col :span="12">
                            <el-upload
                                :disabled="!serviceSelProviderslist.length"
                                :class="{ 'disabled-up-box': !serviceSelProviderslist.length }"
                                ref="EL_UPLOAD"
                                class="upload-demo"
                                action="/api/sysmgr-web/file/upload"
                                :on-change="handleChange"
                                :on-remove="fileRemove"
                                :auto-upload="false"
                                :multiple="false"
                                :accept="accept"
                                :file-list="fileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">
                                    <p>如果服务商计算规则一致，可选多个服务一起上传</p>
                                    <p>{{ fileFormat.join(',') }}， 允许最大上传{{ fileSize }}M</p>
                                </div>
                            </el-upload>
                        </el-col>
                        <el-col :span="12" v-if="alreadyUpServer.length">
                            <el-button type="text" style="padding: 0!important;" @click="upFileClear">清空</el-button>
                            <ul class="up-file-list">
                                <li v-for="(v, k) in alreadyUpServer" :key="k" class="item">
                                    <span style="color: #333">{{ v.serviceCompanyName }}_计算规则</span>
                                    <span style="color: #999">（{{v.attachments[0].displayname}}）</span>
                                    <i class="icon el-icon-remove" @click="upFileRemoveClick(v)"></i>
                                </li>
                            </ul>
                        </el-col>
                    </el-row>
                </div>
            </div>
            <span slot="footer" class="dialog-footer">
        <el-button size="small" @click="isShow = false">取 消</el-button>
        <el-button size="small" type="primary" @click="okBtnClick">确 定</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import {showLoading, hideLoading} from '../../../../plugin/utils-loading'
    import {post, get, importPost} from "../../../../store/api"
    export default {
        name: "PerformanceManagerStarMangerPop",
        props: [ 'url', 'attachmentKey', 'fileFormat', 'fileSize'],
        data() {
            return {
                isShow: false,
                serviceProviderslist: [],
                fileList: []
            }
        },
        computed: {
            // 服务商选择列表
            serviceSelProviderslist() {
                return this.serviceProviderslist.filter((item) => {
                    return item.isSel
                })
            },
            accept() {
                return this.fileFormat.join(',')
            },
            // 可选择的服务商
            allowSelServer() {
                return this.serviceProviderslist.filter((item) => {
                    return !item.attachments || item.attachments.length === 0
                })
            },
            // 已经上传的服务商
            alreadyUpServer() {
                return this.serviceProviderslist.filter((item) => {
                    return item.attachments && item.attachments.length
                })
            },
            // 已经选中的服务商
            selServer() {
                return this.allowSelServer.filter((item) => {
                    return item.isSel
                })
            },
        },
        methods: {
            show(data) {
                const serviceProviderslist = JSON.parse(JSON.stringify(data.servers))
                serviceProviderslist.forEach((item) => {
                    item.isSel = false
                })
                this.serviceProviderslist = serviceProviderslist
                this.isShow = true
                if (this.$refs.EL_UPLOAD) {
                    this.$refs.EL_UPLOAD.clearFiles()
                }
            },
            serviceProvidersItemClick(item, index) {
                item.isSel = !item.isSel
            },
            upFileRemoveClick(item) {
                item.attachments = []
            },
            upFileClear() {
                this.serviceProviderslist.forEach((item) => {
                    item.attachments = []
                })
            },
            handleChange(file, files) {
                if (files.length > 1) {
                    files.shift()
                }
                if (file.size > this.fileSize * 1024 * 1024) {
                    this.$notify.error({
                        title: '文件太大',
                        message: `文件大小不能大于${this.fileSize}M`
                    });
                    files.shift()
                    return
                }
                const filePrifix = '.' + file.name.split('.').pop()
                if (this.fileFormat.indexOf(filePrifix) < 0) {
                    this.$notify.error({
                        title: '文件格式不正确',
                    });
                    files.shift()
                    return;
                }
                showLoading()
                var formData = new FormData()
                formData.append('targetType', 'vci_attach')
                formData.append('fileName', file.name)
                formData.append('file', file.raw)
                importPost('/api/sysmgr-web/file/upload', formData, true).then(data => {
                    this.selServer.forEach((item) => {
                        item.attachments = [
                            {
                                displayname: data.fileName,
                                refId: data.referId,
                                downloadCode: data.downloadCode
                            }
                        ]
                        item.isSel = false
                    })
                }).catch(() => {
                    this.$notify.error({
                        title: '上传失败',
                        message: '请重新上传'
                    });
                    this.$refs.EL_UPLOAD.clearFiles()
                }).finally(() => {
                    hideLoading()
                })
            },
            fileRemove(file, files) {
            },
            okBtnClick() {
                if (this.alreadyUpServer.length === 0) {
                    this.$message({
                        message: '请上传附件',
                        type: 'warning'
                    });
                    return
                }
                this.$emit('upFinish', this.serviceProviderslist)
                this.isShow = false
            }
        }
    }
</script>

<style lang="scss" scoped>
    .performance-manager-star-manger-pop-content {
        .section {
            .title {
                color: rgba(16, 16, 16, 1);
                font-size: 16px;
                border-left: 4px solid rgb(29, 124, 238);
                padding-left: 10px;
                margin-bottom: 10px;
            }
            .service-providers-list {
                list-style: none;
                display: flex;
                flex-wrap: wrap;
                padding: 0;
                margin: 5px 10px;
                .item {
                    font-size: 14px;
                    padding: 3px 5px;
                    margin: 5px;
                    color: rgba(204, 204, 204, 1);
                    border: 1px dashed rgba(204, 204, 204, 1);
                    cursor: pointer;
                }
                .item.action {
                    color: rgba(29, 124, 238, 1);
                    border: 1px dashed rgba(29, 124, 238, 1);
                }
            }
        }
        .up-box {
            .content {
                padding-left: 14px;
            }
            .up-file-list {
                border: 1px solid #ccc;
                list-style: none;
                margin: 5px 0;
                padding: 10px;
                .item {
                    margin: 5px 0;
                    position: relative;
                    padding-right: 30px;
                    .icon {
                        position: absolute;
                        right: 0;
                        top: 0;
                        color: #aaa;
                        cursor: pointer;
                    }
                    .icon:hover {
                        color: #f00;
                    }
                }
            }
        }
    }
</style>
<style lang="scss" scoped>
    .performance-manager-star-manger-pop {
        .disabled-up-box {
            .el-button {
                background-color: #ccc;
                border-color: #ccc;
                cursor: not-allowed;
            }
        }
        .el-upload__tip {
            color: #ccc;
        }
    }
</style>
