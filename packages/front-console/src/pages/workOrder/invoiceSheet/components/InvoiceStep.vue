<template>
  <el-steps :active="1"
align-center>
    <el-step
      v-for="item in stepInfo"
      :key="item.activityId"
      :title="item.activityName"
    />
  </el-steps>
</template>

<script>
import {workflow} from 'src/api'
import { get, post, importPost } from "src/store/api";

export default {
    data() {
        return {
            stepInfo: []
        }
    },
    methods: {
        getStep() {
            get(workflow.getCreateInvoiceProcess, {processTypeKey: 'make-out-invoice'})
                .then(res => {
                    this.stepInfo = res.default
                })
        }
    },
    created() {
        this.getStep()
    }
}
</script>

<style lang="scss" scoped>

</style>
