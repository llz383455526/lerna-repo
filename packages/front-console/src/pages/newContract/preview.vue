<template>
  <div>
    <div style="margin:20px 0;"
         v-if="contractModel.status == 'completed'">
      <el-button size="small"
                 @click="backToList">返回</el-button>
    </div>
    <div style="margin:20px 0;"
         v-if="contractModel.status == 'init'">
      <el-button size="small"
                 type="primary"
                 @click="toDetail(contractModel.contractId, 'watch')">送审</el-button>
      <el-button size="small"
                 type="info"
                 @click="toCreate(contractModel.contractId, contractModel.workflowType)">编辑</el-button>
      <el-button size="small"
                 type="danger"
                 @click="closeContract(contractModel.contractId)">删除</el-button>
      <el-button size="small"
                 @click="backToList">返回</el-button>
    </div>
    <div class="widget-box bg-white">
      <div class="widget-header">
        <h4 class="widget-title">创建合同 - {{ contractForm.customerName }}</h4>
      </div>
      <div class="widget-body">
        <div class="widget-main"
             style="font-size: 16px;line-height: 30px;">
          <div class="row"
               style="margin-bottom: 15px;">
            <div class="col-xs-12">
              <h4 class="block green">合同选项</h4>
            </div>
            <div class="col-xs-6">合同模板：{{ contractForm.contractTplName }}</div>
            <div class="col-xs-6">客户行业类型：{{ getText(contractForm.contractType, industryTypeList) }}</div>
            <div class="col-xs-6">客户从事：{{ contractForm.customIndustry }}</div>
            <div class="col-xs-6"
                 v-show="!isChange">合同期限：{{ contractForm.contractStartDate + ' - ' +
              contractForm.contractEndDate }}</div>
            <div class="col-xs-6">版本生效时间：{{ contractForm.versionStartDate || contractForm.contractStartDate | formatTime('yyyy-MM') }}</div>
          </div>
          <div class="row"
               style="margin-bottom: 15px;">
            <div class="col-xs-12">
              <h4 class="block green">销售信息</h4>
            </div>
            <div class="col-xs-6">预估月流水：{{ contractForm.expectedMonthlyFlow }}</div>
            <div class="col-xs-6">预计三万以上比例：{{ contractForm.expectedProportion }}%</div>
            <div class="col-xs-6">销售姓名：{{ contractForm.contractPerson }}</div>
            <div class="col-xs-6">销售联系电话：{{ contractForm.contractTel }}</div>
            <div class="col-xs-6">销售联系邮箱：{{ contractForm.contractEmail }}</div>
            <div class="col-xs-6">合同联系人地址：{{ contractForm.contractAddr }}</div>
            <div class="col-xs-6">客户类型：{{ contractForm.originalTypeName }}</div>
            <div class="col-xs-6">客户归属：{{ contractForm.originalName }}</div>
          </div>
          <div class="row"
               style="margin-bottom: 15px;">
            <div class="col-xs-12">
              <h4 class="block green">客户企业及开票信息</h4>
            </div>
            <div class="col-xs-12">客户性质：{{ getText(contractForm.customNature,
              contractModel.customNatureList) }}</div>
            <div class="col-xs-12">企业对接方式：{{ contractForm.isFromOutApp ? (contractForm.isFromOutApp === '0' ? 'SaaS发放' : 'API发放') : contractForm.isFromOutApp }}</div>
            <div class="col-xs-6">企业名称：{{ contractForm.customerName }}</div>
            <div class="col-xs-6">企业地址：{{ contractForm.areaName }}</div>
            <div class="col-xs-6">法定代表人：{{ contractForm.customLegalPerson }}</div>
            <div class="col-xs-6">系统操作人：{{ contractForm.customCollector }}</div>
            <div class="col-xs-6">操作人手机：{{ contractForm.customCollectorPhone }}</div>
            <div class="col-xs-6">操作人邮箱：{{ contractForm.customMail1 }}</div>
            <div class="col-xs-6">企业负责人：{{ contractForm.companyChargeName }}</div>
            <div class="col-xs-6">负责人手机：{{ contractForm.companyChargePhone }}</div>
            <div class="col-xs-6">负责人邮箱：{{ contractForm.companyChargeMail }}</div>
            <div class="col-xs-6">负责人地址：{{ contractForm.customCollectorAddr }}</div>
            <div class="col-xs-12">
              <hr>
            </div>
            <div class="col-xs-6">开票企业名称：{{ contractForm.invoiceCompanyName }}</div>
            <div class="col-xs-6">开票企业地址：{{ contractForm.invoiceAddress }}</div>
            <div class="col-xs-6">纳税人识别号：{{ contractForm.customTaxIdcd }}</div>
            <div class="col-xs-6">开票企业电话：{{ contractForm.customPhone }}</div>
            <div class="col-xs-6">开户银行名称：{{ contractForm.customBankName }}</div>
            <div class="col-xs-6">银行账号：{{ contractForm.customBankAccount }}</div>
            <div class="col-xs-12">发票类型：{{ getText(contractForm.invoiceType, contractModel.invoiceTypeList)
              }}
              <el-checkbox v-model="contractForm.showSubjectInfo"
                           disabled>合同中显示发票类型</el-checkbox>
            </div>
          </div>
          <div class="row"
               style="margin-bottom: 15px;">
            <div class="col-xs-12">
              <h4 class="block green">落地公司信息</h4>
            </div>
            <div v-for="(formItem, key) in contractForm.contracts"
                 :key="key">
              <div class="col-xs-12">落地公司名称：{{ formItem.serviceCompanyName }}
                <el-checkbox :value="formItem.showServiceCompanyInfo == true"
                             disabled>合同中显示服务商收款账户信息</el-checkbox>
              </div>
              <div class="col-xs-12"
                   v-if="formItem.startDate">合同期限：{{ formItem.startDate + ' 至 ' + formItem.endDate }}</div>
              <div class="col-xs-12">结算方式：{{ getText(formItem.settleType, contractModel.settleTypeList)
                }}</div>
              <div class="col-xs-12">业务方案：{{ getText(formItem.goodsId, formItem.goodsList, 'id', 'name')
                }}</div>
              <div class="col-xs-12">发放方式：{{ getPayMode(formItem.channelTypeList, contractModel.payMode)
                }}</div>
              <div class="col-xs-12">
                <show-service :detail="{serviceFeeContent:formItem.serviceFeeContent,serviceFeeContent2:formItem.serviceFeeContent2}">
                </show-service>
              </div>
              <div class="col-xs-12">服务类型：
                <span v-for="(v, k) in formItem.serviceTypeList"
                      :key="k">
                  {{ v.serviceName }}&nbsp;&nbsp;
                </span>
              </div>
              <template v-if="contractForm.originalType == 20">
                <!--                <div class="col-xs-12">代理商名称：{{ getText(contractForm.agentCompanyId, contractModel.agentList, 'companyId', 'companyName') }}</div>-->
                <!--                <div class="col-xs-12">渠道经理：{{ contractModel.chargeByName }}</div>-->
                <div class="col-xs-12">代理商名称：{{ contractForm.agentCompanyName }}</div>
                <div class="col-xs-12">渠道经理：{{ contractForm.angentChargeByName }}</div>
                <div class="col-xs-12">代理推广费率：<show-close-service :detail="formItem"></show-close-service>
                </div>
              </template>
              <div class="col-xs-12" v-if="formItem.approveStateName">合同申请状态：{{formItem.approveStateName}}</div>
              <hr v-if="key+1 != contractForm.contracts.length">
            </div>
          </div>
          <div class="row"
               style="margin-bottom: 15px;">
            <div class="col-xs-12">
              <h4 class="block green">合同附件条款</h4>
            </div>
            <template v-if="hasInsurance()">
              <div class="col-xs-12">商业保险：{{ contractForm.vciBuyType == 10 ? '由客户自行购买' :
                '我方购买保险的情况，无论保费是否我方承担均适用'}}</div>
              <div class="col-xs-12">保险计划名称：{{ contractForm.vciPlanName }}</div>
            </template>
            <div class="col-xs-12">付款方式：{{ getText(contractForm.vciPayType, contractModel.VciPayTypeList)
              }}</div>
            <div class="col-xs-12"
                 v-if="contractForm.payAndInvoiceSame">付款方与收款方一致：{{ contractForm.payAndInvoiceSame == 1 ? '是' : '否' }}</div>
            <div class="col-xs-12"
                 v-if="contractForm.payAndInvoiceSame === '0'">甲方下属公司类型：{{
              getText(contractForm.customCompanyUnderType, contractModel.customCompanyUnderTypeList) }}</div>
            <div class="col-xs-12"
                 v-if="contractForm.payAndInvoiceSame === '0'">甲方下属公司清单：
              <a href="javascript:;"
                 @click="handleDownload(contractForm.customUnderAttachList[0].downloadCode)">
                {{ contractForm.customUnderAttachList.length && contractForm.customUnderAttachList[0].displayname }}
              </a>
            </div>
          </div>
          <div class="row"
               style="margin-bottom: 15px;"
               v-if="contractForm.signForm">
            <div class="col-xs-12">
              <h4 class="block green">C端签约设置</h4>
            </div>
            <div class="col-xs-12">签约介质：{{ contractForm.signForm == 1 ? '短信网页链接' : '小程序（微信搜索小程序“爱员工小助手”）' }}</div>
            <div class="col-xs-12">C端短信通知：{{ contractForm.smsType == 1 ? '是' : '否' }}</div>
            <div class="col-xs-12">C端上传身份证：{{ contractForm.passportType == 1 ? '是' : '否' }}</div>
            <div class="col-xs-12">C端签署方式：{{ contractForm.signMode == 1 ? '屏幕手签' : '勾选“我同意”并自动签' }}</div>
            <div class="col-xs-12">签约落地公司：
              <div class="inline">
                <div v-for="e in contractForm.econtractServiceCompanyList"
                     :key="e.serviceCompanyId">
                  <el-checkbox :label="e.serviceCompanyName"
                               checked
                               disabled></el-checkbox>
                </div>
              </div>
            </div>
						<!-- 创建合同时才显示开关 -->
            <div class="col-xs-12" v-if="contractModel.operateEnum === 1">接入【爱收入】发布岗位：{{ contractForm.jobMatch === '1' ? '是' : '否' }}</div>
          </div>
        </div>
      </div>
    </div>
    <div class="widget-box bg-white"
         style="margin-top:20px;">
      <div class="widget-header">
        <h4 class="widget-title">合同附件管理</h4>
        <a href="javascript:;"
           class="ml20"
           @click="handleDownloadAll">打包下载全部附件</a>
      </div>
      <div class="widget-body">
        <div class="widget-main"
             style="font-size: 16px;line-height: 30px;">
          <div v-for="(formItem, key) in contractForm.contracts"
               :key="key">
            <div class="row"
                 style="margin-bottom: 15px;">
              <div class="col-xs-4">{{ formItem.serviceCompanyName }}</div>
              <div class="col-xs-4"
                   v-if="!contractForm.approveType || contractForm.approveType === 'standard' || contractForm.approveType === 'partial'">
                <div>系统合同附件：</div>
                <div v-for="(el, index) in formItem.attachments"
                     :key="index">
                  <div v-if="el.targetTypeName!='自定义附件'">{{ el.targetTypeName }}：{{ el.displayname }}
                    <a href="javascript:;"
                       @click="handlePrevFile(el.downloadCode)"
                       style="margin-left:10px;">预览</a>
                    <a href="javascript:;"
                       @click="handleDownload(el.downloadCode)"
                       style="margin-left:10px;">下载</a>
                  </div>
                </div>
              </div>
              <div class="col-xs-4"
                   v-if="contractForm.approveType === 'partial' || contractForm.approveType === 'customer'">
                <div>补充附件：</div>
                <div v-for="(el, index) in contractForm.approveType === 'partial' ? formItem.partialAttachments : formItem.customerAttachments"
                     :key="index">
                  <div v-if="el.targetTypeName=='自定义附件'">{{ el.displayname }}
                    <a href="javascript:;"
                       @click="handlePrevFile(el.downloadCode)"
                       style="margin-left:10px;">预览</a>
                    <a href="javascript:;"
                       @click="handleDownload(el.downloadCode)"
                       style="margin-left:10px;">下载</a>
                  </div>
                </div>
              </div>
            </div>
            <hr v-if="key+1 != contractForm.contracts.length">
          </div>
        </div>
      </div>
    </div>
    <contractInfo :contractModel="contractModel"></contractInfo>
    <auditOption :contractModel="contractModel"
                 :editType="editType"></auditOption>
    <div style="margin:20px 0;"
         v-if="contractModel.status == 'init'">
      <el-button size="small"
                 type="primary"
                 @click="toDetail(contractModel.contractId, 'watch')">送审</el-button>
      <el-button size="small"
                 type="info"
                 @click="toCreate(contractModel.contractId, contractModel.workflowType)">编辑</el-button>
      <el-button size="small"
                 type="danger"
                 @click="closeContract(contractModel.contractId)">删除</el-button>
      <el-button size="small"
                 @click="backToList">返回</el-button>
    </div>
  </div>
