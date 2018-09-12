<template>
  <div class="r_main">
       <el-breadcrumb>
        <el-breadcrumb-item to="/main/infoManager/infoManager">
            客户管理
        </el-breadcrumb-item>
        <el-breadcrumb-item>
            添加客户
        </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="form_head">客户发票信息</div>
      <el-form class="form" :model="form" :rules="rules" :inline="true" label-width="150px" ref="form">
        <el-form-item label="商户名称" prop="name">
            <el-select class="form_input" filterable v-model="form.name" placeholder="请输入商户名称" @change="change">
                <el-option v-for="item in nameList" :key="item.companyId" :label="item.companyName" :value="item.companyName"></el-option>
            </el-select>
            <!-- <el-input class="form_input" placeholder="请输入商户名称"></el-input> -->
        </el-form-item>
        <el-form-item label="纳税识别号" prop="taxIdcd">
            <el-input class="form_input" v-model="form.taxIdcd" placeholder="请输入客户纳税识别号"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="addr">
            <el-input class="form_input" v-model="form.addr" placeholder="请输入客户地址"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" prop="phone">
            <el-input class="form_input" v-model.trim="form.phone" placeholder="请输入电话号码"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="bankName">
            <el-input class="form_input" v-model="form.bankName" placeholder="请输入客户开户行名称"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankAccount">
            <el-input class="form_input" v-model="form.bankAccount" placeholder="请输入客户银行账号"></el-input>
        </el-form-item>
        <el-form-item>
          <div class="form_head">收票人信息</div>
        </el-form-item>
        <el-form-item label="收票人姓名" prop="collector">
            <el-input class="form_input" v-model="form.collector" placeholder="请输入收票人姓名"></el-input>
        </el-form-item>
        <el-form-item label="收票人电话" prop="collectorPhone">
            <el-input class="form_input" v-model="form.collectorPhone" placeholder="请输入收票人电话"></el-input>
        </el-form-item>
        <el-form-item label="收票人收件地址" prop="collectorAddr">
            <el-input class="form_input" v-model="form.collectorAddr" placeholder="请输入收票人地址"></el-input>
        </el-form-item>
        <el-form-item class="form_foot">
            <el-button type="primary" size="small" @click="save">保存</el-button>
            <el-button size="small" @click="cancel">取消</el-button>
        </el-form-item>
      </el-form>
  </div>
</template>
<script>
import { get, post, formPost } from "../../store/api";
export default {
  data() {
    return {
      form: {
        addr: "",
        bankAccount: "",
        bankName: "",
        collector: "",
        collectorAddr: "",
        collectorPhone: "",
        id: "",
        name: "",
        phone: "",
        taxIdcd: "",
        opr: "add"
      },
      nameList: [],
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
    this.form = {
      addr: "",
      bankAccount: "",
      bankName: "",
      collector: "",
      collectorAddr: "",
      collectorPhone: "",
      id: "",
      name: "",
      phone: "",
      taxIdcd: "",
      opr: "add"
    };
  },
  methods: {
    change(a) {
      this.nameList.forEach(function(e) {
        if (e.companyName == a) {
          this.form.id = e.companyId;
          console.log(e.companyId);
        }
      }, this);
    },
    save() {
      this.$refs['form'].validate(valid => {
        if(valid){
          post("/api/invoice-web/custom-company/save-update", this.form).then(
            function(data) {
              console.log(data);
              this.$message({
                type: "success",
                message: "添加成功！"
              });
              this.$router.back(-1);
            }.bind(this)
          );
        }
      })
    },
    cancel() {
      this.form = {
        addr: "",
        bankAccount: "",
        bankName: "",
        collector: "",
        collectorAddr: "",
        collectorPhone: "",
        id: "",
        name: "",
        phone: "",
        taxIdcd: "",
        opr: "add"
      };
      this.$router.back(-1);
    }
  }
};
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
  background-color: #fff;
}
.form_head {
  margin-top: 20px;
  font-size: 24px;
  color: #333;
  width: 100vw;
}
.form {
  margin-top: 20px;
}
.form_input {
  width: 400px;
}
.form_foot {
  display: block;
  padding: 50px 0 0 820px;
}
.form_foot button {
  margin: 0 30px 0;
}
</style>