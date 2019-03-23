<template>
    <div class="bg-white">
        <div class="widget-header">
            <h4 class="widget-title">修改已有合同</h4>
        </div>
        <div class="widget-body">
            <div class="widget-main">
                <el-steps :active="active" simple>
                    <el-step title="选择已有企业"></el-step>
                    <el-step title="选择落地公司"></el-step>
                </el-steps>
                <el-form label-width="200px" :inline="true" :model="ruleForm" ref="contractForm" :rules="rules">
                    <div v-if="active === 1">
                        <h3 class="green">请选择客户企业信息</h3>
                        <el-form-item label="选择已有客户信息" prop="customerId">
                            <el-select style="width:450px;" v-model="ruleForm.customerId" filterable filterable @change="companyChange">
                                <el-option v-for="(item, key) in companyIdentityList" :key="key" :label="item.companyName" :value="item.companyId"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="选择客户合同">
                            <el-select style="width:450px;" v-model="ruleForm.serviceCompanyId" @change="customerChange">
                                <el-option v-for="(item, key) in customerServiceCompanyList" :key="key" :label="item.text" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <hr>
                        <contractOption :contractModel="saleContract" :ruleForm="ruleForm"></contractOption>
                        <el-form-item label="客户类型" prop="originalType">
                            <el-radio-group v-model="ruleForm.originalType" :disabled="true">
                                <el-radio v-for="(item, key) in originalTypeList" :key="key" :label="item.value">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <template v-if="ruleForm.originalType == 20">
                            <el-form-item label="代理商名称" prop="agentCompanyId" :rules="{ required: true, message: '请选择代理商', trigger: 'change' }">
                                <el-select v-model="ruleForm.agentCompanyId" style="width:900px;" filterable @change="getChargeByName">
                                    <el-option v-for="e in agentList" :key="e.companyId" :label="e.companyName" :value="e.companyId"></el-option>
                                </el-select>
                            </el-form-item>
                        </template>
                        <el-form-item label="客户归属" prop="original">
                            <el-radio-group v-model="ruleForm.original" style="width:1100px;" :disabled="true">
                                <el-radio v-for="(item, key) in originalsList" :key="key" :label="item.value">{{item.text}}</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="付款方式" prop="vciPayType">
                            <el-select style="width:450px;" v-model="ruleForm.vciPayType">
                                <el-option v-for="(item, key) in vciPayTypeList" :key="key" :label="item.text" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="发票类型" prop="invoiceType">
                            <el-select style="width:450px;" v-model="ruleForm.invoiceType">
                                <el-option v-for="(item, key) in invoiceTypeList" :key="key" :label="item.text" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="结算日期" prop="vciSettleExp" v-if="ruleForm.vciPayType == 30" :rules="{required: true, message: '请输入结算日期', trigger: 'blur'}">
                            <el-input v-model="ruleForm.vciSettleExp" style="width:450px;">
                                <template slot="prepend">
                                    甲乙双方确认以每月
                                </template>
                                <template slot="append">
                                    日为结算日期
                                </template>
                            </el-input>
                        </el-form-item>
                    </div>
                    <div v-if="active === 2">
                        <companyInfo :ruleForm="ruleForm" :serviceFeeList="serviceFeeList" :goodsList="goodsList" :chargeByName="chargeByName" :showAddBtn="ruleForm.contracts.length" :showDelBtn="ruleForm.contracts.length"></companyInfo>
                    </div>
                </el-form>
                <hr>
                <div class="wizard-actions">
                    <el-button @click="prev" v-if="active === 2">上一步</el-button>
                    <el-button type="primary" @click="backToList('save')">保存并返回</el-button>
                    <el-button type="success" @click="next" v-if="active === 1">下一步</el-button>
                    <el-button type="success" @click="submit" v-if="active === 2">提交</el-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import companyInfo from './components/companyInfo.vue'
