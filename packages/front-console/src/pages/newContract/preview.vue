<template>
    <div>
        <div style="margin:20px 0;" v-if="contractModel.status == 'completed'">
            <el-button size="small" @click="backToList('list')">返回</el-button>
        </div>
        <div style="margin:20px 0;" v-if="contractModel.status == 'init'">
            <el-button size="small" type="primary" @click="toDetail(contractModel.contractId, 'watch')">送审</el-button>
            <el-button size="small" type="info" @click="toCreate(contractModel.contractId, 'edit')">编辑</el-button>
            <el-button size="small" type="danger" @click="closeContract(contractModel.contractId)">删除</el-button>
            <el-button size="small" @click="backToList('list')">返回</el-button>
        </div>
        <div class="widget-box bg-white">
            <div class="widget-header">
                <h4 class="widget-title">创建合同 - {{ contractForm.customerName }}</h4>
            </div>
            <div class="widget-body">
                <div class="widget-main" style="font-size: 16px;line-height: 30px;">
                    <div class="row" style="margin-bottom: 15px;">
                        <div class="col-xs-12">
                            <h4 class="block green">合同选项</h4>
                        </div>
                        <div class="col-xs-6">合同模板：{{ getText(contractForm.contractTplId,
                            contractModel.contractTplList) }}</div>
                        <div class="col-xs-6">客户行业类型：{{ getText(contractForm.contractType,
                            contractModel.businessTypeList) }}</div>
                        <div class="col-xs-6">客户从事：{{ contractForm.customIndustry }}</div>
                        <div class="col-xs-6">合同期限：{{ contractForm.contractStartDate + ' - ' +
                            contractForm.contractEndDate }}</div>
                        <div class="col-xs-12">服务类型：{{ getCheckText(contractForm.serviceType,
                            contractModel.serviceTypes, 'serviceName') }}</div>
                    </div>
                    <div class="row" style="margin-bottom: 15px;">
                        <div class="col-xs-12">
                            <h4 class="block green">销售信息</h4>
                        </div>
                        <div class="col-xs-6">预估月流水：{{ contractForm.expectedMonthlyFlow }}</div>
                        <div class="col-xs-6">预计三万以上比例：{{ contractForm.expectedProportion }}%</div>
                        <div class="col-xs-6">销售姓名：{{ contractForm.contractPerson }}</div>
                        <div class="col-xs-6">销售联系电话：{{ contractForm.contractTel }}</div>
                        <div class="col-xs-6">销售联系邮箱：{{ contractForm.contractEmail }}</div>
                        <div class="col-xs-6">合同联系人地址：{{ contractForm.contractAddr }}</div>
                        <div class="col-xs-6">客户来源：{{ contractForm.originalName }}</div>
                    </div>
                    <div class="row" style="margin-bottom: 15px;">
                        <div class="col-xs-12">
                            <h4 class="block green">客户企业及开票信息</h4>
                        </div>
                        <div class="col-xs-12">客户性质：{{ getText(contractForm.customNature,
                            contractModel.customNatureList) }}</div>
                        <div class="col-xs-6">企业名称：{{ contractForm.customerName }}</div>
                        <div class="col-xs-6">企业地址：{{ contractForm.areaName }}</div>
                        <div class="col-xs-6">法定代表人：{{ contractForm.customLegalPerson }}</div>
                        <div class="col-xs-6">企业负责人：{{ contractForm.customCollector }}</div>
                        <div class="col-xs-6">负责人手机：{{ contractForm.customCollectorPhone }}</div>
                        <div class="col-xs-6">负责人邮箱：{{ contractForm.customMail1 }}</div>
                        <div class="col-xs-6">负责人地址：{{ contractForm.customCollectorAddr }}</div>
                        <div class="col-xs-12">
                            <hr>
                        </div>
                        <div class="col-xs-6">开票企业名称：{{ contractForm.invoiceCompanyName }}</div>
                        <div class="col-xs-6">开票企业地址：{{ contractForm.areaName }}</div>
                        <div class="col-xs-6">纳税人识别号：{{ contractForm.customTaxIdcd }}</div>
                        <div class="col-xs-6">开票企业电话：{{ contractForm.customPhone }}</div>
                        <div class="col-xs-6">开户银行名称：{{ contractForm.customBankName }}</div>
                        <div class="col-xs-6">银行账号：{{ contractForm.customBankAccount }}</div>
                        <div class="col-xs-12">发票类型：{{ getText(contractForm.invoiceType, contractModel.invoiceTypeList)
                            }}
                            <el-checkbox v-model="contractForm.showSubjectInfo" disabled>合同中显示发票类型</el-checkbox>
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 15px;">
                        <div class="col-xs-12">
                            <h4 class="block green">落地公司信息</h4>
                        </div>
                        <div v-for="(formItem, key) in contractForm.contracts" :key="key">
                            <div class="col-xs-12">落地公司名称：{{ formItem.serviceCompanyName }}
                                <el-checkbox v-model="formItem.showServiceCompanyInfo" label="1" disabled>合同中显示服务商收款账户信息</el-checkbox>
                            </div>
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
                            <template v-if="contractForm.agentClient">
                                <div class="col-xs-12">代理商名称：{{ getText(contractForm.agentCompanyId,
                                    contractModel.agentList, 'companyId', 'companyName') }}</div>
                                <div class="col-xs-12">渠道经理：{{ contractModel.chargeByName }}</div>
                                <div class="col-xs-12">代理商分润比例：{{ formItem.agentFeeContent.serviceFeeRate }}%</div>
                            </template>
                            <hr v-if="key+1 != contractForm.contracts.length">
                        </div>
                    </div>
                    <div class="row" style="margin-bottom: 15px;">
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
                        <div class="col-xs-12">付款方与收款方一致：{{ contractForm.payAndInvoiceSame == 1 ? '是' : '否' }}</div>
                        <div class="col-xs-12" v-if="contractForm.payAndInvoiceSame === '0'">甲方下属公司类型：{{
                            getText(contractForm.customCompanyUnderType, contractModel.customCompanyUnderTypeList) }}</div>
                        <div class="col-xs-12" v-if="contractForm.payAndInvoiceSame === '0'">甲方下属公司清单：
                            <a href="javascript:;" @click="handleDownload(contractModel.contractForm.customUnderAttachList[0].downloadCode)">
                                {{ contractModel.contractForm.customUnderAttachList[0].displayname }}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="widget-box bg-white" style="margin-top:20px;">
            <div class="widget-header">
                <h4 class="widget-title">合同附件管理</h4>
            </div>
            <div class="widget-body">
                <div class="widget-main" style="font-size: 16px;line-height: 30px;">
                    <div v-for="(formItem, key) in contractForm.contracts" :key="key">
                        <div class="row" style="margin-bottom: 15px;">
                            <div class="col-xs-4">{{ formItem.serviceCompanyName }}</div>
                            <div class="col-xs-4" v-if="!contractForm.approveType || contractForm.approveType === 'standard' || contractForm.approveType === 'partial'">
                                <div>系统合同附件：</div>
                                <div v-for="(el, index) in formItem.attachments" :key="index">
                                    <div v-if="el.targetTypeName!='自定义附件'">{{ el.targetTypeName }}：{{ el.displayname }}
                                        <a href="javascript:;" @click="handleDownload(el.downloadCode)" style="margin-left:10px;">下载</a>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-4" v-if="contractForm.approveType === 'partial' || contractForm.approveType === 'customer'">
                                <div>补充附件：</div>
                                <div v-for="(el, index) in contractForm.approveType === 'partial' ? formItem.partialAttachments : formItem.customerAttachments"
                                    :key="index">
                                    <div v-if="el.targetTypeName=='自定义附件'">{{ el.displayname }}
                                        <a href="javascript:;" @click="handleDownload(el.downloadCode)" style="margin-left:10px;">下载</a>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr v-if="key+1 != contractForm.contracts.length">
                    </div>
                </div>
            </div>
        </div>
        <auditOption :contractModel="contractModel" :editType="editType"></auditOption>
        <div style="margin:20px 0;" v-if="contractModel.status == 'init'">
            <el-button size="small" type="primary" @click="toDetail(contractModel.contractId, 'watch')">送审</el-button>
            <el-button size="small" type="info" @click="toCreate(contractModel.contractId, 'edit')">编辑</el-button>
            <el-button size="small" type="danger" @click="closeContract(contractModel.contractId)">删除</el-button>
            <el-button size="small" @click="backToList('list')">返回</el-button>
        </div>
    </div>
