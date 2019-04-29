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
            <el-form-item label="企业负责人电话" prop="chargeMobile">
              <el-input class="form_input" v-model="form.chargeMobile" @input="getSelect"></el-input>
            </el-form-item>
            <el-form-item label="企业负责人姓名" prop="chargeByName">
              <el-input class="form_input" v-model="form.chargeByName" :disabled="form.chargeBy ? true : false"></el-input>
            </el-form-item>
            <el-form-item label="企业负责人邮箱" prop="email">
              <el-input class="form_input" v-model="form.email" :disabled="form.chargeBy ? true : false"></el-input>
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
            <el-form-item label="客户类型" prop="originalType">
              <el-radio v-for="e in originalTypeList" v-model="form.originalType" :key="e.value" :label="e.value" @change="getOriginalTypeName">{{e.text}}</el-radio>
            </el-form-item>
            <template v-if="form.originalType == 20">
              <el-form-item label="代理商名称" prop="agentCompanyId">
                <el-select v-model="form.agentCompanyId" style="width:500px;" filterable @change="companyChange">
                    <el-option v-for="e in agentList" :key="e.companyId" :label="e.companyName" :value="e.companyId"></el-option>
                </el-select>
              </el-form-item>
            </template>
            <el-form-item label="客户归属" prop="original">
              <el-radio v-for="e in originals" v-model="form.original" :key="e.value" :label="e.value" @change="getOriginalName">{{e.text}}</el-radio>
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
            <el-form-item label="关联交付" prop="deliverList">
                <el-button type="primary" @click="deliverShow = true">添加</el-button>
                <el-table :data="form.deliverList" class="form_input">
                    <el-table-column label="姓名" prop="name"></el-table-column>
                    <el-table-column label="手机号" prop="mobilephone"></el-table-column>
                    <el-table-column label="操作">
                        <template slot-scope="scope">
                            <el-button type="text" @click="deleteDeliver(scope.$index)">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form-item>
            <el-form-item label="企业审核人" prop="companyAuditor">
                <el-input class="form_input" v-model="form.companyAuditor"></el-input>
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
        <!-- 添加交付 -->
        <el-dialog title="添加" :visible.sync="deliverShow">
            <el-form :model="deliverForm" size="small" :inline="true">
                <el-form-item label="姓名/电话：">
                    <el-input v-model="deliverForm.accountInfo" class="form_input200"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button @click="deliverForm.accountInfo = ''">清除</el-button>
                    <el-button type="primary" @click="deliverQuery">查询</el-button>
                </el-form-item>
            </el-form>
            <el-table :data="deliverResult.list">
                <el-table-column label="姓名" prop="name"></el-table-column>
                <el-table-column label="电话" prop="mobilephone"></el-table-column>
                <el-table-column label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="mini" v-if="isHas_1(scope.row)" @click="addDeliver(scope.row)">添加</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="page" v-show="deliverResult.total / deliverForm.pageSize > 1">
                <el-pagination
                    background
                    layout="prev, pager, next"
                    :page-size="deliverForm.pageSize"
                    :total="deliverResult.total"
                    @current-change="deliverQuery"
                    :currentPage="deliverForm.page">
                </el-pagination>
            </div>
            <span slot="footer">
                <el-button size="small" type="primary" @click="deliverShow = false">关闭</el-button>
            </span>
        </el-dialog>
    </div>
