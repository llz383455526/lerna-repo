<template>
  <div class="r_main">
      <el-breadcrumb>
        <el-breadcrumb-item to="/main/infoManager/categoryManager">
            发票类目管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
            发票类型添加
        </el-breadcrumb-item>
      </el-breadcrumb>
      <el-form class="form" :model="form" :inline="true" :rules="rules" label-width="120px">
          <el-form-item label="发票类目名字">
            <el-input v-model="form.name" class="form_input" placeholder="请输入类目名字"></el-input>
          </el-form-item>
          <el-form-item label="税率">
              <el-select v-model="rateText" class="form_input" @change="change">
                <el-option v-for="e in rate" :key="e.text" :label="e.text" :value="e.text"></el-option>
              </el-select>
              <!-- <el-input v-model="form.taxRate" class="form_input" :disabled="true" placeholder="请输入税率"></el-input> -->
          </el-form-item>
          <el-form-item label="税收分类编号">
              <el-input v-model="form.code" class="form_input" style="width: 278px; margin-right: 10px;" :disabled="true" placeholder="请输入税收分类编码"></el-input><el-button type="primary" @click="dShow">税收分类表</el-button>
          </el-form-item>
          <el-form-item label="简称">
              <el-input v-model="form.abbreviation" class="form_input" :disabled="true" placeholder="请输入税收分类编码简称"></el-input>
          </el-form-item>
          <el-form-item class="form_foot">
              <el-button @click="save" type="primary">保存</el-button>
              <el-button @click="cancel" type="warning">取消</el-button>
          </el-form-item>
      </el-form>
      <el-dialog class="dialog" title="商品和服务税收分类编码" width="80%" :visible.sync="show">
          <div class="d_content">
            <div class="t_box">
              <el-tree class="tree"
  :filter-node-method="filterNode" accordion :data="treeData" :props="defaultProps" :node-key="id" @node-click="handleNodeClick" :default-expanded-keys="active" ref="tree"></el-tree>
            </div>
            <div class="d_right">
                <el-input v-model="search" class="in_input" @keyup.enter.native="checkSearch"></el-input><el-button @click="checkSearch" type="primary">搜索</el-button><el-button @click="refresh">刷新</el-button>
                <el-table class="table" :data="tableData" border>
                    <el-table-column type="index" label="序号"></el-table-column>
                    <el-table-column prop="code" label="编号"></el-table-column>
                    <el-table-column prop="name" label="商务和服务分类简称"></el-table-column>
                    <el-table-column label="税率（%）">
                      <template slot-scope="scope">
                        {{scope.row.taxRate ? scope.row.taxRate : 0}}
                      </template>
                    </el-table-column>
                    <el-table-column label="操作">
                      <template slot-scope="scope">
                        <el-button type="text" @click="choose(scope.row)" :class="{prevent: (scope.row.children[0])}">选择</el-button>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
          <div style="clear: both;"></div>
          </div>
      </el-dialog>
  </div> 
</template>
<script>
import { get, post, formPost } from "../../store/api";
export default {
  data() {
    return {
      form: {
        name: "",
        taxRate: "",
        code: "",
        name: "",
        id: ""
      },
      show: false,
      treeData: "",
      tableData: [],
      backData: [],
      search: "",
      active: [],
      defaultProps: {
        children: "children",
        label: "name"
      },
      filterText: '',
      seccessText: '',
      rate: [],
      rateText: ''
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    }
  },
  activated() {
    console.log(JSON.parse(sessionStorage.getItem('categoryData')))
    var form = JSON.parse(sessionStorage.getItem('categoryData')) || {
      name: "",
      taxRate: "",
      code: "",
      name: "",
      id: ""
    }
    this.form = form
    this.rateText = ''
    var isFirst = false
    if(this.form.taxRate !== '') this.rateText = this.form.taxRate + '%'
    this.seccessText = '添加成功！'
    if(this.form.name) {
      this.seccessText = '修改成功'
    }
  },
  mounted() {
    this.getMsg()
    this.getRate()
  },
  methods: {
    getMsg() {
      get("/api/invoice-web/commom/invoice-subject-list").then(
        function(data) {
          this.treeData = data;
          this.tableData = data[0].children;
          this.backData = data[0].children;
        }.bind(this)
      );
    },
    getRate() {
      get('/api//invoice-web/commom/invoice-rate-list').then(
        function(data) {
          console.log(data)
          this.rate = data
        }.bind(this)
      )
    },
    dShow() {
      this.show = true;
      setTimeout(
        function() {
          console.log(this.$refs.tree)
        }.bind(this),
        100
      );
    },
    handleNodeClick(data) {
      console.log(data);
      if (data.children.length) {
        this.tableData = data.children;
        this.backData = data.children;
      }
      else{
        this.tableData = this.backData = [data]
      }
    },
    checkSearch() {
      this.filterText = this.search
      // this.tableData = this.backData.filter(function(e) {
      //   return e.name.indexOf(this.search) > -1;
      // }, this);
    },
    choose(a) {
      console.log(a);
      if (!a.children[0]) {
        this.show = false;
        this.form.taxRate = a.taxRate || 0;
        this.form.code = a.code;
        this.form.abbreviation = a.name;
        var isFirst = false
        this.rate.forEach(e => {
          if(!isFirst && e.value - 0 == this.form.taxRate){
            isFirst = true
            this.rateText = e.text
          }
        }, this)
      }
    },
    save() {
      if (this.form.name == '' && this.form.id =='') {
        this.$alert("请正确填写！");
        return;
      }
      post("/api/invoice-web/custom-invoice-subject/save-update", this.form).then(function(data) {
          console.log(data);
          this.$message({
            type: 'success',
            message: this.seccessText
          })
          this.$router.back(-1)
        }.bind(this)
      );
    },
    cancel() {
      this.$router.back(-1)
    },
    refresh() {
      this.getMsg()
      this.search = ''
    },
    filterNode(value, data) {
        if (!value) return true;
        return data.name && data.name.indexOf(value) !== -1;
    },
    change(a){
      this.rate.forEach(e => {
          if(e.text == a){
            this.form.taxRate = e.value
          }
        }, this)
      console.log(this.form.taxRate)
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
.form_input {
  width: 400px;
}
.form_foot {
  display: block;
  /* text-align: right; */
  padding: 50px 0 0 820px;
}
.form_foot button {
  margin: 0 30px 0;
}
.dialog {
  overflow: scroll;
}
.d_content {
  min-width: 1000px;
}
.table {
  margin-top: 20px;
}
.d_right {
  float: left;
  height: 100%;
  width: 600px;
  margin-left: 20px;
}
.in_input {
  width: 200px;
}
.el-dialog__body {
  min-width: 1000px;
}
.prevent {
  color: #ccc;
  cursor: not-allowed;
}
.t_box{
  float: left;
  display: inline-block;
  max-height: 600px;
  overflow-y: auto;
}
</style>
