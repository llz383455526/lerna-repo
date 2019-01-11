<template>
  <div class="r_main">
    <el-form :model="form" :rules="rules" size="small" label-width="140px" ref="form">
      <div class="title">
        合同基本信息
      </div>
      <el-form-item label="选择合同模板" prop="tplId">
        <el-select v-model="form.tplId" class="w400">
          <el-option v-for="e in contractTplList" :key="e.value" :value="e.value" :label="e.text"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="试合作期" prop="probation">
        若乙方第一次代理甲方产品，则本合同前 <el-input v-model="form.probation" class="w100" disabled></el-input> 个月为试合作期
      </el-form-item>
      <el-form-item label="代理期限" prop="deadline">
        <el-date-picker
          class="w193"
          @change="setDeadline"
          v-model="form.agentStart"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="开始日期">
        </el-date-picker>
        - 
        <el-date-picker
          class="w193"
          @change="setDeadline"
          v-model="form.agentEnd"
          type="date"
          value-format="yyyy-MM-dd"
          format="yyyy-MM-dd"
          placeholder="结束日期">
        </el-date-picker>
      </el-form-item>
      <div class="title">
        代理商基本信息
      </div>
      <el-form-item label="代理商名称" prop="agentName">
        <el-input class="w400" v-model="form.agentName"></el-input> <el-button type="text" @click="show = !show">选择已有代理商</el-button>
      </el-form-item>
      <el-form-item label="机构代码" prop="agency">
        <el-input class="w400" v-model="form.agency"></el-input>
      </el-form-item>
      <el-form-item label="代理商单位地址" prop="address">
        <el-input class="w400" v-model="form.address"></el-input>
      </el-form-item>
      <el-form-item label="代理商电话" prop="telephone">
        <el-input class="w400" v-model="form.telephone"></el-input>
      </el-form-item>
      <el-form-item label="开户名称" prop="accountName">
        <el-input class="w400" v-model="form.accountName"></el-input>
      </el-form-item>
      <el-form-item label="开户银行" prop="depositBank">
        <el-input class="w400" v-model="form.depositBank"></el-input>
      </el-form-item>
      <el-form-item label="银行账号" prop="accountNo">
        <el-input class="w400" v-model="form.accountNo"></el-input>
      </el-form-item>
      <div class="title">
        代理商联系信息
      </div>
      <el-form-item label="代理商联系人" prop="contactName">
        <el-input class="w400" v-model="form.contactName"></el-input>
      </el-form-item>
      <el-form-item label="代理商联系人电话" prop="contactPhone">
        <el-input class="w400" v-model="form.contactPhone"></el-input>
      </el-form-item>
      <el-form-item label="代理商联系人地址" prop="contactAddr">
        <el-input class="w400" v-model="form.contactAddr"></el-input>
      </el-form-item>
      <div class="title">
        代理推广费报价
      </div>
      <el-form-item label="落地公司" prop="quoteFeeContent.serviceCompanyRateList[0].serviceCompanyId">
        <div v-for="(e, i) in form.quoteFeeContent.serviceCompanyRateList" :key="i" class="mb20">
          <el-select class="w400" v-model="form.quoteFeeContent.serviceCompanyRateList[i].serviceCompanyId" filterable @change="getCompanyName(i)">
            <el-option v-for="ev in filterCompanyList(i)" :key="ev.companyId" :value="ev.companyId" :label="ev.name"></el-option>
          </el-select>
          <el-button type="text" v-if="i == form.quoteFeeContent.serviceCompanyRateList.length - 1" @click="addCompany">添加</el-button><el-button type="text" v-if="i" @click="deleteCompany(i)">删除</el-button>
        </div>
      </el-form-item>
      <el-form-item label="报价规则" prop="quoteRule">
        <el-radio v-for="e in ruleList" v-model="form.quoteRule" :key="e.value" :label="e.value">{{e.text}}</el-radio>
        <i class="el-icon-question ml10" title="结算规则：按高于结算费率的部分结算   返佣规则：按返佣费率直接返佣"></i>
      </el-form-item>
      <el-form-item label="结算费率" prop="check">
        <contract-close-item @result="result" :form="form" :initCheck="true" ref="contract"></contract-close-item>
      </el-form-item>
      <div class="title">
        销售（渠道经理）联系信息
      </div>
      <el-form-item label="销售姓名" prop="chargeBy">
        <el-select class="w400" v-model="form.chargeBy" @change="getSales" filterable>
          <el-option v-for="e in chargeByList" :key="e.id" :value="e.id" :label="e.name"></el-option>
        </el-select>
        <!-- <el-input class="w400" v-model="form.chargeBy"></el-input> -->
      </el-form-item>
      <el-form-item label="销售联系电话" prop="chargePhone">
        <el-input class="w400" v-model="form.chargePhone"></el-input>
      </el-form-item>
      <el-form-item label="销售地址" prop="chargeAddr">
        <el-input class="w400" v-model="form.chargeAddr"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button size="medium" @click="$router.back()">返回</el-button>
        <el-button v-if="!isEdit" size="medium" @click="save">保存为草稿</el-button>
        <el-button size="medium" type="primary" @click="submit">提交</el-button>
      </el-form-item>
    </el-form>
    <el-dialog title="选择已有代理商" :visible.sync="show" width="550px">
      <el-form :model="agency_form" :inline="true" size="small" @submit.native.prevent ref="agency_form">
        <el-form-item label="搜索">
          <el-input v-model="agency_form.fullName" @keyup.enter.native="query"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="query">搜索</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="agentData.list">
        <el-table-column label="代理商名称" prop="fullName"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="setAgent(scope.row)">选择</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ayg-pagination
          v-if="agentData.total"
          :total="agentData.total"
          v-on:handleSizeChange="setSize"
          :currentSize="agency_form.pageSize"
          v-on:handleCurrentChange="query"
          :currentPage="agency_form.page">
        </ayg-pagination>
    </el-dialog>
  </div>