</template>

<script>
import ContractModel from '../../model/contract/newContract/ContractModel'
import { baseUrl } from '../../config/address.js';
import { showConfirm } from "../../plugin/utils-message";
import auditOption from './components/auditOption.vue' // 审核意见
import showService from '../../pageComponent/showService.vue'
export default {
    name: "detail",
    components: {
        auditOption,
        showService
    },
    data() {
        return {
            contractModel: new ContractModel(),
            contractForm: ''
        }
    },
    created() {
        let id = this.$route.query.id;
        this.contractModel.contractId = id;

        let first = new Promise((res, rej) => {
            this.contractModel.getContractDetail(id, () => {
                this.contractForm = this.contractModel.contractForm

                this.contractForm.showSubjectInfo = this.contractForm.showSubjectInfo === '1' ? true : false;
                this.contractForm.contracts.forEach(item => {
                    item.showServiceCompanyInfo = item.showServiceCompanyInfo === '1' ? true : false;
                })
                res()
            });
        })
        Promise.all([first, this.contractModel.getAgentList()]).then(() => {
            this.contractModel.getChargeByName();
        })

        this.editType = this.$route.query.editType || 'new';
        this.contractModel.editType = this.$route.query.editType || 'new';
    },
    methods: {
        hasInsurance() {
            var isHas = false;
            this.contractModel.serviceTypes.forEach(e => {
                this.contractModel.serviceTypeList.forEach(ev => {
                    if (e.serviceId == ev && e.vciStatus == 1) {
                        isHas = true
                    }
                })
            });
            return isHas;
        },
        getText(value, list, inputKey = 'value', outputKey = 'text') {
            if (!list.length) return;
            let obj = list.find((element) => {
                return element[inputKey] == value
            });
            if (obj) {
                return obj[outputKey];
            };
        },
        getCheckText(valueArr, list, key) {
            let objArr = [];
            if (!valueArr) return;
            valueArr.forEach(element => {
                let value = element[key];
                let obj = list.find((element) => {
                    return element[key] == value;
                });
                if (obj) {
                    objArr.push(obj[key]);
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
        backToList(path) {
            this.$router.replace({
                path: path
            })
        },
        handleDownload(downloadCode) {
            window.location.href = baseUrl + '/api/contract-web/file/download' +
                '?downloadCode=' + downloadCode;
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
            this.$router.push({
                path: 'create',
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
</style>
