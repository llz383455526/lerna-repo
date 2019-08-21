<template>
    <div style="margin: 15px 0;background-color: #fff; padding: 15px;">
        <p>个人黑名单导入结果</p>
        <p class="res-count">成功 <span class="success">{{ successNum }}</span > / 失败 <span class="fail">{{ failNum }}</span></p>

        <el-table :data="tableList.list">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="idCard" label="证件号"></el-table-column>
            <el-table-column prop="mobilePhone" label="手机号"></el-table-column>
            <el-table-column prop="status" label="导入状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status">成功</span>
                    <span style="color: red;" v-else>失败：{{ scope.row.errorMsg }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="action" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deletePersonBlackImportItem(scope.row)">删除</el-button>
                        <!-- v-if="!scope.row.status" -->
                    <el-button
                        type="text"
                        size="small"
                        @click="openEditDialog(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin-top: 25px;">
            <el-button
                v-if="successNum > 0"
                type="primary"
                @click="handleSubmit">确定提交</el-button>
            <el-button @click="go2list">取消</el-button>
        </div>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            :current-page="form.page"
            @handleSizeChange="sizeChange"
            @handleCurrentChange="getPersonBlackimportList"
        />

        <el-dialog
            title="编辑"
            :visible.sync="editDialogVisible"
            width="30%">
            <el-form ref="editForm" :model="editForm" label-width="60px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="证件号" prop="idCard">
                    <el-input v-model="editForm.idCard"></el-input>
                </el-form-item>
                <el-form-item label="手机号" prop="accountNo">
                    <el-input v-model="editForm.mobilePhone"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="submitEdit">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
// TODO
import { monitor } from '../../api/monitor'
import {post, get} from '../../store/api'

export default {
    data() {
        return {
            successNum: '-',
            failNum: '-',
            form: {
                page: 1,
                pageSize: 10,
                importTaskId: null,
            },
            tableList: {
                total: 0,
                list: [
                ],
            },
            editDialogVisible: false,
            editForm: {},
        }
    },
    created() {
        const { taskId = null } = this.$route.query
        this.form.importTaskId = taskId
    },
    mounted() {
        this.getPersonBlackimportList()
    },
    methods: {
        // 查询列表
        getPersonBlackimportList(page) {
            if(isNaN(page)) {
                page = 1
            }
            this.form.page = page

            post(monitor.getPersonBlackimportList, this.form).then(data => {
                this.tableList = data.pageInfo
                this.successNum = data.successNum
                this.failNum = data.failNum
            })
        },
        sizeChange(size) {
            this.form.pageSize = size
            this.getPersonBlackimportList()
        },
        // 删除条目
        // TODO 接口未提供
        deletePersonBlackImportItem(row) {
            get(monitor.deletePersonBlackImportItem, {id: row.id}).then(data => {
                console.log(data)
                this.$message.success('删除成功')
                this.getPersonBlackimportList()
            })
        },
        // 提交导入结果
        submitPersonBlackImport() {
            get(monitor.submitPersonBlackImport, {
                importTaskId: this.form.importTaskId
            }).then(data => {
                this.$message.success('提交成功')
                this.go2list()
            })
        },
        // 返回列表
        go2list() {
            this.$router.push('personBlacklist')
        },
        // 确认提交
        handleSubmit() {
            this.submitPersonBlackImport()
        },

        // TODO
        // 编辑按钮
        openEditDialog(row) {
            this.editForm = Object.assign({}, row)
            this.editDialogVisible = true
        },
        // 确定编辑
        submitEdit() {
            console.log(this.editForm)
            const form = {
                id: this.editForm.id,
                idCard: this.editForm.idCard,
                mobilePhone: this.editForm.mobilePhone,
                name: this.editForm.name,
                remark: this.editForm.remark
            }
            post(monitor.updatePersonBlackImportItem, form).then(() => {
                this.$message({
                    type: 'success',
                    message: '编辑成功'
                })
                this.editDialogVisible = false
                this.getPersonBlackimportList()
            })
        },
    }

}
</script>

<style lang="scss" scoped>
.res-count {
    text-align: center;

    .success {
        color: #409EFF;
    }
    .fail {
        color: #F56C6C;
    }
}
</style>

