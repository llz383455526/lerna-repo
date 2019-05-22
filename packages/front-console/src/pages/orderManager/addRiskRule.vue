<template>
    <div class="main">
        <div class="title">{{this.form.id ? '修改' : '添加'}}风控规则</div>
        <el-form class="form" :model="form" :rules="rules" size="small" ref="form" label-width="140px">
            <el-form-item label="状态：" prop="state">
                <el-radio v-model="form.state" v-for="e in status" :key="e.value" :label="e.value" @change="isSure">{{e.text}}</el-radio>
            </el-form-item>
            <el-form-item label="发放限制规则：" prop="haveRule">
                <el-table class="table" :data="form.riskRuleAddParamList" border>
                    <el-table-column label="规则类型" width="220px">
                        <template slot-scope="scope">
                            <el-checkbox v-model="scope.row.disable" @change="setHaveRule"></el-checkbox> {{scope.row.text}}
                        </template>
                    </el-table-column>
                    <el-table-column label="预警提示">
                        <template slot-scope="scope">
                            <el-input class="w100" v-model="scope.row.warnLimit" :disabled="!scope.row.disable" @change="setHaveRule"></el-input>
                            <el-checkbox v-model="scope.row.warnExpression" :disabled="!scope.row.disable">含</el-checkbox>
                            万
                        </template>
                    </el-table-column>
                    <el-table-column label="拒绝发放">
                        <template slot-scope="scope">
                            <el-input class="w100" v-model="scope.row.refuseLimit" :disabled="!scope.row.disable" @change="setHaveRule"></el-input>
                            <el-checkbox v-model="scope.row.refuseExpression" :disabled="!scope.row.disable">含</el-checkbox>
                            万
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item>
                <div class="explain">
                    说明：<br>
                    1、拒绝发放：超过限额，拒绝发放<br>
                    2、预警提示：超过限额，预警提示，可发放<br>
                    3、非必填，不填则不限制
                </div>
            </el-form-item>
            <el-form-item label=" " prop="haveTax">
                <el-button size="small" @click="show = true" v-if="!form.id">添加</el-button>
                <el-table :data="taxList" border>
                    <el-table-column label="名称" prop="name"></el-table-column>
                    <el-table-column label="关联落地公司">
                        <template slot-scope="scope">
                            <el-checkbox-group v-model="scope.row.companyList">
                                <el-checkbox v-for="(e, i) in scope.row.relevanceList" :key="i" :label="e.id" :disabled="scope.row.companyList.length == 1 && scope.row.companyList[0] == e.id">{{e.name}}</el-checkbox>
                            </el-checkbox-group>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" v-if="!form.id">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteTax(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <div class="footer">
            <el-button size="small" @click="$router.back()">取消</el-button>
            <el-button size="small" type="primary" @click="save">保存</el-button>
        </div>
        <el-dialog title="选择税优地" :visible.sync="show" width="800px">
            <el-form :model="c_form" :inline="true" size="small" ref="c_form">
                <el-form-item label="税优地名称" prop="name">
                    <el-input v-model="c_form.name"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="query">查询</el-button>
                    <el-button @click="$refs.c_form.resetFields()">清除</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="result" @selection-change="selectionChange">
                <el-table-column type="selection" :selectable="getState"></el-table-column>
                <el-table-column label="名称" prop="taxLandingName"></el-table-column>
                <el-table-column label="状态">
                    <template slot-scope="scope">
                        {{getState(scope.row) ? '未关联' : scope.row.relevanceList && scope.row.relevanceList.length ? '已关联' : '该税优地无落地公司'}}
                    </template>
                </el-table-column>
            </el-table>
            <ayg-pagination
                v-if="filterList.length"
                :total="filterList.length"
                v-on:handleSizeChange="setSize"
                :currentSize="c_form.pageSize"
                v-on:handleCurrentChange="query"
                :currentPage="c_form.page">
            </ayg-pagination>
            <div slot="footer">
                <el-button @click="show = false">取消</el-button>
                <el-button type="primary" @click="sure">选择勾选项</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from "../../store/api";
