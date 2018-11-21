<template>
    <div class="contract-container bg-white p15">
        <el-form label-width="200px" class="contractForm detail-form">
            <h4 class="ml50">合同选项</h4>
            <el-form-item label="合同模板">
                <div class="form-item">{{contractModel.contractForm}}</div>
            </el-form-item>
            <!--<el-form-item label="合同类型">-->
                <!--<div class="form-item">新客户合同</div>-->
            <!--</el-form-item>-->

            <!--<h4 class="ml50">合同内容</h4>-->
            <!--<el-form-item label="企业名称">-->
                <!--<div class="form-item">{{contractForm.customerName}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="企业地址">-->
                <!--<div class="form-item">{{contractForm.areaName}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="合同类型">-->
                <!--<div class="form-item">-->
                    <!--<span v-for="item in contractForm.serviceTypeList" style="margin-right: 10px">{{item.serviceName}}</span>-->
                <!--</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="服务商名称">-->
                <!--<div class="form-item">{{contractForm.serviceCompanyName}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="业务方案">-->
                <!--<div class="form-item">{{contractForm.goodsName}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="支付方式">-->
                <!--<div class="form-item">-->
                    <!--<span v-for="item in contractForm.channelType" style="margin-right: 10px">{{payMode[item].label}}</span>-->
                <!--</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="结算方式">-->
                <!--<div class="form-item">{{settleTypeName}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="服务费是否预收">-->
                <!--<div class="form-item">是</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="服务费预收比例">-->
                <!--{{`${contractForm.prePayContent.secondType === 'real' ? '实发金额' : '应发金额'} * ${contractForm.prePayContent.serviceFeeRate}%`}}-->
            <!--</el-form-item>-->
            <!--<el-form-item label="发票类型">-->
                <!--<div class="form-item">{{invoiceTypeName}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="开票方式">-->
                <!--<div class="item-form">{{contractForm.openInvoiceType ? customerInvoiceTypes[contractForm.openInvoiceType.toString()].text : ''}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="服务费收取比例">-->
                <!--<div class="item-form">-->
                    <!--<template v-if="contractForm.serviceFeeContent.serviceFeeType == 'dummy'">-->
                        <!--{{contractForm.standardRate}}%-->
                    <!--</template>-->
                    <!--<template v-else-if="contractForm.serviceFeeContent.serviceFeeType == 'fixed'">-->
                        <!--{{'固定金额，每笔' + contractForm.serviceFeeContent.fixFee + '元'}}-->
                    <!--</template>-->
                    <!--<template v-else-if="contractForm.serviceFeeContent.serviceFeeType == 'ratio'">-->
                        <!--{{`${contractForm.serviceFeeContent.secondType == 'real' ? '标准报价' : '应发金额'} * ${contractForm.serviceFeeContent.serviceFeeRate}%`}}-->
                    <!--</template>-->
                    <!--<template v-else-if="contractForm.serviceFeeContent.serviceFeeType == 'step' && contractForm.serviceFeeContent.secondType == '0'">-->
                        <!--{{`分2.8万 - 无流水阶梯报价：`}}-->
                        <!--<div v-for="(e, i) in contractForm.serviceFeeContent.stepwiseList">-->
                            <!--<div class="indent">-->
                            <!--<span class="inline">-->
                                <!--<template v-if="!e.startAmount && !i">-->
                                    <!--{{`小于${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}-->
                                <!--</template>-->
                                <!--<template v-else-if="e.startAmount && e.endAmount">-->
                                    <!--{{`${e.startAmount}万${e.equalsStart ? '（含）' : ''}~${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}-->
                                <!--</template>-->
                                <!--<template v-else-if="!e.endAmount">-->
                                    <!--{{`大于${e.startAmount}万${e.equalsStart ? '（含）' : ''}`}}-->
                                <!--</template>-->
                            <!--</span>-->
                                <!--{{`实发金额*${e.percent}%`}}-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</template>-->
                    <!--<template v-else-if="contractForm.serviceFeeContent.serviceFeeType == 'step' && contractForm.serviceFeeContent.secondType == '1'">-->
                        <!--{{`不分2.8万 - 按流水总额阶梯报价：`}}-->
                        <!--<div v-for="(e, i) in contractForm.serviceFeeContent.stepwiseList">-->
                            <!--<div class="indent">-->
                            <!--<span class="inline">-->
                                <!--<template v-if="!e.startAmount && !i">-->
                                    <!--{{`小于${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}-->
                                <!--</template>-->
                                <!--<template v-else-if="e.startAmount && e.endAmount">-->
                                    <!--{{`${e.startAmount}万${e.equalsStart ? '（含）' : ''}~${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}-->
                                <!--</template>-->
                                <!--<template v-else-if="!e.endAmount">-->
                                    <!--{{`大于${e.startAmount}万${e.equalsStart ? '（含）' : ''}`}}-->
                                <!--</template>-->
                            <!--</span>-->
                                <!--{{`实发金额*${e.percent}%`}}-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</template>-->
                    <!--<template v-else-if="contractForm.serviceFeeContent.serviceFeeType == 'step' && contractForm.serviceFeeContent.secondType == '2'">-->
                        <!--{{`分2.8万 - 按流水分阶梯报价：`}}-->
                        <!--<div class="indent">-->
                            <!--{{`（1）月收入小于${contractForm.serviceFeeContent.monthIncomeAmount}万（含）：`}}-->
                            <!--<div v-for="(e, i) in contractForm.serviceFeeContent.stepwiseList">-->
                                <!--<div class="indent">-->
                                <!--<span class="inline">-->
                                    <!--<template v-if="!e.startAmount && !i">-->
                                        <!--{{`小于${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}-->
                                    <!--</template>-->
                                    <!--<template v-else-if="e.startAmount && e.endAmount">-->
                                        <!--{{`${e.startAmount}万${e.equalsStart ? '（含）' : ''}~${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}-->
                                    <!--</template>-->
                                    <!--<template v-else-if="!e.endAmount">-->
                                        <!--{{`大于${e.startAmount}万${e.equalsStart ? '（含）' : ''}`}}-->
                                    <!--</template>-->
                                <!--</span>-->
                                    <!--{{`实发金额*${e.percent}%`}}-->
                                <!--</div>-->
                            <!--</div>-->
                            <!--{{`（2） 月收入大于${contractForm.serviceFeeContent2.monthIncomeAmount}万：`}}-->
                            <!--<div v-for="(e, i) in contractForm.serviceFeeContent2.stepwiseList">-->
                                <!--<div class="indent">-->
                                <!--<span class="inline">-->
                                    <!--<template v-if="!e.startAmount && !i">-->
                                        <!--{{`小于${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}-->
                                    <!--</template>-->
                                    <!--<template v-else-if="e.startAmount && e.endAmount">-->
                                        <!--{{`${e.startAmount}万${e.equalsStart ? '（含）' : ''}~${e.endAmount}万${e.equalsEnd ? '（含）' : ''}`}}-->
                                    <!--</template>-->
                                    <!--<template v-else-if="!e.endAmount">-->
                                        <!--{{`大于${e.startAmount}万${e.equalsStart ? '（含）' : ''}`}}-->
                                    <!--</template>-->
                                <!--</span>-->
                                    <!--{{`实发金额*${e.percent}%`}}-->
                                <!--</div>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</template>-->
                <!--</div>-->
            <!--</el-form-item>-->

            <!--<h4 class="ml50">合同联系人信息</h4>-->
            <!--<el-form-item label="合同联系人姓名">-->
                <!--<div class="form-item">{{contractForm.contractPerson}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="合同联系人手机">-->
                <!--<div class="form-item">{{contractForm.contractTel}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="合同联系人邮箱">-->
                <!--<div class="form-item">{{contractForm.contractEmail}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="合同联系人地址">-->
                <!--<div class="form-item">{{contractForm.contractAddr}}</div>-->
            <!--</el-form-item>-->

            <!--<h4 class="ml50">客户联系人及账号信息</h4>-->
            <!--<el-form-item label="法定代表人姓名">-->
                <!--<div class="form-item">{{contractForm.customLegalPerson}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="企业负责人姓名">-->
                <!--<div class="form-item">{{contractForm.customCollector}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="企业负责人手机">-->
                <!--<div class="form-item">{{contractForm.customCollectorPhone}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="企业负责人邮箱1">-->
                <!--<div class="form-item">{{contractForm.customMail1}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="企业负责人邮箱2">-->
                <!--<div class="form-item">{{contractForm.customMail2}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="企业负责人联系地址">-->
                <!--<div class="form-item">{{contractForm.customCollectorAddr}}</div>-->
            <!--</el-form-item>-->

            <!--<h4 class="ml50">相关商户信息</h4>-->
            <!--<el-form-item label="商户信息">-->
                <!--<el-table-->
                        <!--:data="contractForm.companyApps">-->
                    <!--<el-table-column prop="appName" label="商户名称"></el-table-column>-->
                    <!--<el-table-column prop="chargeByName" label="商户负责人姓名"></el-table-column>-->
                    <!--<el-table-column prop="chargeByPhone" label="商户负责人手机"></el-table-column>-->
                    <!--<el-table-column prop="chargeByMail" label="商户负责人邮箱"></el-table-column>-->
                <!--</el-table>-->
            <!--</el-form-item>-->

            <!--<h4 class="ml50">客户（公司）开票信息</h4>-->
            <!--<el-form-item label="公司名称">-->
                <!--<div class="form-item">{{contractForm.invoiceCompanyName}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="纳税人识别号">-->
                <!--<div class="form-item">{{contractForm.customTaxIdcd}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="地址">-->
                <!--<div class="form-item">{{contractForm.customAddr}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="电话">-->
                <!--<div class="form-item">{{contractForm.customPhone}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="开户银行">-->
                <!--<div class="form-item">{{contractForm.customBankName}}</div>-->
            <!--</el-form-item>-->
            <!--<el-form-item label="银行账号">-->
                <!--<div class="form-item">{{contractForm.customBankAccount}}</div>-->
            <!--</el-form-item>-->

            <!--<el-form-item style="margin-top: 20px;">-->
                <!--<el-button v-if="processingLimited" type="primary" @click="handleContract('agree')">审核通过</el-button>-->
                <!--<el-button v-if="processingLimited" type="primary" @click="handleContract('reject')">审核不通过</el-button>-->
                <!--<el-button v-if="contractForm.contractDownLoadId" type="primary" @click="downloadPDF(contractForm.contractDownLoadId)">下载合同PDF版本</el-button>-->
                <!--<el-button v-if="editType === 'workflow'" @click="backToList('/main/taxDIscount/home')">返回</el-button>-->
                <!--<el-button v-if="editType === 'watch'" @click="backToList('list')">返回</el-button>-->
            <!--</el-form-item>-->
        </el-form>
    </div>
</template>

<script>
    import ContractModel from '../../model/ContractModel'
    export default {
        name: "detail",
        data () {
            return {
                contractModel: new ContractModel()
            }
        },
        created () {
            let id = this.$route.query.id;
            this.contractModel.getContractDetail(id)
        }
    }
</script>

<style scoped>
    .contract-container {
        margin-bottom: 30px;
    }
</style>