<template>
  <div class="r_main">
    <div style="margin:30px 0 0;font-size:20px;">
      <div style="float:left;">部门及员工帐号</div>
      <div style="float:right;">
        <el-form :inline="true" size="small" :model="staff_query_form" ref="staff_query_form">
          <el-form-item label="姓名/电话" prop="accountInfo">
            <el-input v-model="staff_query_form.accountInfo"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="staff_query">查询</el-button>
            <el-button @click="staff_clear">清除</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div style="clear:both;"></div>
    </div>
    <div class="box">
      <div>
        <span>组织结构管理</span>
        <div class="t_right">
          <el-button type="primary" size="mini" @click="section_add">新增</el-button>
          <el-button :class="{disabled : !curr}" type="primary" size="mini" @click="section_edit">编辑</el-button>
          <el-button :class="{disabled : !curr}" type="primary" size="mini" @click="section_delete">删除</el-button>
        </div>
      </div>
      <el-tree
        ref="tree"
        :data="root"
        show-checkbox
        node-key="id"
        :highlight-current="true"
        @check="choose"
        :check-on-click-node="true"
        :check-strictly="true"
        :expand-on-click-node="false">
      </el-tree>
    </div>
    <div class="box right">
      <div>
        <span class="ot600">部门： {{curr.name}} 负责人： {{curr.leaderEmployeeName}}</span>
        <div class="t_right">
          <el-button type="primary" size="mini" @click="staff_add">新增</el-button>
        </div>
      </div>
      <el-table :data="staff_query_data.list">
        <el-table-column label="姓名" prop="name"></el-table-column>
        <el-table-column label="手机" prop="mobile"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="归属部门" prop="belongOrgName"></el-table-column>
        <el-table-column label="职位" prop="position"></el-table-column>
        <el-table-column label="汇报对象" prop="leaderEmployeeName"></el-table-column>
        <el-table-column label="注册时间" prop="createTime"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" @click="staff_edit(scope.row.id)">配置</el-button>
            <el-button type="text" @click="changeState(scope.row.userInfoResult.id, !scope.row.userInfoResult.isEnable)">{{scope.row.userInfoResult.isEnable ? '停用' : '启用'}}</el-button>
            <el-button type="text" @click="resetPassword(scope.row.userInfoResult.id)">重置密码</el-button>
          </template>
        </el-table-column>
      </el-table>
      <ayg-pagination
        v-if="staff_query_data.total"
        :total="staff_query_data.total"
        v-on:handleSizeChange="staff_size_change"
        :currentSize="staff_query_form.pageSize"
        v-on:handleCurrentChange="staff_query"
        :currentPage="staff_query_form.page">
      </ayg-pagination>
    </div>
    <el-dialog title="新增" :visible.sync="section_show" width="550px" :before-close="section_clearn">
      <el-form :model="section_form" :rules="section_rules" label-width="100px" size="small" ref="section_form">
        <el-form-item label="部门名称" prop="name">
          <el-input class="form_input" v-model="section_form.name"></el-input>
        </el-form-item>
        <el-form-item label="上级部门" prop="pid">
          <el-select class="form_input" v-model="section_form.pid" filterable>
            <el-option v-for="(e, i) in list.filter(e => (curr && e.levelCode.indexOf(curr.levelCode) > -1) ? false : true )" :key="i" :value="e.id" :label="e.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="部门负责人" prop="leaderEmployeeId">
          <el-select class="form_input" v-model="section_form.leaderEmployeeId" filterable>
            <el-option v-for="(e, i) in staff_list" :key="`s${i}`" :value="e.id" :label="e.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input class="form_input" v-model="section_form.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="section_clearn(); section_show = false">取消</el-button>
        <el-button size="small" @click="section_submit" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="`${staff_form.id ? '编辑' : '新增'}`" :visible.sync="staff_show" width="800px" @opened="$forceUpdate()" :before-close="staff_clearn">
      <el-form :model="staff_form" :rules="staff_rules" label-width="120px" size="small" ref="staff_form">
        <el-form-item label="姓名" prop="name">
          <el-input class="form_input" v-model="staff_form.name"></el-input>
        </el-form-item>
        <el-form-item label="职位" prop="position">
          <el-input class="form_input" v-model="staff_form.position"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input class="form_input" v-model="staff_form.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input class="form_input" v-model="staff_form.email"></el-input>
        </el-form-item>
        <el-form-item label="归属部门" prop="belongOrgId">
          <el-select class="form_input" v-model="staff_form.belongOrgId" filterable @change="updata">
            <el-option v-for="(e, i) in list" :key="`st${i}`" :value="e.id" :label="e.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="附属部门" prop="attachOrgIds"> <!-- v-if="render"  -->
          <treeselect class="form_input" v-model="staff_form.attachOrgIds" :key="render ? 1 : 2" :multiple="true" :flat="true" :options="setStaffDisabled()" @select="checkSelect" placeholder="请选择" ref="treeselect"></treeselect>
        </el-form-item>
        <el-form-item label="汇报对象(职员)" prop="leaderEmployeeId">
          <el-select class="form_input" v-model="staff_form.leaderEmployeeId" filterable>
            <el-option v-for="(e, i) in staff_list" :key="`sta${i}`" :value="e.id" :label="e.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="权限配置" v-if="systemList[0]">
          <el-tabs v-model="power" type="border-card" @tab-click="activeName = 'first'">
            <el-tab-pane v-for="(e, i) in systemList" :key="e.value" :label="labelName[i]" :name="e.value">
              <el-tabs v-model="activeName">
                <el-tab-pane label="角色" name="first">
                  <el-checkbox-group v-model="staff_form[power == systemList[0].value ? 'adminContextParam' : 'companyContextParam'].roleIds">
                    <el-checkbox v-for="item in roleList[power]" :key="item.roleId" :label="item.roleId">{{item.roleName}}</el-checkbox>
                  </el-checkbox-group>
                </el-tab-pane>
                <el-tab-pane label="配置客户" name="fourth">
                  <el-button @click="openDialog('新增客户', 'company')">新增</el-button>
                  <el-checkbox v-model="isCompanyAll[power]" @change="$forceUpdate()" style="margin-left: 15px;" v-if="userInformation.userProfile.subjectType !== 'agent'">全部</el-checkbox>
                  <div class="table-container" v-if="!isCompanyAll[power]">
                    <el-table :data="selectedCompanyList[power]">
                      <el-table-column prop="fullName" label="名称"></el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button @click="deleteSelection('company', scope.$index)" type="text" size="medium" style="padding:0;">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="配置商户" name="second">
                  <el-button @click="openDialog('新增商户', 'app')">新增</el-button>
                  <el-checkbox v-model="isAppAll[power]" @change="$forceUpdate()" style="margin-left: 15px;" v-if="userInformation.userProfile.subjectType !== 'agent'">全部</el-checkbox>
                  <div class="table-container" v-if="!isAppAll[power]">
                    <el-table :data="selectedAppList[power]">
                      <el-table-column prop="appName" label="商户名称"></el-table-column>
                      <el-table-column prop="companyName" label="企业名称"></el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button @click="deleteSelection('app', scope.$index)" type="text" size="medium" style="padding:0;">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="配置服务商" name="third" v-if="power == systemList[0].value">
                  <el-button @click="openDialog('新增服务商', 'service')">新增</el-button>
                  <el-checkbox v-model="isProviderAll[power]" @change="$forceUpdate()" style="margin-left: 15px;" v-if="userInformation.userProfile.subjectType !== 'agent'">全部</el-checkbox>
                  <div class="table-container" v-if="!isProviderAll[power]">
                    <el-table :data="selectedServiceList[power]">
                      <el-table-column prop="fullName" label="名称"></el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button @click="deleteSelection('service', scope.$index)" type="text" size="medium" style="padding:0;">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
                <el-tab-pane label="配置代理商">
                  <el-button @click="openDialog('新增代理商', 'agent')">新增</el-button>
                  <el-checkbox v-model="isAgentAll[power]" @change="$forceUpdate()" style="margin-left: 15px;" v-if="userInformation.userProfile.subjectType !== 'agent'">全部</el-checkbox>
                  <div class="table-container">
                    <el-table :data="selectedAgentList[power]">
                      <el-table-column prop="fullName" label="名称"></el-table-column>
                      <el-table-column label="操作">
                        <template slot-scope="scope">
                          <el-button @click="deleteSelection('service', scope.$index)" type="text" size="medium" style="padding:0;">删除</el-button>
                        </template>
                      </el-table-column>
                    </el-table>
                  </div>
                </el-tab-pane>
              </el-tabs>
            </el-tab-pane>
          </el-tabs>
        </el-form-item>
        <el-form-item label="备注" prop="memo">
          <el-input class="form_input" v-model="staff_form.memo"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button size="small" @click="staff_clearn(); staff_show = false">取消</el-button>
        <el-button size="small" @click="staff_submit" type="primary">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :title="dialogTitle" :visible.sync="list_show" @close="selectionArr = {};" width="800px">
        <el-form :inline="true" :model="list_form" ref="list_form" size="small"> <!-- @submit.native.prevent -->
            <el-form-item label="名称" size="small" prop="name">
                <el-input v-model="list_form.name"></el-input>
            </el-form-item>
            <el-form-item label="全称" size="small" prop="fullName">
                <el-input v-model="list_form.fullName"></el-input>
            </el-form-item>
            <el-form-item style="margin-top: -4px">
                <el-button type="primary" @click="query" size="small">查询</el-button>
                <el-button size="small" @click="list_clearn">清除</el-button>
            </el-form-item>
        </el-form>
        <div class="table-container">
          <el-table v-if="dialogType === 'app'" ref="multipleTable" :data="tableList.list" height="250" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="appName" label="商户名称"></el-table-column>
            <el-table-column prop="companyName" label="公司名称"></el-table-column>
          </el-table>
          <el-table v-else-if="dialogType === 'service' || dialogType === 'company' || dialogType === 'agent'" ref="multipleTable" :data="tableList.list" height="250" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="fullName" label="名称"></el-table-column>
          </el-table>
        </div>
        <ayg-pagination
          v-if="tableList.total"
          :total="tableList.total"
          v-on:handleSizeChange="sizeChange"
          :currentSize="list_form.pageSize"
          v-on:handleCurrentChange="query"
          :currentPage="list_form.page">
        </ayg-pagination>

        <div slot="footer" class="dialog-footer" style="margin-top: -30px;">
          <el-button @click="list_show = false">取 消</el-button>
          <el-button type="primary" @click="confirmSelection">选择勾选项</el-button>
        </div>
    </el-dialog>
  </div>
