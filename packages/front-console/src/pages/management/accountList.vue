<template>
  <div class="main-container">
    <div style="margin-bottom:30px;">客户账户管理</div>

    <el-form :inline="true" :model="formSearch" ref="formSearch">
      <el-form-item label="姓名/电话" size="small" prop="accountInfo">
        <el-input v-model="formSearch.accountInfo"></el-input>
      </el-form-item>
      <el-form-item label="归属企业" size="small" prop="subjectId">
        <el-select v-model="formSearch.subjectId" filterable>
          <el-option value="" label="全部"></el-option>
          <el-option v-for="e in customs" :key="e.id" :value="e.id" :label="e.name"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item style="margin-top: -4px">
        <el-button type="primary" @click="search" size="small">查询</el-button>
        <el-button size="small" @click="resetForm('formSearch')">清除</el-button>
      </el-form-item>
    </el-form>

    <el-button size="small" @click="$router.push('accountCreate')">添加账号</el-button>
    <!--<el-button size="small" @click="">停用账号</el-button>-->
    <div class="table-container">
      <el-table :data="tableList.list">
        <!--<el-table-column
                        type="selection"
                        width="55">
        </el-table-column>-->
        <el-table-column prop="mobilephone" label="手机号"></el-table-column>
        <el-table-column prop="name" label="姓名"></el-table-column>
        <el-table-column prop="belongCompany" label="归属企业"></el-table-column>
        <el-table-column prop="tplNo" label="状态">
          <template slot-scope="scope">
            <span>{{scope.row.isEnable ? '启用' : '停用'}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="注册时间"></el-table-column>

        <el-table-column label="操作" width="200">
          <template slot-scope="scope">
            <el-button
              @click="toDetail(scope.row.id)"
              type="text"
              size="medium"
              style="padding:0;"
            >配置</el-button>
            <el-button
              @click="changeState(scope.row.id, !scope.row.isEnable)"
              type="text"
              size="medium"
              style="padding:0;"
            >{{scope.row.isEnable ? '停用' : '启用'}}</el-button>
            <el-button @click="resetPassword(scope.row.id)" type="text" size="medium">重置密码</el-button>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
import { post, get } from "../../store/api";
import { showNotify } from "../../plugin/utils-notify";
import _ from "lodash";
export default {
  data() {
    return {
      tableList: [],
      pageIndex: 1,
      pageSize: 10,
      multipleSelection: [],
      formSearch: {
        accountInfo: "",
        subjectId: ''
      },
      activeData: "",
      customs: []
    };
  },
  activated() {
    this.activeData && (this.formSearch = JSON.parse(this.activeData));
    this.getList();
  },
  mounted() {
    get('/api/sysmgr-web/commom/company?companyIdentity=custom').then(data => {
      this.customs = data
    })
  },
  methods: {
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
      let formSearch = _.cloneDeep(this.formSearch);
      let options = _.assign(formSearch, {
        subjectType: 'company',
        page: this.pageIndex,
        pageSize: this.pageSize
      });
      this.activeData = JSON.stringify(this.formSearch);
      post("/api/sysmgr-web/commom/user-list", options).then(result => {
        this.tableList = result;
      });
    },
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },
    changeState(id, type) {
      this.$confirm(`确认要${type ? '启用' : '停用'}账号？`, "提示", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(() => {
        post("/api/sysmgr-web/user/alter", {
          userId: id,
          isEnable: type
        }).then(result => {
          this.getList();
        });
      }).cathc(() => {})
    },
    toDetail(id) {
      this.$router.push({
        path: "accountDetail",
        query: {
          id: id
        }
      });
    },
    resetPassword(id) {
      this.$confirm("确认要重置密码吗？", "提示", {
        type: "warning",
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      })
        .then(() => {
          post(`/api/sysmgr-web/user/adminResetPwd?userId=${id}`).then(data => {
            this.$message({
              type: "success",
              message: "密码已重置！"
            });
          });
        })
        .catch(err => {});
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

.table-container {
  width: 100%;
  margin-top: 20px;
}
</style>














