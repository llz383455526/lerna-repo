<template>
    <div v-if="detail.customerCompanyName" style="margin: 15px 0;background-color: #fff; padding: 15px;">
        <p>开票申请开关配置详情</p>
        <el-form
						size="mini"
						label-width="100px"
						label-position="left">
            <el-form-item label="客户公司">
                <span>{{ detail.customerCompanyName }}</span>
            </el-form-item>
            <el-form-item label="落地公司">
                <span>{{ detail.serviceCompanyName }}</span>
            </el-form-item>
            <el-form-item label="开票开关">
                <span>{{ currentStateName }}</span>
            </el-form-item>
        </el-form>

        <div class="approve-status">
            <div class="list-item">
                <label class="list-item-label">开票开关状态：</label>
                <span class="list-item-content" style="font-size: 20px;color: #0283fb">{{currentStateName}}</span>
            </div>
            <timeline class="cus-timeline" timeline-theme="#18B394">
                <timeline-item
                    v-for="(item, index) in detail.switchDetailList"
                    :key="index">
                    <div class="item-content">
                        <div><span class="time">{{item.updateTime}}</span>&nbsp;&nbsp;&nbsp;&nbsp;<span>{{item.switchStatus === '0' ? '禁止开票申请' : '可以开票申请'}}</span></div>
                        <div>{{item.updateByName}}:&nbsp;&nbsp;&nbsp;&nbsp;{{item.remark}}</div>
                    </div>
                </timeline-item>
            </timeline>
            <el-form :form="approveForm" style="margin-top: 25px;">
                <el-form-item label="配置修改备注(非必填)">
                    <el-input
                        v-model.trim="approveForm.remark"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                    ></el-input>
                </el-form-item>
                <el-form-item label="审核结果">
                    <el-radio v-model="approveForm.switchStatus" label="1">可以开票申请</el-radio>
                    <el-radio v-model="approveForm.switchStatus" label="0">禁止开票申请</el-radio>
                </el-form-item>
            </el-form>
        </div>
        <div style="margin-top: 15px;">
            <el-button type="primary" size="small" @click="submitApprove">确定提交</el-button>
            <el-button size="small" @click="$router.go(-1)">返回</el-button>
        </div>
    </div>
</template>

<script>
// https://github.com/luyilin/vue-cute-timeline
import { Timeline, TimelineItem } from 'vue-cute-timeline'
import { risk } from 'src/api'
import { post, get} from 'store/api'

export default {
    components: {
        Timeline,
        TimelineItem,
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
                remark: '',
                switchStatus: '',
            },
        }
    },
		computed: {
			currentStateName() {
				return this.detail.currentSwitchStatus === '0' ? '禁止开票申请' : '可以开票申请'
      },
      customerCompanyId() {
        const customerCompanyId = this.$route.query.customerCompanyId
        this.approveForm.customerCompanyId = customerCompanyId
        return customerCompanyId
      },
      serviceCompanyId() {
        const serviceCompanyId = this.$route.query.serviceCompanyId
        this.approveForm.serviceCompanyId = serviceCompanyId
        return serviceCompanyId
      }
		},
    created() {
        this.getInvoiceRiskDetail()
    },
    activated() {
      this.getInvoiceRiskDetail()
    },
    methods: {
        // 获取详情
        getInvoiceRiskDetail() {
            get(risk.getInvoiceRiskDetail, 
              {customerCompanyId: this.customerCompanyId, serviceCompanyId: this.serviceCompanyId})
            .then(data => {
                this.detail = data
                this.approveForm.switchStatus = data['currentSwitchStatus']
            })
        },
        // 审核确定按钮
        submitApprove() {
            post(risk.invoiceRiskSwitch, this.approveForm).then(res => {
              this.getInvoiceRiskDetail()
            })
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
        width: 140px;
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
