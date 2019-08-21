<template>
    <div style="margin: 15px 0;background-color: #fff; padding: 15px;">
        <p>白名单导入结果</p>
        <p class="res-count">成功 <span class="success">{{ successNum }}</span > / 失败 <span class="fail">{{ failNum }}</span></p>

        <el-table :data="tableList.list">
            <el-table-column prop="name" label="姓名"></el-table-column>
            <el-table-column prop="idCard" label="证件号"></el-table-column>
            <el-table-column prop="idCardType" label="证件类型"></el-table-column>
            <el-table-column prop="accountNo" label="银行卡"></el-table-column>
            <el-table-column v-if="isSignWhite" prop="customerCompanyName" label="客户公司"></el-table-column>
            <el-table-column v-if="isSignWhite" prop="serviceCompanyName" label="服务公司"></el-table-column>
            <el-table-column prop="status" label="导入状态">
                <template slot-scope="scope">
                    <span v-if="scope.row.status">成功</span>
                    <span style="color: red;" v-else>失败：{{ scope.row.errorMsg }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="downloadCodeList" width="400" label="证件附件">
                <template slot-scope="scope">
                    <import-img-upload
                        :key="scope.row.id"
                        :edit="true"
                        :downloadCodeList="scope.row.downloadCodeList || []"
                        @remove="deleteIdcardImg($event, scope.row.id)"
                        @upload-success="addIdcardImg($event, scope.row.id)"
                    ></import-img-upload>
                </template>
            </el-table-column>
            <el-table-column prop="action" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="deletePersonWhiteImportItem(scope.row)">删除</el-button>
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
            @handleCurrentChange="getPersonWhiteImportList"
        />

        <el-dialog
            title="编辑"
            :visible.sync="editDialogVisible"
            width="30%">
            <el-form ref="editForm" :model="editForm" label-width="100px">
                <el-form-item label="姓名" prop="name">
                    <el-input v-model="editForm.name"></el-input>
                </el-form-item>
                <el-form-item label="证件号" prop="idCard">
                    <el-input v-model="editForm.idCard"></el-input>
                </el-form-item>
                <el-form-item label="证件类型" prop="idCardType">
                    <el-input v-model="editForm.idCardType"></el-input>
                </el-form-item>
                <el-form-item label="银行卡" prop="accountNo">
                    <el-input v-model="editForm.accountNo"></el-input>
                </el-form-item>
                <el-form-item v-if="isSignWhite" label="客户公司" prop="customerCompanyName">
                    <el-input v-model="editForm.customerCompanyName"></el-input>
                </el-form-item>
                <el-form-item v-if="isSignWhite" label="服务公司" prop="serviceCompanyName">
                    <el-input v-model="editForm.serviceCompanyName"></el-input>
                </el-form-item>
                <!-- <el-form-item label="证件附件" prop="downloadCodeList">
                    <import-img-upload
                        v-if="editDialogVisible"
                        :edit="true"
                        :downloadCodeList="editForm.downloadCodeList || []"
                        @remove="deleteIdcardImg"
                        @upload-success="addIdcardImg"
                    ></import-img-upload>
                </el-form-item> -->
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
import ImportImgUpload from './importImgUpload'

export default {
    components: {
        ImportImgUpload,
    },
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
            targetType: 'person_sign_white_import',
        }
    },
    computed: {
        // 是签约白名单
        isSignWhite() {
            return this.targetType === 'person_sign_white_import'
        }
    },
    created() {
        const { taskId = null, targetType } = this.$route.query
        this.form.importTaskId = taskId
        // person_sign_white_import, person_deliver_white_import
        this.targetType = targetType
    },
    mounted() {
        this.getPersonWhiteImportList()
    },
    methods: {
        // 查询列表
        getPersonWhiteImportList(page) {
            if(isNaN(page)) {
                page = 1
            }
            this.form.page = page

            post(monitor.getPersonWhiteImportList, this.form).then(data => {
                console.log(data)
                this.tableList = data.pageInfo
                this.successNum = data.successNum
                this.failNum = data.failNum
            })
        },
        sizeChange(size) {
            this.form.pageSize = size
            this.getPersonWhiteImportList()
        },
        deletePersonWhiteImportItem(row) {
            get(monitor.deletePersonWhiteImportItem, {id: row.id}).then(data => {
                console.log(data)
                this.$message.success('删除成功')
                this.getPersonWhiteImportList()
            })
        },
        // 提交导入结果
        submitPersonWhiteImport() {
            get(monitor.submitPersonWhiteImport, {
                importTaskId: this.form.importTaskId
            }).then(data => {
                this.$message.success('提交成功')
                this.go2list()
            })
        },
        // 返回列表
        go2list() {
            this.$router.push('personWhitelist')
        },
        // 确认提交
        handleSubmit() {
            this.submitPersonWhiteImport()
        },
        
        // TODO
        // 编辑按钮
        openEditDialog(row) {
            this.editForm = Object.assign({}, row)
            this.editDialogVisible = true
        },
        // 确定编辑
        submitEdit() {
            // 发放白名单不传 客户公司，服务公司
            console.log(this.editForm)
            const form = {
                accountNo: this.editForm.accountNo,
                customerCompanyName: this.editForm.customerCompanyName,
                id: this.editForm.id,
                idCard: this.editForm.idCard,
                idCardType: this.editForm.idCardType,
                name: this.editForm.name,
                remark: this.editForm.remark,
                serviceCompanyName: this.editForm.serviceCompanyName,
            }
            post(monitor.updatePersonWhiteImportItem, form).then(data => {
                this.$message({
                    type: 'success',
                    message: '编辑成功'
                })
                this.editDialogVisible = false
                this.getPersonWhiteImportList()
            }).catch(() => {
                this.$message({
                    type: 'error',
                    message: '编辑失败'
                })
            })
        },
        // 添加/删除附件
        addIdcardImg(file, id) {
            console.log(file)
            const form = {
                downloadCode: file.downloadCode,
                id,
            }

            post(monitor.updatePersonWhiteImportIdcard, form).then(data => {
                console.log(data)
            }).catch(err => {
                this.$message({
                    type: 'error',
                    message: '上传失败'
                })
            })
        },
        deleteIdcardImg(file, id) {
            const form = {
                downloadCode: file.downloadCode,
                id,
            }

            post(monitor.deletePersonWhiteFileImportItem, form).catch((err) => {
                this.$message({
                    type: 'error',
                    message: '删除失败'
                })
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

