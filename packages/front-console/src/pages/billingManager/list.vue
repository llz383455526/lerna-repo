<template>
  <div style="background-color:#fff;padding:15px;">
    <div style="margin-bottom:30px;">落地公司开票信息管理</div>
    <el-form :inline="true" :model="formSearch" :rules="formSearch" ref="formSearch">
      <el-form-item label="落地公司名称" size="small" prop="companyName">
        <el-input v-model="formSearch.companyName"></el-input>
      </el-form-item>
      <el-form-item label="状态" size="small" prop="companyName">
        <el-select v-model="formSearch.status" placeholder="请选择状态">
          <el-option label="有效" value="1"></el-option>
          <el-option label="无效" value="0"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="margin-top: -4px">
        <el-button type="primary" @click="search" size="small">查询</el-button>
        <el-button @click="search" size="small">清除</el-button>
      </el-form-item>
    </el-form>
    <el-button size="small" @click="routerPush('/main/billingManager/create')">添加落地公司信息</el-button>

    <el-table :data="tableList.list" style="width: 100%;margin-top: 20px;">
      <el-table-column label="操作" width="70" fixed>
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.row.id)" type="text" size="medium" style="padding:0;">修改
          </el-button>
          <el-button @click="enabledBtnClick(scope.row)" type="text" size="medium" style="padding:0;margin-left: 0">
            {{ scope.row.status === '1' ? '禁用' : '启用' }}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column prop="name" label="状态" width="70">
        <template slot-scope="scope">
          {{ scope.row.status === '1' ? '有效' : '无效' }}
        </template>
      </el-table-column>
      <el-table-column prop="name" label="企业名称" width="220"></el-table-column>
      <el-table-column prop="taxIdcd" label="纳税人识别号" width="200"></el-table-column>
      <el-table-column prop="addr" label="企业所在地" width="500"></el-table-column>
      <el-table-column prop="payee" label="收款人"></el-table-column>
      <el-table-column prop="checker" label="复核"></el-table-column>
      <el-table-column prop="drawer" label="开票人"></el-table-column>
      <el-table-column prop="ppMaxAmount" label="普票最大限额" width="120"></el-table-column>
      <el-table-column prop="zpMaxAmount" label="专票最大限额" width="120"></el-table-column>
      <el-table-column prop="phone" label="电话" width="150"></el-table-column>
      <el-table-column prop="bankName" label="开户行" width="150"></el-table-column>
      <el-table-column prop="bankAccount" label="银行账号" width="200"></el-table-column>
      <el-table-column prop="supportSelfInvoice" label="是否支持企业自主开票" width="200"></el-table-column>
    </el-table>
    <ayg-pagination v-if="tableList.total" :total="tableList.total"
                    v-on:handleSizeChange="handleSizeChange"
                    v-on:handleCurrentChange="handleCurrentChange" :currentPage="currentPage"></ayg-pagination>
    <!-- 增加票量弹窗 s-->
    <el-dialog title="添加票量" :visible.sync="dialogAddInvoiceVisible" width="40%">
      <el-form :rules="rulesAdd" :model="formAdd" ref="formAdd">
        <div class="input-container">
          <div class="label dialog-label">发票类型<span>*</span>
          </div>
          <div class="input">
            <el-form-item prop="selectInvoiceType" size="small">
              <el-select v-model="formAdd.selectInvoiceType" placeholder="请选择发票类型">
                <el-option label="增值税专用发票" value="ZP"></el-option>
                <el-option label="增值税普通发票" value="PP"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
        <div class="input-container">
          <div class="label dialog-label">添加票量数量<span>*</span>
          </div>
          <div class="input">
            <el-form-item prop="addInvoiceAmount" size="small">
              <el-input v-model.number="formAdd.addInvoiceAmount"></el-input>
            </el-form-item>
          </div>
        </div>
        <div class="input-container">
          <div class="label dialog-label">添加备注<span>*</span>
          </div>
          <div class="input">
            <el-form-item prop="addInvoiceComment" size="small">
              <el-input type="textarea" v-model="formAdd.addInvoiceComment"></el-input>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogAddInvoiceVisible=false;" size="small">取 消</el-button>
        <el-button type="primary" @click="addInvoice('formAdd')" size="small">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 增加票量弹窗 e-->
    <!-- 领票记录弹窗 s-->
    <el-dialog title="领票记录" :visible.sync="dialogInvoicelistVisible" width="80%" @close="closeInvoiceDialog"
               :lock-scroll="true" style="margin-top:-5vh">
      <el-form :model="formSelect" ref="formSelect" :inline="true">
        <el-form-item label="状态" size="small" style="float:left;">
          <el-select v-model="formSelect.selectStatus" placeholder="请选择" @change="handleRequest()">
            <el-option label="全部" value="00"></el-option>
            <el-option label="有效" value="20"></el-option>
            <el-option label="无效" value="10"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="float:right">
          <el-button type="primary" @click="handleExcel()" size="small">导表</el-button>
        </el-form-item>
      </el-form>
      <el-table :data="tableInvoiceList.list" style="width: 100%;text-align:left;">
        <el-table-column prop="invoiceType" label="发票类型">
          <template slot-scope="scope">
            <div class="bill common" v-if="scope.row.invoiceType.indexOf('普票') > -1">普票</div>
            <div class="bill special" v-else>专票</div>
          </template>
        </el-table-column>
        <el-table-column prop="addNum" label="领票数量"></el-table-column>
        <el-table-column prop="maxNum" label="领取后票量" width="100"></el-table-column>
        <el-table-column prop="remark" label="备注"></el-table-column>
        <el-table-column prop="operatedBy" label="操作人"></el-table-column>
        <el-table-column prop="operatedTime" label="操作时间" width="200"></el-table-column>
        <el-table-column prop="statusName" label="状态"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope" v-if="scope.row.status=='20'">
            <el-button @click="handleCancel(scope.row.id)" type="text" size="medium" style="padding:0;">作废
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="padding: 20px;text-align: right;background-color: white">
        <el-pagination
          background
          v-if="tableInvoiceList.total > 10"
          @size-change="handleInvoiceSizeChange"
          @current-change="handleInvoiceCurrentChange"
          :current-page="currentInvoicePage"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="pageInvoiceSize || 10"
          layout="total, prev, pager, next, sizes, jumper"
          :total="tableInvoiceList.total">
        </el-pagination>
      </div>
    </el-dialog>
    <!-- 领票记录弹窗 e-->
  </div>
