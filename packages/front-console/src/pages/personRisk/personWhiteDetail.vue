<template>
    <div style="margin: 15px 0;background-color: #fff; padding: 15px;">
        <p>白名单详情</p>
        <el-form
						size="mini"
						label-width="100px"
						label-position="left">
            <el-form-item label="姓名">
                <span>{{ detail.name }}</span>
            </el-form-item>
            <el-form-item label="证件号">
                <span>{{ detail.idCard }}</span>
            </el-form-item>
            <el-form-item label="银行卡号">
                <span>{{ detail.accountNo }}</span>
            </el-form-item>
            <el-form-item label="证件附件">
                <import-img-upload
                    v-if="detail.downloadCodeList"
                    :download-code-list="detail.downloadCodeList || []"
                ></import-img-upload>
            </el-form-item>
        </el-form>

        <div class="approve-status">
            <div class="list-item">
                <label class="list-item-label">审核状态：</label>
                <span class="list-item-content">{{currentStateName}}</span>
            </div>
            <timeline class="cus-timeline" timeline-theme="#18B394">
                <timeline-item
                    v-for="(item, index) in detail.approveRecordDTOList"
                    :key="index">
                    <div class="item-content">
                        <div><span class="time">{{item.createTime}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.stateName}}</span></div>
                        <div>{{item.createByName}}:&nbsp;&nbsp;&nbsp;&nbsp;{{item.remark}}</div>
                    </div>
                </timeline-item>
            </timeline>
            <el-form style="margin-top: 25px;">
                <el-form-item label="审核意见(非必填)">
                    <el-input
                        v-model.trim="approveForm.remark"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                    ></el-input>
                </el-form-item>
                <el-form-item label="审核结果">
                    <el-radio v-model="approveForm.state" label="success">通过</el-radio>
                    <el-radio v-model="approveForm.state" label="fail">不通过</el-radio>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin-top: 15px;">
            <el-button type="primary" size="small" @click="submitApprove">确定提交</el-button>
            <el-button size="small" @click="$router.push('/main/personRisk/personWhitelist')">返回</el-button>
        </div>
    </div>
</template>

<script>
// https://github.com/luyilin/vue-cute-timeline
import { Timeline, TimelineItem } from 'vue-cute-timeline'
import ImportImgUpload from './importImgUpload'
import { monitor } from '../../api/monitor'
import { post, get} from '../../store/api'

export default {
    components: {
        Timeline,
        TimelineItem,
        ImportImgUpload,
    },
    data() {
        return {
            detail: {
                // approveRecordDTOList: [
                //     {
                //         createBy: 0,
                //         createByName: 'createByName',
                //         createTime: '2019-11-12',
                //         id: 0,
                //         remark: 'remark',
                //         state: 'state',
                //         stateName: 'statename',
                //     },
                // ],
                // accountNo: 'accountNo',
                // customerCompanyId: 321,
                // customerCompanyName: 'customerCompanyName',
                // downloadCodeList: [
                //     '0b91ff5db2ab40ad99bd10fe0724a6e0ce47911820fe461fb84b46eab3ccac5a',
                //     '0b91ff5db2ab40ad99bd10fe0724a6e0ce47911820fe461fb84b46eab3ccac5a'
                // ],
                // id: 1,
                // idCard: '1232131',
                // mobilePhone: '188899994444',
                // name: 'xxx',
                // serviceCompanyId: 6666,
                // serviceCompanyName: 'serviceCompanyName'
            },
            approveForm: {
                ids: [],
                remark: '',
                state: '',
            },
        }
    },
		computed: {
			currentStateName() {
				const { approveRecordDTOList } = this.detail
				if (!approveRecordDTOList) {
					return ''
				}
				return approveRecordDTOList[approveRecordDTOList.length - 1].stateName || ''
			}
		},
    created() {
        this.id = this.$route.params.id
        this.approveForm.ids.push(this.id)
    },
    mounted() {
        this.getPersonWhiteDetail()
    },
    methods: {
        // 获取详情
        getPersonWhiteDetail() {
            get(monitor.getPersonWhiteDetail, {id: this.id}).then(data => {
                this.detail = data
            })
        },
        // 审核白名单
        approvePersonWhite(form) {
            post(monitor.approvePersonWhite, form).then(data => {
                console.log(data)
                this.$message.success('操作成功')
                this.getPersonWhiteDetail()
            })
        },
        // 审核确定按钮
        submitApprove() {
            if (!this.approveForm.state) {
                this.$message.warning('请选择审核结果')
                return
            }
            this.approvePersonWhite(this.approveForm)
        }
    }
}
</script>

<style lang="scss" scoped>
.approve-status {
    margin-top: 25px;
    background: #F9F9F9;
    padding: 10px 20px;
    border-radius: 4px;
}

.list-item {
    margin-bottom: 18px;

    .list-item-label {
        line-height: 28px;
        text-align: right;
        float: left;
        color: #606266;
        padding: 0 12px 0 0;
        box-sizing: border-box;
        width: 100px;
    }

    .list-item-content {
        margin-right: 100px;
        font-size: 14px;
        line-height: 28px;
        position: relative;
    }

    &:before {
        display: table;
        content: '';
    }
    &:after {
        display: table;
        content: '';
        clear: both;
    }
}

.cus-timeline {
    font-family: 'PingFangSC', 'Avenir', Helvetica, Arial, 'Hiragino Sans GB', 'Microsoft YaHei', 'sans-serif'
}

.item-content {
    font-size: 14px;
    div {
        margin-bottom: 8px;
    }
}
</style>
