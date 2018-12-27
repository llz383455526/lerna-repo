<template>
<div>
    <h3 class="green">请选择合同附加条款</h3>
    <template v-if="hasInsurance()">
        <el-form-item label="商业保险" prop="vciBuyType" :rules="{required: true, message: '请选择商业保险', trigger: 'change'}">
            <el-radio-group v-model="contractModel.contractForm.vciBuyType" style="width:900px;">
                <el-radio label="10">由客户自行购买</el-radio>
                <el-radio label="20">我方购买保险的情况，无论保费是否我方承担均适用</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="保险计划名称" prop="vciPlanName" :rules="{required: true, message: '请输入保险计划名称', trigger: 'blur'}">
            <el-input v-model="contractModel.contractForm.vciPlanName" style="width:900px;"></el-input>
        </el-form-item>
        <!--<el-form-item label="商业保险服务名称" prop="vciServiceName"-->
        <!--:rules="{required: true, message: '请输入商业保险服务名称', trigger: 'blur'}">-->
        <!--<el-input v-model="contractModel.contractForm.vciServiceName"></el-input>-->
        <!--</el-form-item>-->
    </template>
    <el-form-item label="付款方式" prop="vciPayType" :rules="{required: true, message: '请输入付款方式', trigger: 'change'}">
        <el-select v-model="contractModel.contractForm.vciPayType" placeholder="请选择" style="width:900px;" @change="changeVciPayType">
            <el-option v-for="(item,key) in contractModel.VciPayTypeList" :key="key" :label="item.text" :value="item.value"></el-option>
        </el-select>
    </el-form-item>
    <el-form-item prop="vciSettleExp" v-if="contractModel.contractForm.vciPayType == 30" :rules="{required: true, message: '请输入结算日期', trigger: 'blur'}">
        <el-input v-model="contractModel.contractForm.vciSettleExp" style="width:900px;margin-left:200px;">
            <template slot="prepend">
                甲乙双方确认以每月
            </template>
            <template slot="append">
                日为结算日期
            </template>
        </el-input>
    </el-form-item>
    <el-form-item label="付款方与收票方一致" prop="payAndInvoiceSame" :rules="{required: true, message: '请选择付款方与收票方一致', trigger: 'change'}">
        <div style="width:900px;">
            <el-radio-group v-model="contractModel.contractForm.payAndInvoiceSame">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
            </el-radio-group>
            <span v-if="contractModel.contractForm.payAndInvoiceSame === '0'&&contractModel.contractForm.referIds&&!contractModel.contractForm.referIds.length"
                  style="color:red;" class="ml10">(请上传清单)</span>
        </div>
    </el-form-item>
    <el-form-item v-show="contractModel.contractForm.payAndInvoiceSame === '0'" label="甲方下属公司类型" :rules="{required: true, message: '请选择甲方下属公司类型', trigger: 'blur'}">
        <div style="width:900px;">
            <el-radio v-model="contractModel.contractForm.customCompanyUnderType" v-for="(e, key) in contractModel.customCompanyUnderTypeList" :key="key" :label="e.value">{{e.text}}</el-radio>
        </div>
    </el-form-item>
    <el-form-item v-show="contractModel.contractForm.payAndInvoiceSame === '0'" label="上传甲方下属公司清单">
        <a class="btn" href="/assets/甲方公司下属公司名单.xlsx"
               download="甲方公司下属公司名单.xlsx" target="_blank">下载模板</a>
        <span>请先下载《甲方下属公司清单》模板</span>
        <el-upload class="form_input" :action="`/api/econtract/template/parsefile`" :auto-upload="false" :on-change="upload" :on-remove="remove" :on-preview="handlePreview" :multiple="false" :file-list="files" accept=".xlsx, .xls">
            <div class="up_icon" v-show="!files.length">
                <div>点击这里上传</div>
                <div>请上传小于5M的xls或xlsx格式文件</div>
            </div>
        </el-upload>
    </el-form-item>
</div>
</template>

<script>
import {
    importPost
} from "../../../store/api";
import {
    baseUrl
} from '../../../config/address';
export default {
    name: "additionalClause",
    props: ['contractModel', 'editType', 'referNames', 'files'],
    data() {
        return {
            invoiceCompanyName: '',
            industryList: [{
                    value: '先款后票',
                    key: 1
                },
                {
                    value: '先票后款',
                    key: 2
                },
                {
                    value: '甲方要求按预充金额开票',
                    key: 3
                }
            ]
        }
    },
    methods: {
        hasInsurance() {
            var isHas = false;
            this.contractModel.serviceTypes.forEach(e => {
                this.contractModel.serviceTypeList.forEach(ev => {
                    if (e.serviceId == ev && e.vciStatus == 1) {
                        isHas = true
                    }
                })
            });
            return isHas;
        },
        upload(file) {
            let formData = new FormData();
            formData.append('targetType', 'vci_attach');
            formData.append('fileName', file.name);
            formData.append('file', file.raw);
            importPost('/api/contract-web/file/upload', formData, true).then(data => {
                this.contractModel.contractForm.customUnderAttachList.push({
                    refId: data.referId,
                    downloadCode: data.downloadCode,
                    displayname: data.fileName
                });
                this.files.push({
                    name: data.fileName,
                    url: data.downloadCode
                });
                this.$message({
                    type: 'success',
                    message: '上传成功！'
                })
            })
        },
        remove() {
            this.files.pop();
            this.contractModel.contractForm.customUnderAttachList.pop();
        },
        handlePreview(file) {
            this.handleDownload(file.url);
        },
        handleDownload(downloadCode) {
            window.location.href = baseUrl + '/api/contract-web/file/download' +
                '?downloadCode=' + downloadCode;
        },
        changeVciPayType(e) {
            if(e === 10) {
                this.contractModel.contractForm.openInvoiceType = '账单开票';
            } else {
                this.contractModel.contractForm.openInvoiceType = '预开票';
            }
        }
    }
}
</script>

<style lang="scss" scoped>
.btn {
    display: inline-block;
    width: 80px;
    height: 22px;
    font-size: 12px;
    color: #666666;
    text-decoration: none;
    background-image: url(../../../image/download.png);
    background-size: 10px 10px;
    background-repeat: no-repeat;
    background-position: 7px center;
    border: 1px solid #D9D9D9;
    border-radius: 4px;
    text-indent: 22px;
    line-height: 20px;
}

.btn+span {
    display: inline;
    font-size: 12px;
    color: #999;
}

.up_icon {
    width: 228px;
    height: 124px;
    background-image: url(../../../image/upload.png);
    background-size: 41px 33px;
    background-position: center 20px;
    background-repeat: no-repeat;
    padding-top: 70px;
    border: 1px solid #D9D9D9;
    line-height: 16px;
}

.up_icon>div:nth-child(1) {
    text-align: center;
    font-size: 12px;
    color: #666666;
}

.up_icon>div:nth-child(2) {
    font-size: 12px;
    color: #999;
    margin-top: 5px;
}
</style>
