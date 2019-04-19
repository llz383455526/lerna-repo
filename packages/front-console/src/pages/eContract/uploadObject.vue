<template>
    <div class="main">
        <el-steps id="steps" :active="1" align-center size="small">
            <el-step title="上传签约对象"></el-step>
            <el-step title="核对信息"></el-step>
        </el-steps>
        <el-form label-width="180px">
            <div class="mtitle">合同名称</div>
            <el-form-item label="合同名称:">
                {{msg.name}}<a target="_bank" :href="`${baseUrl}/api/econtract/template/preview?templateId=${msg.templateId}`">合同预览</a>
            </el-form-item>
        </el-form>
        <div v-for="e in detail" v-if="e.signNo" :key="e.signNo">
            <div class="mtitle">
                {{part[e.signNo]}}签约对象（{{ptype[e.userDetailType]}}）
            </div>
            <template v-if="e.userDetailType == '1'">
                <div class="success" v-if="isSuccess">
                    <span v-if="!errCount">您上传的数据全部校验通过</span>
                    <span v-else>您上传的数据有<span class="error">{{errCount}}</span>条记录存在错误，请编辑更正后再进行下一步。</span>
                </div>
                <el-form :model="form" :inline="true" ref="form">
                    <el-form-item label="姓名" prop="personalName">
                        <el-input v-model="form.personalName" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="证件号" prop="personalIdentity">
                        <el-input v-model="form.personalIdentity" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="手机" prop="personalMobile">
                        <el-input v-model="form.personalMobile" size="small"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" size="small" @click="query">查询</el-button>
                        <el-button size="small" @click="reset('form')">清空所有条件</el-button>
                    </el-form-item>
                </el-form>
                <el-button type="primary" size="small" @click="show = true">批量添加</el-button>
                <el-button type="primary" size="small" @click="addOrEdit()">添加</el-button>
                <a :href="`${baseUrl}/api/econtract/order/exporterrors?batchId=${form.batchId}`" v-if="hasChange"><el-button type="primary" size="small">导出文件</el-button></a>
                <el-table :data="list" @selection-change="handleSelectionChange">
                    <el-table-column label="姓名" prop="personalName" :render-header="customFieldColumn"></el-table-column>
                    <el-table-column label="证件类型" prop="personalIdentityTypeName" :render-header="customFieldColumn"></el-table-column>
                    <el-table-column label="证件号" prop="personalIdentity" :render-header="customFieldColumn"></el-table-column>
                    <el-table-column label="手机" prop="personalMobile" :render-header="customFieldColumn"></el-table-column>
                    <el-table-column label="错误原因">
                        <template slot-scope="scope">
                            <span class="error">{{scope.row.msg}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" size="small" @click="addOrEdit(scope.row)">修改</el-button>
                            <el-button type="text" size="small" @click="deleteOrder(scope.row)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <ayg-pagination
                    v-if="total"
                    :total="total"
                    v-on:handleSizeChange="setSize"
                    :currentSize="form.pageSize"
                    v-on:handleCurrentChange="query"
                    :currentPage="form.pageNo">
                </ayg-pagination>
            </template>
            <template v-else>
                <el-form label-width="180px">
                    <el-form-item :label="`${ptype[e.userDetailType]}全称：`">
                        {{e.name}}
                        <el-button type="text" size="small" @click="isShow[e.userDetailType] = !isShow[e.userDetailType]">
                            {{isShow[e.userDetailType] ? '收起' : '展开详情'}}
                        </el-button>
                    </el-form-item>
                    <template v-if="isShow[e.userDetailType]">
                        <el-form-item label="工商注册号：">{{e.regCode}}</el-form-item>
                        <el-form-item label="税务登记号：">{{e.taxCode}}</el-form-item>
                        <el-form-item label="组织机构代码：">{{e.orgCode}}</el-form-item>
                        <el-form-item label="法人姓名：">{{e.legalPerson}}</el-form-item>
                        <el-form-item label="法人证件类型：">{{e.legalPersonIdentityType == 0 ? '身份证' : '护照'}}</el-form-item>
                        <el-form-item label="法人证件号码：">{{e.legalPersonIdentity}}</el-form-item>
                        <el-form-item label="法人手机号：">{{e.legalPersonMobile}}<i class="el-icon-question" title="选择手动签约将会发送签约短信到该手机号码"></i></el-form-item>
                    </template>
                </el-form>
            </template>
        </div>
        <el-button type="primary" size="small" @click="next">下一步</el-button>
        <el-button size="small" @click="cancle">取消</el-button>
        <el-dialog title="批量上传" :visible.sync="show" width="70%">
            <div class="dbox">
                <div class="ditem">
                    <div>下载模板文件</div>
                    <div>请按照模板填写签约对象信息。</div>
                    <a href="/assets/批量签约名单上传模板.xlsx" download="批量签约名单上传模板.xlsx" target="_blank">点击下载模板文件</a>
                </div>
                <div class="ditem">
                    <div>上传文件导入</div>
                    <div>请上传小于5M的xls或xlsx格式文件。<span class="red">注：Excel表格中实际用户行数不得大于1万条，若超过请手动拆分，若有占位空行请删除。</span></div>
                    <el-upload
                        class="form_input"
                        drag
                        :action="`/api/econtract/template/parsefile`"
                        :auto-upload="false"
                        :on-change="upload"
                        :on-remove="remove"
                        :multiple="false"
                        :file-list="fileList"
                        accept=".xlsx, .xls">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <!-- <div class="el-upload__tip" slot="tip">请上传xlsx格式文件。</div> -->
                    </el-upload>
                </div>
            </div>
            <span slot="footer">
                <el-button size="small" @click="show = false">关闭</el-button>
            </span>
        </el-dialog>
        <el-dialog :title="!isAdd ? '修改' : '添加'" :visible.sync="eshow" width="600px">
            <el-form :model="editor" :rules="erules" ref="editor" label-width="100px">
                <el-form-item label="名字：" prop="name">
                    <el-input v-model="editor.name" class="form_input"></el-input>
                </el-form-item>
                <el-form-item label="证件类型：" prop="identityType">
                    <el-select v-model="editor.identityType" class="form_input" disabled>
                        <el-option v-for="e in type" :key="e.value" :label="e.text" :value="e.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="证件号码：" prop="identity">
                    <el-input v-model="editor.identity" class="form_input"></el-input>
                </el-form-item>
                <el-form-item label="手机号：" prop="personalMobile">
                    <el-input v-model="editor.personalMobile" class="form_input"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer">
                <el-button type="primary" size="small" @click="save">确认</el-button>
                <el-button size="small" @click="eshow = false">取消</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { post, get, importPost } from "../../store/api"
import { baseUrl } from "../../config/address.js"
export default {
    data() {
        return {
            form: {
                batchId: '',
                personalName: '',
                personalIdentity: '',
                personalMobile: '',
                pageNo: 1,
                pageSize: 10
            },
            total: 0,
            list: [],
            isShow: {
                '2.1': false,
                '2.2': false
            },
            show: false,
            eshow: false,
            msg: '',
            baseUrl,
            detail: [],
            editor: {
                name: '',
                batchId: '',
                identity: '',
                identityType: '',
                orderId: '',
                personalMobile: ''
            },
            erules: {
                name: [
                    { required: true, message: '名字不能为空', trigger: 'blur' }
                ],
                identityType: [
                    { required: true, message: '请选择证件类型', trigger: 'blur' }
                ],
                identity: [
                    { required: true, message: '证件号码不能为空', trigger: 'blur' },
                    { pattern: /^[\w]+$/, message: '请正确输入证件号码', trigger: 'blur'}
                ],
                personalMobile: [
                    { required: true, message: '手机号码不能为空', trigger: 'blur' },
                    { pattern: /^(1\d{10})$/, message: '请正确输入手机号码', trigger: 'blur'}
                ]
            },
            type: [
                {
                    text: '身份证',
                    value: '0'
                },
                {
                    text: '港澳通行证',
                    value: '8'
                },
                {
                    text: '护照',
                    value: '1'
                }
            ],
            isSuccess: false,
            errCount: 0,
            downList: [],
            hasChange: '',
            fileList: [],
            part: {
                '1': '甲方',
                '2': '乙方' ,
                '3': '丙方'
            },
            ptype: {
                '1': '个人',
                '2.1': '服务商',
                '2.2': '公司'
            },
            isAdd: false,
            signModel: ''
        }
    },
    mounted() {
        this.msg = JSON.parse(sessionStorage.getItem('sign'))
        post('/api/econtract/template/qrydetail', {
            templateId: this.msg.templateId,
	        templateGroupId: ''
        }).then(data => {
            this.detail = data.partys
            this.signModel = data.signModel
            // if(data.signModel == 2) {
            //     this.erules = {
            //         identityType: [
            //             { required: true, message: '请选择证件类型', trigger: 'blur' }
            //         ],
            //         identity: [
            //             { pattern: /^[\w]+$/, message: '请正确输入证件号码', trigger: 'blur'}
            //         ],
            //         personalMobile: [
            //             { required: true, message: '手机号码不能为空', trigger: 'blur' },
            //             { pattern: /^(1\d{10})$/, message: '请正确输入手机号码', trigger: 'blur'}
            //         ]
            //     }
            // }
            if(this.detail) {
	            this.detail.forEach(e => {
		            if(e.userId) {
			            post('/api/econtract/user/company/qrydetail', {
				            userId: e.userId
			            }).then(res => {
				            Object.assign(e, res)
				            this.$forceUpdate()
			            })
		            }
	            })
            }

        })
        if(this.$route.query.batchId) {
            console.log(this.$route)
            this.form.batchId = this.$route.query.batchId
            this.isSuccess = true
            this.query()
        }
        else {
            get('/api/econtract//batch/getnextid').then(data => {
                this.form.batchId = data
            })
        }
    },
    methods: {
        query(a) {
            if(isNaN(a)){
                a = 1
            }
            this.form.pageNo = a
            post('/api/econtract/contractsigner/qry', this.form).then(data => {
                console.log(data)
                this.list = data.data
                this.total = data.total
                this.errCount = data.errCount
            })
        },
        reset(name) {
            this.$refs[name][0].resetFields()
        },
        setSize(a) {
            this.form.pageSize = a
            this.query()
        },
        upload(a) {
            this.fileList.shift()
            var formData = new FormData()
            formData.append('batchId', this.form.batchId)
            formData.append('templateId', this.msg.templateId)
            formData.append('templateGroupId', '')
            formData.append('fileName', a.name)
            formData.append('multipartFile', a.raw)
            importPost('/api/econtract/contractsigner/addlist', formData).then(data => {
                this.query()
                this.$message({
                    type: 'success',
                    message: '上传成功！'
                })
                this.show = false
                this.isSuccess = true
                this.fileList.push({
                    name: a.name,
                    url: this.msg.templateId
                })
            })
        },
        handleSelectionChange(a) {
            this.downList = a
        },
        downLoad() {
            if(this.downList.length){
                post('/api/econtract/order/exporterrors', this.downList).then(data => {
                    console.log(data)
                })
            }
            else {
                this.$message({
                    type: 'warning',
                    message: '请至少选择一条数据！'
                })
            }
        },
        addOrEdit(a) {
            if(!a) {
                this.isAdd = true
                a = {}
            }
            else {
                this.isAdd = false
            }
            this.eshow = true
            this.editor = {
                name: a.personalName,
                batchId: a.batchId,
                identity: a.personalIdentity,
                identityType: a.personalIdentityType || '0',
                orderId: a.orderId,
                personalMobile: a.personalMobile
            }
            // this.editor.batchId = a.batchId
            // this.editor.orderId = a.orderId
            // this.editor.identity = a.personalIdentity
            // this.editor.identityType = a.personalIdentityType
            // this.editor.name = a.personalName
            // this.editor.personalMobile = a.personalMobile
            this.$refs['editor'] && this.$refs['editor'].clearValidate()
        },
        save() {
	        this.$refs['editor'].validate(valid => {
	        	if(valid) {
                    var form = this.editor
                    if(this.isAdd) {
                        form = {
                            batchId: this.form.batchId,
                            param: {
                                batchId: this.form.batchId,
                                fromGroup: '0',
                                identity: this.editor.identity,
                                identityType: this.editor.identityType,
                                name: this.editor.name,
                                orderId: this.editor.orderId,
                                personalMobile: this.editor.personalMobile
                            },
                            templateGroupId: '',
                            templateId: this.msg.templateId
                        }
                    }
			        post(`/api/econtract/contractsigner/${this.isAdd ? 'add' : 'modify'}`, form).then(data => {
				        this.$message({
					        type: 'success',
					        message: `${this.isAdd ? '添加' : '修改'}成功！`
				        })
				        this.eshow = false
                        this.hasChange = true
                        this.isSuccess = true
				        this.query()
			        })
                }else {
			        this.$message({
				        type: 'warning',
				        message: '请正确填写表单！'
			        })
		        }
            })
        },
        deleteOrder(a) {
            this.$confirm('确定删除该签约对象吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
                post(`/api/econtract/contractsigner/delete?orderId=${a.orderId}`).then(() => {
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    })
                    this.query()
                    this.hasChange = true
                })
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '删除已取消！'
                })
            })
        },
        next() {
            post('/api/econtract/contractsigner/qry', {
                batchId: this.form.batchId,
                pageNo: 1,
                pageSize: 10
            }).then(data => {
                if(!this.isSuccess || !data.data.length) {
                    this.$message.error('尚未上传数据！')
                    return
                }
                if(this.errCount) {
                    this.$message({
                        type: 'warning',
                        message: `您上传的数据有${this.errCount}条记录存在错误，数据全部正确才能进行进入下一步`
                    })
                    return
                }
                sessionStorage.setItem('batchId', this.form.batchId)
                sessionStorage.setItem('detail', JSON.stringify(this.detail))
                this.$router.push({
                    path: 'checkObject',
                    query: {
	                    templateName: this.msg.name
                    }
                })
            })
        },
        cancle() {
            this.$router.back()
        },
        customFieldColumn (h, { column, $index }) {
            // this.signModel == '1' || (this.signModel == '2' && ($index == 1 || $index == 3)) ? 'require' : ''
            return (
                h('span', [
                    h('i', {
                        class: 'require'
                    }),
                    h('span', column.label)
                ])
            )
        }
    }
}
</script>
<style scoped>
.main {
    margin: 15px;
    padding: 15px;
    background-color: #fff;
}
#steps {
    margin: 30px 0;
}
.mtitle {
    font-size: 13px;
    color: #333;
    border-left: 4px solid #0283fb;
    height: 16px;
    text-indent: 10px;
    margin-bottom: 15px;
}
.el-icon-question {
    color: red;
    margin-left: 15px;
}
.success {
    position: relative;
    left: -15px;
    width: calc(100% - 10px);
    padding: 20px;
    text-align: center;
    background-color: #d9f2e6;
    margin-bottom: 20px;
}
a {
    margin-left: 5px;
}
.dbox {
    display: flex;
    justify-content: space-around;
}
.ditem {
    width: 40%;
}
.ditem > div:nth-child(1) {
    font-size: 18px;
    color: #333;
    margin-bottom: 5px;
}
.ditem > div:nth-child(2) {
    font-size: 14px;
    color: #999;
    margin-bottom: 5px;
}
.error {
    color: red;
    /* font-size: 18px; */
}
.form_input {
    width: 400px;
}
.red {
    color: red;
    font-weight: bold;
}
</style>
