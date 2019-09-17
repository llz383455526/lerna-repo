<template>
  <!-- <el-form ref="form"
           :model="form"> -->
  <el-table :data="stepwiseList"
            class="mb25"
            style="width: 1000px;">
    <el-table-column label="月总额下限">
      <template slot-scope="scope">
        <template v-if="scope.$index">
          <el-form-item :prop="`${propName}.stepwiseList.${scope.$index}.startAmount`"
                        :rules="[{ required: true, message: '请输入月总额下限', trigger: 'blur' }, { validator: validateStartAmount, trigger: 'blur' }, { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}]">
            <el-input v-model="scope.row.startAmount"
                      style="width: 120px;"
                      @blur="stepwiseList[scope.$index - 1].endAmount = scope.row.startAmount,$emit('checkTable')">
              <template slot="append">万</template>
            </el-input>
            <el-checkbox v-model="scope.row.equalsStart"
                         @change="stepwiseList[scope.$index - 1].equalsEnd = !scope.row.equalsStart">含
              <template v-if="scope.row.sequence === stepwiseList.length - 1">以上</template>
            </el-checkbox>
          </el-form-item>
        </template>
        <template v-else>
          <div class="center">无</div>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="月总额上限">
      <template slot-scope="scope">
        <template v-if="scope.$index !== stepwiseList.length - 1">
          <el-form-item :prop="`${propName}.stepwiseList.${scope.$index}.endAmount`"
                        :rules="[
														{ required: true, message: '请输入月总额上限', trigger: 'blur' },
														{ validator: validateEndAmount, trigger: 'blur' },
														{
															pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
															message: '请输入任意正整数，正小数（小数位不超过2位）',
															trigger: 'blur'
														}
													]">
            <el-input v-model="scope.row.endAmount"
                      style="width: 120px;"
                      @blur="stepwiseList[scope.$index + 1].startAmount = scope.row.endAmount,$emit('checkTable')">
              <template slot="append">万</template>
            </el-input>
            <el-checkbox v-model="scope.row.equalsEnd"
                         @change="stepwiseList[scope.$index + 1].equalsStart = !scope.row.equalsEnd">含
              <template v-if="!scope.row.sequence">以下</template>
            </el-checkbox>
          </el-form-item>
        </template>
        <template v-else>
          <div class="center">无</div>
        </template>
      </template>
    </el-table-column>
    <el-table-column label="阶梯收费"
                     width="320">
      <template slot-scope="scope">
        <el-form-item label="实发金额"
                      :prop="`${propName}.stepwiseList.${scope.$index}.percent`"
                      :rules="[{ required: true, message: '请输入阶梯收费', trigger: 'blur' }, { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}]">
          <el-input v-model="scope.row.percent"
                    style="width: 150px;"
                    @blur="$emit('checkTable')">
            <template slot="append">% 每人</template>
          </el-input>
          <i class="el-icon-question mt10"
             title="按每人月收入分阶梯收费"></i>
        </el-form-item>
      </template>
    </el-table-column>
    <el-table-column label="操作"
                     width="150">
      <template slot-scope="scope">
        <el-button type="text"
                   v-if="scope.$index === stepwiseList.length - 1"
                   @click="addRow(scope.$index)">增加阶梯</el-button>
        <el-button type="text"
                   v-if="scope.$index > 2 && scope.$index === stepwiseList.length - 1"
                   @click="delRow(scope.$index)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>
  <!-- </el-form> -->
</template>

<script>
export default {
	props: {
		stepwiseList: {
			type: Array,
			default: () => []
		},
    propName: {
      type: String,
    }
	},
	methods: {
    initData(stepwiseList) {
      this.stepwiseList = stepwiseList
    },
		delRow(index) {
			this.stepwiseList.splice(index, 1)
		},
		addRow(index) {
			this.stepwiseList.splice(index + 1, 0, {
          "startAmount":'',
          "equalsStart":false,
          "endAmount":null,
          "equalsEnd":true,
          "sequence":2,
          "percent":""
      })
		},
    validateStartAmount(rule, value, callback) {
        const index = rule.field.split('.')[3]
        const nextValue = this.stepwiseList[index].endAmount
        if (nextValue === null || parseInt(index) === this.stepwiseList.length - 1) {
            callback()
        } else if (parseFloat(value) >= parseFloat(nextValue)) {
            callback('月总额下限不得大于或等于上限')
        } else {
            callback()
        }
    },
    validateEndAmount(rule, value, callback) {
        const index = rule.field.split('.')[3]
        const prevValue = this.stepwiseList[index].startAmount
        if (index === '0') {
            callback()
        } else if (parseFloat(value) <= parseFloat(prevValue)) {
            callback('月总额上限不得小于或等于下限')
        } else {
            callback()
        }
    },
	},
}
</script>

<style lang="scss">
.el-form-item__content {
  line-height: 43px;
}
.el-table .cell {
  overflow: auto;
}
.el-form-item .el-form-item {
  margin-bottom: 22px;
}
</style>
