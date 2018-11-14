<template>
  <div class="tax-discount-step-4">
    <p class="page-title">{{countTitle}}税优地资源信息(第四步)</p>
    <el-form :disabled="disabled" class="form-box" ref="form" :model="form" label-width="150px">
      <el-form-item label="返税适用周期">
        <el-radio-group v-model="form.shiYongWeek" class="fan-shui-shi-yong">
          <div class="group">
            <el-radio label="通用周期" style="padding-right: 10px"></el-radio>
            <el-select v-if="form.shiYongWeek === '通用周期'" v-model="form.tongYongWeek" placeholder="请选择">
              <el-option label="按月统计" value="按月统计"></el-option>
              <el-option label="按年统计" value="按年统计"></el-option>
            </el-select>
          </div>
          <div class="group">
            <el-radio label="指定周期" style="padding-right: 10px"></el-radio>
            <el-date-picker
              v-if="form.shiYongWeek === '指定周期'"
              v-model="form.zhiDingWeek"
              type="year"
              placeholder="选择年">
            </el-date-picker>
          </div>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="返税适用周期备注">
        <el-input v-model="form.fanShuiShiYongWeekBeiZhu"></el-input>
      </el-form-item>

      <div class="interval-line"></div>
      <el-form-item prop="name" label="是否扣除起税点金额">
        <el-switch
          v-model="fanShuiJieTiData.shiFouKouChuQiZhengDian">
        </el-switch>
      </el-form-item>
      <el-form-item prop="name" label="返税阶梯设置" clsss="fan-shui-jie-ti-set">
        <div style="padding-bottom: 20px">
          <el-button size="mini" type="primary" @click="addQuJianClick">添加区间</el-button>
        </div>
        <el-row>
          <el-col :span="2" class="text-center">区间序号</el-col>
          <el-col :span="18" class="text-center">设置区间</el-col>
          <el-col :span="4" class="text-center">操作</el-col>
        </el-row>
        <el-collapse>
          <el-collapse-item :name="`${k}`" v-for="(v, k) in fanShuiJieTiData.dataArr">
            <template slot="title">
              <el-row>
                <el-col :span="2" class="text-center">{{ k + 1 }}</el-col>
                <el-col :span="3" class="text-center">{{ v.num1 }}</el-col>
                <el-col :span="4" class="text-center">{{ v.type1 }}</el-col>
                <el-col :span="4" class="text-center">纳税金额</el-col>
                <el-col :span="4" class="text-center">{{ v.type2 }}</el-col>
                <el-col :span="3" class="text-center">{{ v.num2 }}</el-col>
                <el-col :span="4" class="text-center">
                  <el-button size="mini" type="danger" icon="el-icon-delete" @click.stop="removeQuJianClick(k)" circle></el-button>
                  <el-button size="mini" type="primary" icon="el-icon-edit-outline" @click.stop="editQuJianClick(k)"
                             circle></el-button>
                </el-col>
              </el-row>
            </template>
            <ul class="fanshui-type-list">
              <li v-for="(item, index) in shuiZhongShuiLv">{{ item.name }}: {{ v[`ratio_${index}`] }}</li>
            </ul>
          </el-collapse-item>
        </el-collapse>
      </el-form-item>

    </el-form>

    <div style="padding: 30px 0 30px 100px;">
      <el-button @click="onStepClick">上一步</el-button>
      <el-button type="primary" @click="nextStepClick">下一步</el-button>
      <el-button v-if="$route.query.state === '0' || $route.query.state === '1'" type="primary" @click="saveAndBackClick">保存并返回列表</el-button>
      <el-button @click="backList">取消</el-button>
    </div>

    <!--返税阶梯设置-->
    <el-dialog
      title="提示"
      :visible.sync="fanShuiJieTiData.popShow"
      width="800px"
      class="fan-shui-jie-ti-pop">
      <el-form size="small" v-if="fanShuiJieTiData.popShow" :model="fanShuiJieTiData.popData" :rules="fanShuiJieTiData.rules" ref="FanShuiJitTiPop" label-width="180px">
        <el-form-item label="起始值">
          <span>{{ fanShuiJieTiData.popData.type1 }}&nbsp;&nbsp;</span>
          <span>{{ fanShuiJieTiData.popData.num1 }}</span>
        </el-form-item>
        <el-form-item prop="num2" label="结束值">
          <el-input :disabled="editIndex < fanShuiJieTiData.length - 1" placeholder="请输入内容" type="number" v-model.number="fanShuiJieTiData.popData.num2" class="input-with-select">
            <el-select v-model="fanShuiJieTiData.popData.type2" slot="prepend" placeholder="请选择">
              <el-option label="小于等于" value="小于等于"></el-option>
              <el-option label="小于" value="小于"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item :prop="`ratio_${k}`" :label="v.name" v-for="(v, k) in shuiZhongShuiLv" :key="k">
          <el-input type="number" v-model.number="fanShuiJieTiData.popData[`ratio_${k}`]">
            <template slot="append">%</template>
          </el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="fanShuiJieTiData.popShow = false">取 消</el-button>
        <el-button type="primary" @click="fanShuiJieTiOkBtnClick">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {get, post} from '../../../store/api'
  import AccessoryInput from '../com/accessoryInput'
  export default {
    name: "TaxDiscountStep3",
    components: {
      AccessoryInput
    },
    data() {
      return {
        form: {
          // 适用周期
          shiYongWeek: '通用周期',
          // 通用周期
          tongYongWeek: '按月统计',
          // 指定周期
          zhiDingWeek: new Date(),
          // 返税适用周期备注
          fanShuiShiYongWeekBeiZhu: null
        },
        // 返税阶梯数据
        fanShuiJieTiData: {
          // 是否扣除起征点
          shiFouKouChuQiZhengDian: false,
          // 返税阶梯弹窗
          popShow: false,
          dataArr: [],
          popData: {},
          popData_base: {
            num1: 0,
            type1: '大于等于',
            type2: '小于等于',
            num2: null
          },
          rules: {
            num2: [{
              required: true, trigger: 'blur', validator: (rule, value, callback) => {
                const type = typeof this.fanShuiJieTiData.popData.num2
                let str = null
                if (type === 'number') {
                  const num1 = this.fanShuiJieTiData.popData.num1
                  const num2 = this.fanShuiJieTiData.popData.num2
                  const type1 = this.fanShuiJieTiData.popData.type1
                  const type2 = this.fanShuiJieTiData.popData.type2
                  if (type1 === '大于等于') {
                    if (type2 === '小于等于') {
                      if (num2 < num1) {
                        str = '结束值必须大于等于开始值'
                      }
                    } else {
                      if (num2 <= num1) {
                        str = '结束值必须大于开始值'
                      }
                    }
                  } else {
                    if (num2 <= num1) {
                      str = '结束值必须大于开始值'
                    }
                  }
                } else {
                  str = '请输入数据'
                }
                callback(str ? new Error(str) : undefined)
              }
            }]
          },
          // 是否是添加状态
          isAdd: false
        },
        // 是否可以编辑
        disabled: false,
        // 税种税率
        shuiZhongShuiLv: [],
        // 修改索引
        editIndex: 0
      }
    },
    computed: {
      countTitle() {
        switch (this.$route.query.state) {
          case '0':
            return '新增'
          case '1':
            return '编辑'
          case '2':
            return '查看'
          default:
            return ''
        }
      }
    },
    async mounted() {
      this.disabled = !(this.$route.query.state === '0' || this.$route.query.state === '1')
      try {
        const data = await this.getShuiLvShuXingBiao()
        await this.getShuiZHongShuiLv(data)
        this.getStep4data()
      } catch (e) {
        console.log(e)
      }
    },
    methods: {
      // 获取第4部数据
      getStep4data() {
        get('/api/salemgt/taxLanding/tax/taxLandingPropertyReturnRuleRelate/info', {
          taxLandingId: this.$route.query.id
        }).then((data) => {
          if (data) {
            // 返税适用周期
            const fanShuiShiYongZhouQiObjArr = data.taxLandingPropertyDTOS.filter((item) => {
              return item.property === 'return-tax'
            })
            if (fanShuiShiYongZhouQiObjArr && fanShuiShiYongZhouQiObjArr.length > 0) {
              let item = fanShuiShiYongZhouQiObjArr[0].items[0]
              if (item.name === '指定周期') {
                this.form.shiYongWeek = '指定周期'
                this.form.zhiDingWeek = new Date(`${item.code}/1/1`)
              } else {
                this.form.shiYongWeek = '通用周期'
                this.form.tongYongWeek = item.name
              }
              this.form.fanShuiShiYongWeekBeiZhu = item.memo
            }
            // 返税阶梯
            /*计算时是否扣除起税点金额*/
            const fanShuiShiJieTiObjArr = data.taxLandingPropertyDTOS.filter((item) => {
              return item.property === 'return-tax-setting'
            })
            if (fanShuiShiJieTiObjArr && fanShuiShiJieTiObjArr.length > 0) {
              let item = fanShuiShiJieTiObjArr[0].items[0]
              this.fanShuiJieTiData.shiFouKouChuQiZhengDian = item.code === "true"
            }
            const taxLandingReturnRuleDTOList = data.taxLandingReturnRuleDTOList
            this.fanShuiJieTiData.dataArr = taxLandingReturnRuleDTOList.map((item, index) => {
              const numsStr = item.rule.substr(1, item.rule.length - 2)
              const numArr = numsStr.split(',')
              const section = {
                index: index + 1,
                type1: item.rule[0] === '[' ? '大于等于' : '大于',
                num1: parseInt(numArr[0]),
                num2: parseInt(numArr[1]),
                type2: item.rule[4] === '[' ? '小于等于' : '小于',
              }
              item.taxRateDTOS.forEach((item2, index) => {
                this.shuiZhongShuiLv.forEach((item3) => {
                  if (item2.taxCode === item3.taxCode) {
                    section[`ratio_${index}`] = item2.taxRate
                  }
                })
              })
              return section
            })
          }
        }).catch(() => {
        })
      },
      // 获取税种税率
      getShuiZHongShuiLv(dataArr) {
        return new Promise((resolve, reject) =>{
          get('/api/salemgt/taxLanding/tax/local', {
            taxLandingId: this.$route.query.id
          }).then((data) => {
            data.forEach((item1) => {
              dataArr.forEach((item2) => {
                if (item2.code === item1.taxCode) {
                  item1.name = item2.name
                }
              })
            })
            data.forEach((item, k) => {
              const key = `ratio_${k}`
              this.fanShuiJieTiData.popData_base[key] = null
              this.fanShuiJieTiData.rules[key] = [{
                required: true, trigger: 'blur', validator: (rule, value, callback) => {
                  const type = typeof value
                  let str = null
                  if (type === 'number') {
                    const num = value
                    if (num < 0 || num > 100) {
                      str = '数值超出范围（0-100）'
                    }
                  } else {
                    str = '请输入数据'
                  }
                  callback(str ? new Error(str) : undefined)
                }
              }]
            })
            this.shuiZhongShuiLv = data
            resolve()
          }).catch(() => {
            reject()
          })
        })
      },
      // 获取税率类型
      getShuiLvShuXingBiao() {
        return new Promise((resolve, reject) => {
          get('/api/salemgt/taxLanding/tax/taxTypes', {}).then((result) => {
            resolve(result)
          }).catch((e) => {
            reject()
          })
        })
      },
      // 返税阶梯弹窗校验
      fanShuiJitTiPopCheck() {
        return new Promise((resolve, reject) => {
          this.$refs['FanShuiJitTiPop'].validate((valid) => {
            if (valid) {
              resolve()
            } else {
              reject({
                type: 'input'
              })
              return false;
            }
          })
        })
      },
      // 返税阶梯确定按钮点击
      fanShuiJieTiOkBtnClick() {
        this.fanShuiJitTiPopCheck().then(() => {
          if (this.fanShuiJieTiData.isAdd) {
            this.fanShuiJieTiData.dataArr.push(this.fanShuiJieTiData.popData)
          } else {
            this.fanShuiJieTiData.dataArr.splice(this.editIndex, 1, this.fanShuiJieTiData.popData)
          }
          this.fanShuiJieTiData.popShow = false
        }).catch(() => {
        })
      },
      // 编辑区间
      editQuJianClick(index) {
        this.editIndex = index
        const item = this.fanShuiJieTiData.dataArr[index]
        this.fanShuiJieTiData.popData = {
          ...item
        }
        this.fanShuiJieTiData.isAdd = false
        this.fanShuiJieTiData.popShow = true
      },
      // 删除区间
      removeQuJianClick(index) {
        this.$confirm('确定删除此区间嘛?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fanShuiJieTiData.dataArr.splice(index, 1)

        }).catch(() => {
        });
      },
      // 添加区间
      addQuJianClick() {
        if (this.fanShuiJieTiData.dataArr.length === 0) {
          this.fanShuiJieTiData.popData = { ...this.fanShuiJieTiData.popData_base }
        } else {
          const lastItem = this.fanShuiJieTiData.dataArr[this.fanShuiJieTiData.dataArr.length - 1]
          this.fanShuiJieTiData.popData = {
            index: lastItem.index + 1,
            num1: lastItem.num2,
            type1: lastItem.type2 === '小于' ? '大于等于' : '大于',
            type2: '小于等于',
            num2: null,
          }
        }
        this.fanShuiJieTiData.isAdd = true
        this.fanShuiJieTiData.popShow = true
      },
      // 保存数据
      saveData() {
        if (this.fanShuiJieTiData.dataArr.length === 0) {
          this.$message.error('请添加返税阶梯');
          return Promise.reject()
        }
        return new Promise((resolve, reject) => {
          let submitData = {}
          const id = parseInt(this.$route.query.id)
          submitData.taxLandingId = id
          // 返税适用周期
          submitData.taxLandingPropertyDTOS = []
          if (this.form.shiYongWeek === '通用周期') {
            submitData.taxLandingPropertyDTOS.push({
              "items": [
                {
                  "code": true,
                  "memo": this.form.fanShuiShiYongWeekBeiZhu,
                  "name": this.form.tongYongWeek
                }
              ],
              "property": "return-tax"
            })
          } else {
            submitData.taxLandingPropertyDTOS.push({
              "items": [
                {
                  "code": this.form.zhiDingWeek.getFullYear(),
                  "memo": this.form.fanShuiShiYongWeekBeiZhu,
                  "name": '指定周期'
                }
              ],
              "property": "return-tax"
            })
          }
          // 返税阶梯
          /*计算时是否扣除起税点金额*/
          submitData.taxLandingPropertyDTOS.push({
            "items": [
              {
                "code": this.fanShuiJieTiData.shiFouKouChuQiZhengDian,
                "name": '计算时是否扣除起税点金额'
              }
            ],
            "property": "return-tax-setting"
          })
          submitData.taxLandingReturnRuleDTOList = []
          this.fanShuiJieTiData.dataArr.forEach((item) => {
            const data = {
              taxLandingId: id,
              taxRateDTOS: []
            }
            data.rule = `${item.type1 === '大于等于' ? '[' : '('}${item.num1},${item.num2}${item.type2 === '小于等于' ? ']' : ')'}`
            this.shuiZhongShuiLv.forEach((item1, k) => {
              data.taxRateDTOS.push({
                "taxCode": item1.taxCode,
                "taxRate": item[`ratio_${k}`]
              })
            })
            submitData.taxLandingReturnRuleDTOList.push(data)
            resolve()
          })
          const url = `/api/salemgt/taxLanding/tax/taxLandingPropertyReturnRule`
          post(url, submitData).then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            resolve()
          }).catch(() => {
            this.$message.error('提交失败');
            reject()
          })
        })
      },
      // 上一步
      onStepClick() {
        this.$router.push({ path: '/main/taxDiscount/step3', query: this.$route.query })
      },
      // 下一步按钮点击
      nextStepClick() {
        if (this.$route.query.state === '2') {
          this.$router.push({ path: '/main/taxDiscount/step5', query: this.$route.query })
        } else {
          this.saveData().then(() => {
            this.$router.push({ path: '/main/taxDiscount/step5', query: this.$route.query })
          }).catch((e) => {
            console.log('e = ', e)
          })
        }
      },
      // 保存并返回列表
      async saveAndBackClick() {
        this.saveData().then(() => {
          this.backList()
        }).catch(() => {})
      },
      // 返回列表
      backList() {
        this.$router.replace('/main/taxDiscount/list')
      }
    }
  }
