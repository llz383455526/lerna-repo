<template>
    <div class="r_main">
        <div style="margin-bottom:30px;">{{detail.companyName}}-审核信息查看</div>
        <el-form :model="form" size="small" label-width="120px" ref="form">
            <el-form-item label="企业名称">{{detail.companyName}}</el-form-item>
            <el-form-item label="企业负责人">{{detail.chargeByName}}</el-form-item>
            <el-form-item label="企业负责人电话">{{detail.chargePhone}}</el-form-item>
            <el-form-item label="企业负责人邮箱">{{detail.chargeEmail}}</el-form-item>
            <el-form-item label="企业主营业务">{{detail.mainBusiness}}</el-form-item>
            <el-form-item label="企业相关描述">{{detail.remark}}</el-form-item>
            <el-form-item label="补充附件">
                <a class="mr20" v-for="e in detail.attachments" :key="e.id" :href="`/api/sysmgr-web/file/download?downloadCode=${e.downloadCode}`">{{e.displayname}}</a>
            </el-form-item>
            <el-form-item label="状态">{{detail.statusName}}</el-form-item>
            <el-form-item label="拒绝理由">
                <span class="mr20" v-for="e in detail.auditMemoList" :key="e.id">{{e.rejectTypeName}}</span>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="$router.back()">返回</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import { get, post, postWithErrorCallback, formPost } from "../../store/api";
export default {
    data() {
        return {
            form: {},
            detail: {}
        }
    },
    mounted() {
        this.$route.query.id && post(`/api/sysmgr-web/interim-company/detail?id=${this.$route.query.id}`).then(data => {
            this.detail = data
        })
    }
}
</script>
<style scoped>
.r_main {
    padding: 15px;
    background-color: #fff;
}
.form_input {
    width: 400px;
}
.mr20 {
    margin-right: 20px;
}
</style>
