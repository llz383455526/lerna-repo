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
                <el-select multiple v-model="formSearch.extrSystemIds" filterable>
                    <el-option v-for="item in extrSystemOptions" :label="item.extrSystemName" :value="item.extrSystemId" :key="item.extrSystemId"></el-option>
                </el-select>
            </el-form-item>

			<el-form-item label="订单批次号" size="small" prop="batchId">
                <el-input v-model="formSearch.batchId"></el-input>
            </el-form-item>

			<el-form-item label="合同模板名称" size="small" prop="templateName">
                <el-input v-model="formSearch.templateName"></el-input>
            </el-form-item>

			<el-form-item label="签约服务商" size="small" prop="serverName">
                <el-input v-model="formSearch.serverName"></el-input>
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

			<el-form-item label="身份证认证状态" prop="certState">
				<el-select v-model="formSearch.certState" size="small">
					<el-option v-for="e in certStates" :label="e.text" :value="e.value"></el-option>
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
                <el-button size="small" @click="download" class="btn">导出xls</el-button>
            </el-form-item>
        </el-form>

        <div class="table-container">
            <el-table :data="tableList.data">
				<el-table-column prop="createTimeDesc" label="签约时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTimeDesc | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
				<el-table-column prop="orderId" label="签约订单号"></el-table-column>
                <el-table-column prop="extrSystemName" label="应用名称"></el-table-column>
				<el-table-column prop="templateName" label="合同模板名称"></el-table-column>
				<el-table-column prop="serverName" label="签约服务商"></el-table-column>
                <el-table-column prop="personalName" label="姓名"></el-table-column>
                <el-table-column prop="personalIdentity" label="证件号"></el-table-column>
                <!-- <el-table-column prop="personalMobile" label="手机号"></el-table-column> -->
                <el-table-column prop="signStateDesc" label="签约状态"></el-table-column>
                <el-table-column prop="certStateDesc" label="身份证认证状态"></el-table-column>
                <el-table-column prop="orderStateDesc" label="订单状态">
					<!-- <template slot-scope="scope">
						<template v-if="wait.indexOf(scope.row.orderState) > -1">待签约</template>
						<template v-else-if="fail.indexOf(scope.row.orderState) > -1">签约失败</template>
						<template v-else>{{scope.row.orderStateDesc}}</template>
					</template> -->
				</el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
						<el-button v-if="scope.row.orderState == 'SIGNING'" type="text" size="small" @click="cancleOrder(scope.row)">取消签约</el-button>
						<el-button v-if="isRe.indexOf(scope.row.orderState) > -1" type="text" size="small" @click="reCall(scope.row)">
							{{scope.row.orderState == 'REJECTED' ? '重发通知': scope.row.orderState == 'SIGNING' ? '重发通知' : '重试'}}
						</el-button>
                        <a v-if="scope.row.downloadUrl" target="_blank" :href="`${baseUrl}/api/econtract/contract/download?orderId=${scope.row.orderId}`">
							<el-button type="text" size="small">合同下载</el-button>
						</a>
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
	import { baseUrl } from "../../config/address.js"
	export default {
		created() {
			this.getOrderStateList()
			this.getSignStateList()
			this.getClient()
		},
		data() {
			return {
				formSearch: {
					extrSystemIds: [],
					orderId: '',
					batchId: '',
					personalName: '',
					templateName: '',
					personalIdentity: '',
					personalMobile: '',
					serverName: '',
					signState: '',
					orderState: '',
					certState: ''
				},
				orderStateList: [],
				sighStateList: [],
				extrSystemOptions: [],
				dateValue: '',
				tableList: [],
				pageSize: 10,
				pageIndex: 1,
				activeTab: 'first',
				isRe: ['SIGNING', 'CREATE_ERR', 'AUTH_ERR', 'NOTIFY_ERR', 'SIGN_ERR', 'CLOSE_ERR', 'EXPIRED', 'REJECTED'],
				certStates: [
					{
						text: '未上传',
						value: '0'
					},
					{
						text: '认证失败',
						value: '1'
					},
					{
						text: '认证成功',
						value: '2'
					},
					{
						text: '不需要上传',
						value: '3'
					}
				],
				wait: ['SIGNING', 'AUTHING'],
				fail: ['CREATE_ERR', 'AUTH_ERR', 'NOTIFY_ERR', 'SIGN_ERR', 'CLOSE_ERR', 'EXPIRED', 'EXPIRE_CLOSED'],
				baseUrl
			}
		},
		mounted() {
			Object.assign(this.formSearch, this.$route.query)
			this.getList()
		},
		methods: {
            download() {
                var url = '', isFirst = true
                for(var k in this.formSearch) {
                    if(isFirst) {
                        isFirst = false
                        url += `?${k}=${this.formSearch[k]}`
                    }
                    else {
                        url += `&${k}=${this.formSearch[k]}`
                    }
                    console.log(url)
                }
                window.open(`/api/econtract/inner/export${url}`)
	        },
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
			},
			cancleOrder(a) {
				post(`/api/econtract/order/cancelsign?orderId=${a.orderId}`).then(data => {
					this.$message({
						type: 'success',
						message: '已取消签约！'
					})
					this.getList()
				})
			},
			reCall(a) {
				this.$confirm(`最近通知时间 ${a.lastNotifyTimeDesc} 确认重新发送通知吗？`, '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
					post(`/api/econtract/order/reSubmit?orderId=${a.orderId}&repeatFlag=RENOTIFYING`).then(data => {
						this.$message({
							type: 'success',
							message: '已重发通知！'
						})
                    })
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消！'
					})
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
















