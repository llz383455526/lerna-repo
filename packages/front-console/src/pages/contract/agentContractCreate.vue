<template>
  <div class="r_main">
    <div class="title">
      基本信息
    </div>
    <el-form
      class="form"
      :model="form"
      :rules="rules"
      label-width="120px"
      size="small"
      :disabled="isLook"
      ref="form"
    >
      <el-form-item label="生效月份">
        {{ form.versionStartDate.substr(5, 2) }}
      </el-form-item>
      <el-form-item
        label="代理商名称"
        prop="companyId"
      >
        <el-select
          class="form_input"
          v-model="form.companyId"
          @change="companyChange"
          :disabled="(id || isLook) ? true : false "
          filterable
        >
          <el-option
            v-for="e in agentList"
            :key="e.companyId"
            :label="e.companyName"
            :value="e.companyId"
          />
        </el-select>
      </el-form-item>
      <el-form-item
        label="渠道经理"
        required
      >
        <el-input
          class="form_input"
          v-model="chargeByName"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item
        label="代理期限"
        prop="agentStart"
      >
        <el-date-picker
          :disabled="isLook"
          class="form_input"
          v-model="form.agentStart"
          type="daterange"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
        />
      </el-form-item>
      <el-form-item
        label="落地公司"
        prop="quoteFeeContent.serviceCompanyRateList[0].serviceCompanyId"
      >
        <div
          v-for="(e, i) in form.quoteFeeContent.serviceCompanyRateList"
          :key="i"
          class="mb20"
        >
          <el-select
            v-model="form.quoteFeeContent.serviceCompanyRateList[i].serviceCompanyId"
            filterable
            class="w400"
            @change="getCompanyName(i)"
          >
            <el-option
              v-for="ev in filterCompanyList(i)"
              :key="ev.companyId"
              :value="ev.companyId"
              :label="ev.name" 
            />
          </el-select>
          <el-button
            type="text"
            v-if="i == form.quoteFeeContent.serviceCompanyRateList.length - 1"
            @click="addCompany"
          >
            添加
          </el-button>
          <el-button
            type="text"
            v-if="i"
            @click="deleteCompany(i)"
          >
            删除
          </el-button>
        </div>
      </el-form-item>
      <el-form-item label="申请主体">
        {{ form.agentTypeName }}
      </el-form-item>
      <el-form-item
        label="报价规则"
        prop="quoteRule"
      >
        <el-radio
          v-for="e in ruleList"
          v-model="form.quoteRule"
          :key="e.value"
          :label="e.value"
        >
          {{ e.text }}
        </el-radio>
        <i
          class="el-icon-question ml10"
          title="结算规则：按高于结算费率的部分结算   返佣规则：按返佣费率直接返佣"
        />
      </el-form-item>
      <el-form-item
        label="渠道预收比例"
        prop="quoteFeeContent.prepayRate"
      >
        <el-input
          class="form_input"
          v-model="form.quoteFeeContent.prepayRate"
        >
          <template slot="append">
            %
          </template>
        </el-input>
      </el-form-item>
      <el-form-item
        label="结算费率"
        prop="check"
      >
        <contract-close-item
          @result="result"
          :form="form"
          :init-check="true"
          ref="contract"
        />
      </el-form-item>
      <!-- {{form.quoteFeeContent}} -->
      <el-form-item
        label="结算方式"
        prop="settleCheck"
      >
        <settle-item
          @result="settleResult"
          :form="form"
          :init-check="true"
          ref="settle" 
        />
      </el-form-item>
    </el-form>
    <div class="title">
      合同文件
    </div>
    <el-upload
      :disabled="isLook"
      class="upload-demo ml20"
      :action="uploadUrl"
      :on-error="handleError"
      :before-upload="handleBeforeUpload"
      :http-request="handleHttpRequest"
      multiple
      accept=".docx, .xlsx, .xls"
      :show-file-list="false"
      :file-list="fileList"
    >
      <el-button
        size="small"
        type="primary"
      >
        点击上传
      </el-button>
    </el-upload>
    <el-table
      class="table"
      :data="form.attachments"
    >
      <el-table-column
        label="文件名称"
        prop="displayname" 
      />
      <el-table-column
        label="上传时间"
        prop="createTime" 
      />
      <el-table-column
        label="操作人"
        prop="createByName"
      />
      <el-table-column label="操作">
        <template slot-scope="scope">
          <a
            :href="`/api/contract-web/file/download?downloadCode=${scope.row.downloadCode}`"
            target="_bank"
          >
            <el-button type="text">下载</el-button>
          </a>
          <el-button
            type="text"
            @click="deleteFile(scope.$index)"
            v-if="!isLook"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="fr">
      <el-button
        size="small"
        @click="$router.back()"
        v-if="!isLook"
      >
        取消
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="save"
        v-if="!isLook"
      >
        保存
      </el-button>
      <el-button
        size="small"
        type="primary"
        @click="$router.back()"
        v-if="isLook"
      >
        返回
      </el-button>
    </div>
  </div>
