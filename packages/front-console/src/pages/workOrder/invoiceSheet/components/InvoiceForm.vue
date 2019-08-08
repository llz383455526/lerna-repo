<template>
  <el-form
    ref="formData"
    label-width="200px"
    class="invoice-form"
    :model="formData"
    :rules="rules"
  >
    <el-form-item 
      label="发票类型"
      prop="invoiceType"
    >
      <el-radio-group v-model="formData.invoiceType">
        <el-radio 
          v-for="item in $attrs.invoiceTypeList"
          :key="item.value"
          :label="item.value"
        >
          {{ item.text }}
        </el-radio>
      </el-radio-group>
    </el-form-item>
    <div
      v-for="(invoiceWorkOrderSubjectParams,index) in formData.invoiceWorkOrderSubjectParams"
      :key="index"
    >   
      <el-form-item 
        label="发票类目"
        :prop="'invoiceWorkOrderSubjectParams.' + index + '.subjectId'"
        :rules="validateCategory"
      >
        <el-select
          v-model="invoiceWorkOrderSubjectParams.subjectId"
          @change="addText($event,index)"
          placeholder="请选择发票类目"
        >
          <!-- filterInvoiceCategory(index) -->
          <el-option
            v-for="item in $attrs.invoiceCategory"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          />
        </el-select>
        <el-button
          v-if="index !== 0"
          class="addBtn"
          type="primary"
          size="large"
          @click="deleteCategory(index)"
        >
          删除
        </el-button>
        <el-button
          v-if="index === formData.invoiceWorkOrderSubjectParams.length - 1"
          class="addBtn"
          type="primary"
          size="large"
          @click="addCategory(index)"
        >
          添加
        </el-button>
      </el-form-item>
      <el-form-item
        label="开票金额（含税）"
        :prop="'invoiceWorkOrderSubjectParams.' + index + '.amount'"
        :rules="validateAmount"
      >
        <el-input
          class="shortinput"
          v-model.number="invoiceWorkOrderSubjectParams.amount"
        />
      </el-form-item>
    </div>
    <el-form-item
      v-if="formData.invoiceWorkOrderSubjectParams.length > 1"
      label="开票总金额（含税）"
      prop="amount"
    >
      <category-table
        :table-data="formData.invoiceWorkOrderSubjectParams"
      />
    </el-form-item>
    <el-form-item
      label="核对发票信息"
      prop="invoiceInfo"
      :rules="validateInvoiceInfo"
    >
      <invoice-table
        :custom-company-id="resultCustomeId"
        :service-company-id="resultServiceId"
        @getIvoiceInfo="getIvoiceInfo"
      />
    </el-form-item>
    <el-form-item
      label="发票用途（对内说明）"
      prop="purpose"
    >
      <el-input
        class="shortinput"
        type="textarea"
        v-model="formData.purpose"
      />
    </el-form-item>
    <el-form-item
      label="发票显示备注"
      prop="remark"
    >
      <el-input
        class="shortinput"
        type="textarea"
        v-model="formData.remark"
      />
    </el-form-item>
    <el-form-item>
      <el-button @click="$router.back()">
        取消
      </el-button>
      <el-button
        type="primary"
        @click="onSubmit('formData')"
      >
        提交申请
      </el-button>
    </el-form-item>
  </el-form>
</template>

<script>
import InvoiceTable from './InvoiceTable'
import CategoryTable from './CategoryTable'

import {invoiceApi} from 'src/api'
import { get, post, importPost } from "src/store/api"

