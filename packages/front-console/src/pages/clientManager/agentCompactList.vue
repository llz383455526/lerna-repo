<template>
    <div class="r_main">
        <el-breadcrumb>
            <el-breadcrumb-item>
                代理商合同生成
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="form" class="form" :inline="true" size="small" ref="form">
            <el-form-item label="代理商名称" prop="agentName">
                <el-input class="form_input" v-model="form.agentName"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select class="form_input" v-model="form.status">
                    <el-option v-for="e in statusList" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="$refs['form'].resetFields()">清除</el-button>
            </el-form-item>
        </el-form>
        <router-link to="agentCompactCreate">
            <el-button size="small">创建代理商合同</el-button>
        </router-link>
        <el-table class="table" :data="data.list">
            <el-table-column label="合同编号" prop="generateId"></el-table-column>
            <el-table-column label="代理商名称" prop="agentName"></el-table-column>
            <el-table-column label="代理期限" align="center">
                <template slot-scope="scope">
                    {{scope.row.agentStart | formatTime('yyyy-MM-dd')}} 至 {{scope.row.agentEnd | formatTime('yyyy-MM-dd')}}
                </template>
            </el-table-column>
            <el-table-column label="操作人" prop="updateByName"></el-table-column>
            <el-table-column label="更新时间" prop="updateAt"></el-table-column>
            <el-table-column label="状态" prop="statusName"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                  <router-link  v-if="scope.row.status != 30" :to="`agentCompactCreate?generateId=${scope.row.generateId}`">
                    <el-button type="text">编辑</el-button>
                  </router-link>
                  <router-link  v-if="scope.row.status != 10" :to="`agentCompactLook?generateId=${scope.row.generateId}`">
                    <el-button type="text">查看</el-button>
                  </router-link>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="data.total"
            :total="data.total"
            v-on:handleSizeChange="setSize"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
export default {
    data() {
        return {
            form: {
                agentName: '',
                status: '',
                pageSize: 10,
                page: 1
            },
            statusList: [],
            data: {}
        }
    },
    mounted() {
        get('/api/contract-web/commom/option?enumType=AgentGenStatus').then(data => {
            console.log(data)
            this.statusList = data
        })
        this.query()
    },
    methods: {
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post('/api/contract-web/agent-contract-generate/list', this.form).then(data => {
                this.data = data
            })
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        }
    }
}
</script>
<style scoped>
.r_main {
  padding: 30px 10px 50px;
  background-color: #fff;
}
.form {
    margin-top: 20px;
}
.form_input {
    width: 200px;
}
.table {
    margin-top: 20px;
}
</style>
