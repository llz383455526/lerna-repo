<template>
  <div>
    <el-form>
      <el-form-item label="请选择合同附件处理方式">
        <el-radio-group v-model="approveType"
                        @change="handleChange">
          <el-radio label="standard">不需要修改合同附件</el-radio>
          <el-radio label="partial">需要合同补充协议</el-radio>
          <el-radio label="customer">需要独立合同附件</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <standard :contractAttachments="form.contract.datas.contractAttachments"
              :contractId="form.contract.instanceId"
              v-if="approveType === 'standard'"></standard>
    <nonstandard :contractAttachments="partialAttachments"
                 :contractId="form.contract.instanceId"
                 v-if="approveType === 'partial'"></nonstandard>
    <nonstandard :contractAttachments="customerAttachments"
                 :contractId="form.contract.instanceId"
                 v-if="approveType === 'customer'"></nonstandard>
    <div>
      <el-button @click="$router.push('list')">返回</el-button>
      <!-- <el-button @click="form.saveDraft(), $router.push('list')">保存</el-button> -->
      <el-button type="primary"
                 @click="submitForm">送审</el-button>
    </div>
  </div>
</template>

<script>
import Form from 'src/model/agentContract/form'
import standard from './standard'
import nonstandard from './nonstandard'

export default {
    components: { standard, nonstandard },
    computed: {
        standardAttachments() {
            return this.form.contract.datas.contractAttachments
        },
        partialAttachments() {
            return this.form.contract.datas.contractAttachments
        },
        customerAttachments() {
            const map = this.form.contract.datas.contractAttachments.map((item) => {
                let rObj = {}
                Object.assign(rObj, item)
                rObj.attachments = []
                return rObj
            })
            return map
        }
    },
    data() {
        return {
            form: new Form(),
            approveType: 'standard',
            instanceId: ''
        }
    },
    methods: {
        submitForm() {
            const ev = this.approveType
            switch (ev) {
                case 'standard':
                    this.form.contract.datas.contractAttachments = this.standardAttachments
                    break
                case 'partial':
                    this.form.contract.datas.contractAttachments = this.partialAttachments
                    break
                case 'customer':
                    this.form.contract.datas.contractAttachments = this.customerAttachments
                    break
            }
            this.form.submitForm().then(() => {
                this.$alert('您的合同表单已提交，谢谢！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        this.$router.push('list')
                    }
                });
            })
        },
        handleChange(ev) {
            this.form.contract.standardEnum = ev === 'standard' ? 1 : 2
        }
    },
    created() {
        this.instanceId = this.$route.query.instanceId
        if (this.instanceId) {
            this.form.getDetail(this.instanceId)
        }
    }
}
</script>

