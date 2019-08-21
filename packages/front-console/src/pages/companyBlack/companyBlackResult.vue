<template>
    <div style="margin: 15px 0;background-color: #fff; padding: 15px;">
        <p>企业黑名单导入结果</p>
        <p class="res-count">成功 <span class="success">{{ successNum }}</span > / 失败 <span class="fail">{{ failNum }}</span></p>

        <el-table :data="tableList.list">
            <el-table-column prop="companyName" label="企业名称"></el-table-column>
            <el-table-column prop="companyAddress" label="所属地区"></el-table-column>
            <el-table-column prop="companyIndustry" label="所属行业"></el-table-column>
            <el-table-column prop="blackDataSourceName" label="数据源"></el-table-column>
            <el-table-column prop="status" label="导入状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status">成功</span>
                    <span style="color: red;" v-else>失败：{{ scope.row.errorMsg }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="action" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteCompanyBlackImportItem(scope.row)">删除</el-button>
                    <el-button
                        v-if="!scope.row.status"
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
            @handleCurrentChange="getCompanyBlackImportList"
        />

        <el-dialog
            title="编辑"
            :visible.sync="editDialogVisible"
            width="30%">
            <el-form ref="editForm" :model="editForm" label-width="80px">
                <el-form-item label="企业名称" prop="companyName">
                    <el-input v-model.trim="editForm.companyName"></el-input>
                </el-form-item>
                <el-form-item label="所属地区" prop="companyAddress">
                    <el-input v-model.trim="editForm.companyAddress"></el-input>
                </el-form-item>
                <el-form-item label="所属行业" prop="companyIndustry">
                    <el-input v-model.trim="editForm.companyIndustry"></el-input>
                </el-form-item>
                <el-form-item label="数据源" prop="blackDataSourceName">
                    <!-- <el-input v-model.trim="editForm.blackDataSource"></el-input> -->
                    <el-select clearable v-model="editForm.blackDataSource">
                        <el-option
                            v-for="item in dataSourceList"
                            :key="item.value"
                            :label="item.text"
                            :value="item.value"
                        ></el-option>
                    </el-select>
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
            dataSourceList: [],
        }
    },
    created() {
        const { taskId = null, targetType } = this.$route.query
        this.form.importTaskId = taskId
        this.targetType = targetType
    },
    mounted() {
        get(monitor.optionList, {
            type: 'CompanyDataSource',
        }).then(data => {
            this.dataSourceList = data
        })
        this.getCompanyBlackImportList()
    },
    methods: {
        // 查询列表
        getCompanyBlackImportList(page) {
            if(isNaN(page)) {
                page = 1
            }
            this.form.page = page

            post(monitor.getCompanyBlackImportList, this.form).then(data => {
                console.log(data)
                this.tableList = data.pageInfo
                this.successNum = data.successNum
                this.failNum = data.failNum
            })
        },
        sizeChange(size) {
            this.form.pageSize = size
            this.getCompanyBlackImportList()
        },
        // 删除条目
        deleteCompanyBlackImportItem(row) {
            get(monitor.deleteCompanyBlackImportItem, {id: row.id}).then(data => {
                console.log(data)
                this.$message.success('删除成功')
                this.getCompanyBlackImportList()
            })
        },
        // 提交导入结果
        submitCompanyBlackImport() {
            get(monitor.submitCompanyBlackImport, {
                importTaskId: this.form.importTaskId
            }).then(data => {
                this.$message.success('提交成功')
                this.go2list()
            })
        },
        // 返回企业黑名单列表
        go2list() {
            this.$router.push('companyBlacklist')
        },
        // 确认提交
        handleSubmit() {
            this.submitCompanyBlackImport()
        },

        // 编辑按钮
        openEditDialog(row) {
            this.editForm = Object.assign({}, row)
            this.editDialogVisible = true
        },
        // 确定编辑
        submitEdit() {
            console.log(this.editForm)
            this.editDialogVisible = false
            const form = {
                id: this.editForm.id,
                blackDataSource: this.editForm.blackDataSource,
                companyAddress: this.editForm.companyAddress,
                companyIndustry: this.editForm.companyIndustry,
                companyName: this.editForm.companyName
            }
            post(monitor.updateCompanyBlackImportItem, form).then(() =>{
                this.$message({
                    type: 'success',
                    message: '编辑成功'
                })
                this.getCompanyBlackImportList()
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

