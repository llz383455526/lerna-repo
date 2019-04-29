<template>
    <div v-if="realStep && realStep.length">
        <div class="title">操作记录</div>
        <div class="det" v-for="(e, i) in realStep" :key="e.activityId">
            {{i + 1}}.{{e.userName ? e.userName : '系统'}}  于{{e.processDate}} {{e.operate || e.activityName}}
            <template v-if="e.comment">
                ，备注： {{e.comment}}
            </template>
        </div>
    </div>
</template>
<script>
export default {
    props: {
        realStep: {
            type: Array,
            default() {
                return []
            }
        }
    }
}
</script>
<style scoped>
.title {
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 15px;
}
.det {
    position: relative;
    margin-left: 30px;
    margin-bottom: 10px;
}
</style>
