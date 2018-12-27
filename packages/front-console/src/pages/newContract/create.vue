<template>
  <div class="contract-container bg-white">
    <div class="widget-header">
      <h4 class="widget-title">创建合同</h4>
    </div>
    <div class="widget-body">
      <div class="widget-main">
        <el-steps
          :active="active"
          simple
          finish-status="success"
        >
          <el-step title="合同选项"></el-step>
          <el-step title="销售信息"></el-step>
          <el-step title="企业信息"></el-step>
          <el-step title="选择落地公司"></el-step>
          <el-step title="附加条款"></el-step>
        </el-steps>
        <hr>

        <el-form
          :inline="true"
          :model="contractModel.contractForm"
          :rules="check.rules"
          ref="contractForm"
          label-width="200px"
          class="contractForm"
          :disabled="editType === 'watch'||editType ==='workflow'"
        >
          <contractOption
            :contractModel="contractModel"
            @setSettleType="setSettleType"
            v-if="active === 0"
          ></contractOption>
          <customerEva
            :contractModel="contractModel"
            v-if="active === 1"
          ></customerEva>
          <salesContactInfo
            :contractModel="contractModel"
            v-if="active === 1"
          ></salesContactInfo>
          <companyBasicInfo
            :contractModel="contractModel"
            v-if="active === 2"
          ></companyBasicInfo>
          <relevantMerchantInfo
            :contractModel="contractModel"
            v-if="false"
          ></relevantMerchantInfo>
          <businessBillingInfo
            :contractModel="contractModel"
            v-if="active === 2"
          ></businessBillingInfo>
          <companyInfo
            :contractModel="contractModel"
            v-if="active === 3"
          ></companyInfo>
          <additionalClause
            :contractModel="contractModel"
            :editType="editType"
            :files="contractModel.files"
            v-if="active === 4"
          ></additionalClause>
          <el-form-item v-if="editType != 'watch' && editType!='workflow' && false">
            <el-button
              type="primary"
              @click="saveContract(false)"
            >保存</el-button>
          </el-form-item>
        </el-form>
        <generateContract :contractModel="contractModel"></generateContract>
        <hr>
        <div class="wizard-actions">
          <el-button @click="backToList('list')">返回</el-button>
          <el-button
            @click="prev"
            v-if="active != 0"
          >上一步</el-button>
          <el-button
            type="success"
            @click="next('contractForm')"
            v-if="active != 4"
          >下一步</el-button>
          <el-button
            type="primary"
            @click="submitContract('contractForm')"
            v-if="active == 4"
          >提交</el-button>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import { post, postWithErrorCallback } from "../../store/api"
import { showNotify } from "../../plugin/utils-notify";

import ContractModel from '../../model/contract/newContract/ContractModel' // 数据模型
import Check from '../../model/contract/newContract/check.js' // 检测数据模型
import contractOption from './components/contractOption.vue' // 合同选项
import customerEva from './components/customerEva.vue' // 客户企业评估
import salesContactInfo from './components/salesContactInfo.vue' // 销售联系信息
import companyBasicInfo from './components/companyBasicInfo.vue' // 企业基本信息
import relevantMerchantInfo from './components/relevantMerchantInfo.vue' // 相关商户信息
import businessBillingInfo from './components/businessBillingInfo.vue' // 企业开票信息
import companyInfo from './components/companyInfo.vue' // 落地公司信息
import additionalClause from './components/additionalClause.vue' // 合同附加条款
import generateContract from './components/generateContract.vue' // 生成合同
import upload from './components/upload' // 上传组建

