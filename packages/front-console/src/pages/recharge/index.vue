<template>
    <div style="margin-top: 15px;background-color: #fff;padding: 15px;">
        <div style="margin: 0px 30px 30px;">充值申请记录</div>

        <el-form :inline="true" ref="formSearch" onsubmit="return false;"  :model="formSearch" style="padding-left: 35px;padding: 10px 0 10px 35px;">
            <el-form-item label="充值码:" size="small" prop="rechargeCode">
                <el-input style="width: 150px" v-model="formSearch.rechargeCode" placeholder="充值码"></el-input>
            </el-form-item>
            <el-form-item label="处理状态:"   size="small" prop="state">
                <el-select v-model="formSearch.state">
                    <el-option label="全部" value="" key=""></el-option>
                    <el-option v-for="(item, index) in optionTypes.RechargeOrderStateType" :label="item.text" :value="item.value" :key="item.value"></el-option>
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
        <el-table :data="rechargeApplyList.list" style="width: 100%;margin-top: 20px;">
            <el-table-column prop="companyName" label="客户公司"></el-table-column>
            <el-table-column prop="appName" label="接入应用"></el-table-column>
             <el-table-column prop="channelName" label="充值渠道"></el-table-column>
            <el-table-column prop="accountName" label="账户名称"></el-table-column>
            <el-table-column prop="depositBank" label="开户行"></el-table-column>
            <el-table-column prop="accountNo" label="账号"></el-table-column>
            <el-table-column prop="rechargeCode" label="充值码"></el-table-column>
            <el-table-column prop="purpose" label="充值用途"></el-table-column>
            <el-table-column label="充值金额">
                <template slot-scope="scope">
                    <span>{{scope.row.amount |formatMoney}}</span>
                </template>
            </el-table-column>
            <el-table-column label="提交时间">
                <template slot-scope="scope">
                    <span>{{scope.row.createAt |formatTime('yyyy-MM-dd hh:mm:ss')}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="stateName" label="处理状态"></el-table-column>
            <el-table-column prop="" label="操作">
                <template slot-scope="scope">
                    <span class="operation" v-if="scope.row.state == 20" @click="receiveMoney(scope.row.orderNo)">已到账</span>
                    <span class="operation" v-if="scope.row.state == 20" @click="unReceiveMoney(scope.row.orderNo)">未到账</span>
                </template>
            </el-table-column>
        </el-table>

        <ayg-pagination v-if="rechargeApplyList.total" :total="rechargeApplyList.total" :currentPage="currentPage"
                v-on:handleSizeChange="handleSizeChange"
                v-on:handleCurrentChange="handleCurrentChange"></ayg-pagination>
    <el-dialog title="创建充值申请" :before-close="closeEditDialog"  :visible.sync="dialogCreateVisible" width="30%">
        	
            <el-form :model="dialogCreateForm" :rules="dialogCreateFormRules" ref="dialogCreateForm">
                <div class="input-container">
                    <div class="label">客户公司：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="companyId">
                            <el-select filterable v-model="dialogCreateForm.companyId">
                                <el-option v-for="(item, index) in customCompanies" :label="item.companyName" :value="item.companyId" :key="item.companyId"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
               </div>
               <div class="input-container">
                    <div class="label">接入应用：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="appId">
                            <el-select filterable v-model="dialogCreateForm.appId" no-data-text="请先选择客户公司">
                                <el-option v-for="(item, index) in productName" :label="item.text" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
               </div>
                <div class="input-container">
                    <div class="label">充值渠道：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="channelCode">
                            <el-select filterable v-model="dialogCreateForm.channelCode" no-data-text="请先选择充值渠道">
                                <el-option v-for="(item, index) in optionTypes.ChannelType" :label="item.text" :value="item.value" :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </div>
               </div>
				<div class="input-container">
                    <div class="label">充值到服务商：<span>*</span></div>
                    <div class="input">
                        <el-form-item prop="serviceCompanyId">
                            <el-select filterable v-model="dialogCreateForm.serviceCompanyId">
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
	import {showConfirm, showAlert} from '../../plugin/utils-message'
    import {baseUrl} from '../../config/address'
    import {post} from '../../store/api'

    export default {
        name: "credit-bill",
        created () {
            this.search()
            this.$store.dispatch('getByTypes', ['RechargeOrderStateType','ChannelType']);
            this.$store.dispatch('getCurServiceCompanies');
            // 
            this.$store.dispatch('getCustomCompanies');
        },
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                dialogCreateForm: {
                    companyId: '',
                    appId: '',
                    channelCode:'',
                    amount:'',
                    purpose:'',
                    serviceCompanyId:null,
                },
				dialogCreateFormRules: {
                    companyId: [{
                        required: true,
						message: '请选择客户公司',
						trigger: 'change'
                    }],
                    addId:[{
                        required: true,
						message: '请选择产品',
						trigger: 'change'
                    }],
                    channelCode:[{
                        required: true,
						message: '请选择充值渠道',
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
                    rechargeCode: '',
                    state:'',
                    dateValue:''
                },
                orderInfo:'',
                dialogConfirmVisible:false
            }
        },
        watch: {
            'dialogCreateForm.companyId': function(){
                console.log(this.dialogCreateForm.companyId)
                if(this.dialogCreateForm.companyId){
                    this.$store.dispatch('getProductName', {
                        companyId: this.dialogCreateForm.companyId
                    });
                }
            }
        },
        computed: {
            ...mapGetters({
                rechargeApplyList: 'rechargeApplyList',
                optionTypes: 'optionTypes',
                curServiceCompanies: 'curServiceCompanies',
                userInformation: 'userInformation',
                productName: 'productName',
                customCompanies: 'customCompanies'
            })
        },
        methods: {
            search: function () {
                this.currentPage = 1;
                this.requestAction({
                    page: 1,
                    pageSize: this.pageSize,
                });
            },
            clear: function () {
                this.$refs['formSearch'].resetFields();
                this.search()
            },
            handleSizeChange(value) {
                this.pageSize = value;                this.currentPage = 1;                this.requestAction({                    page: this.currentPage,                    pageSize: value,                });
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
                this.$store.dispatch('getRechargeApplyList', param);
            },
        	receiveMoney(orderNo){
                showConfirm({
                    title:'提示',
                    msg:'确定已到账吗？',
                    confirmCallback:()=>{
                        post('/api/balance-web/recharge-order/approve', {orderNo:orderNo,state:30}).then(data => {
                            showNotify('success','操作成功！')
                            this.search()
                        })
                    },
                })
					
            },
            closeEditDialog(next) {
                this.$refs['dialogCreateForm'].resetFields()
                next()
            },
            unReceiveMoney(orderNo){
                showConfirm({
                    title:'提示',
                    msg:'确定未到账吗？',
                    confirmCallback:()=>{
                        post('/api/balance-web/recharge-order/approve', {orderNo:orderNo,state:40}).then(data => {
                            showNotify('success','操作成功！')
                            this.search()
                        })
                    },
                })
            },
            submitDialogCreateForm(){
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