<template>
    <div class="main template-main">
        <div class="title">{{ltype ? '查看' : (form.enable ? '修改' : '新增')}}合同模板</div>
        <el-form :model="form" :rules="rules" label-width="150px" ref="form">
            <div class="mtitle">基础信息设置</div>
            <el-form-item label="合同模板名称:" prop="name">
                <el-input v-model="form.name" class="form_input" placeholder="请填写合同模板名称" size="small"></el-input>
            </el-form-item>
            <el-form-item label="商户名称：" prop="platform">
                <el-select
                    class="form_input"
                    v-model="form.platform"
                    filterable
                    remote
                    reserve-keyword
                    placeholder="请输入关键词"
                    :remote-method="remoteMethod"
                    :loading="loading"
                    @change="getBindStatus"
                    size="small">
                    <el-option
                        v-for="e in platform"
                        :key="e.extrSystemId"
                        :label="e.extrSystemName"
                        :value="e.extrSystemId">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="合同原件上传" prop="fpages">
                <el-upload
                    class="form_input"
                    :drag="!fileList.length"
                    :action="`${baseUrl}/api/econtract/template/parsefile`"
                    :auto-upload="false"
                    :on-change="upload"
                    :on-remove="remove"
                    :multiple="false"
                    accept=".pdf"
                    :file-list="fileList">
                    <template v-if="!fileList.length">
                        <i class="el-icon-upload"></i>
                        <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                        <div class="el-upload__tip" slot="tip">请上传pdf格式文件。</div>
                    </template>
                </el-upload>
            </el-form-item>
            <el-form-item label="合同文件尺寸">
                <el-input v-model="form.width" size="small" disabled class="form_short">
                    <template slot="prepend">宽</template>
                     <template slot="append">pt</template>
                </el-input>
                 <el-input v-model="form.height" size="small" disabled class="form_short">
                    <template slot="prepend">高</template>
                     <template slot="append">pt</template>
                </el-input>
                 <el-input v-model="form.fpages" size="small" disabled class="form_short">
                    <template slot="prepend">合同页数</template>
                     <template slot="append">页</template>
                </el-input>
            </el-form-item>
            <el-form-item label="备注" prop="memo">
                <!--<textarea class="form_input" v-model="form.memo" placeholder="备注"></textarea>-->
                <el-input type="textarea" :rows="6" :maxlength="500" v-model="form.memo" class="form_input" placeholder="备注" size="small"></el-input>
            </el-form-item>
            <div class="mtitle">签约对象设置</div>
            <el-form-item label="签约对象数量：" prop="partycount">
                <el-select v-model="form.partycount" size="small">
                    <el-option v-for="e in contracts" :key="e.value" :label="e.text" :value="e.value"></el-option>
                </el-select>
            </el-form-item>
            <template v-for="(item, i) in form.partys">
                <div class="mtitle">
                    <span v-if="item.signNo == 1">
                        甲方参数设置
                    </span>
                    <span v-else-if="item.signNo == 2">
                        乙方参数设置
                    </span>
                    <span v-else>
                        丙方参数设置
                    </span>
                </div>
                <el-form-item label="签约对象类型" :prop="`partys[${i}].userType`" :rules="{required: true, message: '请选择签约对象类型', trigger: 'blur'}">
                    <el-select v-model="item.userDetailType" size="small" @change="objectChange(i)">
                        <el-option v-for="e in type" :key="e.userDetailType" :label="e.name" :value="e.userDetailType"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="选择签约对象" :prop="`partys[${i}].userId`" :rules="item.userType == 2 ? { required: true, message: '请选择签约对象', trigger: 'blur' } : {}">
                    <template v-if="item.userType == 2">
                        <el-select
                            class="form_input"
                            v-model="item.userId"
                            filterable
                            remote
                            reserve-keyword
                            placeholder="请输入关键词"
                            :remote-method="remoteObject"
                            :loading="loading"
                            size="small">
                            <el-option
                                v-for="e in objects"
                                :key="e.userId"
                                :label="e.name"
                                :value="e.userId">
                            </el-option>
                        </el-select>
                        <router-link to="addObject" tag="a">
                            <el-button type="text" size="small">添加</el-button>
                        </router-link>
                    </template>
                    <span v-else>发起签约时导入</span>
                </el-form-item>
                <el-form-item label="签署方式" :prop="`partys[${i}].signMode`" :rules="{required: true, message: '请选择签署方式', trigger: 'blur'}">
                    <el-radio v-model="item.signMode" v-for="e in signModes" v-if="!(e.value == 2 && item.userType == 1)" :key="e.value" :label="e.value" @change="isOffline(i)">{{e.text}}</el-radio>
                </el-form-item>
                <template v-for="(e, j) in item.params" v-if="item.signMode != 3">
                    <el-form-item :label="item.userType == 2 ? '公司盖章坐标' : '手写签名坐标'" :prop="`partys[${i}].params[${j}]`" :rules="[
                    {validator: checkPostion, trigger: 'blur'}]">
                        <el-input v-model="e.varPages" class="form_short" size="small">
                            <template slot="prepend">页码</template>
                        </el-input>
                        <el-input v-model="e.varX" class="form_short" size="small">
                            <template slot="prepend">X轴</template>
                        </el-input>
                        <el-input v-model="e.varY" class="form_short" size="small">
                            <template slot="prepend">Y轴</template>
                        </el-input>
                        <el-button type="text" size="small" v-if="j != 0" @click="deleteParams(i, j)">删除</el-button>
                    </el-form-item>
                </template>
                <el-button type="text" size="small" @click="addParams(i)">{{item.userType == 2 ? '添加公司盖章' : '添加手写签名'}}</el-button>
            </template>
            <div class="mtitle">签约方式设置</div>
            <el-form-item label="对接方式" prop="accessType">
                <el-radio v-model="form.accessType" v-for="e in accessTypes" :key="e.value" :label="e.value" @change="accessTypeChange">{{e.text}}</el-radio>
                <!-- <el-radio v-model="form.accessType" label="1">SaaS对接</el-radio>
                <el-radio v-model="form.accessType" label="2" >API对接</el-radio> -->
            </el-form-item>
            <el-form-item label="实名认证方式" prop="signModel">
                <el-radio v-model="form.signModel" v-for="e in signModels" :key="e.value" :label="e.value" @change="checkNote" :disabled="form.accessType == '2' || isDisable_0">{{e.text}}</el-radio>
            </el-form-item>
            <el-form-item label="返回链接" prop="linkType" v-if="form.signModel && form.signModel == 1">
                <el-radio v-model="form.linkType" label="1">证照上传页面</el-radio>
                <el-radio v-model="form.linkType" label="2">签约页面</el-radio>
            </el-form-item>
            <el-form-item label="是否发送短信" prop="smsType">
                <el-radio v-model="form.smsType" label="1" :disabled="isDisable">是</el-radio>
                <el-radio v-model="form.smsType" label="2" :disabled="isDisable">否</el-radio>
            </el-form-item>
            <el-form-item label="短信引导内容" prop="smsType">
                <el-radio v-model="form.signSmsType" label="1">直接签约</el-radio>
                <el-radio v-model="form.signSmsType" label="2">通过小程序签约</el-radio>
            </el-form-item>
            <el-form-item label="是否需要上传证件照" prop="passportType">
                <el-radio v-model="form.passportType" label="1">是</el-radio>
                <el-radio v-model="form.passportType" label="2">否</el-radio>
            </el-form-item>
            <el-form-item label="是否需要绑定银行卡" prop="bindBank" v-if="form.signModel && form.signModel == 2 && bindBank">
                <el-radio v-model="form.bindBank" label="1">是</el-radio>
                <el-radio v-model="form.bindBank" label="2">否</el-radio>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" size="small" @click="submit" v-if="!ltype">提交</el-button>
                <el-button size="small" @click="back">{{ltype ? '返回' : '取消'}}</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { post, get, importPost } from "../../store/api"