</template>
<script>
import { get, post, formPost } from "../../store/api";
import contractCloseItem from "../../pageComponent/contractCloseItem";
import settleItem from "../../pageComponent/settleItem";
import { showNotify } from '../../plugin/utils-notify';
import { contract } from 'src/api/contract';

export default {
  components: {
    contractCloseItem,
    settleItem
  },
  data() {
    return {
      form: {
        agentEnd: "",
        agentStart: "",
        attachments: [],
        companyId: "",
        companyName: "",
        quoteRule: "",
        quoteFeeContent: {
          containIncomeAmount: '',
          incomeAmount: '',
          quoteFeeRate: '',
          quoteFeeType: '',
          serviceCompanyRateList: [
            {
              feeRateContent: {
                containIncomeAmount: '',
                incomeAmount: '',
                quoteFeeRate: '',
                quoteFeeType: '',
                // stepwiseList: [  //目前用不到
                //   {
                //     endAmount: '',
                //     equalsEnd: '',
                //     equalsStart: '',
                //     percent: '',
                //     sequence: '',
                //     startAmount: ''
                //   }
                // ]
              },
              serviceCompanyId: '',
              serviceCompanyName: ''
            },
          ],
          stepwiseList: [
            {
              endAmount: '',
              equalsEnd: '',
              equalsStart: '',
              percent: '',
              sequence: '',
              startAmount: ''
            }
          ],
          settleTypeList: [
            {
                startAmount: '',
                equalsStart: '',
                endAmount: '',
                equalsEnd: true,
                sequence: this.columnIndex,
                formula1: '',
                formula2: '',
                settlePeriod: ''
            }
          ]
        },
        check: '',
        settleCheck: '',
        agentTypeName: '',
        versionStartDate: ''
      },
      rules: {
        companyId: [
          { required: true, message: "请选择代理商", trigger: "blur" }
        ],
        agentStart: [
          { required: true, message: "请填写时间", trigger: "blur" }
        ],
        quoteRule: [
          { required: true, message: "请选择报价规则", trigger: "blur" }
        ],
        'quoteFeeContent.prepayRate': [
            { required: true, message: "请填写渠道预收比例", trigger: "blur" }
        ],
        'quoteFeeContent.serviceCompanyRateList[0].serviceCompanyId': [
          { required: true, message: "至少选择一个落地公司", trigger: "change" }
        ],
        check: [
          { required: true, message: "请输入正确的结算费率（大于零且最多两位小数）", trigger: "blur" }
        ],
        settleCheck: [
          { required: true, message: "请输入正确的结算费率（大于零且最多两位小数）", trigger: "blur" }
        ]
      },
      chargeByName: "",
      agentList: [],
      id: "",
      contractHisId: '',
      isLook: false,
      ruleList: [
        {
          text: "结算规则",
          value: "settle"
        },
        {
          text: "返佣规则",
          value: "rakeback"
        }
      ],
      companyList: [],
      uploadUrl: ''
    };
  },
  mounted() {
    this.contractHisId = this.$route.query.contractHisId;
    this.isLook = this.$route.query.isLook ? true : false;
    get("/api/contract-web/agent-contract/agent-company-option").then(data => {
      this.agentList = data;
    });
    get('/api/salemgt/common/service-company/list?businessed=true').then(data => {
      this.companyList = data;
    })
    this.contractHisId && this.getDetail();
    // 上传接口
    this.uploadUrl = contract.uploadUrl
  },
  methods: {
    getDetail() {
        get("/api/contract-web/agent-contract/agent-contractHis-detail", {
            contractHisId: this.contractHisId
        }).then(data => {
            for (let k in data) {
                if (k in this.form) {
                    this.form[k] = data[k];
                }
            }
            if(!this.form.quoteFeeContent) {
                this.form.quoteFeeContent = {
                  containIncomeAmount: '',
                  incomeAmount: '',
                  quoteFeeRate: '',
                  quoteFeeType: '',
                  serviceCompanyRateList: [
                    {
                      feeRateContent: {
                        containIncomeAmount: '',
                        incomeAmount: '',
                        quoteFeeRate: '',
                        quoteFeeType: ''
                      },
                      serviceCompanyId: '',
                      serviceCompanyName: ''
                    }
                  ],
                  stepwiseList: []
                }
            }
            if(!this.form.quoteFeeContent.serviceCompanyRateList || !this.form.quoteFeeContent.serviceCompanyRateList.length) {
                this.form.quoteFeeContent.serviceCompanyRateList = []
                this.addCompany()
            }
            this.form.agentStart = [this.form.agentStart, this.form.agentEnd];
            this.chargeByName = data.chargeByName;
            this.$refs['contract'].init(this.form)
            this.$refs['settle'].init(this.form)
            data.status == 20 && (this.isLook = true);
        });
    },
    companyChange() {
      this.agentList.forEach(e => {
        if (e.companyId == this.form.companyId) {
          this.chargeByName = e.chargeByName;
          this.form.companyName = e.companyName;
        }
      });
    },
    filterCompanyList(a) {
      return this.companyList.filter(e => {
        return !this.form.quoteFeeContent.serviceCompanyRateList.filter((ev, ind) => a > ind && e.companyId == ev.serviceCompanyId).length
      })
    },
    getCompanyName(a) {
      this.form.quoteFeeContent.serviceCompanyRateList[a].serviceCompanyName = this.companyList.filter(e => e.companyId == this.form.quoteFeeContent.serviceCompanyRateList[a].serviceCompanyId)[0].name
      this.form.quoteFeeContent.serviceCompanyRateList.forEach((e, i) => {
        if(a < i) {
          e.serviceCompanyId = ''
          e.serviceCompanyName = ''
        }
      })
    },
    addCompany() {
      this.form.quoteFeeContent.serviceCompanyRateList.push({
        feeRateContent: {
          containIncomeAmount: '',
          incomeAmount: '',
          quoteFeeRate: '',
          quoteFeeType: ''
        },
        serviceCompanyId: '',
        serviceCompanyName: ''
      })
    },
    deleteCompany(i) {
      this.form.quoteFeeContent.serviceCompanyRateList.splice(i, 1)
    },
    result(a) {
        console.log(a)
        this.form.check = a.check
        this.form.quoteFeeContent = a.quoteFeeContent
    },
    handleError() {
        showNotify('error', '上传失败!');
    },
    /*handleSuccess(file) {
        this.fileList.push(file.data)
        this.referArr.push(file.data.referId)
    },*/
    handleBeforeUpload(file) {
        const AllImgExt = ".docx, .xlsx, .xls";
        let extName = file.name.substring(file.name.lastIndexOf(".")).toLowerCase()
        if (AllImgExt.indexOf(extName) < 0) {
            showNotify('error', '文件类型错误')
            return false
        }

        let formData = new FormData()
        formData.append('fileName', file.name)
        formData.append('file', file);
        formData.append('contractHisId', this.contractHisId)
        this.formData = formData
    },
    handleHttpRequest() {
        formPost(this.uploadUrl, this.formData)
            .then(result => {
                this.show = false
                // this.tplList.forEach(e => {
                //     if(e.value == this.templateForm.tplAttachType) {
                //         result.tplAttachTypeName = e.text
                //     }
                // })
                // this.fileList.push(result)
                this.form.attachments.push(result)
                showNotify('success', '上传成功!')
            })
    },
    upload(a) {
      var form = new FormData();
      form.append("fileName", a.name);
      form.append("file", a.raw);
      formPost("/api/contract-web/file/upload", form).then(data => {
        this.form.attachments.push({
          displayname: data.fileName,
          downloadCode: data.downloadCode,
          refId: data.referId,
          targetType: "agent_contract_main",
          // targetTypeName: ''
          createTime: data.createTime,
          createByName: data.createByName
        });
        this.$message({
          type: "success",
          message: "上传成功！"
        });
      });
    },
    deleteFile(a) {
      this.form.attachments.splice(a, 1);
    },
    save() {
      this.$refs["form"].validate(v => {
        if (v) {
          var form = JSON.parse(JSON.stringify(this.form));
          form.agentEnd = form.agentStart[1];
          form.agentStart = form.agentStart[0];
          this.id && (form.contractId = this.id);
          post(
            `/api/contract-web/agent-contract/${this.id ? "edit" : "add"}`,
            form
          ).then(data => {
            this.$message({
              type: "success",
              message: `${this.id ? "修改" : "添加"}成功！`
            });
            this.$router.back();
          });
        }
      });
    },
    settleResult(a) {
        this.form.settleCheck = a.check
        this.form.quoteFeeContent.settleTypeList = a.quoteFeeContent.settleTypeList
        a.check === 0 && this.$refs.form.clearValidate('settleCheck')
    }
  }
};
</script>
<style scoped>
.r_main {
  padding: 30px 10px 50px;
  background-color: #fff;
}
.title {
  /* display: inline-block; */
  margin-top: 30px;
  font-weight: 700;
}
.form {
  margin-top: 20px;
}
.form_input {
  width: 450px;
}
.table {
  margin-top: 20px;
}
.mt20 {
  margin-top: 20px;
}
.fr {
  float: right;
  margin-right: 30px;
}
.el-icon-question {
  margin-right: 5px;
  color: #f56c6c;
  cursor: pointer;
}
</style>
