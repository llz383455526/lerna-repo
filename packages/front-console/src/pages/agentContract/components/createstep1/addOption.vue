<template>
    <div>
        <el-form-item label="选择已有代理商">
            <el-select v-model="contract.datas.tplId" filterable placeholder="请选择" style="width:450px;">
                <el-option v-for="item in optionModel.contractTplList" :key="item.value" :label="item.text" :value="item.value"></el-option>
            </el-select>
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
    },
    data() {
        return {
            optionModel: new optionModel(),
        }
    },
    created() {
        this.optionModel.getAgentTypeList()
    }
}
</script>

