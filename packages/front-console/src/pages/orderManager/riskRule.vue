<template>
    <div class="main">
        <div class="title">风控规则列表</div>
        <el-form class="form" :model="form" :inline="true" size="small" ref="form">
            <el-form-item label="税优地名称" prop="taxLandingId">
                <el-select v-model="form.taxLandingId" filterable>
                    <el-option v-for="e in taxList" :key="e.id" :value="e.id" :label="e.taxLandingName"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联落地公司" prop="serviceCompanyId">
                <el-select v-model="form.serviceCompanyId" filterable>
                    <el-option v-for="e in companyList" :key="e.id" :value="e.id" :label="e.name"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="是否为默认规则" prop="isDefault">
                <el-select v-model="form.isDefault">
                    <el-option value='' label="全部"></el-option>
                    <el-option v-for="e in defaultStatus" :key="e.value" :value="e.value" :label="e.text"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" prop="state">
                <el-select v-model="form.state">
                    <el-option value='' label="全部"></el-option>
                    <el-option v-for="e in status" :key="e.value" :value="e.value" :label="e.text"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="$refs.form.resetFields()">清除</el-button>
            </el-form-item>
        </el-form>
        <router-link to="addRiskRule">
            <el-button size="small">添加规则</el-button>
        </router-link>
        <el-button size="small" @click="show = true">关联客户</el-button>
        <router-link to="clientRiskRule">
            <el-button size="small">查看所有客户的风控规则</el-button>
        </router-link>
        <el-table class="table" :data="data.list" border>
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="税优地名称" prop="taxLandingName"></el-table-column>
            <el-table-column label="关联落地公司" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="发放限制规则" width="240px">
                <template slot-scope="scope">
                    <div v-for="(e, i) in scope.row.riskRuleStr" :key="i">{{e}}</div>
                </template>
            </el-table-column>
            <el-table-column label="是否为默认规则">
                <template slot-scope="scope">
                    {{scope.row.isDefault == 0 ? '否' : '是'}}
                </template>
            </el-table-column>
            <el-table-column label="状态">
                <template slot-scope="scope">
                    {{scope.row.state == 10 ? '有效' : '无效'}}
                </template>
            </el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <router-link :to="`addRiskRule?id=${scope.row.id}`">
                        <el-button type="text">编辑</el-button>
                    </router-link>
                    <el-button type="text" @click="setDefault(scope.row)">{{scope.row.isDefault == 0 ? '设为' : '取消'}}默认</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="data.total"
            :total="data.total || 0"
            v-on:handleSizeChange="setSize"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
        <el-dialog title="关联客户" :visible.sync="show" width="800px" @close="clearContact">
            <el-form :model="contact_form" :rules="contact_rules" ref="contact_form" label-width="120px">
                <el-form-item label="客户名称">
                    <el-select v-model="contact_form.customerCompanyId" @change="getRule" filterable>
                        <el-option v-for="e in customList" :key="e.id" :value="e.id" :label="e.name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择落地公司" prop="allChecked">
                    <div>
                        <div v-for="(e, i) in ruleCompanyList" :key="e.serviceCompanyId">
                            <el-checkbox v-model="e.checked" @change="chooseCompany(i)">{{e.serviceCompanyName}}</el-checkbox> <el-button type="text" v-if="e.checked" @click="e.close =! e.close">{{e.close ? '选好了' : '修改'}}</el-button>
                            <el-table :data="e.detailResultList" border v-if="e.checked && e.close">
                                <el-table-column label="选择风控规则" align="center">
                                    <template slot-scope="scope">
                                        <el-radio v-model="ruleCompanyList[i].ruleId" :label="scope.row.riskPackId" @change="getCheckedList">{{ '' }}</el-radio>
                                    </template>
                                </el-table-column>
                                <el-table-column label="落地公司">
                                    <template slot-scope="scope">
                                        {{e.serviceCompanyName}}
                                    </template>
                                </el-table-column>
                                <el-table-column label="发放限制规则" width="240px">
                                    <template slot-scope="scope">
                                        <div v-for="(ev, j) in scope.row.riskRuleStr" :key="j">{{ev}}</div>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="已选中的规则风控规则" prop="haveRule">
                    <el-table :data="checkedList" border>
                        <el-table-column label="税优地" prop="taxLandingName"></el-table-column>
                        <el-table-column label="落地公司" prop="serviceCompanyName"></el-table-column>
                        <el-table-column label="发放限制规则" width="240px">
                            <template slot-scope="scope">
                                <div v-for="(ev, j) in scope.row.riskRuleStr" :key="j">{{ev}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="removeChecked(scope.row)">移除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button @click="runTime > 0 ? clue() : show = false">取消</el-button>
                <el-button type="primary" @click="saveRule">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from "../../store/api";
export default {
    data() {
        return {
            form: {
                isDefault: '',
                page: 1,
                pageSize: 10,
                serviceCompanyId: '',
                state: '',
                taxLandingId: ''
            },
            taxList: [],
            companyList: [],
            defaultStatus: [],
            status: [],
            data: {},
            show: false,
            customList: [],
            contact_form: {
                customerCompanyId: '',
                allChecked: '',
                haveRule: ''
            },
            contact_rules: {
                allChecked: [
                    { required: true, message: '勾选落地公司后，必须勾选一个风控规则', trigger: 'change' }
                ],
                haveRule: [
                    { required: true, message: '至少有一个风控规则', trigger: 'change' }
                ]
            },
            ruleCompanyList: [],
            checkedList: [],
            runTime: 0
        };
    },
    mounted() {
        get('/api/console-dlv/tax-landing/all-tax-landing').then(data => {
            this.taxList = data;
        });
        get('/api/sysmgr-web/commom/company?companyIdentity=service').then(data => {
            this.companyList = data
        })
        get('/api/console-dlv/option/get-by-types?type=RiskRulePackDefault').then(data => {
            this.defaultStatus = data.RiskRulePackDefault
        })
        get('/api/console-dlv/option/get-by-types?type=RiskRulePackState').then(data => {
            this.status = data.RiskRulePackState
            this.form.state = this.status[0].value
            this.query()
        })
        get('/api/sysmgr-web/commom/company?companyIdentity=custom').then(data => {
            this.customList = data
        })
    },
    methods: {
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            post('/api/console-dlv/risk-rule/risk-rule-list', this.form).then(data => {
                this.data = data
            })
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        setDefault(row) {
            if(row.isDefault == '0') {
                post('/api/console-dlv/risk-rule/get-service-default-risk-rule', {
                    serviceCompanyId: row.serviceCompanyId,
                    taxLandingId: row.taxLandingId
                }).then(data => {
                    if(data) {
                        this.myConfirm(row)
                    }
                    else {
                        this.setDefaultAction(row)
                    }
                })
            }
            else {
                this.myConfirm(row)
            }
        },
        myConfirm(row) {
            this.$confirm(`${row.isDefault == '0' ? '该落地公司已设置默认风控规则，是否确认替换，并将当前规则设为默认？' : '是否取消默认？'}`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.setDefaultAction(row)
            }).catch(err => {})
        },
        setDefaultAction(row) {
            get(`/api/console-dlv/risk-rule/${row.isDefault == '0' ? 'set' : 'cancel'}-service-default-risk-rule`, {
                id: row.id
            }).then(data => {
                this.$message({
                    type: 'success',
                    message: `${row.isDefault == '0' ? '设置' : '取消'}默认成功！`
                })
                this.query()
            })
        },
        chooseCompany(i) {
            if(this.ruleCompanyList[i].checked) {
                this.ruleCompanyList[i].close = true
            }
            else {
                this.ruleCompanyList[i].ruleId = ''
            }
            this.getCheckedList()
        },
        getRule() {
            get('/api/console-dlv/risk-rule/query-service-risk-rule', {
                customerCompanyId: this.contact_form.customerCompanyId
            }).then(data => {
                data.forEach(e => {
                    e.rule = ''
                    e.close = true
                    e.detailResultList.forEach(ev => {
                        if(ev.pitch) {
                            e.checked = true
                            e.ruleId = ev.riskPackId
                        }
                    })
                })
                this.ruleCompanyList = data
                this.getCheckedList()
                this.runTime = 0
            })
        },
        getCheckedList() {
            this.runTime++
            this.checkedList = []
            this.contact_form.allChecked = 1
            this.ruleCompanyList.forEach(e => {
                if(e.checked && e.ruleId) {
                    e.detailResultList.forEach(ev => {
                        if(e.ruleId == ev.riskPackId) {
                            this.checkedList.push({
                                taxLandingName: e.taxLandingName,
                                serviceCompanyName: e.serviceCompanyName,
                                riskPackId: ev.riskPackId,
                                riskRuleStr: ev.riskRuleStr
                            })
                        }
                    })
                }
                else if(e.checked && !e.ruleId) {
                    this.contact_form.allChecked = ''
                }
            })
            this.contact_form.haveRule = this.checkedList.length ? 1 : ''
            this.$refs.contact_form.clearValidate()
        },
        removeChecked(row) {
            this.ruleCompanyList.forEach(e => {
                if(e.serviceCompanyName == row.serviceCompanyName) {
                    e.checked = ''
                    e.ruleId = ''
                }
            })
            this.getCheckedList()
        },
        saveRule() {
            this.$confirm('保存后，选中的风控规则即生效，是否确认保存？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.$refs.contact_form.validate(valid => {
                    if(valid) {
                        let form = {}, riskRulePickId = []
                        form.customerCompanyId = this.contact_form.customerCompanyId
                        this.checkedList.forEach(e => {
                            riskRulePickId.push(e.riskPackId)
                        })
                        form.riskRulePickId = riskRulePickId
                        post('/api/console-dlv/risk-rule/save-customer-risk-rule', form).then(data => {
                            this.$message({
                                type: 'success',
                                message: '添加成功！'
                            })
                            this.show = false
                            this.query()
                        })
                    }
                })
            }).catch(err => {})
        },
        clue() {
            this.$confirm('取消后不会自动保存数据，是否确认取消？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.show = false
            }).catch(err => {})
        },
        clearContact() {
            this.contact_form = {
                customerCompanyId: '',
                allChecked: '',
                haveRule: ''
            }
            this.ruleCompanyList = []
            this.checkedList = []
        }
    }
};
</script>
<style scoped>
.main {
    padding: 15px;
    margin-top: 15px;
    background-color: #fff;
}
.title {
    margin-left: 0px;
}
.form {
    margin-top: 30px;
}
.table {
    margin-top: 20px;
}
.ml120 {
    margin-left: 120px;
}
</style>
