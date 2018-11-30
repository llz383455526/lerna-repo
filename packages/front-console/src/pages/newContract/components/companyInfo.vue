<template>
    <div>
        <h4 class="ml50">
            <span style="width: 150px;display: inline-block;">落地公司信息</span>
            <el-button size="normal" type="primary" @click="dialogVisible=true"
                       v-if="contractModel.editType != 'watch'">添加服务商信息</el-button>
            <span class="btn-add" v-if="contractModel.contractForm.contracts.length === 0">请添加服务商信息</span>
        </h4>

        <div class="form-list" v-for="(formItem,index) in contractModel.contractForm.contracts" :key="index">
            <el-button @click="deleteForm(i)" type="text" size="medium" class="btn-del">删除</el-button>
            <el-form-item label="服务商名称">
                <el-input v-model="formItem.serviceCompanyName" style="width:250px;" readonly></el-input>
                <el-checkbox v-model="formItem.showServiceCompanyInfo" label="1">合同中显示服务商收款账户信息</el-checkbox>
            </el-form-item>
            <el-form-item label="业务方案" :prop="'contracts.'+index+'.goodsId'"
                          :rules="{required: true, message: '请选择业务方案', trigger: 'change'}">
                <el-select v-model="formItem.goodsId" placeholder="请选择" style="width:100%;">
                    <el-option v-for="(item, key) in formItem.goodsList"
                               :key="key" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发放方式" :prop="'contracts.'+index+'.channelTypeList'"
                          :rules="{required: true, message: '请选择服务类型', trigger: 'change'}">
                <el-checkbox-group v-model="formItem.channelTypeList">
                    <el-checkbox v-for="(item, key) in payMode" :key="key" :label="item.value">{{item.label}}</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="开票方式" :prop="'contracts.'+index+'.openInvoiceType'"
                          :rules="{required: true, message: '请选择开票方式', trigger: 'change'}">
                <el-select v-model="formItem.openInvoiceType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="(item, key) in customerInvoiceTypes"
                               :key="key" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="结算方式" :prop="'contracts.'+index+'.settleType'"
                          :rules="{required: true, message: '请选择结算方式', trigger: 'change'}">
                <el-select v-model="formItem.settleType" placeholder="请选择" style="width:100%;">
                    <el-option v-for="(item,key) in contractModel.settleTypeList"
                               :key="key" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item>
            <!--<el-form-item label="预收服务费比例" :prop="'contracts.'+index+'.prePayContent.serviceFeeRate'"-->
                          <!--:rules="{required: true, message: '请选择结算方式', trigger: 'change'}">-->
                <!--<div style="float: left; color: #606266;">结算前暂时按</div>-->
                <!--<el-input v-model="formItem.prePayContent.serviceFeeRate" style="width: calc(100% - 236px); float: left; margin: 0 20px;">-->
                    <!--<template slot="append">% 每笔</template>-->
                <!--</el-input>-->
                <!--<div style="float: left; color: #606266;">的标准计算管理费</div>-->
            <!--</el-form-item>-->

            <el-form-item label="服务商报价" :prop="'contracts.'+index+'.check'"
                          :rules="{required: true, message: '请正确填写服务商报价', trigger: 'blur'}">
                <contractItem label-width="0"
                              :arrIndex="index"
                              @result="result"
                              :contractForm="{serviceFeeContent:formItem.serviceFeeContent,serviceFeeContent2:formItem.serviceFeeContent2}">
                </contractItem>
            </el-form-item>
            <el-form-item label="是否代理商客户" :prop="'contracts.'+index+'.agentClient'" :rules="{required: true, message: '请选择', trigger: 'blur'}">
                <el-radio v-model="formItem.agentClient" :label="true">是</el-radio>
                <el-radio v-model="formItem.agentClient" :label="false">否</el-radio>
            </el-form-item>
            <template v-if="formItem.agentClient">
                <el-form-item label="代理商名称" :prop="'contracts.'+index+'.agentCompanyId'" :rules="{required: true, message: '请选择代理商', trigger: 'blur'}">
                    <el-select v-model="formItem.agentCompanyId" style="width:100%;" @change="companyChange(index)">
                        <el-option v-for="e in agentList" :key="e.companyId" :label="e.companyName" :value="e.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="代理商分润比例" :prop="'contracts.'+index+'.agentFeeContent.serviceFeeRate'" 
                    :rules="[
                        {required: true, message: '请输入正确的服务费收费（大于零且最多两位小数）', trigger: 'blur'},
                        {validator: f2, trigger: 'blur'}]">
                    <div style="float: left; width: 70px; color: #606266;">实发金额 * </div>
                    <el-input v-model="formItem.agentFeeContent.serviceFeeRate" style="width: calc(100% - 70px);">
                        <template slot="append">% 每笔</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="渠道经理" required>
                    <el-input v-model="chargeByNames[index]" disabled></el-input>
                </el-form-item>
            </template>
            <div style="margin-left: 100px;" v-if="contractModel.workflowType === 'create_ns_sale_contract'">
                <span>合同附件</span>
                <el-form-item :prop="'contracts.'+index+'.referIds'" label-width="0" style="margin-top:15px;"
                              :rules="{required: true, message: '请上传合同附件', trigger: 'blur'}">
                    <upload @handleSuccess="handleSuccess" :arrIndex="index" :fileList="formItem.referNames"
                            :showUploadBtn="contractModel.editType != 'watch'"></upload>
                </el-form-item>
            </div>
        </div>

        <el-dialog title="添加公司信息" :visible.sync="dialogVisible" width="700px">
            <el-form :model="appForm" label-width="200px" ref="appForm" style="padding-right: 100px;">
                <el-form-item label="服务商名称">
                    <el-select v-model="serviceCompanyId" filterable placeholder="请选择" @change="setServiceCompany" style="width: 100%;">
                        <el-option v-for="(item,key) in contractModel.serviceCompaniesList"
                                   :key="key"
                                   :label="item.companyName"
                                   :value="item.companyId"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="formAdd">保存</el-button>
                    <el-button @click="dialogVisible = false">取消</el-button>
                </el-form-item>
            </el-form>
        </el-dialog>
    </div>
