<template>
  <div class="r_main">
    <el-breadcrumb>
      <el-breadcrumb-item>
        客户管理
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="r_head">
      <el-input size="small" v-model="form.companyName" class="in_input" @keyup.enter.native="query()"></el-input>
      <el-button size="small" type="primary" @click="query()">搜索</el-button>
      <div class="f_left">
        <!-- <el-button type="primary">导出客户信息</el-button>
        <el-button type="primary">导入客户信息</el-button> -->
        <router-link to="/main/infoManager/addCustomer" v-if="userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'">
          <el-button size="small" type="primary">添加客户</el-button>
        </router-link>
      </div>
    </div>
    <el-table class="table" :data="tableData" border>
     <el-table-column label="操作" width="100">
        <template slot-scope="scope">
          <el-button @click="modification(scope.row)" size="small" type="text">修改</el-button>
          <el-button @click="delet(scope.row)" size="small" type="text" v-if="userInformation.userProfile && userInformation.userProfile.subjectType !== 'agent'">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="商户名称"></el-table-column>
      <el-table-column prop="taxIdcd" label="纳税识别号"></el-table-column>
      <el-table-column prop="addr" label="地址"></el-table-column>
      <el-table-column prop="phone" label="电话号码"></el-table-column>
      <el-table-column prop="bankName" label="开户银行"></el-table-column>
      <el-table-column prop="bankAccount" label="银行账户"></el-table-column>
      <el-table-column label="收票人">
        <template slot-scope="scope">
          {{scope.row.collector ? scope.row.collector : '暂无'}}
        </template>
      </el-table-column>
      <el-table-column label="收票人电话">
        <template slot-scope="scope">
          {{scope.row.collectorPhone ? scope.row.collectorPhone : '暂无'}}
        </template>
      </el-table-column>
      <el-table-column label="收票人地址">
        <template slot-scope="scope">
          {{scope.row.collectorAddr ? scope.row.collectorAddr : '暂无'}}
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
    <el-dialog title="修改" :visible.sync="show">
      <el-form :model="detail" :rules="rules" label-width="120px" ref="dateil">
        <el-form-item label="商户名称：" prop="name">
          <el-select filterable v-model="detail.name" placeholder="请输入商户名称" @change="change">
                <el-option v-for="item in nameList" :key="item.companyId" :label="item.companyName" :value="item.companyName"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="纳税识别号：" prop="taxIdcd">
          <el-input v-model="detail.taxIdcd"></el-input>
        </el-form-item>
        <el-form-item label="地址：" prop="addr">
          <el-input v-model="detail.addr"></el-input>
        </el-form-item>
        <el-form-item label="电话号码：" prop="phone">
          <el-input v-model="detail.phone"></el-input>
        </el-form-item>
        <el-form-item label="开户银行：" prop="bankName">
          <el-input v-model="detail.bankName"></el-input>
        </el-form-item>
        <el-form-item label="银行账号：" prop="bankAccount">
          <el-input v-model="detail.bankAccount"></el-input>
        </el-form-item>
        <el-form-item label="收票人：" prop="collector">
          <el-input v-model="detail.collector"></el-input>
        </el-form-item>
        <el-form-item label="收票人电话：" prop="collectorPhone">
          <el-input v-model="detail.collectorPhone"></el-input>
        </el-form-item>
        <el-form-item label="收票人地址：" prop="collectorAddr">
          <el-input v-model="detail.collectorAddr"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="form_footer">
        <el-button type="primary" @click="sure">确定</el-button>
        <el-button @click="query(form.page);show = false">取消</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { get, post, formPost } from "../../store/api";
import { mapGetters } from 'vuex'
export default {
  computed: {
      ...mapGetters({
          userInformation: 'userInformation'
      })
  },
  data() {
    return {
      form: {
        companyName: '',
        page: 1,
        pageSize: 5
      },
      tableData: [],
      total: 0,
      show: false,
      detail: {},
      nameList: {},
      rules: {
        name: [
          { required: true, message: '请输入商户名称', trigger: 'blur' }
        ],
        taxIdcd: [
          { required: true, message: '请输入纳税识别号', trigger: 'blur' }
        ],
        // addr: [
        //   { required: true, message: '请输入地址', trigger: 'blur' }
        // ],
        // phone: [
        //   { required: true, message: '请输入电话号码', trigger: 'blur' },
        //   { pattern: /^[\d\-]+$/, message: '请正确输入号码'}
        // ],
        // bankName: [
        //   { required: true, message: '请输入开户银行名称', trigger: 'blur' }
        // ],
        // bankAccount: [
        //   { required: true, message: '请输入开户银行账号', trigger: 'blur' },
        //   { pattern: /^([1-9]{1})(\d{12,25})$/, message: '请正确输入银行账号', trigger: 'blur'}
        // ],
        // collector: [
        //   { required: true, message: '请输入收票人名字', trigger: 'blur' }
        // ],
        // collectorPhone: [
        //   { required: true, message: '请输入收票人电话号码', trigger: 'blur' },
        //   { pattern: /^((0\d{2,3}-\d{7,8})|(1[3584]\d{9}))$/, message: '请正确输入号码'}
        // ],
        // collectorAddr: [
        //   { required: true, message: '请输入收票人地址', trigger: 'blur' }
        // ]
      }
    };
  },
  mounted() {
    get("/api/console-dlv/option/get-option-customer-companies").then(
      function(data) {
        console.log(data);
        this.nameList = data;
      }.bind(this)
    );
  },
  activated() {
    this.query()
  },
  methods: {
    query(a) {
      this.form.page = 1
      if(a && !isNaN(a)){
          this.form.page = a
      }
      post('/api/invoice-web/custom-company/qry', this.form).then(function(data){
        console.log(data)
        this.tableData = data.list
        this.total = data.total
      }.bind(this))
    },
    modification(e) {
      this.detail = e
      this.detail.opr = 'upd'
      this.show = true
    },
    sure() {
      this.$refs['dateil'].validate(valid => {
        if(valid){
          post("/api/invoice-web/custom-company/save-update", this.detail).then(
            function(data) {
              console.log(data);
              this.$message({
                type: "success",
                message: "修改成功！"
              })
              this.show = false
              this.query()
            }.bind(this)
          );
        }
      })
    },
    delet(e) {
      this.$confirm('此操作将永久删除该类目, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(function(){
        post("/api/invoice-web/custom-company/del", {
          id: e.id
        }).then(function(data) {
            console.log(data);
            this.show = false
            this.$message({
              type: 'success',
              message: '删除成功！'
            })
            if(this.tableData.length == 1){
              this.form.page--
            }
            this.query()
          }.bind(this)
        );
      }.bind(this)).catch(function(){
        this.$message({
          type: 'info',
          message: '已取消删除！'
        })
      }.bind(this))
    },
    change(a) {
      this.nameList.forEach(function(e) {
        if (e.companyName == a) {
          this.detail.id = e.companyId;
          console.log(e.companyId);
        }
      }, this);
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
/* .form_footer {
  display: flex;
  justify-content: space-between;
  padding-left: calc(60% - 50px);
  margin-top: 30px;
} */
.form_footer button {
  margin: 0 20px;
}
</style>
