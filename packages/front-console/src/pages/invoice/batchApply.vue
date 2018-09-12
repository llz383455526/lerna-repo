<template>
    <div class="content">
        <div>发票批量申请</div>
        <el-button size="small" type="primary" @click="show = true">{{form.importTaskId ? '重新上传' : '本地上传'}}</el-button>
        <template v-if="form.importTaskId">
            <el-button size="small" @click="form.isSuccess = ''; query()">查看全部</el-button>
            <el-button size="small" @click="form.isSuccess = true; query()">上传成功{{successCount}}个 | 查看</el-button>
            <el-button size="small" @click="form.isSuccess = false; query()">上传失败<span style="color: red;">{{failCount}}</span>个 | 查看</el-button>
        </template>
        <!-- <el-button size="small" style="float: right;">导出校验结果</el-button> -->
        <el-table :data="data" class="table">
            <!-- <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button size="small" type="text">删除</el-button>
                </template>
            </el-table-column> -->
            <el-table-column label="发票备注" prop="remark">
				<template slot-scope="scope">
					<span :class="{ invalid:  scope.row.errMsg && 'remark' in scope.row.errMsg}">{{scope.row.remark}}</span>
				</template>
			</el-table-column>
            <el-table-column label="商户名称" prop="customCompanyName">
				<template slot-scope="scope">
					<span :class="{ invalid:  scope.row.errMsg && 'customCompanyName' in scope.row.errMsg}">{{scope.row.customCompanyName}}</span>
				</template>
			</el-table-column>
            <el-table-column label="金额" prop="amount">
				<template slot-scope="scope">
					<span :class="{ invalid:  scope.row.errMsg && 'amount' in scope.row.errMsg}">{{scope.row.amount}}</span>
				</template>
			</el-table-column>
            <el-table-column label="开票类目" prop="subjectName">
				<template slot-scope="scope">
					<span :class="{ invalid:  scope.row.errMsg && 'subjectName' in scope.row.errMsg}">{{scope.row.subjectName}}</span>
				</template>
			</el-table-column>
            <el-table-column label="发票类型" prop="invoiceTypeName">
				<template slot-scope="scope">
					<span :class="{ invalid:  scope.row.errMsg && 'invoiceTypeName' in scope.row.errMsg}">{{scope.row.invoiceTypeName}}</span>
				</template>
			</el-table-column>
            <el-table-column label="落地公司" prop="serviceCompanyName">
				<template slot-scope="scope">
					<span :class="{ invalid:  scope.row.errMsg && 'serviceCompanyName' in scope.row.errMsg}">{{scope.row.serviceCompanyName}}</span>
				</template>
			</el-table-column>
            <el-table-column label="发票用途" prop="purpose">
				<template slot-scope="scope">
					<span :class="{ invalid:  scope.row.errMsg && 'purpose' in scope.row.errMsg}">{{scope.row.purpose}}</span>
				</template>
			</el-table-column>
            <el-table-column label="校验结果" prop="errMsg">
              <template slot-scope="scope">
                <span v-if="!scope.row.errMsg" class="pass">通过</span>
                <span v-else class="invalid">不通过</span>
              </template>
            </el-table-column>
            <el-table-column label="备注" prop="errMsg">
				<template slot-scope="scope">
					<div v-for="err in scope.row.errMsg" class="invalid">{{err}}</div>
				</template>
			</el-table-column>
        </el-table>
        <!-- <el-pagination
            class="page"
            background
            layout="prev, pager, next"
            :page-size="form.pageSize"
            :total="total"
            @current-change="query"
            :currentPage="form.page">
        </el-pagination> -->
        <ayg-pagination 
            v-if="total"
            :total="total"
            :currentSize="form.pageSize"
            v-on:handleSizeChange="SizeChange"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
        <div class="footer">
            <el-button size="small" @click="back">取消</el-button>
            <el-button size="small" type="primary" @click="myConfirm" :class="{disable: total != successCount}">提交申请</el-button>
        </div>

        <el-dialog :title="form.importTaskId ? '重新上传' : '本地上传'" :visible.sync="show" width="35%">
			<div class="mtitle">下载模板</div>
        	<div>
        	    <a class="download" href="/api/invoice-web/invoice/download-invoice-import-template" download="导入模板.xlsx" target="_blank">
        	        <el-button size="small">
        	            下载模板
        	        </el-button>
        	    </a>
        	    <span>发票批量申请下载模板</span>
        	</div>
        	<div class="mtitle">上传发票申请文件</div>
        	<div>
        	    <el-upload
        	      class="form_input"
        	      :action="`/api/econtract/template/parsefile`"
        	      :auto-upload="false"
        	      :on-change="upload"
        	      :on-remove="remove"
        	      :multiple="false"
        	      :show-file-list="false"
        	      accept=".xlsx, .xls">
        	        <div class="up_icon">
        	            <div>点击这里上传</div>
        	            <div>请上传小于5M的xls或xlsx格式文件</div>
        	        </div>
        	    </el-upload>
        	    <div class="pro_box">
					<div :style="{ 'width': `${pro}%` }"></div>
				</div>
        	    <span>{{pro}}%</span>
        	</div>
        	<div class="footer">
        	    <el-button size="small" @click="show = false">取消</el-button>
        	    <!-- <el-button size="small" type="primary" @click="sure" :class="{disable: !taskId}">确认</el-button> -->
        	</div>
        </el-dialog>
    </div>
