<template>
  <div class="main-container">
    <div class="mb10">合同申请审核管理</div>
    <el-tabs v-model="activeName"
             @tab-click="handleClick">
      <el-tab-pane label="我的入驻申请"
                   name="first" />
      <el-tab-pane label="待处理入驻申请"
                   name="second" />
      <el-tab-pane label="全部入驻申请"
                   name="third" />
    </el-tabs>

    <!-- <el-form :inline="true"
             :model="formSearch"
             ref="formSearch">
      <el-form-item label="企业名称"
                    size="small"
                    prop="customerName">
        <el-input v-model="formSearch.customerName" />
      </el-form-item>

      <el-form-item label="申请人姓名"
                    size="small"
                    prop="createBy">
        <el-input v-model="formSearch.createBy" />
      </el-form-item>

      <el-form-item label="服务商名称"
                    size="small"
                    prop="serviceCompanyName">
        <el-input v-model="formSearch.serviceCompanyName" />
      </el-form-item>

      <el-form-item label="申请状态"
                    size="small"
                    prop="status">
        <el-select v-model="formSearch.status"
                   placeholder="请选择"
                   style="width:100%;">
          <el-option label="全部"
                     value="" />
          <el-option v-for="item in statusList"
                     :key="item.value"
                     :label="item.text"
                     :value="item.value" />
        </el-select>
      </el-form-item>

      <el-form-item style="margin-top: -4px">
        <el-button type="primary"
                   @click="search"
                   size="small">
          查询
        </el-button>
        <el-button size="small"
                   @click="resetForm">
          清除
        </el-button>
      </el-form-item>
    </el-form> -->

    <avue-form v-model="formSearch"
               :option="formOption"
               ref="formSearch">
      <template slot="action">
        <div>
          <el-button type="primary"
                     @click="search">查询</el-button>
          <el-button @click="resetForm">清空</el-button>
        </div>
      </template>
    </avue-form>

    <div class="mb20 ml10">
      <el-button size="small"
                 type="primary"
                 @click="$router.push({path:'create',query:{workflowType:'create_sale_contract'}})">创建合同</el-button>
      <el-button size="small"
                 type="primary"
                 @click="$router.push({path:'create_add'})">补签合同</el-button>
      <el-button size="small"
                 type="primary"
                 @click="$router.push({path:'create_change',query:{workflowType:'update_sale_contract'}})">合同变更</el-button>
    </div>

    <!-- <div class="table-container">
      <el-table :data="tableList.data">
        <el-table-column prop="id"
                         label="申请编号" />
        <el-table-column prop="customerName"
                         label="企业名称" />
        <el-table-column prop="createdByName"
                         label="申请人" />
        <el-table-column prop="updatedAt"
                         label="提交时间" />
        <el-table-column prop="curProcessUser"
                         label="当前处理人" />
        <el-table-column prop="processedAt"
                         label="最后审批时间" />
        <el-table-column prop="standardEnumString"
                         label="合同类型">
          <template slot-scope="scope">
            {{ scope.row.workflowType.indexOf('ns') === -1 ? '标准合同' : '非标合同' }}
          </template>
        </el-table-column>
        <el-table-column prop="operateEnumString"
                         label="申请类型" />
        <el-table-column prop="statusName"
                         label="申请状态">
          <template slot-scope="scope">
            <span v-if="scope.row.statusName">{{ scope.row.statusName }}</span>
            <span v-else-if="scope.row.status === 'init'">待提交</span>
          </template>
        </el-table-column>

        <el-table-column label="操作"
                         width="230">
          <template slot-scope="scope">
            
          </template>
        </el-table-column>
      </el-table>
    </div> -->

    <div v-if="tableList.data && tableList.data.length">
      <div v-for="(item, key) in tableList.data"
           :key="key"
           class="mb20">
        <div slot="header"
             class="clearfix mt40 mb20 ml10 mr10">
          <b class="card-title">{{item.updatedAt}}</b>
          <b class="card-title">申请编号：{{item.id}}</b>
          <!-- <b class="card-title">企业名称：{{item.customerName}}</b> -->
          <b class="card-title">申请人：{{item.createdByName}}</b>
          <span v-if="item.completed"
                class="ml30"
                style="font-size: 14px;color: #999;">已拆单推送服务商</span>
          <div style="float: right;">
            <el-button v-if="item.status != 'draft'"
                       @click="toPreview(item.id, 'watch')"
                       type="text"
                       size="medium"
                       style="padding:0;">查看</el-button>
            <el-button v-if="item.status === 'init' || item.status === 'draft'"
                       @click="toCreate(item.id, item.workflowType)"
                       type="text"
                       size="medium"
                       style="padding:0;">编辑</el-button>
            <el-button v-if="item.status === 'init' && item.createdBy == userInformation.id"
                       @click="toDetail(item.id, 'watch')"
                       type="text"
                       size="medium"
                       style="padding:0;">送审</el-button>
            <el-button v-if="item.status === 'draft' || item.status === 'init'"
                       @click="closeContract(item.id)"
                       type="text"
                       size="medium"
                       style="padding:0;">删除</el-button>
            <el-button v-if="item.boolCanWithdraw"
                       @click="hanlderWithdraw(item.id)"
                       type="text"
                       size="medium">撤回 </el-button>
          </div>
        </div>
        <avue-crud :data="item.subWorkflowList || []"
                   :option="crudOption">
          <template slot="approveStateName"
                    slot-scope="scope">
            <div>
              <span v-if="scope.row.approveState === 'complete' || scope.row.approveState === 'completed'"
                    class="circle"
                    style="background: #52C418;"></span>
              <span v-if="scope.row.approveState === 'processing' || scope.row.approveState === 'in_sale_approval' || scope.row.approveState === 'in_risk_approval'"
                    class="circle"
                    style="background: #178FFF;"></span>
              <span v-if="scope.row.approveState === 'draft'"
                    class="circle"
                    style="background: #BFBFBF;"></span>
              <span v-if="scope.row.approveState === 'init'"
                    class="circle"
                    style="background: #F5222D;"></span>
              <span>{{scope.row.approveStateName}}</span>
            </div>
          </template>
          <template slot="empty">
            <avue-empty size="0"
                        desc="暂无数据"></avue-empty>
          </template>
        </avue-crud>
      </div>
    </div>
    <div v-else>
      <avue-empty desc="暂无数据"></avue-empty>
    </div>

    <ayg-pagination v-if="tableList.total"
                    :total="tableList.total"
                    @handleSizeChange="handleSizeChange"
                    :current-size="pageSize"
                    @handleCurrentChange="handleCurrentChange"
                    :current-page="pageIndex" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import _ from 'lodash'
