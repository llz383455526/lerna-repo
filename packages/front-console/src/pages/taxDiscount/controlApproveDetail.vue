<template>
    <div class="main-container">
        <el-form :model="form" :inline="true" size="small">
            <el-form-item label="处理状态">
                <el-select v-model="form.v1"></el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary">查询</el-button>
                <el-button>清除</el-button>
            </el-form-item>
        </el-form>
        <el-table class="mt20" :data="[]">
            <el-table-column label="月份"></el-table-column>
            <el-table-column label="身份证"></el-table-column>
            <el-table-column label="姓名"></el-table-column>
            <el-table-column label="发放金额"></el-table-column>
            <el-table-column label="客户公司"></el-table-column>
            <el-table-column label="落地公司"></el-table-column>
            <el-table-column label="税优地"></el-table-column>
            <el-table-column label="风控规则"></el-table-column>
            <el-table-column label="处理状态"></el-table-column>
            <el-table-column label="操作"></el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            v-on:handleSizeChange="sizeChange"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
    </div>
</template>
<script>
export default {
    data() {
        return {
            form: {
                page: 1,
                pageSize: 10
            },
            tableList: {
                total: 1
            }
        }
    },
    methods: {
        query() {

        },
        sizeChange() {

        }
    }
}
</script>
<style scoped>
.main-container {
    background-color: #fff;
    padding: 15px;
}
.mt20 {
    margin-top: 20px;
}
</style>
