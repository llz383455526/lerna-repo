<template>
  <div>
    <div class="widget-box bg-white"
         style="margin-top:20px;">
      <div class="widget-header">
        <h4 class="widget-title">
          审核意见
        </h4>
      </div>
      <div class="widget-body">
        <div class="widget-main"
             style="font-size: 16px;line-height: 30px;">
          <el-table :data="contractForm.processLogs"
                    class="mb20">
            <el-table-column prop="actionUserName"
                             label="审核人姓名" />
            <el-table-column prop="actionAt"
                             label="审核时间" />
            <el-table-column prop="actionMemo"
                             label="审核意见" />
            <el-table-column label="当前处理"
                             prop="actionUserName" />
            <el-table-column label="审核方"
                             prop="serviceCompanyName" />
          </el-table>
          <div v-if="contractForm.actions.length">
            <el-input type="textarea"
                      v-model="opinion" />
            <div style="color:red;"
                 v-if="opinion === ''">
              请填写审核意见
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="mt20 mb20"
         v-if="contractForm.status != 'init'">
      <el-button size="small"
                 type="primary"
                 v-if="contractForm.actions[0] === 'agree'"
                 @click="handleContract('agree')">
        审批通过
      </el-button>
      <el-button size="small"
                 type="danger"
                 v-if="contractForm.actions[1] === 'reject'"
                 @click="handleContract('reject')">
        审批不通过
      </el-button>
      <el-button size="small"
                 @click="backToList('list')">
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
import {post} from "src/store/api"
import {showNotify} from "src/plugin/utils-notify";
import {showConfirm} from 'src/plugin/utils-message';
export default {
    name: "AuditOption",
    props: ['contractForm', 'editType'],
    data() {
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
                        instanceId: this.contractForm.id,
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
</style>
