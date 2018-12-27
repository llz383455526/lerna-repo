<template>
  <div class="main-container">
    <el-form :model="accountForm" :rules="rules" ref="accountForm" label-width="200px" class="demo-contractForm">
      <el-form-item label="姓名" prop="name">
        <el-input v-model="accountForm.name"></el-input>
      </el-form-item>

      <el-form-item label="手机号码" prop="mobile">
        <el-input v-model="accountForm.mobile"></el-input>
      </el-form-item>

      <el-form-item label="邮箱地址" prop="email">
        <el-input v-model="accountForm.email"></el-input>
      </el-form-item>

      <el-form-item label="选择归属企业" prop="subjectId">
        <el-select class="wf" v-model="accountForm.subjectId" @change="getApp" filterable>
          <el-option v-for="e in customs" :key="e.id" :value="e.id" :label="e.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="对应角色权限">
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

      <el-form-item>
        <el-button type="primary" @click="submitForm('accountForm')">保存</el-button>
        <el-button @click="backToList">取消</el-button>
      </el-form-item>
    </el-form>

    <el-dialog title="商户" :visible.sync="dialogVisible" @close="selectionArr = [];">
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
      <el-form
        :inline="true"
        :model="formService"
        ref="formService"
        v-else-if="dialogType === 'service'"
        @submit.native.prevent
      >
        <el-form-item label="名称" size="small" prop="fullName">
          <el-input v-model="formService.fullName"></el-input>
        </el-form-item>

        <el-form-item style="margin-top: -4px">
          <el-button type="primary" @click="search" size="small">查询</el-button>
          <el-button size="small" @click="resetForm('formService')">清除</el-button>
        </el-form-item>
      </el-form>
      <el-form
        :inline="true"
        :model="formCompany"
        ref="formCompany"
        v-else-if="dialogType === 'company'"
        @submit.native.prevent
      >
        <el-form-item label="简称" size="small" prop="name">
          <el-input v-model="formCompany.name"></el-input>
        </el-form-item>

        <el-form-item label="全称" size="small" prop="fullName">
          <el-input v-model="formCompany.fullName"></el-input>
        </el-form-item>

        <el-form-item style="margin-top: -4px">
          <el-button type="primary" @click="search" size="small">查询</el-button>
          <el-button size="small" @click="resetForm('formService')">清除</el-button>
        </el-form-item>
      </el-form>

      <div class="table-container">
        <el-table
          v-if="dialogType === 'app'"
          ref="multipleTable"
          :data="tableList.list"
          height="250"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>

          <el-table-column prop="appName" label="商户名称"></el-table-column>
          <el-table-column prop="companyName" label="公司名称"></el-table-column>
          <!--<el-table-column prop="companyName" label="企业名称"></el-table-column>
          <el-table-column prop="serviceCompanyName" label="服务商名称"></el-table-column>-->
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
        :currentPage="pageIndex">
        </ayg-pagination>

      <div slot="footer" class="dialog-footer" style="margin-top: -30px;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <!--<el-button type="primary" @click="">选择全部结果</el-button>-->
        <el-button type="primary" @click="confirmSelection">选择勾选项</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { post, get } from "../../store/api";

import _ from "lodash";

import { showNotify } from "../../plugin/utils-notify";

