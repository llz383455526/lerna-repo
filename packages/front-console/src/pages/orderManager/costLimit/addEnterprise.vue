<template>
  <div class="add-enterprise">
    <div>
      新增企业销售成本限额
    </div>
    <br>
    <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px" size="mini" class="demo-ruleForm">
      <el-form-item label="选择对应企业" prop="enterprise">
        <el-select filterable v-model="ruleForm.enterprise" placeholder="请选择对应企业">
          <el-option :label="v.name" :value="v.id" v-for="(v, k) in customList" :key="k"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <el-button type="primary" size="mini" @click="addBtnClick">新增规则</el-button>
    <br/> <br/>
    <el-table
      :data="[]"
      border
      style="width: 100%">
      <el-table-column
        label="ID">
      </el-table-column>
      <el-table-column
        label="税优地">
      </el-table-column>
      <el-table-column
        label="操作">
      </el-table-column>
    </el-table>
    <br>
    <el-button size="mini" @click="backBtnClick">返回</el-button>
  </div>
</template>

<script>
  import {get, post} from "../../../store/api";
  export default {
    name: "addEnterprise",
    data() {
      return {
        ruleForm: {
          enterprise: null
        },
        rules: {
          enterprise: [
            { required: true, message: '请选择对应企业', trigger: 'blur' },
          ]
        },
        customList: []
      }
    },
    methods: {
      getEnterprise() {
        get('/api/sysmgr-web/commom/company?companyIdentity=custom').then(data => {
          this.customList = data
        })
      },
      backBtnClick() {
        this.$router.go(-1)
      },
      addBtnClick() {
        this.$refs['ruleForm'].validate((valid) => {
          if (valid) {
            this.$router.push({ path: '/main/orderManager/costLimitAddRule' , query: {id: this.ruleForm.enterprise}})
          } else {
            this.$message({
              message: '请选择企业',
              type: 'error'
            });
            return false;
          }
        });
      }
    },
    mounted() {
      this.getEnterprise()
    }
  }
</script>

<style lang="scss" scoped>
.add-enterprise {
  margin: 20px 0;
  padding: 20px;
  background-color: #fff;
}
</style>
