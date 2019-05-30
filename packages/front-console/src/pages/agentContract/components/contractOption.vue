<template>
    <div>
        <h3 class="green">合同基本信息</h3>
        <el-form-item label="申请主体">
            <el-radio v-for="item in optionModel.agentTypeList" :key="item.value" :babel="item.value">{{item.text}}</el-radio>
        </el-form-item>
        <el-form-item label="选择合同模板" prop="contractTplId" :rules="{ required: true, message: '请选择合同模板', trigger: 'change' }">
            <el-select v-model="form.datas.tplId" filterable placeholder="请选择" style="width:450px;">
                <el-option v-for="item in optionModel.contractTplList" :key="item.value" :label="item.text" :value="item.value"></el-option>
            </el-select>
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
            optionModel: new optionModel()
        }
    },
    created() {
        this.optionModel.getAgentTypeList()
        this.optionModel.getContractTplList()
    }
}
</script>

