<template>
  <div class="main-container">
    <div style="margin-bottom:30px;">返回码管理</div>
    <el-form :model="form" :inline="true" ref="form">
			<el-form-item label="类型" prop="bizType">
	    	<el-select size="small" filterable v-model="form.bizType">
	    		<el-option label="全部" value=""></el-option>
	    		<el-option v-for="list in bizTypeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
	    	</el-select>
	    </el-form-item>
	
	    <el-form-item label="渠道" prop="paymentThirdType">
	    	<el-select size="small" filterable v-model="form.paymentThirdType">
	    		<el-option label="全部" value=""></el-option>
	    		<el-option v-for="list in paymentThirdTypeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
	    	</el-select>
	    </el-form-item>
	
		  <el-form-item label="错误码" prop="errCode">
	        <!--<el-input v-model="form.errCode"></el-input>-->
	        <el-select size="small" filterable v-model="form.errCode">
		    		<el-option label="全部" value=""></el-option>
		    		<el-option v-for="list in errCodeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
	    		</el-select>
	    </el-form-item>
	
			<el-form-item label="渠道反馈" prop="originErrMsg">
	        <el-input v-model="form.originErrMsg"></el-input>
	    </el-form-item>
	
			<el-form-item label="是否重试" prop="isRetry">
				<el-select size="small" filterable v-model="form.isRetry">
	        <el-option label="全部" value=""></el-option>
	    		<el-option label="重试" :value="1" :key="1"></el-option>
	    		<el-option label="不重试" :value="0" :key="0"></el-option>
	    	</el-select>
	    </el-form-item>
	
			<el-form-item label="分类" prop="reasonType">
				<el-select size="small" filterable v-model="form.reasonType">
	        <el-option label="全部" value=""></el-option>
	    		<el-option v-for="list in reasonTypeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
	    	</el-select>
	    </el-form-item>
	
			<el-form-item label="更新时间">
	        <el-date-picker
	            size="small"
	            v-model="range"
	            type="daterange"
	            start-placeholder="开始日期"
	            end-placeholder="结束日期"
	            value-format='yyyy-MM-dd'
	            @change="getTime">
	        </el-date-picker>
	    </el-form-item>
	    <el-form-item>
	        <el-button size="small" type="primary" @click="query">查询</el-button>
	        <el-button size="small" @click="reset">清除</el-button>
	        <el-button size="small" @click="exportDetail">导出</el-button>
	    </el-form-item>
		</el-form>
    <el-button size="small" type="primary" @click="addPayOrderErrCode()">添加</el-button>

    <div class="table-container">
      <el-table :data="data.list">
        <el-table-column prop="bizType" label="类型" width="50"></el-table-column>
        <el-table-column prop="paymentThirdType" label="渠道" width="80"></el-table-column>
        <el-table-column prop="errCode" label="错误码" width="80"></el-table-column>
        <el-table-column prop="originErrMsg" label="渠道反馈" width="200"></el-table-column>
        <el-table-column prop="errMsg" label="前端转义" width="200"></el-table-column>
        <el-table-column prop="isRetry" label="是否重试" width="80"></el-table-column>
        <el-table-column prop="reasonType" label="分类" width="80"></el-table-column>
        <el-table-column prop="remark" label="备注" width="120"></el-table-column>
        <el-table-column prop="createAt" label="创建时间" width="88"></el-table-column>
        <el-table-column prop="updateAt" label="更新时间" width="88"></el-table-column>
        <el-table-column prop="updateByName" label="更新人" width="80"></el-table-column>

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
          	<el-button size="small" @click="updateErrCode(scope)">更新</el-button>
            <el-button @click="doDelete(scope.row.id)" size="small">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <ayg-pagination
        :total="data.total"
        :currentPage="form.page"
        v-on:handleSizeChange="setSize"
        v-on:handleCurrentChange="query">
    </ayg-pagination>
    
    <el-dialog title="" :visible.sync="saveDialogVisible" width="60%" @close="closeCreateDialog">
        <el-form class="small-space" :rules="addRules" :model="addPostForm" ref="addPostForm" label-position="left"
                 label-width="140px" style='margin-left:20px;margin-right: 20px'>
            <el-row :gutter="20">
                <el-col :span="12">
                    <el-form-item label="类型:" size="small" prop="bizType">
                        <el-select size="small" filterable v-model="addPostForm.bizType">
									    		<!--<el-option label="全部" value=""></el-option>-->
									    		<el-option v-for="list in bizTypeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
									    	</el-select>
                    </el-form-item>
                    <el-form-item label="渠道:" size="small" prop="paymentThirdType">
                        <el-select size="small" filterable v-model="addPostForm.paymentThirdType">
										    		<!--<el-option label="全部" value=""></el-option>-->
										    		<el-option v-for="list in paymentThirdTypeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
										    	</el-select>
                    </el-form-item>
                    <el-form-item label="错误码:" size="small" prop="errCode">
                        <!--<el-input style="width: 450px" v-model="addPostForm.errCode" placeholder="错误码"></el-input>-->
                        <el-select size="small" filterable v-model="addPostForm.errCode">
									    		<!--<el-option label="全部" value=""></el-option>-->
									    		<el-option v-for="list in errCodeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
								    		</el-select>
                    </el-form-item>
                    <el-form-item label="渠道反馈:" size="small" prop="originErrMsg">
                        <textarea style="width: 450px" v-model="addPostForm.originErrMsg" placeholder="渠道反馈"></textarea>
                    </el-form-item>
                    <el-form-item label="前端转义:" size="small" prop="errMsg">
                        <textarea style="width: 450px" v-model="addPostForm.errMsg" placeholder="前端转义"></textarea>
                    </el-form-item>
                    <el-form-item label="是否重试:" size="small" prop="isRetry">
                        <el-select size="small" filterable v-model="addPostForm.isRetry">
										        <!--<el-option label="全部" value=""></el-option>-->
										    		<el-option label="重试" value="1" key="1"></el-option>
										    		<el-option label="不重试" value="0" key="0"></el-option>
										    	</el-select>
                    </el-form-item>
                    <el-form-item label="分类:" size="small" prop="reasonType">
                        <el-select size="small" filterable v-model="addPostForm.reasonType">
										        <!--<el-option label="全部" value=""></el-option>-->
										    		<el-option v-for="list in reasonTypeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
										    	</el-select>
                    </el-form-item>
                    <el-form-item label="备注:" size="small" prop="remark">
                        <textarea style="width: 450px" v-model="addPostForm.remark" placeholder="备注"></textarea>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="saveDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doAdd">确定</el-button>
        </div>
    </el-dialog>
    
    <el-dialog title="" :visible.sync="updateDialogVisible" width="60%" @close="closeCreateDialog">
        <el-form class="small-space" :rules="updateRules" :model="updatePostForm" ref="updatePostForm" label-position="left"
                 label-width="140px" style='margin-left:20px;margin-right: 20px'>
            <el-row :gutter="20">
                <el-col :span="12">
	                	<el-form-item label="主键:" size="small" prop="id" v-show="false" >
	                		<el-input style="width: 450px" v-model="updatePostForm.id"></el-input>		
	                	</el-form-item>
                    <el-form-item label="类型:" size="small" prop="bizType">
                        <el-select size="small" filterable v-model="updatePostForm.bizType" :disabled="true">
									    		<!--<el-option label="全部" value=""></el-option>-->
									    		<el-option v-for="list in bizTypeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
									    	</el-select>
                    </el-form-item>
                    <el-form-item label="渠道:" size="small" prop="paymentThirdType">
                        <el-select size="small" filterable v-model="updatePostForm.paymentThirdType" :disabled="true">
										    		<!--<el-option label="全部" value=""></el-option>-->
										    		<el-option v-for="list in paymentThirdTypeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
										    	</el-select>
                    </el-form-item>
                    <el-form-item label="错误码:" size="small" prop="errCode">
                        <el-select size="small" filterable v-model="updatePostForm.errCode">
									    		<!--<el-option label="全部" value=""></el-option>-->
									    		<el-option v-for="list in errCodeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
								    		</el-select>
                    </el-form-item>
                    <el-form-item label="渠道反馈:" size="small" prop="originErrMsg">
                        <textarea style="width: 450px" v-model="updatePostForm.originErrMsg" placeholder="渠道反馈" :disabled="true"></textarea>
                    </el-form-item>
                    <el-form-item label="前端转义:" size="small" prop="errMsg">
                        <textarea style="width: 450px" v-model="updatePostForm.errMsg" placeholder="前端转义"></textarea>
                    </el-form-item>
                    <el-form-item label="是否重试:" size="small" prop="isRetry">
                        <el-select size="small" filterable v-model="updatePostForm.isRetry">
										        <!--<el-option label="全部" value=""></el-option>-->
										    		<el-option label="重试" value="1" key="1"></el-option>
										    		<el-option label="不重试" value="0" key="0"></el-option>
										    	</el-select>
                    </el-form-item>
                    <el-form-item label="分类:" size="small" prop="reasonType">
                        <el-select size="small" filterable v-model="updatePostForm.reasonType" lable="请选择">
										        <!--<el-option label="全部" value=""></el-option>-->
										    		<el-option v-for="list in reasonTypeList" :key="list.value" :value="list.value" :label="list.text"></el-option>
										    	</el-select>
                    </el-form-item>
                    <el-form-item label="备注:" size="small" prop="remark">
                        <textarea style="width: 450px" v-model="updatePostForm.remark" placeholder="备注"></textarea>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="updateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="doUpdate">确定</el-button>
        </div>
    </el-dialog>
    
    
  </div>
