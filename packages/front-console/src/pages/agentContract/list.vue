<template>
    <div class="main-container">
        <div class="mb30">代理商入驻申请</div>
        <router-link to="create">
            <el-button>新增代理商入驻</el-button>
        </router-link>
        <el-table :data="tableList.data">
                <el-table-column prop="id" label="申请编号"></el-table-column>
                <el-table-column prop="customerName" label="企业名称"></el-table-column>
                <el-table-column prop="createdByName" label="申请人"></el-table-column>
                <el-table-column prop="updatedAt" label="提交时间"></el-table-column>
                <el-table-column prop="curProcessUser" label="当前处理人"></el-table-column>
                <el-table-column prop="processedAt" label="最后审批时间"></el-table-column>
                <el-table-column label="合同类型">
                    <template slot-scope="scope">
                        {{workflowTypeList[scope.row.workflowType] || '非标合同'}}
                        <!-- {{scope.row.workflowType === 'create_sale_contract' ? '标准合同' : '非标准合同'}} -->
                    </template>
                </el-table-column>
                <el-table-column prop="statusName" label="申请状态">
                    <template slot-scope="scope">
                        <span v-if="scope.row.statusName">{{scope.row.statusName}}</span>
                        <span v-else-if="scope.row.status === 'init'">待提交</span>
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="200">
                    <template slot-scope="scope">
                        <el-button v-if="scope.row.status != 'draft'" @click="toPreview(scope.row.id, 'watch')" type="text" size="medium" style="padding:0;">查看</el-button>
                        <el-button v-if="scope.row.status === 'init' || scope.row.status === 'draft'" @click="toCreate(scope.row.id, scope.row.workflowType)" type="text" size="medium" style="padding:0;">编辑</el-button>
                        <el-button v-if="scope.row.status === 'init' && scope.row.createdBy == userInformation.id" @click="toDetail(scope.row.id, 'watch')" type="text" size="medium" style="padding:0;">送审</el-button>
                        <el-button v-if="scope.row.status === 'draft' || scope.row.status === 'init'" @click="closeContract(scope.row.id)" type="text" size="medium" style="padding:0;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
    </div>
</template>

<script>
export default {
    data() {
        return {
            pageIndex: 1,
            pageSize: 10,
            tableList: {},
            formSearch: {
                workflowType: '',
                customerName: '',
                createBy: '',
                serviceCompanyName: '',
                status: '',
                moduleName: 'sale_contract'
            },
        }
    },
    methods: {
        getList() {
            let formSearch = _.cloneDeep(this.formSearch)
            let options = {
                pageNo: this.pageIndex,
                pageSize: this.pageSize,
                example: formSearch,
            }

            post('/api/opencrm/workflow/list', options)
                .then(result => {
                    this.tableList = result
                })
        },
    }
}
</script>


<style lang="scss" scoped>
.main-container {
    background-color: white;
    padding: 15px;
}
</style>

