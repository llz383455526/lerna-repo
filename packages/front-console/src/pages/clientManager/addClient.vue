<template>
    <div class="r_main">
        <el-breadcrumb>
          <el-breadcrumb-item>
              添加新企业
          </el-breadcrumb-item>
      </el-breadcrumb>
      <div class="tool">
        <el-button size="small" @click="back">取消</el-button>
        <el-button size="small" type="primary" @click="submit">保存</el-button>
      </div>
      <el-form :model="form" :rules="rule" label-width="200px" ref="form">
          <el-form-item label="企业名称" prop="fullName" size="small">
              <el-input class="form_input" v-model="form.fullName"></el-input>
          </el-form-item>
          <el-form-item label="企业简称" prop="name" size="small">
              <el-input class="form_input" v-model="form.name"></el-input>
          </el-form-item>
          <!-- <el-form-item label="企业类型" prop="companyType" size="small">
              <el-select v-model="form.companyType" class="form_input" @change="getPeople">
                  <el-option v-for="e in types" :label="e.text" :value="e.value" :key="e.value"></el-option>
              </el-select>
          </el-form-item> -->
          <el-form-item label="企业负责人" prop="chargeBy" size="small">
              <el-select v-model="form.chargeBy" class="form_input" @change="getName">
                  <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="税优地" prop="taxLandingId" size="small" v-if="form.companyType == 'provider'">
              <el-select v-model="form.taxLandingId" class="form_input">
                  <el-option v-for="e in list" :label="e.taxLandingName" :value="e.id" :key="e.id"></el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="企业地址" prop="areaName" size="small">
              <el-input class="form_input" v-model="form.areaName"></el-input>
          </el-form-item>
          <el-form-item label="注册日期" prop="registerDate" size="small">
            <el-date-picker
                class="form_input"
                v-model="form.registerDate"
                type="date"
                value-format="yyyy-MM-dd">
            </el-date-picker>
              <!-- <el-input class="form_input" v-model="form.registerDate"></el-input> -->
          </el-form-item>
      </el-form>
    </div>
</template>
<script>
import { get, post } from "../../store/api";
export default {
  data() {
    return {
      form: {
        fullName: "",
        name: "",
        companyType: "company",
        chargeBy: '',
        chargeByName: '',
        legalPerson: "",
        areaName: "",
        registerDate: ""
      },
      rule: {
        fullName: [
          {
            required: true,
            message: "请输入名称",
            trigger: "change"
          }
        ],
        name: [
          {
            required: true,
            message: "请输入简称",
            trigger: "change"
          }
        ],
        /*companyType: [
          {
            required: true,
            message: "请选择类型",
            trigger: "change"
          }
        ],*/
        chargeBy: [
          {
            required: true,
            message: "请选择负责人",
            trigger: "change"
          }
        ],
        areaName: [
          {
            required: true,
            message: "请输入地址",
            trigger: "change"
          }
        ],
        registerDate: [
          {
            required: true,
            message: "请输入注册日期",
            trigger: "change"
          }
        ]
      },
      types: [
          {
              text: '客户',
              value: 'company'
          }
      ],
      charges: []
    };
  },
  mounted() {
    this.getPeople();
  },
  methods: {
      back() {
          this.$router.back()
      },
      getPeople() {
          this.form.chargeBy = ''
          this.form.chargeByName = ''
          get(`/api/sysmgr-web/user/get-platform-users?platformType=console-company`).then(data => {
              console.log(data)
              this.charges = data
          })
      },
      getName() {
          this.charges.forEach(e => {
              if(e.id == this.form.chargeBy) {
                  this.form.chargeByName = e.name
              }
          })
      },
      submit() {
          this.$refs['form'].validate((valid) => {
              if(valid) {
                  post('/api/sysmgr-web/company/add-company', this.form).then(() => {
                      this.$message({
                          type: 'success',
                          message: '添加成功！'
                      })
                      this.back()
                  })
              }
          })
      }
  }
};
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
  background-color: #fff;
}
.form_input {
  width: 500px;
}
.tool {
  margin: 20px 0;
}
</style>