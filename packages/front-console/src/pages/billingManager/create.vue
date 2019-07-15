<template>
  <div class="bg-white p15">
    <el-form
      :model="companyForm"
      :rules="rules"
      ref="companyForm"
      label-width="200px"
      class="demo-companyForm"
    >
      <h4 class="ml50">
        企业信息
      </h4>
      <el-form-item
        label="纳税人名称"
        prop="id"
        placeholder="请输入内容"
        width="200"
      >
        <el-autocomplete
          class="inline-input"
          v-model="companyForm.name"
          :fetch-suggestions="querySearch"
          placeholder="请输入内容"
          style="width:100%;"
          @blur="calcuCompanyId"
          @select="handleSelect"
          :disabled="changeMode"
        />
      </el-form-item>
      <el-form-item
        label="纳税人识别号"
        prop="taxIdcd"
      >
        <el-input v-model="companyForm.taxIdcd" />
      </el-form-item>
      <el-form-item
        label="税盘类型"
        prop="taxType"
      >
        <el-radio-group
          v-model="companyForm.taxType"
          @change="calcuTaxType"
        >
          <el-radio label="JS">
            金税盘
          </el-radio>
          <el-radio label="SK">
            税控盘
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="普票最大限额"
            prop="ppMaxAmount"
          >
            <el-select
              v-model="companyForm.ppMaxAmount"
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                label="一千元"
                value="1000"
              />
              <el-option
                label="一万元"
                value="10000" 
              />
              <el-option
                label="十万元"
                value="100000"
              />
              <el-option
                label="一百万元"
                value="1000000" 
              />
              <el-option
                label="一千万元"
                value="10000000"
              />
              <el-option
                label="一亿元"
                value="100000000"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="普票可开张数上限" prop="ppMaxNum">
                <el-input v-model="companyForm.ppMaxNum" :maxlength="10"></el-input>
            </el-form-item>
        </el-col> -->
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item
            label="专票最大限额"
            prop="zpMaxAmount"
          >
            <el-select
              v-model="companyForm.zpMaxAmount"
              placeholder="请选择"
              style="width:100%;"
            >
              <el-option
                label="一千元"
                value="1000"
              />
              <el-option
                label="一万元"
                value="10000"
              />
              <el-option
                label="十万元"
                value="100000"
              />
              <el-option
                label="一百万元"
                value="1000000" 
              />
              <el-option
                label="一千万元"
                value="10000000"
              />
              <el-option
                label="一亿元"
                value="100000000" 
              />
            </el-select>
          </el-form-item>
        </el-col>
        <!-- <el-col :span="12">
            <el-form-item label="专票可开张数上限" prop="zpMaxNum">
                <el-input v-model="companyForm.zpMaxNum" :maxlength="10"></el-input>
            </el-form-item>
        </el-col> -->
      </el-row>
      <el-form-item
        label="企业所在地"
        prop="addr1Code"
      >
        <el-cascader
          size="large"
          :options="options"
          v-model="companyForm.addr1Code"
          @change="calcuAddr1" 
        />
      </el-form-item>
      <el-form-item
        label="详细地址"
        prop="addr2"
      >
        <el-input v-model="companyForm.addr2" />
      </el-form-item>
      <el-form-item
        label="电话"
        prop="phone"
      >
        <el-input
          v-model="companyForm.phone"
          :maxlength="13" 
        />
      </el-form-item>
      <el-form-item
        label="开户银行"
        prop="bankName"
      >
        <el-input v-model="companyForm.bankName" />
      </el-form-item>
      <el-form-item
        label="银行账号"
        prop="bankAccount"
      >
        <el-input
          v-model="companyForm.bankAccount"
          :maxlength="50"
        />
      </el-form-item>
      <el-row>
        <el-col :span="10">
          <el-form-item
            label="收款人"
            prop="payee"
          >
            <el-input
              v-model="companyForm.payee"
              :maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="复核"
            prop="checker"
            label-width="100px"
          >
            <el-input
              v-model="companyForm.checker"
              :maxlength="20"
            />
          </el-form-item>
        </el-col>
        <el-col :span="7">
          <el-form-item
            label="开票人"
            prop="drawer"
            label-width="100px"
          >
            <el-input
              v-model="companyForm.drawer"
              :maxlength="20"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item
        label="是否支持企业自主开票"
        prop="supportSelfInvoice"
      >
        <el-radio-group v-model="companyForm.supportSelfInvoice">
          <el-radio label="是">
            是
          </el-radio>
          <el-radio label="否">
            否
          </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="isShowSuccess">
        <el-form-item
          label="开票渠道"
          prop="configType"
        >
          <el-radio
            v-model="companyForm.configType"
            :label="1"
          >
            大象慧云
          </el-radio>
          <el-radio
            v-model="companyForm.configType"
            :label="2"
          >
            票加加
          </el-radio>
        </el-form-item>
        <template v-if="companyForm.configType === 1">
          <el-form-item
            label="安全凭证"
            prop="secretId"
          >
            <el-input
              class="form_input"
              v-model="companyForm.secretId" 
            />
          </el-form-item>
          <el-form-item
            label="秘钥"
            prop="secretKey"
          >
            <el-input
              class="form_input"
              v-model="companyForm.secretKey" 
            />
          </el-form-item>
          <el-form-item
            label="受理点ID"
            prop="sldId"
          >
            <el-input
              class="form_input"
              v-model="companyForm.sldId" 
            />
          </el-form-item>
          <el-form-item
            label="开票机号"
            prop="kpjh"
          >
            <el-input
              class="form_input"
              v-model="companyForm.kpjh"
            />
          </el-form-item>
        </template>
      </template>
      <el-form-item>
        <el-button
          type="primary"
          @click="submitForm('companyForm')"
        >
          保存
        </el-button>
        <el-button @click="routerPush('/main/billingManager/list')">
          取消
        </el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<style lang="scss" scoped>
  .demo-companyForm {
    width: 800px;
  }

  .line {
    text-align: center;
  }
