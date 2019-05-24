<template>
    <div style="background-color:#fff;padding:15px;">
        <div style="margin-bottom:30px;">查看历史版本</div>
        <el-table :data="tableList" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="versionSeq" label="版本号"></el-table-column>
            <el-table-column prop="statusName" label="状态"></el-table-column>
            <el-table-column prop="flowMemo" label="版本说明"></el-table-column>
            <el-table-column prop="versonTimeMemo" label="创建时间"></el-table-column>
            <el-table-column prop="createByName" label="创建人"></el-table-column>
            <el-table-column label="操作" width="150">
                <template slot-scope="scope">
                    <el-button @click="handleLook(scope.row.id)" type="text">查看</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            v-on:handleSizeChange="handleSizeChange"
            v-on:handleCurrentChange="handleCurrentChange"
            :currentPage="currentPage">
        </ayg-pagination>
    </div>
</template>

<script>
import {post, get} from '../../store/api';
export default {
    data() {
        return {
            pageSize: 10,
            currentPage: parseInt(this.$route.query.page) || 1,
            contractId: '',
            tableList: [],
        }
    },
    methods: {
        requestAction(pageInfo) {
            const { contractId } = this
            let param = {
                contractId,
                page: pageInfo.page,
                pageSize: pageInfo.pageSize,
            };
            get('/api/contract-web/contract/query-contracts-history', param).then(data => {
                this.tableList = data
            })
        },
        handleSizeChange(value) {
            this.pageSize = value;
            this.currentPage = 1;
            this.requestAction({
                page: this.currentPage,
                pageSize: value,
            });
        },
        handleCurrentChange(value) {
            this.currentPage = value;
            if (this.currentChangeBySetting) {
                this.currentChangeBySetting = false;
                return;
            }
            this.requestAction({
                page: value,
                pageSize: this.pageSize,
            });
        },
        handleLook(id) {
            this.$router.push({
                path: '/main/contract/preview',
                query: {contractId: id}
            });
        },
    },
    created() {
        this.contractId = this.$route.query.contractId
        this.requestAction({
            page: 1,
            pageSize: this.pageSize,
        })
    }
}
</script>

