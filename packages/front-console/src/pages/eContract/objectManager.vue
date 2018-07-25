<template>
    <div class="main">
        <div class="title">签约对象（公司）管理</div>
        <el-form :model="form" :inline="true" ref="form">
            <el-form-item label="公司名称" prop="name">
                <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="query">查询</el-button>
                <el-button type="text" size="small" @click="reset('form')">清空所有条件</el-button>
            </el-form-item>
        </el-form>
        <router-link to="addObject" tag="span"><el-button size="small" type="primary">新增签约对象</el-button></router-link>
        <el-table :data="list">
            <el-table-column label="公司全称" prop="name"></el-table-column>
            <el-table-column label="公司简称" prop="abbrName"></el-table-column>
            <el-table-column label="工商注册号" prop="regCode"></el-table-column>
            <el-table-column label="法人姓名" prop="legalPerson"></el-table-column>
            <el-table-column label="法人证件号码" prop="legalPersonIdentity"></el-table-column>
            <el-table-column label="法人手机号" prop="legalPersonMobile"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="objectDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="total"
            :total="total"
            v-on:handleSizeChange="setSize"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.pageNo">
        </ayg-pagination>
    </div>
</template>
<script>
import { post, get } from '../../store/api';
export default {
    data() {
        return {
            form: {
                name: '',
                pageNo: 1,
                pageSize: 10
            },
            list: [],
            total: 0
        }
    },
    mounted() {
        this.query()
    },
    methods: {
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.pageNo = a
            post('/api/econtract/user/company/qrylist', this.form).then(data => {
                console.log(data)
                this.list = data.data
                this.total = data.total
            })
        },
        reset(a) {
            this.$refs[a].resetFields()
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        objectDelete(a) {
            this.$confirm('确定删除该公司吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                post('/api/econtract/user/company/mod', {
                    userId: a.userId
                }).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    })
                    this.query()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '删除已取消！'
                })
            })
        }
    }
}
</script>
<style scoped>
.main {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
}
.title {
    margin-bottom: 20px;
}
</style>
