<template>
<div>
    <el-form-item label="销售姓名" prop="contractPerson">
        <el-input v-model="contractModel.contractForm.contractPerson" style="width:450px;"></el-input>
    </el-form-item>
    <el-form-item label="销售联系邮箱" prop="contractEmail">
        <el-input v-model="contractModel.contractForm.contractEmail" style="width:450px;"></el-input>
    </el-form-item>
    <el-form-item label="销售联系电话" prop="contractTel">
        <el-input v-model="contractModel.contractForm.contractTel" style="width:450px;"></el-input>
    </el-form-item>
    <el-form-item label="合同联系人地址" prop="contractAddr">
        <el-input v-model="contractModel.contractForm.contractAddr" style="width:450px;"></el-input>
    </el-form-item>
    <hr>
    <el-form-item label="客户类型" prop="originalType">
      <el-radio v-for="e in originalTypeList" v-model="contractModel.contractForm.originalType" :key="e.value" :label="e.value" @change="getOriginalTypeName" :disabled="disableRadio">{{e.text}}</el-radio>
    </el-form-item><br>
    <template v-if="contractModel.contractForm.originalType == 20">
      <el-form-item label="代理商名称" prop="agentCompanyId">
        <el-select v-model="contractModel.contractForm.agentCompanyId" style="width:900px;" filterable @change="agentChange">
            <el-option v-for="e in contractModel.agentList" :key="e.companyId" :label="e.companyName" :value="e.companyId"></el-option>
        </el-select>
      </el-form-item><br>
    </template>
    <el-form-item label="客户归属" prop="original">
      <el-radio v-for="e in originals" v-model="contractModel.contractForm.original" :key="e.value" :label="e.value" @change="getOriginalName" :disabled="disableRadio">{{e.text}}</el-radio>
    </el-form-item>
</div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
    get
} from '../../../store/api'
export default {
    name: "salesContactInfo",
    props: ['contractModel'],
    computed: {
    ...mapGetters({
        userInformation: 'userInformation'
      })
    },
    data() {
        return {
          originals: [],
          originalTypeList: [],
          disableRadio: false,
        }
    },
    mounted() {
      get('/api/sysmgr-web/commom/option?enumType=CustomOriginal').then(data => {
        this.originals = data
        this.getOriginalName()
      })
      get('/api/sysmgr-web/commom/option?enumType=OriginalType').then(data => {
          this.originalTypeList = data
      })
      this.contractModel.contractForm.agentCompanyId && this.companyChange(this.contractModel.contractForm.agentCompanyId)

      if (this.userInformation.userProfile.subjectType === 'agent') {
        this.disableRadio = true
        this.contractModel.contractForm.originalType = '20'
        this.contractModel.contractForm.original = '20'
        this.contractModel.contractForm.originalTypeName = '代理商客户'
      }
    },
    methods: {
        getOriginalTypeName(ev) {
            if (ev == 10) {
                this.contractModel.contractForm.agentCompanyId = ''
            }
            this.originalTypeList.forEach(e => {
                if(this.contractModel.contractForm.originalType == e.value) {
                this.contractModel.contractForm.originalTypeName = e.text
                }
            })
        },
        agentChange() {
            this.companyChange()
            this.contractModel.contractForm.contracts = []
        },
        companyChange(companyId) {
            this.contractModel.getChargeByName(companyId);
            sessionStorage.setItem('companyChange', '1')
        },
        getOriginalName() {
          var arr = this.originals.filter(e => e.value == this.contractModel.contractForm.original)
          if(arr && arr.length) {
            this.contractModel.contractForm.originalName = arr[0].text
            if(this.contractModel.contractForm.original == 20) {
              this.contractModel.contractForm.agentClient = true
            }
            else {
              this.contractModel.contractForm.agentClient = false
            }
          }
        }
    }
}
</script>

<style scoped>

</style>
