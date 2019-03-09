<template>
    <div style="margin: 15px;padding: 15px; background-color: #fff;">

        <el-form :model="searchForm" ref="searchForm" :inline="true" size="small">
            <el-form-item label="收款方名字" prop="name">
                <el-input v-model="searchForm.name"></el-input>
            </el-form-item>
            <el-form-item label="收款方账号" prop="accountNo">
                <el-input v-model="searchForm.accountNo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="query">查询</el-button>
                <el-button @click="clear">清除</el-button>
                <el-button type="primary" size="small" @click="show=true" v-if="checkRight(permissions, 'console-dlv:/pay-order-filter/download-pay-order-filter-import-template')">导入</el-button>
            </el-form-item>
        </el-form>
        
        <upload :show="show" 
            :uploadTitle="uploadTitle" 
            :uploadDowload="uploadDowload" 
            :targetType="targetType" 
            @close="show=false" 
            @query="query">
        </upload>

        <el-table :data="list">
            <el-table-column label="收款方账户名称" prop="name" width="200"></el-table-column>
            <el-table-column label="账号" prop="accountNo"></el-table-column>
            <el-table-column label="身份证号码" prop="idCard"></el-table-column>
            <el-table-column label="发放日期" prop="salaryTime" width="200"></el-table-column>
            <el-table-column label="实发金额" prop="amount"></el-table-column>
            <el-table-column label="落地公司" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="公司名" prop="companyName"></el-table-column>
            <el-table-column label="手机号码" prop="phone"></el-table-column>
            <el-table-column label="订单月份" prop="orderTime"></el-table-column>
            <el-table-column label="成功月份" prop="successTime"></el-table-column>
            <el-table-column label="发放结果" prop="stateName"></el-table-column>
        </el-table>

        <ayg-pagination :total="listData.total" @handleCurrentChange="query" @handleSizeChange="sizeChange"></ayg-pagination>

    </div>
</template>

<script>
import {post, get} from '../../store/api'
import upload from '../../component/upload.vue'
import { mapGetters } from 'vuex'
export default {
    components: {upload},
    computed: {
        ...mapGetters({
            permissions: 'permissions',
        })
    },
    data() {
        return {
            show: false,
            uploadTitle: '发放流水导入模版',
            uploadDowload: '/api/console-dlv/pay-order-filter/download-pay-order-filter-import-template',
            targetType: 'dlv-pay-order-item-filter-import',
            list: [],
            searchForm: {
                accountNo: '',
                name: '',
                orderBy: "",
                page: 0,
                pageSize: 10
            },
            listData: '',
        }
    },
    methods: {
        query(a) {
            if (isNaN(a)) {
                 a = 1
            }
            this.searchForm.page = a
            const url = '/api/console-dlv/pay-order-filter/list'
            const param = this.searchForm
            post(url, param).then(res => {
                this.list = res.list
                this.listData = res
            })
        },
        sizeChange(a) {
            this.searchForm.pageSize = a
            this.query()
        },
        clear() {
            this.$refs.searchForm.resetFields()
        },
    },
    mounted() {
        this.query()
    }
}
</script>

