<template lang="html">
  <div class="invite-box">
    <h1>填写企业信息</h1>
    <div class="content">
      <el-form class="invite-form" label-width="350px" ref="invite-form" :model="form.data" :rules="check.rules">
        <div class="form-box">
          <h2>企业信息</h2>
          <el-form-item label="企业名称" prop="customerName">
            <el-input placeholder="请填写" v-model="form.data.customerName"></el-input>
          </el-form-item>
          <el-form-item label="企业地址" prop="areaName">
            <el-input placeholder="省市区地址" v-model="form.data.areaName"></el-input>
          </el-form-item>
          <el-form-item label="法定代表人" prop="customLegalPerson">
            <el-input placeholder="请填写" v-model="form.data.customLegalPerson"></el-input>
          </el-form-item>
          <el-form-item label="企业负责人">
            <el-input placeholder="请填写" v-model="form.data.companyChargeName"></el-input>
          </el-form-item>
          <el-form-item label="负责人手机">
            <el-input placeholder="请填写" v-model="form.data.companyChargePhone"></el-input>
          </el-form-item>
          <el-form-item label="负责人邮箱">
            <el-input placeholder="请填写" v-model="form.data.companyChargeMail"></el-input>
          </el-form-item>
          <el-form-item label="负责人地址">
            <el-input placeholder="地址" v-model="form.data.customCollectorAddr"></el-input>
          </el-form-item>
        </div>
        <div class="form-box">
          <h2>企业开票信息</h2>
          <el-form-item label="开票企业名称" prop="invoiceCompanyName">
            <el-input placeholder="请填写" v-model="form.data.invoiceCompanyName" @focus="focusInvoiceCompanyName"></el-input>
          </el-form-item>
          <el-form-item label="开票企业地址" prop="invoiceAddress">
            <el-input placeholder="省市区地址" v-model="form.data.invoiceAddress" @focus="focusAreaName"></el-input>
          </el-form-item>
          <el-form-item label="纳税人识别号" prop="customTaxIdcd">
            <el-input placeholder="请填写" v-model="form.data.customTaxIdcd"></el-input>
          </el-form-item>
          <el-form-item label="企业电话" prop="customPhone">
            <el-input placeholder="请填写" v-model="form.data.customPhone"></el-input>
          </el-form-item>
          <el-form-item label="开户银行" prop="customBankName">
            <el-input placeholder="请填写" v-model="form.data.customBankName"></el-input>
          </el-form-item>
          <el-form-item label="银行账号" prop="customBankAccount">
            <el-input placeholder="请填写" v-model="form.data.customBankAccount"></el-input>
          </el-form-item>
          <el-form-item label="发票类型" prop="invoiceType">
              <el-select v-model="form.data.invoiceType" placeholder="请选择">
                  <el-option v-for="(item,key) in invoiceTypeList" :key="key" :label="item.text" :value="item.value"></el-option>
              </el-select>
          </el-form-item>
        </div>
        <div class="form-box" style="padding-bottom: 30px;">
          <h2>其他信息</h2>
          <el-form-item label="从事行业类型" prop="contractType">
              <el-select v-model="form.data.contractType" placeholder="请选择">
                  <el-option v-for="(item, key) in industryTypeList"
                             :key="key"
                             :label="item.text"
                             :value="item.value">
                  </el-option>
              </el-select>
          </el-form-item>
          <el-form-item label="从事行业" prop="customIndustry">
            <el-input placeholder="请填写" v-model="form.data.customIndustry"></el-input>
          </el-form-item>
            <el-form-item prop="serviceType" label-width="0px">
                <p style="text-align:left;font-size:36px;margin:0 0 15px;color:#606266;"><span style="color:#f56c6c;margin-right:4px;">*</span>服务类型</p>
                <el-checkbox-group v-model="form.data.serviceType">
                    <el-checkbox v-for="(item, key) in serviceTypeList"
                                 :key="key" :label="item.serviceId">{{item.serviceName}}
                    </el-checkbox>
                </el-checkbox-group>
            </el-form-item>
          <el-form-item label="预计月流水" prop="expectedMonthlyFlow">
            <el-input placeholder="请填写" v-model="form.data.expectedMonthlyFlow"></el-input>
          </el-form-item>
          <el-form-item label="预计3万以上比例" prop="expectedProportion">
            <el-input placeholder="数字%" v-model="form.data.expectedProportion"></el-input>
          </el-form-item>
        </div>
        <el-button type="danger" @click="submit">提交</el-button>
      </el-form>
    </div>
  </div>
