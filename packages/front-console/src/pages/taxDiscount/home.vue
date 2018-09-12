<template>

    <div class="main-container">
        <div style="margin: 0 0 20px;">待办事项</div>

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
        </div>

    </div>

</template>

<script>
    import { get } from '../../store/api'

	export default {
    	created() {
            this.getTodo()

            this.getTaxStatistics()
        },
        data() {
    		return {
    			todoList: [],
                taxStatistics: [],

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




















