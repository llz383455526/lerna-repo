<template>
    <div style="margin: 15px 0;background-color: #fff; padding: 15px;">
        <div style="margin: 5px 0;">
            <p style="display: inline-block;">企业黑名单</p>
            <el-button
								style="float: right; margin-top: 7px;"
								icon="el-icon-upload"
								@click="$router.push('companyBlackImport')"
							>添加企业</el-button>
        </div>
        <el-form :inline="true" :model="form" ref="form">
            <el-form-item label="企业名称" prop="companyName">
								<el-input size="small" v-model="form.companyName" clearable placeholder="请输入企业名称"></el-input>
                <!-- <el-select filterable style="width: 200px" v-model="form.companyId">
                    <el-option label="所有" value=""></el-option>
                    <el-option v-for="e in companyList" :value="e.id" :label="e.name" :key="e.id"></el-option>
                </el-select> -->
            </el-form-item>
            <el-form-item label="数据源" prop="blackDataSource">
                <el-select v-model="form.blackDataSource" size="small">
                    <el-option label="所有" value=""></el-option>
                    <el-option
                        v-for="item in dataSourceList"
                        :key="item.value"
                        :label="item.text"
                        :value="item.value"
                    ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="getCompanyBlacklist">查询</el-button>
                <el-button size="small" @click="resetForm">清空</el-button>
            </el-form-item>
            <el-form-item style="float: right;">
                <el-button size="small" icon="el-icon-download" @click="exportCompanyBlacklist">导表</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="tableList.list">
            <el-table-column prop="companyName" label="企业名称"></el-table-column>
            <el-table-column prop="companyAddress" label="所属地区"></el-table-column>
            <el-table-column prop="companyIndustry" label="所属行业"></el-table-column>
            <el-table-column prop="companyDataSourceName" label="数据源"></el-table-column>
            <!-- <el-table-column prop="remark" label="备注"></el-table-column> -->
            <el-table-column prop="createByName" label="添加人"></el-table-column>
            <el-table-column prop="action" label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="remove(scope.row)">移除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="tableList.total"
            :total="tableList.total"
            :current-page="form.page"
            @handleSizeChange="sizeChange"
            @handleCurrentChange="getCompanyBlacklist"
        />
    </div>
</template>

<script>
import { monitor } from '../../api/monitor'
import {post, get} from '../../store/api'
import { urlEncode } from '../../plugin/utils-functions'

export default {
    data() {
        return {
            form: {
                companyName: '',
                blackDataSource: '',
                page: 1,
                pageSize: 10,
            },
            tableList: {
                total: 0,
                list: [
                ],
            },
            dataSourceList: [],
            // companyList: [],
        }
    },
    mounted() {
        // get('/api/sysmgr-web/commom/company', {
        //     // companyIdentity: 'custom'
        // }).then(data => {
        //     this.companyList = data
        // })

        get(monitor.optionList, {
            type: 'CompanyDataSource',
        }).then(data => {
            this.dataSourceList = data
        })

        this.getCompanyBlacklist()
    },
    methods: {
        getCompanyBlacklist(page) {
            if(isNaN(page)) {
                page = 1
            }
            this.form.page = page

            post(monitor.getCompanyBlacklist, this.form).then(data => {
                console.log(data)
                this.tableList = data
            })
        },
        sizeChange(size) {
            this.form.pageSize = size
            this.getCompanyBlacklist()
        },
        resetForm() {
            this.$refs.form.resetFields()
        },

        exportCompanyBlacklist() {
            const form = JSON.parse(JSON.stringify(this.form))
            delete form.page
            delete form.pageSize
            const url = `${monitor.exportCompanyBlacklist}?${urlEncode(form)}`
            window.open(url)
        },

        deleteCompanyBlack(id) {
            get(monitor.deleteCompanyBlack, { id }).then((data) => {
                this.$message({
                    type: 'success',
                    message: '删除成功'
                })
                this.getCompanyBlacklist()
            })
        },

        // 移除
        remove(row) {
            this.deleteCompanyBlack(row.id)
        }

    }
}
</script>

<style lang="scss" scoped>

</style>
