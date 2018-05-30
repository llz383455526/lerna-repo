<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0 0 20px;">充值申请记录</div>

        <el-form :inline="true" ref="formSearch" onsubmit="return false;"  :model="formSearch" style="padding: 10px 0;">
            <el-form-item label="客户公司:"   size="small" prop="companyId">
                <el-select v-model="companyId">
                    <el-option v-for="item in customCompanyList" :label="item.name" :value="item.id" :key="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="接入应用:"   size="small" prop="extrSystemIds">
                <el-select multiple v-model="formSearch.extrSystemIds">
                    <el-option v-for="item in extrSystemOptions" :label="item.text" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="充值码:" size="small" prop="rechargeCode">
                <el-input style="width: 150px" v-model="formSearch.rechargeCode" placeholder="充值码"></el-input>
            </el-form-item>
            <el-form-item label="处理状态:"   size="small" prop="state">
                <el-select v-model="formSearch.state">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option v-for="(item, index) in optionTypes" :label="item.text" :value="item.value" :key="item.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="提交时间:" size="small" prop="dateValue">
                <el-date-picker v-model="formSearch.dateValue" type="daterange" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" native-type="submit" @click="search" size="small">查询</el-button>
                <el-button size="small" @click="clear">清除</el-button>
            </el-form-item>
        </el-form>
        <el-button type="primary" @click="dialogCreateVisible=true">创建充值申请</el-button>
        <div class="table-container">
            <el-table :data="rechargeApplyList.list" style="width: 100%;">
                <el-table-column prop="companyName" label="客户公司"></el-table-column>
                <el-table-column prop="appName" label="接入应用"></el-table-column>
                <el-table-column prop="accountName" label="账户名称"></el-table-column>
                <el-table-column prop="depositBank" label="开户行"></el-table-column>
                <el-table-column prop="accountNo" label="账号"></el-table-column>
                <el-table-column prop="rechargeCode" label="充值码"></el-table-column>
                <el-table-column prop="channelName" label="充值渠道"></el-table-column>
                <el-table-column prop="purpose" label="充值用途"></el-table-column>
                <el-table-column label="充值金额">
                    <template slot-scope="scope">
                        <span>{{scope.row.amount | formatMoney}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="提交时间">
                    <template slot-scope="scope">
                        <span>{{scope.row.createAt |formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="stateName" label="处理状态"></el-table-column>
            </el-table>
        </div>

        <ayg-pagination v-if="rechargeApplyList.total" :total="rechargeApplyList.total" :currentPage="currentPage"
                        v-on:handleSizeChange="handleSizeChange"
                        v-on:handleCurrentChange="handleCurrentChange"></ayg-pagination>


        <el-dialog title="创建充值申请" :before-close="closeEditDialog"  :visible.sync="dialogCreateVisible" width="30%">

            <el-form :model="dialogCreateForm" :rules="dialogCreateFormRules" ref="dialogCreateForm">
                <!-- <div class="input-container">
                    <div class="label">客户公司：<span>*</span></div>
                    <div class="input">
                        <el-form-item>
                            <el-input disabled :maxlength=50 v-model="userInformation.companyName" placeholder=""></el-input>
                        </el-form-item>
                    </div>
               </div> -->
                <div class="input-container">
                    <div class="label">接入应用：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="appId">
                            <el-select v-model="dialogCreateForm.appId">
                                <el-option v-for="(item, index) in productName" :label="item.text" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">充值到服务商：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="serviceCompanyId">
                            <el-select v-model="dialogCreateForm.serviceCompanyId">
                                <el-option v-for="(item, index) in curServiceCompanies" :label="item.companyName" :value="item.companyId" :key="item.companyId"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">充值用途：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="purpose">
                            <el-input :maxlength=50 v-model="dialogCreateForm.purpose" placeholder=""></el-input>
                        </el-form-item>
                    </div>
                </div>
                <div class="input-container">
                    <div class="label">充值金额：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="amount">
                            <el-input :maxlength=15 v-model="dialogCreateForm.amount" placeholder=""></el-input>
                        </el-form-item>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogCreateVisible = false;$refs['dialogCreateForm'].resetFields()">取 消</el-button>
                <el-button type="primary" @click="submitDialogCreateForm()">确 定</el-button>
            </div>

        </el-dialog>

        <el-dialog title=""  :visible.sync="dialogConfirmVisible" width="40%">
            <div class="input-container">
                <div class="label">账户名称：</div>
                <div class="input">{{orderInfo.accountName}}</div>
            </div>
            <div class="input-container">
                <div class="label">开户行：</div>
                <div class="input">{{orderInfo.depositBank}}</div>
            </div>
            <div class="input-container">
                <div class="label">账号：</div>
                <div class="input">{{orderInfo.accountNo}}</div>
            </div>
            <div class="input-container">
                <div class="label">充值用途：</div>
                <div class="input">{{orderInfo.purpose}}</div>
            </div>
            <div class="input-container">
                <div class="label">充值金额：</div>
                <div class="input">{{orderInfo.amount | formatMoney}}</div>
            </div>
            <div class="input-container">
                <div class="label">充值码：</div>
                <div class="input red" style="width:400px;">{{orderInfo.rechargeCode}}（请务必备注在付款信息中，便于收款方确认款项）</div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="submitConfirmOrder">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
	import {mapGetters} from 'vuex'
	import _ from 'lodash'
	import {formatTime, urlEncode} from '../../plugin/utils-functions'
	import {checkMoney} from '../../plugin/utils-element-validator'
	import {showNotify} from '../../plugin/utils-notify'
	import {baseUrl} from '../../config/address'
	import {post,get} from '../../store/api'
	import { setTimeout, clearInterval } from 'timers';


	export default {
		name: "credit-bill",
		created () {
			// this.getClient()
			this.search()
			this.$store.dispatch('getByTypes', ['RechargeOrderState']);
			this.$store.dispatch('getCurServiceCompanies');

			this.getCompanyList()
		},
		data() {
			return {
				pageSize: 10,
				currentPage: 1,
				dialogCreateForm: {
					companyId: '',
					appId: '',
					amount:'',
					purpose:'',
					serviceCompanyId:null,
				},
				dialogCreateFormRules: {
					addId:[{
						required: true,
						message: '请选择产品',
						trigger: 'change'
					}],
					serviceCompanyId: [{
						required: true,
						message: '请选择充值服务商',
						trigger: 'change'
					}],
					purpose: [{
						required: true,
						message: '请填写充值用途',
						trigger: 'blur'
					}],
					amount: [{
						required: true,
						message: '请选择充值金额',
						trigger: 'blur'
					},{
						validator: checkMoney
					}],
				},
				dialogCreateVisible: false,
				formSearch: {
					extrSystemIds: [],
					rechargeCode: '',
					state:'',
					dateValue:'',
					// customCompanyId: ''
				},
				orderInfo:'',
				dialogConfirmVisible:false,
				extrSystemOptions: [],
				customCompanyList: [],
				companyId: ''
			}
		},
		computed: {
			...mapGetters({
				rechargeApplyList: 'rechargeApplyList',
				optionTypes: 'optionTypes',
				curServiceCompanies: 'curServiceCompanies',
				userInformation: 'userInformation',
				productName: 'productName'
			})
		},
		watch: {
			companyId() {
				if(this.companyId) this.getClient(this.companyId)
			}
		},
		methods: {
			getCompanyList() {
                get('/api/sysmgr-web/commom/company', {
	                companyIdentity: 'custom'
                }).then(result => {
	                this.customCompanyList = result
                })
            },
			getClient(companyId) {
				post('/api/balance-web/recharge-order/query-app', {
					companyId: companyId
				}).then(result => {
					this.extrSystemOptions = result
				})
			},
			search: function () {
				this.currentPage = 1;
				this.requestAction({
					page: 1,
					pageSize: this.pageSize,
				});
			},
			clear: function () {
				this.$refs['formSearch'].resetFields();
				this.companyId = ''
				this.search()
			},
			exportXls: function () {
				let startTime = '';
				let endTime = '';
				if (this.formSearch.dateValue) {
					startTime = formatTime(this.formSearch.dateValue[0], 'yyyy-MM-dd');
					endTime = formatTime(this.formSearch.dateValue[1], 'yyyy-MM-dd');
				}

				window.location.href = baseUrl + '/api/econtract/inner/export?' + urlEncode(this.formSearch)
			},
			handleSizeChange(value) {
				this.pageSize = value;
				if (this.currentPage == 1) {
					this.requestAction({
						page: 1,
						pageSize: value,
					});
				} else {
					this.currentPage = 1;
				}
			},
			handleCurrentChange(value) {
				this.currentPage = value;
				this.requestAction({
					page: value,
					pageSize: this.pageSize,
				});
			},
			requestAction: function (pageInfo) {
				let startTime = '';
				let endTime = '';
				if (this.formSearch.dateValue) {
					startTime = formatTime(this.formSearch.dateValue[0], 'yyyy-MM-dd');
					endTime = formatTime(this.formSearch.dateValue[1], 'yyyy-MM-dd');
				}
				let param = {
					createAtBegin: startTime,
					createAtEnd: endTime,
					page: pageInfo.page,
					pageSize: pageInfo.pageSize
				};
				param = _.assign(param, this.formSearch)
                param.customCompanyId = this.companyId
				this.$store.dispatch('getRechargeApplyList', param);
			},
			submitDialogCreateForm(){
				this.dialogCreateForm.companyId = this.userInformation.companyId
				console.log(this.dialogCreateForm)
				this.$refs['dialogCreateForm'].validate(valid => {
					if(valid) {
						post('/api/balance-web/recharge-order/fetch-code', this.dialogCreateForm).then(data => {
							// showNotify('success','操作成功！')
							this.$refs['dialogCreateForm'].resetFields()
							this.orderInfo = data
							this.dialogCreateVisible = false
							this.dialogConfirmVisible = true
						})
					}
				})

			},
			closeEditDialog(next) {
				this.$refs['dialogCreateForm'].resetFields()
				next()
			},
			submitConfirmOrder(){
				post('/api/balance-web/recharge-order/comfirm', this.orderInfo).then(data => {
					showNotify('success','操作成功！')
					this.dialogConfirmVisible = false
					this.search()
				})
			}
		}
	}
</script>

<style scoped>

</style>