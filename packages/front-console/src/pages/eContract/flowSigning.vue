<template>
    <div class="main">
        <el-breadcrumb separator="/" class="w-top-nav">
            <el-breadcrumb-item to="/dashboard"><span class="w-link">首页</span></el-breadcrumb-item>
            <el-breadcrumb-item :to="{ path: '/eContract/signManager' }"><span class="w-link">发起签约</span></el-breadcrumb-item>
            <el-breadcrumb-item><span class="w-item">上传签约对象</span></el-breadcrumb-item>
        </el-breadcrumb>
        <div style="height: 9px"></div>
        <w-steps :dataArr="['上传签约对象', '核对信息', '完成']" :index="step"></w-steps>
        <div class="content">
            <div class="mtitle">合同名称</div>
            <p class="detil" v-for="(v, k) in dataArr" :key="k">
                {{v.name}}
                <a target="_bank" :href="`/api/econtract/template/preview?templateId=${v.templateId}`">预览合同</a>
            </p>
            <br><br>
            <div>
                <template v-if="qianYueArr[0].arr.length > 0">
                    <div class="mtitle">
                        {{qianYueArr[0].num}}签约对象（{{qianYueArr[0].type}}）
                    </div>
                    <div v-for="(v, k) in qianYueArr[0].arr">
                        <p class="detil">
                            {{qianYueArr[0].type}}全称： {{v.userName}}&nbsp;&nbsp;&nbsp;
                            <span class="text-pointer" @click="zhanKaiClick(v)">{{ v.open ? '收起': '展开' }}</span>
                        </p>
                        <template v-if="v.open">
                            <p class="detil w-small" style="padding-bottom: 0px">工商注册号：{{v.regCode}}</p>
                            <p class="detil w-small" style="padding-bottom: 0px">税务登记号：{{v.taxCode}}</p>
                            <p class="detil w-small" style="padding-bottom: 0px">组织机构代码：{{v.orgCode}}</p>
                            <p class="detil w-small" style="padding-bottom: 0px">法人姓名：
                                {{v.legalPerson}}
                            </p>
                        </template>
                    </div>
                    <br><br>
                </template>
                <template v-if="qianYueArr[1].arr.length > 0 && qianYueArr[1].type !== '个人'">
                    <div class="mtitle">
                        {{qianYueArr[1].num}}签约对象（{{qianYueArr[1].type}}）
                    </div>
                    <div v-for="(v, k) in qianYueArr[1].arr" :key="k">
                        <p class="detil">
                            {{qianYueArr[1].type}}全称： {{v.userName}}&nbsp;&nbsp;&nbsp;
                            <span class="text-pointer" @click="zhanKaiClick(v)">{{ v.open ? '收起': '展开' }}</span>
                        </p>
                        <template v-if="v.open">
                            <p class="detil w-small" style="padding-bottom: 0px">工商注册号：{{v.regCode}}</p>
                            <p class="detil w-small" style="padding-bottom: 0px">税务登记号：{{v.taxCode}}</p>
                            <p class="detil w-small" style="padding-bottom: 0px">组织机构代码：{{v.orgCode}}</p>
                            <p class="detil w-small" style="padding-bottom: 0px">法人姓名：
                                {{v.legalPerson}}
                            </p>
                        </template>
                    </div>
                    <br><br>
                </template>
                <template>
                    <div class="mtitle">
                        {{geRenType}}签约对象（个人）
                    </div>
                    <el-form :model="form" :inline="true" ref="form">
                        <el-form-item prop="personalName">
                            <p class="input-title">姓名</p>
                            <el-input placeholder="请输入" v-model="form.personalName" size="small"></el-input>
                        </el-form-item>
                        <el-form-item prop="personalIdentity">
                            <p class="input-title">证件号</p>
                            <el-input placeholder="请输入" v-model="form.personalIdentity" size="small"></el-input>
                        </el-form-item>
                        <el-form-item prop="personalMobile">
                            <p class="input-title">手机号</p>
                            <el-input placeholder="请输入" v-model="form.personalMobile" size="small"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <p class="input-title">&nbsp;</p>
                            <el-button type="primary" size="small" @click="query">查询</el-button>
                            <el-button size="small" @click="reset('form')">清空</el-button>
                        </el-form-item>
                    </el-form>
                    <el-button type="primary" size="small" @click="show = true" v-if="step == 1">批量添加</el-button>
                    <a v-if="isSuccess" style="float: right"
                       :href="`/api/econtract/order/exporterrors?batchId=${form.batchId}&personalIdentity=${form.personalIdentity}&personalName=${form.personalName}&personalMobile=${form.personalMobile}&fromGroup=1`">
                        <el-button size="small">
                            <!--<svg-icon class="svg-icon" icon-class="folder-icon"/>-->
                            <span style="padding-left: 5px">导出xls</span>
                        </el-button>
                    </a>
                    <br><br>
                    <el-alert
                            v-if="isSuccess && errCount"
                            title=""
                            class="w-info"
                            type="warning">
                        <i class="el-icon-warning"></i>
                        <span>您上传的数据有<span style="color: #FFAA00;"> {{ errCount }} </span>条记录存在错误，请编辑更正后再进行下一步。</span>
                    </el-alert>
                    <br>
                    <el-table class="custom-table" :data="list" @selection-change="handleSelectionChange">
                        <el-table-column label="姓名" prop="personalName"></el-table-column>
                        <el-table-column label="证件类型" prop="personalIdentityTypeName"></el-table-column>
                        <el-table-column label="证件号" prop="personalIdentity"></el-table-column>
                        <el-table-column label="手机" prop="personalMobile"></el-table-column>
                        <el-table-column label="错误原因">
                            <template slot-scope="scope">
                                <span class="error">{{scope.row.msg}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column class-name="handlecell" label="操作" v-if="step == 1">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click="forEdit(scope.row)">修改</el-button>
                                <el-button type="text" size="small" @click="deleteOrder(scope.row)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-pagination
                            @size-change="setSize"
                            @current-change="query"
                            :background="true"
                            :small="true"
                            :current-page="form.pageNo"
                            :page-sizes="[10, 20, 30, 40]"
                            :page-size="form.pageSize"
                            layout="total, sizes, prev, pager, next, jumper"
                            :total="total">
                    </el-pagination>
                </template>
            </div>
            <template v-if="step == 1">
                <div style="text-align: center; padding-top: 20px">
                    <el-button size="small" @click="cancle">取消</el-button>
                    <el-button type="primary" size="small" @click="next">下一步</el-button>
                </div>
            </template>
            <template v-else>
                <div class="mtitle">概况</div>
                <p class="detil">签约合同数量：{{trueT}}</p>
                <div style="text-align: center; padding-top: 20px">
                    <el-button size="small" @click="step = 1">上一步</el-button>
                    <el-button type="primary" size="small" @click="ensure">确认发起</el-button>
                </div>
            </template>

            <el-dialog title="批量添加" :visible.sync="show" :width="addWidth">
                <div class="dbox">
                    <div class="ditem">
                        <div>下载模板文件：</div>
                        <div>
                            <a class="abtn" href="/assets/合同名单模板.xlsx" download="合同名单模板.xlsx" target="_blank">下载模板</a>
                            <div>请按照模板填写签约对象信息</div>
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
                                    :on-remove="remove"
                                    :multiple="false"
                                    :show-file-list="false"
                                    accept=".xlsx, .xls">
                                <div class="up_icon">
                                    <div>点击这里上传</div>
                                    <div>请上传小于5M的xls或xlsx格式文件</div>
                                </div>
                            </el-upload>
                        </div>
                    </div>
                </div>
                <span slot="footer">
                    <el-button size="small" @click="show = false">关闭</el-button>
                    <el-button type="primary" size="small" @click="show = false">确定</el-button>
                </span>
            </el-dialog>
            <el-dialog title="修改" :visible.sync="eshow" class="dialog" :width="addWidth">
                <el-form :model="editor" :rules="erules" label-width="100px" ref="editor">
                    <el-form-item label="名字：" prop="name">
                        <el-input v-model="editor.name" class="form_input" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="证件类型：" prop="identityType">
                        <el-select v-model="editor.identityType" class="form_input" size="small">
                            <el-option v-for="e in type" :label="e.text" :value="e.value" :key="e.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="证件号码：" prop="identity">
                        <el-input v-model="editor.identity" class="form_input" size="small"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="personalMobile">
                        <el-input v-model="editor.personalMobile" class="form_input" size="small"></el-input>
                    </el-form-item>
                </el-form>
                <span slot="footer">
                    <el-button size="small" @click="eshow = false">取消</el-button>
                    <el-button type="primary" size="small" @click="edit">确认</el-button>
                </span>
            </el-dialog>
        </div>
    </div>
</template>
<script>
	import WSteps from '../../component/steps'
	import Ajax from "../../ajax/index"

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
				trueT: 0,
				list: [],
				isShow: {
					'2.1': false,
					'2.2': false
				},
				show: false,
				eshow: false,
				msg: '',
				detail: '',
				editor: {
					name: '',
					batchId: '',
					identity: '',
					identityType: '',
					orderId: '',
					personalMobile: ''
				},
				erules: {
					/*name: [
						{required: false, message: '名字不能为空', trigger: 'blur'}
					],*/
					identityType: [
						{required: true, message: '请选择证件类型', trigger: 'blur'}
					],
					identity: [
						{required: false, message: '证件号码不能为空', trigger: 'blur'},
						{pattern: /^[\w]+$/, message: '请正确输入证件号码'}
					],
					personalMobile: [
						{required: true, message: '手机号码不能为空', trigger: 'blur'},
						{pattern: /^(1\d{10})$/, message: '请正确输入手机号码'}
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
				templateId: '',
				// 类型 0: 模板 1：模板组
				templateGroup: 0,
				step: 1,
				addWidth: '0',
				// 数据数组
				dataArr: [],
				// 签约数组
				qianYueArr: [
					{
						num: '甲方',
						type: '',
						arr: []
					},
					{
						num: '乙方',
						type: '',
						arr: []
					}
				],
				// 个人类型
				geRenType: '乙方',
                templateName: ''
			}
		},
		mounted() {
			this.templateName = this.$route.query.templateName
			this.templateId = this.$route.params.id;
			this.templateGroup = this.$route.query.group === 'true'
			Ajax.post('/api/econtract/template/qrydetails', {
				// templateId: this.templateGroup ? '' : this.templateId,
				// templateGroupId: this.templateGroup ? this.templateId : ''
				templateGroupId: this.templateId,
				templateId: ''
			}).then(data => {
				this.dataArr = data;
				this.dataArr.forEach((item) => {
					if(item.partys) {
						item.partys.forEach((item1) => {
							item1.open = false
							if (item1.signNo === '1') {
								this.qianYueArr[0].arr.push(item1)
								this.qianYueArr[0].type = this.getQianYueType(item1)
							} else if(item1.signNo === '2') {
								this.qianYueArr[1].arr.push(item1)
								this.qianYueArr[1].type = this.getQianYueType(item1)
							} else {
								this.getQianYueType(item1)
							}
							if (item1.userId) {
								Ajax.post('/api/econtract/user/company/qrydetail', {
									userId: item1.userId
								}).then(res => {
									Object.assign(item1, res)
									this.$forceUpdate()
								})
							}
						})
					}

				})
			})
			Ajax.get('/api/econtract/batch/getnextid').then(data => {
				this.form.batchId = data
			})
			this.addWidth = (558 / window.innerWidth) * 100 + '%'
			window.onresize = () => {
				this.addWidth = (558 / window.innerWidth) * 100 + '%'
			}
		},
		components: {
			WSteps
		},
		computed: {
		},
		methods: {
			// 获取签约类型
			getQianYueType(item) {
				if (item.userDetailType === '1') {
					this.geRenType = item.signNo === '2' ? '乙方' : '丙方'
					return '个人'
				} else if(item.userDetailType === '2.1') {
					return '服务商'
				} else {
					return '企业'
				}
			},
			// 展开按钮点击
			zhanKaiClick(item) {
				const isOpen = item.open
				this.qianYueArr.forEach((v) => {
					v.arr.forEach((item) => {
						item.open = false
					})
				})
				item.open = !isOpen
				this.qianYueArr = [].concat(this.qianYueArr)
			},
			query(a) {
				if (isNaN(a)) {
					a = 1
				}
				this.form.pageNo = a
				// this.form.fromGroup = this.templateGroup ? 1 : 0
				this.form.fromGroup = '1'
				Ajax.post('/api/econtract/contractsigner/qry', this.form).then(data => {
					this.list = data.data
					this.total = data.total
					this.errCount = data.errCount
				})
			},
			reset(name) {
				this.$refs[name].resetFields();
			},
			setSize(a) {
				this.form.pageSize = a
				this.query()
			},
			upload(a) {
				var formData = new FormData()
				formData.append('batchId', this.form.batchId)
				formData.append('templateGroup', this.templateGroup)
				formData.append('fileName', a.name)
				formData.append('multipartFile', a.raw)
				formData.append('templateGroupId', this.templateId)
				formData.append('templateId', '')
				Ajax.importPost('/api/econtract/contractsigner/addlist', formData).then(data => {
					this.query()
					this.$message({
						type: 'success',
						message: '上传成功！'
					})
					this.show = false
					this.isSuccess = true
				})
			},
			handleSelectionChange(a) {
				this.downList = a
			},
			downLoad() {
				if (this.downList.length) {

					Ajax.post('/api/econtract/order/exporterrors', this.downList).then(data => {
					})
				}
				else {
					this.$message({
						type: 'warning',
						message: '请至少选择一条数据！'
					})
				}
			},
			forEdit(a) {
				this.eshow = true
				this.editor.batchId = a.batchId
				this.editor.orderId = a.orderId
				this.editor.identity = a.personalIdentity
				this.editor.identityType = a.personalIdentityType
				this.editor.name = a.personalName
				this.editor.personalMobile = a.personalMobile
			},
			edit() {
				this.$refs['editor'].validate(valid => {
					if(valid) {
						// this.editor.fromGroup = this.templateGroup ? 1 : 0
						this.editor.fromGroup = '1'
						Ajax.post('/api/econtract/contractsigner/modify', this.editor).then(data => {
							this.$message({
								type: 'success',
								message: '修改成功！'
							})
							this.eshow = false
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
					Ajax.post(`/api/econtract/contractsigner/delete?orderId=${a.orderId}&fromGroup=1`).then(() => {
						this.$message({
							type: 'success',
							message: '删除成功！'
						})
						this.query()
					})
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '删除已取消！'
					})
				})
			},
			next() {
				Ajax.post('/api/econtract/contractsigner/qry', {
					batchId: this.form.batchId,
					pageNo: 1,
					pageSize: 10,
					fromGroup: '1'
				}).then(data => {
					if (!this.isSuccess || !data.data.length) {
						this.$message.error('尚未上传数据！')
						return
					}
					if (this.errCount) {
						this.$confirm(`您上传的数据有${this.errCount}条记录存在错误，数据全部正确才能进行下一步操作`, '信息有误', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'warning',
								center: true
							})
							.then(() => {
							})
							.catch(() => {
							})
						return
					}
					this.trueT = data.data.length
					this.step = 2
				})
			},
			cancle() {
				this.$router.back()
			},
			ensure() {
				Ajax.post(`/api/econtract/batch/submit?batchId=${this.form.batchId}&templateGroupId=${this.templateId}&templateId=`).then(data => {
					this.$router.push(`/main/eContract/signSuccess?name=${this.templateName}`)
				})
			}
		}
	}
</script>
<style lang="scss" scoped>
    .main {
        .content {
            padding: 33px 30px;
            margin: 15px 0;
            background: #FFFFFF;
            box-shadow: 0 2px 6px 0 rgba(204, 204, 204, 0.40);
            .detil {
                padding-left: 100px;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #666666;
                line-height: 30px;
                > a {
                    font-family: PingFangSC-Regular;
                    font-size: 12px;
                    color: #108EE9;
                    text-align: center;
                }
            }
            .w-small {
                padding-bottom: 20px;
            }
            .input-title {
                font-family: PingFangSC-Regular;
                font-size: 12px;
                color: #666666;
                text-align: left;
                line-height: 30px;
            }
            .w-question {
                color: #cccccc;
            }
            .w-info {
                font-size: 14px;
                letter-spacing: 0;
                line-height: 18px;
            }
        }
        .custom-table {
            font-size: 12px;
        }
        .handlecell {
            .el-button {
                padding: 7px 0;
                margin-left: 0;
                margin-right: 10px;
            }
        }
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

    .error {
        color: red;
        /* font-size: 18px; */
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
</style>
