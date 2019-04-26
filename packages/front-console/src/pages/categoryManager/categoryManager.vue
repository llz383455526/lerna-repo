<template>
  <div class="r_main">
      <el-breadcrumb>
          <el-breadcrumb-item>
              发票类目管理
          </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="r_head">
          <el-form :model="form" :inline="true" size="small" ref="form">
              <el-form-item label="类目名称" prop="name">
                  <el-input class="in_input" v-model="form.name" placeholder="输入发票类目"></el-input>
              </el-form-item>
              <el-form-item label="状态" prop="status">
                  <el-select class="in_input" v-model="form.status">
                      <el-option v-for="e in statusList" :key="e.value" :value="e.value" :label="e.text"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item>
                  <el-button type="primary" @click="query()">搜索</el-button>
                  <el-button @click="$refs['form'].resetFields()">清除</el-button>
              </el-form-item>
          </el-form>
          <div class="f_left">
                <el-button type="primary" size="small" @click="add">添加新类目</el-button>
          </div>
      </div>
      <el-table class="table" :data="tableData" border>
          <el-table-column prop="name" label="发票类目名"></el-table-column>
          <el-table-column prop="fullName" label="发票全称"></el-table-column>
          <el-table-column prop="taxRate" label="税率"></el-table-column>
          <el-table-column prop="abbreviation" label="简称"></el-table-column>
          <el-table-column prop="code" label="税收分类编码"></el-table-column>
          <el-table-column prop="statusName" label="状态"></el-table-column>
          <el-table-column prop="updateByName" label="最后操作人"></el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="modification(scope.row)" size="small" type="text">修改</el-button>
                <el-button @click="toggle(scope.row)" size="small" type="text">{{scope.row.status == 1 ? '禁用' : '启用'}}</el-button>
              </template>
          </el-table-column>
      </el-table>
      <ayg-pagination v-if="total" 
        :total="total"
        v-on:handleSizeChange="setSize"
        v-on:handleCurrentChange="query" 
        :currentPage="form.page">
    </ayg-pagination>
  </div>
</template>
<script>
import { get, post, formPost } from "../../store/api";
export default {
    data() {
      return {
        form: {
          name: "",
          status: "",
          page: 1,
          pageSize: 10
        },
        tableData: [],
        total: 0,
        statusList: [],
        activeData: ''
      };
    },
    activated() {
        this.activeData && (this.form = JSON.parse(this.activeData))
        get('/api/invoice-web/commom/option?enumType=SubjectStatus').then(data => {
            this.statusList = data
            this.form.status = data[0].value
            this.query(sessionStorage.getItem('resetPage') ? 1 : this.form.page);
        })
    },
    methods: {
      query(a) {
        this.form.page = 1
        if (a && !isNaN(a)) {
          this.form.page = a;
        }
        this.activeData = JSON.stringify(this.form)
        post("/api/invoice-web/custom-invoice-subject/qry", this.form).then(function(data) {
            this.tableData = data.list;
            this.total = data.total;
          }.bind(this)
        );
      },
      setSize(a) {
          this.form.pageSize = a
          this.query();
      },
      add(){
        sessionStorage.removeItem('categoryData')
        this.$router.push('/main/infoManager/addCategory')
      },
      modification(e) {
        sessionStorage.setItem('categoryData', JSON.stringify(e))
        this.$router.push('/main/infoManager/addCategory')
      },
      toggle(a) {
        this.$confirm(`是否确定要${a.status == 1 ? '禁用' : '启用'}?`, '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            post('/api/invoice-web/custom-invoice-subject/swich-subject-status', {
              id: a.id
          }).then(data => {
              this.query(this.form.page)
          })
        }).catch(() => {})
      }
    }
};
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
  background-color: #fff;
}
.r_head {
  margin-top: 20px;
}
.in_input {
  width: 200px;
}
.f_left {
  float: right;
}
.table {
  margin-top: 20px;
}
.page {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
.page > div {
  display: inline-block;
}
.form_footer {
  display: flex;
  /* justify-content: space-between; */
  padding-left: calc(75% - 150px);
  margin-top: 30px;
}
.form_footer button {
  margin: 0 30px;
}
</style>
