<template>
    <div class="drop-detail">
        <div class="title">{{ this.dropDetailData.companyName }}</div>
        <el-row :gutter="20" class="text-row-group">
            <el-col :span="3" class="group-title">信用等级</el-col>
            <el-col :span="21" class="group-detail">
                <w-start :count="this.dropDetailData.riskLevel"></w-start>
            </el-col>
        </el-row>
        <el-row :gutter="20" class="text-row-group">
            <el-col :span="3" class="group-title">更新时间</el-col>
            <el-col :span="21" class="group-detail">
                {{ this.dropDetailData.riskLevelUpdateTime }}
            </el-col>
        </el-row>
        <el-row :gutter="20" class="text-row-group">
            <el-col :span="3" class="group-title">更新人</el-col>
            <el-col :span="21" class="group-detail">
                {{ this.dropDetailData.riskLevelUpdateByName }}
            </el-col>
        </el-row>
        <div style="height: 1px; background-color: #eee; margin: 20px 0;"></div>
        <div>
            <el-button type="primary" size="mini" @click="editRuleBtnClick">编辑成本限额规则</el-button>
        </div>
        <p>发放规则</p>
        <el-table
            :data="faFangRules"
            border>
            <el-table-column
                prop="riskPackId"
                label="ID">
            </el-table-column>
            <el-table-column
                label="落地公司">
                <template slot-scope="scope">
                    <span v-for="(v, k) in scope.row.serviceCompanyNames">{{ v }}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                width="100px"
                label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="showBtnClick(scope.row)">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <p>风险评级细项</p>
        <el-table
            :data="fengXianPingJi"
            border>
            <el-table-column
                prop="title"
                label="评级细项">
            </el-table-column>
            <el-table-column
                prop="state"
                label="状态">
            </el-table-column>
            <el-table-column
                prop="uptime"
                label="更新时间">
            </el-table-column>
            <el-table-column
                prop="address"
                width="200px"
                label="操作">
                <template slot-scope="scope">
                    <el-button v-if="scope.row.operation" type="text" size="small" @click="reviewBtnClick(scope.row)">
                        审核
                    </el-button>
                    <el-button v-if="scope.row.operation === 1" type="text" size="small"
                               @click="attachmentPopShow(0, scope.row)">附件管理
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <p>月度签约率/月度绩效数据</p>
        <el-table
            :data="monthData"
            border>
            <el-table-column
                prop="date"
                label="月份">
                <template slot-scope="scope">
                    {{scope.row.year}}年{{scope.row.month}}月
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="比例">
                <template slot-scope="scope">
                    {{scope.row.cuserSignRate ? scope.row.cuserSignRate : 0}}%
                </template>
            </el-table-column>
            <el-table-column
                prop="name"
                label="数据状态">
                <template slot-scope="scope">
                    {{scope.row.cuserPerformanceAttachmentId ? '有' : '无'}}
                </template>
            </el-table-column>
            <el-table-column
                prop="address"
                width="200px"
                label="附件管理">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="attachmentPopShow(1, scope.row)">附件管理</el-button>
                </template>
            </el-table-column>
        </el-table>
        <br/>
        <div>
            <el-button size="mini"
                       @click="$router.go(-1)">返回
            </el-button>
            <el-button size="mini" type="primary" @click="runBtnClick">立即执行</el-button>
        </div>
        <el-dialog
            title="附件管理"
            :visible.sync="attachmentPopIsShow"
            width="30%">
      <span>
        <el-upload
            action=""
            :auto-upload="false"
            :limit="1"
            :show-file-list="true"
            :on-change="fileChange">
          <el-button size="small" type="primary">上传附件</el-button>
        </el-upload>
        <br>
        <el-table
            :data="attachmentPopArr"
            border>
          <el-table-column
              label="附件名称">
            <template slot-scope="scope">
              {{ scope.row.displayname || scope.row.cuserPerformanceFileName }}
            </template>
          </el-table-column>
          <el-table-column
              prop="address"
              width="200px"
              label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="previewBtnClick(scope.row)">预览</el-button>
            <el-button type="text" size="small" @click="removeBtnClick(scope)">删除</el-button>
          </template>
      </el-table-column>
    </el-table>
      </span>
        </el-dialog>
        <el-dialog
            title="审核操作"
            :visible.sync="reviewOperationPopIsShow"
            width="30%">
      <span>
        <el-form ref="form" label-width="80px">
          <el-form-item label="审核状态">
            <el-select v-model="reviewOperationValue" placeholder="请选择活动区域">
              <el-option label="不通过" value="不通过"></el-option>
              <el-option label="审核通过" value="审核通过"></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </span>
            <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="reviewOperationPopIsShow = false">取 消</el-button>
        <el-button size="mini" type="primary" @click="reviewOkBtnClick">保 存</el-button>
      </span>
        </el-dialog>
    </div>
</template>

