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
        <el-form :model="form" :rules="rule" label-width="200px" ref="form" size="small">
            <el-form-item label="企业名称" prop="fullName">
                <el-input class="form_input" v-model="form.fullName"></el-input>
            </el-form-item>
            <el-form-item label="企业简称" prop="name">
                <el-input class="form_input" v-model="form.name"></el-input>
            </el-form-item>
            <!-- <el-form-item label="企业类型" prop="companyType" size="small">
                <el-select v-model="form.companyType" class="form_input" @change="getPeople">
                    <el-option v-for="e in types" :label="e.text" :value="e.value" :key="e.value"></el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item label="企业负责人" prop="chargeBy">
                <el-select v-model="form.chargeBy" class="form_input" @change="getName" filterable>
                    <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="税优地" prop="taxLandingId" v-if="form.companyType == 'provider'">
                <el-select v-model="form.taxLandingId" class="form_input">
                    <el-option v-for="e in list" :label="e.taxLandingName" :value="e.id" :key="e.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="企业地址" prop="areaName">
                <el-input class="form_input" v-model="form.areaName"></el-input>
            </el-form-item>
            <el-form-item label="注册日期" prop="registerDate">
              <el-date-picker
                  class="form_input"
                  v-model="form.registerDate"
                  type="date"
                  value-format="yyyy-MM-dd">
              </el-date-picker>
            </el-form-item>
            <el-form-item label="关联销售" prop="salesList">
                <el-button type="primary" @click="show = true">添加</el-button>
                <el-table :data="form.salesList" class="form_input">
                    <el-table-column label="姓名" prop="name"></el-table-column>
                    <el-table-column label="手机号" prop="mobilephone"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteSale(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
        </el-form>
        <el-dialog title="添加" :visible.sync="show">
            <el-form :model="queryForm" size="small" :inline="true">
                <el-form-item label="姓名/电话：">
                    <el-input v-model="queryForm.accountInfo" class="form_input200"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="queryForm.accountInfo = ''">清除</el-button>
                    <el-button type="primary" @click="query">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="result.list">
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="电话" prop="mobilephone"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" v-if="isHas(scope.row)" @click="addSale(scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page" v-show="result.total / queryForm.pageSize > 1">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="queryForm.pageSize"
                    :total="result.total"
                    @current-change="query"
                    :currentPage="queryForm.page">
                </el-pagination>
            </div>
            <span slot="footer">
                <el-button size="small" type="primary" @click="show = false">关闭</el-button>
            </span>
        </el-dialog>
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
          registerDate: "",
          salesList: []
        },
        queryForm: {
          accountInfo: '',
          pageSize: 5,
          page: 1
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
        charges: [],
        show: false,
        result: {}
      };
    },
    mounted() {
      this.getPeople();
      this.query();
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
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.queryForm.page = a
            post('/api/sysmgr-web/user/list', this.queryForm).then(data => {
                this.result = data
            })
        },
        addSale(a) {
            this.form.salesList.push(a)
        },
        isHas(a) {
            var arr = []
            arr = this.form.salesList.filter(e => {
                return e.id == a.id
            })
            return !arr.length
        },
        deleteSale(a) {
            console.log(a)
            this.form.salesList.splice(a, 1)
        },
        submit() {
            this.$refs['form'].validate((valid) => {
                if(valid) {
                    var form = JSON.parse(JSON.stringify(this.form))
                    if(form.salesList) {
                        var salesList = []
                        form.salesList.forEach(e => {
                            salesList.push({
                                id: e.id,
                                name: e.name,
                                mobilephone: e.mobilephone
                            })
                        })
                        form.salesList = salesList
                    }
                    post('/api/sysmgr-web/company/add-company', form).then(() => {
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
.form_input200 {
  width: 200px;
}
.tool {
  margin: 20px 0;
}
.page {
  margin-top: 30px;
  display: flex;
  justify-content: space-around;
}
</style>