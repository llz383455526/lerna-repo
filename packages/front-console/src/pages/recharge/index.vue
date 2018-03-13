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
                    <el-option v-for="(item, index) in optionTypes.RechargeOrderState" :label="item.text" :value="item.value" :key="item.value"></el-option>
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
        <el-table :data="rechargeApplyList.list" style="width: 100%;margin-top: 20px;">
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
            this.$store.dispatch('getByTypes', ['RechargeOrderState']);
            this.$store.dispatch('getCurServiceCompanies');
        },
        data() {
            return {
                pageSize: 10,
                currentPage: 1,
                dialogCreateForm: {
                    amount:'',
                    purpose:'',
                    serviceCompanyId:null,
                },
				dialogCreateFormRules: {
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
                },
                orderInfo:'',
                dialogConfirmVisible:false
            }
        },
        computed: {
            ...mapGetters({
                rechargeApplyList: 'rechargeApplyList',
                optionTypes: 'optionTypes',
                curServiceCompanies: 'curServiceCompanies',
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
                this.$store.dispatch('getRechargeApplyList', param);
            },
        	receiveMoney(orderNo){
                showConfirm({
                    title:'提示',
                    msg:'确定已到账吗？',
                    confirmCallback:()=>{
                        post('/api/console-dlv/recharge-order/approve', {orderNo:orderNo,state:30}).then(data => {
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
                        post('/api/console-dlv/recharge-order/approve', {orderNo:orderNo,state:40}).then(data => {
                            showNotify('success','操作成功！')
                            this.search()
                        })
                    },
                })
            }
        }
    }
</script>

<style scoped>

</style>