import { post, get } from "../../store/api"
import { showNotify } from "../../plugin/utils-notify";
import { showConfirm } from "../../plugin/utils-message";

export default {
    created() {
        this.getActiveName()
        this.getStatusList()
        // 获取用户数据
        this.$store.dispatch("getAuth", { menuType: "console-admin" }).then(() => {
            // this.getList()
            this.handleClick()
        });
    },
    computed: {
      ...mapGetters({
        userInformation: "userInformation",
        auth: "auth",
			}),
			formOption() {
				return {
					size: 'small',
          labelPosition: 'top',
					menuBtn: false,
					gutter: 0,
					column: [{
						label: '申请编号',
						prop: 'instanceId',
						type: 'input',
						valueDefault: '',
						span: 4,
					},{
						label: '客户公司',
						prop: 'customerName',
						type: 'input',
						valueDefault: '',
						span: 4,
					},{
						label: '合同类型',
						prop: 'operateEnum',
						type: 'select',
						valueDefault: '',
						span: 4,
						dicData: [{
							text: '新增合同',
							value: 1,
						},{
							text: '补签合同',
							value: 2,
						},{
							text: '变更合同',
							value: 3,
						}],
						props: {
							label: 'text',
							value: 'value',
						},
					},{
						label: '申请状态',
						prop: 'status',
						type: 'select',
						valueDefault: '',
						span: 4,
						dicData: this.statusList,
						props: {
							label: 'text',
							value: 'value',
						},
					},{
						label: '服务商',
						prop: 'serviceCompanyName',
						type: 'input',
						valueDefault: '',
						span: 4,
					},{
						label: '申请人',
						prop: 'createBy',
						type: 'input',
						valueDefault: '',
						span: 4,
					},{
            prop: 'action',
            formslot: true,
            span: 24,
          },]
				}
			},
    },
    data() {
        return {
					crudOption: {
						header: false,
						menu: false,
						column: [
            //   {
						// 	label: '申请编号',
						// 	prop: 'id',
						// },
						{
							label: '企业名称',
							prop: 'companyName',
							width: 250,
						},
						{
							label: '服务商',
							prop: 'serviceCompanyName',
							width: 250,
						},{
							label: '合同类型',
							prop: 'standardEnumName',
						},{
							label: '申请类型',
							prop: 'operateTypeName',
						},{
							label: '当前处理人',
							prop: 'actorName',
						},{
							label: '最后审批时间',
							prop: 'processedAt',
						},{
							label: '申请状态',
							prop: 'approveStateName',
							slot: true,
						}]
					},
            pageIndex: 1,
            pageSize: 10,
            tableList: {},
            formSearch: {
								instanceId: '',
								operateEnum: '',
                workflowType: '',
                customerName: '',
                createBy: '',
                serviceCompanyName: '',
                status: '',
                moduleName: 'sale_contract',
                subjectType: 'customer,oem,service_rule,external_agent'
            },
            statusList: [],
            activeName: 'first',
            workflowTypeList: {
                create_sale_contract: '标准合同',
                add_sale_contract: '标准合同',
                update_sale_contract: '标准合同',
                agent_create_sale_contract: '标准合同',
                agent_add_sale_contract: '标准合同',
                agent_update_sale_contract: '标准合同',
            },
        }
    },
    methods: {
        resetForm(formName) {
            // this.$refs[formName].resetFields()
            this.formSearch = {
								instanceId: '',
								operateEnum: '',
                workflowType: "",
                customerName: '',
                createBy: '',
                serviceCompanyName: '',
                status: '',
                moduleName: 'sale_contract',
                scope: 'create',
                subjectType: 'customer,oem,service_rule,external_agent'
            }
        },
        search() {
            this.pageIndex = 1
            this.getList()
        },
        handleSizeChange(value) {
            this.pageSize = value
            this.pageIndex = 1
            this.getList()
        },
        handleCurrentChange(value) {
            this.pageIndex = value
            this.getList()
        },
        getList() {
						this.$delete(this.formSearch)
            let formSearch = _.cloneDeep(this.formSearch)
            let options = {
                pageNo: this.pageIndex,
                pageSize: this.pageSize,
                example: formSearch,
            }

            post('/api/opencrm/workflow/list', options)
                .then(result => {
                    this.tableList = result
                    this.$router.push({
                        path: 'list',
                        query: options.example
                    })
                })
        },
        toPreview(id, type) {
            this.$router.push({
                path: 'preview',
                query: {
                    id: id,
                    editType: type
                }
            })
        },
        toDetail(id, type) {
            this.$router.push({
                path: 'detail',
                query: {
                    id: id,
                    editType: type
                }
            })
        },
        toCreate(id, type) {
            const isChange = type.indexOf('update') !== -1
            const isAdd = type.indexOf('add') !== -1
            // const editType = {
            //     create_sale_contract: 'create',
            //     create_ns_sale_contract: 'create',
            //     create_sale_contract_service_company_rule: 'create',
            //     create_ns_sale_contract_service_company_rule: 'create',
            //     add_sale_contract: 'create_add',
            //     add_ns_sale_contract: 'create_add',
            //     update_sale_contract: 'create_change',
            //     update_ns_sale_contract: 'create_change',
            //     agent_create_sale_contract: 'create',
            //     agent_add_sale_contract: 'create_add',
            //     agent_update_sale_contract: 'create_change',
            //     agent_create_ns_sale_contract: 'create',
            //     agent_add_ns_sale_contract: 'create_add',
            //     agent_update_ns_sale_contract: 'create_change',
            // }
            let path
            if (isChange) {
                path = 'create_change'
            } else if (isAdd) {
                path = 'create_add'
            } else {
                path = 'create'
            }
            this.$router.push({
                // path: editType[type] || path,
                path,
                query: {
                    id: id,
                    editType: type
                }
            })
        },
        closeContract(id) {
            showConfirm({
                msg: '确认关闭合同？',
                confirmCallback: () => {
                    post('/api/opencrm/workflow/delete', {
                        id: id,
                        memo: ''
                    }).then(result => {
                        showNotify('success', '删除成功')
                        this.getList()
                    })
                }
            })
        },
        getStatusList() {
            get('/api/opencrm/workflow/status_options', {
                // workflowType: "create_sale_contract",
                moduleName: 'sale_contract'
            }).then(result => {
                this.statusList = result
            })

        },
        getActiveName() {
            const { scope } = this.$route.query
            const activeList = {
                create: 'first',
                process: 'second',
                all: 'third',
            }
            this.activeName = activeList[scope]
        },
        handleClick(tab, event) {
            if (this.activeName === 'first') {
                this.formSearch.scope = 'create'
            }
            if (this.activeName === 'second') {
                this.formSearch.scope = 'process'
            }
            if (this.activeName === 'third') {
                this.formSearch.scope = 'all'
            }
            this.handleCurrentChange(1)
        },
        hanlderWithdraw(instanceId) {
            showConfirm({
                msg: '确认撤回合同？',
                confirmCallback: () => {
                    get('/api/opencrm/workflow/withdraw', { instanceId }).then(result => {
                        console.log(result)
                        showNotify('success', '撤回成功')
                        this.getList()
                    })
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.main-container {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 30px;
}

.table-container {
  width: 100%;
  margin-top: 20px;
}

.circle {
  padding: 3px;
  display: inline-block;
  border-radius: 10px;
  vertical-align: middle;
  margin-right: 5px;
}
.card-title {
  margin-right: 30px;
  color: #333;
  font-size: 16px;
}
</style>

<style>
.avue-crud th {
  font-weight: normal;
}
</style>
