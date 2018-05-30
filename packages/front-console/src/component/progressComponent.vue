<template>
    <div>
        <el-progress type="line" :text-inside="true" :stroke-width="16" :percentage="percentageVal" :status="processStatus"></el-progress>
        <span v-if="processResult" style="font-size: 6px">{{processResult}}</span>
    </div>
</template>

<script>
    import { get } from '../store/api'

    export default {
        name: "progressComponent",
        props: ['taskId'],
        data() {
            return {
                percentageVal: 0,
                interval: null,
                processResult: '',
                processStatus: null
            }
        },
        methods:{
            getProgress(taskId) {
                 this.interval = window.setInterval(() => {
                    get('/api/recon/file/progress', {
                        taskId: taskId
                    }, true).then(result => {
                        // console.log(result);
                        var tmpProgress = result.progress;
                        if (tmpProgress === 100) {
                            tmpProgress = 99;
                        }
                        this.percentageVal = tmpProgress;
                        this.processResult = result.desc;
                        if(result.state === 'Success') {
                            this.processStatus = 'success';
                            this.percentageVal = 100;
                            window.clearInterval(this.interval)
                        }else if(result.state === 'Fail') {
                            // showNotify('error', result.desc)
                            this.percentageVal = 100;
                            this.processStatus = 'exception';
                            window.clearInterval(this.interval)
                        }
                    })
                }, 1000)
            }
        },
        created: function () {
            this.getProgress(this.taskId);
        }
    }
</script>

<style scoped>

</style>