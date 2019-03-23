<template>
    <el-checkbox-group v-model="value" @change="handleChange">
        <el-checkbox v-for="(item, key) in data" :key="key" :label="item[valueName]">{{item[labelName]}}</el-checkbox>
    </el-checkbox-group>
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
            value: []
        }
    },
    methods: {
        handleChange(ev) {
            let arr = []
            ev.forEach(el => {
                const obj = this.data.find(item => {
                    return item[this.valueName] === el
                })
                arr.push(obj)
            });
            this.$emit('change', arr)
        }
    }
}
</script>

