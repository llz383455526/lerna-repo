<template>
    <div class="performance-manager-star-manger-pop">
        <el-dialog
            :visible.sync="isShow"
            width="900px"
            :before-close="handleClose">
            <p slot="title">
                {{ title }}
                <span v-if="otherParams" style="size: 12px; color: #999">
                    {{otherParams.year}}年{{otherParams.month}}月
                </span>
            </p>
            <div class="performance-manager-star-manger-pop-content">
                <div class="section">
                    <p class="title">选择服务商</p>
                    <ul class="service-providers-list">
                        <li
                            class="item" v-for="(v, k) in serviceProviderslist"
                            :key="k"
                            @click="serviceProvidersItemClick(v, k)"
                            :class="{ action: v.isSel }"
                        >{{ v.name }}</li>
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
                                :file-list="fileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">如果服务商计算规则一致，可选多个服务一起上传</div>
                            </el-upload>
                        </el-col>
                        <el-col :span="12" v-if="upFileList.length">
                            <el-button type="text" style="padding: 0!important;" @click="upFileClear">清空</el-button>
                            <ul class="up-file-list">
                                <li v-for="(v, k) in upFileList" :key="k" class="item">
                                    <span style="color: #333">{{ v.name }}_{{fileSuffix}}</span>
                                    <span style="color: #999">（{{upFileModel.fileName}}）</span>
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
    import {showLoading, hideLoading} from '../../../../../plugin/utils-loading'
    import {post, get, importPost} from "../../../../../store/api"
    export default {
        name: "PerformanceManagerStarMangerPop",
        props: ['title', 'fileSuffix', 'url', 'attachmentKey'],
        data() {
            return {
                isShow: false,
                serviceProviderslist: [],
                fileList: [],
                upFileModel: null,
                otherParams: null
            }
        },
        computed: {
            upFileList() {
                if (this.upFileModel) {
                    return this.serviceProviderslist.filter((item) => {
                        return item.isSel
                    })
                } else {
                    return []
                }
            },
            // 服务商选择列表
            serviceSelProviderslist() {
                return this.serviceProviderslist.filter((item) => {
                    return item.isSel
                })
            }
        },
        methods: {
            show(data, otherTitle) {
                this.upFileModel = null
                const serviceProviderslist = JSON.parse(JSON.stringify(data.servers))
                serviceProviderslist.forEach((item) => {
                    item.isSel = false
                })
                this.serviceProviderslist = serviceProviderslist
                this.otherParams = data.otherParams
                this.isShow = true
                if (this.$refs.EL_UPLOAD) {
                    this.$refs.EL_UPLOAD.clearFiles()
                }
            },
            serviceProvidersItemClick(item, index) {
                item.isSel = !item.isSel
            },
            upFileRemoveClick(item) {
                this.serviceProviderslist.some((item1) => {
                    if (item.id === item1.id) {
                        item1.isSel = false
                    }
                })
            },
            upFileClear() {
                this.upFileModel = null
            },
            handleChange(file, files) {
                if (files.length > 1) {
                    files.shift()
                }
                var formData = new FormData()
                formData.append('targetType', '')
                formData.append('fileName', file.name)
                formData.append('file', file.raw)
                importPost('/api/sysmgr-web/file/upload', formData, true).then(data => {
                    this.upFileModel = data
                    hideLoading()
                }).catch(() => {
                    this.$notify.error({
                        title: '上传失败',
                        message: '请重新上传'
                    });
                    this.$refs.EL_UPLOAD.clearFiles()
                    this.upFileModel = null
                    hideLoading()
                })
            },
            fileRemove(file, files) {
                this.upFileModel = null
            },
            okBtnClick() {
                if (this.upFileList.length === 0) {
                    this.$message({
                        message: '请选择服务商',
                        type: 'warning'
                    });
                    return
                }
                if (!this.upFileModel) {
                    this.$message({
                        message: '请上传附件',
                        type: 'warning'
                    });
                    return
                }
                const serviceCompanyIds = this.upFileList.map((item) => {
                    return item.id
                })
                const companyId = this.$route.query.id
                const p = {
                    ...this.otherParams,
                    companyId: companyId,
                    serviceCompanyIds: serviceCompanyIds
                }
                p[this.attachmentKey] = this.upFileModel.referId
                post(`/api/console-dlv${this.url}`, p).then((data) => {
                    this.model = data
                    this.isShow = false
                    this.$emit('reload')
                }).catch(() => {
                })
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