</template>

<script>
    import _ from 'lodash'
    import { get } from '../../../store/api'
    import contractItem from '../../../pageComponent/contractItem'
    import upload from './upload'
    export default {
        name: "companyInfo",
        props: ['contractModel'],
        components: {
            contractItem,
            upload
        },
        data () {
            return {
                dialogVisible: false,
                serviceCompanyName: '',
                serviceCompanyId: '',
                goodsList: [],
                payMode: {'A':{label:'银行', value: 'A'}, 'B':{label:'支付宝', value: 'B'}, 'C':{label:'微信', value: 'C'}},
                customerInvoiceTypes: {'10': {text: '账单开票', value: 10}, '20': {text: '预开票', value: 20}},
                chargeByNames: [],
                agentList: [],
                f2: (rule, value, cb) => {
                    if(!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
                        return cb('请输入正确的服务费收费（大于零且最多两位小数）')
                    }
                    return cb()
                }
            }
        },
        mounted() {
            get('/api/contract-web/agent-contract/agent-company-option?sign=true').then(data => {
                this.agentList = data
                // this.contractForm.agentCompanyId
                this.contractModel.contractForm.contracts.forEach((e, i) => {
                    this.companyChange(i)
                })
            })
        },
        methods: {
            formAdd () {
                let serviceCompanyName = this.serviceCompanyName;
                let serviceCompanyId = this.serviceCompanyId;
                let goodsList = this.goodsList;
                this.contractModel.contractForm.serviceCompanyList.push({
                    serviceCompanyName: serviceCompanyName,
                    serviceCompanyId: serviceCompanyId
                });
                this.contractModel.contractForm.contracts.push({
                    serviceCompanyName: serviceCompanyName,
                    showServiceCompanyInfo: '',
                    serviceCompanyId: serviceCompanyId,
                    goodsId: '',
                    goodsList: goodsList,
                    channelTypeList: [],
                    openInvoiceType: '',
                    settleType: '',
                    prePayType: '1',
                    prePayContent: {
                        secondType: 'should',
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio'
                    },
                    serviceFeeContent: {
                        discountRate: '',
                        secondType: '',
                        fixFee: 0,
                        monthIncomeAmount: '',
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio',
                        containMonthAmount: true,
                        stepwiseList: []
                    },
                    serviceFeeContent2: {
                        containMonthAmount: false,
                        monthIncomeAmount: '',
                        stepwiseList: []
                    },
                    referIds: [],
                    referNames: [],
                    check: '',
                    agentClient: '',
                    agentCompanyId: '',
                    agentCompanyName: '',
                    agentFeeContent: {
                        discountRate: '',
                        fixFee: '',
                        secondType: 'real',
                        serviceFeeRate: '',
                        serviceFeeType: 'ratio'
                    }
                });
                this.dialogVisible = false;
            },
            result ({serviceFeeContent, serviceFeeContent2, arrIndex, check}) {
                this.contractModel.contractForm.contracts[arrIndex].check = check;
                this.contractModel.serviceFeeList[arrIndex] = {
                    serviceFeeContent: serviceFeeContent,
                    serviceFeeContent2: serviceFeeContent2
                };
            },
            handleSuccess(fileList, referArr, arrIndex) {
                let contract = this.contractModel.contractForm.contracts[arrIndex];
                contract.referNames = fileList;
                contract.referIds = referArr;
            },
            deleteForm(i) {
                this.contractModel.contractForm.contracts.splice(i, 1);
            },
            setServiceCompany(o, serviceCompanyId) {
                let serviceCompany = _.find(this.contractModel.serviceCompaniesList, o => {
                    return o.companyId === this.serviceCompanyId
                });
                this.serviceCompanyName = serviceCompany.companyName;
                get('/api/salemgt/common/service-company/goods', {
                    serviceCompanyId: serviceCompanyId || serviceCompany.companyId
                }).then(result => {
                    this.goodsList = result || []
                })
            },
            companyChange(a) {
                this.agentList.forEach(e => {
                    if(e.companyId == this.contractModel.contractForm.contracts[a].agentCompanyId) {
                        console.log(e)
                        this.chargeByNames[a] = e.chargeByName
                        this.contractModel.contractForm.contracts[a].agentCompanyName = e.companyName
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .form-list {
        border: 1px solid #999999;
        padding: 32px 100px 20px 0;
        margin: 0 0 22px 100px;
        position: relative;
        width: 1200px;
    }
    .btn-del {
        padding: 0;
        position: absolute;
        top: 20px;
        right: 20px;
    }
    .btn-add {
        font-weight: normal;
        color: red;
        margin-left: 30px;
    }
</style>