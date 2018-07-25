<template> 
  <div class="r_main">
      <el-breadcrumb>
          <el-breadcrumb-item>
              客户管理
          </el-breadcrumb-item>
      </el-breadcrumb>
      <el-form class="form" :model="form" :inline="true" label-width="100px">
          <el-form-item label="客户名称" size="small">
              <el-input v-model="form.fullName" class="in_input"></el-input>
          </el-form-item>
          <!-- <el-form-item label="开通状态">
              <el-select v-model="form.orderBy" class="in_input">
                  <el-option value="1" label="开通"></el-option>
                  <el-option value="0" label="未开通"></el-option>
              </el-select>
          </el-form-item> -->
          <el-form-item label="客户简称" size="small">
              <el-input v-model="form.name" class="in_input"></el-input>
          </el-form-item>
          <el-form-item class="form_foot" size="small">
              <el-button type="primary" @click="query">查询</el-button><el-button @click="clear">重置</el-button>
          </el-form-item>
      </el-form>
	  <router-link to="addClient">
		  <el-button size="small" type="primary">新建企业</el-button>
	  </router-link>
      <el-table class="table" :data="tableData" border="">
          <el-table-column prop="name" label="企业简称"></el-table-column>
          <el-table-column prop="fullName" label="企业全称"></el-table-column>
          <el-table-column prop="service" label="企业类型">
            <template slot-scope="scope">
              {{scope.row.service ? '服务商' : '客户'}}
            </template>
          </el-table-column>
          <el-table-column prop="chargeByName" label="企业负责人"></el-table-column>
          <el-table-column prop="createTime" label="添加时间"></el-table-column>
          <el-table-column prop="createByName" label="创建人"></el-table-column>
          <!-- <el-table-column prop="logStatus" label="开通状态"></el-table-column> -->
          <el-table-column prop="updateTime" label="更新时间"></el-table-column>
          <el-table-column prop="updateByName" label="更新人"></el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
				  <el-button v-if="scope.row.service" @click="serverManager(scope.row)" type="text">管理</el-button>
                  <el-button v-else @click="appManager(scope.row)" type="text">管理</el-button>
              </template>
          </el-table-column>
      </el-table>
      <div class="page" v-show="total / form.pageSize > 1">
          <el-pagination
          background
          layout="prev, pager, next"
          :page-size="form.pageSize"
          :total="total"
          @current-change="query"
          :currentPage="form.page"
          >
        </el-pagination>
      </div>
      <!-- <el-dialog title="添加客户" :visible.sync="eshow" width="50%">
          <el-form :inline="true" label-width="80px">
              <el-form-item label="客户名称">
                  <el-select v-model="appId" filterable remote :remote-method="remoteMethod" :loading="loading">
                      <el-option v-for="item in remoteData" :label="item.text" :value="item.value"></el-option>
                  </el-select>
              </el-form-item>
          </el-form>
          <span class="form_footer" slot="footer">
              <el-button @click="sure" type="primary">确定</el-button>
              <el-button @click="eshow = false" type="warning">取消</el-button>
          </span>
      </el-dialog> -->
  </div>
</template>
<script>
import { get, post, formPost, postButNoErrorToast } from "../../store/api";
export default {
  data() {
    return {
      form: {
        name: "",
        fullName: "",
        page: 1,
        pageSize: 5
      },
      tableData: [],
      total: 0,
    //   eshow: false,
      appId: "",
      loading: false,
      remoteData: []
    };
  },
  activated() {
    this.query();
  },
  mounted() {},
  methods: {
    query(a) {
      this.form.page = 1;
      if (a && !isNaN(a)) {
        this.form.page = a;
      }
      post("/api/sysmgr-web/company/query-company", this.form).then(
        function(data) {
          console.log(data);
          this.tableData = data.list;
          this.total = data.total;
        }.bind(this)
      );
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
      console.log(query);
      if (query !== "") {
        var that = this;
        this.loading = true;
        get("/api/sysmgr-web/company/search-principal-company", {
          name: query
        }).then(function(data) {
          that.loading = false;
          that.remoteData = data;
        });
      }
    },
    // add(a) {
    //   console.log(a);
    //   this.eshow = true;
    // },
    sure(e) {
      if (this.appId) {
        post("/api/sysmgr-web/company/add-customer-company", {
          id: this.appId
        }).then(
          function(data) {
            console.log(data);
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
      console.log(e);
      localStorage.setItem('appId', e.id)
      localStorage.setItem('fullName', e.fullName)
      this.$router.push("/main/clientManager/appManager");
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
</style>
