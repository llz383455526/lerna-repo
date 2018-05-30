<template>

    <div class="main-container">
        <el-form :inline="true" :model="formSearch" ref="formSearch">
            <el-form-item label="消息标题" size="small" prop="title">
                <el-input v-model="formSearch.title"></el-input>
            </el-form-item>

            <el-form-item label="展示平台" size="small" prop="appLocation">
                <el-select v-model="formSearch.appLocation" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in searchOptions.AdAppLocationType" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="显示时间范围" size="small">
                <el-date-picker
                        v-model="dateValue"
                        type="datetimerange"
                        :unlink-panels="true"
                        start-placeholder="开始时间"
                        end-placeholder="结束时间"
                        value-format="yyyy-MM-dd hh:mm:dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="是否显示" size="small" prop="display">
                <el-select v-model="formSearch.display" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in searchOptions.DisplayType" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="展示位置" size="small" prop="appPageLocation">
                <el-select v-model="formSearch.appPageLocation" placeholder="请选择" style="width:100%;">
                    <el-option label="全部" value=""></el-option>
                    <el-option v-for="item in AdAppPageLocationTypeOptions" :key="item.value" :label="item.text"
                               :value="item.value"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>

        <el-button size="small" @click="$router.push('messageCreate')">新增</el-button>

        <div class="table-container">
            <el-table :data="tableList.list">
                <el-table-column prop="id" label="广告ID"></el-table-column>
                <el-table-column prop="title" label="消息标题"></el-table-column>
                <el-table-column prop="content" label="消息内容"></el-table-column>
                <el-table-column prop="displayName" label="是否显示"></el-table-column>
                <el-table-column prop="appLocationName" label="展示平台"></el-table-column>
                <el-table-column prop="appPageLocationName" label="展示位置"></el-table-column>
                <el-table-column prop="id" label="显示时间范围">
                    <template slot-scope="scope">
                        <span>{{scope.row.startTime}} 至 {{scope.row.endTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="id" label="创建时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="createByName" label="创建人"></el-table-column>

                <el-table-column label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button @click="toDetail(scope.row.id)" type="text" size="medium" style="padding:0;">编辑</el-button>
                        <el-button @click="selectedId = scope.row.id; dialogVisible = true" type="text" size="medium" style="padding:0;">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-dialog :visible.sync="dialogVisible" width="30%">
            <span>确认删除该消息吗？</span>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="deleteMessage">确 定</el-button>
            </div>
        </el-dialog>
    </div>

</template>

<script>
	import { post, get } from "../../store/api"

	import _ from 'lodash'

	import { showNotify } from '../../plugin/utils-notify'

	export default {
		created() {
			this.getSearchOptions()

			this.getList()
        },
        data() {
			return {
				searchOptions: {},
				formSearch: {
					title: '',
					appLocation: '',
					startAt: '',
					endAt: '',
					display: '',
					appPageLocation: ''
				},
				dateValue: '',
				tableList: [],
				pageSize: 10,
				pageIndex: 1,
				dialogVisible: false,
				selectedId: ''
            }
        },
		computed: {
			AdAppPageLocationTypeOptions() {
				let arr = []
				_.forEach(this.searchOptions.AdAppPageLocationType, item => {
					if(item.flag === this.formSearch.appLocation) arr.push(item)
				})

				return arr
			}
		},
        methods: {
	        getSearchOptions() {
		        post('/api/sysmgr-web/commom/options?enumTypes=AdAppLocationType,AdAppPageLocationType,DisplayType', {})
			        .then(result => {
				        this.searchOptions = result
			        })
	        },
	        resetForm(formName) {
		        this.$refs[formName].resetFields()
		        this.dateValue = ''
	        },
	        search() {
		        this.pageIndex = 1
		        this.getList()
	        },
	        handleSizeChange(value) {
		        this.pageSize = value
		        this.pageIndex = 1
		        this.getList()
	        },
	        handleCurrentChange(value) {
		        this.pageIndex = value
		        this.getList()
	        },
	        getList() {
		        let startAt = ''
		        let endAt = ''
		        if (this.dateValue) {
			        startAt = this.dateValue[0]
			        endAt = this.dateValue[1]
		        }
		        this.formSearch.startAt = startAt
		        this.formSearch.endAt = endAt

		        let formSearch = _.cloneDeep(this.formSearch)
		        let options = _.assign(formSearch, {
			        page: this.pageIndex,
			        pageSize: this.pageSize
		        })

		        post('/api/sysmgr-web/notice/list', options)
			        .then(result => {
				        this.tableList = result

				        /*this.$router.replace({
					        path: 'messageList',
					        query: {
						        page: this.pageIndex,
						        pageSize: this.pageSize,
						        param: JSON.stringify(this.formSearch)
					        }
				        })*/
			        })
	        },
	        toDetail(id) {
		        this.$router.push({
			        path: 'messageCreate',
			        query: {
				        id: id
			        }
		        })
	        },
	        deleteMessage() {
                post('/api/sysmgr-web/notice/del', {
	                id: this.selectedId
                }).then(result => {
	                this.dialogVisible = false
	                showNotify('success', '删除成功')
	                this.getList()
                })
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main-container {
        background-color:#fff;
        padding:15px;
    }

    .table-container {
        width: 100%;
        margin-top: 20px;
    }
</style>

<style lang="scss">
    .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
        margin-left: 0;
    }
</style>














