<template>
  <div class="bg-white">
    <div class="widget-header">
      <h4 class="widget-title">补签合同</h4>
    </div>
    <div class="widget-body">
      <div class="widget-main">
        <el-steps :active="active"
          simple>
          <el-step title="选择已有企业"></el-step>
          <el-step title="选择落地公司"></el-step>
          <el-step title="附加条款"></el-step>
          <el-step v-if="max === 4" title="C端签约设置"></el-step>
        </el-steps>
        <el-form label-width="200px"
          :inline="true"
          :model="contractModel.contractForm"
          ref="contractForm"
          :rules="check.rules">
          <div v-if="active === 1">
            <h3 class="green">请选择客户企业信息</h3>
            <el-form-item label="选择已有客户信息"
              prop="customerId">
              <el-select style="width:450px;"
                v-model="contractModel.contractForm.customerId"
                filterable
                @change="companyChange">
                <el-option v-for="(item, key) in companyIdentityList"
                  :key="key"
                  :label="item.name"
                  :value="item.id"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="客户性质"
              prop="customNature">
              <el-radio-group v-model="contractModel.contractForm.customNature">
                <el-radio v-for="(item, key) in optionModel.customNatureList"
                  :key="key"
                  :label="item.value">{{item.text}}</el-radio>
              </el-radio-group>
              <i class="el-icon-question ml10"
                title="非直接用工企业：人力资源公司、服务外包公司、城市合伙人公司、第三方平台等"></i>
            </el-form-item>
            <hr>
            <contractOption :contractModel="contractModel"></contractOption>
            <el-form-item label="客户类型"
              prop="originalType">
              <el-radio-group v-model="contractModel.contractForm.originalType"
                disabled
                style="width:450px;">
                <el-radio v-for="(item, key) in originalTypeList"
                  :key="key"
                  :label="item.value">{{item.text}}</el-radio>
              </el-radio-group>
            </el-form-item><br>
            <template v-if="contractModel.contractForm.originalType == 20">
              <el-form-item label="代理商名称">
                <el-input v-model="contractModel.contractForm.agentCompanyName"
                  disabled
                  style="width:450px;"></el-input>
              </el-form-item>
              <!-- <el-form-item label="代理商名称" prop="agentCompanyId" :rules="{ required: true, message: '请选择代理商', trigger: 'change' }">
                                <el-select v-model="contractModel.contractForm.agentCompanyId" style="width:900px;" filterable @change="agentChange" disabled>
                                    <el-option v-for="e in agentList" :key="e.companyId" :label="e.companyName" :value="e.companyId"></el-option>
                                </el-select>
                            </el-form-item> -->
            </template>
            <el-form-item label="客户归属"
              prop="original">
              <el-radio-group v-model="contractModel.contractForm.original"
                style="width:1100px;"
                :disabled="true">
                <el-radio v-for="(item, key) in originalsList"
                  :key="key"
                  :label="item.value">{{item.text}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="付款方式"
              prop="vciPayType">
              <el-select style="width:450px;"
                v-model="contractModel.contractForm.vciPayType">
                <el-option v-for="(item, key) in vciPayTypeList"
                  :key="key"
                  :label="item.text"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="发票类型"
              prop="invoiceType">
              <el-select style="width:450px;"
                v-model="contractModel.contractForm.invoiceType">
                <el-option v-for="(item, key) in invoiceTypeList"
                  :key="key"
                  :label="item.text"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="结算日期"
              prop="vciSettleExp"
              v-if="contractModel.contractForm.vciPayType == 30"
              :rules="{required: true, message: '请输入结算日期', trigger: 'blur'}">
              <el-input v-model="contractModel.contractForm.vciSettleExp"
                style="width:450px;">
                <template slot="prepend">
                  甲乙双方确认以每月
                </template>
                <template slot="append">
                  日为结算日期
                </template>
              </el-input>
            </el-form-item>
          </div>
          <companyInfo ref="companyInfo" :ruleForm="contractModel.contractForm"
            :serviceFeeList="serviceFeeList"
            :chargeByName="chargeByName"
            v-if="active === 2"></companyInfo>
          <additionalClause :ruleForm="contractModel.contractForm"
            v-if="active === 3"></additionalClause>
          <setEContract :contractForm="contractModel.contractForm"
            :type="1"
            v-if="active === 4"></setEContract>
        </el-form>
        <hr>
        <div class="wizard-actions">
          <el-button @click="prev"
            v-if="active !== 0">上一步</el-button>
          <el-button type="primary"
            @click="backToList('save')">保存并返回</el-button>
          <el-button type="success"
            @click="next"
            v-if="active !== max">下一步</el-button>
          <el-button type="success"
            @click="submit"
            v-if="active === max">提交</el-button>
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
import setEContract from './components/setEContract.vue'  // c端签约设置
import { mapGetters } from 'vuex';
import { get, post, postWithErrorCallback } from "../../store/api"
import { showNotify } from "../../plugin/utils-notify";
import _ from 'lodash'
import optionModel from '../../model/option/optionModel'
import additionalClause from './components/additionalClause.vue' // 合同附加条款
import ContractModel from '../../model/contract/newContract/ContractModel' // 数据模型
import Check from '../../model/contract/newContract/check.js' // 检测数据模型
export default {
    components: { companyInfo, options, checkboxs, radios, contractOption, additionalClause, setEContract },
    data() {
        return {
            contractModel: new ContractModel(),
            check: new Check(),
            active: 1,
            ruleForm: {
                customerId: '', // 客户信息id
                customerName: '', // 客户名称
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
                // 电子签约设置
                signForm: '',
                signPayForm: '',
                passportType: 1,
                smsType: 1,
                signMode: '',
                customNature: '', // 客户性质
                payAndInvoiceSame: '',
                customUnderAttachList: []
            },
            instanceId: '',
            value: '', // 合同期限
            serviceFeeList: [], // 缓存服务商报价数据
            rules: {
                customerId: [
                    { required: true, message: '请选择客户企业信息', trigger: 'change' }
                ],
                customNature: [
                    { required: true, message: '请选择客户性质', trigger: 'change' }
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
                // 电子签约
                signPayForm: [
                    { required: true, message: "请选择是否先签后发", trigger: "change" }
                ],
                signForm: [
                    { required: true, message: "请选择签约介质", trigger: "change" }
                ],
                smsType: [
                    { required: true, message: "请选择是否短信通知", trigger: "change" }
                ],
                passportType: [
                    { required: true, message: "请选择是否上传身份证", trigger: "change" }
                ],
                signMode: [
                    { required: true, message: "请选择签署方式", trigger: "change" }
                ]
            },
            optionModel: new optionModel(),
						max: 3,
        }
    },
    computed: {
        ...mapGetters({
            customerCompaniesList: 'customerCompaniesList',
            companyIdentityList: 'companyIdentityList',
            contractTplList: 'contractTplList',
            industryTypeList: 'industryTypeList',
            serviceTypeList: 'serviceTypeList',
            originalTypeList: 'originalTypeList',
            originalsList: 'originalsList',
            invoiceTypeList: 'invoiceTypeList',
            vciPayTypeList: 'vciPayTypeList',
            agentList: 'agentList',
        })
    },
    methods: {
        prev() {
            if (this.active !== 1) this.active--
        },
        next() {
          // 验证服务费率组件并存值
          let check = true
          if(this.active === 2) {
            if (this.contractModel.contractForm.contracts.length) {
              this.contractModel.contractForm.contracts.forEach((item, i) => {
                const serviceFeeInterval = this.$refs['companyInfo'].$refs['serviceFeeInterval'][i].serviceFeeInterval
                if (serviceFeeInterval
                  && (serviceFeeInterval.secondType == 3
                    || serviceFeeInterval.secondType == 4)) {
                      this.$refs['companyInfo'].$refs['serviceFeeInterval'][i].validate((valid) => {
                        if (valid) {
                          this.contractModel.contractForm.contracts[i].serviceFeeInterval = valid.serviceFeeInterval
                          check = true
                        } else {
                          check = false
                        }
                      })
                    }
              })
            }
          }
          if (!check) {
            console.log('验证不通过~')
            return
          }
            this.$refs['contractForm'].validate(valid => {
                if(valid && this.active !== 4) {
                    this.active++
                    this.save()
                }
            })
        },
        save() {
            let url = '/api/opencrm/workflow/save_draft';
            let form = {
                datas: this.contractModel.contractForm,
                instanceId: this.instanceId,
                workflowType: 'add_sale_contract'
            };
            return new Promise((resolve, reject) => {
                post(url, form).then(res => {
                    resolve('save')
                    this.instanceId = res.id
                })
            })
        },
        submit() {
            if (!this.contractModel.contractForm.contracts.length) {
                showNotify('error', '请添加落地公司！')
                return;
            }
            this.$refs['contractForm'].validate(valid => {
                if (valid) {

                    // 请选择合同附件那一步 需要上传清单的判断
                    if (this.contractModel.contractForm.payAndInvoiceSame === '0' && this.contractModel.contractForm.customUnderAttachList.length  === 0) {
                        showNotify('error', '请上传清单');
                        return;
                    }

                    this.save().then(result => {

                        // 上传之前帮巨懒的后端处理一下数据
                        this.setServiceType()
                        // 上传之前处理一下前端服务商的坑的数据
                        // this.setServiceFeeList()

                        const url = '/api/contract-web/contract/build-contract-attachments'
                        const param = {
                            datas: this.contractModel.contractForm,
                            instanceId: this.instanceId,
                            workflowType: 'add_sale_contract',
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
        getServiceType() {
            const serviceType = this.ruleForm.serviceType;
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
        getDetail() {
            get(`/api/opencrm/workflow/details/${this.ruleForm.instanceId}`).then(res => {
                this.instanceId = res.id
                this.ruleForm = _.assign({}, this.ruleForm, res.datas)
                this.getChargeByName()
                this.getServiceType()
            })
        },
        companyChange(ev) {
            const obj = this.companyIdentityList.find(item => {
                return item['id'] === ev
            })
            this.contractModel.contractForm.customerName = obj.name
            this.contractModel.contractForm.original = obj.original
            this.contractModel.contractForm.originalType = obj.originalType
            this.contractModel.contractForm.agentCompanyId = obj.agentCompanyId
            this.contractModel.contractForm.agentCompanyName = obj.agentCompanyName
            this.$store.dispatch('getContractTplList', this.contractModel.contractForm.agentCompanyId)
						this.checkTemplateGroup(ev)
        },
				// 根据companyId判断是否存在合同模板组
				// 有模版则不需要 C端签约
				checkTemplateGroup(companyId) {
					get('/api/econtract/template-group/check/by-company', {
						companyId,
					}).then((res) => {
						res ? this.max = 3 : this.max = 4
					})
				},
        agentChange() {
            this.getChargeByName()
            this.ruleForm.contracts = []
        },
        getChargeByName(ev) {
            const companyId = ev || this.ruleForm.agentCompanyId
            if (!companyId || !this.agentList.length) return;
            const obj = this.agentList.find(el => {
                return el.companyId === companyId
            })
            this.chargeByName = obj.chargeByName
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
            this.ruleForm.contractStartDate = val[0];
            this.ruleForm.contractEndDate = val[1];
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
        this.$store.dispatch('getCompanyIdentityListForAdd')
        this.$store.dispatch('getOriginalTypeList')
        this.$store.dispatch('getOriginalsList')
        this.$store.dispatch('getInvoiceTypeList')
        this.$store.dispatch('getVciPayTypeList')
        this.$store.dispatch('getAgentList')
        this.$refs['contractForm'].resetFields()
        // this.ruleForm.instanceId = this.$route.query.id
        // if (this.ruleForm.instanceId) {
        //     this.getDetail()
        // }
        let id = this.$route.query.id;
        if (id) {
            this.instanceId = id;
            this.contractModel.getContractDetail(id, null, 'create').then(() => {
                // 返回数据处理服务类型
                this.getServiceType()
								this.checkTemplateGroup(this.contractModel.contractForm.customerId)
            });
        }
        this.optionModel.getCustomNatureList()
    }
}
</script>
