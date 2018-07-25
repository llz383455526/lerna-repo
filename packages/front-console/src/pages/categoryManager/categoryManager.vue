<template>
  <div class="r_main">
      <el-breadcrumb>
          <el-breadcrumb-item>
              发票类目管理
          </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="r_head">
          <el-input class="in_input" v-model="form.name" placeholder="输入发票类目" @keyup.enter.native="query()"></el-input>
          <el-button type="primary" @click="query()">搜索</el-button>
          <div class="f_left">
                <el-button type="primary" @click="add">添加新类目</el-button>
          </div>
      </div>
      <el-table class="table" :data="tableData" border>
          <el-table-column prop="name" label="发票类目名"></el-table-column>
          <el-table-column prop="fullName" label="发票全称"></el-table-column>
          <el-table-column prop="taxRate" label="税率"></el-table-column>
          <el-table-column prop="abbreviation" label="简称"></el-table-column>
          <el-table-column prop="code" label="税收分类编码"></el-table-column>
          <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button @click="modification(scope.row)" size="small" type="text">修改</el-button>
                <el-button @click="delet(scope.row)" size="small" type="text">删除</el-button>
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
      <!-- <el-dialog title="修改发票类目名" width="50%" :visible.sync="show" :inline="true" label-width="120px">
        <el-form :model="mform">
          <el-form-item label="发票类目名" >
            <el-input v-model="mform.name" style="width: 75%;"></el-input>
          </el-form-item>
          <el-form-item class="form_footer">
            <el-button @click="cancel">取消</el-button>
            <el-button @click="save" type="primary">确定</el-button>
          </el-form-item>
        </el-form>
      </el-dialog> -->
  </div>
</template>
<script>
import { get, post, formPost } from "../../store/api";
export default {
  data() {
    return {
      form: {
        name: "",
        page: 1,
        pageSize: 5
      },
      tableData: [],
      total: 0,
      // show: false,
      // mform: {
      //   abbreviation: "",
      //   code: "",
      //   id: "",
      //   name: "",
      //   taxRate: ""
      // }
    };
  },
  activated() {
    this.query();
  },
  methods: {
    query(a) {
      this.form.page = 1
      if (a && !isNaN(a)) {
        this.form.page = a;
      }
      post("/api/invoice-web/custom-invoice-subject/qry", this.form).then(
        function(data) {
          console.log(data);
          this.tableData = data.list;
          this.total = data.total;
        }.bind(this)
      );
    },
    add(){
      sessionStorage.removeItem('categoryData')
      this.$router.push('/main/infoManager/addCategory')
    },
    modification(e) {
      sessionStorage.setItem('categoryData', JSON.stringify(e))
      this.$router.push('/main/infoManager/addCategory')
    },
    // cancel() {
    //   this.show = false;
    //   this.$message({
    //     type: "info",
    //     message: "取消修改。"
    //   });
    // },
    // save() {
    //   if (!this.mform.name) {
    //     this.$alert("请填写发票类目名！").catch(function() {
    //       console.log("取消");
    //     });
    //     return;
    //   }
    //   post(
    //     "/api/invoice-web/custom-invoice-subject/save-update",
    //     this.mform
    //   ).then(
    //     function(data) {
    //       console.log(data);
    //       this.show = false;
    //       this.$message({
    //         type: "success",
    //         message: "修改成功！"
    //       });
    //       this.query();
    //     }.bind(this)
    //   );
    // },
    delet(e) {
      this.$confirm("此操作将永久删除该类目, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(
          function() {
            post("/api/invoice-web/custom-invoice-subject/del", {
              id: e.id
            }).then(
              function(data) {
                console.log(data);
                this.show = false;
                this.$message({
                  type: "success",
                  message: "删除成功！"
                });
                if (this.tableData.length == 1) {
                  this.form.page--;
                }
                this.query();
              }.bind(this)
            );
          }.bind(this)
        )
        .catch(
          function() {
            this.$message({
              type: "info",
              message: "已取消删除！"
            });
          }.bind(this)
        );
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
