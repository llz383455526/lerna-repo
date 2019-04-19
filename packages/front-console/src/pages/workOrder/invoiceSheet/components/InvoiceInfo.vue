<template>
    <div>
        <p>开票名称: {{info.name}}</p>
        <p>纳税人识别号: {{info.taxIdcd}}</p>
        <p>公司地址: {{info.addr}}</p>
        <p>电话号码: {{info.phone}}</p>
        <p>开户行: {{info.bankName}}</p>
        <p>银行账号: {{info.bankAccount}}</p>
    </div>
</template>

<script>
export default {
    props: {
        info: {
            type: Object
        }
    }
}
</script>