export default {
  data() {
    return {
      accountId: "",
      accountForm: {
        name: "",
        mobile: "",
        email: "",
        roleIds: [],
        platformType: "",
        subjectId: '',
        subjectName: '',
        subjectType: 'company'
      },
      rules: {},
      activeName: "first",
      systemList: [],
      systemType: "",
      roleList: {},
      roleIds: [],
      activeRoleList: [],
      pageIndex: 1,
      pageSize: 10,
      tableList: [],
      dialogVisible: false,
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
      isAppAll: false,
      isProviderAll: false,
      isCompanyAll: false,
      customs: [],
      apps: []
    };
  },
  mounted() {
    this.querySysList();
    get('/api/sysmgr-web/commom/company?companyIdentity=custom').then(data => {
      this.customs = data
    })
  },
  methods: {
    querySysList() {
      get("/api/sysmgr-web/commom/option", {
        enumType: "PlatformType"
      }).then(result => {
        this.systemList = result;
        this.systemType = result[1].value
        this.handleSystemType(this.systemType)
      });
    },
    queryRoleList(systemType) {
      if (!this.roleList[systemType]) {
        get("/api/sysmgr-web/user/role-list", {
          sourceType: systemType
        }).then(result => {
          this.roleList[systemType] = result;
          this.activeRoleList = result;
        });
      } else this.activeRoleList = this.roleList[systemType];
    },
    handleSystemType(val) {
      this.selectedAppList = [];
      this.selectedServiceList = [];
      this.selectedCompanyList = [];
      this.queryRoleList(val);
    },
    backToList() {
      this.$router.push("accountList");
    },
    getApp() {
      get('/api/sysmgr-web/commom/app-list', {
        companyId: this.accountForm.subjectId
      }).then(data => {
        this.apps = data
      })
    },
    isAll() {
      return this.selectedAppList.filter(e => e == 'all').length ? true : false
    },
    submitForm(formName) {
      this.customs.forEach(e => {
        if(e.id == this.accountForm.subjectId) {
          this.accountForm.userProfileName = this.accountForm.subjectName = e.name
        }
      })
      let formData = _.cloneDeep(this.accountForm);
      let userContextList = [];
      if (this.isAll()) {
        userContextList.push({
          subjectId: this.accountForm.subjectId,
          subjectName: this.accountForm.subjectName,
          subjectType: this.accountForm.subjectType
        });
      } else {
        _.forEach(this.selectedAppList, item => {
          this.apps.forEach(e => {
            if(e.value == item) {
              userContextList.push({
                subjectId: e.value,
                subjectName: e.text,
                subjectType: "app"
              });
            }
          })
        });
      }

      // if (this.isProviderAll) {
      //   userContextList.push({
      //     isAllSubject: true,
      //     subjectType: "provider"
      //   });
      // } else {
      //   _.forEach(this.selectedServiceList, item => {
      //     userContextList.push({
      //       subjectId: item.id,
      //       subjectName: item.fullName,
      //       subjectType: "provider"
      //     });
      //   });
      // }

      // if (this.isCompanyAll) {
      //   userContextList.push({
      //     isAllSubject: true,
      //     subjectType: "company"
      //   });
      // } else {
      //   _.forEach(this.selectedCompanyList, item => {
      //     userContextList.push({
      //       subjectId: item.id,
      //       subjectName: item.fullName,
      //       subjectType: "company"
      //     });
      //   });
      // }

      formData.userContextList = userContextList;
      formData.platformType = this.systemType;

      // console.log(formData)

      post("/api/sysmgr-web/user/create", formData).then(result => {
        showNotify("success", "创建成功");
        this.backToList();
      });
    },
    openDialog(title, type) {
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
      let url = "/api/sysmgr-web/commom/query-app-page-list";;
      let formSearch = _.cloneDeep(this.formApp);
      let options = _.assign(formSearch, {
        page: this.pageIndex,
        pageSize: this.pageSize
      });

      // switch (this.dialogType) {
      //   case "app":
      //     url = "/api/sysmgr-web/commom/query-app-page-list";
      //     formSearch = _.cloneDeep(this.formApp);
      //     break;
      //   case "service":
      //     url = "/api/sysmgr-web/commom/query-service-company-page-list";
      //     formSearch = _.cloneDeep(this.formService);
      //     formSearch.companyType = "provider";
      //     break;
      //   case "company":
      //     url = "/api/sysmgr-web/commom/query-customer-company-page-list";
      //     formSearch = _.cloneDeep(this.formCompany);
      //     break;
      // }

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
      this.getArr();
      let keyName = this.firstUpperCase(this.dialogType);
      let selectedList = _.cloneDeep(this[`selected${keyName}List`]);

      _.forEach(this.selectionArr, item => {
        if (
          !_.find(selectedList, function(o) {
            return o.id === item.id;
          })
        ) {
          selectedList.push(item);
        }
      });

      this[`selected${keyName}List`] = selectedList;

      this.dialogVisible = false;
    },
    deleteSelection(type, index) {
      let keyName = this.firstUpperCase(type);
      this[`selected${keyName}List`].splice(index, 1);
    }
  }
};
</script>

<style lang="scss" scoped>
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















