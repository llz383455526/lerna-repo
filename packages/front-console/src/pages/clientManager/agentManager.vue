<template>
    <div class="r_main">
        <el-breadcrumb>
            <el-breadcrumb-item>我的入驻代理商</el-breadcrumb-item>
        </el-breadcrumb>
        <div class="content">
            <el-form class="form" :model="form" :inline="true" label-width="100px" size="small" ref="form">
                <el-form-item label="代理商名称" prop="fullName">
                    <el-input v-model="form.fullName" class="in_input"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="query">查询</el-button>
                    <el-button @click="$refs['form'].resetFields()">清除</el-button>
                </el-form-item>
            </el-form>
            <!-- <router-link to="addAgent">
                <el-button size="small" v-if="userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'">新增</el-button>
            </router-link>
            <el-button class="ml20" size="small" @click="download">导出</el-button> -->
            <el-table :data="data.list">
                <el-table-column label="代理商名称" prop="fullName"></el-table-column>
                <el-table-column label="申请主体"></el-table-column>
                <el-table-column label="关联销售" prop="salesman"></el-table-column>
                <!-- <el-table-column label="渠道经理" prop="chargeByName"></el-table-column> -->
                <!-- <el-table-column label="地区">
                    <template slot-scope="scope">
                        {{scope.row.province}} {{scope.row.city}}
                    </template>
                </el-table-column> -->
                <el-table-column label="客户数量" prop="customerCount"></el-table-column>
                <!-- <el-table-column label="代理推广费率" prop="quoteFeeName"></el-table-column>
                <el-table-column label="代理期限" prop="periodTime" width="200px"></el-table-column> -->
                <el-table-column label="更新人" prop="updateByName"></el-table-column>
                <el-table-column label="更新时间" prop="updateTime"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <router-link :to="`agentDetail?id=${scope.row.id}`">
                            <el-button type="text">查看</el-button>
                        </router-link>
                        <!--<el-button type="text" @click="edit(scope.row)" v-if="userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'">编辑</el-button>-->
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
    </div>
</template>
<script>
import { get, post, postWithErrorCallback } from "../../store/api";
import {pcaa, pca} from 'area-data'
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters({
            userInformation: 'userInformation'
        })
    },
    data() {
        return {
            form: {
                fullName: '',
                provinceCode: '',
                cityCode: '',
                areaCode: '',
                chargeByName: '',
                pageSize: 10,
                page: 1
            },
            data: {}
        }
    },
    mounted() {
        this.query()
    },
    methods: {
        format(a) {
            if(!a) {
                return
            }
            var arr = []
            for(let k in pcaa[a]) {
                arr.push({
                    value: k,
                    text: pcaa[a][k]
                })
            }
            return arr
        },
        resetCity() {
            // var arr = this.format(this.form.provinceCode)
            this.form.cityCode = ''
            // if(arr.length) {
            //     this.form.cityCode = arr[0].value
            // }
        },
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post('/api/contract-web/agent-company/list', this.form).then(data => {
                this.data = data
            })
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        edit(a) {
            // sessionStorage.setItem('agent', JSON.stringify(a))
            this.$router.push(`addAgent?companyId=${a.id}`)
        },
        download() {
            var str = ''
            for(let k in this.form) {
                if(!str) {
                    str += `?${k}=${this.form[k]}`
                }
                else {
                    str += `&${k}=${this.form[k]}`
                }
            }
            window.open(`/api/contract-web/agent-company/export-agent-list${str}`)
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
.in_input {
  width: 200px;
}
.in_input2 {
    width: 515px;
}
.fr {
    float: right;
    margin-right: 50px;
}
.ml20 {
    margin-left: 20px;
}
</style>
