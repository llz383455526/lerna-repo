<!--
@description 落地公司新增/编辑页
@author llz
@warning 该页面在落地服务商系统也有，两者的几个主要差异
    0、该页面在落地系统只有编辑功能。不能新增
    1、是否直营选择在此处是可以编辑的，在落地系统只展示不可编辑
    2、税优地选择在此处是可编辑的，在落地系统只展示不可编辑
-->
<template>
  <div class="r_main">
    <div style="margin-bottom:30px;">{{isCreateNew ? pageHeader[0] : pageHeader[1]}}</div>
    <el-card class="box-card">
      <div slot="header">
        <span>基本信息管理</span>
      </div>
      <div class="text item">
          
        <el-form :model="form" :rules="rule" label-width="400px" ref="form">
          <el-form-item label="状态" size="small">
            <el-radio v-model="form.isBusinessed" :label="true" :disabled="!isCreateNew">启用</el-radio>
            <el-radio v-model="form.isBusinessed" :label="false" :disabled="!isCreateNew">禁用</el-radio>
          </el-form-item>
          <el-form-item label="落地公司名称" prop="name" size="small">
            <el-input class="form_input" v-model="form.name" :disabled="!isCreateNew"></el-input>
          </el-form-item>
          <el-form-item label="落地公司简称" prop="shortName" size="small">
            <el-input class="form_input" v-model="form.shortName"></el-input>
          </el-form-item>
          <el-form-item label="税号" prop="taxIdcd" size="small" >
            <el-input class="form_input" v-model="form.taxIdcd" :disabled="!isCreateNew"></el-input>
          </el-form-item>
          <el-form-item label="法人姓名" prop="corporateName" size="small">
            <el-input class="form_input" v-model="form.corporateName"></el-input>
          </el-form-item>
          <!--todo add-->
          <el-form-item label="法人证件类型" prop="corporateCertType" size="small">
            <el-select class="form_input" v-model="form.corporateCertType">
                <el-option
                    v-for="item in certType"
                    :label="item.text"
                    :value="item.value"
                    :key="item.value"
                    ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="法人证件号码" prop="corporateIdentity" size="small">
            <el-input class="form_input" v-model="form.corporateIdentity"></el-input>
          </el-form-item>
          <el-form-item label="法人手机号码" prop="corporatePhone" size="small">
            <el-input class="form_input" v-model="form.corporatePhone"></el-input>
          </el-form-item>
          <el-form-item label="是否直营" prop="direct" size="small">
            <el-select v-model="form.direct" placeholder="请选择" class="form_input">
              <el-option v-for="item in directStatus" :label="item.text" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          <!--
          <el-form-item label="是否有业务（用于合同）" prop="businessed" size="small">
            <el-select v-model="form.businessed" placeholder="请选择" class="form_input">
              <el-option v-for="item in directStatus" :label="item.text" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          -->
          <el-form-item label="税优地" prop="taxLandingId" size="small">
            <el-select v-model="form.taxLandingId" class="form_input" filterable>
              <el-option v-for="e in list" :label="e.taxLandingName" :value="e.id" :key="e.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="注册状态" prop="registered" size="small">
            <el-select v-model="form.registered" placeholder="请选择" class="form_input">
              <el-option v-for="item in registeredStatus" :label="item.text" :value="item.value" :key="item.value"></el-option>
            </el-select>
          </el-form-item>
          
          <el-form-item label="对接人" prop="masterUid" size="small">
            <el-select v-model="form.masterUid" class="form_input" @change="masterVal" placeholder="请选择负责人" filterable="">
              <el-option v-for="e in charges" :value="e.id" :label="e.name" :key="e.id"></el-option>
            </el-select>
          </el-form-item>
          
        </el-form>

      </div>
    </el-card>
    <el-card>
      <div slot="header">
        <span>开票信息管理</span>
      </div>
      <div class="text item">
        <el-form :model="form" label-width="400px" :rules="rule" ref="pform">
          <el-form-item
            label="税盘类型"
            prop="taxType"
            >
                <el-radio-group
                    v-model="form.taxType"
                >
                <el-radio
                    v-for="item in taxType"
                    :label="item.value"
                    :key="item.value">
                    {{item.text}}
                </el-radio>
                </el-radio-group>
          </el-form-item>
          <el-form-item label="支持开票类型" prop="supportInvoiceTypeArr" size="small">
            <el-checkbox-group v-model="form.supportInvoiceTypeArr" disabled>
              <el-checkbox
                v-for="item in invoiceType"
                :key="item.value" 
                :label="item.value">{{item.text}}</el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-row :gutter="10" v-if="form.supportInvoiceTypeArr.join('').indexOf('PP')>-1">
            <el-col :span="14">
                <el-form-item
                    label="普票最大限额"
                    prop="ppMaxAmount">
                    <el-input
                        v-if="form.ppTaxfree"
                        v-model="form.ppMaxAmount"
                        placeholder="请输入限额">
                    </el-input>
                    <el-select
                        v-else
                        v-model="form.ppMaxAmount"
                        placeholder="请选择限额"
                        style="width:100%;"
                        filterable
                    >
                        <el-option 
                            v-for="item in MaxAmountRange" 
                            :label="item.text"
                            :value="item.value"
                            :key="item.value"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="10">
                    <el-checkbox v-model="form.ppTaxfree" @change="taxfreeChange('pp', $event)">含税限额</el-checkbox>
                </el-col>
          </el-row>
          <el-row :gutter="10" v-if="form.supportInvoiceTypeArr.join('').indexOf('ZP')>-1">
                <el-col :span="14">
                <el-form-item
                    label="专票最大限额"
                    prop="zpMaxAmount"
                >
                    <el-input
                        v-if="form.zpTaxfree"
                        v-model="form.zpMaxAmount"
                        placeholder="请输入限额">
                    </el-input>
                    <el-select
                        v-else
                        v-model="form.zpMaxAmount"
                        placeholder="请选择限额"
                        style="width:100%;"
                        filterable
                    >
                        <el-option 
                            v-for="item in MaxAmountRange" 
                            :label="item.text"
                            :value="item.value"
                            :key="item.value"
                            >
                        </el-option>
                    </el-select>
                </el-form-item>
                </el-col>
                <el-col :span="10" :gutter="5">
                    <el-checkbox v-model="form.zpTaxfree" @change="taxfreeChange('pp', $event)">含税限额</el-checkbox>
                </el-col>
            </el-row>
          <!-- 
              <el-form-item label="所在省市" prop="provinceId" size="small">
            <el-select v-model="form.provinceId" filterable placeholder="请选择" @change="provinceVal">
              <el-option v-for="item in provinceList" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
            <el-select v-model="form.cityId" filterable placeholder="请选择" @change="cityVal">
              <el-option v-for="item in cityList" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item> 
          -->
          <el-form-item label="详细地址" prop="invoiceAddr" size="small">
            <el-input class="form_input" v-model="form.invoiceAddr"></el-input>
          </el-form-item>
          
          <!-- <el-form-item label="注册日期" prop="registrationAt" size="small">
            <el-date-picker class="form_input" v-model="form.registrationAt" type="date" value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item> -->
          <el-form-item label="联系电话" prop="invoicePhone" size="small">
            <el-input class="form_input" v-model="form.invoicePhone"></el-input>
          </el-form-item>
          <el-form-item label="开户银行" prop="bankName" size="small">
            <el-input class="form_input" v-model="form.bankName"></el-input>
          </el-form-item>
          <el-form-item label="银行账号" prop="bankAccount" size="small">
            <el-input class="form_input" v-model="form.bankAccount"></el-input>
          </el-form-item>
          <el-row>
            <el-col :span="10">
                <el-form-item
                    label="收款人"
                    prop="payee"
                >
                    <el-input
                    v-model="form.payee"
                    :maxlength="20"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="5">
                <el-form-item
                    label="复核"
                    prop="checker"
                    label-width="100px"
                >
                    <el-input
                    v-model="form.checker"
                    :maxlength="20"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item
                    label="开票人"
                    prop="drawer"
                    label-width="100px"
                >
                    <el-input
                    v-model="form.drawer"
                    :maxlength="20"
                    />
                </el-form-item>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="10">
                <el-form-item
                    label="收件人"
                >
                    <el-input
                    v-model="form.collector"
                    :maxlength="20"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="5">
                <el-form-item
                    label="收件人电话"
                    label-width="100px"
                >
                    <el-input
                    v-model="form.collectorPhone"
                    :maxlength="20"
                    />
                </el-form-item>
            </el-col>
            <el-col :span="9">
                <el-form-item
                    label="收件人地址"
                    label-width="100px"
                >
                    <el-input
                    v-model="form.collectorAddr"
                    :maxlength="20"
                    />
                </el-form-item>
            </el-col>
        </el-row>
        </el-form>
      </div>
    </el-card>
    <div class="tool">
      <el-button size="small" @click="back">取消</el-button>
      <el-button size="small" type="primary" @click="submit">保存</el-button>
    </div>
  </div>
