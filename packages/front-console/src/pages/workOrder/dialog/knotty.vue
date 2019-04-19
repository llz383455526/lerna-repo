<template>
    <div>
        <el-dialog title="疑难单申请" :visible.sync="show" width="800px">
            <el-steps :active="active" align-center class="mb20">
                <el-step title="创建" description="客户：陈经理"></el-step>
                <el-step title="审核" description="交付部：胡群"></el-step>
                <el-step title="复核" description="核算组：小米"></el-step>
                <el-step title="制单" description="落地交付：小米"></el-step>
                <el-step title="待审核" description="财务部：小米"></el-step>
            </el-steps>
            <el-form :model="form" size="small" label-width="100px" ref="form">
                <el-form-item label="申请类型">
                    <el-radio v-model="form.type" v-for="e in list" :key="e.value" :label="e.value">{{e.text}}</el-radio>
                </el-form-item>
                <el-form-item label="客户公司">
                    <el-select class="form_input" v-model="form.v"></el-select>
                </el-form-item>
                <el-form-item label="商户名称">
                    <el-select class="form_input" v-model="form.v"></el-select>
                </el-form-item>
                <el-form-item label="服务公司">
                    <el-select class="form_input" v-model="form.v"></el-select>
                </el-form-item>
                <el-form-item label="业务类型">
                    <el-select class="form_input" v-model="form.v"></el-select>
                </el-form-item>
                <el-form-item label="渠道账号">
                    <el-select class="form_input" v-model="form.v"></el-select>
                </el-form-item>
                <el-form-item label="实发账户">
                    <el-input class="form_input" v-model="form.v">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="服务费账户">
                    <el-input class="form_input" v-model="form.v">
                        <template slot="append">元</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="总金额">
                    -1010元
                </el-form-item>
                <el-form-item label="所属月份">
                    <el-date-picker
                        class="form_input"
                        v-model="form.v"
                        type="month"
                        value-format="yyyy-MM">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="申请备注">
                    <el-input class="form_input" type="textarea"></el-input>
                </el-form-item>
                <template v-if="form.type == 0 || form.type == 1 || form.type == 3">
                    <el-form-item label="上传凭证">
                        <el-upload
                            v-if="!imageUrl"
                            class="upload"
                            ref="upload"
                            :show-file-list="false"
                            :action="`/api/sysmgr-web/file/upload`"
                            :auto-upload="false"
                            :on-change="getImg"
                            :multiple="false"
                            name="file"
                            accept=".jpg, .png">
                            <i class="el-icon-plus avatar-uploader-icon"></i>
                        </el-upload>
                        <img @click="showVoucher = true" style="width: 300px" v-else :src="`/api/sysmgr-web/file/download?downloadCode=${imageUrl}`" alt="">
                        &nbsp;<el-button type="text" class="clear" @click="clearImg">重新上传充值凭证</el-button>
                    </el-form-item>
                </template>
                <template v-if="form.type == 0 || form.type == 1">
                    <div class="title">转出服务商信息</div>
                    <div class="det">名称：河南爱洋信息科技有限公司</div>
                    <div class="det">所属银行：中国农业银行舞阳县支行</div>
                    <div class="det">开户行：中国农业银行舞阳县支行</div>
                    <div class="det">账户名：河南爱洋信息科技有限公司</div>
                    <div class="det">账号： 16281101040012771</div>
                    <div class="det">业务渠道：汇付</div>
                    <div class="det">渠道账号：henanaiyang_changjie0david.liu@aiyuangong.com/</div>
                </template>
                <template v-if="form.type == 2">
                    <el-form-item label="上传发放明细">
                        <el-button type="text">下载文件模板</el-button>
                        <!-- :show-file-list="false" -->
                        <el-upload
                            class="form_input"
                            :action="`/api/econtract/template/parsefile`"
                            :auto-upload="false"
                            :on-change="upload"
                            :multiple="false"
                            :file-list="fileList"
                            accept=".xlsx, .xls">
                            <div class="up_icon">
                                <div>点击这里上传</div>
                                <div>请上传小于5M的xls或xlsx格式文件</div>
                            </div>
                        </el-upload>
                    </el-form-item>
                </template>
                <!-- 退款 -->
                <template v-if="form.type == 0">
                    <div class="title">转入客户公司：上海跃橙文化传播有限公司</div>
                    <template v-if="active == 1">
                        <el-form-item label="账户名称">
                            <el-input class="form_input" v-model="form.v"></el-input>
                        </el-form-item>
                        <el-form-item label="开户行">
                            <el-input class="form_input" v-model="form.v"></el-input>
                        </el-form-item>
                        <el-form-item label="收款账号">
                            <el-input class="form_input" v-model="form.v"></el-input>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <div class="det">账户名称：上海跃橙文化传播有限公司</div>
                        <div class="det">开户行：中国邮政储蓄银行股份有限公司太康县阳夏路支行</div>
                        <div class="det">账号：941008010032966692</div>
                    </template>
                </template>
                <!-- 调账 -->
                <template v-if="form.type == 1">
                    <div class="title">转入服务商信息</div>
                    <template v-if="active == 1">
                        <el-form-item label="公司名称">上海跃橙文化传播有限公司</el-form-item>
                        <el-form-item label="商户名称">
                            <el-select class="form_input" v-model="form.v"></el-select>
                        </el-form-item>
                        <el-form-item label="服务公司">
                            <el-select class="form_input" v-model="form.v"></el-select>
                        </el-form-item>
                        <el-form-item label="业务类型">
                            <el-select class="form_input" v-model="form.v"></el-select>
                        </el-form-item>
                        <el-form-item label="渠道账号">
                            <el-select class="form_input" v-model="form.v"></el-select>
                        </el-form-item>
                    </template>
                    <template v-else>
                        <div class="det">名称：河南爱洋信息科技有限公司</div>
                        <div class="det">所属银行：中国农业银行舞阳县支行</div>
                        <div class="det">开户行：中国农业银行舞阳县支行</div>
                        <div class="det">账户名：河南爱洋信息科技有限公司</div>
                        <div class="det">账号： 16281101040012771</div>
                        <div class="det">业务渠道：汇付</div>
                        <div class="det">渠道账号：henanaiyang_changjie0david.liu@aiyuangong.com/</div>
                    </template>
                </template>
                <div class="tip">提示：对公转账：T+1</div>
                <el-form-item label="审批备注" v-if="(form.type == 0 && active == 2) || (form.type == 1 && active == 2)">
                    <el-input class="form_input" v-model="form.v" type="textarea"></el-input>
                </el-form-item>
                <template v-if="form.type == 0 && (active == 3 || active == 4)">
                    <el-form-item label="上传凭证">
                        <upload-multiple @result="result" ref="uploadMultiple"> </upload-multiple>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input class="form_input" type="textarea"></el-input>
                    </el-form-item>
                </template>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button size="small" @click="show = false">取消</el-button>
                <template v-if="form.type == 0">
                    <el-button size="small" type="primary" @click="show = false" v-if="active == 1">确认提交</el-button>
                    <template v-if="active == 2">
                        <el-button size="small" type="primary" @click="show = false">驳回</el-button>
                        <el-button size="small" type="primary" @click="show = false">审核通过</el-button>
                    </template>
                    <template v-if="active == 3">
                        <el-button size="small" type="primary" @click="show = false">已制单</el-button>
                    </template>
                    <template v-if="active == 4">
                        <el-button size="small" type="primary" @click="show = false">未到账</el-button>
                        <el-button size="small" type="primary" @click="show = false">审核到账</el-button>
                    </template>
                </template>
                <template v-if="form.type == 1">
                    <template v-if="active == 1">
                        <el-button size="small" type="primary" @click="show = false">确认提交</el-button>
                    </template>
                    <template v-if="active == 2">
                        <el-button size="small" type="primary" @click="show = false">驳回</el-button>
                        <el-button size="small" type="primary" @click="show = false">审核通过</el-button>
                    </template>
                </template>
                <template v-if="form.type == 2">
                    <template v-if="active == 1">
                        <el-button size="small" type="primary" @click="show = false">提交</el-button>
                    </template>
                    <template v-if="active == 2">
                        <el-button size="small" type="primary" @click="show = false">审核通过</el-button>
                    </template>
                </template>
                <template v-if="form.type == 3">
                    <template v-if="active == 1">
                        <el-button size="small" type="primary" @click="show = false">确认提交</el-button>
                    </template>
                    <template v-if="active == 2">
                        <el-button size="small" type="primary" @click="show = false">驳回</el-button>
                        <el-button size="small" type="primary" @click="show = false">审核通过</el-button>
                    </template>
                </template>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post, importPost, formPost } from "../../../store/api";