</script>

<style lang="scss" scoped>

  .tax-discount-step-4 {
    > .page-title {
      font-size: 30px;
      color: #666;
    }
    .form-box {
      background-color: #fff;
      padding: 20px;
    }
    .postion-box {
      display: flex;
      justify-content: start;
      vertical-align: center;
      .beizhu-title {
        padding: 0 10px 0 50px;
      }
      .beizhu {
        width: 400px;
      }
    }
    .fan-shui-shi-yong {
      display: flex;
      .group {
        width: 400px;
        height: 30px;
        display: flex;
        align-items: center;
      }
    }
    .interval-line {
      margin: 30px 0;
      height: 1px;
      background-color: #ddd;
    }
    .text-center {
      text-align: center;
    }
    .fanshui-type-list {
      margin: 0;
      list-style: none;
      padding: 10px!important;
    }
  }

</style>

<style lang="scss">
  .tax-discount-step-4 {
    .fan-shui-jie-ti-pop {
      .el-input-group__prepend {
        width: 120px;
      }
      .el-dialog__body {
        padding-bottom: 0;
      }
    }
    .el-collapse-item__header {
      position: relative;
    }
    .el-collapse-item__content {
      padding: 0;
    }
    .el-collapse-item__arrow {
      position: absolute!important;
      right: 2px;
      top: 17px;
    }
  }
</style>

