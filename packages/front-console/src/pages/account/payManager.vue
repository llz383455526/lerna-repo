<template>
    <div class="company-build-container company-container">
        <div class="title">充值管理</div>
        <el-form :inline="true">
            <el-form-item label="企业">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="商户">
                <el-input></el-input>
            </el-form-item>
            <el-form-item label="处理状态">
                <el-select>
                    <el-option value="" label="全部"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="企业">
                <el-date-picker size="small" v-model="dateValue" type="dateRange" start-placeholder="开始日期" end-placeholder="结束日期" @change="getTime"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button size="small" type="primary">查询</el-button>
                <el-button size="small">清除</el-button>
            </el-form-item>
        </el-form>
        <el-button size="small" type="primary">充值申请</el-button>
        <el-table :data="[]">
            <el-table-column label="订单号"></el-table-column>
            <el-table-column label="商户"></el-table-column>
            <el-table-column label="企业"></el-table-column>
            <el-table-column label="服务商信息"></el-table-column>
            <el-table-column label="充入渠道"></el-table-column>
            <el-table-column label="用途"></el-table-column>
            <el-table-column label="金额（元）"></el-table-column>
            <el-table-column label="提交时间"></el-table-column>
            <el-table-column label="处理状态"></el-table-column>
            <el-table-column label="处理人"></el-table-column>
            <el-table-column label="完成时间"></el-table-column>
            <el-table-column label="处理结果"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button>详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            :total="total"
            :currentPage="form.page"
            v-on:handleSizeChange="setSize"
            v-on:handleCurrentChange="query">
        </ayg-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                page: 1
            },
            dateValue: [],
            total: 0
        }
    },
    methods: {
        getTime() {
            if(this.dateValue.length) {

            }
        },
        query() {

        },
        setSize() {

        }
    }
}
</script>
<style scoped>
.title {
    margin-bottom: 20px;
}
</style>
