<template>
  <div>
    <h3 class="green">
      合同基本信息
    </h3>
    <el-form-item
      label="申请主体"
      :prop="`${propName1}.agentType`"
    >
      <el-radio
        v-model="contract.datas.agentCompanyBaseInfo.agentType"
        v-for="item in optionModel.agentTypeList"
        :key="item.value"
        :label="item.value"
        @change="agentTypeChange"
      >
        {{ item.text }}
      </el-radio>
    </el-form-item>
    <el-form-item
      label="选择合同模板"
      prop="datas.tplId"
    >
      <el-select
        v-model="contract.datas.tplId"
        filterable
        placeholder="请选择"
        style="width:450px;"
        @change="tplIdChange"
      >
        <el-option
          v-for="item in optionModel.contractTplList"
          :key="item.value"
          :label="item.text"
          :value="item.value"
        />
      </el-select>
    </el-form-item>
    <el-form-item
      label="试合作期"
      :prop="`${propName1}.probation`"
    >
      若乙方第一次代理甲方产品，则本合同前 <el-input
        class="input_80"
        v-model="contract.datas.agentCompanyBaseInfo .probation"
      /> 个月为试合作期
    </el-form-item>
    <el-form-item
      label="代理期限"
      :prop="`${propName2}.agentStart`"
    >
      <el-date-picker
        type="daterange"
        v-model="dateValue"
        start-placeholde="开始日期"
        end-placeholde="结束日期"
        value-format="yyyy-MM-dd"
        @change="dateChange" 
      />
    </el-form-item>
  </div>
</template>

<script>
import optionModel from 'src/model/option/optionModel'

export default {
    props: {
        contract: {
            type: Object,
            default() {
                return {}
            }
        },
        workflowType: {
            type: Object,
            default() {
                return {}
            }
        }
    },
    data() {
        return {
            optionModel: new optionModel(),
            dateValue: '',
            propName1: 'datas.agentCompanyBaseInfo',
            propName2: 'datas.agentContract',
        }
    },
    methods: {
        agentTypeChange(ev) {
            this.optionModel.getContractTplList(ev)
            // 工作流实例类型,标准
            this.contract.workflowType = this.workflowType[ev][0]
            // 清空所选的合同
            this.contract.datas.tplId = ''
        },
        dateChange(ev) {
            if(ev) {
                this.contract.datas.agentContract.agentStart = ev[0]
                this.contract.datas.agentContract.agentEnd = ev[1]
            } else {
                this.contract.datas.agentContract.agentStart = this.contract.datas.agentContract.agentEnd = ''
            }
        },
        tplIdChange(ev) {
            console.log(this.contract)
        }
    },
    created() {
        this.optionModel.getAgentTypeList()
    }
}
</script>

<style lang="scss" scoped>
.input_80 {
    width: 80px;
}
</style>


