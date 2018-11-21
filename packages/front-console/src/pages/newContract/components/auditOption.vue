<template>
    <el-form label-width="200px" class="contractForm">
        <el-form-item v-if="editType === 'watch'||editType === 'workflow'">
            <p>审核意见</p>
            <el-table :data="contractModel.processLogs" class="mb20">
                <el-table-column prop="actionUserName" label="名字"></el-table-column>
                <el-table-column prop="actionAt" label="时间"></el-table-column>
                <el-table-column prop="actionMemo" label="意见"></el-table-column>
            </el-table>
            <div v-if="contractModel.actions.length">
                <el-input v-model="opinion"></el-input>
                <div style="color:red;" v-if="opinion === ''">请填写审核意见</div>
            </div>
            <div class="mt10">
                <el-button v-if="contractModel.actions[0] === 'agree'"
                           @click="handleContract('agree')">审批通过</el-button>
                <el-button v-if="contractModel.actions[1] === 'reject'"
                           @click="handleContract('reject')">审批不通过</el-button>
                <el-button @click="backToList('list')">返回</el-button>
            </div>
        </el-form-item>
    </el-form>
</template>

<script>
    import { post } from "../../../store/api"
    import { showNotify } from "../../../plugin/utils-notify";
    import { showConfirm } from '../../../plugin/utils-message';
    export default {
        name: "auditOption",
        props: ['contractModel', 'editType'],
        data () {
            return {
                opinion: ''
            }
        },
        methods: {
            backToList(path) {
                this.$router.replace({
                    path: path
                })
            },
            handleContract(type) {
                if (!this.opinion) {
                    return;
                }
                showConfirm({
                    msg: '确认操作？',
                    confirmCallback: () => {
                        post('/api/opencrm/workflow/process', {
                            instanceId: this.contractModel.contractId,
                            actionType: type,
                            opinion: this.opinion
                        }).then(result => {
                            showNotify('success', '操作成功');
                            this.backToList('list')
                        })
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .contractForm {
        width: 900px;
    }
</style>