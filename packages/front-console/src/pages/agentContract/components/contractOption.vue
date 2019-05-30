<template>
    <div>
        <h3 class="green">合同基本信息</h3>
        <el-form-item label="申请主体" prop="agentCompanyBaseInfo.agentType">
            <el-radio v-model="form.datas.agentCompanyBaseInfo.agentType" v-for="item in optionModel.agentTypeList" :key="item.value" :label="item.value" @change="agentTypeChange">{{item.text}}</el-radio>
        </el-form-item>
        <el-form-item label="选择合同模板" prop="datas.tplId">
            <el-select v-model="form.datas.tplId" filterable placeholder="请选择" style="width:450px;" @change="tplIdChange">
                <el-option v-for="item in optionModel.contractTplList" :key="item.value" :label="item.text" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="试合作期" prop="agentContract.probation">
            若乙方第一次代理甲方产品，则本合同前 <el-input class="input_80" v-model="form.datas.agentContract.probation"></el-input> 个月为试合作期
        </el-form-item>
        <el-form-item label="代理期限" prop="agentContract.agentStart">
            <el-date-picker type="daterange" v-model="dateValue" start-placeholde="开始日期" end-placeholde="结束日期" value-format="yyyy-MM-dd" @change="dateChange"></el-date-picker>
        </el-form-item>
    </div>
</template>

<script>
import optionModel from '../../../model/option/optionModel'
export default {
    props: {
        form: {}
    },
    data() {
        return {
            optionModel: new optionModel(),
            dateValue: ''
        }
    },
    methods: {
        agentTypeChange(ev) {
            this.optionModel.getContractTplList(ev)
        },
        dateChange(ev) {
            this.form.datas.agentContract.agentStart = ev[0]
            this.form.datas.agentContract.agentEnd = ev[1]
        },
        tplIdChange(ev) {
            console.log(this.form)
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