import options from '../../component/options.vue'
import checkboxs from '../../component/checkboxs.vue'
import radios from '../../component/radios.vue'
import contractOption from './components/contractOption.vue' // 合同选项
import { mapGetters } from 'vuex';
import { get, post, postWithErrorCallback } from "../../store/api"
import { showNotify } from "../../plugin/utils-notify";
import _ from 'lodash'
export default {
    components: { companyInfo, options, checkboxs, radios, contractOption },
    data() {
        return {
            active: 1,
            ruleForm: {
                customerId: '', // 客户信息
                customerName: '', // 客户名称
                serviceCompanyId: '', // 选择客户合同
                contractTplId: '', // 合同模板
                contractType: '', // 客户类型
                contractStartDate: '', // 合同期限 开始日期
                contractEndDate: '', // 合同期限 结束日期
                serviceType: [], // 服务类型
                original: '', // 客户归属
                originalType: '', // 客户类型
                agentCompanyId: '', // 代理商
                invoiceType: '', // 发票类型
                vciPayType: '', // 付款方式
                vciSettleExp: '', // 结算日期
                serviceCompanyList: [],
                contracts: [],
                receiveAttachments: [],
            },
            instanceId: '',
            value: '', // 合同期限
            serviceFeeList: [], // 缓存服务商报价数据
            chargeByName: '', // 渠道经理名称
            goodsList: [], // 业务方案
            rules: {
                customerId: [
                    { required: true, message: '请选择客户企业信息', trigger: 'change' }
                ],
                contractTplId: [
                    { required: true, message: '请选择合同模板', trigger: 'change' }
                ],
                contractType: [
                    { required: true, message: '请选择客户行业类型', trigger: 'change' }
                ],
                contractStartDate: [
                    { required: true, message: '请选择合同期限', trigger: 'blur' }
                ],
                customIndustry: [
                    { required: true, message: '请输入客户从事行业', trigger: 'blur' }
                ],
                serviceType: [
                    { type: 'array', required: true, message: '请选择服务类型', trigger: 'change' },
                    { type: 'array', max: 5, message: '最多只能选5个', trigger: 'change' }
                ],
                originalType: [
                    { required: true, message: "请选择客户类型", trigger: "change" }
                ],
                original: [
                    { required: true, message: "请选择客户归属", trigger: "change" }
                ],
                invoiceType: [
                    { required: true, message: '请选择发票类型', trigger: 'change' }
                ],
                vciPayType: [
                    { required: true, message: '请选择付款方式', trigger: 'change' }
                ],
            },
        }
    },
    computed: {
        ...mapGetters({
            customerCompaniesList: 'customerCompaniesList',
            companyIdentityList: 'companyIdentityList',
            customerServiceCompanyList: 'customerServiceCompanyList',
            contractTplList: 'contractTplList',
            saleContract: 'saleContract',
            industryTypeList: 'industryTypeList',
            serviceTypeList: 'serviceTypeList',
            originalTypeList: 'originalTypeList',
            originalsList: 'originalsList',
            invoiceTypeList: 'invoiceTypeList',
            vciPayTypeList: 'vciPayTypeList',
            saleContractRules: 'saleContractRules',
            agentList: 'agentList',
        })
    },
    methods: {
        prev() {
            if (this.active !== 1) this.active--
        },
        next() {
            this.$refs['contractForm'].validate(valid => {
                if(valid && this.active !== 2) {
                    this.active++
                    this.save()
                }
            })
        },
        save() {
            let url = '/api/opencrm/workflow/save_draft';
            let form = {
                datas: this.ruleForm,
                instanceId: this.instanceId,
                workflowType: 'update_sale_contract'
            };
            return new Promise((resolve, reject) => {
                post(url, form).then(res => {
                    resolve('save')
                    this.instanceId = res.id
                })
            })
        },
        submit() {
            if (!this.ruleForm.contracts.length) {
                showNotify('error', '请添加落地公司！')
                return;
            }
            this.$refs['contractForm'].validate(valid => {
                if (valid) {
                    this.save().then(result => {

                        // 上传之前帮巨懒的后端处理一下数据
                        this.setServiceType()
                        // 上传之前处理一下前端服务商的坑的数据
                        // this.setServiceFeeList()

                        const url = '/api/contract-web/contract/build-contract-attachments'
                        const param = {
                            datas: this.ruleForm,
                            instanceId: this.instanceId,
                            workflowType: 'update_sale_contract',
                        }
                        post(url, param).then(res => {
                            this.$alert('您的合同表单已提交，请在列表进行合同下载，谢谢！', '', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.backToList('list')
                                }
                            });
                        })
                    })
                }
            })
        },
        // getServiceType(list) {
        //     console.log(list)
        //     let arr = []
        //     list.forEach(el => {
        //         arr.push(el.serviceId)
        //     })
        //     this.ruleForm.serviceType = arr
        // },
        getServiceType(list) {
            const serviceType = list;
            let arr = [];
            if (serviceType && serviceType.length) {
                serviceType.forEach(item => {
                    if (item && item.serviceId) {
                        arr.push(item.serviceId)
                    }
                })
            }
            if (arr.length > 0) {
                this.ruleForm.serviceType = arr;
            }
        },
        getDataValue() {
            // const startDate = _.clone(this.ruleForm.startDate);
            // const endDate = _.clone(this.ruleForm.endDate);
            // this.ruleForm.dataValue = [startDate, endDate]
        },
        getDetail() {
            get(`/api/opencrm/workflow/details/${this.ruleForm.instanceId}`).then(res => {
                this.instanceId = res.id;
                this.ruleForm = _.assign({}, this.ruleForm, res.datas)
                this.getChargeByName()
                this.getServiceType(this.ruleForm.serviceType)
                this.getDataValue()
                if(this.ruleForm.serviceCompanyId) {
                    this.getGoodsList(this.ruleForm.serviceCompanyId)
                }
                if(this.ruleForm.customerId) {
                    this.$store.dispatch('getCustomerServiceCompanyList', this.ruleForm.customerId)
                }
            })
        },
        companyChange(ev) {
            const obj = this.companyIdentityList.find(item => {
                return item['companyId'] === ev
            })
            this.ruleForm.customerName = obj.companyName
            this.ruleForm.original = obj.original
            this.ruleForm.originalType = obj.originalType
            this.$store.dispatch('getCustomerServiceCompanyList', ev)
            this.ruleForm.serviceCompanyId = ''
        },
        getChargeByName(ev) {
            const companyId = ev || this.ruleForm.agentCompanyId
            if (!companyId || !this.agentList.length) return;
            const obj = this.agentList.find(el => {
                return el.companyId === companyId
            })
            this.chargeByName = obj.chargeByName
        },
        getGoodsList(companyId) {
            get('/api/salemgt/common/service-company/goods', {
                serviceCompanyId: companyId
            }).then(result => {
                this.goodsList = result
                if (this.ruleForm.contracts[0]) {
                    this.ruleForm.contracts[0].goodsList = result
                }
            })
        },
        customerChange(ev) {
            const url = '/api/contract-web/contract/sale-contract-detail'
            const param = {
                customerId: this.ruleForm.customerId,
                serviceCompanyId: this.ruleForm.serviceCompanyId,
            }
            post(url, param).then(res => {
                if (!res.serviceTypeList) {
                    res.serviceType = []
                } else {
                    this.getServiceType(res.serviceTypeList)
                }
                this.ruleForm = _.assign({}, this.ruleForm, res)
                this.ruleForm.serviceCompanyId = ev
                this.ruleForm.contractType = res.cotractType
                this.ruleForm.dataValue = [res.startDate, res.endDate]
                this.getGoodsList(ev)
            })
        },
        backToList(path) {
            if (path === 'save') {
                this.save()
            }
            this.$router.replace({
                path: 'list'
            })
        },
        autoFill(val) {
            console.log(val)
            // this.ruleForm.contractStartDate = val[0];
            // this.ruleForm.contractEndDate = val[1];
        },
        setServiceType() {
            let arr = []
            const serviceType = this.ruleForm.serviceType
            this.serviceTypeList.forEach(item => {
                serviceType.forEach(el => {
                    if (item.serviceId === el) {
                        arr.push(item)
                    }
                })
            })
            this.ruleForm.serviceType = arr
        },
        // setServiceFeeList() {
        //     this.serviceFeeList.forEach((item, key) => {
        //         if (!item) return;
        //         let contracts = this.ruleForm.contracts[key];
        //         contracts.serviceFeeContent = item.serviceFeeContent;
        //         contracts.serviceFeeContent2 = item.serviceFeeContent2;
        //     })
        // }
    },
    mounted() {
        this.$store.dispatch('getCompanyIdentityListForUpdate')
        this.$store.dispatch('getOriginalTypeList')
        this.$store.dispatch('getOriginalsList')
        this.$store.dispatch('getInvoiceTypeList')
        this.$store.dispatch('getVciPayTypeList')
        this.$store.dispatch('getAgentList')
        this.$refs['contractForm'].resetFields()
        this.ruleForm.instanceId = this.$route.query.id
        if (this.ruleForm.instanceId) {
            this.getDetail()
        }
    }
}
</script>
