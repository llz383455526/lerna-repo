<template>
<el-date-picker v-model="dateValue" type="daterange" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期" @change="setTime"></el-date-picker>
</template>

<script>
export default {
    data() {
        var time = new Date();
        var t = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1)}-${time.getDate()}`
        time = time.getTime() - 1000 * 60 * 60 * 24 * 7
        time = new Date(time);
        var t_0 = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : "0" + (time.getMonth() + 1)}-${time.getDate()}`

        return {
            dateValue: [t_0, t],
            createAtBegin: '',
            createAtEnd: ''
        }
    },
    methods: {
        setTime() {
            if (this.dateValue && this.dateValue.length) {
                this.createAtBegin = this.dateValue[0]
                this.createAtEnd = this.dateValue[1]
            } else {
                this.createAtBegin = ''
                this.createAtEnd = ''
            }
            this.$emit('setTime', [this.createAtBegin, this.createAtEnd])
        },
    },
    created() {
        this.$emit('setTime', [this.dateValue[0], this.dateValue[1]])
    }
}
</script>
