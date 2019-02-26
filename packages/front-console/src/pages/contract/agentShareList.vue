<template>
    <div class="r_main">
        <el-breadcrumb>
            <el-breadcrumb-item>
                代理商分润制单
            </el-breadcrumb-item>
        </el-breadcrumb>
        <el-form :model="form" class="form" :inline="true" size="small" ref="form">
            <el-form-item label="出账月份" prop="companyName">
                <el-input class="form_input" v-model="form.companyName"></el-input>
            </el-form-item>
            <el-form-item label="结算月份" prop="status">
                <el-select class="form_input" v-model="form.status">
                    <el-option v-for="e in statusList" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="资金状态" prop="companyName">
                <el-input class="form_input" v-model="form.companyName"></el-input>
            </el-form-item>
            <el-form-item label="代理商名" prop="status">
                <el-select class="form_input" v-model="form.status">
                    <el-option v-for="e in statusList" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="服务公司" prop="companyName">
                <el-input class="form_input" v-model="form.companyName"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="query">查询</el-button>
                <el-button @click="$refs['form'].resetFields()">重置</el-button>
                <el-button>导出</el-button>
            </el-form-item>
        </el-form>
        <div class="t_head">未结清渠道分润：￥10,000.000<span class="red">(被冻结 ￥2,000.00)<i class="el-icon-question" title="客户费用未结清，渠道分润资金被冻结返还（客户公司费用=应收客户费用-预收客户费用）；结清后，渠道分润将解冻返还。"></i></span>结清渠道分润：￥85,000.000</div>
        <el-table class="table" :data="data.list">
            <el-table-column label="出账月份" prop="contractNo"></el-table-column>
            <el-table-column label="服务公司" prop="companyName"></el-table-column>
            <el-table-column label="代理商名称" prop="companyName"></el-table-column>
            <el-table-column label="结算区间" prop="agentStart"></el-table-column>
            <el-table-column label="渠道结算报价%" prop="quoteFeeName"></el-table-column>
            <el-table-column label="实发总额（元）" prop="chargeByName"></el-table-column>
            <el-table-column label="预收客户费用（元）" prop="statusName"></el-table-column>
            <el-table-column label="应收客户费用（元）" prop="statusName"></el-table-column>
            <el-table-column label="渠道分润金额（元）" prop="statusName"></el-table-column>
            <el-table-column label="冻结渠道分润（元）" prop="statusName"></el-table-column>
            <el-table-column label="结算周期" prop="statusName"></el-table-column>
            <el-table-column label="资金状态" prop="statusName"></el-table-column>
            <el-table-column label="结清时间" prop="statusName"></el-table-column>
            <el-table-column label="付款凭证" prop="statusName"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <el-button type="text">下载明细</el-button>
                    <el-button type="text">付款确认</el-button>
                </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="data.total"
            :total="data.total"
            v-on:handleSizeChange="setSize"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
        <el-dialog title="修改" :visible.sync="show">
        <el-form label-width="120px" ref="dateil">
            <el-form-item label="代理商名称：" prop="name">
                湖南省自在牛利企业管理有限公司
            </el-form-item>
            <el-form-item label="服务商名称：" prop="taxIdcd">
                马鞍山爱皖美计算机科技有限公司舞阳分公司
            </el-form-item>
            <el-form-item label="出账周期：" prop="addr">
                2019-01
            </el-form-item>
            <el-form-item label="结算周期：" prop="phone">
                2019-02
            </el-form-item>
            <el-form-item label="渠道分润：" prop="bankName">
                ￥3,920.00
            </el-form-item>
            <el-form-item label="上传凭证：" prop="attachmentIds">
                <div class="uploadBox" v-for="(e, i) in uploadList" @click.capture="currentIndex = i">
                    <el-upload
                        v-show="!uploadList[i].imageUrl"
                        class="det mb35"
                        ref="upload"
                        :show-file-list="false"
                        :action="`/api/sysmgr-web/file/upload`"
                        :auto-upload="false"
                        :on-change="getAttachment"
                        :multiple="true"
                        name="file"
                        accept=".jpg, .png">
                        <i class="el-icon-plus avatar-uploader-icon">
                            <div>可以同时上传多张</div>
                        </i>
                    </el-upload>
                    <div v-if="uploadList[i].imageUrl" class="avatar" :style="{'background-image': `url(${uploadList[i].imageUrl})`}">
                        <div class="magnify" @click="prevImg(uploadList[i].imageUrl)"></div>
                    </div>
                    <el-button type="text" v-show="uploadList[i].imageUrl" @click="reUpload()">重新上传</el-button><br>
                    <el-button type="text" @click="deleteImg()" v-show="(uploadList.length > 1 && uploadList.length -1 != i) || i == 9">删除</el-button>
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="form_footer">
            <el-button type="primary" @click="sure">确定</el-button>
            <el-button @click="show = false">取消</el-button>
        </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
export default {
    data() {
        return {
            form: {
                companyName: '',
                status: '',
                pageSize: 10,
                page: 1
            },
            statusList: [],
            data: {},
            uploadList: []
        }
    },
    mounted() {
        get('/api/contract-web/commom/option?enumType=AgentContractStatus').then(data => {
            console.log(data)
            this.statusList = data
            this.query()
        })
    },
    methods: {
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.form.page = a
            // post('/api/contract-web/agent-contract/list', this.form).then(data => {
            //     this.data = data
            // })
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        sure() {

        },
        prevImg(a) {
            this.prevUrl = a
            this.showExa = true
        },
        reUpload() {
            this.isRe = true
            this.$refs.upload[this.currentIndex].$el.children[0].children[1].click()
        },
        deleteImg() {
            this.uploadList.splice(this.currentIndex, 1)
            if(this.uploadList.length == 9 && this.uploadList[this.uploadList.length -1].imageUrl) {
                this.uploadList.push({
                    imageUrl: '',
                    attachmentId: ''
                })
            }
        }
    }
}
</script>
<style scoped>
.r_main {
  padding: 30px 10px 50px;
  background-color: #fff;
}
.form {
    margin-top: 20px;
}
.form_input {
    width: 200px;
}
.table {
    margin-top: 20px;
}
.t_head {
    margin: 30px 0;
    font-size: 20px;
    color: #666;
}
.red {
    color: #f56c6c;
    margin-right: 100px;
}
.el-icon-question {
    margin-right: 5px;
    color: #f56c6c;
    cursor: pointer;
}
.uploadBox {
  width: 140px;
  float: left;
  text-align: center;
  margin-right: 20px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
  background: #FCFCFC;
  border: 1px solid #CCCCCC;
}
.avatar {
  position: relative;
  width: 140px;
  height: 140px;
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  display: inline-block;
}
.avatar-uploader-icon > div {
  line-height: 20px;
  font-size: 12px;
  margin-top: -32px;
}
</style>