</template>

<style scoped>
  .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
    margin-left: 0;
  }

  .el-dialog__body {
    text-align: center;
  }

  .bill {
    display: inline-block;
    padding: 3px 8px;
    border-radius: 5px;
    color: #fff;
  }

  .common {
    background-color: #6BDDA2;
  }

  .special {
    background-color: #63D1F2;
  }
</style>

<script>
  import {post, get} from '../../store/api';
  import {showNotify} from '../../plugin/utils-notify';
  import {baseUrl} from '../../config/address'

  export default {
    data() {
      var phoneReg = /^[1-9]\d*$/;
      var validatenumber = (rule, value, callback) => {
        if (value == '') {
          callback(new Error('请填写票量数量'))
        } else if (!phoneReg.test(value)) {
          callback(new Error('票量数量必须为正整数'))
        } else if (value > 1000) {
          callback(new Error('票量数量不能大于1000'))
        } else {
          callback()
        }
      };
      return {
        pageSize: 10,
        pageInvoiceSize: 10,
        currentPage: parseInt(this.$route.query.page) || 1,
        currentInvoicePage: parseInt(this.$route.query.page) || 1,
        tableList: [],
        options: [],
        formSearch: {
          companyName: '',
          status: '1'
        },
        dateValue: '',
        //增加票量
        dialogAddInvoiceVisible: false,
        id: '',
        formAdd: {
          selectInvoiceType: '',
          addInvoiceAmount: '',
          addInvoiceComment: ''
        },
        rulesAdd: {
          selectInvoiceType: [
            {
              required: true,
              message: "请选择发票类型",
              trigger: "blur"
            }
          ],
          addInvoiceAmount: [
            {
              validator: validatenumber,
              trigger: "blur"
            }
          ],
          addInvoiceComment: [
            {
              required: true,
              message: "请填写备注",
              trigger: "blur"
            }
          ]
        },
        //查询记录
        dialogInvoicelistVisible: false,
        formSelect: {
          selectStatus: '20',
        },
        tableInvoiceList: []
      }
    },
    methods: {
      // 启用禁用按钮点击
      enabledBtnClick(item) {
        this.$confirm(`是否确认${item.status === '1' ? '禁用' : '启用'}？`, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          post('/api/invoice-web/service-company/change-status', {
            serviceCompanyId: item.id,
            status: item.status === '1' ? '0' : '1'
          }).then(data => {
            showNotify('success', '修改成功')
            this.requestAction({
              page: this.$route.query.page || 1,
              pageSize: this.pageSize,
            });
          })
        }).catch(() => {
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
        this.dateValue = '';
      },
      search() {
        this.currentPage = 1;
        this.requestAction({
          page: 1,
          pageSize: this.pageSize,
        });
      },
      handleSizeChange(value) {
        this.pageSize = value;
        this.currentPage = 1;
        this.requestAction({page: this.currentPage, pageSize: value,});
      },
      handleCurrentChange(value) {
        this.currentPage = value;
        if (this.currentChangeBySetting) {
          this.currentChangeBySetting = false;
          return;
        }
        this.requestAction({
          page: value,
          pageSize: this.pageSize,
        });
      },
      requestAction(pageInfo) {
        let param = {
          companyName: this.formSearch.companyName,
          page: pageInfo.page,
          pageSize: pageInfo.pageSize,
          status: this.formSearch.status
        };
        post('/api/invoice-web/service-company/qry', param).then(data => {
          data.list.forEach(item => {
            if (item) {
              if (item.addr) {
                item.addr = item.addr.replace(/\s+/g, '');
              }
            }
          })
          this.tableList = data;
        })
      },
      routerPush(val) {
        this.$router.push({path: val});
      },
      handleDelete(row) {
        if (row.ppLeftNum > 0 || row.zpLeftNum > 0) {
          showNotify('error', "仍有剩余票量不能删除");
          return false;
        }
        this.$confirm('是否确定删除该条记录?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            id: row.id,
          };
          post('/api/invoice-web/service-company/del', param).then(data => {
            showNotify('success', data);
            this.requestAction({
              page: this.$route.query.page || 1,
              pageSize: this.pageSize,
            });
          })
        })
      },
      handleEdit(id) {
        this.$router.push({
          path: '/main/billingManager/create',
          query: {
            companyId: id,
            page: this.$route.query.page
          }
        });
      },

      addInvoice(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            let param = {
              id: this.id,
              addNum: this.formAdd.addInvoiceAmount,
              invoiceType: this.formAdd.selectInvoiceType,
              remark: this.formAdd.addInvoiceComment
            };
            post('/api/invoice-web/service-company/add-num', param).then(data => {
              showNotify('success', data);

              this.$refs['formAdd'].resetFields()
              this.dialogAddInvoiceVisible = false;
              this.requestAction({
                page: this.$route.query.page || 1,
                pageSize: this.pageSize,
              });
            })
          }
        })
      },
      handleInvoiceSizeChange(value) {
        this.pageInvoiceSize = value;
        this.currentInvoicePage = 1;
        this.requestInvoiceAction({page: this.currentInvoicePage, pageSize: value,});
      },
      handleInvoiceCurrentChange(value) {
        this.currentInvoicePage = value;
        if (this.currentChangeBySetting) {
          this.currentChangeBySetting = false;
          return;
        }
        this.requestInvoiceAction({
          page: value,
          pageSize: this.pageInvoiceSize,
        });
      },
      requestInvoiceAction(pageInfo) {
        let param = {
          serviceCompanyId: this.id,
          page: pageInfo.page,
          pageSize: pageInfo.pageSize,
          status: this.formSelect.selectStatus,
        };
        post('/api/invoice-web/service-company/add-num-list', param).then(data => {
          data.list.forEach(item => {
            if (item) {
              if (item.maxNum == 0) {
                item.maxNum = '--';
              }
              if (item.invoiceType == 'ZP') {
                item.invoiceType = '专票';
              } else {
                item.invoiceType = '普票';
              }
            }
          })
          this.tableInvoiceList = data;
        })
      },
      handleRequest() {
        this.requestInvoiceAction({
          page: this.currentInvoicePage,
          pageSize: this.pageInvoiceSize,
        });
      },
      handleExcel() {
        window.location.href = baseUrl + '/api/invoice-web/service-company/export-add-num?serviceCompanyId=' + this.id
          + '&page=1'
          + '&pageSize=1'
          + '&status=' + this.formSelect.selectStatus;
      },
      closeInvoiceDialog() {
        this.formSelect.selectStatus = '20';
        this.requestAction({
          page: this.$route.query.page || 1,
          pageSize: this.pageSize,
        });
      }
    },
    activated() {
      this.requestAction({
        page: this.$route.query.page || 1,
        pageSize: this.pageSize,
      });
    },

  }
</script>
