<template>
    <div>
        <h3 class="green">请与客户协商C端签约方式</h3>
        <!-- <el-form-item label="先签约后发放" prop="signPayForm">
            <el-radio v-for="e in signPayList" :key="e.value" v-model="contractForm.signPayForm" :label="e.value">{{e.text}}</el-radio>
        </el-form-item><br> -->
				<el-form-item label="是否需要技术对接" prop="isFromOutApp">
            <el-radio
							v-for="e in FromOutAppList"
							v-model="contractForm.isFromOutApp"
							:key="e.value"
							:label="e.value"
						>{{e.text}}
            </el-radio>
        </el-form-item>
        <br v-if="contractForm.isFromOutApp === 0">
        <el-form-item
						label="签约介质"
						v-if="contractForm.isFromOutApp === 0"
						prop="signForm">
            <el-radio
								v-for="e in signTypeList"
								:key="e.value"
								v-model="contractForm.signForm"
								:label="e.value"
						>{{e.text}}
            </el-radio>
        </el-form-item>
        <br v-if="contractForm.isFromOutApp === 0">
        <el-form-item
						label="c端短信通知"
						v-if="contractForm.isFromOutApp === 0"
						prop="smsType">
            <div style="width:300px; display: inline-block;">
                <el-radio
										v-for="e in smsTypeList"
										:key="e.value"
										v-model="contractForm.smsType"
										:label="e.value"
                    disabled
								>{{e.text}}
                </el-radio>
            </div>
            <el-button class="ml100" type="text" @click="show = true">
                <i class="el-icon-question"></i>
                <span class="bottom-line">短信示例</span>
            </el-button>
        </el-form-item>
        <br v-if="contractForm.isFromOutApp === 0">
        <el-form-item
						label="c端上传身份证"
						v-if="contractForm.isFromOutApp === 0"
						prop="passportType">
            <el-radio
								:disabled="contractForm.signForm === '2'"
								v-for="e in passportTypeList"
								:key="e.value"
                v-model="contractForm.passportType"
								:label="e.value"
						>{{e.text}}
            </el-radio>
        </el-form-item>
        <br v-if="contractForm.isFromOutApp === 0">
        <el-form-item
						label="c端签署方式"
						v-if="contractForm.isFromOutApp === 0"
						prop="signMode">
            <div style="width:300px; display: inline-block;">
                <el-radio
										v-for="e in signModeList"
										:key="e.value"
										v-model="contractForm.signMode"
										:label="e.value"
								>{{e.text}}
                </el-radio>
            </div>
            <el-button class="ml100" type="text" @click="examShow = true">
                <i class="el-icon-question"></i>
                <span class="bottom-line">查看图例</span>
            </el-button>
        </el-form-item>
        <!-- <br>
        <el-form-item label="选择签约落地公司" required v-if="!type || contractForm.signMode == '0'">
            <el-checkbox-group v-model="companyIdList">
                <div v-for="e in companyList" :key="e.serviceCompanyId">
                    <el-checkbox
                        :label="e.serviceCompanyId"
                        :disabled="originIdList.includes(e.serviceCompanyId)">
                        {{e.serviceCompanyName}}
                    </el-checkbox>
                </div>
            </el-checkbox-group>
        </el-form-item> -->
        <h3 class="green" v-if="type != 1">爱收入发岗位</h3>
        <el-form-item label="接入【爱收入】发布岗位" v-if="type != 1" prop="jobMatch" :rules="{required: true, message: '请选择是否接入【爱收入】发布岗位', trigger: 'change'}">
            <el-radio-group v-model="contractForm.jobMatch">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
            </el-radio-group>
            <el-tooltip class="item" effect="dark" content="开启后，企业服务端将开放岗位服务入口，企业客户可以发布岗位招聘，完善证据链" placement="top-start">
                <el-button class="ml100" type="text">
                    <i class="el-icon-question"></i>
                </el-button>
            </el-tooltip>
        </el-form-item>
        <!-- <pre>{{contractForm}}</pre> -->

        <el-dialog title="短信示例" :visible.sync="show" width="550px">
            <div class="text_title">1.短信网页链接</div>
            <div>您有由爱员工测试 的服务商发起的合同等待签署，请点击链接
                <a style="color: #0283fb;" href="http://aiyuangong.com" target="_bank">http://aiyuangong.com</a>
                完成签约。
            </div>
            <div class="text_title">2.小程序</div>
            <div>您有由爱员工测试 的服务商发起的合同等待签署，请您登录微信小程序『爱员工小助手』进行签约。</div>
            <span slot="footer">
                <el-button @click="show = false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog title="查看图例" :visible.sync="examShow" width="800px">
            <div class="exam_box">
                <div>方案一：屏幕手签</div>
                <div>方案二：勾选“我同意”并自动签</div>
            </div>
            <div class="text_title">区别</div>
            <div class="text_flex">
                <div>方案一：屏幕手签</div>
                ：需要C端用户手写签字。一次只与一个落地公司签约；当有多个落地公司时，需分别签约，操作多次。
            </div>
            <div class="text_flex">
                <div>方案二：勾选“我同意”并自动签</div>
                ：需要C端用户勾选同意，即可自动签约。一次可同时与多个落地公司签约，且只需一次操作。
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    import {get} from '../../../store/api'
    import {contract} from "src/api"

    export default {
        props: ['contractForm', 'type'],
        data() {
            return {
								FromOutAppList: [
										{
                        value: 1,
                        text: '是'
                    },
                    {
                        value: 0,
                        text: '否'
                    }
								],
                signPayList: [
                    {
                        value: '1',
                        text: '是'
                    },
                    {
                        value: '2',
                        text: '否'
                    }
                ],
                signTypeList: [
                    {
                        value: '1',
                        text: '短信网页链接'
                    },
                    {
                        value: '2',
                        text: '小程序（微信搜索小程序“爱员工小助手”）'
                    }
                ],
                smsTypeList: [
                    {
                        value: '1',
                        text: '是'
                    },
                    {
                        value: '2',
                        text: '否'
                    }
                ],
                passportTypeList: [
                    {
                        value: '1',
                        text: '是'
                    },
                    {
                        value: '2',
                        text: '否'
                    }
                ],
                signModeList: [
                    {
                        value: '1',
                        text: '屏幕手签'
                    },
                    {
                        value: '0',
                        text: '勾选“我同意”并自动签'
                    }
                ],
                companyList: [], // 所有的公司信息
                companyIdList: [], // 中转所用的model
                originIdList: [], // 落地公司来源
                isInit: true,
                show: false,
                examShow: false
            }
        },
        watch: {
            companyIdList() {
                this.contractForm.econtractServiceCompanyList = this.companyList.map((item) => {
                    item.selected = this.companyIdList.includes(item.serviceCompanyId)
                    return {
                        ...item
                    }
                })
            },
            'contractForm.signForm'(data) {
                if (data === '2') {
                    this.contractForm.passportType = '1'
                }
            },
						// 经过激烈探讨后，若需要技术对接选是则全部置空，否则赋默认值
						'contractForm.isFromOutApp'(val) {
							// if (val == 1) {
							// 	this.contractForm.signForm = ''
							// 	this.contractForm.smsType = ''
							// 	this.contractForm.passportType = ''
							// 	this.contractForm.signMode = ''
							// } else {
							// 	this.contractForm.signForm = '2'
							// 	this.contractForm.smsType = '1'
							// 	this.contractForm.passportType = '1'
							// 	this.contractForm.signMode = this.contractForm.contracts.length > 1 ? '0' : '1'

							// }
							this.initEContractForm(val)
						}
        },
        mounted() {
						// // 如果 不需要技术对接，才去赋值
						// if (this.contractForm.isFromOutApp == 0) {
						// 	this.contractForm.signForm = '2'
						// 	this.contractForm.smsType = '1'
						// 	// if (!this.contractForm.jobMatch) {
						// 	// 	this.contractForm = Object.assign(this.contractForm, { jobMatch: '1' })
						// 	// }
						// 	this.contractForm.passportType = this.contractForm.passportType || '1'
						// 	if (!this.contractForm.signMode) {
						// 		this.contractForm.signMode = this.contractForm.contracts.length > 1 ? '0' : '1'
						// 	}
						// }
						this.initEContractForm(this.contractForm.isFromOutApp, true)
            this.contractForm.econtractServiceCompanyList = this.contractForm.econtractServiceCompanyList || []
            this.contractForm.econtractServiceCompanyList.forEach(e => {
                this.companyIdList.push(e.serviceCompanyId)
            })
            this.$forceUpdate()
            this.contractForm.contracts.forEach(e => {
                this.companyList.push({
                    serviceCompanyId: e.serviceCompanyId,
                    serviceCompanyName: e.serviceCompanyName,
                    selected: true
                })
                !this.companyIdList.includes(e.serviceCompanyId) && this.companyIdList.push(e.serviceCompanyId)
                this.originIdList.push(e.serviceCompanyId)
            })
            if (this.type) {
                get(contract.customServiceCompanyOptions, {
                    customCompanyId: this.contractForm.customerId
                }).then(data => {
                    data.forEach(e => {
                        if (!this.companyList.filter(ev => ev.serviceCompanyId == e.companyId).length) {
                            this.companyList.push({
                                serviceCompanyId: e.companyId,
                                serviceCompanyName: e.name,
                                selected: true
                            })
                            this.companyIdList.push(e.companyId)
                        }
                    })
                })
            }
            // if (this.$route.path === '/main/newContract/create_add') {
            //     get(contract.econtractSynParam, {
            //         customerName: this.contractForm.customerName
            //     }).then(data => {
            //         Object.assign(this.contractForm, data)
            //     })
            // }
        },
				methods: {
					initEContractForm(isFromOutApp, isMount = false) {
						const fromOne = {
							signForm: '',
							smsType: '',
							passportType: '',
							signMode: '',
						}
						const fromZero = {
							signForm: '2',
							smsType: '1',
							passportType: '1',
							signMode: this.contractForm.contracts.length > 1 ? '0' : '1',
						}
						if (isFromOutApp === 1) {
							Object.assign(this.contractForm, fromOne)
						} else {
							// 首次mounted 不能覆盖原值
							if (isMount) {
								const {passportType, signMode} = this.contractForm
								fromZero.signMode = signMode || fromZero.signMode
								fromZero.passportType = passportType || fromZero.passportType
							}
							// 补签 C端签署方式为 勾选我同意
							if (this.$route.path === '/main/newContract/create_add') {
								fromZero.signMode = '0'
							}
							Object.assign(this.contractForm, fromZero)
						}
					}
				},
    }
</script>
<style scoped>
    .ml100 {
        margin-left: 100px;
    }

    .text_title {
        font-weight: bold;
        margin: 10px 30px;
    }

    .text_title + div {
        word-break: break-all;
    }

    .exam_box {
        display: flex;
        justify-content: space-around;
        text-align: center;
        font-size: 18px;
        font-weight: bold;
    }

    .exam_box > div {
        width: 320px;
        padding-top: 537px;
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center top;
        background-image: url(../../../image/exam_left.png);
    }

    .exam_box > div:nth-child(2) {
        background-position: center -30px;
        background-image: url(../../../image/exam_right.png);
    }

    .text_flex > div:nth-child(1) {
        display: inline-block;
        font-weight: bold;
    }

    .bottom-line {
        text-decoration: underline;
    }
</style>