</template>

<script>
import ContractModel from '../../model/contract/newContract/ContractModel'
import { baseUrl } from '../../config/address.js';
import { showConfirm } from "../../plugin/utils-message"
import contractInfo from './components/preview/contractInfo.vue' // 合同业务信息补充
import auditOption from './components/preview/auditOption.vue' // 审核意见
import showService from '../../pageComponent/showService.vue'
import showCloseService from '../../pageComponent/showCloseService'
import { mapGetters } from 'vuex'
export default {
    name: "preview",
    components: {
        auditOption,
        showService,
        showCloseService,
        contractInfo,
    },
    computed: {
        ...mapGetters({
            contractTplList: 'contractTplList',
            industryTypeList: 'industryTypeList',
            serviceTypeList: 'serviceTypeList',
        }),
        isChange() {
            return this.contractModel.workflowType.indexOf('update') !== -1
        }
    },
    data () {
        return {
            contractModel: new ContractModel(),
            contractForm: ''
        }
    },
    mounted () {
        this.$store.dispatch('getContractTplList')
        this.$store.dispatch('getIndustryTypeList')
        this.$store.dispatch('getServiceTypeList')
        let id = this.$route.query.id;
        this.contractModel.contractId = id;
        // let first = new Promise((res, rej) => {
            this.contractModel.getContractDetail(id, () => {
								this.contractForm = this.contractModel.contractForm
                this.getCUserStandardInfoList()
                this.contractForm.showSubjectInfo = this.contractForm.showSubjectInfo === '1' ? true : false;
                // this.contractForm.contracts.forEach(item => {
                //     item.showServiceCompanyInfo = item.showServiceCompanyInfo === '1' ? true : false;
                // })
                // res()
                // 根据服务商id过滤
                this.contractForm.contracts.forEach(item => {
                    if (!item.quoteFeeContent) {
                        return
                    }
                    let serviceCompanyRateList = item.quoteFeeContent.serviceCompanyRateList
                    if(serviceCompanyRateList && serviceCompanyRateList.length) {
                        item.quoteFeeContent.serviceCompanyRateList = serviceCompanyRateList.filter(e => e.serviceCompanyId == item.serviceCompanyId)
                    }
                })
            });
        // })
        // Promise.all([first, this.contractModel.getAgentList()]).then(() => {
        //     this.contractModel.getChargeByName();
        // })

        this.editType = this.$route.query.editType || 'new';
				this.contractModel.editType = this.$route.query.editType || 'new';
    },
    methods: {
        getCUserStandardInfoList() {
            let cUserStandardInfoList = []
            if (!this.contractModel.contractForm.contracts) {
                this.contractModel.contractForm.contracts = []
            }
            if (!this.contractModel.contractForm.cUserStandardInfoList) {
                this.contractModel.contractForm.cUserStandardInfoList = []
            }
            cUserStandardInfoList = this.contractModel.contractForm.contracts.map((item) => {
                return {
                    serviceCompanyId: item.serviceCompanyId,
                    serviceCompanyName: item.serviceCompanyName,
                    attachments: []
                }
            })
            cUserStandardInfoList.forEach((item1) => {
                this.contractModel.contractForm.cUserStandardInfoList.forEach((item2) => {
                    if (item1.serviceCompanyId === item2.serviceCompanyId) {
                        item1.attachments = item2.attachments
                    }
                })
            })
            this.cUserStandardInfoList = cUserStandardInfoList
            this.contractModel.contractForm.cUserStandardInfoList = cUserStandardInfoList
        },
        hasInsurance() {
            if (!this.contractForm.contracts) return false
            return  this.contractForm.contracts.some((gongSi) => {
                return  gongSi.serviceTypeList.some((serverType) => {
                    return serverType.vciStatus === '1'
                })
            })
        },
        getText(value, list, inputKey = 'value', outputKey = 'text') {
            if (!list) return;
            if (!list.length) return;
            let obj = list.find((element) => {
                return element[inputKey] == value
            });
            if (obj) {
                return obj[outputKey];
            };
        },
        getCheckText(valueArr, list) {
            let objArr = [];
            if (!valueArr) return;
            if (!list) return;
            valueArr.forEach(value => {
                if (value.serviceName) {
                    objArr.push(value.serviceName)
                } else {
                    let obj = list.find((element) => {
                        return element['serviceId'] == value;
                    });
                    if (obj) {
                        objArr.push(obj['serviceName']);
                    }
                }
            });
            return objArr.join(',');
        },
        getPayMode(valueArr, obj) {
            let arr = [];
            valueArr.forEach(element => {
                arr.push(obj[element].label)
            })
            return arr.join(',')
        },
        backToList() {
            let path = this.$route.query.fromUrl || 'list'
            this.$router.replace({
                path: path
            })
        },
        handlePrevFile(downloadCode) {
            window.open(baseUrl + '/api/contract-web/file/pdf-scan' +
                '?downloadCode=' + downloadCode);
        },
        handleDownload(downloadCode) {
            window.location.href = baseUrl + '/api/contract-web/file/download' +
                '?downloadCode=' + downloadCode;
        },
        handleDownloadAll() {
            window.location.href = baseUrl + '/api/contract-web/contract/download-sales-flow-attachments?salesInstanceId=' + this.contractModel.contractId
        },
        toPreview(id, type) {
            this.$router.push({
                path: 'preview',
                query: {
                    id: id,
                    editType: type
                }
            })
        },
        toDetail(id, type) {
            this.$router.push({
                path: 'detail',
                query: {
                    id: id,
                    editType: type
                }
            })
        },
        toCreate(id, type) {
            const isChange = type.indexOf('update') !== -1
            const isAdd = type.indexOf('add') !== -1
            // const editType = {
            //     create_sale_contract: 'create',
            //     create_ns_sale_contract: 'create',
            //     create_sale_contract_service_company_rule: 'create',
            //     create_ns_sale_contract_service_company_rule: 'create',
            //     add_sale_contract: 'create_add',
            //     add_ns_sale_contract: 'create_add',
            //     update_sale_contract: 'create_change',
            //     update_ns_sale_contract: 'create_change',
            //     agent_create_sale_contract: 'create',
            //     agent_add_sale_contract: 'create_add',
            //     agent_update_sale_contract: 'create_change',
            //     agent_create_ns_sale_contract: 'create',
            //     agent_add_ns_sale_contract: 'create_add',
            //     agent_update_ns_sale_contract: 'create_change',
            // }
            let path
            if (isChange) {
                path = 'create_change'
            } else if (isAdd) {
                path = 'create_add'
            } else {
                path = 'create'
            }
            this.$router.push({
                // path: editType[type] || path,
                path,
                query: {
                    id: id,
                    editType: type
                }
            })
        },
        closeContract(id) {
            showConfirm({
                msg: '确认关闭合同？',
                confirmCallback: () => {
                    post('/api/opencrm/workflow/delete', {
                        id: id,
                        memo: ''
                    }).then(result => {
                        showNotify('success', '删除成功')
                        this.getList()
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
h4.block {
  margin: 10px 0 16px;
}
.inline {
  display: inline-block;
}
</style>