export default {
  components: {
    contractOption,
    customerEva,
    salesContactInfo,
    companyBasicInfo,
    relevantMerchantInfo,
    businessBillingInfo,
    companyInfo,
    additionalClause,
    generateContract,
    upload
  },
  created () {
    let id = this.$route.query.id;
    if (id) {
      this.contractModel.contractId = id;
      this.contractModel.getContractDetail(id);
    }
    let workflowType = this.$route.query.workflowType;
    if (workflowType) {
      this.contractModel.workflowType = workflowType;
    }
    this.editType = this.$route.query.editType || 'new';
    this.contractModel.editType = this.$route.query.editType || 'new';
  },
  data () {
    return {
      contractModel: new ContractModel(),
      check: new Check(),
      active: 0
    }
  },
  methods: {
    saveContract (isSubmit) {
      this.contractModel.changeServiceFeeList();
      // let url = this.editType === 'edit' ? '/api/opencrm/workflow/save_data' : '/api/opencrm/workflow/create';
      let url = '/api/opencrm/workflow/save_draft'
      let _form = {
        datas: this.contractModel.contractForm,
        instanceId: this.contractModel.contractId,
        workflowType: this.contractModel.workflowType
      };
      // 上传之前处理checkbox
      this.changeCheckbox();
      // 上传之前把客服企业信息填到相关商户那里
      this.fillRelevant();
      return new Promise((resolve, reject) => {
        post(url, _form).then(result => {
          resolve('save');
          if (result.id) {
            this.contractModel.contractId = result.id;
          }
          // if (!isSubmit) {
          //     showNotify('success', '保存成功');
          //     this.backToList('list')
          // }
        })
      })
    },
    submitContract (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (!this.contractModel.contractForm.contracts.length) {
            showNotify('error', '请添加落地公司！')
            return;
          }
          // 其它都通过了 再检测上传清单
          if (this.contractModel.workflowType === 'create_sale_contract' &&
            this.contractModel.contractForm.collector === '0' &&
            this.contractModel.contractForm.referIds.length === 0) {
            showNotify('error', '请上传清单');
            return;
          }

          let url = '/api/contract-web/contract/create-flow-contracts';
          let param = {
            datas: this.contractModel.contractForm,
            instanceId: this.contractModel.contractId,
            workflowType: this.contractModel.workflowType
          };
          this.saveContract(true).then(result => {
            post(url, param).then(res => {
              // showNotify('success', '提交审核成功');
              // this.backToList('list')
              this.$alert('您的合同表单已提交，请在列表进行合同下载，谢谢！', '', {
                confirmButtonText: '确定',
                callback: action => {
                  this.backToList('list')
                }
              });
            })
          })
        } else {
          showNotify('error', '请检查输入项错误！')
        }
      })
    },
    changeCheckbox () {
      this.contractModel.contractForm.showSubjectInfo = this.contractModel.contractForm.showSubjectInfo ? '1' : '';
      this.contractModel.contractForm.contracts.forEach(item => {
        item.showServiceCompanyInfo = item.showServiceCompanyInfo ? '1' : '';
      })
    },
    fillRelevant () {
      this.contractModel.contractForm.companyApps[0]['appName'] = this.contractModel.contractForm.customerName // 商户名称            this.contractModel.contractForm.companyApps[0]['appName'] = this.contractModel.contractForm.customerName // 商户名称
      this.contractModel.contractForm.companyApps[0]['chargeByName'] = this.contractModel.contractForm.customLegalPerson // 商户负责人姓名
      this.contractModel.contractForm.companyApps[0]['chargeByPhone'] = this.contractModel.contractForm.customCollectorPhone // 商户负责人手机
      this.contractModel.contractForm.companyApps[0]['chargeByMail'] = this.contractModel.contractForm.customMail1 // 商户负责人邮箱
    },
    backToList (path) {
      this.$router.replace({
        path: path
      })
    },
    setSettleType () {
      this.$refs['contractForm'].validateField('serviceType')
    },
    prev () {
      if (this.active-- < 1) this.active = 4;
    },
    next (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.active++ > 4) this.active = 0;
          this.saveContract(false);
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.contract-container {
  margin-bottom: 30px;
}

.contractForm {
  // width: 900px;
  margin: 0 auto;
}

.detail-form .el-form-item {
  margin-bottom: 0;
}
</style>
