<template>
    <div>
        <el-radio v-model="value" v-for="(item, key) in data" :key="key" :label="item[valueName]" @change="handleChange">{{item[labelName]}}</el-radio>
    </div>
</template>

<script>
export default {
    props: {
        data: {
            type: Array
        },
        labelName: {
            type: String
        },
        valueName: {
            type: String
        },
    },
    data() {
        return {
            value: ''
        }
    },
    methods: {
        handleChange(ev) {
            this.$emit('change', ev)
        }
    }
}
</script>

