<template>
  <el-dialog
    title="选择业务类型"
    :visible.sync="show"
    width="630px"
  >
    <el-form
      :model="form"
      :rules="rules"
      size="small"
      label-width="130px"
      ref="form"
    >
      <el-form-item
        label="业务类型"
        prop="businessType"
      >
        <el-radio-group
          v-model="form.businessType"
          @change="changeBusinessType"
        >
          <el-radio label="crowdSource">
            普通众包
          </el-radio>
          <el-radio label="subcontract">
            转包
          </el-radio>
          <el-radio label="preInvoice">
            预开票
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- 转包，预开票才有的 -->
      <template v-if="form.businessType !== businessTypes[0]">
        <el-form-item
          label="原合同客户公司"
          prop="customCompanyId"
        >
          <el-select
            class="form_input"
            placeholder="原合同客户公司"
            v-model="form.customCompanyId"
            filterable
            @change="getServiceCompanyList"
          >
            <el-option
              v-for="(e, i) in customCompanies"
              :key="i"
              :label="e.text"
              :value="e.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="原合同落地公司"
          prop="serviceCompanyId"
        >
          <el-select
            class="form_input"
            placeholder="原合同落地公司"
            v-model="form.serviceCompanyId"
            filterable
          >
            <el-option
              v-for="(e, i) in serviceCompanyList"
              :key="i"
              :label="e.text"
              :value="e.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <template v-if="form.businessType === businessTypes[0]">
        <el-form-item
          label="客户公司"
          prop="customCompanyId"
        >
          <el-select
            class="form_input"
            v-model="form.customCompanyId"
            filterable
            @change="getServiceCompanyList"
          >
            <el-option
              v-for="(e, i) in customCompanies"
              :key="i"
              :label="e.text"
              :value="e.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="落地公司"
          prop="serviceCompanyId"
        >
          <el-select
            class="form_input"
            v-model="form.serviceCompanyId"
            filterable
          >
            <el-option
              v-for="(e, i) in serviceCompanyList"
              :key="i"
              :label="e.text"
              :value="e.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <!-- 两个落地公司 -->
      <template v-if="form.businessType === businessTypes[1]">
        <el-form-item
          label="购买方公司"
          prop="buyerCompanyId"
        >
          <el-select
            class="form_input"
            v-model="form.buyerCompanyId"
            filterable
          >
            <el-option
              v-for="(e, i) in allServiceCompanyList"
              :key="i"
              :label="e.text"
              :value="e.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="开票公司"
          prop="invoiceCompanyId"
        >
          <el-select
            class="form_input"
            v-model="form.invoiceCompanyId"
            filterable
          >
            <el-option
              v-for="(e, i) in allServiceCompanyList"
              :key="i"
              :label="e.text"
              :value="e.value"
            />
          </el-select>
        </el-form-item>
      </template>
      <!-- 预开票 -->
      <template v-if="form.businessType === businessTypes[2]">
        <el-form-item
          label="客户公司"
          prop="buyerCompanyId"
        >
          <el-select
            disabled
            class="form_input"
            v-model="form.buyerCompanyId"
          >
            <el-option
              v-for="(e, i) in customCompanies"
              :key="i"
              :label="e.text"
              :value="e.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="落地公司"
          prop="invoiceCompanyId"
        >
          <el-select
            class="form_input"
            v-model="form.invoiceCompanyId"
            filterable
            @change="() => {hasContract = false}"
          >
            <el-option
              v-for="(e, i) in allServiceCompanyList"
              :key="i"
              :label="e.text"
              :value="e.value"
            />
          </el-select>
        </el-form-item>
      </template>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="show = false">取消</el-button>
      <el-button
        type="primary"
        @click="result"
      >确认</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { get, post, importPost } from "src/store/api";
import { invoiceApi } from "src/api";
import { showNotify } from '../../../plugin/utils-notify'

