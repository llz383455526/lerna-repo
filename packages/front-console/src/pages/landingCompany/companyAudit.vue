<template>
    <div class="r_main">
        <div style="margin-bottom:30px;">企业客户预审核</div>
        <el-form :model="form" :inline="true" ref="form" size="small">
            <el-form-item label="企业名称" prop="companyName">
                <el-input v-model="form.companyName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
            </el-form-item>
        </el-form>
        <router-link to="addCompany">
            <el-button type="primary">新增</el-button>
        </router-link>
        <el-table :data="tableList.list">
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="企业名称" prop="companyName"></el-table-column>
            <el-table-column label="提交人" prop="createByName"></el-table-column>
            <el-table-column label="提交时间">
                <template slot-scope="scope">
                    {{scope.row.createTime | formatTime('yyyy-MM-dd')}}
                </template>
            </el-table-column>
            <el-table-column label="审核状态" prop="statusName"></el-table-column>
            <el-table-column label="审核人" prop="auditByName"></el-table-column>
            <el-table-column label="审核时间">
                <template slot-scope="scope">
                    {{scope.row.auditTime | formatTime('yyyy-MM-dd')}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <router-link class="c0283fb" :to="`previewCompany?id=${scope.row.id}`" tag="span">查看</router-link>
                    <router-link class="c0283fb" :to="`addCompany?id=${scope.row.id}`" tag="span">修改</router-link>
                    <el-button type="text" @click="deleteCompany(scope.row.id)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            v-on:handleSizeChange="sizeChange"
            v-on:handleCurrentChange="query"
            :currentPage="currentPage">
        </ayg-pagination>
    </div>
</template>
<script>
import {post, get} from '../../store/api';
export default {
    data() {
        return {
            form: {
                companyName: '',
                mainBusiness: '',
                orderBy: '',
                page: 1,
                pageSize: 10,
                status: ''
            },
            tableList: {}
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
            this.form.page = a
            post('/api/sysmgr-web/interim-company/list', this.form).then(data => {
                this.tableList = data
            })
        },
        sizeChange(a) {
            this.form.page = a
            this.query()
        },
        deleteCompany(id) {
            this.$confirm('是否确定删除此企业?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                post('/api/sysmgr-web/interim-company/delete', { id }).then(data => {
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    })
                    this.query()
                })
            }).catch(() => {})
        }
    }
}
</script>
<style scoped>
.r_main {
    padding: 15px;
    background-color: #fff;
}
.c0283fb {
    color: #0283fb;
    cursor: pointer;
}
</style>
