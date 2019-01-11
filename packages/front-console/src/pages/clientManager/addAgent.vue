<template>
    <div class="r_main">
        <el-breadcrumb>
            <el-breadcrumb-item>
                新增代理商
            </el-breadcrumb-item>
        </el-breadcrumb>
        <div class="title">
            基础信息
        </div>
        <el-form :model="form" :rules="rules" class="form" label-width="150px" size="small" ref="form">
            <el-form-item label="代理商名称" prop="fullName">
                <el-input class="form_input" v-model="form.fullName"></el-input>
            </el-form-item>
            <el-form-item label="代理商简称" prop="name">
                <el-input class="form_input" v-model="form.name"></el-input>
            </el-form-item>
            <el-form-item label="渠道经理" prop="chargeBy">
                <el-select class="form_input" v-model="form.chargeBy" filterable>
                    <el-option v-for="e in chargeByList" :key="e.id" :label="e.name" :value="e.id"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item label="地区" prop="areaName">
                <el-input class="form_input" v-model="form.areaName"></el-input>
            </el-form-item> -->
            <el-form-item label="代理商联系人" prop="contactName">
                <el-input class="form_input" v-model="form.contactName"></el-input>
            </el-form-item>
            <el-form-item label="代理商联系人电话" prop="contactPhone">
                <el-input class="form_input" v-model="form.contactPhone"></el-input>
            </el-form-item>
            <el-form-item label="代理商联系人地址" prop="contactAddr">
                <el-input class="form_input" v-model="form.contactAddr"></el-input>
            </el-form-item>
            <div class="title">
              付款信息
            </div>
            <el-form-item label="机构代码" prop="agency">
                <el-input class="form_input" placeholder="请输入机构代码" v-model="form.agency"></el-input>
            </el-form-item>
            <el-form-item label="单位地址" prop="address">
                <el-input class="form_input" placeholder="请输入代理商单位地址" v-model="form.address"></el-input>
            </el-form-item>
            <el-form-item label="代理商电话" prop="telephone">
                <el-input class="form_input" placeholder="请输入代理商公司电话" v-model="form.telephone"></el-input>
            </el-form-item>
            <el-form-item label="开户名称" prop="accountName">
                <el-input class="form_input" placeholder="请输入代理商开户名称" v-model="form.accountName"></el-input>
            </el-form-item>
            <el-form-item label="开户银行" prop="depositBank">
                <el-input class="form_input" placeholder="请输入代理商开户银行" v-model="form.depositBank"></el-input>
            </el-form-item>
            <el-form-item label="银行账号" prop="accountNo">
                <el-input class="form_input" placeholder="请输入代理商银行账号" v-model="form.accountNo"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button @click="$router.back()">取消</el-button>
                <el-button type="primary" @click="submit">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback } from "../../store/api";
import {pcaa, pca} from 'area-data'
export default {
    data() {
        return {
            form: {
                fullName: '',
                name: '',
                // areaName: '',
                contactName: '',
                contactPhone: '',
                contactAddr: '',
                chargeBy: '',
                chargeByName: '',
                agency: '',
                address: '',
                telephone: '',
                accountName: '',
                depositBank: '',
                accountNo: ''
            },
            rules: {
                fullName: [
                    { required: true, message: "请填写名称", trigger: "blur" }
                ],
                name: [
                    { required: true, message: "请填写简称", trigger: "blur" }
                ],
                contactName: [
                  { required: true, message: "请填写代理商联系人", trigger: "blur" }
                ],
                contactPhone: [
                  { required: true, message: "请填写代理商联系人电话", trigger: "blur" }
                ],
                contactAddr: [
                  { required: true, message: "请填写代理商联系人地址", trigger: "blur" }
                ],
                chargeBy: [
                    { required: true, message: "请选择渠道经理", trigger: "blur" }
                ],
                agency: [
                  { required: true, message: "请填写机构代码", trigger: "blur" }
                ],
                address: [
                  { required: true, message: "请填写单位地址", trigger: "blur" }
                ],
                telephone: [
                  { required: true, message: "请填写代理商电话", trigger: "blur" },
                  { pattern: /^[\d\-]+$/, message: '请正确输入电话号码'}
                ],
                accountName: [
                  { required: true, message: "请填写开户名称", trigger: "blur" }
                ],
                depositBank: [
                  { required: true, message: "请填写开户银行", trigger: "blur" }
                ],
                accountNo: [
                  { required: true, message: "请填写银行账号", trigger: "blur" }
                ]
            },
            pcaa,
            chargeByList: [],
            data: ''
        }
    },
    mounted() {
        this.$route.query.companyId && get('/api/contract-web/agent-company/detail', {
          companyId: this.$route.query.companyId
        }).then(data => {
          this.data = data
          this.data.id = this.$route.query.companyId
          for(let k in this.data) {
            if(k in this.form) {
                this.form[k] = this.data[k]
            }
          }
        })
        // this.data = JSON.parse(sessionStorage.getItem('agent'))
        // sessionStorage.removeItem('agent')
        // if(this.data) {
        //   console.log('contactPhone' in this.data)
        //     for(let k in this.data) {
        //       console.log(`${k}: ${k in this.form}`)
        //         if(k in this.form) {
        //             this.form[k] = this.data[k]
        //         }
        //     }
        // }
        get('/api/sysmgr-web/user/get-group-users?relationKey=ChannelUserRelation').then(data => {
            this.chargeByList = data
        })
    },
    methods: {
        format(a) {
            if(!a) {
                return
            }
            var arr = []
            for(let k in pcaa[a]) {
                arr.push({
                    value: k,
                    text: pcaa[a][k]
                })
            }
            return arr
        },
        provinceChange() {
            var arr = this.format(this.form.provinceCode)
            this.form.cityCode = ''
            if(arr.length) {
                this.form.cityCode = arr[0].value
            }
        },
        cityChange() {
            this.format(this.form.provinceCode).forEach(e => {
                if(e.value == this.form.cityCode) {
                    this.form.city = e.text
                }
            })
        },
        submit() {
            this.$refs['form'].validate(v => {
                if(v) {
                    this.chargeByList.forEach(e => {
                        if(e.id == this.form.chargeBy) {
                            this.form.chargeByName = e.name
                        }
                    })
                    this.data && (this.form.companyId = this.data.id)
                    post(`/api/contract-web/agent-company/${this.data ? 'edit' : 'add'}`, this.form).then(data => {
                        this.$message({
                            type: 'success',
                            message: `${ this.data ? '修改' : '添加' }成功！`
                        })
                        this.$router.back()
                    })
                }
            })
        }
    }
}
</script>
<style scoped>
.r_main {
  padding: 30px 10px 50px;
  background-color: #fff;
}
.form {
    margin-top: 20px;
}
.title {
    display: inline-block;
    margin-top: 30px;
    font-weight: 700;
}
.form_input {
    width: 450px;
}
.in_input {
    width: 223px;
}
.postion-sel {
    line-height: 100%;
}
</style>
