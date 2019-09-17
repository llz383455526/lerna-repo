<template>
  <div>
    <el-form ref="form"
             :model="form">
      <div v-for="(item,key) in form.serviceFeeContent"
           :key="key">

        <span>月收入</span>
        <span v-if="key>0">
          <el-form-item :prop="`serviceFeeContent.${key}.start`"
                        :rules="[{ required: true, message: '请输入月收入', trigger: 'blur' }, 
												{ validator: validateStart, trigger: 'blur' }, 
												{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}]">
            <el-input style="width: 120px;"
                      v-model="item.start"
                      @blur="form.serviceFeeContent[key - 1].end = item.start">
              <template slot="append">万</template>
            </el-input>
          </el-form-item>
          <el-checkbox v-model="item.equalsStart"
                       @change="form.serviceFeeContent[key - 1].equalsEnd = !item.equalsStart">含</el-checkbox>
        </span>
        <span v-else>0</span>

        <span v-if="key!=form.serviceFeeContent.length-1">
          <span style="vertical-align: middle;"
                class="ml10 mr10">至</span>
          <el-form-item :prop="`serviceFeeContent.${key}.end`"
                        :rules="[{ required: true, message: '请输入月收入', trigger: 'blur' }, 
												{ validator: validateEnd, trigger: 'blur' }, 
												{ pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/, message: '请输入任意正整数，正小数（小数位不超过2位）', trigger: 'blur'}]">
            <el-input style="width: 120px;"
                      v-model="item.end"
                      @blur="form.serviceFeeContent[key + 1].start = item.end">
              <template slot="append">万</template>
            </el-input>
          </el-form-item>

          <el-checkbox v-model="item.equalsEnd"
                       @change="form.serviceFeeContent[key + 1].equalsStart = !item.equalsEnd">含</el-checkbox>
        </span>
        <span v-if="key==form.serviceFeeContent.length-1"
              style="vertical-align: middle;">以上</span>
        <stepList :stepwiseList="item.stepwiseList"
                  :propName="`serviceFeeContent.${key}`"></stepList>
      </div>
      <settledRate ref="settledRate"
                   v-model="form.settledRate"></settledRate>
    </el-form>
  </div>
</template>

<script>
import stepList from './stepList.vue'
import settledRate from '../serviceFeeInterval/settledRate.vue'

export default {
  components: { stepList, settledRate },
  props: {
		serviceFeeInterval: {
			type: Object,
		},
	},
  computed: {
    form: {
      get() {
        const serviceFeeContent = this.serviceFeeInterval.serviceFeeContent
          && this.serviceFeeInterval.serviceFeeContent.length > 0
          ? this.serviceFeeInterval.serviceFeeContent.map((item) => {
          if (!item.stepwiseList) {
            item.stepwiseList = [	// 子阶梯
                          {
                              "startAmount":null,	// 子阶梯开始区间
                              "equalsStart":false,	// 是否包含开始区间
                              "endAmount":'',	// 子阶梯结束区间
                              "equalsEnd":true,	// 是否包含结束区间
                              "sequence":0,		// 序号
                              "percent":""		// 收费比例
                          },
                          {
                              "startAmount":'',
                              "equalsStart":false,
                              "endAmount":'',
                              "equalsEnd":true,
                              "sequence":1,
                              "percent":""
                          },
                          {
                              "startAmount":'',
                              "equalsStart":false,
                              "endAmount":null,
                              "equalsEnd":true,
                              "sequence":2,
                              "percent":""
                          }
                      ]
          }
          return item
        }) : [
            {
              // 2.8万以下
              "start":null,           // 区间开始
              "equalsStart":false,    // 是否包含开始区间
              "end":'2.8',              // 区间结束
              "equalsEnd":true,       // 是否包含结束区间
              "serviceFeeRate":10,    // 收费比例
              "monthIncomeAmount":0,  // 新字段方式（serviceFeeInterval）暂时不用
              "settledRate":null,     // 新字段方式（serviceFeeInterval）暂时不用
              "fixFee":0,		// 新字段方式（serviceFeeInterval）暂时不用
              "stepwiseList":[	// 子阶梯
                      {
                          "startAmount":null,	// 子阶梯开始区间
                          "equalsStart":false,	// 是否包含开始区间
                          "endAmount":'',	// 子阶梯结束区间
                          "equalsEnd":true,	// 是否包含结束区间
                          "sequence":0,		// 序号
                          "percent":""		// 收费比例
                      },
                      {
                          "startAmount":'',
                          "equalsStart":false,
                          "endAmount":'',
                          "equalsEnd":true,
                          "sequence":1,
                          "percent":""
                      },
                      {
                          "startAmount":'',
                          "equalsStart":false,
                          "endAmount":null,
                          "equalsEnd":true,
                          "sequence":2,
                          "percent":""
                      }
                  ]
            },
            {
              // 2.8~9.3万
              "start":'2.8',
              "equalsStart":false,
              "end":'9.3',
              "equalsEnd":true,
              "serviceFeeRate":12,	// 收费比例
              "monthIncomeAmount":0,
              "settledRate":null,
              "fixFee":0,
              "stepwiseList":[
                      {
                          "startAmount":null,
                          "equalsStart":false,
                          "endAmount":"",
                          "equalsEnd":true,
                          "sequence":0,
                          "percent":""
                      },
                      {
                          "startAmount":"",
                          "equalsStart":false,
                          "endAmount":"",
                          "equalsEnd":true,
                          "sequence":1,
                          "percent":""
                      },
                      {
                          "startAmount":"",
                          "equalsStart":false,
                          "endAmount":null,
                          "equalsEnd":true,
                          "sequence":2,
                          "percent":""
                      }
                  ]
            },
            {
              // 9.3万以上
              "start":'9.3',
              "equalsStart":false,
              "end":null,
              "equalsEnd":true,
              "serviceFeeRate":15,	// 收费比例
              "monthIncomeAmount":0,
              "settledRate":null,
              "fixFee":0,
              "stepwiseList":[
                      {
                          "startAmount":null,
                          "equalsStart":false,
                          "endAmount":"",
                          "equalsEnd":true,
                          "sequence":0,
                          "percent":""
                      },
                      {
                          "startAmount":"",
                          "equalsStart":false,
                          "endAmount":"",
                          "equalsEnd":true,
                          "sequence":1,
                          "percent":""
                      },
                      {
                          "startAmount":"",
                          "equalsStart":false,
                          "endAmount":null,
                          "equalsEnd":true,
                          "sequence":2,
                          "percent":""
                      }
                  ]
            }
          ]
        const settledRate = this.serviceFeeInterval.settledRate ? this.serviceFeeInterval.settledRate : ''
        return {
          serviceFeeContent,
          settledRate,
        }
      }
    }
  },
  methods: {
    initData() {},
    checkTable() {},
    equalsIncomeAmount() {},
		validateStart(rule, value, callback) {
			const index = rule.field.split('.')[1]
			const nextValue = this.form.serviceFeeContent[index].end
			if (nextValue === null || parseInt(index) === this.form.serviceFeeContent.length - 1) {
					callback()
			} else if (parseFloat(value) >= parseFloat(nextValue)) {
					callback('区间有误')
			} else {
					callback()
			}
		},
		validateEnd(rule, value, callback) {
			const index = rule.field.split('.')[1]
			const prevValue = this.form.serviceFeeContent[index].start
			if (index === '0') {
					callback()
			} else if (parseFloat(value) <= parseFloat(prevValue)) {
					callback('区间有误')
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
}
</script>
