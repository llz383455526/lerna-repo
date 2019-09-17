<template>
  <el-form ref="form"
           :model="form">
    <el-table :data="form.serviceFeeContent"
              class="mb25"
              style="width: 1000px;">
      <el-table-column label="月总额下限">
        <template slot-scope="scope">
          <template v-if="scope.$index">
            <el-form-item :prop="`serviceFeeContent.${scope.$index}.start`"
                          :rules="[
                            { required: true, message: '请输入月总额下限', trigger: 'blur' },
                            { validator: validateStartAmount, trigger: 'blur' },
                            { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}
                          ]">
              <el-input v-model="scope.row.start"
                        style="width: 120px;"
                        @blur="form.serviceFeeContent[scope.$index - 1].end = scope.row.start,$emit('checkTable')">
                <template slot="append">万</template>
              </el-input>
              <el-checkbox v-model="scope.row.equalsStart"
                           @change="form.serviceFeeContent[scope.$index - 1].equalsEnd = !scope.row.equalsStart">含
                <template v-if="scope.row.sequence === form.serviceFeeContent.length - 1">以上</template>
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
          <template v-if="scope.$index !== form.serviceFeeContent.length - 1">
            <el-form-item :prop="`serviceFeeContent.${scope.$index}.end`"
                          :rules="[
														{ required: true, message: '请输入月总额上限', trigger: 'blur' },
														{ validator: validateEndAmount, trigger: 'blur' },
														{
															pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
															message: '请输入任意正整数，正小数（小数位不超过2位）',
															trigger: 'blur'
														}
													]">
              <el-input v-model="scope.row.end"
                        style="width: 120px;"
                        @blur="form.serviceFeeContent[scope.$index + 1].start = scope.row.end,$emit('checkTable')">
                <template slot="append">万</template>
              </el-input>
              <el-checkbox v-model="scope.row.equalsEnd"
                           @change="form.serviceFeeContent[scope.$index + 1].equalsStart = !scope.row.equalsEnd">含
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
                        :prop="`serviceFeeContent.${scope.$index}.serviceFeeRate`"
                        :rules="[{ required: true, message: '请输入阶梯收费', trigger: 'blur' }, { pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}]">
            <el-input v-model="scope.row.serviceFeeRate"
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
          <!-- <el-button type="text"
                     :disabled="disabled"
                     v-if="scope.$index === form.infoList.length - 1"
                     @click="addRow(scope.$index)">增加阶梯</el-button> -->
          <el-button type="text"
                     :disabled="disabled"
                     v-if="scope.$index > 2 && scope.$index === form.infoList.length - 1"
                     @click="delRow(scope.$index)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <settledRate ref="settledRate"
                 v-model="form.settledRate"></settledRate>
  </el-form>
</template>

<script>
import settledRate from '../serviceFeeInterval/settledRate.vue'

export default {
  components: { settledRate },
	props: {
		serviceFeeContent: {
			type: Array,
			default: () => []
		}
	},
	data() {
		return {
			form: {
        settledRate: '',
				serviceFeeContent: [
          {
            // 2.8万以下
            "start":null,           // 区间开始
            "equalsStart":false,    // 是否包含开始区间
            "end":'2.8',              // 区间结束
            "equalsEnd":true,       // 是否包含结束区间
            "serviceFeeRate":'',    // 收费比例
            "monthIncomeAmount":0,  // 新字段方式（serviceFeeInterval）暂时不用
            "settledRate":null,     // 新字段方式（serviceFeeInterval）暂时不用
            "fixFee":0,		// 新字段方式（serviceFeeInterval）暂时不用
            "stepwiseList":null	// 无流水报价不处理此阶梯
          },
          {
            // 2.8~9.3万
            "start":'2.8',
            "equalsStart":false,
            "end":'9.3',
            "equalsEnd":true,
            "serviceFeeRate":'',	// 收费比例
            "monthIncomeAmount":0,
            "settledRate":null,
            "fixFee":0,
            "stepwiseList":null	// 无流水报价不处理此阶梯
          },
          {
            // 9.3万以上
            "start":'9.3',
            "equalsStart":false,
            "end":null,
            "equalsEnd":true,
            "serviceFeeRate":'',	// 收费比例
            "monthIncomeAmount":0,
            "settledRate":null,
            "fixFee":0,
            "stepwiseList":null	// 无流水报价不处理此阶梯
          }
        ]
			}
		}
	},
	methods: {
    initData(contractForm) {
      // console.log(contractForm)
      this.form.serviceFeeContent = contractForm.serviceFeeInterval.serviceFeeContent
      this.form.settledRate = contractForm.serviceFeeInterval.settledRate
    },
		delRow(index) {
			this.form.serviceFeeContent.splice(index, 1)
		},
		addRow(index) {
			this.form.serviceFeeContent.splice(index + 1, 0, {
				"start":null,           // 区间开始
        "equalsStart":false,    // 是否包含开始区间
        "end":2.8,              // 区间结束
        "equalsEnd":true,       // 是否包含结束区间
        "serviceFeeRate":10,    // 收费比例
        "monthIncomeAmount":0,  // 新字段方式（serviceFeeInterval）暂时不用
        "settledRate":null,     // 新字段方式（serviceFeeInterval）暂时不用
        "fixFee":0,		// 新字段方式（serviceFeeInterval）暂时不用
        "stepwiseList":null	// 无流水报价不处理此阶梯
			})
		},
    validateStartAmount(rule, value, callback) {
        const index = rule.field.split('.')[1]
        const nextValue = this.form.serviceFeeContent[index].end
        if (nextValue === null || parseInt(index) === this.form.serviceFeeContent.length - 1) {
            callback()
        } else if (value >= nextValue) {
            callback('月总额下限不得大于或等于上限')
        } else {
            callback()
        }
    },
    validateEndAmount(rule, value, callback) {
        const index = rule.field.split('.')[1]
        const prevValue = this.form.serviceFeeContent[index].start
        if (index === '0') {
            callback()
        } else if (value <= prevValue) {
            callback('月总额上限不得小于或等于下限')
        } else {
            callback()
        }
    },
		validate(cb) {
			this.$refs['form'].validate((valid) => {
        cb(valid ? this.form : false)
			})
		},
	},
  mounted() {
    // console.log(this.serviceFeeContent)
    // this.form.infoList = this.tableData
  }
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
