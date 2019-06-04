<template>
    <div>
        <el-form>
            <el-form-item label="请选择合同附件处理方式">
                <el-radio-group v-model="approveType" @change="handleChange">
                    <el-radio label="standard">不需要修改合同附件</el-radio>
                    <el-radio label="partial">需要合同补充协议</el-radio>
                    <el-radio label="customer">需要独立合同附件</el-radio>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <standard :contractAttachments="form.contractAttachments" :contractId="form.contractId" v-if="approveType === 'standard'"></standard>
        <nonstandard :contractAttachments="partialAttachments" v-if="approveType === 'partial'"></nonstandard>
        <nonstandard :contractAttachments="customerAttachments" v-if="approveType === 'customer'"></nonstandard>
        <div>
            <el-button>返回</el-button>
            <el-button>保存</el-button>
            <el-button type="primary" @click="submitForm">送审</el-button>
        </div>
    </div>
</template>

<script>
import Form from 'src/model/agentContract/step3'
import standard from './standard'
import nonstandard from './nonstandard'

export default {
    components: { standard, nonstandard },
    computed: {
        standardAttachments() {
            return this.form.contractAttachments
        },
        partialAttachments() {
            return this.form.contractAttachments
        },
        customerAttachments() {
            const map = this.form.contractAttachments.map((item) => {
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
                    this.form.contractAttachments = this.standardAttachments
                    break
                case 'partial':
                    this.form.contractAttachments = this.partialAttachments
                    break
                case 'customer':
                    this.form.contractAttachments = this.customerAttachments
                    break
            }
            this.form.submitForm().then(() => {
                this.$alert('您的合同表单已提交，谢谢！', '', {
                    confirmButtonText: '确定',
                    callback: action => {
                        // this.backToList('list')
                    }
                });
            })
        },
        handleChange(ev) {
            this.form.standardEnum = ev === 'standard' ? 1 : 2
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

