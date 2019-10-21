<template>
  <div class="r_main">
    <el-breadcrumb>
      <el-breadcrumb-item>{{isEdit?'修改':'添加'}}平安账户</el-breadcrumb-item>
    </el-breadcrumb>
    <el-form :model="form" :rules="rules" label-width="200px" ref="form">
      <el-form-item label="账户名" prop="companyName" size="small">
        <el-input class="form_input" v-model="form.companyName"></el-input>
      </el-form-item>
      <el-form-item label="账号" prop="merchId" size="small">
        <el-input class="form_input" v-model="form.merchId"></el-input>
      </el-form-item>
      <el-form-item label="开户行支行" prop="pingan$depositbank$name" size="small">
        <el-input class="form_input" v-model="form.pingan$depositbank$name"></el-input>
      </el-form-item>
      <el-form-item label="联行号" prop="pingan$union$bank$number" size="small">
        <el-input class="form_input" v-model="form.pingan$union$bank$number"></el-input>
      </el-form-item>
      <el-form-item label="外联客户号" prop="merchCustCode" size="small">
        <el-input class="form_input" v-model="form.merchCustCode"></el-input>
      </el-form-item>
      <el-form-item label="备注" prop="memo" size="small">
        <el-input type="textarea" class="form_input" v-model="form.memo"></el-input>
      </el-form-item>
    </el-form>
    <div class="tool">
      <el-button size="small" @click="back">取消</el-button>
      <el-button size="small" type="primary" @click="sure">保存</el-button>
    </div>
  </div>
</template>
<script>
import { post } from '../../store/api'
import {accountChannel} from 'src/api'

export default {
  data() {
    return {
      // form 的字段一定要和后端对一下，如果多了或者少了都不行，因为是动态的处理
      form: {
        thirdpaySystemId: '',
        companyId: '',
        companyName: '',
        merchId: '',
        pingan$depositbank$name: '',
        pingan$union$bank$number: '',
        merchCustCode: '',
        memo: '',
      },
      rules: {
        companyName: [
          {required: true, message: '请输入帐户名', trigger: blur}
        ],
        merchId: [
          {required: true, message: '请输入帐号', trigger: blur}
        ],
        pingan$depositbank$name: [
          {required: true, message: '请输入开户行支行', trigger: blur}
        ]
      }
    }
  },
  created() {
    Object.assign(this.form, this.$route.query)
    // 区分是添加还是修改
    if(this.isEdit) {
      // 获取详情
      this.getAccountChannel()
    }
  },
  computed: {
    isEdit() {
      return this.$route.path.includes('editAccountServer')
    }
  },
  methods: {
    back() {
      this.$router.back()
    },
    getAccountChannel() {
      // 这里的应该是get，但却是用post，真的很奇怪
      post(`${accountChannel.getAccountChannel}?channelId=${this.form.channelId}`).then((data) => {
        // 把key的$变为.
        const form = {}
        Object.keys(data).forEach((key) => {
          const newKey = key.replace(/\./g, '$')
          form[newKey] = data[key]
        })
        Object.assign(this.form, form)
      })
    },
    sure() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 把key的$变为.
          const form = {}
          Object.keys(this.form).forEach((key) => {
            const newKey = key.replace(/\$/g, '.')
            form[newKey] = this.form[key]
          })
          const url = this.isEdit ? accountChannel.editAccountChannel : accountChannel.addAccountChannel
          post(url, form).then((data) => {
            this.$message({
              type: 'success',
              message: '添加成功！',
            })
            this.back()
          })
        }
      })
    },
  },
}
</script>
<style scoped>
.r_main {
  padding: 30px 10px;
  background-color: #fff;
}
.form_input {
  width: 500px;
}
.tool {
  margin: 20px 0;
	padding-left: 200px;
}
</style>
