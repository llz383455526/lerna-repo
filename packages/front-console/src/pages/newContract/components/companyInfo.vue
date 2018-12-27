<template>
  <div>
    <h3 class="green">请添加落地公司
      <el-button
        size="small"
        type="primary"
        @click="dialogVisible = true"
        v-if="contractModel.editType != 'watch'"
        style="margin-left: 20px;"
      >添加</el-button>
    </h3>
    <!-- <h4 class="ml50">
        <span style="width: 150px;display: inline-block;">落地公司信息</span>
        <el-button size="normal" type="primary" @click="dialogVisible=true" v-if="contractModel.editType != 'watch'">添加服务商信息</el-button>
        <span class="btn-add" v-if="contractModel.contractForm.contracts.length === 0">请添加服务商信息</span>
    </h4> -->

    <div
      class="widget-box"
      v-for="(formItem,index) in contractModel.contractForm.contracts"
      :key="index"
      style="margin-bottom: 20px;"
    >
      <div class="widget-header">
        <h4
          class="widget-title"
          style="margin-right: 25px;"
        >{{ formItem.serviceCompanyName || '落地公司名称' }}</h4>
        <div class="widget-title">
          <el-checkbox
            v-model="formItem.showServiceCompanyInfo"
            label="1"
          >合同中显示服务商收款账户信息</el-checkbox>
        </div>
        <div class="widget-toolbar">
          <el-button
            @click="deleteForm(index)"
            type="text"
            size="medium"
          >删除</el-button>
        </div>
      </div>
      <div class="widget-main">
        <!-- <el-form-item label="服务商名称">
                <el-input v-model="formItem.serviceCompanyName" readonly style="width:400px;"></el-input>
            </el-form-item> -->
        <el-form-item
          label="业务方案"
          :prop="'contracts.'+index+'.goodsId'"
          :rules="{required: true, message: '请选择业务方案', trigger: 'change'}"
        >
          <el-select
            v-model="formItem.goodsId"
            placeholder="请选择"
            style="width:400px;"
          >
            <el-option
              v-for="(item, key) in formItem.goodsList"
              :key="key"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="结算方式"
          :prop="'contracts.'+index+'.settleType'"
          :rules="{required: true, message: '请选择结算方式', trigger: 'change'}"
        >
          <el-select
            v-model="formItem.settleType"
            placeholder="请选择"
            style="width:400px;"
          >
            <el-option
              v-for="(item,key) in contractModel.settleTypeList"
              :key="key"
              :label="item.text"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item
          label="发放方式"
          :prop="'contracts.'+index+'.channelTypeList'"
          :rules="{required: true, message: '请选择服务类型', trigger: 'change'}"
        >
          <el-checkbox-group
            v-model="formItem.channelTypeList"
            style="width:800px;"
          >
            <el-checkbox
              v-for="(item, key) in contractModel.payMode"
              :key="key"
              :label="item.value"
            >{{item.label}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <!-- <el-form-item label="开票方式" :prop="'contracts.'+index+'.openInvoiceType'" :rules="{required: true, message: '请选择开票方式', trigger: 'change'}">
                <el-select v-model="formItem.openInvoiceType" placeholder="请选择" style="width:400px;">
                    <el-option v-for="(item, key) in customerInvoiceTypes" :key="key" :label="item.text" :value="item.value"></el-option>
                </el-select>
            </el-form-item> -->
        <el-form-item
          label="服务商报价"
          :prop="'contracts.'+index+'.check'"
          :rules="{required: true, message: '请正确填写服务商报价', trigger: 'blur'}"
        >
          <contractItem
            label-width="0"
            :arrIndex="index"
            @result="result"
            :initCheck="true"
            :contractForm="{serviceFeeContent:formItem.serviceFeeContent,serviceFeeContent2:formItem.serviceFeeContent2}"
          ></contractItem>
        </el-form-item><br>
        <template v-if="contractModel.contractForm.agentClient">
          <el-form-item
            label="代理商分润比例"
            :prop="'contracts.'+index+'.agentFeeContent.serviceFeeRate'"
            :rules="[
              {required: true, message: '请输入正确的服务费收费（大于零且最多两位小数）', trigger: 'blur'},
              {validator: f2, trigger: 'blur'}
            ]"
          >
            <el-input
              v-model="formItem.agentFeeContent.serviceFeeRate"
              placeholder="请输入服务费比例"
              style="width:400px;"
            >
              <template slot="append">%</template>
            </el-input>
          </el-form-item>
          <el-form-item
            label="渠道经理"
            required
          >
            <el-input
              v-model="contractModel.chargeByName"
              disabled
              style="width:400px;"
            ></el-input>
          </el-form-item>
        </template>
        <!-- <div style="margin-left: 100px;" v-if="contractModel.workflowType === 'create_ns_sale_contract'">
                <span>合同附件</span>
                <el-form-item :prop="'contracts.'+index+'.referIds'" label-width="0" style="margin-top:15px;" :rules="{required: true, message: '请上传合同附件', trigger: 'blur'}">
                    <upload @handleSuccess="handleSuccess" :arrIndex="index" :fileList="formItem.referNames" :showUploadBtn="contractModel.editType != 'watch'"></upload>
                </el-form-item>
            </div> -->
      </div>
    </div>

    <el-dialog
      title="添加公司信息"
      :visible.sync="dialogVisible"
      width="700px"
    >
      <el-form
        :inline="true"
        :model="appForm"
        label-width="150px"
        ref="appForm"
      >
        <el-form-item label="服务商名称">
          <el-select
            v-model="info.serviceCompanyId"
            filterable
            placeholder="请选择"
            @change="setServiceCompany"
            style="width: 450px;"
          >
            <el-option
              v-for="(item,key) in contractModel.serviceCompaniesList"
              :key="key"
              :label="item.name"
              :value="item.companyId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="margin-left: 150px;">
          <el-button
            type="primary"
            @click="formAdd"
          >保存</el-button>
          <el-button @click="dialogVisible = false">取消</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script>
