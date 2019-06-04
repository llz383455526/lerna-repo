<template>
  <div>
    <div
      class="widget-box bg-white"
      style="margin-top:20px;"
    >
      <div class="widget-header">
        <h4 class="widget-title">
          审核意见
        </h4>
      </div>
      <div class="widget-body">
        <div
          class="widget-main"
          style="font-size: 16px;line-height: 30px;"
        >
          <el-table
            :data="contractModel.processLogs"
            class="mb20"
          >
            <el-table-column
              prop="actionUserName"
              label="审核人姓名" 
            />
            <el-table-column
              prop="actionAt"
              label="审核时间"
            />
            <el-table-column
              prop="actionMemo"
              label="审核意见" 
            />
          </el-table>
          <!--  v-if="contractModel.actions.length" -->
          <div>
            <el-input
              type="textarea"
              v-model="opinion" 
            />
            <div
              style="color:red;"
              v-if="opinion === ''"
            >
              请填写审核意见
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      class="mt20 mb20"
      v-if="contractModel.status != 'init'"
    >
      <!-- 
        v-if="contractModel.actions[0] === 'agree'" -->
      <el-button
        size="small"
        type="primary"
        @click="handleContract('agree')"
      >
        审批通过
      </el-button>
      <!-- v-if="contractModel.actions[1] === 'reject'" -->
      <el-button
        size="small"
        type="danger"
        
        @click="handleContract('reject')"
      >
        审批不通过
      </el-button>
      <el-button
        size="small"
        @click="backToList('list')"
      >
        返回
      </el-button>
    </div>
  </div>
</template>

<script>
import {
    post
} from "../../../../store/api"
import {
    showNotify
} from "../../../../plugin/utils-notify";
import {
    showConfirm
} from '../../../../plugin/utils-message';
export default {
    name: "AuditOption",
    props: ['contractModel', 'editType'],
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
                        instanceId: this.contractModel.contract.id,
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