</template>
<script>
import { get, post, postWithErrorCallback } from "../../store/api";
import contractCloseItem from '../../pageComponent/contractCloseItem'
import { valid } from 'semver';
export default {
  components: {
    contractCloseItem
  },
  data() {
    return {
      form: {
        generateId: '',
        tplId: '',
        probation: '六',
        agentStart: '',
        agentEnd: '',
        deadline: '',
        agentId: '',
        agentName: '',
        agency: '',
        address: '',
        telephone: '',
        accountName: '',
        depositBank: '',
        accountNo: '',
        contactName: '',
        contactPhone: '',
        contactAddr: '',
        quoteRule: '',
        quoteFeeContent: {
          containIncomeAmount: '',
          incomeAmount: '',
          quoteFeeRate: '',
          quoteFeeType: '',
          serviceCompanyRateList: [
            {
              feeRateContent: {
                containIncomeAmount: '',
                incomeAmount: '',
                quoteFeeRate: '',
                quoteFeeType: '',
                // stepwiseList: [  //目前用不到
                //   {
                //     endAmount: '',
                //     equalsEnd: '',
                //     equalsStart: '',
                //     percent: '',
                //     sequence: '',
                //     startAmount: ''
                //   }
                // ]
              },
              serviceCompanyId: '',
              serviceCompanyName: ''
            }
          ],
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
        chargeBy: '',
        chargeByName: '',
        chargePhone: '',
        chargeAddr: ''
      },
      rules: {
        tplId: [
          { required: true, message: "请选择合同模板", trigger: "change" }
        ],
        probation: [
          { required: true, message: "请填写试合作期", trigger: "blur" }
        ],
        deadline: [
          { required: true, message: "请选择代理期限", trigger: "blur" }
        ],
        agentName: [
          { required: true, message: "请选择或填写代理商", trigger: "change" }
        ],
        agency: [
          { required: true, message: "请填写机构代码", trigger: "blur" }
        ],
        address: [
          { required: true, message: "请填写代理商单位地址", trigger: "blur" }
        ],
        telephone: [
          { required: true, message: "请填写代理商电话", trigger: "blur" },
          { pattern: /(^\d+-?\d+$)/, message: '请输入正确的电话' }
        ],
        accountName: [
          { required: true, message: "请填写开户名称", trigger: "blur" }
        ],
        depositBank: [
          { required: true, message: "请填写开户银行", trigger: "blur" }
        ],
        accountNo: [
          { required: true, message: "请填写银行账号", trigger: "blur" }
        ],
        contactName: [
          { required: true, message: "请填写代理商联系人", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, message: "请填写代理商联系人电话", trigger: "blur" },
          { pattern: /(^\d+-?\d+$)/, message: '请输入正确的电话' }
        ],
        contactAddr: [
          { required: true, message: "请填写代理商联系人地址", trigger: "blur" }
        ],
        quoteRule: [
          { required: true, message: "请选择报价规则", trigger: "blur" }
        ],
        'quoteFeeContent.serviceCompanyRateList[0].serviceCompanyId': [
          { required: true, message: "至少选择一个落地公司", trigger: "change" }
        ],
        check: [
          { required: true, message: "请输入正确的结算费率（大于零且最多两位小数）", trigger: "blur" }
        ],
        chargeBy: [
          { required: true, message: "请选择销售", trigger: "change" }
        ],
        chargePhone: [
          { required: true, message: "请填写销售电话", trigger: "blur" },
          { pattern: /(^\d+-?\d+$)/, message: '请输入正确的电话' }
        ],
        chargeAddr: [
          { required: true, message: "请填写销售地址", trigger: "blur" }
        ]
      },
      show: false,
      agency_form: {
        fullName: '',
        pageSize: 10,
        page: 1
      },
      ruleList: [
        {
          text: '结算规则',
          value: 'settle'
        },
        {
          text: '返佣规则',
          value: 'rakeback'
        }
      ],
      contractTplList: [],
      companyList: [],
      agentData: {},
      chargeByList: [],
      isEdit: false
    }
  },
  mounted() {
    this.form.generateId = this.$route.query.generateId
    this.form.generateId && get('/api/contract-web/agent-contract-generate/detail', {
      generateId: this.form.generateId
    }).then(data => {
      for(let k in this.form) {
        k in data && (this.form[k] = data[k])
      }
      this.form.tplId = this.form.tplId.toString()
      this.form.quoteFeeContent.serviceCompanyRateList.length && this.form.quoteFeeContent.serviceCompanyRateList.forEach(e => {
        e.serviceCompanyId = e.serviceCompanyId
      })
      this.setDeadline()
      this.$refs['contract'].init(this.form)
      data.status == 20 && (this.isEdit = true);
    })
    get('/api/contract-web/contract-tpl/tpl-options?agentTpl=true').then(data => {
      this.contractTplList = data
    })
    get('/api/salemgt/common/service-company/list?businessed=true').then(data => {
      this.companyList = data;
    })
    get('/api/sysmgr-web/user/get-group-users?relationKey=SalesUserRelation').then(data => {
      this.chargeByList = data
    })
    this.query()
  },
  methods: {
    setDeadline() {
      if(this.form.agentStart && this.form.agentEnd) {
        this.form.deadline = 1
      }
      else {
        this.form.deadline = ''
      }
    },
    query(a) {
      if(isNaN(a)) {
        a = 1
      }
      this.agency_form.page = a
      post('/api/contract-web/agent-company/list', this.agency_form).then(data => {
        this.agentData = data
      })
    },
    setSize(a) {
      this.agency_form.pageSize = a
      this.query()
    },
    setAgent(a) {
      this.show = false
      this.form.agentId = a.id
      this.form.agentName = a.fullName
      this.form.agency = a.agency
      this.form.address = a.address
      this.form.telephone = a.telephone
      this.form.accountName = a.accountName
      this.form.depositBank = a.depositBank
      this.form.accountNo = a.accountNo
      this.form.contactName = a.contactName
      this.form.contactPhone = a.contactPhone
      this.form.contactAddr = a.contactAddr
    },
    filterCompanyList(a) {
      return this.companyList.filter(e => {
        return !this.form.quoteFeeContent.serviceCompanyRateList.filter((ev, ind) => a > ind && e.companyId == ev.serviceCompanyId).length
      })
    },
    getCompanyName(a) {
      this.form.quoteFeeContent.serviceCompanyRateList[a].serviceCompanyName = this.companyList.filter(e => e.companyId == this.form.quoteFeeContent.serviceCompanyRateList[a].serviceCompanyId)[0].name
      this.form.quoteFeeContent.serviceCompanyRateList.forEach((e, i) => {
        if(a < i) {
          e.serviceCompanyId = ''
          e.serviceCompanyName = ''
        }
      })
    },
    addCompany() {
      this.form.quoteFeeContent.serviceCompanyRateList.push({
        feeRateContent: {
          containIncomeAmount: '',
          incomeAmount: '',
          quoteFeeRate: '',
          quoteFeeType: ''
        },
        serviceCompanyId: '',
        serviceCompanyName: ''
      })
    },
    deleteCompany(i) {
      this.form.quoteFeeContent.serviceCompanyRateList.splice(i, 1)
    },
    result(a) {
      console.log(a)
      this.form.check = a.check
      this.form.quoteFeeContent = a.quoteFeeContent
    },
    getSales() {
      this.chargeByList.forEach(e => {
        if(e.id == this.form.chargeBy) {
          this.form.chargeByName = e.name
          this.form.chargePhone = e.mobilephone
        }
      })
    },
    save() {
      post('/api/contract-web/agent-contract-generate/save-draft', this.form).then(data => {
        this.$router.back()
      })
    },
    submit() {
      this.$refs.form.validate(valid => {
        if(valid) {
          post('/api/contract-web/agent-contract-generate/save-submit', this.form).then(data => {
            this.$router.back()
          })
        }
      })
    }
  }
}
</script>
<style scoped>
.r_main {
  padding: 30px 15px 50px;
  background-color: #fff;
}
.form {
    margin-top: 20px;
}
.w400 {
  width: 400px;
}
.w100 {
  width: 100px;
}
.w193 {
  width: 193px;
}
.table {
    margin-top: 20px;
}
.title {
    display: inline-block;
    margin: 30px 0px 30px 0px;
    font-weight: 700;
}
.mb20 {
  margin-bottom: 20px;
}
.el-icon-question {
  margin-right: 5px;
  color: #f56c6c;
  cursor: pointer;
}
</style>