</template>
<script>
import { post, get, importPost } from "../../store/api";
export default {
  data() {
    return {
      form: {
        importTaskId: 0,
        isSuccess: '',
        page: 0,
        pageSize: 10,
      },
      total: 0,
      successCount: 0,
      failCount: 0,
      data: [],
	  show: false,
	  pro: 0,
      referId: '',
      frame: '',
      date: '',
      isEnd: true
    };
  },
  mounted() {
    //   console.log(this.$route)
    //   Object.assign(this.form, this.$route.query)
    //   console.log(this.form)
    //   this.query()
  },
  methods: {
	upload(a) {
        var formData = new FormData()
        formData.append('targetType', 'invoice_apply_import')
        formData.append('fileName', a.name)
        formData.append('file', a.raw)
        importPost('/api/sysmgr-web/file/upload', formData, true).then(data => {
            this.referId = data.referId
            this.progress()
            console.log(data)
        })
    },
    progress() {
        this.frame = requestAnimationFrame(this.progress)
		if(this.isEnd && (!this.date || this.date < new Date().getTime() - 1000)) {
            this.isEnd = false
			post('/api/sysmgr-web/file/progress', {
				id: this.referId
			}, true).then(data => {
                this.isEnd = true
				this.date = new Date().getTime()
                this.pro = data.progress
                console.log(data.progress)
				if (this.pro == 100) {
                    cancelAnimationFrame(this.frame)
					if(data.state == 30 || data.state == 20) {
	    				this.form.importTaskId = data.taskId;
						this.$message({
            		    	type: 'success',
            		    	message: '上传成功！'
						})
						this.show = false
						this.query()
					}
					if(data.state == 40) {
						this.$message.error(data.desc)
					}
				}
			})
		}
    },
    query(a) {
        if(isNaN(a)) {
            a = 1
        }
        this.form.page = a
        post('/api/invoice-web/invoice//invoice-import-list', this.form).then((data) => {
            console.log(data)
            // console.log(this.form.isSuccess === '')
            this.total = data.total
            this.successCount = data.successCount
            this.failCount = data.failCount
            this.data = data.list
            console.log(this.total)
        })
    },
    SizeChange(a) {
        this.form.pageSize = a
        this.query()
    },
    back() {
      this.$router.push("list");
    },
    myConfirm() {
		if(this.total != this.successCount) {
			return
		}
      	this.$confirm(`您确认要提交${this.total}个发票申请吗？`, "确认提交", {
      	  confirmButtonText: "确认提交",
      	  cancelButtonText: "关闭",
      	  type: "warning"
      	})
        .then(() => {
			post('/api/invoice-web/invoice/invoice-import-submit', {
				importTaskId: this.form.importTaskId
			}).then((data) => {
				this.$message({
					type: "success",
					message: "提交成功！"
				});
				this.$router.push('list')
			})
        }).catch(() => {});
    }
  }
};
</script>
<style scoped>
.content {
  background-color: #fff;
  padding: 20px 30px;
}
.content > div:nth-child(1) {
  font-size: 24px;
  margin-bottom: 30px;
}
.table {
  clear: both;
  margin-top: 20px;
}
.page {
  float: right;
  margin: 20px 0px 30px;
}
.footer {
  clear: both;
  text-align: right;
}
.pass {
  color: green;
}
.invalid {
  color: red;
}
/* .disable {
    cursor: not-allowed;
    filter: grayscale(1);
} */
.mtitle {
  font-size: 16px;
  color: #333;
  text-indent: 15px;
  margin-top: 30px;
  margin-bottom: 30px;
  position: relative;
}
.mtitle::after {
  content: "";
  position: absolute;
  left: 0;
  top: 4px;
  width: 4px;
  height: 15px;
  background: #108EE9;
}
.mtitle + div {
    padding-left: 30px;
}
.download + span {
  font-size: 14px;
}
.form_input {
    width: 400px;
}
.up_icon {
    width: 228px;
    height: 124px;
    background-image: url(../../image/upload.png);
    background-size: 41px 33px;
    background-position: center 20px;
    background-repeat: no-repeat;
    padding-top: 70px;
    border: 1px solid #D9D9D9;
}
.up_icon > div:nth-child(1) {
    text-align: center;
    font-size: 12px;
    color: #666666;
}
.up_icon > div:nth-child(2) {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
.pro_box {
	position: relative;
	display: inline-block;
	width: 193px;
	height: 10px;
	border: 1px solid #E9E9E9;
	border-radius: 5px;
	margin-top: 6px;
}
.pro_box > div {
	position: absolute;
	top: 1px;
	left: 0;
	height: 8px;
	border-radius: 4px;
	background-color: #108EE9;
}
.pro_box + span {
	margin-top: 6px;
	font-size: 12px;
	color: #999999;
}
.footer {
    margin-top: 30px;
}
.disable {
    cursor: not-allowed;
    filter: grayscale(1);
}
</style>