</style>

<style>
  .el-time-spinner.has-seconds .el-time-spinner__wrapper:nth-child(2) {
    margin-left: 0;
  }

  .el-icon-question {
    margin-left: 5px;
    color: #f56c6c;
    cursor: pointer;
  }

  .is-disabled input {
    border-color: #e4e7ed !important;
  }
</style>

<script>
  import _ from 'lodash';
  import {mapGetters} from 'vuex';
  import {get, post, formPost} from "../../store/api";
  import {baseUrl} from '../../config/address';
  import {showNotify} from '../../plugin/utils-notify';
  import {regionData, CodeToText, TextToCode} from 'element-china-area-data'
  import {invoiceApi} from '../../api'

  export default {
    data() {
        // 查重
        var validateCom = async (rule, value, callback) => {
            if (value === '') {
            callback(new Error('请选择服务商名称'));
            } else {
            await get(invoiceApi.serviceDetail, {id: value}).then(res => {
                if(res.id) {
                    callback(new Error('落地公司已存在'));
                }
            })
            callback();
            }
        };
      return {
        rules: {
        //   id: [
        //     {required: true, message: '请选择服务商名称', trigger: 'blur'}
        //   ],
          id: [
            {validator: validateCom, trigger: 'blur'}
          ],
          taxIdcd: [
            {required: true, message: '请输入纳税人识别号', trigger: 'blur'}
            , {
              pattern: /(^[0-9a-zA-Z]{15,20}$)/, message: '请输入正确的纳税人识别号'
            }
          ],
          taxType: [
            {required: true, message: '请输入选择税盘类型', trigger: 'blur'}
          ],
          ppMaxAmount: [
            {required: true, message: '请输入普票最大限额', trigger: 'blur'}
          ],
          ppMaxNum: [
            {required: true, message: '请输入普票可开张数上限', trigger: 'blur'}
            , {
              pattern: /(^\d+$)/, message: '普票可开张数上限必须为数字值'
            }
          ],
          zpMaxAmount: [
            {required: true, message: '请输入专票最大限额', trigger: 'blur'}
          ],
          zpMaxNum: [
            {required: true, message: '请输入专票可开张数上限', trigger: 'blur'}
            , {
              pattern: /(^\d+$)/, message: '专票可开张数上限必须为数字值'
            }
          ],
          addr1Code: [
            {required: true, message: '请输入企业所在地', trigger: 'blur'}
          ],
          addr2: [
            {required: true, message: '请输入详细地址', trigger: 'blur'}
          ],
          phone: [{
            required: true,
            message: '请输入正确的电话',
            trigger: 'blur'
          }, {
            pattern: /(^\d+-?\d+$)/, message: '请输入正确的电话'
          }
          ],
          bankName: [
            {required: true, message: '请输入开户银行', trigger: 'blur'}
          ],
          bankAccount: [
            {required: true, message: '请输入银行账号', trigger: 'blur'}
            , {
              pattern: /(^\d+$)/, message: '银行账号必须为数字'
            }
          ],
          payee: [
            {required: true, message: '请输入收款人', trigger: 'blur'}
          ],
          checker: [
            {required: true, message: '请输入复核', trigger: 'blur'}
          ],
          drawer: [
            {required: true, message: '请输入开票人', trigger: 'blur'}
          ],
          supportSelfInvoice: [
            {required: true, message: '请选择是否支持企业自主开票', trigger: 'blur'}
          ],
          secretId:
            [
              {
                required: true,
                message: "请输入安全凭证",
                trigger: "change"
              }],
          secretKey:
            [{
              required: true,
              message: "请输入秘钥",
              trigger: "change"
            }],
          sldId:
            [{
              required: true,
              message: "请输入受理点ID",
              trigger: "change"
            }],
        //   kpjh:
        //     [{
        //       required: true,
        //       message: "请输入开票机号",
        //       trigger: "change"
        //     }
        //     ],
          configType:
            [{
              required: true,
              message: "请选择开票渠道",
              trigger: "change"
            }
            ]

        },
        formData: '',
        serviceCompaniesList: [],
        restaurants: [],
        options: regionData,
        changeMode: false,
        companyForm: {
          name: null,
          taxIdcd: null,
          taxType: null,
          ppMaxAmount: null,
          zpMaxAmount: null,
          addr1Code: null,
          addr2: null,
          phone: null,
          bankName: null,
          bankAccount: null,
          payee: null,
          checker: null,
          drawer: null,
          supportSelfInvoice: null,
          configType: 2,
          /**
           * 安全凭证
           */
          secretId: null,
          /**
           * 秘钥
           */
          secretKey: null,
          /**
           * 受理点ID
           */
          sldId: null,
          /**
           * 开票机号
           */
          kpjh: null
        },
        isShowSuccess: true
      }
    },
    methods: {
      routerPush(val) {
        this.$router.push ({
          path: val,
          query: {
            page: this.$route.query.page
          }
        });
      },
      submitForm(formName) {
        let url = '/api/invoice-web/service-company/save-update';
        let self = this;
        if (!this.changeMode) {
          this.companyForm.opr = 'add';
          _.foreach (this.serviceCompaniesList, function (value) {
            if (value['companyName'] == self.companyForm.name) {
              self.companyForm.id = value['companyId'];
              return false;
            }
          });
          if (!self.companyForm.id) {
            self.companyForm.name = '';
          }
        } else {
          this.companyForm.opr = 'upd';
        }
        this.companyForm.addr = this.companyForm.addr1 + ' ' + this.companyForm.addr2;
        this.$refs[formName].validate ((valid) => {
          if (valid) {
            if (this.companyForm.supportSelfInvoice == '是') {
              this.companyForm.supportSelfInvoice = 1;
            } else {
              this.companyForm.supportSelfInvoice = 0;
            }
            if (!this.isShowSuccess) {
              this.companyForm.secretId = null
              this.companyForm.secretKey = null
              this.companyForm.sldId = null
              this.companyForm.kpjh = null
            }

            post (url, this.companyForm).then (data => {
              showNotify ('success', data);
              this.$router.push ({path: '/main/billingManager/list'});
            });
          }
        });
      },
      calcuCompanyId() {
        let self = this;
        _.foreach (this.serviceCompaniesList, function (value) {
          if (value['companyName'] == self.companyForm.name) {
            self.companyForm.id = value['companyId'];
            return false;
          } else {
            self.companyForm.id = '';
          }
        })
      },
      calcuTaxType() {
        if (this.companyForm.taxType == 'JS') {
          this.companyForm.taxTypeName = '金税盘';
        } else if (this.companyForm.taxType == 'SK') {
          this.companyForm.taxTypeName = '税控盘';
        }
      },
      calcuAddr1() {
        if (this.companyForm.addr1Code) {
          this.companyForm.addr1 = (this.companyForm.addr1Code[0] ? CodeToText[this.companyForm.addr1Code[0]] : '') + ' ' + (this.companyForm.addr1Code[1] ? CodeToText[this.companyForm.addr1Code[1]] : '') + ' ' + (this.companyForm.addr1Code[2] ? CodeToText[this.companyForm.addr1Code[2]] : '');
        }
      },
      getOptionServiceCompanies() {
        let url = '/api/console-dlv/option/get-option-service-companies';
        let self = this;
        get (url).then (data => {
          self.serviceCompaniesList = data
          _.foreach (data, function (value, key) {
            self.restaurants[key] = {
              "value": value['companyName']
            }
          })
        })
      },
      querySearch(queryString, cb) {
        var restaurants = this.restaurants;
        var results = queryString ? restaurants.filter (this.createFilter (queryString)) : restaurants;
        // 调用 callback 返回建议列表的数据
        cb (results);
      },
      createFilter(queryString) {
        return (restaurant) => {
          return (restaurant.value.toLowerCase ().indexOf (queryString.toLowerCase ()) === 0);
        };
      },
      handleSelect() {
        this.calcuCompanyId ();
        this.$refs['companyForm'].validateField ('id')
      },
      queryDetail(id) {
        let url = '/api/invoice-web/service-company/detail';
        get (url, {id: id}).then (data => {
          Object.assign(this.companyForm, data)
          if (data.addr) {
            var addrs = data.addr.split (' ');
            if (addrs.length >= 4) {
              this.companyForm.addr1 = addrs[0] + ' ' + addrs[1] + ' ' + addrs[2];
              if (!addrs[0] || !TextToCode[addrs[0]] || !TextToCode[addrs[0]].code) {

              } else if (!addrs[1] || !TextToCode[addrs[0]][addrs[1]] || !TextToCode[addrs[0]][addrs[1]].code) {
                this.companyForm.addr1Code = new Array (TextToCode[addrs[0]].code, '', '');
              } else if (!addrs[2] || !TextToCode[addrs[0]][addrs[1]][addrs[2]] || !TextToCode[addrs[0]][addrs[1]][addrs[2]].code) {
                this.companyForm.addr1Code = new Array (TextToCode[addrs[0]].code, TextToCode[addrs[0]][addrs[1]].code, '');
              } else {
                this.companyForm.addr1Code = new Array (TextToCode[addrs[0]].code, TextToCode[addrs[0]][addrs[1]].code, TextToCode[addrs[0]][addrs[1]][addrs[2]].code);
              }
              this.companyForm.addr2 = addrs.slice (3, addrs.length).join (' ');
            } else {
              this.companyForm.addr2 = data.addr;
            }
          }
        })
      },
      getSecurityData(id) {
        get(`/api/invoice-web/service-company/exist?serviceCompanyId=${id}`).then((data) => {
          this.isShowSuccess = data
        }).catch(() => {

        })
      }
    },
    mounted() {
      this.formData = {};
      this.changeMode = false;
      this.getOptionServiceCompanies ();
      if (this.$route.query.companyId) {
        this.queryDetail(this.$route.query.companyId);
        this.changeMode = true;
        this.getSecurityData(this.$route.query.companyId)
      }
      if (this.$route.query.taxIdcd) {
        this.companyForm.taxIdcd = this.$route.query.taxIdcd;
        this.companyForm.name = this.$route.query.name;
      }
    }
  }
</script>
