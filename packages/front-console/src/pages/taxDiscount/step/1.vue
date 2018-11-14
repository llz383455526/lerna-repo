<template>
  <div class="tax-discount-step-1">
    <p class="page-title">{{countTitle}}税优地资源信息(第一步)</p>
    <el-form :disabled="disabled" :rules="rules" class="form-box" ref="form" :model="form" label-width="150px">
      <el-form-item prop="name" label="税优地名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="ziYuanLoctionBeiZhu" label="资源地位置">
        <div class="postion-box zi-yuan-di-location">
          <area-select
            type="all"
            :disabled="disabled"
            class="postion-sel"
            :class="{'zi-yuan-loction-check': !form.ziYuanLoctionCheck}"
            v-model="form.ziYuanLoction"
            :level="2"
            :isLinkage="true"
            :data="pcaa"/>
          <span class="beizhu-title">备注地址</span>
          <el-input :disabled="disabled" class="beizhu" v-model="form.ziYuanLoctionBeiZhu"></el-input>
        </div>
      </el-form-item>
      <el-form-item prop="fuZeName" label="负责人姓名">
        <el-input v-model="form.fuZeName"></el-input>
      </el-form-item>
      <el-form-item label="负责人电话">
        <el-input v-model="form.fuZePhone" type="number"></el-input>
      </el-form-item>
      <el-form-item prop="shiYongHangYe" label="适用行业">
        <el-checkbox-group v-model="form.shiYongHangYe">
          <el-checkbox v-for="(v, k) in shiYongHangYeArr" :key="v.value" :label="v.text"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <div class="interval-line"></div>

      <el-form-item prop="daiKaiZiLiao" label="能否代开">
        <el-radio-group v-model="form.isDaiKai">
          <el-radio label="无"></el-radio>
          <el-radio label="有"></el-radio>
        </el-radio-group>
        <div v-if="form.isDaiKai === '有'">
          <el-input type="textarea" placeholder="请输入代开所需材料" v-model="form.daiKaiZiLiao"></el-input>
        </div>
      </el-form-item>

    </el-form>

    <div style="padding: 30px 0 30px 100px;">
      <el-button @click="backList">返回</el-button>
      <el-button type="primary" @click="nextStepClick">下一步</el-button>
      <el-button v-if="$route.query.state === '0' || $route.query.state === '1'" type="primary" @click="saveAndBackClick">保存并返回列表</el-button>
    </div>
  </div>
</template>

