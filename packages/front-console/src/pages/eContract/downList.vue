<template>
    <div class="main-container">
        <div style="margin: 0 40px 20px 0; display: inline-block;">下载列表</div>
        <el-button size="small" type="primary" @click="$router.back()">返回</el-button>
        <el-table :data="tableList.data" ref="table">
            <el-table-column label="序号" prop="id"></el-table-column>
            <el-table-column label="日期">
                <template slot-scope="scope">
                    {{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}
                </template>
            </el-table-column>
            <el-table-column label="文件类型" prop="fileType"></el-table-column>
            <el-table-column label="文件名" prop="fileName"></el-table-column>
            <el-table-column label="文件状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status != '下载'">{{scope.row.status}}</span>
                    <a v-else target="_bank" :href="`${econtract.usercertDownloadCenter}?id=${scope.row.id}`">
                        <el-button type="text">{{scope.row.status}}</el-button>
                    </a>
                </template>
            </el-table-column>
        </el-table>
        <div class="right">
            <el-pagination
                v-if="tableList.total"
                background
                :total="tableList.total"
                @size-change="sizeChange"
                @current-change="query"
                :current-page="form.pageNo"
                :page-sizes="[10, 20, 30, 40, 500, 1000]"
                :page-size="form.pageSize"
                layout="total, prev, pager, next, sizes, jumper">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import { post, get } from "../../store/api"
import { econtract } from 'src/api'
export default {
    data() {
        return {
            form: {
                pageNo: 1,
                pageSize: 10
            },
            tableList: {},
            econtract
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
            post(econtract.usercertDownloadGetlist, this.form).then(data => {
                this.tableList = data
            })
        },
        sizeChange(a) {
            this.form.pageSize = a
            this.query()
        }
    }
}
</script>
<style scoped>
.main-container {
    background-color:#fff;
    padding:15px;
}
.right {
    display: flex;
    justify-content: flex-end;
}
</style>
