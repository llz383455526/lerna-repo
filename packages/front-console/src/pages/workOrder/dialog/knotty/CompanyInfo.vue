<template>
    <div
        v-if="companyInfo.companyName"
        class="companyInfo"
    > 
        <p class="label-title">服务商信息</p>
        <p>名称：{{companyInfo.companyName}}</p>
        <p>开户行：{{companyInfo.depositBank}}</p>
        <p>帐户名：{{companyInfo.accountName}}</p>
        <p>账号：{{companyInfo.accountNo}}</p>
    </div>
</template>

<script>
export default {
    props: ['companyInfo']
}
</script>
<style scoped>

.companyInfo{
    padding-left: 140px
}
</style>