import uploadMultiple from '../../../pageComponent/uploadMultiple'
export default {
    components: {
        uploadMultiple
    },
    data() {
        return {
            active: 2,
            show: false,
            form: {
                type: 3
            },
            list: [
                {
                    text: '客户退款申请',
                    value: 0
                },
                {
                    text: '支付渠道调账',
                    value: 1
                },
                {
                    text: '线下实发流水补录系统',
                    value: 2
                },
                {
                    text: '通用',
                    value: 3
                }
            ],
            imageUrl: '',
            attachmentId: '',
            uploadList: [
                {
                    imageUrl: '',
                    attachmentId: ''
                }
            ],
            fileList: []
        }
    },
    methods: {
        getImg(a) {
            var formData = new FormData()
            formData.append('targetType', 'recharge_voucher_img')
            formData.append('fileName', a.name)
            formData.append('file', a.raw)
            importPost('/api/sysmgr-web/file/upload', formData).then(data => {
                this.attachmentId = data.referId
                this.imageUrl = data.downloadCode
                // this.detail.financeDownloadCode = data.downloadCode
            })
        },
        clearImg() {
            this.imageUrl = ''
            this.attachmentId = ''
        },
        transmit(a) {
            this.show = a
            this.uploadList = [
                {
                    imageUrl: '',
                    attachmentId: ''
                }
            ]
            this.$refs.uploadMultiple && this.$refs.uploadMultiple.transmit({
                uploadList: this.uploadList
            })
        },
        result(a) {
            this.uploadList = a
        },
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
    }
}
</script>
<style scoped>
.upload {
    position: relative;
    top: -5px;
    display: inline-block;
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
.clear {
    position: absolute;
    bottom: 0px;
}
.title {
    font-weight: bold;
    margin-top: 20px;
    margin-bottom: 15px;
}
.det {
    position: relative;
    margin-left: 30px;
    margin-bottom: 10px;
}
.tip {
    margin: 20px 0px 10px 30px;
    color: red;
}
.form_input {
    width: 400px;
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
</style>