<script>
  import {pcaa, pca} from 'area-data'
  import {get, post, importPost} from '../../../store/api'
  export default {
    name: "TaxDiscountStep1",
    data() {
      return {
        form: {
          // 税地名称
          name: null,
          // 资源地位置
          ziYuanLoction: [],
          // 备注地址
          ziYuanLoctionBeiZhu: null,
          // 资源地位置校验
          ziYuanLoctionCheck: true,
          // 负责人姓名
          fuZeName: null,
          // 负责人电话
          fuZePhone: null,
          // 适用行业
          shiYongHangYe: [],
          // 能否代开
          isDaiKai: '无',
          // 代开资料
          daiKaiZiLiao: null,
        },
        // 地区
        pcaa: pcaa,
        // 字段校验
        rules: {
          name: [
            {required: true, message: '请输入税地名称', trigger: 'blur'}
          ],
          ziYuanLoctionBeiZhu: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (this.checkZiYuanLocation()) {
                this.form.ziYuanLoctionCheck = true
                callback()
              } else {
                this.form.ziYuanLoctionCheck = false
                callback(new Error('请选择或者输入资源地位置'))
              }
            }
          }],
          fuZeName: [
            {required: true, message: '请输入负责人姓名', trigger: 'blur'}
          ],
          shiYongHangYe: [
            {type: 'array', required: true, message: '请至少选择一个', trigger: 'change'}
          ],
          daiKaiZiLiao: [{
            required: true, trigger: 'blur', validator: (rule, value, callback) => {
              if (this.form.isDaiKai === '有' && !this.form.daiKaiZiLiao) {
                callback(new Error('请输入代开资料'))
              } else {
                callback()
              }
            }
          }]
        },
        // 适用行业数据
        shiYongHangYeArr: [],
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
      this.getShiYongHangYe()
      this.disabled = !(this.$route.query.state === '0' || this.$route.query.state === '1')
      this.getStep1Data()
    },
    methods: {
      // 校验资源地
      checkZiYuanLocation() {
        return this.form.ziYuanLoction && this.form.ziYuanLoction.length > 0
      },
      // 获取适用行业
      getShiYongHangYe() {
        get('/api/sysmgr-web/commom/option?enumType=IndustryType', {})
          .then(result => {
            this.shiYongHangYeArr = result
          }).catch(() => {})
      },
      // 数据校验
      check() {
        return new Promise((resolve, reject) => {
          this.$refs['form'].validate((valid) => {
            if (valid) {
              resolve()
            } else {
              this.$message.error('请完成填写');
              reject({
                type: 'input'
              })
              return false;
            }
          })
        })
      },
      // 保存数据
      saveData() {
        return new Promise((resolve, reject) => {
          this.check().then(() => {
            let submitData = {}
            if (this.$route.query.id) {
              submitData.id = parseInt(this.$route.query.id)
            }
            // 税优地名称
            submitData.name = this.form.name
            // 资源地位置 ziYuanLoction
            const ziYuanLoction1 = this.form.ziYuanLoction[0]
            for (let key in ziYuanLoction1) {
              submitData.provinceCode = key
              submitData.province = ziYuanLoction1[key]
            }
            const ziYuanLoction2 = this.form.ziYuanLoction[1]
            for (let key in ziYuanLoction2) {
              submitData.cityCode = key
              submitData.city = ziYuanLoction2[key]
            }
            const ziYuanLoction3 = this.form.ziYuanLoction[2]
            for (let key in ziYuanLoction3) {
              submitData.areaCode = key
              submitData.area = ziYuanLoction3[key]
            }
            submitData.addr = this.form.ziYuanLoctionBeiZhu
            // 负责人姓名
            submitData.chargePerson = this.form.fuZeName
            // 负责人电话
            submitData.chargePersonPhone = this.form.fuZePhone

            submitData.taxLandingPropertyDTOList = []
            const taxLandingId = this.$route.query.id ? parseInt(this.$route.query.id) : null
            // 适用行业
            const shiYongHangYeArr = []
            this.form.shiYongHangYe.forEach((name) => {
              this.shiYongHangYeArr.forEach((obj) => {
                if (obj.text === name) {
                  shiYongHangYeArr.push({
                    "code": obj.value,
                    "name": obj.text
                  })
                }
              })
            })
            console.log('shiYongHangYeArr = ', shiYongHangYeArr)
            submitData.taxLandingPropertyDTOList.push({
              items: shiYongHangYeArr,
              property: 'industry'
            })

            // 能否代开
            const isDaiKai = this.form.isDaiKai !== '无'
            submitData.taxLandingPropertyDTOList.push({
              items: [
                {
                  "code": isDaiKai,
                  "memo": isDaiKai ? this.form.daiKaiZiLiao : null
                }
              ],
              property: 'replace-open'
            })
            const url = `/api/salemgt/taxLanding/tax/taxLandingProperty`
            post(url, submitData).then((data) => {
              this.$message({
                message: '提交成功',
                type: 'success'
              });
              resolve(data)
            }).catch(() => {
              this.$message.error('提交失败');
              reject()
            })
          }).catch(() => {
            reject()
          })
        })
      },
      // 获取第一步数据
      getStep1Data() {
        if (this.$route.query.id) {
          get('/api/salemgt/taxLanding/tax/taxLandingProperty/info', {
            taxLandingId: this.$route.query.id
          }).then((data) => {
            this.dataParsing(data)
          }).catch((e) => {
            console.log('e = ', e)
            this.$message.error('数据获取失败');
          })
        }
      },
      // 数据解析
      dataParsing(data) {
        // 税优地名称
        this.form.name = data.name
        // 资源地位置 ziYuanLoction
        this.form.ziYuanLoction = [data.province, data.city, data.area]
        this.form.ziYuanLoctionBeiZhu = data.addr
        // 负责人姓名
        this.form.fuZeName = data.chargePerson
        // 负责人电话
        this.form.fuZePhone = data.chargePersonPhone
        // 适用行业
        const shiYongHangYeObjArr = data.taxLandingPropertyDTOList.filter((item) => {
          return item.property === 'industry'
        })
        if (shiYongHangYeObjArr.length > 0 && shiYongHangYeObjArr[0].items.length > 0) {
          this.form.shiYongHangYe = shiYongHangYeObjArr[0].items.map((item) => {
            return item.name
          })
        }
        // 能否代开
        const nengFouDaikaiObjArr = data.taxLandingPropertyDTOList.filter((item) => {
          return item.property === 'replace-open'
        })
        if (nengFouDaikaiObjArr.length > 0 && nengFouDaikaiObjArr[0].items.length > 0) {
          const item = nengFouDaikaiObjArr[0].items[0]
          this.form.isDaiKai = item.code === 'true' ? '有' : '无'
          this.form.daiKaiZiLiao = item.code === 'true' ? item.memo : null
        }
      },
      // 下一步按钮点击
      nextStepClick() {
        if (this.$route.query.state === '2') {
          const query = this.$route.query
          this.$router.push({ path: '/main/taxDiscount/step2', query: query })
        } else {
          this.saveData().then((data) => {
            const query = this.$route.query
            if (!this.$route.query.id) {
              query.id = data
            }
            this.$router.push({ path: '/main/taxDiscount/step2', query: query })
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

  .tax-discount-step-1 {
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

<style lang="scss">
  .tax-discount-step-1 {
    .area-select-wrap {
      .area-select {
        height: 40px;
        .area-selected-trigger {
          padding: 0 10px;
        }
      }
    }
  }

  .el-form-item.is-success .el-input__inner {
    border: 1px solid #e4e7ed;
  }

</style>
