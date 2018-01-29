<template>

    <div class="body-max-width body-margin">

        <div class="companyName">待办列表</div>

        <list v-if="userTaskList">
            <!--<button slot="functionality" class="btn-table" @click="changeTest">调试</button>
            <el-table
                    slot="table"
                    :data="[]"
                    stripe
                    style="width: 100%">
                <el-table-column
                        v-for="item in testValue"
                        :key="item.title"
                        :label="item.title"
                        width="200">
                    <template slot-scope="scope">
                        <span>{{item.value}}</span>
                    </template>
                </el-table-column>
            </el-table>-->
            <el-table
                    slot="table"
                    :data="userTaskList.list"
                    stripe
                    style="width: 100%">
                <el-table-column
                        label="模块名称"
                        width="150">
                    <template slot-scope="scope">
                        <span>{{scope.row.moduleName}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="企业名称"
                        width="250">
                    <template slot-scope="scope">
                        <span>{{scope.row.companyName}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="标题"
                        width="500">
                    <template slot-scope="scope">
                        <span>{{scope.row.title}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="提交人"
                        width="80">
                    <template slot-scope="scope">
                        <span>{{scope.row.submitByName}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="传递时间"
                        width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | formatTime('yyyy-MM-dd')}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="状态"
                        width="120">
                    <template slot-scope="scope">
                        <span>{{scope.row.stateName}}</span>
                    </template>
                </el-table-column>

                <el-table-column
                        label="操作"
                        width="">
                    <template slot-scope="scope">
                        <a href="javascript:void(0)" @click="toDetail(scope.row)">查看</a>
                    </template>
                </el-table-column>

            </el-table>

            <el-pagination
                    slot="pagination"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page.sync="pageIndex"
                    :page-size="pageSize"
                    :page-sizes="[10, 20, 50, 100]"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="userTaskList.total">
            </el-pagination>
        </list>

    </div>

</template>

<script>
    import { mapGetters } from 'vuex'

    import list from '../../pageComponent/list'

    import _ from 'lodash'

	export default {
        created() {
            this.getUserTask()
        },
        components: {
            list
        },
        data() {
        	return {
                pageIndex: 1,
                pageSize: 10,
                testValue: [{
                	title: 'a',
                    value: 1
                },{
	                title: 'b',
	                value: 2
                },{
	                title: 'c',
	                value: 3
                },{
	                title: 'd',
	                value: 4
                }]
            }
        },
        computed: {
            ...mapGetters({
	            userTaskList: 'userTaskList'
            })
        },
        methods: {
	        getUserTask(type) {
	        	if(type) this.pageIndex = 1

	        	let options = {
			        page: this.pageIndex,
                    pageSize: this.pageSize
                }

                this.$store.dispatch('getUserTask', options)
            },
	        handleSizeChange(val) {
		        this.pageSize = val
		        this.getUserTask()
	        },
	        handleCurrentChange(val) {
		        this.pageIndex = val
		        this.getUserTask()
	        },
            toDetail(item) {
	        	//console.log(item)
	        	let url

	        	switch (item.moduleId) {
                    case 'create-fund-flow':
                    	url = item.stateName === '编辑中' ? '/main/capitalmanagement/basic' : '/main/capitalmanagement/review'
                    	break
			        case 'asset-allocation-flow':
				        url = '/main/capitalmanagement/review'
				        break
			        case 'agreement-signing-flow':
				        url = '/main/contract/detail'
				        break
			        case 'risk-control-admittance-flow':
				        url = '/main/project/detail'
				        break
			        case 'trade-and-financing-flow':
				        url = '/main/trade/financingAppInfo'
				        break
                }

                this.$router.push({
                    path: url,
                    query: {
                    	id: item.businessKey,
                        companyId: item.companyId
                    }
                })
            },
	        changeTest() {
	        	this.testValue.push({
			        title: 'e',
			        value: 5
		        })
            }
        }
    }
</script>

<style lang="scss" scoped>

</style>




















