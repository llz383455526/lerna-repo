<template>
  <div class="tax-discount-step-2">
    <p class="page-title">{{countTitle}}税优地资源信息(第三步)</p>
    <el-form :disabled="disabled" class="form-box" ref="form" :model="form" label-width="150px">
      <el-form-item label="业务配比期望值">
        <el-input size="small" style="width: 400px" type="number" placeholder="请输入内容" v-model.number="form.sanWanYiXiaYeWuLiang">
          <template slot="prepend">三万以下业务量</template>
          <template slot="append">%</template>
        </el-input>
        <span>&nbsp;&nbsp;&nbsp;</span>
        <el-input size="small" style="width: 400px" type="number" placeholder="请输入内容" v-model.number="form.sanWanYiShangYeWuLiang">
          <template slot="prepend">三万以上业务量</template>
          <template slot="append">%</template>
        </el-input>
      </el-form-item>

      <el-form-item label="地方留存政策">
        <div>
          <el-button type="primary" size="mini" @click="diFangLiuCunAddClick" :disabled="disabled || this.diFangLiuCunObj.otherArr.length === 0">添加其他条目</el-button>
        </div>
        <div class="di-fang-liu-cun-input-box">
          <accessory-input
            v-for="(v, k) in diFangLiuCunObj.inputArr"
            :ref="`DI_FANG_LIU_CUN_${k}`"
            taxCategory="local-tax"
            taxCollection="commom"
            :taxRate="v.taxRate"
            :disabled="disabled"
            :remove="!v.isDefault && !disabled"
            @remove="diFangLiuCunRemoveClick(k)"
            :taxCode="v.code">{{ v.name }}</accessory-input>
          <accessory-input
            ref="DI_FANG_LIU_CUN_EDIT"
            taxCategory="local-tax"
            taxCollection="commom"
            :remove="!disabled"
            @remove="diFangLiuCunRemoveClick(-1)"
            :taxCode="diFangLiuCunObj.otherArr[diFangLiuCunObj.index].code"
            v-if="diFangLiuCunObj.index >= 0">
            <el-select v-model="diFangLiuCunObj.index" placeholder="请选择">
              <el-option v-for="(v, k) in diFangLiuCunObj.otherArr" :label="v.name" :key="v.name" :value="k"></el-option>
            </el-select>
          </accessory-input>
        </div>
      </el-form-item>

    </el-form>

    <div style="padding: 30px 0 30px 100px;">
      <el-button @click="onStepClick">上一步</el-button>
      <el-button type="primary" @click="nextStepClick">下一步</el-button>
      <el-button v-if="$route.query.state === '0' || $route.query.state === '1'" type="primary" @click="saveAndBackClick">保存并返回列表</el-button>
      <el-button @click="backList">取消</el-button>
    </div>
  </div>
</template>

