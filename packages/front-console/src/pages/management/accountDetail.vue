<template>
  <div class="main-container">
    <h4 class>基本信息
      <el-button style="margin-left: 15px" @click="openUserDialog">编辑</el-button>
    </h4>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">姓名：</el-col>
      <el-col :span="8">{{userDetail.name}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">电话：</el-col>
      <el-col :span="8">{{userDetail.mobilephone}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">邮箱：</el-col>
      <el-col :span="8">{{userDetail.email}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">创建时间：</el-col>
      <el-col :span="8">{{userDetail.createTime}}</el-col>
    </el-row>
    <el-row class="mb15" style="font-weight: normal;">
      <el-col :span="4" style="text-align: right; margin-right: 20px;">更新时间：</el-col>
      <el-col :span="8">{{userDetail.lastModifyTime}}</el-col>
    </el-row>

    <h4 class>权限列表</h4>
    <el-button @click="openDialogOut">添加权限配置</el-button>

    <div class="table-container">
      <el-table :data="userDetail.userProfiles || []">
        <el-table-column label="权限配置" prop="name"></el-table-column>
        <el-table-column label="角色">
          <template slot-scope="scope">
            <div v-for="item in scope.row.roles">{{item.name}}</div>
          </template>
        </el-table-column>
        <el-table-column label="归属平台">
          <template slot-scope="scope">
            <span>{{systemList[scope.row.platformType].text}}</span>
          </template>
        </el-table-column>

        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <el-button
              @click="openEditProfile(scope.row)"
              type="text"
              size="medium"
              style="padding:0;"
            >配置数据权限</el-button>
            <el-button
              @click="deleteProfile(scope.row.id)" 
              type="text"
              size="medium"
              style="padding:0;"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="添加权限配置" :visible.sync="dialogOutVisible" width="800px" :before-close="reset">
      <el-form :model="accountForm" :rules="rules" ref="accountForm" label-width="100px">
        <el-form-item label="选择归属企业" prop="subjectId">
          <el-select class="wf" v-model="accountForm.subjectId" @change="getApp" filterable>
            <el-option v-for="e in customs" :key="e.id" :value="e.id" :label="e.name"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="对应角色权限" prop="roleIds">
          <el-checkbox-group v-model="accountForm.roleIds">
              <el-checkbox v-for="item in activeRoleList" :key="item.roleId" :label="item.roleId">{{item.roleName}}</el-checkbox>
            </el-checkbox-group>
        </el-form-item>

        <el-form-item label="数据权限配置">
          <el-checkbox-group v-model="selectedAppList" v-show="accountForm.subjectId">
            <el-checkbox label="all">全部商户</el-checkbox><br>
            <el-checkbox v-if="!isAll()" v-for="e in apps" :key="e.value" :label="e.value">{{e.text}}</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogOutVisible = false">取 消</el-button>
        <el-button type="primary" @click="addProfile">确认</el-button>
      </div>

      <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" append-to-body width="45%" @close="selectionArr = [];">
        <el-form
          :inline="true"
          :model="formApp"
          ref="formApp"
          v-if="dialogType === 'app'"
          @submit.native.prevent
        >
          <el-form-item label="商户名称" size="small" prop="appName">
            <el-input v-model="formApp.appName"></el-input>
          </el-form-item>

          <!--<el-form-item label="客户公司名称" size="small" prop="serviceCompanyName">
                        <el-input v-model="formApp.companyName"></el-input>
                    </el-form-item>

                    <el-form-item label="服务商名称" size="small" prop="serviceCompanyName">
                        <el-input v-model="formApp.serviceCompanyName"></el-input>
          </el-form-item>-->
          <el-form-item style="margin-top: -4px">
            <el-button type="primary" @click="search" size="small">查询</el-button>
            <el-button size="small" @click="resetForm('formApp')">清除</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="formService" ref="formService" v-else-if="dialogType === 'service'" @submit.native.prevent>
          <el-form-item label="名称" size="small" prop="fullName">
            <el-input v-model="formService.fullName"></el-input>
          </el-form-item>

          <el-form-item style="margin-top: -4px">
            <el-button type="primary" @click="search" size="small">查询</el-button>
            <el-button size="small" @click="resetForm('formService')">清除</el-button>
          </el-form-item>
        </el-form>
        <el-form :inline="true" :model="formCompany" ref="formCompany" v-else-if="dialogType === 'company'" @submit.native.prevent>
          <el-form-item label="简称" size="small" prop="name">
            <el-input v-model="formCompany.name"></el-input>
          </el-form-item>

          <el-form-item label="全称" size="small" prop="fullName">
            <el-input v-model="formCompany.fullName"></el-input>
          </el-form-item>

          <el-form-item style="margin-top: -4px">
            <el-button type="primary" @click="search" size="small">查询</el-button>
            <el-button size="small" @click="resetForm('formCompany')">清除</el-button>
          </el-form-item>
        </el-form>

        <div class="table-container">
          <el-table v-if="dialogType === 'app'" ref="multipleTable" :data="tableList.list" height="250" @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="appName" label="商户名称"></el-table-column>
            <el-table-column prop="companyName" label="公司名称"></el-table-column>
          </el-table>
          <el-table
            v-else-if="dialogType === 'service' || dialogType === 'company'"
            ref="multipleTable"
            :data="tableList.list"
            height="250"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"></el-table-column>

            <el-table-column prop="fullName" label="名称"></el-table-column>
          </el-table>
        </div>
        <ayg-pagination
          v-if="tableList.total"
          :total="tableList.total"
          v-on:handleSizeChange="handleSizeChange"
          :currentSize="pageSize"
          v-on:handleCurrentChange="handleCurrentChange"
          :currentPage="pageIndex"
        ></ayg-pagination>

        <div slot="footer" class="dialog-footer" style="margin-top: -30px;">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmSelection">选择勾选项</el-button>
        </div>
      </el-dialog>
    </el-dialog>

    <el-dialog title="编辑用户信息" :visible.sync="dialogUserVisible">
      <el-form :model="userFormData" label-width="200px">
        <el-form-item label="姓名">
          <el-input v-model="userFormData.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="userFormData.mobile"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="userFormData.email"></el-input>
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer" style="margin-top: -20px;">
        <el-button @click="dialogUserVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveUser">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { post, get } from "../../store/api";
import _ from "lodash";
import { showNotify } from "../../plugin/utils-notify";
import { setTimeout } from "timers";

export default {
  created() {
    let accountId = this.$route.query.id;
    this.querySysList(accountId);
    // this.getDetail(accountId)
  },
  data() {
    return {
      accountId: "",
      userDetail: {},
      profileDetail: {},
      pageIndex: 1,
      pageSize: 10,
      tableList: [],
      dialogOutVisible: true,
      dialogVisible: false,
      dialogTitle: "",
      dialogType: "",
      formApp: {
        appName: "",
        companyName: "",
        isEnable: true,
        serviceCompanyName: ""
      },
      formService: {
        fullName: ""
      },
      formCompany: {
        name: "",
        fullName: ""
      },
      multipleSelection: [],
      selectionArr: [],
      selectedAppList: [],
      selectedServiceList: [],
      selectedCompanyList: [],
      systemList: {},
      roleList: {},
      roleIds: [],
      activeRoleList: [],
      activeName: "first",
      profileEdit: false,
      profileType: [
        { key: "app", bindKey: "App" },
        { key: "provider", bindKey: "Service" },
        { key: "company", bindKey: "Company" }
      ],
      dialogUserVisible: false,
      userFormData: {
        name: "",
        mobile: "",
        email: ""
      },
      isAppAll: false,
      isServiceAll: false,
      isCompanyAll: false,
      customs: [],
      accountForm: {
        id: '',
        name: '',
        platformType: '',
        roleIds: [],
        subjectId: '',
        subjectName: '',
        subjectType: 'company',
        userContextList: [],
        userId: ''
      },
      rules: {},
      apps: []
    };
  },
  mounted() {
    get('/api/sysmgr-web/commom/company?companyIdentity=custom').then(data => {
      this.customs = data
    })
    this.dialogOutVisible = false
  },
  methods: {
    querySysList(accountId) {
      get("/api/sysmgr-web/commom/option", {
        enumType: "PlatformType"
      }).then(result => {
        // this.systemList = result
        _.forEach(result, item => {
          this.systemList[item.value] = item;
        });
        this.accountForm.platformType = result[1].value;
        this.queryRoleList(this.accountForm.platformType)
        this.getDetail(accountId);
      });
    },
    getDetail(id) {
      this.accountId = id;
      get("/api/sysmgr-web/commom/user-detail", {
        userId: id
      }).then(result => {
        this.userDetail = result;
      });
    },
    deleteProfile(profileId) {
      post("/api/sysmgr-web/user/delete-user-profile", {
        userId: this.accountId,
        userProfileId: profileId
      }).then(result => {
        showNotify("success", "删除成功");
        this.getDetail(this.accountId);
      });
    },
    openDialogOut() {
      this.profileEdit = false;
      this.roleIds = [];
      this.selectedAppList = [];
      this.dialogOutVisible = true;
    },
    getApp(a) {
      get('/api/sysmgr-web/commom/app-list', {
        companyId: this.accountForm.subjectId
      }).then(data => {
        !a && (this.selectedAppList = [])
        this.apps = data
      })
    },
    isAll() {
      return this.selectedAppList.filter(e => e == 'all').length ? true : false
    },
    reset(next) {
      this.$refs.accountForm.resetFields()
      this.selectedAppList = []
      typeof next == 'function' && next()
    },
    addProfile() {
      this.customs.forEach(e => {
        if(e.id == this.accountForm.subjectId) {
          this.accountForm.name = this.accountForm.subjectName = e.name
        }
      })
      this.accountForm.userId = this.userDetail.id
      var accountForm = JSON.parse(JSON.stringify(this.accountForm))
      if (this.isAll()) {
        accountForm.userContextList.push({
          subjectId: this.accountForm.subjectId,
          subjectName: this.accountForm.subjectName,
          subjectType: this.accountForm.subjectType
        });
      } else {
        _.forEach(this.selectedAppList, item => {
          this.apps.forEach(e => {
            if(e.value == item) {
              accountForm.userContextList.push({
                subjectId: e.value,
                subjectName: e.text,
                subjectType: "app"
              });
            }
          })
        });
      }
      accountForm.userProfileId = accountForm.id
      post(`/api/sysmgr-web/user/${this.profileEdit ? 'edit-profile' : 'add-profile'}`, accountForm).then(result => {
        showNotify("success", `${this.profileEdit ? '修改' : '添加'}成功`);
        this.getDetail(this.accountId);
        this.reset();
        this.dialogOutVisible = false;
      });
    },
    queryRoleList(systemType) {
      if (!this.roleList[systemType]) {
        get("/api/sysmgr-web/user/role-list", {
          sourceType: systemType
        }).then(result => {
          this.roleList[systemType] = result;
          this.activeRoleList = result;
          console.log(result)
        });
      } else this.activeRoleList = this.roleList[systemType];
    },
    handleSystemType(val) {
      this.selectedAppList = [];
      this.selectedServiceList = [];
      this.selectedCompanyList = [];
      this.roleIds = [];
      this.queryRoleList(val);
    },
    handleRoleChange(val) {},
    openDialog(title, type) {
      this.dialogTitle = title;
      this.dialogType = type;
      this.pageIndex = 1;
      this.pageSize = 10;
      this.tableList = [];
      this.multipleSelection = [];
      this.dialogVisible = true;

      this.getList();
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    search() {
      this.pageIndex = 1;
      this.getList();
    },
    handleSizeChange(value) {
      this.pageSize = value;
      this.pageIndex = 1;
      this.getList();
    },
    handleCurrentChange(value) {
      this.pageIndex = value;
      this.getList();
    },
    getList() {
      this.getArr();
      let url;
      let formSearch;
      let options = _.assign(formSearch, {
        page: this.pageIndex,
        pageSize: this.pageSize
      });

      switch (this.dialogType) {
        case "app":
          url = "/api/sysmgr-web/commom/query-app-page-list";
          formSearch = _.cloneDeep(this.formApp);
          break;
        case "service":
          url = "/api/sysmgr-web/commom/query-service-company-page-list";
          formSearch = _.cloneDeep(this.formService);
          formSearch.companyType = "provider";
          break;
        case "company":
          url = "/api/sysmgr-web/commom/query-customer-company-page-list";
          formSearch = _.cloneDeep(this.formCompany);
          break;
      }

      options = _.assign(formSearch, options);

      post(url, options).then(result => {
        this.tableList = result;
        setTimeout(e => {
          this.tableList.list.forEach(e => {
            this.selectionArr.forEach((el, i) => {
              if (el.appId ? el.appId == e.appId : el.id ? el.id == e.id : "") {
                this.$refs.multipleTable.toggleRowSelection(e);
                this.selectionArr.splice(i, 1);
              }
            });
          });
        }, 100);
      });
    },
    getArr() {
      this.multipleSelection.forEach(e => {
        var arr = this.selectionArr.filter(el => {
          return el.appId ? el.appId == e.appId : el.id ? el.id == e.id : "";
        });
        if (!arr.length) {
          this.selectionArr.push(e);
          console.log(e);
        }
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    firstUpperCase(str) {
      return str.toLowerCase().replace(/^\S/g, function(s) {
        return s.toUpperCase();
      });
    },
    confirmSelection() {
      /*let isApp = this.dialogType === 'app'

		        let selectedList = _.cloneDeep(isApp ? this.selectedAppList : this.selectedServiceList)*/
      let isApp = this.dialogType === "app";
      let keyName = this.firstUpperCase(this.dialogType);
      let selectedList = _.cloneDeep(this[`selected${keyName}List`]);
      this.getArr();
      _.forEach(this.selectionArr, item => {
        if (
          !_.find(selectedList, function(o) {
            return o.subjectId === (isApp ? item.appId : item.id).toString();
          })
        ) {
          selectedList.push({
            subjectId: (isApp ? item.appId : item.id).toString(),
            subjectName: isApp ? item.appName : item.fullName,
            subjectType:
              this.dialogType === "service" ? "provider" : this.dialogType,
            companyName: item.companyName
          });
        }
      });
      /*if(isApp) this.selectedAppList = selectedList
		        else this.selectedServiceList = selectedList*/
      this[`selected${keyName}List`] = selectedList;

      this.dialogVisible = false;
    },
    deleteSelection(type, index) {
      /*switch (type) {
			        case 'app':
				        this.selectedAppList.splice(index, 1)
				        break
			        case 'service':
				        this.selectedServiceList.splice(index, 1)
				        break
		        }*/
      let keyName = this.firstUpperCase(type);
      this[`selected${keyName}List`].splice(index, 1);
    },
    openEditProfile(profile) {
      console.log(profile)
      this.profileEdit = profile.id;
      this.accountForm.platformType = profile.platformType;
      for(let k in this.accountForm) {
        if(profile[k]) {
          this.accountForm[k] = profile[k]
        }
      }
      this.accountForm.subjectId -= 0
      this.getApp(1)
      _.forEach(profile.roles, item => {
        this.accountForm.roleIds.push(item.id);
      });
      this.queryRoleList(profile.platformType);
      profile.userContextCollectionMap.app && profile.userContextCollectionMap.app.userContexts.forEach(e => {
        this.selectedAppList.push(e.subjectId)
      })
      profile.userContextCollectionMap.company && this.selectedAppList.push('all')
      this.dialogOutVisible = true;
    },
    openUserDialog() {
      this.userFormData = {
        name: this.userDetail.name,
        mobile: this.userDetail.mobilephone,
        email: this.userDetail.email
      };
      this.dialogUserVisible = true;
    },
    saveUser() {
      let formData = _.cloneDeep(this.userFormData);
      formData.userId = this.userDetail.id;
      post("/api/sysmgr-web/user/edit", formData).then(result => {
        showNotify("success", "编辑用户成功");
        this.getDetail(this.accountId);
        this.dialogUserVisible = false;
      });
    }
  }
};
</script>

<style lang="scss">
.main-container {
  background-color: #fff;
  padding: 15px;
  margin-bottom: 30px;
}

.demo-contractForm {
  width: 800px;
}

.table-container {
  width: 100%;
}

.wf {
  width: 100%;
}
</style>
