export default {
    data() {
        /**
         * 验证businessType为 2 时，购买和开票有一个至少是原合同的落地公司
         * 验证businessType为 3 时，购买和开票有一个至少是原合同的落地公司
         *  */
        var validateServiceCompanyId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error('请选择落地公司'));
            } else {
                if(this.form.businessType === this.businessTypes[1]) {
                    // 如果和原合同一致，并且和InvoiceCompanyId不一致，则通过
                    // 如果和原合同不一致，则去验证InvoiceCompanyId
                    if (this.form.buyerCompanyId !== '' && this.form.invoiceCompanyId !== '') {
                        this.$refs.form.validateField('buyerCompanyId');
                    }
                }else if(this.form.businessType === this.businessTypes[0] && !this.canMakeInvoice) {
                  // 众包时，风控是否允许申请发票
                  callback(new Error('风控限制：该客户与落地公司禁止提交发票申请'))
                }
                callback();
            }
        };
        var validateBuyerCompanyId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.form.businessType === this.businessTypes[1]?'请输入购买方公司':'请选择客户公司'));
            } else {
                if(this.form.invoiceCompanyId !== '') {
                    this.$refs.form.validateField('invoiceCompanyId');
                }
                 callback();
            }
        };
        var validateInvoiceCompanyId = (rule, value, callback) => {
            if (value === '') {
                callback(new Error(this.form.businessType === this.businessTypes[1]?'请输入开票公司':'请选择落地公司'));
            } else if (value === this.form.buyerCompanyId) {
                callback(new Error('开票公司不能和购买方公司相同'));
            } else if(this.form.businessType === this.businessTypes[1] && value !== this.form.serviceCompanyId && this.form.buyerCompanyId !== this.form.serviceCompanyId) {
                callback(new Error('开票公司或者购买方公司至少有一个必须与原合同落地公司'));
            } else if(this.hasContract) {
                callback(new Error('客户与落地公司已签订合同，请选择“普通众包”业务'));
            }
             else {
                callback();
            }
        };
        return {
            form: {
                businessType: 'crowdSource',
                customCompanyId: '',
                serviceCompanyId: '',
                buyerCompanyId: '', // 购买方公司 ,只有在非众包才使用
                invoiceCompanyId: '' // 开票公司
            },
            businessTypes: ['crowdSource', 'subcontract', 'preInvoice'],
            hasContract: false, // 预开票时验证是否有合同关系
            canMakeInvoice: true, // 众包时，风控是否允许申请发票
            rules: {
                serviceCompanyId: [
                    { validator: validateServiceCompanyId, trigger: "change"}
                ],
                customCompanyId: [
                    { required: true, message: "请选择客户公司", trigger: "change"}
                ],
                buyerCompanyId: [
                    { validator: validateBuyerCompanyId, trigger: "change"}
                ],
                invoiceCompanyId: [
                    { validator: validateInvoiceCompanyId, trigger: "change"}
                ]
            },
            show: false,
            customCompanies: [],
            serviceCompanyList: [], // 和客户公司联动的公司
            allServiceCompanyList: [], // 所有的螺钉公司
        }
    },
    methods: {
        changeBusinessType(businessType) {
            this.$refs.form.clearValidate()
            if(businessType === this.businessTypes[1]) {
                this.form.buyerCompanyId = this.form.invoiceCompanyId = ''
            }
            if(businessType === this.businessTypes[2]) {
                this.form.buyerCompanyId = this.form.customCompanyId
                this.form.invoiceCompanyId = ''
            }
        },
        transmit(a) {
            this.show = a
            // get(invoiceApi.getServiceCompany).then(data => {
            //     this.serviceCompanyList = data
            // })
            get(invoiceApi.customCompanyOptions).then(data => {
                this.customCompanies = data
            })
        },
        pushCreatePage() {
          this.show = false
          let str = ''
          for(let k in this.form) {
              str += `${str ? '&' : '?'}${k}=${this.form[k]}`
          }
          this.$router.push(`/main/workOrder/invoice_sheet/index${str}`)
        },
        result() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    // 如果是预开票，去查看是否有合同关系
                    if(this.form.businessType === 'preInvoice') {
                        post(invoiceApi.queryCompanyContract,
                            {customerId: this.form.buyerCompanyId,serviceCompanyId: this.form.invoiceCompanyId})
                        .then(res => {
                            if(res) {
                                this.hasContract = true
                                this.$refs.form.validateField('invoiceCompanyId')
                            } else {
                                this.pushCreatePage()
                            }
                        })
                    } else {
                      // 如果是众包，需要看是否符合风控规则
                      if(this.form.businessType === 'crowdSource') {
                        get(invoiceApi.canMakeInvoice,
                              {customCompanyId: this.form.customCompanyId,serviceCompanyId: this.form.serviceCompanyId})
                        .then(res => {
                          this.canMakeInvoice = res
                          if(res) {
                            this.pushCreatePage()
                          } else {
                            // 鉴定
                            this.$refs.form.validateField('serviceCompanyId')
                          }
                        })
                      } else {
                        this.pushCreatePage()
                      }
                      
                    }
                }
            })
        },
        getServiceCompanyList() {
            // 重置落地选择
            this.form.serviceCompanyId = ''
            // 预开票和原合同客户公司一致
            if(this.form.businessType === this.businessTypes[2]) {
                this.$refs.form.clearValidate('buyerCompanyId')
                this.form.buyerCompanyId = this.form.customCompanyId
            }
            get(invoiceApi.serviceCompanyOptions, {
                customCompanyId: this.form.customCompanyId
            }).then(data => {
                this.serviceCompanyList = data
            })
        },
        getAllServiceCompanyList() {
            get(invoiceApi.serviceCompanyOptions).then(data => {
                this.allServiceCompanyList = data
            })
        }
        // getCustomCompany() {
        //     get(invoiceApi.getCustomCompanyByServiceId, {
        //         serviceCompanyId: this.form.serviceCompanyId
        //     }).then(data => {
        //         this.customCompanies = data
        //     })
        // }
    },
    created() {
        this.getAllServiceCompanyList()
    }
}
</script>
<style lang="scss" scoped>
.form_input {
    width: 400px;
    &.mini_form_input{
        width: 193px;
    }
}
</style>