</template>
<script>
import {
    get,
    post,
    formPost,
    postButNoErrorToast,
    postWithErrorCallback
} from "../../store/api";
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import { setTimeout } from 'timers';
import { mapGetters } from 'vuex'
export default {
  components: { Treeselect },
  computed: {
    ...mapGetters({
      userInformation: 'userInformation'
    })
  },
  data() {
    return {
      list: [],
      root: [],
      f_root: [],
      curr: '',
      section_show: true,
      section_form: {
        companyId: -1,
        leaderEmployeeId: '',
        leaderEmployeeName: '',
        memo: '',
        name: '',
        pid: '',
        id: ''
      },
      section_rules: {
        name: [
          { required: true, message: "请填写部门名称", trigger: "blur" }
        ],
        leaderEmployeeId: [
          { required: true, message: "请选择部门负责人", trigger: "blur" }
        ]
      },
      staff_show: true,
      staff_form: {
        name: '',
        position: '',
        mobile: '',
        email: '',
        belongOrgId: '',
        attachOrgIds: [],
        userId: '',
        userProfileId: '',
        companyId: -1,
        leaderEmployeeId: '',
        leaderEmployeeName: '',
        id: '',
        memo: '',
        adminContextParam: {
          platformType: '',
          roleIds: [],
          userContextList: [],
          agentList: [],
        },
        companyContextParam: {
          platformType: '',
          roleIds: [],
          userContextList: [],
          agentList: [],
        }
      },
      staff_rules: {
        name: [
          { required: true, message: "请填写姓名", trigger: "blur" }
        ],
        belongOrgId: [
          { required: true, message: "请选择归属部门", trigger: "blur" }
        ],
        position: [
          { required: true, message: "请填写职位", trigger: "blur" }
        ],
        mobile: [
          { required: true, message: "请填写手机号", trigger: "blur" }
        ]
      },
      staff_list: [],
      staff_query_form: {
        companyId: -1,
        orgGroupId: '',
        page: 1,
        pageSize: 10,
        accountInfo: '',
      },
      staff_query_data: {},
      // -----------------------------
      activeName: 'first',
      systemList: [],
      selectedAppList: {},
      selectedServiceList: {},
      selectedCompanyList: {},
      selectedAgentList: {},
      roleList: {},
      activeRoleList: [],
      list_form: {
        fullName: '',
        name: '',
        companyType: '',
        page: 1,
        pageSize: 10
      },
      tableList: [],
      multipleSelection: [],
      list_show: false,
      dialogTitle: '',
      dialogType: '',
      selectionArr: [],
      isCompanyAll: {},
      isAppAll: {},
      isProviderAll: {},
      isAgentAll: {},
      render: true,
      power: '',
      labelName: ['运营管理平台', '企业客户平台']
    }
  },
  mounted() {
    this.getRoot()
    this.getstaffList()
    get('/api/sysmgr-web/commom/option', {
      enumType: 'PlatformType'
    }).then(result => {
      this.systemList = result
      this.staff_form.adminContextParam.platformType = this.power = result[0].value
      this.staff_form.companyContextParam.platformType = result[1].value
      result.forEach(e => {
        get('/api/sysmgr-web/user/role-list', {
          sourceType: e.value
        }).then(result => {
          this.roleList[e.value] = result
        })
      })
    })
    this.staff_query()
    this.section_show = false
    this.staff_show = false
  },
  methods: {
    getstaffList() {
      post('/api/sysmgr-web/employee/allEmployeeByOrg', {
        companyId: -1
      }).then(data => {
        this.staff_list = data
      })
    },
    getRoot() {
      get('/api/sysmgr-web/org/companyOrgList', {
        companyId: -1
      }).then(data => {
        this.list = data
        this.root = []
        this.list.forEach((e, i) => {
          if(!e.pid) {
            this.root.push(this.getChildren(e))
          }
        })
        this.f_root = JSON.parse(JSON.stringify(this.root))
      })
    },
    getChildren(e) {
      e.children = []
      e.label = e.name || ''
      this.list.forEach(ev => {
        if(ev.pid == e.id) {
          e.children.push(this.getChildren(ev))
        }
      })
      if(!e.children.length) {
        delete e.children
      }
      return e
    },
    setStaffDisabled(a) {
      a = a || this.f_root
      a.forEach(e => {
        if(e.id == this.staff_form.belongOrgId) {
          e.isDisabled = true
        }
        else {
          delete e.isDisabled
        }
        if(e.children) {
          e.children =  this.setStaffDisabled(e.children)
        }
      })
      return a
    },
    updata() {
      this.render = !this.render
      this.staff_form.attachOrgIds = []
    },
    checkSelect() {
      this.staff_form.attachOrgIds.forEach((e, i) => {
        if(e == this.staff_form.belongOrgId) {
          this.staff_form.attachOrgIds.splice(i, 1)
        }
      })
    },
    choose() {
      let arr = this.$refs.tree.getCheckedNodes()
      if(arr.length) {
        if(arr.length != 1) {
          arr = arr.filter(e => e.id != this.curr.id)
        }
        this.curr = arr[0]
        this.staff_query_form.orgGroupId = this.curr.id
      }
      else {
        this.curr = ''
      }
      this.staff_query()
      this.$refs.tree.setCheckedKeys([arr.length ? arr[0].id : '']);
    },
    setDisabled(a) {
      a = a || this.root
      a.forEach(e => {
        if(this.curr && e.id != this.curr.id) {
          e.disabled = true
        }
        else {
          e.disabled = false
        }
        e = this.setDisabled(e.children)
      })
      return a
    },
    section_add() {
      this.section_show = true
    },
    section_submit() {
      this.$refs.section_form.validate(valid => {
        if(valid) {
          this.staff_list.forEach(e => {
            if(e.id == this.section_form.leaderEmployeeId) {
              this.section_form.leaderEmployeeName = e.name
            }
          })
          post(`/api/sysmgr-web/org/${this.section_form.id ? 'editOrg' : 'createOrg'}`, this.section_form).then(data => {
            this.$message({
              type: 'success',
              message: `${this.section_form.id ? '修改' : '添加'}成功！`
            })
            this.section_clearn()
            this.getRoot()
            this.section_show = false
          })
        }
      })
    },
    section_edit() {
      if(!this.curr) {
        return
      }
      get('/api/sysmgr-web/org/orgDetail', {
        id: this.curr.id
      }).then(data => {
        for(let k in this.section_form) {
          if(data[k]) {
            this.section_form[k] = data[k]
          }
        }
        this.section_show = true
      })
    },
    section_delete() {
      if(!this.curr) {
        return
      }
      get('/api/sysmgr-web/org/delOrg', {
        id: this.curr.id
      }).then(data => {
        this.$message({
          type: 'success',
          message: '删除成功！'
        })
        this.curr = ''
        this.$refs.tree.setCheckedKeys([])
        this.getRoot()
      })
    },
    section_clearn(next) {
      this.$refs.section_form.resetFields()
      this.curr = ''
      this.$refs.tree.setCheckedKeys([])
      typeof next == 'function' && next()
    },
    staff_add() {
      this.staff_show = true
    },
    staff_submit() {
      this.systemList.forEach((e, i) => {
        var userContextList = []
        if(this.isAppAll[e.value]) {
          userContextList.push({
            isAllSubject: true,
            subjectType: 'app'
          })
        }
        else {
          this.selectedAppList[e.value] && this.selectedAppList[e.value].forEach(item =>{
            userContextList.push({
              subjectId: item.appId,
              subjectName: item.appName,
              subjectType: 'app'
            })
          })
        }
        console.log(this.isProviderAll, e.value)
        if(this.isProviderAll[e.value]) {
          userContextList.push({
            isAllSubject: true,
            subjectType: 'provider'
          })
        }
        else {
          this.selectedServiceList[e.value] && this.selectedServiceList[e.value].forEach(item => {
            userContextList.push({
              subjectId: item.id,
              subjectName: item.fullName,
              subjectType: 'provider'
            })
          })
        }
        if(this.isCompanyAll[e.value]) {
          userContextList.push({
            isAllSubject: true,
            subjectType: 'company'
          })
        }
        else {
          this.selectedCompanyList[e.value] && this.selectedCompanyList[e.value].forEach(item => {
            userContextList.push({
              subjectId: item.id,
              subjectName: item.fullName,
              subjectType: 'company'
            })
          })
        }
        if(this.isAgentAll[e.value]) {
          userContextList.push({
            isAllSubject: true,
            subjectType: 'company'
          })
        }
        else {
          this.selectedAgentList[e.value] && this.selectedAgentList[e.value].forEach(item => {
            userContextList.push({
              subjectId: item.id,
              subjectName: item.fullName,
              subjectType: 'agent'
            })
          })
        }
        this.staff_form[i == 0 ? 'adminContextParam' : 'companyContextParam'].userContextList = userContextList
      })
      this.staff_list.forEach(e => {
        if(e.id == this.staff_form.leaderEmployeeId) {
          this.staff_form.leaderEmployeeName = e.name
        }
      })
      post(`/api/sysmgr-web/employee/${this.staff_form.id ? 'editEmployee' : 'createEmployee'}`, this.staff_form).then(data => {
        this.$message({
          type: 'success',
          message: `${this.staff_form.id ? '修改' : '添加'}成功！`
        })
        this.staff_show = false
        this.staff_clearn()
        this.staff_query()
        this.getstaffList()
      })
    },
    staff_clearn(next) {
      this.$refs.staff_form.resetFields()
      this.staff_form.id = ''
      this.staff_form.platformType = ''
      this.staff_form.userId = ''
      this.staff_form.userProfileId = ''
      this.staff_form.leaderEmployeeName = ''
      this.staff_form.adminContextParam.roleIds = []
      this.staff_form.companyContextParam.roleIds = []
      this.selectedAppList = {}
      this.selectedServiceList = {}
      this.selectedCompanyList = {}
      this.isCompanyAll = {}
      this.isAppAll = {}
      this.isProviderAll = {}
      this.activeName = 'first'
      this.power = this.systemList[0].value
      typeof next == 'function' && next()
    },
    staff_query(a) {
      if(isNaN(a)) {
        a = 1
      }
      this.staff_query_form.page = a
      post('/api/sysmgr-web/employee/employeeList', this.staff_query_form).then(data => {
        this.staff_query_data = data
      })
    },
    staff_size_change(a) {
      this.staff_query_form.pageSize = a
      this.staff_query()
    },
    staff_clear() {
      this.$refs.staff_query_form.resetFields()
    },
    staff_edit(id) {
      get('/api/sysmgr-web/employee/employeeDetail', { id }).then(data => {
        this.staff_show = true
        for(var k in this.staff_form) {
          data[k] && (this.staff_form[k] = data[k])
        }
        console.log(this.systemList, data.userInfoDetail.userProfiles.length)
        data.userInfoDetail.userProfiles.forEach((e, i) => {
          console.log(this.systemList[i], i)
          var k = i == 0 ? 'adminContextParam' : 'companyContextParam', type = this.systemList[i].value
          this.staff_form[k].roleIds = []
          e.roles && e.roles.forEach(ev => {
            this.staff_form[k].roleIds.push(ev.id)
          })
          if(e.userContextCollectionMap) {
            if(e.userContextCollectionMap.app) {
              if(e.userContextCollectionMap.app.isAllSubject) {
                this.isAppAll[type] = true
              }
              else {
                this.selectedAppList[type] = this.formatList(e.userContextCollectionMap.app.userContexts, 'App')
              }
            }
            if(e.userContextCollectionMap.provider) {
              if(e.userContextCollectionMap.provider.isAllSubject) {
                this.isProviderAll[type] = true
              }
              else {
                this.selectedServiceList[type] = this.formatList(e.userContextCollectionMap.provider.userContexts, 'Service')
              }
            }
            if(e.userContextCollectionMap.company) {
              if(e.userContextCollectionMap.company.isAllSubject) {
                this.isCompanyAll[type] = true
              }
              else {
                this.selectedCompanyList[type] = this.formatList(e.userContextCollectionMap.company.userContexts, 'Company')
              }
            }
            if(e.userContextCollectionMap.agent) {
              if(e.userContextCollectionMap.agent.isAllSubject) {
                this.isAgentAll[type] = true
              }
              else {
                this.selectedAgentList[type] = this.formatList(e.userContextCollectionMap.agent.userContexts, 'Agent')
              }
            }
          }
        })
        this.queryRoleList()
      })
    },
    formatList(list, name) {
      var arr = []
      list && list.forEach(e => {
        name == 'Company' && arr.push({
          id: e.subjectId,
          fullName: e.subjectName
        })
        name == 'App' && arr.push({
          appId: e.subjectId,
          appName: e.subjectName,
          companyName: e.lvl1SubjectName
        })
        name == 'Service' && arr.push({
          id: e.subjectId,
          fullName: e.subjectName
        })
        name == 'Agent' && arr.push({
          id: e.subjectId,
          fullName: e.subjectName
        })
      })
      return arr
    },
    // ------------------------------
    // handleSystemType() {
    //   this.selectedAppList = []
    //   this.selectedServiceList = []
    //   this.selectedCompanyList = []
    //   this.queryRoleList()
    // },
    queryRoleList() {
      if(!this.roleList[this.staff_form.platformType]) {
        get('/api/sysmgr-web/user/role-list', {
          sourceType: this.staff_form.platformType
        }).then(result => {
          this.activeRoleList = this.roleList[this.staff_form.platformType] = result
        })
      }
      else {
        this.activeRoleList = this.roleList[this.staff_form.platformType]
      }
    },
    openDialog(title, type) {
      this.dialogTitle = title
      this.dialogType = type
      this.list_form = {
        fullName: '',
        name: '',
        companyType: '',
        page: 1,
        pageSize: 10
      }
      this.tableList = []
      this.multipleSelection = []
      this.list_show = true
      this.query()
    },
    query(a) {
      if(isNaN(a)) {
        a = 1
      }
      this.list_form.page = a
      this.getArr()
      let url
      switch (this.dialogType) {
        case 'app':
          url = '/api/sysmgr-web/commom/query-app-page-list'
          this.list_form.appName = this.list_form.name
          break
        case 'service':
          url = '/api/sysmgr-web/commom/query-service-company-page-list'
          this.list_form.companyType = 'provider'
          break
        case 'company':
          url = '/api/sysmgr-web/commom/query-customer-company-page-list'
          break
        case 'agent':
          url = '/api/sysmgr-web/commom/query-agent-company-page-list'
          break
      }
      post(url, this.list_form).then(result => {
        this.tableList = result
        this.$nextTick(() => {
          this.tableList.list.forEach(e => {
            this.selectionArr[this.power].forEach((el, i) => {
              if(el.appId ? el.appId == e.appId : el.id ? el.id == e.id : '') {
                this.$refs.multipleTable.toggleRowSelection(e)
                this.selectionArr[this.power].splice(i, 1)
              }
            })
          })
        })
      })
    },
    sizeChange(a) {
      this.list_form.pageSize = a
    },
    getArr() {
      this.selectionArr[this.power] = this.selectionArr[this.power] || []
      this.multipleSelection.forEach(e => {
        var arr = this.selectionArr[this.power].filter(el => {
            return el.appId ? el.appId == e.appId : el.id ? el.id == e.id : ''
        })
        if(!arr.length){
          this.selectionArr[this.power].push(e)
        }
      })
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    firstUpperCase(str) {
      return str.toLowerCase().replace(/^\S/g,function(s){return s.toUpperCase();});
    },
    confirmSelection() {
      this.getArr()
      let keyName = this.firstUpperCase(this.dialogType)
      let selectedList = JSON.parse(JSON.stringify(this[`selected${keyName}List`][this.power] || []))
      this.selectionArr[this.power].forEach(item =>{
        if(!selectedList.filter(e => {
          var result = false
          if(e.appId) {
            result = e.appId == item.appId
          }
          else {
            result = e.id == item.id
          }
          return result
        }).length) {
          selectedList.push(item)
        }
      })
      this[`selected${keyName}List`][this.power] = selectedList
      this.list_show = false
    },
    list_clearn() {
      this.$refs.list_form.resetFields()
    },
    deleteSelection(type, index) {
      let keyName = this.firstUpperCase(type)
      this[`selected${keyName}List`][this.power].splice(index, 1)
    },
    changeState(id, type) {
      this.$confirm(`确认要${type ? '启用' : '停用'}账号？`, "提示", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        post('/api/sysmgr-web/user/alter', {
          userId: id,
          isEnable: type
        }).then(result => {
          this.$message({
            type: 'success',
            message: '操作成功！'
          })
          this.staff_query()
        })
      })
    },
    resetPassword(id) {
      this.$confirm('确认要重置密码吗？', '提示', {
        type: 'warning',
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(() =>{
        post(`/api/sysmgr-web/user/adminResetPwd?userId=${id}`).then(data => {
          this.$message({
            type: 'success',
            message: '密码已重置！'
          })
        })
      }).catch(err =>{
          
      })
    }
  }
}
</script>
<style scoped> 
.r_main {
  padding: 30px 30px;
  background-color: #fff;
  overflow: hidden;
}
.box {
  float: left;
  width: 400px;
  min-height: 500px;
  border: 1px solid #cccccc;
}
.box > div:nth-child(1) {
  height: 50px;
  line-height: 50px;
  background-color: #f5f5f5;
  padding: 0px 10px;
}
.mr78 {
  margin-right: 78px;
}
.disabled {
  filter: grayscale(1);
  cursor: not-allowed;
}
.form_input {
  width: 400px;
}
.right {
  margin-left: 20px;
  width: calc(100% - 420px);
}
.t_right {
  float: right;
}
.ot600 {
  display: inline-block;
  max-width: 600px;
  overflow: hidden;
  text-overflow: ellipsis;
  height: 50px;
  white-space: nowrap;
}
</style>
