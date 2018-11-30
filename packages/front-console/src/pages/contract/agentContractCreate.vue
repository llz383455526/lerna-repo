<template>
    <div class="r_main">
        <div class="title">
            基本信息
        </div>
        <el-form class="form" :model="form" :rules="rules" label-width="100px" size="small" ref="form">
            <el-form-item label="代理商名称" prop="companyId">
                <el-select class="form_input" v-model="form.companyId" @change="companyChange" :disabled="(id || isLook) ? true : false " filterable>
                    <el-option v-for="e in agentList" :key="e.companyId" :label="e.companyName" :value="e.companyId"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="渠道经理" required>
                <el-input class="form_input" v-model="chargeByName" :disabled="true"></el-input>
            </el-form-item>
            <el-form-item label="代理期限" prop="agentStart">
                <el-date-picker
                    :disabled="isLook"
                    class="form_input"
                    v-model="form.agentStart"
                    type="daterange"
                    start-placeholder="开始日期"
                    end-placeholder="结束日期"
                    value-format="yyyy-MM-dd"
                    >
                </el-date-picker>
            </el-form-item>
        </el-form>
        <div class="title">
            合同文件
        </div>
        <!-- :drag="!fileList.length" -->
        <!-- :action="" -->
        <!-- :file-list="fileList" -->
        <!-- <template v-if="!fileList.length">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <div class="el-upload__tip" slot="tip">请上传pdf格式文件。</div>
        </template> -->
        <!-- :on-remove="remove" -->
        <el-upload
            :disabled="isLook"
            class="form_input"
            action=""
            :auto-upload="false"
            :on-change="upload"
            :multiple="false"
            :show-file-list="false"
            accept=".pdf, .doc, .docx, .png, .jpg, .gif">
            <el-button class="mt20" size="small" type="primary">点击上传</el-button>
        </el-upload>
        <el-table class="table" :data="form.attachments">
            <el-table-column label="文件名称" prop="displayname"></el-table-column>
            <el-table-column label="上传时间" prop="createTime"></el-table-column>
            <el-table-column label="操作人" prop="createByName"></el-table-column>
            <el-table-column label="操作">
                <template slot-scope="scope">
                    <a :href="`/api/contract-web/file/download?downloadCode=${scope.row.downloadCode}`" target="_bank">
                        <el-button type="text">下载</el-button>
                    </a>
                    <el-button type="text" @click="deleteFile(scope.$index)" v-if="!isLook">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <div class="fr">
            <el-button size="small" @click="$router.back()" v-if="!isLook">取消</el-button>
            <el-button size="small" type="primary" @click="save" v-if="!isLook">保存</el-button>
            <el-button size="small" type="primary" @click="$router.back()" v-if="isLook">返回</el-button>
        </div>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
export default {
    data() {
        return {
            form: {
                agentEnd: '',
                agentStart: '',
                attachments: [],
                companyId: '',
                companyName: ''
            },
            rules: {
                companyId: [
                    { required: true, message: "请选择代理商", trigger: "blur" }
                ],
                agentStart: [
                    { required: true, message: "请填写时间", trigger: "blur" }
                ]
            },
            chargeByName: '',
            agentList: [],
            id: '',
            isLook: false
        }
    },
    mounted() {
        this.id = this.$route.query.id
        this.isLook = this.$route.query.isLook ? true : false
        get('/api/contract-web/agent-contract/agent-company-option').then(data => {
            this.agentList = data
        })
        this.id && this.getDetail()
    },
    methods: {
        getDetail() {
            get('/api/contract-web/agent-contract/detail', {
                contractId: this.id
            }).then(data => {
                for(let k in data) {
                    if(k in this.form) {
                        this.form[k] = data[k]
                    }
                }
                this.form.agentStart = [this.form.agentStart, this.form.agentEnd]
                this.chargeByName = data.chargeByName
                data.status == 20 && (this.isLook = true)
            })
        },
        companyChange() {
            this.agentList.forEach(e => {
                if(e.companyId == this.form.companyId) {
                    this.chargeByName = e.chargeByName
                    this.form.companyName = e.companyName
                }
            })
        },
        upload(a) {
            var form = new FormData()
            form.append('fileName', a.name)
            form.append('file', a.raw)
            formPost('/api/contract-web/file/upload', form).then(data => {
                this.form.attachments.push({
                    displayname: data.fileName,
                    downloadCode: data.downloadCode,
                    refId: data.referId,
                    targetType: 'agent_contract_main',
                    // targetTypeName: ''
                    createTime: data.createTime,
                    createByName: data.createByName
                })
                this.$message({
                    type: 'success',
                    message: '上传成功！'
                })
            })
        },
        deleteFile(a) {
            this.form.attachments.splice(a, 1)
        },
        save() {
            this.$refs['form'].validate(v => {
                if(v) {
                    var form = JSON.parse(JSON.stringify(this.form))
                    form.agentEnd = form.agentStart[1]
                    form.agentStart = form.agentStart[0]
                    this.id && (form.contractId = this.id)
                    post(`/api/contract-web/agent-contract/${this.id ? 'edit' : 'add'}`, form).then(data => {
                        this.$message({
                            type: 'success',
                            message: `${this.id ? '修改' : '添加'}成功！`
                        })
                        this.$router.back()
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
.r_main {
  padding: 30px 10px 50px;
  background-color: #fff;
}
.title {
    /* display: inline-block; */
    margin-top: 30px;
    font-weight: 700;
}
.form {
    margin-top: 20px;
}
.form_input {
    width: 450px;
}
.table {
    margin-top: 20px;
}
.mt20 {
    margin-top: 20px;
}
.fr {
    float: right;
    margin-right: 30px;
}
</style>
