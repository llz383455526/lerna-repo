<template>
    <div style="margin: 15px 0;background-color: #fff; padding: 15px;">
        <p>企业监控导入结果</p>
        <p class="res-count">成功 <span class="success">{{ success_count }}</span > / 失败 <span class="fail">{{ fail_count }}</span></p>

        <el-table :data="tableList.companies">
            <el-table-column prop="company_name" label="企业名称"></el-table-column>
            <el-table-column prop="area" label="所属地区"></el-table-column>
            <el-table-column prop="industry" label="所属行业"></el-table-column>
            <el-table-column prop="data_source" label="数据源"></el-table-column>
            <el-table-column prop="insert_status" label="导入状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.insert_status === '成功'">成功</span>
                    <span style="color: red;" v-else>失败：{{ scope.row.fail_reason }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="action" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deleteMonitorCompanyInsertItem(scope.row)">删除</el-button>
                    <el-button
                        v-if="scope.row.insert_status !== '成功'"
                        type="text"
                        size="small"
                        @click="openEditDialog(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin-top: 25px;">
            <el-button
                v-if="success_count > 0"
                type="primary"
                @click="handleSubmit">确定提交</el-button>
            <el-button @click="go2list">取消</el-button>
        </div>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            :current-page="form.page_no"
            @handleSizeChange="sizeChange"
            @handleCurrentChange="getMonitorCompanyInsert"
        />

        <el-dialog
            title="编辑"
            :visible.sync="editDialogVisible"
            width="30%">
            <el-form ref="editForm" :model="editForm" label-width="80px">
                <el-form-item label="企业名称" prop="company_name">
                    <el-input v-model.trim="editForm.company_name"></el-input>
                </el-form-item>
                <el-form-item label="所属地区" prop="area">
                    <el-input v-model.trim="editForm.area"></el-input>
                </el-form-item>
                <el-form-item label="所属行业" prop="industry">
                    <el-input v-model.trim="editForm.industry"></el-input>
                </el-form-item>
                <el-form-item label="数据源" prop="data_source">
                    <el-input v-model.trim="editForm.data_source"></el-input>
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
            success_count: '-',
            fail_count: '-',
            form: {
                page_no: 1,
                page_size: 10,
                insert_batch: null,
            },
            tableList: {
                total: 0,
                companies: [
                ],
            },
            editDialogVisible: false,
            editForm: {},
        }
    },
    created() {
        const { insert_batch } = this.$route.query
        this.form.insert_batch = insert_batch
    },
    mounted() {
        this.getMonitorCompanyInsert()
    },
    methods: {
        // 查询列表
        getMonitorCompanyInsert(page) {
            if(isNaN(page)) {
                page = 1
            }
            this.form.page_no = page

            post(monitor.getMonitorCompanyInsert, this.form).then(data => {
                console.log(data)
                this.tableList = data
                this.success_count = data.success_count
                this.fail_count = data.fail_count
            })
        },
        sizeChange(size) {
            this.form.page_size = size
            this.getMonitorCompanyInsert()
        },
        // 删除条目
        deleteMonitorCompanyInsertItem(row) {
            post(monitor.monitorCompanyInsertItemOperation, {
                operation_type: 'D',
                data: {
                    id: row.id
                }
            }).then(data => {
                // console.log(data)
                this.$message.success('删除成功')
                this.getMonitorCompanyInsert()
            })
        },
        // 提交导入结果
        submitMonitorCompanyInsert() {
            post(monitor.submitMonitorCompanyInsert, {
                insert_batch: this.form.insert_batch
            }).then(data => {
                this.$message.success('提交成功')
                this.go2list()
            })
        },
        // 返回企业黑名单列表
        go2list() {
            this.$router.push('monitorList')
        },
        // 确认提交
        handleSubmit() {
            this.submitMonitorCompanyInsert()
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
            const data = {
                id: this.editForm.id,
                data_source: this.editForm.data_source,
                area: this.editForm.area,
                industry: this.editForm.industry,
                company_name: this.editForm.company_name,
                remark: this.editForm.remark,
                insert_batch: this.editForm.insert_batch,
            }
            post(monitor.monitorCompanyInsertItemOperation, {
                operation_type: 'U',
                data,
            }).then(() =>{
                this.$message({
                    type: 'success',
                    message: '编辑成功'
                })
                this.getMonitorCompanyInsert()
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

