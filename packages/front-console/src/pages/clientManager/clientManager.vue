<template>
  <div class="r_main">
    <el-breadcrumb>
      <el-breadcrumb-item>
        客户管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <el-form class="form" :model="form" :inline="true" label-width="100px">
      <el-form-item label="企业名称" size="small">
        <el-input v-model="form.fullName" class="in_input"></el-input>
      </el-form-item>
      <el-form-item label="企业简称" size="small">
        <el-input v-model="form.name" class="in_input"></el-input>
      </el-form-item>
      <el-form-item class="form_foot" size="small">
        <el-button type="primary" @click="query">查询</el-button>
        <el-button @click="clear">重置</el-button>
      </el-form-item>
    </el-form>
    <router-link to="addClient" v-if="checkRight(permissions, 'sysmgr-web:/company/add-company')">
      <el-button size="small" type="primary">新建企业</el-button>
    </router-link>
    <el-table class="table" :data="tableData" border="">
      <el-table-column prop="fullName" label="企业全称"></el-table-column>
      <el-table-column prop="chargeByName" label="企业负责人"></el-table-column>
      <el-table-column prop="salesList" label="关联销售">
        <template slot-scope="scope">
          <div v-for="e in scope.row.salesList" :key="e.id">{{e.name}}</div>
        </template>
      </el-table-column>
      <el-table-column prop="deliverList" label="关联交付">
          <template slot-scope="scope">
              <p style="margin: 0" v-for="(v, k) in scope.row.deliverList" :key="k">{{ v.name }}</p>
          </template>
      </el-table-column>
      <el-table-column prop="createTime" label="添加时间"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间"></el-table-column>
      <el-table-column label="操作" width="150px">
        <template slot-scope="scope">
          <el-button v-if="checkRight(permissions, 'sysmgr-web:/company/edit-company')" @click="appManager(scope.row)" type="text">管理</el-button>
          <el-button @click="appExamine(scope.row)" type="text">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
    <ayg-pagination
      v-if="total"
      :total="total"
      v-on:handleSizeChange="setSize"
      :currentSize="form.pageSize"
      v-on:handleCurrentChange="query"
      :currentPage="form.page">
    </ayg-pagination>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex';
  import {get, post, formPost, postButNoErrorToast} from "../../store/api";
  export default {
    data() {
      return {
        form: {
          name: "",
          fullName: "",
          page: 1,
          pageSize: 10
        },
        tableData: [],
        total: 0,
        appId: "",
        loading: false,
        remoteData: [],
        activeData: ''
      };
    },
    computed: {
      ...mapGetters({
          permissions: 'permissions',
          userInformation: 'userInformation'
      })
    },
    activated() {
      this.activeData && (this.form = JSON.parse(this.activeData))
      this.query(this.form.page);
    },
    methods: {
      query(a) {
        this.form.page = 1;
        if (a && !isNaN(a)) {
          this.form.page = a;
        }
        this.activeData = JSON.stringify(this.form)
        post("/api/sysmgr-web/company/query-company", this.form).then(
          function (data) {
            this.tableData = data.list;
            this.total = data.total;
          }.bind(this)
        );
      },
      setSize(a) {
        this.form.pageSize = a
        this.query()
      },
      clear() {
        this.form = {
          name: "",
          fullName: "",
          orderBy: "",
          page: 1,
          pageSize: 5
        };
      },
      remoteMethod(query) {
        if (query !== "") {
          var that = this;
          this.loading = true;
          get("/api/sysmgr-web/company/search-principal-company", {
            name: query
          }).then(function (data) {
            that.loading = false;
            that.remoteData = data;
          });
        }
      },
      sure(e) {
        if (this.appId) {
          post("/api/sysmgr-web/company/add-customer-company", {
            id: this.appId
          }).then(
            function (data) {
              this.appId = "";
              this.eshow = false;
              this.$message({
                type: "success",
                message: "添加成功！"
              });
            }.bind(this)
          );
        }
      },
      appManager(e) {
        localStorage.setItem('appId', e.id)
        localStorage.setItem('fullName', e.fullName)
        this.$router.push("/main/clientManager/appManager");
      },
      appExamine(e) {
        localStorage.setItem('appId', e.id)
        localStorage.setItem('fullName', e.fullName)
        this.$router.push("/main/clientManager/appExamine");
      },
      serverManager(e) {
        localStorage.setItem('appId', e.id)
        localStorage.setItem('fullName', e.fullName)
        this.$router.push("/main/clientManager/serverManager");
      }
    }
  };
</script>
<style scoped>
  .r_main {
    padding: 30px 10px;
    background-color: #fff;
  }

  .form {
    margin-top: 20px;
  }

  .in_input {
    width: 200px;
  }

  .form_foot {
    display: block;
    padding: 0 0 0 820px;
  }

  .form_foot button {
    margin: 0 30px 0;
  }

  .t_head {
    margin: 30px 0;
    font-size: 20px;
    color: #666;
  }

  .table {
    margin-top: 20px;
  }

  .page {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
  }

  .half > span {
    display: inline-block;
    width: 40%;
  }

  .f_input {
    width: 400px;
  }

  .form_footer > button {
    margin: 0px 30px;
  }

  .start-icon {
    color: #ddd;
  }
  .start-action {
    color: #30652e;
  }
</style>
