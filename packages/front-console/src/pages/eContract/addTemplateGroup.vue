<template>
    <div class="main template-main">
        <div class="title">{{ltype ? '查看' : (form.groupId ? '修改' : '新增')}}合同模板组</div>
        <el-form :model="form" :rules="rules" label-width="150px" :disabled="ltype ? true : false" ref="form">
            <div class="mtitle">基础信息设置</div>
            <el-form-item label="合同模板组名称:" prop="groupName">
                <el-input v-model="form.groupName" class="form_input" placeholder="请填写合同模板组名称" size="small"></el-input>
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
                        @visible-change="platformSelectVisible"
                        @change="platformSelectChange"
                        size="small">
                        <el-option
                            v-for="e in platform"
                            :key="e.extrSystemId"
                            :label="e.extrSystemName"
                            :value="e.extrSystemId">
                        </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="备注" prop="memo">
                <!--<textarea rows="6" class="form_input" v-model="form.memo" placeholder="备注"></textarea>-->
                <el-input type="textarea" :rows="6" :maxlength="500" v-model="form.memo" class="form_input" placeholder="备注" size="small"></el-input>
            </el-form-item>

            <div class="mtitle">签约方式设置</div>
            <el-form-item label="对接方式" prop="accessType">
                <el-radio-group v-model="form.accessType" @change="settingChangeConfirm('accessType', '签约方式', ['1', '2'])">
                    <el-radio label="1">SaaS对接</el-radio>
                    <el-radio label="2" >API对接</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否发送短信" prop="smsType">
                <el-radio-group v-model="form.smsType" @change="settingChangeConfirm('smsType', '签约方式', ['1', '2'])">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="短信引导内容" prop="smsType">
                <el-radio-group v-model="form.signSmsType" @change="settingChangeConfirm('signSmsType', '签约方式', ['1', '2'])">
                    <el-radio label="1">直接签约</el-radio>
                    <el-radio label="2">通过小程序签约</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="返回链接" prop="linkType">
                <el-radio-group v-model="form.linkType" @change="settingChangeConfirm('linkType', '签约方式', ['1', '2'])">
                    <el-radio label="1">证照上传页面</el-radio>
                    <el-radio label="2">签约页面</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="是否需要上传证件照" prop="passportType">
                <el-radio-group v-model="form.passportType" @change="settingChangeConfirm('passportType', '签约方式', ['1', '2'])">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                </el-radio-group>
            </el-form-item>
            <!-- <el-form-item label="是否需要绑定银行卡" prop="bindBank" v-if="bindBank">
                <el-radio-group v-model="form.bindBank" @change="settingChangeConfirm('bindBank', '签约方式', ['1', '2'])">
                    <el-radio label="1">是</el-radio>
                    <el-radio label="2">否</el-radio>
                </el-radio-group>
            </el-form-item> -->

            <div class="mtitle">C端合同设置</div>
            <el-form-item label="合同类型" prop="partyCount">
                <el-select v-model="form.partyCount" size="small" @change="settingChangeConfirm('partyCount', '合同类型', ['2', '3'])">
                    <el-option label="甲乙（两方合同）" value="2"></el-option>
                    <el-option label="甲乙丙（三方合同）" value="3"></el-option>
                </el-select>
            </el-form-item>

            <el-form-item label="合同列表" prop="">
                <div class="contract-table-container">
                    <div>
                        <el-button size="small" @click="openDialogTwo">选择已有合同模板</el-button>
                        <el-button size="small" @click="openDialog">新建合同模板</el-button>
                    </div>
                    <el-table :data="templateArr">
                        <el-table-column label="合同模板ID" prop="templateId"></el-table-column>
                        <el-table-column label="合同模板名称" prop="name"></el-table-column>
                        <el-table-column label="商户名称" prop="platformName"></el-table-column>
                        <el-table-column label="服务商名称" prop="">
                            <template slot-scope="scope">
                                <div v-for="item in scope.row.partys" v-if="item.userName">{{item.userName}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="签署方式" prop="">
                            <template slot-scope="scope">
                                <div v-for="(item, _index) in scope.row.partys">{{partyKeyList[_index]}}: {{signModeList[item.signMode]}}</div>
                            </template>
                        </el-table-column>
                        <el-table-column label="合同原件" prop="fname">
                            <template slot-scope="scope">
                                <a :href="`${baseUrl}/api/econtract/template/download?templateId=${scope.row.templateId}`" target="_blank">{{scope.row.fname}}</a>
                            </template>
                        </el-table-column>

                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="editTemplate(scope.$index, false)">查看</el-button>
                                <el-button type="text" size="small" @click="editTemplate(scope.$index, 'edit')">修改</el-button>
                                <el-button type="text" size="small" @click="deleteTemplate(scope.$index)">移除</el-button>
                                <el-button type="text" size="small" @click="templateUp(scope.$index)">上移</el-button>
                                <el-button type="text" size="small" @click="templateDown(scope.$index)">下移</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form-item>
        </el-form>
        <el-button type="primary" size="small" @click="formSubmit" v-if="!ltype">提交</el-button>
        <el-button size="small" @click="back">{{ltype ? '返回' : '取消'}}</el-button>
        <el-dialog
                title="新建合同模板"
                :visible.sync="dialogVisible">
            <el-form :model="templateModel" :rules="templateRules" label-width="150px" ref="templateModel">
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
                    <el-input v-model="templateModel.width" size="small" disabled class="form_short">
                        <template slot="prepend">宽</template>
                        <template slot="append">pt</template>
                    </el-input>
                    <el-input v-model="templateModel.height" size="small" disabled class="form_short">
                        <template slot="prepend">高</template>
                        <template slot="append">pt</template>
                    </el-input>
                    <el-input v-model="templateModel.fpages" size="small" disabled class="form_short">
                        <template slot="prepend">合同页数</template>
                        <template slot="append">页</template>
                    </el-input>
                </el-form-item>
                <el-form-item label="是否需要签署">
                    <el-radio @change="changeSignType" v-model="templateModel.isSign" label="1" :disabled="templateModel.fromModel">是</el-radio>
                    <el-radio @change="changeSignType" v-model="templateModel.isSign" label="2" :disabled="templateModel.fromModel">否</el-radio>
                </el-form-item>

                <div v-if="templateModel.isSign === '1'">
                    <template v-for="(item, i) in templateModel.partys">
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
                                        @change="setUserData(i)"
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
                            <el-radio v-model="item.signMode" label="0">自动签约</el-radio>
                            <!--<el-radio v-model="item.signMode" label="1">手动签约</el-radio>
                            <el-radio v-model="item.signMode" label="2" v-if="item.userType == 2">批量手动签约</el-radio>-->
                        </el-form-item>

                        <template v-for="(e, j) in item.params">
                            <el-form-item :label="item.userType == 2 ? '公司盖章坐标' : '手写签名坐标'" :prop="`partys[${i}].params[${j}]`" :rules="[
                            {validator: checkPostion, trigger: 'change'}]">
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
                </div>
                <el-form-item v-if="templateModel.partys && templateModel.partys[1].userDetailType === '1'" label="合同上显示其他变量">
                  <el-checkbox-group v-model="contractOther">
                    <el-checkbox label="0" disabled>身份证</el-checkbox>
                    <el-checkbox label="1">手机号</el-checkbox>
                    <el-checkbox label="2">签署日期</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addTemplate" v-if="editType === 'new'">确 定</el-button>
                <el-button type="primary" @click="saveTemplate" v-if="editType === 'edit'">保 存</el-button>
            </span>
        </el-dialog>

        <el-dialog
                title="选择已有合同模板"
                :visible.sync="dialogVisibleTwo">
            <el-form :model="queryForm" :inline="true" ref="query">
                <el-form-item label="关键词：" prop="searchContent">
                    <el-input style="width: 300px" v-model="queryForm.searchContent" size="small" placeholder="请输入合同模板ID/合同模板名称/商户名称"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="small" @click="query">查询</el-button>
                    <el-button type="text" size="small" @click="reset('query')">清空所有条件</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="templateList.data">
                <el-table-column label="合同模板名称" prop="name"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="preAddTemplate(scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <ayg-pagination
                    v-if="templateList.total"
                    :total="templateList.total"
                    v-on:handleSizeChange="setSize"
                    :currentSize="pageSize"
                    v-on:handleCurrentChange="query"
                    :currentPage="pageIndex">
            </ayg-pagination>

            <el-form label-width="150px">
                <el-form-item label="选中合同模板">
                    <el-tag
                            v-for="(item, index) in preAddTemplateList"
                            :key="item.templateId"
                            type="info"
                            closable
                            @close="deletePreAddTemplate(index)">
                        {{item.name}}
                    </el-tag>
                </el-form-item>
            </el-form>

            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisibleTwo = false">取 消</el-button>
                <el-button type="primary" @click="addTemplateTwo">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
	import { post, get, importPost } from "../../store/api"
	import { baseUrl } from "../../config/address"
	import { showNotify } from "../../plugin/utils-notify";
	import { showConfirm } from "../../plugin/utils-message";

	import _ from 'lodash'

	export default {
		created() {
			this.ltype = this.$route.query.type

			let groupId = this.$route.query.id
			if(groupId) {
				this.groupId = groupId
				post('/api/econtract/template-group/detail', {
					templateGroupId: groupId
				}).then(result => {
					this.form = result
					this.templateArr = result.templates
                    _.forEach(this.templateArr, template => {
	                    template.fromModel = true
                    })
                    this.remoteMethod(this.form.platformName).then(data => {
                        this.getBindStatus(true)
                    })
                    this.setPlatformName()
					// this.platform.push({
					// 	extrSystemName: this.form.platformName,
					// 	extrSystemId: this.form.platform,
					// 	extrSystemGroup: this.form.companyId
          // })
				})
			}
		},
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
        contractOther: ['0'],
				form: {
					groupName: '',
					platform: '',
					memo: '',
					accessType: '1',
					smsType: '1',
					signSmsType: '1',
					linkType: '1',
                    passportType: '1',
                    bindBank: '2',
					partyCount: '2'
				},
				rules: {},
				platform: [],
				ltype: '',
				templateArr: [],
				dialogVisible: false,
				templateModel: {
					isSign: '1',
					partys: [{
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
						signNo: 1,
						userId: '',
						userName: '',
						userType: '',
						userDetailType: ''
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
							signMode: '',
							signNo: 2,
							userId: '',
							userName: '',
							userType: '',
							userDetailType: ''
						}]
				},
				templateRules: {},
				baseUrl: baseUrl,
				fileList: [],
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
				signModeList: {
					'0': '自动签约',
					'1': '手动签约',
					'2': '批量手动签约'
				},
				partyKeyList: ['甲方', '乙方', '丙方'],
				dialogVisibleTwo: false,
				templateId: '',
				pageSize: 10,
				pageIndex: 1,
				queryForm: {
					searchContent: ''
				},
				templateList: {},
				preAddTemplateList: [],
				objects: [],
				platformName: '',
				checkPostion,
				editType: false,
				editIndex: '',
                groupId: '',
                oldPlatForm: [],
                oldExtrSystemId: '',
                bindBank: false
			}
		},
		watch: {
			'form.partyCount': function(a) {
				console.log(a)
				if(a === '2' && this.templateModel.partys && this.templateModel.partys.length === 3) {
					this.templateModel.partys.pop()
				}
				if(a === '3' && this.templateModel.partys && this.templateModel.partys.length === 2) {
					this.templateModel.partys.push({
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

				// this.templateArr = []
			},
			'form.platform': function(a) {
			    this.setPlatformName()
			}
		},
		methods: {
		    // 设置商户名称
            setPlatformName() {
                this.platform.forEach(e => {
                    if(e.extrSystemId === this.form.platform){
                        this.platformName = e.extrSystemName
                        this.form.companyId = e.extrSystemGroup
                        // console.log(this.form.companyId)
                    }
                })
            },
			remoteMethod(a) {
                return new Promise((resolve, reject) => {
                    if(a) {
                        get('/api/econtract/user/clientqry', {
                            extrSystemName: a,
                            pageNo: 1,
                            pageSize: 10
                        }).then(data => {
                            this.platform = data
                            this.setPlatformName()
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
			back() {
				this.$router.back()
			},
			upload(a) {
				this.fileList.shift()
				var formData = new FormData()
				formData.append('templateId', this.templateId)
				formData.append('fileName', a.name)
				formData.append('file', a.raw)
				importPost('/api/econtract/template/parsefile', formData).then(data => {
					this.templateModel.height = data.height
					this.templateModel.width = data.width
					this.templateModel.fpages = data.pageSize
					this.fileList.push({
						name: a.name,
						url: a.templateId
					})
					this.templateModel.fname = ''
					this.templateModel.furl = ''
				})
				this.file = a
				// console.log(a)
			},
			remove() {
				this.templateModel.height = ''
				this.templateModel.width = ''
				this.templateModel.fpages = ''
				this.fileList = []
				// this.fileList.length = 0
			},
			openDialog() {
				if(!this.form.platform || !this.form.groupName) {
					showNotify('warning', '请先填写基础信息设置')
					return
        }
        this.initContractOther()
        // this.contractOther = ['0']
				get('/api/econtract/template/getnextid')
					.then(result => {
						this.editType = 'new'
						this.templateId = result
						this.fileList = []
                        this.file = null
						this.templateModel = {
							isSign: '1',
							partys: [{
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
								signNo: 1,
								userId: '',
								userName: '',
								userType: '',
								userDetailType: ''
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
									signMode: '',
									signNo: 2,
									userId: '',
									userName: '',
									userType: '',
									userDetailType: ''
								}]
						}
						if(this.form.partyCount == 3) {
							this.templateModel.partys.push({
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
						this.dialogVisible = true
					})
			},
			objectChange(i) {
				// console.log(this.form.partys[i].userDetailType)
				this.templateModel.partys[i].userType = Math.floor(this.templateModel.partys[i].userDetailType)
				if(this.templateModel.partys[i].userType == 1) {
					this.templateModel.partys[i].userId = ''
					this.templateModel.partys[i].userName = ''
					this.templateModel.partys[i].params.forEach(e => {
						e.varCode = '10000'
						e.varName = '手写签名'
					})
				}
				else {
					this.templateModel.partys[i].params.forEach(e => {
						e.varCode = '20000'
						e.varName = '公司盖章'
					})
				}
			},
			remoteObject(a) {
				if(a !== '') {
					post('/api/econtract/user/company/qrylist', {
						name: a,
						pageNo: 1,
						pageSize: 10
					}).then(data => {
						// console.log(data)
						this.objects = data.data
					})
				}
			},
			deleteParams(i, j) {
				this.templateModel.partys[i].params.splice(j, 1)
			},
			setUserData(i) {
				let _this = this
				let _index = _.findIndex(this.objects, function (o) {
					return o.userId === _this.templateModel.partys[i].userId
				})
				this.templateModel.partys[i].userName = this.objects[_index].name
			},
			addParams(i) {
				let a = {
					varCode: '20000',
					varName: '公司盖章',
					varPages: '',
					varX: '',
					varY: ''
				}
				if(this.templateModel.partys[i].userType == 1) {
					a.varCode = '10000'
					a.varName = '手写签名'
				}
				this.templateModel.partys[i].params.push(a)
			},
			addTemplate() {
				this.$refs['templateModel'].validate(valid => {
					if(valid) {
						let errMsg
						let hasPeople,  hasCompany, hasServer
						let templateModel = _.cloneDeep(this.templateModel)

                        // templateModel.partys = [{
                        //     userName: this.form.platform
                        // }]

						if(!this.file || !this.fileList.length) {
							errMsg = '请上传文件！'
						}

						if(templateModel.isSign === '1') {
							_.forEach(templateModel.partys, party => {
								if(party.userDetailType === '1') {
									hasPeople = true
								}
								if(party.userDetailType === '2.1') {
									hasServer = true
								}
								if(party.userDetailType === '2.2') {
									hasCompany = true
								}

								_.forEach(party.params, el => {

									if(parseInt(el.varPages) > parseInt(templateModel.fpages)) {
										errMsg = '超出合同最大页数！'
									}
									else if(parseFloat(el.varX) > parseFloat(templateModel.width)) {
										errMsg = '超出合同最大宽度！'
									}
									else if(parseFloat(el.varY) > parseFloat(templateModel.height)) {
										errMsg = '超出合同最大高度！'
									}
								})
							})

							if(this.form.partyCount == 2 && (!hasPeople || !hasServer)) {
								errMsg = '签约对象类型必须有1个服务商、1个个人'
							}
							if(this.form.partyCount == 3 && (!hasPeople || !hasServer | !hasCompany)) {
								errMsg = '1个服务商、1个企业、1个个人'
							}
						}

						if(errMsg) {
							this.$message({
								type: 'warning',
								message: errMsg
							})

							return
						}

						templateModel = _.assign(templateModel, {
							templateId: this.templateId,
							name: this.file.name,
							platformName: this.platformName,
							platform: this.form.platform,
							accessType: this.form.accessType,
							smsType: this.form.smsType,
							signSmsType: this.form.signSmsType,
							linkType: this.form.linkType,
                            passportType: this.form.passportType,
                            bindBank: this.form.bindBank,
							partycount: this.form.partyCount,
							isChange: '1',
							fromGroup: '1',
                            companyId: this.form.companyId,
                            signModel: this.form.accessType == '1' ? '2' : '1'
						})

						// console.log(templateModel)
						let formData = new FormData()
						formData.append('templateId', this.templateId)
						formData.append('fileName', this.file.name)
						formData.append('file', this.file.raw)
						formData.append('partyCount', templateModel.partycount)

						let personalPartyNum
						let companyPartyNum = ''
						_.forEach(templateModel.partys, party => {
							if(party.userType.toString() === '2') companyPartyNum += party.signNo
							else personalPartyNum = party.signNo
						})
						formData.append('personalPartyNum', personalPartyNum)
						formData.append('companyPartyNum', companyPartyNum)
            this.changeFormContractOther(formData)
						importPost('/api/econtract/template/uploadfile', formData)
							.then(result => {
								templateModel.fname = result.fname
								templateModel.furl = result.url
                templateModel.name = result.fname
                if(templateModel.isSign === '2') templateModel.partys = null
                // templateModel.displayPersonalIdentity = '1'
                // templateModel.displayPersonalMobile = this.contractOther.indexOf('1') >= 0 ? '1' : '2'
                // templateModel.displayPersonalSigntime = this.contractOther.indexOf('2') >= 0 ? '1' : '2'
                // this.contractOther = ['0']
								this.templateArr.push(templateModel)
                this.dialogVisible = false
                // c成功后要给templateArr赋值，不然点开没数据
                if(this.templateArr.length) {
                  this.initFormContractOther(this.templateArr.length-1)
                }
							})
          }else {
						this.$message({
							type: 'warning',
							message: '请正确填写表单！'
						})
          }
        })

			},
			openDialogTwo() {
				this.dialogVisibleTwo = true
        this.query()
			},
			reset(name) {
				this.$refs[name].resetFields();
			},
			setSize(a) {
				this.pageSize = a
				this.query()
			},
			query(a) {
				if(isNaN(a)){
					a = 1
				}

				let formData = _.cloneDeep(this.queryForm)
				formData = _.assign(formData, {
					pageNo: a,
					pageSize: this.pageSize,
					partyCount: this.form.partyCount,
					accessType: this.form.accessType,
					linkType: this.form.linkType,
					smsType: this.form.smsType,
					signSmsType: this.form.signSmsType,
                    passportType: this.form.passportType,
                    bindBank: this.form.bindBank,
					extrSystemId: this.form.platform
				})

				post('/api/econtract/template/screen-qrylist', formData)
					.then(result => {
						this.templateList = result
					})
			},
			preAddTemplate(template) {
				let _index = _.findIndex(this.preAddTemplateList, function (o) {
					return o.templateId === template.templateId
				})

				if(_index === -1) this.preAddTemplateList.push(template)
			},
			deletePreAddTemplate(_index) {
				this.preAddTemplateList.splice(_index, 1)
			},
			addTemplateTwo() {
				// this.templateArr = _.concat(this.templateArr, this.preAddTemplateList)
				_.forEach(this.preAddTemplateList, template => {
					let _index = _.findIndex(this.templateArr, function (o) {
						return o.templateId === template.templateId
					})
					if(_index === -1) {
						template.fromModel = true
						this.templateArr.push(template)
					}
				})
				this.preAddTemplateList = []
				this.dialogVisibleTwo = false
			},
			deleteTemplate(_index) {
				this.templateArr.splice(_index, 1)
			},
			templateUp(_index) {
				if(!_index) return
				let _template = this.templateArr.splice(_index, 1)[0]
				this.templateArr.splice(_index - 1, 0, _template)

			},
			templateDown(_index) {
				if(_index === this.templateArr.length - 1) return
				let _template = this.templateArr.splice(_index, 1)[0]
				this.templateArr.splice(_index + 1, 0, _template)
			},
			formSubmit() {
				if(!this.form.groupName || !this.form.platform) {
					this.$message({
						type: 'warning',
						message: '合同模板组名称和商户名称不能为空！'
					})
					return
                }
				if(!this.templateArr.length) {
					this.$message({
						type: 'warning',
						message: '合同列表为空！'
					})
					return
                }

				let form = _.cloneDeep(this.form)
				form.downloadSmsType = form.signSmsType
				form.templates = this.templateArr
				form.enable = '1'
                form.platformName = this.platformName
                if(form.accessType == '1') {
                    form.signModel = '2'
                }
                else {
                    form.signModel = '1'
                }
      
				post('/api/econtract/template-group/add-update', form)
					.then(result => {
						showNotify('success', form.groupId ? '修改成功' : '创建成功')
						this.back()
					})
			},
			editTemplate(_index, type) {
				this.templateModel = _.cloneDeep(this.templateArr[_index])
				this.templateId = this.templateModel.templateId
				this.fileList = []
                this.file = null
				this.objects = []
				this.fileList.push({
					name: this.templateModel.fname,
					url: this.templateModel.furl
				})

                if(this.templateModel.partys) {
	                this.templateModel.partys.forEach((e, i) => {
		                if(e.userName) {
			                this.objects.push({
				                name: e.userName,
				                userId: e.userId
			                })
		                }
	                })
                }else {

                }

				this.editType = type
				this.editIndex = _index
        this.dialogVisible = true
        // 初始化合同其他信息多选框
        this.initContractOther(_index)
			},
			saveTemplate() {
				this.$refs['templateModel'].validate(valid => {
					if(valid) {
						let errMsg
						let hasPeople,  hasCompany, hasServer
						let templateModel = _.cloneDeep(this.templateModel)

						if(!this.fileList.length) {
							errMsg = '请上传文件！'
						}

						if(templateModel.isSign === '1') {
							_.forEach(templateModel.partys, party => {
								if(party.userDetailType === '1') {
									hasPeople = true
								}
								if(party.userDetailType === '2.1') {
									hasServer = true
								}
								if(party.userDetailType === '2.2') {
									hasCompany = true
								}

								_.forEach(party.params, el => {

									if(parseInt(el.varPages) > parseInt(templateModel.fpages)) {
										errMsg = '超出合同最大页数！'
									}
									else if(parseFloat(el.varX) > parseFloat(templateModel.width)) {
										errMsg = '超出合同最大宽度！'
									}
									else if(parseFloat(el.varY) > parseFloat(templateModel.height)) {
										errMsg = '超出合同最大高度！'
									}
								})
							})

							if(this.form.partyCount == 2 && (!hasPeople || !hasServer)) {
								errMsg = '签约对象类型必须有1个服务商、1个个人'
							}
							if(this.form.partyCount == 3 && (!hasPeople || !hasServer | !hasCompany)) {
								errMsg = '1个服务商、1个企业、1个个人'
							}
						}

						if(errMsg) {
							this.$message({
								type: 'warning',
								message: errMsg
							})

							return
						}


						templateModel.isChange = '1'

            if(this.file) {
              let formData = new FormData()
              formData.append('templateId', this.templateId)
              formData.append('fileName', this.file.name)
              formData.append('file', this.file.raw)
              formData.append('isSign', templateModel.isSign)
              formData.append('partyCount', templateModel.partycount)

              let personalPartyNum = ''
              let companyPartyNum = ''
              if(templateModel.isSign === '1') {
                _.forEach(templateModel.partys, party => {
                  if(party.userType.toString() === '2') companyPartyNum += party.signNo
                  else personalPartyNum = party.signNo
                })
              }

              formData.append('personalPartyNum', personalPartyNum)
              formData.append('companyPartyNum', companyPartyNum)
                formData.append('platform', templateModel.platform)
              this.changeFormContractOther(formData)
              importPost('/api/econtract/template/uploadfile', formData)
                .then(result => {
                  templateModel.name = result.fname
                  templateModel.fname = result.fname
                  templateModel.furl = result.url
                  // this.templateArr[this.editIndex] = templateModel
                  this.templateArr.splice(this.editIndex, 1)
                  this.templateArr.splice(this.editIndex, 0, templateModel)
                  this.dialogVisible = false
                  // c成功后要给form赋值，不然点开没数据
                  this.initFormContractOther(this.editIndex)
                })
            }else {
              this.templateArr.splice(this.editIndex, 1)
              this.templateArr.splice(this.editIndex, 0, templateModel)
              this.dialogVisible = false
              // c成功后要给form赋值，不然点开没数据
              this.initFormContractOther(this.editIndex)
            }

					}else {
						this.$message({
							type: 'warning',
							message: '请正确填写表单！'
						})
					}
				})

			},
      changeSignType(e) {
				// console.log(e)
				if(e === '2') this.templateModel.partys = null
                else if(e === '1') {
	                this.templateModel.partys = [{
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
		                signNo: 1,
		                userId: '',
		                userName: '',
		                userType: '',
		                userDetailType: ''
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
			                signMode: '',
			                signNo: 2,
			                userId: '',
			                userName: '',
			                userType: '',
			                userDetailType: ''
		                }]
	                if(this.form.partyCount == 3) {
		                this.templateModel.partys.push({
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
                }
            },
			settingChangeConfirm(key, msg, _dataList) {
				if(!this.templateArr.length) return

				let _this = this
				showConfirm({
					msg: `确认修改后，将自动移除${msg}不一致的合同模板，是否确认修改？`,
					confirmCallback: function() {
					    _this.templateArr = []
                    },
					cancelCallback: function () {
						let val = _this.form[key]
                        let old = _.difference(_dataList, [val])[0]
						_this.form[key] = old
					}
				})
            },
            platformSelectVisible(e) {
				if(e && this.form.platform) {
					this.oldPlatForm = _.cloneDeep(this.platform)
                    this.oldExtrSystemId = _.cloneDeep(this.form.platform)
                }
            },
			platformSelectChange() {
				if(!this.templateArr.length) {
                    this.getBindStatus()
                    return
                }

				let _this = this
				showConfirm({
					msg: '确认修改后，将自动移除商户名称不一致的合同模板，是否确认修改？',
					confirmCallback: function() {
                        _this.templateArr = []
                        this.getBindStatus()
					},
					cancelCallback: function () {
						_this.platform = _this.oldPlatForm
						_this.form.platform = _this.oldExtrSystemId
                    }
				})
      },
      getBindStatus(a) {
                this.platform.forEach(e => {
                    // if(this.form.platform == e.extrSystemId) {
                    //     this.bindBank = e.bindBank === '1' ? true : false
                    //     if(a !== true && this.bindBank) {
                    //         this.form.bindBank = '1'
                    //     }
                    // }
                    if(this.form.platform == e.extrSystemId) {
                        this.bindBank = e.bindBank === '1' ? true : false
                        if(a !== true && this.bindBank) {
                            this.form.signModel = '2'
                            this.form.bindBank = '1'
                        }
                    }
                })
      },
      // 动态修改contractOther
      initContractOther(index) {
        // 合同上显示其他变量的多选框组
        this.contractOther = ['0']
        if(index === undefined) {
          return
        }
        if(this.templateArr[index].displayPersonalMobile === '1') {
          this.contractOther.push('1')
        }
        if(this.templateArr[index].displayPersonalSigntime === '1') {
          this.contractOther.push('2')
        }
      },
      // 动态修改form中的值，避免再次打开时为空
      initFormContractOther(index) {
        // editIndex
        this.templateArr[index].displayPersonalIdentity = '1'
        this.templateArr[index].displayPersonalMobile = this.contractOther.includes('1') ? '1' : '2'
        this.templateArr[index].displayPersonalSigntime = this.contractOther.includes('2') ? '1' : '2'
      },
      // 动态修改提交表单的值
      changeFormContractOther(obj) {
        // 只有乙方签约对象选择个人时才会显示
        if(this.templateModel.partys[1].userDetailType !== '1') {
          return
        }
        obj.displayPersonalIdentity = '1'
        obj.displayPersonalMobile = this.contractOther.indexOf('1') >= 0 ? '1' : '2'
        obj.displayPersonalSigntime = this.contractOther.indexOf('2') >= 0 ? '1' : '2'
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

    .contract-table-container {
        margin-bottom: 20px;
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
