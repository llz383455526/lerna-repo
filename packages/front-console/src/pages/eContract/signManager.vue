<template>
    <div class="main">
        <div class="title">签约管理</div>
        <el-tabs v-model="tabName" @tab-click="query">
            <el-tab-pane label="合同模板" name="contract"></el-tab-pane>
            <el-tab-pane label="合同模板组" name="contractArr"></el-tab-pane>
        </el-tabs>
        <el-form :model="form" :inline="true" ref="form">
            <el-form-item :label="tabName === 'contract' ? '合同模板' : '合同模板组'" prop="name">
                <el-select
                    class="form_input_short"
                    v-if="tabName === 'contract'"
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
                 <el-input v-else v-model="form.name" size="small"></el-input>
            </el-form-item>
            <el-form-item :label="tabName === 'contract' ? '签约对象' : '服务商公司'" prop="userName">
                <el-select
                    class="form_input_short"
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
                <!-- <el-input v-model="form.name" size="small"></el-input> -->
            </el-form-item>
            <el-form-item label="对接方式" prop="accessType">
                <el-select v-model="form.accessType" size="small" class="form_input_short">
                    <el-option v-for="e in type" :key="e" :label="e.text" :value="e.value"></el-option>
                </el-select>
                <!-- <el-input v-model="form.accessType" size="small"></el-input> -->
            </el-form-item>
            <!--<el-form-item label="发起时间">
                <el-date-picker
                    v-model="range"
                    type="daterange"
                    range-separator="至"
                    placeholder="选择日期"
                    value-format="yyyy-MM-dd"
                    size="small"
                    @change="getTime">
                </el-date-picker>
            </el-form-item>-->
            <el-form-item>
                <el-button type="primary" size="small" @click="query">查询</el-button>
                <el-button type="text" size="small" @click="reset('form')">清空所有条件</el-button>
            </el-form-item>
        </el-form>
        <el-table :data="list">
            <el-table-column :label="tabName == 'contract' ? '合同模板名称' : '合同模板组名称'" :prop="tabName === 'contract' ? 'name' : 'groupName'"></el-table-column>
            <!--<el-table-column label="签约对象">
                <template slot-scope="scope">
                    <div v-for="(e, i) in scope.row.partys">
                        {{partys[i]}}：{{e.userName ? e.userName : '个人'}}
                    </div>
                </template>
            </el-table-column>-->
            <el-table-column label="服务商公司">
                <template slot-scope="scope">
                    <div v-if="scope.row.templateId">
                        <div v-for="(e, i) in scope.row.partys" v-if="e.userName">
                            {{e.userName}}
                        </div>
                    </div>
                    <div v-else>
                        <div v-for="item in scope.row.serviceCompanyNames">
                            {{item}}
                        </div>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label="对接方式" prop="accessTypeDesc"></el-table-column>
            <el-table-column label="发起时间" prop="lastLaunchTimeDesc"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text" size="small" @click="launch(scope.row)" v-if="scope.row.enable == '1' && scope.row.accessType == 1">发起签约</el-button>
                    <el-button type="text" size="small" @click="record(scope.row)">查看签约记录</el-button>
                    <el-button type="text" size="small" @click="batch(scope.row)" v-if="scope.row.isManualSign == '1'">查看批次记录</el-button>
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
import { post, get } from '../../store/api';
export default {
    data() {
        return {
            form: {
                name: '',
                userName: '',
                accessType: '',
                startTime: '',
                endTime: '',
                pageNo: 1,
                pageSize: 10
            },
            names: [],
            objects: [],
            type: [
                {
                    text: '全部',
                    value: ''
                },
                {
                    text: 'SaaS对接',
                    value: '1'
                },
                {
                    text: 'API对接',
                    value: '2'
                }
            ],
            list: [],
            total: 0,
            range: [],
            partys: ['甲方', '乙方', '丙方'],
            tabName: 'contract',
            activeData: ''
        }
    },
    activated() {
        if(JSON.stringify(this.$route.query) == '{}') {
            this.activeData && (this.form = JSON.parse(this.activeData))
        }
        else {
            Object.assign(this.form, this.$route.query)
        }
        this.query(this.form.pageNo)
    },
    methods: {
        getName(a) {
            if(a !== '') {
                post('/api/econtract/template/qrylist', {
                    name: a,
                    pageNo: 1,
                    pageSize: 10
                }).then(data => {
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
                this.objects = data.data
            })
        },
        query(a) {
            if(isNaN(a)){
                a = 1
            }
            this.form.pageNo = a
            let url = this.tabName === 'contract' ? '/api/econtract/template/signqry' : '/api/econtract/template-group/signqry'
            this.activeData = JSON.stringify(this.form)
            post(url, this.form).then(data => {
                this.list = data.data
                this.total = data.total
            })
        },
        getTime() {
            if(this.range && this.range.length) {
                this.form.startTime = this.range[0]
                this.form.endTime = this.range[1]
            }
            else {
                this.form.startTime = ''
                this.form.endTime = ''
            }
        },
        reset(a) {
            this.range = []
            this.form.startTime = ''
            this.form.endTime = ''
            this.$refs[a].resetFields()
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        launch(a) {
        	if(a.templateId) {
		        sessionStorage.setItem('sign', JSON.stringify(a))
		        this.$router.push('uploadObject')
            }else {
                this.$router.push({
                    path: `start/${a.groupId}`,
                    query: {
	                    group: true,
                        templateName: a.groupName
                    }
                })
            }

        },
        record(a) {
            sessionStorage.setItem('query', JSON.stringify({
                orderId: a.orderId
            }))
            this.$router.push(`index?templateName=${a.name || a.groupName}&isGroup=${a.groupName ? '1' :'0'}`)
        },
        batch(a) {
            this.$router.push(`batchRecord?templateName=${a.name}`)
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
.form_input_short {
    width: 200px;
}
</style>
