<template>

    <div class="main-container">
        <div style="margin: 0 0 20px;">待办事项</div>

        <div class="sub-title">合同审核待办事项</div>
        <div class="table-container el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-transition">
            <el-table :data="contractTodo" style="width: 100%">
                <el-table-column prop="id" label="申请编号"></el-table-column>
                <el-table-column prop="customerName" label="企业名称"></el-table-column>
                <el-table-column prop="createdByName" label="申请人"></el-table-column>
                <el-table-column prop="updatedAt" label="申请时间"></el-table-column>
                <el-table-column label="合同类型">
                    <template slot-scope="scope">
                        {{scope.row.workflowType === 'create_sale_contract' ? '标准' : '非标'}}
                    </template>
                </el-table-column>

                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="toContract(scope.row.id)" type="text" size="medium" style="padding:0;">查看</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="sub-title">税优地开拓待办事项</div>
        <div class="table-container el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-transition">
            <el-table :data="todoList" style="width: 100%">
                <el-table-column prop="landLocation" label="税优地地点"></el-table-column>
                <el-table-column prop="landBizType" label="适合业务类型"></el-table-column>
                <el-table-column prop="stage" label="项目进展"></el-table-column>
                <el-table-column prop="status" label="项目状态"></el-table-column>
                <el-table-column prop="lastProcessBy" label="跟进人"></el-table-column>
                <el-table-column prop="expectSignDate" label="预计签约时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.expectSignDate | formatTime('yyyy-MM-dd')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="processBy" label="负责人"></el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="toDetail(scope.row.id)" type="text" size="medium" style="padding:0;">去办理</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="sub-title">待开通落地公司管理</div>
        <div class="table-container el-table el-table--fit el-table--border el-table--scrollable-x el-table--enable-row-transition">
            <el-table :data="landCompany" style="width: 100%">
                <el-table-column prop="shortName" label="落地公司简称"></el-table-column>
                <el-table-column prop="directName" label="是否直营"></el-table-column>
                <el-table-column prop="address" label="所在地区"></el-table-column>
                <el-table-column prop="testStatusName" label="业务穿行状态"></el-table-column>
                <el-table-column prop="masterName" label="负责人"></el-table-column>
                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="toManage(scope.row.id)" type="text" size="medium" style="padding:0;">管理</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <div class="statistics-container">
            <div class="table-container">
                <div style="margin-bottom: 20px; line-height: 22px;">
                    <span class="sub-title">税优地汇总</span>
                    <a href="javascript:void(0)" @click="$router.push('list')" style="float: right">更多信息</a>
                </div>
                <table class="statistics-table">
                    <tr>
                        <td>累计签约税优地</td>
                        <td>{{taxStatistics.signedTotal || 0}}</td>
                    </tr>
                    <tr>
                        <td>税优地资源引荐</td>
                        <td>{{taxStatistics.total || 0}}</td>
                    </tr>
                    <tr>
                        <td>待签约税优地</td>
                        <td>{{taxStatistics.tobeSignedTotal || 0}}</td>
                    </tr>
                    <tr>
                        <td>暂停税优地</td>
                        <td>{{taxStatistics.pauseTotal || 0}}</td>
                    </tr>
                    <tr>
                        <td>本月待签约税优地</td>
                        <td>{{taxStatistics.mouthTobeSignedTotal || 0}}</td>
                    </tr>
                </table>
            </div>
            <div class="table-container">
                <div style="margin-bottom: 20px; line-height: 22px;">
                    <span class="sub-title">落地公司汇总</span>
                    <a href="javascript:void(0)" @click="$router.push('/main/landingCompany/list')" style="float: right">更多信息</a>
                </div>
                <table class="statistics-table">
                    <tr>
                        <td>累计开通落地公司</td>
                        <td>{{landCompanyStatistics.total || 0}}</td>
                    </tr>
                    <tr>
                        <td>已开通落地公司</td>
                        <td>{{landCompanyStatistics.openedTotal || 0}}</td>
                    </tr>
                    <tr>
                        <td>待开通落地公司</td>
                        <td>{{landCompanyStatistics.tobeOpenedTotal || 0}}</td>
                    </tr>
                    <tr>
                        <td>本月开通落地公司</td>
                        <td>{{landCompanyStatistics.mouthOpenedTotal || 0}}</td>
                    </tr>
                </table>
            </div>
        </div>

    </div>

</template>

<script>
    import { get } from '../../store/api'

    export default {
        created() {
            this.getTodo()
            this.getCompanyData();
            this.getTaxStatistics()
            this.getCompanyStatistics();

            this.getContractTodo()
        },
        data() {
            return {
                todoList: [],
                taxStatistics: [],
                landCompany:[],
                landCompanyStatistics:[],
                contractTodo: []
            }
        },
        methods: {
            getTodo() {
                get('/api/salemgt/taxlanding/todo_list', {})
                    .then(result => {
                        this.todoList = result
                    })
            },
            getTaxStatistics() {
                get('/api/salemgt/taxlanding/statistics', {})
                    .then(result => {
                        this.taxStatistics = result
                    })
            },
            toDetail(id) {
                this.$router.push({
                    path: 'detail',
                    query: {
                        id: id
                    }
                })
            },
            getCompanyData(){
                get('/api/salemgt/service-company/query/todo_list').then(data => {
                    data.forEach( r => {
                        r.address = r.provinceName + r.cityName;
                    })
                    this.landCompany = data;
                })
            },
            getCompanyStatistics(){
                get('/api/salemgt/service-company/query/statistics').then(data => {
                    this.landCompanyStatistics = data;
                    console.log(data);
                })
            },
            toManage(id){
                localStorage.setItem('appId', id)
                this.$router.push({
                    path: '/main/clientManager/serverManager'
                })
            },
            getContractTodo() {
                get('/api/opencrm/mine/todo_items', {
	                workflowType: 'create_sale_contract',
                    moduleName: 'sale_contract'
                }).then(result => {
                	this.contractTodo = result
                })
            },
            toContract(id) {
            	this.$router.push({
                    path: '/main/newContract/create',
                    query: {
                    	id: id,
	                    editType: 'workflow'
                    }
                })
            }
        }
    }
</script>

<style lang="scss" scoped>

    .main-container {
        margin-top: 15px;
        background-color: #fff;
        padding: 15px;
        margin-bottom: 20px;
    }

    .statistics-container {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        margin-top: 30px;

        .table-container {
            width: 600px;

            .statistics-table {
                width: 100%;
                border-collapse:collapse;
                font-size: 12px;
                color: #999999;

                td {
                    border: solid #ebeef5 1px;
                    text-align: center;
                    padding: 15px 0;
                    min-width: 200px;
                }
            }
        }
    }

</style>




















