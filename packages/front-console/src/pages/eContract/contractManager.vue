<template>
    <div class="main">
        <div class="title">电子合同管理</div>
        <el-tabs v-model="tabName" @tab-click="query">
            <el-tab-pane label="合同模板" name="contract"></el-tab-pane>
            <el-tab-pane label="合同模板组" name="contractArr"></el-tab-pane>
        </el-tabs>
        <el-form :model="form" :inline="true" ref="query">
            <el-form-item label="商户名称：" prop="platformName" size="small">
                <el-select
                    v-model="form.platformName"
                    filterable
                    remote
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loading">
                    <el-option
                        v-for="e in appList"
                        :key="e"
                        :label="e"
                        :value="e">
                    </el-option>
                </el-select>
                <!-- <el-input v-model="form.platformName" placeholder="请输入关键词"></el-input> -->
            </el-form-item>
            <el-form-item :label="tabName === 'contract' ? '合同模板ID' : '合同模板组ID'" :prop="tabName === 'contract' ? 'templateId' : 'templateGroupId'">
                <el-input v-model="form[`${tabName === 'contract' ? 'templateId' : 'templateGroupId'}`]"></el-input>
            </el-form-item>
            <el-form-item :label="tabName === 'contract' ? '合同模板名称' : '合同模板组名称'" prop="name">
                <el-input v-model="form.name" placeholder="请输入关键词" size="small"></el-input>
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
                        :key="e.userId"
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
        <!--  -->
        <contract-manager-list :list="list" :tabName="tabName" :query="query"></contract-manager-list>
        <ayg-pagination
            v-if="total"
            :total="total"
            v-on:handleSizeChange="setSize"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.pageNo">
        </ayg-pagination>
        <!--  -->
    </div>
</template>
<script>
import { importPost, post, get } from "../../store/api"
import contractManagerList from '../../pageComponent/contractManagerList'
export default {
    components: {
        contractManagerList
    },
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
            partys: ['甲方', '乙方', '丙方'],
            tabName: 'contract',
            activeData: '',
            extrSystemOptions: [],
            serviceOption: [],
            loading: false,
            appList: []
        }
    },
    activated() {
        this.activeData && (this.form = JSON.parse(this.activeData))
        this.query(sessionStorage.getItem('resetPage') ? 1 : this.form.pageNo)
        sessionStorage.removeItem('resetPage')
    },
    mounted() {
        get('/api/econtract/inner/clientqry', {}).then(result => {
	        this.extrSystemOptions = result
        })
        get('/api/sysmgr-web/commom/company', {
            companyIdentity: 'service'
        }).then(data => {
            this.serviceOption = data
        })
    },
    methods: {
        remoteMethod(platformName) {
            if(platformName) {
                this.loading = true
                get('/api/econtract/template/qey-platformName', { platformName }, true).then(data => {
                    this.loading = false
                    this.appList = data
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
            if(a !== '') {
                post('/api/econtract/user/company/qrylist', {
                    name: a,
                    pageNo: 1,
                    pageSize: 10
                }).then(data => {
                    console.log(data)
                    this.objects = data.data
                })
            }
        },
        query(a){
            if(isNaN(a)){
                a = 1
            }
            this.form.pageNo = a
            let url = this.tabName === 'contract' ? '/api/econtract/template/qrylist' : '/api/econtract/template-group/list'
            this.activeData = JSON.stringify(this.form)
            post(url, this.form).then(data => {
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
.h_btn {
    margin: 0 10px 0 0;
}
</style>