import _ from 'lodash'
import { get } from '../../../store/api'
import contractItem from '../../../pageComponent/contractItem.vue'
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
      info: {
        serviceCompanyName: '',
        serviceCompanyId: '',
        goodsList: [],
        corporateName: '',
        address: '',
        telephone: ''
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
      chargeByNames: [],
      f2: (rule, value, cb) => {
        if (!/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(value)) {
          return cb('请输入正确的服务费收费（大于零且最多两位小数）')
        }
        return cb()
      }
    }
  },
  methods: {
    formAdd () {
      let info = _.cloneDeep(this.info);
      this.contractModel.contractForm.serviceCompanyList.push({
        serviceCompanyName: info.serviceCompanyName,
        serviceCompanyId: info.serviceCompanyId
      });
      this.contractModel.contractForm.contracts.push({
        serviceCompanyName: info.serviceCompanyName,
        serviceLegalPerson: info.corporateName,
        serviceRegisterAddr: info.address,
        servicePhone: info.telephone,
        showServiceCompanyInfo: '',
        serviceCompanyId: info.serviceCompanyId,
        goodsId: '',
        goodsList: info.goodsList,
        channelTypeList: [],
        // openInvoiceType: '',
        settleType: '',
        prePayType: '1',
        prePayContent: {
          secondType: 'should',
          serviceFeeRate: '',
          serviceFeeType: ''
        },
        serviceFeeContent: {
          discountRate: '',
          secondType: '',
          fixFee: 0,
          monthIncomeAmount: '',
          serviceFeeRate: '',
          serviceFeeType: '',
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
    result ({
      serviceFeeContent,
      serviceFeeContent2,
      arrIndex,
      check
    }) {
      this.contractModel.contractForm.contracts[arrIndex].check = check;
      this.contractModel.serviceFeeList[arrIndex] = {
        serviceFeeContent: serviceFeeContent,
        serviceFeeContent2: serviceFeeContent2
      };
    },
    handleSuccess (fileList, referArr, arrIndex) {
      let contract = this.contractModel.contractForm.contracts[arrIndex];
      contract.referNames = fileList;
      contract.referIds = referArr;
    },
    deleteForm (i) {
      this.contractModel.contractForm.contracts.splice(i, 1);
    },
    setServiceCompany (o, serviceCompanyId) {
      let serviceCompany = _.find(this.contractModel.serviceCompaniesList, o => {
        return o.companyId === this.info.serviceCompanyId
      });
      this.info.serviceCompanyName = serviceCompany.name;
      this.info.corporateName = serviceCompany.corporateName;
      this.info.address = serviceCompany.address;
      this.info.telephone = serviceCompany.telephone;
      get('/api/salemgt/common/service-company/goods', {
        serviceCompanyId: serviceCompanyId || serviceCompany.companyId
      }).then(result => {
        this.info.goodsList = result || []
      })
    }
  },
  created () {
    this.contractModel.contractForm.contracts.forEach(item => {
      item.showServiceCompanyInfo = item.showServiceCompanyInfo === '1' ? true : false;
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
</style>
