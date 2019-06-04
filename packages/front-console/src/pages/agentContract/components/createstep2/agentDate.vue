<template>
    <el-form>
        <el-form-item label="代理期限" :prop="`${propName2}.agentStart`" v-if="operateEnum !== '3'">
            <el-date-picker 
                type="daterange" 
                v-model="dateValue" 
                start-placeholde="开始日期" 
                end-placeholde="结束日期" 
                value-format="yyyy-MM-dd" 
                @change="dateChange"></el-date-picker>
        </el-form-item>
    </el-form>
</template>

<script>
export default {
    data() {
        return {
            dateValue: []
        }
    },
    methods: {
        dateChange() {}
    }
}
</script>

