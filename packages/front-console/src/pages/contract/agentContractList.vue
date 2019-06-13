<template>
    <div class="r_main">
        <el-breadcrumb>
            <el-breadcrumb-item>
                渠道合同管理
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="form" class="form" :inline="true" size="small" ref="form">
            <el-form-item label="渠道名称" prop="companyName">
                <el-input class="form_input" v-model="form.companyName"></el-input>
            </el-form-item>
            <el-form-item label="状态" prop="status">
                <el-select class="form_input" v-model="form.status">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="e in statusList" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同归档" prop="status">
                <el-select class="form_input" v-model="form.archiveStatus">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="e in archiveList" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="$refs['form'].resetFields()">清除</el-button>
                <el-button size="small" @click="exportDetail">导出</el-button>
            </el-form-item>
        </el-form>
        <!-- <router-link to="agentContractCreate" v-if="userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'">
            <el-button size="small">新增</el-button>
        </router-link> -->
        <el-table class="table" :data="data.list">
            <el-table-column label="合同编号" prop="contractNo"></el-table-column>
            <el-table-column label="渠道名称" prop="companyName"></el-table-column>
            <el-table-column label="服务商名称" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="代理期限" width="200px">
                <template slot-scope="scope">
                    {{scope.row.agentStart | formatTime('yyyy-MM-dd')}} 至 {{scope.row.agentEnd | formatTime('yyyy-MM-dd')}}
                </template>
            </el-table-column>
            <el-table-column label="代理推广费率" prop="quoteFeeName"></el-table-column>
            <el-table-column label="渠道经理" prop="chargeByName"></el-table-column>
            <el-table-column label="状态" prop="statusName"></el-table-column>
            <el-table-column label="合同归档" prop="archiveStatusName"></el-table-column>
            <el-table-column label="版本号" prop="versionSeq"></el-table-column>
            <el-table-column label="版本生效月份" prop="versionStartDate">
                <template slot-scope="scope">
                    {{scope.row.versionStartDate.substr(5, 2)}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <router-link :to="`/main/contractManager/preview_agent?contractHisId=${scope.row.id}&isLook=1`">
                        <el-button type="text">查看</el-button>
                    </router-link>
                    <!-- <router-link  v-if="scope.row.status != 20 && userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'" :to="`agentContractCreate?contractHisId=${scope.row.id}`">
                        <el-button type="text">编辑</el-button>
                    </router-link> -->
                    <!-- <router-link> -->
                        <el-button type="text" @click="showHistroy(scope.row)">历史版本</el-button>
                    <!-- </router-link> -->
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="data.total"
            :total="data.total"
            v-on:handleSizeChange="setSize"
            :currentSize="pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="page">
        </ayg-pagination>

        <el-dialog title="查看历史版本" :visible.sync="dialogTableVisible">
            <el-table :data="gridData">
                <el-table-column property="contractNo" label="合同编号" width="150">
                    <template slot-scope="scope">
                        <router-link :to="`/main/contractManager/preview_agent?contractHisId=${scope.row.constractHisId}&isLook=1`">
                            <el-button type="text">{{scope.row.contractNo}}</el-button>
                        </router-link>
                    </template>
                </el-table-column>
                <el-table-column property="versionSeq" label="版本号"></el-table-column>
                <el-table-column property="flowMemo" label="版本说明"></el-table-column>
                <el-table-column property="versionStartDate" label="生效月份">
                    <template slot-scope="scope">
                        {{scope.row.versionStartDate.substr(5, 2)}}
                    </template>
                </el-table-column>
                <el-table-column property="statusName" label="状态"></el-table-column>
                <el-table-column property="createAt" label="创建时间" width="200"></el-table-column>
                <el-table-column property="createByName" label="创建人"></el-table-column>
            </el-table>
        </el-dialog>

    </div>
</template>
<script>
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
import { mapGetters } from 'vuex'
export default {
    computed: {
        ...mapGetters({
            userInformation: 'userInformation'
        })
    },
    data() {
        return {
            pageSize: 10,
            page: 1,
            form: {
                companyName: '',
                status: '',
                archiveStatus: '',
            },
            statusList: [],
            archiveList: [],
            data: {},
            gridData: [],
            dialogTableVisible: false,
        }
    },
    mounted() {
        get('/api/contract-web/commom/options?enumTypes=AgentContractStatus,ArchiveStatus').then(data => {
            console.log(data)
            this.statusList = data.AgentContractStatus
            this.archiveList = data.ArchiveStatus
            // this.form.status = this.statusList[0].value
            this.query()
        })
    },
    methods: {
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.page = a
            let param = {
                status: this.form.status,
                archiveStatus: this.form.archiveStatus,
                companyName: this.form.companyName,
                page: this.page,
                pageSize: this.pageSize,
            };
            post('/api/contract-web/agent-contract/list', param).then(data => {
                this.data = data
            })
        },
        setSize(a) {
            this.pageSize = a
            this.query()
        },
        showHistroy(obj) {
            this.dialogTableVisible = true
            get('/api/contract-web/agent-contract/query-agentContracts-history?contractId='+obj.originId).then(res => {
                this.gridData = res
            })
        },
        exportDetail() {
            var str = ''
            for (var k in this.form) {
                if(!str) {
                    str += `?${k}=${this.form[k]}`
                }
                else {
                    str += `&${k}=${this.form[k]}`
                }
            }
            window.open(`/api/contract-web/agent-contract/export-agent-contract-list${str}`)
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