import { error } from 'util';
var baseUrl = require("../../config/address.js").baseUrl
export default {
    data() {
        var checkPostion = (rule, value, cb) => {
            if(!value.varPages) {
                return cb(new Error('请输入页码'))
            } else if(value.varPages && isNaN(value.varPages)){
                return cb(new Error('请正确输入页码'))
            } else if(!value.varX) {
                return cb(new Error('请输入X轴参数'))
            } else if (value.varX && isNaN(value.varX)) {
                return cb(new Error('请正确输入X轴参数'))
            } else if(!value.varY) {
                return cb(new Error('请输入Y轴参数'))
            } else if (value.varY && isNaN(value.varY)) {
                return cb(new Error('请正确输入Y轴参数'))
            }
            else {
                return cb()
            }
        }
        return {
            form: {
                name: '',
                templateId: '',
                companyId: '',
                extrSystemId : '',
                linkType: '',
                linkTypeDesc: '',
                partys: [
                    {
                        params: [
                            {
                                varCode: '',
                                varName: '',
                                varPages: '',
                                varX: '',
                                varY: ''
                            }
                        ],
                        signMode: '0',
                        signNo: 1,
                        userId: '',
                        userName: '',
                        userType: '',
                        userDetailType: '2.1'
                    },
                    {
                        params: [
                            {
                                varCode: '',
                                varName: '',
                                varPages: '',
                                varX: '',
                                varY: ''
                            }
                        ],
                        signMode: '1',
                        signNo: 2,
                        userId: '',
                        userName: '',
                        userType: '',
                        userDetailType: '1'
                    }
                ],
                memo: '',
                partycount: '2',
                height: '',
                width: '',
                fpages: '',
                accessType: '1',
                smsType: '1',
	            signSmsType: '1',
                linkType: '1',
                passportType: '1',
                signModel: '2',
                bindBank: '2'
            },
            rules: {
                name: [
                    { required: true, message: '请输入模板名称', trigger: 'blur' }
                ],
                platform: [
                    { required: true, message: '请选择商户名称', trigger: 'blur' }
                ],
                fpages: [
                    { required: true, message: '请上传合同模板', trigger: 'blur' }
                ],
                // memo: [
                //     { required: true, message: '请填写备注', trigger: 'blur' }
                // ],
                partycount: [
                    { required: true, message: '请选择签约对象数量', trigger: 'blur' }
                ],
                accessType: [
                    { required: true, message: '请选择对接方式', trigger: 'blur' }
                ],
                signModel: [
                    { required: true, message: '请选择实名认证方式', trigger: 'blur' }
                ],
                smsType: [
                    { required: true, message: '请选择是否发送短信', trigger: 'blur' }
                ],
                linkType: [
                    { required: true, message: '请选择返回链接方式', trigger: 'blur' }
                ],
                passportType: [
                    { required: true, message: '请选择是否需要上传证件照', trigger: 'blur' }
                ],
                bindBank: [
                    { required: true, message: '请选择是否需要绑定银行卡', trigger: 'blur' }
                ]
            },
            platform: [],
            objects: [],
            baseUrl: baseUrl,
            contracts: [
                {
                    text: '甲乙（两方合同）',
                    value: '2'
                },
                {
                    text: '甲乙丙（三方合同）',
                    value: '3'
                }
            ],
            type: [
                {
                    name: '个人',
                    value: '1',
                    userDetailType: '1'
                },
                {
                    name: '服务商',
                    value: '2',
                    userDetailType: '2.1'
                },
                {
                    name: '公司',
                    value: '2',
                    userDetailType: '2.2'
                }
            ],
            peer: [],
            select: '',
            radio: '',
            file: '',
            fileList: [],
            ltype: '',
            checkPostion,
            isRe: false,
            defaultPosition: '',
            signModels: [
                {
                    text: '后台发起签约时',
                    value: '1'
                },
                {
                    text: '由用户上传个人信息',
                    value: '2'
                }
            ],
            isDisable: false,
            isDisable_0: false,
            signModes: [
                {
                    text: '自动签约',
                    value: '0'
                },
                {
                    text: '手动签约',
                    value: '1'
                },
                {
                    text: '批量手动签约',
                    value: '2'
                },
                {
                  text: '线下签约',
                  value: '3'
                }
            ],
            accessTypes: [
                {
                    text: 'SaaS对接',
                    value: '1'
                },
                {
                    text: 'API对接',
                    value: '2'
                }
            ],
            bindBank: false
        }
    },
    watch: {
        'form.partycount': function(a) {
            if(a == 2 && this.form.partys && this.form.partys.length == 3) {
                this.form.partys.pop()
            }
            if(a == 3 && this.form.partys && this.form.partys.length == 2) {
                this.form.partys.push({
                    params: [
                        {
                            varCode: '',
                            varName: '',
                            varPages: '',
                            varX: '',
                            varY: ''
                        }
                    ],
                    signMode: '',
                    signNo: 3,
                    userId: '',
                    userName: '',
                    userType: '',
                    userDetailType: ''
                })
            }
            this.setDefaultPosition()
        },
        'form.platform': function(a) {
            this.platform.forEach(e => {
                if(e.extrSystemId == a){
                    this.form.companyId = e.extrSystemGroup
                }
            })
        }
    },
    mounted() {
        if(sessionStorage.getItem('msg')) {
            this.form = JSON.parse(sessionStorage.getItem('msg'))
            delete this.form.notifyType
            sessionStorage.removeItem('msg')
            this.remoteMethod(this.form.platformName).then(data => {
                this.getBindStatus(true)
            })
            // this.platform.push({
            //     extrSystemName: this.form.platformName,
            //     extrSystemId: this.form.platform,
            //     extrSystemGroup: this.form.companyId
            // })
            if(this.form.partys) {
	            this.form.partys.forEach((e, i) => {
		            if(e.userName) {
			            this.objects.push({
				            name: e.userName,
				            userId: e.userId
			            })
		            }
	            })
            }

            this.fileList.push({
                name: this.form.fname,
                url: this.form.furl
            })
            this.ltype = this.$route.query.type
            this.isRe = true
        }
        else {
            this.form.partys.forEach((e, i) => {
                this.objectChange(i)
            })
        }
        if(!this.form.templateId) {
            get('/api/econtract/template/getnextid').then(data => {
                this.form.templateId = data
            })
        }
    },
    methods: {
        remoteMethod(a) {
            return new Promise((resolve, reject) => {
                if(a) {
                    get('/api/econtract/user/clientqry', {
                        extrSystemName: a,
                        pageNo: 1,
                        pageSize: 10
                    }).then(data => {
                        this.platform = data
                        resolve(data)
                    }).catch(err => {
                        reject(err)
                    })
                }
                else {
                    reject(a)
                }
            })
        },
        remoteObject(a) {
            if(a !== '') {
                post('/api/econtract/user/company/qrylist', {
                    name: a,
                    pageNo: 1,
                    pageSize: 10
                }).then(data => {
                    this.objects = data.data
                })
            }
        },
        upload(a) {
            this.fileList.shift()
            var formData = new FormData()
            formData.append('templateId', this.form.templateId)
            formData.append('fileName', a.name)
            formData.append('file', a.raw)
            importPost('/api/econtract/template/parsefile', formData).then(data => {
                this.form.height = data.height
                this.form.width = data.width
                this.form.fpages = data.pageSize
                this.fileList.push({
                    name: a.name,
                    url: a.templateId
                })
                this.form.fname = ''
                this.defaultPosition = data
                this.setDefaultPosition()
            })
            this.file = a
        },
        remove() {
            this.form.height = ''
            this.form.width = ''
            this.form.fpages = ''
            this.fileList.length = 0
        },
        objectChange(i) {
            this.form.partys[i].userType = Math.floor(this.form.partys[i].userDetailType)
            if(this.form.partys[i].userType == 1) {
                this.form.partys[i].userId = ''
                this.form.partys[i].userName = ''
                this.form.partys[i].params.forEach(e => {
                    e.varCode = '10000'
                    e.varName = '手写签名'
                })
            }
            else {
                this.form.partys[i].params.forEach(e => {
                    e.varCode = '20000'
                    e.varName = '公司盖章'
                })
            }
            this.setDefaultPosition()
        },
        isOffline(i) {
          var party = this.form.partys[i]
          if(party.signMode == 3) {
            if(party.userType == 2) {
              party.params[0].varPages = this.form.fpages || '3'
              party.params[0].varX = '88.44'
              party.params[0].varY = '305.86'
            }
            else {
              party.params[0].varPages = this.form.fpages || '3'
              party.params[0].varX = '362.01'
              party.params[0].varY = '303.2'
            }
          }
          else {
              this.setDefaultPosition(party.signNo)
          }
          this.$forceUpdate()
          this.checkNote()
        },
        addParams(i) {
            var a = {
                varCode: '20000',
                varName: '公司盖章',
                varPages: '',
                varX: '',
                varY: ''
            }
            if(this.form.partys[i].userType == 1) {
                a.varCode = '10000'
                a.varName = '手写签名'
            }
            this.form.partys[i].params.push(a)
        },
        deleteParams(i, j) {
            this.form.partys[i].params.splice(j, 1)
        },
        submit() {
            this.$refs['form'].validate(valid => {
                if(valid) {
                    var companyPartyNum = 0, errMsg, hasPeople,  hasCompany, hasServer
                    if(this.form.partys) {
	                    this.form.partys.forEach(e => {
		                    if(e.userType == 2){
			                    companyPartyNum++
		                    }
		                    if(e.userDetailType == 1) {
			                    hasPeople = true
		                    }
		                    if(e.userDetailType == 2.1) {
			                    hasServer = true
		                    }
		                    if(e.userDetailType == 2.2) {
			                    hasCompany = true
		                    }
		                    if(!errMsg){
			                    e.params.forEach(el => {
				                    if(parseInt(el.varPages) > parseInt(this.form.fpages)) {
					                    errMsg = '超出合同最大页数！'
				                    }
				                    else if(parseFloat(el.varX) > parseFloat(this.form.width)) {
					                    errMsg = '超出合同最大宽度！'
				                    }
				                    else if(parseFloat(el.varY) > parseFloat(this.form.height)) {
					                    errMsg = '超出合同最大高度！'
				                    }
			                    })
		                    }
	                    })
                    }

                    if(this.form.isSign === '1') {
	                    if(this.form.partycount == 2 && !(hasPeople && hasServer)) {
		                    errMsg = '签约对象类型必须有1个服务商、1个个人'
	                    }
	                    if(this.form.partycount == 3 && !(hasPeople && hasServer && hasCompany)) {
		                    errMsg = '1个服务商、1个企业、1个个人'
	                    }
                    }

                    if(errMsg) {
                        this.$message.error(errMsg)
                        return
                    }
                    if(!this.form.fname) {
                        var formData = new FormData()
                        formData.append('templateId', this.form.templateId)
                        formData.append('fileName', this.file.name)
                        formData.append('file', this.file.raw)
                        formData.append('personalPartyNum', this.form.partys[1].signNo)
                        formData.append('companyPartyNum', companyPartyNum)
                        formData.append('partyCount', this.form.partycount)
                        importPost('/api/econtract/template/uploadfile', formData).then(data => {
                            this.form.fname = data.fname
                            this.form.furl = data.url
                            if(this.isRe) {
                                this.change()
                            }
                            else {
                                this.add()
                            }
                        })
                    }
                    else {
                        this.change()
                    }
                }
                else {
                    this.$message({
                        type: 'warning',
                        message: '请正确填写表单！'
                    })
                }
            })
        },
        add() {
            post('/api/econtract/template/add', this.form).then(data => {
                this.$message({
                    type: 'success',
                    message: '添加成功！'
                })
                this.back()
            })
        },
        change() {
            post('/api/econtract/template/mod', this.form).then(data => {
                this.$message({
                    type: 'success',
                    message: '修改成功！'
                })
                sessionStorage.setItem('resetPage', '1')
                this.back()
            })
        },
        back() {
            this.$router.back()
        },
        setDefaultPosition(signNo) {
            if(this.defaultPosition) {
                this.form.partys.forEach((e, i) => {
                    if(signNo && e.signNo != signNo) {
                        return
                    }
                    if(e.signMode == 3) {
                      e.params.forEach(ev => {
                        if(ev.varPages && ev.varPages > this.form.fpages) {
                          ev.varPages = this.form.fpages
                        }
                      })
                      return
                    }
                    e.params.forEach(ev => {
                        ev.varPages = this.defaultPosition.pageSize
                        if(this.form.partycount == 2) {
                            if(e.userType == 1) {
                                ev.varX = this.defaultPosition.px
                                ev.varY = this.defaultPosition.py
                            }
                            else {
                                ev.varX = this.defaultPosition.ex
                                ev.varY = this.defaultPosition.ey
                            }
                        }
                        else {
                            ev.varX = ''
                            ev.varY = ''
                        }
                    })
                })
            }
            this.checkNote()
        },
        checkNote() {
            var isAuto = this.form.partys.filter(e => {
                return e.userDetailType == 1 && e.signMode == '0'
            }).length
            if(isAuto) {
                if(this.form.signModel == '1' || this.form.accessType == '2') {
                    this.form.smsType = '2'
                }
                else {
                    this.form.smsType = '1'
                }
                this.isDisable = true
            }
            else {
                this.isDisable = false
            }
            console.log(this.form.partys[this.form.partys.length - 1].signMode == 3)
            if(this.form.partys[this.form.partys.length - 1].signMode == 3) {
              this.isDisable_0 = true
              this.form.signModel = '1'
            }
            else {
              this.isDisable_0 = false
            }
        },
        accessTypeChange() {
            if(this.form.accessType == '2') {
                this.form.signModel = '1'
            }
            this.checkNote()
        },
        getBindStatus(a) {
            this.platform.forEach(e => {
                if(this.form.platform == e.extrSystemId) {
                    this.bindBank = e.bindBank === '1' ? true : false
                    if(a !== true && this.bindBank) {
                        this.form.signModel = '2'
                        this.form.bindBank = '1'
                    }
                }
            })
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
.title {
    margin-bottom: 20px;
}
.mtitle {
  font-size: 14px;
  color: #333;
  border-left: 4px solid #0283fb;
  height: 16px;
  text-indent: 10px;
  margin: 20px 0 15px;
}
.form_input {
    width: 400px;
}
.form_short {
    width: 200px;
}
textarea {
    padding: 6px 12px;
}
</style>


<style lang="scss">
    .template-main {
        .el-form-item {
            margin-bottom: 0;
        }

        .el-tag--info {
            margin-right: 10px;
        }

        .el-upload {
            display: inherit;
        }
    }

</style>













