<template>
    <div>
        <contract-info :contractModel="contractModel"></contract-info>
        <div class="widget-box bg-white">
            <div class="widget-header">
                <h4 class="widget-title">合同附件管理</h4>
            </div>
            <div class="widget-body">
                <div class="widget-main" style="font-size: 16px;line-height: 30px;">
                    <div class="row" style="margin-bottom: 15px;">
                        <div class="col-xs-2"><span class="text-danger">*</span>请选择合同附件处理方式</div>
                        <div class="col-xs-10">
                            <el-radio v-model="contractForm.approveType" label="standard">不需要修改合同附件</el-radio>
                            <el-radio v-model="contractForm.approveType" label="partial">需要合同补充协议</el-radio>
                            <el-radio v-model="contractForm.approveType" label="customer">需要独立合同附件</el-radio>
                        </div>
                    </div>
                    <hr>
                    <div v-if="contractForm.approveType === 'partial'">
                        <div v-for="(formItem, key) in contractForm.contracts" :key="key">
                            <div class="row" style="margin-bottom: 15px;">
                                <div class="col-xs-4">
                                    <div style="padding:20px;">
                                        <el-upload class="form_input" :action="`/api/econtract/template/parsefile`" :auto-upload="false" :on-change="upload" :on-remove="remove" :on-preview="handlePreview" :multiple="false" :show-file-list="false">
                                            <span style="margin-right:10px;">{{ formItem.serviceCompanyName }}</span>
                                            <el-button size="small" type="primary" @click="index = key">上传附件</el-button>
                                        </el-upload>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <el-table :data="formItem.partialAttachments">
                                        <el-table-column label="附件类型">
                                            <template slot-scope="scope">
                                                {{scope.row.targetType == 'customerContact' ? '系统附件' : '补充附件'}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="文件名称" prop="displayname"></el-table-column>
                                        <el-table-column label="操作">
                                            <template slot-scope="scope">
                                                <el-button type="text" size="medium" style="padding:0;" @click="handleDownload(scope.row.downloadCode)">下载</el-button>
                                                <el-button type="text" size="medium" style="padding:0;" v-if="scope.row.targetType == 'contractUserAttach'" @click="handleRemove(scope.row, key)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                            <hr v-if="key+1 != contractForm.contracts.length">
                        </div>
                    </div>
                    <div v-if="contractForm.approveType === 'customer'">
                        <div v-for="(formItem, key) in contractForm.contracts" :key="key">
                            <div class="row" style="margin-bottom: 15px;">
                                <div class="col-xs-4">
                                    <div style="padding:20px;">
                                        <el-upload class="form_input" :action="`/api/econtract/template/parsefile`" :auto-upload="false" :on-change="upload" :on-remove="remove" :on-preview="handlePreview" :multiple="false" :show-file-list="false">
                                            <span style="margin-right:10px;">{{ formItem.serviceCompanyName }}</span>
                                            <el-button size="small" type="primary" @click="index = key">上传附件</el-button>
                                        </el-upload>
                                    </div>
                                </div>
                                <div class="col-xs-8">
                                    <el-table :data="formItem.customerAttachments">
                                        <el-table-column label="附件类型">
                                            <template slot-scope="scope">
                                                {{scope.row.targetType == 'customerContact' ? '系统附件' : '补充附件'}}
                                            </template>
                                        </el-table-column>
                                        <el-table-column label="文件名称" prop="displayname"></el-table-column>
                                        <el-table-column label="操作">
                                            <template slot-scope="scope">
                                                <el-button type="text" size="medium" style="padding:0;" @click="handleDownload(scope.row.downloadCode)">下载</el-button>
                                                <el-button type="text" size="medium" style="padding:0;" v-if="scope.row.targetType == 'contractUserAttach'" @click="handleRemove(scope.row, key)">删除</el-button>
                                            </template>
                                        </el-table-column>
                                    </el-table>
                                </div>
                            </div>
                            <hr v-if="key+1 != contractForm.contracts.length">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div style="margin:20px 0;">
            <el-button size="small" type="primary" @click="submit">确认</el-button>
            <el-button size="small" @click="backToList('list')">返回</el-button>
        </div>
    </div>
</template>

<script>
import ContractModel from '../../model/contract/newContract/ContractModel'
import _ from 'lodash'
import { baseUrl } from '../../config/address.js';
import { post, importPost } from "../../store/api";
import contractInfo from './components/detail/contractInfo.vue'

export default {
  name: "detail",
  data () {
    return {
      contractModel: new ContractModel(),
      contractForm: '',
      index: ''
    }
  },
  components: {
      contractInfo
  },
  created () {
    let id = this.$route.query.id;
    this.contractModel.contractId = id;
    this.contractModel.getContractDetail(id, () => {
      this.contractForm = this.contractModel.contractForm
    })
  },
  methods: {
    backToList (path) {
      this.$router.replace({
        path: path
      })
    },
    handleDownload (downloadCode) {
      window.location.href = baseUrl + '/api/contract-web/file/download' +
        '?downloadCode=' + downloadCode;
    },
    handleRemove (row, key) {
      if (this.contractForm.approveType == 'partial') {
        this.contractModel.contractForm.contracts[key].partialAttachments = this.contractModel.contractForm.contracts[key].partialAttachments.filter(function (val) {
          return val.refId != row.refId
        })
      }
      if (this.contractForm.approveType == 'customer') {
        this.contractModel.contractForm.contracts[key].customerAttachments = this.contractModel.contractForm.contracts[key].customerAttachments.filter(function (val) {
          return val.refId != row.refId
        })
      }
    },
    upload (file) {
      let formData = new FormData();
      formData.append('targetType', 'vci_attach');
      formData.append('fileName', file.name);
      formData.append('file', file.raw);
      importPost('/api/contract-web/file/upload', formData, true).then(data => {
        if (this.contractForm.approveType == 'partial') {
          this.contractModel.contractForm.contracts[this.index].partialAttachments.push({
            refId: data.referId,
            downloadCode: data.downloadCode,
            displayname: data.fileName,
            targetType: 'contractUserAttach',
            targetTypeName: '自定义附件'
          });
        }
        if (this.contractForm.approveType == 'customer') {
          this.contractModel.contractForm.contracts[this.index].customerAttachments.push({
            refId: data.referId,
            downloadCode: data.downloadCode,
            displayname: data.fileName,
            targetType: 'contractUserAttach',
            targetTypeName: '自定义附件'
          });
        }
        this.$message({
          type: 'success',
          message: '上传成功！'
        })
      })
    },
    submit () {
        if (this.contractForm.approveType == 'standard') {
            // this.contractModel.workflowType = 'create_sale_contract';
            let workflowType = 'create_sale_contract'
            if (this.contractModel.workflowType === 'add_ns_sale_contract') {
                workflowType = 'add_sale_contract'
            }
            if (this.contractModel.workflowType === 'add_sale_contract') {
                workflowType = 'add_sale_contract'
            }
            if (this.contractModel.workflowType === 'update_ns_sale_contract') {
                workflowType = 'update_sale_contract'
            }
            if (this.contractModel.workflowType === 'update_sale_contract') {
                workflowType = 'update_sale_contract'
            }
            // this.submitContract(this.contractModel.workflowType)
            this.submitContract(workflowType)
        }
        if (this.contractForm.approveType == 'partial' || this.contractForm.approveType == 'customer') {
            // this.contractModel.workflowType = 'create_ns_sale_contract';
            let workflowType = 'create_ns_sale_contract'
            if (this.contractModel.workflowType === 'update_sale_contract') {
                workflowType = 'update_ns_sale_contract'
            }
            if (this.contractModel.workflowType === 'add_sale_contract') {
                workflowType = 'add_ns_sale_contract'
            }
            if (this.contractModel.workflowType === 'add_ns_sale_contract') {
                workflowType = 'add_ns_sale_contract'
            }
            if (this.contractModel.workflowType === 'update_ns_sale_contract') {
                workflowType = 'update_ns_sale_contract'
            }
            this.submitContract(workflowType);
        }
    },
    submitContract (workflowType) {
      let url = '/api/opencrm/workflow/save_submit';
      let param = {
        datas: this.contractModel.contractForm,
        instanceId: this.contractModel.contractId,
        workflowType: workflowType
      };
      post(url, param).then(result => {
        this.$alert('您的合同表单已提交，谢谢！', '', {
          confirmButtonText: '确定',
          callback: action => {
            this.backToList('list')
          }
        });
      })
    }
  }
}
</script>

<style scoped>
h4.block {
    margin: 10px 0 16px;
}
</style>
