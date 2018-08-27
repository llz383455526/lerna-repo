<template>
    <div class="main">
        <div class="title">电子合同管理</div>
        <el-form :model="form" :inline="true" ref="query">
            <el-form-item label="所属平台：" prop="platformName">
                <el-select
                    v-model="form.platformName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    size="small">
                    <el-option
                        v-for="e in platform"
                        :key="e.extrSystemId"
                        :label="e.extrSystemName"
                        :value="e.extrSystemName">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同模板名称" prop="name">
                <el-select
                    v-model="form.name"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getName"
                    :loading="loading"
                    size="small">
                    <el-option
                        v-for="e in names"
                        :key="e.name"
                        :label="e.name"
                        :value="e.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="签约对象" prop="userName">
                <el-select
                    v-model="form.userName"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="getObject"
                    :loading="loading"
                    size="small">
                    <el-option
                        v-for="e in objects"
                        :key="e.name"
                        :label="e.name"
                        :value="e.name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="query">查询</el-button>
                <el-button type="text" size="small" @click="reset('query')">清空所有条件</el-button>
            </el-form-item>
        </el-form>
        <router-link to="addTemplate" tag="span"><el-button type="primary" size="small">新增合同模板</el-button></router-link>
        <el-table :data="list">
            <el-table-column label="合同模板ID" prop="templateId"></el-table-column>
            <el-table-column label="合同模板名称" prop="name"></el-table-column>
            <el-table-column label="客户平台" prop="platformName"></el-table-column>
            <el-table-column label="服务商名称">
                <template slot-scope="scope">
                    {{scope.row.partys[0].userName}}
                </template>
            </el-table-column>
            <el-table-column label="签约对象">
                <template slot-scope="scope">
                    <div v-for="(e, i) in scope.row.partys">
                        {{partys[i]}}：{{e.userName ? e.userName : '个人'}}
                    </div>
                    <!-- 甲：{{scope.row.partys[0].userName ? scope.row.partys[0].userName : '个人'}} <br/>
                    乙：{{scope.row.partys[1].userName ? scope.row.partys[1].userName : '个人'}} <br/>
                    <template v-if="scope.row.partys[2]">
                        丙：{{scope.row.partys[2].userName ? scope.row.partys[2].userName : '个人'}}
                    </template> -->
                </template>
            </el-table-column>
            <el-table-column label="对接方式" prop="accessTypeDesc"></el-table-column>
            <el-table-column label="是否发短信" prop="smsTypeDesc"></el-table-column>
            <el-table-column label="返回链接" prop="linkTypeDesc"></el-table-column>
            <el-table-column label="备注" prop="memo"></el-table-column>
            <el-table-column label="合同原件">
                <template slot-scope="scope">
                    <a target="_bank" :href="`${baseUrl}/api/econtract/template/download?fileName=${scope.row.fname}`">{{scope.row.fname}}</a>
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="look(scope.row, 1)">查看</el-button>
                    <el-button type="text" size="small" @click="look(scope.row)">修改</el-button>
                    <el-button type="text" size="small" @click="deleteTemplate(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="total"
            :total="total"
            v-on:handleSizeChange="setSize"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.pageNo">
        </ayg-pagination>
    </div>
</template>
<script>
import { post, get } from "../../store/api"
import { baseUrl } from '../../config/address'
export default {
    data() {
        return {
            form: {
                platformName: '',
                name: '',
                userName: '',
                pageNo: 1,
                pageSize: 10
            },
            list: [],
            total: 0,
            platform: [],
            names: [],
            objects: [],
            baseUrl: baseUrl,
            partys: ['甲方', '乙方', '丙方']
        }
    },
    mounted() {
        this.query()
    },
    methods: {
        remoteMethod(a) {
            if(a !== '') {
                get('/api/econtract/user/clientqry', {
                    extrSystemName: a,
                    pageNo: 1,
                    pageSize: 10
                }).then(data => {
                    console.log(data)
                    this.platform = data
                })
            }
        },
        getName(a) {
            if(a !== '') {
                post('/api/econtract/template/qrylist', {
                    name: a,
                    pageNo: 1,
                    pageSize: 10
                }).then(data => {
                    console.log(data)
                    this.names = data.data
                })
            }
        },
        getObject(a) {
            post('/api/econtract/user/company/qrylist', {
                name: a,
                pageNo: 1,
                pageSize: 10
            }).then(data => {
                console.log(data)
                this.objects = data.data
            })
        },
        query(a){
            if(isNaN(a)){
                a = 1
            }
            this.form.pageNo = a
            post('/api/econtract/template/qrylist', this.form).then(data => {
                this.list = data.data
                this.total = data.total
            })
        },
        reset(name) {
            this.$refs[name].resetFields();
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        look(a, e) {
            sessionStorage.setItem('msg', JSON.stringify(a))
            var link = 'addTemplate'
            if(e) {
                link += '?type=1'
            }
            this.$router.push(link)
        },
        deleteTemplate(a) {
            this.$confirm('确定删除该模板吗？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                post('/api/econtract/template/delete', {
                    templateId: a.templateId
                }).then(data => {
                    console.log(data)
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    })
                    this.query()
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '删除已取消！'
                })
            })
        }
    }
}
</script>
<style scoped>
.main {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
}
.title {
    margin-bottom: 20px;
}
</style>
