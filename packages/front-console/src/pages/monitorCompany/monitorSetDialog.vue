<template>
    <el-dialog
        :visible.sync="dialogVisible"
        :before-close="handleClose"
        class="monitor-set-dialog">
        <div slot="title">监控维度设置&nbsp;&nbsp;<span class="sub">此设置为系统全局性，系统按事件+维度动态监控</span></div>
        <div class="set-dialog-wrap" v-loading="loading">
            <div
                v-for="pItem in dimensionList"
                :key="pItem.id">
                <p>{{pItem.dimension_name}}</p>
                <el-row :gutter="30">
                    <el-col v-for="item in pItem.second_dimensions" :key="item.id" :span="8">
                        <el-checkbox
                            v-model="form[item.id].checked"
                            @change="handleSelectChange(item.id)"
                        >{{item.dimension_name}}
                        </el-checkbox>
                        <span style="float: right;">
                            <el-input
                                :ref="`timeInterval${item.id}`"
                                v-model.trim.number="form[item.id].time_interval"
                                size="mini" placeholder="请输入"
                                style="width: 70px;"
                                :disabled="!form[item.id].checked"
                            ></el-input>
                            <el-select
                                v-model="form[item.id].time_interval_unit"
                                size="mini"
                                style="width: 70px;"
                                :disabled="!form[item.id].checked"
                            >
                                <el-option label="月" value="M"></el-option>
                                <el-option label="周" value="W"></el-option>
                                <el-option disabled label="日" value="D"></el-option>
                            </el-select>
                        </span>
                    </el-col>
                </el-row>
            </div>
        </div>
        <span slot="footer" class="dialog-footer">
            <el-button size="small" @click="handleClose">取 消</el-button>
            <el-button size="small" type="primary" @click="handleSubmit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {post, get} from '../../store/api'
import { monitor } from '../../api/monitor.js'


export default {
  name: 'monitorSetDialog',
  props: ['dimensionList'],
  data() {
    return {
      dialogVisible: false,
      dimensions: [],
      form: {},
      ruleList: [],
      loading: true,
    }
  },
  created() {
    // 遍历设置表单初始值
    Object.keys(this.dimensionList).forEach(pId => {
      this.dimensionList[pId].second_dimensions.forEach(item => {
        this.$set(this.form, item.id, {
          checked: false,
          time_interval: '',
          time_interval_unit: 'W',
        })
      })
    })
  },
  mounted() {
    this.getJobTaskRuleList()
  },
  methods: {
    // 回显数据
    initForm() {
      const { ruleList, form } = this
      ruleList.forEach(item => {
        form[item.second_dimension_id] = Object.assign({}, {
          checked: !item.is_deleted,
          time_interval: item.time_interval,
          time_interval_unit: item.time_interval_unit,
          second_dimension_id: item.second_dimension_id,
          id: item.id,
        })
      })
    },
    // 获取维度设置
    getJobTaskRuleList() {
      post(monitor.jobTaskRuleOperation, {
        operation_type: 'S'
      }).then(data => {
        this.ruleList = Object.assign([], data)
        this.initForm()
        this.loading = false
      })
    },
    // 更新设置
    updateJobTaskRule(form) {
      post(monitor.jobTaskRuleOperation, {
        operation_type: 'U',
        data: form,
      }).then(data => {
        this.$message({
          type: 'success',
          message: '设置成功',
        })
        this.handleClose()
      })
    },

    // 勾选处理
    handleSelectChange(id) {
      if (!this.form[id].checked) {
        this.form[id].time_interval = ''
      }
    },

    // 表单校验
    validateForm(form, cb) {
        let isPass = true
        for (let key in form) {
            if (form[key].checked && !/^\d+$/.test(form[key].time_interval)) {
                isPass = false
                this.$message.warning('请检查设置内容')
                break
            }
        }
        if (isPass) {
            cb()
        }
    },

    // 确认按钮
    handleSubmit() {
      this.validateForm(this.form, () => {
        const editForm = this.formComparison()
        this.updateJobTaskRule(editForm)
      })
    },

    // 对比数据
    formComparison() {
      // 增，删，改
      const editForm = []
      const totalForm = JSON.parse(JSON.stringify(this.form))
      const oldMap = this.ruleList.reduce((res, v) => (res[v.second_dimension_id] = v, res), {})
      Object.keys(totalForm).forEach(second_dimension_id => {
        const item = totalForm[second_dimension_id]
        if (item.checked && !oldMap[second_dimension_id].is_deleted) {
          // 改
          editForm.push({
            id: oldMap[second_dimension_id].id,
            is_deleted: 0,
            time_interval: item.time_interval,
            time_interval_unit: item.time_interval_unit
          })
        } else if (item.checked && oldMap[second_dimension_id].is_deleted === 1) {
          // 增
          editForm.push({
            id: oldMap[second_dimension_id].id,
            is_deleted: 0,
            time_interval: item.time_interval,
            time_interval_unit: item.time_interval_unit
          })
        } else if (!item.checked && !oldMap[second_dimension_id].is_deleted) {
          // 删
          editForm.push({
            id: oldMap[second_dimension_id].id,
            is_deleted: 1,
            // time_interval: item.time_interval,
            // time_interval_unit: item.time_interval_unit
          })
        }
      })

      return editForm
    },

    handleClose() {
      this.dialogVisible = false
      this.$nextTick(() => {
        this.$emit('close')
      })
    }
  },
}
</script>

<style lang="scss">
.monitor-set-dialog .el-dialog {
  width: 1200px;
}

.monitor-set-dialog .sub {
  color: #BDBDBD;
  font-size: 14px;
}

.monitor-set-dialog .el-row .el-col-8:nth-child(n+4) {
  margin-top: 5px;
}

.dimenstion-item {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  .item-txt {
    flex: 1;
  }
}
</style>
