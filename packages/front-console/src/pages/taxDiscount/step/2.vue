<template>
  <div class="tax-discount-step-2">
    <p class="page-title">{{countTitle}}税优地资源信息(第二步)</p>
    <el-form :disabled="disabled" class="form-box" ref="form" :model="form" label-width="150px">
      <el-form-item label="三万以下基本税率">
        <div>
          <el-switch v-model="form.isSupport3w"></el-switch>
          <span style="padding-left: 10px">是否支持三万以下免征条款</span>
        </div>
        <div class="input-section-box" v-show="form.isSupport3w">
          <section-input
            v-for="(v, k) in shuiLvShuXingBiaoArr"
            taxCategory="base-tax"
            :is-show-free="true"
            taxCollection="30thousand-down"
            :taxCode="v.code"
            :taxLandingId="$route.query.id"
            :disabled="disabled"
            :ref="`BASE_3_DOWN_${v.code}`"
            :key="v.code"
            :title="v.name"/>
        </div>
      </el-form-item>

      <el-form-item :label="form.isSupport3w ? '三万以上基本税率' : '基本税率'">
        <div class="input-section-box" style="padding-top: 5px">
          <section-input
            v-for="(v, k) in shuiLvShuXingBiaoArr"
            taxCategory="base-tax"
            :taxLandingId="$route.query.id"
            :taxCollection="form.isSupport3w ? '30thousand-up' : 'commom'"
            :taxCode="v.code"
            :disabled="disabled"
            :ref="`BASE_3_UP_${v.code}`"
            :key="v.code"
            :title="v.name"/>
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
  export default {
    name: "TaxDiscountStep2",
    components: {
      SectionInput
    },
    data() {
      return {
        form: {
          // 是否支持三万一下免征条款
          isSupport3w: false
        },
        // 税率属性表
        shuiLvShuXingBiaoArr: [],
        // 是否可以编辑
        disabled: false,
        // 三万一下数据数据
        base3DownDataArr: [],
        // 三万以上数据数据
        base3UpDataArr: [],
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
        this.getStep2data()
      }).catch(() => {})
      this.disabled = this.$route.query.state === '2'
    },
    methods: {
      // 获取税率类型
      getShuiLvShuXingBiao() {
        return new Promise((resolve, reject) => {
          get('/api/salemgt/taxLanding/tax/taxTypes', {}).then((result) => {
            this.shuiLvShuXingBiaoArr = result
            resolve()
          }).catch(() => {
            this.$message.error('获取税率类型失败');
            reject()
          })
        })
      },
      // 校验三万一下的基本税率
      checkBase3Down() {
        return new Promise((resolve, reject) => {
          const arr = []
          this.shuiLvShuXingBiaoArr.forEach((item) => {
            arr.push(this.$refs[`BASE_3_DOWN_${item.code}`][0].check())
          })
          Promise.all(arr).then((data) => {
            this.base3DownDataArr = data
            resolve()
          }).catch(() => {
            reject({
              type: 'input'
            })
          })
        })
      },
      // 校验三万以上
      checkBase3Up() {
        return new Promise((resolve, reject) => {
          const arr = []
          this.shuiLvShuXingBiaoArr.forEach((item) => {
            const dom = this.$refs[`BASE_3_UP_${item.code}`][0]
            arr.push(dom.check())
          })
          Promise.all(arr).then((data) => {
            this.base3UpDataArr = data
            resolve()
          }).catch(() => {
            reject({
              type: 'input'
            })
          })
        })
      },
      // 获取第二部数据
      getStep2data() {
        get('/api/salemgt//taxLanding/tax/taxLandingProperty/info/base', {
          taxLandingId: this.$route.query.id
        }).then((result) => {
          if (result && result.taxLandingPropertyDTOS.length > 0) {
            // 三万以下基本税率
            const sanWanYiXiaObjArr = result.taxLandingPropertyDTOS
            if (sanWanYiXiaObjArr && sanWanYiXiaObjArr.length > 0) {
              const item = sanWanYiXiaObjArr[0].items[0]
              this.form.isSupport3w = item.code === 'true'
            }
            if (this.form.isSupport3w) {
              const sanWanYiXiaArr = result.taxLandingTaxDTOList.filter((item) => {
                return item.taxCollection === '30thousand-down'
              })
              this.shuiLvShuXingBiaoArr.forEach((item1) => {
                const dom = this.$refs[`BASE_3_DOWN_${item1.code}`][0]
                sanWanYiXiaArr[0].items.forEach((item) => {
                  if (item.taxCode === dom.taxCode) {
                    dom.setData(item)
                  }
                })
              })
            }
            // 三万元以上
            const code = this.form.isSupport3w ? '30thousand-up' : 'commom'
            const sanWanYiShangArr = result.taxLandingTaxDTOList.filter((item) => {
              return item.taxCollection === code
            })
            this.shuiLvShuXingBiaoArr.forEach((item) => {
              const dom = this.$refs[`BASE_3_UP_${item.code}`][0]
              sanWanYiShangArr[0].items.forEach((item) => {
                if (item.taxCode === dom.taxCode) {
                  dom.setData(item)
                }
              })
            })
          }
        }).catch(() => {
        })
      },
      // 数据校验
      check() {
        const arr = [
          this.checkBase3Up()
        ]
        if (this.form.isSupport3w) {
          arr.push(this.checkBase3Down())
        }
        return Promise.all(arr)
      },
      // 保存数据
      saveData() {
        return new Promise((resolve, reject) => {
          this.check().then(() => {
            let submitData = {}
            submitData.taxLandingId = parseInt(this.$route.query.id)
            submitData.taxLandingPropertyDTOS = []
            submitData.taxLandingTaxDTOList = []
            // 三万以下基本税率
            submitData.taxLandingPropertyDTOS.push({
              "items": [
                {
                  "code": this.form.isSupport3w
                }
              ],
              "property": "base"
            })
            if (this.form.isSupport3w) {
              submitData.taxLandingTaxDTOList.push({
                "items": this.base3DownDataArr,
                "taxCategory": "base-tax",
                "taxCollection": "30thousand-down",
              })
            }
            submitData.taxLandingTaxDTOList.push({
              "items": this.base3UpDataArr,
              "taxCategory": "base-tax",
              "taxCollection": this.form.isSupport3w ? '30thousand-up' : 'commom'
            })
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
          }).catch((e) => {
            console.log(e)
            reject()
          })
        })
      },
      // 上一步
      onStepClick() {
        this.$router.replace({ path: '/main/taxDiscount/step1', query: this.$route.query })
      },
      // 下一步按钮点击
      nextStepClick() {
        if (this.$route.query.state === '2') {
          this.$router.push({ path: '/main/taxDiscount/step3', query: this.$route.query })
        } else {
          this.saveData().then(() => {
            this.$router.push({ path: '/main/taxDiscount/step3', query: this.$route.query })
          }).catch(() => {})
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
  }

</style>

