<template>
  <div class="main-container">
    <el-tabs v-model="activeName"
      @tab-click="handleClick">
      <el-tab-pane label="我的入驻申请"
        name="first" />
      <el-tab-pane label="待处理入驻申请"
        name="second" />
      <el-tab-pane label="全部入驻申请"
        name="third" />
    </el-tabs>

    <div style="margin-bottom:30px;">
      合同申请审核管理
    </div>

    <el-form :inline="true"
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

      <el-form-item label="合同类型"
        size="small">
        <el-select v-model="formSearch.workflowType"
          placeholder="请选择"
          style="width:100%;">
          <el-option label="全部"
            value="" />
          <el-option label="标准"
            value="create_sale_contract" />
          <el-option label="非标"
            value="create_ns_sale_contract" />
        </el-select>
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
    </el-form>

    <el-button size="small"
      @click="$router.push({path:'create',query:{workflowType:'create_sale_contract'}})">
      创建合同
    </el-button>
    <el-button size="small"
      @click="$router.push({path:'create_add'})"
      v-if="userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'">
      补签合同
    </el-button>
    <!-- <el-button size="small" @click="$router.push({path:'create_update'})">修改已有合同</el-button> -->
    <!-- <el-button size="small" @click="$router.push({path:'create',query:{workflowType:'create_ns_sale_contract'}})">新客户非标准合同</el-button> -->
    <el-button size="small"
      @click="$router.push({path:'create_change',query:{workflowType:'update_sale_contract'}})"
      v-if="userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'">
      合同变更
    </el-button>

    <div class="table-container">
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
          <!-- <template slot-scope="scope">
            {{ workflowTypeList[scope.row.workflowType] || '非标合同' }}
          </template> -->
        </el-table-column>
        <el-table-column prop="statusName"
          label="申请状态">
          <template slot-scope="scope">
            <span v-if="scope.row.statusName">{{ scope.row.statusName }}</span>
            <span v-else-if="scope.row.status === 'init'">待提交</span>
          </template>
        </el-table-column>

        <el-table-column label="操作"
          width="200">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status != 'draft'"
              @click="toPreview(scope.row.id, 'watch')"
              type="text"
              size="medium"
              style="padding:0;">
              查看
            </el-button>
            <el-button v-if="scope.row.status === 'init' || scope.row.status === 'draft'"
              @click="toCreate(scope.row.id, scope.row.workflowType)"
              type="text"
              size="medium"
              style="padding:0;">
              编辑
            </el-button>
            <el-button v-if="scope.row.status === 'init' && scope.row.createdBy == userInformation.id"
              @click="toDetail(scope.row.id, 'watch')"
              type="text"
              size="medium"
              style="padding:0;">
              送审
            </el-button>
            <el-button v-if="scope.row.status === 'draft' || scope.row.status === 'init'"
              @click="closeContract(scope.row.id)"
              type="text"
              size="medium"
              style="padding:0;">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
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
      })
    },
    data() {
        return {
            pageIndex: 1,
            pageSize: 10,
            tableList: {},
            formSearch: {
                workflowType: '',
                customerName: '',
                createBy: '',
                serviceCompanyName: '',
                status: '',
                moduleName: 'sale_contract',
                subjectType: 'customer,oem'
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
                workflowType: "",
                customerName: '',
                createBy: '',
                serviceCompanyName: '',
                status: '',
                moduleName: 'sale_contract',
                scope: 'create',
                subjectType: 'customer,oem'
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
            let formSearch = _.cloneDeep(this.formSearch)
            let options = {
                pageNo: this.pageIndex,
                pageSize: this.pageSize,
                example: formSearch,
            }

            post('/api/opencrm/workflow/list', options)
                .then(result => {
                    this.tableList = result
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
            // console.log(isChange)
            const editType = {
                create_sale_contract: 'create',
                create_ns_sale_contract: 'create',
                add_sale_contract: 'create_add',
                add_ns_sale_contract: 'create_add',
                update_sale_contract: 'create_change',
                update_ns_sale_contract: 'create_change',
                agent_create_sale_contract: 'create',
                agent_add_sale_contract: 'create_add',
                agent_update_sale_contract: 'create_change',
                agent_create_ns_sale_contract: 'create',
                agent_add_ns_sale_contract: 'create_add',
                agent_update_ns_sale_contract: 'create_change',
            }
            let path
            if (isChange) {
                path = 'create_change'
            }
            this.$router.push({
                path: editType[type] || path,
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
</style>
