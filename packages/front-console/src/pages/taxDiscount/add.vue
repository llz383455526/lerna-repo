<!--新建税务地-->
<template>
  <div class="tax-discount-add">
    <p class="page-title">新增税优地资源信息</p>
    <el-form :disabled="dataDisabled" :rules="rules" class="form-box" ref="form" :model="form" label-width="150px">
      <el-form-item prop="name" label="税优地名称">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item prop="ziYuanLoctionBeiZhu" label="资源地位置">
        <div class="postion-box zi-yuan-di-location">
          <area-select
            type="all"
            :disabled="dataDisabled"
            class="postion-sel"
            :class="{'zi-yuan-loction-check': !form.ziYuanLoctionCheck}"
            v-model="form.ziYuanLoction"
            :level="2"
            :isLinkage="true"
            :data="pcaa"/>
          <span class="beizhu-title">备注地址</span>
          <el-input :disabled="dataDisabled" class="beizhu" v-model="form.ziYuanLoctionBeiZhu"></el-input>
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
            :disabled="dataDisabled"
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
            :taxCollection="form.isSupport3w ? '30thousand-up' : 'commom'"
            :taxCode="v.code"
            :disabled="dataDisabled"
            :ref="`BASE_3_UP_${v.code}`"
            :key="v.code"
            :title="v.name"/>
        </div>
      </el-form-item>

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
          <el-button type="primary" size="mini" @click="diFangLiuCunAddClick" :disabled="this.diFangLiuCunObj.otherArr.length === 0">添加其他条目</el-button>
        </div>
        <div class="di-fang-liu-cun-input-box">
          <accessory-input
            v-for="(v, k) in diFangLiuCunObj.inputArr" :key="k"
            :ref="`DI_FANG_LIU_CUN_${k}`"
            taxCategory="local-tax"
            taxCollection="commom"
            :taxRate="v.taxRate"
            :disabled="dataDisabled"
            :remove="!v.isDefault && !dataDisabled"
            @remove="diFangLiuCunRemoveClick(k)"
            :taxCode="v.code">{{ v.name }}</accessory-input>

          <accessory-input
            ref="DI_FANG_LIU_CUN_EDIT"
            taxCategory="local-tax"
            taxCollection="commom"
            :remove="!dataDisabled"
            @remove="diFangLiuCunRemoveClick(-1)"
            :taxCode="diFangLiuCunObj.otherArr[diFangLiuCunObj.index].code"
            v-if="diFangLiuCunObj.index >= 0">
            <el-select v-model="diFangLiuCunObj.index" placeholder="请选择">
              <el-option v-for="(v, k) in diFangLiuCunObj.otherArr" :label="v.name" :key="v.name" :value="k"></el-option>
            </el-select>
          </accessory-input>
        </div>
      </el-form-item>

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

      <el-form-item prop="name" label="返税阶梯设置">
        <div style="padding-bottom: 20px">
          <el-button size="mini" type="primary" @click="addQuJianClick">添加区间</el-button>
          <span style="padding-left: 100px;">计算时是否扣除起税点金额</span>
          <el-switch
            v-model="fanShuiJieTiData.shiFouKouChuQiZhengDian">
          </el-switch>
        </div>
        <el-table
          :data="fanShuiJieTiData.dataArr"
          class="fan-shui-jie-ti"
          style="width: 100%">
          <el-table-column
            prop="index"
            label="区间序号"
            align="center"
            width="80">
          </el-table-column>
          <el-table-column align="center" label="设置区间">
            <el-table-column
              prop="num1"
              align="center">
            </el-table-column>
            <el-table-column
              prop="type1"
              align="center">
            </el-table-column>
            <el-table-column
              align="center">
              <span slot-scope="scope">纳税金额</span>
            </el-table-column>
            <el-table-column
              prop="type2"
              align="center">
            </el-table-column>
            <el-table-column
              prop="num2"
              align="center">
            </el-table-column>
          </el-table-column>
          <el-table-column
            prop="ratio"
            label="反税比例	"
            align="center"
            width="200">
          </el-table-column>
          <el-table-column
            align="center"
            label="操作"
            width="100">
            <template slot-scope="scope" v-if="scope.row.index === fanShuiJieTiData.dataArr.length && !dataDisabled">
              <el-button size="mini" type="danger" icon="el-icon-delete" @click="removeQuJianClick" circle></el-button>
              <el-button size="mini" type="primary" icon="el-icon-edit-outline" @click="editQuJianClick"
                         circle></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>

      <div class="interval-line"></div>

      <el-form-item label="税优地合同">
        <input v-if="!dataDisabled" type="file" @change="heTongChange"/>
        <template>
          <a
            v-for="(v, k) in attachmentModelList"
            :key="k"
            target="_blank"
            :href="`/api/sysmgr-web/file/download?downloadCode=${v.downloadCode}`">{{v.displayname}}</a>
        </template>
      </el-form-item>

    </el-form>

    <div style="padding: 30px 0 30px 100px;">
      <el-button v-if="!dataDisabled" type="primary" @click="check">确定</el-button>
      <el-button @click="$router.replace('/main/taxDiscount/list')">{{ dataDisabled ? '返回' : '取消' }}</el-button>
    </div>

    <!--返税阶梯设置-->
    <el-dialog
      title="提示"
      :visible.sync="fanShuiJieTiData.popShow"
      width="500px"
      class="fan-shui-jie-ti-pop">
      <el-form v-if="fanShuiJieTiData.popShow" :model="fanShuiJieTiData.popData" :rules="fanShuiJieTiData.rules" ref="FanShuiJitTiPop" label-width="80px">
        <el-form-item label="起始值">
          <span>{{ fanShuiJieTiData.popData.type1 }}&nbsp;&nbsp;</span>
          <span>{{ fanShuiJieTiData.popData.num1 }}</span>
        </el-form-item>
        <el-form-item prop="num2" label="结束值">
          <el-input placeholder="请输入内容" type="number" v-model.number="fanShuiJieTiData.popData.num2" class="input-with-select">
            <el-select v-model="fanShuiJieTiData.popData.type2" slot="prepend" placeholder="请选择">
              <el-option label="小于等于" value="小于等于"></el-option>
              <el-option label="小于" value="小于"></el-option>
            </el-select>
          </el-input>
        </el-form-item>
        <el-form-item prop="ratio" label="反税比例">
          <el-input type="number" v-model.number="fanShuiJieTiData.popData.ratio">
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
  import {pcaa, pca} from 'area-data'
  import SectionInput from './com/sectionInput'
  import AccessoryInput from './com/accessoryInput'
  import {get, post, importPost} from '../../store/api'

  export default {
    name: "add",
    components: {
      SectionInput,
      AccessoryInput
    },
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
          // 是否支持三万一下免征条款
          isSupport3w: false,
          // 适用周期
          shiYongWeek: '通用周期',
          // 通用周期
          tongYongWeek: '按月统计',
          // 指定周期
          zhiDingWeek: new Date(),
          // 返税适用周期备注
          fanShuiShiYongWeekBeiZhu: null,
          // 三万以下业务量
          sanWanYiXiaYeWuLiang: null,
          // 三万以上业务量
          sanWanYiShangYeWuLiang: null,
        },
        // 适用行业数据
        shiYongHangYeArr: [],
        // 税率属性表
        shuiLvShuXingBiaoArr: [],
        // 三万一下数据数据
        base3DownDataArr: [],
        // 三万以上数据数据
        base3UpDataArr: [],
        // 地方留存 select
        diFangLiuCunObj: {
          otherArr: [],
          index: -1,
          // 填写的数组
          inputArr: [],
          dataArr: []
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
                callback(new Error('请选择或者输入资源地位置'))
              } else {
                callback()
              }
            }
          }],
          diFangLiuCun: [
            {required: true, message: '请输入负责人姓名', trigger: 'blur'}
          ]
        },
        // 返税阶梯数据
        fanShuiJieTiData: {
          // 是否扣除起征点
          shiFouKouChuQiZhengDian: false,
          // 返税阶梯弹窗
          popShow: false,
          dataArr: [],
          popData: {
            index: 0,
            num1: null,
            type1: '大于等于',
            type2: '小于等于',
            num2: null,
            ratio: null
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
            }],
            ratio: [{
              required: true, trigger: 'blur', validator: (rule, value, callback) => {
                const type = typeof this.fanShuiJieTiData.popData.ratio
                let str = null
                if (type === 'number') {
                  const num = this.fanShuiJieTiData.popData.ratio
                  if (num < 0 || num > 100) {
                    str = '数值超出范围（0-100）'
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
        // 合同数据
        heTongInputData: null,
        // 失能数据
        dataDisabled: false,
        // 文件ID
        contractAttachmentIds: null,
        // 合同列表
        attachmentModelList: []
      }
    },
    watch: {
      'form.ziYuanLoction'() {
        this.$refs.form.validateField('ziYuanLoctionBeiZhu')
      },
      'form.ziYuanLoctionBeiZhu'() {
        this.$refs.form.validateField('ziYuanLoctionBeiZhu')
      },
      'form.isDaiKai'() {
        if (this.form.isDaiKai === '无') {
          this.$refs.form.validateField('daiKaiZiLiao')
        }
      },
      'form.sanWanYiXiaYeWuLiang'() {
        const type = typeof this.form.sanWanYiXiaYeWuLiang
        if (type === 'number') {
          const num = this.form.sanWanYiXiaYeWuLiang
          if (num < 0) {
            this.form.sanWanYiXiaYeWuLiang = 0
          } else if (num > 100) {
            this.form.sanWanYiXiaYeWuLiang = 100
          }
        }
      },
      'form.sanWanYiShangYeWuLiang'() {
        const type = typeof this.form.sanWanYiShangYeWuLiang
        if (type === 'number') {
          const num = this.form.sanWanYiShangYeWuLiang
          if (num < 0) {
            this.form.sanWanYiShangYeWuLiang = 0
          } else if (num > 100) {
            this.form.sanWanYiShangYeWuLiang = 100
          }
        }
      }
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
      // 获取适用行业
      getShiYongHangYe() {
        get('/api/sysmgr-web/commom/option?enumType=IndustryType', {})
          .then(result => {
            this.shiYongHangYeArr = result
          }).catch(() => {})
      },
      // 获取税率类型
      getShuiLvShuXingBiao() {
        return new Promise((resolve, reject) => {
          get('/api/salemgt/taxLanding/tax/taxTypes', {}).then((result) => {
            this.shuiLvShuXingBiaoArr = result
            // 排序
            this.shuiLvShuXingBiao = result.filter((item) => {
              return item.isDefault
            })
            this.shuiLvShuXingBiao = this.shuiLvShuXingBiao.concat(result.filter((item) => {
              return !item.isDefault
            }))
            // 设置返税适用周期
            if (!this.$route.query.id) {
              this.diFangLiuCunObj.inputArr = []
              this.diFangLiuCunObj.otherArr = []
              result.forEach((item) => {
                if (item.isDefault) {
                  this.diFangLiuCunObj.inputArr.push(item)
                } else {
                  this.diFangLiuCunObj.otherArr.push(item)
                }
              })
            }
            resolve()
          }).catch(() => {
            reject()
          })
        })
      },
      // 合同改变的时候调用
      heTongChange(e) {
        if (e && e.target && e.target.files && e.target.files.length > 0) {
          const file = e.target.files[0]
          const fileSize = file.size
          if (fileSize > (10 * 1024 * 1024)) {
            this.$message.error('文件大小不能超过10M');
            e.target.outerHTML = e.target.outerHTML;
          } else {
            this.heTongInputData = file
          }
          // const suffix = file.name.split('.').pop().toLowerCase()
          // const imageFormats = new Set(['doc', 'docx', 'pdf', 'png', 'jpg', 'jpeg'])
          // if (imageFormats.has(suffix)) {
          //   this.heTongInputData = file
          // } else {
          //   this.$message.error('文件格式不正确，允许的格式为 .doc, .docx, .pdf, .png, .jpg, .jpeg');
          // }
        }
      },
      // 上传文件
      upFile() {
        if (!this.heTongInputData) {
          if (this.attachmentModelList && this.attachmentModelList.length > 0) {
            return Promise.resolve(this.attachmentModelList[0])
          }
          return Promise.resolve({})
        }
        const formData = new FormData()
        formData.append('fileName', this.heTongInputData.name)
        formData.append('file', this.heTongInputData)
        formData.append('targetType', 'tax_landing_contract')
        return importPost('/api/sysmgr-web/file/upload', formData)
      },
      // 添加区间
      addQuJianClick() {
        if (this.fanShuiJieTiData.dataArr.length === 0) {
          this.fanShuiJieTiData.popData = {
            index: 1,
            num1: 0,
            type1: '大于等于',
            type2: '小于等于',
            num2: null,
            ratio: null
          }
        } else {
          const lastItem = this.fanShuiJieTiData.dataArr[this.fanShuiJieTiData.dataArr.length - 1]
          this.fanShuiJieTiData.popData = {
            index: lastItem.index + 1,
            num1: lastItem.num2,
            type1: lastItem.type2 === '小于' ? '大于等于' : '大于',
            type2: '小于等于',
            num2: null,
            ratio: null
          }
        }
        this.fanShuiJieTiData.isAdd = true
        this.fanShuiJieTiData.popShow = true
      },
      // 编辑区间
      editQuJianClick() {
        const item = this.fanShuiJieTiData.dataArr[this.fanShuiJieTiData.dataArr.length - 1]
        this.fanShuiJieTiData.popData = {
          ...item
        }
        this.fanShuiJieTiData.isAdd = false
        this.fanShuiJieTiData.popShow = true
      },
      // 删除区间
      removeQuJianClick(e) {
        this.$confirm('确定删除此区间嘛?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.fanShuiJieTiData.dataArr.pop()
        }).catch(() => {
        });
      },
      // 校验资源地
      checkZiYuanLocation() {
        return (this.form.ziYuanLoction && this.form.ziYuanLoction.length > 0) || this.form.ziYuanLoctionBeiZhu
      },
      // 校验当前界面数据
      checkCurrentPage() {
        return new Promise((resolve, reject) => {
          this.$refs['form'].validate((valid) => {
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
      // 地方留存政策添加其他
      diFangLiuCunAddClick() {
        if (this.diFangLiuCunObj.otherArr.length) {
          if (this.diFangLiuCunObj.index >= 0) {
            const inputItem = this.diFangLiuCunObj.otherArr[this.diFangLiuCunObj.index]
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
            reject({
              type: 'input'
            })
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
          const numStr = this.fanShuiJieTiData.popData.ratio.toFixed(2)
          this.fanShuiJieTiData.popData.ratio = parseInt(numStr)
          if (this.fanShuiJieTiData.isAdd) {
            this.fanShuiJieTiData.dataArr.push(this.fanShuiJieTiData.popData)
          } else {
            this.fanShuiJieTiData.dataArr.splice(this.fanShuiJieTiData.dataArr.length - 1, 1, this.fanShuiJieTiData.popData)
          }
          this.fanShuiJieTiData.popShow = false
        }).catch(() => {

        })
      },
      // 返税阶梯校验
      fanShuiJieTiCheck() {
        if (this.fanShuiJieTiData.dataArr.length === 0) {
          return Promise.reject({
            type: '请设置返税阶梯'
          })
        }
        return Promise.resolve()
      },
      // 校验数据
      check() {
        const arr = [
          this.checkCurrentPage(),
          this.checkBase3Up(),
          this.diFangLiuCheck(),
          this.fanShuiJieTiCheck()
        ]
        if (this.form.isSupport3w) {
          arr.push(this.checkBase3Down())
        }
        Promise.all(arr).then(() => {
          this.getAddData()
        }).catch((err) => {
          if (err.type) {
            switch (err.type) {
              case 'input':
                this.$message.error('请完成填写');
                break
              default:
                this.$message.error(err.type);
                break
            }
          }
        })
      },
      // 获取添加的数据
      async getAddData() {
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
        submitData.taxLandingTaxDTOList = []
        // 适用行业
        this.form.shiYongHangYe.forEach((name) => {
          let item = {}
          this.shiYongHangYeArr.forEach((obj) => {
            if (obj.text === name) {
              item = obj
            }
          })
          submitData.taxLandingPropertyDTOList.push({
            "property": "industry", // 固定死
            "code": item.value,
            "name": item.text,  // 代表的名称
          })
        })
        // 能否代开
        const isDaiKai = this.form.isDaiKai !== '无'
        submitData.taxLandingPropertyDTOList.push({
          "property": "replace-open", // 固定死
          "code": isDaiKai,
          "name": this.form.isDaiKai,  // 代表的名称
          "memo": isDaiKai ? this.form.daiKaiZiLiao : null
        })
        // 三万以下基本税率
        submitData.taxLandingPropertyDTOList.push({
          "property": "base", // 固定死
          "code": this.form.isSupport3w,
          "name": `是否支持三万以下免征条款`
        })
        // submitData.taxLandingPropertyDTOList.push({
        //   "property": "base", // 固定死
        //   "code": this.form.isSupport3w,
        //   "name": `${ this.form.isSupport3w ? '' : '不' }支持三万以下免征条款`
        // })
        if (this.form.isSupport3w) {
          submitData.taxLandingTaxDTOList = submitData.taxLandingTaxDTOList.concat(this.base3DownDataArr)
        }
        // // 三万元以上基本税率
        // const sanWanYiShangName = this.form.isSupport3w ? "三万以上基本税率" : "基本税率"
        // submitData.taxLandingPropertyDTOList.push({
        //   "property": this.form.isSupport3w ? '30thousand-up' : 'base', // 固定死
        //   "code": true,
        //   "name": sanWanYiShangName
        // })
        submitData.taxLandingTaxDTOList = submitData.taxLandingTaxDTOList.concat(this.base3UpDataArr)
        // 业务配比期望值
        if (this.form.sanWanYiXiaYeWuLiang !== null) {
          submitData.taxLandingPropertyDTOList.push({
            "property": 'business-ratio', // 固定死
            "code": this.form.sanWanYiXiaYeWuLiang,
            "name": '三万以下业务量'
          })
        }
        if (this.form.sanWanYiShangYeWuLiang !== null) {
          submitData.taxLandingPropertyDTOList.push({
            "property": 'business-ratio', // 固定死
            "code": this.form.sanWanYiShangYeWuLiang,
            "name": '三万以上业务量'
          })
        }
        // 地方留存政策
        submitData.taxLandingPropertyDTOList.push({
          "property": 'local-tax', // 固定死
          "code": true,
          "name": '地方留存政策'
        })
        submitData.taxLandingTaxDTOList = submitData.taxLandingTaxDTOList.concat(this.diFangLiuCunObj.dataArr)
        // if (this.diFangLiuCunObj.index >= 0) {
        //   const arr = JSON.parse(JSON.stringify(this.diFangLiuCunObj.otherArr))
        //   arr.splice(this.diFangLiuCunObj.index, 1)
        //   arr.forEach((item) => {
        //     submitData.taxLandingTaxDTOList.push({
        //       taxCategory: "local-tax",
        //       taxCollection: "commom",
        //       taxCode: item.code,
        //       taxRate: 0
        //     })
        //   })
        // } else {
        //   this.diFangLiuCunObj.otherArr.forEach((item) => {
        //     submitData.taxLandingTaxDTOList.push({
        //       taxCategory: "local-tax",
        //       taxCollection: "commom",
        //       taxCode: item.code,
        //       taxRate: 0
        //     })
        //   })
        // }
        // 返税适用周期
        if (this.form.shiYongWeek === '通用周期') {
          submitData.taxLandingPropertyDTOList.push({
            "property": "return-tax", // 固定死
            "code": true, // 按年统计 按月统计 自定义code
            "name": this.form.tongYongWeek,  // 跟上面同步 property
            "memo": this.form.fanShuiShiYongWeekBeiZhu
          })
        } else {
          submitData.taxLandingPropertyDTOList.push({
            "property": "return-tax", // 固定死（看三万以下基本税率勾选情况）
            "code": this.form.zhiDingWeek.getFullYear(),
            "name": "指定周期",
            "memo": this.form.fanShuiShiYongWeekBeiZhu
          })
        }
        // 返税阶梯
        /*计算时是否扣除起税点金额*/
        submitData.taxLandingPropertyDTOList.push({
          "property": "return-tax-setting",
          "code": this.fanShuiJieTiData.shiFouKouChuQiZhengDian,
          "name": "计算时是否扣除起税点金额"
        })
        submitData.taxLandingReturnRuleDTOList = []
        this.fanShuiJieTiData.dataArr.forEach((item) => {
          const data = {
            "returnRate": item.ratio
          }
          data.rule = `${item.type1 === '大于等于' ? '[' : '('}${item.num1},${item.num2}${item.type2 === '小于等于' ? ']' : ')'}`
          submitData.taxLandingReturnRuleDTOList.push(data)
        })

        const taxLandingId = this.$route.query.id
        if (taxLandingId) {
          const id = parseInt(taxLandingId)
          submitData.taxLandingPropertyDTOList.forEach((item) => {
            item.taxLandingId = id
          })
          submitData.taxLandingReturnRuleDTOList.forEach((item) => {
            item.taxLandingId = id
          })
          submitData.taxLandingTaxDTOList.forEach((item) => {
            item.taxLandingId = id
          })
        }

        // 合同
        this.upFile().then((data) => {
          submitData.contractAttachmentIds = data.referId || data.id
          const url = this.$route.query.id ? '/api/salemgt/taxLanding/tax/update' : '/api/salemgt/taxLanding/tax/add'
          post(url, submitData).then(() => {
            this.$message({
              message: '提交成功',
              type: 'success'
            });
            this.$router.push('/main/taxDiscount/list')
          }).catch(() => {
            this.$message.error('提交失败');
          })
        }).catch((e) => {
          this.$message.error('文件上传失败');
        })
      },
      // 获取详情数据
      getDetail() {
        if (this.$route.query.id) {
          get('/api/salemgt/taxLanding/tax/get', {
            taxLandingId: this.$route.query.id,
            type: this.$route.query.state === 'detail' ? 1 : 0
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
        this.form.shiYongHangYe = shiYongHangYeObjArr.map((item) => {
          return item.name
        })
        // 能否代开
        const nengFouDaikaiObjArr = data.taxLandingPropertyDTOList.filter((item) => {
          return item.property === 'replace-open'
        })
        if (nengFouDaikaiObjArr && nengFouDaikaiObjArr.length > 0) {
          const item = nengFouDaikaiObjArr[0]
          this.form.isDaiKai = item.code === 'true' ? '有' : '无'
          this.form.daiKaiZiLiao = item.code === 'true' ? item.memo : null
        }
        // 三万以下基本税率
        const sanWanYiXiaObjArr = data.taxLandingPropertyDTOList.filter((item) => {
          return item.property === 'base'
        })
        if (sanWanYiXiaObjArr && sanWanYiXiaObjArr.length > 0) {
          const item = sanWanYiXiaObjArr[0]
          this.form.isSupport3w = item.code === 'true'
          if (this.form.isSupport3w) {
            this.shuiLvShuXingBiaoArr.forEach((item) => {
              const dom = this.$refs[`BASE_3_DOWN_${item.code}`][0]
              data.taxLandingTaxDTOList.forEach((item) => {
                if (item.taxCollection === dom.taxCollection && item.taxCode === dom.taxCode) {
                  dom.setData(item)
                }
              })
            })
          }
        }
        // 三万元以上
        this.shuiLvShuXingBiaoArr.forEach((item) => {
          const dom = this.$refs[`BASE_3_UP_${item.code}`][0]
          data.taxLandingTaxDTOList.forEach((item) => {
            if (item.taxCollection === dom.taxCollection && item.taxCode === dom.taxCode) {
              dom.setData(item)
            }
          })
        })
        // 业务配比期望值
        const yeWuPeiBiQiWang_3_down_ObjArr = data.taxLandingPropertyDTOList.filter((item) => {
          return item.property === 'business-ratio' && item.name === '三万以下业务量'
        })
        if (yeWuPeiBiQiWang_3_down_ObjArr && yeWuPeiBiQiWang_3_down_ObjArr.length > 0) {
          const item = yeWuPeiBiQiWang_3_down_ObjArr[0]
          this.form.sanWanYiXiaYeWuLiang = item.code
        }
        const yeWuPeiBiQiWang_3_up_ObjArr = data.taxLandingPropertyDTOList.filter((item) => {
          return item.property === 'business-ratio' && item.name === '三万以上业务量'
        })
        if (yeWuPeiBiQiWang_3_up_ObjArr && yeWuPeiBiQiWang_3_up_ObjArr.length > 0) {
          const item = yeWuPeiBiQiWang_3_up_ObjArr[0]
          this.form.sanWanYiShangYeWuLiang = item.code
        }
        // 地方留存政策
        const diFangLiuCunObjArr = data.taxLandingTaxDTOList.filter((item) => {
          return item.taxCollection === 'commom'
        })
        const inputArr = []
        const otherArr = []
        this.shuiLvShuXingBiao.forEach((item) => {
          let state = false
          diFangLiuCunObjArr.forEach((item1) => {
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
        // 返税适用周期
        const fanShuiShiYongZhouQiObjArr = data.taxLandingPropertyDTOList.filter((item) => {
          return item.property === 'return-tax'
        })
        if (fanShuiShiYongZhouQiObjArr && fanShuiShiYongZhouQiObjArr.length > 0) {
          let item = fanShuiShiYongZhouQiObjArr[0]
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
        const fanShuiShiJieTiObjArr = data.taxLandingPropertyDTOList.filter((item) => {
          return item.property === 'return-tax-setting'
        })
        if (fanShuiShiJieTiObjArr && fanShuiShiJieTiObjArr.length > 0) {
          let item = fanShuiShiJieTiObjArr[0]
          this.fanShuiJieTiData.shiFouKouChuQiZhengDian = item.code === "true"
        }
        const taxLandingReturnRuleDTOList = data.taxLandingReturnRuleDTOList
        this.fanShuiJieTiData.dataArr = taxLandingReturnRuleDTOList.map((item, index) => {
          const numsStr = item.rule.substr(1, item.rule.length - 2)
          const numArr = numsStr.split(',')
          return {
            index: index + 1,
            ratio: item.returnRate,
            type1: item.rule[0] === '[' ? '大于等于' : '大于',
            num1: parseInt(numArr[0]),
            num2: parseInt(numArr[1]),
            type2: item.rule[4] === '[' ? '小于等于' : '小于'
          }
        })
        this.contractAttachmentIds = data.contractAttachmentIds
        this.dataDisabled = this.$route.query.state === 'detail'
        this.attachmentModelList = data.attachmentModelList
      }
    },
    mounted() {
      this.getShiYongHangYe()
      this.getShuiLvShuXingBiao().then(() => {
        this.getDetail()
      }).catch(() => {
      })
    }
  }
</script>

<style lang="scss" scoped>

  .tax-discount-add {
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
    .input-section-box {
      list-style: none;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
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

    .di-fang-liu-cun-input-box {
      display: flex;
      flex-wrap: wrap;
    }
  }

</style>

<style lang="scss">
  .tax-discount-add {
    .fan-shui-jie-ti-pop {
      .el-input-group__prepend {
        width: 120px;
      }
      .el-dialog__body {
        padding-bottom: 0;
      }
    }
    .area-select-wrap {
      .area-select {
        height: 40px;
        .area-selected-trigger {
          padding: 0 10px;
        }
      }
    }

    .fan-shui-jie-ti {
      thead {
        tr:nth-last-child(1) {
          height: 0;
          overflow: hidden;
          display: none;
        }
      }
    }
    .zi-yuan-loction-check {
      .area-select {
        border-color: #f56c6c;
        .el-input__inner {
          border: none;
        }
      }
    }
  }

  .el-form-item.is-success .el-input__inner {
    border: 1px solid #e4e7ed;
  }

</style>