<script>
  import {get, post} from '../../../store/api'
  import SectionInput from '../com/sectionInput'
  import AccessoryInput from '../com/accessoryInput'
  export default {
    name: "TaxDiscountStep3",
    components: {
      SectionInput,
      AccessoryInput
    },
    data() {
      return {
        form: {
          // 三万以下业务量
          sanWanYiXiaYeWuLiang: '',
          // 三万以上业务量
          sanWanYiShangYeWuLiang: '',
        },
        // 地方留存 select
        diFangLiuCunObj: {
          otherArr: [],
          index: -1,
          // 填写的数组
          inputArr: [],
          dataArr: []
        },
        shuiLvShuXingBiao: [],
        // 是否可以编辑
        disabled: false
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
    mounted() {
      this.getShuiLvShuXingBiao().then(() => {
        this.getStep3data()
      }).catch((e) => {
      })
      this.disabled = !(this.$route.query.state === '0' || this.$route.query.state === '1')
    },
    methods: {
      // 地方留存删除按钮点击
      diFangLiuCunRemoveClick(index) {
        if (index < 0) {
          this.diFangLiuCunObj.index = -1
        } else {
          const inputItem = this.diFangLiuCunObj.inputArr.splice(index, 1)
          this.diFangLiuCunObj.otherArr.push(inputItem[0])
        }
      },
      // 获取第二部数据
      getStep3data() {
        get('/api/salemgt/taxLanding/tax/taxLandingProperty/info/local', {
          taxLandingId: this.$route.query.id
        }).then((data) => {
          if (data && data.taxLandingTaxDTOList[0].items.length > 0) {
            // 三万以下基本税率
            // 业务配比期望值
            const yeWuPeiBiQiWang = data.taxLandingPropertyDTOS.filter((item) => {
              return item.property === 'business-ratio'
            })
            if (yeWuPeiBiQiWang && yeWuPeiBiQiWang.length > 0) {
              const item = yeWuPeiBiQiWang[0]
              item.items.forEach((cell) => {
                const code = parseInt(cell.code)
                if (cell.name === '三万以下业务量') {
                  this.form.sanWanYiXiaYeWuLiang = code
                } else {
                  this.form.sanWanYiShangYeWuLiang = code
                }
              })
            }
            // 地方留存政策
            const diFangLiuCunObj = data.taxLandingTaxDTOList[0]
            const inputArr = []
            const otherArr = []
            this.shuiLvShuXingBiao.forEach((item) => {
              let state = false
              diFangLiuCunObj.items.forEach((item1) => {
                if (item.code === item1.taxCode) {
                  item.taxRate = item1.taxRate
                  inputArr.push(item)
                  state = true
                }
              })
              if (!state) {
                otherArr.push(item)
              }
            })
            this.diFangLiuCunObj.inputArr = inputArr
            this.diFangLiuCunObj.otherArr = otherArr
          }
        }).catch(() => {
        })
      },
      // 获取税率类型
      getShuiLvShuXingBiao() {
        return new Promise((resolve, reject) => {
          get('/api/salemgt/taxLanding/tax/taxTypes', {}).then((result) => {
            // 排序
            this.shuiLvShuXingBiao = result.filter((item) => {
              return item.isDefault
            })
            this.shuiLvShuXingBiao = this.shuiLvShuXingBiao.concat(result.filter((item) => {
              return !item.isDefault
            }))
            // 设置返税适用周期
            this.diFangLiuCunObj.inputArr = []
            this.diFangLiuCunObj.otherArr = []
            result.forEach((item) => {
              if (item.isDefault) {
                this.diFangLiuCunObj.inputArr.push(item)
              } else {
                this.diFangLiuCunObj.otherArr.push(item)
              }
            })
            resolve()
          }).catch((e) => {
            reject()
          })
        })
      },
      // 地方留存政策添加其他
      diFangLiuCunAddClick() {
        if (this.diFangLiuCunObj.otherArr.length) {
          if (this.diFangLiuCunObj.index >= 0) {
            const inputItem = this.diFangLiuCunObj.otherArr[this.diFangLiuCunObj.index]
            const num = this.$refs[`DI_FANG_LIU_CUN_EDIT`].form.inputData
            this.$refs[`DI_FANG_LIU_CUN_EDIT`].setData({
              taxRate: 0
            })
            inputItem.taxRate = num ? num : 0
            this.diFangLiuCunObj.inputArr.push(inputItem)
            this.diFangLiuCunObj.otherArr.splice(this.diFangLiuCunObj.index, 1)
          }
          if (this.diFangLiuCunObj.otherArr.length > 0) {
            this.diFangLiuCunObj.index = 0
          } else {
            this.diFangLiuCunObj.index = -1
          }
        }
      },
      // 地方留存政策校验
      diFangLiuCheck() {
        const arr = []
        this.diFangLiuCunObj.inputArr.forEach((v, k) => {
          const str = `DI_FANG_LIU_CUN_${k}`
          const p = this.$refs[str][0].check()
          arr.push(p)
        })
        if (this.diFangLiuCunObj.index >= 0) {
          arr.push(this.$refs[`DI_FANG_LIU_CUN_EDIT`].check())
        }
        return new Promise((resolve, reject) => {
          Promise.all(arr).then((data) => {
            this.diFangLiuCunObj.dataArr = data
            resolve()
          }).catch(() => {
            reject()
          })
        })
      },
      // 业务配比期望值校验
      yeWuPeiBiCheck() {
        const down = this.form.sanWanYiXiaYeWuLiang
        const up = this.form.sanWanYiShangYeWuLiang
        if (this.checkPercentage(down) && this.checkPercentage(up)) {
          return Promise.resolve()
        }
        this.$message.error('业务配比期望值必须是0-100');
        return Promise.reject()
      },
      // 校验100
      checkPercentage(num) {
        if (num === '') {
          return true
        }
        if (typeof num === 'string') {
          return false
        }
        if (num < 0 || num > 100) {
          return false
        }
        return true
      },
      check() {
        return Promise.all([this.diFangLiuCheck(), this.yeWuPeiBiCheck()])
      },
      // 保存数据
      saveData() {
        return new Promise((resolve, reject) => {
          this.check().then(() => {
            let submitData = {}
            const id = parseInt(this.$route.query.id)
            submitData.taxLandingId = id
            const items = []
            submitData.taxLandingPropertyDTOS = []
            if (this.form.sanWanYiXiaYeWuLiang !== '') {
              items.push({
                "code": this.form.sanWanYiXiaYeWuLiang,
                "name": '三万以下业务量'
              })
            }
            if (this.form.sanWanYiShangYeWuLiang !== '') {
              items.push({
                "code": this.form.sanWanYiShangYeWuLiang,
                "name": '三万以上业务量'
              })
              submitData.taxLandingPropertyDTOS.push({
                "items": items,
                "property": "business-ratio"
              })
            }
            // 地方留存政策
            // submitData.taxLandingPropertyDTOS.push({
            //   "items": [
            //     {
            //       "code": true,
            //       "name": '地方留存政策'
            //     }
            //   ],
            //   "property": "local-tax"
            // })
            submitData.taxLandingTaxDTOList = [{
              "items": this.diFangLiuCunObj.dataArr,
              "taxCategory": "local-tax",
              "taxCollection": "commom"
            }]
            const url = `/api/salemgt/taxLanding/tax/taxLandingPropertyTax`
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
          }).catch(() => {
            reject()
          })
        })
      },
      // 上一步
      onStepClick() {
        this.$router.push({ path: '/main/taxDiscount/step2', query: this.$route.query })
      },
      // 下一步按钮点击
      nextStepClick() {
        if (this.$route.query.state === '2') {
          this.$router.push({ path: '/main/taxDiscount/step4', query: this.$route.query })
        } else {
          this.saveData().then(() => {
            this.$router.push({ path: '/main/taxDiscount/step4', query: this.$route.query })
          }).catch((e) => {
            console.log('e = ', e)
          })
        }
      },
      // 保存并返回列表
      saveAndBackClick() {
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

  .tax-discount-step-2 {
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
    .interval-line {
      margin: 30px 0;
      height: 1px;
      background-color: #ddd;
    }
    .di-fang-liu-cun-input-box {
      display: flex;
      flex-wrap: wrap;
    }
  }

</style>

