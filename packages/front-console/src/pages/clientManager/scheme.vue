<template>
    <div class="r_main">
        <div style="margin:30px 20px;font-size:20px">{{$route.query.id ? '修改' : '新建'}}落地公司业务方案</div>
        <div class="content">
            <el-form :model="form" :rules="rules" ref="form" size="small" label-width="200px">
                <el-form-item label="输入方案名称" prop="name">
                    <el-input v-model="form.name" class="width_500"></el-input>
                </el-form-item>
                <el-form-item label="适用行业" prop="industies">
                    <el-checkbox-group v-model="form.industies">
                        <el-checkbox v-for="e in industiesList" :key="e.code" :label="e.code">{{e.name}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="开票类目" prop="serviceTypes">
                    <el-button type="primary" @click="show = true">添加</el-button>
                    <!-- <span class="c_a94442">关联选择：OpenAdmin发票服务——开票类目管理内勾选</span> -->
                    <el-table :data="form.serviceTypes">
                        <el-table-column label="服务类型" prop="serviceName"></el-table-column>
                        <el-table-column label="服务类型内容" prop="serviceContent"></el-table-column>
                        <el-table-column label="开票类目" prop="subjectContent"></el-table-column>
                        <!-- <el-table-column label="税率" prop="taxRate">
                            <template slot-scope="scope">
                                {{scope.row.taxRate}}%
                            </template>
                        </el-table-column> -->
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" @click="deleteInvoice(scope.$index)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form-item>
                <!-- :rules="{ required: true, message: "请填写税率", trigger: "blur" }" -->
                <!-- :rules="[{ trigger: "blur", validator: checkCosts}]" -->
                <el-form-item v-for="(e, i) in costsList" :key="e.id" :prop="`costs[${i}].rate`" :rules="{trigger: 'blur', validator: checkCosts}">
                    <template slot="label">
                        销售结算成本-{{e.name}}
                    </template>
                    <el-input class="width_500" v-model="form.costs[i].rate">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
                <!-- <el-form-item label="销售结算成本-三万以下">
                    <el-input class="width_500">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item> -->
                <el-form-item label="合伙人分佣" prop="commission">
                    <el-select v-model="form.commission.name" class="width_240" @change="setId">
                        <el-option v-for="e in nameList" :key="e.id" :value="e.name">{{e.name}}</el-option>
                    </el-select>
                    <el-input class="width_240" v-model="form.commission.rate">
                        <template slot="append">%</template>
                    </el-input>
                </el-form-item>
            </el-form>
            <el-button size="small" @click="back">取消</el-button>
            <el-button size="small" type="primary" @click="save">确认</el-button>
        </div>
        <el-dialog title="添加" :visible.sync="show">
            <!-- <el-input placeholder="请输入关键字" v-model="name"></el-input>
            <el-button size="small" @click="clear">清除</el-button>
            <el-button size="small" type="primary" @click="filterInvoices">查询</el-button> -->
            <el-table :data="invoicesList">
                <el-table-column label="服务类型" prop="serviceName"></el-table-column>
                <el-table-column label="服务类型内容" prop="serviceContent"></el-table-column>
                <el-table-column label="开票类目" prop="subjectContent"></el-table-column>
                <!-- <el-table-column label="税率" prop="taxRate">
                    <template slot-scope="scope">
                        {{scope.row.taxRate}}%
                    </template>
                </el-table-column>
                <el-table-column label="类目简称" prop="abbreviation"></el-table-column> -->
                <el-table-column label="添加">
                    <template slot-scope="scope">
                        <el-button type="text" @click="addInvoice(scope.row)" v-if="isHas(scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <span slot="footer">
                <el-button size="small" @click="show = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import {
    get,
    post,
    formPost,
    postButNoErrorToast,
    postWithErrorCallback
} from "../../store/api";
import { valid } from 'semver';
export default {
    data() {
        var checkCosts = (rule, value, cb) => {
            if(value) {
                var arr = []
                value.length && (arr = value.split('.'))
                if(isNaN(value) || value < 0 || value >= 100 || (arr.length && value.indexOf('.') > -1 && arr[1].length == 0)) {
                    cb(new Error('请正确填写分佣比率！'))
                    return
                }
                if(arr[1] && arr[1].length > 2) {
                    cb(new Error('最多两位小数！'))
                    return
                }
                cb()
            }
            else {
                cb()
            }
        }
        var checkCommission = (rule, value, cb) => {
            var commission = this._data.form.commission
            if(!commission.name || !commission.rate) {
                cb(new Error('请正确填写分佣！'))
                return
            }
            var arr = []
            commission.rate.length && (arr = commission.rate.split('.'))
            if(isNaN(commission.rate) || commission.rate < 0 || commission.rate >= 100 || (arr.length && commission.rate.indexOf('.') > -1 && arr[1].length == 0)) {
                cb(new Error('请正确填写分佣比率！'))
                return
            }
            if(arr[1] && arr[1].length > 2) {
                cb(new Error('最多两位小数！'))
                return
            }
            cb()
        }
        return {
            form: {
                name: '',
                industies: [],
                categoryId: '1000',
                commission: {
                    id: '',
                    name: '',
                    rate: ''
                },
                costs: [],
                serviceTypes: [],
                serviceCompanyId: '',
                id: ''
            },
            rules: {
                name: [
                    { required: true, message: "请填写方案名称", trigger: "blur" }
                ],
                industies: [
                    { required: true, message: "请选择行业", trigger: "blur" }
                ],
                serviceTypes: [
                    { required: true, message: "请选择类目", trigger: "blur" }
                ],
                costs: [
                    { trigger: "blur", validator: checkCosts}
                ],
                commission: [
                    {required: true, trigger: "blur", validator: checkCommission}
                ]
            },
            show: false,
            industiesList: [],
            invoicesList: [],
            // name: '',
            // list: [],
            costsList: [],
            nameList: [],
            checkCosts,
        }
    },
    mounted() {
        this.form.serviceCompanyId = localStorage.getItem("appId");
        this.$route.query.id && get('/api/salemgt/goods/get', {
            id: this.$route.query.id
        }).then(data => {
            for(var k in data) {
                if(k in this.form) {
                    this.form[k] = data[k]
                }
            }
            this.industiesList && this.setIndustie()
            this.getList()
        })
        this.getIndustiesList()
        get('/api/contract-web/service-mgr/get-service-type-options').then(data => {
            this.invoicesList = data
            this.list = data
        })
        !this.$route.query.id && this.getList()
        get('/api/salemgt/common/goods/property/children?propertyId=400').then(data => {
            this.nameList = data
        })
        // BusinessType,,ValidationType,ContractTplType
    },
    methods: {
        getList() {
            get('/api/salemgt/common/goods/property/children?propertyId=300').then(data => {
                this.costsList = data
                this.costsList.forEach(e => {
                    var arr = this.form.costs.filter(ev => {
                        return ev.id == e.id
                    })
                    if(!arr.length) {
                        this.form.costs.push({
                            id: e.id,
                            name: e.name,
                            rate: ''
                        })
                    }
                })
            })
        },
        setIndustie() {
            var industies = []
            this.form.industies.forEach(e => {
                if(this.industiesList.filter(ev => ev.code == e.value).length) {
                  industies.push(e.value)
                }
            })
            this.form.industies = industies
        },
        getIndustiesList() {
            get(`/api/salemgt/taxLanding/tax/indestries?taxLandingId=${sessionStorage.getItem('taxLandingId')}`).then(data => {
                this.industiesList = data.items
            })
            // get('/api/salemgt/common/goods/property?propertyId=100').then(data => {
            //     this.industiesList = data
            // })
        },
        // clear() {
        //     this.name = ''
        // },
        // filterInvoices() {
        //     this.list = this.invoicesList.filter(e => {
        //         return e.name.indexOf(this.name) > -1
        //     })
        // },
        addInvoice(a) {
            this.form.serviceTypes.push(a)
        },
        deleteInvoice(a) {
            this.form.serviceTypes.splice(a, 1)
        },
        isHas(a) {
            var arr = this.form.serviceTypes.filter(e => {
                return e.serviceId == a.serviceId
            })
            return !arr.length
        },
        setId() {
            this.nameList.forEach(e => {
                if(e.name == this.form.commission.name) {
                    this.form.commission.id = e.id
                }
            })
        },
        back() {
            this.$router.back()
        },
        save() {
            this.$refs.form.validate(valid => {
                if(valid) {
                    var form = JSON.parse(JSON.stringify(this.form)), serviceTypes = [], costs = []
                    form.serviceTypes && form.serviceTypes.forEach(e => {
                        serviceTypes.push(e.serviceId)
                    })
                    form.serviceTypes = serviceTypes
                    form.costs && form.costs.forEach(e => {
                        if(e.rate) {
                            costs.push(e)
                        }
                    })
                    form.costs = costs
                    post(`/api/salemgt/goods/${this.$route.query.id ? 'edit' : 'create'}`, form).then(data => {
                        this.$message({
                            type: 'success',
                            message: `${this.$route.query.id ? '修改' : '添加'}成功`
                        })
                        this.back()
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
.r_main {
    padding: 30px 10px;
    background-color: #fff;
}
.content {
    margin-left: 30px;
}
.width_500 {
    width: 500px;
}
/* .c_a94442 {
    color: #a94442;
} */
.width_240 {
    width: 240px;
    margin-right: 10px;
}
</style>
