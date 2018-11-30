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
        <el-form :model="form" :rules="rules" class="form" label-width="120px" size="small" ref="form">
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
                <!-- <el-input class="form_input" v-model="form.chargeBy"></el-input> -->
            </el-form-item>
            <el-form-item label="选择地区" prop="provinceCode">
                <!-- :disabled="dataDisabled" -->
                <!-- <area-select
                    type="all"
                    class="postion-sel"
                    :class="{'zi-yuan-loction-check': !form.ziYuanLoctionCheck}"
                    v-model="form.provinceCode"
                    :level="2"
                    :isLinkage="true"
                    :data="pcaa"/> -->
                <el-select v-model="form.provinceCode" class="in_input" @change="provinceChange">
                    <el-option v-for="e in format(86)" :key="e.value" :value="e.value" :label="e.text"></el-option>
                </el-select>
                <el-select v-model="form.cityCode" class="in_input" @change="cityChange">
                    <el-option v-for="e in format(form.provinceCode)" :key="e.value" :value="e.value" :label="e.text"></el-option>
                </el-select>
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
                provinceCode: [],
                province: '',
                cityCode: '',
                city: '',
                areaCode: '',
                areaName: '',
                chargeBy: '',
                chargeByName: ''
            },
            rules: {
                fullName: [
                    { required: true, message: "请填写名称", trigger: "blur" }
                ],
                name: [
                    { required: true, message: "请填写简称", trigger: "blur" }
                ],
                chargeBy: [
                    { required: true, message: "请选择渠道经理", trigger: "blur" }
                ],
                provinceCode: [
                    { required: true, message: "请选择地区", trigger: "blur" }
                ]
            },
            pcaa,
            chargeByList: [],
            data: ''
        }
    },
    mounted() {
        this.data = JSON.parse(sessionStorage.getItem('agent'))
        sessionStorage.removeItem('agent')
        if(this.data) {
            for(let k in this.data) {
                if(k in this.form) {
                    this.form[k] = this.data[k]
                }
            }
        }
        get('/api/sysmgr-web/user/get-platform-users?platformType=console-admin').then(data => {
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
                    this.format(86).forEach(e => {
                        if(e.value == this.form.provinceCode) {
                            this.form.province = e.text
                        }
                    })
                    this.format(this.form.provinceCode).forEach(e => {
                        if(e.value == this.form.cityCode) {
                            this.form.city = e.text
                        }
                    })
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
