<template>
  <div>
    <h3 class="green">请选择合同选项</h3>
    <el-form-item label="选择合同模板"
      prop="contractTplId"
      :rules="{ required: true, message: '请选择合同模板', trigger: 'change' }">
      <el-select v-model="contractModel.contractForm.contractTplId"
        filterable
        placeholder="请选择"
        style="width:450px;">
        <el-option v-for="(item, key) in contractTplList"
          :key="key"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="选择客户行业类型"
      prop="contractType">
      <el-select v-model="contractModel.contractForm.contractType"
        placeholder="请选择"
        style="width:450px;">
        <el-option v-for="(item, key) in industryTypeList"
          :key="key"
          :label="item.text"
          :value="item.value">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="客户从事"
      prop="customIndustry">
      <el-input v-model="contractModel.contractForm.customIndustry"
        style="width:450px;"></el-input>
    </el-form-item>
    <el-form-item label="合同期限"
      prop="contractStartDate"
      v-if="!isChange">
      <el-date-picker type="daterange"
        style="width:450px;"
        v-model="value"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        value-format="yyyy-MM-dd"
        @change="autoFill">
      </el-date-picker>
    </el-form-item>
  </div>
</template>

<script>
    import _ from 'lodash'
    import { mapGetters } from 'vuex'
    export default {
        name: "contractOption",
        props: ['contractModel'],
        data() {
            return {
                value: '',
            }
        },
        computed: {
            ...mapGetters({
                contractTplList: 'contractTplList',
                industryTypeList: 'industryTypeList',
                serviceTypeList: 'serviceTypeList',
            }),
            isChange() {
                return this.contractModel.workflowType.indexOf('update') !== -1
            }
        },
        watch: {
            // 'contractModel.contractModel.contractForm'() {
            //     this.fillValue()
            // },
            'contractModel.contractForm.contractStartDate'(contractStartDate) {
                this.fillValue()
            }
        },
        methods: {
            fillValue() {
                if (this.isChange) {
                    return
                }
                if (this.contractModel.contractForm.contractStartDate) {
                    this.value = [this.contractModel.contractForm.contractStartDate, this.contractModel.contractForm.contractEndDate]
                } else if (this.contractModel.contractForm.startDate) {
                    this.value = [this.contractModel.contractForm.startDate, this.contractModel.contractForm.endDate]
                    this.contractModel.contractForm.contractStartDate = this.contractModel.contractForm.startDate
                    this.contractModel.contractForm.contractEndDate = this.contractModel.contractForm.endDate
                } else if (this.contractModel.contractForm.dataValue) {
                    this.value = this.contractModel.contractForm.dataValue
                    this.contractModel.contractForm.contractStartDate = this.contractModel.contractForm.dataValue[0]
                    this.contractModel.contractForm.contractEndDate = this.contractModel.contractForm.dataValue[1]
                }
            },
            autoFill(val) {
                if (val) {
                    this.contractModel.contractForm.contractStartDate = val[0];
                    this.contractModel.contractForm.contractEndDate = val[1];
                }
            },
            setSettleType(e) {
                this.$emit('setSettleType');
                if (!this.hasInsurance()) {
                    this.contractModel.contractForm.vciBuyType = '';
                    this.contractModel.contractForm.vciPlanName = '';
                }
            },
            // 判断是否有商业保险
            hasInsurance() {
                var isHas = false;
                this.serviceTypeList.forEach(item => {
                    this.contractModel.contractForm.serviceType.forEach(el => {
                        if (item.serviceId === el && item.vciStatus === 1) {
                            isHas = true
                        }
                    })
                })
                return isHas;
            }
        },
        mounted() {
            this.$store.dispatch('getContractTplList')
            this.$store.dispatch('getIndustryTypeList')
            this.fillValue()
        }
    }
</script>

<style scoped>
.el-icon-question {
  margin-right: 5px;
  color: #f56c6c;
  cursor: pointer;
}
</style>
