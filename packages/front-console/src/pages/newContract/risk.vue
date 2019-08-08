<template>
  <div class="hm-main">
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="终端客户"
                   name="first" />
      <el-tab-pane label="代理商客户"
                   name="second" />
    </el-tabs>
    <ratio></ratio>
    <step></step>
    <div class="hm-title mt30">分2.8万(含)以上业务</div>
  </div>
</template>

<script>
import ratio from './components/risk/ratio.vue'
import step from './components/risk/step.vue'

export default {
    components: { ratio, step },
    data() {
        return {
            activeName: 'first',
        }
    },
    methods: {
        handleClick(tab, event) {
            // if (this.activeName === 'first') {
            //     this.formSearch.scope = 'create'
            // }
            // if (this.activeName === 'second') {
            //     this.formSearch.scope = 'process'
            // }
            // if (this.activeName === 'third') {
            //     this.formSearch.scope = 'all'
            // }
            // this.handleCurrentChange(1)
        }
    }
}
</script>
