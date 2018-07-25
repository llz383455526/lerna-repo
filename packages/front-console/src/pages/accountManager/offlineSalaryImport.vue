<template>
    <div style="background-color:#fff;padding:15px;">
		<el-table :data="offlineSalaryImportPage.list" style="width: 100%;margin-top: 20px;">
			<el-table-column label="账户名称">
				<template slot-scope="scope">
                     <span :class="{'red':isColumnError('accountName',scope.row.errMsg)}">{{scope.row.accountName}}</span>
				</template>
			</el-table-column>
			<el-table-column label="账户账号">
				<template slot-scope="scope">
                     <span :class="{'red':isColumnError('accountNo',scope.row.errMsg)}">{{scope.row.accountNo}}</span>
				</template>
			</el-table-column>
			<el-table-column label="金额">
				<template slot-scope="scope">
                     <span :class="{'red':isColumnError('amount',scope.row.errMsg)}">{{scope.row.amount | formatMoney}}</span>
				</template>
			</el-table-column>
			<el-table-column label="客户订单号">
				<template slot-scope="scope">
                     <span :class="{'red':isColumnError('outOrderNo',scope.row.errMsg)}">{{scope.row.outOrderNo}}</span>
				</template>
			</el-table-column>
			<el-table-column label="渠道交易流水号">
				<template slot-scope="scope">
                     <span :class="{'red':isColumnError('paymentThirdTradeNo',scope.row.errMsg)}">{{scope.row.paymentThirdTradeNo}}</span>
				</template>
			</el-table-column>
			<el-table-column label="交易时间">
				<template slot-scope="scope">
                     <span :class="{'red':isColumnError('paymentResTime',scope.row.errMsg)}">{{scope.row.paymentResTime | formatTime('yyyy-MM-dd hh:mm:ss ')}}</span>
				</template>
			</el-table-column>
			<el-table-column label="交易状态">
				<template slot-scope="scope">
                     <span :class="{'red':isColumnError('state',scope.row.errMsg)}">{{scope.row.state}}</span>
				</template>
			</el-table-column>
			<el-table-column label="校验状态">
				<template slot-scope="scope">
                    {{scope.row.isSucess === 1 ? '成功' : '失败'}}
                </template>
			</el-table-column>
			<el-table-column label="错误描述">
				<template slot-scope="scope">
                   <span class="red">{{scope.row.errMsg | formatConcat}}</span>
                </template>
			</el-table-column>
		</el-table>
		<ayg-pagination v-if="offlineSalaryImportPage.total" :total="offlineSalaryImportPage.total"
					v-on:handleSizeChange="handleSizeChange"
					v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
					
		<div style="padding: 15px;">
			<el-button type="primary" v-if="offlineSalaryUploadInfo.failCount == 0"  @click="confirmOrder" size="small">提交订单</el-button>
			<el-button type="primary" v-else @click="reUpload" size="small">重新上传</el-button>
		</div>
    </div>
	
</template>

<script>

    import {mapGetters} from 'vuex'
    import {showConfirm} from '../../plugin/utils-message'
    import {showTopErrorToast} from '../../plugin/utils-toast'
    import {formatTime} from '../../plugin/utils-functions'
    import {baseUrl} from '../../config/address'
	import {post,get} from '../../store/api'
	import {showNotify} from '../../plugin/utils-notify'

    export default {
        data() {
            return {
				offlineSalaryUploadInfo:{},
            }
        },
        computed: {
            ...mapGetters({
                offlineSalaryImportPage: 'offlineSalaryImportPage',
            })
        },
		created: function () {
			this.offlineSalaryUploadInfo = JSON.parse(sessionStorage.getItem('offlineSalaryUploadInfo'))
            this.search();
        },
		methods: {
			search() {
				this.currentPage = 1;
				this.pageSize = 10;
				this.requestQuery({
					page: this.currentPage,
					pageSize: this.pageSize,
				});
			},
			handleSizeChange(value) {
				this.pageSize = value;
				this.requestQuery({
					page: 1,
					pageSize: value,
				});
			},
			handleCurrentChange(value) {
				this.currentPage = value;
				this.requestQuery({
					page: value,
					pageSize: this.pageSize,
				});
			},
			requestQuery(pageInfo) {
				let param = {
					id: this.offlineSalaryUploadInfo.taskId,
					page: pageInfo.page,
					pageSize: pageInfo.pageSize
				};
				this.$store.dispatch('getOfflineSalaryImportPage', param);
			},
			confirmOrder() {
				let param = {
					importTaskId: this.offlineSalaryUploadInfo.taskId,
					remark: this.offlineSalaryUploadInfo.memo,
				};
				post('/api/console-dlv/pay-order-offline/import/submit',param)
				.then(result => {
					sessionStorage.removeItem('offlineSalaryUploadInfo')
					showNotify('success','操作成功！')
					this.$router.push('offlineSalaryManager');
				});
			},
			reUpload(){
				sessionStorage.removeItem('offlineSalaryUploadInfo')
				this.$router.push('offlineSalaryUpload');
			},
			isColumnError(key, errorMsg) {
                if (errorMsg && errorMsg[key]) {
                    return true
                }
                return false;
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
