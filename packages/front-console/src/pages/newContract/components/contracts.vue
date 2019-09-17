<template>
  <div>
    <h3 class="green">请添加落地公司
      <el-button size="small"
                 type="primary"
                 @click="dialogVisible = true;info.serviceCompanyId = ''"
                 v-if="!showAddBtn"
                 style="margin-left: 20px;">添加</el-button>
    </h3>
    <div class="widget-box"
         v-for="(formItem,index) in ruleForm.contracts"
         :key="index"
         style="margin-bottom: 20px;">
      <div class="widget-header">
        <h4 class="widget-title"
            style="margin-right: 25px;">{{formItem.taxLandingName}} / {{ formItem.serviceCompanyName || '落地公司名称' }}</h4>
        <div class="widget-title">
          <el-checkbox v-model="formItem.showServiceCompanyInfo"
                       label="1">合同中显示服务商收款账户信息</el-checkbox>
        </div>
        <div class="widget-toolbar">
          <el-button @click="deleteForm(index)"
                     type="text"
                     size="medium"
                     v-if="!showDelBtn">删除</el-button>
        </div>
      </div>
      <div class="widget-main">
        <el-form-item label="合同期限"
                      :prop="'contracts.'+index+'.startDate'"
                      :rules="{ required: true, message: '请选择合同期限', trigger: 'blur' }">
          <el-date-picker type="daterange"
                          style="width:450px;"
                          v-model="contractDate[index]"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          value-format="yyyy-MM-dd"
                          @change="autoFill(index, contractDate[index])">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="业务方案"
                      :prop="'contracts.'+index+'.goodsId'"
                      :rules="{required: true, message: '请选择业务方案', trigger: 'change'}">
          <el-select v-model="formItem.goodsId"
                     placeholder="请选择"
                     style="width:400px;">
            <el-option v-for="(item, key) in (formItem.goodsList.length ? formItem.goodsList : info.goodsList)"
                       :key="key"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算方式"
                      :prop="'contracts.'+index+'.settleType'"
                      :rules="{required: true, message: '请选择结算方式', trigger: 'change'}">
          <el-select v-model="formItem.settleType"
                     placeholder="请选择"
                     style="width:400px;">
            <el-option v-for="(item,key) in settleTypeList"
                       :key="key"
                       :label="item.text"
                       :value="item.value"></el-option>
          </el-select>
          <el-tooltip placement="left">
            <div slot="content">日结：适用于管理费和绩效费同步结算，即客户一起打款管理费和对C端发放款<br />月结：适用于管理费和绩效费不能同步结清，包括阶梯费率情况、充值提现情况等所有发放款和管理费不能同步结清的，均为月结</div>
            <i class="el-icon-question ml10"></i>
          </el-tooltip>
        </el-form-item>
        <el-form-item label="发放方式"
                      :prop="'contracts.'+index+'.channelTypeList'"
                      :rules="{required: true, message: '请选择服务类型', trigger: 'change'}">
          <el-checkbox-group v-model="formItem.channelTypeList"
                             style="width:800px;">
            <el-checkbox v-for="(item, key) in payModeList"
                         :key="key"
                         :label="item.value">{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item style="display: flex;"
                      label="服务商报价"
                      :prop="`contracts[${index}].serviceFeeContent.fixFee`"
                      :rules="{required: true, message: '请正确填写服务商报价', trigger: 'blur'}">
          <contract-create-item ref="contractCreateItem"
                                :arrIndex="index"
                                @result="result"
                                @ratioChange="$refs['serviceFeeInterval'][index].serviceFeeInterval.secondType = ''"
                                :showSettledRate="true"
                                :contractForm="formItem"></contract-create-item>
          <!-- <contractItem label-width="0" :arrIndex="index" @result="result" :initCheck="true" :contractForm="{serviceFeeContent:formItem.serviceFeeContent,serviceFeeContent2:formItem.serviceFeeContent2}"></contractItem> -->
          <serviceFeeInterval ref="serviceFeeInterval"
                              :contractForm="formItem"
                              @secondTypeChange="$refs['contractCreateItem'][index].showInputRatio = 6,$refs['contractCreateItem'][index].checkTable()"></serviceFeeInterval>
        </el-form-item>
        <el-form-item style="display: flex;"
                      :prop="'contracts.'+index+'.serviceTypeList'"
                      label="服务类型"
                      :rules="{required: true, message: '请选择服务类型', trigger: 'blur'}">
          <el-checkbox-group @change="serverTypeChangeChange"
                             v-model="formItem.serviceTypeList">
            <el-checkbox v-for="v in formItem.optionServiceTypeList"
                         :label="v"
                         :key="v.serviceId"
                         @change="checked => changePositions(checked, index, v)">
              {{ v.serviceName }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="C端绩效计算规则"
                      :prop="`contracts[${index}].servicePosList`"
                      :rules="{required: true, validator: validatePost, trigger: 'change'}">
          <performance-rules :servicePosList="formItem.servicePosList"
                             :index="index"
                             @change="addPositions"
                             @remove="removePost"
                             @download="downloadRule(formItem.serviceCompanyId)"></performance-rules>
        </el-form-item>
        <br>
        <template v-if="ruleForm.originalType == 20">
          <el-form-item label="渠道经理"
                        required>
            <el-input v-model="chargeByName"
                      disabled
                      style="width:400px;"></el-input>
          </el-form-item><br>
          <el-form-item label="报价规则"
                        :rules="{required: true, message: '请选择报价规则', trigger: 'blur'}">
            <el-radio v-for="e in ruleList"
                      :key="e.value"
                      v-model="formItem.quoteRule"
                      :label="e.value"
                      :disabled="true">{{e.text}}</el-radio>
            <i class="el-icon-question ml10"
               title="结算规则：按高于结算费率的部分结算   返佣规则：按返佣费率直接返佣"></i>
          </el-form-item><br>
          <el-form-item label="结算费率"
                        :prop="'contracts.'+index+'.checkC'"
                        :rules="{required: true, message: '请正确填写服务商报价', trigger: 'blur'}">
            <contract-close-item :arrIndex="index"
                                 :initCheck="true"
                                 @result="resultClose"
                                 :form="formItem"
                                 :disable="true"></contract-close-item>
          </el-form-item>
        </template>
      </div>
    </div>

    <el-dialog title="添加公司信息"
               :visible.sync="dialogVisible"
               width="700px">
      <el-form :inline="true"
               label-width="150px">
        <el-form-item label="服务商名称">
          <el-select v-model="info.serviceCompanyId"
                     filterable
                     placeholder="请选择"
                     @change="setServiceCompany"
                     style="width: 450px;">
            <el-option v-for="(item,key) in customerServiceCompanyList"
                       :key="key"
                       :label="item.name"
                       :value="item.companyId"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 150px;">
          <el-button type="primary"
                     @click="formAdd">保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { get, post } from '../../../store/api'
import contractCreateItem from '../../../pageComponent/contractCreateItem'
import contractCloseItem from '../../../pageComponent/contractCloseItem'
import serviceFeeInterval from '../../../component/serviceFeeInterval'
import performanceRules from './performanceRules'
import upload from './upload'
import { baseUrl } from "../../../config/address";
import { mapGetters } from 'vuex'
export default {
    name: "companyInfo",
    props: ['ruleForm', 'editType', 'serviceFeeList', 'showAddBtn', 'showDelBtn'],
    components: {
        contractCreateItem,
        contractCloseItem,
        upload,
        performanceRules,
        serviceFeeInterval,
    },
    computed: {
        ...mapGetters({
            agentList: 'agentList',
            serviceCompaniesList: 'serviceCompaniesList',
            settleTypeList: 'settleTypeList',
            payModeList: 'payModeList',
            allServiceTypeList: 'serviceTypeList',
            customerServiceCompanyList: 'customerServiceCompanyList'
        }),
        agentCompanyList() {
            let agentCompanyList = []
            this.quoteFeeContent.serviceCompanyRateList.forEach(e => {
                agentCompanyList.push({
                    name: e.serviceCompanyName,
                    companyId: e.serviceCompanyId
                })
            })
            return agentCompanyList
        },
        filterList() {
            let list = this.agentCompanyList.length ? this.agentCompanyList : this.serviceCompaniesList
            // 过滤，已经有的落地公司不再显示
            return list.filter(e => {
                return !this.ruleForm.contracts.filter(ev => ev.serviceCompanyId == e.companyId).length
            })
        }
    },
    watch: {
        agentList() { // 获取代理商列表并找到当前代理商
            this.agentList.forEach(e => {
                if(e.companyId == this.ruleForm.agentCompanyId) {
                    this.chargeByName = e.chargeByName
                    Object.assign(this.quoteFeeContent, e.quoteFeeContent)
                    // this.quoteFeeContent = e.quoteFeeContent
                    this.quoteRule = e.quoteRule
                }
            })
        },
        ruleForm() {
            this.initData()
        },
        serviceCompaniesList() {
            this.initData()
        }
    },
    data () {
        return {
            dialogVisible: false,
            info: {
                serviceCompanyName: '',
                serviceCompanyId: '',
                goodsList: [],
                corporateName: '',
                address: '',
                telephone: '',
                taxLandingId: ''
            },
            customerInvoiceTypes: {
                '10': {
                    text: '账单开票',
                    value: 10
                },
                '20': {
                    text: '预开票',
                    value: 20
                }
            },
            chargeByName: '',
            chargeByNames: [],
            f2: (rule, value, cb) => {
                if (!/^(([0-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
                    return cb('请输入正确的服务费收费（大于或等于零且最多两位小数）')
                }
            },
            ruleList: [
                {
                    text: "结算规则",
                    value: "settle"
                },
                {
                    text: "返佣规则",
                    value: "rakeback"
                }
            ],
            quoteRule: '',
            quoteFeeContent: {
                containIncomeAmount: '',
                incomeAmount: '',
                quoteFeeRate: '',
                quoteFeeType: '',
                serviceCompanyRateList: [],
                stepwiseList: [
                    {
                        endAmount: '',
                        equalsEnd: '',
                        equalsStart: '',
                        percent: '',
                        sequence: '',
                        startAmount: ''
                    }
                ]
            },
            // 服务类型集合
            serverTypeMap: new Map(),
            contractDate: [],
        }
    },
    methods: {
        // 下载 绩效规则-协议
        downloadRule(serviceCompanyId) {
            const datas = JSON.parse(JSON.stringify(this.ruleForm))
            datas.contracts.forEach((item) => {
                delete item.optionServiceTypeList
            })
            let param = {
                datas,
                instanceId: this.$route.query.id,
                workflowType: this.$route.query.editType
            };
            post(`/api/contract-web/contract/generate-position-attach?serviceCompanyId=${serviceCompanyId}`, param).then(res => {
                console.log(res)
								if(!res.downloadCode || res.downloadCode === 'undefined') {
										this.$message({
												message: '下载地址错误',
												type: 'warning'
										});
										return
								}
                window.open(`${baseUrl}/api/contract-web/file/download?downloadCode=${res.downloadCode}`);
            })
        },
        // 验证岗位模板是否填写
        validatePost(rule, value, callback) {
            const arr = value.some((item) => {
                return item.positions[0].posName === ''
            })
            if (!value.length || arr) {
                callback(new Error('每个服务类型至少对应一个岗位'));
            } else {
                callback();
            }
        },
        // 删除岗位
        removePost(cindex, index, i) {
            const servicePost = this.ruleForm.contracts[cindex].servicePosList[index]
            if (servicePost.positions.length === 1) {
                this.ruleForm.contracts[cindex].servicePosList[index].positions = [
                    {
                        serviceId: servicePost.serviceId,
                        serviceName: servicePost.serviceName,
                        positions: [{
                            posName: '',
                            description: '',
                            performance: '',
                            attachment: {
                                refId: '',
                                downloadCode: '',
                                displayname: '',
                                createByName: '',
                                createTime: '',
                            }
                        }]
                    }
                ]
            } else {
                this.ruleForm.contracts[cindex].servicePosList[index].positions.splice(i, 1)
            }
        },
        // 岗位模板数据
        addPositions(index, pIndex, data) {
            const obj = this.ruleForm.contracts[index].servicePosList[pIndex].positions[0]
            // console.log(data)
            // 根据当前模板是否有数据，选择是插入还是替换
            if (obj.posName) {
                this.ruleForm.contracts[index].servicePosList[pIndex].positions.push(data)
            } else {
                this.ruleForm.contracts[index].servicePosList[pIndex].positions.splice(0, 1, data)
            }
            this.$forceUpdate()
        },
        // 根据选中的服务类型更改positions
        changePositions(checked, index, v) {
            const positions = this.ruleForm.contracts[index].servicePosList
            const len = this.ruleForm.contracts[index].serviceTypeList.length
            if (len > 5) return
            if (checked) {
                this.ruleForm.contracts[index].servicePosList.push({
                    serviceId: v.serviceId,
                    serviceName: v.serviceName,
                    positions: [{
                        posName: '',
                        description: '',
                        performance: '',
                        attachment: {
                            refId: '',
                            downloadCode: '',
                            displayname: '',
                            createByName: '',
                            createTime: '',
                        }
                    }]
                })
            } else {
								this.ruleForm.contracts[index].servicePosList = positions.filter(item => item.serviceId !== v.serviceId)
            }
            this.$forceUpdate()
        },
        autoFill(index, val) {
            if (val) {
                this.ruleForm.contracts[index].startDate = val[0]
                this.ruleForm.contracts[index].endDate = val[1]
            }
        },
        setTaxLanding() {
            this.ruleForm.contracts.forEach((item, index) => {
                // 设置落地公司ID
                this.serviceCompaniesList.some((item1) => {
                    if (item1.companyId === item.serviceCompanyId) {
                        item.taxLandingId = item1.taxLandingId
                        item.taxLandingName = item1.taxLandingName
                        return true
                    }
                })
            })
				},
				initSetServicePost() {
            this.ruleForm.contracts.forEach((item, index) => {
                // 初始设置岗位模板数据
                if (!item.servicePosList || !item.servicePosList.length) {
                    item.servicePosList = item.serviceTypeList.map((val) => {
                        const obj = {
                            serviceId: val.serviceId,
                            serviceName: val.serviceName,
                            positions: [{
                                posName: '',
                                description: '',
                                performance: '',
                                attachment: {
                                    refId: '',
                                    downloadCode: '',
                                    displayname: '',
                                    createByName: '',
                                    createTime: '',
                                }
                            }]
                        }
                        return obj
                    })
                } else {
									// 过滤没有服务类型的C端绩效规则
									const { servicePosList, serviceTypeList } = this.ruleForm.contracts[index]
									this.ruleForm.contracts[index].servicePosList = servicePosList.filter(item1 => {
										return serviceTypeList.some(item2 => item2.serviceId === item1.serviceId)
									})
								}
            })
				},
        initData() {
						this.setTaxLanding()
            this.updateServiceTypeList()
						this.initSetServicePost()
            this.upDataServerType()
            this.getContractDate()
        },
        // 处理每个落地公司的合同期限
        getContractDate() {
            const { contracts } = this.ruleForm
            contracts.length && contracts.forEach((item, index) => {
                const { startDate, endDate } = item
                this.contractDate[index] = [startDate, endDate]
            })
        },
        // 根据ID获取服务类型
        getServerTypeWithId(id) {
            let itemx = null
            this.allServiceTypeList.some((item) => {
                if (id === item.serviceId) {
                    itemx = item
                }
            })
            return itemx
        },
        // 更新每个落地公司选择的服务类型
        updateServiceTypeList() {
            this.ruleForm.contracts.forEach((item) => {
                item.serviceTypeList = item.serviceTypeList.map((item) => {
                    return this.getServerTypeWithId(item.serviceId)
                }).filter((item) => {
                    return item
                })
            })
        },
        // 更新当前显示的服务类型
        upDataServerType() {
            // this.serverTypeMap = new Map()
            // this.ruleForm.contracts.forEach((item) => {
            //     let set = null
                // 设置已经选择的服务类型集合
                // if (this.serverTypeMap.has(item.taxLandingId)) {
                //     set = this.serverTypeMap.get(item.taxLandingId)
                // } else {
                //     set = new Set()
                //     this.serverTypeMap.set(item.taxLandingId, set)
                // }
                // 添加已经选中的
                // item.serviceTypeList.forEach((item2) => {
                //     if (item2.serviceId) {
                //         set.add(item2.serviceId)
                //     }
                // })
            // })
            this.ruleForm.contracts.forEach((item) => {
                // let set = this.serverTypeMap.get(item.taxLandingId)
                // 已经选中的数据
                // const selArr = Array.from(set)
                // 获取当前选中的数组集合
                // const serviceTypeListSet = new Set(item.serviceTypeList.map((item) => {
                //     return item.serviceId
                // }))
                // 排除掉当前选中的数组
                // const otherSelArr = selArr.filter((item1) => {
                //     return !serviceTypeListSet.has(item1)
                // })
                // 获取其他已经选中数据的集合
                // const otherSelSet = new Set(otherSelArr)
                // 排除掉已经选中的
                // let arr = this.allServiceTypeList.filter((item1) => {
                //     return !otherSelSet.has(item1.serviceId)
                // })
                // item.optionServiceTypeList = arr
                item.optionServiceTypeList = this.allServiceTypeList
            })
            this.$forceUpdate()
        },
        /**
         * 服务类型改变的时候调用
         */
        serverTypeChangeChange(arr) {
            if (arr.length > 5) {
                arr.pop()
                this.$message({
                    message: '最多选择5条服务类型',
                    type: 'warning'
                });
            }
            this.upDataServerType()
        },
        formAdd(ev) {
            // 判断重复
            const repeat = this.ruleForm.contracts.some(el => {
                return el.serviceCompanyId === this.info.serviceCompanyId
            })
            if(repeat) {
                this.$message({
                    message: '已有相同落地公司',
                    type: 'warning'
                });
                return
            }
            const customCompanyId = this.ruleForm.customerId
            const serviceCompanyId = this.info.serviceCompanyId
            const param = { customCompanyId, serviceCompanyId }
            post('/api/contract-web/commom/custom-form-contract', param).then((res) => {
								if (!res.serviceFeeInterval) {
									res.serviceFeeInterval = {
										secondType: '', // 服务类型：should-应发金额，real-实发金额，0-分2.8万-无流水阶梯，1-不分2.8万-按流水总额阶梯，2-分2.8万-按流水分阶梯报价，3-分2.8-9.3万无流水阶梯，4-分2.8-9.3按流水阶梯
										serviceFeeType: 'step', // fixed-固定金额，ratio-固定比例，step-阶梯收费
										serviceFeeContent: [],
										settledRate: '',
									}
								}
                this.ruleForm.contracts.push(Object.assign(res))
            		this.setTaxLanding()
                const index = this.ruleForm.contracts.length - 1
                // 把时间读取出来
                this.contractDate[index] = [res.startDate, res.endDate]
                // 把goodList也存到contracts里面去
                this.ruleForm.contracts[index].goodsList = this.info.goodsList
                this.ruleForm.serviceCompanyList.push({
                    serviceCompanyName: this.info.serviceCompanyName,
                    serviceCompanyId: this.info.serviceCompanyId
                });
                this.dialogVisible = false
                this.updateServiceTypeList()
								this.initSetServicePost()
                this.upDataServerType()
                // console.log(this.ruleForm.contracts)
            })
        },
        result({
            serviceFeeContent,
            serviceFeeContent2,
            arrIndex,
            check
        }) {
            this.ruleForm.contracts[arrIndex].check = check;
            this.ruleForm.contracts[arrIndex].serviceFeeContent = serviceFeeContent
            this.ruleForm.contracts[arrIndex].serviceFeeContent2 = serviceFeeContent2
        },
        resultClose({quoteFeeContent, arrIndex, check}) {
            this.ruleForm.contracts[arrIndex].checkC = check;
            this.ruleForm.contracts[arrIndex].quoteFeeContent = quoteFeeContent
	    },
        handleSuccess(fileList, referArr, arrIndex) {
            let contract = this.ruleForm.contracts[arrIndex];
            contract.referNames = fileList;
            contract.referIds = referArr;
        },
        deleteForm(i) {
            this.ruleForm.serviceCompanyList && this.ruleForm.serviceCompanyList.splice(i, 1);
            this.ruleForm.contracts.splice(i, 1);
            this.serviceFeeList && this.serviceFeeList.splice(i, 1);
            this.upDataServerType()
        },
        setServiceCompany(serviceCompanyId) {
            const serviceCompany = this.customerServiceCompanyList.find((o) => {
                return o.companyId === serviceCompanyId
            });
            this.info.serviceCompanyName = serviceCompany.name;
            this.info.corporateName = serviceCompany.corporateName;
            this.info.address = serviceCompany.address;
            this.info.telephone = serviceCompany.telephone;
            this.info.taxLandingId = serviceCompany.taxLandingId
            this.info.taxLandingName = serviceCompany.taxLandingName
            get('/api/salemgt/common/service-company/goods', {
                serviceCompanyId
            }).then(result => {
                this.info.goodsList = result || []
            })
        }
    },
    async mounted() {
        await this.$store.dispatch('getServiceTypeList')
        this.$store.dispatch('getAgentList')
        this.$store.dispatch('getServiceCompaniesList', this.ruleForm.agentCompanyId)
        this.$store.dispatch('getSettleTypeList')
        this.$store.dispatch('getCustomerServiceCompanyList', this.ruleForm.customerId)

        this.ruleForm.contracts.forEach(item => {
            item.showServiceCompanyInfo = item.showServiceCompanyInfo === '1' ? true : false;
            let serviceCompanyRateList = item.quoteFeeContent.serviceCompanyRateList
            if(serviceCompanyRateList && serviceCompanyRateList.length) {
                item.quoteFeeContent.serviceCompanyRateList = serviceCompanyRateList.filter(e => e.serviceCompanyId == item.serviceCompanyId)
            }
        })
    }
}
</script>

<style scoped>
.form-list {
  border: 1px solid #999999;
  /* padding: 32px 100px 20px 0; */
  /* margin: 0 0 22px 100px; */
  position: relative;
  /* width: 1200px; */
}

/* .btn-del {
    padding: 0;
    position: absolute;
    top: 20px;
    right: 20px;
} */

.btn-add {
  font-weight: normal;
  color: red;
  margin-left: 30px;
}
.el-icon-question {
  margin-right: 5px;
  color: #f56c6c;
  cursor: pointer;
}
.el-icon-question {
  margin-right: 5px;
  color: #f56c6c;
  cursor: pointer;
}
</style>

<style lang="scss">
.el-form--inline .el-form-item__label {
  flex: none;
}
</style>
