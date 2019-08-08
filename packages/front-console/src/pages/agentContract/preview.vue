<template>
  <div>
    <contract-info :contract-form="contractForm"
                   :contract-tpl-list="contractTplList" />
    <contract-annex :contract-form="contractForm" />
    <auditOption :contract-form="contractForm"
                 :edit-type="editType" />
    <div style="margin:20px 0;"
         v-if="contractForm.status == 'init'">
      <el-button size="small"
                 type="primary"
                 @click="toDetail">
        送审
      </el-button>
      <el-button size="small"
                 type="info"
                 @click="toCreate">
        编辑
      </el-button>
      <el-button size="small"
                 type="danger"
                 @click="closeContract">
        删除
      </el-button>
      <el-button size="small"
                 @click="backToList">
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
import optionModel from 'src/model/option/optionModel'
import ContractModel from 'src/model/agentContract/form'
import { baseUrl } from 'src/config/address.js';
import { showConfirm } from "src/plugin/utils-message"
import contractInfo from './components/preview/contractInfo.vue' // 合同业务信息补充
import auditOption from './components/preview/auditOption.vue' // 审核意见
import contractAnnex from './components/preview/contractAnnex.vue' // 合同附件管理
import { mapGetters } from 'vuex'
import { showNotify } from "src/plugin/utils-notify";

export default {
    name: "Preview",
    components: {
        auditOption,
        contractInfo,
        contractAnnex
    },
    computed: {
        ...mapGetters({
            contractTplList: 'contractTplList',
            industryTypeList: 'industryTypeList',
            serviceTypeList: 'serviceTypeList',
        }),
        contractForm() {
            return this.contractModel.contract
        },
        contractTplList() {
            return this.optionModel.contractTplList
        }
    },
    data () {
        return {
            optionModel: new optionModel(),
            contractModel: new ContractModel(),
        }
    },
    mounted () {
        let id = this.$route.query.id
        // 获取详情
        this.contractModel.getDetail(id)
        // 获取合同模板列表
        // this.optionModel.getContractTplList()
    },
    methods: {
        getText(value, list, inputKey = 'value', outputKey = 'text') {
            if (!list.length) return;
            let obj = list.find((element) => {
                return element[inputKey] == value
            });
            if (obj) {
                return obj[outputKey];
            }
        },
        backToList() {
            let path = this.$route.query.fromUrl || 'list'
            this.$router.replace({
                path: path
            })
        },
        handlePrevFile(downloadCode) {
            window.open(baseUrl + '/api/contract-web/file/pdf-scan' +
                '?downloadCode=' + downloadCode);
        },
        handleDownload(downloadCode) {
            window.location.href = baseUrl + '/api/contract-web/file/download' +
                '?downloadCode=' + downloadCode;
        },
        handleDownloadAll() {
            window.location.href = baseUrl + '/api/contract-web/agent-residence-flow/agent-residence-attachments?instanceId=' + this.contractModel.contractId
        },
        toDetail() {
            this.$router.push({
                path: 'create',
                query: {
                    instanceId: this.contractForm.id,
                    operateEnum: this.contractForm.operateEnum,
                    active: 3
                }
            })
        },
        toCreate() {
            this.$router.push({
                path: 'create',
                query: {
                    instanceId: this.contractForm.id,
                    operateEnum: this.contractForm.operateEnum
                }
            })
        },
        closeContract() {
            showConfirm({
                msg: '确认关闭合同？',
                confirmCallback: () => {
                    console.log(this.contractModel.deleteContract,this.contractForm.id)
                    this.contractModel.deleteContract(this.contractForm.id).then(() => {
                        showNotify('success', '删除成功')
                        this.backToList()
                    })
                }
            })
        }
    }
}
</script>

<style scoped>
h4.block {
  margin: 10px 0 16px;
}
.inline {
  display: inline-block;
}
</style>
