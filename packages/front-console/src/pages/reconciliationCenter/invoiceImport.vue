<template>
    <div class="main-container">
        <div class="mb30">纸票导入列表</div>
        <div class="handle">
            <div>
                <el-button type="primary" @click="show = true">{{listData.list ? '重新' : '本地'}}上传</el-button>
            </div>
            <div>
                <span class="result">
                    校验通过：{{stateResult.success}}个<br>
                    校验不通过：{{stateResult.failure}}个
                </span>
                <!-- <el-button>导出校验结果</el-button> -->
            </div>
        </div>
        <el-table class="mt20" :data="listData.list">
            <el-table-column label="客户名称" prop="customCompanyName"></el-table-column>
            <el-table-column label="税额" prop="taxAmount"></el-table-column>
            <el-table-column label="金额" prop="money"></el-table-column>
            <el-table-column label="计税合计" prop="amount"></el-table-column>
            <el-table-column label="开票类目" prop="subjectName"></el-table-column>
            <el-table-column label="发票类型" prop="invoiceTypeName"></el-table-column>
            <el-table-column label="落地公司" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="发票代码" prop="invoiceCode"></el-table-column>
            <el-table-column label="发票号码" prop="invoiceNo"></el-table-column>
            <el-table-column label="开票时间" prop="issueDate"></el-table-column>
            <el-table-column label="校验结果" prop="validateResult">
                <template slot-scope="scope">
                    <span :class="`${scope.row.validateResult == '通过' ? '' : 'red'}`">{{scope.row.validateResult}}</span>
                </template>
            </el-table-column>
            <el-table-column label="备注" prop="remark"></el-table-column>
        </el-table>
        <ayg-pagination
            v-if="listData.total"
            :total="listData.total"
            v-on:handleSizeChange="sizeChange"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
        <div class="bottom mt20">
            <el-button @click="$router.back()">取消</el-button>
            <el-button :class="`${(!referId || stateResult.failure) ? 'disable' : ''}`" type="primary" @click="submit">提交</el-button>
        </div>
        <el-dialog :title="`${listData.list ? '重新' : '本地'}上传`" :visible.sync="show" @open="pro = 0" width="800px">
            <div class="dbox">
                <div class="ditem">
                    <div>下载模板文件：</div>
                    <div>
                        <a class="abtn" href="/api/invoice-web/invoice/download-invoice-detail-import-template" download="发票明细批量导入模板.xlsx" target="_blank">下载模板</a>
                        <div>请先下载纸票导入模板</div>
                    </div>
                </div>
                <div class="ditem">
                    <div>上传文件导入：</div>
                    <div>
                        <el-upload
                            class="form_input"
                            :action="`/api/econtract/template/parsefile`"
                            :auto-upload="false"
                            :on-change="upload"
                            :multiple="false"
                            :show-file-list="false"
                            accept=".xlsx, .xls">
                            <div class="up_icon">
                                <div>点击这里上传</div>
                                <div>请上传小于5M的xls或xlsx格式文件</div>
                            </div>
                        </el-upload>
                        <template v-if="pro">
                            <div class="pro_box">
                                <div :style="{ 'width': `${pro}%` }"></div>
                            </div>
                            <span>{{pro}}%</span>
                        </template>
                    </div>
                </div>
            </div>
            <span slot="footer">
                <el-button size="small" @click="show = false">关闭</el-button>
                <el-button type="primary" size="small" @click="show = false">确定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
export default {
    data() {
        return {
            show: false,
            form: {
                page: 1,
                pageSize: 10,
                taskId: ''
            },
            referId: '',
            isEnd: true,
            date: '',
            frame: '',
            pro: 0,
            listData: {},
            stateResult: {
                failure: 0,
                success: 0
            }
        }
    },
    mounted() {
        
    },
    methods: {
        upload(a) {
            var form = new FormData();
            form.append("fileName", a.name);
            form.append("file", a.raw);
            form.append("targetType", "invoice-detail-import")
            formPost("/api/sysmgr-web/file/upload", form).then(data => {
                this.referId = data.referId
                this.progress()
            });
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
                    if (this.pro == 100) {
                        cancelAnimationFrame(this.frame)
                        if(data.state == 30 || data.state == 20) {
                            this.form.taskId = data.taskId
                            this.show = false
                            this.query()
                            this.getStatus()
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
            get('/api/invoice-web/invoice/invoice-detail-page', this.form).then(data => {
                this.listData = data
            })
        },
        sizeChange(a) {
            this.form.pageSize = a
            this.query()
        },
        getStatus() {
            get(`/api/invoice-web/invoice/invoice-detail-statistics?taskId=${this.referId}`).then(data => {
                this.stateResult = data
            })
        },
        submit() {
            if(!this.referId || this.stateResult.failure) {
                return
            }
            this.$confirm(`您确认要导入${this.listData.total}张纸票吗？`, '', {
                confirmButtonText: '确定',
                cancelButtonText: '取消'
            }).then(data => {
                post(`/api/invoice-web/invoice/invoice-detail-sync?taskId=${this.referId}`).then(data => {
                    this.$router.back()
                })
            }).catch(err => {})
        }
    }
}
</script>
<style scoped>
.main-container {
    background-color: #fff;
    padding: 15px;
}
.mb30 {
    margin-bottom: 30px;
}
.handle {
    display: flex;
    justify-content: space-between;
}
.mt20 {
    margin-top: 20px;
}
.bottom {
    display: flex;
    padding: 0px calc(50% - 100px);
    justify-content: space-between;
}
.form_input {
    width: 450px;
}
.dbox {
    font-size: 14px;
    color: #666666;
}
.ditem {
    overflow: hidden;
    margin-bottom: 35px;
}
.ditem > div {
    float: left;
}
.abtn {
    display: inline-block;
    width: 80px;
    height: 22px;
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    background-image: url(../../image/download.png);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 7px center;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    text-indent: 22px;
    line-height: 20px;
}
.abtn + div {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
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
.result {
    position: relative;
    top: 12px;
    margin-right: 20px;
    font-size: 12px;
}
.red {
    color: red;
}
.disable {
    filter: grayscale(1);
}
</style>