</template>
<script>
  import {get, post} from "../../store/api";
  import {mapGetters} from 'vuex';
  import _ from 'lodash'

  export default {
    data() {
			const maxAmountValidator = function func(rule, value, cb) {
				if (Number.isNaN(Number(value))) {
					cb('请输入数字')
				} else if (parseInt(value, 10) === 0) {
					cb('请输入大于0的数字')
				}
				cb()
			}
      return {
        MaxAmountRange:[],  //限额
        invoiceType:[], // 发票类型
        certType:[],    // 证件类型
        taxType:[], //税盘类型
        isCreateNew: true, //区分是新建落地，还是编辑落地
        form: {
          isBusinessed:false,
          id: "",
          name: "",
          shortName: "",
          direct: "",
          businessed: '',
          registered: '',
          supportInvoiceTypeArr: [],
          supportInvoiceType: '',
          masterUid: "",
          provinceId: "",
          cityId: "",
          invoiceAddr: "",
          taxIdcd: "",
          taxType: "", 
          registrationAt: "",
          corporateName: "",
          corporateIdentity: "",
          corporatePhone:'', // 法人手机号
          invoicePhone: "",
          bankName: "",
          bankAccount: "",
          masterName: "",
          provinceName: "",
          cityName: "",
          taxLandingId: "",
          taxLandingName: "",
          zpMaxAmount: '',
          zpTaxfree:false,  //专票是否免税
          ppMaxAmount: '',
          ppTaxfree:false,  // 普票是否免税
          collector:'',
          collectorAddr:'',
          collectorPhone: ''
        },
        charges: "",
        rule: {
            
          corporateIdentity: [
            {
              required: true,
              message: "请选择法人证件号码",
              trigger: "change"
            }],
          corporateCertType: [
            {
              required: true,
              message: "请选择法人证件类型",
              trigger: "change"
            }],
          corporateName: [
            {
              required: true,
              message: "请输入法人姓名",
              trigger: "change"
            }],
          taxIdcd: [
            {
              required: true,
              message: "请输入税号",
              trigger: "change"
            }],
          taxType: [
            {
              required: true,
              message: "请选择税盘类型",
              trigger: "change"
            }],
          name: [
            {
              required: true,
              message: "请输入名称",
              trigger: "change"
            }],
          shortName: [{
            required: true,
            message: "请输入简称",
            trigger: "change"
          }],
          direct: [{
            required: true,
            message: "请选择是否直营",
            trigger: "change"
          }],
          businessed: [{
            required: true,
            message: "请选择是否有业务",
            trigger: "change"
          }],
          registered: [{
            required: true,
            message: "请选择注册状态",
            trigger: "change"
          }],
          corporatePhone:[{
            required: true,
            message: "请输入法人手机号码",
            trigger: "change"
          }],
          supportInvoiceTypeArr: [{
            required: true,
            message: "请选择支持开票类型",
            trigger: "change"
          }],
          masterUid: [{
            required: true,
            message: "请选择负责人",
            trigger: "change"
          }],
          taxLandingId: [{
            required: true,
            message: "请选择税优地",
            trigger: "change"
          }],
          zpMaxAmount: [{
            required: true,
            message: "请选择专票限额",
            trigger: "change"
          },{
						validator: maxAmountValidator,
						trigger: 'change',
					}],
          ppMaxAmount: [{
            required: true,
            message: "请选择普票限额",
            trigger: "change"
          },{
						validator: maxAmountValidator,
						trigger: 'change',
        	}],
          invoiceAddr: [{
            required: true,
            message: "请填写详细地址",
            trigger: "change"
          }],
          invoicePhone: [{
            required: true,
            message: "请填写联系电话",
            trigger: "change"
          }],
          bankName: [{
            required: true,
            message: "请填写开户银行",
            trigger: "change"
          }],
          bankAccount: [{
            required: true,
            message: "请填写银行账号",
            trigger: "change"
          }],
          payee: [{
            required: true,
            message: "请填写收款人",
            trigger: "change"
          }],
          checker: [{
            required: true,
            message: "请填写复核人",
            trigger: "change"
          }],
          drawer: [{
            required: true,
            message: "请填写开票人",
            trigger: "change"
          }],
        },
        pageHeader: ['新建落地公司信息', '编辑落地公司信息'],
        directStatus: [
          {
            text: '是',
            value: true
          }, {
            text: '否',
            value: false
          }
        ],
        registeredStatus: [
          {
            text: '已注册',
            value: true
          }, {
            text: '未注册',
            value: false
          }
        ],
        list: [],
      };
    },
    watch: {
        // 改成watch是因为radio-group的change事件是在blur时触发
        'form.taxType':function(){
            if (this.form.taxType == 'JS') {
                this.form.taxTypeName = '金税盘';
            } else if (this.form.taxType == 'SK') {
                this.form.taxTypeName = '税控盘';
            }
        }
    },
    created() {
      if (_.isEmpty (this.provinceList)) {
        this.$store.dispatch ('getProvince')
      }

      this.form.id = this.$route.query.id;
      if (this.$route.query.id) {
        this.isCreateNew = false
        this.getData()
      }
      /**获取负责人列表 */
      get (`/api/sysmgr-web/user/get-platform-users?platformType=console-admin`).then (data => {
        this.charges = data
        this.charges.forEach (e => {
          if (e.id == this.form.chargeBy) {
            this.form.chargeByName = e.name
          }
        })
      })
      this.getList ();

      this.getEnumTypes()
    },
    computed: {
      ...mapGetters ({
        provinceList: 'provinceList',
      }),
      cityList() {
        let provinceId = this.form.provinceId

        return provinceId ? this.provinceList[provinceId].citys : []
      }
    },
    methods: {
      back() {
        this.$router.back ()
      },
      getData() {
        get (`/api/salemgt/service-company/query/details/${this.$route.query.id}`).then (data => {
          data.serviceCompanyInfo.supportInvoiceTypeArr = data.serviceCompanyInfo.supportInvoiceType.split (';');
          this.form = data.serviceCompanyInfo;
        })
      },
      getEnumTypes() {
        post ('/api/sysmgr-web/commom/options?enumTypes=InvoiceAmountType,InvoiceType,TaxType,CertType').then (data => {
          this.MaxAmountRange = data.InvoiceAmountType
          this.certType = data.CertType
					this.invoiceType = data.InvoiceType
					this.form.supportInvoiceTypeArr=[];
          data.InvoiceType.forEach((invoice) => { // 默认都选中，且不可修改
                this.form.supportInvoiceTypeArr.push(invoice.value)
            })
          this.taxType = data.TaxType
        })
      },
      submit() {
        let isValidOk = true;
        this.$refs['pform'].validate((valid) => {
            isValidOk = isValidOk && valid
        })
        this.$refs['form'].validate ((valid) => {
          isValidOk = isValidOk && valid
        })

        if(isValidOk) {
            this.form.supportInvoiceType = this.form.supportInvoiceTypeArr.join (';');
            //税优地
            this.list.forEach (r => {
              if (r.id == this.form.taxLandingId) {
                this.form.taxLandingName = r.taxLandingName;
              }
            })

            post ('/api/salemgt/service-company/save-update', this.form).then (data => {
              this.$message ({
                type: 'success',
                message: '添加成功！'
              })
              localStorage.setItem ('appId', data)
              this.$router.push ("/main/clientManager/serverManager");
            })
        }
      },
      masterVal(val) {
        this.charges.forEach (e => {
          if (e.id == val) {
            this.form.masterName = e.name
          }
        })
      },
      provinceVal(val) {
        this.form.provinceName = this.provinceList[val]['name'];
        this.form.cityId = this.cityList[0]['id'];
        this.form.cityName = this.cityList[0]['name'];
      },
      cityVal(val) {
        this.cityList.forEach (e => {
          if (e.id == val) {
            this.form.cityName = e.name
          }
        })
      },
      getList() {
        get ('/api/console-dlv/tax-landing/all-tax-landing').then (data => {
          this.list = data
        })
			},
			taxfreeChange(type) {
				switch (type) {
					case 'pp':
					{
						this.form.ppMaxAmount = ''
						break
					}
					case 'zp':
					{
						this.form.zpMaxAmount = ''
						break
					}
					default:
						console.log('not matched')
				}
    	},
    }
  };

</script>
<style scoped>
  .r_main {
    padding: 15px;
    background-color: #fff;
  }

  .form_input {
    width: 500px;
  }

  .tool {
    margin: 20px 0;
    text-align: center;
  }

  .box-card {
    margin-bottom: 20px;
  }
</style>
