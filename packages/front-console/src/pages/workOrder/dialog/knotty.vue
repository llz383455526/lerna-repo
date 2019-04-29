<template>
    <div>
        <el-dialog title="疑难单申请" :visible.sync="show" width="800px" @close="form.type = 0">
            <el-steps :active="active" align-center class="mb20" :key="stepList.length">
                <el-step v-for="e in stepList" :key="e.activityId" :title="e.activityName" :description="e.userName"></el-step>
            </el-steps>
            <el-form :model="form" :rules="rules" size="small" label-width="100px" ref="form" v-if="isCreate">
                <el-form-item label="申请类型" prop="type">
                    <div v-for="e in list" :key="e.value" :data-value="e.value" ref="radioDiv">
                        <el-radio v-model="form.type" :label="e.value" @change="getStep">{{e.text}}</el-radio>
                    </div>
                </el-form-item>
            </el-form>
            <refund v-if="form.type == 1" :active="active" :show.sync="show" :customCompanies="customCompanies" :param="param" :look="look" v-on="$listeners" ref="refund">
                <operating-record :realStep="realStep"></operating-record>
            </refund>
            <channel-adjustment 
                v-if="form.type == 2" 
                :active="active" 
                :show.sync="show" 
                :customCompanies="customCompanies" 
                :param="param" 
                :look="look" 
                :typeName="typeName"
                v-on="$listeners" ref="refund">
                <operating-record :realStep="realStep"></operating-record>
            </channel-adjustment>
			<regulation v-if="form.type == 3" :active="active" :show.sync="show" :customCompanies="customCompanies" :param="param" :look="look" v-on="$listeners" ref="regulation">
                <operating-record :realStep="realStep"></operating-record>
            </regulation>
            <service-charge 
                v-if="form.type == 4" 
                :active="active" 
                :show.sync="show" 
                :customCompanies="customCompanies" 
                :param="param" 
                :look="look" 
                :typeName="typeName"
                v-on="$listeners" ref="servicechage">
                <operating-record :realStep="realStep"></operating-record>
            </service-charge>
            <other-apply 
                v-if="form.type == 5" 
                :active="active" 
                :show.sync="show" 
                :customCompanies="customCompanies" 
                :param="param" 
                :look="look"
                :typeName="typeName"
                v-on="$listeners" ref="refund">
                <operating-record :realStep="realStep"></operating-record>
            </other-apply>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from "../../../store/api";
import { mapActions, mapGetters } from 'vuex'
import { workflow } from "src/api"
import refund from './knotty/refund'
import ServiceCharge from './knotty/ServiceCharge'
import ChannelAdjustment from './knotty/ChannelAdjustment'
import OtherApply from './knotty/OtherApply'
import regulation from './knotty/regulation'
import operatingRecord from './knotty/operatingRecord'

export default {
    components: {
        refund,
        ServiceCharge,
        ChannelAdjustment,
        OtherApply,
        regulation,
        operatingRecord
    },
    data() {
        return {
            active: 1,
            show: false,
            form: {
                type: 0
            },
            rules: {
                type: [
                    { required: true, message: "请选择申请类型", trigger: "change" }
                ]
            },
            list: [
                {
                    text: '客户退款申请（充值冲正）',
                    value: 1
                },
                {
                    text: '渠道调账申请（充值冲正）',
                    value: 2
				},
				// {
                //     text: '商户间余额调账（充值冲正）',
                //     value: 3
                // },
                {
                    text: '服务费调账申请（充值冲正）',
                    value: 4
                },
                {
                    text: '通用（充值冲正）',
                    value: 5
                }
            ],
            stepList: [],
            realStep: [],
            param: {},
            look: false
        }
    },
    computed: {
        ...mapGetters({
            customCompanies: "customCompanies"
        }),
        isCreate() {
            return this.active == 1 && !this.look
        },
        typeName() {
            let list = this.list.filter(item => {
                return item.value === this.form.type
            })
            return list.length ? list[0].text : ""
        }
    },
    mounted() {
        this.getCustomCompanies()
    },
    methods: {
        ...mapActions([
            'getCustomCompanies'
        ]),
        transmit(a) {
            Object.assign(this, a)
            // this.getStep()
            switch (this.param.businessType) {
              	case 'puzzle-customer-flow':
               		this.form.type = 1;
                       break;
                case 'puzzle-channel-flow':
               		this.form.type = 2;
                       break;
				case 'puzzle-merchant-flow':
               		this.form.type = 3;
               		break;
              	case 'puzzle-service-flow':
               		this.form.type = 4;
                   break;
                case 'puzzle-others-flow':
               		this.form.type = 5;
				   break;
				default: 
					break;
            }
            this.realStep = []
            if(this.param.processInstanceId) {
                Promise.all([
                    get(workflow.getProcessAllProgress, { processInstanceId: this.param.processInstanceId }),
                    get(workflow.getProcessCurrentProgress, { processInstanceId: this.param.processInstanceId })
                ]).then(data => {
                    this.stepList = []
                    data[0].default.forEach((e, i) => {
                        this.stepList.push(Object.assign(data[1][i] ? data[1][i] : {}, e))
                    })
                    this.active = data[1].length + (this.look || this.param.finishedStatus == 'FINISHED' ? 0 : 1)
                    this.realStep = JSON.parse(JSON.stringify(data[1]))
                    if(this.param.finishedStatus == 'FINISHED') {
                        let rejectStep = this.stepList[this.active - 1]
                        rejectStep.activityName = `${rejectStep.activityName}（${rejectStep.operate}）`
                    }
                })
            }
            else {
                this.$nextTick(() => {
                    if(this.$refs.radioDiv && this.$refs.radioDiv[0]) {
                        this.form.type = parseInt(this.$refs.radioDiv[0].attributes['data-value'].value)
                    }
                    else {
                        this.form.type = 1
                    }
                    this.active = 1
                    this.getStep()
                })
            }
        },
        getStep() {
            let processTypeKey
            switch (this.form.type) {
                case 1:
                    processTypeKey = 'puzzle-customer-flow'
                    break;
                case 2:
                    processTypeKey = 'puzzle-channel-flow'
                    break;
                case 3:
                    processTypeKey = 'puzzle-merchant-flow'
                    break;
                case 4:
                    processTypeKey = 'puzzle-service-flow'
                    break;
                case 5:
                    processTypeKey = 'puzzle-others-flow'
                    break;
                default:
                    processTypeKey = 'puzzle-customer-flow'
                    break;
            }
            get(workflow.getProcessAllProgressByTypeKey, { processTypeKey }).then(data => {
                this.stepList = data.default
            })
		}
    }
}
</script>
<style scoped>
.tip {
    margin: 20px 0px 10px 30px;
    color: red;
}
.form_input {
    width: 400px;
}
.up_icon {
    width: 228px;
    height: 124px;
    background-image: url(../../../image/upload.png);
    background-size: 41px 33px;
    background-position: center 20px;
    background-repeat: no-repeat;
    padding-top: 70px;
    border: 1px solid #D9D9D9;
}
.up_icon > div:nth-child(1) {
    text-align: center;
    font-size: 12px;
    color: #666666;
}
.up_icon > div:nth-child(2) {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
</style>
