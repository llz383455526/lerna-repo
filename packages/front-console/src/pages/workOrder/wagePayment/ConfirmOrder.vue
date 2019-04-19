<template>
    <div class="main">
		<div class="top">
            <div class="mtitle mb32">订单费用</div>
			<div class="top_box">
				<div class="top_list">
					<div class="top_item">
						<div>发放渠道：</div>
						<div>{{importSalaryOrderFee.serviceCompanyName}} - {{importSalaryOrderFee.channelTypeName}}</div>
					</div>
					<div class="top_item">
						<div>总笔数：</div>
						<div>{{importSalaryOrderFee.totalCount}}</div>
					</div>
				</div>
				<div class="top_list">
					<div class="top_item">
						<div>校验通过：</div>
						<div>{{importSalaryOrderFee.totalCount - importSalaryOrderFee.errorCount - importSalaryOrderFee.validCount}}</div>
					</div>
				</div>
				<div class="myState">
					<div>处理状态</div>
					<div>上传成功</div>
				</div>
			</div>
		</div>
		<div class="bottom">
			<div class="mtitle">上传明细</div>
			<el-tabs v-model="activeName" @tab-click="tabClick">
				<el-tab-pane name="pass" label="全部"></el-tab-pane>
				<el-tab-pane name="unPass" :label="`校验失败(${importSalaryOrderFee.errorCount}条)`"></el-tab-pane>
			</el-tabs>
			<el-form :inline="true" ref="formSearch" label-position="top" onsubmit="return false;" :model="formSearch">
				<el-form-item label="收款方账户名称:"  prop="accountName">
	    	        <el-input class="form_input_short" v-model="formSearch.accountName" size="small" placeholder="请输入"></el-input>
			    </el-form-item>
                <el-form-item label="收款方账户:" prop="accountNo">
			        <el-input class="form_input_short" v-model="formSearch.accountNo" size="small" placeholder="请输入"></el-input>
			    </el-form-item>
				<el-form-item label="身份证号:" prop="idCard">
			        <el-input class="form_input_short" v-model="formSearch.idCard" size="small" placeholder="请输入"></el-input>
			    </el-form-item>
			    <el-form-item label="手机号:" prop="phone">
			        <el-input class="form_input_short" v-model="formSearch.phone" size="small" placeholder="请输入"></el-input>
			    </el-form-item>
			    <el-form-item class="form_btn40">
			        <el-button type="primary" native-type="submit" @click="search" size="small"> 查询</el-button>
			        <el-button size="small" @click="clear">清空</el-button>
	    		</el-form-item>
	    	</el-form>
            <el-alert class="a-info" type="info" title="" v-if="importSalaryOrderFee && importSalaryOrderFee.validCount" @close="validClose = true">
                <i class="el-icon-warning"></i>
                <span>您有{{importSalaryOrderFee.validCount}}条数据正在实名校验中。</span>
            </el-alert>
            <el-alert class="w-info" type="warning" title="" v-if="(validClose || !importSalaryOrderFee.validCount) && importSalaryOrderFee && importSalaryOrderFee.errorCount" @close="warnClose = true">
                <i class="el-icon-warning"></i>
                <span>您上传的数据存在错误，请修正后提交订单。</span>
            </el-alert>
            <el-alert class="w-info" type="warning" title="" v-if="(warnClose || (!importSalaryOrderFee.validCount || validClose) && !importSalaryOrderFee.errorCount) && importSalaryOrderFee.riskWarnCount" @close="">
                <i class="el-icon-warning"></i>
                <span>【风险提醒】{{importSalaryOrderFee.riskWarnCount}}位用户年/月/单笔收入金额超过{{importSalaryOrderFee.taxLandingName}}当地风控限额，请注意。</span>
            </el-alert>
			<div class="tool">
				<el-button size="small" @click="add">添加收款信息</el-button>
                <el-button size="small" @click="downLoad" :class="`${importSalaryOrderFee.validCount ? 'disable' : ''}`">下载校验结果</el-button>
			</div>
			<el-table :data="passList.list" style="width: 100%;" class="custom-table">
                <el-table-column prop="smsMemo" label="校验结果">
					<template slot-scope="scope">
						<span :class="`aState s${scope.row.validStatus}`"></span>
					</template>
				</el-table-column>
			    <el-table-column prop="accountName" label="收款方账户名称" width="120px;">
                    <template slot-scope="scope">
                        <span :class="{ isErr : (scope.row.errCol || '').indexOf('accountName') > -1}">{{scope.row.accountName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="accountNo" label="收款方账号">
                    <template slot-scope="scope">
                        <span :class="{ isErr : (scope.row.errCol || '').indexOf('accountNo') > -1}">{{scope.row.accountNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="phone" label="手机号">
                    <template slot-scope="scope">
                        <span :class="{ isErr : (scope.row.errCol || '').indexOf('phone') > -1}">{{scope.row.phone}}</span>
                    </template>
                </el-table-column>
			    <el-table-column prop="idCard" label="身份证">
                    <template slot-scope="scope">
                        <span :class="{ isErr : (scope.row.errCol || '').indexOf('idCard') > -1}">{{scope.row.idCard}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="实发金额">
			        <template slot-scope="scope">
			            <span :class="{ isErr : (scope.row.errCol || '').indexOf('shouldAmount') > -1}">{{scope.row.shouldAmount | formatMoney}}</span>
			        </template>
			    </el-table-column>
                <el-table-column label="款项属性" prop="fund">
                    <template slot-scope="scope">
			            <span :class="{ isErr : (scope.row.errCol || '').indexOf('fund') > -1}">{{scope.row.fund}}</span>
			        </template>
                </el-table-column>
                <el-table-column prop="errMsg" label="备注">
                    <template slot-scope="scope">
                        <span class="isErr">{{scope.row.errMsg}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope" v-if="scope.row.validStatus">
                        <el-button class="block" @click="edit(scope.row)" type="text">修改</el-button>
                        <el-button class="block" @click="deteleRow(scope.row)" type="text">删除</el-button>
                    </template>
                </el-table-column>
			</el-table>
            <el-pagination
                @size-change="passHandleSizeChange"
                @current-change="passHandleCurrentChange"
                :background="true"
                :small="true"
                :current-page="passCurrentPage"
                :page-sizes="[10, 20, 30, 40]"
                :page-size="passPageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="passList.total"
                style="text-align: right;padding: 20px"
            >
            </el-pagination>
		</div>
		<div id="pay" :style="{ 'width': $parent.$parent.isClose ? '100%' : '' }">
            <div class="pay_left">
              <div>
                实发金额：
                <span>{{importSalaryOrderFee.realAmount | formatMoney}}</span>
              </div>
              <div>
                校验失败：
                <span>{{importSalaryOrderFee.errorCount}}</span>
              </div>
            </div>
            <div class="pay_right">
                <el-button type="primary" class="pay_btn" @click="confirmOrder" v-if="!importSalaryOrderFee.errorCount && !importSalaryOrderFee.validCount">提交订单</el-button>
			    <el-button type="primary" :class="`pay_btn ${importSalaryOrderFee.validCount ? 'disable' : ''}`"  @click="reUpload">重新上传</el-button>
                <el-button class="pay_btn" @click="back">取消</el-button>
            </div>
        </div>
        <el-dialog :title="isEdit ? '修改' : '添加'" :visible.sync="show" :width="width">
            <el-form :model="aform" :rules="arules" label-width="120px" style="line-height: 35px" ref="aform">
                <el-form-item label="收款方账号名称：" prop="accountName" class="mb8">
                    <el-input v-model="aform.accountName" size="small" class="form_300"></el-input>
                </el-form-item>
                <el-form-item label="收款方账号：" prop="accountNo" class="mb8">
                    <el-input v-model="aform.accountNo" size="small" class="form_300"></el-input>
                </el-form-item>
                <el-form-item label="手机号码：" prop="phone" class="mb8">
                    <el-input v-model="aform.phone" size="small" class="form_300"></el-input>
                </el-form-item>
                <el-form-item label="身份证号：" prop="idCard" class="mb8">
                    <el-input v-model="aform.idCard" size="small" class="form_300"></el-input>
                </el-form-item>
                <el-form-item label="实发金额：" prop="shouldAmount" class="mb8">
                    <el-input v-model="aform.shouldAmount" size="small" class="form_300"></el-input>
                </el-form-item>
                <el-form-item label="款项属性：" prop="fund" class="mb8">
                    <el-input v-model="aform.fund" size="small" class="form_300"></el-input>
                </el-form-item>
            </el-form>
            <span class="form_footer" slot="footer">
                <el-button @click="show = false" size="small">取消</el-button>
                <el-button v-show="!isEdit" @click="addRow" type="primary" size="small">确定</el-button>
                <el-button v-show="isEdit" @click="editRow" type="primary" size="small">确定</el-button>
            </span>
        </el-dialog>
	</div>
</template>

<script>
	import {mapGetters} from 'vuex'
    import _ from 'lodash'
    import {formatTime, urlEncode} from '../../../plugin/utils-functions'
	import {checkMoney} from '../../../plugin/utils-element-validator'
	import {showNotify} from '../../../plugin/utils-notify'
    import { get, post, importPost } from "../../../store/api";
	export default {
		data(){
            var checkNo, type = this.$route.query.channelType
            if(type == 'alipay') {
                checkNo = (rule, value, cb) => {
                    if(!(/^[a-zA-Z0-9_.-]+@[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)*\.[a-zA-Z0-9]{2,6}$/.test(value) || /^1[3-9]{1}\d{9}$/.test(value))) {
                        return cb(new Error('请正确填写收款方账号'))
                    }
                    else {
                        return cb()
                    }
                }
            }
            if(type == 'wx') {
                checkNo = (rule, value, cb) => {
                    if(/[\u4E00-\u9FA5]/.test(value)) {
                        return cb(new Error('请正确填写收款方账号'))
                    }
                    else if(value.length > 64) {
                        return cb(new Error('最大长度为64位'))
                    }
                    else {
                        return cb()
                    }
                }
            }
            if(type == 'bank') {
                checkNo = (rule, value, cb) => {
                    if(!/^[\d]+$/.test(value)) {
                        return cb(new Error('请正确填写收款方账号'))
                    }
                    else if(value.length < 12 || value.length > 20){
                        return cb(new Error('长度在12位到20位之间'))
                    }
                    else {
                        return cb()
                    }
                }
            }
            var checkName = (rule, value, cb) => {
                if(!/^[\u4E00-\u9FA5a-zA-Z\.\·]+$/.test(value)) {
                    return cb(new Error('请正确填写收款方账号名称'))
                }
                else if(value.length > 64) {
                    return cb(new Error('最大长度为64位'))
                } else {
                    return cb()
                }
            }
            var checkID = (rule, value, cb) => {
                if(!((value.length == 18 && /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/.test(value)) || (value.length == 15 && /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$/.test(value)))) {
                    return cb(new Error('请正确填写身份证号'))
                }
                else {
                    return cb()
                }
            }
            var moreThenZero = (rule, value, cb) => {
                if(isNaN(value) || value <= 0) {
                    return cb(new Error('实发金额必须大于零'))
                }
                else {
                    return cb()
                }
            }
            return {
            	formSearch:{
	                accountNo: '',
	                accountName: '',
	                idCard: '',
	                phone: ''
            	},
            	formApp:{
            		appId:'',
            	},
            	importTaskId:'',
            	success: '',
                passCurrentPage: 1,
                passPageSize: 10,
                unPassCurrentPage: 1,
                unPassPageSize: 10,
                activeName:"pass",
                show: false,
                width: '0',
                aform: {
                    id: '',
                    importTaskId: '',
                    accountNo: '',
                    accountName: '',
                    idCard: '',
                    phone: '',
                    shouldAmount: '',
                    fund: ''
                },
                arules: {
                    accountNo: [
                        {
                            required: true,
                            message: '请填写收款方账号',
                            trigger: 'blur'
                        },
                        {
                            validator: checkNo,
                            trigger: 'blur'
                        }
                    ],
                    accountName: [
                        {
                            required: true,
                            message: '请填写收款方账号名称',
                            trigger: 'blur'
                        },
                        {
                            validator: checkName,
                            trigger: 'blur'
                        }
                    ],
                    idCard: [
                        {
                            required: true,
                            message: '请填写收身份证号',
                            trigger: 'blur'
                        }
                        // ,
                        // { 
                        //     validator: checkID,
                        //     trigger: 'blur'
                        // }
                    ],
                    phone: [
                        {
                            required: true,
                            message: '请填写手机号码',
                            trigger: 'blur'
                        },
                        { 
                            pattern: /^1[3-9]{1}\d{9}$/,
                            message: '请正确填写手机号码',
                            trigger: 'blur'
                        }
                    ],
                    shouldAmount: [
                        {
                            required: true,
                            message: '请填写实发金额',
                            trigger: 'blur'
                        },
                        {
                            pattern: /^\d+(\.\d{1,2})?$/,
                            message: '请正确填写实发金额',
                            trigger: 'blur'
                        },
                        {
                            validator: moreThenZero,
                            trigger: 'blur'
                        }
                    ],
                    fund: [
                        {
                            max: 10,
                            message: '款项属性备注最多10个字符'
                        }
                    ]
                },
                isEdit: false,
                date: 0,
                frame: '',
                validClose: false,
                warnClose: false,
                notConfirm: true
            }
       },
       mounted() {
            this.importTaskId = this.$route.query.taskId;
            this.aform.importTaskId = this.$route.query.taskId;
            Object.assign(this.formApp, this.$route.query)
       		this.success = '';
       		this.search();
            this.autoGetState()
            // this.width = (558 / window.innerWidth) * 100 + '%'
            // window.onresize = () => {
            //     this.width = (558 / window.innerWidth) * 100 + '%'
            // }
       },
       beforeDestroy() {
           cancelAnimationFrame(this.frame)
           console.log('destroy')
       },
       computed: {
            ...mapGetters({
            	passList: 'passList',
                unPassList: 'unPassList',
                importSalaryOrderFee: 'importSalaryOrderFee'
            })
        },
       watch: {
           importSalaryOrderFee() {
                !this.importSalaryOrderFee.validCount && cancelAnimationFrame(this.frame)
           }
       },
       methods: {
		 	search() {
		 		let currentPage = 1;
		 		let pageSize = 10;
		 		if(this.success){
		 			this.passCurrentPage = currentPage;
		 			this.passPageSize = pageSize;
		 		}else{
		 			this.unPassCurrentPage = currentPage;
		 			this.unPassPageSize = pageSize;
		 		}
		 		this.requestQuery({
                    page: currentPage,
                    pageSize: pageSize,
                });
           },
            passHandleSizeChange(value) {
                this.passPageSize = value;
                this.requestQuery({
                    page: 1,
                    pageSize: value,
                });
            },
            passHandleCurrentChange(value) {
                this.passCurrentPage = value;
                this.requestQuery({
                    page: value,
                    pageSize: this.passPageSize,
                });
            },
            unPassHandleSizeChange(value) {
                this.unPassPageSize = value;
                this.requestQuery({
                    page: 1,
                    pageSize: value,
                });
            },
            unPassHandleCurrentChange(value) {
                this.unPassCurrentPage = value;
                this.requestQuery({
                    page: value,
                    pageSize: this.unPassPageSize,
                });
            },
            requestQuery(pageInfo) {
                let param = {
                	importTaskId: this.importTaskId,
                    success: this.success,
                    page: pageInfo.page,
                    pageSize: pageInfo.pageSize
                };
                param = _.assign(param, this.formSearch)
                // if(this.success){
                this.$store.dispatch('getPassList', param);
				// }
				// else{
                // 	this.$store.dispatch('getUnPassList', param);
                // }
            },
            requestImportSalaryOrderFee() {
            	let param = {
                	importTaskId: this.importTaskId
                };
                this.$store.dispatch('getImportSalaryOrderFee', param);
            },
            autoGetState() {
                this.frame = requestAnimationFrame(this.autoGetState)
                if(new Date().getTime() - this.date > 1000 * 30) {
                    console.log('get')
                    this.date = new Date().getTime()
                    this.requestImportSalaryOrderFee()
                    this.search();
                }
            },
            clear(){
            	this.$refs['formSearch'].resetFields();
                this.search()
            },
            tabClick(tab, event) {
            	if(tab.name === "pass"){
            		this.success = '';
            	}else{
            		this.success = false;
            	}
		    	this.search();
		    },
            reUpload(){
                if(this.importSalaryOrderFee.validCount) {
                    return
                }
            	this.$confirm('重新上传将会清除原来的数据，是否确定要重新上传?', '提示', {
                	confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
	            	let param = {
	                	orderId: this.importTaskId
	                };
	            	post('/api/console-dlv/company/salary-online-order/delete-import-order', param).then(result => {
						this.$router.push('uploadSalary')
					})
	            })
            },
            cancel() {
            	this.$router.go(-2)
            },
            confirmOrder(){
                if(!this.passList.list.length) {
                    this.$message({
                        type: 'warning',
                        message: '请至少添加一条有效数据！'
                    })
                    return
                }
                if(this.importSalaryOrderFee.riskWarnCount && this.notConfirm) {
                    this.$confirm(`<span style='color: red;'>${this.importSalaryOrderFee.riskWarnCount}</span>位用户年/月/单笔收入金额超过<span style='color: red;'>${this.importSalaryOrderFee.taxLandingName}</span>当地风控限额，请注意`, '风控提示', {
                        dangerouslyUseHTMLString: true,
                    	confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.notConfirm = false
                        this.confirmOrder()
                    })
                    return
                }
            	let param = {
                    importTaskId: this.importTaskId,
                    channelType: JSON.parse(sessionStorage.getItem('orderMsg')).channelType
                };
            	post('/api/console-dlv/company/salary-online-order/create-salary-order',param)
                	.then(result => {
                	showNotify('success','操作成功！')
					sessionStorage.setItem('data', JSON.stringify({
						id: result.orderId,
						appId: result.appId
					}))
					this.$router.push('IssuingProcess');
                })
            },
            back() {
                this.$router.back()
            },
            add() {
                this.show = true
                this.isEdit = false
                for( var k in this.aform) {
                    this.aform[k] = ''
                }
                this.aform.importTaskId = this.importTaskId
                delete this.aform.id
            },
            addRow() {
                this.$refs['aform'].validate(valid => {
                    if(valid) {
                        post('/api/console-dlv/company/salary-online-order/insert-salary-order-item', this.aform).then(data => {
                            this.show = false
                            this.search()
                            this.$message({
                                type: 'success',
                                message: '添加成功！'
                            })
                            this.requestImportSalaryOrderFee()
                        })
                    }
                })
            },
            edit(a) {
                this.show = true
                this.isEdit = true
                for( var k in this.aform) {
                    if(k in a) {
                        this.aform[k] = a[k]
                    }
                }
                this.aform.id = a.id
            },
            editRow() {
                this.$refs['aform'].validate(valid => {
                    if(valid) {
                        post('/api/console-dlv/company/salary-online-order/update-salary-order-item', this.aform).then(data => {
                            this.show = false
                            this.search()
                            this.$message({
                                type: 'success',
                                message: '修改成功！'
                            })
                            this.requestImportSalaryOrderFee()
                        })
                    }
                })
            },
            deteleRow(a) {
                post(`/api/console-dlv/company/salary-online-order/delete-salary-order-item?id=${a.id}`).then(data => {
                    this.search()
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    })
                    this.requestImportSalaryOrderFee()
                })
            },
            downLoad() {
                if(this.importSalaryOrderFee.validCount) {
                    return
                }
                let param = {
                	importTaskId: this.importTaskId,
                    success: this.success
                };
                param = _.assign(param, this.formSearch)
                var url = ''
                for(var k in param) {
                    if(!url) {
                        url += `?${k}=${param[k]}`
                    }
                    else {
                        url += `&${k}=${param[k]}`
                    }
                }
                window.open(`/api/console-dlv/company/salary-online-order/download-import-salary-items${url}`)
            }
		}
  }
</script>
<style scoped>
.main {
    padding-bottom: 100px;
}
.top {
	background-color: #fff;
	margin-top: 18px;
    padding: 24px 30px;
    height: 190px;
}
/* .top > div:nth-child(1) {
	font-size: 18px;
	color: #333333;
	margin-bottom: 27px;
	font-weight: 600;
} */
.top_box {
	display: flex;
	justify-content: space-between;
	font-size: 14px;
}
.top_list {
	display: inline-block;
}
.top_item {
	margin-bottom: 36px;
}
.top_item > div {
	display: inline-block;
}
.top_item > div:nth-child(1) {
	color: #333;
}
.top_item > div:nth-child(2) {
	color: #666;
}
/* .myState {

} */
.myState > div:nth-child(1) {
	font-size: 14px;
	color: #999999;
	text-align: right;
	margin-bottom: 14px;
}
.myState > div:nth-child(2) {
	font-size: 18px;
	color: #178FFF;
	margin-bottom: 45px;
	text-align: right;
}
.bottom {
	margin-top: 24px;
	background-color: #fff;
	padding: 22px 33px;
}
.tool {
	text-align: right;
	margin-top: 8px;
	margin-bottom: 17px;
}
.aState {
    position: relative;
    display: block;
    width: 30px;
    height: 30px;
    margin: auto;
    background-size: 24px auto;
    background-repeat: no-repeat;
    background-position: center center;
}
/* .aState::before {
    content: '';
    position: relative;
    top: -2px;
    margin-right: 4px;
    display: inline-block;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: #000;
} */
.s1 {
	/* background-image: url(../../../image/check/icon01.png); */
}
.s0 {
    /* background-image: url(../../../image/check/icon10.png); */
}
.s0::before {
    content: '';
    position: absolute;
    display: inline-block;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid #409eff;
    animation: ripple 1.2s infinite;
    box-sizing: border-box;
    transform-origin: center center;
}
@keyframes  ripple{
    from {
            transform: scale(0.8);
            opacity: 1;
        }
    to {
            transform: scale(1);
            opacity: 0.2;
        }
}
.s-1 {
	/* background-image: url(../../../image/check/icon07.png); */
}
.svg-icon {
	position: relative;
	top: -2px;
}
#pay {
  /* position: fixed;
  right: 0px;
  bottom: 0px; */
  background-color: #fff;
  height: 100px;
  width: 100%;
  z-index: 10;
  box-shadow: 0px -2px 2px #eee;
  transition: width 0.28s;
  margin-top: 40px;
}
.pay_btn {
  width: 120px;
  height: 40px;
  line-height: 15px;
  border-radius: 4px;
  font-size: 18px;
  /* margin-top: 27px;
  margin-left: 33px; */
}
.pay_left {
  /* float: right; */
  /* text-align: right; */
  display: inline-block;
  margin: 25px 20px;
  width: 500px;
}
.pay_left > div {
  font-size: 16px;
  color: #666666;
}
.pay_left > div:nth-child(1) {
  margin-bottom: 12px;
}
.pay_left > div > span {
  display: inline-block;
  width: 160px;
  text-align: left;
  font-size: 20px;
  color: #F27346;
}
.pay_right {
  float: right;
  margin: 25px 30px;
}
.mb32 {
    margin-bottom: 32px;
}
.block {
    margin: 0px auto;
    display: block;
}
.isErr {
    color: #FF5500;
}
.mb8 {
    margin-bottom: 8px;
}
.form_300 {
    width: 300px;
}
.a-info {
    background-color: #E6F3FC;
    color: #666;
}
.a-info .el-icon-warning {
    color: #108FEB;
}

.form_btn40{
    vertical-align: bottom;
}
</style>