<template>
    <div class="contract-container bg-white">
        <div class="widget-header">
            <div class="widget-title">新增代理商合同</div>
        </div>
        <div class="widget-body">
            <div class="widget-main">
                <el-form v-model="form.datas" :rules="check.rules" label-width="200px">
                    <contractOption :form="form"></contractOption>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import Form from '../../model/agentContract/form'
import Check from '../../model/agentContract/check'
import contractOption from './components/contractOption'
export default {
    components: { contractOption },
    data() {
        return {
            form: new Form(),
            check: new Check()
        }
    }
}
</script>