</template>

<script>
    import inviteForm from '../../model/contract/inviteForm'
    import Check from '../../model/contract/newContract/check'
    import { mapGetters } from 'vuex'
    import { get, post } from "../../store/api"
    import _ from 'lodash'

    export default {
        data() {
            return {
                form: new inviteForm(),
                check: new Check(),
                lock: false,
                inviteNo: '',
            }
        },
        computed: {
            ...mapGetters({
                invoiceTypeList: 'invoiceTypeList',
                industryTypeList: 'industryTypeList',
                serviceTypeList: 'serviceTypeList',
            })
        },
        methods: {
            submit() {
                this.$refs['invite-form'].validate(valid => {
                    if (valid) {
                        if (this.lock) {
                            return
                        }
                        // 上传之前处理服务类型数据
                        this.setServiceType();
                        let url = '/api/contract-web/agent-invite/submit-invitation';
                        let param = {
                            datas: this.form.data,
                            inviteNo: this.inviteNo,
                        };
                        post(url, param).then(res => {
                            this.$alert('您的合同表单已提交，谢谢！', '', {
                                confirmButtonText: '确定',
                                callback: action => {
                                    this.lock = true;
                                }
                            });
                        })
                    }
                })
            },
            focusInvoiceCompanyName(e) {
                if(!e.target.value) {
                    this.form.data.invoiceCompanyName = this.form.data.customerName
                }
            },
            focusAreaName(e) {
                if(!e.target.value) {
                    this.form.data.invoiceAddress = this.form.data.areaName
                }
            },
            getParam: function (name, url) {
                if (typeof name !== 'string') return false;
                if (!url) url = window.location.href;
                // 当遇到name[xx]时，对方括号做一下转义为 name\[xxx\]，因为下面还需要使用name做正则
                name = name.replace(/[\[\]]/g, '\\$&');
                var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
                var results = regex.exec(url);
                if (!results) return null;
                if (!results[2]) return '';
                return decodeURIComponent(results[2].replace(/\+/g, " "));
            },
            setServiceType() {
                let arr = [];
                const serviceType = this.form.data.serviceType
                this.serviceTypeList.forEach(item => {
                    serviceType.forEach(el => {
                        if (item.serviceId === el) {
                            arr.push(item)
                        }
                    })
                });
                this.form.data.serviceType = arr
            },
            request() {
                let url = '/api/contract-web/agent-invite/invitation-init-form';
                let param = {
                    inviteNo: this.inviteNo,
                };
                get(url, param).then(res => {
                    this.form.data = _.assign({}, res, this.form.data)
                })
            },
        },
        mounted() {
            this.$store.dispatch('getInvoiceTypeList');
            this.$store.dispatch('getIndustryTypeList');
            this.$store.dispatch('getServiceTypeList');
            this.inviteNo = this.getParam('inviteNo', window.location.href);
            this.request();
        }
    }
</script>

<style lang="scss">
.invite-box {
  h1 {
    font-size: 50px;
    line-height: 130px;
    text-align: center;
    margin: 0;
  }
  h2 {
    font-size: 42px;
    line-height: 50px;
    margin: 0;
    padding: 30px 50px;
    border-bottom: 1px solid #ccc;
    font-weight: normal;
      margin-bottom: 30px;
  }
  .invite-form {
    background: #f2f2f2;
    padding: 30px;
  }
  .form-box {
    background: #fff;
  }
  .el-form-item {
    padding: 8px 50px;
  }
  .el-form-item__label {
    text-align: left;
  }
  .el-input__inner {
    border: none;
    text-align: right;
  }
  .el-form-item__label,
  .el-input__inner {
    font-size: 36px;
  }
  .el-form-item__label,
  .el-form-item__content,
  .el-input__inner {
    /*height: 120px;*/
    /*line-height: 120px;*/
      padding: 23px;
  }
  .el-button {
    width: 100%;
    font-size: 36px;
    padding: 28px 20px;
    margin: 20px 0 60px;
  }
    .el-form-item__error {
        font-size: 36px;
        text-align: right;
        right: 0;
    }
    .el-form-item__content {
        text-align: right;
    }
}
.el-checkbox__label {
    font-size: 36px;
}
.el-checkbox__inner {
    width: 28px;
    height: 28px;
    margin: 20px;
}
.el-checkbox {
    margin: 10px;
}
.el-select-dropdown__item {
    font-size: 36px;
    height: 100px;
    line-height: 100px;
}
</style>