</template>

<script>
import { post, get } from "../../store/api";
import optionModel from '../../model/option/optionModel.js'
import {showLoading, hideLoading} from '../../plugin/utils-loading'
import StatisticsBox from '../../component/statisticsBox.vue'
import {showNotify} from "../../plugin/utils-notify";
export default {
	components: {
        StatisticsBox
  },
  data() {
  	var time = new Date(),
          time_0 = new Date(time.getTime() - 1000 * 60 * 60 * 24 * 7), 
          t = `${time.getFullYear()}-${time.getMonth() + 1 > 9 ? time.getMonth() + 1 : '0' + (time.getMonth() + 1)}-${time.getDate()}`,
          t_0 = `${time_0.getFullYear()}-${time_0.getMonth() + 1 > 9 ? time_0.getMonth() + 1 : '0' + (time_0.getMonth() + 1)}-${time_0.getDate()}`
		const validateRequire = (rule, value, callback) => {
        if (!value) {
            callback(new Error(rule.label + '为必传项'))
        } else {
            callback()
        }
    }
    return {
      form: {
          errCode:"",
          errMsg:"",
          originErrCode:"",
          originErrMsg:"",
          paymentThirdType:"",
          bizType:"",
          isRetry:"",
          reasonType:"",
          remark:"",
          updateStartAt:"",
          updateEndAt:"",
          page:1,
          pageSize:10
      },
      addPostForm:{
      		errCode:"",
          errMsg:"",
          originErrCode:"",
          originErrMsg:"",
          paymentThirdType:"",
          bizType:"",
          isRetry:"",
          reasonType:"",
          remark:"",
          updateStartAt:"",
          updateEndAt:"",
      },
      addRules:{
      	errCode: [{required: true, validator: validateRequire, label: '错误码'}],
	      errMsg:[{required: true, validator: validateRequire, label: '前端转义'}],
	      originErrMsg:[{required: true, validator: validateRequire, label: '渠道反馈'}],
	      paymentThirdType:[{required: true, validator: validateRequire, label: '渠道'}],
	      bizType:[{required: true, validator: validateRequire, label: '类型'}],
	      isRetry:[{required: true, validator: validateRequire, label: '是否重试'}],
	      reasonType:[{required: true, validator: validateRequire, label: '分类'}],
      },
      updatePostForm:{
      		id:"",
      		errCode:"",
          errMsg:"",
          originErrCode:"",
          originErrMsg:"",
          paymentThirdType:"",
          bizType:"",
          isRetry:"",
          reasonType:"",
          remark:"",
          updateStartAt:"",
          updateEndAt:"",
      },
      updateRules:{
      	id: [{required: true, validator: validateRequire, label: '主键'}],
      	errCode: [{required: true, validator: validateRequire, label: '错误码'}],
	      errMsg:[{required: true, validator: validateRequire, label: '前端转义'}],
	      isRetry:[{required: true, validator: validateRequire, label: '是否重试'}],
	      reasonType:[{required: true, validator: validateRequire, label: '分类'}],
      },
//    range: [t_0, t],
			range:[],
      formSearch: {
        accountInfo: "",
        subjectId: ''
      },
      data:[],
      activeData: "",
      reasonTypeList:[],
			bizTypeList:[],
			paymentThirdTypeList:[],
			isRetryList:[],
			saveDialogVisible:false,
			updateDialogVisible:false,
			errCodeList:[],
	  };
	},
  mounted() {
    get('/api/sysmgr-web/commom/option-enum-list?enumType=PayOrderErrCodeReasonType').then(data => {
        this.reasonTypeList = data
    })
    get('/api/sysmgr-web/commom/option-enum-list?enumType=PayOrderErrCodeBizType').then(data => {
        this.bizTypeList = data
    })
    get('/api/sysmgr-web/commom/option-enum-list?enumType=PayOrderErrCodeRetryState').then(data => {
        this.isRetryList = data
    })
    get('/api/sysmgr-web/commom/option?enumType=ChannelType').then(data => {
        this.paymentThirdTypeList = data
    })
    get('/api/sysmgr-web/commom/option-enum-list?enumType=PayOrderErrBusinessCodeEnum').then(data => {
        this.errCodeList = data
    })
    this.query()
    this.getTime()
  },
  methods: {
    setSize(a) {
        this.form.pageSize = a
        this.query()
    },
    reset() {
      //   console.log(this.$refs['form'])
        this.$refs['form'].resetFields()
        this.range = []
        this.form.updateStartAt = ''
        this.form.updateEndAt = ''
    },
    getTime() {
        if(this.range && this.range.length) {
            this.form.updateStartAt = this.range[0]
            this.form.updateEndAt = this.range[1]
        }
        else {
            this.form.updateStartAt = ''
            this.form.updateEndAt = ''
        }
    },
    query(a) {
        if(isNaN(a)) {
            a = 1
        }
        this.form.page = a
        post('/api/console-dlv/pay-order-err/list', this.form).then(data => {
            this.data = data
        })
    },
    addPayOrderErrCode(){
    	this.saveDialogVisible = true;
    },
    updateErrCode(scope){
    	var rowData = scope.row;
    	this.updatePostForm.id = rowData.id;
    	this.updatePostForm.errCode = rowData.errCode
    	this.updatePostForm.errMsg = rowData.errMsg
    	this.updatePostForm.originErrCode = rowData.originErrCode
    	this.updatePostForm.originErrMsg = rowData.originErrMsg
    	this.updatePostForm.paymentThirdType = this.getEnumData(this.paymentThirdTypeList,rowData.paymentThirdType)
    	this.updatePostForm.bizType = this.getEnumData(this.bizTypeList,rowData.bizType)
    	this.updatePostForm.isRetry = this.getEnumData(this.isRetryList,rowData.isRetry)
    	this.updatePostForm.reasonType = this.getEnumData(this.reasonTypeList,rowData.reasonType)
    	this.updatePostForm.remark = rowData.remark
    	this.updateDialogVisible =true;
    },
  	exportDetail() {
        showLoading('请稍等...')
        var param = JSON.parse(JSON.stringify(this.form))
        delete param.page
        delete param.pageSize
        get('/api/console-dlv/pay-order-err/export-list', param, true).then(data => {
            this.downloadCode = data
            this.interval = setInterval(() => {
                get('/api/console-dlv/file/check-export', {
                    downloadCode: this.downloadCode
                }, true).then(res => {
                    if(res) {
                        clearInterval(this.interval)
                        hideLoading()
                        location.href = `/api/console-dlv/file/download-export?downloadCode=${this.downloadCode}`
                    }
                })
            }, 1000 * 1)
        })
    },
    resetCreatePostForm() {
        this.addPostForm = {
            errCode:"",
			      errMsg:"",
			      originErrCode:"",
			      originErrMsg:"",
			      paymentThirdType:"",
			      bizType:"",
			      isRetry:"",
			      reasonType:"",
			      remark:"",
			      updateStartAt:"",
			      updateEndAt:"",
        };
    },
    doAdd() {
        this.$refs['addPostForm'].validate(valid => {
            if (valid) {
                post('/api/console-dlv/pay-order-err/saveOrUpdate', this.addPostForm).then(data => {
                		this.query();
                    showNotify('success', '操作成功!');
                    this.resetCreatePostForm();
                    this.saveDialogVisible = false;
                    this.requestAction({
                        page: 1,
                        pageSize: this.pageSize,
                    });
                });
            }
        })
    },
    doUpdate() {
        this.$refs['updatePostForm'].validate(valid => {
            if (valid) {
                post('/api/console-dlv/pay-order-err/saveOrUpdate', this.updatePostForm).then(data => {
                		this.query();
                    showNotify('success', '操作成功!');
                    this.updateDialogVisible = false;
                    this.requestAction({
                        page: 1,
                        pageSize: this.pageSize,
                    });
                });
            }
        })
    },
    doDelete(id){
    	this.$confirm('是否确认删除？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(() => {
        post('/api/console-dlv/pay-order-err/del', {
            id,
        }).then(data => {
            this.query()
            this.$message({
                type: 'success',
                message: '删除成功！'
            })
        })
    }).catch(() => {})
    },
    getEnumData(enumData,textValue){
    	var value = "";
    	enumData.forEach(data=>{
    		if(data.text==textValue){
    			value = data.value;
    			return true;
    		}
    	})
    	return value;
    },
    closeCreateDialog(){
    	this.saveDialogVisible = false;
    	this.updateDialogVisible = false;
    }
    }
};
</script>

<style lang="scss" scoped>
.main-container {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 30px;
}

.table-container {
  width: 100%;
  margin-top: 20px;
}
</style>














