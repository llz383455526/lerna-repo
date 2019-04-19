<template>
    <div>
        <div class="title">签约信息</div>
        <el-table class="table" :data="contractData.list" border>
            <el-table-column label="合同编号" prop="contractNo"></el-table-column>
            <el-table-column label="签约服务商" prop="serviceCompanyName"></el-table-column>
            <el-table-column label="服务费比例" prop="serviceFeeName"></el-table-column>
            <el-table-column label="预收服务费" prop="prePayFeeName"></el-table-column>
            <el-table-column label="发票类型" prop="invoiceTypeName"></el-table-column>
            <el-table-column label="合同起止时间" prop="lastUpdateAt">
                <template slot-scope="scope">{{scope.row.contractStartDate}} 至 {{scope.row.contractEndDate}}</template>
            </el-table-column>
            <el-table-column label="操作" prop="lastUpdateAt">
            <template slot-scope="scope">
                <router-link :to="`/main/contract/preview?contractId=${scope.row.id}&examine=1`">
                    <el-button type="text">查看合同</el-button>
                </router-link>
                <span @click="setCurr(scope.row)">
                    <el-upload
                        action="/api/console-dlv/file/upload"
                        :on-error="handleError"
                        :before-upload="handleBeforeUpload"
                        :http-request="hanldleHttpRequest"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.png,.gif"
                        :show-file-list="false">
                        <el-button type="text">上传扫描件</el-button>
                    </el-upload>
                </span>
            </template>
            </el-table-column>
        </el-table>
        <ayg-pagination
            v-if="contractData.total"
            :total="contractData.total"
            v-on:handleSizeChange="sizeChange"
            :currentSize="form.pageSize"
            v-on:handleCurrentChange="query"
            :currentPage="form.page">
        </ayg-pagination>
    </div>
</template>
<script>
import { get, post, formPost, postButNoErrorToast, postWithErrorCallback } from "../store/api";
export default {
    data() {
        return {
            form: {
                customerId: '',
                page: 1,
                pageSize: 10
            },
            contractData: {},
            formData: '',
            referArr: [],
            curr: {}
        }
    },
    methods: {
        query(a) {
            if (isNaN(a)) {
                a = 1;
            }
            this.form.page = a;
            post("/api/contract-web/contract/query-contracts", this.form).then(data => {
                console.log('aaa')
                this.contractData = data;
                this.$emit('result', data.list.length)
            });
        },
        sizeChange(a) {
            this.form.pageSize = a;
            this.query();
        },
        transmit(id) {
            console.log('id', id)
            this.form.customerId = id
            this.query();
        },
        setCurr(a) {
            this.curr = a
        },
        handleError() {
            this.$message({
                type: 'error',
                message: '上传失败！'
            })
        },
        handleBeforeUpload(file) {
            var AllImgExt = ".doc|.docx|.pdf|.jpg|.png|.gif";
            var extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase();//（把路径中的所有字母全部转换为小写）
            if (AllImgExt.indexOf(extName) == -1) {
                this.$message({
                    type: 'error',
                    message: '文件类型错误'
                })
                return false;
            }
            let formData = new FormData();
            formData.append('fileName', file.name);
            formData.append('file', file);
            this.formData = formData;
        },
        hanldleHttpRequest() {
            formPost('/api/contract-web/file/upload', this.formData).then(data => {
                this.$message({
                    type: 'success',
                    message: '上传成功！'
                })
                this.updateAttachment(this.curr.id, data.referId);
            });
        },
        updateAttachment(contractId, referId) {
            post('/api/contract-web/contract/update-contract-attachment', {
                contractId: contractId,
                referId: referId
            }).then(data => {
                this.$message({
                    type: 'success',
                    message: '绑定客户合同成功!'
                })
                this.query()
            })
        }
    }
}
</script>
<style scoped>
.title {
    display: inline-block;
    margin: 20px 0px;
    font-weight: bold;
}
.table {
  margin-top: 20px;
}
</style>
