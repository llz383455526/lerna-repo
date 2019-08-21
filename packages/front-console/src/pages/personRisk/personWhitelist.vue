<template>
    <div style="margin: 15px 0;background-color: #fff; padding: 15px;">
        <div style="margin: 5px 0;">
            <p style="display: inline-block;">实名白名单</p>
            <el-button
								style="float: right; margin-top: 7px;"
								icon="el-icon-upload"
								@click="$router.push('personWhiteImport')">添加审批</el-button>
        </div>
        <el-form :inline="true" :model="form" ref="ruleForm">
            <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name" placeholder="请输入" size="small"></el-input>
            </el-form-item>
            <el-form-item label="证件号" prop="idCard">
                <el-input v-model="form.idCard" placeholder="请输入" size="small"></el-input>
            </el-form-item>
            <el-form-item label="银行卡" prop="accountNo">
                <el-input v-model="form.accountNo" placeholder="请输入" size="small"></el-input>
            </el-form-item>
            <el-form-item label="场景事件" prop="personWhiteRiskType">
                <el-select clearable v-model="form.personWhiteRiskType" size="small">
                    <el-option
                        v-for="item in riskTypeList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="personRiskState">
                <el-select clearable v-model="form.personRiskState" size="small">
                    <el-option
                        v-for="item in personRiskStateList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="getPersonWhiteList">查询</el-button>
                <el-button size="small" @click="resetForm">清空</el-button>
                <el-button type="primary" size="small" @click="toggleApprove">批量审批</el-button>
            </el-form-item>
            <el-form-item style="float: right;">
                <el-button size="small" icon="el-icon-download" @click="exportPersonWhiteList">导表</el-button>
            </el-form-item>
        </el-form>

        <el-table
            ref="whiteTable"
            :data="tableList.list"
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column
                v-if="showApprove"
                key="selection"
                fixed
                type="selection"
                width="50">
            </el-table-column>
            <el-table-column width="100" prop="name" key="name" label="姓名"></el-table-column>
            <el-table-column width="180" prop="idCard" key="idCard" label="证件号"></el-table-column>
            <el-table-column width="300" prop="downloadCodeList" key="downloadCodeList" label="证件附件">
                <template slot-scope="scope">
                    <import-img-upload
                        :key="scope.row.id"
                        v-if="scope.row.downloadCodeList"
                        :downloadCodeList="scope.row.downloadCodeList"
                    ></import-img-upload>
                </template>
            </el-table-column>
            <el-table-column width="180" prop="accountNo" key="accountNo" label="银行卡"></el-table-column>
            <el-table-column width="100" prop="personWhiteRiskTypeName" key="personWhiteRiskTypeName" label="类型"></el-table-column>
            <el-table-column width="100" prop="customerCompanyName" key="customerCompanyName" label="客户名称"></el-table-column>
            <el-table-column width="100" prop="serviceCompanyName" key="serviceCompanyName" label="落地公司"></el-table-column>
            <el-table-column width="150" prop="updateByName" key="createByName" label="添加人"></el-table-column>
            <el-table-column width="100" prop="stateName" key="stateName" label="审核状态"></el-table-column>
            <el-table-column width="180" prop="updateTime" key="updateTime" label="审核记录">
                <template slot-scope="scope">
                    {{scope.row.updateByName}} | {{scope.row.updateTime}}
                </template>
            </el-table-column>
            <el-table-column
                fixed="right"
                prop="action"
                label="操作"
                width="120">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="go2WhiteDetail(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click="remove(scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            :current-page="form.page"
            @handleSizeChange="sizeChange"
            @handleCurrentChange="getPersonWhiteList"
        />
        <div class="approve-warp" v-if="showApprove">
            <el-form style="margin-top: 25px;">
                <el-form-item label="审核意见(非必填)">
                    <el-input
                        v-model.trim="approveForm.remark"
                        type="textarea"
                        :rows="3"
                        placeholder="请输入内容"
                    ></el-input>
                </el-form-item>
                <el-form-item label="审核结果">
                    <el-radio v-model="approveForm.state" label="success">通过</el-radio>
                    <el-radio v-model="approveForm.state" label="fail">不通过</el-radio>
                </el-form-item>
            </el-form>
            <el-button style="margin-top: 10px;" type="primary" size="small" @click="submitApprove">确定提交</el-button>
        </div>
    </div>
</template>

<script>
/**
 * TODO
 */
import { monitor } from '../../api/monitor'
import { post, get} from '../../store/api'
import ImportImgUpload from './importImgUpload'
import { urlEncode } from '../../plugin/utils-functions'

export default {
    components: {
        ImportImgUpload,
    },
    data () {
        return {
            form: {
                pageSize: 10,
                page: 1,
                personRiskState: '',
                personWhiteRiskType: '',
                name: '',
                idCard: '',
                accountNo: '',
            },
            tableList: {
                total: 0,
                list: [],
            },
            // 场景事件枚举
            riskTypeList: [
                {
                    text: '签约',
                    value: 'sign-white',
                },
                {
                    text: '发放',
                    value: 'deliver-white',
                }
            ],
            // 状态枚举
            personRiskStateList: [],
            // 选项
            selections: [],
            // 审核
            approveForm: {
                ids: [],
                remark: '',
                state: '',
            },
            showApprove: false,
        }
    },
    mounted() {
        get(monitor.optionList, {
            type: 'ApproveFlowState',
        }).then(data => {
            this.personRiskStateList = data
        })
        this.getPersonWhiteList()
    },
    methods: {
        getPersonWhiteList(page) {
            if(isNaN(page)) {
                page = 1
            }
            this.form.page = page

            post(monitor.getPersonWhiteList, this.form).then(data => {
                this.tableList = data
            }).catch((err) => {
                this.$message({
                    type: 'error',
                    message: '获取失败'
                })
            })
        },
        sizeChange(size) {
            this.form.pageSize = size
            this.getPersonWhiteList()
        },
        // 导表
        exportPersonWhiteList() {
            const form = JSON.parse(JSON.stringify(this.form))
            delete form.page
            delete form.pageSize
            const url = `${monitor.exportPersonWhiteList}?${urlEncode(form)}`
            window.open(url)
        },

        go2WhiteDetail(row) {
            this.$router.push({ path: `personWhiteDetail/${row.id}`})
        },
        // 删除白名单
        deletePersonWhite(id) {
            get(monitor.deletePersonWhite, {id}).then(data => {
                this.$message.success('操作成功')
                this.getPersonWhiteList()
            })
        },
        // 审核白名单
        approvePersonWhite(form) {
            post(monitor.approvePersonWhite, form).then(data => {
                console.log(data)
                this.$message.success('操作成功')
                this.toggleApprove()
                this.getPersonWhiteList()
            })
        },
        // 清空
        resetForm() {
            this.$refs.ruleForm.resetFields()
            // Object.keys(this.form).forEach(key => {
            //     if (key !== 'page' && key !== 'pageSize') {
            //         this.form[key] = ''
            //     }
            // })
        },

        // 启用/禁用
        enableChange(row) {
            let {id, enable} = row
            enable = !enable
            this.updatePersonBlackEnable(id, enable)
        },
        // 移除
        remove(row) {
            console.log(row)
            this.deletePersonWhite(row.id)
        },

        // 选项处理
        handleSelectionChange(val) {
            this.selections = val
        },
        // 清空选项
        clearSelection() {
            this.$refs.whiteTable.clearSelection();
        },
        // 批量审核按钮
        toggleApprove() {
            this.showApprove = !this.showApprove
            if (!this.showApprove) {
                this.approveForm = Object.assign({}, {
                    ids: [],
                    remark: '',
                    state: '',
                })
                this.clearSelection()
            }
        },
        // 审核确定按钮
        submitApprove() {
            if (this.selections.length <= 0) {
                this.$message.warning('请勾选需要审批的白名单')
                return
            }
            if (!this.approveForm.state) {
                this.$message.warning('请选择审核结果')
                return
            }
            this.approveForm.ids = this.selections.map(item => item.id)
            this.approvePersonWhite(this.approveForm)
        }
    }
}
</script>

<style lang="scss" scoped>
.approve-warp {

    .el-form {
        background: #F9F9F9;
        padding: 10px 20px;
        border-radius: 4px;
    }
}
</style>

