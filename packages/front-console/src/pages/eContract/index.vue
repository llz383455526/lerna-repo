<template>

    <div :class="`main-container ${isHandle ? 'mb100' : ''}`">
        <div style="margin: 0 40px 20px 0; display: inline-block;">电子签约记录</div>
        <el-button size="small" type="primary" @click="$router.back()">返回</el-button>
        <!-- <el-button type="small" type="primary" @click="$router.back()">返回</el-button> -->
        <el-tabs v-model="activeTab" @tab-click="handleTabClick" v-if="!isHandle">
            <el-tab-pane label="全部" name="first"></el-tab-pane>
            <el-tab-pane label="签约完成" name="second"></el-tab-pane>
            <el-tab-pane label="未完成签约" name="third"></el-tab-pane>
        </el-tabs>

        <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
            <el-form-item label="商户名称"   size="small" prop="extrSystemIds">
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
					<el-option v-for="e in certStates" :key="e.value" :label="e.text" :value="e.value"></el-option>
				</el-select>
			</el-form-item>

            <el-form-item label="订单状态:" size="small" v-if="activeTab === 'first'">
                <el-select v-model="formSearch.orderState">
                    <el-option v-for="item in orderStateList" :label="item.value" :value="item.key" :key="item.key"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small" :class="{disable: isHandle}">查询</el-button>
                <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
                <el-button size="small" @click="download" class="btn">导出xls</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="handle(1)">{{isHandle && ableType == 1 ? '取消批量重发通知' : '批量重发通知' }}</el-button>
        <el-button type="primary" size="small" @click="handle(2)">{{isHandle && ableType == 2 ? '取消批量取消' : '批量取消' }}</el-button>
        <div class="table-container">
            <el-table :data="tableList.data" v-loading="isReady" @selection-change="getRow" ref="table">
                <el-table-column type="selection" :selectable="isAble" v-if="isHandle"></el-table-column>
				<el-table-column prop="createTimeDesc" label="签约时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createTimeDesc | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
				<el-table-column prop="orderId" label="签约订单号"></el-table-column>
                <el-table-column prop="extrSystemName" label="商户名称"></el-table-column>
				<el-table-column prop="templateName" label="合同模板名称"></el-table-column>
				<el-table-column prop="serverName" label="签约服务商"></el-table-column>
                <el-table-column prop="personalName" label="姓名"></el-table-column>
                <el-table-column prop="personalIdentity" label="证件号"></el-table-column>
                 <el-table-column prop="personalMobile" label="手机号"></el-table-column>
                <el-table-column prop="signStateDesc" label="签约状态"></el-table-column>
                <el-table-column prop="certStateDesc" label="身份证认证状态"></el-table-column>
                <el-table-column prop="orderStateDesc" label="订单状态">
					<!-- <template slot-scope="scope">
						<template v-if="wait.indexOf(scope.row.orderState) > -1">待签约</template>
						<template v-else-if="fail.indexOf(scope.row.orderState) > -1">签约失败</template>
						<template v-else>{{scope.row.orderStateDesc}}</template>
					</template> -->
				</el-table-column>

                <el-table-column label="操作" align="center">
                    <template slot-scope="scope">
						<el-button class="ml0" v-if="scope.row.orderState === 'SIGNING' || scope.row.orderState === 'AUTHING'" type="text" size="small" @click="cancleOrder(scope.row)">取消签约</el-button>
						<el-button class="ml0" v-if="isRe.indexOf(scope.row.orderState) > -1" type="text" size="small" @click="reCall(scope.row)">
                            重发通知
							<!-- {{scope.row.orderState == 'REJECTED' ? '重发通知': scope.row.orderState == 'SIGNING' ? '重发通知' : '重试'}} -->
						</el-button>
                        <a v-if="scope.row.downloadUrl" target="_blank" :href="`${baseUrl}/api/econtract/contract/download?orderId=${scope.row.orderId}`">
							<el-button class="ml0" type="text" size="small">合同下载</el-button>
						</a>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <ayg-pagination
            v-if="!isHandle && tableList.total"
            :total="tableList.total"
            v-on:handleSizeChange="handleSizeChange"
            :currentSize="pageSize"
            v-on:handleCurrentChange="handleCurrentChange"
            :currentPage="pageIndex">
        </ayg-pagination>
        <div class="tip" v-if="isHandle">
            <div class="center">
                已选 <span class="c66B1FF">{{selection.length}}</span> 条，是否确认批量{{ableType == 1 ? '重发' : '取消'}}？
                <el-button class="mr20" @click="handle()">取消</el-button>
                <el-button class="mr20" type="primary" @click="submit">确认</el-button>
            </div>
        </div>
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
				isRe: ['SIGNING', 'CREATE_ERR', 'AUTH_ERR', 'NOTIFY_ERR', 'SIGN_ERR', 'CLOSE_ERR', 'EXPIRED', 'REJECTED', 'AUTHING'],
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
                baseUrl,
                isReady: true,
                selection: [],
                isHandle: false,
                ableType: ''
			}
		},
		mounted() {
			Object.assign(this.formSearch, this.$route.query)
			this.getList()
		},
		methods: {
            download() {
				let startAt = ''
				let endAt = ''
				if (this.dateValue[0]) {
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

                var url = '', isFirst = true
                for(var k in options) {
                    if(isFirst) {
                        isFirst = false
                        url += `?${k}=${options[k]}`
                    }
                    else {
                        url += `&${k}=${options[k]}`
                    }
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
                if(this.isHandle) {
                    return
                }
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
                // this.isReady = true
				post('/api/econtract/inner/qry', options)
					.then(result => {
                        this.tableList = result
                        this.isReady = false
                        this.selection.length = 0
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
                        if(a.orderState == 'EXPIRED') {
                            this.pageIndex = 1
                        }
                        this.getList()
                    })
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消！'
					})
				})
            },
            isAble(a) {
                var result = false
                if(this.ableType == 1) {
                    result = this.isRe.indexOf(a.orderState) > -1
                }
                else if(this.ableType == 2) {
                    result = a.orderState === 'SIGNING' || a.orderState === 'AUTHING'
                }
                return result
            },
            getRow(a) {
                this.selection = a
            },
            handle(a) {
                // this.selection = []
                this.$refs['table'].clearSelection()
                if(!a || this.ableType == a) {
                    this.ableType = ''
                    this.isHandle = false
                }
                else {
                    this.ableType = a
                    this.isHandle = true
                }
                console.log(this.ableType, this.isHandle)
            },
            submit() {
                if(!this.selection.length) {
                    this.$message({
                        type: 'warning',
                        message: '至少选择一行！'
                    })
                    return
                }
                var orderIds = []
                this.selection.forEach(e => {
                    orderIds.push(e.orderId)
                })
                post(`/api/econtract/order/${this.ableType == 1 ? 'reSubmits' : 'cancelsigns'}`, {
                    orderIds: orderIds,
                    repeatFlag: this.ableType == 1 ? 'RENOTIFYING' : ''
                }).then(() => {
                    this.$message({
						type: 'success',
						message: this.ableType == 1 ? '已重发通知！' : '已取消！'
                    })
                    this.handle()
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
    .mb100 {
        margin-bottom: 100px;
    }

    .table-container {
        width: 100%;
        margin-top: 20px;
    }

    .ml0 {
        margin-left: 0px;
    }
    .tip {
        position: fixed;
        width: 100%;
        bottom: 0px;
        left: 0px;
        height: 100px;
        background-color: #fff;
        line-height: 100px;
        font-size: 18px;
        text-align: right;
        color: #333;
    }
    .disable {
        filter: grayscale(0.8);
        cursor: not-allowed;
    }
    .mr20 {
        margin-right: 20px;
    }
    .center {
        margin: 0px auto;
        width: 1366px;
    }
    .c66B1FF {
        color: #66B1FF;
    }
</style>