<template>
    <div style="margin: 15px 0;background-color: #fff; padding: 15px;">
        <div style="margin: 5px 0;">
            <p style="display: inline-block;">个人黑名单</p>
            <el-button
								style="float: right; margin-top: 7px;"
								icon="el-icon-upload"
								@click="$router.push('personBlackImport')">添加黑名单</el-button>
        </div>
        <el-form :inline="true" :model="form" ref="ruleForm">
            <el-form-item label="用户名称" prop="name">
                <el-input v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item label="身份证号" prop="idCard">
                <el-input v-model="form.idCard" size="small"></el-input>
            </el-form-item>
            <el-form-item label="手机号" prop="mobilePhone">
                <el-input v-model="form.mobilePhone" size="small"></el-input>
            </el-form-item>
            <el-form-item label="类型" prop="personBlackRiskType">
                <el-select clearable v-model="form.personBlackRiskType" size="small">
                    <el-option
                        v-for="item in riskTypeList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="personRiskEnable">
                <el-select clearable v-model="form.personRiskEnable" size="small">
                    <el-option
                        v-for="item in riskStateList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="getPersonBlackList">查询</el-button>
                <el-button size="small" @click="resetForm">清空</el-button>
            </el-form-item>
            <el-form-item style="float: right;">
                <el-button size="small" icon="el-icon-download" @click="exportPersonBlackList">导表</el-button>
            </el-form-item>
        </el-form>

        <el-table
            style="width: 100%;"
            :data="tableList.list">
            <el-table-column prop="name" label="用户名称"></el-table-column>
            <el-table-column prop="idCard" label="身份证号"></el-table-column>
            <el-table-column prop="mobilePhone" label="手机号"></el-table-column>
            <el-table-column prop="personBlackRiskTypeName" label="黑名单类型"></el-table-column>
            <el-table-column prop="enableName" label="状态"></el-table-column>
            <el-table-column width="320" prop="updateTime" key="updateTime" label="操作记录">
                <template slot-scope="scope">
                    {{scope.row.updateByName}} | {{scope.row.updateTime}}
                </template>
            </el-table-column>
            <el-table-column prop="action" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="enableChange(scope.row)">
                        {{ scope.row.enable ? '禁用' : '启用' }}
                    </el-button>
                    <el-button type="text" size="small" @click="remove(scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            :current-page="form.page"
            @handleSizeChange="sizeChange"
            @handleCurrentChange="getPersonBlackList"
        />
    </div>
</template>

<script>
import { monitor } from '../../api/monitor'
import { post, get} from '../../store/api'
import { urlEncode } from '../../plugin/utils-functions'

export default {
    data () {
        return {
            form: {
                pageSize: 10,
                page: 1,
                personRiskState: '',
                personBlackRiskType: '',
                name: '',
                idCard: '',
                mobilePhone: '',
            },
            riskTypeList: [
                {
                    text: '签约',
                    value: 'sign-black',
                },
                {
                    text: '发放',
                    value: 'deliver-black',
                }
            ],
            riskStateList: [
                {
                    text: '有效',
                    value: 1
                },
                {
                    text: '无效',
                    value: 0,
                }
            ],
            tableList: {
                total: 0,
                list: [
                    // {
                    //     name: '321',
                    //     idCard: '1321',
                    //     mobilePhone: 18899993333,
                    //     personBlackRiskTypeName: 'xxx',
                    //     enable: 0,
                    //     updateByName: 'liuliuliu',
                    //     updateTime: '2019-11-11',
                    //     id: 233,
                    // }
                ],
            }
        }
    },
    mounted() {
        this.getPersonBlackList()
    },
    methods: {
        getPersonBlackList(page) {
            if(isNaN(page)) {
                page = 1
            }
            this.form.page = page

            post(monitor.getPersonBlackList, this.form).then(data => {
                console.log(data)
                this.tableList = data
            })
        },
        sizeChange(size) {
            this.form.pageSize = size
            this.getPersonBlackList()
        },
        // 导表
        exportPersonBlackList() {
            const form = JSON.parse(JSON.stringify(this.form))
            delete form.page
            delete form.pageSize
            const url = `${monitor.exportPersonBlackList}?${urlEncode(form)}`
            window.open(url)
        },

        deletePersonBlack(id) {
            get(monitor.deletePersonBlack, {id}).then(() => {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                this.getPersonBlackList()
            })
        },
        updatePersonBlackEnable(id, enable) {
            post(monitor.updatePersonBlackEnable, {id, enable}).then(() => {
                this.$message({
                    type: 'success',
                    message: '设置成功',
                })
                this.getPersonBlackList()
            })
        },
        // 清空
        resetForm() {
            this.$refs.ruleForm.resetFields()
        },

        // 启用/禁用
        enableChange(row) {
            let {id, enable} = row
            // 0 禁用
            // 1 启用
            enable = !enable ? 1 : 0
            this.updatePersonBlackEnable(id, enable)
        },
        // 移除
        remove(row) {
            console.log(row)
            this.deletePersonBlack(row.id)
        },
    }
}
</script>