<script>
    import {get, post, importPost} from "../../store/api";
    import WStart from '../../component/star'

    export default {
        name: "dropDetail",
        components: {
            WStart
        },
        data() {
            return {
                // 发放规则
                faFangRules: [],
                // 风险评级细项
                fengXianPingJi: [],
                // 月度签约率/月度绩效数据
                monthData: [],
                // 附件管理
                attachmentPopIsShow: false,
                attachmentPopArr: [],
                attachmentPopType: 0,
                attachmentSelItem: null,
                // 审核操作
                reviewOperationPopIsShow: false,
                reviewOperationValue: '不通过',
                reviewOperationData: null,
                // 详情数据
                dropDetailData: {}
            }
        },
        methods: {
            getDetail() {
                get('/api/console-dlv/risk_level_degrade/risk-level-degrade-detail', {
                    companyId: this.$route.query.id
                }).then((data) => {
                    this.dropDetailData = data
                    this.setFengXianPingJiData()
                    if (!this.dropDetailData.companyRiskRateDTO.attachmentModelList) {
                        this.dropDetailData.companyRiskRateDTO.attachmentModelList = []
                    }
                    this.monthData = data.companyRiskRateDataDTOList
                    this.faFangRules = data.riskRulePackDTOList
                }).catch(() => {
                })
            },
            // 文件改变的时候调用
            fileChange(e, filrArr) {
                if (filrArr.length) {
                    filrArr.pop()
                }
                var formData = new FormData()
                formData.append('fileName', e.name)
                formData.append('file', e.raw)
                importPost('/api/sysmgr-web/file/upload', formData, true).then(data => {
                    if (this.attachmentPopType === 0) {
                        this.fengXianAttachmentChange(data.referId, e.name, e.downloadCode)
                    } else {
                        this.monthAttachmentUp(data.referId, e.name, e.downloadCode)
                    }
                }).catch(() => {
                    this.$message({
                        message: '文件上传失败',
                        type: 'warning'
                    });
                })
            },
            // 设置风险评级
            setFengXianPingJiData() {
                if (this.dropDetailData && this.dropDetailData.companyRiskRateDTO) {
                    const cuserSignRate = this.dropDetailData.companyRiskRateDTO.cuserSignRate
                    this.fengXianPingJi = [
                        {
                            title: 'C端用户签约率',
                            state: `${cuserSignRate ? cuserSignRate : '0'}%`,
                            uptime: this.dropDetailData.companyRiskRateDTO.cuserSignRateUpdateTime,
                            operation: 0
                        },
                        {
                            title: 'C端结算标准',
                            state: this.dropDetailData.companyRiskRateDTO.cuserBalanceStandardState === 'success' ? '审核通过' : '审核不通过',
                            uptime: this.dropDetailData.companyRiskRateDTO.cuserBalanceStandardUpdateTime,
                            operation: 1
                        },
                        {
                            title: 'C端绩效数据',
                            state: this.dropDetailData.companyRiskRateDTO.cuserPerformanceState === 'success' ? '审核通过' : '审核不通过',
                            uptime: this.dropDetailData.companyRiskRateDTO.cuserPerformanceUpdateTime,
                            operation: 2
                        }
                    ]
                }
            },
            // 预览按钮点击
            previewBtnClick(item) {
                if (this.attachmentPopType === 0) {
                    const url = '/api/sysmgr-web/file/download' +
                        '?downloadCode=' + item.downloadCode;
                    window.open(url)
                } else {
                    const url = '/api/sysmgr-web/file/download' +
                        '?downloadCode=' + item.cuserPerformanceDownloadCode;
                    window.open(url)
                }
            },
            // 删除按钮点击
            removeBtnClick(item) {
                if (this.attachmentPopType === 0) {
                    this.fengXianAttachmentChange('', '', null, item.$index)
                } else {
                    this.monthAttachmentRemove()
                }
            },
            // 显示附件弹窗
            attachmentPopShow(type, item) {
                this.attachmentPopType = type
                if (type === 0) {
                    if (this.dropDetailData && this.dropDetailData.companyRiskRateDTO && this.dropDetailData.companyRiskRateDTO.attachmentModelList) {
                        this.attachmentPopArr = this.dropDetailData.companyRiskRateDTO.attachmentModelList
                    } else {
                        this.attachmentPopArr = []
                    }
                } else {
                    this.attachmentSelItem = item
                    if (item.cuserPerformanceAttachmentId) {
                        this.attachmentPopArr = [item]
                    } else {
                        this.attachmentPopArr = []
                    }
                }
                this.attachmentPopIsShow = true
            },
            // 审核按钮点击
            reviewBtnClick(item) {
                this.reviewOperationPopIsShow = true
                this.reviewOperationValue = item.state === '审核通过' ? '审核通过' : '不通过'
                this.reviewOperationData = item
            },
            // 审核确定按钮点击
            reviewOkBtnClick() {
                const data = {
                    id: this.dropDetailData.companyRiskRateDTO.id,
                    cuserBalanceStandardAttachments: this.dropDetailData.companyRiskRateDTO.cuserBalanceStandardAttachments,
                    cuserBalanceStandardState: this.dropDetailData.companyRiskRateDTO.cuserBalanceStandardState,
                    cuserPerformanceState: this.dropDetailData.companyRiskRateDTO.cuserPerformanceState
                }
                if (this.reviewOperationData.operation === 1) {
                    data.cuserBalanceStandardState = this.reviewOperationValue === '不通过' ? 'fail' : 'success'
                } else {
                    data.cuserPerformanceState = this.reviewOperationValue === '不通过' ? 'fail' : 'success'
                }
                post('/api/console-dlv/risk_level_degrade/risk-level-degrade-approve', data).then(() => {
                    Object.assign(this.dropDetailData.companyRiskRateDTO, data)
                    this.setFengXianPingJiData()
                    this.reviewOperationPopIsShow = false
                    this.$message({
                        message: '修改成功',
                        type: 'success'
                    });
                }).catch(() => {
                    this.$message({
                        message: '修改失败',
                        type: 'warning'
                    });
                })
            },
            // 附件更新
            fengXianAttachmentChange(fileId, fileName, downloadCode,index) {
                const data = {
                    id: this.dropDetailData.companyRiskRateDTO.id,
                    cuserBalanceStandardState: this.dropDetailData.companyRiskRateDTO.cuserBalanceStandardState,
                    cuserPerformanceState: this.dropDetailData.companyRiskRateDTO.cuserPerformanceState
                }
                data.cuserBalanceStandardAttachments = this.dropDetailData.companyRiskRateDTO.attachmentModelList.map((item) => {
                    return item.id
                })
                if (fileId) {
                    data.cuserBalanceStandardAttachments.push(fileId)
                } else {
                    data.cuserBalanceStandardAttachments.splice(index, 1)
                }
                data.cuserBalanceStandardAttachments = data.cuserBalanceStandardAttachments.join(',')
                post('/api/console-dlv/risk_level_degrade/risk-level-degrade-approve', data).then(() => {
                    Object.assign(this.dropDetailData.companyRiskRateDTO, data)
                    this.setFengXianPingJiData()
                    const msg = fileId ? '文件上传成功' : '文件删除成功'
                    if (fileId) {
                        this.attachmentPopArr.push({
                            downloadCode: downloadCode,
                            displayname: fileName,
                            id: fileId
                        })
                    } else {
                        this.attachmentPopArr.splice(index, 1)
                    }
                    this.$message({
                        message: msg,
                        type: 'success'
                    });
                }).catch(() => {
                    const msg = fileId ? '文件上传失败' : '文件删除失败'
                    this.$message({
                        message: msg,
                        type: 'warning'
                    });
                })
            },
            // 月份附件上传
            monthAttachmentUp(fileId, fileName, downloadCode) {
                const data = Object.assign({}, this.attachmentSelItem)
                data.cuserPerformanceAttachmentId = fileId

                post('/api/console-dlv/risk_level_degrade/upload-cuser-performance', data).then(() => {
                    this.attachmentSelItem.cuserBalanceStandardFileName = fileName
                    this.attachmentSelItem.cuserPerformanceAttachmentId = fileId
                    this.attachmentPopArr = [{
                        cuserPerformanceFileName: fileName,
                        cuserPerformanceDownloadCode: downloadCode
                    }]
                    this.monthData = [].concat(this.monthData)
                    this.$message({
                        message: '文件上传成功',
                        type: 'success'
                    });
                }).catch(() => {
                    this.$message({
                        message: '文件上传失败',
                        type: 'warning'
                    });
                })
            },
            // 月份附件删除
            monthAttachmentRemove() {
                get('/api/console-dlv/risk_level_degrade/delete-cuser-performance', this.attachmentSelItem).then(() => {
                    this.attachmentPopArr = []
                    this.attachmentSelItem.cuserPerformanceAttachmentId = null
                    this.monthData = [].concat(this.monthData)
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                }).catch(() => {
                    this.$message({
                        message: '删除失败',
                        type: 'warning'
                    });
                })
            },
            // 编辑规则按钮点击
            editRuleBtnClick() {
                this.$router.push('/main/orderManager/costLimitDetail?id=' + this.$route.query.id)
            },
            // 查看按钮点击
            showBtnClick(item) {
                const query = this.$route.query
                this.$router.push({
                    path: '/main/orderManager/costLimitAddRule', query: {
                        ...query,
                        ruleid: item.riskPackId
                    }
                })
            },
            /**
             * 立即执行按钮点击
             */
            runBtnClick() {
                this.$confirm('确定要立即执行嘛?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    get('/api/console-dlv/risk_level_degrade/refresh-company-risk-level', {
                        companyId: this.$route.query.id
                    }).then(() => {
                        this.$message({
                            message: '执行成功',
                            type: 'success'
                        });
                        this.getDetail()
                    }).catch(() => {
                    })
                }).catch(() => {

                });

            }
        },
        mounted() {
            this.getDetail()
        }
    }
</script>

<style lang="scss" scoped>
    .drop-detail {
        margin: 20px 0;
        padding: 20px;
        background-color: #fff;

        .text-row-group {
            .group-title {
                color: #666;
            }

            .group-detail {
                color: #999;
            }
        }

        .attachment-pop-input {
            width: 0;
            height: 0;
            overflow: hidden;
            opacity: 0;
        }
    }
</style>
