<template>
  <div>
    <contract-info
      :contract-form="contractForm"
      :contract-tpl-list="contractTplList"
    />
    <contract-annex 
      :contract-form="contractForm"
    />
    <auditOption
      :contract-form="contractForm"
      :edit-type="editType" 
    />
    <div
      style="margin:20px 0;"
      v-if="contractForm.status == 'init'"
    >
      <el-button
        size="small"
        type="primary"
        @click="toDetail(contractForm.id, 'watch')"
      >
        送审
      </el-button>
      <el-button
        size="small"
        type="info"
        @click="toCreate(contractForm.id)"
      >
        编辑
      </el-button>
      <el-button
        size="small"
        type="danger"
        @click="closeContract(contractForm.id)"
      >
        删除
      </el-button>
      <el-button
        size="small"
        @click="backToList"
      >
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
        this.optionModel.getContractTplList()
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
            window.location.href = baseUrl + '/api/contract-web/contract/download-sales-flow-attachments?salesInstanceId=' + this.contractModel.contractId
        },
        toDetail(id, type) {
            this.$router.push({
                path: 'detail',
                query: {
                    id: id,
                    editType: type
                }
            })
        },
        toCreate(id, type) {
            const editType = {
                create_sale_contract: 'create',
                create_ns_sale_contract: 'create',
                add_sale_contract: 'create_add',
                add_ns_sale_contract: 'create_add',
                update_sale_contract: 'create_change',
                update_ns_sale_contract: 'create_change',
                agent_create_sale_contract: 'create',
                agent_add_sale_contract: 'create_add',
                agent_update_sale_contract: 'create_change',
                agent_create_ns_sale_contract: 'create',
                agent_add_ns_sale_contract: 'create_add',
                agent_update_ns_sale_contract: 'create_change',
            }
            this.$router.push({
                path: editType[type],
                query: {
                    id: id,
                    editType: type
                }
            })
        },
        closeContract(id) {
            showConfirm({
                msg: '确认关闭合同？',
                confirmCallback: () => {
                    post('/api/opencrm/workflow/delete', {
                        id: id,
                        memo: ''
                    }).then(result => {
                        showNotify('success', '删除成功')
                        this.getList()
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
