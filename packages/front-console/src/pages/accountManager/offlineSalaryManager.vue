<template>
    <div style="background-color:#fff;padding:15px;">
    	<div style="margin-bottom:30px;">批量导入发放流水</div>
        <el-form :inline="true" :model="formSearch" class="demo-form-inline" >
            <el-form-item label="客户公司:" size="small">
                <el-select filterable style="width: 150px" v-model="formSearch.customCompanyId" placeholder="请选择">
					<el-option label="所有" value=""></el-option>
                    <el-option v-for="(item, index) in customCompanyList" :label="item.name" :value="item.id" :key="index" ></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务商公司:" size="small">
                <el-select filterable style="width: 150px" v-model="formSearch.serviceCompanyId" placeholder="请选择">
                	<el-option label="所有" value=""></el-option>
                	<el-option v-for="(item, index) in serviceCompanyList" :label="item.name" :value="item.id" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="发放渠道:" size="small">
                <el-select filterable style="width: 150px" v-model="formSearch.paymentThirdType" placeholder="请选择">
                	<el-option label="所有" value=""></el-option>
                	<el-option v-for="(item, index) in paymentThirdTypeList" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态:" size="small">
                <el-select filterable style="width: 150px" v-model="formSearch.state" placeholder="请选择">
                	<el-option label="所有" value=""></el-option>
                	<el-option v-for="(item, index) in stateList" :label="item.text" :value="item.value" :key="index"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
            </el-form-item>
        </el-form>
		<el-button size="small" @click="creatNew">新增</el-button>
		<el-table :data="offlineSalaryPage.list" style="width: 100%;margin-top: 20px;">
		<el-table-column prop="customCompanyName" label="客户公司"></el-table-column>
		<el-table-column prop="thirdPaymentTypeName" label="发放渠道"></el-table-column>
		<el-table-column prop="serviceCompanyName" label="服务商公司"></el-table-column>
		<el-table-column prop="payTypeName" label="发放方式"></el-table-column>
		<el-table-column label="交易金额">
			<template slot-scope="scope">
				<span>{{scope.row.totalAmount | formatMoney}}</span>
			</template>
		</el-table-column>
		<el-table-column prop="successCount" label="成功笔数"></el-table-column>
		<el-table-column prop="failCount" label="失败笔数"></el-table-column>
		<el-table-column prop="remark" label="备注"></el-table-column>
		<el-table-column prop="stateName" label="状态"></el-table-column>
		<el-table-column prop="createAt" label="上传时间">
			<template slot-scope="scope">
				<span>{{scope.row.createAt | formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
			</template>
		</el-table-column>
		<el-table-column align="center" label="操作" width="160">
			<template slot-scope="scope">
				<el-button @click="download(scope.row.downloadCode)" type="text" size="medium" style="padding:0;">下载文件</el-button>
				<template v-if="scope.row.state == 1 ||scope.row.state == -2">
					<span style="color: #0283fb; padding: 0px,15px;">|</span>
					<el-button @click="invalid(scope.row.id)" type="text" size="medium" style="padding:0;">作废</el-button>
				</template>
			</template>
		</el-table-column>
        </el-table>

        <ayg-pagination v-if="offlineSalaryPage.total" :total="offlineSalaryPage.total"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
    </div>
</template>

<script>

    import {mapGetters} from 'vuex'
    import {showConfirm} from '../../plugin/utils-message'
    import {showTopErrorToast} from '../../plugin/utils-toast'
	import { showNotify } from '../../plugin/utils-notify'
    import {formatTime} from '../../plugin/utils-functions'
    import {baseUrl} from '../../config/address'
	import { post, get } from "../../store/api"

    export default {
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                formSearch: {
                    customCompanyId: '',
                    serviceCompanyId: '',
                    paymentThirdType: '',
                    state: '',
					page: 1,
					pageSize: 10,
                },
            }
        },
        computed: {
            ...mapGetters({
                customCompanyList: 'customCompanyList',
                serviceCompanyList: 'serviceCompanyList',
                paymentThirdTypeList: 'paymentThirdTypeList',
				stateList: 'stateList',
				offlineSalaryPage: 'offlineSalaryPage',
            })
        },
		created: function () {
			this.$store.dispatch('getCustomCompanyList');
			this.$store.dispatch('getServiceCompanyList');
			this.$store.dispatch('getPaymentThirdTypeList');
			this.$store.dispatch('getStateList');
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
				this.formSearch.page = pageInfo.page;
				this.formSearch.pageSize = pageInfo.pageSize;
				this.$store.dispatch('getOfflineSalaryPage', this.formSearch);
			},
			clear(){
				this.formSearch.customCompanyId = ''
            	this.formSearch.serviceCompanyId = ''
                this.formSearch.paymentThirdType =''
                this.formSearch.state = ''
				this.search();
			},
			creatNew(){
				this.$router.push('offlineSalaryUpload');
			},
			invalid(index){
				this.$confirm('是否确定要作废?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let param = {
						orderId: index,
					};
					post('/api/console-dlv/pay-order-offline/disabled-payorder-offline', param)
					.then(data => {
						showNotify('success','操作成功！')
						this.requestQuery({
							page: this.currentPage,
							pageSize: this.pageSize,
						});
					})
				})
        	},
			download(downloadCode){
				window.location.href = baseUrl + '/api/sysmgr-web/file/download?downloadCode=' + downloadCode;
			}
        }
    }
</script>

<style lang="scss" scoped>

</style>