export default {
    data() {
        return {
            form: {
                id: '',
                riskRuleAddParamList: [],
                // serviceCompanyIds: [],
                state: '',
                // taxLandingIds: [],
                haveRule: '',
                haveTax: ''
            },
            rules: {
                state: [
                    { required: true, message: '请选择状态', trigger: 'change' }
                ],
                haveRule: [
                    { required: true, message: '请填写至少一条规则并正确输入的限额（大于零且最多两位小数且预警小于拒绝）', trigger: 'blur' }
                ],
                haveTax: [
                    { required: true, message: '请选择一个税优地', trigger: 'change' }
                ]
            },
            status: [],
            riskRule: [
                {
                    text: '单人单笔发放金额超过',
                    disable: false
                },
                {
                    text: '单人月累计发放金额超过',
                    disable: false
                },
                {
                    text: '单人年累计发放金额超过',
                    disable: false
                }
            ],
            taxList: [],
            show: false,
            c_form: {
                name: '',
                page: 1,
                pageSize: 10
            },
            total: 10,
            list: [],
            filterList: [],
            result: [],
            selectionList: [],
            ruleType: [],
            detail: '',
            float2: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/
        }
    },
    mounted() {
        this.form.id = this.$route.query.id
        this.form.id && get('/api/console-dlv/risk-rule/get-risk-rule-pack-detail', {
            id: this.form.id
        }).then(data => {
            this.detail = data
            this.form.state = this.detail.state
            this.ruleType.length && this.initForm()
        })
        get('/api/console-dlv/option/get-by-types?type=RiskRulePackState').then(data => {
            this.status = data.RiskRulePackState
            this.form.state = this.form.state || this.status[0].value
        })
        const RiskRuleType = [
            {
                "value": "unit_limit",
                "text": "单笔收入限额"
            },
            {
                "value": "month_limit",
                "text": "单人月收入限额"
            },
            {
                "value": "year_limit",
                "text": "单人年收入限额"
            },
            {
                "value": "day_limit",
                "text": "单人日收入限额"
            }
        ]
        this.ruleType = RiskRuleType
        this.ruleType.forEach(e => {
            this.form.riskRuleAddParamList.push({
                refuseExpression: '',
                refuseLimit: '',
                riskRuleType: e.value,
                warnExpression: '',
                warnLimit: '',
                text: e.text,
                disable: false
            })
        })
        this.detail && this.initForm()
        get('/api/console-dlv/tax-landing/all-tax-landing').then(data => {
            this.list = data
            this.query()
        })
    },
    methods: {
        isSure() {
            this.form.id && this.form.state == this.status[1].value && this.$confirm('设为无效，将自动删除关联客户，是否确认将风控规则设为无效？', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {

            }).catch(err => {
                console.log(err)
                this.form.state = this.status[0].value
            })
        },
        initForm() {
            this.form.riskRuleAddParamList.forEach(e => {
                this.detail.riskRuleDetailResultList.forEach(ev => {
                    if(e.riskRuleType == ev.riskRuleType) {
                        e.disable = true
                        e.refuseExpression = ev.refuseExpression == '>='
                        e.refuseLimit = ev.refuseLimit
                        e.riskRuleId = ev.riskRuleId
                        e.warnExpression = ev.warnExpression == '>='
                        e.warnLimit = ev.warnLimit
                    }
                })
            })
            this.setHaveRule()
            let relevanceList = [
                {
                    id: this.detail.serviceCompanyId,
                    name: this.detail.serviceCompanyName
                }
            ]
            this.taxList.push({
                name: this.detail.taxLandingName,
                id: this.detail.taxLandingId,
                relevanceList: relevanceList,
                companyList: [this.detail.serviceCompanyId]
            })
            this.form.haveTax = this.taxList.length
            this.$nextTick(() => {
                this.$refs.form.clearValidate()
            })
        },
        setHaveRule() {
            let result = []
            if(this.form.riskRuleAddParamList.filter(e => e.disable).length) {
                this.form.riskRuleAddParamList.forEach(e => {
                    if(e.disable) {
                        e.warnLimit && result.push(this.float2.test(e.warnLimit))
                        e.refuseLimit && result.push(this.float2.test(e.refuseLimit))
                        e.warnLimit && e.refuseLimit && result.push(parseFloat(e.warnLimit) < parseFloat(e.refuseLimit))
                        !e.warnLimit && !e.refuseLimit && result.push(false)
                    }
                })
                this.form.haveRule = result.indexOf(false) == -1 ? '1' : ''
            }
            else {
                this.form.haveRule = ''
            }
        },
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.c_form.page = a
            this.filterList = this.list.filter(e => e.taxLandingName.indexOf(this.c_form.name) > -1)
            let arr = this.filterList.slice((this.c_form.page- 1) * this.c_form.pageSize, this.c_form.page * this.c_form.pageSize)
            let proList = []
            arr.forEach(e => {
                proList.push(new Promise((res, rej) => {
                    get('/api/console-dlv/service-company/query-by-tax-landing-id', {
                        taxLandingId: e.id
                    }).then(data => {
                        let companyList = []
                        data.forEach(e => {
                            companyList.push(e.id)
                        })
                        e.relevanceList = data
                        e.companyList = companyList
                        res(e)
                    }).catch(err => {
                        rej(err)
                    })
                }))
            })
            Promise.all(proList).then(data => {
                this.result = data
            })
        },
        setSize(a) {
            this.c_form.pageSize = a
            this.query()
        },
        selectionChange(a) {
            this.selectionList = a
        },
        sure() {
            this.selectionList.forEach(e => {
                !this.taxList.filter(ev => ev.id == e.id).length && this.taxList.push({
                    name: e.taxLandingName,
                    id: e.id,
                    relevanceList: e.relevanceList,
                    companyList: e.companyList
                })
            })
            this.form.haveTax = this.taxList.length
            this.show = false
        },
        getState(row) {
            return !this.taxList.filter(e => e.id == row.id).length && row.relevanceList && row.relevanceList.length
        },
        deleteTax(index) {
            this.taxList.splice(index, 1)
        },
        save() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    let form = JSON.parse(JSON.stringify(this.form)), riskRuleAddParamList = [], taxLandingIds = [], serviceCompanyIds = []
                    delete form.haveRule
                    delete form.haveTax
                    form.riskRuleAddParamList.forEach(e => {
                        if(e.disable) {
                            riskRuleAddParamList.push({
                                refuseExpression: e.refuseExpression ? '>=' : '>',
                                refuseLimit: e.refuseLimit,
                                riskRuleType: e.riskRuleType,
                                warnExpression: e.warnExpression ? '>=' : '>',
                                warnLimit: e.warnLimit,
                                riskRuleId: e.riskRuleId
                            })
                        }
                    })
                    form.riskRuleAddParamList = riskRuleAddParamList
                    if(!form.id) {
                        this.taxList.forEach(e => {
                            taxLandingIds.push(e.id)
                            serviceCompanyIds = serviceCompanyIds.concat(e.companyList)
                        })
                        form.taxLandingIds = taxLandingIds
                        form.serviceCompanyIds = serviceCompanyIds
                    }
                    else {
                        form.riskRuleEditParamList = form.riskRuleAddParamList
                        delete form.riskRuleAddParamList
                        form.serviceCompanyId = this.detail.serviceCompanyId
                        form.taxLandingId = this.detail.taxLandingId
                    }
                    post(`/api/console-dlv/risk-rule/${this.form.id ? 'edit' : 'add'}-risk-rule-pack`, form).then(data => {
                        this.$message({
                            type: 'success',
                            message: `${this.form.id ? '修改' : '添加'}成功！`
                        })
                        this.$router.back()
                    })
                }
            })
        }
    }
}
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
  width: 640px;
}
.w100 {
  width: 100px;
}
.explain {
  margin-top: 20px;
  /* margin-left: 120px; */
  font-size: 14px;
  color: #999;
  line-height: 24px;
}
.footer {
  text-indent: 120px;
}
</style>
