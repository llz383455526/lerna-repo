<template>
  <div>
    <el-form-item label="选择已有渠道"
      :prop="`${propName1}.id`"
      v-if="contract.operateEnum === 2">
      <el-select v-model="contract.datas.agentCompanyBaseInfo.id"
        filterable
        placeholder="请选择"
        style="width: 400px;"
        @change="getDetail">
        <el-option v-for="item in optionModel.agentCompanyList"
          :key="item.agentCompanyId"
          :value="item.agentCompanyId"
          :label="item.agentCompanyName"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择已有渠道"
      :prop="`${propName1}.id`"
      v-if="contract.operateEnum === 3">
      <el-select v-model="contract.datas.agentCompanyBaseInfo.id"
        filterable
        placeholder="请选择"
        style="width: 400px;"
        @change="getDetail">
        <el-option v-for="item in optionModel.agentContractCompanyList"
          :key="item.companyId"
          :value="item.companyId"
          :label="item.companyName"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="申请生效时间"
      :prop="`${propName2}.versionStartDate`"
      v-if="contract.operateEnum === 3">
      <el-date-picker v-model="contract.datas.agentContract.versionStartDate"
        type="month"
        style="width:400px;"
        :picker-options="pickerOptions"></el-date-picker>
    </el-form-item>
    <el-form-item label="变更版本说明"
      :prop="`datas.flowMemo`"
      v-if="contract.operateEnum === 3">
      <el-input v-model="contract.datas.flowMemo"
        type="textarea"
        style="width:400px;"></el-input>
    </el-form-item>
    <h3 class="green">合同基本信息</h3>
    <el-form-item label="申请主体"
      :prop="`${propName1}.agentType`">
      <el-radio v-model="contract.datas.agentCompanyBaseInfo.agentType"
        v-for="item in optionModel.agentTypeList"
        :key="item.value"
        :label="item.value"
        @change="agentTypeChange"
        :disabled="contract.operateEnum !== 1">
        {{ item.text }}
      </el-radio>
    </el-form-item>
    <el-form-item label="选择合同模板"
      prop="datas.tplId">
      <el-select v-model="contract.datas.tplId"
        filterable
        placeholder="请选择"
        style="width:400px;"
        @change="tplIdChange">
        <el-option v-for="item in optionModel.contractTplList"
          :key="item.value"
          :label="item.text"
          :value="item.value"></el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="试合作期"
      :prop="`${propName1}.probation`">
      若乙方第一次代理甲方产品，则本合同前
      <el-input style="width: 50px;"
        v-model="contract.datas.agentCompanyBaseInfo .probation"
        disabled></el-input> 个月为试合作期
    </el-form-item>
    <el-form-item label="代理期限"
      :prop="`${propName2}.agentStart`"
      v-if="contract.operateEnum !== 3">
      <el-date-picker type="daterange"
        v-model="dateValue"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="dateChange"></el-date-picker>
    </el-form-item>
  </div>
</template>

<script>
import optionModel from 'src/model/option/optionModel'
import { get } from 'src/store/api'

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
            pickerOptions:{
                /**
                * 范围为： 当前月以及以后月份
                */
                disabledDate(time){
                    let curDate = new Date();
                    const curMonth = curDate.getMonth();
                    let curDay = curDate.getDate();
                    let beginTime = new Date(curDate.getFullYear(), curMonth, '01').getTime()
                    return time.getTime() < beginTime;
                }
            }
        }
    },
    methods: {
        agentTypeChange(ev) {
            this.optionModel.getContractTplList(ev)
            // 工作流实例类型,标准
            // this.contract.workflowType = this.workflowType[ev][0]
            // 清空所选的合同
            this.contract.datas.tplId = ''
            this.contract.subjectType = ev
            const obj = this.optionModel.agentTypeList.find((item) => {
                return item.value === ev
            })
            this.contract.datas.agentCompanyBaseInfo.agentTypeName = obj.text
        },
        getTplList() {
            const ev = this.contract.datas.agentCompanyBaseInfo.agentType
            this.optionModel.getContractTplList(ev)
        },
        dateChange(ev) {
            if(ev) {
                this.contract.datas.agentContract.agentStart = ev[0]
                this.contract.datas.agentContract.agentEnd = ev[1]
            } else {
                this.contract.datas.agentContract.agentStart = this.contract.datas.agentContract.agentEnd = ''
            }
        },
        getDate() {
            this.dateValue = [ this.contract.datas.agentContract.agentStart, this.contract.datas.agentContract.agentEnd ]
        },
        tplIdChange(ev) {
            const obj = this.optionModel.contractTplList.find((item) => {
                return item.value === ev
            })
            this.contract.datas.tplName = obj.text
        },
        getDetail(ev) {
            get('/api/contract-web/agent-residence-flow/agent-residence-form?companyId='+ev).then(res => {
                Object.assign(this.contract.datas, res.datas)
                this.optionModel.getContractTplList(this.contract.datas.agentCompanyBaseInfo.agentType)
                this.contract.subjectType = res.datas.agentCompanyBaseInfo.agentType
            })
        }
    },
    created() {
        this.optionModel.getAgentTypeList()
        if (this.contract.operateEnum === 1 && !this.contract.instanceId) {
            this.contract.datas.agentCompanyBaseInfo.agentType = 'channel'
            this.contract.datas.agentCompanyBaseInfo.agentTypeName = '渠道'
            this.contract.subjectType = 'channel'
            this.getTplList()
        }
        if (this.contract.operateEnum === 2) {
            this.optionModel.getAgentCompanyList()
        }
        if (this.contract.operateEnum === 3) {
            this.optionModel.getAgentContractCompanyList()
        }
    }
}
</script>

<style lang="scss" scoped>
</style>


