<template>
    <div>
        <el-form-item label="选择已有代理商" :prop="`${propName1}.id`">
            <el-select v-model="contract.datas.agentCompanyBaseInfo.id" filterable placeholder="请选择" style="width:450px;" @change="idChange">
                <el-option v-for="item in optionModel.agentCompanyList" :key="item.agentCompanyId" :value="item.agentCompanyId" :label="item.agentCompanyName">
                </el-option>
            </el-select>
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
    },
    data() {
        return {
            optionModel: new optionModel(),
            propName1: 'datas.agentCompanyBaseInfo',
        }
    },
    methods: {
        idChange(ev) {
            get('/api/contract-web/agent-residence-flow/agent-residence-form?companyId='+ev).then(res => {
                Object.assign(this.contract.datas, res.datas)
            })
        }
    },
    created() {
        this.optionModel.getAgentCompanyList()
    }
}
</script>

