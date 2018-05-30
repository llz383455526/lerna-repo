<template>

    <div class="main-container">
        <div style="margin: 0 0 20px;">电子签约记录</div>

        <el-tabs v-model="activeTab" @tab-click="handleTabClick">
            <el-tab-pane label="全部" name="first"></el-tab-pane>
            <el-tab-pane label="签约完成" name="second"></el-tab-pane>
            <el-tab-pane label="未完成签约" name="third"></el-tab-pane>
        </el-tabs>

        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="接入应用"   size="small" prop="extrSystemIds">
                <el-select multiple v-model="formSearch.extrSystemIds">
                    <el-option v-for="item in extrSystemOptions" :label="item.extrSystemName" :value="item.extrSystemId" :key="item.extrSystemId"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="签约订单号" size="small" prop="orderId">
                <el-input v-model="formSearch.orderId"></el-input>
            </el-form-item>

            <el-form-item label="姓名" size="small" prop="personalName">
                <el-input v-model="formSearch.personalName"></el-input>
            </el-form-item>

            <el-form-item label="证件号" size="small" prop="personalIdentity">
                <el-input v-model="formSearch.personalIdentity"></el-input>
            </el-form-item>

            <el-form-item label="手机号" size="small" prop="personalMobile">
                <el-input v-model="formSearch.personalMobile"></el-input>
            </el-form-item>

            <el-form-item label="签约服务商" size="small" prop="serverName">
                <el-input v-model="formSearch.serverName"></el-input>
            </el-form-item>

            <el-form-item label="发起签约时间范围" size="small">
                <el-date-picker
                        v-model="dateValue"
                        type="daterange"
                        :unlink-panels="true"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>

            <el-form-item label="签约状态:" size="small" prop="signState">
                <el-select v-model="formSearch.signState">
                    <el-option v-for="item in sighStateList" :label="item.value" :value="item.key" :key="item.key"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="订单状态:" size="small" v-if="activeTab === 'first'">
                <el-select v-model="formSearch.orderState">
                    <el-option v-for="item in orderStateList" :label="item.value" :value="item.key" :key="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
            </el-form-item>
        </el-form>

        <div class="table-container">
            <el-table :data="tableList.data">
                <el-table-column prop="extrSystemName" label="应用名称"></el-table-column>
                <el-table-column prop="orderId" label="签约订单号"></el-table-column>
                <el-table-column prop="createTime" label="发起时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTime | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="personalName" label="姓名"></el-table-column>
                <el-table-column prop="personalIdentity" label="证件号"></el-table-column>
                <el-table-column prop="personalMobile" label="手机号"></el-table-column>
                <el-table-column prop="serverName" label="签约服务商"></el-table-column>
                <el-table-column prop="signStateDesc" label="签约状态"></el-table-column>
                <el-table-column prop="certStateDesc" label="身份证认证状态"></el-table-column>
                <el-table-column prop="orderStateDesc" label="订单状态"></el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <a v-if="scope.row.downloadUrl" target="_blank" :href="scope.row.downloadUrl" class="operation">合同下载</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <ayg-pagination v-if="tableList.total" :total="tableList.total"
                        v-on:handleSizeChange="handleSizeChange" :currentSize="pageSize"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="pageIndex"></ayg-pagination>

    </div>

</template>

<script>
	import { post, get } from "../../store/api"

	import _ from 'lodash'

	import { showNotify } from '../../plugin/utils-notify'

	export default {
		created() {
			this.getOrderStateList()
			this.getSignStateList()
			this.getClient()

			this.getList()
		},
		data() {
			return {
				formSearch: {
					extrSystemIds: [],
					orderId: '',
					personalName: '',
					personalIdentity: '',
					personalMobile: '',
					serverName: '',
					signState: '',
					orderState: ''
				},
				orderStateList: [],
				sighStateList: [],
				extrSystemOptions: [],
				dateValue: '',
				tableList: [],
				pageSize: 10,
				pageIndex: 1,
				activeTab: 'first'
			}
		},
		methods: {
			getOrderStateList() {
				get('/api/econtract/order/statelist', {})
					.then(result => {
						this.orderStateList = result
					})
			},
			getSignStateList() {
				get('/api/econtract/inner/nonsafety/signstatelist', {})
					.then(result => {
						this.sighStateList = result
					})
			},
			getClient() {
				get('/api/econtract/inner/clientqry', {})
					.then(result => {
						this.extrSystemOptions = result
					})
			},
			resetForm(formName) {
				this.$refs[formName].resetFields()
				this.dateValue = ''
				if(this.activeTab === 'first') this.formSearch.orderState = ''
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

				let formSearch = _.cloneDeep(this.formSearch)
				formSearch.startTime = startAt
				formSearch.endTime = endAt
				let options = _.assign(formSearch, {
					pageNo: this.pageIndex,
					pageSize: this.pageSize
				})

				post('/api/econtract/inner/qry', options)
					.then(result => {
						this.tableList = result
					})
			},
			handleTabClick(tab, event) {
				let _tab = tab.name
				this.formSearch.orderState = ''
				this.formSearch.unfinished = ''

				switch (_tab) {
					case 'second':
						let state = _.find(this.orderStateList, item => item.value === '已完成')
						this.formSearch.orderState = state.key
						break
					case 'third':
						this.formSearch.unfinished = '1'
						break
					default:


				}

				this.getList()
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
