export default {
    data() {
        var validateAmount = (rule, value, callback) => {
            if (value === '' || value == 0) {
                callback(new Error('开票金额（含税）不能为空'));
            } else {
                if (!/^\d+\.?\d{0,2}$/.test(value)) {
                    callback(new Error('开票金额（含税）支持两位小数'));
                }
                callback()
            }
        };
        // 验证核对发票信息
        var validateInvoiceInfo = (rule, value, callback) => {
            console.log(this.formData)
            // 这里是发票信息的校验规则
            if(this.formData.invoiceType === 'ZP') {
                const tag = Object.values(this.formData.invoiceInfo).every(item => {
                    return !!item
                })
                if(!tag){
                    callback(new Error('核对信息不完整'));
                } else {
                    callback()
                }
            } else {
                const obj = Object.assign({},this.formData.invoiceInfo)
                delete obj.addr
                delete obj.phone
                delete obj.bankName
                delete obj.bankAccount
                const tag = Object.values(obj).every(item => {
                    return !!item
                })
                if(!tag){
                    callback(new Error('核对信息不完整'));
                } else {
                    callback()
                }
            }
        };
        return {
            formData: {
                "amount": '', //总金额
                "customCompanyId": '50249', // 客户公司id
                "businessType": "", // 业务类型
                "buyerCompanyId": "", // 购买方公司
                "invoiceCompanyId": "", // 开票公司
                "invoiceType": "", // 发票类型
                
                "invoiceWorkOrderSubjectParams": [ // 发票类目集合
                    {
                        "amount": '', // 单价（含税）
                        "subjectId": '' // 发票类目
                    }
                ],
                invoiceInfo: '', // 用来验证核对信息，提交的时候做了delete处理
                "purpose": "", // 发票用途
                "remark": "", // 开票公司发票备注
                "serviceCompanyId": '346' // 服务公司ID
            },
            validateAmount: [ // 开票金额的验证
                {
                    required: true, message: '开票金额（含税）不能为空', trigger: 'blur'
                },
                {
                    validator: validateAmount , trigger: 'blur'
                }
            ],
            validateCategory: { // 开票类目的验证
                required: true, message: '发票类目不能为空', trigger: 'change'
            },
            validateInvoiceInfo: {
                validator: validateInvoiceInfo
            },
            rules: {
                invoiceType: [
                    { required: true, message: '请选择发票类型', trigger: 'change' }
                ],
                purpose: [
                    { required: true, message: '请填写发票用途', trigger: 'blur' }
                ]
            }
        }
    },
    computed: {
        resultCustomeId() {
            const result = this.$route.query.businessType && this.$route.query.businessType !== "crowdSource"
                ? this.formData.buyerCompanyId
                : this.formData.customCompanyId
            return result
        },
        resultServiceId() {
            const result = this.$route.query.businessType && this.$route.query.businessType !== "crowdSource"
                ? this.formData.invoiceCompanyId
                : this.formData.serviceCompanyId
            return result
        }
    },
    components: {
        InvoiceTable,
        CategoryTable
    },
    methods: {
        // 这个函数是确保发票类目不能重复的，坤鹏写的，怎么看懂（20190529修改可以重复选择）
        filterInvoiceCategory(index) {
            return this.$attrs.invoiceCategory.filter((e, i) => {
                return !this.formData.invoiceWorkOrderSubjectParams.filter((ev, ind) => index > ind && e.value == ev.subjectId).length
            })
        },
        // this.formData.invoiceWorkOrderSubjectParams.filter(ev => ev != e.value && index < i)
        // filterCompanyList(a) {
        //     return this.companyList.filter(e => {
        //         return !this.form.quoteFeeContent.serviceCompanyRateList.filter((ev, ind) => a > ind && e.companyId == ev.serviceCompanyId).length
        //     })
        // },
        // 为select添加文字选项
        addText(val,index) {
            console.log(val,index)
            // 选择后清除后面选择的发票类目，和filterInvoiceCategory配套使用的
            // this.formData.invoiceWorkOrderSubjectParams.forEach((e, i) => {
            //     if(i > index) {
            //         e.subjectId = ''
            //         e.subjectText = ''
            //     }
            // })
            const invoiceCategory = this.$attrs.invoiceCategory
            for(let i = 0; i<invoiceCategory.length; i++) {
                if(invoiceCategory[i].value == val){
                    const obj = Object.assign(this.formData.invoiceWorkOrderSubjectParams[index],{subjectText: invoiceCategory[i].text})
                    this.$set(this.formData.invoiceWorkOrderSubjectParams, index, obj)
                    // this.formData.invoiceWorkOrderSubjectParams[index].subjectText = invoiceCategory[i].text
                    return
                }
            }
        },
        getIvoiceInfo(info) {
            this.formData.invoiceInfo = info
        },
        addCategory(index) {
            console.log(index)
            this.formData.invoiceWorkOrderSubjectParams.push({
                "amount": '',
                "subjectId":''
            })
        },
        deleteCategory(index) {
            console.log(index)
            this.formData.invoiceWorkOrderSubjectParams.splice(index, 1)
        },
        accAdd(arg1, arg2) {
            var r1, r2, m, c;
            try {
                r1 = arg1.toString().split(".")[1].length;
            }
            catch (e) {
                r1 = 0;
            }
            try {
                r2 = arg2.toString().split(".")[1].length;
            }
            catch (e) {
                r2 = 0;
            }
            c = Math.abs(r1 - r2);
            m = Math.pow(10, Math.max(r1, r2));
            if (c > 0) {
                var cm = Math.pow(10, c);
                if (r1 > r2) {
                    arg1 = Number(arg1.toString().replace(".", ""));
                    arg2 = Number(arg2.toString().replace(".", "")) * cm;
                } else {
                    arg1 = Number(arg1.toString().replace(".", "")) * cm;
                    arg2 = Number(arg2.toString().replace(".", ""));
                }
            } else {
                arg1 = Number(arg1.toString().replace(".", ""));
                arg2 = Number(arg2.toString().replace(".", ""));
            }
            return (arg1 + arg2) / m;
        },
        onSubmit(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    let total = 0
                    this.formData.invoiceWorkOrderSubjectParams.forEach(i => {
                        // total += Number(i.amount)
                        total = this.accAdd(total, i.amount)
                    })
                    this.formData.amount = total
                    const data = JSON.parse(JSON.stringify(this.formData))
                    delete data.invoiceInfo

                    post(invoiceApi.addInvoice, data).then(res => {
                        this.$message({
                            type: 'success',
                            message: '提交成功！'
                        })
                        sessionStorage.setItem('isCreate', 1)
                        this.$router.go(-1)
                    })
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
            
        }
    },
    created() {
        const keys = Object.keys(this.$route.query)
        keys.forEach(i => {
            this.formData[i] = this.$route.query[i]
        })
    }
}
</script>

<style lang="scss" scoped>
.shortinput{
    width: 300px;
}
</style>
