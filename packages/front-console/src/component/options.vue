<template>
    <el-select v-model="value" @change="handleChange">
        <el-option v-for="(item, key) in data" :key="key" :label="item[labelName]" :value="item[valueName]"></el-option>
    </el-select>
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
        }
    },
    data() {
        return {
            value: ''
        }
    },
    methods: {
        handleChange(val) {
            const obj = this.data.find(item => {
                return item[this.valueName] === val
            })
            this.$emit('change', obj)
        }
    }
}
</script>