</template>
<script>
import { get, post } from "../../store/api";
import { mapGetters } from 'vuex'
import { sysmgr } from "src/api"
export default {
    computed: {
      ...mapGetters({
          agentList: 'agentList',
        })
    },
    data() {
      return {
        form: {
          fullName: "",
          name: "",
          companyType: "company",
          chargeBy: '',
          chargeByName: '',
          chargeMobile: '',
          email: '',
          legalPerson: "",
          areaName: "",
          registerDate: "",
          salesList: [],
          originalType: '',
          originalTypeName: '',
          companyAuditor: '',
          agentCompanyId: '',
          deliverList: []
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
          chargeMobile: [
            {
              required: true,
              message: "请填写手机号码",
              trigger: "change"
            },
            {pattern: /^(1\d{10})$/, message: '请正确输入手机号码', trigger: 'blur'}
          ],
          chargeByName: [
            {
              required: true,
              message: "请填写姓名",
              trigger: "change"
            }
          ],
          email: [
            {
              required: true,
              message: "请填写邮箱",
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
          ],
          originalType: [
            {
              required: true,
              message: "请选择客户类型",
              trigger: "change"
            }
          ],
          original: [
            {
              required: true,
              message: "请选择客户归属",
              trigger: "change"
            }
          ],
          agentCompanyId: [
            { required: true, message: '请选择代理商', trigger: 'change' }
          ],
        },
        types: [
            {
                text: '客户',
                value: 'company'
            }
        ],
        charges: [],
        show: false,
        result: {},
        originals: [],
        originalTypeList: [],
        deliverShow: false,
        deliverForm: {
            accountInfo: '',
            relationKeyList: ['DeliverUserRelation'],
            page: 1,
            pageSize: 5
        },
        deliverResult: {}
      };
    },
    mounted() {
      this.getPeople();
      this.query();
      this.deliverQuery()
      get('/api/sysmgr-web/commom/option?enumType=CustomOriginal').then(data => {
        this.originals = data
      })
      get('/api/sysmgr-web/commom/option?enumType=OriginalType').then(data => {
          this.originalTypeList = data
      })
      this.$store.dispatch('getAgentList')
    },
    methods: {
        companyChange(companyId) {
          if (!companyId || !this.agentList.length) return;
          let obj = this.agentList.find(element => {
              return element.companyId === companyId;
          });
          // this.chargeByName = obj.chargeByName;
        },
        getOriginalTypeName() {
          this.originalTypeList.forEach(e => {
            if(this.form.originalType == e.value) {
              this.form.originalTypeName = e.text
            }
          })
        },
        back() {
            this.$router.back()
        },
        getOriginalName() {
          var arr = this.originals.filter(e => e.value == this.form.original)
          arr.length && (this.form.originalName = arr[0].text)
        },
        getPeople() {
            this.form.chargeBy = ''
            this.form.chargeByName = ''
            get(`/api/sysmgr-web/user/get-platform-users?platformType=console-company`).then(data => {
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
        getSelect() {
          if(/^(1\d{10})$/.test(this.form.chargeMobile)) {
            get('/api/sysmgr-web/user/get-user-by-mobile', {
              mobile: this.form.chargeMobile
            }, true).then(data => {
              this.form.chargeBy = data.id || ''
              this.form.chargeByName = data.name || ''
              this.form.email = data.email || ''
              if(this.form.chargeBy) {
                this.rule.chargeByName = ''
                this.rule.email = ''
              }
              else {
                this.rule.chargeByName = [{ required: true, message: "请填写姓名", trigger: "change" }]
                this.rule.email = [{ required: true, message: "请填写邮箱", trigger: "change" }]
              }
              this.$nextTick(() => {
                this.$refs.form.clearValidate(['chargeByName', 'email'])
              })
            })
          }
        },
        query(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.queryForm.page = a
            post('/api/sysmgr-web/commom/user-list', this.queryForm).then(data => {
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
            this.form.salesList.splice(a, 1)
        },
        deliverQuery(a) {
            if(isNaN(a)) {
                a = 1
            }
            this.deliverForm.page = a
            post(sysmgr.relationGroupEmployeeList, this.deliverForm).then(data => {
                this.deliverResult = data
                this.deliverResult.list.forEach(e => {
                    e.id = e.userId
                })
            })
        },
        addDeliver(a) {
            this.form.deliverList.push(a)
        },
        isHas_1(a) {
            var arr = []
            arr = this.form.deliverList.filter(e => {
                return e.id == a.id
            })
            return !arr.length
        },
        deleteDeliver(a) {
            this.form.deliverList.splice(a, 1)
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
              if(form.deliverList) {
                  var deliverList = []
                  form.deliverList.forEach(e => {
                      deliverList.push({
                          id: e.id,
                          name: e.name,
                          mobilephone: e.mobilephone
                      })
                  })
                  form.deliverList = deliverList
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